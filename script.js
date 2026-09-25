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
  /* 26 / STACK V3 — KNOWLEDGE GRAPH OS                                    */
  /* ====================================================================== */

  const stackV3System =
    $("#stackV3System");

  const stackV3Search =
    $("#stackV3Search");

  const stackV3Clear =
    $("#stackV3Clear");

  const stackV3EmptyReset =
    $("#stackV3EmptyReset");

  const stackV3Filters =
    $$(".stack-v3-filter");

  const stackV3Domains =
    $$(".stack-v3-domain");

  const stackV3DomainNodes =
    $$("[data-stack-v3-domain-node]");

  const stackV3Edges =
    $$("[data-stack-v3-edge]");

  const stackV3TechGrid =
    $("#stackV3TechGrid");

  const stackV3Empty =
    $("#stackV3Empty");

  const stackV3ResultCount =
    $("#stackV3ResultCount");

  const stackV3RegistryState =
    $("#stackV3RegistryState");

  const stackV3DomainState =
    $("#stackV3DomainState");

  const stackV3GraphMode =
    $("#stackV3GraphMode");

  const stackV3FocusTech =
    $("#stackV3FocusTech");

  const stackV3FocusDomain =
    $("#stackV3FocusDomain");

  const stackV3InspectorCode =
    $("#stackV3InspectorCode");

  const stackV3InspectorStatus =
    $("#stackV3InspectorStatus");

  const stackV3InspectorDomain =
    $("#stackV3InspectorDomain");

  const stackV3InspectorTitle =
    $("#stackV3InspectorTitle");

  const stackV3InspectorDescription =
    $("#stackV3InspectorDescription");

  const stackV3MetricDomain =
    $("#stackV3MetricDomain");

  const stackV3MetricRelations =
    $("#stackV3MetricRelations");

  const stackV3MetricProof =
    $("#stackV3MetricProof");

  const stackV3Related =
    $("#stackV3Related");

  const stackV3ProofList =
    $("#stackV3ProofList");

  const stackV3EvidenceCards =
    $$(".stack-v3-evidence-card");


  const STACK_V3_DOMAINS = {

    systems: {
      code: "DOMAIN_01",
      label: "SYSTEMS",
      title: "Systems",
      mode: "SYSTEMS / FOUNDATION",
      description:
        "Operating systems, identity and infrastructure service foundations.",
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
      label: "CLOUD",
      title: "Cloud Native",
      mode: "CLOUD / PLATFORM",
      description:
        "Containers, orchestration, lifecycle and service-mesh platforms.",
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
      label: "NETWORK",
      title: "Networking",
      mode: "NETWORK / CONNECTIVITY",
      description:
        "Connectivity, segmentation, routing and network infrastructure.",
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
      label: "SECURITY",
      title: "Security",
      mode: "SECURITY / CONTROL",
      description:
        "Traffic control, defensive tooling and secure communication.",
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
      label: "OBSERVE",
      title: "Observability",
      mode: "OBSERVE / VISIBILITY",
      description:
        "Metrics, monitoring and platform visibility.",
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
      label: "AUTOMATION",
      title: "Automation",
      mode: "AUTOMATION / OPERATIONS",
      description:
        "Scripting, configuration and versioned operational workflows.",
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
      label: "DATA + AI",
      title: "Data + AI",
      mode: "DATA / INTELLIGENCE",
      description:
        "Programming, databases, analysis, Big Data and Artificial Intelligence.",
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
      label: "DIGITAL",
      title: "Digital",
      mode: "DIGITAL / WEB + CRM",
      description:
        "Web platforms, CRM systems, content and digital workflows.",
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


  const STACK_V3_DOMAIN_ORDER = [
    "systems",
    "cloud",
    "network",
    "security",
    "observe",
    "automation",
    "data",
    "digital"
  ];


  const STACK_V3_PROOFS = {

    flagship: {
      label:
        "Modern Infrastructure Platform",
      type:
        "FLAGSHIP",
      section:
        "#flagship",
      target:
        ".flagship-v2-shell"
    },

    hotel: {
      label:
        "Hotel Management Platform",
      type:
        "PROJECT",
      section:
        "#projects",
      target:
        '[data-project-system="hotel"]'
    },

    techsolutions: {
      label:
        "TechSolutions IS",
      type:
        "PROJECT",
      section:
        "#projects",
      target:
        '[data-project-system="techsolutions"]'
    },

    lab: {
      label:
        "Technical Lab",
      type:
        "LAB",
      section:
        "#lab",
      target:
        "#technicalLabConsole"
    },

    mission: {
      label:
        "Current Mission",
      type:
        "LEARNING",
      section:
        "#mission",
      target:
        ".mission-layout"
    },

    education: {
      label:
        "AI & Big Data Specialization",
      type:
        "EDUCATION",
      section:
        "#education",
      target:
        "#educationV2System"
    },

    experience: {
      label:
        "Field Experience",
      type:
        "EXPERIENCE",
      section:
        "#experience",
      target:
        ".experience-timeline"
    },

    signal: {
      label:
        "Public Signal",
      type:
        "PUBLIC",
      section:
        "#signal",
      target:
        "#signalV2System"
    }

  };


  const STACK_V3_TECH_META = {

    "Linux": {
      proofs: ["techsolutions", "lab"],
      related: ["Ubuntu", "Windows Server", "Bash", "pfSense"]
    },

    "Ubuntu": {
      proofs: ["lab"],
      related: ["Linux", "Bash", "Docker"]
    },

    "Windows Server": {
      proofs: ["techsolutions"],
      related: ["Active Directory", "DNS", "DHCP", "Linux"]
    },

    "Active Directory": {
      proofs: ["techsolutions"],
      related: ["Windows Server", "DNS", "DHCP"]
    },

    "DNS": {
      proofs: ["techsolutions"],
      related: ["DHCP", "Active Directory", "TCP/IP"]
    },

    "DHCP": {
      proofs: ["techsolutions"],
      related: ["DNS", "Active Directory", "TCP/IP"]
    },

    "Virtualization": {
      proofs: [],
      related: ["Linux", "Windows Server", "Docker"]
    },

    "Docker": {
      proofs: ["flagship", "lab"],
      related: ["Compose", "Swarm", "Kubernetes", "YAML"]
    },

    "Compose": {
      proofs: ["flagship"],
      related: ["Docker", "Swarm", "Kubernetes", "YAML"]
    },

    "Swarm": {
      proofs: ["flagship"],
      related: ["Docker", "Compose", "Kubernetes"]
    },

    "Kubernetes": {
      proofs: ["flagship", "lab"],
      related: ["Docker", "Helm", "Istio", "Prometheus"]
    },

    "Helm": {
      proofs: ["flagship"],
      related: ["Kubernetes", "YAML", "Istio"]
    },

    "Istio": {
      proofs: ["flagship"],
      related: ["Kubernetes", "Kiali", "Prometheus", "Grafana"]
    },

    "TCP/IP": {
      proofs: ["techsolutions", "lab"],
      related: ["Subnetting", "Routing", "VLAN", "pfSense"]
    },

    "Subnetting": {
      proofs: ["techsolutions"],
      related: ["TCP/IP", "VLAN", "Routing"]
    },

    "VLAN": {
      proofs: ["techsolutions"],
      related: ["Subnetting", "Switching", "LAN / DMZ", "pfSense"]
    },

    "Routing": {
      proofs: ["techsolutions", "lab"],
      related: ["TCP/IP", "pfSense", "VLAN"]
    },

    "Switching": {
      proofs: ["techsolutions"],
      related: ["VLAN", "LAN / DMZ", "TCP/IP"]
    },

    "LAN / DMZ": {
      proofs: ["techsolutions"],
      related: ["VLAN", "pfSense", "Firewall"]
    },

    "pfSense": {
      proofs: ["techsolutions", "lab"],
      related: ["Firewall", "LAN / DMZ", "Routing", "VLAN"]
    },

    "Firewall": {
      proofs: ["techsolutions"],
      related: ["pfSense", "iptables", "Suricata", "SSL / TLS"]
    },

    "Suricata": {
      proofs: [],
      related: ["IDS / IPS", "Firewall", "iptables"]
    },

    "IDS / IPS": {
      proofs: [],
      related: ["Suricata", "Firewall", "SNMP"]
    },

    "iptables": {
      proofs: ["lab"],
      related: ["Firewall", "Linux", "Suricata"]
    },

    "SSL / TLS": {
      proofs: [],
      related: ["Firewall", "Nginx", "Security"]
    },

    "Prometheus": {
      proofs: ["flagship", "lab"],
      related: ["Grafana", "Kiali", "Kubernetes", "SNMP"]
    },

    "Grafana": {
      proofs: ["flagship", "lab"],
      related: ["Prometheus", "Kiali", "Zabbix"]
    },

    "Kiali": {
      proofs: ["flagship", "lab"],
      related: ["Istio", "Prometheus", "Grafana"]
    },

    "Zabbix": {
      proofs: ["lab"],
      related: ["SNMP", "Grafana", "Prometheus"]
    },

    "SNMP": {
      proofs: ["lab"],
      related: ["Zabbix", "Prometheus", "Networking"]
    },

    "Bash": {
      proofs: ["lab"],
      related: ["Linux", "Ansible", "Git"]
    },

    "PowerShell": {
      proofs: [],
      related: ["Windows Server", "Active Directory", "Git"]
    },

    "Ansible": {
      proofs: [],
      related: ["Bash", "YAML", "Git"]
    },

    "YAML": {
      proofs: ["flagship"],
      related: ["Kubernetes", "Helm", "Ansible", "Git"]
    },

    "Git": {
      proofs: ["flagship", "signal"],
      related: ["GitHub", "YAML", "Bash"]
    },

    "GitHub": {
      proofs: ["flagship", "signal"],
      related: ["Git", "YAML", "Documentation"]
    },

    "Python": {
      proofs: ["hotel", "mission", "education"],
      related: ["PostgreSQL", "SQL", "Data Analysis", "Artificial Intelligence"]
    },

    "SQL": {
      proofs: ["hotel", "education"],
      related: ["PostgreSQL", "MySQL", "Python", "Data Analysis"]
    },

    "PostgreSQL": {
      proofs: ["hotel"],
      related: ["SQL", "Python", "Data Analysis"]
    },

    "MySQL": {
      proofs: ["flagship"],
      related: ["SQL", "Redis", "Kubernetes"]
    },

    "Redis": {
      proofs: ["flagship"],
      related: ["MySQL", "Kubernetes", "Python"]
    },

    "Big Data": {
      proofs: ["mission", "education"],
      related: ["Python", "Data Analysis", "Artificial Intelligence"]
    },

    "Data Analysis": {
      proofs: ["hotel", "education"],
      related: ["Python", "SQL", "Big Data"]
    },

    "Artificial Intelligence": {
      proofs: ["mission", "education"],
      related: ["Python", "Big Data", "Data Analysis"]
    },

    "WordPress": {
      proofs: ["experience"],
      related: ["Zoho CRM", "HTML", "CSS", "Photoshop"]
    },

    "Zoho CRM": {
      proofs: ["experience"],
      related: ["WordPress", "HTML", "Digital"]
    },

    "Photoshop": {
      proofs: ["experience"],
      related: ["WordPress", "HTML", "CSS"]
    },

    "HTML": {
      proofs: ["experience"],
      related: ["CSS", "WordPress", "Plone CMS"]
    },

    "CSS": {
      proofs: ["experience"],
      related: ["HTML", "WordPress", "Plone CMS"]
    },

    "Plone CMS": {
      proofs: ["experience"],
      related: ["HTML", "CSS", "WordPress"]
    }

  };


  const normalizeStackV3 =
    value =>
      String(value || "")
        .toLowerCase()
        .replaceAll("/", " ")
        .replaceAll("+", " ")
        .replace(/\s+/g, " ")
        .trim();


  const getStackV3TechDomain =
    tech => {

      return STACK_V3_DOMAIN_ORDER
        .find(domain =>
          STACK_V3_DOMAINS[domain]
            .techs
            .includes(tech)
        )
        || null;

    };


  const STACK_V3_TECHS =
    STACK_V3_DOMAIN_ORDER
      .flatMap(domain =>
        STACK_V3_DOMAINS[domain]
          .techs
          .map((name, index) => {

            const meta =
              STACK_V3_TECH_META[name]
              || {
                proofs: [],
                related: []
              };


            return {
              name,
              domain,
              index:
                index + 1,
              proofs:
                meta.proofs || [],
              related:
                meta.related || []
            };

          })
      );


  let stackV3ActiveDomain =
    "all";


  let stackV3SelectedTech =
    null;


  let stackV3ProofHighlightTimer =
    null;


  const getStackV3Query =
    () =>
      normalizeStackV3(
        stackV3Search?.value
      );


  const getFilteredStackV3Techs =
    () => {

      const query =
        getStackV3Query();


      return STACK_V3_TECHS
        .filter(tech => {

          const domainMatch =
            stackV3ActiveDomain
            === "all"
            || tech.domain
               === stackV3ActiveDomain;


          const queryMatch =
            !query
            || normalizeStackV3(
              [
                tech.name,
                STACK_V3_DOMAINS[
                  tech.domain
                ].title,
                STACK_V3_DOMAINS[
                  tech.domain
                ].label
              ].join(" ")
            ).includes(query);


          return domainMatch
            && queryMatch;

        });

    };


  const navigateStackV3Proof =
    proofKey => {

      const proof =
        STACK_V3_PROOFS[
          proofKey
        ];


      if (!proof) {
        return;
      }


      const section =
        $(proof.section);


      const target =
        $(proof.target);


      if (!section) {
        return;
      }


      scrollToTarget(
        section
      );


      if (stackV3ProofHighlightTimer) {

        clearTimeout(
          stackV3ProofHighlightTimer
        );

      }


      window.setTimeout(
        () => {

          if (!target) {
            return;
          }


          $$(".stack-v3-proof-highlight")
            .forEach(element => {

              element.classList.remove(
                "stack-v3-proof-highlight"
              );

            });


          target.classList.add(
            "stack-v3-proof-highlight"
          );


          stackV3ProofHighlightTimer =
            window.setTimeout(
              () => {

                target.classList.remove(
                  "stack-v3-proof-highlight"
                );

              },
              2300
            );

        },
        prefersReducedMotion
          ? 0
          : 520
      );

    };


  const renderStackV3Related =
    tech => {

      if (!stackV3Related) {
        return;
      }


      stackV3Related.replaceChildren();


      const related =
        tech.related
          .filter(name =>
            STACK_V3_TECHS.some(
              item =>
                item.name === name
            )
          )
          .slice(0, 5);


      if (related.length === 0) {

        const fallback =
          document.createElement(
            "span"
          );


        fallback.textContent =
          "Domain relationship";


        stackV3Related.appendChild(
          fallback
        );


        return;

      }


      related.forEach(name => {

        const button =
          document.createElement(
            "button"
          );


        button.type =
          "button";


        button.textContent =
          name;


        button.addEventListener(
          "click",
          () => {

            selectStackV3Tech(
              name,
              true
            );

          }
        );


        stackV3Related.appendChild(
          button
        );

      });

    };


  const renderStackV3Proofs =
    tech => {

      if (!stackV3ProofList) {
        return;
      }


      stackV3ProofList.replaceChildren();


      if (tech.proofs.length === 0) {

        const fallback =
          document.createElement(
            "p"
          );


        fallback.textContent =
          "No dedicated project link is assigned in the current portfolio.";


        stackV3ProofList.appendChild(
          fallback
        );


        return;

      }


      tech.proofs
        .forEach(proofKey => {

          const proof =
            STACK_V3_PROOFS[
              proofKey
            ];


          if (!proof) {
            return;
          }


          const button =
            document.createElement(
              "button"
            );


          button.type =
            "button";


          button.className =
            "stack-v3-proof-button";


          const copy =
            document.createElement(
              "div"
            );


          const type =
            document.createElement(
              "span"
            );


          type.textContent =
            proof.type;


          const label =
            document.createElement(
              "strong"
            );


          label.textContent =
            proof.label;


          copy.append(
            type,
            label
          );


          const arrow =
            document.createElement(
              "i"
            );


          arrow.textContent =
            "→";


          button.append(
            copy,
            arrow
          );


          button.addEventListener(
            "click",
            () => {

              navigateStackV3Proof(
                proofKey
              );

            }
          );


          stackV3ProofList.appendChild(
            button
          );

        });

    };


  const updateStackV3GraphFocus =
    domain => {

      const activeDomain =
        domain || "all";


      stackV3DomainNodes
        .forEach(node => {

          const nodeDomain =
            node.dataset
              .stackV3DomainNode;


          const isCore =
            nodeDomain === "all";


          const active =
            activeDomain === "all"
              ? isCore
              : nodeDomain
                === activeDomain;


          const dimmed =
            activeDomain !== "all"
            && !isCore
            && nodeDomain
               !== activeDomain;


          node.classList.toggle(
            "is-active",
            active
          );


          node.classList.toggle(
            "is-dimmed",
            dimmed
          );

        });


      stackV3Edges
        .forEach(edge => {

          const domains =
            String(
              edge.dataset
                .stackV3Edge
              || ""
            ).split(" ");


          const active =
            activeDomain === "all"
            || domains.includes(
              activeDomain
            );


          edge.classList.toggle(
            "is-active",
            activeDomain !== "all"
            && active
          );


          edge.classList.toggle(
            "is-dimmed",
            activeDomain !== "all"
            && !active
          );

        });

    };


  const updateStackV3DomainUI =
    () => {

      stackV3Filters
        .forEach(button => {

          const active =
            button.dataset
              .stackV3Filter
            === stackV3ActiveDomain;


          button.classList.toggle(
            "is-active",
            active
          );


          button.setAttribute(
            "aria-pressed",
            String(active)
          );

        });


      stackV3Domains
        .forEach(button => {

          const domain =
            button.dataset
              .stackV3Domain;


          const active =
            domain
            === stackV3ActiveDomain;


          button.classList.toggle(
            "is-active",
            active
          );


          button.classList.toggle(
            "is-dimmed",
            stackV3ActiveDomain !== "all"
            && !active
          );

        });


      const domainData =
        STACK_V3_DOMAINS[
          stackV3ActiveDomain
        ];


      if (stackV3DomainState) {

        stackV3DomainState.textContent =
          domainData
            ? domainData.label
            : "ALL_DOMAINS";

      }


      if (stackV3GraphMode) {

        stackV3GraphMode.textContent =
          domainData
            ? domainData.mode
            : "ALL DOMAINS / SYSTEM VIEW";

      }


      updateStackV3GraphFocus(
        stackV3ActiveDomain
      );

    };


  const renderStackV3Registry =
    () => {

      if (!stackV3TechGrid) {
        return;
      }


      const techs =
        getFilteredStackV3Techs();


      stackV3TechGrid.replaceChildren();


      techs.forEach(
        (
          tech,
          visibleIndex
        ) => {

          const button =
            document.createElement(
              "button"
            );


          button.type =
            "button";


          button.className =
            "stack-v3-tech";


          if (
            tech.proofs.length
            > 0
          ) {

            button.classList.add(
              "has-proof"
            );

          }


          if (
            stackV3SelectedTech
            === tech.name
          ) {

            button.classList.add(
              "is-active"
            );

          }


          button.dataset
            .stackV3Tech =
              tech.name;


          const dot =
            document.createElement(
              "i"
            );


          const copy =
            document.createElement(
              "div"
            );


          const title =
            document.createElement(
              "strong"
            );


          title.textContent =
            tech.name;


          const subtitle =
            document.createElement(
              "small"
            );


          subtitle.textContent =
            STACK_V3_DOMAINS[
              tech.domain
            ].label;


          copy.append(
            title,
            subtitle
          );


          const index =
            document.createElement(
              "span"
            );


          index.textContent =
            String(
              visibleIndex + 1
            ).padStart(2, "0");


          button.append(
            dot,
            copy,
            index
          );


          button.addEventListener(
            "click",
            () => {

              selectStackV3Tech(
                tech.name,
                true
              );

            }
          );


          stackV3TechGrid.appendChild(
            button
          );

        });


      if (stackV3ResultCount) {

        stackV3ResultCount.textContent =
          String(
            techs.length
          ).padStart(2, "0");

      }


      if (stackV3RegistryState) {

        const domainLabel =
          stackV3ActiveDomain === "all"
            ? "ALL"
            : STACK_V3_DOMAINS[
                stackV3ActiveDomain
              ].label;


        stackV3RegistryState.textContent =
          `${domainLabel} / ${String(techs.length).padStart(2, "0")} TECHNOLOGIES`;

      }


      if (stackV3Empty) {

        stackV3Empty.hidden =
          techs.length !== 0;

      }

    };


  const selectStackV3Domain =
    (
      domain,
      focusSearch = false
    ) => {

      if (
        domain !== "all"
        && !STACK_V3_DOMAINS[
          domain
        ]
      ) {

        return;

      }


      stackV3ActiveDomain =
        domain;


      updateStackV3DomainUI();


      renderStackV3Registry();


      if (
        focusSearch
        && stackV3Search
      ) {

        stackV3Search.focus();

      }

    };


  function selectStackV3Tech(
    name,
    preserveQuery = false
  ) {

    const tech =
      STACK_V3_TECHS
        .find(item =>
          item.name === name
        );


    if (!tech) {
      return;
    }


    stackV3SelectedTech =
      tech.name;


    if (
      !preserveQuery
      && stackV3Search
    ) {

      stackV3Search.value =
        "";

    }


    stackV3ActiveDomain =
      tech.domain;


    updateStackV3DomainUI();


    renderStackV3Registry();


    const domain =
      STACK_V3_DOMAINS[
        tech.domain
      ];


    if (stackV3FocusTech) {

      stackV3FocusTech.textContent =
        tech.name;

    }


    if (stackV3FocusDomain) {

      stackV3FocusDomain.textContent =
        `${domain.label} / ${tech.proofs.length ? "PORTFOLIO LINKED" : "KNOWLEDGE NODE"}`;

    }


    if (stackV3InspectorCode) {

      stackV3InspectorCode.textContent =
        `${domain.code} / TECH`;

    }


    if (stackV3InspectorStatus) {

      stackV3InspectorStatus.textContent =
        tech.proofs.length
          ? "PROOF LINKED"
          : "KNOWLEDGE";

    }


    if (stackV3InspectorDomain) {

      stackV3InspectorDomain.textContent =
        domain.title;

    }


    if (stackV3InspectorTitle) {

      stackV3InspectorTitle.textContent =
        tech.name;

    }


    if (stackV3InspectorDescription) {

      stackV3InspectorDescription.textContent =
        `${tech.name} is part of the ${domain.title} domain. ${domain.description}`;

    }


    if (stackV3MetricDomain) {

      stackV3MetricDomain.textContent =
        domain.label;

    }


    const validRelations =
      tech.related
        .filter(item =>
          STACK_V3_TECHS
            .some(known =>
              known.name === item
            )
        );


    if (stackV3MetricRelations) {

      stackV3MetricRelations.textContent =
        String(
          validRelations.length
        ).padStart(2, "0");

    }


    if (stackV3MetricProof) {

      stackV3MetricProof.textContent =
        String(
          tech.proofs.length
        ).padStart(2, "0");

    }


    renderStackV3Related(
      tech
    );


    renderStackV3Proofs(
      tech
    );

  }


  const resetStackV3 =
    () => {

      stackV3SelectedTech =
        null;


      stackV3ActiveDomain =
        "all";


      if (stackV3Search) {

        stackV3Search.value =
          "";

      }


      updateStackV3DomainUI();


      renderStackV3Registry();


      if (stackV3FocusTech) {

        stackV3FocusTech.textContent =
          "Select a technology";

      }


      if (stackV3FocusDomain) {

        stackV3FocusDomain.textContent =
          "Search or browse the registry";

      }


      if (stackV3InspectorCode) {

        stackV3InspectorCode.textContent =
          "GRAPH_READY";

      }


      if (stackV3InspectorStatus) {

        stackV3InspectorStatus.textContent =
          "SELECT";

      }


      if (stackV3InspectorDomain) {

        stackV3InspectorDomain.textContent =
          "TECHNICAL UNIVERSE";

      }


      if (stackV3InspectorTitle) {

        stackV3InspectorTitle.textContent =
          "Select a technology.";

      }


      if (stackV3InspectorDescription) {

        stackV3InspectorDescription.textContent =
          "Search the registry or select a domain to inspect technologies, relationships and portfolio evidence.";

      }


      if (stackV3MetricDomain) {

        stackV3MetricDomain.textContent =
          "ALL";

      }


      if (stackV3MetricRelations) {

        stackV3MetricRelations.textContent =
          "--";

      }


      if (stackV3MetricProof) {

        stackV3MetricProof.textContent =
          "--";

      }


      if (stackV3Related) {

        stackV3Related.innerHTML =
          "<span>Select technology</span>";

      }


      if (stackV3ProofList) {

        stackV3ProofList.innerHTML =
          "<p>Proof links appear when a technology is connected to a project or section in this portfolio.</p>";

      }

    };


  stackV3Filters
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          selectStackV3Domain(
            button.dataset
              .stackV3Filter
            || "all"
          );

        }
      );

    });


  stackV3Domains
    .forEach(
      (
        button,
        index
      ) => {

        button.addEventListener(
          "click",
          () => {

            selectStackV3Domain(
              button.dataset
                .stackV3Domain
            );

          }
        );


        button.addEventListener(
          "keydown",
          event => {

            if (
              event.key !== "ArrowDown"
              && event.key !== "ArrowUp"
            ) {

              return;

            }


            event.preventDefault();


            const direction =
              event.key === "ArrowDown"
                ? 1
                : -1;


            const nextIndex =
              (
                index
                + direction
                + stackV3Domains.length
              )
              % stackV3Domains.length;


            stackV3Domains[
              nextIndex
            ].focus();

          }
        );

      }
    );


  stackV3DomainNodes
    .forEach(node => {

      const activate =
        () => {

          selectStackV3Domain(
            node.dataset
              .stackV3DomainNode
            || "all"
          );

        };


      node.addEventListener(
        "click",
        activate
      );


      node.addEventListener(
        "keydown",
        event => {

          if (
            event.key === "Enter"
            || event.key === " "
          ) {

            event.preventDefault();

            activate();

          }

        }
      );

    });


  stackV3Search
    ?.addEventListener(
      "input",
      () => {

        renderStackV3Registry();

      }
    );


  stackV3Clear
    ?.addEventListener(
      "click",
      resetStackV3
    );


  stackV3EmptyReset
    ?.addEventListener(
      "click",
      resetStackV3
    );


  stackV3EvidenceCards
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          navigateStackV3Proof(
            card.dataset
              .stackV3Proof
          );

        }
      );

    });


  document.addEventListener(
    "keydown",
    event => {

      const activeTag =
        document.activeElement
          ?.tagName
          ?.toLowerCase();


      const typing =
        activeTag === "input"
        || activeTag === "textarea"
        || document.activeElement
             ?.isContentEditable;


      if (
        event.key === "/"
        && !typing
        && stackV3Search
        && stackV3System
      ) {

        const rect =
          stackV3System
            .getBoundingClientRect();


        const nearStack =
          rect.bottom > 0
          && rect.top
             < window.innerHeight;


        if (nearStack) {

          event.preventDefault();

          stackV3Search.focus();

        }

      }


      if (
        event.key === "Escape"
        && document.activeElement
           === stackV3Search
      ) {

        resetStackV3();

        stackV3Search.blur();

      }

    }
  );


  if (stackV3System) {

    resetStackV3();

  }


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
  /* 28 / EDUCATION V2 INTERACTION ENGINE                                  */
  /* ====================================================================== */

  const educationV2System =
    $("#educationV2System");

  const educationV2Stages =
    $$(".education-v2-stage");

  const educationV2BankCards =
    $$(".education-v2-bank-card");

  const educationV2StageLabel =
    $("#educationV2StageLabel");

  const educationV2State =
    $("#educationV2State");

  const educationV2Number =
    $("#educationV2Number");

  const educationV2Year =
    $("#educationV2Year");

  const educationV2Title =
    $("#educationV2Title");

  const educationV2Type =
    $("#educationV2Type");

  const educationV2School =
    $("#educationV2School");

  const educationV2Description =
    $("#educationV2Description");

  const educationV2Tags =
    $("#educationV2Tags");

  const educationV2ProgressLabel =
    $("#educationV2ProgressLabel");

  const educationV2ProgressBar =
    $("#educationV2ProgressBar");

  const educationV2ProgressNodes =
    $$(".education-v2-progress-node");

  const educationV2Layers =
    $$(".education-v2-layer");


  const EDUCATION_V2_DATA = {

    smx: {
      index: 1,
      number: "01",
      label: "STAGE_01 / COMPLETE",
      state: "COMPLETE",
      current: false,
      year: "2022 → 2024",
      title:
        "Microcomputer Systems & Networks",
      titleAccent:
        "",
      type:
        "Technician · SMX",
      school:
        "Institut Sa Palomera",
      description:
        "Foundation stage focused on hardware, support, networks and operating systems.",
      tags: [
        "Hardware",
        "Support",
        "Networks",
        "Operating Systems"
      ],
      layers: 2,
      progress: .34
    },

    asir: {
      index: 2,
      number: "02",
      label: "STAGE_02 / COMPLETE",
      state: "COMPLETE",
      current: false,
      year: "2024 → 2026",
      title:
        "Networked Computer Systems Administration",
      titleAccent:
        "",
      type:
        "Higher Technician · ASIR",
      school:
        "Institut Sa Palomera",
      description:
        "Systems and networking stage expanded into infrastructure, cloud-native direction and databases.",
      tags: [
        "Systems",
        "Networking",
        "Cloud Native",
        "Databases"
      ],
      layers: 4,
      progress: .67
    },

    ai: {
      index: 3,
      number: "03",
      label: "STAGE_03 / CURRENT",
      state: "● CURRENT",
      current: true,
      year: "2026 → 2027",
      title:
        "Artificial Intelligence",
      titleAccent:
        "& Big Data",
      type:
        "Specialization Course",
      school:
        "Institut Sa Palomera",
      description:
        "Current specialization layer focused on Python, data, Big Data and Artificial Intelligence.",
      tags: [
        "Python",
        "Data",
        "Big Data",
        "AI"
      ],
      layers: 6,
      progress: 1
    }

  };


  const educationV2Order =
    [
      "smx",
      "asir",
      "ai"
    ];


  let educationV2Active =
    "ai";


  let educationV2CycleTimer =
    null;


  let educationV2Visible =
    false;


  let educationV2CycleIndex =
    2;


  const renderEducationV2Tags =
    tags => {

      if (!educationV2Tags) {
        return;
      }


      educationV2Tags.innerHTML =
        "";


      tags.forEach(tag => {

        const chip =
          document.createElement(
            "span"
          );


        chip.textContent =
          tag;


        educationV2Tags.appendChild(
          chip
        );

      });

    };


  const renderEducationV2Title =
    data => {

      if (!educationV2Title) {
        return;
      }


      educationV2Title.innerHTML =
        "";


      educationV2Title.appendChild(
        document.createTextNode(
          data.title
        )
      );


      if (data.titleAccent) {

        const accent =
          document.createElement(
            "span"
          );


        accent.textContent =
          data.titleAccent;


        educationV2Title.appendChild(
          accent
        );

      }

    };


  const activateEducationV2 =
    (
      key,
      userInitiated = false
    ) => {

      const data =
        EDUCATION_V2_DATA[key];


      if (!data) {
        return;
      }


      educationV2Active =
        key;


      educationV2CycleIndex =
        educationV2Order
          .indexOf(
            key
          );


      educationV2Stages
        .forEach(stage => {

          const active =
            stage.dataset.educationStage
            === key;


          stage.classList.toggle(
            "is-active",
            active
          );


          stage.setAttribute(
            "aria-pressed",
            String(active)
          );

        });


      educationV2BankCards
        .forEach(card => {

          card.classList.toggle(
            "is-active",
            card.dataset.educationBank
            === key
          );

        });


      if (educationV2StageLabel) {
        educationV2StageLabel.textContent =
          data.label;
      }


      if (educationV2State) {

        educationV2State.textContent =
          data.state;


        educationV2State.classList.toggle(
          "is-current",
          data.current
        );

      }


      if (educationV2Number) {
        educationV2Number.textContent =
          data.number;
      }


      if (educationV2Year) {
        educationV2Year.textContent =
          data.year;
      }


      renderEducationV2Title(
        data
      );


      if (educationV2Type) {
        educationV2Type.textContent =
          data.type;
      }


      if (educationV2School) {
        educationV2School.textContent =
          data.school;
      }


      if (educationV2Description) {
        educationV2Description.textContent =
          data.description;
      }


      renderEducationV2Tags(
        data.tags
      );


      if (educationV2ProgressLabel) {

        educationV2ProgressLabel.textContent =
          `${String(data.index).padStart(2, "0")} / 03`;

      }


      if (educationV2ProgressBar) {

        educationV2ProgressBar.style
          .transform =
            `scaleX(${data.progress})`;

      }


      educationV2ProgressNodes
        .forEach(
          (node, index) => {

            node.classList.toggle(
              "is-active",
              index < data.index
            );

          }
        );


      educationV2Layers
        .forEach(layer => {

          const layerIndex =
            Number(
              layer.dataset
                .educationLayer
            );


          layer.classList.toggle(
            "is-active",
            layerIndex
            <= data.layers
          );

        });


      if (userInitiated) {

        stopEducationV2Cycle();

      }

    };


  const stopEducationV2Cycle =
    () => {

      if (
        educationV2CycleTimer
        !== null
      ) {

        clearInterval(
          educationV2CycleTimer
        );


        educationV2CycleTimer =
          null;

      }

    };


  const startEducationV2Cycle =
    () => {

      stopEducationV2Cycle();


      if (
        !educationV2System
        || prefersReducedMotion
        || document.hidden
      ) {

        return;
      }


      educationV2CycleTimer =
        window.setInterval(
          () => {

            educationV2CycleIndex =
              (
                educationV2CycleIndex
                + 1
              )
              % educationV2Order.length;


            activateEducationV2(
              educationV2Order[
                educationV2CycleIndex
              ]
            );

          },
          4200
        );

    };


  educationV2Stages
    .forEach(stage => {

      stage.addEventListener(
        "click",
        () => {

          activateEducationV2(
            stage.dataset.educationStage,
            true
          );

        }
      );

    });


  educationV2BankCards
    .forEach(card => {

      card.addEventListener(
        "click",
        () => {

          activateEducationV2(
            card.dataset.educationBank,
            true
          );

        }
      );

    });


  if (
    educationV2System
    && "IntersectionObserver"
       in window
  ) {

    const educationV2Observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            educationV2Visible =
              entry.isIntersecting;


            if (entry.isIntersecting) {

              startEducationV2Cycle();

            } else {

              stopEducationV2Cycle();

            }

          });

        },
        {
          threshold: .18
        }
      );


    educationV2Observer.observe(
      educationV2System
    );

  } else if (educationV2System) {

    educationV2Visible =
      true;


    startEducationV2Cycle();

  }


  if (educationV2System) {

    activateEducationV2(
      "ai"
    );

  }


  document.addEventListener(
    "visibilitychange",
    () => {

      if (!educationV2System) {
        return;
      }


      if (document.hidden) {

        stopEducationV2Cycle();

        return;

      }


      if (educationV2Visible) {

        startEducationV2Cycle();

      }

    }
  );



  /* ====================================================================== */
  /* 29 / HUMAN V2 INTERACTION ENGINE                                      */
  /* ====================================================================== */

  const humanV2System =
    $("#humanV2System");

  const humanV2ModeButtons =
    $$(".human-v2-mode");

  const humanV2Panels =
    $$(".human-v2-panel");

  const humanV2ModeLabel =
    $("#humanV2ModeLabel");

  const humanV2ModeState =
    $("#humanV2ModeState");

  const humanV2InspectorTitle =
    $("#humanV2InspectorTitle");

  const humanV2CoreValue =
    $("#humanV2CoreValue");

  const humanV2EventLog =
    $("#humanV2EventLog");

  const humanV2WorkflowSteps =
    $$(".human-v2-workflow-step");

  const humanV2WorkflowCommand =
    $("#humanV2WorkflowCommand");

  const humanV2Principles =
    $$(".human-v2-principle");

  const humanV2VectorNodes =
    $$("[data-human-vector]");


  const HUMAN_V2_MODES = {

    communication: {
      label:
        "COMMUNICATION / LANGUAGE_IO",
      inspector:
        "COMMUNICATION",
      core:
        "LANGUAGE",
      state:
        "READY",
      event:
        "communication.layer()"
    },

    principles: {
      label:
        "PRINCIPLES / OPERATING_RULES",
      inspector:
        "PRINCIPLES",
      core:
        "RULESET",
      state:
        "06 LOADED",
      event:
        "principles.load(6)"
    },

    workflow: {
      label:
        "BUILD_LOOP / EXECUTION_CYCLE",
      inspector:
        "BUILD LOOP",
      core:
        "ITERATE",
      state:
        "RUNNING",
      event:
        "workflow.sequence()"
    },

    direction: {
      label:
        "DIRECTION / CURRENT_VECTOR",
      inspector:
        "DIRECTION",
      core:
        "CONNECT",
      state:
        "ACTIVE",
      event:
        "vector.integrate()"
    }

  };


  const humanV2ModeOrder =
    [
      "communication",
      "principles",
      "workflow",
      "direction"
    ];


  const humanV2WorkflowCommands =
    [
      "understand --system",
      "build --solution",
      "test --behaviour",
      "document --signal",
      "iterate --improve"
    ];


  let humanV2ActiveMode =
    "communication";


  let humanV2CycleIndex =
    0;


  let humanV2CycleTimer =
    null;


  let humanV2WorkflowTimer =
    null;


  let humanV2PrincipleTimer =
    null;


  let humanV2VectorTimer =
    null;


  let humanV2Visible =
    false;


  const formatHumanV2Time =
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


  const pushHumanV2Event =
    message => {

      if (!humanV2EventLog) {
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
        formatHumanV2Time();


      line.appendChild(
        time
      );


      line.appendChild(
        document.createTextNode(
          message
        )
      );


      humanV2EventLog.prepend(
        line
      );


      while (
        humanV2EventLog.children.length
        > 5
      ) {

        humanV2EventLog
          .lastElementChild
          ?.remove();

      }

    };


  const stopHumanV2Workflow =
    () => {

      if (
        humanV2WorkflowTimer
        !== null
      ) {

        clearInterval(
          humanV2WorkflowTimer
        );


        humanV2WorkflowTimer =
          null;

      }

    };


  const stopHumanV2Principles =
    () => {

      if (
        humanV2PrincipleTimer
        !== null
      ) {

        clearInterval(
          humanV2PrincipleTimer
        );


        humanV2PrincipleTimer =
          null;

      }

    };


  const stopHumanV2Vector =
    () => {

      if (
        humanV2VectorTimer
        !== null
      ) {

        clearInterval(
          humanV2VectorTimer
        );


        humanV2VectorTimer =
          null;

      }

    };


  const stopHumanV2SubAnimations =
    () => {

      stopHumanV2Workflow();
      stopHumanV2Principles();
      stopHumanV2Vector();


      humanV2WorkflowSteps
        .forEach(step => {

          step.classList.remove(
            "is-active"
          );

        });


      humanV2Principles
        .forEach(principle => {

          principle.classList.remove(
            "is-active"
          );

        });


      humanV2VectorNodes
        .forEach(node => {

          node.classList.remove(
            "is-active"
          );

        });

    };


  const startHumanV2Workflow =
    () => {

      stopHumanV2SubAnimations();


      if (
        humanV2WorkflowSteps.length
        === 0
      ) {

        return;

      }


      let index =
        0;


      const activate =
        () => {

          humanV2WorkflowSteps
            .forEach(
              (step, stepIndex) => {

                step.classList.toggle(
                  "is-active",
                  stepIndex === index
                );

              }
            );


          if (humanV2WorkflowCommand) {

            humanV2WorkflowCommand
              .textContent =
                humanV2WorkflowCommands[index]
                || humanV2WorkflowCommands[0];

          }


          index =
            (
              index + 1
            )
            % humanV2WorkflowSteps.length;

        };


      activate();


      if (
        prefersReducedMotion
        || document.hidden
      ) {

        return;

      }


      humanV2WorkflowTimer =
        window.setInterval(
          activate,
          1250
        );

    };


  const startHumanV2Principles =
    () => {

      stopHumanV2SubAnimations();


      if (
        humanV2Principles.length
        === 0
      ) {

        return;

      }


      let index =
        0;


      const activate =
        () => {

          humanV2Principles
            .forEach(
              (principle, principleIndex) => {

                principle.classList.toggle(
                  "is-active",
                  principleIndex === index
                );

              }
            );


          index =
            (
              index + 1
            )
            % humanV2Principles.length;

        };


      activate();


      if (
        prefersReducedMotion
        || document.hidden
      ) {

        return;

      }


      humanV2PrincipleTimer =
        window.setInterval(
          activate,
          1150
        );

    };


  const startHumanV2Vector =
    () => {

      stopHumanV2SubAnimations();


      if (
        humanV2VectorNodes.length
        === 0
      ) {

        return;

      }


      let index =
        0;


      const activate =
        () => {

          humanV2VectorNodes
            .forEach(
              (node, nodeIndex) => {

                node.classList.toggle(
                  "is-active",
                  nodeIndex === index
                );

              }
            );


          index =
            (
              index + 1
            )
            % humanV2VectorNodes.length;

        };


      activate();


      if (
        prefersReducedMotion
        || document.hidden
      ) {

        return;

      }


      humanV2VectorTimer =
        window.setInterval(
          activate,
          1200
        );

    };


  const setHumanV2Mode =
    (
      mode,
      userInitiated = false
    ) => {

      const config =
        HUMAN_V2_MODES[mode];


      if (!config) {
        return;
      }


      humanV2ActiveMode =
        mode;


      humanV2CycleIndex =
        humanV2ModeOrder
          .indexOf(
            mode
          );


      humanV2ModeButtons
        .forEach(button => {

          const active =
            button.dataset.humanMode
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


      humanV2Panels
        .forEach(panel => {

          const active =
            panel.dataset.humanPanel
            === mode;


          panel.hidden =
            !active;


          panel.classList.toggle(
            "is-active",
            active
          );

        });


      if (humanV2ModeLabel) {

        humanV2ModeLabel.textContent =
          config.label;

      }


      if (humanV2ModeState) {

        humanV2ModeState.textContent =
          config.state;

      }


      if (humanV2InspectorTitle) {

        humanV2InspectorTitle.textContent =
          config.inspector;

      }


      if (humanV2CoreValue) {

        humanV2CoreValue.textContent =
          config.core;

      }


      pushHumanV2Event(
        config.event
      );


      if (mode === "workflow") {

        startHumanV2Workflow();

      } else if (mode === "principles") {

        startHumanV2Principles();

      } else if (mode === "direction") {

        startHumanV2Vector();

      } else {

        stopHumanV2SubAnimations();

      }


      if (userInitiated) {

        stopHumanV2Cycle();

      }

    };


  const stopHumanV2Cycle =
    () => {

      if (
        humanV2CycleTimer
        !== null
      ) {

        clearInterval(
          humanV2CycleTimer
        );


        humanV2CycleTimer =
          null;

      }

    };


  const startHumanV2Cycle =
    () => {

      stopHumanV2Cycle();


      if (
        !humanV2System
        || prefersReducedMotion
        || document.hidden
      ) {

        return;

      }


      humanV2CycleTimer =
        window.setInterval(
          () => {

            humanV2CycleIndex =
              (
                humanV2CycleIndex
                + 1
              )
              % humanV2ModeOrder.length;


            setHumanV2Mode(
              humanV2ModeOrder[
                humanV2CycleIndex
              ]
            );

          },
          5200
        );

    };


  humanV2ModeButtons
    .forEach(button => {

      button.addEventListener(
        "click",
        () => {

          setHumanV2Mode(
            button.dataset.humanMode,
            true
          );

        }
      );

    });


  if (
    humanV2System
    && "IntersectionObserver"
       in window
  ) {

    const humanV2Observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            humanV2Visible =
              entry.isIntersecting;


            if (entry.isIntersecting) {

              pushHumanV2Event(
                "human.viewport.active()"
              );


              startHumanV2Cycle();

            } else {

              stopHumanV2Cycle();
              stopHumanV2SubAnimations();

            }

          });

        },
        {
          threshold: .16
        }
      );


    humanV2Observer.observe(
      humanV2System
    );

  } else if (humanV2System) {

    humanV2Visible =
      true;


    startHumanV2Cycle();

  }


  if (humanV2System) {

    setHumanV2Mode(
      "communication"
    );

  }


  document.addEventListener(
    "visibilitychange",
    () => {

      if (!humanV2System) {
        return;
      }


      if (document.hidden) {

        stopHumanV2Cycle();
        stopHumanV2SubAnimations();

        return;

      }


      if (humanV2Visible) {

        setHumanV2Mode(
          humanV2ActiveMode
        );


        startHumanV2Cycle();

      }

    }
  );



  /* ====================================================================== */
  /* 30 / PUBLIC SIGNAL V2 INTERACTION ENGINE                              */
  /* ====================================================================== */

  const signalV2System =
    $("#signalV2System");

  const signalRepoFeed =
    $("#signalRepoFeed");

  const signalGithubApiState =
    $("#signalGithubApiState");

  const signalGithubEndpointStatus =
    $("#signalGithubEndpointStatus");

  const signalSyncTime =
    $("#signalSyncTime");

  const signalV2EventLog =
    $("#signalV2EventLog");

  const signalV2Endpoints =
    $$("[data-signal-endpoint]");


  const SIGNAL_V2_REPOS_CACHE_KEY =
    "ievgen-github-repos-cache-v2";


  const SIGNAL_V2_EVENTS =
    [
      "github.profile.sync()",
      "repositories.index()",
      "portfolio.route(online)",
      "linkedin.route(external)",
      "cloud_native.signal(active)",
      "data_ai.signal(building)"
    ];


  let signalV2EventIndex =
    0;


  let signalV2EventTimer =
    null;


  let signalV2Visible =
    false;


  const formatSignalV2Time =
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


  const updateSignalV2SyncTime =
    () => {

      if (!signalSyncTime) {
        return;
      }


      signalSyncTime.textContent =
        formatSignalV2Time();

    };


  const pushSignalV2Event =
    message => {

      if (!signalV2EventLog) {
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
        formatSignalV2Time();


      eventLine.appendChild(
        time
      );


      eventLine.appendChild(
        document.createTextNode(
          message
        )
      );


      signalV2EventLog.prepend(
        eventLine
      );


      while (
        signalV2EventLog.children.length
        > 5
      ) {

        signalV2EventLog
          .lastElementChild
          ?.remove();

      }

    };


  const formatSignalV2RelativeDate =
    dateString => {

      const timestamp =
        new Date(
          dateString
        ).getTime();


      if (
        !Number.isFinite(timestamp)
      ) {

        return "updated";

      }


      const difference =
        Date.now()
        - timestamp;


      const minutes =
        Math.max(
          1,
          Math.floor(
            difference
            / 60000
          )
        );


      if (minutes < 60) {

        return `${minutes}m ago`;

      }


      const hours =
        Math.floor(
          minutes / 60
        );


      if (hours < 24) {

        return `${hours}h ago`;

      }


      const days =
        Math.floor(
          hours / 24
        );


      if (days < 30) {

        return `${days}d ago`;

      }


      const months =
        Math.floor(
          days / 30
        );


      return `${months}mo ago`;

    };


  const createSignalV2RepoItem =
    repo => {

      const link =
        document.createElement(
          "a"
        );


      link.className =
        "signal-v2-repo-item";


      link.href =
        repo.html_url
        || `https://github.com/${CONFIG.githubUser}`;


      link.target =
        "_blank";


      link.rel =
        "noopener noreferrer";


      const main =
        document.createElement(
          "div"
        );


      main.className =
        "signal-v2-repo-main";


      const name =
        document.createElement(
          "strong"
        );


      name.textContent =
        repo.name
        || "repository";


      const description =
        document.createElement(
          "span"
        );


      description.textContent =
        repo.description
        || "Public repository";


      main.append(
        name,
        description
      );


      const meta =
        document.createElement(
          "div"
        );


      meta.className =
        "signal-v2-repo-meta";


      const language =
        document.createElement(
          "span"
        );


      language.textContent =
        repo.language
        || "CODE";


      const updated =
        document.createElement(
          "span"
        );


      updated.textContent =
        formatSignalV2RelativeDate(
          repo.updated_at
        );


      const arrow =
        document.createElement(
          "i"
        );


      arrow.textContent =
        "↗";


      meta.append(
        language,
        updated,
        arrow
      );


      link.append(
        main,
        meta
      );


      return link;

    };


  const renderSignalV2Repos =
    repos => {

      if (!signalRepoFeed) {
        return;
      }


      signalRepoFeed.replaceChildren();


      const cleanRepos =
        Array.isArray(repos)
          ? repos
              .filter(repo =>
                repo
                && !repo.fork
              )
              .slice(0, 4)
          : [];


      if (
        cleanRepos.length
        === 0
      ) {

        const fallback =
          document.createElement(
            "div"
          );


        fallback.className =
          "signal-v2-repo-loading";


        fallback.textContent =
          "Public repositories are available on GitHub.";


        signalRepoFeed.appendChild(
          fallback
        );


        return;

      }


      cleanRepos.forEach(repo => {

        signalRepoFeed.appendChild(
          createSignalV2RepoItem(
            repo
          )
        );

      });

    };


  const getCachedSignalV2Repos =
    () => {

      const raw =
        safeStorageGet(
          SIGNAL_V2_REPOS_CACHE_KEY
        );


      if (!raw) {
        return null;
      }


      try {

        const parsed =
          JSON.parse(raw);


        const maxAge =
          CONFIG.githubCacheMinutes
          * 60
          * 1000;


        const fresh =
          Date.now()
          - parsed.timestamp
          < maxAge;


        if (
          !fresh
          || !Array.isArray(
            parsed.data
          )
        ) {

          return null;

        }


        return parsed.data;

      } catch {

        return null;

      }

    };


  const cacheSignalV2Repos =
    repos => {

      safeStorageSet(
        SIGNAL_V2_REPOS_CACHE_KEY,
        JSON.stringify(
          {
            timestamp:
              Date.now(),

            data:
              repos
          }
        )
      );

    };


  const setSignalV2GithubState =
    (
      label,
      online
    ) => {

      if (signalGithubApiState) {

        signalGithubApiState.textContent =
          label;


        signalGithubApiState
          .parentElement
          ?.classList
          .toggle(
            "is-online",
            online
          );

      }


      if (signalGithubEndpointStatus) {

        signalGithubEndpointStatus
          .textContent =
            online
              ? "CONNECTED"
              : "DEGRADED";

      }

    };


  const loadSignalV2Repos =
    async () => {

      if (!signalRepoFeed) {
        return;
      }


      const cached =
        getCachedSignalV2Repos();


      if (cached) {

        renderSignalV2Repos(
          cached
        );


        setSignalV2GithubState(
          "CACHE READY",
          true
        );


        updateSignalV2SyncTime();


        pushSignalV2Event(
          "github.cache.restore()"
        );


        return;

      }


      try {

        setSignalV2GithubState(
          "SYNCING",
          false
        );


        const response =
          await fetch(
            `https://api.github.com/users/${CONFIG.githubUser}/repos?sort=updated&direction=desc&per_page=8&type=owner`,
            {
              headers: {
                Accept:
                  "application/vnd.github+json"
              }
            }
          );


        if (!response.ok) {

          throw new Error(
            `GitHub repos API ${response.status}`
          );

        }


        const repos =
          await response.json();


        cacheSignalV2Repos(
          repos
        );


        renderSignalV2Repos(
          repos
        );


        setSignalV2GithubState(
          "LIVE",
          true
        );


        updateSignalV2SyncTime();


        pushSignalV2Event(
          "repositories.sync(ok)"
        );


      } catch (error) {

        console.warn(
          "Public Signal GitHub feed unavailable:",
          error
        );


        renderSignalV2Repos(
          []
        );


        setSignalV2GithubState(
          "API LIMITED",
          false
        );


        updateSignalV2SyncTime();


        pushSignalV2Event(
          "github.api.fallback()"
        );

      }

    };


  const stopSignalV2EventStream =
    () => {

      if (
        signalV2EventTimer
        !== null
      ) {

        clearInterval(
          signalV2EventTimer
        );


        signalV2EventTimer =
          null;

      }

    };


  const startSignalV2EventStream =
    () => {

      stopSignalV2EventStream();


      if (
        !signalV2System
        || prefersReducedMotion
        || document.hidden
      ) {

        return;

      }


      signalV2EventTimer =
        window.setInterval(
          () => {

            const message =
              SIGNAL_V2_EVENTS[
                signalV2EventIndex
                % SIGNAL_V2_EVENTS.length
              ];


            signalV2EventIndex += 1;


            pushSignalV2Event(
              message
            );

          },
          2400
        );

    };


  signalV2Endpoints
    .forEach(endpoint => {

      endpoint.addEventListener(
        "pointerenter",
        () => {

          const name =
            endpoint.dataset
              .signalEndpoint
            || "endpoint";


          pushSignalV2Event(
            `route.inspect(${name})`
          );

        }
      );

    });


  if (
    signalV2System
    && "IntersectionObserver"
       in window
  ) {

    const signalV2Observer =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            signalV2Visible =
              entry.isIntersecting;


            signalV2System
              .classList
              .toggle(
                "is-active",
                entry.isIntersecting
              );


            if (entry.isIntersecting) {

              pushSignalV2Event(
                "public.viewport.active()"
              );


              startSignalV2EventStream();

            } else {

              stopSignalV2EventStream();

            }

          });

        },
        {
          threshold: .16
        }
      );


    signalV2Observer.observe(
      signalV2System
    );

  } else if (signalV2System) {

    signalV2Visible =
      true;


    signalV2System
      .classList
      .add(
        "is-active"
      );


    startSignalV2EventStream();

  }


  if (signalV2System) {

    loadSignalV2Repos();

  }


  document.addEventListener(
    "visibilitychange",
    () => {

      if (!signalV2System) {
        return;
      }


      if (document.hidden) {

        stopSignalV2EventStream();

        return;

      }


      if (signalV2Visible) {

        startSignalV2EventStream();

      }

    }
  );



  /* ====================================================================== */
  /* 31 / CONNECTION V2 INTERACTION ENGINE                                 */
  /* ====================================================================== */

  const connectionV2System =
    $("#connectionV2System");

  const connectionRouteNodes =
    $$("[data-connection-route]");

  const connectionRouteTitle =
    $("#connectionRouteTitle");

  const connectionRouteEndpoint =
    $("#connectionRouteEndpoint");

  const connectionRouteType =
    $("#connectionRouteType");

  const connectionRouteState =
    $("#connectionRouteState");

  const connectionCommandState =
    $("#connectionCommandState");

  const connectionV2EventLog =
    $("#connectionV2EventLog");

  const connectionSessionTime =
    $("#connectionSessionTime");

  const copyPortfolioUrl =
    $("#copyPortfolioUrl");

  const copyPortfolioLabel =
    $("#copyPortfolioLabel");


  let connectionRouteIndex =
    0;


  let connectionCycleTimer =
    null;


  let connectionVisible =
    false;


  let connectionManualLock =
    false;


  let connectionCopyResetTimer =
    null;


  const CONNECTION_ROUTES =
    connectionRouteNodes.map(
      node => ({

        node,

        name:
          node.dataset
            .connectionRoute,

        label:
          node.dataset
            .routeLabel,

        type:
          node.dataset
            .routeType,

        state:
          node.dataset
            .routeState

      })
    );


  const formatConnectionTime =
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


  const updateConnectionTime =
    () => {

      if (!connectionSessionTime) {
        return;
      }


      connectionSessionTime.textContent =
        formatConnectionTime();

    };


  const pushConnectionEvent =
    message => {

      if (!connectionV2EventLog) {
        return;
      }


      const eventLine =
        document.createElement(
          "p"
        );


      const label =
        document.createElement(
          "span"
        );


      label.textContent =
        "[ route  ]";


      eventLine.appendChild(
        label
      );


      eventLine.appendChild(
        document.createTextNode(
          message
        )
      );


      connectionV2EventLog.prepend(
        eventLine
      );


      while (
        connectionV2EventLog
          .children
          .length
        > 4
      ) {

        connectionV2EventLog
          .lastElementChild
          ?.remove();

      }

    };


  const setConnectionRoute =
    (
      routeIndex,
      options = {}
    ) => {

      if (
        CONNECTION_ROUTES.length
        === 0
      ) {

        return;

      }


      connectionRouteIndex =
        (
          routeIndex
          + CONNECTION_ROUTES.length
        )
        % CONNECTION_ROUTES.length;


      const route =
        CONNECTION_ROUTES[
          connectionRouteIndex
        ];


      connectionRouteNodes
        .forEach(node => {

          node.classList.toggle(
            "is-active",
            node === route.node
          );

        });


      const router =
        $(".contact-v2-router");


      router
        ?.classList
        .add(
          "has-route-focus"
        );


      if (connectionV2System) {

        connectionV2System
          .classList
          .remove(
            "route-linkedin-active",
            "route-github-active",
            "route-portfolio-active"
          );


        connectionV2System
          .classList
          .add(
            `route-${route.name}-active`
          );

      }


      if (connectionRouteTitle) {

        connectionRouteTitle
          .textContent =
            route.label;

      }


      if (connectionRouteEndpoint) {

        connectionRouteEndpoint
          .textContent =
            route.label;

      }


      if (connectionRouteType) {

        connectionRouteType
          .textContent =
            route.type;

      }


      if (connectionRouteState) {

        connectionRouteState
          .textContent =
            route.state;

      }


      if (connectionCommandState) {

        connectionCommandState
          .textContent =
            `route --${route.name}`;

      }


      if (!options.silent) {

        pushConnectionEvent(
          `route.select(${route.name})`
        );

      }

    };


  const stopConnectionCycle =
    () => {

      if (
        connectionCycleTimer
        !== null
      ) {

        clearInterval(
          connectionCycleTimer
        );


        connectionCycleTimer =
          null;

      }

    };


  const startConnectionCycle =
    () => {

      stopConnectionCycle();


      if (
        !connectionV2System
        || prefersReducedMotion
        || document.hidden
        || connectionManualLock
      ) {

        return;

      }


      connectionCycleTimer =
        window.setInterval(
          () => {

            setConnectionRoute(
              connectionRouteIndex + 1,
              {
                silent: true
              }
            );

          },
          2900
        );

    };


  connectionRouteNodes
    .forEach(
      (
        node,
        index
      ) => {

        node.addEventListener(
          "pointerenter",
          () => {

            setConnectionRoute(
              index,
              {
                silent: true
              }
            );

          }
        );


        node.addEventListener(
          "focus",
          () => {

            setConnectionRoute(
              index,
              {
                silent: true
              }
            );

          }
        );


        node.addEventListener(
          "click",
          () => {

            connectionManualLock =
              true;


            setConnectionRoute(
              index
            );


            stopConnectionCycle();

        }
      );

    });


  const copyConnectionValue =
    async () => {

      if (!copyPortfolioUrl) {
        return;
      }


      const value =
        copyPortfolioUrl.dataset
          .copyValue;


      if (!value) {
        return;
      }


      let copied =
        false;


      try {

        if (
          navigator.clipboard
          && window.isSecureContext
        ) {

          await navigator.clipboard
            .writeText(
              value
            );


          copied =
            true;

        }

      } catch {

        copied =
          false;

      }


      if (!copied) {

        const temporary =
          document.createElement(
            "textarea"
          );


        temporary.value =
          value;


        temporary.setAttribute(
          "readonly",
          ""
        );


        temporary.style.position =
          "fixed";


        temporary.style.opacity =
          "0";


        document.body.appendChild(
          temporary
        );


        temporary.select();


        try {

          copied =
            document.execCommand(
              "copy"
            );

        } catch {

          copied =
            false;

        }


        temporary.remove();

      }


      if (connectionCopyResetTimer) {

        clearTimeout(
          connectionCopyResetTimer
        );

      }


      copyPortfolioUrl.classList
        .toggle(
          "is-copied",
          copied
        );


      if (copyPortfolioLabel) {

        copyPortfolioLabel
          .textContent =
            copied
              ? "Copied ✓"
              : "Copy unavailable";

      }


      pushConnectionEvent(
        copied
          ? "portfolio.url.copy(ok)"
          : "portfolio.url.copy(failed)"
      );


      connectionCopyResetTimer =
        window.setTimeout(
          () => {

            copyPortfolioUrl
              .classList
              .remove(
                "is-copied"
              );


            if (copyPortfolioLabel) {

              copyPortfolioLabel
                .textContent =
                  "Copy portfolio URL";

            }

          },
          1800
        );

    };


  copyPortfolioUrl
    ?.addEventListener(
      "click",
      copyConnectionValue
    );


  $$("[data-connection-action]")
    .forEach(link => {

      link.addEventListener(
        "click",
        () => {

          const action =
            link.dataset
              .connectionAction
            || "external";


          pushConnectionEvent(
            `handoff.open(${action})`
          );

        }
      );

    });


  if (
    connectionV2System
    && "IntersectionObserver"
       in window
  ) {

    const connectionObserver =
      new IntersectionObserver(
        entries => {

          entries.forEach(entry => {

            connectionVisible =
              entry.isIntersecting;


            connectionV2System
              .classList
              .toggle(
                "is-active",
                entry.isIntersecting
              );


            if (entry.isIntersecting) {

              updateConnectionTime();


              setConnectionRoute(
                connectionRouteIndex,
                {
                  silent: true
                }
              );


              startConnectionCycle();


              pushConnectionEvent(
                "handoff.system.ready()"
              );

            } else {

              stopConnectionCycle();

            }

          });

        },
        {
          threshold: .14
        }
      );


    connectionObserver.observe(
      connectionV2System
    );

  } else if (connectionV2System) {

    connectionVisible =
      true;


    connectionV2System
      .classList
      .add(
        "is-active"
      );


    updateConnectionTime();


    setConnectionRoute(
      0,
      {
        silent: true
      }
    );


    startConnectionCycle();

  }


  document.addEventListener(
    "visibilitychange",
    () => {

      if (!connectionV2System) {
        return;
      }


      if (document.hidden) {

        stopConnectionCycle();

        return;

      }


      if (
        connectionVisible
        && !connectionManualLock
      ) {

        startConnectionCycle();

      }

    }
  );


  /* ====================================================================== */
  /* 32 / SYSTEM READY                                                       */
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
