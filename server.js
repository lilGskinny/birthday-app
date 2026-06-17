const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
const PORT = 3000;



app.use(express.json());



app.use(express.static(
    path.join(__dirname, "public")
));



const db = new sqlite3.Database("database.db");



db.run(`
    CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        birthday TEXT NOT NULL
    )
`);




app.get("/employees", (req, res) => {

    db.all(
        "SELECT * FROM employees",
        [],
        (error, rows) => {

            if (error) {
                return res
                    .status(500)
                    .json(error);
            }

            res.json(rows);
        }
    );

});




app.post("/employees", (req, res) => {

    const { name, birthday } = req.body;


    db.run(
        `
        INSERT INTO employees(name, birthday)
        VALUES(?, ?)
        `,
        [name, birthday],

        function(error) {

            if(error) {
                return res
                    .status(500)
                    .json(error);
            }


            res.json({
                id: this.lastID,
                name,
                birthday
            });

        }
    );

});


app.delete("/employees/:id", (req, res) => {

    const id = req.params.id;

    db.run(
        "DELETE FROM employees WHERE id = ?",
        [id],
        function(err) {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Видалено успішно"
            });

        }
    );

});


app.put("/employees/:id", (req, res) => {

    const id = req.params.id;

    const { name, birthday } = req.body;


    db.run(
        `
        UPDATE employees
        SET name = ?, birthday = ?
        WHERE id = ?
        `,
        [
            name,
            birthday,
            id
        ],

        function(err) {

            if (err) {
                return res.status(500).json(err);
            }


            res.json({
                message: "Оновлено успішно"
            });

        }
    );

});



app.get("/employees/month/current", (req, res) => {

    const currentMonth =
        String(new Date().getMonth() + 1)
        .padStart(2, "0");


    db.all(
        `
        SELECT *
        FROM employees
        WHERE strftime('%m', birthday) = ?
        ORDER BY strftime('%d', birthday)
        `,
        [currentMonth],

        (error, rows) => {

            if(error) {
                return res
                    .status(500)
                    .json(error);
            }

            res.json(rows);
        }
    );

});



app.listen(PORT, () => {

    console.log(`
Сервер працює:
http://localhost:${PORT}
`);

});