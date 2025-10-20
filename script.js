// Navbar: canvi de fons quan hi ha scroll
const nav = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) nav.classList.add('scrolled');
  else nav.classList.remove('scrolled');
});

// Enllaç actiu segons secció visible
const sections = document.querySelectorAll('main section');
const links = document.querySelectorAll('.nav-links a');

const setActive = (id) => {
  links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
};

const ioActive = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActive(entry.target.id);
  });
},{ rootMargin: "-40% 0px -50% 0px", threshold: 0.01 });

sections.forEach(s => ioActive.observe(s));

// Animació d’entrada (fade-in) automàtica per a seccions i targetes
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
