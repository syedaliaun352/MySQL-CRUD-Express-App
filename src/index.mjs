import express from 'express';
import mysql from 'mysql2';

const app = express();
const port = process.env.PORT || 3000;
const db = mysql.createConnection({
    host: '51.112.70.161',
    user: 'api_user',
    password: "api1992",
    database: "api_db"
});

db.connect(err => {
    if (err) {
        console.error("Error connecting to database:", err);
    } else {
        console.log("Connected to database");
    }
});

app.get("/", (req, res) => {
    res.send("API is Running");
});

app.get("/api/users", (req, res) => {
    const sql = 'SELECT * FROM users';
    db.query(sql, (err, results) => {
        if (err) {
            return res.sendStatus(500).send(err);
        }
        res.send(results);
    });
});

app.listen(port, () => {
    console.log(`Listening on port: ${port}`);
});
