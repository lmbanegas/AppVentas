// routes/index.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/datosController');

router.get('/', controller.home);
router.post('/crear-pedido', controller.crearPedido);





module.exports = router;