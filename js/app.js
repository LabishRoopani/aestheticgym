/**
 * The Gym — Client Interactions Controller
 * Developed by Finity Sync for The Gym Premium Network
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initActiveLinkObserver();
  initStatsCounter();
  initClassFilters();
  initPricingToggle();
  initTestimonialsCarousel();
  initLocationSelector();
  initContactForm();
});

/* ==========================================================================
   1. Navbar & Mobile Menu Controls
   ========================================================================== */
function initNavbar() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta');

  // Change background on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Toggle mobile menu
  navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
  });

  // Close mobile menu on link click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('active');
    });
  });
}

/* ==========================================================================
   2. Active Link Highlighter
   ========================================================================== */
function initActiveLinkObserver() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the middle of the screen
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   3. Stats Counter Animation
   ========================================================================== */
function initStatsCounter() {
  const statsSection = document.querySelector('.stats');
  const statItems = document.querySelectorAll('.stat-item h3');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        statItems.forEach(item => {
          const target = parseInt(item.getAttribute('data-target'), 10);
          animateValue(item, 0, target, 2000);
        });
        animated = true;
      }
    });
  }, { threshold: 0.5 });

  if (statsSection) {
    observer.observe(statsSection);
  }

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Calculate active count
      let currentVal = Math.floor(progress * (end - start) + start);
      
      // Format the number nicely
      if (end >= 1000) {
        obj.innerHTML = `${(currentVal / 1000).toFixed(0)}K+`;
      } else if (end === 100) {
        obj.innerHTML = `${currentVal}%`;
      } else {
        obj.innerHTML = `${currentVal}+`;
      }

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        // Ensure final value is exact
        if (end >= 1000) {
          obj.innerHTML = `${(end / 1000).toFixed(0)}K+`;
        } else if (end === 100) {
          obj.innerHTML = `${end}%`;
        } else {
          obj.innerHTML = `${end}+`;
        }
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* ==========================================================================
   4. Class Category Filters
   ========================================================================== */
function initClassFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const classCards = document.querySelectorAll('.class-card');

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filterValue = button.getAttribute('data-filter');

      classCards.forEach(card => {
        const category = card.getAttribute('data-category');

        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'block';
          // Fade in animation
          card.style.opacity = '0';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease';
            card.style.opacity = '1';
          }, 50);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   5. Membership Pricing Toggle
   ========================================================================== */
function initPricingToggle() {
  const toggle = document.getElementById('pricing-toggle');
  const labelMonthly = document.getElementById('label-monthly');
  const labelYearly = document.getElementById('label-yearly');
  
  const standardPrice = document.getElementById('price-standard');
  const elitePrice = document.getElementById('price-elite');

  // Rates definition
  const prices = {
    monthly: {
      standard: '2,999',
      elite: '5,999',
      standardSuffix: '/mo',
      eliteSuffix: '/mo'
    },
    yearly: {
      standard: '23,999',
      elite: '47,999',
      standardSuffix: '/yr',
      eliteSuffix: '/yr'
    }
  };

  toggle.addEventListener('change', () => {
    const isYearly = toggle.checked;

    if (isYearly) {
      labelMonthly.classList.remove('active');
      labelYearly.classList.add('active');
      
      updatePrice(standardPrice, prices.yearly.standard, prices.yearly.standardSuffix);
      updatePrice(elitePrice, prices.yearly.elite, prices.yearly.eliteSuffix);
    } else {
      labelMonthly.classList.add('active');
      labelYearly.classList.remove('active');
      
      updatePrice(standardPrice, prices.monthly.standard, prices.monthly.standardSuffix);
      updatePrice(elitePrice, prices.monthly.elite, prices.monthly.eliteSuffix);
    }
  });

  function updatePrice(element, newPrice, suffixText) {
    // Fade out
    element.parentElement.style.opacity = '0';
    element.parentElement.style.transform = 'translateY(-10px)';
    
    setTimeout(() => {
      element.innerHTML = newPrice;
      element.nextElementSibling.innerHTML = suffixText;
      
      // Fade in
      element.parentElement.style.transition = 'all 0.3s ease';
      element.parentElement.style.opacity = '1';
      element.parentElement.style.transform = 'translateY(0)';
    }, 200);
  }
}

/* ==========================================================================
   6. Testimonials Carousel Slider
   ========================================================================== */
function initTestimonialsCarousel() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  let currentSlide = 0;
  let autoPlayTimer = null;

  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  function nextSlide() {
    showSlide(currentSlide + 1);
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  // Click listeners
  prevBtn.addEventListener('click', () => {
    prevSlide();
    resetAutoPlay();
  });

  nextBtn.addEventListener('click', () => {
    nextSlide();
    resetAutoPlay();
  });

  // Auto play
  function startAutoPlay() {
    autoPlayTimer = setInterval(nextSlide, 6000);
  }

  function resetAutoPlay() {
    clearInterval(autoPlayTimer);
    startAutoPlay();
  }

  startAutoPlay();
}

/* ==========================================================================
   7. Hub Locations Coordinator & Mock Map
   ========================================================================== */
function initLocationSelector() {
  const select = document.getElementById('hub-select');
  const phoneText = document.getElementById('contact-phone');
  const coordsText = document.getElementById('map-coords');
  const marker = document.querySelector('.map-marker');

  select.addEventListener('change', () => {
    const selectedOption = select.options[select.selectedIndex];
    const phone = selectedOption.getAttribute('data-phone');
    const lat = selectedOption.getAttribute('data-lat');
    const lon = selectedOption.getAttribute('data-lon');

    // Update Text Details
    phoneText.innerHTML = phone;
    coordsText.innerHTML = `Lat: ${lat}, Lon: ${lon}`;

    // Micro-animation for map marker
    marker.style.animation = 'none';
    // Trigger reflow to restart animation
    void marker.offsetWidth; 
    marker.style.animation = 'bounce 1s ease 2';
  });
}

/* ==========================================================================
   8. Form Validation & Feedbacks
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('trial-form');
  const nameInput = document.getElementById('form-name');
  const emailInput = document.getElementById('form-email');
  const phoneInput = document.getElementById('form-phone');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isValid = true;

    // Reset error states
    document.querySelectorAll('.form-error').forEach(err => err.style.display = 'none');

    // Name Validate
    if (nameInput.value.trim() === '') {
      document.getElementById('error-name').style.display = 'block';
      isValid = false;
    }

    // Email Validate
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailInput.value.trim())) {
      document.getElementById('error-email').style.display = 'block';
      isValid = false;
    }

    // Phone Validate (10-digit Indian mobile standard check)
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneInput.value.replace(/\s+/g, ''))) {
      document.getElementById('error-phone').style.display = 'block';
      isValid = false;
    }

    if (isValid) {
      showToast('Invitation Sent! Your 3-day pass request has been registered. Our coach will contact you shortly.', 'success');
      form.reset();
    } else {
      showToast('Please correct the errors in the form.', 'error');
    }
  });
}

/* ==========================================================================
   9. Toast Notification System
   ========================================================================== */
function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  toastMessage.innerHTML = message;

  // Set colors and icons
  if (type === 'success') {
    toast.className = 'toast show toast-success';
    toastIcon.innerHTML = '✅';
  } else if (type === 'error') {
    toast.className = 'toast show';
    toast.style.borderColor = '#ff4a4a';
    toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 74, 74, 0.2)';
    toastIcon.innerHTML = '❌';
  } else {
    toast.className = 'toast show';
    toast.style.borderColor = 'var(--primary)';
    toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5), var(--glow-shadow)';
    toastIcon.innerHTML = 'ℹ️';
  }

  // Remove after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
