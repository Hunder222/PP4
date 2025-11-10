const express = require("express");

const mysql = require("mysql2");

const cors = require("cors");

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json());

//Host, user, password database
const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
});

app.get('/', (req, res) => {
    connection.query('SELECT `name` FROM Chinook', (error, results) => {
        res.send(results);
    });
});
pp.get('/', (req, res) => {
    connection.query('SELECT `name` FROM Chinook', (error, results) => {
        res.send(results);d
    });
});