const { Pool } = require('pg');
const { body, validationResult } = require('express-validator');



// ------- ***** RENDER ***** ------- /

const pool = new Pool({
  connectionString: 'postgresql://uba_4xho_user:qVlqCmQEpXt8OX5YC8qCsVq1h27QzttH@dpg-cqtr7rrv2p9s73ad83h0-a/uba_4xho',
});
// ------- ***** RENDER ***** ------- /


// ------- ***** VS ***** ------- /

// const pool = new Pool({
//   connectionString: 'postgres://uba_4xho_user:qVlqCmQEpXt8OX5YC8qCsVq1h27QzttH@dpg-cqtr7rrv2p9s73ad83h0-a.oregon-postgres.render.com/uba_4xho',
//   ssl: false,
// });
// ------- ***** VS ***** ------- /

const home = async (req, res) => {
  try {
    console.log('Iniciando consulta...');
    const resultado = "SELECT * FROM public.publicaciones";
    const resultados = await pool.query(resultado);
    
    console.log('Consulta exitosa. Resultados:', resultados.rows);
    
    res.render('index', {
      resultados: resultados.rows
    });
  } catch (error) {
    console.error('Error de consulta:', error.message);
    res.status(500).send('Error de consulta');
  }
};

const loginGet = async (req, res) => {
  res.render('login')
};


const loginPost = async (req, res) => {
  try {
    let errors = validationResult(req);
    const username = req.body.username;
    const password = req.body.password;

    // Verificar las credenciales en el servidor
    if (username === 'miguel' && password === 'miguel') {
      res.cookie('username', username, { maxAge: 24 * 60 * 60 * 1000 });
      req.session.user = username;
      res.redirect('/');
    } else {
      errors.errors.push({ param: 'general', msg: 'Usuario y/o contraseña incorrectos' });
      console.log(errors)

      return res.render('login', { errors });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};


const allProducts = async (req, res) => {
    try {
      const query = 'SELECT id, name, ROUND(price::numeric, 2) as price FROM public.articulos ORDER BY name'; 
      const result = await pool.query(query);

      res.render('products', { products: result.rows });
    } catch (error) {
      console.error('Error de consulta:', error.message);
      res.status(500).send('Error de consulta');
    }
  };


const cigarrillos = async (req, res) => {
  try {
    const query = 'SELECT id, name, price, category FROM public.articulos WHERE category = \'Cigarrillos\' ORDER BY name'; 
    const result = await pool.query(query);

    res.render('cigarrillos', { products: result.rows });
  } catch (error) {
    console.error('Error de consulta:', error.message);
    res.status(500).send('Error de consulta');
  }
};

const detail = async (req, res) => {
  try {
    // Obtén el id de los parámetros de la URL
    const id = req.params.id;

    // Realiza la consulta SQL con una cláusula WHERE para filtrar por id
    const query = 'SELECT * FROM public.articulos WHERE id = $1'
    ;
    const result = await pool.query(query, [id]);

    // Verifica si se encontró un resultado
    if (result.rows.length > 0) {
      const dato = result.rows[0];
      res.render('productDetail', { dato });
    } else {
      // Si no se encuentra el dato, puedes manejarlo como desees
      res.status(404).send('Dato no encontrado');
    }
  } catch (error) {
    console.error('Error de consulta:', error.message);
    res.status(500).send('Error de consulta');
  }
};

const addProduct = (req, res) => {
  res.render('productAdd');
};

const addProductPost = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    // Insertar el nuevo producto en la base de datos

    const query = 'INSERT INTO public.articulos (name, price, CATEGORY) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [name, price, category]);

    // Redirigir a la página de detalles del nuevo producto
    res.redirect(`/products/`);
  } catch (error) {
    console.error('Error al agregar producto:', error.message);
    res.status(500).send('Error al agregar producto');
  }
};


const detailProductEdit = async (req, res) => {
  try {
    const id = req.params.id;

    const query = 'SELECT * FROM public.articulos WHERE id = $1';
    const result = await pool.query(query, [id]);

    if (result.rows.length > 0) {
      const producto = result.rows[0];
      res.render('productEdit', { producto });
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    console.error('Error al mostrar formulario de edición:', error.message);
    res.status(500).send('Error al mostrar formulario de edición');
  }
};


const productEdit = async (req, res) => {
  try {
    const id = req.params.id;
    let { name, price, aumento, category } = req.body;

    if (aumento > 0) {
      price = (price * (1 + aumento / 100));
    }

    price = parseFloat(price).toFixed(2);

    // Modificar la consulta para incluir la categoría
    const query = 'UPDATE public.articulos SET name = $1, price = $2, category = $3 WHERE id = $4 RETURNING *';
    const result = await pool.query(query, [name, price, category, id]);

    res.redirect(`/products/`);
  } catch (error) {
    console.error('Error al editar producto:', error.message);
    res.status(500).send('Error al editar producto');
  }
};

const productDelete = async (req, res) => {
  try {
    const id = req.params.id;

    const query = 'DELETE FROM public.articulos WHERE id = $1';


    await pool.query(query, [id]);

    console.log('Query:', query);


    res.redirect(`/`);
  } catch (error) {
    console.error('Error al editar producto:', error.message);
    res.status(500).send('Error al editar producto');
  }
};



const crearPedido = (req, res) => {

  const fecha = new Date();
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const anio = fecha.getFullYear();

  const diaFactura =  dia + "/" + mes + "/" + anio
  
  const productos = req.body.name;
  const cantidades = req.body.cantidad;
  const precios = req.body.price;
  let totalCarrito = 0;
  const productosSeleccionados = [];

  for (let i = 0; i < productos.length; i++) {
    const nombre = productos[i];
    const cantidad = parseInt(cantidades[i], 10);
    const precio = parseFloat(precios[i]);
    const precioTotal = 0;

    if (cantidad > 0) {
        productosSeleccionados.push({ nombre, cantidad, precio, precioTotal });
    }
}


  res.render('pedido', { productosSeleccionados:productosSeleccionados, totalCarrito: totalCarrito, diaFactura:diaFactura});
};

module.exports = {home,loginGet, loginPost, allProducts, cigarrillos, detail, addProduct, addProductPost, detailProductEdit, productEdit, productDelete, crearPedido };