const jwt = require('jsonwebtoken');
require('dotenv').config();

const verificarToken = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) return res.status(401).json({ mensaje: 'Token no proporcionado.' });

  try {
    const tokenLimpio = token.replace('Bearer ', '');
    const usuario = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
    req.usuario = usuario;
    next();
  } catch (error) {
    res.status(403).json({ mensaje: 'Token inválido o expirado.' });
  }
};

module.exports = verificarToken;
