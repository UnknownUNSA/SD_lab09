const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const departamentosRoutes = require('./routes/departamentos');
const ingenierosRoutes = require('./routes/ingenieros');
const proyectosRoutes = require('./routes/proyectos');


const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/departamentos', departamentosRoutes);
app.use('/api/ingenieros', ingenierosRoutes);
app.use('/api/proyectos', proyectosRoutes);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
