// Mobile navigation toggle and menu behavior
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const navAnchors = Array.from(document.querySelectorAll('.nav-links a'));

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

navAnchors.forEach((link) => {
  link.addEventListener('click', () => {
    if (navLinks) {
      navLinks.classList.remove('open');
    }
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
});

const currentPage = window.location.pathname.split('/').pop() || 'index.html';
navAnchors.forEach((link) => {
  const href = link.getAttribute('href');
  const isActive = href === currentPage || (currentPage === 'index.html' && href === 'index.html');
  link.classList.toggle('active', isActive);
});

// Update the scroll progress bar and show or hide the back-to-top button
const progressBar = document.querySelector('.scroll-progress');
const backToTop = document.querySelector('.back-to-top');

const updateScrollProgress = () => {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  if (progressBar) progressBar.style.width = `${progress}%`;
  if (backToTop) backToTop.classList.toggle('visible', scrollTop > 500);
};

window.addEventListener('scroll', updateScrollProgress);
window.addEventListener('load', updateScrollProgress);

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Reveal elements as they enter the viewport
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => revealObserver.observe(element));

// Rotate through testimonials
const testimonialCards = Array.from(document.querySelectorAll('.testimonial-card'));
const prevBtn = document.querySelector('.slider-btn.prev');
const nextBtn = document.querySelector('.slider-btn.next');
let currentTestimonial = 0;

const showTestimonial = (index) => {
  testimonialCards.forEach((card, idx) => {
    card.classList.toggle('active', idx === index);
  });
};

if (testimonialCards.length) {
  showTestimonial(currentTestimonial);
  prevBtn?.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(currentTestimonial);
  });

  nextBtn?.addEventListener('click', () => {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(currentTestimonial);
  });
}

// Filter gallery items and open the lightbox preview
const filterButtons = Array.from(document.querySelectorAll('.filter-btn'));
const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('.lightbox-image');
const lightboxClose = document.querySelector('.lightbox-close');

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');
    const filter = button.dataset.filter;
    galleryItems.forEach((item) => {
      const matches = filter === 'all' || item.dataset.category === filter;
      item.classList.toggle('is-hidden', !matches);
    });
  });
});

galleryItems.forEach((item) => {
  item.addEventListener('click', () => {
    const title = item.querySelector('h3')?.textContent || 'Gallery Image';
    const image = item.querySelector('img');
    if (lightboxImage) {
      lightboxImage.src = image?.src || '';
      lightboxImage.alt = title;
      lightbox?.classList.add('active');
      lightbox?.setAttribute('aria-hidden', 'false');
    }
  });
});

lightboxClose?.addEventListener('click', () => {
  lightbox?.classList.remove('active');
  lightbox?.setAttribute('aria-hidden', 'true');
});

lightbox?.addEventListener('click', (event) => {
  if (event.target === lightbox) {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
  }
});

// Validate booking form submissions and show a success message
const bookingForm = document.getElementById('bookingForm');
const formMessage = document.getElementById('formMessage');

bookingForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const formData = new FormData(bookingForm);
  const values = Array.from(formData.values());
  const invalid = values.some((value) => typeof value === 'string' && !value.trim());
  if (invalid) {
    formMessage.textContent = 'Please fill in all required fields.';
    return;
  }
  formMessage.textContent = 'Appointment Request Sent Successfully';
  bookingForm.reset();
});

// Allow only one FAQ item to stay open at a time
const faqItems = document.querySelectorAll('.faq-item');
faqItems.forEach((item) => {
  item.addEventListener('toggle', () => {
    if (item.open) {
      faqItems.forEach((other) => {
        if (other !== item) other.open = false;
      });
    }
  });
});

// Animate statistics counters on the about page
const counters = document.querySelectorAll('[data-count]');
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const countTo = Number(target.getAttribute('data-count'));
      let current = 0;
      const timer = window.setInterval(() => {
        current += 1;
        target.textContent = `${current}${countTo >= 98 ? '%' : ''}`;
        if (current >= countTo) {
          clearInterval(timer);
          target.textContent = `${countTo}${countTo >= 98 ? '%' : ''}`;
        }
      }, 18);
      counterObserver.unobserve(target);
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

// Add a ripple effect to buttons for a polished interaction
document.querySelectorAll('.btn, .filter-btn, .slider-btn').forEach((button) => {
  button.addEventListener('click', (event) => {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    button.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
  });
});
