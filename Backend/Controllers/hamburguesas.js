const db = require('../Models/conexionBD');

const crear = async (req, res) => {
  const { nombre, descripcion, precio } = req.body;

  try {
    const resultado = await db.query(
      'INSERT INTO hamburguesas (nombre, descripcion, precio) VALUES ($1, $2, $3) RETURNING *',
      [nombre, descripcion, precio]
    );

    res.status(201).json({ mensaje: 'Hamburguesa creada', hamburguesa: resultado.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const listar = async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM hamburguesas');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM hamburguesas WHERE id = $1', [id]);
    res.json({ mensaje: 'Hamburguesa eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerHamburguesas = async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM hamburguesas');
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener hamburguesas' });
  }
};

module.exports = { crear, listar, eliminar, obtenerHamburguesas };
