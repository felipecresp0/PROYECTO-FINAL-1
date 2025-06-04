// Esperar a que cargue el documento
document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos del DOM
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const menuToggle = document.querySelector('.menu-toggle');
    const toggleSidebar = document.querySelector('.toggle-sidebar');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const tabButtons = document.querySelectorAll('.tab-button');
    const followUpCheckbox = document.getElementById('follow-up');
    const followUpFields = document.getElementById('follow-up-fields');
    
    // Función para actualizar la hora actual
    function updateClock() {
        const now = new Date();
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        const second = now.getSeconds().toString().padStart(2, '0');
        
        // Actualizar los elementos si existen
        const hourElement = document.getElementById('hour');
        const minuteElement = document.getElementById('minute');
        const secondElement = document.getElementById('second');
        
        if (hourElement) hourElement.textContent = hour;
        if (minuteElement) minuteElement.textContent = minute;
        if (secondElement) secondElement.textContent = second;
    }
    
    // Función para actualizar la fecha actual
    function updateDate() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('es-ES', options);
        
        // Actualizar el elemento si existe
        const dateElement = document.getElementById('current-date');
        if (dateElement) {
            dateElement.textContent = dateString.charAt(0).toUpperCase() + dateString.slice(1);
        }
    }
    
    // Función para mostrar una página específica
    function showPage(pageId, subpageId = null) {
        console.log(`Mostrando página: ${pageId}, subpágina: ${subpageId}`);
        
        // Lista de todas las páginas principales
        const allPages = [
            'inicio', 'quienes-somos', 'mision', 'valores', 'noticias-anuncios',
            'fichar', 'vacaciones', 'comite-empresa', 'legislacion-laboral',
            'buzon-contacto', 'documentacion-interes', 'noticias-internas'
        ];
        
        // Ocultar todas las páginas principales
        allPages.forEach(page => {
            const pageElement = document.getElementById(page);
            if (pageElement) {
                pageElement.style.display = 'none';
            }
        });
        
        // Mostrar la página seleccionada
        const targetPage = document.getElementById(pageId);
        if (targetPage) {
            targetPage.style.display = 'block';
        }
        
        // Manejar subpáginas del comité de empresa
        if (pageId === 'comite-empresa') {
            const comiteSubpages = [
                'que-es-comite', 'miembros-comite', 'calendario-laboral', 
                'convenio-colectivo', 'estatuto-trabajadores', 'actas-comunicaciones'
            ];
            
            // Ocultar todas las subpáginas del comité
            comiteSubpages.forEach(subpage => {
                const subpageElement = document.getElementById(subpage);
                if (subpageElement) {
                    subpageElement.style.display = 'none';
                }
            });
            
            // Mostrar la subpágina específica o la primera por defecto
            const targetSubpage = subpageId || 'que-es-comite';
            const subpageElement = document.getElementById(targetSubpage);
            if (subpageElement) {
                subpageElement.style.display = 'block';
                console.log(`Subpágina mostrada: ${targetSubpage}`);
            }
        }
        
        // Manejar subpáginas de legislación laboral
        if (pageId === 'legislacion-laboral') {
            const legislacionSubpages = [
                'estatuto-link', 'convenio-link', 'normas-internas', 
                'prevencion-riesgos', 'formacion-obligatoria'
            ];
            
            // Ocultar todas las subpáginas de legislación
            legislacionSubpages.forEach(subpage => {
                const subpageElement = document.getElementById(subpage);
                if (subpageElement) {
                    subpageElement.style.display = 'none';
                }
            });
            
            // Mostrar la subpágina específica o la primera por defecto
            const targetSubpage = subpageId || 'estatuto-link';
            const subpageElement = document.getElementById(targetSubpage);
            if (subpageElement) {
                subpageElement.style.display = 'block';
                console.log(`Subpágina de legislación mostrada: ${targetSubpage}`);
            }
        }
    }
    
    // Función para actualizar las clases activas de navegación
    function updateActiveNavigation(clickedLink) {
        // Remover clase activa de todos los elementos nav-item
        navLinks.forEach(function(navLink) {
            const navItem = navLink.closest('.nav-item');
            if (navItem) {
                navItem.classList.remove('active');
            }
        });
        
        // Añadir clase activa al elemento clickeado
        if (clickedLink) {
            const navItem = clickedLink.closest('.nav-item');
            if (navItem) {
                navItem.classList.add('active');
            }
        }
    }
    
    // Función para cerrar todos los dropdowns
    function closeAllDropdowns() {
        document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
            menu.classList.remove('show');
        });
        document.querySelectorAll('.dropdown-icon').forEach(icon => {
            icon.classList.remove('fa-chevron-up');
            icon.classList.add('fa-chevron-down');
        });
    }
    
    // Inicializar reloj y fecha
    updateClock();
    updateDate();
    setInterval(updateClock, 1000);
    
    // Toggle para el menú lateral en dispositivos móviles
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('show');
        });
    }
    
    if (toggleSidebar) {
        toggleSidebar.addEventListener('click', function() {
            sidebar.classList.remove('show');
        });
    }
    
    // Manejar los menús desplegables
    dropdownToggles.forEach(function(toggle) {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Dropdown clicked:', this.getAttribute('data-dropdown'));
            
            const dropdownId = this.getAttribute('data-dropdown');
            const dropdown = document.getElementById(dropdownId);
            const dropdownIcon = this.querySelector('.dropdown-icon');
            
            if (dropdown) {
                const isShowing = dropdown.classList.contains('show');
                
                // Cerrar todos los dropdowns abiertos
                closeAllDropdowns();
                
                // Si no estaba mostrándose, abrirlo
                if (!isShowing) {
                    dropdown.classList.add('show');
                    if (dropdownIcon) {
                        dropdownIcon.classList.remove('fa-chevron-down');
                        dropdownIcon.classList.add('fa-chevron-up');
                    }
                    console.log('Dropdown abierto:', dropdownId);
                }
            }
            
            // También mostrar la página correspondiente
            const page = this.getAttribute('data-page');
            const subpage = this.getAttribute('data-subpage');
            if (page) {
                showPage(page, subpage);
                updateActiveNavigation(this);
            }
        });
    });
    
    // Navegación entre páginas
    navLinks.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Nav link clicked:', this);
            
            // Obtener la página y subpágina a mostrar
            const page = this.getAttribute('data-page');
            const subpage = this.getAttribute('data-subpage');
            
            console.log('Page:', page, 'Subpage:', subpage);
            
            if (page) {
                showPage(page, subpage);
                updateActiveNavigation(this);
                
                // En dispositivos móviles, cerrar el menú después de seleccionar una opción
                if (window.innerWidth <= 576) {
                    sidebar.classList.remove('show');
                }
            }
        });
    });
    
    // Manejar clics en enlaces que no están en la navegación principal
    document.addEventListener('click', function(e) {
        const target = e.target.closest('[data-page], [data-subpage]');
        if (target && !target.closest('.sidebar-nav')) {
            e.preventDefault();
            const page = target.getAttribute('data-page');
            const subpage = target.getAttribute('data-subpage');
            
            console.log('External link clicked - Page:', page, 'Subpage:', subpage);
            
            if (page) {
                showPage(page, subpage);
                // Actualizar navegación si es un enlace de página principal
                const navLinkForPage = document.querySelector(`.sidebar-nav [data-page="${page}"]`);
                if (navLinkForPage) {
                    updateActiveNavigation(navLinkForPage);
                }
            } else if (subpage) {
                // Si solo hay subpage, determinar la página actual
                const visiblePage = document.querySelector('[id$="inicio"], [id$="quienes-somos"], [id$="mision"], [id$="valores"], [id$="noticias-anuncios"], [id$="fichar"], [id$="vacaciones"], [id$="comite-empresa"], [id$="legislacion-laboral"], [id$="buzon-contacto"], [id$="documentacion-interes"], [id$="noticias-internas"]');
                if (visiblePage && visiblePage.style.display !== 'none') {
                    const currentPageId = visiblePage.id;
                    showPage(currentPageId, subpage);
                }
            }
        }
    });
    
    // Manejar tabs con delegación de eventos
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-button')) {
            console.log('Tab clicked:', e.target.getAttribute('data-tab'));
            
            const tabId = e.target.getAttribute('data-tab');
            const tabContentElement = document.getElementById(tabId);
            
            if (tabContentElement) {
                // Encontrar el contenedor de tabs padre
                const tabsContainer = e.target.closest('.tabs');
                if (tabsContainer) {
                    // Desactivar todos los botones y contenidos de tab en este contenedor
                    tabsContainer.querySelectorAll('.tab-button').forEach(function(btn) {
                        btn.classList.remove('active');
                    });
                    tabsContainer.querySelectorAll('.tab-content').forEach(function(content) {
                        content.classList.remove('active');
                    });
                    
                    // Activar el botón y contenido seleccionados
                    e.target.classList.add('active');
                    tabContentElement.classList.add('active');
                    
                    console.log('Tab activated:', tabId);
                }
            }
        }
    });
    
    // Manejar el checkbox de seguimiento en el buzón de contacto
    if (followUpCheckbox) {
        followUpCheckbox.addEventListener('change', function() {
            if (followUpFields) {
                followUpFields.style.display = this.checked ? 'block' : 'none';
                console.log('Follow-up fields:', this.checked ? 'shown' : 'hidden');
            }
        });
    }
    
    // Funcionalidad para el formulario de vacaciones
    const startDateInput = document.querySelector('#vacaciones input[type="date"]:first-of-type');
    const endDateInput = document.querySelector('#vacaciones input[type="date"]:nth-of-type(2)');
    
    if (startDateInput && endDateInput) {
        startDateInput.addEventListener('change', function() {
            endDateInput.min = this.value;
            console.log('Start date changed:', this.value);
        });
        
        endDateInput.addEventListener('change', function() {
            startDateInput.max = this.value;
            console.log('End date changed:', this.value);
        });
    }
    
    // Funcionalidad para el calendario
    const calendarButtons = document.querySelectorAll('.calendar-button');
    calendarButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Calendar navigation clicked');
            // Aquí se podría implementar la navegación del calendario
        });
    });
    
    // Funcionalidad para los días del calendario
    const calendarDays = document.querySelectorAll('.calendar-day');
    calendarDays.forEach(day => {
        day.addEventListener('click', function() {
            // Remover selección anterior
            calendarDays.forEach(d => d.classList.remove('selected'));
            // Añadir selección al día clickeado
            this.classList.add('selected');
            console.log('Calendar day selected:', this.textContent);
        });
    });
    
    // Funcionalidad para los botones de acción
    document.addEventListener('click', function(e) {
        if (e.target.closest('.action-button')) {
            const button = e.target.closest('.action-button');
            const icon = button.querySelector('i');
            
            if (icon) {
                if (icon.classList.contains('fa-download')) {
                    console.log('Downloading document...');
                    showNotification('Descargando documento...', 'info');
                } else if (icon.classList.contains('fa-eye')) {
                    console.log('Viewing document...');
                    showNotification('Abriendo documento...', 'info');
                } else if (icon.classList.contains('fa-edit')) {
                    console.log('Editing element...');
                    showNotification('Modo edición activado', 'info');
                }
            }
        }
    });
    
    // Funcionalidad para los botones de fichaje
    document.addEventListener('click', function(e) {
        if (e.target.closest('#fichar .button')) {
            const button = e.target.closest('.button');
            const isEntrada = button.textContent.includes('Entrada');
            const now = new Date();
            const timeString = now.toLocaleTimeString('es-ES');
            
            console.log(`${isEntrada ? 'Entrada' : 'Salida'} registrada a las ${timeString}`);
            showNotification(`${isEntrada ? 'Entrada' : 'Salida'} registrada a las ${timeString}`, 'success');
        }
    });
    
    // Funcionalidad para el formulario de contacto
    const contactForm = document.querySelector('#buzon-contacto .form');
    if (contactForm) {
        const submitButton = contactForm.querySelector('.button-primary');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Contact form submitted');
                
                // Validar campos requeridos
                const requiredFields = contactForm.querySelectorAll('select, input[type="text"], textarea');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        field.style.borderColor = '#c0392b';
                        isValid = false;
                    } else {
                        field.style.borderColor = '#ddd';
                    }
                });
                
                if (isValid) {
                    showNotification('Mensaje enviado correctamente. Recibirás una respuesta en breve.', 'success');
                    contactForm.reset();
                    // Ocultar campos de seguimiento si estaban visibles
                    if (followUpFields) {
                        followUpFields.style.display = 'none';
                    }
                } else {
                    showNotification('Por favor, completa todos los campos requeridos.', 'error');
                }
            });
        }
    }
    
    // Funcionalidad para el formulario de vacaciones
    const vacacionesForm = document.querySelector('#vacaciones .form');
    if (vacacionesForm) {
        const submitButton = vacacionesForm.querySelector('.button-primary');
        if (submitButton) {
            submitButton.addEventListener('click', function(e) {
                e.preventDefault();
                console.log('Vacation form submitted');
                
                const startDate = vacacionesForm.querySelector('input[type="date"]:first-of-type').value;
                const endDate = vacacionesForm.querySelector('input[type="date"]:nth-of-type(2)').value;
                const tipo = vacacionesForm.querySelector('select').value;
                
                if (startDate && endDate && tipo) {
                    // Calcular días
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    const diffTime = Math.abs(end - start);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
                    
                    const message = `Solicitud de ${tipo.toLowerCase()} enviada: ${diffDays} días del ${startDate} al ${endDate}`;
                    showNotification(message, 'success');
                    vacacionesForm.reset();
                } else {
                    showNotification('Por favor, completa todos los campos obligatorios.', 'error');
                }
            });
        }
    }
    
    // Funcionalidad para filtros en las páginas
    const filterSelects = document.querySelectorAll('select[class*="form-select"]');
    filterSelects.forEach(select => {
        select.addEventListener('change', function() {
            console.log(`Filter changed: ${this.value}`);
            // Aquí se implementaría la lógica de filtrado real
        });
    });
    
    // Funcionalidad para búsqueda
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const searchTerm = this.value.trim();
                if (searchTerm) {
                    console.log(`Searching: ${searchTerm}`);
                    showNotification(`Buscando: "${searchTerm}"`, 'info');
                    // Aquí se implementaría la búsqueda real
                }
            }
        });
        
        // Búsqueda en tiempo real (opcional)
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const searchTerm = this.value.trim();
            
            if (searchTerm.length >= 3) {
                searchTimeout = setTimeout(() => {
                    console.log(`Real-time search: ${searchTerm}`);
                    // Implementar búsqueda en tiempo real aquí
                }, 500);
            }
        });
    }
    
    // Manejar el cierre de menús al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.dropdown-toggle') && !e.target.closest('.dropdown-menu')) {
            closeAllDropdowns();
        }
    });
    
    // Cerrar sidebar en móvil al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 576 && 
            !e.target.closest('.sidebar') && 
            !e.target.closest('.menu-toggle') &&
            sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
    });
    
    // Manejar redimensionado de ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth > 576) {
            sidebar.classList.remove('show');
        }
        
        // Cerrar dropdowns en dispositivos móviles
        if (window.innerWidth <= 768) {
            closeAllDropdowns();
        }
    });
    
    // Funcionalidad adicional para mejorar la experiencia de usuario
    
    // Smooth scroll para enlaces internos
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a[href^="#"]');
        if (target && target.getAttribute('href') !== '#' && !target.hasAttribute('data-page')) {
            e.preventDefault();
            const targetElement = document.querySelector(target.getAttribute('href'));
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
    
    // Sistema de notificaciones
    function showNotification(message, type = 'info') {
        // Crear contenedor de notificaciones si no existe
        let notificationContainer = document.getElementById('notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.id = 'notification-container';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(notificationContainer);
        }
        
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background-color: ${type === 'success' ? '#27ae60' : type === 'error' ? '#c0392b' : '#3498db'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            margin-bottom: 10px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: translateX(100%);
            transition: transform 0.3s ease;
            display: flex;
            justify-content: space-between;
            align-items: center;
        `;
        
        notification.innerHTML = `
            <span>${message}</span>
            <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px; margin-left: 10px;">&times;</button>
        `;
        
        notificationContainer.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto-remover después de 5 segundos
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    // Animación de entrada para las tarjetas
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Aplicar animación a las tarjetas después de un pequeño delay
    setTimeout(() => {
        document.querySelectorAll('.card, .info-card, .news-item, .member-card').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });
    }, 500);
    
    // Mostrar/ocultar botón de volver arriba
    const scrollTopButton = document.createElement('button');
    scrollTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollTopButton.className = 'scroll-top-button';
    scrollTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: var(--primary);
        color: white;
        border: none;
        cursor: pointer;
        opacity: 0;
        transition: opacity 0.3s ease, transform 0.3s ease;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    `;
    
    document.body.appendChild(scrollTopButton);
    
    scrollTopButton.addEventListener('click', function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    scrollTopButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.backgroundColor = 'var(--primary-light)';
    });
    
    scrollTopButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.backgroundColor = 'var(--primary)';
    });
    
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollTopButton.style.opacity = '1';
        } else {
            scrollTopButton.style.opacity = '0';
        }
    });
    
    // Funcionalidad de teclado para accesibilidad
    document.addEventListener('keydown', function(e) {
        // ESC para cerrar dropdowns y sidebar móvil
        if (e.key === 'Escape') {
            closeAllDropdowns();
            if (window.innerWidth <= 576) {
                sidebar.classList.remove('show');
            }
        }
        
        // Alt + H para ir al inicio
        if (e.altKey && e.key === 'h') {
            e.preventDefault();
            showPage('inicio');
            const inicioLink = document.querySelector('[data-page="inicio"]');
            if (inicioLink) {
                updateActiveNavigation(inicioLink);
            }
        }
    });
    
    // Lazy loading para imágenes
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });
    
    // Observar todas las imágenes con data-src
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Funcionalidad de favoritos (localStorage)
    function toggleFavorite(pageId) {
        let favorites = JSON.parse(localStorage.getItem('intranet-favorites') || '[]');
        const index = favorites.indexOf(pageId);
        
        if (index > -1) {
            favorites.splice(index, 1);
            showNotification('Eliminado de favoritos', 'info');
        } else {
            favorites.push(pageId);
            showNotification('Añadido a favoritos', 'success');
        }
        
        localStorage.setItem('intranet-favorites', JSON.stringify(favorites));
        updateFavoriteIcons();
    }
    
    function updateFavoriteIcons() {
        const favorites = JSON.parse(localStorage.getItem('intranet-favorites') || '[]');
        document.querySelectorAll('[data-favorite]').forEach(btn => {
            const pageId = btn.getAttribute('data-favorite');
            const icon = btn.querySelector('i');
            if (favorites.includes(pageId)) {
                icon.classList.remove('far');
                icon.classList.add('fas');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
            }
        });
    }
    
    // Manejar clicks en botones de favoritos
    document.addEventListener('click', function(e) {
        if (e.target.closest('[data-favorite]')) {
            e.preventDefault();
            const button = e.target.closest('[data-favorite]');
            const pageId = button.getAttribute('data-favorite');
            toggleFavorite(pageId);
        }
    });
    
    // Inicializar favoritos
    updateFavoriteIcons();
    
    // Debug: Mostrar información del estado actual
    function debugInfo() {
        console.log('=== INTRANET DEBUG INFO ===');
        console.log('Página visible:', document.querySelector('[id][style*="display: block"], [id]:not([style*="display: none"])'));
        console.log('Dropdowns abiertos:', document.querySelectorAll('.dropdown-menu.show').length);
        console.log('Navegación activa:', document.querySelector('.nav-item.active'));
        console.log('Sidebar móvil:', sidebar.classList.contains('show') ? 'Visible' : 'Oculto');
        console.log('Ancho de ventana:', window.innerWidth);
        console.log('========================');
    }
    
    // Activar debug con Ctrl+Shift+D
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            debugInfo();
        }
    });
    
    // Inicialización completa
    console.log('🚀 Intranet inicializada correctamente');
    console.log('📱 Responsive design activado');
    console.log('⌨️ Atajos de teclado: Alt+H (Inicio), Esc (Cerrar menús), Ctrl+Shift+D (Debug)');
    console.log('✨ Todas las funcionalidades cargadas');
    
    // Mostrar notificación de bienvenida
    setTimeout(() => {
        showNotification('¡Bienvenido a la Intranet! Sistema cargado correctamente.', 'success');
    }, 1000);
});
// =========================================================================
// FUNCIONES ESPECÍFICAS PARA NUEVAS SECCIONES
// =========================================================================

/**
 * Inicializa la funcionalidad específica de actas y comunicaciones
 */
function initActasComunicaciones() {
    const actasSearch = document.getElementById('actas-search');
    const actasSearchBtn = document.getElementById('actas-search-btn');
    const actasYearFilter = document.getElementById('actas-year-filter');
    const actasTypeFilter = document.getElementById('actas-type-filter');
    const noResultsActas = document.getElementById('no-results-actas');
    const resultsCount = document.getElementById('results-count');
    
    if (!actasSearch) return;
    
    function filterActasDocuments() {
        const searchTerm = actasSearch.value.toLowerCase().trim();
        const selectedYear = actasYearFilter.value;
        const selectedType = actasTypeFilter.value;
        const documentItems = document.querySelectorAll('#actas-document-list .document-item');
        
        let visibleCount = 0;
        
        documentItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('.document-description').textContent.toLowerCase();
            const date = item.querySelector('.document-date').textContent.toLowerCase();
            const itemYear = item.getAttribute('data-year');
            const itemType = item.getAttribute('data-type');
            
            const matchesSearch = searchTerm === '' || 
                                 title.includes(searchTerm) || 
                                 description.includes(searchTerm) || 
                                 date.includes(searchTerm);
                                 
            const matchesYear = selectedYear === 'todos' || selectedYear === itemYear;
            const matchesType = selectedType === 'todos' || selectedType === itemType;
            
            if (matchesSearch && matchesYear && matchesType) {
                item.style.display = 'flex';
                visibleCount++;
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Actualizar contador de resultados
        if (resultsCount) {
            resultsCount.textContent = visibleCount;
        }
        
        // Mostrar/ocultar mensaje de sin resultados
        if (noResultsActas) {
            if (visibleCount === 0) {
                noResultsActas.style.display = 'block';
            } else {
                noResultsActas.style.display = 'none';
            }
        }
    }
    
    // Event listeners
    if (actasSearchBtn) {
        actasSearchBtn.addEventListener('click', filterActasDocuments);
    }
    
    if (actasSearch) {
        actasSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                filterActasDocuments();
            }
        });
        
        actasSearch.addEventListener('input', debounce(filterActasDocuments, 300));
    }
    
    if (actasYearFilter) {
        actasYearFilter.addEventListener('change', filterActasDocuments);
    }
    
    if (actasTypeFilter) {
        actasTypeFilter.addEventListener('change', filterActasDocuments);
    }
    
    // Inicializar filtros
    filterActasDocuments();
}

/**
 * Función para resetear la búsqueda de actas
 */
function resetActasSearch() {
    const actasSearch = document.getElementById('actas-search');
    const actasYearFilter = document.getElementById('actas-year-filter');
    const actasTypeFilter = document.getElementById('actas-type-filter');
    
    if (actasSearch) actasSearch.value = '';
    if (actasYearFilter) actasYearFilter.value = '2025';
    if (actasTypeFilter) actasTypeFilter.value = 'todos';
    
    initActasComunicaciones();
}

/**
 * Inicializa las interacciones para los cursos de formación
 */
function initFormacionCursos() {
    const cursosButtons = document.querySelectorAll('#formacion-obligatoria .sin-btn-small');
    
    cursosButtons.forEach(button => {
        if (button.textContent.includes('Acceder') || button.textContent.includes('Inscribirse')) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const originalText = this.innerHTML;
                const isInscripcion = originalText.includes('Inscribirse');
                
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
                this.disabled = true;
                
                setTimeout(() => {
                    if (isInscripcion) {
                        this.innerHTML = '<i class="fas fa-check"></i> Inscrito';
                        this.classList.add('success');
                        showGulaTooltip('¡Inscripción completada!');
                    } else {
                        this.innerHTML = '<i class="fas fa-play"></i> Iniciar curso';
                        showGulaTooltip('Accediendo al curso...');
                    }
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                        this.disabled = false;
                        this.classList.remove('success');
                    }, 3000);
                }, 1500);
            });
        }
    });
}

/**
 * Inicializa efectos especiales para los elementos de riesgo
 */
function initRiesgosList() {
    const riesgoItems = document.querySelectorAll('.riesgo-item');
    
    riesgoItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const icon = item.querySelector('.riesgo-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.boxShadow = '0 0 20px rgba(255, 0, 102, 0.3)';
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const icon = item.querySelector('.riesgo-icon');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.boxShadow = '';
            }
        });
    });
}

/**
 * Anima los pasos del protocolo de emergencias
 */
function initEmergencySteps() {
    const emergencySteps = document.querySelectorAll('.emergency-step');
    
    emergencySteps.forEach((step, index) => {
        step.addEventListener('click', () => {
            // Efecto de pulso en el número del paso
            const stepNumber = step.querySelector('.step-number');
            if (stepNumber) {
                stepNumber.style.transform = 'scale(1.2)';
                stepNumber.style.boxShadow = '0 0 15px var(--primary-color)';
                
                setTimeout(() => {
                    stepNumber.style.transform = 'scale(1)';
                    stepNumber.style.boxShadow = '';
                }, 300);
            }
            
            showGulaTooltip(`Paso ${index + 1} del protocolo de emergencias`);
        });
    });
}

// =========================================================================
// INICIALIZACIÓN DE NUEVAS FUNCIONES
// =========================================================================

// Agregar estas funciones al final de la función principal DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    // ... código existente ...
    
    // Inicializar nuevas funcionalidades
    initActasComunicaciones();
    initFormacionCursos();
    initRiesgosList();
    initEmergencySteps();
    
    console.log("🔥 Nuevas secciones de GULA Intranet inicializadas");
});
// =========================================================================
// FUNCIONES CORREGIDAS PARA NUEVAS SECCIONES
// =========================================================================

/**
 * Función para resetear la búsqueda de actas
 */
function resetActasSearch() {
    const actasSearch = document.getElementById('actas-search');
    const actasYearFilter = document.getElementById('actas-year-filter');
    const actasTypeFilter = document.getElementById('actas-type-filter');
    
    if (actasSearch) actasSearch.value = '';
    if (actasYearFilter) actasYearFilter.value = '2025';
    if (actasTypeFilter) actasTypeFilter.value = 'todos';
    
    if (typeof initActasComunicaciones === 'function') {
        initActasComunicaciones();
    }
}

/**
 * Inicializa la funcionalidad específica de actas y comunicaciones
 */
function initActasComunicaciones() {
    const actasSearch = document.getElementById('actas-search');
    const actasSearchBtn = document.getElementById('actas-search-btn');
    const actasYearFilter = document.getElementById('actas-year-filter');
    const actasTypeFilter = document.getElementById('actas-type-filter');
    const noResultsActas = document.getElementById('no-results-actas');
    const resultsCount = document.getElementById('results-count');
    
    if (!actasSearch) return;
    
    function filterActasDocuments() {
        const searchTerm = actasSearch.value.toLowerCase().trim();
        const selectedYear = actasYearFilter ? actasYearFilter.value : 'todos';
        const selectedType = actasTypeFilter ? actasTypeFilter.value : 'todos';
        const documentItems = document.querySelectorAll('#actas-document-list .document-item');
        
        let visibleCount = 0;
        
        documentItems.forEach(item => {
            const title = item.querySelector('h3').textContent.toLowerCase();
            const description = item.querySelector('.document-description').textContent.toLowerCase();
            const date = item.querySelector('.document-date').textContent.toLowerCase();
            const itemYear = item.getAttribute('data-year');
            const itemType = item.getAttribute('data-type');
            
            const matchesSearch = searchTerm === '' || 
                                 title.includes(searchTerm) || 
                                 description.includes(searchTerm) || 
                                 date.includes(searchTerm);
                                 
            const matchesYear = selectedYear === 'todos' || selectedYear === itemYear;
            const matchesType = selectedType === 'todos' || selectedType === itemType;
            
            if (matchesSearch && matchesYear && matchesType) {
                item.style.display = 'flex';
                visibleCount++;
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, 50);
            } else {
                item.style.opacity = '0';
                item.style.transform = 'translateY(10px)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
        
        // Actualizar contador de resultados
        if (resultsCount) {
            resultsCount.textContent = visibleCount;
        }
        
        // Mostrar/ocultar mensaje de sin resultados
        if (noResultsActas) {
            if (visibleCount === 0) {
                noResultsActas.style.display = 'block';
            } else {
                noResultsActas.style.display = 'none';
            }
        }
    }
    
    // Event listeners
    if (actasSearchBtn) {
        actasSearchBtn.addEventListener('click', filterActasDocuments);
    }
    
    if (actasSearch) {
        actasSearch.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                filterActasDocuments();
            }
        });
        
        actasSearch.addEventListener('input', debounce(filterActasDocuments, 300));
    }
    
    if (actasYearFilter) {
        actasYearFilter.addEventListener('change', filterActasDocuments);
    }
    
    if (actasTypeFilter) {
        actasTypeFilter.addEventListener('change', filterActasDocuments);
    }
    
    // Inicializar filtros
    filterActasDocuments();
}

/**
 * Función de utilidad para debounce
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Inicializa las descargas de documentos
 */
function initDocumentDownloads() {
    const downloadLinks = document.querySelectorAll('.document-download');
    
    downloadLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Si no hay href o es un enlace placeholder, prevenir y simular descarga
            if (!href || href === '#') {
                e.preventDefault();
                
                const originalText = this.innerHTML;
                this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Descargando...';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-check"></i> Descargado';
                    
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 1500);
                }, 800);
            }
        });
    });
}

// =========================================================================
// INICIALIZACIÓN AL CARGAR EL DOM
// =========================================================================

document.addEventListener('DOMContentLoaded', function() {
    // Esperar un poco para asegurar que todo está cargado
    setTimeout(() => {
        initActasComunicaciones();
        initDocumentDownloads();
        
        console.log("✅ Funciones de GULA Intranet inicializadas correctamente");
    }, 500);
});