/**
 * AestheticGym — Client Interactions Controller
 * Developed by Finity Sync for AestheticGym Network
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initActiveLinkObserver();
  initStatsCounter();
  initClassFilters();
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
   5. Testimonials Carousel Slider
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
   6. Hub Locations Coordinator & Mock Map
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
   7. Form Validation & Feedbacks
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

    // Phone Validate (11-digit Pakistani standard starting with 03)
    const rawPhone = phoneInput.value.replace(/[\s\-()]+/g, '');
    const phoneRegex = /^03\d{9}$/;
    if (!phoneRegex.test(rawPhone)) {
      document.getElementById('error-phone').style.display = 'block';
      isValid = false;
    }

    if (isValid) {
      const formspreeId = form.getAttribute('data-formspree-id') || 'YOUR_FORMSPREE_ID';
      
      if (formspreeId === 'YOUR_FORMSPREE_ID' || formspreeId.trim() === '') {
        // Mock Mode (when user hasn't set up the ID yet)
        showToast('Pass Registered! Your free access invite has been sent. A coach will contact you within 24 hours.', 'success');
        form.reset();
      } else {
        // Real Mode (AJAX post to Formspree)
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = 'Registering...';
        submitBtn.disabled = true;

        fetch(`https://formspree.io/f/${formspreeId}`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            phone: rawPhone,
            message: document.getElementById('form-message').value.trim(),
            hub: document.getElementById('hub-select').options[document.getElementById('hub-select').selectedIndex].text
          })
        })
        .then(response => {
          if (response.ok) {
            showToast('Pass Registered! Your free access invite has been sent. A coach will contact you within 24 hours.', 'success');
            form.reset();
          } else {
            showToast('Failed to send request. Please try again or email olabasir446@gmail.com', 'error');
          }
        })
        .catch(() => {
          showToast('Network error. Please check your connection and try again.', 'error');
        })
        .finally(() => {
          submitBtn.innerHTML = originalText;
          submitBtn.disabled = false;
        });
      }
    } else {
      showToast('Please correct the details in the form.', 'error');
    }
  });
}

/* ==========================================================================
   8. Toast Notification System
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
