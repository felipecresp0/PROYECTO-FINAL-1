const express = require('express');
const router = express.Router();

const { 
  nuevaReserva, 
  obtenerTodasLasReservas, 
  eliminarReserva, 
  obtenerReservasPorRestaurante 
} = require('../Controllers/reservas');

const verificarToken = require('../Middlewares/verificarToken');
const esAdmin = require('../Middlewares/esAdmin');

// Ruta para usuarios normales
router.post('/nueva', verificarToken, nuevaReserva);

// Ruta solo para admin
router.get('/admin', verificarToken, esAdmin, obtenerTodasLasReservas);

// Ruta DELETE
router.delete('/:id', verificarToken, eliminarReserva);

// Ruta para obtener reservas de un restaurante específico
router.get('/restaurante/:id', verificarToken, esAdmin, obtenerReservasPorRestaurante);

module.exports = router;