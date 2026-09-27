/* Header layer tabs + slide pager for the brand deck.
   Tabs are real links. Close does not follow the link.
   Arrow keys move between tabs. Left/Right outside the strip walk slides. */
(function () {
  var slides = [
    "01-cover.html",
    "02-manifesto.html",
    "03-logo-spectrum.html",
    "04-color.html",
    "05-type.html",
    "06-nitrous-rule.html",
    "07-components.html",
    "08-surfaces.html",
    "09-dos-donts.html",
    "10-moodboard.html",
    "11-closing.html"
  ];

  var nav = document.querySelector(".cf-layers");
  if (!nav) return;

  var tabs = Array.prototype.slice.call(nav.querySelectorAll(".cf-layer"));
  var name = (location.pathname.split("/").pop() || "").split("?")[0];
  var here = slides.indexOf(name);

  function activate(index) {
    tabs.forEach(function (tab, i) {
      var on = i === index;
      tab.classList.toggle("active", on);
      var link = tab.querySelector("a");
      if (link) link.setAttribute("aria-current", on ? "page" : "false");
    });
  }

  if (name === "clippyflow-brand-clippydeck.html") {
    activate(tabs.findIndex(function (tab) {
      return tab.getAttribute("data-layer") === "deck";
    }));
  } else if (here >= 0) {
    activate(0);
    var flow = nav.querySelector('[data-layer="flow"] a');
    if (flow) flow.setAttribute("href", name);
  }

  tabs.forEach(function (tab) {
    var close = tab.querySelector(".x");
    if (!close) return;
    close.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var wasActive = tab.classList.contains("active");
      var next = tab.nextElementSibling;
      while (next && !next.classList.contains("cf-layer")) next = next.nextElementSibling;
      var prev = tab.previousElementSibling;
      while (prev && !prev.classList.contains("cf-layer")) prev = prev.previousElementSibling;
      tab.remove();
      tabs = Array.prototype.slice.call(nav.querySelectorAll(".cf-layer"));
      if (wasActive && tabs.length) {
        var go = next && next.classList.contains("cf-layer") ? next : prev;
        var link = go && go.querySelector("a");
        if (link) location.href = link.href;
      }
    });
  });

  nav.addEventListener("keydown", function (event) {
    var current = document.activeElement && document.activeElement.closest(".cf-layer");
    if (!current) return;
    var index = tabs.indexOf(current);
    if (index < 0) return;
    var nextIndex = null;
    if (event.key === "ArrowRight") nextIndex = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") nextIndex = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === null) return;
    event.preventDefault();
    var link = tabs[nextIndex].querySelector("a");
    if (link) link.focus();
  });

  if (here < 0) return;
  var meta = document.querySelector(".cf-win-meta");
  var count = meta && meta.querySelector("span");
  if (!count) return;
  function pager(href, label, glyph) {
    var a = document.createElement("a");
    a.className = "cf-pager";
    a.href = href;
    a.setAttribute("aria-label", label);
    a.textContent = glyph;
    return a;
  }
  count.before(pager(slides[(here + slides.length - 1) % slides.length], "Previous slide", "\u2039"));
  count.after(pager(slides[(here + 1) % slides.length], "Next slide", "\u203A"));

  document.addEventListener("keydown", function (event) {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.target && event.target.closest && event.target.closest(".cf-layers, input, textarea")) return;
    if (event.key === "ArrowRight") location.href = slides[(here + 1) % slides.length];
    else if (event.key === "ArrowLeft") location.href = slides[(here + slides.length - 1) % slides.length];
  });
})();
