document.addEventListener('DOMContentLoaded', () => {
  const productosGrid = document.getElementById('productos-grid');
  const modal = document.getElementById('producto-modal');
  const closeModal = document.querySelector('.close-modal');
  const filtrosBtns = document.querySelectorAll('.filtro-btn');
  const categoriasItems = document.querySelectorAll('.categoria-item');

  let bebidas = [];

  async function fetchBebidas() {
    try {
      const response = await fetch("http://localhost:8080/api/productos/bebidas");
      bebidas = await response.json();
      cargarProductos(bebidas);
    } catch (error) {
      console.error("Error loading drinks:", error);
    }
  }

  fetchBebidas();

  categoriasItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const destino = item.querySelector('.categoria-link').getAttribute('href');
      window.location.href = destino;
    });
  });

  filtrosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtrosBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filtro = btn.getAttribute('data-filter');
      if (filtro === 'all') {
        cargarProductos(bebidas);
      } else {
        const filtrados = bebidas.filter(p => {
          if (filtro === 'bestseller' && p.badge === 'bestseller') return true;
          if (filtro === 'new' && p.nuevo) return true;
          if (filtro === 'alcoholic' && p.alcoholic) return true;
          if (filtro === 'vegan' && p.vegetariano) return true;
          return false;
        });
        cargarProductos(filtrados);
      }
    });
  });

  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    }
  });

  function cargarProductos(productos) {
    productosGrid.innerHTML = '';
    if (productos.length === 0) {
      productosGrid.innerHTML = `<div class="no-productos">
        <i class="fas fa-search"></i>
        <h3>No products available</h3>
        <p>Try changing the filters or select another category</p>
      </div>`;
      return;
    }

    productos.forEach(p => {
      const card = document.createElement('div');
      card.className = 'producto-card';
      card.dataset.id = p.id;

      const estrellas = generarEstrellas(p.rating ?? 4.5);

      card.innerHTML = `
        ${p.badge ? `<div class="producto-badge badge-${p.badge}">${p.badgeText || p.badge.toUpperCase()}</div>` : ''}
        <div class="producto-img-container">
          <img src="${p.imagenUrl || '../imagenes/batidochocolate.png'}" alt="${p.nombre}">
          <div class="producto-overlay"></div>
        </div>
        <div class="producto-content">
          <div>
            <h3 class="producto-nombre">${p.nombre}</h3>
            <div class="estrellas-container">${estrellas}</div>
          </div>
          <div class="producto-footer">
            <span class="producto-precio">${p.precio.toFixed(2)}€</span>
            <button class="add-btn"><i class="fas fa-plus"></i></button>
          </div>
        </div>
      `;

      card.addEventListener('click', () => abrirModal(p));
      card.querySelector('.add-btn').addEventListener('click', e => {
        e.stopPropagation();
        añadirAlCarrito(p, 1);
      });

      productosGrid.appendChild(card);
    });
  }

  function abrirModal(p) {
    const modalBody = modal.querySelector('.modal-body');
    modalBody.innerHTML = `
      <div class="modal-header">
        <img src="${p.imagenUrl}" alt="${p.nombre}">
        <div class="modal-header-overlay"></div>
        ${p.badge ? `<div class="modal-badge badge-${p.badge}">${p.badgeText || p.badge}</div>` : ''}
      </div>
      <div class="modal-detail">
        <h2 class="modal-title">${p.nombre}</h2>
        <p class="modal-description">${p.descripcion}</p>
        <div class="modal-info">
          <div class="info-group"><div class="info-label">Price</div><div class="info-value highlight">${p.precio.toFixed(2)}€</div></div>
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
    modalBody.querySelector('.minus-btn').addEventListener('click', () => {
      if (parseInt(quantityInput.value) > 1) quantityInput.value--;
    });
    modalBody.querySelector('.plus-btn').addEventListener('click', () => {
      if (parseInt(quantityInput.value) < 10) quantityInput.value++;
    });

    modalBody.querySelector('.add-to-cart-btn').addEventListener('click', () => {
      añadirAlCarrito(p, parseInt(quantityInput.value));
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function generarEstrellas(rating) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
      estrellas += i <= Math.floor(rating)
        ? '<i class="fas fa-star estrella active"></i>'
        : '<i class="far fa-star estrella"></i>';
    }
    return estrellas;
  }

  function añadirAlCarrito(producto, cantidad) {
    const cartCount = document.querySelector('.cart-count');
    const actual = parseInt(cartCount.textContent) || 0;
    cartCount.textContent = actual + cantidad;
    cartCount.style.display = 'flex';
    mostrarNotificacion(`${cantidad}x ${producto.nombre} added to cart`, 'success');
  }

  function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.getElementById('notification');
    if (!notificacion) return;
    const msg = notificacion.querySelector('.notification-message');
    const icon = notificacion.querySelector('.notification-icon');

    msg.textContent = mensaje;
    icon.className = tipo === 'success' ? 'fas fa-check-circle' : 'fas fa-info-circle';

    notificacion.classList.add('show');
    setTimeout(() => notificacion.classList.remove('show'), 3000);
  }

  function setupFloatingEmbers() {
    const embersContainer = document.querySelector('.floating-embers');
    if (!embersContainer) return;
    for (let i = 0; i < 10; i++) {
      const ember = document.createElement('div');
      ember.className = 'floating-ember';
      ember.style.left = `${Math.random() * 100}%`;
      ember.style.animationDelay = `${Math.random() * 5}s`;
      ember.style.animationDuration = `${Math.random() * 10 + 5}s`;
      embersContainer.appendChild(ember);
    }
  }

  setupFloatingEmbers();
});