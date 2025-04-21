const db = require('../Models/conexionBD');
const restauranteModel = require('../Models/restaurante');
const { obtenerValoracionMedia } = require('../Models/resena');

const buscarPorCP = async (req, res) => {
  const { cp } = req.query;

  try {
    const resultado = await db.query(
      'SELECT * FROM restaurantes WHERE codigo_postal LIKE $1',
      [`${cp}%`]
    );
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar restaurantes' });
  }
};

const obtenerRestaurante = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Obtener datos del restaurante
    const restaurante = await restauranteModel.obtenerRestauranteConFotos(id);
    
    if (!restaurante) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }
    
    // Obtener valoración media (si tienes la tabla de reseñas configurada)
    let valoracion = { media: "0.0", total: 0 };
    try {
      valoracion = await obtenerValoracionMedia(id);
    } catch (error) {
      console.log("Tabla de reseñas no disponible o error: ", error);
    }
    
    // Devolver todo junto
    res.json({
      ...restaurante,
      valoracion: valoracion.media,
      total_resenas: valoracion.total
    });
  } catch (error) {
    console.error('Error al obtener restaurante:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const agregarFoto = async (req, res) => {
  const { id } = req.params;
  const { url } = req.body;
  
  try {
    const restaurante = await restauranteModel.agregarFotoRestaurante(id, url);
    
    if (!restaurante) {
      return res.status(404).json({ error: 'Restaurante no encontrado' });
    }
    
    res.json({ mensaje: 'Foto añadida con éxito', restaurante });
  } catch (error) {
    console.error('Error al añadir foto:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { 
  buscarPorCP, 
  obtenerRestaurante,
  agregarFoto
};