document.addEventListener('DOMContentLoaded', async () => {
  const productosGrid = document.getElementById('productos-grid');
  const modal = document.getElementById('producto-modal');
  const closeModal = document.querySelector('.close-modal');
  const filtrosBtns = document.querySelectorAll('.filtro-btn');
  const categoriasItems = document.querySelectorAll('.categoria-item');

  let productos = [];

  // Carga de hamburguesas desde backend
  async function fetchHamburguesas() {
    try {
      const response = await fetch("http://localhost:8080/api/productos/hamburguesas");
      productos = await response.json();
      cargarProductos(productos);
    } catch (error) {
      console.error("Error cargando hamburguesas:", error);
    }
  }

  await fetchHamburguesas();

  // Setup filtros de tipo
  filtrosBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filtrosBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filtro = btn.getAttribute('data-filter');
      if (filtro === 'all') {
        cargarProductos(productos);
      } else {
        const filtrados = productos.filter(p => {
          if (filtro === 'bestseller' && p.badge === 'bestseller') return true;
          if (filtro === 'new' && p.nuevo) return true;
          if (filtro === 'spicy' && p.spicy) return true;
          if (filtro === 'vegan' && p.vegetariano) return true;
          return false;
        });
        cargarProductos(filtrados);
      }
    });
  });

  // Navegación entre categorías
  categoriasItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const destino = item.querySelector('.categoria-link').getAttribute('href');
      window.location.href = destino;
    });
  });

  // Modal cierre
  closeModal.addEventListener('click', () => {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
  });
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape') modal.style.display = 'none';
  });
  window.addEventListener('click', e => {
    if (e.target === modal) modal.style.display = 'none';
  });

  function cargarProductos(productosArray) {
    productosGrid.innerHTML = '';
    if (productosArray.length === 0) {
      productosGrid.innerHTML = `
        <div class="no-productos">
          <i class="fas fa-search"></i>
          <h3>No hay productos disponibles</h3>
          <p>Prueba a cambiar los filtros o selecciona otra categoría</p>
        </div>`;
      return;
    }

    productosArray.forEach(producto => {
      const card = document.createElement('div');
      card.className = 'producto-card';
      card.dataset.id = producto.id;

      const estrellas = generarEstrellas(producto.rating);
      card.innerHTML = `
        ${producto.badge ? `<div class="producto-badge badge-${producto.badge}">${producto.badgeText || producto.badge}</div>` : ''}
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
        </div>
      `;

      card.addEventListener('click', () => abrirModal(producto));
      card.querySelector('.add-btn').addEventListener('click', e => {
        e.stopPropagation();
        añadirAlCarrito(producto, 1);
      });

      productosGrid.appendChild(card);
    });

    // Animación
    setTimeout(() => {
      const cards = document.querySelectorAll('.producto-card');
      cards.forEach((card, i) => {
        setTimeout(() => {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        }, i * 50);
      });
    }, 100);
  }

  function abrirModal(producto) {
    const estrellas = generarEstrellasInteractivas(producto.rating);
    const ingredientesHTML = producto.ingredientes?.map(i =>
      `<div class="ingredient-tag"><i class="fas fa-check"></i><span>${i}</span></div>`
    ).join('') || '';

    modal.querySelector('.modal-body').innerHTML = `
      <div class="modal-header">
        <img src="${producto.imagenUrl}" alt="${producto.nombre}">
        <div class="modal-header-overlay"></div>
        ${producto.badge ? `<div class="modal-badge badge-${producto.badge}">${producto.badgeText || producto.badge}</div>` : ''}
      </div>
      <div class="modal-detail">
        <h2 class="modal-title">${producto.nombre}</h2>
        <p class="modal-description">${producto.descripcion}</p>
        <div class="modal-info">
          <div class="info-group"><div class="info-label">Price</div><div class="info-value highlight">${producto.precio.toFixed(2)}€</div></div>
          <div class="info-group"><div class="info-label">Tipe</div><div class="info-value">${producto.vegetariano ? 'Vegetarian' : 'Normal'}</div></div>
        </div>
        <div class="ingredients-title">Ingredients</div>
        <div class="ingredients-list">${ingredientesHTML}</div>
        <div class="rating-section">
          <div class="rating-title">How do you feel about this product?</div>
          <div class="rating-stars" data-product-id="${producto.id}">${estrellas}</div>
        </div>
        <div class="modal-actions">
          <div class="quantity-selector">
            <div class="quantity-btn minus-btn">-</div>
            <input type="number" class="quantity-input" value="1" min="1" max="10">
            <div class="quantity-btn plus-btn">+</div>
          </div>
          <button class="add-to-cart-btn"><i class="fas fa-shopping-cart"></i> Add to cart</button>
        </div>
      </div>`;

    const modalBody = modal.querySelector('.modal-body');
    const minusBtn = modalBody.querySelector('.minus-btn');
    const plusBtn = modalBody.querySelector('.plus-btn');
    const quantityInput = modalBody.querySelector('.quantity-input');
    const addToCartBtn = modalBody.querySelector('.add-to-cart-btn');

    minusBtn.addEventListener('click', () => {
      const val = parseInt(quantityInput.value);
      if (val > 1) quantityInput.value = val - 1;
    });

    plusBtn.addEventListener('click', () => {
      const val = parseInt(quantityInput.value);
      if (val < 10) quantityInput.value = val + 1;
    });

    addToCartBtn.addEventListener('click', () => {
      const cantidad = parseInt(quantityInput.value);
      añadirAlCarrito(producto, cantidad);
      modal.style.display = 'none';
      document.body.style.overflow = 'auto';
    });

    const ratingStars = modalBody.querySelectorAll('.rating-star');
    ratingStars.forEach((star, index) => {
      star.addEventListener('click', () => {
        const rating = index + 1;
        valorarProducto(producto.id, rating);
        ratingStars.forEach((s, i) => s.classList.toggle('active', i < rating));
        const ratingSection = modalBody.querySelector('.rating-section');
        ratingSection.innerHTML += `<div class="already-rated">Thank you for your rating!</div>`;
      });
    });

    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function generarEstrellas(rating) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) estrellas += '<i class="fas fa-star estrella active"></i>';
      else if (i === Math.ceil(rating) && !Number.isInteger(rating)) estrellas += '<i class="fas fa-star-half-alt estrella active"></i>';
      else estrellas += '<i class="far fa-star estrella"></i>';
    }
    return estrellas;
  }

  function generarEstrellasInteractivas(rating) {
    let estrellas = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) estrellas += `<i class="fas fa-star rating-star active"></i>`;
      else if (i === Math.ceil(rating) && !Number.isInteger(rating)) estrellas += `<i class="fas fa-star-half-alt rating-star active"></i>`;
      else estrellas += `<i class="far fa-star rating-star"></i>`;
    }
    return estrellas;
  }

  function añadirAlCarrito(producto, cantidad) {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = parseInt(cartCount.textContent) + cantidad;
    mostrarNotificacion(`${cantidad}x ${producto.nombre} Added to cart`, 'success');
  }

  function valorarProducto(id, rating) {
    console.log(`Producto ${id} valorado con ${rating} stars`);
  }

  function mostrarNotificacion(mensaje, tipo = 'info') {
    const notificacion = document.getElementById('notification');
    const msg = notificacion.querySelector('.notification-message');
    const icon = notificacion.querySelector('.notification-icon');
    icon.className = `notification-icon fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`;
    msg.textContent = mensaje;
    notificacion.classList.add('show');
    setTimeout(() => notificacion.classList.remove('show'), 3000);
  }

  function setupFloatingEmbers() {
    const embers = document.querySelector('.floating-embers');
    if (!embers) return;
    embers.innerHTML = '';
    const colores = ['#ff3300', '#ff6600', '#ff0066', '#ff9900'];
    for (let i = 0; i < 20; i++) {
      const ember = document.createElement('div');
      ember.className = 'floating-ember';
      ember.style.width = ember.style.height = `${Math.random() * 6 + 4}px`;
      ember.style.left = `${Math.random() * 100}%`;
      const color = colores[Math.floor(Math.random() * colores.length)];
      ember.style.backgroundColor = color;
      ember.style.boxShadow = `0 0 10px ${color}`;
      ember.style.animationDelay = `${Math.random() * 5}s`;
      ember.style.animationDuration = `${Math.random() * 7 + 8}s`;
      embers.appendChild(ember);
    }
  }

  setupFloatingEmbers();
});
