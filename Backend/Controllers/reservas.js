const { crearReserva } = require('../Models/reserva');

const nuevaReserva = async (req, res) => {
  const { fecha, hora, personas } = req.body;
  const usuarioId = req.usuario.id;

  try {
    const reserva = await crearReserva({ usuario_id: usuarioId, fecha, hora, personas });

    res.status(201).json({
      mensaje: '✅ Reserva registrada correctamente',
      reserva
    });
  } catch (error) {
    console.error('Error al guardar reserva:', error);
    res.status(500).json({ error: '❌ Error al guardar la reserva' });
  }
};

const db = require('../Models/conexionBD');

const obtenerTodasLasReservas = async (req, res) => {
  try {
    const resultado = await db.query(`
      SELECT r.id, u.email AS usuario, r.fecha, r.hora, r.personas
      FROM reservas r
      JOIN usuarios u ON u.id = r.usuario_id
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
      await db.query('DELETE FROM reservas WHERE id = $1', [id]);
      res.json({ mensaje: '✅ Reserva eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar reserva:', error);
      res.status(500).json({ mensaje: '❌ Error al eliminar la reserva' });
    }
  };
  

  module.exports = { nuevaReserva, obtenerTodasLasReservas, eliminarReserva };


