// controllers/datosController.js
const { Pool } = require('pg');


//PARA RENDER
const pool = new Pool({
  connectionString: 'postgres://datos_nf4r_user:F0UCioJs60QYobtLbDY7Xded7VkhYRYy@dpg-cl24k68p2gis7381s7bg-a/datos_nf4r',
});

// // // PARA VS
// const pool = new Pool({
//   connectionString: 'postgres://datos_nf4r_user:F0UCioJs60QYobtLbDY7Xded7VkhYRYy@dpg-cl24k68p2gis7381s7bg-a.oregon-postgres.render.com/datos_nf4r',
//   ssl: true,
// });


const home = async (req, res) => {
  try {
    const analgesicosQuery = "SELECT id, name, price, category FROM public.articulos WHERE category = 'Analgesicos' ORDER BY name";
    const resultAnalgesicos = await pool.query(analgesicosQuery);

    const encendedoresQuery = "SELECT id, name, price, category FROM public.articulos WHERE category = 'Encendedores' ORDER BY name";
    const resultEncendedores = await pool.query(encendedoresQuery);

    const pegamentosQuery = "SELECT id, name, price, category FROM public.articulos WHERE category = 'Pegamentos' ORDER BY name";
    const resultPegamentos = await pool.query(pegamentosQuery);

    const pilasQuery = "SELECT id, name, price, category FROM public.articulos WHERE category = 'Pilas' ORDER BY name";
    const resultPilas = await pool.query(pilasQuery);

    const filosQuery = "SELECT id, name, price, category FROM public.articulos WHERE category = 'Filos' ORDER BY name";
    const resultFilos = await pool.query(filosQuery);

    const preservativosQuery = "SELECT id, name, price, category FROM public.articulos WHERE category = 'Preservativos' ORDER BY name";
    const resultPreservativos = await pool.query(preservativosQuery);

    const cigarrillosQuery = "SELECT id, name, price, category FROM public.articulos WHERE category = 'Cigarrillos' ORDER BY name";
    const resultcigarrillos = await pool.query(cigarrillosQuery);

    res.render('index', {
      analgesicos: resultAnalgesicos.rows,
      encendedores: resultEncendedores.rows,
      pegamentos: resultPegamentos.rows,
      pilas: resultPilas.rows,
      filos: resultFilos.rows,
      preservativos: resultPreservativos.rows,
      cigarrillos: resultcigarrillos.rows,

    });
  } catch (error) {
    console.error('Error de consulta:', error.message);
    res.status(500).send('Error de consulta');
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

for (let i = 0; i < productosSeleccionados.length; i++) {
  productosSeleccionados[i].precioTotal = (productosSeleccionados[i].cantidad * productosSeleccionados[i].precio).toFixed(2);
  totalCarrito += parseFloat(productosSeleccionados[i].precioTotal); 
}

console.log(productosSeleccionados)
console.log(totalCarrito)

  res.render('pedido', { productosSeleccionados:productosSeleccionados, totalCarrito: totalCarrito, diaFactura:diaFactura});
};

module.exports = {home, allProducts, cigarrillos, detail, addProduct, addProductPost, detailProductEdit, productEdit, crearPedido };
