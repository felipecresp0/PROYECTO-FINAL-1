/**
 * GULA Hamburguesas - Admin Panel Script
 * This script handles the admin panel functionality
 * and connects with the backend API
 */

// Get authentication token from localStorage
const token = localStorage.getItem('token');
const urlBase = 'http://localhost:3000/api/hamburguesas';

document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 GULA Admin Panel Successfully Loaded - Infernal Mode Activated");
  
  // DOM element references
  const searchToggle = document.getElementById("search-toggle");
  const searchOverlay = document.querySelector(".search-overlay");
  const closeSearch = document.querySelector(".close-search");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  
  // Initialize data loading
  cargarHamburguesas();
  
  // Setup restaurant selector if exists
  const selector = document.getElementById('selector-restaurante');
  if (selector) {
    cargarRestaurantes();
    selector.addEventListener('change', cargarReservasPorRestaurante);
  }

  // Verify if token exists
  if (!token) {
    mostrarNotificacion('No session found. Some functions will be limited', 'error');
  }

  // Event listener for burger form
  const formHamburguesa = document.getElementById('form-hamburguesa');
  if (formHamburguesa) {
    formHamburguesa.addEventListener('submit', crearHamburguesa);
  }

  // Event listener for employee form
  const formEmpleado = document.getElementById('form-empleado');
  if (formEmpleado) {
    formEmpleado.addEventListener('submit', registrarEmpleado);
  }

  // Search Overlay Functionality
  if (searchToggle && searchOverlay && closeSearch) {
    searchToggle.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        document.querySelector(".search-input-overlay").focus();
      }, 100);
    });
    
    closeSearch.addEventListener("click", () => {
      searchOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
    
    // Close search with ESC key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = "";
      }
    });
  }
  
  // Mobile menu functionality
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      
      // Add close button if it doesn't exist
      if (!navLinks.querySelector('.close-menu')) {
        const closeButton = document.createElement('button');
        closeButton.className = 'close-menu';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        navLinks.prepend(closeButton);
        
        // Event to close
        closeButton.addEventListener('click', () => {
          navLinks.classList.remove('active');
        });
      }
    });
  }

  // Expose section change function to window object
  window.mostrarSeccion = function(seccion) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(el => {
      el.style.display = 'none';
    });
    
    // Show selected section
    const targetSection = document.getElementById('seccion-' + seccion);
    if (targetSection) {
      targetSection.style.display = 'block';
    }
    
    // Update active buttons
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    
    // Find corresponding button and activate it
    document.querySelectorAll('.admin-nav-btn').forEach(btn => {
      if (btn.onclick && btn.onclick.toString().includes(seccion)) {
        btn.classList.add('active');
      }
    });
    
    // Load specific data if necessary
    if (seccion === 'reservas') cargarReservas();
    if (seccion === 'ventas') cargarDatosVentas();
  };

  // Expose functions for burger and reservation actions
  window.eliminarHamburguesa = eliminarHamburguesa;
  window.eliminarReserva = eliminarReserva;
  window.editarHamburguesa = editarHamburguesa;
  window.confirmarReserva = confirmarReserva;

  // Initialize scroll animations
  const elements = document.querySelectorAll('.admin-card, .admin-header');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });
  
  elements.forEach(element => {
    element.classList.add('animate-on-scroll');
    observer.observe(element);
  });
  
  // Initialize cart counter
  const cartCountElement = document.querySelector('.cart-count');
  if (cartCountElement) {
    updateCartCount();
  }
  
  // Add hover effects to navigation
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (!item.classList.contains('active')) {
        item.style.color = '#ff0066';
        item.style.textShadow = '0 0 10px rgba(255, 0, 102, 0.7), 0 0 20px rgba(255, 0, 102, 0.5)';
      }
    });
    item.addEventListener('mouseleave', () => {
      if (!item.classList.contains('active')) {
        item.style.color = '';
        item.style.textShadow = '';
      }
    });
  });
  
  // Create fire particle effect
  createFireEffect();
  
  // Floating devil appearance (Admin special)
  setTimeout(() => {
    const floatingDevil = document.getElementById('floating-devil');
    if (floatingDevil) {
      floatingDevil.classList.remove('hidden');
      
      floatingDevil.addEventListener('click', () => {
        mostrarNotificacion('Admin powers activated! 👑', 'success');
      });
    }
  }, 3000);
  
  // Random neon effect in header elements
  setInterval(() => {
    const randomElement = document.querySelectorAll('.nav-links a, .header-right i')[Math.floor(Math.random() * 5)];
    if (randomElement) {
      randomElement.style.textShadow = '0 0 15px rgba(255, 0, 102, 1), 0 0 30px rgba(255, 0, 102, 0.8)';
      
      setTimeout(() => {
        randomElement.style.textShadow = '';
      }, 500);
    }
  }, 3000);
  
  // Load initial sales data
  cargarDatosVentas();
});

/**
 * Function to create a new burger
 */
async function crearHamburguesa(e) {
  e.preventDefault();
  
  // Verify if token exists
  if (!token) {
    mostrarNotificacion('Token not found. Please log in.', 'error');
    return;
  }
  
  // Get form data
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const precio = document.getElementById('precio').value;
  const categoria = document.getElementById('categoria').value;
  
  // Prepare message for DOM visualization
  const mensajeElement = document.getElementById('mensaje');
  
  try {
    // Loading animation
    mensajeElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating burger...';
    mensajeElement.className = 'admin-message info';
    
    // POST request to API
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
        categoria: categoria
      })
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      // Update UI on success
      mensajeElement.innerHTML = '<i class="fas fa-check-circle"></i> Burger created successfully';
      mensajeElement.className = 'admin-message success';
      mostrarNotificacion('Burger created successfully', 'success');
      
      // Reset form and reload list
      e.target.reset();
      cargarHamburguesas();
    } else {
      // Show API error
      mensajeElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${datos.mensaje || datos.error}`;
      mensajeElement.className = 'admin-message error';
      mostrarNotificacion(datos.mensaje || datos.error, 'error');
    }
  } catch (error) {
    console.error(error);
    mensajeElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error creating burger';
    mensajeElement.className = 'admin-message error';
    mostrarNotificacion('Connection error creating burger', 'error');
  }
}

/**
 * Function to load burgers from API
 */
async function cargarHamburguesas() {
  if (!token) {
    mostrarNotificacion('Token not found. Cannot load burgers', 'error');
    return;
  }

  try {
    const res = await fetch(urlBase, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (!res.ok) {
      throw new Error('Error in server response');
    }
    
    const hamburguesas = await res.json();
    const tbody = document.getElementById('lista-hamburguesas');
    
    if (!tbody) {
      console.error('Element lista-hamburguesas not found');
      return;
    }
    
    tbody.innerHTML = '';

    if (hamburguesas.length === 0) {
      // Show message if no burgers
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td colspan="5" style="text-align: center; color: var(--text-dark);">No burgers registered</td>
      `;
      tbody.appendChild(fila);
      return;
    }

    hamburguesas.forEach(h => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${h.nombre}</td>
        <td>${h.descripcion}</td>
        <td style="color: var(--secondary-color); font-weight: bold;">${h.precio} €</td>
        <td><span class="status-confirmed">${h.categoria || 'Sin Category'}</span></td>
        <td>
          <button class="admin-btn-action edit" onclick="editarHamburguesa(${h.id})" title="Edit">
            <i class="fas fa-edit"></i>
          </button>
          <button class="admin-btn-action delete" onclick="eliminarHamburguesa(${h.id})" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  } catch (err) {
    console.error('Error loading burgers:', err);
    mostrarNotificacion('Error loading burgers', 'error');
  }
}

/**
 * Function to delete a burger
 */
async function eliminarHamburguesa(id) {
  if (!confirm('Are you sure you want to delete this burger?')) return;

  try {
    const res = await fetch(`${urlBase}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const datos = await res.json();

    if (res.ok) {
      mostrarNotificacion('Burger deleted successfully', 'success');
      cargarHamburguesas();
    } else {
      mostrarNotificacion('Error: ' + datos.mensaje, 'error');
    }
  } catch (err) {
    console.error('Error deleting:', err);
    mostrarNotificacion('Connection error deleting burger', 'error');
  }
}

/**
 * Function to edit a burger
 */
function editarHamburguesa(id) {
  // This function could be implemented later
  mostrarNotificacion('Edit function not implemented yet', 'info');
}

/**
 * Function to load reservations
 */
async function cargarReservas() {
  if (!token) {
    mostrarNotificacion('Token not found. Cannot load reservations', 'error');
    return;
  }

  try {
    const res = await fetch('http://localhost:3000/api/admin/reservas', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      throw new Error('Error in server response');
    }

    const reservas = await res.json();
    const tbody = document.getElementById('tabla-reservas-body');
    
    if (!tbody) {
      console.error('Element tabla-reservas-body not found');
      return;
    }
    
    tbody.innerHTML = '';

    if (reservas.length === 0) {
      // Show message if no reservations
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td colspan="8" style="text-align: center; color: var(--text-dark);">No reservations registered</td>
      `;
      tbody.appendChild(fila);
      return;
    }

    reservas.forEach(r => {
      const fila = document.createElement('tr');
      const estado = r.estado || 'Pending';
      const estadoClass = estado.toLowerCase() === 'confirmed' ? 'status-confirmed' : 'status-pending';
      
      fila.innerHTML = `
        <td style="color: var(--accent-color); font-weight: bold;">${r.id}</td>
        <td>${r.usuario?.email || 'Unknown user'}</td>
        <td style="color: var(--secondary-color);">${r.fecha}</td>
        <td style="color: var(--secondary-color);">${r.hora}</td>
        <td style="text-align: center; font-weight: bold;">${r.personas}</td>
        <td>${r.restaurante?.nombre || 'Not specified'}</td>
        <td><span class="${estadoClass}">${estado}</span></td>
        <td>
          ${estado.toLowerCase() !== 'confirmed' ? 
            `<button class="admin-btn-action confirm" onclick="confirmarReserva(${r.id})" title="Confirm">
              <i class="fas fa-check"></i>
            </button>` : ''}
          <button class="admin-btn-action delete" onclick="eliminarReserva(${r.id})" title="Delete">
            <i class="fas fa-times"></i>
          </button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error loading reservations:', error);
    mostrarNotificacion('Error loading reservations', 'error');
  }
}

/**
 * Function to delete a reservation
 */
async function eliminarReserva(id) {
  if (!confirm('Are you sure you want to delete this reservation?')) return;

  try {
    const res = await fetch(`http://localhost:3000/api/admin/reservas/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (res.ok) {
      mostrarNotificacion('Reservation deleted successfully', 'success');
      cargarReservas();
    } else {
      mostrarNotificacion('Error deleting reservation', 'error');
    }
  } catch (error) {
    console.error('Error deleting reservation:', error);
    mostrarNotificacion('Connection error deleting reservation', 'error');
  }
}

/**
 * Function to confirm a reservation
 */
function confirmarReserva(id) {
  // This function could be implemented later
  mostrarNotificacion('Confirmation function not implemented yet', 'info');
}

/**
 * Function to load restaurants in selector
 */
async function cargarRestaurantes() {
  const selector = document.getElementById('selector-restaurante');
  if (!selector) return;
  
  try {
    const res = await fetch('http://localhost:3000/api/restaurantes');
    
    if (!res.ok) {
      throw new Error('Error loading restaurants');
    }
    
    const data = await res.json();
    
    // Keep "all" option
    selector.innerHTML = '<option value="todos">All restaurants</option>';
    
    data.forEach(r => {
      const opt = document.createElement('option');
      opt.value = r.id;
      opt.textContent = r.nombre;
      selector.appendChild(opt);
    });
  } catch (error) {
    console.error('Error loading restaurants:', error);
    mostrarNotificacion('Error loading restaurant list', 'error');
  }
}

/**
 * Function to load reservations filtered by restaurant
 */
async function cargarReservasPorRestaurante() {
  const selector = document.getElementById('selector-restaurante');
  const tabla = document.getElementById('tabla-reservas');
  
  if (!selector || !tabla || !token) return;
  
  const id = selector.value;
  
  // If "all", load all reservations
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
      throw new Error('Error loading reservations by restaurant');
    }
    
    const data = await res.json();
    const tbody = document.getElementById('tabla-reservas-body');
    
    if (!tbody) {
      console.error('Element tabla-reservas-body not found');
      return;
    }
    
    tbody.innerHTML = '';
    
    if (data.length === 0) {
      // Show message if no reservations
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td colspan="8" style="text-align: center; color: var(--text-dark);">No reservations for this restaurant</td>
      `;
      tbody.appendChild(fila);
      return;
    }
    
    data.forEach(r => {
      const fila = document.createElement('tr');
      const estado = r.estado || 'Pending';
      const estadoClass = estado.toLowerCase() === 'confirmed' ? 'status-confirmed' : 'status-pending';
      
      fila.innerHTML = `
        <td style="color: var(--accent-color); font-weight: bold;">${r.id}</td>
        <td>${r.usuario?.email || 'Unknown user'}</td>
        <td style="color: var(--secondary-color);">${r.fecha}</td>
        <td style="color: var(--secondary-color);">${r.hora}</td>
        <td style="text-align: center; font-weight: bold;">${r.personas}</td>
        <td>${r.restaurante?.nombre || 'Not specified'}</td>
        <td><span class="${estadoClass}">${estado}</span></td>
        <td>
          ${estado.toLowerCase() !== 'confirmed' ? 
            `<button class="admin-btn-action confirm" onclick="confirmarReserva(${r.id})" title="Confirm">
              <i class="fas fa-check"></i>
            </button>` : ''}
          <button class="admin-btn-action delete" onclick="eliminarReserva(${r.id})" title="Delete">
            <i class="fas fa-times"></i>
          </button>
        </td>
      `;
      tbody.appendChild(fila);
    });
  } catch (error) {
    console.error('Error loading reservations by restaurant:', error);
    mostrarNotificacion('Error loading filtered reservations', 'error');
  }
}

/**
 * Function to register a new employee
 */
async function registrarEmpleado(e) {
  e.preventDefault();
  
  if (!token) {
    mostrarNotificacion('Token not found. Please log in', 'error');
    return;
  }
  
  const nombre = document.getElementById('empleado-nombre').value;
  const email = document.getElementById('empleado-email').value;
  const password = document.getElementById('empleado-password').value;
  const puesto = document.getElementById('empleado-puesto')?.value || 'waiter';
  const restaurante = document.getElementById('empleado-restaurante')?.value || 'madrid';
  
  const mensajeElement = document.getElementById('mensaje-empleado');
  
  try {
    // Loading animation
    mensajeElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registering employee...';
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
        rol: "EMPLOYEE",
        puesto: puesto,
        restaurante: restaurante
      })
    });

    const datos = await res.json();

    if (res.ok) {
      mensajeElement.innerHTML = '<i class="fas fa-check-circle"></i> Employee registered successfully';
      mensajeElement.className = 'admin-message success';
      mostrarNotificacion('Employee registered successfully', 'success');
      e.target.reset();
    } else {
      mensajeElement.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${datos.mensaje || datos.error}`;
      mensajeElement.className = 'admin-message error';
      mostrarNotificacion(datos.mensaje || datos.error, 'error');
    }
  } catch (err) {
    console.error('Error registering employee:', err);
    mensajeElement.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error registering employee';
    mensajeElement.className = 'admin-message error';
    mostrarNotificacion('Connection error registering employee', 'error');
  }
}

/**
 * Function to load sales data
 */
function cargarDatosVentas() {
  // Simulated data - replace with real API calls
  const ventasHoy = document.getElementById('ventas-hoy');
  const hamburguesasVendidas = document.getElementById('hamburguesas-vendidas');
  const clientesActivos = document.getElementById('clientes-activos');
  const reservasHoy = document.getElementById('reservas-hoy');
  
  if (ventasHoy) ventasHoy.textContent = '€2,450.00';
  if (hamburguesasVendidas) hamburguesasVendidas.textContent = '156';
  if (clientesActivos) clientesActivos.textContent = '89';
  if (reservasHoy) reservasHoy.textContent = '23';
  
  // Animate numbers
  animateNumbers();
}

/**
 * Function to animate numbers in stats
 */
function animateNumbers() {
  const statValues = document.querySelectorAll('.stat-value');
  
  statValues.forEach(stat => {
    const text = stat.textContent;
    const number = parseFloat(text.replace(/[^\d.]/g, ''));
    
    if (!isNaN(number)) {
      let current = 0;
      const increment = number / 50;
      const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
          current = number;
          clearInterval(timer);
        }
        
        if (text.includes('€')) {
          stat.textContent = `€${current.toFixed(2)}`;
        } else {
          stat.textContent = Math.floor(current).toString();
        }
      }, 20);
    }
  });
}

/**
 * Function to create fire particle effect
 */
function createFireEffect() {
  setInterval(() => {
    // Create particle
    const particle = document.createElement('div');
    particle.className = 'fire-particle';
    
    // Random position at bottom of screen
    const posX = Math.random() * window.innerWidth;
    particle.style.left = `${posX}px`;
    particle.style.bottom = '0';
    
    // Random color between red and orange
    const hue = Math.floor(Math.random() * 30);
    const saturation = 90 + Math.floor(Math.random() * 10);
    const lightness = 50 + Math.floor(Math.random() * 10);
    particle.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // Random size
    const size = 5 + Math.random() * 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Add to DOM
    document.body.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
      particle.remove();
    }, 3000);
  }, 400);
}

/**
 * Function to show visual notifications
 */
function mostrarNotificacion(mensaje, tipo = 'success') {
  const notificacion = document.getElementById('notification');
  if (!notificacion) {
    // If notification element doesn't exist, use alert as fallback
    alert(mensaje);
    return;
  }
  
  const mensajeElement = notificacion.querySelector('.notification-message');
  const iconElement = notificacion.querySelector('.notification-icon');
  
  // Set message
  mensajeElement.textContent = mensaje;
  
  // Set icon according to type
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
  
  // Show notification
  notificacion.classList.add('show');
  
  // Hide after 4 seconds
  setTimeout(() => {
    notificacion.classList.remove('show');
  }, 4000);
}

/**
 * Update cart counter
 */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountElement = document.querySelector('.cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
    
    // Add highlight class if there are items
    if (cart.length > 0) {
      cartCountElement.classList.add('highlighted');
    } else {
      cartCountElement.classList.remove('highlighted');
    }
  }
}

// Add CSS styles for mobile navigation
const styleElement = document.createElement('style');
styleElement.textContent = `
  .fire-particle {
    position: fixed;
    pointer-events: none;
    width: 10px;
    height: 10px;
    background-color: var(--primary-color);
    border-radius: 50%;
    opacity: 0;
    z-index: 1;
    animation: float-up 3s ease-out;
  }
  
  @keyframes float-up {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0.8;
    }
    100% {
      transform: translateY(-100px) scale(0);
      opacity: 0;
    }
  }
  
  /* Mobile navigation styles */
  @media (max-width: 767px) {
    .nav-links {
      position: fixed;
      top: 0;
      left: -100%;
      width: 280px;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.95);
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      transition: left 0.3s ease;
      z-index: 2000;
      border-right: 2px solid var(--primary-color);
      box-shadow: 0 0 30px rgba(255, 0, 102, 0.5);
    }
    
    .nav-links.active {
      left: 0;
    }
    
    .nav-links a {
      font-size: 1.5rem;
      padding: 1rem;
      width: 100%;
      text-align: center;
      border-bottom: 1px solid rgba(255, 0, 102, 0.3);
    }
    
    .close-menu {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      color: var(--primary-color);
      font-size: 1.5rem;
      cursor: pointer;
    }
  }
  
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
  }
  
  .animate-on-scroll.animated {
    opacity: 1;
    transform: translateY(0);
  }
`;

document.head.appendChild(styleElement);