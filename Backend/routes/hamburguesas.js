const express = require('express');
const router = express.Router();
const hamburguesas = require('../Controllers/hamburguesas');
const verificarToken = require('../Middlewares/verificarToken');
const esAdmin = require('../Middlewares/esAdmin'); // Asegúrate de que exista

// ✅ Clientes y Admin pueden ver hamburguesas
router.get('/', verificarToken, hamburguesas.obtenerHamburguesas);

// ✅ Crear hamburguesa (solo admin)
router.post('/nueva', verificarToken, esAdmin, hamburguesas.crear);

// ✅ Eliminar hamburguesa (solo admin)
router.delete('/:id', verificarToken, esAdmin, hamburguesas.eliminar);

module.exports = router;
