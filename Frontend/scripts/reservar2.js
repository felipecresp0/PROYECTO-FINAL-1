document.addEventListener('DOMContentLoaded', () => {
  console.log("🔥 FoodTruck Booking Page Successfully Loaded - Infernal Mode Activated");
  
  // DOM element references
  const searchToggle = document.getElementById("search-toggle");
  const searchOverlay = document.querySelector(".search-overlay");
  const closeSearch = document.querySelector(".close-search");
  const menuToggle = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");
  
  // Form elements
  const form = document.getElementById('reserva-form');
  const steps = document.querySelectorAll('.form-step');
  const progressSteps = document.querySelectorAll('.progress-step');
  const nextBtns = document.querySelectorAll('.next-btn');
  const prevBtns = document.querySelectorAll('.prev-btn');
  const menuOptions = document.querySelectorAll('.menu-option');
  const confirmationModal = document.getElementById('confirmation-modal');
  
  // FAQ elements
  const faqItems = document.querySelectorAll('.faq-item');
  
  // Testimonial elements
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.dot');
  
  let currentStep = 1;
  let currentTestimonial = 0;
  let testimonialInterval;
  
  // Search Overlay Functionality
  if (searchToggle && searchOverlay && closeSearch) {
    searchToggle.addEventListener("click", () => {
      searchOverlay.classList.add("active");
      document.body.style.overflow = "hidden";
      setTimeout(() => {
        document.querySelector(".search-input-overlay").focus();
      }, 100);
    });
    
    closeSearch.addEventListener("click", () => {
      searchOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
    
    // Close search with ESC key
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        searchOverlay.classList.remove('active');
        document.body.style.overflow = "";
      }
    });
  }
  
  // Mobile menu functionality
  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      
      // Add close button if it doesn't exist
      if (!navLinks.querySelector('.close-menu')) {
        const closeButton = document.createElement('button');
        closeButton.className = 'close-menu';
        closeButton.innerHTML = '<i class="fas fa-times"></i>';
        navLinks.prepend(closeButton);
        
        // Event to close
        closeButton.addEventListener('click', () => {
          navLinks.classList.remove('active');
        });
      }
    });
  }
  
  // Initialize form functionality
  initializeForm();
  
  // Initialize FAQs
  initializeFAQs();
  
  // Initialize testimonials
  initializeTestimonials();
  
  // Initialize cart counter
  updateCartCount();
  
  // Add hover effects to navigation
  const navItems = document.querySelectorAll('.nav-links a');
  navItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      if (!item.classList.contains('active')) {
        item.style.color = '#ff0066';
        item.style.textShadow = '0 0 10px rgba(255, 0, 102, 0.7), 0 0 20px rgba(255, 0, 102, 0.5)';
      }
    });
    item.addEventListener('mouseleave', () => {
      if (!item.classList.contains('active')) {
        item.style.color = '';
        item.style.textShadow = '';
      }
    });
  });
  
  // Create fire particle effect
  createFireEffect();
  
  // Random neon effect in header elements
  setInterval(() => {
    const randomElement = document.querySelectorAll('.nav-links a, .header-right i')[Math.floor(Math.random() * 5)];
    if (randomElement) {
      randomElement.style.textShadow = '0 0 15px rgba(255, 0, 102, 1), 0 0 30px rgba(255, 0, 102, 0.8)';
      
      setTimeout(() => {
        randomElement.style.textShadow = '';
      }, 500);
    }
  }, 2000);
  
  // Initialize AOS if available
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      offset: 100,
      once: true
    });
  }
});

/**
 * Initialize form functionality
 */
function initializeForm() {
  const nextBtns = document.querySelectorAll('.next-btn');
  const prevBtns = document.querySelectorAll('.prev-btn');
  const form = document.getElementById('reserva-form');
  const menuOptions = document.querySelectorAll('.menu-option');
  
  // Add event listeners to navigation buttons
  nextBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (validateCurrentStep()) {
        nextStep();
      }
    });
  });
  
  prevBtns.forEach(btn => {
    btn.addEventListener('click', prevStep);
  });
  
  // Add event listeners to menu options
  menuOptions.forEach(option => {
    option.addEventListener('click', () => {
      // Remove selection from all options
      menuOptions.forEach(opt => opt.classList.remove('selected'));
      // Add selection to clicked option
      option.classList.add('selected');
      // Update hidden input value
      const menuSeleccionado = document.getElementById('menu-seleccionado');
      if (menuSeleccionado) {
        menuSeleccionado.value = option.dataset.menu;
      }
    });
  });
  
  // Add form submit event listener
  if (form) {
    form.addEventListener('submit', handleFormSubmit);
  }
  
  // Set minimum date to today
  const fechaInput = document.getElementById('fecha');
  if (fechaInput) {
    const today = new Date().toISOString().split('T')[0];
    fechaInput.min = today;
  }
  
  // Add real-time validation
  addRealTimeValidation();
}

/**
 * Navigate to next step
 */
function nextStep() {
  if (currentStep < 3) {
    // Hide current step
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    
    // Update progress
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('completed');
    
    // Show next step
    currentStep++;
    document.getElementById(`step-${currentStep}`).style.display = 'block';
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');
    
    // Scroll to top of form
    document.querySelector('.reserva-form-container').scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

/**
 * Navigate to previous step
 */
function prevStep() {
  if (currentStep > 1) {
    // Hide current step
    document.getElementById(`step-${currentStep}`).style.display = 'none';
    
    // Update progress
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('active');
    
    // Show previous step
    currentStep--;
    document.getElementById(`step-${currentStep}`).style.display = 'block';
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.add('active');
    document.querySelector(`.progress-step[data-step="${currentStep}"]`).classList.remove('completed');
    
    // Scroll to top of form
    document.querySelector('.reserva-form-container').scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
}

/**
 * Validate current step
 */
function validateCurrentStep() {
  let isValid = true;
  const currentStepElement = document.getElementById(`step-${currentStep}`);
  const requiredFields = currentStepElement.querySelectorAll('[required]');
  
  // Clear previous errors
  currentStepElement.querySelectorAll('.error-message').forEach(error => {
    error.classList.remove('show');
  });
  
  requiredFields.forEach(field => {
    const fieldValue = field.value.trim();
    const errorElement = document.getElementById(`error-${field.name}`);
    
    if (!fieldValue) {
      if (errorElement) {
        errorElement.textContent = 'This field is required';
        errorElement.classList.add('show');
      }
      isValid = false;
    } else {
      // Specific validations
      if (field.type === 'email' && !isValidEmail(fieldValue)) {
        if (errorElement) {
          errorElement.textContent = 'Please enter a valid email';
          errorElement.classList.add('show');
        }
        isValid = false;
      } else if (field.type === 'tel' && !isValidPhone(fieldValue)) {
        if (errorElement) {
          errorElement.textContent = 'Please enter a valid phone number';
          errorElement.classList.add('show');
        }
        isValid = false;
      } else if (field.name === 'fecha' && !isValidDate(fieldValue)) {
        if (errorElement) {
          errorElement.textContent = 'The date must be at least 7 days from today';
          errorElement.classList.add('show');
        }
        isValid = false;
      } else if (field.name === 'invitados' && parseInt(fieldValue) < 20) {
        if (errorElement) {
          errorElement.textContent = 'Minimum 20 guests required';
          errorElement.classList.add('show');
        }
        isValid = false;
      } else if (field.name === 'duracion' && (parseInt(fieldValue) < 2 || parseInt(fieldValue) > 8)) {
        if (errorElement) {
          errorElement.textContent = 'Duration must be between 2 and 8 hours';
          errorElement.classList.add('show');
        }
        isValid = false;
      }
    }
  });
  
  // Special validation for step 3
  if (currentStep === 3) {
    const menuSeleccionado = document.getElementById('menu-seleccionado').value;
    const terminos = document.getElementById('terminos');
    
    if (!menuSeleccionado) {
      showNotification('Please select a menu option', 'error');
      isValid = false;
    }
    
    if (!terminos.checked) {
      const errorElement = document.getElementById('error-terminos');
      if (errorElement) {
        errorElement.textContent = 'You must accept the terms and conditions';
        errorElement.classList.add('show');
      }
      isValid = false;
    }
  }
  
  return isValid;
}

/**
 * Add real-time validation
 */
function addRealTimeValidation() {
  const inputs = document.querySelectorAll('input, select, textarea');
  
  inputs.forEach(input => {
    input.addEventListener('blur', () => {
      validateField(input);
    });
    
    input.addEventListener('input', () => {
      // Clear error on input
      const errorElement = document.getElementById(`error-${input.name}`);
      if (errorElement) {
        errorElement.classList.remove('show');
      }
    });
  });
}

/**
 * Validate individual field
 */
function validateField(field) {
  const fieldValue = field.value.trim();
  const errorElement = document.getElementById(`error-${field.name}`);
  
  if (!errorElement) return;
  
  errorElement.classList.remove('show');
  
  if (field.required && !fieldValue) {
    errorElement.textContent = 'This field is required';
    errorElement.classList.add('show');
    return false;
  }
  
  if (field.type === 'email' && fieldValue && !isValidEmail(fieldValue)) {
    errorElement.textContent = 'Please enter a valid email';
    errorElement.classList.add('show');
    return false;
  }
  
  if (field.type === 'tel' && fieldValue && !isValidPhone(fieldValue)) {
    errorElement.textContent = 'Please enter a valid phone number';
    errorElement.classList.add('show');
    return false;
  }
  
  return true;
}

/**
 * Handle form submission
 */
function handleFormSubmit(e) {
  e.preventDefault();
  
  if (!validateCurrentStep()) {
    return;
  }
  
  // Show loading state
  const submitBtn = document.querySelector('.submit-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> SENDING...';
  submitBtn.disabled = true;
  
  // Collect form data
  const formData = new FormData(e.target);
  const bookingData = {};
  
  for (let [key, value] of formData.entries()) {
    bookingData[key] = value;
  }
  
  // Add selected menu
  bookingData['menu-seleccionado'] = document.getElementById('menu-seleccionado').value;
  
  // Simulate API call
  setTimeout(() => {
    console.log('Booking data:', bookingData);
    
    // Reset form
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    // Generate reference number
    const referenceId = 'GULA-FT-' + Date.now().toString().slice(-6);
    document.getElementById('reference-id').textContent = referenceId;
    
    // Show confirmation modal
    showConfirmationModal();
    
    // Save to localStorage (optional)
    localStorage.setItem('lastBooking', JSON.stringify({
      ...bookingData,
      reference: referenceId,
      date: new Date().toISOString()
    }));
    
    showNotification('Booking request sent successfully!', 'success');
    
  }, 2000); // Simulate network delay
}

/**
 * Show confirmation modal
 */
function showConfirmationModal() {
  const modal = document.getElementById('confirmation-modal');
  if (modal) {
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Add event listeners for closing modal
    const closeModal = modal.querySelector('.close-modal');
    const modalButton = modal.querySelector('.modal-button');
    
    function closeModalFunction() {
      modal.classList.remove('show');
      document.body.style.overflow = '';
      
      // Reset form
      document.getElementById('reserva-form').reset();
      currentStep = 1;
      
      // Reset form steps
      document.querySelectorAll('.form-step').forEach((step, index) => {
        step.style.display = index === 0 ? 'block' : 'none';
      });
      
      // Reset progress steps
      document.querySelectorAll('.progress-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index === 0) {
          step.classList.add('active');
        }
      });
      
      // Clear menu selection
      document.querySelectorAll('.menu-option').forEach(option => {
        option.classList.remove('selected');
      });
      document.getElementById('menu-seleccionado').value = '';
    }
    
    closeModal.addEventListener('click', closeModalFunction);
    modalButton.addEventListener('click', closeModalFunction);
    
    // Close on outside click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModalFunction();
      }
    });
  }
}

/**
 * Initialize FAQs functionality
 */
function initializeFAQs() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all other FAQs
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle current FAQ
      if (isActive) {
        item.classList.remove('active');
      } else {
        item.classList.add('active');
      }
    });
  });
}

/**
 * Initialize testimonials carousel
 */
function initializeTestimonials() {
  const testimonialCards = document.querySelectorAll('.testimonial-card');
  const testimonialDots = document.querySelectorAll('.dot');
  let currentTestimonial = 0;
  let testimonialInterval;
  
  function showTestimonial(index) {
    // Hide all testimonials
    testimonialCards.forEach(card => card.classList.remove('active'));
    testimonialDots.forEach(dot => dot.classList.remove('active'));
    
    // Show selected testimonial
    if (testimonialCards[index]) {
      testimonialCards[index].classList.add('active');
    }
    if (testimonialDots[index]) {
      testimonialDots[index].classList.add('active');
    }
    
    currentTestimonial = index;
  }
  
  function nextTestimonial() {
    const nextIndex = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(nextIndex);
  }
  
  function startAutoplay() {
    testimonialInterval = setInterval(nextTestimonial, 5000);
  }
  
  function stopAutoplay() {
    if (testimonialInterval) {
      clearInterval(testimonialInterval);
    }
  }
  
  // Add click events to dots
  testimonialDots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      stopAutoplay();
      showTestimonial(index);
      startAutoplay();
    });
  });
  
  // Pause autoplay on hover
  const testimonialSection = document.querySelector('.testimonials-section');
  if (testimonialSection) {
    testimonialSection.addEventListener('mouseenter', stopAutoplay);
    testimonialSection.addEventListener('mouseleave', startAutoplay);
  }
  
  // Start autoplay
  startAutoplay();
}

/**
 * Validation helper functions
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[\d\s\-\(\)]{9,}$/;
  return phoneRegex.test(phone);
}

function isValidDate(dateString) {
  const selectedDate = new Date(dateString);
  const today = new Date();
  const minDate = new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)); // 7 days from today
  
  return selectedDate >= minDate;
}

/**
 * Show notification
 */
function showNotification(message, type = 'info') {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll('.notification');
  existingNotifications.forEach(n => n.remove());
  
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const iconClass = type === 'success' ? 'fa-check-circle' : 
                   type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle';
  
  notification.innerHTML = `
    <i class="fas ${iconClass}"></i>
    <span>${message}</span>
  `;
  
  // Add to DOM
  document.body.appendChild(notification);
  
  // Show with animation
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Hide after 4 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 4000);
}

/**
 * Create fire particle effect
 */
function createFireEffect() {
  setInterval(() => {
    // Create particle
    const particle = document.createElement('div');
    particle.className = 'fire-particle';
    
    // Random position at bottom of screen
    const posX = Math.random() * window.innerWidth;
    particle.style.left = `${posX}px`;
    particle.style.bottom = '0';
    
    // Random color between red and orange
    const hue = Math.floor(Math.random() * 30);
    const saturation = 90 + Math.floor(Math.random() * 10);
    const lightness = 50 + Math.floor(Math.random() * 10);
    particle.style.backgroundColor = `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    
    // Random size
    const size = 5 + Math.random() * 10;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Add to DOM
    document.body.appendChild(particle);
    
    // Remove after animation
    setTimeout(() => {
      particle.remove();
    }, 3000);
  }, 300);
}

/**
 * Update cart counter
 */
function updateCartCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const cartCountElement = document.querySelector('.cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cart.length;
    
    // Add highlight class if there are items
    if (cart.length > 0) {
      cartCountElement.classList.add('highlighted');
    } else {
      cartCountElement.classList.remove('highlighted');
    }
  }
}

// Add CSS styles for notifications and mobile navigation
const styleElement = document.createElement('style');
styleElement.textContent = `
  .notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    z-index: 2001;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 10px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
    border: 1px solid var(--primary-color);
  }
  
  .notification.show {
    opacity: 1;
    transform: translateY(0);
  }
  
  .notification.success {
    border-color: var(--secondary-color);
    box-shadow: 0 0 15px rgba(0, 255, 204, 0.5);
  }
  
  .notification.success i {
    color: var(--secondary-color);
  }
  
  .notification.error {
    border-color: #ff3300;
    box-shadow: 0 0 15px rgba(255, 51, 0, 0.5);
  }
  
  .notification.error i {
    color: #ff3300;
  }
  
  .notification.info {
    border-color: var(--accent-color);
    box-shadow: 0 0 15px rgba(255, 204, 0, 0.5);
  }
  
  .notification.info i {
    color: var(--accent-color);
  }
  
  .fire-particle {
    position: fixed;
    pointer-events: none;
    width: 10px;
    height: 10px;
    background-color: var(--primary-color);
    border-radius: 50%;
    opacity: 0;
    z-index: 1;
    animation: float-up 3s ease-out;
  }
  
  @keyframes float-up {
    0% {
      transform: translateY(0) scale(1);
      opacity: 0.8;
    }
    100% {
      transform: translateY(-100px) scale(0);
      opacity: 0;
    }
  }
  
  /* Mobile navigation styles */
  @media (max-width: 767px) {
    .nav-links {
      position: fixed;
      top: 0;
      left: -100%;
      width: 280px;
      height: 100vh;
      background-color: rgba(0, 0, 0, 0.95);
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 2rem;
      transition: left 0.3s ease;
      z-index: 2000;
      border-right: 2px solid var(--primary-color);
      box-shadow: 0 0 30px rgba(255, 0, 102, 0.5);
    }
    
    .nav-links.active {
      left: 0;
    }
    
    .nav-links a {
      font-size: 1.5rem;
      padding: 1rem;
      width: 100%;
      text-align: center;
      border-bottom: 1px solid rgba(255, 0, 102, 0.3);
    }
    
    .close-menu {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      color: var(--primary-color);
      font-size: 1.5rem;
      cursor: pointer;
    }
  }
`;

document.head.appendChild(styleElement);