document.getElementById('form-reserva').addEventListener('submit', async (e) => {
    e.preventDefault();
  
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
    const personas = document.getElementById('personas').value;
    const token = localStorage.getItem('token');
  
    try {
      const res = await fetch('http://localhost:3000/api/reservas/nueva', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ fecha, hora, personas })
      });
  
      const datos = await res.json();
      document.getElementById('mensaje-reserva').textContent = datos.mensaje || 'Reserva realizada con éxito';
    } catch (error) {
      console.error('Error al hacer reserva:', error);
      document.getElementById('mensaje-reserva').textContent = 'Error al hacer la reserva';
    }

    document.addEventListener('DOMContentLoaded', () => {
      const form = document.getElementById('form-reserva');
      const mensaje = document.getElementById('mensaje-reserva');
      const nombreRestaurante = document.getElementById('nombre-restaurante');
      const campoRestaurante = document.getElementById('restaurante_id');
      const token = localStorage.getItem('token');
    
      const params = new URLSearchParams(window.location.search);
      const restauranteId = params.get('restaurante');
    
      if (restauranteId) {
        // Mostrar el nombre del restaurante
        fetch(`http://localhost:3000/api/restaurantes/${restauranteId}`)
          .then(res => res.json())
          .then(data => {
            nombreRestaurante.textContent = `Restaurante: ${data.nombre}`;
            campoRestaurante.value = restauranteId;
          })
          .catch(err => {
            nombreRestaurante.textContent = 'Restaurante no encontrado';
            console.error(err);
          });
      }
    
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
    
        const reserva = {
          fecha: document.getElementById('fecha').value,
          hora: document.getElementById('hora').value,
          personas: document.getElementById('personas').value,
          restaurante_id: campoRestaurante.value
        };
    
        try {
          const res = await fetch('http://localhost:3000/api/reservas/nueva', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(reserva)
          });
    
          const data = await res.json();
    
          if (res.ok) {
            mensaje.textContent = '✅ Reserva confirmada';
          } else {
            mensaje.textContent = `❌ Error: ${data.error || data.mensaje}`;
          }
        } catch (err) {
          console.error(err);
          mensaje.textContent = '❌ Error al conectar con el servidor';
        }
      });
    });
    
  });
  