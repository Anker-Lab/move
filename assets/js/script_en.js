document.addEventListener("DOMContentLoaded", () => {

  /* =========================
     COOKIE BANNER
  ========================= */
  function initCookies() {
    const banner = document.getElementById("cookie-banner");
    const acceptBtn = document.getElementById("accept-cookies");

    if (!banner || !acceptBtn) return;

    if (localStorage.getItem("cookies-accepted") === "true") {
      banner.style.display = "none";
      return;
    }

    acceptBtn.addEventListener("click", () => {
      localStorage.setItem("cookies-accepted", "true");
      banner.style.display = "none";
    });
  }


  /* =========================
     LINKS DATABASE
  ========================= */
  const LINKS = {
    signup: "https://move.nemtilmeld.dk/4/",
    volunteer: "href=mailto:kp@kirkeibyen.dk,azc@kirkeibyen.dk,iin@kirkeibyen.dk",
    testimony: "https://kirkeibyen.churchcenter.com/people/forms/1239355",
    newsletter: "https://mailchi.mp/kirkeibyen/signup-nyhedsmail",
    facebook: "https://fb.me/e/71n4ZH25t",
    instagram: "https://www.instagram.com/kirkeibyen_kolding"
  };

  function applyDataLinks(root = document) {
    root.querySelectorAll("[data-link]").forEach(el => {
      const key = el.dataset.link;
      if (LINKS[key]) el.href = LINKS[key];
    });
  }


  /* =========================
     HEADER LOGIC
  ========================= */

  function initHeader() {

    const header = document.querySelector("header");
    const burger = document.getElementById("burger");
    const menu = document.getElementById("mobileMenu");
    const logo = document.getElementById("header-logo");
    const lang = document.querySelector(".lang");
    const cta = document.querySelector(".js-tilmeld");

    if (!header || !burger || !menu || !logo) return;

    function updateLogo() {
      const scrolled = window.scrollY > 50;
      const open = header.classList.contains("menu-open");

      logo.src = (scrolled || open)
        ? "/assets/logo/move/move_en.svg"
        : "/assets/logo/move/move_w_en.svg";
    }

    function updateCTAButton() {
      if (!cta) return;

      const scrolled = header.classList.contains("scrolled");
      const open = header.classList.contains("menu-open");

      if (!scrolled && !open) {
        cta.classList.remove("btn-black");
        cta.classList.add("btn-secondary");
      } else {
        cta.classList.remove("btn-secondary");
        cta.classList.add("btn-black");
      }
    }

    window.addEventListener("scroll", () => {
      header.classList.toggle("scrolled", window.scrollY > 50);
      updateLogo();
      updateCTAButton();
    });

    updateLogo();
    updateCTAButton();

    burger.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");

      header.classList.toggle("menu-open", isOpen);
      burger.textContent = isOpen ? "✕" : "☰";
      document.body.style.overflow = isOpen ? "hidden" : "";

      lang?.classList.remove("open");

      updateLogo();
      updateCTAButton();
    });

    menu.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => {
        menu.classList.remove("open");
        header.classList.remove("menu-open");
        burger.textContent = "☰";
        document.body.style.overflow = "";

        updateLogo();
        updateCTAButton();
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        menu.classList.remove("open");
        header.classList.remove("menu-open");
        burger.textContent = "☰";
        document.body.style.overflow = "";

        updateLogo();
        updateCTAButton();
      }
    });

    if (lang) {
      lang.addEventListener("click", (e) => {
        e.stopPropagation();

        const isOpen = lang.classList.contains("open");

        menu.classList.remove("open");
        header.classList.remove("menu-open");
        burger.textContent = "☰";
        document.body.style.overflow = "";

        lang.classList.toggle("open", !isOpen);

        updateLogo();
        updateCTAButton();
      });
    }
  }


  /* =========================
     HEADER + FOOTER LOADER
  ========================= */

  const headerPlaceholder = document.getElementById("header");
  const footerPlaceholder = document.getElementById("footer");

  if (headerPlaceholder) {
    fetch("/assets/header-footer/header_en.html")
      .then(res => res.text())
      .then(html => {
        headerPlaceholder.innerHTML = html;

        initHeader();
        applyDataLinks(headerPlaceholder);
      });
  }

  if (footerPlaceholder) {
    fetch("/assets/header-footer/footer_en.html")
      .then(res => res.text())
      .then(html => {
        footerPlaceholder.innerHTML = html;

        applyDataLinks(footerPlaceholder);
      });
  }


  /* =========================
     INIT
  ========================= */

  applyDataLinks();
  initCookies();

});


/* =========================
   LANGUAGE SWITCH
========================= */

function switchToEnglish() {
  const path = window.location.pathname;
  if (path.startsWith("/en/")) return;
  window.location.href = "/en" + path;
}

function switchToDanish() {
  const path = window.location.pathname;
  window.location.href = path.replace(/^\/en/, "");
}

/* =========================
   VIDEO AUDIO TOGGLE
========================= */

const video = document.querySelector(".hero-video");
const muteToggle = document.getElementById("muteToggle");

if (video && muteToggle) {

  // =========================
  // INIT STATE
  // =========================
  let isMuted = true;

  video.muted = true;
  video.volume = 0;

  // =========================
  // AUTOPLAY SAFETY
  // =========================
  const tryPlay = () => {
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {

        const startOnInteract = () => {
          video.play().catch(() => {});
          document.removeEventListener("click", startOnInteract);
        };

        document.addEventListener("click", startOnInteract);
      });
    }
  };

  tryPlay();

  // =========================
  // UI UPDATE
  // =========================
  function updateIcon() {
    muteToggle.textContent = isMuted ? "🔇" : "🔊";
  }

  updateIcon();

  // =========================
  // TOGGLE AUDIO
  // =========================
  muteToggle.addEventListener("click", () => {

    isMuted = !isMuted;

    video.muted = isMuted;
    video.volume = isMuted ? 0 : 0.6;

    updateIcon();
  });

  // =========================
  // SAFETY
  // =========================
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !isMuted) {
      video.play().catch(() => {});
    }
  });

}


// --------------------------------------------------
// SCROLL-PROGRESS
// --------------------------------------------------
const scrollTopButton = document.getElementById("scrollTop");
const scrollProgress = document.querySelector(".scroll-progress");

const circleLength = 283;


// --------------------------------------------------
// SCROLL-PROGRESS
// --------------------------------------------------

function updateScrollProgress() {

    const scrollTop = window.scrollY;

    const documentHeight =
        document.documentElement.scrollHeight - window.innerHeight;

    const progress =
        documentHeight > 0
            ? scrollTop / documentHeight
            : 0;


    // Vis knappen når vi ikke længere er øverst
    if (scrollTop > 150) {

        scrollTopButton.classList.add("visible");

    } else {

        scrollTopButton.classList.remove("visible");

    }


    // Opdater ringen
    const offset =
        circleLength - (progress * circleLength);

    scrollProgress.style.strokeDashoffset = offset;
}


// --------------------------------------------------
// SCROLL
// --------------------------------------------------

window.addEventListener("scroll", updateScrollProgress);


// --------------------------------------------------
// TIL TOPPEN
// --------------------------------------------------

scrollTopButton.addEventListener("click", () => {

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

});


// Kør én gang ved start
updateScrollProgress();