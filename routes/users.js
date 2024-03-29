var express = require('express');
var router = express.Router();
var db = require('../db/DBConnection');
var authenticateToken = require('../auth/Authentication');
const jwt = require('jsonwebtoken');
const dotenv=require('dotenv');


dotenv.config();


router.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else if (result.length > 0) {
            const user = { username: username };
            const accessToken = jwt.sign(user, process.env.TOKEN_KEY,{expiresIn: '1h'});
            res.json({ accessToken: accessToken });
        } else {
            res.status(401).json({ error: 'Invalid username or password' });
        }
    });
});


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

router.get('/data', authenticateToken, (req, res) => {
    const decodedToken = jwt.decode(req.get('authorization').slice(7));
    const username = decodedToken.username;

    db.query('SELECT * FROM users WHERE username = ?', [username], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else if (result.length > 0) {
            // Send user details as response
            const user = result[0]; // Assuming username is unique
            res.json({ user: user });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    });
});

router.delete('/delete/:id', authenticateToken, (req, res) => {
    const userName = req.params.id;
    const decodedToken = jwt.decode(req.get('authorization').slice(7));
    const username = decodedToken.username;

    db.query('SELECT * FROM users WHERE username = ? ', [userName], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else if (result.length === 0) {
            res.status(403).json({ error: 'You are not authorized to delete this user' });
        } else {

            db.query('DELETE FROM users WHERE username = ?', [userName], (err, result) => { // Change this to delete by ID, not username
                if (err) {
                    res.status(500).json({ error: 'Internal server error' });
                } else if (result.affectedRows === 0) {
                    res.status(404).json({ error: 'User not found' });
                } else {
                    res.status(200).json({ message: 'User deleted successfully' });
                }
            });
        }
    });
});

router.put('/update/:id', authenticateToken, (req, res) => {
    const userName = req.params.id;
    const { username, password } = req.body;

    db.query('UPDATE users SET username = ?, password = ? WHERE username = ?', [username, password, userName], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ error: 'User not found' });
        } else {
            res.status(200).json({ message: 'User updated successfully' });
        }
    });
});

router.get('/getAll', authenticateToken, (req, res) => {
    db.query('SELECT * FROM users', (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.status(200).json({ users: result });
        }
    });
});



module.exports = router;
