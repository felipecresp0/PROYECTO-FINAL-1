const token = localStorage.getItem('token');

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
        <h3>${h.nombre}</h3>
        <p>${h.descripcion}</p>
        <div class="precio">${h.precio} €</div>
        <button onclick="añadirAlCarrito(${h.id})">Añadir al carrito</button>
      `;
      contenedor.appendChild(card);
    });

  } catch (err) {
    console.error('Error al cargar el menú:', err);
  }
}

function añadirAlCarrito(idHamburguesa) {
  alert(`Hamburguesa con ID ${idHamburguesa} añadida al carrito (pendiente de implementar)`);
  // Aquí en el siguiente paso guardaremos en base de datos o localStorage
}

document.addEventListener('DOMContentLoaded', cargarMenu);
