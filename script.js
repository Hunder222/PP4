const express = require("express");

const mysql = require("mysql2");

const cors = require("cors");

const app = express();
const port = 3005;

app.use(cors());
app.use(express.json())

//Host, user, password database
const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: 'chinook',
});

// start #####################__Elliot__##############################

app.listen(port, () => {
    console.log(`Application is now running on port ${port}`);
});

// end ##################################################################



// start #####################__Jazmin__##############################

app.listen(port, () => {
    console.log(`Application is now running on port ${port}`);
});




// end ##################################################################




// start #####################__Dont touch!__##############################

app.listen(port, () => {
    console.log(`Application is now running on port ${port}`);
});

// end ##################################################################

function test() {
    connection.query('SELECT `Name` FROM track', (error, results) => {
        console.log(results);        
    });
}
test()

