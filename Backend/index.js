const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json()); // 👈 ¡ESTO ES CLAVE!

const rutasUsuarios = require('./routes/usuarios');
app.use('/api/usuarios', rutasUsuarios);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor funcionando en puerto ${PORT}`));

const rutasHamburguesas = require('./routes/hamburguesas');
app.use('/api/hamburguesas', rutasHamburguesas);

