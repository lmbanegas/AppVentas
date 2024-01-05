// routes/index.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/', controller.getHomePage);
router.post('/crear-pedido', controller.crearPedido);





module.exports = router;