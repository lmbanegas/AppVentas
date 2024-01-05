exports.getHomePage = (req, res) => {
  const articulos = [
    {
      "nombre": "Actron 400 - Tira de 10",
      "precio": 450,
      "cantidad": 0,
    },
    {
      "nombre": "Actron 600 - Tira de 10",
      "precio": 280,
      "cantidad": 0,
    },
    {
      "nombre": "Alikal",
      "precio": 150,
      "cantidad": 0,
    },
    // Nuevos elementos
    {
      "nombre": "Buscapina",
      "precio": 250,
      "cantidad": 0,
    },
    {
      "nombre": "Diclofenac",
      "precio": 350,
      "cantidad": 0,
    },
    {
      "nombre": "Anaflex",
      "precio": 120,
      "cantidad": 0,
    },
    {
      "nombre": "Aspirineta",
      "precio": 380,
      "cantidad": 0,
    },
    {
      "nombre": "Buscapina Perlas",
      "precio": 365,
      "cantidad": 0,
    },
    {
      "nombre": "Cafiaspirina",
      "precio": 290,
      "cantidad": 0,
    },
    {
      "nombre": "Ibuprofeno",
      "precio": 480,
      "cantidad": 0,
    },
    {
      "nombre": "Migral",
      "precio": 380,
      "cantidad": 0,
    },
    {
      "nombre": "Sertal",
      "precio": 669,
      "cantidad": 0,
    },
    {
      "nombre": "Tafirol",
      "precio": 233,
      "cantidad": 0,
    },
    {
      "nombre": "Uvasal",
      "precio": 225,
      "cantidad": 0,
    },
    {
      "nombre": "Novalgina",
      "precio": 655,
      "cantidad": 0,
    },
    {
      "nombre": "Keterolac 20mg",
      "precio": 668,
      "cantidad": 0,
    }
  ];
  
  res.render('index', { articulos: articulos });
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


