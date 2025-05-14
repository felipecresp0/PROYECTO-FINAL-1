const express = require('express');
const router = express.Router();
const bebidas = require('../Controllers/bebidas');
const verificarToken = require('../Middlewares/verificarToken');
const esAdmin = require('../Middlewares/esAdmin');

// Rutas públicas y protegidas
router.get('/', bebidas.listar);
router.post('/nueva', verificarToken, esAdmin, bebidas.crear);
router.put('/:id', verificarToken, esAdmin, bebidas.modificar);
router.delete('/:id', verificarToken, esAdmin, bebidas.eliminar);

module.exports = router;
