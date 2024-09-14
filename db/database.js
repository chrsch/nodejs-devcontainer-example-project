const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'database.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS customers (
            cid INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS vehicles (
            vid INTEGER PRIMARY KEY AUTOINCREMENT,
            make TEXT,
            model TEXT,
            customerId INTEGER,
            FOREIGN KEY (customerId) REFERENCES customers (cid)
        )
    `);
});

module.exports = db;
