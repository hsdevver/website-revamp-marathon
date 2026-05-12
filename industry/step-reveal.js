(function () {
  var root = document.querySelector("section.panel.panel--bottom.how");
  var steps = root ? root.querySelectorAll("article.step") : document.querySelectorAll(".how article.step");
  if (!steps.length) return;

  function revealStep(step) {
    step.classList.add("step--visible");
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    steps.forEach(revealStep);
    return;
  }

  function viewportMidY() {
    return (window.innerHeight || document.documentElement.clientHeight) * 0.5;
  }

  /** Activate when the step’s top edge reaches or passes the viewport vertical midpoint (top 50%). */
  function shouldRevealAtTop50(step) {
    if (step.classList.contains("step--visible")) return false;
    var r = step.getBoundingClientRect();
    var mid = viewportMidY();
    return r.top <= mid && r.bottom > 0;
  }

  function syncSteps() {
    steps.forEach(function (step) {
      if (shouldRevealAtTop50(step)) revealStep(step);
    });
  }

  var ticking = false;
  function onScrollOrResize() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      syncSteps();
    });
  }

  window.addEventListener("scroll", onScrollOrResize, { passive: true });
  window.addEventListener("resize", onScrollOrResize, { passive: true });

  window.addEventListener(
    "load",
    function () {
      syncSteps();
    },
    { passive: true }
  );

  requestAnimationFrame(function () {
    requestAnimationFrame(syncSteps);
  });
})();
