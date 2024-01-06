// app.js
const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const path = require('path');


const app = express();
const port = 3000;

// Configurar EJS como motor de plantillas
app.set('view engine', 'ejs');

app.set('views', [
  path.join(__dirname, './views'),
  path.join(__dirname, './views/partials'),

]);


// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  connectionString: 'postgres://datos_nf4r_user:F0UCioJs60QYobtLbDY7Xded7VkhYRYy@dpg-cl24k68p2gis7381s7bg-a/datos_nf4r',
  
  ssl: true,

});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas y controladores
const indexRoute = require('./routes/index');
const productsRoute = require('./routes/productsRouter');

// Rutas
app.use('/', indexRoute);
app.use('/products', productsRoute); 


// Manejar errores 404
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// Manejar errores 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
