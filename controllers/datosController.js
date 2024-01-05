// controllers/datosController.js
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgres://datos_nf4r_user:F0UCioJs60QYobtLbDY7Xded7VkhYRYy@dpg-cl24k68p2gis7381s7bg-a.oregon-postgres.render.com/datos_nf4r',

});

const allProducts = async (req, res) => {
  try {
    const query = 'SELECT id, name, price, comment FROM public.articulos ORDER BY name'; 
    const result = await pool.query(query);

    res.render('products', { resultados: result.rows });
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
    const { name, price, comment } = req.body;

    // Insertar el nuevo producto en la base de datos

    const query = 'INSERT INTO public.articulos (name, price, comment) VALUES ($1, $2, $3) RETURNING *';
    const result = await pool.query(query, [name, price, comment]);

    // Redirigir a la página de detalles del nuevo producto
    res.redirect(`/products/detail/${result.rows[0].id}`);
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
    let { name, price, comment, aumento } = req.body;

    if (aumento > 0) {
      price = price * (1+ (aumento/100));
    }

    const query = 'UPDATE public.articulos SET id = $1, name = $2, price = $3, comment = $4 WHERE id = $5 RETURNING *';
    const result = await pool.query(query, [id, name, price, comment, id]);

    res.redirect(`/products/`);
  } catch (error) {
    console.error('Error al editar producto:', error.message);
    res.status(500).send('Error al editar producto');
  }
};

module.exports = { allProducts, detail, addProduct, addProductPost, detailProductEdit, productEdit };
