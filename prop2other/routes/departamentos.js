const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dbConfig = require('../dbConfig');

router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT * FROM Departamentos');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.end();
    }
});

router.post('/', async (req, res) => {
    const { nombre, telefono, fax } = req.body;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.query('INSERT INTO Departamentos (Nombre, Telefono, Fax) VALUES (?, ?, ?)', [nombre, telefono, fax]);
        res.status(201).json({ message: 'Departamento creado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.end();
    }
});

router.put('/:id', async (req, res) => {
    const { nombre, telefono, fax } = req.body;
    const { id } = req.params;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.query('UPDATE Departamentos SET Nombre = ?, Telefono = ?, Fax = ? WHERE IDDpto = ?', [nombre, telefono, fax, id]);
        res.json({ message: 'Departamento actualizado' });
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
        await connection.query('DELETE FROM Departamentos WHERE IDDpto = ?', [id]);
        res.json({ message: 'Departamento eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.end();
    }
});

module.exports = router;
