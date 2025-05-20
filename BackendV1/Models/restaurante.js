const db = require('./conexionBD');

const obtenerRestaurante = async (id) => {
  const resultado = await db.query(
    'SELECT * FROM restaurantes WHERE id = $1',
    [id]
  );
  return resultado.rows[0];
};

const obtenerRestauranteConFotos = async (id) => {
  const resultado = await db.query(
    'SELECT id, nombre, codigo_postal, latitud, longitud, fotos FROM restaurantes WHERE id = $1',
    [id]
  );
  return resultado.rows[0];
};

const agregarFotoRestaurante = async (id, urlFoto) => {
  const resultado = await db.query(
    'UPDATE restaurantes SET fotos = array_append(fotos, $1) WHERE id = $2 RETURNING *',
    [urlFoto, id]
  );
  return resultado.rows[0];
};

module.exports = {
  obtenerRestaurante,
  obtenerRestauranteConFotos,
  agregarFotoRestaurante
};