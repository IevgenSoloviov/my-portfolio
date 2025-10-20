document.addEventListener("DOMContentLoaded", () => {
  // ---------- Navbar: canvi de fons quan hi ha scroll ----------
  const nav = document.querySelector('.navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastScroll) > 10) {
      nav.classList.toggle('scrolled', window.scrollY > 50);
      lastScroll = window.scrollY;
    }
  }, { passive: true });

  // ---------- Enllaç actiu segons secció visible ----------
  const sections = document.querySelectorAll('section'); // 👈 canviat
  const links = document.querySelectorAll('.nav-links a');

  const setActive = (id) => {
    links.forEach(a => {
      const active = a.getAttribute('href') === `#${id}`;
      a.classList.toggle('active', active);
      a.setAttribute("aria-current", active ? "page" : "");
    });
  };

  const ioActive = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) setActive(entry.target.id);
    });
  }, { rootMargin: "-40% 0px -50% 0px", threshold: 0.2 });

  sections.forEach(s => ioActive.observe(s));

  // ---------- Animació d’entrada (fade-in) ----------
  const toFade = [...sections, ...document.querySelectorAll('section article')];
  toFade.forEach(el => el.classList.add('fade-in'));

  const ioFade = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        ioFade.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  toFade.forEach(el => ioFade.observe(el));

  // ---------- Dark / Light Mode ----------
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    const applyTheme = (light) => {
      document.body.classList.toggle("light", light);
      toggleBtn.textContent = light ? "☀️" : "🌙"; // 👈 més coherent
      toggleBtn.setAttribute("aria-pressed", String(light));
    };

    // carregar estat del localStorage o preferència del sistema
    const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
    applyTheme(localStorage.getItem("theme") === "light" || (!localStorage.getItem("theme") && prefersLight));

    toggleBtn.addEventListener('click', () => {
      const isLight = !document.body.classList.contains("light");
      applyTheme(isLight);
      localStorage.setItem("theme", isLight ? "light" : "dark");
    });
  }

  // ---------- Comptadors (Highlights opcionals) ----------
  const counters = document.querySelectorAll('.counter');
  const animateCounter = (counter) => {
    const target = +counter.getAttribute('data-target');
    let count = 0;
    const step = target / 60; // 60 frames aprox
    const formatter = new Intl.NumberFormat();

    const update = () => {
      count = Math.min(count + step, target);
      counter.textContent = formatter.format(Math.floor(count));
      if (count < target) requestAnimationFrame(update);
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
  }, { threshold: 0.6 });

  counters.forEach(c => ioCounter.observe(c));

  // ---------- Botó Scroll To Top ----------
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle("show", window.scrollY > 300);
    }, { passive: true });

    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
