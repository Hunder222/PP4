// _START_ #####################__Elliot__##############################

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const path = require('path');

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json())
// subfolder with files it loads on localhost:3000, including html, its styles and client side JS
app.use(express.static(path.join(__dirname, 'public')));

//Host, user, password database
const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: 'chinook',
});



function getChartData(dataFromQuery) {
    const chartLabels = [];
    const chartData = [];

    for (const result in dataFromQuery) {
        let resultLabel = dataFromQuery[result].Name;
        let resultData = dataFromQuery[result].Value;

        chartLabels.push(resultLabel);
        chartData.push(resultData)
    }
    console.log(chartLabels);
    console.log(chartData);

    const dataToReturn = {
        "queriedLabels": chartLabels,
        "queriedData": chartData
    }

    return dataToReturn
}




app.get('/api/top', (req, res) => {
    connection.query(`
        SELECT Name, Milliseconds AS Value
        FROM track
        ORDER BY Milliseconds DESC
        LIMIT 10
        `, (error, results) => {

        console.log("query results:");
        console.log(results);

        dataToReturn = getChartData(results)

        res.send(dataToReturn)
    });
})

app.get('/api/genres', (req, res) => {
    connection.query(`
        SELECT Name, Milliseconds AS Value
        FROM track
        ORDER BY Milliseconds ASC
        LIMIT 10
        `, (error, results) => {

        console.log("query results:");
        console.log(results);

        dataToReturn = getChartData(results)

        res.send(dataToReturn)
    });
})

app.get('/api/artists', (req, res) => {

    connection.query(`
        SELECT Name, UnitPrice AS Value
        FROM track
        ORDER BY UnitPrice DESC
        LIMIT 10
        `, (error, results) => {

        console.log("query results:");
        console.log(results);

        dataToReturn = getChartData(results)

        res.send(dataToReturn)
    });
})

app.get('/api/countries', (req, res) => {

    connection.query(`
        SELECT Name, UnitPrice AS Value
        FROM track
        ORDER BY UnitPrice ASC
        LIMIT 10
        `, (error, results) => {

        console.log("query results:");
        console.log(results);

        dataToReturn = getChartData(results)

        res.send(dataToReturn)
    });
})

app.listen(port, () => {
    console.log(`Application is now running on port ${port}`);
});


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
app.get("/api/top10countries", (req, res) => {
    const query = `
        SELECT c.Country, COUNT(il.InvoiceLineId) AS total_purchases
        FROM InvoiceLine il
        JOIN Invoice i ON il.InvoiceId = i.InvoiceId
        JOIN Customer c ON i.CustomerId = c.CustomerId
        JOIN Track t ON il.TrackId = t.TrackId
        WHERE t.MediaTypeId IN (1, 2, 3) -- only songs
        GROUP BY c.Country
        ORDER BY total_purchases DESC
        LIMIT 10;
    `;
    connection.query(query, (error, results) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json(results);
    });
});


// __END__ ###############################################################