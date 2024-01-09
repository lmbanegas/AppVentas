const express = require('express');
const datosController = require('../controllers/datosController');

const router = express.Router();

//Todos los productos
router.get('/', datosController.allProducts);
router.get('/cigarrillos', datosController.cigarrillos);


//Detalle de producto
router.get('/detail/:id', datosController.detail);

//Añadir producto
router.get('/add', datosController.addProduct);
router.post('/add', datosController.addProductPost);

//Editar producto

router.get('/edit/:id', datosController.detailProductEdit);
router.post('/edit/:id', datosController.productEdit);


module.exports = router;
