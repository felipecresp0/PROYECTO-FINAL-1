const express = require('express');
const router = express.Router();
const { crearResena, obtenerResenasRestaurante, eliminarResena } = require('../Controllers/resenas');
const verificarToken = require('../Middlewares/verificarToken');

// Crear una reseña (requiere autenticación)
router.post('/', verificarToken, crearResena);

// Obtener reseñas de un restaurante (público)
router.get('/restaurante/:id', obtenerResenasRestaurante);

// Eliminar una reseña (requiere autenticación)
router.delete('/:id', verificarToken, eliminarResena);

module.exports = router;