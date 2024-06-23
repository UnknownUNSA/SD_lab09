const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const dbConfig = {
    host: 'localhost',
    user: 'root',
    //password: 'tu_contraseña',
    database: 'emp2'
};

router.post('/transaction', async (req, res) => {
    const { departamento, proyecto, ingeniero } = req.body;

    let connection;

    try {
        connection = await mysql.createConnection(dbConfig);

        await connection.beginTransaction();

        // Insertar departamento
        const [resultDepartamento] = await connection.query(
            'INSERT INTO Departamentos (Nombre, Telefono, Fax) VALUES (?, ?, ?)',
            [departamento.nombre, departamento.telefono, departamento.fax]
        );
        
        // Obtener el ID del departamento insertado
        const departamentoID = resultDepartamento.insertId;

        // Insertar proyecto usando el ID del departamento insertado
        const [resultProyecto] = await connection.query(
            'INSERT INTO Proyectos (Nombre, Fec_Inicio, Fec_Termino, IDDpto) VALUES (?, ?, ?, ?)',
            [proyecto.nombre, proyecto.fec_inicio, proyecto.fec_termino, departamentoID]
        );
        
        // Obtener el ID del proyecto insertado
        const proyectoID = resultProyecto.insertId;

        // Insertar ingeniero
        const [resultIngeniero] = await connection.query(
            'INSERT INTO Ingenieros (Especialidad, Cargo) VALUES (?, ?)',
            [ingeniero.especialidad, ingeniero.cargo]
        );
        
        // Obtener el ID del ingeniero insertado
        const ingenieroID = resultIngeniero.insertId;

        // Insertar en la tabla Proyectos_Ingenieros
        await connection.query(
            'INSERT INTO Proyectos_Ingenieros (IDProy, IDIng) VALUES (?, ?)',
            [proyectoID, ingenieroID]
        );

        // Confirmar la transacción
        await connection.commit();
        res.status(200).send('Transacción confirmada');
    } catch (err) {
        if (connection) {
            await connection.rollback();
        }
        console.error("Error: ", err.message);
        res.status(500).send('Error en la transacción');
    } finally {
        if (connection) {
            await connection.end();
        }
    }
});

module.exports = router;
