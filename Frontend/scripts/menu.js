document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  // Elementos del DOM
  const btnCarrito = document.getElementById('carrito-btn');
  const desplegable = document.getElementById('carrito-desplegable');
  const listaCarrito = document.getElementById('lista-carrito');
  const contadorCarrito = document.getElementById('contador-carrito');

  if (!btnCarrito || !desplegable || !listaCarrito || !contadorCarrito) {
    console.error('❌ No se encontraron elementos del DOM relacionados con el carrito.');
    return;
  }

  // Cargar hamburguesas del menú
  async function cargarMenu() {
    try {
      const res = await fetch('http://localhost:3000/api/hamburguesas', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const hamburguesas = await res.json();
      const contenedor = document.getElementById('contenedor-hamburguesas');
      contenedor.innerHTML = '';

      hamburguesas.forEach(h => {
        const card = document.createElement('div');
        card.className = 'card-hamburguesa';
        card.innerHTML = `
  <img src="${h.imagen}" alt="${h.nombre}" class="menu-img" />
  <h3>${h.nombre}</h3>
  <p>${h.descripcion}</p>
  <div class="precio">${Number(h.precio).toFixed(2)} €</div>
  <button onclick="añadirAlCarrito(${h.id})">Añadir al carrito</button>
`;

        contenedor.appendChild(card);
      });
    } catch (err) {
      console.error('❌ Error al cargar el menú:', err);
    }
  }

  // Añadir hamburguesa al carrito
  window.añadirAlCarrito = async function(hamburguesa_id) {
    try {
      const res = await fetch('http://localhost:3000/api/carrito/agregar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ hamburguesa_id, cantidad: 1 })
      });

      const datos = await res.json();

      if (res.ok) {
        alert('✅ Añadido al carrito');
        actualizarContadorCarrito();
      } else {
        alert('❌ Error: ' + (datos.mensaje || datos.error));
      }
    } catch (error) {
      console.error('Error al añadir al carrito:', error);
      alert('❌ Error al conectar con el servidor.');
    }
  };

  // Desplegar carrito y cargar resumen
  btnCarrito.addEventListener('click', () => {
    if (desplegable.classList.contains('mostrar')) {
      desplegable.classList.remove('mostrar');
      setTimeout(() => desplegable.style.display = 'none', 150); // espera un poco para que no desaparezca bruscamente
    } else {
      desplegable.style.display = 'block';
      setTimeout(() => desplegable.classList.add('mostrar'), 10); // pequeño retardo para que se aplique la animación
    }
    
    cargarResumenCarrito();
  });

  // Mostrar resumen dentro del desplegable
  function cargarResumenCarrito() {
    fetch('http://localhost:3000/api/carrito', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      listaCarrito.innerHTML = '';
      if (data.length === 0) {
        listaCarrito.innerHTML = '<li>Carrito vacío</li>';
        return;
      }
      data.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre} - ${item.precio} €`;
        listaCarrito.appendChild(li);
      });
    })
    .catch(err => {
      console.error('Error al cargar el carrito:', err);
    });
  }

  // Actualizar contador tipo badge
  function actualizarContadorCarrito() {
    fetch('http://localhost:3000/api/carrito', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => res.json())
    .then(data => {
      contadorCarrito.textContent = data.length;
      contadorCarrito.style.display = data.length > 0 ? 'inline-block' : 'none';
    })
    .catch(err => {
      console.error('Error al contar productos del carrito:', err);
    });
  }

  // Carga inicial
  cargarMenu();
  actualizarContadorCarrito();
});
function irACategoria(pagina) {
  window.location.href = pagina;
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("📖 Página de categorías cargada");
});
