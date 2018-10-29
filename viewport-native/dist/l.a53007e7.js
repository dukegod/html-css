// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"src/libs/l.js":[function(require,module,exports) {
var define;
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/*
 * magic-viewport
 */
(function (factory) {
  if ((typeof module === "undefined" ? "undefined" : _typeof(module)) === "object" && _typeof(module.exports) === "object") {
    var v = factory(require, exports);
    if (v !== undefined) module.exports = v;
  } else if (typeof define === "function" && define.amd) {
    define(["require", "exports"], factory);
  }
})(function (require, exports) {
  "use strict";

  var opt = {
    fontSize: 14,
    baseWidth: 540,
    baseScale: 0
  };

  var MagicViewport =
  /** @class */
  function () {
    function MagicViewport(opt) {
      this.bScale = opt.baseScale;
      this.fSize = opt.fontSize;
      this.bWidth = opt.baseWidth;
      this.dpr = 0;
      this.timer = 0;
      this.init();
    }

    Object.defineProperty(MagicViewport.prototype, "$Win", {
      get: function get() {
        return window;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(MagicViewport.prototype, "$doc", {
      get: function get() {
        return window.document;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(MagicViewport.prototype, "$html", {
      get: function get() {
        return this.$doc.documentElement;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(MagicViewport.prototype, "$dpr", {
      get: function get() {
        return this.$Win.devicePixelRatio || 1;
      },
      enumerable: true,
      configurable: true
    });
    Object.defineProperty(MagicViewport.prototype, "$version", {
      get: function get() {
        return this.$Win.navigator.appVersion.match(/android/ig), this.$Win.navigator.appVersion.match(/iphone/ig);
      },
      enumerable: true,
      configurable: true
    });

    MagicViewport.prototype.init = function () {
      var _this = this;

      this.$Win.addEventListener('resize', function () {
        clearTimeout(_this.timer);
        _this.timer = setTimeout(_this.geneteMeta, 300);
      }, false);
      this.$Win.addEventListener('pageshow', function (e) {
        if (e.persisted) {
          clearTimeout(_this.timer);
          _this.timer = setTimeout(_this.geneteMeta, 300);
        }
      }, false);

      if (this.$doc.readyState === 'complete') {
        this.$doc.body.style.fontSize = 12 * this.dpr + 'px';
      } else {
        this.$doc.addEventListener('DOMContentLoaded', function (e) {
          // @ts-ignore
          _this.$doc.body.style.fontSize = 12 * _this.dpr + 'px';
        }, false);
      }
    };

    MagicViewport.prototype.setRootDpr = function () {
      var DPR = this.$dpr;

      if (this.$version) {
        if (DPR && DPR >= 3) {
          this.dpr = DPR;
        } else if (DPR && DPR >= 2) {
          this.dpr = 2;
        } else {
          this.dpr = 1;
        }
      }
    };

    MagicViewport.prototype.setRootSize = function () {
      this.setRootDpr();
      var htmlWidth; // @ts-ignore

      htmlWidth = this.$html.getBoundingClientRect().width || this.$html.clientWidth;
      htmlWidth / this.dpr > this.bWidth && (htmlWidth = this.bWidth * this.dpr);
      var fontSize = htmlWidth / 10; // @ts-ignore

      this.$html.style.fontSize = fontSize + "px"; // @ts-ignore

      this.$html.setAttribute('data-dpr', this.dpr);
    };

    MagicViewport.prototype.geneteMeta = function () {
      this.setRootSize();
      var metaViewport = document.querySelector('meta[name="viewport"]'); // @ts-ignore

      metaViewport && (metaViewport.remove ? metaViewport.remove() : metaViewport.parentElement.removeChild(metaViewport));
      metaViewport = this.$doc.createElement("meta");
      metaViewport.setAttribute("name", "viewport");
      metaViewport.setAttribute("content", "width=device-width, initial-scale=" + this.dpr + ", maximum-scale=" + this.dpr + ", minimum-scale=" + this.dpr + ", user-scalable=no");

      if (this.$doc.firstElementChild) {
        this.$doc.firstElementChild.appendChild(metaViewport);
      } else {
        var div = this.$doc.createElement("div");
        div.appendChild(metaViewport);
        this.$doc.write(div.innerHTML);
      }
    };

    return MagicViewport;
  }();

  return new MagicViewport(opt);
});
},{}],"../../../.nvm/versions/node/v10.0.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "59581" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../.nvm/versions/node/v10.0.0/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/libs/l.js"], null)
//# sourceMappingURL=/l.a53007e7.map