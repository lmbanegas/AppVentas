const express = require('express');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
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

app.use(express.static('public'));


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
}));

app.use(cookieParser());
app.use(methodOverride('_method'));


// ------- ***** RENDER ***** ------- /

const pool = new Pool({
  connectionString: 'postgresql://datatabasepx_user:aQ03haJ4FmjHl4yVQDwAp13zrb8PTrPN@dpg-crk81d3qf0us73df2u8g-a/datatabasepx',
});

// ------- ***** RENDER ***** ------- /



// ------- ***** VS ***** ------- /


// const pool = new Pool({
//   connectionString: 'postgresql://datatabasepx_user:aQ03haJ4FmjHl4yVQDwAp13zrb8PTrPN@dpg-crk81d3qf0us73df2u8g-a.oregon-postgres.render.com/datatabasepx',
//   ssl: true,
// });

// ------- ***** VS ***** ------- /



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
  res.status(404).send('Error! - Página inexistente');
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
