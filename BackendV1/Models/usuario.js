const db = require('./conexionBD');

// Crear usuario nuevo
const crearUsuario = async (nombre, email, contrasena, rol = 'cliente') => {
  const resultado = await db.query(
    `INSERT INTO usuarios (nombre, email, contrasena, rol)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [nombre, email, contrasena, rol]
  );
  return resultado.rows[0];
};

// Obtener usuario por email
const obtenerUsuarioPorEmail = async (email) => {
  const resultado = await db.query(
    'SELECT * FROM usuarios WHERE email = $1',
    [email]
  );
  return resultado.rows[0];
};

module.exports = {
  crearUsuario,
  obtenerUsuarioPorEmail,
};
