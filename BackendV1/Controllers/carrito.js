const db = require('../Models/conexionBD');

const agregarAlCarrito = async (req, res) => {
  const { hamburguesa_id, cantidad } = req.body;
  const usuario_id = req.usuario.id;

  try {
    // Si ya existe, sumamos la cantidad
    const existente = await db.query(
      'SELECT * FROM carrito WHERE usuario_id = $1 AND hamburguesa_id = $2',
      [usuario_id, hamburguesa_id]
    );

    if (existente.rows.length > 0) {
      await db.query(
        'UPDATE carrito SET cantidad = cantidad + $1 WHERE usuario_id = $2 AND hamburguesa_id = $3',
        [cantidad || 1, usuario_id, hamburguesa_id]
      );
    } else {
      await db.query(
        'INSERT INTO carrito (usuario_id, hamburguesa_id, cantidad) VALUES ($1, $2, $3)',
        [usuario_id, hamburguesa_id, cantidad || 1]
      );
    }

    res.status(200).json({ mensaje: 'Hamburguesa añadida al carrito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerCarrito = async (req, res) => {
  const usuario_id = req.usuario.id;

  try {
    const resultado = await db.query(
      `SELECT c.id, h.nombre, h.descripcion, h.precio, c.cantidad
       FROM carrito c
       JOIN hamburguesas h ON c.hamburguesa_id = h.id
       WHERE c.usuario_id = $1`,
      [usuario_id]
    );
    res.json(resultado.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const eliminarDelCarrito = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query('DELETE FROM carrito WHERE id = $1', [id]);
    res.json({ mensaje: 'Elemento eliminado del carrito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const actualizarCantidad = async (req, res) => {
  const { id, cantidad } = req.body;
  const usuario_id = req.usuario.id;

  try {
    await db.query(`
      UPDATE carrito
      SET cantidad = $1
      WHERE id = $2 AND usuario_id = $3
    `, [cantidad, id, usuario_id]);

    res.json({ mensaje: 'Cantidad actualizada' });
  } catch (error) {
    console.error('Error al actualizar cantidad:', error);
    res.status(500).json({ error: 'Error al actualizar cantidad' });
  }
};


module.exports = { agregarAlCarrito, obtenerCarrito, eliminarDelCarrito, actualizarCantidad };
