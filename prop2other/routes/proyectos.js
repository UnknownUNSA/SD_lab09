const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dbConfig = require('../dbConfig');

router.get('/', async (req, res) => {
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.query('SELECT * FROM Proyectos');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.end();
    }
});

router.post('/', async (req, res) => {
    const { nombre, fec_inicio, fec_termino, iddpto, iding } = req.body;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.beginTransaction();

        // Insertar proyecto
        const [resultProyecto] = await connection.query(
            'INSERT INTO Proyectos (Nombre, Fec_Inicio, Fec_Termino, IDDpto) VALUES (?, ?, ?, ?)',
            [nombre, fec_inicio, fec_termino, iddpto]
        );

        // Simulación de error para demostrar rollback
        if (nombre === "ErrorSimulado") {
            throw new Error("Simulación de error para rollback");
        }

        // Obtener el ID del proyecto insertado
        const proyectoID = resultProyecto.insertId;

        // Insertar en la tabla Proyectos_Ingenieros
        await connection.query(
            'INSERT INTO Proyectos_Ingenieros (IDProy, IDIng) VALUES (?, ?)',
            [proyectoID, iding]
        );

        await connection.commit();
        res.status(201).json({ message: 'Proyecto creado' });
    } catch (err) {
        if (connection) {
            await connection.rollback();
        }
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.end();
    }
});

router.put('/:id', async (req, res) => {
    const { nombre, fec_inicio, fec_termino, iddpto } = req.body;
    const { id } = req.params;
    let connection;
    try {
        connection = await mysql.createConnection(dbConfig);
        await connection.query('UPDATE Proyectos SET Nombre = ?, Fec_Inicio = ?, Fec_Termino = ?, IDDpto = ? WHERE IDProy = ?', [nombre, fec_inicio, fec_termino, iddpto, id]);
        res.json({ message: 'Proyecto actualizado' });
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
        await connection.query('DELETE FROM Proyectos WHERE IDProy = ?', [id]);
        res.json({ message: 'Proyecto eliminado' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    } finally {
        if (connection) connection.end();
    }
});

module.exports = router;
