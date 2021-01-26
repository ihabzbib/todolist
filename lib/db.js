const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('./res/db.sqlite3', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to db.sqlite3');
  });

exports.db = db;
exports.close = db.close;