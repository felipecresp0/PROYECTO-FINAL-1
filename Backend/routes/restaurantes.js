const express = require('express');
const router = express.Router();
const db = require('../Models/conexionBD');

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
  
// 🔍 Obtener restaurante por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const resultado = await db.query('SELECT * FROM restaurantes WHERE id = $1', [id]);

    if (resultado.rows.length === 0) return res.status(404).json({ error: 'No encontrado' });

    res.json(resultado.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener restaurante' });
  }
});

module.exports = router;
