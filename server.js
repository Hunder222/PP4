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

// start #####################__Elliot__##############################


app.get('/api/top', (req, res) => {
        
    connection.query(`
        SELECT Name, Milliseconds
        FROM track
        ORDER BY Milliseconds DESC
        LIMIT 10
        `, (error, results) => {

        console.log("query results:");
        console.log(results);

        const chartLabels = [];
        const chartData = [];

        for (const result in results) {
            let resultLabel = results[result].Name;
            let resultData = results[result].Milliseconds;

            chartLabels.push(resultLabel);
            chartData.push(resultData)
        }
        console.log(chartLabels);
        console.log(chartData);

        const dataToReturn = {
            "labels": chartLabels,
            "datas": chartData
        }

        res.send(dataToReturn)
    });
})



app.get('/api/genres', (req, res) => {
        
    connection.query(`
        SELECT Name, Milliseconds
        FROM track
        ORDER BY Milliseconds ASC
        LIMIT 10
        `, (error, results) => {

        console.log("query results:");
        console.log(results);

        const chartLabels = [];
        const chartData = [];

        for (const result in results) {
            let resultLabel = results[result].Name;
            let resultData = results[result].Milliseconds;

            chartLabels.push(resultLabel);
            chartData.push(resultData)
        }
        console.log(chartLabels);
        console.log(chartData);

        const dataToReturn = {
            "labels": chartLabels,
            "datas": chartData
        }

        res.send(dataToReturn)
    });
})



app.get('/api/artists', (req, res) => {
        
    connection.query(`
        SELECT Name, UnitPrice
        FROM track
        ORDER BY UnitPrice DESC
        LIMIT 10
        `, (error, results) => {

        console.log("query results:");
        console.log(results);

        const chartLabels = [];
        const chartData = [];

        for (const result in results) {
            let resultLabel = results[result].Name;
            let resultData = results[result].UnitPrice;

            chartLabels.push(resultLabel);
            chartData.push(resultData)
        }
        console.log(chartLabels);
        console.log(chartData);

        const dataToReturn = {
            "labels": chartLabels,
            "datas": chartData
        }

        res.send(dataToReturn)
    });
})




app.get('/api/countries', (req, res) => {
        
    connection.query(`
        SELECT Name, UnitPrice
        FROM track
        ORDER BY UnitPrice ASC
        LIMIT 10
        `, (error, results) => {

        console.log("query results:");
        console.log(results);

        const chartLabels = [];
        const chartData = [];

        for (const result in results) {
            let resultLabel = results[result].Name;
            let resultData = results[result].UnitPrice;

            chartLabels.push(resultLabel);
            chartData.push(resultData)
        }
        console.log(chartLabels);
        console.log(chartData);

        const dataToReturn = {
            "labels": chartLabels,
            "datas": chartData
        }

        res.send(dataToReturn)
    });
})




function loadTopSection() {
    
}

loadTopSection()





// end ###############################################################
// start #####################__Jazmin__##############################






// end ###############################################################





app.listen(port, () => {
    console.log(`Application is now running on port ${port}`);
});


