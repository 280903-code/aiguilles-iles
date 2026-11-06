/**
 * Aiguilles des Îles — Main JavaScript
 * Handles navigation, scroll effects, forms, and animations
 */

(function() {
  'use strict';

  // =========================================================================
  // Configuration
  // =========================================================================
  const CONFIG = {
    headerScrollThreshold: 12,
    revealThreshold: 0.12,
    revealRootMargin: '0px 0px -50px 0px',
    form: {
      minAge: 18,
      maxFileSize: 10 * 1024 * 1024, // 10 MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    }
  };

  // =========================================================================
  // Utility Functions
  // =========================================================================
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  function debounce(fn, wait) {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => fn(...args), wait);
    };
  }

  function throttle(fn, limit) {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  function createReference() {
    return 'ADI-' + Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  function calculateAge(birthDate) {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  }

  function validateFile(file) {
    if (!CONFIG.form.allowedTypes.includes(file.type)) {
      return { valid: false, message: `Type de fichier non autorisé : ${file.name}. Formats acceptés : JPEG, PNG, WebP, PDF.` };
    }
    if (file.size > CONFIG.form.maxFileSize) {
      return { valid: false, message: `Fichier trop volumineux : ${file.name} (max 10 Mo).` };
    }
    return { valid: true };
  }

  function showFormMessage(element, message, isError = false) {
    element.textContent = message;
    element.hidden = false;
    element.classList.toggle('error', isError);
    element.classList.toggle('show', true);
    element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideFormMessage(element) {
    element.hidden = true;
    element.classList.remove('show', 'error');
    element.textContent = '';
  }

  // =========================================================================
  // Header Scroll Effect
  // =========================================================================
  function initHeaderScroll() {
    const header = $('.site-header');
    if (!header) return;

    const updateHeader = throttle(() => {
      header.classList.toggle('scrolled', window.scrollY > CONFIG.headerScrollThreshold);
    }, 50);

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader(); // Initial check
  }

  // =========================================================================
  // Mobile Navigation
  // =========================================================================
  function initMobileNav() {
    const menuToggle = $('.menu-toggle');
    const nav = $('.main-nav');

    if (!menuToggle || !nav) return;

    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.classList.toggle('active', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close menu when clicking a link
    $$('a', nav).forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.focus();
        document.body.style.overflow = '';
      }
    });

    // Trap focus in mobile menu when open
    nav.addEventListener('keydown', (e) => {
      if (!nav.classList.contains('open')) return;
      if (e.key !== 'Tab') return;

      const focusableElements = $$(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
        nav
      );
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    });
  }

  // =========================================================================
  // Active Navigation Highlighting
  // =========================================================================
  function initActiveNav() {
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    const pageName = currentPage.replace('.html', '');

    $$('.main-nav a').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPage || href === pageName + '.html') {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });
  }

  // =========================================================================
  // Year Auto-Update
  // =========================================================================
  function initYear() {
    const year = 2027;
    $$('.year').forEach(el => {
      el.textContent = year;
    });
  }

  // =========================================================================
  // Scroll Reveal Animations
  // =========================================================================
  function initRevealAnimations() {
    const revealItems = $$('.reveal');

    if (!revealItems.length) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealItems.forEach(item => item.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: CONFIG.revealThreshold,
      rootMargin: CONFIG.revealRootMargin
    });

    revealItems.forEach(item => observer.observe(item));
  }

  // =========================================================================
  // Application Form
  // =========================================================================
  function initApplicationForm() {
    const form = $('#applicationForm');
    if (!form) return;

    const messageEl = $('#formMessage');
    const fileInput = form.elements.portfolio;

    // File validation on change
    if (fileInput) {
      fileInput.addEventListener('change', () => {
        const files = Array.from(fileInput.files);
        let hasError = false;

        files.forEach(file => {
          const validation = validateFile(file);
          if (!validation.valid) {
            hasError = true;
            showFormMessage(messageEl, validation.message, true);
          }
        });

        if (!hasError) {
          hideFormMessage(messageEl);
        }
      });
    }

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      hideFormMessage(messageEl);

      // Check HTML5 validity
      if (!form.reportValidity()) {
        return;
      }

      // Check age
      const birthDate = form.elements.naissance.value;
      const age = calculateAge(birthDate);

      if (age < CONFIG.form.minAge) {
        showFormMessage(
          messageEl,
          `La participation est réservée aux personnes âgées de ${CONFIG.form.minAge} ans et plus.`,
          true
        );
        return;
      }

      // Validate files
      if (fileInput && fileInput.files.length > 0) {
        const files = Array.from(fileInput.files);
        for (const file of files) {
          const validation = validateFile(file);
          if (!validation.valid) {
            showFormMessage(messageEl, validation.message, true);
            return;
          }
        }
      }

      // Success - demo mode
      const ref = createReference();
      const firstName = form.elements.prenom.value;
      showFormMessage(
        messageEl,
        `Merci ${firstName} ! Votre formulaire de démonstration est prêt. Référence : ${ref}. Aucune candidature n'a été envoyée ou enregistrée.`
      );

      // Reset form after successful submission (optional)
      // form.reset();
    });
  }

  // =========================================================================
  // Contact Form
  // =========================================================================
  function initContactForm() {
    const form = $('#contactForm');
    if (!form) return;

    const messageEl = $('#contactMessage');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      hideFormMessage(messageEl);

      if (!form.reportValidity()) {
        return;
      }

      // Demo mode success
      showFormMessage(
        messageEl,
        "Merci pour votre message ! Ceci est une démonstration : le message n'a pas été envoyé. Connectez le formulaire à un backend pour recevoir les demandes."
      );

      // form.reset();
    });
  }

  // =========================================================================
  // Smooth Scroll Polyfill for Anchor Links
  // =========================================================================
  function initSmoothScroll() {
    if ('scrollBehavior' in document.documentElement.style) return;

    // Simple polyfill for older browsers
    $$('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', (e) => {
        const targetId = anchor.getAttribute('href');
        if (targetId === '#') return;

        const target = $(targetId);
        if (target) {
          e.preventDefault();
          const headerOffset = $('.site-header')?.offsetHeight || 0;
          const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  // =========================================================================
  // Initialize All
  // =========================================================================
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    initHeaderScroll();
    initMobileNav();
    initActiveNav();
    initYear();
    initRevealAnimations();
    initApplicationForm();
    initContactForm();
    initSmoothScroll();

    // Expose for debugging
    window.ADI = {
      createReference,
      calculateAge,
      validateFile
    };
  }

  // Start initialization
  init();

})();