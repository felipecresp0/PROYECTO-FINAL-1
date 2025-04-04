const token = localStorage.getItem('token');
const urlBase = 'http://localhost:3000/api/hamburguesas';

document.getElementById('form-hamburguesa').addEventListener('submit', async (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const descripcion = document.getElementById('descripcion').value;
  const precio = document.getElementById('precio').value;

  if (!token) return alert('Token no encontrado. Inicia sesión.');

  try {
    const respuesta = await fetch(`${urlBase}/nueva`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ nombre, descripcion, precio })
    });

    const datos = await respuesta.json();

    if (respuesta.ok) {
      document.getElementById('mensaje').textContent = '✅ Hamburguesa creada.';
      e.target.reset();
      cargarHamburguesas(); // ← Recargar tabla
    } else {
      document.getElementById('mensaje').textContent = `❌ ${datos.mensaje || datos.error}`;
    }
  } catch (error) {
    console.error(error);
    document.getElementById('mensaje').textContent = '❌ Error al crear hamburguesa.';
  }
});

async function cargarHamburguesas() {
  if (!token) return;

  try {
    const res = await fetch(urlBase, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const hamburguesas = await res.json();
    const tbody = document.getElementById('lista-hamburguesas');
    tbody.innerHTML = '';

    hamburguesas.forEach(h => {
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td>${h.nombre}</td>
        <td>${h.descripcion}</td>
        <td>${h.precio} €</td>
        <td><button onclick="eliminarHamburguesa(${h.id})">🗑️ Eliminar</button></td>
      `;
      tbody.appendChild(fila);
    });
  } catch (err) {
    console.error('Error al cargar hamburguesas:', err);
  }
}

async function eliminarHamburguesa(id) {
  if (!confirm('¿Seguro que deseas eliminar esta hamburguesa?')) return;

  try {
    const res = await fetch(`${urlBase}/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const datos = await res.json();

    if (res.ok) {
      alert('Hamburguesa eliminada correctamente');
      cargarHamburguesas();
    } else {
      alert('Error: ' + datos.mensaje);
    }
  } catch (err) {
    console.error('Error al eliminar:', err);
  }
}

window.addEventListener('DOMContentLoaded', cargarHamburguesas);
