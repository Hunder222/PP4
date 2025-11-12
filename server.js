// the following allocates space, freedom to write without merging issues:
// _START_ #####################__Elliot__##############################

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const path = require('path');
const fs = require('fs').promises; // promises for await and async function
let updateQueue = Promise.resolve();

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json())
// subfolder with files it loads on localhost:3000, including html, its styles and client side JS
app.use(express.static(path.join(__dirname, 'public')));

//Host, user, password database setup
const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: 'chinook',
});


// this function parses/reformats the query result, into a json with 2 arrays that ready to be inserted to chartJS.
// returns json with arrays: queriedLabels[] and queriedData[].
function getChartData(dataFromQuery) {
    const chartLabels = [];
    const chartData = [];    

    for (const result in dataFromQuery) {
        let resultLabel = dataFromQuery[result].label;
        let resultData = dataFromQuery[result].data;

        chartLabels.push(resultLabel);
        chartData.push(resultData)
    }

    const dataToReturn = {
        "queriedLabels": chartLabels,
        "queriedData": chartData
    }
    
    return dataToReturn
}


// this function solves the github pages hosted = no server or database issue.
// save the latest results from each of the sql database queries, to a local json database, that client.js can use when it cant fetch to the nodeJS/mysql2 server.
// async function because the fetchimg function should not wait for this to finnish before handing data over to the client.
async function updateLocalDB(chartType, newData) {

    const pathToPublic = path.join(__dirname, 'public')

    const oldDbData = await fs.readFile(pathToPublic+'/localDB.json')
    const databaseJSON = JSON.parse(oldDbData)
    
    databaseJSON[chartType].labels = newData.queriedLabels
    databaseJSON[chartType].data = newData.queriedData

    const newDatabase = JSON.stringify(databaseJSON, null, 4) // null (no replace ¯\_(ツ)_/¯ ), 4 (4 spaces = 1 tab) 

    await fs.writeFile(pathToPublic+'/localDB.json', newDatabase)
}


// this function solves an issue, where spamming the buttons that sends fetch requests, could corrupt the databse json.
// a queue that makes sure the previous database read/write to .json is finnished, before a new fetch acesses it.
function queueDbUpdate(chartType, newData) {
    updateQueue = updateQueue.then(async () => {
        await updateLocalDB(chartType, newData);
    }).catch(err => {
        console.error("Queue Error:", err);
    });
}


// __________ Endpoint queries __________
// all queries returns 'label' and 'data'. used for chartJS

app.get('/api/topGenres', (req, res) => {
    connection.query(`
        SELECT Name AS label, Milliseconds AS data
        FROM track
        ORDER BY Milliseconds ASC
        LIMIT 10
        `, (error, results) => {

        dataToReturn = getChartData(results)

        res.send(dataToReturn)

        queueDbUpdate('topGenres', dataToReturn);
    });
})


app.get('/api/topArtists', (req, res) => {

    connection.query(`
        SELECT Name AS label, UnitPrice AS data
        FROM track
        ORDER BY UnitPrice DESC
        LIMIT 10
        `, (error, results) => {

        dataToReturn = getChartData(results)
        res.send(dataToReturn)

        queueDbUpdate('topArtists', dataToReturn);
    });
})


// __END__ #####################__Elliot__##############################
// _START_ #####################__Jazmin__##############################

// ----------------- TOP 10 SONGS -----------------
app.get("/api/top10songs", (req, res) => {
    const query = `
        SELECT Name AS song_name, Milliseconds, Bytes, UnitPrice
        FROM Track
        WHERE MediaTypeId IN (1, 2, 3) -- excludes non-music (like TV or video)
        ORDER BY UnitPrice DESC
        LIMIT 10;
    `;
    connection.query(query, (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json(results);
    });
});


// ----------------- TOP 10 GENRES -----------------
app.get("/api/top10genres", (req, res) => {
    const query = `
        SELECT g.Name AS genre_name, COUNT(t.TrackId) AS total_songs
        FROM Track t
        JOIN Genre g ON t.GenreId = g.GenreId
        GROUP BY g.Name
        ORDER BY total_songs DESC
        LIMIT 10;
    `;
    connection.query(query, (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json(results);
    });
});


// ----------------- TOP 10 ARTISTS -----------------
app.get("/api/top10artists", (req, res) => {
    const query = `
        SELECT a.Name AS artist_name, COUNT(t.TrackId) AS total_songs
        FROM Track t
        JOIN Album al ON t.AlbumId = al.AlbumId
        JOIN Artist a ON al.ArtistId = a.ArtistId
        GROUP BY a.Name
        ORDER BY total_songs DESC
        LIMIT 10;
    `;
    connection.query(query, (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json(results);
    });
});


// ----------------- TOP 10 COUNTRIES (most purchased songs) -----------------
app.get("/api/topCountries", (req, res) => {
    const query = `
        SELECT c.Country AS label, COUNT(il.InvoiceLineId) AS data
        FROM InvoiceLine il
        JOIN Invoice i ON il.InvoiceId = i.InvoiceId
        JOIN Customer c ON i.CustomerId = c.CustomerId
        JOIN Track t ON il.TrackId = t.TrackId
        WHERE t.MediaTypeId IN (1, 2, 3) -- only songs
        GROUP BY c.Country
        ORDER BY data DESC
        LIMIT 10;
    `;
    connection.query(query, (error, results) => {
        if (error) return res.status(500).json({ error: error.message });

        dataToReturn = getChartData(results)
        res.send(dataToReturn)

        queueDbUpdate('topCountries', dataToReturn);
    });
});


app.get("/api/topSongs", (req, res) => {
    const query = `
    SELECT 
      t.Name AS label,
      ar.Name AS Artist,
      g.Name AS Genre,
      SUM(il.Quantity) AS data
    FROM invoiceline il
    JOIN track t   ON il.TrackId = t.TrackId
    JOIN album al  ON t.AlbumId = al.AlbumId
    JOIN artist ar ON al.ArtistId = ar.ArtistId
    JOIN genre g   ON t.GenreId = g.GenreId
    WHERE g.Name NOT IN ('TV Shows','Drama','Comedy','Science Fiction','Action & Adventure','Documentary')
      AND t.MediaTypeId IN (SELECT MediaTypeId FROM mediatype WHERE Name LIKE '%audio%')
    GROUP BY t.TrackId
    ORDER BY data DESC
    LIMIT 10;
  `;


    connection.query(query, (error, results) => {
        if (error) return res.status(500).json({ error });

        dataToReturn = getChartData(results)
        res.send(dataToReturn)

        queueDbUpdate('topSongs', dataToReturn);
    });
});


// __END__ #####################__Jazmin__##############################
// _START_ #####################__Elliot__##############################

app.listen(port, () => {
    console.log(`Application is now running on port ${port}`);
});

// __END__ #####################__Elliot__##############################
