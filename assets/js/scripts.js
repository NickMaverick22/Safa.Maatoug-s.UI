// 1. Scroll to top on every page load
window.addEventListener('DOMContentLoaded', () => {
  window.scrollTo(0, 0);
});

// 2. IntersectionObserver for fade-slide animations
const scrollElems = document.querySelectorAll('.animate-on-scroll');
const observerOptions = {
  threshold: 0.25,
  rootMargin: '0px 0px -10% 0px',
};

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fadeInUp');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

scrollElems.forEach(elem => observer.observe(elem));

// 3. Copy email-to-clipboard button logic
const copyEmailBtn = document.getElementById('copyEmailBtn');
if (copyEmailBtn) {
  copyEmailBtn.addEventListener('click', () => {
    const email = copyEmailBtn.textContent.trim();
    navigator.clipboard.writeText(email).then(() => {
      const toast = document.createElement('div');
      toast.textContent = 'Email copié !';
      toast.style.position = 'fixed';
      toast.style.bottom = '20px';
      toast.style.left = '50%';
      toast.style.transform = 'translateX(-50%)';
      toast.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
      toast.style.color = 'white';
      toast.style.padding = '0.5rem 1rem';
      toast.style.borderRadius = '4px';
      toast.style.zIndex = '2000';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 2000);
    });
  });
}

// 4. Mobile nav burger toggle logic (if you add a hamburger menu later)
const burger = document.getElementById('burger');
const mobileNav = document.getElementById('mobileNav');
if (burger && mobileNav) {
  burger.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
    document.body.classList.toggle('no-scroll');
  });
} 