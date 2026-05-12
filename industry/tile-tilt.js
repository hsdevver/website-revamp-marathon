(function () {
  document.querySelectorAll(".tile.tile--rotate-amplitude").forEach(function (tile) {
    var max = Number(tile.getAttribute("data-rotate-amplitude")) || 4;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    tile.addEventListener(
      "pointermove",
      function (e) {
        var r = tile.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        tile.style.transform =
          "perspective(900px) rotateY(" + (-x * max).toFixed(2) + "deg) rotateX(" + (y * max).toFixed(2) + "deg)";
      },
      { passive: true }
    );

    tile.addEventListener("pointerleave", function () {
      tile.style.transform = "";
    });
  });
})();
