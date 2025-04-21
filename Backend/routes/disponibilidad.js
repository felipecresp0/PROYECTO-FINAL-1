// Backend/routes/disponibilidad.js
const express = require('express');
const router = express.Router();
const db = require('../Models/conexionBD');

// Obtener disponibilidad para una fecha específica
router.get('/', async (req, res) => {
  const { restaurante_id, fecha } = req.query;
  
  if (!restaurante_id || !fecha) {
    return res.status(400).json({ error: 'Se requiere restaurante_id y fecha' });
  }
  
  try {
    // Para simplificar, siempre devolvemos un conjunto fijo de horarios disponibles
    const horariosDisponibles = [
      { hora: '12:00', mesas_disponibles: 5, capacidad_total: 20 },
      { hora: '13:00', mesas_disponibles: 4, capacidad_total: 20 },
      { hora: '14:00', mesas_disponibles: 3, capacidad_total: 20 },
      { hora: '15:00', mesas_disponibles: 6, capacidad_total: 20 },
      { hora: '20:00', mesas_disponibles: 5, capacidad_total: 20 },
      { hora: '21:00', mesas_disponibles: 4, capacidad_total: 20 },
      { hora: '22:00', mesas_disponibles: 6, capacidad_total: 20 },
      { hora: '23:00', mesas_disponibles: 4, capacidad_total: 20 }
    ];
    
    res.json(horariosDisponibles);
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

module.exports = router;