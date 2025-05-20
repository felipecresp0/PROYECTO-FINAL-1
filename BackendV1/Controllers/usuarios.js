const { crearUsuario, obtenerUsuarioPorEmail } = require('../Models/usuario');
const { encriptar, comparar } = require('../util/encriptarContrasena');


const generarToken = require('../util/generarJWT');

const registrar = async (req, res) => {
  const { nombre, email, contrasena } = req.body;
  try {
    const existe = await obtenerUsuarioPorEmail(email);
    if (existe) return res.status(400).json({ mensaje: 'El correo ya está registrado.' });

    const hash = await encriptar(contrasena);
    const nuevoUsuario = await crearUsuario(nombre, email, hash);

    res.status(201).json({ mensaje: 'Usuario creado con éxito', usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const login = async (req, res) => {
  const { email, contrasena } = req.body;
  try {
    const usuario = await obtenerUsuarioPorEmail(email);
    if (!usuario) return res.status(400).json({ mensaje: 'Credenciales incorrectas.' });

    const coincide = await comparar(contrasena, usuario.contrasena);
    if (!coincide) return res.status(400).json({ mensaje: 'Credenciales incorrectas.' });

    const token = generarToken(usuario);
    res.json({ mensaje: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { registrar, login };
