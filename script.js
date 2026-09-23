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

  }  /* ====================================================================== */
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
  );  /* ====================================================================== */
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

    };  /* ====================================================================== */
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

    };  const updateFlagshipModeUI =
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

    };  const startHotelProjectCycle =
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
  /* 26 / SYSTEM READY                                                       */
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
