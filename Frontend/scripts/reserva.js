// Reemplaza la función cargarDatosRestaurante con esta versión actualizada
async function cargarDatosRestaurante(id) {
  try {
    const res = await fetch(`http://localhost:3000/api/restaurantes/${id}`);
    const data = await res.json();
    
    if (res.ok) {
      // Mostrar información básica
      nombreRestaurante.textContent = data.nombre || 'Restaurante Gula';
      
      // Si no tenemos dirección, mostrar solo el código postal
      direccionRestaurante.textContent = `Código Postal: ${data.codigo_postal || 'No disponible'}`;
      
      // Mostrar valoración
      if (data.valoracion) {
        valoracionMedia.textContent = data.valoracion;
        totalResenas.textContent = `(${data.total_resenas} reseñas)`;
        
        // Colorear estrellas según valoración
        const valoracion = parseFloat(data.valoracion);
        estrellasValoracion.forEach((estrella, i) => {
          if (i < Math.floor(valoracion)) {
            estrella.classList.add('active');
          } else if (i < valoracion) {
            // Media estrella (usando clases de Font Awesome)
            estrella.classList.remove('fa-star');
            estrella.classList.add('fa-star-half-alt');
            estrella.classList.add('active');
          }
        });
      }
      
      // Mostrar fotos
      // En la función cargarDatosRestaurante, modificamos la parte que carga las fotos
if (data.fotos && data.fotos.length > 0) {
  console.log("Fotos disponibles:", data.fotos); // Para depuración
  fotosContainer.innerHTML = '';
  data.fotos.forEach(url => {
    console.log("Cargando imagen:", url); // Para depuración
    const img = document.createElement('img');
    img.src = url;
    img.alt = `Foto de ${data.nombre}`;
    img.className = 'foto-restaurante';
    img.onerror = function() {
      console.error("Error al cargar la imagen:", url);
      this.src = "https://gula-hamburguesas.s3.us-east-1.amazonaws.com/20250421_0130_Restaurante+Gula+de+Noche_remix_01jsarfghxeka8mrs5f6pqhmhr.png";
    };
    fotosContainer.appendChild(img);
  });
} else {
  console.log("No hay fotos disponibles, usando imagen por defecto"); // Para depuración
  fotosContainer.innerHTML = `
    <img src="https://gula-hamburguesas.s3.us-east-1.amazonaws.com/20250421_0130_Restaurante+Gula+de+Noche_remix_01jsarfghxeka8mrs5f6pqhmhr.png" 
         alt="Imagen por defecto" 
         class="foto-restaurante">
  `;
}
    } else {
      mensaje.textContent = '❌ No se pudo cargar la información del restaurante';
    }
  } catch (err) {
    console.error('Error al cargar datos del restaurante:', err);
    mensaje.textContent = '❌ Error al conectar con el servidor';
  }
}
// En la función cargarDisponibilidad del archivo reserva.js
async function cargarDisponibilidad(restauranteId, fecha) {
  try {
    console.log("Cargando disponibilidad para:", restauranteId, fecha); // Para depuración
    
    const res = await fetch(`http://localhost:3000/api/disponibilidad?restaurante_id=${restauranteId}&fecha=${fecha}`);
    const slots = await res.json();
    
    console.log("Slots de disponibilidad recibidos:", slots); // Para depuración
    
    horasContainer.innerHTML = '';
    
    if (!Array.isArray(slots) || slots.length === 0) {
      horasContainer.innerHTML = '<p>No hay horarios disponibles para esta fecha</p>';
      return;
    }
    
    slots.forEach(slot => {
      const disponible = slot.mesas_disponibles > 0;
      const horaFormateada = slot.hora.substring(0, 5); // Formato HH:MM
      
      const botonHora = document.createElement('div');
      botonHora.className = `slot ${disponible ? '' : 'disabled'}`;
      botonHora.textContent = horaFormateada;
      
      if (disponible) {
        botonHora.addEventListener('click', () => {
          // Deseleccionar todos los slots
          document.querySelectorAll('.slot').forEach(s => s.classList.remove('selected'));
          // Seleccionar este slot
          botonHora.classList.add('selected');
          // Guardar la hora en el campo oculto
          campoHora.value = horaFormateada;
        });
      }
      
      horasContainer.appendChild(botonHora);
    });
  } catch (err) {
    console.error('Error al cargar disponibilidad:', err);
    horasContainer.innerHTML = '<p>Error al cargar los horarios disponibles</p>';
  }
}