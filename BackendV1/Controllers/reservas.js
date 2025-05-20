const { crearReserva } = require('../Models/reserva');
const disponibilidadModel = require('../Models/disponibilidad');
const db = require('../Models/conexionBD');

const nuevaReserva = async (req, res) => {
  const { fecha, hora, personas, restaurante_id } = req.body;
  const usuarioId = req.usuario.id;

  if (!fecha || !hora || !personas || !restaurante_id) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar disponibilidad
    const disponibilidad = await disponibilidadModel.obtenerDisponibilidadPorFecha(restaurante_id, fecha);
    
    const horaDisponible = disponibilidad.find(d => d.hora === hora);
    
    if (!horaDisponible) {
      return res.status(400).json({ error: 'La hora seleccionada no está disponible' });
    }
    
    if (horaDisponible.capacidad_total < personas) {
      return res.status(400).json({ error: 'No hay suficiente capacidad para ese número de personas' });
    }
    
    // Crear la reserva
    const reserva = await crearReserva({ 
      usuario_id: usuarioId, 
      restaurante_id, 
      fecha, 
      hora, 
      personas 
    });

    // Actualizar disponibilidad (reducir 1 mesa y la capacidad correspondiente)
    await disponibilidadModel.actualizarDisponibilidad(
      restaurante_id,
      fecha,
      hora,
      -1, // reducir una mesa
      -personas // reducir la capacidad según las personas
    );

    res.status(201).json({
      mensaje: '✅ Reserva registrada correctamente',
      reserva
    });
  } catch (error) {
    console.error('Error al guardar reserva:', error);
    res.status(500).json({ error: '❌ Error al guardar la reserva' });
  }
};

const obtenerTodasLasReservas = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT r.id, u.email AS usuario, r.fecha, r.hora, r.personas, r.restaurante_id,
             res.nombre as restaurante_nombre
      FROM reservas r
      JOIN usuarios u ON u.id = r.usuario_id
      LEFT JOIN restaurantes res ON res.id = r.restaurante_id
      ORDER BY r.fecha, r.hora
    `);

    res.json(resultado.rows);
  } catch (error) {
    console.error('Error al obtener reservas:', error);
    res.status(500).json({ mensaje: '❌ Error al obtener reservas' });
  }
};

const eliminarReserva = async (req, res) => {
  const { id } = req.params;

  try {
    // Primero obtenemos la información de la reserva
    const reservaInfo = await db.query(
      'SELECT restaurante_id, fecha, hora, personas FROM reservas WHERE id = $1',
      [id]
    );
    
    if (reservaInfo.rows.length === 0) {
      return res.status(404).json({ mensaje: 'Reserva no encontrada' });
    }
    
    const { restaurante_id, fecha, hora, personas } = reservaInfo.rows[0];
    
    // Eliminamos la reserva
    await db.query('DELETE FROM reservas WHERE id = $1', [id]);
    
    // Actualizamos la disponibilidad (devolver 1 mesa y la capacidad)
    await disponibilidadModel.actualizarDisponibilidad(
      restaurante_id,
      fecha,
      hora,
      1, // aumentar una mesa
      parseInt(personas) // aumentar la capacidad
    );
    
    res.json({ mensaje: '✅ Reserva eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    res.status(500).json({ mensaje: '❌ Error al eliminar la reserva' });
  }
};

// Obtener reservas de un restaurante específico
const obtenerReservasPorRestaurante = async (req, res) => {
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
    console.error('Error al obtener reservas del restaurante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { 
  nuevaReserva, 
  obtenerTodasLasReservas, 
  eliminarReserva, 
  obtenerReservasPorRestaurante 
};