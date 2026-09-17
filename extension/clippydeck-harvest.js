/* ClippyDeck Harvest runtime: deterministic Adaptive Card content binding and privacy audit. */
(function (root, factory) {
  var api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.ClippyDeckHarvest = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  var BINDING = /\$\{([A-Za-z0-9_.-]+)\}/g;

  function clone(value) {
    if (value === undefined) return undefined;
    return JSON.parse(JSON.stringify(value));
  }

  var BLOCKED_KEYS = { "__proto__": true, "prototype": true, "constructor": true };

  function pathKeys(path) {
    var keys = path.split(".");
    keys.forEach(function (key) {
      if (!key || BLOCKED_KEYS[key]) throw new Error("Unsafe binding path: " + path);
    });
    return keys;
  }

  function getPath(value, path) {
    return pathKeys(path).reduce(function (current, key) {
      return current !== undefined && current !== null && Object.prototype.hasOwnProperty.call(current, key)
        ? current[key]
        : undefined;
    }, value);
  }

  function setPath(value, path, replacement) {
    var keys = pathKeys(path);
    var current = value;
    for (var i = 0; i < keys.length - 1; i += 1) {
      if (!Object.prototype.hasOwnProperty.call(current, keys[i]) || !current[keys[i]] || typeof current[keys[i]] !== "object") {
        current[keys[i]] = {};
      }
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = replacement;
  }

  function resolveString(text, context, strict) {
    var exact = /^\$\{([A-Za-z0-9_.-]+)\}$/.exec(text);
    if (exact) {
      var exactValue = getPath(context, exact[1]);
      if (exactValue === undefined && strict) throw new Error("Missing binding: " + exact[1]);
      return exactValue === undefined ? text : clone(exactValue);
    }
    return text.replace(BINDING, function (match, path) {
      var value = getPath(context, path);
      if (value === undefined && strict) throw new Error("Missing binding: " + path);
      return value === undefined ? match : String(value);
    });
  }

  function walk(value, visitor, path) {
    path = path || "$";
    if (Array.isArray(value)) return value.map(function (item, index) {
      return walk(item, visitor, path + "[" + index + "]");
    });
    if (value && typeof value === "object") {
      var output = {};
      Object.keys(value).forEach(function (key) {
        output[key] = walk(value[key], visitor, path + "." + key);
      });
      return output;
    }
    return visitor(value, path);
  }

  function resolve(template, contentProfile, options) {
    var context = contentProfile && contentProfile.content ? contentProfile : { content: contentProfile || {} };
    var strict = !options || options.strict !== false;
    return walk(template, function (value) {
      return typeof value === "string" ? resolveString(value, context, strict) : value;
    });
  }

  function syntheticize(contentProfile, replacementMap) {
    var result = clone(contentProfile);
    var replacements = replacementMap && replacementMap.replacements || [];
    replacements.forEach(function (entry) {
      var relativePath = entry.path.indexOf("content.") === 0 ? entry.path.slice(8) : entry.path;
      setPath(result, "content." + relativePath, clone(entry.syntheticValue));
      (result.entities || []).forEach(function (entity) {
        var entityPath = entity.path.indexOf("content.") === 0 ? entity.path.slice(8) : entity.path;
        if (entityPath === relativePath) {
          entity.value = clone(entry.syntheticValue);
          entity.source = "synthetic";
          if (entity.sensitivity && entity.sensitivity !== "public") entity.sensitivity = "public";
        }
      });
    });
    if (result.profile) {
      result.profile.synthetic = true;
      if (result.profile.privacyMode === "private-real") result.profile.privacyMode = "synthetic-review";
    }
    return result;
  }

  function collectBindings(template) {
    var found = {};
    walk(template, function (value, path) {
      if (typeof value === "string") {
        var match;
        BINDING.lastIndex = 0;
        while ((match = BINDING.exec(value))) {
          if (!found[match[1]]) found[match[1]] = [];
          found[match[1]].push(path);
        }
      }
      return value;
    });
    return Object.keys(found).sort().map(function (binding) {
      return { binding: binding, locations: found[binding] };
    });
  }

  function audit(value, forbiddenTerms) {
    var terms = (forbiddenTerms || []).filter(Boolean).map(function (term) {
      return { original: String(term), lower: String(term).toLowerCase() };
    });
    var findings = [];
    function inspect(candidate, path, kind) {
      if (typeof candidate !== "string") return;
      var lower = candidate.toLowerCase();
      terms.forEach(function (term) {
        if (lower.indexOf(term.lower) !== -1) findings.push({ path: path, term: term.original, kind: kind });
      });
    }
    function visit(candidate, path) {
      if (Array.isArray(candidate)) {
        candidate.forEach(function (item, index) { visit(item, path + "[" + index + "]"); });
      } else if (candidate && typeof candidate === "object") {
        Object.keys(candidate).forEach(function (key) {
          inspect(key, path + "." + key, "key");
          visit(candidate[key], path + "." + key);
        });
      } else {
        inspect(candidate, path, "value");
      }
    }
    visit(value, "$");
    return { pass: findings.length === 0, findings: findings };
  }

  return {
    version: "1.0.0",
    resolve: resolve,
    syntheticize: syntheticize,
    collectBindings: collectBindings,
    audit: audit
  };
});
