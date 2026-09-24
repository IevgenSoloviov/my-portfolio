document.addEventListener("DOMContentLoaded", () => {

  "use strict";


  /* ====================================================================== */
  /* 01 / CONFIG                                                            */
  /* ====================================================================== */

  const CONFIG = {

    githubUser: "IevgenSoloviov",

    githubCacheMinutes: 15,

    roles: [
      "Systems & Network Administration",
      "Cloud Native Infrastructure",
      "Docker & Kubernetes",
      "Infrastructure Automation",
      "Data & Artificial Intelligence"
    ],

    typeSpeed: 54,
    deleteSpeed: 28,
    rolePause: 1450,

    bootDuration: 2350,

    bootStorageKey: "ievgen-portfolio-boot-seen",

    themeStorageKey: "ievgen-portfolio-theme",

    githubCacheKey: "ievgen-github-profile-cache"

  };


  /* ====================================================================== */
  /* 02 / HELPERS                                                           */
  /* ====================================================================== */

  const $ = (selector, context = document) =>
    context.querySelector(selector);

  const $$ = (selector, context = document) =>
    [...context.querySelectorAll(selector)];


  const prefersReducedMotion =
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;


  const finePointer =
    window.matchMedia(
      "(pointer: fine)"
    ).matches;


  const clamp = (value, min, max) =>
    Math.min(
      Math.max(value, min),
      max
    );


  const wait = milliseconds =>
    new Promise(resolve =>
      setTimeout(resolve, milliseconds)
    );


  const safeStorageGet = key => {

    try {

      return localStorage.getItem(key);

    } catch {

      return null;

    }

  };


  const safeStorageSet = (key, value) => {

    try {

      localStorage.setItem(
        key,
        value
      );

    } catch {

      /* Storage may be disabled. */

    }

  };


  const safeSessionGet = key => {

    try {

      return sessionStorage.getItem(key);

    } catch {

      return null;

    }

  };


  const safeSessionSet = (key, value) => {

    try {

      sessionStorage.setItem(
        key,
        value
      );

    } catch {

      /* Session storage may be disabled. */

    }

  };


  const scrollToTarget = selector => {

    const target =
      typeof selector === "string"
        ? $(selector)
        : selector;


    if (!target) {
      return;
    }


    target.scrollIntoView({
      behavior:
        prefersReducedMotion
          ? "auto"
          : "smooth",

      block:
        "start"
    });

  };


  /* ====================================================================== */
  /* 03 / MAIN ELEMENTS                                                     */
  /* ====================================================================== */

  const body =
    document.body;


  const root =
    document.documentElement;


  const navbar =
    $("#navbar");


  const progressBar =
    $("#scrollProgressBar");


  const scrollTopBtn =
    $("#scrollTopBtn");


  const themeToggle =
    $("#themeToggle");


  const menuToggle =
    $("#menuToggle");


  const navLinksContainer =
    $("#navLinks");


  const navLinks =
    $$("#navLinks a");


  const chapterLinks =
    $$(".chapter-rail a");


  const commandPalette =
    $("#commandPalette");


  const commandTrigger =
    $("#commandTrigger");


  const commandSearch =
    $("#commandSearch");


  const commandButtons =
    $$("[data-command-target]");


  const cursorGlow =
    $("#cursorGlow");


  const rotatingRole =
    $("#rotatingRole");


  const bootScreen =
    $("#bootScreen");


  const bootProgressBar =
    $("#bootProgressBar");


  const bootPercentage =
    $("#bootPercentage");


  const bootSteps =
    $$("[data-boot-step]");


  /* ====================================================================== */
  /* 04 / CURRENT YEAR                                                      */
  /* ====================================================================== */

  const yearElement =
    $("#year");


  if (yearElement) {

    yearElement.textContent =
      new Date().getFullYear();

  }


  /* ====================================================================== */
  /* 05 / BOOT SEQUENCE                                                     */
  /* ====================================================================== */

  const initializeBootSequence =
    async () => {

      if (!bootScreen) {
        return;
      }


      const bootAlreadySeen =
        safeSessionGet(
          CONFIG.bootStorageKey
        );


      if (
        prefersReducedMotion
        || bootAlreadySeen === "true"
      ) {

        bootScreen.hidden = true;

        return;
      }


      bootScreen.hidden = false;

      bootScreen.setAttribute(
        "aria-hidden",
        "false"
      );


      body.classList.add(
        "no-scroll"
      );


      bootSteps.forEach(step => {

        step.style.opacity = ".22";

        step.style.transform =
          "translateX(-5px)";

        step.style.transition =
          "opacity .25s ease, transform .25s ease";

      });


      if (bootProgressBar) {

        bootProgressBar.style.width =
          "0%";

      }


      const totalSteps =
        bootSteps.length;


      const stepDelay =
        Math.max(
          170,
          CONFIG.bootDuration
          / Math.max(totalSteps, 1)
        );


      for (
        let index = 0;
        index < totalSteps;
        index++
      ) {

        const step =
          bootSteps[index];


        const progress =
          Math.round(
            ((index + 1) / totalSteps)
            * 100
          );


        step.style.opacity = "1";
        step.style.transform = "none";


        if (index === totalSteps - 1) {

          step.style.color =
            "var(--green)";

        }


        if (bootProgressBar) {

          bootProgressBar.style.width =
            `${progress}%`;

        }


        if (bootPercentage) {

          bootPercentage.textContent =
            `${progress}%`;

        }


        await wait(stepDelay);

      }


      await wait(300);


      bootScreen.style.transition =
        "opacity .45s ease, visibility .45s ease";


      bootScreen.style.opacity =
        "0";


      bootScreen.style.visibility =
        "hidden";


      await wait(460);


      bootScreen.hidden = true;


      body.classList.remove(
        "no-scroll"
      );


      safeSessionSet(
        CONFIG.bootStorageKey,
        "true"
      );

    };


  initializeBootSequence();


  /* ====================================================================== */
  /* 06 / RAF SCROLL ENGINE                                                 */
  /* ====================================================================== */

  let scrollTicking = false;


  const updateScrollSystem = () => {

    const scrollY =
      window.scrollY;


    const documentHeight =
      document.documentElement.scrollHeight
      - window.innerHeight;


    const scrollPercent =
      documentHeight > 0
        ? clamp(
            (scrollY / documentHeight) * 100,
            0,
            100
          )
        : 0;


    if (progressBar) {

      progressBar.style.width =
        `${scrollPercent}%`;

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


    root.style.setProperty(
      "--scroll-progress",
      scrollPercent.toFixed(2)
    );


    scrollTicking = false;

  };


  const requestScrollUpdate = () => {

    if (scrollTicking) {
      return;
    }


    scrollTicking = true;


    requestAnimationFrame(
      updateScrollSystem
    );

  };


  updateScrollSystem();


  window.addEventListener(
    "scroll",
    requestScrollUpdate,
    {
      passive: true
    }
  );


  window.addEventListener(
    "resize",
    requestScrollUpdate,
    {
      passive: true
    }
  );


  /* ====================================================================== */
  /* 07 / SCROLL TO TOP                                                     */
  /* ====================================================================== */

  if (scrollTopBtn) {

    scrollTopBtn.addEventListener(
      "click",
      () => {

        window.scrollTo({

          top: 0,

          behavior:
            prefersReducedMotion
              ? "auto"
              : "smooth"

        });

      }
    );

  }


  /* ====================================================================== */
  /* 08 / SMOOTH INTERNAL LINKS                                             */
  /* ====================================================================== */

  $$('a[href^="#"]').forEach(link => {

    link.addEventListener(
      "click",
      event => {

        const href =
          link.getAttribute(
            "href"
          );


        if (
          !href
          || href === "#"
        ) {

          return;

        }


        const target =
          $(href);


        if (!target) {
          return;
        }


        event.preventDefault();


        scrollToTarget(target);


        if (
          navLinksContainer
          && navLinksContainer.classList.contains(
            "open"
          )
        ) {

          closeMobileNavigation();

        }

      }
    );

  });


  /* ====================================================================== */
  /* 09 / ACTIVE SECTION SYSTEM                                             */
  /* ====================================================================== */

  const trackedSections =
    $$(
      [
        "#identity",
        "#mission",
        "#experience",
        "#flagship",
        "#projects",
        "#stack",
        "#lab",
        "#education",
        "#human",
        "#signal",
        "#contact"
      ].join(",")
    );


  const activateSection = id => {

    [
      ...navLinks,
      ...chapterLinks
    ].forEach(link => {

      const active =
        link.getAttribute("href")
        === `#${id}`;


      link.classList.toggle(
        "active",
        active
      );


      if (active) {

        link.setAttribute(
          "aria-current",
          "true"
        );

      } else {

        link.removeAttribute(
          "aria-current"
        );

      }

    });

  };


  if (
    "IntersectionObserver"
    in window
  ) {

    const sectionObserver =
      new IntersectionObserver(
        entries => {

          const visibleEntries =
            entries
              .filter(entry =>
                entry.isIntersecting
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio
                  - a.intersectionRatio
              );


          if (
            visibleEntries.length
            === 0
          ) {

            return;

          }


          activateSection(
            visibleEntries[0]
              .target
              .id
          );

        },
        {

          rootMargin:
            "-34% 0px -52% 0px",

          threshold:
            [
              0,
              0.15,
              0.35,
              0.55
            ]

        }
      );


    trackedSections.forEach(
      section => {

        sectionObserver.observe(
          section
        );

      }
    );

  }


  /* ====================================================================== */
  /* 10 / MOBILE NAVIGATION                                                 */
  /* ====================================================================== */

  const closeMobileNavigation =
    () => {

      if (!navLinksContainer) {
        return;
      }


      navLinksContainer.classList.remove(
        "open"
      );


      if (menuToggle) {

        menuToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    };


  const openMobileNavigation =
    () => {

      if (!navLinksContainer) {
        return;
      }


      navLinksContainer.classList.add(
        "open"
      );


      if (menuToggle) {

        menuToggle.setAttribute(
          "aria-expanded",
          "true"
        );

      }

    };


  if (
    menuToggle
    && navLinksContainer
  ) {

    menuToggle.addEventListener(
      "click",
      event => {

        event.stopPropagation();


        const isOpen =
          navLinksContainer
            .classList
            .contains(
              "open"
            );


        if (isOpen) {

          closeMobileNavigation();

        } else {

          openMobileNavigation();

        }

      }
    );


    document.addEventListener(
      "click",
      event => {

        if (
          !navLinksContainer
            .classList
            .contains(
              "open"
            )
        ) {

          return;

        }


        const clickedInside =
          navLinksContainer
            .contains(
              event.target
            )
          || menuToggle
            .contains(
              event.target
            );


        if (!clickedInside) {

          closeMobileNavigation();

        }

      }
    );


    window.addEventListener(
      "resize",
      () => {

        if (
          window.innerWidth
          > 900
        ) {

          closeMobileNavigation();

        }

      }
    );

  }


  /* ====================================================================== */
  /* 11 / REVEAL ENGINE                                                     */
  /* ====================================================================== */

  const revealElements =
    $$("[data-reveal]");


  if (
    prefersReducedMotion
    || !(
      "IntersectionObserver"
      in window
    )
  ) {

    revealElements.forEach(
      element => {

        element.classList.add(
          "visible"
        );

      }
    );

  } else {

    const revealObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (
              !entry.isIntersecting
            ) {

              return;

            }


            entry.target
              .classList
              .add(
                "visible"
              );


            revealObserver.unobserve(
              entry.target
            );

          });

        },
        {

          threshold: 0.1,

          rootMargin:
            "0px 0px -35px 0px"

        }
      );


    revealElements.forEach(
      (element, index) => {

        const delay =
          Math.min(
            index % 4,
            3
          ) * 60;


        element.style
          .transitionDelay =
            `${delay}ms`;


        revealObserver.observe(
          element
        );

      }
    );

  }


  /* ====================================================================== */
  /* 12 / COUNTERS                                                          */
  /* ====================================================================== */

  const counters =
    $$(".counter");


  const animateCounter =
    counter => {

      if (
        counter.dataset
          .counterStarted
        === "true"
      ) {

        return;

      }


      counter.dataset
        .counterStarted =
          "true";


      const target =
        Number(
          counter.dataset.target
        );


      if (
        !Number.isFinite(target)
      ) {

        return;

      }


      if (prefersReducedMotion) {

        counter.textContent =
          target;

        return;

      }


      const duration =
        1100;


      const start =
        performance.now();


      const animate =
        timestamp => {

          const elapsed =
            timestamp - start;


          const progress =
            clamp(
              elapsed / duration,
              0,
              1
            );


          const eased =
            1
            - Math.pow(
                1 - progress,
                3
              );


          counter.textContent =
            Math.round(
              target * eased
            );


          if (progress < 1) {

            requestAnimationFrame(
              animate
            );

          }

        };


      requestAnimationFrame(
        animate
      );

    };


  if (
    "IntersectionObserver"
    in window
  ) {

    const counterObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (
              !entry.isIntersecting
            ) {

              return;

            }


            animateCounter(
              entry.target
            );


            counterObserver
              .unobserve(
                entry.target
              );

          });

        },
        {
          threshold: 0.55
        }
      );


    counters.forEach(counter => {

      counterObserver.observe(
        counter
      );

    });

  } else {

    counters.forEach(
      animateCounter
    );

  }

  /* ====================================================================== */
  /* 13 / TYPEWRITER                                                        */
  /* ====================================================================== */

  let roleIndex =
    0;


  let characterIndex =
    0;


  let deleting =
    false;


  let typingTimer =
    null;


  const typeRole =
    () => {

      if (!rotatingRole) {
        return;
      }


      const role =
        CONFIG.roles[
          roleIndex
        ];


      if (!deleting) {

        characterIndex += 1;


        rotatingRole.textContent =
          role.slice(
            0,
            characterIndex
          );


        if (
          characterIndex
          >= role.length
        ) {

          deleting = true;


          typingTimer =
            window.setTimeout(
              typeRole,
              CONFIG.rolePause
            );


          return;

        }


        typingTimer =
          window.setTimeout(
            typeRole,
            CONFIG.typeSpeed
          );


      } else {

        characterIndex -= 1;


        rotatingRole.textContent =
          role.slice(
            0,
            Math.max(
              characterIndex,
              0
            )
          );


        if (
          characterIndex <= 0
        ) {

          deleting = false;


          roleIndex =
            (
              roleIndex + 1
            )
            % CONFIG.roles.length;


          typingTimer =
            window.setTimeout(
              typeRole,
              280
            );


          return;

        }


        typingTimer =
          window.setTimeout(
            typeRole,
            CONFIG.deleteSpeed
          );

      }

    };


  if (rotatingRole) {

    if (prefersReducedMotion) {

      rotatingRole.textContent =
        CONFIG.roles[0];

    } else {

      rotatingRole.textContent =
        "";


      typingTimer =
        window.setTimeout(
          typeRole,
          550
        );

    }

  }


  /* ====================================================================== */
  /* 14 / THEME ENGINE                                                      */
  /* ====================================================================== */

  const themeMeta =
    $('meta[name="theme-color"]');


  const applyTheme =
    theme => {

      const light =
        theme === "light";


      body.classList.toggle(
        "light",
        light
      );


      body.dataset.theme =
        light
          ? "light"
          : "dark";


      if (themeToggle) {

        themeToggle.textContent =
          light
            ? "☀"
            : "◐";


        themeToggle.setAttribute(
          "aria-pressed",
          String(light)
        );


        themeToggle.setAttribute(
          "aria-label",
          light
            ? "Switch to dark theme"
            : "Switch to light theme"
        );

      }


      if (themeMeta) {

        themeMeta.setAttribute(
          "content",
          light
            ? "#eef3f8"
            : "#040711"
        );

      }

    };


  const storedTheme =
    safeStorageGet(
      CONFIG.themeStorageKey
    );


  const systemPrefersLight =
    window.matchMedia(
      "(prefers-color-scheme: light)"
    ).matches;


  const initialTheme =
    storedTheme
      || (
        systemPrefersLight
          ? "light"
          : "dark"
      );


  applyTheme(
    initialTheme
  );


  if (themeToggle) {

    themeToggle.addEventListener(
      "click",
      () => {

        const nextTheme =
          body.classList
            .contains(
              "light"
            )
            ? "dark"
            : "light";


        applyTheme(
          nextTheme
        );


        safeStorageSet(
          CONFIG.themeStorageKey,
          nextTheme
        );

      }
    );

  }


  /* ====================================================================== */
  /* 15 / CURSOR LIGHT                                                      */
  /* ====================================================================== */

  if (
    cursorGlow
    && finePointer
    && !prefersReducedMotion
  ) {

    let pointerTicking =
      false;


    let pointerX =
      window.innerWidth / 2;


    let pointerY =
      window.innerHeight / 2;


    const updatePointer =
      () => {

        root.style.setProperty(
          "--mouse-x",
          `${pointerX}px`
        );


        root.style.setProperty(
          "--mouse-y",
          `${pointerY}px`
        );


        pointerTicking = false;

      };


    window.addEventListener(
      "pointermove",
      event => {

        pointerX =
          event.clientX;


        pointerY =
          event.clientY;


        if (!pointerTicking) {

          pointerTicking = true;


          requestAnimationFrame(
            updatePointer
          );

        }

      },
      {
        passive: true
      }
    );


    document.addEventListener(
      "mouseleave",
      () => {

        cursorGlow.style.opacity =
          "0";

      }
    );


    document.addEventListener(
      "mouseenter",
      () => {

        cursorGlow.style.opacity =
          "1";

      }
    );

  }


  /* ====================================================================== */
  /* 16 / EXTREME TILT SYSTEM                                               */
  /* ====================================================================== */

  const tiltCards =
    $$(".tilt-card");


  if (
    finePointer
    && !prefersReducedMotion
  ) {

    tiltCards.forEach(card => {

      let tiltFrame =
        null;


      const resetTilt =
        () => {

          card.style.setProperty(
            "--tilt-x",
            "0deg"
          );


          card.style.setProperty(
            "--tilt-y",
            "0deg"
          );

      };


      card.addEventListener(
        "pointermove",
        event => {

          if (tiltFrame) {

            cancelAnimationFrame(
              tiltFrame
            );

          }


          tiltFrame =
            requestAnimationFrame(
              () => {

                const rect =
                  card
                    .getBoundingClientRect();


                const x =
                  event.clientX
                  - rect.left;


                const y =
                  event.clientY
                  - rect.top;


                const normalizedX =
                  x / rect.width
                  - 0.5;


                const normalizedY =
                  y / rect.height
                  - 0.5;


                const rotateY =
                  normalizedX * 5;


                const rotateX =
                  normalizedY * -5;


                card.style
                  .setProperty(
                    "--tilt-x",
                    `${rotateX.toFixed(2)}deg`
                  );


                card.style
                  .setProperty(
                    "--tilt-y",
                    `${rotateY.toFixed(2)}deg`
                  );


                card.style
                  .setProperty(
                    "--pointer-card-x",
                    `${(
                      x / rect.width
                    ) * 100}%`
                  );


                card.style
                  .setProperty(
                    "--pointer-card-y",
                    `${(
                      y / rect.height
                    ) * 100}%`
                  );

              }
            );

        }
      );


      card.addEventListener(
        "pointerleave",
        resetTilt
      );


      card.addEventListener(
        "blur",
        resetTilt,
        true
      );

    });

  }


  /* ====================================================================== */
  /* 17 / FLAGSHIP DETAILS                                                  */
  /* ====================================================================== */

  const technicalDetails =
    $$(".tech-details");


  technicalDetails.forEach(details => {

    details.addEventListener(
      "toggle",
      () => {

        if (!details.open) {
          return;
        }


        technicalDetails.forEach(
          other => {

            if (
              other !== details
              && other.open
            ) {

              other.open =
                false;

            }

          }
        );

      }
    );

  });


  /* ====================================================================== */
  /* 18 / COMMAND PALETTE                                                   */
  /* ====================================================================== */

  let commandIsOpen =
    false;


  let previousFocus =
    null;


  let visibleCommandButtons =
    [...commandButtons];


  let commandActiveIndex =
    0;


  const updateCommandSelection =
    () => {

      visibleCommandButtons
        .forEach(
          (button, index) => {

            const active =
              index
              === commandActiveIndex;


            button.classList.toggle(
              "command-active",
              active
            );


            button.setAttribute(
              "aria-selected",
              String(active)
            );

          }
        );


      const current =
        visibleCommandButtons[
          commandActiveIndex
        ];


      current?.scrollIntoView({
        block: "nearest"
      });

  };


  const filterCommands =
    query => {

      const normalized =
        query
          .trim()
          .toLowerCase();


      visibleCommandButtons =
        commandButtons
          .filter(button => {

            const text =
              button
                .textContent
                .toLowerCase();


            const match =
              normalized === ""
              || text.includes(
                normalized
              );


            button.hidden =
              !match;


            return match;

          });


      commandActiveIndex =
        0;


      updateCommandSelection();

  };


  const openCommandPalette =
    () => {

      if (
        !commandPalette
        || commandIsOpen
      ) {

        return;

      }


      previousFocus =
        document.activeElement;


      commandIsOpen =
        true;


      commandPalette
        .classList
        .add(
          "open"
        );


      commandPalette.setAttribute(
        "aria-hidden",
        "false"
      );


      body.classList.add(
        "no-scroll"
      );


      if (commandSearch) {

        commandSearch.value =
          "";


        filterCommands("");


        window.setTimeout(
          () => {

            commandSearch.focus();

          },
          50
        );

      }

  };


  const closeCommandPalette =
    () => {

      if (
        !commandPalette
        || !commandIsOpen
      ) {

        return;

      }


      commandIsOpen =
        false;


      commandPalette
        .classList
        .remove(
          "open"
        );


      commandPalette.setAttribute(
        "aria-hidden",
        "true"
      );


      body.classList.remove(
        "no-scroll"
      );


      if (
        previousFocus
        instanceof HTMLElement
      ) {

        previousFocus.focus();

      }

  };


  if (commandTrigger) {

    commandTrigger.addEventListener(
      "click",
      openCommandPalette
    );

  }


  $$("[data-close-command]")
    .forEach(element => {

      element.addEventListener(
        "click",
        closeCommandPalette
      );

    });


  if (commandSearch) {

    commandSearch.addEventListener(
      "input",
      () => {

        filterCommands(
          commandSearch.value
        );

      }
    );

  }


  commandButtons.forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const selector =
          button.dataset
            .commandTarget;


        closeCommandPalette();


        window.setTimeout(
          () => {

            scrollToTarget(
              selector
            );

          },
          60
        );

      }
    );

  });


  document.addEventListener(
    "keydown",
    event => {

      const key =
        event.key
          .toLowerCase();


      const commandShortcut =
        (
          event.ctrlKey
          || event.metaKey
        )
        && key === "k";


      if (commandShortcut) {

        event.preventDefault();


        if (commandIsOpen) {

          closeCommandPalette();

        } else {

          openCommandPalette();

        }


        return;

      }


      if (
        event.key === "Escape"
      ) {

        if (commandIsOpen) {

          event.preventDefault();

          closeCommandPalette();

        }


        closeMobileNavigation();


        return;

      }


      if (!commandIsOpen) {
        return;
      }


      if (
        event.key === "ArrowDown"
      ) {

        event.preventDefault();


        if (
          visibleCommandButtons
            .length === 0
        ) {

          return;

        }


        commandActiveIndex =
          (
            commandActiveIndex
            + 1
          )
          % visibleCommandButtons
              .length;


        updateCommandSelection();

      }


      if (
        event.key === "ArrowUp"
      ) {

        event.preventDefault();


        if (
          visibleCommandButtons
            .length === 0
        ) {

          return;

        }


        commandActiveIndex =
          (
            commandActiveIndex
            - 1
            + visibleCommandButtons.length
          )
          % visibleCommandButtons
              .length;


        updateCommandSelection();

      }


      if (
        event.key === "Enter"
      ) {

        if (
          document.activeElement
            === commandSearch
        ) {

          event.preventDefault();


          visibleCommandButtons[
            commandActiveIndex
          ]?.click();

        }

      }

    }
  );


  /* ====================================================================== */
  /* 19 / GITHUB LIVE SIGNAL                                                */
  /* ====================================================================== */

  const githubStatElements = {

    repos:
      $('[data-github-stat="repos"]'),

    followers:
      $('[data-github-stat="followers"]'),

    following:
      $('[data-github-stat="following"]')

  };


  const updateGitHubStats =
    data => {

      if (
        githubStatElements.repos
      ) {

        githubStatElements
          .repos
          .textContent =
            data.public_repos
            ?? "--";

      }


      if (
        githubStatElements.followers
      ) {

        githubStatElements
          .followers
          .textContent =
            data.followers
            ?? "--";

      }


      if (
        githubStatElements.following
      ) {

        githubStatElements
          .following
          .textContent =
            data.following
            ?? "--";

      }

  };


  const getCachedGitHubData =
    () => {

      const raw =
        safeStorageGet(
          CONFIG.githubCacheKey
        );


      if (!raw) {
        return null;
      }


      try {

        const parsed =
          JSON.parse(raw);


        const maxAge =
          CONFIG
            .githubCacheMinutes
          * 60
          * 1000;


        const fresh =
          Date.now()
          - parsed.timestamp
          < maxAge;


        if (
          !fresh
          || !parsed.data
        ) {

          return null;

        }


        return parsed.data;

      } catch {

        return null;

      }

    };


  const cacheGitHubData =
    data => {

      safeStorageSet(
        CONFIG.githubCacheKey,
        JSON.stringify({

          timestamp:
            Date.now(),

          data

        })
      );

    };


  const loadGitHubStats =
    async () => {

      const hasGitHubWidgets =
        Object.values(
          githubStatElements
        ).some(Boolean);


      if (!hasGitHubWidgets) {
        return;
      }


      const cached =
        getCachedGitHubData();


      if (cached) {

        updateGitHubStats(
          cached
        );

        return;

      }


      try {

        const response =
          await fetch(
            `https://api.github.com/users/${CONFIG.githubUser}`,
            {

              headers: {
                Accept:
                  "application/vnd.github+json"
              }

            }
          );


        if (!response.ok) {

          throw new Error(
            `GitHub API ${response.status}`
          );

        }


        const data =
          await response.json();


        updateGitHubStats(
          data
        );


        cacheGitHubData(
          data
        );


      } catch (error) {

        console.warn(
          "GitHub live signal unavailable:",
          error
        );


        Object.values(
          githubStatElements
        ).forEach(element => {

          if (element) {

            element.textContent =
              "—";

          }

        });

      }

    };


  loadGitHubStats();

  /* ====================================================================== */
  /* 20 / CHAPTER RAIL ACTIVE STATE                                         */
  /* ====================================================================== */

  const chapterMap =
    new Map();


  chapterLinks.forEach(link => {

    const href =
      link.getAttribute(
        "href"
      );


    if (!href) {
      return;
    }


    chapterMap.set(
      href.substring(1),
      link
    );

  });


  if (
    chapterMap.size
    && "IntersectionObserver"
       in window
  ) {

    const railObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (
              !entry.isIntersecting
            ) {

              return;

            }


            chapterLinks.forEach(
              link => {

                link.classList.remove(
                  "active"
                );

              }
            );


            chapterMap
              .get(
                entry.target.id
              )
              ?.classList
              .add(
                "active"
              );

          });

        },
        {

          threshold: 0,

          rootMargin:
            "-42% 0px -50% 0px"

        }
      );


    trackedSections
      .filter(section =>
        chapterMap.has(
          section.id
        )
      )
      .forEach(section => {

        railObserver.observe(
          section
        );

      });

  }


  /* ====================================================================== */
  /* 21 / SECTION DEPTH EFFECT                                               */
  /* ====================================================================== */

  if (
    finePointer
    && !prefersReducedMotion
  ) {

    const depthSections =
      $$(".section");


    const updateSectionDepth =
      () => {

        const viewportCenter =
          window.innerHeight / 2;


        depthSections.forEach(
          section => {

            const rect =
              section
                .getBoundingClientRect();


            const sectionCenter =
              rect.top
              + rect.height / 2;


            const distance =
              Math.abs(
                sectionCenter
                - viewportCenter
              );


            const visibility =
              clamp(
                1
                - distance
                / (
                  window.innerHeight
                  * 1.6
                ),
                0,
                1
              );


            section.style
              .setProperty(
                "--section-focus",
                visibility
                  .toFixed(3)
              );

          }
        );

      };


    let sectionDepthTicking =
      false;


    const requestSectionDepth =
      () => {

        if (
          sectionDepthTicking
        ) {

          return;

        }


        sectionDepthTicking =
          true;


        requestAnimationFrame(
          () => {

            updateSectionDepth();

            sectionDepthTicking =
              false;

          }
        );

      };


    updateSectionDepth();


    window.addEventListener(
      "scroll",
      requestSectionDepth,
      {
        passive: true
      }
    );

  }


  /* ====================================================================== */
  /* 22 / VISIBILITY / PERFORMANCE                                          */
  /* ====================================================================== */

  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        document.hidden
        && typingTimer
      ) {

        clearTimeout(
          typingTimer
        );


        typingTimer =
          null;

      } else if (
        !document.hidden
        && rotatingRole
        && !prefersReducedMotion
        && !typingTimer
      ) {

        typingTimer =
          window.setTimeout(
            typeRole,
            250
          );

      }

    }
  );


  /* ====================================================================== */
  /* 23 / KEYBOARD QUALITY OF LIFE                                          */
  /* ====================================================================== */

  document.addEventListener(
    "keydown",
    event => {

      if (
        event.key === "Home"
        && !event.ctrlKey
        && !event.metaKey
        && document.activeElement
           === body
      ) {

        window.scrollTo({

          top: 0,

          behavior:
            prefersReducedMotion
              ? "auto"
              : "smooth"

        });

      }

    }
  );


  /* ====================================================================== */
  /* 24 / FLAGSHIP V2 EXTREME INTERACTION ENGINE                            */
  /* ====================================================================== */

  const flagshipSystem =
    $(".flagship-live-system");

  const flagshipModeButtons =
    $$(".flagship-mode");

  const flagshipModeLabel =
    $("#flagshipModeLabel");

  const runtimeModeValue =
    $("#runtimeModeValue");

  const platformStages =
    $$(".platform-stage");

  const flagshipNodes =
    $$(".topology-node");

  const flagshipPaths =
    $$(".topology-line");

  const flagshipEventLog =
    $("#flagshipEventLog");

  const requestPacket =
    $("#requestPacketPrimary");

  const meshPacket =
    $("#meshPacketPrimary");

  const observePacket =
    $("#observePacketPrimary");


  const FLAGSHIP = {

    requestRoutes: [

      {
        name: "PRODUCT REQUEST",
        nodes: [
          "client",
          "ingress",
          "gateway",
          "product",
          "mysql"
        ],
        paths: [
          "path-client-ingress",
          "path-ingress-gateway",
          "path-gateway-services",
          "path-gateway-product",
          "path-product-mysql"
        ],
        events: [
          "client.request()",
          "ingress.route()",
          "gateway.forward(product)",
          "product.read()",
          "mysql.query()"
        ]
      },

      {
        name: "ORDER REQUEST",
        nodes: [
          "client",
          "ingress",
          "gateway",
          "order",
          "redis"
        ],
        paths: [
          "path-client-ingress",
          "path-ingress-gateway",
          "path-gateway-services",
          "path-gateway-order",
          "path-order-redis"
        ],
        events: [
          "client.request()",
          "ingress.route()",
          "gateway.forward(order)",
          "order.process()",
          "redis.lookup()"
        ]
      },

      {
        name: "USER REQUEST",
        nodes: [
          "client",
          "ingress",
          "gateway",
          "user",
          "rabbitmq"
        ],
        paths: [
          "path-client-ingress",
          "path-ingress-gateway",
          "path-gateway-services",
          "path-gateway-user",
          "path-user-rabbitmq"
        ],
        events: [
          "client.request()",
          "ingress.route()",
          "gateway.forward(user)",
          "user.auth()",
          "rabbitmq.publish()"
        ]
      }

    ],

    meshRoutes: [

      {
        name: "PRODUCT → ORDER",
        nodes: [
          "product",
          "order"
        ],
        paths: [
          "path-product-order"
        ],
        events: [
          "istio.route(product→order)",
          "envoy.retry_policy()",
          "mesh.telemetry()"
        ]
      },

      {
        name: "ORDER → USER",
        nodes: [
          "order",
          "user"
        ],
        paths: [
          "path-order-user"
        ],
        events: [
          "istio.route(order→user)",
          "envoy.timeout_policy()",
          "mesh.telemetry()"
        ]
      },

      {
        name: "PRODUCT → USER",
        nodes: [
          "product",
          "user"
        ],
        paths: [
          "path-product-user"
        ],
        events: [
          "istio.route(product→user)",
          "envoy.sidecar()",
          "kiali.trace()"
        ]
      }

    ],

    observeRoute: {

      name: "OBSERVABILITY FLOW",

      nodes: [
        "product",
        "order",
        "user",
        "prometheus",
        "grafana",
        "kiali"
      ],

      paths: [
        "path-services-prometheus",
        "path-prometheus-grafana",
        "path-grafana-kiali"
      ],

      events: [
        "prometheus.scrape()",
        "metrics.store()",
        "grafana.render()",
        "kiali.map_mesh()"
      ]

    }

  };


  let flagshipMode =
    "request";


  let flagshipRouteIndex =
    0;


  let flagshipCycleTimer =
    null;


  let flagshipPacketFrame =
    null;


  let flagshipPacketToken =
    0;


  const formatFlagshipTime =
    () => {

      const now =
        new Date();


      return now
        .toLocaleTimeString(
          [],
          {
            minute: "2-digit",
            second: "2-digit"
          }
        );

    };


  const pushFlagshipEvent =
    message => {

      if (!flagshipEventLog) {
        return;
      }


      const eventLine =
        document.createElement(
          "p"
        );


      const time =
        document.createElement(
          "span"
        );


      time.textContent =
        formatFlagshipTime();


      eventLine.appendChild(
        time
      );


      eventLine.appendChild(
        document.createTextNode(
          message
        )
      );


      flagshipEventLog.prepend(
        eventLine
      );


      while (
        flagshipEventLog.children.length
        > 6
      ) {

        flagshipEventLog
          .lastElementChild
          ?.remove();

      }

    };


  const clearFlagshipFocus =
    () => {

      flagshipNodes.forEach(node => {

        node.classList.remove(
          "is-active"
        );

      });


      flagshipPaths.forEach(path => {

        path.classList.remove(
          "is-active"
        );

      });


      flagshipSystem
        ?.classList
        .remove(
          "has-node-focus"
        );

    };


  const activateFlagshipRoute =
    route => {

      if (!route) {
        return;
      }


      clearFlagshipFocus();


      flagshipSystem
        ?.classList
        .add(
          "has-node-focus"
        );


      route.nodes
        .forEach(name => {

          $(
            `[data-node="${name}"]`
          )
            ?.classList
            .add(
              "is-active"
            );

        });


      route.paths
        .forEach(id => {

          document
            .getElementById(id)
            ?.classList
            .add(
              "is-active"
            );

        });

    };


  const getConnectedPathsForNode =
    nodeName => {

      const map = {

        client: [
          "path-client-ingress"
        ],

        ingress: [
          "path-client-ingress",
          "path-ingress-gateway"
        ],

        gateway: [
          "path-ingress-gateway",
          "path-gateway-services",
          "path-gateway-product",
          "path-gateway-order",
          "path-gateway-user"
        ],

        product: [
          "path-gateway-product",
          "path-product-order",
          "path-product-user",
          "path-product-mysql",
          "path-services-prometheus"
        ],

        order: [
          "path-gateway-order",
          "path-product-order",
          "path-order-user",
          "path-order-redis",
          "path-services-prometheus"
        ],

        user: [
          "path-gateway-user",
          "path-order-user",
          "path-product-user",
          "path-user-rabbitmq",
          "path-services-prometheus"
        ],

        mysql: [
          "path-product-mysql"
        ],

        redis: [
          "path-order-redis"
        ],

        rabbitmq: [
          "path-user-rabbitmq"
        ],

        prometheus: [
          "path-services-prometheus",
          "path-prometheus-grafana"
        ],

        grafana: [
          "path-prometheus-grafana",
          "path-grafana-kiali"
        ],

        kiali: [
          "path-grafana-kiali"
        ]

      };


      return map[nodeName]
        || [];

    };


  const focusFlagshipNode =
    node => {

      if (!node) {
        return;
      }


      const nodeName =
        node.dataset.node;


      clearFlagshipFocus();


      flagshipSystem
        ?.classList
        .add(
          "has-node-focus"
        );


      node.classList.add(
        "is-active"
      );


      getConnectedPathsForNode(
        nodeName
      ).forEach(id => {

        document
          .getElementById(id)
          ?.classList
          .add(
            "is-active"
          );

      });

    };


  const stopFlagshipPacket =
    () => {

      flagshipPacketToken += 1;


      if (
        flagshipPacketFrame
        !== null
      ) {

        cancelAnimationFrame(
          flagshipPacketFrame
        );


        flagshipPacketFrame =
          null;

      }

    };


  const placePacketOnPath =
    (
      packet,
      path,
      progress
    ) => {

      if (
        !packet
        || !path
        || typeof path.getTotalLength
           !== "function"
      ) {

        return;

      }


      const length =
        path.getTotalLength();


      const point =
        path.getPointAtLength(
          length * progress
        );


      packet.setAttribute(
        "cx",
        point.x
      );


      packet.setAttribute(
        "cy",
        point.y
      );

    };


  const animatePacketAcrossPath =
    (
      packet,
      path,
      duration = 650,
      token
    ) => {

      return new Promise(resolve => {

        if (
          prefersReducedMotion
          || !packet
          || !path
        ) {

          placePacketOnPath(
            packet,
            path,
            1
          );


          resolve();

          return;

        }


        const start =
          performance.now();


        const frame =
          now => {

            if (
              token
              !== flagshipPacketToken
            ) {

              resolve();

              return;

            }


            const progress =
              clamp(
                (now - start)
                / duration,
                0,
                1
              );


            const eased =
              progress
              * progress
              * (
                3
                - 2 * progress
              );


            placePacketOnPath(
              packet,
              path,
              eased
            );


            if (
              progress < 1
            ) {

              flagshipPacketFrame =
                requestAnimationFrame(
                  frame
                );

            } else {

              flagshipPacketFrame =
                null;


              resolve();

            }

          };


        flagshipPacketFrame =
          requestAnimationFrame(
            frame
          );

      });

    };


  const animateFlagshipRoute =
    async (
      route,
      packet
    ) => {

      if (
        !route
        || !packet
      ) {

        return;
      }


      stopFlagshipPacket();


      const token =
        flagshipPacketToken;


      activateFlagshipRoute(
        route
      );


      pushFlagshipEvent(
        route.name
      );


      for (
        let index = 0;
        index < route.paths.length;
        index++
      ) {

        if (
          token
          !== flagshipPacketToken
        ) {

          return;

        }


        const path =
          document.getElementById(
            route.paths[index]
          );


        if (!path) {
          continue;
        }


        path.classList.add(
          "is-active"
        );


        const eventMessage =
          route.events[index]
          || route.events[
            route.events.length - 1
          ];


        if (eventMessage) {

          pushFlagshipEvent(
            eventMessage
          );

        }


        await animatePacketAcrossPath(
          packet,
          path,
          560,
          token
        );


        await wait(
          prefersReducedMotion
            ? 0
            : 90
        );

      }

    };


  const getModeRoute =
    () => {

      if (
        flagshipMode
        === "request"
      ) {

        return FLAGSHIP
          .requestRoutes[
            flagshipRouteIndex
            % FLAGSHIP
                .requestRoutes
                .length
          ];

      }


      if (
        flagshipMode
        === "mesh"
      ) {

        return FLAGSHIP
          .meshRoutes[
            flagshipRouteIndex
            % FLAGSHIP
                .meshRoutes
                .length
          ];

      }


      return FLAGSHIP
        .observeRoute;

    };


  const getModePacket =
    () => {

      if (
        flagshipMode
        === "mesh"
      ) {

        return meshPacket;

      }


      if (
        flagshipMode
        === "observe"
      ) {

        return observePacket;

      }


      return requestPacket;

    };


  const runFlagshipVisualization =
    async () => {

      const route =
        getModeRoute();


      const packet =
        getModePacket();


      await animateFlagshipRoute(
        route,
        packet
      );


      if (
        flagshipMode
        !== "observe"
      ) {

        flagshipRouteIndex += 1;

      }

    };


  const stopFlagshipCycle =
    () => {

      if (flagshipCycleTimer) {

        clearInterval(
          flagshipCycleTimer
        );


        flagshipCycleTimer =
          null;

      }


      stopFlagshipPacket();

    };


  const startFlagshipCycle =
    () => {

      stopFlagshipCycle();


      runFlagshipVisualization();


      if (
        prefersReducedMotion
        || document.hidden
      ) {

        return;
      }


      flagshipCycleTimer =
        window.setInterval(
          runFlagshipVisualization,
          flagshipMode === "observe"
            ? 5200
            : 4500
        );

    };


  const updateFlagshipModeUI =
    mode => {

      flagshipModeButtons
        .forEach(button => {

          const active =
            button.dataset
              .flagshipMode
            === mode;


          button.classList.toggle(
            "is-active",
            active
          );


          button.setAttribute(
            "aria-pressed",
            String(active)
          );

        });


      if (flagshipSystem) {

        flagshipSystem.classList.remove(
          "mode-request",
          "mode-mesh",
          "mode-observe"
        );


        flagshipSystem.classList.add(
          `mode-${mode}`
        );

      }


      const labels = {

        request:
          "REQUEST FLOW",

        mesh:
          "SERVICE MESH",

        observe:
          "OBSERVABILITY"

      };


      const label =
        labels[mode]
        || labels.request;


      if (flagshipModeLabel) {

        flagshipModeLabel.textContent =
          label;

      }


      if (runtimeModeValue) {

        runtimeModeValue.textContent =
          label;

      }


      $$(".runtime-status-item")
        .forEach(item => {

          item.classList.remove(
            "is-active"
          );

        });


      const activeStatuses = {

        request: [
          "kubernetes",
          "helm"
        ],

        mesh: [
          "kubernetes",
          "istio",
          "kiali"
        ],

        observe: [
          "prometheus",
          "grafana",
          "kiali"
        ]

      };


      (
        activeStatuses[mode]
        || []
      ).forEach(status => {

        $(
          `[data-runtime-status="${status}"]`
        )
          ?.classList
          .add(
            "is-active"
          );

      });

    };


  const setFlagshipMode =
    mode => {

      if (
        ![
          "request",
          "mesh",
          "observe"
        ].includes(mode)
      ) {

        return;

      }


      flagshipMode =
        mode;


      flagshipRouteIndex =
        0;


      clearFlagshipFocus();


      updateFlagshipModeUI(
        mode
      );


      pushFlagshipEvent(
        `view.switch(${mode})`
      );


      startFlagshipCycle();

    };


  flagshipModeButtons
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          setFlagshipMode(
            button.dataset
              .flagshipMode
          );

        }
      );

    });


  flagshipNodes
    .forEach(node => {

      node.addEventListener(
        "mouseenter",
        () => {

          if (!finePointer) {
            return;
          }


          focusFlagshipNode(
            node
          );

        }
      );


      node.addEventListener(
        "mouseleave",
        () => {

          if (!finePointer) {
            return;
          }


          clearFlagshipFocus();

        }
      );


      node.addEventListener(
        "focus",
        () => {

          focusFlagshipNode(
            node
          );

        }
      );


      node.addEventListener(
        "blur",
        () => {

          clearFlagshipFocus();

        }
      );


      node.addEventListener(
        "click",
        () => {

          focusFlagshipNode(
            node
          );


          pushFlagshipEvent(
            `inspect.${node.dataset.node}()`
          );

        }
      );

    });


  const PLATFORM_STAGE_DATA = {

    compose: {
      status:
        "LOCAL STACK",

      message:
        "compose.stack_ready()"
    },

    swarm: {
      status:
        "ORCHESTRATION",

      message:
        "swarm.services_scaled()"
    },

    kubernetes: {
      status:
        "PLATFORM ACTIVE",

      message:
        "kubernetes.cluster_ready()"
    },

    helm: {
      status:
        "RELEASE DEPLOYED",

      message:
        "helm.release_deployed()"
    },

    istio: {
      status:
        "MESH ONLINE",

      message:
        "istio.mesh_online()"
    }

  };


  platformStages
    .forEach(stage => {

      stage.addEventListener(
        "click",
        () => {

          platformStages
            .forEach(item => {

              item.classList.remove(
                "is-active"
              );

            });


          stage.classList.add(
            "is-active"
          );


          const stageName =
            stage.dataset
              .platformStage;


          const data =
            PLATFORM_STAGE_DATA[
              stageName
            ];


          if (data) {

            pushFlagshipEvent(
              data.message
            );

          }


          const linkedRuntime =
            $(
              `[data-runtime-status="${stageName}"]`
            );


          if (linkedRuntime) {

            linkedRuntime.classList.add(
              "is-active"
            );


            window.setTimeout(
              () => {

                linkedRuntime.classList.remove(
                  "is-active"
                );

              },
              1500
            );

          }


          if (
            stageName === "istio"
          ) {

            setFlagshipMode(
              "mesh"
            );

          }


          if (
            stageName === "kubernetes"
          ) {

            setFlagshipMode(
              "request"
            );

          }

        }
      );

    });


  if (
    flagshipSystem
    && "IntersectionObserver"
       in window
  ) {

    const flagshipVisibilityObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            if (
              entry.isIntersecting
            ) {

              startFlagshipCycle();

            } else {

              stopFlagshipCycle();

            }

          });

        },
        {
          threshold: 0.18
        }
      );


    flagshipVisibilityObserver
      .observe(
        flagshipSystem
      );

  } else if (
    flagshipSystem
  ) {

    startFlagshipCycle();

  }


  if (flagshipSystem) {

    updateFlagshipModeUI(
      "request"
    );

  }


  document.addEventListener(
    "visibilitychange",
    () => {

      if (!flagshipSystem) {
        return;
      }


      if (document.hidden) {

        stopFlagshipCycle();

      } else {

        const rect =
          flagshipSystem
            .getBoundingClientRect();


        const visible =
          rect.bottom > 0
          && rect.top
             < window.innerHeight;


        if (visible) {

          startFlagshipCycle();

        }

      }

    }
  );



  /* ====================================================================== */
  /* 25 / PROJECTS V2 INTERACTION ENGINE                                    */
  /* ====================================================================== */

  const hotelSystemMap =
    $("#hotelSystemMap");

  const hotelDataPacket =
    $("#hotelDataPacket");

  const techSystemMap =
    $("#techSystemMap");

  const techNetworkPacket =
    $("#techNetworkPacket");

  const hotelProjectCard =
    $('[data-project-system="hotel"]');

  const techProjectCard =
    $('[data-project-system="techsolutions"]');


  const projectMapNodes =
    $$(".project-map-node");


  const projectFlowLines =
    $$(".project-flow-line");


  const PROJECTS_V2 = {

    hotel: {

      card:
        hotelProjectCard,

      map:
        hotelSystemMap,

      packet:
        hotelDataPacket,

      routes: [

        {
          name:
            "HOTEL CORE FLOW",

          nodes: [
            "hotel-customers",
            "hotel-bookings",
            "hotel-python",
            "hotel-postgresql"
          ],

          paths: [
            "hotel-path-customers-bookings",
            "hotel-path-bookings-python",
            "hotel-path-python-postgres"
          ]
        },

        {
          name:
            "HOTEL API FLOW",

          nodes: [
            "hotel-python",
            "hotel-api"
          ],

          paths: [
            "hotel-path-python-api"
          ]
        },

        {
          name:
            "HOTEL ANALYTICS FLOW",

          nodes: [
            "hotel-postgresql",
            "hotel-powerbi"
          ],

          paths: [
            "hotel-path-postgres-powerbi"
          ]
        }

      ]

    },

    tech: {

      card:
        techProjectCard,

      map:
        techSystemMap,

      packet:
        techNetworkPacket,

      routes: [

        {
          name:
            "TECH WINDOWS FLOW",

          nodes: [
            "tech-internet",
            "tech-pfsense",
            "tech-lan",
            "tech-windows"
          ],

          paths: [
            "tech-path-internet-pfsense",
            "tech-path-pfsense-lan",
            "tech-path-lan-windows"
          ]
        },

        {
          name:
            "TECH LINUX FLOW",

          nodes: [
            "tech-internet",
            "tech-pfsense",
            "tech-lan",
            "tech-linux"
          ],

          paths: [
            "tech-path-internet-pfsense",
            "tech-path-pfsense-lan",
            "tech-path-lan-linux"
          ]
        },

        {
          name:
            "TECH DMZ FLOW",

          nodes: [
            "tech-internet",
            "tech-pfsense",
            "tech-dmz",
            "tech-services"
          ],

          paths: [
            "tech-path-internet-pfsense",
            "tech-path-pfsense-dmz",
            "tech-path-dmz-services"
          ]
        }

      ]

    }

  };


  let hotelProjectRouteIndex =
    0;


  let techProjectRouteIndex =
    0;


  let hotelProjectTimer =
    null;


  let techProjectTimer =
    null;


  let hotelProjectFrame =
    null;


  let techProjectFrame =
    null;


  let hotelProjectToken =
    0;


  let techProjectToken =
    0;


  let hotelProjectVisible =
    false;


  let techProjectVisible =
    false;


  const clearProjectMapFocus =
    map => {

      if (!map) {
        return;
      }


      $$(
        ".project-map-node",
        map
      ).forEach(node => {

        node.classList.remove(
          "is-active"
        );

      });


      $$(
        ".project-flow-line",
        map
      ).forEach(path => {

        path.classList.remove(
          "is-active"
        );

      });


      map.classList.remove(
        "has-node-focus"
      );

    };


  const activateProjectRoute =
    (
      project,
      route
    ) => {

      if (
        !project
        || !project.map
        || !route
      ) {

        return;
      }


      clearProjectMapFocus(
        project.map
      );


      project.map.classList.add(
        "has-node-focus"
      );


      route.nodes.forEach(
        nodeName => {

          $(
            `[data-project-node="${nodeName}"]`,
            project.map
          )
            ?.classList
            .add(
              "is-active"
            );

        }
      );


      route.paths.forEach(
        pathId => {

          document
            .getElementById(
              pathId
            )
            ?.classList
            .add(
              "is-active"
            );

        }
      );

    };


  const PROJECT_NODE_CONNECTIONS = {

    "hotel-customers": [
      "hotel-path-customers-bookings"
    ],

    "hotel-bookings": [
      "hotel-path-customers-bookings",
      "hotel-path-bookings-python"
    ],

    "hotel-python": [
      "hotel-path-bookings-python",
      "hotel-path-python-postgres",
      "hotel-path-python-api"
    ],

    "hotel-postgresql": [
      "hotel-path-python-postgres",
      "hotel-path-postgres-powerbi"
    ],

    "hotel-api": [
      "hotel-path-python-api"
    ],

    "hotel-powerbi": [
      "hotel-path-postgres-powerbi"
    ],

    "tech-internet": [
      "tech-path-internet-pfsense"
    ],

    "tech-pfsense": [
      "tech-path-internet-pfsense",
      "tech-path-pfsense-lan",
      "tech-path-pfsense-dmz"
    ],

    "tech-lan": [
      "tech-path-pfsense-lan",
      "tech-path-lan-windows",
      "tech-path-lan-linux"
    ],

    "tech-windows": [
      "tech-path-lan-windows"
    ],

    "tech-linux": [
      "tech-path-lan-linux"
    ],

    "tech-dmz": [
      "tech-path-pfsense-dmz",
      "tech-path-dmz-services"
    ],

    "tech-services": [
      "tech-path-dmz-services"
    ]

  };


  const focusProjectNode =
    node => {

      if (!node) {
        return;
      }


      const map =
        node.closest(
          ".project-system-map"
        );


      if (!map) {
        return;
      }


      const nodeName =
        node.dataset.projectNode;


      clearProjectMapFocus(
        map
      );


      map.classList.add(
        "has-node-focus"
      );


      node.classList.add(
        "is-active"
      );


      (
        PROJECT_NODE_CONNECTIONS[
          nodeName
        ]
        || []
      ).forEach(pathId => {

        document
          .getElementById(
            pathId
          )
          ?.classList
          .add(
            "is-active"
          );

      });

    };


  const getProjectFrameKey =
    projectName => {

      return projectName === "hotel"
        ? "hotel"
        : "tech";

    };


  const stopProjectPacket =
    projectName => {

      if (
        projectName
        === "hotel"
      ) {

        hotelProjectToken += 1;


        if (
          hotelProjectFrame
          !== null
        ) {

          cancelAnimationFrame(
            hotelProjectFrame
          );


          hotelProjectFrame =
            null;

        }

      } else {

        techProjectToken += 1;


        if (
          techProjectFrame
          !== null
        ) {

          cancelAnimationFrame(
            techProjectFrame
          );


          techProjectFrame =
            null;

        }

      }

    };


  const placeProjectPacketOnPath =
    (
      packet,
      path,
      progress
    ) => {

      if (
        !packet
        || !path
        || typeof path.getTotalLength
           !== "function"
      ) {

        return;
      }


      const totalLength =
        path.getTotalLength();


      const point =
        path.getPointAtLength(
          totalLength
          * progress
        );


      packet.setAttribute(
        "cx",
        point.x
      );


      packet.setAttribute(
        "cy",
        point.y
      );

    };


  const animateProjectPacketAcrossPath =
    (
      projectName,
      packet,
      path,
      duration,
      token
    ) => {

      return new Promise(resolve => {

        if (
          prefersReducedMotion
          || !packet
          || !path
        ) {

          placeProjectPacketOnPath(
            packet,
            path,
            1
          );


          resolve();

          return;
        }


        const start =
          performance.now();


        const frame =
          now => {

            const currentToken =
              projectName === "hotel"
                ? hotelProjectToken
                : techProjectToken;


            if (
              token
              !== currentToken
            ) {

              resolve();

              return;
            }


            const progress =
              clamp(
                (now - start)
                / duration,
                0,
                1
              );


            const eased =
              progress
              * progress
              * (
                3
                - 2 * progress
              );


            placeProjectPacketOnPath(
              packet,
              path,
              eased
            );


            if (
              progress < 1
            ) {

              const frameId =
                requestAnimationFrame(
                  frame
                );


              if (
                projectName
                === "hotel"
              ) {

                hotelProjectFrame =
                  frameId;

              } else {

                techProjectFrame =
                  frameId;

              }

            } else {

              if (
                projectName
                === "hotel"
              ) {

                hotelProjectFrame =
                  null;

              } else {

                techProjectFrame =
                  null;

              }


              resolve();

            }

          };


        const frameId =
          requestAnimationFrame(
            frame
          );


        if (
          projectName
          === "hotel"
        ) {

          hotelProjectFrame =
            frameId;

        } else {

          techProjectFrame =
            frameId;

        }

      });

    };


  const animateProjectRoute =
    async (
      projectName,
      project,
      route
    ) => {

      if (
        !project
        || !project.map
        || !project.packet
        || !route
      ) {

        return;
      }


      stopProjectPacket(
        projectName
      );


      const token =
        projectName === "hotel"
          ? hotelProjectToken
          : techProjectToken;


      project.card
        ?.classList
        .add(
          "is-running"
        );


      activateProjectRoute(
        project,
        route
      );


      for (
        let index = 0;
        index < route.paths.length;
        index++
      ) {

        const currentToken =
          projectName === "hotel"
            ? hotelProjectToken
            : techProjectToken;


        if (
          token
          !== currentToken
        ) {

          return;
        }


        const path =
          document.getElementById(
            route.paths[index]
          );


        if (!path) {
          continue;
        }


        path.classList.add(
          "is-active"
        );


        await animateProjectPacketAcrossPath(
          projectName,
          project.packet,
          path,
          projectName === "hotel"
            ? 720
            : 760,
          token
        );


        await wait(
          prefersReducedMotion
            ? 0
            : 90
        );

      }


      await wait(
        prefersReducedMotion
          ? 0
          : 420
      );


      project.card
        ?.classList
        .remove(
          "is-running"
        );

    };


  const runHotelProjectVisualization =
    async () => {

      const project =
        PROJECTS_V2.hotel;


      if (
        !project.map
        || !project.packet
      ) {

        return;
      }


      const route =
        project.routes[
          hotelProjectRouteIndex
          % project.routes.length
        ];


      hotelProjectRouteIndex +=
        1;


      await animateProjectRoute(
        "hotel",
        project,
        route
      );

    };


  const runTechProjectVisualization =
    async () => {

      const project =
        PROJECTS_V2.tech;


      if (
        !project.map
        || !project.packet
      ) {

        return;
      }


      const route =
        project.routes[
          techProjectRouteIndex
          % project.routes.length
        ];


      techProjectRouteIndex +=
        1;


      await animateProjectRoute(
        "tech",
        project,
        route
      );

    };


  const stopHotelProjectCycle =
    () => {

      if (
        hotelProjectTimer
      ) {

        clearInterval(
          hotelProjectTimer
        );


        hotelProjectTimer =
          null;

      }


      stopProjectPacket(
        "hotel"
      );


      hotelProjectCard
        ?.classList
        .remove(
          "is-running"
        );

    };


  const stopTechProjectCycle =
    () => {

      if (
        techProjectTimer
      ) {

        clearInterval(
          techProjectTimer
        );


        techProjectTimer =
          null;

      }


      stopProjectPacket(
        "tech"
      );


      techProjectCard
        ?.classList
        .remove(
          "is-running"
        );

    };


  const startHotelProjectCycle =
    () => {

      stopHotelProjectCycle();


      if (
        !hotelSystemMap
        || !hotelDataPacket
      ) {

        return;
      }


      runHotelProjectVisualization();


      if (
        prefersReducedMotion
        || document.hidden
      ) {

        return;
      }


      hotelProjectTimer =
        window.setInterval(
          runHotelProjectVisualization,
          4700
        );

    };


  const startTechProjectCycle =
    () => {

      stopTechProjectCycle();


      if (
        !techSystemMap
        || !techNetworkPacket
      ) {

        return;
      }


      runTechProjectVisualization();


      if (
        prefersReducedMotion
        || document.hidden
      ) {

        return;
      }


      techProjectTimer =
        window.setInterval(
          runTechProjectVisualization,
          4900
        );

    };


  projectMapNodes
    .forEach(node => {

      node.addEventListener(
        "mouseenter",
        () => {

          if (!finePointer) {
            return;
          }


          focusProjectNode(
            node
          );

        }
      );


      node.addEventListener(
        "mouseleave",
        () => {

          if (!finePointer) {
            return;
          }


          const map =
            node.closest(
              ".project-system-map"
            );


          clearProjectMapFocus(
            map
          );

        }
      );


      node.addEventListener(
        "focus",
        () => {

          focusProjectNode(
            node
          );

        }
      );


      node.addEventListener(
        "blur",
        () => {

          const map =
            node.closest(
              ".project-system-map"
            );


          clearProjectMapFocus(
            map
          );

        }
      );


      node.addEventListener(
        "click",
        () => {

          focusProjectNode(
            node
          );

        }
      );

    });


  if (
    "IntersectionObserver"
    in window
  ) {

    if (hotelProjectCard) {

      const hotelProjectObserver =
        new IntersectionObserver(
          entries => {

            entries.forEach(entry => {

              hotelProjectVisible =
                entry.isIntersecting;


              if (
                entry.isIntersecting
              ) {

                startHotelProjectCycle();

              } else {

                stopHotelProjectCycle();

              }

            });

          },
          {
            threshold:
              0.14
          }
        );


      hotelProjectObserver.observe(
        hotelProjectCard
      );

    }


    if (techProjectCard) {

      const techProjectObserver =
        new IntersectionObserver(
          entries => {

            entries.forEach(entry => {

              techProjectVisible =
                entry.isIntersecting;


              if (
                entry.isIntersecting
              ) {

                startTechProjectCycle();

              } else {

                stopTechProjectCycle();

              }

            });

          },
          {
            threshold:
              0.14
          }
        );


      techProjectObserver.observe(
        techProjectCard
      );

    }

  } else {

    if (hotelProjectCard) {

      hotelProjectVisible =
        true;


      startHotelProjectCycle();

    }


    if (techProjectCard) {

      techProjectVisible =
        true;


      startTechProjectCycle();

    }

  }


  document.addEventListener(
    "visibilitychange",
    () => {

      if (document.hidden) {

        stopHotelProjectCycle();

        stopTechProjectCycle();

        return;
      }


      if (
        hotelProjectVisible
      ) {

        startHotelProjectCycle();

      }


      if (
        techProjectVisible
      ) {

        startTechProjectCycle();

      }

    }
  );



  /* ====================================================================== */
  /* 26 / STACK V2 — TECHNICAL UNIVERSE INTERACTION ENGINE                  */
  /* ====================================================================== */

  const stackV2Shell =
    $(".stack-v2-shell");

  const stackV2Map =
    $("#stackUniverseMap");

  const stackV2DomainButtons =
    $$(".stack-domain-button");

  const stackV2DomainNodes =
    $$(".stack-domain-node");

  const stackV2TechNodes =
    $$(".stack-tech-node");

  const stackV2Edges =
    $$(".stack-edge");

  const stackV2SatelliteGroups =
    $$(".stack-satellite-group");

  const stackV2BankCards =
    $$(".stack-bank-card");

  const stackV2PulsePrimary =
    $("#stackPulsePrimary");

  const stackV2PulseSecondary =
    $("#stackPulseSecondary");

  const stackV2ModeLabel =
    $("#stackUniverseMode");

  const stackV2ActivePath =
    $("#stackActivePath");

  const stackV2InspectorCode =
    $("#stackInspectorCode");

  const stackV2InspectorTitle =
    $("#stackInspectorTitle");

  const stackV2InspectorDescription =
    $("#stackInspectorDescription");

  const stackV2InspectorDomain =
    $("#stackInspectorDomain");

  const stackV2InspectorCount =
    $("#stackInspectorCount");

  const stackV2InspectorTechs =
    $("#stackInspectorTechs");

  const stackV2InspectorRelation =
    $("#stackInspectorRelation");


  const STACK_V2_DATA = {

    systems: {
      code: "DOMAIN_01",
      title: "Systems",
      label: "SYSTEMS",
      mode: "SYSTEMS FOUNDATION",
      count: "07",
      description:
        "Foundation layer for services, users and workloads.",
      relation:
        "FOUNDATION → PLATFORM",
      path:
        "SYSTEMS → CLOUD → NETWORK",
      techs: [
        "Linux",
        "Ubuntu",
        "Windows Server",
        "Active Directory",
        "DNS",
        "DHCP",
        "Virtualization"
      ]
    },

    cloud: {
      code: "DOMAIN_02",
      title: "Cloud Native",
      label: "CLOUD",
      mode: "CLOUD-NATIVE PLATFORM",
      count: "06",
      description:
        "Containerization, orchestration, lifecycle and service-mesh tooling.",
      relation:
        "CONTAINERS → ORCHESTRATION",
      path:
        "DOCKER → KUBERNETES → ISTIO",
      techs: [
        "Docker",
        "Compose",
        "Swarm",
        "Kubernetes",
        "Helm",
        "Istio"
      ]
    },

    network: {
      code: "DOMAIN_03",
      title: "Networking",
      label: "NETWORK",
      mode: "NETWORK CONNECTIVITY",
      count: "07",
      description:
        "Connectivity, segmentation, routing and network-service foundations.",
      relation:
        "CONNECTIVITY → SEGMENTATION",
      path:
        "TCP/IP → VLAN → ROUTING → PFSENSE",
      techs: [
        "TCP/IP",
        "Subnetting",
        "VLAN",
        "Routing",
        "Switching",
        "LAN / DMZ",
        "pfSense"
      ]
    },

    security: {
      code: "DOMAIN_04",
      title: "Security",
      label: "SECURITY",
      mode: "SECURITY CONTROL",
      count: "05",
      description:
        "Protection, traffic control and defensive network tooling.",
      relation:
        "CONTROL → DETECTION",
      path:
        "FIREWALL → IDS / IPS → SSL / TLS",
      techs: [
        "Firewall",
        "Suricata",
        "IDS / IPS",
        "iptables",
        "SSL / TLS"
      ]
    },

    observe: {
      code: "DOMAIN_05",
      title: "Observability",
      label: "OBSERVE",
      mode: "OBSERVABILITY SIGNAL",
      count: "05",
      description:
        "Monitoring and visibility across systems and cloud-native platforms.",
      relation:
        "METRICS → VISIBILITY",
      path:
        "PROMETHEUS → GRAFANA → KIALI",
      techs: [
        "Prometheus",
        "Grafana",
        "Kiali",
        "Zabbix",
        "SNMP"
      ]
    },

    automation: {
      code: "DOMAIN_06",
      title: "Automation",
      label: "AUTOMATION",
      mode: "AUTOMATED OPERATIONS",
      count: "06",
      description:
        "Scripting, configuration and versioned operational workflows.",
      relation:
        "SCRIPT → CONFIGURE → VERSION",
      path:
        "BASH → ANSIBLE → GIT → GITHUB",
      techs: [
        "Bash",
        "PowerShell",
        "Ansible",
        "YAML",
        "Git",
        "GitHub"
      ]
    },

    data: {
      code: "DOMAIN_07",
      title: "Data + AI",
      label: "DATA + AI",
      mode: "DATA + INTELLIGENCE",
      count: "08",
      description:
        "Programming, databases, analysis, Big Data and Artificial Intelligence.",
      relation:
        "DATA → ANALYSIS → AI",
      path:
        "PYTHON → SQL → BIG DATA → AI",
      techs: [
        "Python",
        "SQL",
        "PostgreSQL",
        "MySQL",
        "Redis",
        "Big Data",
        "Data Analysis",
        "Artificial Intelligence"
      ]
    },

    digital: {
      code: "DOMAIN_08",
      title: "Digital",
      label: "DIGITAL",
      mode: "WEB + CRM WORKFLOWS",
      count: "06",
      description:
        "Web platforms, CRM systems, content and digital workflows.",
      relation:
        "CONTENT → CRM → WEB",
      path:
        "WORDPRESS → ZOHO CRM → HTML / CSS",
      techs: [
        "WordPress",
        "Zoho CRM",
        "Photoshop",
        "HTML",
        "CSS",
        "Plone CMS"
      ]
    }

  };


  const STACK_V2_DOMAIN_ORDER = [
    "systems",
    "cloud",
    "network",
    "security",
    "observe",
    "data",
    "automation",
    "digital"
  ];


  const STACK_V2_PULSE_ROUTE = [
    "stack-edge-systems-cloud",
    "stack-edge-cloud-network",
    "stack-edge-network-security",
    "stack-edge-security-observe",
    "stack-edge-observe-data",
    "stack-edge-data-automation",
    "stack-edge-automation-systems",
    "stack-edge-automation-cloud",
    "stack-edge-cloud-observe",
    "stack-edge-systems-data",
    "stack-edge-data-digital",
    "stack-edge-digital-cloud"
  ];


  let stackV2ActiveDomain =
    "systems";


  let stackV2DomainIndex =
    0;


  let stackV2CycleTimer =
    null;


  let stackV2PulseFramePrimary =
    null;


  let stackV2PulseFrameSecondary =
    null;


  let stackV2PulseToken =
    0;


  let stackV2Visible =
    false;


  let stackV2UserHoldUntil =
    0;


  const updateStackV2Inspector =
    domain => {

      const data =
        STACK_V2_DATA[domain];


      if (!data) {
        return;
      }


      if (stackV2ModeLabel) {
        stackV2ModeLabel.textContent =
          data.mode;
      }


      if (stackV2ActivePath) {
        stackV2ActivePath.textContent =
          data.path;
      }


      if (stackV2InspectorCode) {
        stackV2InspectorCode.textContent =
          data.code;
      }


      if (stackV2InspectorTitle) {
        stackV2InspectorTitle.textContent =
          data.title;
      }


      if (stackV2InspectorDescription) {
        stackV2InspectorDescription.textContent =
          data.description;
      }


      if (stackV2InspectorDomain) {
        stackV2InspectorDomain.textContent =
          data.label;
      }


      if (stackV2InspectorCount) {
        stackV2InspectorCount.textContent =
          data.count;
      }


      if (stackV2InspectorRelation) {
        stackV2InspectorRelation.textContent =
          data.relation;
      }


      if (stackV2InspectorTechs) {

        stackV2InspectorTechs.innerHTML =
          "";


        data.techs.forEach(tech => {

          const item =
            document.createElement(
              "span"
            );


          item.textContent =
            tech;


          stackV2InspectorTechs.appendChild(
            item
          );

        });

      }

    };


  const clearStackV2Focus =
    () => {

      stackV2DomainButtons
        .forEach(button => {

          button.classList.remove(
            "is-active"
          );


          button.setAttribute(
            "aria-pressed",
            "false"
          );

        });


      stackV2DomainNodes
        .forEach(node => {

          node.classList.remove(
            "is-active"
          );

        });


      stackV2Edges
        .forEach(edge => {

          edge.classList.remove(
            "is-active"
          );

        });


      stackV2SatelliteGroups
        .forEach(group => {

          group.classList.remove(
            "is-active"
          );

        });


      stackV2BankCards
        .forEach(card => {

          card.classList.remove(
            "is-active"
          );

        });


      stackV2Map
        ?.classList
        .remove(
          "has-domain-focus"
        );

    };


  const activateStackV2Domain =
    (
      domain,
      userInitiated = false
    ) => {

      const data =
        STACK_V2_DATA[domain];


      if (!data) {
        return;
      }


      stackV2ActiveDomain =
        domain;


      stackV2DomainIndex =
        Math.max(
          STACK_V2_DOMAIN_ORDER.indexOf(
            domain
          ),
          0
        );


      if (userInitiated) {

        stackV2UserHoldUntil =
          Date.now() + 8500;

      }


      clearStackV2Focus();


      stackV2Map
        ?.classList
        .add(
          "has-domain-focus"
        );


      stackV2DomainButtons
        .filter(button =>
          button.dataset.stackDomain
          === domain
        )
        .forEach(button => {

          button.classList.add(
            "is-active"
          );


          button.setAttribute(
            "aria-pressed",
            "true"
          );

        });


      stackV2DomainNodes
        .filter(node =>
          node.dataset.stackNode
          === domain
        )
        .forEach(node => {

          node.classList.add(
            "is-active"
          );

        });


      stackV2SatelliteGroups
        .filter(group =>
          group.dataset.stackDomainRef
          === domain
        )
        .forEach(group => {

          group.classList.add(
            "is-active"
          );

        });


      stackV2Edges
        .filter(edge => {

          const edgeDomains =
            (
              edge.dataset.stackEdge
              || ""
            )
              .split(" ");


          return edgeDomains.includes(
            domain
          );

        })
        .forEach(edge => {

          edge.classList.add(
            "is-active"
          );

        });


      stackV2BankCards
        .filter(card =>
          card.dataset.stackBank
          === domain
        )
        .forEach(card => {

          card.classList.add(
            "is-active"
          );

        });


      updateStackV2Inspector(
        domain
      );

    };


  const inspectStackV2Technology =
    node => {

      if (!node) {
        return;
      }


      const tech =
        node.dataset.stackTech;


      const domain =
        node.dataset.stackDomainRef;


      if (
        !tech
        || !domain
        || !STACK_V2_DATA[domain]
      ) {
        return;
      }


      activateStackV2Domain(
        domain,
        true
      );


      stackV2TechNodes
        .forEach(item => {

          item.classList.toggle(
            "is-active",
            item === node
          );

        });


      if (stackV2InspectorTitle) {
        stackV2InspectorTitle.textContent =
          tech;
      }


      if (stackV2InspectorDescription) {
        stackV2InspectorDescription.textContent =
          `${tech} / ${STACK_V2_DATA[domain].title}`;
      }

    };


  const placeStackV2PulseOnPath =
    (
      pulse,
      path,
      progress
    ) => {

      if (
        !pulse
        || !path
        || typeof path.getTotalLength
           !== "function"
      ) {
        return;
      }


      const totalLength =
        path.getTotalLength();


      const point =
        path.getPointAtLength(
          totalLength * progress
        );


      pulse.setAttribute(
        "cx",
        point.x
      );


      pulse.setAttribute(
        "cy",
        point.y
      );

    };


  const stopStackV2PulseFrames =
    () => {

      stackV2PulseToken += 1;


      if (
        stackV2PulseFramePrimary
        !== null
      ) {

        cancelAnimationFrame(
          stackV2PulseFramePrimary
        );


        stackV2PulseFramePrimary =
          null;

      }


      if (
        stackV2PulseFrameSecondary
        !== null
      ) {

        cancelAnimationFrame(
          stackV2PulseFrameSecondary
        );


        stackV2PulseFrameSecondary =
          null;

      }

    };


  const animateStackV2Pulse =
    (
      pulse,
      path,
      duration,
      token,
      frameSlot
    ) => {

      return new Promise(resolve => {

        if (
          prefersReducedMotion
          || !pulse
          || !path
        ) {

          placeStackV2PulseOnPath(
            pulse,
            path,
            1
          );


          resolve();

          return;

        }


        const start =
          performance.now();


        const frame =
          now => {

            if (
              token
              !== stackV2PulseToken
            ) {

              resolve();

              return;

            }


            const progress =
              clamp(
                (now - start) / duration,
                0,
                1
              );


            const eased =
              progress
              * progress
              * (3 - 2 * progress);


            placeStackV2PulseOnPath(
              pulse,
              path,
              eased
            );


            if (progress < 1) {

              const id =
                requestAnimationFrame(
                  frame
                );


              if (frameSlot === "primary") {
                stackV2PulseFramePrimary = id;
              } else {
                stackV2PulseFrameSecondary = id;
              }

            } else {

              if (frameSlot === "primary") {
                stackV2PulseFramePrimary = null;
              } else {
                stackV2PulseFrameSecondary = null;
              }


              resolve();

            }

          };


        const id =
          requestAnimationFrame(
            frame
          );


        if (frameSlot === "primary") {
          stackV2PulseFramePrimary = id;
        } else {
          stackV2PulseFrameSecondary = id;
        }

      });

    };


  const getStackV2DomainEdges =
    domain =>
      stackV2Edges.filter(edge =>
        (
          edge.dataset.stackEdge
          || ""
        )
          .split(" ")
          .includes(domain)
      );


  const runStackV2PulseSequence =
    async () => {

      if (
        !stackV2Shell
        || !stackV2Map
      ) {
        return;
      }


      stopStackV2PulseFrames();


      const token =
        stackV2PulseToken;


      stackV2Shell.classList.add(
        "is-running"
      );


      const activeEdges =
        getStackV2DomainEdges(
          stackV2ActiveDomain
        );


      const primaryPath =
        activeEdges[0]
        || document.getElementById(
          STACK_V2_PULSE_ROUTE[0]
        );


      const secondaryPath =
        activeEdges[1]
        || document.getElementById(
          STACK_V2_PULSE_ROUTE[1]
        );


      const jobs = [];


      if (
        stackV2PulsePrimary
        && primaryPath
      ) {

        jobs.push(
          animateStackV2Pulse(
            stackV2PulsePrimary,
            primaryPath,
            1200,
            token,
            "primary"
          )
        );

      }


      if (
        stackV2PulseSecondary
        && secondaryPath
      ) {

        jobs.push(
          wait(260)
            .then(() =>
              animateStackV2Pulse(
                stackV2PulseSecondary,
                secondaryPath,
                1450,
                token,
                "secondary"
              )
            )
        );

      }


      await Promise.all(jobs);


      stackV2Shell.classList.remove(
        "is-running"
      );

    };


  const stopStackV2Cycle =
    () => {

      if (stackV2CycleTimer) {

        clearInterval(
          stackV2CycleTimer
        );


        stackV2CycleTimer =
          null;

      }


      stopStackV2PulseFrames();


      stackV2Shell
        ?.classList
        .remove(
          "is-running"
        );

    };


  const advanceStackV2Domain =
    () => {

      if (
        Date.now()
        < stackV2UserHoldUntil
      ) {

        runStackV2PulseSequence();

        return;

      }


      stackV2DomainIndex =
        (
          stackV2DomainIndex + 1
        )
        % STACK_V2_DOMAIN_ORDER.length;


      activateStackV2Domain(
        STACK_V2_DOMAIN_ORDER[
          stackV2DomainIndex
        ]
      );


      runStackV2PulseSequence();

    };


  const startStackV2Cycle =
    () => {

      stopStackV2Cycle();


      if (!stackV2Shell) {
        return;
      }


      activateStackV2Domain(
        stackV2ActiveDomain
      );


      runStackV2PulseSequence();


      if (
        prefersReducedMotion
        || document.hidden
      ) {
        return;
      }


      stackV2CycleTimer =
        window.setInterval(
          advanceStackV2Domain,
          4300
        );

    };


  stackV2DomainButtons
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          activateStackV2Domain(
            button.dataset.stackDomain,
            true
          );


          runStackV2PulseSequence();

        }
      );


      button.addEventListener(
        "mouseenter",
        () => {

          if (!finePointer) {
            return;
          }


          activateStackV2Domain(
            button.dataset.stackDomain,
            true
          );

        }
      );

    });


  stackV2DomainNodes
    .forEach(node => {

      const activateNode =
        () => {

          activateStackV2Domain(
            node.dataset.stackNode,
            true
          );


          runStackV2PulseSequence();

        };


      node.addEventListener(
        "click",
        activateNode
      );


      node.addEventListener(
        "focus",
        activateNode
      );


      node.addEventListener(
        "mouseenter",
        () => {

          if (finePointer) {
            activateNode();
          }

        }
      );

    });


  stackV2TechNodes
    .forEach(node => {

      const inspectTech =
        () => {
          inspectStackV2Technology(node);
        };


      node.addEventListener(
        "click",
        inspectTech
      );


      node.addEventListener(
        "focus",
        inspectTech
      );


      node.addEventListener(
        "mouseenter",
        () => {

          if (finePointer) {
            inspectTech();
          }

        }
      );


      node.addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Enter"
            || event.key === " "
          ) {

            event.preventDefault();
            inspectTech();

          }

        }
      );

    });


  stackV2BankCards
    .forEach(card => {

      const inspectBank =
        () => {

          activateStackV2Domain(
            card.dataset.stackBank,
            true
          );


          runStackV2PulseSequence();

        };


      card.addEventListener(
        "click",
        inspectBank
      );


      card.addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Enter"
            || event.key === " "
          ) {

            event.preventDefault();
            inspectBank();

          }

        }
      );

    });


  stackV2DomainButtons
    .forEach(
      (
        button,
        index
      ) => {

        button.addEventListener(
          "keydown",
          event => {

            if (
              event.key !== "ArrowDown"
              && event.key !== "ArrowRight"
              && event.key !== "ArrowUp"
              && event.key !== "ArrowLeft"
            ) {
              return;
            }


            event.preventDefault();


            const direction =
              (
                event.key === "ArrowDown"
                || event.key === "ArrowRight"
              )
                ? 1
                : -1;


            const nextIndex =
              (
                index
                + direction
                + stackV2DomainButtons.length
              )
              % stackV2DomainButtons.length;


            stackV2DomainButtons[
              nextIndex
            ]?.focus();

          }
        );

      }
    );


  if (
    stackV2Shell
    && "IntersectionObserver"
       in window
  ) {

    const stackV2Observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            stackV2Visible =
              entry.isIntersecting;


            if (entry.isIntersecting) {

              startStackV2Cycle();

            } else {

              stopStackV2Cycle();

            }

          });

        },
        {
          threshold: .15
        }
      );


    stackV2Observer.observe(
      stackV2Shell
    );

  } else if (stackV2Shell) {

    stackV2Visible =
      true;


    startStackV2Cycle();

  }


  if (stackV2Shell) {

    activateStackV2Domain(
      "systems"
    );

  }


  document.addEventListener(
    "visibilitychange",
    () => {

      if (!stackV2Shell) {
        return;
      }


      if (document.hidden) {

        stopStackV2Cycle();

        return;

      }


      if (stackV2Visible) {

        startStackV2Cycle();

      }

    }
  );



  /* ====================================================================== */
  /* 27 / TECHNICAL LAB V2 INTERACTION ENGINE                              */
  /* ====================================================================== */

  const labV2Shell =
    $("#technicalLabConsole");

  const labV2Buttons =
    $$(".lab-v2-mode");

  const labV2BankCards =
    $$(".lab-v2-bank-card");

  const labV2ModeLabel =
    $("#labV2ModeLabel");

  const labV2Run =
    $("#labV2Run");

  const labV2Terminal =
    $("#labV2Terminal");

  const labV2TerminalOutput =
    $("#labV2TerminalOutput");

  const labV2Prompt =
    $("#labV2Prompt");

  const labV2Code =
    $("#labV2Code");

  const labV2Title =
    $("#labV2Title");

  const labV2Description =
    $("#labV2Description");

  const labV2State =
    $("#labV2State");

  const labV2Mode =
    $("#labV2Mode");

  const labV2ToolCount =
    $("#labV2ToolCount");

  const labV2Tools =
    $("#labV2Tools");

  const labV2EventLog =
    $("#labV2EventLog");


  const LAB_V2_DATA = {

    containers: {
      code: "LAB_01",
      title: "Container Platforms",
      modeLabel: "CONTAINER PLATFORM",
      mode: "PLATFORM",
      state: "ACTIVE",
      description:
        "Containerization, orchestration and cloud-native platform experiments.",
      prompt:
        "inspect --platform",
      tools: [
        "Docker",
        "Compose",
        "Swarm",
        "Kubernetes",
        "Helm",
        "Istio"
      ],
      sequence: [
        {
          type: "command",
          prefix: "$",
          text: "docker compose up -d"
        },
        {
          type: "ok",
          prefix: "[OK]",
          text: "services started"
        },
        {
          type: "command",
          prefix: "$",
          text: "kubectl get pods -A"
        },
        {
          type: "plain",
          prefix: "",
          text: "platform workloads / running"
        },
        {
          type: "command",
          prefix: "$",
          text: "helm list"
        },
        {
          type: "ok",
          prefix: "[OK]",
          text: "release state / ready"
        }
      ]
    },

    systems: {
      code: "LAB_02",
      title: "Systems & Identity",
      modeLabel: "SYSTEMS SERVICES",
      mode: "SYSTEMS",
      state: "READY",
      description:
        "Linux and Windows Server foundations with identity, DNS and DHCP services.",
      prompt:
        "inspect --services",
      tools: [
        "Linux",
        "Windows Server",
        "Active Directory",
        "DNS",
        "DHCP"
      ],
      sequence: [
        {
          type: "command",
          prefix: "$",
          text: "systemctl --type=service --state=running"
        },
        {
          type: "ok",
          prefix: "[OK]",
          text: "service layer available"
        },
        {
          type: "command",
          prefix: "$",
          text: "dig lab.local"
        },
        {
          type: "plain",
          prefix: "",
          text: "dns resolution / verified"
        },
        {
          type: "command",
          prefix: "$",
          text: "ip addr show"
        },
        {
          type: "ok",
          prefix: "[OK]",
          text: "network interface / ready"
        }
      ]
    },

    network: {
      code: "LAB_03",
      title: "Security & Connectivity",
      modeLabel: "NETWORK SECURITY",
      mode: "NETWORK",
      state: "ACTIVE",
      description:
        "Segmentation, routing, firewalling and network-security experiments.",
      prompt:
        "inspect --network",
      tools: [
        "pfSense",
        "VLAN",
        "Firewall",
        "Suricata",
        "iptables"
      ],
      sequence: [
        {
          type: "command",
          prefix: "$",
          text: "ip route"
        },
        {
          type: "plain",
          prefix: "",
          text: "routing table / loaded"
        },
        {
          type: "command",
          prefix: "$",
          text: "iptables -L"
        },
        {
          type: "ok",
          prefix: "[OK]",
          text: "firewall rules / inspected"
        },
        {
          type: "command",
          prefix: "$",
          text: "ping -c 2 gateway.lab"
        },
        {
          type: "ok",
          prefix: "[OK]",
          text: "connectivity / reachable"
        }
      ]
    },

    observe: {
      code: "LAB_04",
      title: "Observability",
      modeLabel: "OBSERVABILITY STACK",
      mode: "OBSERVE",
      state: "READY",
      description:
        "Metrics, dashboards and service visibility across infrastructure and platforms.",
      prompt:
        "inspect --telemetry",
      tools: [
        "Prometheus",
        "Grafana",
        "Kiali",
        "Zabbix",
        "SNMP"
      ],
      sequence: [
        {
          type: "command",
          prefix: "$",
          text: "kubectl get svc -n monitoring"
        },
        {
          type: "ok",
          prefix: "[OK]",
          text: "monitoring services / discovered"
        },
        {
          type: "command",
          prefix: "$",
          text: "prometheus --version"
        },
        {
          type: "plain",
          prefix: "",
          text: "metrics pipeline / available"
        },
        {
          type: "command",
          prefix: "$",
          text: "inspect dashboards"
        },
        {
          type: "ok",
          prefix: "[OK]",
          text: "visibility layer / ready"
        }
      ]
    },

    services: {
      code: "LAB_05",
      title: "Network Services",
      modeLabel: "SERVICE DELIVERY",
      mode: "SERVICES",
      state: "READY",
      description:
        "Messaging and streaming service experiments built around containerized network services.",
      prompt:
        "inspect --services",
      tools: [
        "Matrix",
        "Synapse",
        "Element",
        "Nginx",
        "RTMP",
        "HLS"
      ],
      sequence: [
        {
          type: "command",
          prefix: "$",
          text: "docker ps"
        },
        {
          type: "ok",
          prefix: "[OK]",
          text: "service containers / running"
        },
        {
          type: "command",
          prefix: "$",
          text: "nginx -t"
        },
        {
          type: "ok",
          prefix: "[OK]",
          text: "configuration / valid"
        },
        {
          type: "command",
          prefix: "$",
          text: "inspect stream pipeline"
        },
        {
          type: "plain",
          prefix: "",
          text: "RTMP → HLS / delivery path"
        }
      ]
    },

    data: {
      code: "LAB_06",
      title: "Data + AI",
      modeLabel: "DATA + INTELLIGENCE",
      mode: "CURRENT",
      state: "BUILDING",
      description:
        "Current learning layer focused on Python, data processing, Big Data and AI foundations.",
      prompt:
        "inspect --data --ai",
      tools: [
        "Python",
        "Data Processing",
        "Big Data",
        "AI"
      ],
      sequence: [
        {
          type: "command",
          prefix: "$",
          text: "python main.py"
        },
        {
          type: "ok",
          prefix: "[OK]",
          text: "program execution / complete"
        },
        {
          type: "command",
          prefix: "$",
          text: "inspect data pipeline"
        },
        {
          type: "plain",
          prefix: "",
          text: "data processing / active"
        },
        {
          type: "command",
          prefix: "$",
          text: "build --next-layer ai"
        },
        {
          type: "warn",
          prefix: "[..]",
          text: "learning layer / building"
        }
      ]
    }

  };


  let labV2ActiveMode =
    "containers";


  let labV2RunToken =
    0;


  let labV2Visible =
    false;


  const getLabV2Time =
    () => {

      return new Date()
        .toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit"
          }
        );

    };


  const pushLabV2Event =
    message => {

      if (!labV2EventLog) {
        return;
      }


      const line =
        document.createElement(
          "p"
        );


      const time =
        document.createElement(
          "span"
        );


      time.textContent =
        getLabV2Time();


      line.appendChild(
        time
      );


      line.appendChild(
        document.createTextNode(
          message
        )
      );


      labV2EventLog.prepend(
        line
      );


      while (
        labV2EventLog.children.length
        > 5
      ) {

        labV2EventLog
          .lastElementChild
          ?.remove();

      }

    };


  const renderLabV2Tools =
    tools => {

      if (!labV2Tools) {
        return;
      }


      labV2Tools.innerHTML =
        "";


      tools.forEach(tool => {

        const chip =
          document.createElement(
            "span"
          );


        chip.textContent =
          tool;


        labV2Tools.appendChild(
          chip
        );

      });

    };


  const setLabV2ActiveMode =
    (
      mode,
      userInitiated = false
    ) => {

      const data =
        LAB_V2_DATA[mode];


      if (!data) {
        return;
      }


      labV2ActiveMode =
        mode;


      labV2RunToken += 1;


      labV2Shell
        ?.classList
        .remove(
          "is-running"
        );


      labV2Buttons
        .forEach(button => {

          const active =
            button.dataset.labV2Mode
            === mode;


          button.classList.toggle(
            "is-active",
            active
          );


          button.setAttribute(
            "aria-pressed",
            String(active)
          );

        });


      labV2BankCards
        .forEach(card => {

          card.classList.toggle(
            "is-active",
            card.dataset.labV2Bank
            === mode
          );

        });


      if (labV2ModeLabel) {
        labV2ModeLabel.textContent =
          data.modeLabel;
      }


      if (labV2Prompt) {
        labV2Prompt.textContent =
          data.prompt;
      }


      if (labV2Code) {
        labV2Code.textContent =
          data.code;
      }


      if (labV2Title) {
        labV2Title.textContent =
          data.title;
      }


      if (labV2Description) {
        labV2Description.textContent =
          data.description;
      }


      if (labV2State) {
        labV2State.textContent =
          data.state;
      }


      if (labV2Mode) {
        labV2Mode.textContent =
          data.mode;
      }


      if (labV2ToolCount) {
        labV2ToolCount.textContent =
          String(data.tools.length)
            .padStart(
              2,
              "0"
            );
      }


      renderLabV2Tools(
        data.tools
      );


      if (labV2TerminalOutput) {

        labV2TerminalOutput.innerHTML =
          "";


        data.sequence
          .slice(
            0,
            2
          )
          .forEach(step => {

            const line =
              document.createElement(
                "p"
              );


            line.className =
              `lab-v2-line ${
                step.type === "command"
                  ? "is-command"
                  : step.type === "ok"
                    ? "is-ok"
                    : step.type === "warn"
                      ? "is-warn"
                      : ""
              }`;


            if (step.prefix) {

              const prefix =
                document.createElement(
                  "span"
                );


              prefix.textContent =
                step.prefix;


              line.appendChild(
                prefix
              );

            }


            line.appendChild(
              document.createTextNode(
                step.text
              )
            );


            labV2TerminalOutput.appendChild(
              line
            );

          });

      }


      pushLabV2Event(
        `environment.select(${mode})`
      );


      if (userInitiated) {

        pushLabV2Event(
          "operator.input()"
        );

      }

    };


  const createLabV2Line =
    step => {

      const line =
        document.createElement(
          "p"
        );


      line.className =
        `lab-v2-line ${
          step.type === "command"
            ? "is-command"
            : step.type === "ok"
              ? "is-ok"
              : step.type === "warn"
                ? "is-warn"
                : ""
        }`;


      if (step.prefix) {

        const prefix =
          document.createElement(
            "span"
          );


        prefix.textContent =
          step.prefix;


        line.appendChild(
          prefix
        );

      }


      line.appendChild(
        document.createTextNode(
          step.text
        )
      );


      return line;

    };


  const runLabV2Sequence =
    async () => {

      const data =
        LAB_V2_DATA[
          labV2ActiveMode
        ];


      if (
        !data
        || !labV2TerminalOutput
      ) {

        return;
      }


      labV2RunToken += 1;


      const token =
        labV2RunToken;


      labV2Shell
        ?.classList
        .add(
          "is-running"
        );


      labV2TerminalOutput.innerHTML =
        "";


      pushLabV2Event(
        "sequence.run()"
      );


      for (
        const step
        of data.sequence
      ) {

        if (
          token
          !== labV2RunToken
        ) {

          return;
        }


        labV2TerminalOutput.appendChild(
          createLabV2Line(
            step
          )
        );


        labV2TerminalOutput.scrollTop =
          labV2TerminalOutput.scrollHeight;


        await wait(
          prefersReducedMotion
            ? 0
            : step.type === "command"
              ? 520
              : 310
        );

      }


      if (
        token
        !== labV2RunToken
      ) {

        return;
      }


      labV2Shell
        ?.classList
        .remove(
          "is-running"
        );


      pushLabV2Event(
        "sequence.complete()"
      );

    };


  labV2Buttons
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          const mode =
            button.dataset.labV2Mode;


          setLabV2ActiveMode(
            mode,
            true
          );


          runLabV2Sequence();

        }
      );

    });


  labV2BankCards
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          const mode =
            card.dataset.labV2Bank;


          setLabV2ActiveMode(
            mode,
            true
          );


          runLabV2Sequence();

        }
      );

    });


  labV2Run
    ?.addEventListener(
      "click",
      runLabV2Sequence
    );


  if (
    labV2Shell
    && "IntersectionObserver"
       in window
  ) {

    const labV2Observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            labV2Visible =
              entry.isIntersecting;


            if (
              entry.isIntersecting
              && !prefersReducedMotion
            ) {

              pushLabV2Event(
                "lab.viewport.active()"
              );

            }

          });

        },
        {
          threshold: .16
        }
      );


    labV2Observer.observe(
      labV2Shell
    );

  } else if (labV2Shell) {

    labV2Visible =
      true;

  }


  if (labV2Shell) {

    setLabV2ActiveMode(
      "containers"
    );

  }


  document.addEventListener(
    "visibilitychange",
    () => {

      if (
        !labV2Shell
        || !labV2Visible
      ) {

        return;
      }


      if (document.hidden) {

        labV2RunToken += 1;

        labV2Shell.classList.remove(
          "is-running"
        );

      }

    }
  );


  /* ====================================================================== */
  /* 28 / SYSTEM READY                                                       */
  /* ====================================================================== */

  requestAnimationFrame(
    () => {

      body.classList.add(
        "system-ready"
      );

    }
  );


  console.log(
    "%c IEVGEN // PORTFOLIO SYSTEM ONLINE ",
    [
      "background:#38bdf8",
      "color:#04111a",
      "font-weight:700",
      "padding:6px 10px",
      "border-radius:4px"
    ].join(";")
  );


  console.log(
    [
      "Systems",
      "Cloud Native",
      "Automation",
      "Data",
      "AI"
    ].join(" → ")
  );

});
