document.addEventListener('DOMContentLoaded', () => {
  const productosGrid = document.getElementById('productos-grid');
  const modal = document.getElementById('producto-modal');
  const closeModal = document.querySelector('.close-modal');
  const filtrosBtns = document.querySelectorAll('.filtro-btn');
  const categoriasItems = document.querySelectorAll('.categoria-item');
  let acompanantes = [];

  // Backend request
  async function fetchAcompanantes() {
    try {
      const response = await fetch("http://localhost:8080/api/productos/acompanantes");
      acompanantes = await response.json();
      cargarProductos(acompanantes);
    } catch (error) {
      console.error("Error loading sides:", error);
    }
  }

  fetchAcompanantes();

  // Categories (navigation)
  categoriasItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const destino = item.querySelector('.categoria-link').getAttribute('href');
      window.location.href = destino;
    });
  });

  // Filters
  filtrosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtrosBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filtro = btn.getAttribute('data-filter');
      if (filtro === 'all') {
        cargarProductos(acompanantes);
      } else {
        const productosFiltrados = acompanantes.filter(p => {
          if (filtro === 'bestseller' && p.badge === 'bestseller') return true;
          if (filtro === 'new' && p.nuevo) return true;
          if (filtro === 'spicy' && p.spicy) return true;
          if (filtro === 'vegan' && p.vegetariano) return true;
          return false;
        });
        cargarProductos(productosFiltrados);
      }
    });
  });

  // Close modal
  closeModal.addEventListener('click', () => cerrarModal());
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });
  window.addEventListener('click', (e) => { if (e.target === modal) cerrarModal(); });

  function cerrarModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  function cargarProductos(productosArray) {
    productosGrid.innerHTML = '';
    if (productosArray.length === 0) {
      productosGrid.innerHTML = `<div class="no-productos">
        <i class="fas fa-search"></i>
        <h3>No products available</h3>
        <p>Try changing the filters or select another category</p>
      </div>`;
      return;
    }

    productosArray.forEach(producto => {
      const card = document.createElement('div');
      card.className = 'producto-card';
      card.dataset.id = producto.id;

      const estrellas = generarEstrellas(producto.rating || 4.5);

      card.innerHTML = `
        ${producto.badge ? `<div class="producto-badge badge-${producto.badge}">${producto.badgeText}</div>` : ''}
        <div class="producto-img-container">
          <img src="${producto.imagenUrl}" alt="${producto.nombre}">
          <div class="producto-overlay"></div>
        </div>
        <div class="producto-content">
          <div>
            <h3 class="producto-nombre">${producto.nombre}</h3>
            <div class="estrellas-container">${estrellas}</div>
          </div>
          <div class="producto-footer">
            <span class="producto-precio">${producto.precio.toFixed(2)}€</span>
            <button class="add-btn"><i class="fas fa-plus"></i></button>
          </div>
        </div>`;

      card.addEventListener('click', () => abrirModal(producto));
      card.querySelector('.add-btn').addEventListener('click', e => {
        e.stopPropagation();
        añadirAlCarrito(producto, 1);
      });

      productosGrid.appendChild(card);
    });
  }

  function abrirModal(producto) {
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = `
      <div class="modal-header">
        <img src="${producto.imagenUrl}" alt="${producto.nombre}">
        <div class="modal-header-overlay"></div>
        ${producto.badge ? `<div class="modal-badge badge-${producto.badge}">${producto.badgeText}</div>` : ''}
      </div>
      <div class="modal-detail">
        <h2 class="modal-title">${producto.nombre}</h2>
        <p class="modal-description">${producto.descripcion}</p>

        <div class="modal-info">
          <div class="info-group"><div class="info-label">Price</div><div class="info-value highlight">${producto.precio.toFixed(2)}€</div></div>
          <div class="info-group"><div class="info-label">Type</div><div class="info-value">${producto.vegetariano ? 'Vegan' : 'Regular'}</div></div>
        </div>

        <div class="ingredients-title">Ingredients</div>
        <div class="ingredients-list">
          ${(producto.ingredientes || []).map(ing => `<div class="ingredient-tag"><i class="fas fa-check"></i><span>${ing}</span></div>`).join('')}
        </div>

        <div class="modal-actions">
          <div class="quantity-selector">
            <div class="quantity-btn minus-btn">-</div>
            <input type="number" class="quantity-input" value="1" min="1" max="10">
            <div class="quantity-btn plus-btn">+</div>
          </div>
          <button class="add-to-cart-btn"><i class="fas fa-shopping-cart"></i> Add to cart</button>
        </div>
      </div>
    `;

    const quantityInput = modalBody.querySelector('.quantity-input');
    modalBody.querySelector('.minus-btn').onclick = () => quantityInput.value = Math.max(1, quantityInput.value - 1);
    modalBody.querySelector('.plus-btn').onclick = () => quantityInput.value = Math.min(10, +quantityInput.value + 1);
    modalBody.querySelector('.add-to-cart-btn').onclick = () => {
      añadirAlCarrito(producto, +quantityInput.value);
      cerrarModal();
    };

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function generarEstrellas(rating) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) html += '<i class="fas fa-star estrella active"></i>';
      else if (i === Math.ceil(rating) && !Number.isInteger(rating)) html += '<i class="fas fa-star-half-alt estrella active"></i>';
      else html += '<i class="far fa-star estrella"></i>';
    }
    return html;
  }

  function añadirAlCarrito(producto, cantidad) {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = parseInt(cartCount.textContent || "0") + cantidad;
    cartCount.style.display = 'flex';

    mostrarNotificacion(`${cantidad}x ${producto.nombre} added to cart`, 'success');

    const cartIcon = document.querySelector('.cart-icon');
    const rect = cartIcon.getBoundingClientRect();
    const flyingItem = document.createElement('div');
    flyingItem.className = 'flying-item';
    flyingItem.innerHTML = '<i class="fas fa-drumstick-bite"></i>';
    flyingItem.style.cssText = `position:fixed;z-index:9999;top:${window.innerHeight/2}px;left:${window.innerWidth/2}px;font-size:20px;color:var(--secondary-color);transition:all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);`;
    document.body.appendChild(flyingItem);
    flyingItem.getBoundingClientRect();
    flyingItem.style.top = `${rect.top + 10}px`;
    flyingItem.style.left = `${rect.left + 10}px`;
    flyingItem.style.opacity = '0';
    flyingItem.style.transform = 'scale(0.3)';
    setTimeout(() => flyingItem.remove(), 700);
  }

  function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.getElementById('notification');
    const notificationMsg = notificacion.querySelector('.notification-message');
    const notificationIcon = notificacion.querySelector('.notification-icon');
    notificationIcon.className = tipo === 'success'
      ? 'notification-icon fas fa-check-circle'
      : tipo === 'error'
      ? 'notification-icon fas fa-exclamation-circle'
      : 'notification-icon fas fa-info-circle';
    notificationMsg.textContent = mensaje;
    notificacion.classList.add('show');
    setTimeout(() => notificacion.classList.remove('show'), 3000);
  }

  function setupFloatingEmbers() {
    const container = document.querySelector('.floating-embers');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const ember = document.createElement('div');
      ember.className = 'floating-ember';
      ember.style.width = ember.style.height = `${Math.random() * 6 + 4}px`;
      ember.style.left = `${Math.random() * 100}%`;
      const color = ['#00ffcc', '#00ccff', '#00ffaa', '#66ffcc'][Math.floor(Math.random() * 4)];
      ember.style.backgroundColor = color;
      ember.style.boxShadow = `0 0 10px ${color}`;
      ember.style.animationDelay = `${Math.random() * 5}s`;
      ember.style.animationDuration = `${Math.random() * 7 + 8}s`;
      container.appendChild(ember);
    }
  }

  setupFloatingEmbers();
});