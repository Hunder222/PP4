const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = 3005;

console.log("Hejjjj")

app.use(cors());
app.use(express.json())

//Host, user, password database
const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: 'Chinook'
});

// start #####################__Elliot__##############################



// end ##################################################################



// start #####################__Jazmin__##############################

// ----------------- TOP 10 SONGS -----------------
app.get("/top10songs", (req, res) => {
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
app.get("/top10genres", (req, res) => {
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
app.get("/top10artists", (req, res) => {
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
app.get("/top10countries", (req, res) => {
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





// end ##################################################################




// start #####################__Dont touch!__##############################

app.listen(port, () => {
    console.log(`Application is now running on port ${port}`);
});

// end ##################################################################

function test() {
    connection.query('SELECT `Name` FROM Track', (error, results) => {
        console.log(results);        
    });
}
test()

