const db = require('../Models/conexionBD');

// Crear bebida
const crear = async (req, res) => {
  const { nombre, descripcion, precio, imagen, destacada } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO bebidas (nombre, descripcion, precio, imagen, destacada) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [nombre, descripcion, precio, imagen, destacada || false]
    );
    res.status(201).json({ mensaje: 'Bebida creada', bebida: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Listar bebidas
const listar = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM bebidas');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar bebida
const eliminar = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM bebidas WHERE id = $1', [id]);
    res.json({ mensaje: 'Bebida eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Modificar bebida
const modificar = async (req, res) => {
  const { id } = req.params;
  const { nombre, descripcion, precio, imagen, destacada } = req.body;
  try {
    const result = await db.query(
      'UPDATE bebidas SET nombre=$1, descripcion=$2, precio=$3, imagen=$4, destacada=$5 WHERE id=$6 RETURNING *',
      [nombre, descripcion, precio, imagen, destacada, id]
    );
    res.json({ mensaje: 'Bebida actualizada', bebida: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { crear, listar, eliminar, modificar };
