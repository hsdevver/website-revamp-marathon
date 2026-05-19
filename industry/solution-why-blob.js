(function () {
  var col = document.querySelector(".solution-why__cards-col");
  if (!col) return;

  var blob = col.querySelector(".solution-why__blob");
  var cardsStack = col.querySelector(".solution-why__cards");
  var cards = col.querySelectorAll(".solution-why__card");
  if (!blob || !cardsStack || !cards.length) return;

  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function offsetToTarget(targetEl) {
    var colRect = col.getBoundingClientRect();
    var targetRect = targetEl.getBoundingClientRect();
    var colCenterX = colRect.width / 2;
    var colCenterY = colRect.height / 2;
    var targetCenterX = targetRect.left + targetRect.width / 2 - colRect.left;
    var targetCenterY = targetRect.top + targetRect.height / 2 - colRect.top;
    return {
      x: targetCenterX - colCenterX,
      y: targetCenterY - colCenterY,
    };
  }

  function applyBlob(card, index) {
    var target = card || cardsStack;
    var offset = offsetToTarget(target);

    col.style.setProperty("--blob-offset-x", offset.x.toFixed(1) + "px");
    col.style.setProperty("--blob-offset-y", offset.y.toFixed(1) + "px");

    if (card && index >= 0) {
      col.classList.add("is-blob-active");
      col.dataset.activeIndex = String(index);
    } else {
      col.classList.remove("is-blob-active");
      delete col.dataset.activeIndex;
    }
  }

  function resetBlob() {
    applyBlob(null, -1);
  }

  applyBlob(null, -1);

  if (reduced) return;

  cards.forEach(function (card, index) {
    card.addEventListener("mouseenter", function () {
      applyBlob(card, index);
    });
    card.addEventListener("focusin", function () {
      applyBlob(card, index);
    });
  });

  col.addEventListener("mouseleave", resetBlob);
  col.addEventListener(
    "focusout",
    function (e) {
      if (!col.contains(e.relatedTarget)) resetBlob();
    },
    true
  );
  window.addEventListener("resize", resetBlob);
})();
