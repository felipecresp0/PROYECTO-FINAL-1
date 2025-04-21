const resenaModel = require('../Models/resena');

// Crear una nueva reseña
const crearResena = async (req, res) => {
  const { restaurante_id, puntuacion, comentario } = req.body;
  const usuario_id = req.usuario.id;
  
  if (!restaurante_id || !puntuacion) {
    return res.status(400).json({ error: 'Se requiere restaurante_id y puntuación' });
  }
  
  if (puntuacion < 1 || puntuacion > 5) {
    return res.status(400).json({ error: 'La puntuación debe estar entre 1 y 5' });
  }
  
  try {
    const resena = await resenaModel.crearResena({
      usuario_id,
      restaurante_id,
      puntuacion,
      comentario
    });
    
    res.status(201).json({
      mensaje: 'Reseña creada con éxito',
      resena
    });
  } catch (error) {
    console.error('Error al crear reseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Obtener reseñas de un restaurante
const obtenerResenasRestaurante = async (req, res) => {
  const { id } = req.params;
  
  try {
    const resenas = await resenaModel.obtenerResenasPorRestaurante(id);
    const valoracion = await resenaModel.obtenerValoracionMedia(id);
    
    res.json({
      valoracion: valoracion.media,
      total: valoracion.total,
      resenas
    });
  } catch (error) {
    console.error('Error al obtener reseñas:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Eliminar una reseña
const eliminarResena = async (req, res) => {
  const { id } = req.params;
  const usuario_id = req.usuario.id;
  
  try {
    const resena = await resenaModel.eliminarResena(id, usuario_id);
    
    if (!resena) {
      return res.status(404).json({ error: 'Reseña no encontrada o no tienes permiso para eliminarla' });
    }
    
    res.json({ mensaje: 'Reseña eliminada con éxito' });
  } catch (error) {
    console.error('Error al eliminar reseña:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  crearResena,
  obtenerResenasRestaurante,
  eliminarResena
};