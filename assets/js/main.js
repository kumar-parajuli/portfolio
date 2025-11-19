/*=============== SHOW MENU ===============*/
document.addEventListener('DOMContentLoaded', function() {
  // Menu functionality
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');

  /*===== MENU SHOW =====*/
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      navMenu?.classList.add('show-menu');
      navToggle.setAttribute('aria-expanded', 'true');
    });
  }

  /*===== MENU HIDDEN =====*/
  if (navClose) {
    navClose.addEventListener('click', () => {
      navMenu?.classList.remove('show-menu');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  }

  /*=============== REMOVE MENU MOBILE ===============*/
  const navLinks = document.querySelectorAll('.nav__link');
  
  const linkAction = () => {
    navMenu?.classList.remove('show-menu');
    navToggle.setAttribute('aria-expanded', 'false');
  };
  
  navLinks.forEach(link => {
    link.addEventListener('click', linkAction);
  });

  /*=============== SWIPER PROJECTS ===============*/
  let swiperProjects = null;
  const projectsContainer = document.querySelector('.projects__container');
  
  if (projectsContainer && typeof Swiper !== 'undefined') {
    swiperProjects = new Swiper(".projects__container", {
      loop: true,
      spaceBetween: 24,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      pagination: {
        el: ".swiper-pagination",
      },
      breakpoints: {
        1200: {
          slidesPerView: 2,
          spaceBetween: -56,
        },
      },
      on: {
        init: function () {
          console.log('Projects Swiper initialized');
        },
      }
    });
  }

  /*=============== SWIPER TESTIMONIAL ===============*/
  let swiperTestimonial = null;
  const testimonialContainer = document.querySelector('.testimonial__container');
  
  if (testimonialContainer && typeof Swiper !== 'undefined') {
    swiperTestimonial = new Swiper(".testimonial__container", {
      grabCursor: true,
      navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      },
      on: {
        init: function () {
          console.log('Testimonial Swiper initialized');
        },
      }
    });
  }

  /*=============== EMAIL JS ===============*/
  const contactForm = document.getElementById('contact-form');
  
  // Create notification popup element
  const createNotificationPopup = () => {
    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.setAttribute('role', 'alert');
    popup.setAttribute('aria-live', 'assertive');
    
    const popupContent = document.createElement('div');
    popupContent.className = 'notification-popup__content';
    
    const popupMessage = document.createElement('p');
    popupMessage.className = 'notification-popup__message';
    
    const popupClose = document.createElement('button');
    popupClose.className = 'notification-popup__close';
    popupClose.innerHTML = '<i class="ri-close-line" aria-hidden="true"></i>';
    popupClose.setAttribute('aria-label', 'Close notification');
    
    popupContent.appendChild(popupMessage);
    popupContent.appendChild(popupClose);
    popup.appendChild(popupContent);
    
    document.body.appendChild(popup);
    
    // Close popup functionality
    popupClose.addEventListener('click', () => {
      popup.classList.remove('notification-popup--show');
      setTimeout(() => {
        if (document.body.contains(popup)) {
          document.body.removeChild(popup);
        }
      }, 300);
    });
    
    // Auto-close after 5 seconds on clicking outside
    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.classList.remove('notification-popup--show');
        setTimeout(() => {
          if (document.body.contains(popup)) {
            document.body.removeChild(popup);
          }
        }, 300);
      }
    });
    
    return { popup, popupMessage, popupClose };
  };

  // Show notification function
  const showNotification = (message, type = 'info') => {
    const { popup, popupMessage } = createNotificationPopup();
    
    popupMessage.textContent = message;
    popup.className = `notification-popup notification-popup--${type}`;
    
    setTimeout(() => {
      popup.classList.add('notification-popup--show');
    }, 10);
    
    setTimeout(() => {
      if (document.body.contains(popup)) {
        popup.classList.remove('notification-popup--show');
        setTimeout(() => {
          if (document.body.contains(popup)) {
            document.body.removeChild(popup);
          }
        }, 300);
      }
    }, 5000);
  };

  if (contactForm) {
    const contactName = document.getElementById('contact-name');
    const contactEmail = document.getElementById('contact-email');
    const contactProject = document.getElementById('contact-project');

    const validateEmail = (email) => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    const sendEmail = async (e) => {
      e.preventDefault();

      const submitButton = contactForm.querySelector('button[type="submit"]');
      if (!submitButton) return;
      const originalText = submitButton.textContent;

      // Validation
      if (!contactName?.value.trim() || !contactEmail?.value.trim() || !contactProject?.value.trim()) {
        showNotification('Please fill in all required fields 📩', 'error');
        return;
      }

      if (!validateEmail(contactEmail.value)) {
        showNotification('Please enter a valid email address 📧', 'error');
        return;
      }

      if (typeof emailjs === 'undefined') {
        console.error('EmailJS not loaded');
        showNotification('Email service not available. Please try again later.', 'error');
        return;
      }

      // Set button to sending state
      submitButton.textContent = 'Sending...';
      submitButton.disabled = true;

      try {
        await emailjs.sendForm(
          'service_n5zdxjy',
          'template_mo5e4yv',
          '#contact-form',
          'xNC4LxrfabystTvqq'
        );

        showNotification('Message sent successfully! ✅', 'success');

      } catch (error) {
        console.error('Email sending failed:', error);
        showNotification('Failed to send message. Please try again.', 'error');

      } finally {
        // Always restore button state and clear form
        submitButton.textContent = originalText;
        submitButton.disabled = false;
        contactForm.reset();
      }
    };

    contactForm.addEventListener('submit', sendEmail);
  }

  /*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
  const sections = document.querySelectorAll('section[id]');
  
  const scrollActive = () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 58;
      const sectionId = current.getAttribute('id');
      const sectionsClass = document.querySelector(`.nav__menu a[href*="${sectionId}"]`);

      if (sectionsClass) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          sectionsClass.classList.add('active-link');
        } else {
          sectionsClass.classList.remove('active-link');
        }
      }
    });
  };

  let scrollTimeout;
  const throttledScrollActive = () => {
    if (!scrollTimeout) {
      scrollTimeout = setTimeout(() => {
        scrollActive();
        scrollTimeout = null;
      }, 100);
    }
  };

  window.addEventListener('scroll', throttledScrollActive);

  /*=============== SHOW SCROLL UP ===============*/
  const scrollUp = () => {
    const scrollUpElement = document.getElementById('scroll-up');
    if (scrollUpElement) {
      window.scrollY >= 350 
        ? scrollUpElement.classList.add('show-scroll')
        : scrollUpElement.classList.remove('show-scroll');
    }
  };

  window.addEventListener('scroll', scrollUp);

  /*=============== DARK LIGHT THEME ===============*/
  const themeButton = document.getElementById('theme-button');
  
  if (themeButton) {
    const darkTheme = 'dark-theme';
    const iconTheme = 'ri-sun-line';

    const selectedTheme = localStorage.getItem('selected-theme');
    const selectedIcon = localStorage.getItem('selected-icon');

    const getCurrentTheme = () => 
      document.body.classList.contains(darkTheme) ? 'dark' : 'light';
    
    const getCurrentIcon = () => 
      themeButton.classList.contains(iconTheme) ? 'ri-moon-line' : 'ri-sun-line';

    if (selectedTheme) {
      document.body.classList[selectedTheme === 'dark' ? 'add' : 'remove'](darkTheme);
      themeButton.classList[selectedIcon === 'ri-moon-line' ? 'add' : 'remove'](iconTheme);
    }

    themeButton.addEventListener('click', () => {
      document.body.classList.toggle(darkTheme);
      themeButton.classList.toggle(iconTheme);
      
      localStorage.setItem('selected-theme', getCurrentTheme());
      localStorage.setItem('selected-icon', getCurrentIcon());
    });
  }

  /*=============== CHANGE BACKGROUND HEADER ===============*/
  const scrollHeader = () => {
    const header = document.getElementById('header');
    if (header) {
      window.scrollY >= 50 
        ? header.classList.add('bg-header') 
        : header.classList.remove('bg-header');
    }
  };

  window.addEventListener('scroll', scrollHeader);

  /*=============== SCROLL REVEAL ANIMATION ===============*/
  if (typeof ScrollReveal !== 'undefined') {
    const sr = ScrollReveal({
      origin: 'top',
      distance: '60px',
      duration: 2500,
      delay: 400,
    });

    sr.reveal(`.home__data, .projects__container, .testimonial__container, .footer__container`);
    sr.reveal(`.home__info div`, {delay: 600, origin: 'bottom', interval: 100});
    sr.reveal(`.skills__content:nth-child(1), .contact__content:nth-child(1)`, {origin: 'left'});
    sr.reveal(`.skills__content:nth-child(2), .contact__content:nth-child(2)`, {origin: 'right'});
    sr.reveal(`.qualification__content, .services__card`, {interval: 100});
  }

  window.addEventListener('error', (event) => {
    console.error('Script error:', event.error);
  });
});

// Fallback for DOMContentLoaded in case document is already loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

function init() {
  console.log('Portfolio website initialized');
}

// Export for module systems (if using ES6 modules)
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { init };
}
