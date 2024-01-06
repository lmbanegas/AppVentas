exports.getHomePage = (req, res) => {

  const { Pool } = require('pg');


  const pool = new Pool({
    connectionString: 'postgres://datos_nf4r_user:F0UCioJs60QYobtLbDY7Xded7VkhYRYy@dpg-cl24k68p2gis7381s7bg-a.oregon-postgres.render.com/datos_nf4r',
    ssl: true,
  });

  try {
    const query = 'SELECT id, name, price, comment FROM public.articulos ORDER BY name'; 
    const result = await pool.query(query);

    res.render('index', { resultados: result.rows });
  } catch (error) {
    console.error('Error de consulta:', error.message);
    res.status(500).send('Error de consulta');
  }
};



exports.crearPedido = (req, res) => {

  const fecha = new Date();
  const dia = fecha.getDate();
  const mes = fecha.getMonth() + 1;
  const anio = fecha.getFullYear();

  const diaFactura =  dia + "/" + mes + "/" + anio
  
  const productos = req.body.nombre;
  const cantidades = req.body.cantidad;
  const precios = req.body.precio;
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


