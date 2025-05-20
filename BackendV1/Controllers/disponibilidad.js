const disponibilidadModel = require('../Models/disponibilidad');

// Obtener disponibilidad para una fecha específica
const obtenerDisponibilidad = async (req, res) => {
  const { restaurante_id, fecha } = req.query;
  
  if (!restaurante_id || !fecha) {
    return res.status(400).json({ error: 'Se requiere restaurante_id y fecha' });
  }
  
  try {
    const disponibilidad = await disponibilidadModel.obtenerDisponibilidadPorFecha(restaurante_id, fecha);
    res.json(disponibilidad);
  } catch (error) {
    console.error('Error al obtener disponibilidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Inicializar disponibilidad para un rango de fechas
const inicializarDisponibilidad = async (req, res) => {
  const { restaurante_id, fecha_inicio, fecha_fin } = req.body;
  
  if (!restaurante_id || !fecha_inicio || !fecha_fin) {
    return res.status(400).json({ error: 'Se requieren todos los campos' });
  }
  
  try {
    const resultado = await disponibilidadModel.inicializarDisponibilidad(
      restaurante_id, 
      fecha_inicio,
      fecha_fin
    );
    
    res.json(resultado);
  } catch (error) {
    console.error('Error al inicializar disponibilidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  obtenerDisponibilidad,
  inicializarDisponibilidad
};