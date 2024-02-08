var express = require('express');
var router = express.Router();
var db = require('../db/DBConnection');

router.post('/register', (req, res) => {
    const { username, password } = req.body;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else if (result.length > 0) {
            res.status(400).json({ error: 'Username already exists' });
        } else {
            db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (err, result) => {
                if (err) {
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.status(201).json({ message: 'User registered successfully' });
                }
            });
        }
    });
});

module.exports = router;
