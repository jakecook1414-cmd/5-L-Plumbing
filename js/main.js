/* ============================================================
   5L PLUMBING LLC — main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------------
     AOS — Scroll Animations
  ---------------------------------------------------------- */
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
  });

  /* ----------------------------------------------------------
     Swiper — Testimonials Carousel
  ---------------------------------------------------------- */
  new Swiper('.testimonials__swiper', {
    loop: true,
    autoplay: {
      delay: 5500,
      disableOnInteraction: false,
      pauseOnMouseEnter: true,
    },
    pagination: {
      el: '.testimonials__pagination',
      clickable: true,
    },
    navigation: {
      prevEl: '.testimonials__prev',
      nextEl: '.testimonials__next',
    },
    grabCursor: true,
    speed: 600,
  });

  /* ----------------------------------------------------------
     Sticky Nav — scroll shrink + shadow
  ---------------------------------------------------------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 10);
    backToTop.classList.toggle('visible', window.scrollY > 400);
  };
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ----------------------------------------------------------
     Hamburger Menu
  ---------------------------------------------------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  const setMenuOpen = isOpen => {
    hamburger.classList.toggle('open', isOpen);
    navLinks.classList.toggle('open', isOpen);
    document.body.classList.toggle('nav-open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
  };

  hamburger.addEventListener('click', () => {
    setMenuOpen(!hamburger.classList.contains('open'));
  });

  // Close on nav link click
  navLinks.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
      setMenuOpen(false);
    }
  });

  /* ----------------------------------------------------------
     Smooth Scroll — anchor links
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const navHeight = nav.offsetHeight + 8;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ----------------------------------------------------------
     Back to Top Button
  ---------------------------------------------------------- */
  const backToTop = document.getElementById('backToTop');
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ----------------------------------------------------------
     Footer Year
  ---------------------------------------------------------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ----------------------------------------------------------
     Contact Form — Validation + Submission
  ---------------------------------------------------------- */
  const form        = document.getElementById('contactForm');
  const formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      let valid = true;

      // Name
      const name      = form.querySelector('#name');
      const nameErr   = form.querySelector('#nameError');
      const nameGroup = name.closest('.form-group');
      if (!name.value.trim()) {
        nameGroup.classList.add('has-error');
        nameErr.textContent = 'Please enter your name.';
        valid = false;
      } else {
        nameGroup.classList.remove('has-error');
        nameErr.textContent = '';
      }

      // Phone
      const phone      = form.querySelector('#phone');
      const phoneErr   = form.querySelector('#phoneError');
      const phoneGroup = phone.closest('.form-group');
      const phoneClean = phone.value.replace(/\D/g, '');
      if (!phone.value.trim() || phoneClean.length < 10) {
        phoneGroup.classList.add('has-error');
        phoneErr.textContent = 'Please enter a valid phone number.';
        valid = false;
      } else {
        phoneGroup.classList.remove('has-error');
        phoneErr.textContent = '';
      }

      // Service
      const service      = form.querySelector('#service');
      const serviceErr   = form.querySelector('#serviceError');
      const serviceGroup = service.closest('.form-group');
      if (!service.value) {
        serviceGroup.classList.add('has-error');
        serviceErr.textContent = 'Please select a service.';
        valid = false;
      } else {
        serviceGroup.classList.remove('has-error');
        serviceErr.textContent = '';
      }

      if (!valid) return;

      // Build mailto link as graceful fallback (no server needed)
      const nameVal    = name.value.trim();
      const phoneVal   = phone.value.trim();
      const emailVal   = form.querySelector('#email').value.trim();
      const serviceVal = service.options[service.selectedIndex].text;
      const msgVal     = form.querySelector('#message').value.trim();

      const subject = encodeURIComponent(`5L Plumbing Quote Request — ${serviceVal}`);
      const body    = encodeURIComponent(
        `Name: ${nameVal}\nPhone: ${phoneVal}\nEmail: ${emailVal || 'Not provided'}\n` +
        `Service: ${serviceVal}\n\nMessage:\n${msgVal || 'No additional details.'}`
      );

      window.location.href = `mailto:5lplumbingllc@gmail.com?subject=${subject}&body=${body}`;

      // Show success state
      form.style.display = 'none';
      formSuccess.classList.add('visible');
    });

    // Live validation on blur
    form.querySelectorAll('input[required], select[required]').forEach(field => {
      field.addEventListener('blur', () => {
        if (field.value.trim()) {
          field.closest('.form-group').classList.remove('has-error');
        }
      });
    });
  }

  /* ----------------------------------------------------------
     Phone number formatting in input
  ---------------------------------------------------------- */
  const phoneInput = document.getElementById('phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', () => {
      let digits = phoneInput.value.replace(/\D/g, '').slice(0, 10);
      if (digits.length >= 7) {
        phoneInput.value = `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
      } else if (digits.length >= 4) {
        phoneInput.value = `(${digits.slice(0,3)}) ${digits.slice(3)}`;
      } else if (digits.length > 0) {
        phoneInput.value = `(${digits}`;
      }
    });
  }

});
