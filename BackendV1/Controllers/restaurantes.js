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

  // Inicializar mapa
  const mapa = L.map('restaurantes-mapa').setView([40.4168, -3.7038], 5);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> | <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
  }).addTo(mapa);

  const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div class="marker-icon"><i class="fas fa-fire"></i></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30]
  });

  async function cargarRestaurantesDesdeBackend() {
    try {
      const token = localStorage.getItem('token');
      console.log("Intentando cargar restaurantes desde el backend...");

      const response = await fetch("http://localhost:8080/api/restaurantes", {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      restaurantesData = await response.json();
      console.log("Datos de restaurantes cargados:", restaurantesData);
      
      
      
      actualizarMapaConRestaurantes(restaurantesData);
      actualizarRestaurantesDestacados();

    } catch (error) {
      console.error("Error cargando restaurantes desde el backend:", error);
      mostrarNotificacion("Error al cargar los restaurantes", "error");
    }
  }

  function actualizarMapaConRestaurantes(restaurantes) {
    mapa.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        mapa.removeLayer(layer);
      }
    });

    restaurantes.forEach(restaurant => {
      if (!restaurant.latitud || !restaurant.longitud) {
        console.warn("Restaurante sin coordenadas:", restaurant);
        return;
      }

      const marker = L.marker([restaurant.latitud, restaurant.longitud], { icon: customIcon }).addTo(mapa);
      const horario = `${restaurant.horario_apertura || ''} - ${restaurant.horario_cierre || ''}`;

      const popupContent = `
        <div class="restaurant-popup">
          <h3>${restaurant.nombre}</h3>
          <p>${restaurant.direccion}</p>
          <p>Horario: ${horario}</p>
          <button class="popup-reserve-btn" data-id="${restaurant.id}">Ver detalles</button>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('popupopen', function () {
        document.querySelector('.popup-reserve-btn').addEventListener('click', function () {
          const restaurantId = this.getAttribute('data-id');
          mostrarDetallesRestaurante(restaurantId);
        });
      });
    });

    if (restaurantes.length > 0) {
      const bounds = L.latLngBounds(restaurantes.map(r => [r.latitud, r.longitud]));
      mapa.fitBounds(bounds);
    }
  }

  function actualizarRestaurantesDestacados() {
    const destacadosContainer = document.querySelector('.featured-restaurants-grid');
    if (!destacadosContainer || restaurantesData.length === 0) return;

    const restaurantesDestacados = restaurantesData.filter(r => r.destacado === true).slice(0, 4);
    const restaurantesAMostrar = restaurantesDestacados.length > 0 ? restaurantesDestacados : restaurantesData.slice(0, 4);

    destacadosContainer.innerHTML = '';

    restaurantesAMostrar.forEach(restaurant => {
      const card = document.createElement('div');
      card.className = 'restaurant-card';

      const imagen = restaurant.imagen_url || `imagenes/restaurantes/restaurante-${(restaurant.id % 4) + 1}.jpg`;

      card.innerHTML = `
        <div class="restaurant-image">
          <img src="${imagen}" alt="${restaurant.nombre}">
          <span class="restaurant-badge">Destacado</span>
        </div>
        <div class="restaurant-info">
          <h3>${restaurant.nombre}</h3>
          <p><i class="fas fa-map-marker-alt"></i> ${restaurant.direccion}</p>
          <p><i class="fas fa-clock"></i> ${restaurant.horario_apertura || ''} - ${restaurant.horario_cierre || ''}</p>
          <button class="reserve-btn" data-restaurant="${restaurant.id}">Reservar</button>
        </div>
      `;

      destacadosContainer.appendChild(card);

      const reserveBtn = card.querySelector('.reserve-btn');
      reserveBtn.addEventListener('click', function () {
        const restaurantId = this.getAttribute('data-restaurant');
        window.location.href = `reservas.html?restaurante=${restaurantId}`;
      });
    });
  }

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const cp = document.getElementById('codigo-postal').value;
      console.log("Buscando por código postal:", cp);

      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/restaurantes/buscar?cp=${cp}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });

        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }

        const restaurantesFiltrados = await response.json();

        if (restaurantesFiltrados.length === 0) {
          mostrarNotificacion("No se encontraron restaurantes en tu zona", "error");
          return;
        }

        actualizarMapaConRestaurantes(restaurantesFiltrados);
        mostrarNotificacion(`Se encontraron ${restaurantesFiltrados.length} restaurantes en tu zona.`, "success");

      } catch (error) {
        console.error("Error en la búsqueda:", error);
        mostrarNotificacion("Error al realizar la búsqueda", "error");
      }
    });
  }

  async function mostrarDetallesRestaurante(restaurantId) {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/restaurantes/${restaurantId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });

      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const restaurant = await response.json();
      const horarioFormateado = `${restaurant.horario_apertura || '00:00'} - ${restaurant.horario_cierre || '00:00'}`;

      let fotosHTML = '';
      if (restaurant.fotos && restaurant.fotos.length > 0) {
        fotosHTML = `
          <div class="restaurant-photos">
            <h3><i class="fas fa-camera"></i> Fotos del restaurante</h3>
            <div class="photos-grid">
              ${restaurant.fotos.map(foto => `<img src="${foto.url}" alt="Foto del restaurante">`).join('')}
            </div>
          </div>
        `;
      }

      const valoracionHTML = restaurant.valoracion ? `
        <div class="valoracion">
          <span class="estrellas">${'★'.repeat(Math.round(parseFloat(restaurant.valoracion)))}</span>
          <span class="valoracion-numero">${restaurant.valoracion}/5</span>
          <span class="total-resenas">(${restaurant.total_resenas} reseñas)</span>
        </div>` : '';

      const infoRestaurante = `
        <div class="restaurant-detail-header">
          <img src="${restaurant.imagen_url || `imagenes/restaurantes/restaurante-${(restaurant.id % 4) + 1}.jpg`}" alt="${restaurant.nombre}" class="detail-image">
          <div class="detail-header-info">
            <h2>${restaurant.nombre || 'Sin nombre'}</h2>
            ${valoracionHTML}
            <p><i class="fas fa-map-marker-alt"></i> ${restaurant.direccion || 'Dirección no disponible'}</p>
            <p><i class="fas fa-phone"></i> ${restaurant.telefono || 'Teléfono no disponible'}</p>
            <p><i class="fas fa-clock"></i> ${horarioFormateado}</p>
          </div>
        </div>
        <div class="detail-info-grid">
          <div class="detail-info-block">
            <h3><i class="fas fa-info-circle"></i> Sobre el local</h3>
            <p>${restaurant.descripcion || 'Restaurante con capacidad para ' + (restaurant.capacidad || '0') + ' personas.'}</p>
          </div>
        </div>
        ${fotosHTML}
        <a href="reservas.html?restaurante=${restaurant.id}" class="detail-reserve-btn">RESERVAR MESA AHORA</a>
      `;

      if (restaurantContent) {
        restaurantContent.innerHTML = infoRestaurante;

        if (restaurantOverlay) {
          restaurantOverlay.classList.add('active');
          document.body.style.overflow = 'hidden';

          const closeButton = document.querySelector('.close-overlay');
          if (closeButton) {
            closeButton.addEventListener('click', function () {
              restaurantOverlay.classList.remove('active');
              document.body.style.overflow = '';
            });
          }
        }
      }
    } catch (error) {
      console.error("Error al cargar los detalles del restaurante:", error);
      mostrarNotificacion("Error al cargar los detalles del restaurante", "error");
    }
  }
  // Funcionalidad Search Overlay
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
  }

  // Menú móvil
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // Eventos para destacados ya renderizados
  const reserveBtns = document.querySelectorAll('.reserve-btn');
  reserveBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const restaurantId = this.getAttribute('data-restaurant');
      window.location.href = `reservas.html?restaurante=${restaurantId}`;
    });
  });

  // Notificación personalizada
  function mostrarNotificacion(mensaje, tipo) {
    const notificacionesExistentes = document.querySelectorAll('.notificacion');
    notificacionesExistentes.forEach(n => n.remove());

    const notificacion = document.createElement('div');
    notificacion.className = `notificacion ${tipo}`;

    const iconoHTML = tipo === 'success'
      ? '<i class="fas fa-check-circle"></i>'
      : '<i class="fas fa-exclamation-circle"></i>';

    notificacion.innerHTML = `
      <div class="notificacion-contenido">
        ${iconoHTML}
        <p>${mensaje}</p>
      </div>
    `;

    document.body.appendChild(notificacion);

    setTimeout(() => {
      notificacion.classList.add('show');
    }, 10);

    setTimeout(() => {
      notificacion.classList.remove('show');
      setTimeout(() => {
        notificacion.remove();
      }, 300);
    }, 4000);
  }

  // Efecto fuego
  function crearEfectoFuego() {
    setInterval(() => {
      const particle = document.createElement('div');
      particle.className = 'fire-particle';

      const posX = Math.random() * window.innerWidth;
      particle.style.left = `${posX}px`;
      particle.style.bottom = '0';

      const hue = Math.floor(Math.random() * 30);
      const saturation = 90 + Math.floor(Math.random() * 10);
      const lightness = 50 + Math.floor(Math.random() * 10);
      particle.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      const size = 5 + Math.random() * 10;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      document.body.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 3000);
    }, 300);
  }

  crearEfectoFuego();

  // Estilos dinámicos CSS
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    .notificacion {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background-color: #333;
      color: white;
      padding: 15px;
      border-radius: 4px;
      z-index: 2001;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s ease;
    }

    .notificacion.show {
      opacity: 1;
      transform: translateY(0);
    }

    .notificacion-contenido {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .notificacion-contenido i {
      font-size: 1.5rem;
    }

    .notificacion.success {
      border-left: 4px solid var(--secondary-color);
    }

    .notificacion.success i {
      color: var(--secondary-color);
    }

    .notificacion.error {
      border-left: 4px solid var(--primary-color);
    }

    .notificacion.error i {
      color: var(--primary-color);
    }

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

    .valoracion {
      display: flex;
      align-items: center;
      margin: 5px 0;
    }

    .estrellas {
      color: var(--primary-color);
      font-size: 1.5rem;
      margin-right: 10px;
    }

    .valoracion-numero {
      font-weight: bold;
      margin-right: 5px;
    }

    .total-resenas {
      color: #777;
      font-size: 0.9rem;
    }

    .photos-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 10px;
      margin-top: 15px;
    }

    .photos-grid img {
      width: 100%;
      height: 120px;
      object-fit: cover;
      border-radius: 4px;
      transition: transform 0.3s ease;
    }

    .photos-grid img:hover {
      transform: scale(1.05);
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
  `;

  document.head.appendChild(styleElement);

  // Cargar datos iniciales
  cargarRestaurantesDesdeBackend();
});
