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
  });
  