(function () {
  document.documentElement.classList.add("platform-reveal-ready");

  var blocks = document.querySelectorAll(".platform-articles .solution-article__inner");
  if (!blocks.length) return;

  function reveal(block) {
    block.classList.add("solution-article__inner--visible");
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    blocks.forEach(reveal);
    return;
  }

  function viewportRevealY() {
    return (window.innerHeight || document.documentElement.clientHeight) * 0.65;
  }

  function shouldReveal(block) {
    if (block.classList.contains("solution-article__inner--visible")) return false;
    var r = block.getBoundingClientRect();
    var y = viewportRevealY();
    return r.top <= y && r.bottom > 0;
  }

  function syncBlocks() {
    blocks.forEach(function (block) {
      if (shouldReveal(block)) reveal(block);
    });
  }

  var ticking = false;
  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      syncBlocks();
    });
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });

  window.addEventListener(
    "load",
    function () {
      syncBlocks();
    },
    { passive: true }
  );

  requestAnimationFrame(function () {
    requestAnimationFrame(syncBlocks);
  });
})();
