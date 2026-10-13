/* Asane Solutions — site behavior
   Mobile menu, current-section highlighting in the rail, and scroll reveal.
   Everything here is progressive enhancement: the page works without it. */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Mobile menu ------------------------------------------------------ */
  var rail = document.querySelector("[data-rail]");
  var toggle = document.querySelector("[data-nav-toggle]");

  function setMenu(open) {
    rail.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.querySelector(".rail__toggle-label").textContent = open ? "Close" : "Menu";
    document.body.style.overflow = open ? "hidden" : "";
  }

  if (rail && toggle) {
    toggle.addEventListener("click", function () {
      setMenu(!rail.classList.contains("is-open"));
    });

    // Close after choosing a destination, on Escape, or when resizing up to the desktop rail.
    rail.querySelectorAll(".rail__nav a").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && rail.classList.contains("is-open")) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia("(min-width: 1081px)").addEventListener("change", function (e) {
      if (e.matches) setMenu(false);
    });
  }

  /* ---- Current section in the rail -------------------------------------- */
  var links = document.querySelectorAll("[data-nav-link]");
  var linkFor = {};
  links.forEach(function (link) { linkFor[link.hash.slice(1)] = link; });

  if ("IntersectionObserver" in window) {
    // A section is "current" when it crosses the middle band of the viewport.
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.removeAttribute("aria-current"); });
        var active = linkFor[entry.target.id];
        if (active) active.setAttribute("aria-current", "location");
      });
    }, { rootMargin: "-45% 0px -50% 0px" });

    Object.keys(linkFor).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ---- Scroll reveal ---------------------------------------------------- */
  var revealTargets = document.querySelectorAll(
    ".track__head, .cap, .profile__card, .profile__matrix, .section-head, .flow__step, .terms, .contact__info, .form"
  );

  if (!reduceMotion && "IntersectionObserver" in window) {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px" });

    revealTargets.forEach(function (el) {
      el.classList.add("reveal");
      revealer.observe(el);
    });
  }

  /* ---- Footer year ------------------------------------------------------ */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
