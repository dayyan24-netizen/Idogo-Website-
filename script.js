/* ============================================================
   IDOGO — Language, Education, and Colonial Legacy
   script.js — Shared JavaScript for all pages
   W3Schools-compatible: var, for loops, no arrow functions,
   no template literals, no const/let, no classList.toggle
   ============================================================ */


/* ── 1. FLOATING BANNER ───────────────────────────────────── */
/*
   The banner sits at the top of the page.
   When dismissed, the nav adjusts back to top: 0.
   The dismissed state is saved in sessionStorage so it
   stays closed if the user navigates between pages.
*/

function initBanner() {
  var banner = document.getElementById("floating-banner");
  var closeBtn = document.getElementById("banner-close");

  if (!banner) { return; }

  /* Check if already dismissed this session */
  var dismissed = sessionStorage.getItem("idogo-banner-dismissed");
  if (dismissed === "true") {
    banner.style.display = "none";
    return;
  }

  /* Show banner and shift nav down */
  banner.style.display = "block";
  document.body.className = document.body.className + " banner-visible";

  if (closeBtn) {
    closeBtn.onclick = function() {
      banner.style.display = "none";
      sessionStorage.setItem("idogo-banner-dismissed", "true");

      /* Remove banner-visible class from body */
      var classes = document.body.className.split(" ");
      var newClasses = [];
      for (var i = 0; i < classes.length; i++) {
        if (classes[i] !== "banner-visible") {
          newClasses.push(classes[i]);
        }
      }
      document.body.className = newClasses.join(" ");
    };
  }
}


/* ── 2. MOBILE NAV TOGGLE ─────────────────────────────────── */
/*
   Toggles the mobile nav drawer open/closed.
   Also animates the hamburger icon into an X.
*/

function initMobileNav() {
  var toggle = document.getElementById("nav-toggle");
  var mobileNav = document.getElementById("nav-mobile");

  if (!toggle || !mobileNav) { return; }

  toggle.onclick = function() {
    var isOpen = mobileNav.className.indexOf("open") !== -1;

    if (isOpen) {
      /* Close */
      mobileNav.className = mobileNav.className.replace(" open", "").replace("open", "");
      toggle.setAttribute("aria-expanded", "false");
    } else {
      /* Open */
      mobileNav.className = mobileNav.className + " open";
      toggle.setAttribute("aria-expanded", "true");
    }
  };

  /* Close mobile nav if a link inside it is clicked */
  var mobileLinks = mobileNav.getElementsByTagName("a");
  for (var i = 0; i < mobileLinks.length; i++) {
    mobileLinks[i].onclick = function() {
      mobileNav.className = mobileNav.className.replace(" open", "").replace("open", "");
      toggle.setAttribute("aria-expanded", "false");
    };
  }
}


/* ── 3. ACTIVE NAV LINK ───────────────────────────────────── */
/*
   Compares the current page filename to each nav link's href
   and adds the "active" class to the matching link.
   Works for both desktop and mobile nav.
*/

function initActiveNav() {
  var path = window.location.pathname;

  /* Get current filename e.g. "about.html" or "" for index */
  var parts = path.split("/");
  var currentPage = parts[parts.length - 1];

  /* Treat empty string or "/" as index.html */
  if (currentPage === "" || currentPage === "/") {
    currentPage = "index.html";
  }

  var allNavLinks = document.getElementsByTagName("a");

  for (var i = 0; i < allNavLinks.length; i++) {
    var link = allNavLinks[i];
    var href = link.getAttribute("href");

    if (!href) { continue; }

    /* Get just the filename from the href */
    var hrefParts = href.split("/");
    var hrefFile = hrefParts[hrefParts.length - 1];

    if (hrefFile === "" || hrefFile === "/") {
      hrefFile = "index.html";
    }

    if (hrefFile === currentPage) {
      /* Only mark active if it is inside a nav element */
      var parent = link.parentNode;
      var inNav = false;
      while (parent) {
        if (parent.id === "nav-links" || parent.id === "nav-mobile") {
          inNav = true;
          break;
        }
        parent = parent.parentNode;
      }
      if (inNav) {
        var existing = link.className;
        if (existing.indexOf("active") === -1) {
          link.className = existing + " active";
        }
      }
    }
  }
}


/* ── 4. FAQ / ACCORDION ───────────────────────────────────── */
/*
   Generic accordion for any FAQ or expandable section.
   Add class "accordion-trigger" to the button/heading,
   and "accordion-body" to the content div beneath it.
   Wrap each pair in a div with class "accordion-item".
*/

function initAccordion() {
  var triggers = getElementsByClassName(document, "accordion-trigger");

  for (var i = 0; i < triggers.length; i++) {
    triggers[i].onclick = function() {
      var item = this.parentNode;
      var body = getElementsByClassName(item, "accordion-body")[0];

      if (!body) { return; }

      var isOpen = body.style.display === "block";

      /* Close all other accordion items first */
      var allBodies = getElementsByClassName(document, "accordion-body");
      var allTriggers = getElementsByClassName(document, "accordion-trigger");

      for (var j = 0; j < allBodies.length; j++) {
        allBodies[j].style.display = "none";
      }
      for (var k = 0; k < allTriggers.length; k++) {
        allTriggers[k].setAttribute("aria-expanded", "false");
        var indicator = getElementsByClassName(allTriggers[k], "accordion-indicator")[0];
        if (indicator) { indicator.innerHTML = "+"; }
      }

      /* Toggle the clicked one */
      if (!isOpen) {
        body.style.display = "block";
        this.setAttribute("aria-expanded", "true");
        var myIndicator = getElementsByClassName(this, "accordion-indicator")[0];
        if (myIndicator) { myIndicator.innerHTML = "&#8722;"; }
      }
    };
  }
}


/* ── 5. SIMPLE TAB SWITCHER ───────────────────────────────── */
/*
   Used on the Library page to switch between
   video categories, resources, and reflections.
   Add class "tab-btn" to each tab button with
   data-tab="panel-id", and class "tab-panel" to
   each content panel with id matching data-tab.
*/

function initTabs() {
  var tabBtns = getElementsByClassName(document, "tab-btn");

  if (tabBtns.length === 0) { return; }

  for (var i = 0; i < tabBtns.length; i++) {
    tabBtns[i].onclick = function() {
      var targetId = this.getAttribute("data-tab");

      /* Deactivate all tab buttons */
      for (var j = 0; j < tabBtns.length; j++) {
        tabBtns[j].className = tabBtns[j].className.replace(" active", "").replace("active", "");
      }

      /* Hide all panels */
      var allPanels = getElementsByClassName(document, "tab-panel");
      for (var k = 0; k < allPanels.length; k++) {
        allPanels[k].style.display = "none";
      }

      /* Activate clicked tab */
      var currentClass = this.className;
      if (currentClass.indexOf("active") === -1) {
        this.className = currentClass + " active";
      }

      /* Show target panel */
      var target = document.getElementById(targetId);
      if (target) {
        target.style.display = "block";
      }
    };
  }

  /* Activate the first tab by default */
  if (tabBtns[0]) {
    tabBtns[0].onclick.call(tabBtns[0]);
  }
}


/* ── 6. CONTACT FORM HANDLER ──────────────────────────────── */
/*
   Intercepts the contact form submit, shows a success
   message, and resets the form. No real backend needed
   for version 1 — the professor can add one later.
*/

function initContactForm() {
  var form = document.getElementById("contact-form");
  var successMsg = document.getElementById("form-success");

  if (!form) { return; }

  form.onsubmit = function(e) {
    e.preventDefault();

    /* Basic validation */
    var name = document.getElementById("field-name");
    var email = document.getElementById("field-email");
    var message = document.getElementById("field-message");

    if (name && name.value.trim() === "") {
      alert("Please enter your name.");
      name.focus();
      return false;
    }

    if (email && email.value.trim() === "") {
      alert("Please enter your email address.");
      email.focus();
      return false;
    }

    if (message && message.value.trim() === "") {
      alert("Please enter a message.");
      message.focus();
      return false;
    }

    /* Show success message */
    form.style.display = "none";
    if (successMsg) {
      successMsg.style.display = "block";
    }

    return false;
  };
}


/* ── 7. SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────── */
/*
   Adds smooth scrolling to any link that points to
   an anchor on the same page (href starts with "#").
   Falls back gracefully if the target does not exist.
*/

function initSmoothScroll() {
  var links = document.getElementsByTagName("a");

  for (var i = 0; i < links.length; i++) {
    var href = links[i].getAttribute("href");
    if (href && href.charAt(0) === "#" && href.length > 1) {
      links[i].onclick = function(e) {
        var targetId = this.getAttribute("href").substring(1);
        var target = document.getElementById(targetId);
        if (target) {
          e.preventDefault();
          var offset = 80;
          var top = target.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top: top, behavior: "smooth" });
        }
      };
    }
  }
}


/* ── 8. UTILITY: getElementsByClassName POLYFILL ─────────── */
/*
   W3Schools sandbox sometimes runs in old IE-like mode.
   This safe wrapper ensures getElementsByClassName works
   on both the document and on individual elements.
*/

function getElementsByClassName(parent, className) {
  if (parent.getElementsByClassName) {
    return parent.getElementsByClassName(className);
  }
  /* Fallback for very old environments */
  var all = parent.getElementsByTagName("*");
  var results = [];
  for (var i = 0; i < all.length; i++) {
    var classes = all[i].className.split(" ");
    for (var j = 0; j < classes.length; j++) {
      if (classes[j] === className) {
        results.push(all[i]);
        break;
      }
    }
  }
  return results;
}


/* ── 9. SCROLL-BASED NAV SHADOW ──────────────────────────── */
/*
   Adds a slightly deeper shadow to the nav
   once the user scrolls past 10px.
*/

function initNavScroll() {
  var nav = document.getElementById("site-nav");
  if (!nav) { return; }

  window.onscroll = function() {
    if (window.pageYOffset > 10) {
      nav.style.boxShadow = "0 4px 20px rgba(47, 36, 29, 0.15)";
    } else {
      nav.style.boxShadow = "0 2px 12px rgba(47, 36, 29, 0.10)";
    }
  };
}


/* ── INIT ALL ON PAGE LOAD ────────────────────────────────── */

window.onload = function() {
  initBanner();
  initMobileNav();
  initActiveNav();
  initAccordion();
  initTabs();
  initContactForm();
  initSmoothScroll();
  initNavScroll();
};
