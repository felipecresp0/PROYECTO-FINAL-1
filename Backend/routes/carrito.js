const express = require('express');
const router = express.Router();
const verificarToken = require('../Middlewares/verificarToken');
const { agregarAlCarrito, obtenerCarrito, eliminarDelCarrito, actualizarCantidad } = require('../Controllers/carrito');

router.post('/agregar', verificarToken, agregarAlCarrito);
router.get('/', verificarToken, obtenerCarrito);
router.delete('/:id', verificarToken, eliminarDelCarrito);
router.put('/cantidad', verificarToken, actualizarCantidad);


module.exports = router;
