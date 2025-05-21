document.addEventListener('DOMContentLoaded', () => {
  const productosGrid = document.getElementById('productos-grid');
  const modal = document.getElementById('producto-modal');
  const closeModal = document.querySelector('.close-modal');
  const filtrosBtns = document.querySelectorAll('.filtro-btn');
  const categoriasItems = document.querySelectorAll('.categoria-item');

  let postres = [];

  async function fetchPostres() {
    try {
      const response = await fetch("http://localhost:8080/api/productos/postres");
      postres = await response.json();
      cargarProductos(postres);
    } catch (error) {
      console.error("Error cargando postres:", error);
    }
  }

  fetchPostres();

  categoriasItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const categoria = item.querySelector('.categoria-link').getAttribute('href');
      if (!categoria.includes('postres')) window.location.href = categoria;
    });
  });

  filtrosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtrosBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filtro = btn.getAttribute('data-filter');
      if (filtro === 'all') return cargarProductos(postres);
      const filtrados = postres.filter(p => {
        if (filtro === 'bestseller' && p.badge === 'bestseller') return true;
        if (filtro === 'new' && p.nuevo) return true;
        if (filtro === 'chocolate' && p.chocolate) return true;
        if (filtro === 'vegan' && p.vegetariano) return true;
        return false;
      });
      cargarProductos(filtrados);
    });
  });

  closeModal.addEventListener('click', () => cerrarModal());
  window.addEventListener('keydown', (e) => e.key === 'Escape' && cerrarModal());
  window.addEventListener('click', (e) => e.target === modal && cerrarModal());

  function cerrarModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  }

  function cargarProductos(productos) {
    productosGrid.innerHTML = '';
    if (productos.length === 0) {
      productosGrid.innerHTML = `
        <div class="no-productos">
          <i class="fas fa-search"></i>
          <h3>No hay productos disponibles</h3>
          <p>Prueba a cambiar los filtros o selecciona otra categoría</p>
        </div>`;
      return;
    }

    productos.forEach(p => {
      const card = document.createElement('div');
      card.className = 'producto-card';
      card.dataset.id = p.id;

      const estrellas = generarEstrellas(p.rating || 4.5);

      card.innerHTML = `
        ${p.badge ? `<div class="producto-badge badge-${p.badge}">${p.badgeText || p.badge.toUpperCase()}</div>` : ''}
        <div class="producto-img-container">
          <img src="${p.imagenUrl}" alt="${p.nombre}">
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
        </div>`;

      card.addEventListener('click', () => abrirModal(p));
      card.querySelector('.add-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        añadirAlCarrito(p, 1);
      });

      productosGrid.appendChild(card);
    });
  }

  function abrirModal(p) {
    const modalBody = modal.querySelector('.modal-body');
    const estrellas = generarEstrellasInteractivas(p.rating || 4.5);

    modalBody.innerHTML = `
      <div class="modal-header">
        <img src="${p.imagenUrl}" alt="${p.nombre}">
        <div class="modal-header-overlay"></div>
        ${p.badge ? `<div class="modal-badge badge-${p.badge}">${p.badgeText || p.badge.toUpperCase()}</div>` : ''}
      </div>
      <div class="modal-detail">
        <h2 class="modal-title">${p.nombre}</h2>
        <p class="modal-description">${p.descripcion}</p>
        <div class="modal-info">
          <div class="info-group"><div class="info-label">Precio</div><div class="info-value highlight">${p.precio.toFixed(2)}€</div></div>
        </div>
        <div class="ingredients-title">Ingredientes</div>
        <div class="ingredients-list">
          ${(p.ingredientes || []).map(ing => `
            <div class="ingredient-tag"><i class="fas fa-check"></i><span>${ing}</span></div>`).join('')}
        </div>
        <div class="rating-section">
          <div class="rating-title">¿Qué te ha parecido este producto?</div>
          <div class="rating-stars" data-product-id="${p.id}">${estrellas}</div>
        </div>
        <div class="modal-actions">
          <div class="quantity-selector">
            <div class="quantity-btn minus-btn">-</div>
            <input type="number" class="quantity-input" value="1" min="1" max="10">
            <div class="quantity-btn plus-btn">+</div>
          </div>
          <button class="add-to-cart-btn"><i class="fas fa-shopping-cart"></i> Añadir al carrito</button>
        </div>
      </div>`;

    modal.querySelector('.minus-btn').onclick = () => {
      const input = modal.querySelector('.quantity-input');
      if (input.value > 1) input.value--;
    };

    modal.querySelector('.plus-btn').onclick = () => {
      const input = modal.querySelector('.quantity-input');
      if (input.value < 10) input.value++;
    };

    modal.querySelector('.add-to-cart-btn').onclick = () => {
      const cantidad = parseInt(modal.querySelector('.quantity-input').value);
      añadirAlCarrito(p, cantidad);
      cerrarModal();
    };

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function generarEstrellas(rating) {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(rating) ? '<i class="fas fa-star estrella active"></i>' :
      i < rating ? '<i class="fas fa-star-half-alt estrella active"></i>' :
      '<i class="far fa-star estrella"></i>').join('');
  }

  function generarEstrellasInteractivas(rating) {
    return Array.from({ length: 5 }, (_, i) =>
      i < Math.floor(rating) ? `<i class="fas fa-star rating-star active" data-rating="${i+1}"></i>` :
      i < rating ? `<i class="fas fa-star-half-alt rating-star active" data-rating="${i+1}"></i>` :
      `<i class="far fa-star rating-star" data-rating="${i+1}"></i>`).join('');
  }

  function añadirAlCarrito(producto, cantidad) {
    const cartCount = document.querySelector('.cart-count');
    let count = parseInt(cartCount.textContent) || 0;
    cartCount.textContent = count + cantidad;
    cartCount.style.display = 'flex';
    mostrarNotificacion(`${cantidad}x ${producto.nombre} añadido al carrito`, 'success');
  }

  function mostrarNotificacion(mensaje, tipo = 'info') {
    const noti = document.getElementById('notification');
    noti.querySelector('.notification-message').textContent = mensaje;
    const icon = noti.querySelector('.notification-icon');
    icon.className = `notification-icon fas fa-${tipo === 'success' ? 'check' : tipo === 'error' ? 'exclamation' : 'info'}-circle`;
    noti.classList.add('show');
    setTimeout(() => noti.classList.remove('show'), 3000);
  }

  function setupFloatingEmbers() {
    const container = document.querySelector('.floating-embers');
    if (!container) return;
    for (let i = 0; i < 20; i++) {
      const ember = document.createElement('div');
      ember.className = 'floating-ember';
      ember.style.width = ember.style.height = `${Math.random() * 6 + 4}px`;
      ember.style.left = `${Math.random() * 100}%`;
      const colors = ['#ffcc00', '#ff9900', '#ffdd33', '#ffd700'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      ember.style.backgroundColor = ember.style.boxShadow = `0 0 10px ${color}`;
      ember.style.animationDelay = `${Math.random() * 5}s`;
      ember.style.animationDuration = `${Math.random() * 7 + 8}s`;
      container.appendChild(ember);
    }
  }

  setupFloatingEmbers();
});
