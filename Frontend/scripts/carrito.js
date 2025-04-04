const token = localStorage.getItem('token');

async function cargarCarrito() {
  try {
    const res = await fetch('http://localhost:3000/api/carrito', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const datos = await res.json();

    const tbody = document.getElementById('lista-carrito');
    tbody.innerHTML = '';

    let totalFinal = 0;

    datos.forEach(item => {
      const total = item.precio * item.cantidad;
      totalFinal += total;

      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${item.nombre}</td>
        <td>${item.descripcion}</td>
        <td>${item.precio} €</td>
        <td>${item.cantidad}</td>
        <td><strong>${total.toFixed(2)} €</strong></td>
        <td><button onclick="eliminarDelCarrito(${item.id})">🗑️</button></td>
      `;
      tbody.appendChild(fila);
    });

    if (datos.length === 0) {
      const filaVacia = document.createElement('tr');
      filaVacia.innerHTML = `<td colspan="6" style="text-align:center;">Tu carrito está vacío</td>`;
      tbody.appendChild(filaVacia);
    }

  } catch (error) {
    console.error('Error al cargar el carrito:', error);
  }
}

async function eliminarDelCarrito(id) {
  const confirmar = confirm("¿Eliminar esta hamburguesa del carrito?");
  if (!confirmar) return;

  try {
    const res = await fetch(`http://localhost:3000/api/carrito/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const datos = await res.json();

    if (res.ok) {
      alert('✅ Eliminado del carrito');
      cargarCarrito();
    } else {
      alert('❌ Error: ' + (datos.mensaje || datos.error));
    }

  } catch (error) {
    console.error('Error al eliminar:', error);
  }
}

document.addEventListener('DOMContentLoaded', cargarCarrito);
``
