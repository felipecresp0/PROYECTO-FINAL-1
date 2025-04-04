const express = require('express');
const router = express.Router();
const verificarToken = require('../Middlewares/verificarToken');
const { agregarAlCarrito, obtenerCarrito, eliminarDelCarrito } = require('../Controllers/carrito');

router.post('/agregar', verificarToken, agregarAlCarrito);
router.get('/', verificarToken, obtenerCarrito);
router.delete('/:id', verificarToken, eliminarDelCarrito);

module.exports = router;
