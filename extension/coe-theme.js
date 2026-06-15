/* clippyslide-coe theme module -- hostConfig + post-render DOM decorator.
   Shared verbatim between the verification harness and index.html. */
(function (global) {
  "use strict";

  var COE_FG = {
    default:   { default: "#FFFFFF", subtle: "rgba(255,255,255,0.62)" },
    accent:    { default: "#39B0FF", subtle: "#818EFF" },
    good:      { default: "#22C24E", subtle: "#A9D63B" },
    warning:   { default: "#E8932F", subtle: "#E7D63B" },
    attention: { default: "#F77181", subtle: "#CA5BCD" },
    light:     { default: "#FFFFFF", subtle: "#CFE8F7" },
    dark:      { default: "#07070C", subtle: "#14161D" }
  };
  function style(bg) { return { backgroundColor: bg, foregroundColors: COE_FG }; }

  var COE_HOST_CONFIG = {
    fontFamily: "'Segoe UI Variable','Segoe UI',system-ui,-apple-system,sans-serif",
    fontSizes:   { small: 13, default: 16, medium: 18, large: 24, extraLarge: 34 },
    fontWeights: { lighter: 300, default: 400, bolder: 700 },
    containerStyles: {
      default:   style("#00000000"),
      emphasis:  style("#00000000"),
      accent:    style("#00000000"),
      good:      style("#00000000"),
      warning:   style("#00000000"),
      attention: style("#00000000")
    },
    spacing:   { small: 4, default: 8, medium: 14, large: 22, extraLarge: 34, padding: 18 },
    separator: { lineThickness: 1, lineColor: "rgba(129,142,255,0.30)" },
    actions:   {
      maxActions: 10, buttonSpacing: 8,
      showCard: { actionMode: "inline", inlineTopMargin: 8 },
      actionsOrientation: "horizontal", actionAlignment: "left"
    },
    adaptiveCard: { allowCustomStyle: true }
  };

  /* Copy every AC element whose id is "coe-<role>" to data-coe-role="<role>".
     A trailing "--N" disambiguator (for duplicate roles) is stripped. */
  function decorateCoe(root) {
    if (!root) return;
    var nodes = root.querySelectorAll('[id^="coe-"]');
    var list = Array.prototype.slice.call(nodes);
    if (root.id && root.id.indexOf("coe-") === 0) list.unshift(root);
    list.forEach(function (el) {
      var role = el.id.replace(/^coe-/, "").replace(/--\d+$/, "");
      el.setAttribute("data-coe-role", role);
    });
  }

  global.CLIPPYSLIDE_COE = { hostConfig: COE_HOST_CONFIG, decorate: decorateCoe };
})(typeof window !== "undefined" ? window : this);
