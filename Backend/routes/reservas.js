const express = require('express');
const router = express.Router();

const { nuevaReserva, obtenerTodasLasReservas, eliminarReserva } = require('../Controllers/reservas');
const verificarToken = require('../Middlewares/verificarToken');
const esAdmin = require('../Middlewares/esAdmin'); // ✅ asegúrate de que el nombre coincide

// Ruta para usuarios normales
router.post('/nueva', verificarToken, nuevaReserva);

// Ruta solo para admin
router.get('/admin', verificarToken, esAdmin, obtenerTodasLasReservas);

// 👉 Nueva ruta DELETE
router.delete('/:id', verificarToken, eliminarReserva);

module.exports = router;
