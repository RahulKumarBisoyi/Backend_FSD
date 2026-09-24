/**
 * Rahul Kumar Bisoyi - Developer Portfolio
 * Vanilla JavaScript Interactions & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initTypingAnimation();
  initScrollReveal();
  initScrollSpy();
  initContactForm();
});

/* ==========================================================================
   1. NAVBAR & MOBILE DRAWER
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change navbar background on scroll
  const handleScroll = () => {
    if (window.scrollY > 30) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Mobile menu toggle
  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      hamburger.classList.toggle('active', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburger.contains(e.target) && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close menu on link click
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          hamburger.classList.remove('active');
          hamburger.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }
}

/* ==========================================================================
   2. TYPING ANIMATION (ROLES ROTATION)
   ========================================================================== */
function initTypingAnimation() {
  const typingElement = document.getElementById('typing-text');
  if (!typingElement) return;

  const roles = [
    'C++ Programmer',
    'Web Developer',
    'AI/ML Enthusiast',
    'Problem Solver'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 90;
  const deleteSpeed = 45;
  const pauseBetweenRoles = 2000;
  const pauseAfterDelete = 400;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingElement.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingElement.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
    }

    let nextSpeed = isDeleting ? deleteSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentRole.length) {
      // Completed typing full role: pause then start deleting
      nextSpeed = pauseBetweenRoles;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Completed deleting: move to next role
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      nextSpeed = pauseAfterDelete;
    }

    setTimeout(type, nextSpeed);
  }

  type();
}

/* ==========================================================================
   3. SCROLL REVEAL (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!reveals.length) return;

  // Check if reduced motion is preferred
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    reveals.forEach((el) => el.classList.add('active'));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    }
  );

  reveals.forEach((el) => {
    revealObserver.observe(el);
  });
}

/* ==========================================================================
   4. SCROLLSPY ACTIVE LINK HIGHLIGHTING
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0
  };

  const spyObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((sec) => spyObserver.observe(sec));
}

/* ==========================================================================
   5. CONTACT FORM (MAILTO INTEGRATION)
   ========================================================================== */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const messageInput = document.getElementById('contact-message');
  const formStatus = document.getElementById('form-status');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let hasError = false;

    // Reset error states
    document.querySelectorAll('.form-group').forEach((grp) => grp.classList.remove('has-error'));
    formStatus.textContent = '';
    formStatus.style.color = 'var(--accent-light)';

    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const messageVal = messageInput.value.trim();

    // Validate Name
    if (!nameVal) {
      nameInput.closest('.form-group').classList.add('has-error');
      hasError = true;
    }

    // Validate Email
    if (!emailVal || !emailRegex.test(emailVal)) {
      emailInput.closest('.form-group').classList.add('has-error');
      hasError = true;
    }

    // Validate Message
    if (!messageVal) {
      messageInput.closest('.form-group').classList.add('has-error');
      hasError = true;
    }

    if (hasError) {
      formStatus.textContent = 'Please fill out all fields correctly.';
      return;
    }

    // Construct Mailto URI
    const recipient = 'rahulkumarbisoyi@gmail.com';
    const subject = encodeURIComponent(`Portfolio Inquiry from ${nameVal}`);
    const bodyContent = `Hello Rahul,\n\nYou have received a new message from your portfolio website:\n\nName: ${nameVal}\nEmail: ${emailVal}\n\nMessage:\n${messageVal}\n\n---\nSent via Developer Portfolio`;
    const mailtoUri = `mailto:${recipient}?subject=${subject}&body=${encodeURIComponent(bodyContent)}`;

    formStatus.textContent = '✓ Opening your email client to send message...';

    // Trigger user's mail client
    window.location.href = mailtoUri;

    // Clear form fields
    contactForm.reset();

    setTimeout(() => {
      formStatus.textContent = 'If your email app did not open automatically, reach out directly at rahulkumarbisoyi@gmail.com';
    }, 4000);
  });
}
