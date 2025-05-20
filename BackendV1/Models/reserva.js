const db = require('./conexionBD');

const crearReserva = async ({ usuario_id, restaurante_id, fecha, hora, personas }) => {
  const resultado = await db.query(
    'INSERT INTO reservas (usuario_id, restaurante_id, fecha, hora, personas) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [usuario_id, restaurante_id, fecha, hora, personas]
  );
  return resultado.rows[0];
};

module.exports = { crearReserva };