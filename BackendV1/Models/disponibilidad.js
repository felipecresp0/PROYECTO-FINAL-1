const db = require('./conexionBD');

// Obtener disponibilidad para una fecha específica
const obtenerDisponibilidadPorFecha = async (restauranteId, fecha) => {
  const resultado = await db.query(
    `SELECT id, hora, mesas_disponibles, capacidad_total 
     FROM disponibilidad 
     WHERE restaurante_id = $1 AND fecha = $2
     ORDER BY hora`,
    [restauranteId, fecha]
  );
  return resultado.rows;
};

// Actualizar disponibilidad al crear/cancelar una reserva
const actualizarDisponibilidad = async (restauranteId, fecha, hora, cambioMesas, cambioCapacidad) => {
  // Primero verificamos si ya existe un registro para esa fecha y hora
  const existente = await db.query(
    `SELECT id FROM disponibilidad 
     WHERE restaurante_id = $1 AND fecha = $2 AND hora = $3`,
    [restauranteId, fecha, hora]
  );

  if (existente.rows.length > 0) {
    // Actualizar registro existente
    const resultado = await db.query(
      `UPDATE disponibilidad 
       SET mesas_disponibles = mesas_disponibles + $1,
           capacidad_total = capacidad_total + $2
       WHERE id = $3
       RETURNING *`,
      [cambioMesas, cambioCapacidad, existente.rows[0].id]
    );
    return resultado.rows[0];
  } else {
    // Crear nuevo registro
    // Obtenemos primero la cantidad total de mesas para el restaurante
    const totalMesas = await db.query(
      'SELECT COUNT(*) FROM mesas WHERE restaurante_id = $1',
      [restauranteId]
    );
    
    const mesasIniciales = parseInt(totalMesas.rows[0].count);
    
    // Obtenemos la capacidad total
    const capacidadQuery = await db.query(
      'SELECT SUM(capacidad) FROM mesas WHERE restaurante_id = $1',
      [restauranteId]
    );
    
    const capacidadInicial = parseInt(capacidadQuery.rows[0].sum || 0);

    // Crear nuevo registro con valores iniciales
    const resultado = await db.query(
      `INSERT INTO disponibilidad 
       (restaurante_id, fecha, hora, mesas_disponibles, capacidad_total)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [restauranteId, fecha, hora, mesasIniciales + cambioMesas, capacidadInicial + cambioCapacidad]
    );
    
    return resultado.rows[0];
  }
};

// Inicializar disponibilidad para un rango de fechas
const inicializarDisponibilidad = async (restauranteId, fechaInicio, fechaFin) => {
  // Primero obtenemos la lista de mesas
  const mesasQuery = await db.query(
    'SELECT COUNT(*), SUM(capacidad) FROM mesas WHERE restaurante_id = $1',
    [restauranteId]
  );
  
  const totalMesas = parseInt(mesasQuery.rows[0].count || 0);
  const capacidadTotal = parseInt(mesasQuery.rows[0].sum || 0);
  
  // Horas predefinidas (ajustar según necesidades)
  const horas = ['12:00', '13:00', '14:00', '15:00', '20:00', '21:00', '22:00', '23:00'];
  
  // Insertar o actualizar disponibilidad para cada fecha y hora
  for (let fecha = new Date(fechaInicio); fecha <= new Date(fechaFin); fecha.setDate(fecha.getDate() + 1)) {
    const fechaStr = fecha.toISOString().split('T')[0];
    
    for (const hora of horas) {
      await db.query(
        `INSERT INTO disponibilidad 
         (restaurante_id, fecha, hora, mesas_disponibles, capacidad_total)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (restaurante_id, fecha, hora) 
         DO UPDATE SET mesas_disponibles = $4, capacidad_total = $5`,
        [restauranteId, fechaStr, hora, totalMesas, capacidadTotal]
      );
    }
  }
  
  return { mensaje: 'Disponibilidad inicializada correctamente' };
};

module.exports = {
  obtenerDisponibilidadPorFecha,
  actualizarDisponibilidad,
  inicializarDisponibilidad
};