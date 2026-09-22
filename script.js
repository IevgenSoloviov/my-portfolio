document.addEventListener("DOMContentLoaded", () => {

  /* ====================================================== */
  /* ELEMENTS                                               */
  /* ====================================================== */

  const body = document.body;

  const navbar = document.getElementById("navbar");

  const progressBar =
    document.getElementById("scrollProgressBar");

  const scrollTopBtn =
    document.getElementById("scrollTopBtn");

  const themeToggle =
    document.getElementById("themeToggle");

  const menuToggle =
    document.getElementById("menuToggle");

  const navLinks =
    document.getElementById("navLinks");

  const commandPalette =
    document.getElementById("commandPalette");

  const commandTrigger =
    document.getElementById("commandTrigger");

  const cursorGlow =
    document.getElementById("cursorGlow");


  /* ====================================================== */
  /* YEAR                                                   */
  /* ====================================================== */

  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  /* ====================================================== */
  /* SCROLL SYSTEM                                          */
  /* ====================================================== */

  const updateScroll = () => {

    const scrollY =
      window.scrollY;

    const maxScroll =
      document.documentElement.scrollHeight
      - window.innerHeight;

    const progress =
      maxScroll > 0
        ? (scrollY / maxScroll) * 100
        : 0;


    if (progressBar) {
      progressBar.style.width =
        `${progress}%`;
    }


    if (navbar) {

      navbar.classList.toggle(
        "scrolled",
        scrollY > 30
      );

    }


    if (scrollTopBtn) {

      scrollTopBtn.classList.toggle(
        "visible",
        scrollY > 500
      );

    }

  };


  updateScroll();


  window.addEventListener(
    "scroll",
    updateScroll,
    { passive: true }
  );


  /* ====================================================== */
  /* SCROLL TOP                                             */
  /* ====================================================== */

  if (scrollTopBtn) {

    scrollTopBtn.addEventListener(
      "click",
      () => {

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  }


  /* ====================================================== */
  /* ACTIVE NAVIGATION                                      */
  /* ====================================================== */

  const sections =
    document.querySelectorAll(
      "section[id]"
    );

  const navigationAnchors =
    document.querySelectorAll(
      ".nav-links a"
    );


  const updateActiveLink = (id) => {

    navigationAnchors.forEach(link => {

      const isActive =
        link.getAttribute("href")
        === `#${id}`;

      link.classList.toggle(
        "active",
        isActive
      );

    });

  };


  const activeObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            updateActiveLink(
              entry.target.id
            );

          }

        });

      },
      {
        rootMargin:
          "-38% 0px -53% 0px",

        threshold:
          0
      }
    );


  sections.forEach(section => {
    activeObserver.observe(section);
  });


  /* ====================================================== */
  /* MOBILE NAV                                             */
  /* ====================================================== */

  if (menuToggle && navLinks) {

    menuToggle.addEventListener(
      "click",
      () => {

        const open =
          navLinks.classList.toggle(
            "open"
          );

        menuToggle.setAttribute(
          "aria-expanded",
          String(open)
        );

      }
    );


    navigationAnchors.forEach(link => {

      link.addEventListener(
        "click",
        () => {

          navLinks.classList.remove(
            "open"
          );

          menuToggle.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    });

  }


  /* ====================================================== */
  /* REVEAL ANIMATIONS                                      */
  /* ====================================================== */

  const revealElements =
    document.querySelectorAll(
      "[data-reveal]"
    );


  const revealObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }


          entry.target.classList.add(
            "visible"
          );


          revealObserver.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.12
      }
    );


  revealElements.forEach(
    (element, index) => {

      element.style.transitionDelay =
        `${Math.min(index % 4, 3) * 70}ms`;

      revealObserver.observe(
        element
      );

    }
  );


  /* ====================================================== */
  /* COUNTERS                                               */
  /* ====================================================== */

  const counters =
    document.querySelectorAll(
      ".counter"
    );


  const animateCounter = counter => {

    const target =
      Number(
        counter.dataset.target
      );

    const duration =
      900;

    const start =
      performance.now();


    const tick = now => {

      const elapsed =
        now - start;

      const progress =
        Math.min(
          elapsed / duration,
          1
        );

      const eased =
        1 - Math.pow(
          1 - progress,
          3
        );


      counter.textContent =
        Math.round(
          target * eased
        );


      if (progress < 1) {
        requestAnimationFrame(tick);
      }

    };


    requestAnimationFrame(tick);

  };


  const counterObserver =
    new IntersectionObserver(
      entries => {

        entries.forEach(entry => {

          if (!entry.isIntersecting) {
            return;
          }


          animateCounter(
            entry.target
          );


          counterObserver.unobserve(
            entry.target
          );

        });

      },
      {
        threshold: 0.7
      }
    );


  counters.forEach(counter => {
    counterObserver.observe(counter);
  });


  /* ====================================================== */
  /* ROTATING ROLE                                          */
  /* ====================================================== */

  const rotatingRole =
    document.getElementById(
      "rotatingRole"
    );


  const roles = [
    "Systems Administration",
    "Cloud Native Infrastructure",
    "Automation & DevOps",
    "Data & Artificial Intelligence"
  ];


  let roleIndex = 0;
  let charIndex = 0;
  let deleting = false;


  const typeRole = () => {

    if (!rotatingRole) {
      return;
    }


    const current =
      roles[roleIndex];


    if (!deleting) {

      charIndex++;

      rotatingRole.textContent =
        current.slice(
          0,
          charIndex
        );


      if (
        charIndex
        === current.length
      ) {

        deleting = true;

        setTimeout(
          typeRole,
          1400
        );

        return;
      }

    } else {

      charIndex--;

      rotatingRole.textContent =
        current.slice(
          0,
          charIndex
        );


      if (charIndex === 0) {

        deleting = false;

        roleIndex =
          (roleIndex + 1)
          % roles.length;

      }

    }


    setTimeout(
      typeRole,
      deleting ? 32 : 58
    );

  };


  if (
    rotatingRole
    && !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {

    rotatingRole.textContent = "";

    setTimeout(
      typeRole,
      450
    );

  }


  /* ====================================================== */
  /* THEME                                                  */
  /* ====================================================== */

  const setTheme = light => {

    body.classList.toggle(
      "light",
      light
    );


    if (themeToggle) {

      themeToggle.setAttribute(
        "aria-pressed",
        String(light)
      );

      themeToggle.textContent =
        light ? "☼" : "◐";

    }

  };


  const savedTheme =
    localStorage.getItem(
      "portfolio-theme"
    );


  setTheme(
    savedTheme === "light"
  );


  if (themeToggle) {

    themeToggle.addEventListener(
      "click",
      () => {

        const light =
          !body.classList.contains(
            "light"
          );


        setTheme(light);


        localStorage.setItem(
          "portfolio-theme",
          light
            ? "light"
            : "dark"
        );

      }
    );

  }


  /* ====================================================== */
  /* CURSOR LIGHT                                           */
  /* ====================================================== */

  if (
    cursorGlow
    && window.matchMedia(
      "(pointer:fine)"
    ).matches
  ) {

    window.addEventListener(
      "pointermove",
      event => {

        document.documentElement
          .style
          .setProperty(
            "--mouse-x",
            `${event.clientX}px`
          );


        document.documentElement
          .style
          .setProperty(
            "--mouse-y",
            `${event.clientY}px`
          );

      },
      { passive: true }
    );

  }


  /* ====================================================== */
  /* TILT CARDS                                             */
  /* ====================================================== */

  const tiltCards =
    document.querySelectorAll(
      ".tilt-card"
    );


  if (
    window.matchMedia(
      "(pointer:fine)"
    ).matches
    && !window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {

    tiltCards.forEach(card => {

      card.addEventListener(
        "pointermove",
        event => {

          const rect =
            card.getBoundingClientRect();


          const x =
            event.clientX
            - rect.left;

          const y =
            event.clientY
            - rect.top;


          const rotateY =
            ((x / rect.width) - .5)
            * 5;


          const rotateX =
            ((y / rect.height) - .5)
            * -5;


          card.style.setProperty(
            "--tilt-x",
            `${rotateX}deg`
          );


          card.style.setProperty(
            "--tilt-y",
            `${rotateY}deg`
          );

        }
      );


      card.addEventListener(
        "pointerleave",
        () => {

          card.style.setProperty(
            "--tilt-x",
            "0deg"
          );


          card.style.setProperty(
            "--tilt-y",
            "0deg"
          );

        }
      );

    });

  }


  /* ====================================================== */
  /* COMMAND PALETTE                                        */
  /* ====================================================== */

  const openCommandPalette = () => {

    if (!commandPalette) {
      return;
    }


    commandPalette.classList.add(
      "open"
    );


    commandPalette.setAttribute(
      "aria-hidden",
      "false"
    );


    body.classList.add(
      "no-scroll"
    );

  };


  const closeCommandPalette = () => {

    if (!commandPalette) {
      return;
    }


    commandPalette.classList.remove(
      "open"
    );


    commandPalette.setAttribute(
      "aria-hidden",
      "true"
    );


    body.classList.remove(
      "no-scroll"
    );

  };


  if (commandTrigger) {

    commandTrigger.addEventListener(
      "click",
      openCommandPalette
    );

  }


  document.addEventListener(
    "keydown",
    event => {

      const commandShortcut =
        (
          event.ctrlKey
          || event.metaKey
        )
        && event.key.toLowerCase()
        === "k";


      if (commandShortcut) {

        event.preventDefault();


        if (
          commandPalette
          ?.classList
          .contains("open")
        ) {

          closeCommandPalette();

        } else {

          openCommandPalette();

        }

      }


      if (
        event.key === "Escape"
      ) {

        closeCommandPalette();

      }

    }
  );


  document
    .querySelectorAll(
      "[data-close-command]"
    )
    .forEach(element => {

      element.addEventListener(
        "click",
        closeCommandPalette
      );

    });


  document
    .querySelectorAll(
      "[data-command-target]"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const selector =
            button.dataset.commandTarget;


          const target =
            document.querySelector(
              selector
            );


          closeCommandPalette();


          target?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

        }
      );

    });

});
