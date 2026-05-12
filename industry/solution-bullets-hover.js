(function () {
  var ul = document.querySelector(".solution-article__bullets");
  if (!ul) return;

  var HOVER = "solution-article__bullet--hover";
  var LIST_HOVER = "solution-article__bullets--hovering";

  function pickBullet(clientY) {
    var items = ul.querySelectorAll(".solution-article__bullet");
    if (!items.length) return null;

    var best = null;
    var bestDist = Infinity;
    var bestIndex = Infinity;

    items.forEach(function (li, i) {
      var r = li.getBoundingClientRect();
      var d = 0;
      if (clientY < r.top) d = r.top - clientY;
      else if (clientY > r.bottom) d = clientY - r.bottom;
      else d = 0;

      if (d < bestDist || (d === bestDist && i < bestIndex)) {
        bestDist = d;
        bestIndex = i;
        best = li;
      }
    });

    return best;
  }

  function applyHover(clientY) {
    var chosen = pickBullet(clientY);
    if (!chosen) return;

    var items = ul.querySelectorAll(".solution-article__bullet");
    items.forEach(function (li) {
      li.classList.toggle(HOVER, li === chosen);
    });
    ul.classList.add(LIST_HOVER);
  }

  function clearHover() {
    ul.querySelectorAll(".solution-article__bullet--hover").forEach(function (li) {
      li.classList.remove(HOVER);
    });
    ul.classList.remove(LIST_HOVER);
  }

  ul.addEventListener(
    "mousemove",
    function (e) {
      applyHover(e.clientY);
    },
    { passive: true }
  );

  ul.addEventListener("mouseleave", clearHover);
})();
