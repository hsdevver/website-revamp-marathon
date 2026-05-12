(function () {
  var viewport = document.getElementById("editorial-viewport");
  var track = document.getElementById("editorial-track");
  var prev = document.getElementById("editorial-prev");
  var next = document.getElementById("editorial-next");
  var fill = document.getElementById("editorial-line-fill");
  var section = document.querySelector(".editorial-spotlight");
  if (!viewport || !track || !prev || !next) return;

  var cards = viewport.querySelectorAll(".editorial-card");
  var n = cards.length;

  /** Minimum time each card stays visible before auto-advance (ms). */
  var AUTO_ADVANCE_MS = 7000;
  /** Hover duration before auto-advance pauses (ms). */
  var HOVER_PAUSE_AFTER_MS = 3000;

  var pausedByLongHover = false;
  var hoverPauseTimer = null;
  /** After arrow click: no auto-advance until `.editorial-spotlight` leaves the viewport. */
  var stoppedByArrowUntilSectionLeave = false;

  var activeIndex = 0;
  var heightSyncTimer = null;

  /** Visible slice of the next card on the right (Figma editorial peek); 0 when not applicable. */
  var EDITORIAL_PEEK_PX = 56;
  var EDITORIAL_CARD_MIN_W = 260;

  function clampIndex(i) {
    if (n <= 0) return 0;
    return Math.max(0, Math.min(n - 1, i));
  }

  function gapPx() {
    var g = window.getComputedStyle(track).gap;
    if (g && g.endsWith("px")) return parseFloat(g);
    return 33;
  }

  /** Card width: leave next card + gap peeking on the right (no left peek when at index 0). */
  function syncCardMetrics() {
    var V = viewport.clientWidth;
    var stage = viewport.closest(".editorial-spotlight__stage");
    var target = stage || viewport;
    if (n <= 1) {
      var wSingle = Math.min(827, V);
      target.style.setProperty("--editorial-card-w", wSingle + "px");
      return;
    }
    var g = gapPx();
    var w = Math.min(827, Math.max(EDITORIAL_CARD_MIN_W, V - g - EDITORIAL_PEEK_PX));
    target.style.setProperty("--editorial-card-w", w + "px");
  }

  /** Tallest card’s natural shell height → shared min-height on all shells (Figma-aligned strip). */
  function syncCardHeights() {
    if (!cards.length) return;
    var shells = [];
    for (var i = 0; i < cards.length; i++) {
      var shell = cards[i].querySelector(".editorial-card__shell");
      if (shell) {
        shell.style.minHeight = "";
        shells.push(shell);
      }
    }
    if (!shells.length) return;

    var prevAlign = track.style.alignItems;
    track.style.alignItems = "flex-start";
    void track.offsetHeight;

    var maxH = 0;
    for (var j = 0; j < shells.length; j++) {
      var h = shells[j].getBoundingClientRect().height;
      if (h > maxH) maxH = h;
    }

    track.style.alignItems = prevAlign || "";
    var px = Math.ceil(maxH);
    for (var k = 0; k < shells.length; k++) {
      shells[k].style.minHeight = px + "px";
    }
  }

  function scheduleHeightSync() {
    if (heightSyncTimer) clearTimeout(heightSyncTimer);
    heightSyncTimer = setTimeout(function () {
      heightSyncTimer = null;
      syncCardMetrics();
      syncCardHeights();
      applySlide();
    }, 80);
  }

  function stepWidth() {
    syncCardMetrics();
    if (!cards.length) return viewport.clientWidth + gapPx();
    return cards[0].offsetWidth + gapPx();
  }

  function syncChrome(idx) {
    idx = clampIndex(idx);
    if (fill) {
      if (n <= 1) {
        fill.style.width = "100%";
        fill.style.left = "0%";
      } else {
        var seg = 100 / n;
        fill.style.width = seg + "%";
        fill.style.left = idx * seg + "%";
      }
    }
  }

  function syncNavDisabled() {
    var single = n <= 1;
    var atStart = activeIndex <= 0;
    var atEnd = activeIndex >= n - 1;
    prev.disabled = single || atStart;
    next.disabled = single || atEnd;
    prev.setAttribute("aria-disabled", prev.disabled ? "true" : "false");
    next.setAttribute("aria-disabled", next.disabled ? "true" : "false");
  }

  function applySlide() {
    var step = stepWidth();
    var x = -activeIndex * step;
    track.style.transform = "translate3d(" + x + "px,0,0)";
    syncChrome(activeIndex);
    syncNavDisabled();
  }

  function setActiveIndex(idx) {
    activeIndex = clampIndex(idx);
    cards.forEach(function (card, i) {
      card.setAttribute("aria-hidden", i === activeIndex ? "false" : "true");
    });
    applySlide();
  }

  function canAutoAdvance() {
    if (n <= 1) return false;
    if (document.hidden) return false;
    if (stoppedByArrowUntilSectionLeave) return false;
    if (pausedByLongHover) return false;
    return true;
  }

  function advanceNext() {
    if (n <= 1) return;
    setActiveIndex(activeIndex >= n - 1 ? 0 : activeIndex + 1);
  }

  function onArrowInteract() {
    stoppedByArrowUntilSectionLeave = true;
  }

  prev.addEventListener("click", function () {
    if (prev.disabled || activeIndex <= 0) return;
    onArrowInteract();
    setActiveIndex(activeIndex - 1);
  });

  next.addEventListener("click", function () {
    if (next.disabled || activeIndex >= n - 1) return;
    onArrowInteract();
    setActiveIndex(activeIndex + 1);
  });

  window.addEventListener(
    "resize",
    function () {
      scheduleHeightSync();
    },
    { passive: true }
  );

  if (document.readyState === "complete") {
    scheduleHeightSync();
  } else {
    window.addEventListener("load", scheduleHeightSync);
  }

  cards.forEach(function (card) {
    card.addEventListener("mouseenter", function () {
      clearTimeout(hoverPauseTimer);
      hoverPauseTimer = setTimeout(function () {
        pausedByLongHover = true;
      }, HOVER_PAUSE_AFTER_MS);
    });
    card.addEventListener("mouseleave", function () {
      clearTimeout(hoverPauseTimer);
      hoverPauseTimer = null;
      pausedByLongHover = false;
    });
  });

  if (section && typeof IntersectionObserver !== "undefined") {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (e) {
          if (!e.isIntersecting) {
            stoppedByArrowUntilSectionLeave = false;
            pausedByLongHover = false;
            clearTimeout(hoverPauseTimer);
            hoverPauseTimer = null;
          }
        });
      },
      { threshold: 0 }
    );
    io.observe(section);
  }

  var reduceMotion =
    window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  cards.forEach(function (card, i) {
    if (card.classList.contains("is-active")) activeIndex = i;
    card.classList.remove("is-active");
  });
  setActiveIndex(activeIndex);

  requestAnimationFrame(function () {
    requestAnimationFrame(function () {
      syncCardHeights();
      applySlide();
    });
  });

  if (!reduceMotion) {
    setInterval(function () {
      if (!canAutoAdvance()) return;
      advanceNext();
    }, AUTO_ADVANCE_MS);
  }
})();
