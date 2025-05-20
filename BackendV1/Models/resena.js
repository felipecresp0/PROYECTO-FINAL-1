const db = require('./conexionBD');

// Crear una nueva reseña
const crearResena = async ({ usuario_id, restaurante_id, puntuacion, comentario }) => {
  try {
    const resultado = await db.query(
      `INSERT INTO reseñas 
       (usuario_id, restaurante_id, puntuacion, comentario) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (usuario_id, restaurante_id)
       DO UPDATE SET 
         puntuacion = $3,
         comentario = $4,
         fecha_creacion = CURRENT_TIMESTAMP
       RETURNING *`,
      [usuario_id, restaurante_id, puntuacion, comentario]
    );
    
    return resultado.rows[0];
  } catch (error) {
    console.error('Error en crearResena:', error);
    throw error;
  }
};

// Obtener reseñas de un restaurante
const obtenerResenasPorRestaurante = async (restaurante_id) => {
  try {
    const resultado = await db.query(
      `SELECT r.id, r.puntuacion, r.comentario, r.fecha_creacion,
              u.nombre as usuario_nombre
       FROM reseñas r
       JOIN usuarios u ON r.usuario_id = u.id
       WHERE r.restaurante_id = $1
       ORDER BY r.fecha_creacion DESC`,
      [restaurante_id]
    );
    
    return resultado.rows;
  } catch (error) {
    console.error('Error en obtenerResenasPorRestaurante:', error);
    throw error;
  }
};

// Obtener valoración media de un restaurante
const obtenerValoracionMedia = async (restaurante_id) => {
  try {
    const resultado = await db.query(
      `SELECT AVG(puntuacion) as media, COUNT(*) as total
       FROM reseñas
       WHERE restaurante_id = $1`,
      [restaurante_id]
    );
    
    return {
      media: parseFloat(resultado.rows[0].media || 0).toFixed(1),
      total: parseInt(resultado.rows[0].total)
    };
  } catch (error) {
    console.error('Error en obtenerValoracionMedia:', error);
    throw error;
  }
};

// Eliminar una reseña
const eliminarResena = async (id, usuario_id) => {
  try {
    const resultado = await db.query(
      `DELETE FROM reseñas
       WHERE id = $1 AND usuario_id = $2
       RETURNING *`,
      [id, usuario_id]
    );
    
    return resultado.rows[0];
  } catch (error) {
    console.error('Error en eliminarResena:', error);
    throw error;
  }
};

module.exports = {
  crearResena,
  obtenerResenasPorRestaurante,
  obtenerValoracionMedia,
  eliminarResena
};