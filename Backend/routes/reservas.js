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

router.get('/restaurante/:id', verificarToken, esAdmin, async (req, res) => {
    const { id } = req.params;
    try {
      const resultado = await db.query(`
        SELECT r.id, r.fecha, r.hora, r.personas, u.nombre AS cliente
        FROM reservas r
        JOIN usuarios u ON r.usuario_id = u.id
        WHERE r.restaurante_id = $1
        ORDER BY r.fecha, r.hora
      `, [id]);
  
      res.json(resultado.rows);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  });
  
module.exports = router;
