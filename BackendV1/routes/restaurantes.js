const express = require('express');
const router = express.Router();
const db = require('../Models/conexionBD');
const { buscarPorCP, obtenerRestaurante, agregarFoto } = require('../Controllers/restaurantes');
const verificarToken = require('../Middlewares/verificarToken');
const esAdmin = require('../Middlewares/esAdmin');

// 🟢 Buscar restaurantes por código postal
router.get('/', async (req, res) => {
  const { cp } = req.query;
  
  if (!cp) return res.status(400).json({ error: 'Falta el código postal' });
  
  // Extraer los 2 primeros dígitos del CP
  const prefijo = cp.substring(0, 2); // '50' por ejemplo
  
  try {
    const resultado = await db.query(
      'SELECT * FROM restaurantes WHERE codigo_postal LIKE $1',
      [`${prefijo}%`]
    );
    
    res.json(resultado.rows);
  } catch (error) {
    console.error('❌ Error al buscar restaurantes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
  
// 🔍 Obtener restaurante por ID (con fotos y valoración)
router.get('/:id', obtenerRestaurante);

// 📷 Añadir foto a un restaurante (solo admin)
router.post('/:id/fotos', verificarToken, esAdmin, agregarFoto);

module.exports = router;