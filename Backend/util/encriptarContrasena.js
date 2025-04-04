const bcrypt = require('bcrypt');

const encriptar = async (contrasena) => {
  const sal = await bcrypt.genSalt(10);
  return await bcrypt.hash(contrasena, sal);
};

const comparar = async (contrasena, hash) => {
  return await bcrypt.compare(contrasena, hash);
};

module.exports = { encriptar, comparar };
