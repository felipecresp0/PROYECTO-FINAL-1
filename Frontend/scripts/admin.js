/**
 * GULA Hamburguesas - Script de Administración
 * Este script maneja la funcionalidad del panel de administración
 * y se conecta con la API de backend
 */

// Obtener token de autenticación del localStorage
const token = localStorage.getItem('token');
const urlBase = 'http://localhost:3000/api/hamburguesas';

document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 Panel de Administración GULA cargado");

  // Inicializar carga de datos
  cargarHamburguesas();
  
  // Configurar el selector de restaurantes si existe
  const selector = document.getElementById('selector-restaurante');
  if (selector) {
    cargarRestaurantes();
    selector.addEventListener('change', cargarReservasPorRestaurante);
  }

  // Verificar si el token existe
  if (!token) {
    mostrarNotificacion('No has iniciado sesión. Algunas funciones estarán limitadas', 'error');
  }

  // Event listener para el formulario de hamburguesa
  const formHamburguesa = document.getElementById('form-hamburguesa');
  if (formHamburguesa) {
    formHamburguesa.addEventListener('submit', crearHamburguesa);
  }

  // Event listener para el formulario de empleado
  const formEmpleado = document.getElementById('form-empleado');
  if (formEmpleado) {
    formEmpleado.addEventListener('submit', registrarEmpleado);
  }

  // Exponer función de cambio de sección al objeto window
  window.mostrarSeccion = function(seccion) {
    // Ocultar todas las secciones
    document.querySelectorAll('.admin-section').forEach(el => {
      el.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    document.getElementById('seccion-' + seccion).style.display = 'block';
    
    // Actualizar botones activos
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Encontrar el botón correspondiente y activarlo
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      if (btn.innerText.toLowerCase().includes(seccion)) {
        btn.classList.add('active');
      }
    });
    
    // Cargar datos específicos si es necesario
    if (seccion === 'reservas') cargarReservas();
  };

  // Exponer funciones para acciones de hamburguesas y reservas
  window.eliminarHamburguesa = eliminarHamburguesa;
  window.eliminarReserva = eliminarReserva;
});

/**
 * Función para crear una nueva hamburguesa
 */
async function crearHamburguesa(e) {
  e.preventDefault();
  
  // Verificar si hay token
  if (!token) {
    mostrarNotificacion('Token no encontrado. Inicia sesión.', 'error');
    return;
  }
  
  // Obtener datos del formulario
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const precio = document.getElementById('precio').value;
  const categoria = document.getElementById('categoria').value;
  
  // Preparar mensaje para visualización en el DOM
  const mensajeElement = document.getElementById('mensaje');
  
  try {
    // Animación de cargando
    mensajeElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creando hamburguesa...';
    mensajeElement.className = 'admin-message info';
    
    // Petición POST a la API
    const respuesta = await fetch(`${urlBase}/nueva`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        nombre, 
        descripcion, 
        precio,
        categoria: categoria // Añadir categoría si tu API lo soporta
      })
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      // Actualizar UI en éxito
      mensajeElement.innerHTML = '<i class="fas fa-check-circle"></i> Hamburguesa creada con éxito';
      mensajeElement.className = 'admin-message success';
      mostrarNotificacion('Hamburguesa creada correctamente', 'success');
      
      // Resetear formulario y recargar lista
      e.target.reset();
      cargarHamburguesas();
    } else {
      // Mostrar error de la API
      mensajeElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${datos.mensaje || datos.error}`;
      mensajeElement.className = 'admin-message error';
      mostrarNotificacion(datos.mensaje || datos.error, 'error');
    }
  } catch (error) {
    console.error(error);
    mensajeElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error al crear hamburguesa';
    mensajeElement.className = 'admin-message error';
    mostrarNotificacion('Error de conexión al crear hamburguesa', 'error');
  }
}

/**
 * Función para cargar hamburguesas desde la API
 */
async function cargarHamburguesas() {
  if (!token) {
    mostrarNotificacion('Token no encontrado. No se pueden cargar las hamburguesas', 'error');
    return;
  }

  try {
    const res = await fetch(urlBase, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      throw new Error('Error en la respuesta del servidor');
    }
    
    const hamburguesas = await res.json();
    const tbody = document.getElementById('lista-hamburguesas');
    
    if (!tbody) {
      console.error('No se encontró el elemento lista-hamburguesas');
      return;
    }
    
    tbody.innerHTML = '';

    if (hamburguesas.length === 0) {
      // Mostrar mensaje si no hay hamburguesas
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td colspan="5" style="text-align: center;">No hay hamburguesas registradas</td>
      `;
      tbody.appendChild(fila);
      return;
    }

    hamburguesas.forEach(h => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${h.nombre}</td>
        <td>${h.descripcion}</td>
        <td>${h.precio} €</td>
        <td>${h.categoria || 'Pecado Capital'}</td>
        <td>
          <button class="admin-btn-action edit" onclick="editarHamburguesa(${h.id})">
            <i class="fas fa-edit"></i>
          </button>
          <button class="admin-btn-action delete" onclick="eliminarHamburguesa(${h.id})">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  } catch (err) {
    console.error('Error al cargar hamburguesas:', err);
    mostrarNotificacion('Error al cargar las hamburguesas', 'error');
  }
}

/**
 * Función para eliminar una hamburguesa
 */
async function eliminarHamburguesa(id) {
  if (!confirm('¿Seguro que deseas eliminar esta hamburguesa?')) return;

  try {
    const res = await fetch(`${urlBase}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const datos = await res.json();

    if (res.ok) {
      mostrarNotificacion('Hamburguesa eliminada correctamente', 'success');
      cargarHamburguesas();
    } else {
      mostrarNotificacion('Error: ' + datos.mensaje, 'error');
    }
  } catch (err) {
    console.error('Error al eliminar:', err);
    mostrarNotificacion('Error de conexión al eliminar hamburguesa', 'error');
  }
}

/**
 * Placeholder para la función de editar hamburguesa
 */
function editarHamburguesa(id) {
  // Esta función podría implementarse más adelante
  mostrarNotificacion('Función de edición no implementada', 'info');
}

/**
 * Función para cargar las reservas
 */
async function cargarReservas() {
  if (!token) {
    mostrarNotificacion('Token no encontrado. No se pueden cargar las reservas', 'error');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/admin/reservas', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Error en la respuesta del servidor');
    }

    const reservas = await res.json();
    const tbody = document.getElementById('tabla-reservas-body');
    
    if (!tbody) {
      console.error('No se encontró el elemento tabla-reservas-body');
      return;
    }
    
    tbody.innerHTML = '';

    if (reservas.length === 0) {
      // Mostrar mensaje si no hay reservas
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td colspan="8" style="text-align: center;">No hay reservas registradas</td>
      `;
      tbody.appendChild(fila);
      return;
    }

    reservas.forEach(r => {
      const fila = document.createElement('tr');
      const estado = r.estado || 'Pendiente';
      const estadoClass = estado.toLowerCase() === 'confirmada' ? 'status-confirmed' : 'status-pending';
      
      fila.innerHTML = `
        <td>${r.id}</td>
        <td>${r.usuario?.email || 'Usuario desconocido'}</td>
        <td>${r.fecha}</td>
        <td>${r.hora}</td>
        <td>${r.personas}</td>
        <td>${r.restaurante?.nombre || 'No especificado'}</td>
        <td><span class="${estadoClass}">${estado}</span></td>
        <td>
          ${estado.toLowerCase() !== 'confirmada' ? 
            `<button class="admin-btn-action confirm" onclick="confirmarReserva(${r.id})">
              <i class="fas fa-check"></i>
            </button>` : ''}
          <button class="admin-btn-action delete" onclick="eliminarReserva(${r.id})">
            <i class="fas fa-times"></i>
          </button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error al cargar reservas:', error);
    mostrarNotificacion('Error al cargar las reservas', 'error');
  }
}

/**
 * Función para eliminar una reserva
 */
async function eliminarReserva(id) {
  if (!confirm('¿Estás seguro de eliminar esta reserva?')) return;

  try {
    const res = await fetch(`http://localhost:3000/api/admin/reservas/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      mostrarNotificacion('Reserva eliminada correctamente', 'success');
      cargarReservas();
    } else {
      mostrarNotificacion('Error al eliminar reserva', 'error');
    }
  } catch (error) {
    console.error('Error al eliminar reserva:', error);
    mostrarNotificacion('Error de conexión al eliminar reserva', 'error');
  }
}

/**
 * Placeholder para la función de confirmar reserva
 */
function confirmarReserva(id) {
  // Esta función podría implementarse más adelante
  mostrarNotificacion('Función de confirmación no implementada', 'info');
}

/**
 * Función para cargar restaurantes en el selector
 */
async function cargarRestaurantes() {
  const selector = document.getElementById('selector-restaurante');
  if (!selector) return;
  
  try {
    const res = await fetch('http://localhost:3000/api/restaurantes');
    
    if (!res.ok) {
      throw new Error('Error al cargar restaurantes');
    }
    
    const data = await res.json();
    
    // Mantener la opción "todos"
    selector.innerHTML = '<option value="todos">Todos los restaurantes</option>';
    
    data.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = r.nombre;
      selector.appendChild(opt);
    });
  } catch (error) {
    console.error('Error al cargar restaurantes:', error);
    mostrarNotificacion('Error al cargar la lista de restaurantes', 'error');
  }
}

/**
 * Función para cargar reservas filtradas por restaurante
 */
async function cargarReservasPorRestaurante() {
  const selector = document.getElementById('selector-restaurante');
  const tabla = document.getElementById('tabla-reservas');
  
  if (!selector || !tabla || !token) return;
  
  const id = selector.value;
  
  // Si es "todos", cargar todas las reservas
  if (id === 'todos') {
    cargarReservas();
    return;
  }
  
  try {
    const res = await fetch(`http://localhost:3000/api/reservas/restaurante/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      throw new Error('Error al cargar reservas por restaurante');
    }
    
    const data = await res.json();
    const tbody = document.getElementById('tabla-reservas-body');
    
    if (!tbody) {
      console.error('No se encontró el elemento tabla-reservas-body');
      return;
    }
    
    tbody.innerHTML = '';
    
    if (data.length === 0) {
      // Mostrar mensaje si no hay reservas
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td colspan="8" style="text-align: center;">No hay reservas para este restaurante</td>
      `;
      tbody.appendChild(fila);
      return;
    }
    
    data.forEach(r => {
      const fila = document.createElement('tr');
      const estado = r.estado || 'Pendiente';
      const estadoClass = estado.toLowerCase() === 'confirmada' ? 'status-confirmed' : 'status-pending';
      
      fila.innerHTML = `
        <td>${r.id}</td>
        <td>${r.usuario?.email || 'Usuario desconocido'}</td>
        <td>${r.fecha}</td>
        <td>${r.hora}</td>
        <td>${r.personas}</td>
        <td>${r.restaurante?.nombre || 'No especificado'}</td>
        <td><span class="${estadoClass}">${estado}</span></td>
        <td>
          ${estado.toLowerCase() !== 'confirmada' ? 
            `<button class="admin-btn-action confirm" onclick="confirmarReserva(${r.id})">
              <i class="fas fa-check"></i>
            </button>` : ''}
          <button class="admin-btn-action delete" onclick="eliminarReserva(${r.id})">
            <i class="fas fa-times"></i>
          </button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error al cargar reservas por restaurante:', error);
    mostrarNotificacion('Error al cargar las reservas filtradas', 'error');
  }
}

/**
 * Función para registrar un nuevo empleado
 */
async function registrarEmpleado(e) {
  e.preventDefault();
  
  if (!token) {
    mostrarNotificacion('Token no encontrado. Inicia sesión', 'error');
    return;
  }
  
  const nombre = document.getElementById('empleado-nombre').value;
  const email = document.getElementById('empleado-email').value;
  const password = document.getElementById('empleado-password').value;
  const puesto = document.getElementById('empleado-puesto')?.value || 'camarero';
  const restaurante = document.getElementById('empleado-restaurante')?.value || 'centro';
  
  const mensajeElement = document.getElementById('mensaje-empleado');
  
  try {
    // Animación de cargando
    mensajeElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando empleado...';
    mensajeElement.className = 'admin-message info';
    
    const res = await fetch('http://localhost:8080/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        nombre, 
        email, 
        password, 
        rol: "EMPLEADO",
        puesto: puesto, // Añadir si tu API lo soporta
        restaurante: restaurante // Añadir si tu API lo soporta
      })
    });

    const datos = await res.json();

    if (res.ok) {
      mensajeElement.innerHTML = '<i class="fas fa-check-circle"></i> Empleado registrado correctamente';
      mensajeElement.className = 'admin-message success';
      mostrarNotificacion('Empleado registrado correctamente', 'success');
      e.target.reset();
    } else {
      mensajeElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${datos.mensaje || datos.error}`;
      mensajeElement.className = 'admin-message error';
      mostrarNotificacion(datos.mensaje || datos.error, 'error');
    }
  } catch (err) {
    console.error('Error al registrar empleado:', err);
    mensajeElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error al registrar empleado';
    mensajeElement.className = 'admin-message error';
    mostrarNotificacion('Error de conexión al registrar empleado', 'error');
  }
}

/**
 * Función para mostrar notificaciones visuales
 */
function mostrarNotificacion(mensaje, tipo = 'success') {
  const notificacion = document.getElementById('notification');
  if (!notificacion) {
    // Si no existe el elemento de notificación, usar alert como fallback
    alert(mensaje);
    return;
  }
  
  const mensajeElement = notificacion.querySelector('.notification-message');
  const iconElement = notificacion.querySelector('.notification-icon');
  
  // Establecer mensaje
  mensajeElement.textContent = mensaje;
  
  // Establecer icono según tipo
  if (tipo === 'success') {
    iconElement.className = 'notification-icon fas fa-check-circle';
    notificacion.className = 'notification success';
  } else if (tipo === 'error') {
    iconElement.className = 'notification-icon fas fa-exclamation-circle';
    notificacion.className = 'notification error';
  } else {
    iconElement.className = 'notification-icon fas fa-info-circle';
    notificacion.className = 'notification info';
  }
  
  // Mostrar notificación
  notificacion.classList.add('show');
  
  // Ocultar después de 3 segundos
  setTimeout(() => {
    notificacion.classList.remove('show');
  }, 3000);
}