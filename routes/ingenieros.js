const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dbConfig = require('../dbConfig');

router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT * FROM Ingenieros');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.end();
    }
});

router.post('/', async (req, res) => {
    const { especialidad, cargo } = req.body;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.query('INSERT INTO Ingenieros (Especialidad, Cargo) VALUES (?, ?)', [especialidad, cargo]);
        res.status(201).json({ message: 'Ingeniero creado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.end();
    }
});

router.put('/:id', async (req, res) => {
    const { especialidad, cargo } = req.body;
    const { id } = req.params;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.query('UPDATE Ingenieros SET Especialidad = ?, Cargo = ? WHERE IDIng = ?', [especialidad, cargo, id]);
        res.json({ message: 'Ingeniero actualizado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.end();
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.query('DELETE FROM Ingenieros WHERE IDIng = ?', [id]);
        res.json({ message: 'Ingeniero eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.end();
    }
});

module.exports = router;
