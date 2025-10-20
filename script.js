document.addEventListener("DOMContentLoaded", () => {
  // ---------- Navbar: canvi de fons quan hi ha scroll ----------
  const nav = document.querySelector('.navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    if (Math.abs(window.scrollY - lastScroll) > 10) {
      nav.classList.toggle('scrolled', window.scrollY > 50);
      lastScroll = window.scrollY;
    }
  });

  // ---------- Enllaç actiu segons secció visible ----------
  const sections = document.querySelectorAll('main section');
  const links = document.querySelectorAll('.nav-links a');

  const setActive = (id) => {
    links.forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
    );
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
      toggleBtn.textContent = light ? "🌙" : "☀️";
      toggleBtn.setAttribute("aria-pressed", light);
    };

    // carregar estat del localStorage
    applyTheme(localStorage.getItem("theme") === "light");

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
    const formatter = new Intl.NumberFormat(); // separadors

    const update = () => {
      count += step;
      if (count < target) {
        counter.textContent = formatter.format(Math.floor(count));
        requestAnimationFrame(update);
      } else {
        counter.textContent = formatter.format(target);
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
  }, { threshold: 0.6 });

  counters.forEach(c => ioCounter.observe(c));

  // ---------- Botó Scroll To Top ----------
  const scrollBtn = document.getElementById("scrollTopBtn");
  if (scrollBtn) {
    window.addEventListener('scroll', () => {
      scrollBtn.classList.toggle("show", window.scrollY > 300);
    });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
