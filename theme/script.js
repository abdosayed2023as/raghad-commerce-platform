/**
 * Raghad theme — CustomEvent helpers, gallery, description accordion.
 * No fake-visitor / fake-stock / fake-counter animations (brand rule).
 */
(function () {
  "use strict";

  function dispatchEo(name, detail, target) {
    var el = target || document;
    el.dispatchEvent(
      new CustomEvent(name, {
        bubbles: true,
        detail: detail || {},
      })
    );
  }

  window.rgDispatch = dispatchEo;

  function isVideoUrl(url) {
    if (!url) return false;
    var u = String(url).toLowerCase();
    return u.indexOf(".mp4") !== -1 || u.indexOf(".webm") !== -1 || u.indexOf(".mov") !== -1;
  }

  function setMainMedia(root, src, productName) {
    var main = root.querySelector("[data-gallery-main]");
    if (!main || !src) return;
    main.innerHTML = "";
    if (isVideoUrl(src)) {
      var video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.playsInline = true;
      video.setAttribute("playsinline", "");
      video.muted = true;
      video.autoplay = true;
      video.preload = "metadata";
      video.setAttribute("aria-label", productName || "Product video");
      main.appendChild(video);
    } else {
      var img = document.createElement("img");
      img.src = src;
      img.alt = productName || "";
      img.id = "gallery-main-image";
      main.appendChild(img);
    }
  }

  function initGallery(root) {
    if (!root || root.dataset.galleryInit) return;
    root.dataset.galleryInit = "1";

    var productName = root.getAttribute("data-product-name") || "";
    var thumbs = root.querySelectorAll("[data-gallery-thumb]");
    var dots = root.querySelectorAll("[data-gallery-dot]");
    var sources = [];

    thumbs.forEach(function (btn) {
      var src = btn.getAttribute("data-src");
      if (src) sources.push(src);
    });

    function selectIndex(index) {
      if (!sources.length) return;
      var i = ((index % sources.length) + sources.length) % sources.length;
      setMainMedia(root, sources[i], productName);
      thumbs.forEach(function (btn, idx) {
        btn.setAttribute("aria-selected", idx === i ? "true" : "false");
      });
      dots.forEach(function (dot, idx) {
        if (idx === i) dot.setAttribute("aria-current", "true");
        else dot.removeAttribute("aria-current");
      });
      root.dataset.activeIndex = String(i);
    }

    root.addEventListener("click", function (event) {
      var thumb = event.target.closest("[data-gallery-thumb]");
      if (thumb && root.contains(thumb)) {
        var idx = Array.prototype.indexOf.call(thumbs, thumb);
        if (idx >= 0) selectIndex(idx);
        return;
      }
      var dot = event.target.closest("[data-gallery-dot]");
      if (dot && root.contains(dot)) {
        var dIdx = Array.prototype.indexOf.call(dots, dot);
        if (dIdx >= 0) selectIndex(dIdx);
        return;
      }
      var prev = event.target.closest("[data-gallery-prev]");
      if (prev && root.contains(prev)) {
        selectIndex((parseInt(root.dataset.activeIndex || "0", 10) || 0) - 1);
        return;
      }
      var next = event.target.closest("[data-gallery-next]");
      if (next && root.contains(next)) {
        selectIndex((parseInt(root.dataset.activeIndex || "0", 10) || 0) + 1);
      }
    });

    var startX = 0;
    var mainEl = root.querySelector("[data-gallery-main]");
    if (mainEl) {
      mainEl.addEventListener(
        "touchstart",
        function (e) {
          if (!e.changedTouches || !e.changedTouches[0]) return;
          startX = e.changedTouches[0].clientX;
        },
        { passive: true }
      );
      mainEl.addEventListener(
        "touchend",
        function (e) {
          if (!e.changedTouches || !e.changedTouches[0]) return;
          var dx = e.changedTouches[0].clientX - startX;
          if (Math.abs(dx) < 40) return;
          var cur = parseInt(root.dataset.activeIndex || "0", 10) || 0;
          /* RTL: swipe right (positive dx) → previous in visual LTR terms; keep simple index */
          if (dx < 0) selectIndex(cur + 1);
          else selectIndex(cur - 1);
        },
        { passive: true }
      );
    }

    var initial = 0;
    thumbs.forEach(function (btn, idx) {
      if (btn.getAttribute("aria-selected") === "true") initial = idx;
    });
    if (sources.length) selectIndex(initial);
  }

  function initDescriptionAccordion() {
    var accordions = document.querySelectorAll(".rg-desc");
    for (var i = 0; i < accordions.length; i++) {
      var accordion = accordions[i];
      if (accordion.dataset.descInit) continue;
      accordion.dataset.descInit = "1";
      accordion.addEventListener("click", function (event) {
        var toggle = event.target.closest(".rg-desc__toggle");
        if (!toggle) return;
        var item = toggle.closest(".rg-desc__item");
        if (!item) return;
        var isOpen = item.getAttribute("data-open") === "true";
        if (isOpen) {
          item.removeAttribute("data-open");
          toggle.setAttribute("aria-expanded", "false");
        } else {
          item.setAttribute("data-open", "true");
          toggle.setAttribute("aria-expanded", "true");
        }
      });
    }
  }

  function initMobileNav() {
    var openBtn = document.getElementById("rg-menu-btn");
    var panel = document.getElementById("rg-mobile-menu");
    var overlay = document.getElementById("rg-mobile-overlay");
    var closeBtn = document.getElementById("rg-mobile-close");
    if (!openBtn || !panel || openBtn.dataset.menuInit) return;
    openBtn.dataset.menuInit = "1";

    function close() {
      panel.hidden = true;
      if (overlay) overlay.hidden = true;
      document.body.style.overflow = "";
    }

    function open() {
      panel.hidden = false;
      if (overlay) overlay.hidden = false;
      document.body.style.overflow = "hidden";
    }

    openBtn.addEventListener("click", open);
    if (closeBtn) closeBtn.addEventListener("click", close);
    if (overlay) overlay.addEventListener("click", close);
  }

  function boot() {
    document.querySelectorAll("[data-rg-gallery]").forEach(initGallery);
    initDescriptionAccordion();
    initMobileNav();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  new MutationObserver(boot).observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
})();
