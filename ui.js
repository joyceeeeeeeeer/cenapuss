(function () {
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function normalizePath(p) {
    if (!p || p === "/") return "/index.html";
    if (p.endsWith("/")) return p + "index.html";
    return p;
  }

  var here = normalizePath(window.location.pathname);

  document.querySelectorAll(".nav-links a").forEach(function (a) {
    try {
      var p = normalizePath(new URL(a.href, window.location.origin).pathname);
      if (p === here) {
        a.setAttribute("aria-current", "page");
      }
    } catch (e) {}
  });

  if (reduce) {
    document.querySelectorAll(".reveal").forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }

  var obs = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: "0px 0px -32px 0px", threshold: 0.06 }
  );

  document.querySelectorAll(".reveal").forEach(function (el) {
    obs.observe(el);
  });
})();
