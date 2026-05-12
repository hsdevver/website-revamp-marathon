(function () {
  var DURATION_MS = 520;
  var EASE = "cubic-bezier(0.18, 0.88, 0.24, 1)";

  function finishOpen(panel) {
    panel.style.overflow = "";
    panel.style.transition = "";
    panel.style.maxHeight = "none";
  }

  function finishClose(panel) {
    panel.hidden = true;
    panel.style.overflow = "";
    panel.style.transition = "";
    panel.style.maxHeight = "";
  }

  document.querySelectorAll(".faq-item__trigger").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var expanded = btn.getAttribute("aria-expanded") === "true";
      var next = !expanded;
      var panelId = btn.getAttribute("aria-controls");
      var panel = panelId ? document.getElementById(panelId) : null;
      var item = btn.closest(".faq-item");
      if (!panel || !item) return;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        btn.setAttribute("aria-expanded", next ? "true" : "false");
        item.classList.toggle("faq-item--open", next);
        panel.hidden = !next;
        if (next) {
          panel.style.maxHeight = "";
          panel.style.overflow = "";
          panel.style.transition = "";
        }
        return;
      }

      if (next) {
        btn.setAttribute("aria-expanded", "true");
        item.classList.add("faq-item--open");
        panel.hidden = false;
        panel.style.overflow = "hidden";
        panel.style.maxHeight = "0";
        panel.style.transition = "none";
        void panel.offsetHeight;
        panel.style.transition = "max-height " + DURATION_MS + "ms " + EASE;
        panel.style.maxHeight = panel.scrollHeight + "px";

        function onEnd(ev) {
          if (ev.target !== panel || ev.propertyName !== "max-height") return;
          finishOpen(panel);
        }
        panel.addEventListener("transitionend", onEnd, { once: true });
      } else {
        btn.setAttribute("aria-expanded", "false");
        item.classList.remove("faq-item--open");
        var h = panel.offsetHeight;
        panel.style.overflow = "hidden";
        panel.style.transition = "none";
        panel.style.maxHeight = h + "px";
        void panel.offsetHeight;
        panel.style.transition = "max-height " + DURATION_MS + "ms " + EASE;
        requestAnimationFrame(function () {
          panel.style.maxHeight = "0";
        });

        function onEndClose(ev) {
          if (ev.target !== panel || ev.propertyName !== "max-height") return;
          finishClose(panel);
        }
        panel.addEventListener("transitionend", onEndClose, { once: true });
      }
    });
  });
})();
