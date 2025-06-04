document.addEventListener('DOMContentLoaded', function() {
  // Form element references
  const formSteps = document.querySelectorAll('.form-step');
  const nextButtons = document.querySelectorAll('.btn-next');
  const prevButtons = document.querySelectorAll('.btn-prev');
  const stepIndicators = document.querySelectorAll('.step');
  const form = document.getElementById('reservation-form');
  
  // Form field references
  const nameField = document.getElementById('name');
  const emailField = document.getElementById('email');
  const phoneField = document.getElementById('phone');
  const guestsField = document.getElementById('guests');
  const locationField = document.getElementById('location');
  const dateField = document.getElementById('date');
  const timeField = document.getElementById('time');
  const commentsField = document.getElementById('comments');
  
  // Quantity button references
  const btnIncrease = document.getElementById('increase-guests');
  const btnDecrease = document.getElementById('decrease-guests');
  
  // Summary element references
  const summaryName = document.getElementById('summary-name');
  const summaryEmail = document.getElementById('summary-email');
  const summaryPhone = document.getElementById('summary-phone');
  const summaryGuests = document.getElementById('summary-guests');
  const summaryLocation = document.getElementById('summary-location');
  const summaryDate = document.getElementById('summary-date');
  const summaryTime = document.getElementById('summary-time');
  
  // Available times container
  const timesContainer = document.getElementById('available-times');
  
  // Notification
  const notification = document.getElementById('notification');
  const notificationMessage = document.querySelector('.notification-message');
  
  // Set minimum date (today)
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  dateField.min = minDate;
  
  // ===== Functions for navigating between steps =====
  function goToStep(currentStep, nextStep) {
    // Validate current step before continuing
    if (nextStep > currentStep && !validateStep(currentStep)) {
      showNotification('Please complete all required fields', 'error');
      return false;
    }
    
    // Hide current step
    formSteps[currentStep - 1].classList.remove('active');
    
    // Show next step
    formSteps[nextStep - 1].classList.add('active');
    
    // Update step indicators
    stepIndicators.forEach((step, index) => {
      if (index + 1 <= nextStep) {
        step.classList.add('active');
      } else {
        step.classList.remove('active');
      }
    });
    
    // If going to step 3 (summary), update the data
    if (nextStep === 3) {
      updateSummary();
    }
    
    return true;
  }
  
  // ===== Step validation =====
  function validateStep(step) {
    switch (step) {
      case 1:
        return (
          nameField.value.trim() !== '' &&
          emailField.value.trim() !== '' &&
          phoneField.value.trim() !== '' &&
          locationField.value !== null &&
          locationField.value !== ''
        );
      case 2:
        return (
          dateField.value !== '' &&
          timeField.value !== ''
        );
      default:
        return true;
    }
  }
  
  // ===== Update summary =====
  function updateSummary() {
    summaryName.textContent = nameField.value;
    summaryEmail.textContent = emailField.value;
    summaryPhone.textContent = phoneField.value;
    summaryGuests.textContent = guestsField.value;
    
    // Get location name from value
    const locationIndex = locationField.selectedIndex;
    const locationText = locationIndex > 0 ? locationField.options[locationIndex].text : '';
    summaryLocation.textContent = locationText;
    
    // Format date
    const date = new Date(dateField.value);
    const dateFormat = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
    summaryDate.textContent = dateFormat;
    
    summaryTime.textContent = timeField.value;
  }
  
  // ===== Generate available times =====
  function generateAvailableTimes(date) {
    // Clear previous times
    timesContainer.innerHTML = '';
    
    // If it's a weekend (5 = Friday, 6 = Saturday), show extended hours
    const isWeekend = [5, 6].includes(new Date(date).getDay());
    
    // Generate time slots (simulation)
    const startHour = 13; // 1:00 PM
    const endHour = isWeekend ? 23 : 22; // 11:00 PM or 10:00 PM
    
    for (let hour = startHour; hour <= endHour; hour++) {
      // For each hour, create two slots (XX:00 and XX:30)
      for (let minutes of ['00', '30']) {
        const fullTime = `${hour}:${minutes}`;
        
        // Simulate random availability
        const available = Math.random() > 0.3; // 70% availability
        
        const timeElement = document.createElement('div');
        timeElement.className = `hora-slot ${available ? '' : 'disabled'}`;
        timeElement.textContent = fullTime;
        
        if (available) {
          timeElement.addEventListener('click', () => {
            // Deselect previous time
            document.querySelectorAll('.hora-slot.selected').forEach(slot => {
              slot.classList.remove('selected');
            });
            
            // Select this time
            timeElement.classList.add('selected');
            
            // Save time in hidden field
            timeField.value = fullTime;
          });
        }
        
        timesContainer.appendChild(timeElement);
      }
    }
  }
  
  // ===== Show notification =====
  function showNotification(message, type = 'success') {
    notificationMessage.textContent = message;
    
    // Change icon based on type
    const notificationIcon = document.querySelector('.notification-icon');
    
    if (type === 'success') {
      notificationIcon.className = 'notification-icon fas fa-check-circle';
    } else if (type === 'error') {
      notificationIcon.className = 'notification-icon fas fa-exclamation-circle';
    } else {
      notificationIcon.className = 'notification-icon fas fa-info-circle';
    }
    
    // Show notification
    notification.classList.add('show');
    
    // Hide after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show');
    }, 3000);
  }
  
  // ===== Event Listeners =====
  
  // Navigation between steps
  nextButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const currentStep = parseInt(this.closest('.form-step').id.split('-')[1]);
      const nextStep = parseInt(this.dataset.next.split('-')[1]);
      goToStep(currentStep, nextStep);
    });
  });
  
  prevButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      const currentStep = parseInt(this.closest('.form-step').id.split('-')[1]);
      const prevStep = parseInt(this.dataset.prev.split('-')[1]);
      goToStep(currentStep, prevStep);
    });
  });
  
  // Guest count control
  btnIncrease.addEventListener('click', () => {
    const currentValue = parseInt(guestsField.value);
    if (currentValue < 10) {
      guestsField.value = currentValue + 1;
    }
  });
  
  btnDecrease.addEventListener('click', () => {
    const currentValue = parseInt(guestsField.value);
    if (currentValue > 1) {
      guestsField.value = currentValue - 1;
    }
  });
  
  // When date changes, generate available times
  dateField.addEventListener('change', () => {
    if (dateField.value) {
      generateAvailableTimes(dateField.value);
    }
  });
  
  // Form submission
  form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    // Validate terms
    const termsAccepted = document.getElementById('terms').checked;
    if (!termsAccepted) {
      showNotification('You must accept the terms and conditions', 'error');
      return;
    }
    
    // Simulate form submission
    // In a real case, you would send the data here via fetch or similar
    
    // Show success notification
    showNotification('Reservation confirmed successfully! You will receive an email with the details.');
    
    // Reset form after 2 seconds
    setTimeout(() => {
      form.reset();
      
      // Return to first step
      goToStep(3, 1);
      
      // Clear time selection
      document.querySelectorAll('.hora-slot.selected').forEach(slot => {
        slot.classList.remove('selected');
      });
      
      // Reset guest count to 2
      guestsField.value = 2;
    }, 2000);
  });
  
  // Generate available times by default for today
  generateAvailableTimes(minDate);
  
  // Change color of floating embers to match the theme
  const embers = document.querySelectorAll('.floating-ember');
  embers.forEach(ember => {
    // Colors that match the burger restaurant theme
    const colors = ['#ff0066', '#00ffcc', '#ffcc00', '#ff3300', '#cc9900'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    ember.style.backgroundColor = randomColor;
    ember.style.boxShadow = `0 0 10px ${randomColor}`;
  });
});