// ---------- Navbar: canvi de fons quan hi ha scroll ----------
const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// ---------- Enllaç actiu segons secció visible ----------
const sections = document.querySelectorAll('main section');
const links = document.querySelectorAll('.nav-links a');

const setActive = (id) => {
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
};

const ioActive = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActive(entry.target.id);
  });
},{ rootMargin: "-40% 0px -50% 0px", threshold: 0.1 });

sections.forEach(s => ioActive.observe(s));

// ---------- Animació d’entrada (fade-in) ----------
const toFade = [
  ...document.querySelectorAll('section'),
  ...document.querySelectorAll('section article')
];
toFade.forEach(el => el.classList.add('fade-in'));

const ioFade = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting){
      entry.target.classList.add('visible');
      ioFade.unobserve(entry.target);
    }
  });
},{ threshold: 0.2 });

toFade.forEach(el => ioFade.observe(el));

// ---------- Dark / Light Mode ----------
const toggleBtn = document.getElementById('theme-toggle');
if(toggleBtn){
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    toggleBtn.textContent = document.body.classList.contains('dark-mode') ? "☀️" : "🌙";
  });
}

// ---------- Comptadors (Highlights) ----------
const counters = document.querySelectorAll('.counter');
const animateCounter = (counter) => {
  const target = +counter.getAttribute('data-target');
  const step = Math.ceil(target / 200); // velocitat
  let count = 0;
  const update = () => {
    count += step;
    if (count < target) {
      counter.textContent = count;
      requestAnimationFrame(update);
    } else {
      counter.textContent = target;
    }
  };
  update();
};

const ioCounter = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      ioCounter.unobserve(entry.target);
    }
  });
},{ threshold: 0.6 });

counters.forEach(c => ioCounter.observe(c));

// ---------- Botó Scroll To Top ----------
const scrollBtn = document.getElementById("scrollTopBtn");
if(scrollBtn){
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? "block" : "none";
  });
  scrollBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
