document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 Página Restaurantes cargada correctamente - Modo Infernal activado");
  
  // Referencias a elementos DOM
  const searchToggle = document.getElementById("search-toggle");
  const searchOverlay = document.querySelector(".search-overlay");
  const closeSearch = document.querySelector(".close-search");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  const form = document.getElementById('busqueda-form');
  const restaurantOverlay = document.getElementById('restaurant-details-overlay');
  const restaurantContent = document.getElementById('restaurant-details-content');
  
  // Datos de los restaurantes
  let restaurantesData = [];
  
  // Inicializar mapa con estilo personalizado
  const mapa = L.map('restaurantes-mapa').setView([40.4168, -3.7038], 5); // Centrado en España
  
  // Estilo personalizado para el mapa
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(mapa);
  
  // Crear icono personalizado para los marcadores
  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-icon"><i class="fas fa-fire"></i></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });
  
  // Función para cargar los restaurantes desde el backend
  async function cargarRestaurantesDesdeBackend() {
    try {
      console.log("Intentando cargar restaurantes desde el backend...");
      
      const response = await fetch("http://localhost:8080/api/restaurantes", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // Si necesitas autenticación, añade el header 'Authorization'
        },
        // credentials: 'include' // Descomenta si necesitas enviar cookies
      });
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }
      
      restaurantesData = await response.json();
      console.log("Datos de restaurantes cargados:", restaurantesData);
      
      // Limpiar cualquier marcador existente
      mapa.eachLayer((layer) => {
        if (layer instanceof L.Marker) {
          mapa.removeLayer(layer);
        }
      });
      
      // Ahora que tenemos los datos, añadimos los marcadores al mapa
      restaurantesData.forEach(restaurant => {
        // Verificar que los datos contienen las propiedades esperadas
        if (!restaurant.latitud || !restaurant.longitud) {
          console.warn("Restaurante sin coordenadas:", restaurant);
          return;
        }
        
        const marker = L.marker([restaurant.latitud, restaurant.longitud], { icon: customIcon }).addTo(mapa);
        
        // Adaptar el formato según la estructura real de tus datos
        const popupContent = `
          <div class="restaurant-popup">
            <h3>${restaurant.nombre}</h3>
            <p>${restaurant.direccion}</p>
            <p>Horario: ${restaurant.horario_apertura} - ${restaurant.horario_cierre}</p>
            <button class="popup-reserve-btn" data-id="${restaurant.id}">Ver detalles</button>
          </div>
        `;
        
        marker.bindPopup(popupContent);
        
        marker.on('popupopen', function() {
          document.querySelector('.popup-reserve-btn').addEventListener('click', function() {
            const restaurantId = this.getAttribute('data-id');
            mostrarDetallesRestaurante(restaurantId);
          });
        });
      });
      
      // Ajustamos la vista para mostrar todos los restaurantes
      if (restaurantesData.length > 0) {
        // Crea un grupo de marcadores y ajusta la vista a ellos
        const bounds = L.latLngBounds(restaurantesData.map(r => [r.latitud, r.longitud]));
        mapa.fitBounds(bounds);
      }
      
    } catch (error) {
      console.error("Error cargando restaurantes desde el backend:", error);
      mostrarNotificacion("Error al cargar los restaurantes", "error");
    }
  }
  
  // Llamar a la función para cargar los restaurantes
  cargarRestaurantesDesdeBackend();
  
  // Resto del código... (comentado para simplificar)
  
  // Funcionalidad Search Overlay, menú móvil, etc.
  // ...
  
  // Mostrar notificaciones personalizadas
  function mostrarNotificacion(mensaje, tipo) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;
    
    let iconoHTML = tipo === 'success' 
      ? '<i class="fas fa-check-circle"></i>' 
      : '<i class="fas fa-exclamation-circle"></i>';
    
    notificacion.innerHTML = `
      <div class="notificacion-contenido">
        ${iconoHTML}
        <p>${mensaje}</p>
      </div>
    `;
    
    // Añadir al DOM
    document.body.appendChild(notificacion);
    
    // Mostrar con animación
    setTimeout(() => {
      notificacion.classList.add('show');
    }, 10);
    
    // Ocultar después de 4 segundos
    setTimeout(() => {
      notificacion.classList.remove('show');
      setTimeout(() => {
        notificacion.remove();
      }, 300);
    }, 4000);
  }

  // Función modificada para mostrar detalles del restaurante
  function mostrarDetallesRestaurante(restaurantId) {
    const restaurant = restaurantesData.find(r => r.id === parseInt(restaurantId));
    
    if (!restaurant) {
      console.error("Restaurante no encontrado:", restaurantId);
      mostrarNotificacion("No se pudo encontrar la información del restaurante", "error");
      return;
    }
    
    // Validar que las propiedades existan o proporcionar valores predeterminados
    // Adapta esto a la estructura real de tus datos
    const infoRestaurante = `
      <div class="restaurant-detail-header">
        <div class="detail-header-info">
          <h2>${restaurant.nombre || 'Sin nombre'}</h2>
          <p><i class="fas fa-map-marker-alt"></i> ${restaurant.direccion || 'Dirección no disponible'}</p>
          <p><i class="fas fa-phone"></i> ${restaurant.telefono || 'Teléfono no disponible'}</p>
          <p><i class="fas fa-clock"></i> ${restaurant.horario_apertura || '00:00'} - ${restaurant.horario_cierre || '00:00'}</p>
        </div>
      </div>
      
      <div class="detail-info-grid">
        <div class="detail-info-block">
          <h3><i class="fas fa-info-circle"></i> Sobre el local</h3>
          <p>Restaurante con capacidad para ${restaurant.capacidad || '0'} personas.</p>
        </div>
      </div>
      
      <a href="reservas.html?restaurante=${restaurant.id}" class="detail-reserve-btn">RESERVAR MESA AHORA</a>
    `;
    
    if (restaurantContent) {
      restaurantContent.innerHTML = infoRestaurante;
      
      // Mostrar el overlay
      if (restaurantOverlay) {
        restaurantOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Configurar cierre del overlay
        const closeButton = document.querySelector('.close-overlay');
        if (closeButton) {
          closeButton.addEventListener('click', function() {
            restaurantOverlay.classList.remove('active');
            document.body.style.overflow = '';
          });
        }
      }
    }
  }
  
  // Resto del código para efectos visuales, etc...
});