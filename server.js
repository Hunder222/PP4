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
app.use(express.static(path.join(__dirname)));

//Host, user, password database setup
const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: 'Chinook',
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
// save the latest results from each of the sql databaase queries, to a local js obj database, that client.js can require when it cant fetch to the nodeJS/mysql2 server.
// async function because the fetchimg function should not wait for this to finnish before handing data over to the client.
async function updateLocalDB(chartType, newData) {

    const pathToLocalDB = path.join(__dirname, 'localDB.js');

    // load old database as js obj
    delete require.cache[require.resolve(pathToLocalDB)];
    const databaseObj = require(pathToLocalDB);

    // update database obj
    databaseObj[chartType].labels = newData.queriedLabels;
    databaseObj[chartType].data = newData.queriedData;

    // add the required code to make it readable as an .js file with an obj to require next time 
    // null (no replace ¯\_(ツ)_/¯ ), 4 (4 spaces = 1 tab) 
    const newDatabase = `const localDatabase = ${JSON.stringify(databaseObj, null, 4)};
        if (typeof module !== 'undefined') module.exports = localDatabase;`;

    await fs.writeFile(pathToLocalDB, newDatabase);
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


// ___________________ Endpoint queries ___________________
// all queries returns 'label' and 'data'. used for chartJS


//// fixed version of endpoint '/api/topSongsOLD' (Old version didnt take songs that have more trackIDs)
app.get("/api/topSongs", (req, res) => {
    // CONCAT combines 2 varchar datatypes into 1 output
    const query = `
    SELECT 
        CONCAT(t.Name, ' (by ', a.Name,')') AS label, 
        COUNT(il.InvoiceLineId) AS data
    FROM invoiceline il
    INNER JOIN track t USING (TrackID)
    INNER JOIN genre g USING (GenreID)
    INNER JOIN album al USING (AlbumId)
    INNER JOIN artist a USING (ArtistID)
    WHERE 
        g.Name NOT IN ('TV Shows','Drama','Comedy','Science Fiction','Action & Adventure','Documentary')
    GROUP BY
        t.Name, a.Name
    ORDER BY data DESC
    LIMIT 10;
    `;
    connection.query(query, (error, results) => {
        if (error) return res.status(500).json({ error });

        // converts the query output into a object with 2 arrays, label and data, ready for chartJS 
        dataToReturn = getChartData(results)
        
        res.send(dataToReturn)

        // Sends the new data in queue to update the local database (for github pages)
        queueDbUpdate('topSongs', dataToReturn);
    });
});


// __END__ #####################__Elliot__##############################
// _START_ #####################__Jazmin__##############################


//// not right output, doesnt take into account that many songs have more trackIDs, even when same songname and artist.
// ----------------- TOP 10 SONGS -----------------
app.get("/api/topSongsOLD", (req, res) => {
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
        res.send(results)
    });
});


// ----------------- TOP 10 GENRES -----------------
app.get("/api/topGenres", (req, res) => {
    const query = `
        SELECT g.Name AS label, COUNT(t.TrackId) AS data
        FROM Track t
        JOIN Genre g ON t.GenreId = g.GenreId
        GROUP BY g.Name
        ORDER BY data DESC
        LIMIT 10;
    `;

    connection.query(query, (error, results) => {
        if (error) return res.status(500).json({ error: error.message });

        dataToReturn = getChartData(results)
        res.send(dataToReturn)

        queueDbUpdate('topGenres', dataToReturn);
    });
});


// ----------------- TOP 10 ARTISTS -----------------
app.get("/api/topArtists", (req, res) => {
    const query = `
        SELECT a.Name AS label, COUNT(t.TrackId) AS data
        FROM Track t
        JOIN Album al ON t.AlbumId = al.AlbumId
        JOIN Artist a ON al.ArtistId = a.ArtistId
        GROUP BY a.Name
        ORDER BY data DESC
        LIMIT 10;
    `;
    connection.query(query, (error, results) => {
        if (error) return res.status(500).json({ error: error.message });

        dataToReturn = getChartData(results)
        res.send(dataToReturn)

        queueDbUpdate('topArtists', dataToReturn);
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




// __END__ #####################__Jazmin__##############################
// _START_ #####################__Elliot__##############################

app.listen(port, () => {
    console.log(`Application is now running on port ${port}`);
});

// __END__ #####################__Elliot__##############################
