const db = require('../Models/conexionBD');

const buscarPorCP = async (req, res) => {
  const { cp } = req.query;

  try {
    const resultado = await db.query(
      'SELECT * FROM restaurantes WHERE codigo_postal = $1',
      [cp]
    );
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ error: 'Error al buscar restaurantes' });
  }
};

module.exports = { buscarPorCP };
