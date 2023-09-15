
// ==UserScript==
// @name            UserScriptPatcher
// @description     User script to monkey patch js functions
// @version         1.0.0
// @author          mantikafasi (https://github.com/mantikafasi)
// @namespace       https://github.com/mantikafasi/UserScriptPatcher
// @license         GPL-3.0
// @match           *://*/*
// @grant           none
// @run-at          document-start
// ==/UserScript==

var UserScriptPatcher = (() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // node_modules/.pnpm/jsposed@1.0.4/node_modules/jsposed/dist/patch.js
  var require_patch = __commonJS({
    "node_modules/.pnpm/jsposed@1.0.4/node_modules/jsposed/dist/patch.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Unpatch = exports.Patch = exports.PatchPriority = void 0;
      var PatchPriority;
      (function(PatchPriority2) {
        PatchPriority2[PatchPriority2["MIN"] = 0] = "MIN";
        PatchPriority2[PatchPriority2["DEFAULT"] = 15] = "DEFAULT";
        PatchPriority2[PatchPriority2["MAX"] = 30] = "MAX";
      })(PatchPriority = exports.PatchPriority || (exports.PatchPriority = {}));
      var Patch = class {
        constructor(data) {
          var _a, _b, _c;
          this.priority = (_a = data.priority) !== null && _a !== void 0 ? _a : PatchPriority.DEFAULT;
          if (this.priority < PatchPriority.MIN || this.priority > PatchPriority.MAX) {
            throw new Error("Priority must be between PatchPriority.MIN and PatchPriority.MAX");
          }
          const defaultFn = (ctx) => void 0;
          if (data.instead) {
            if (data.after || data.before) {
              throw new Error("Instead patches cannot specify before or after patches.");
            }
            const { instead } = data;
            this.before = (ctx) => {
              ctx.result = instead(ctx);
            };
            this.after = defaultFn;
          } else {
            this.before = (_b = data.before) !== null && _b !== void 0 ? _b : defaultFn;
            this.after = (_c = data.after) !== null && _c !== void 0 ? _c : defaultFn;
          }
        }
      };
      exports.Patch = Patch;
      var Unpatch = class {
        constructor(patcher2, obj, methodName, patch) {
          this.patcher = patcher2;
          this.obj = obj;
          this.methodName = methodName;
          this.patch = patch;
        }
        unpatch() {
          this.patcher.unpatch(this.obj, this.methodName, this.patch);
        }
      };
      exports.Unpatch = Unpatch;
    }
  });

  // node_modules/.pnpm/jsposed@1.0.4/node_modules/jsposed/dist/PatchContext.js
  var require_PatchContext = __commonJS({
    "node_modules/.pnpm/jsposed@1.0.4/node_modules/jsposed/dist/PatchContext.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PatchContext = void 0;
      var PatchContext = class {
        constructor(thisObject, args) {
          this.thisObject = thisObject;
          this.args = args;
          this._result = null;
          this._error = null;
          this._returnEarly = false;
        }
        /**
         * Get the result. Null in beforePatch
         */
        get result() {
          return this._result;
        }
        /**
         * Set the result.
         * If called in a beforePatch, this skips the original method
         */
        set result(result) {
          this._result = result;
          this._error = null;
          this._returnEarly = true;
        }
        /**
         * Get the error thrown by the original method, if any
         */
        get error() {
          return this._error;
        }
        /**
         * Set the error. The method will throw this.
         * If called in a beforePatch, this skips the original method
         */
        set error(err) {
          this._error = err;
          this._result = null;
          this._returnEarly = true;
        }
        /**
         * If error is not null, throw it. Otherwise, return the result
         */
        get resultOrError() {
          const error = this._error;
          if (error !== null)
            throw error;
          return this._result;
        }
      };
      exports.PatchContext = PatchContext;
    }
  });

  // node_modules/.pnpm/jsposed@1.0.4/node_modules/jsposed/dist/PatchInfo.js
  var require_PatchInfo = __commonJS({
    "node_modules/.pnpm/jsposed@1.0.4/node_modules/jsposed/dist/PatchInfo.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.PatchInfo = void 0;
      var PatchContext_1 = require_PatchContext();
      var PatchInfo = class {
        constructor(patcher2, targetObject, methodName, original) {
          this.patcher = patcher2;
          this.targetObject = targetObject;
          this.methodName = methodName;
          this.original = original;
          this.patches = [];
        }
        get patchCount() {
          return this.patches.length;
        }
        addPatch(patch) {
          if (this.patches.includes(patch))
            return false;
          this.patches.push(patch);
          this.patches.sort((a, b) => b.priority - a.priority);
          return true;
        }
        removePatch(patch) {
          const idx = this.patches.indexOf(patch);
          if (idx === -1)
            return false;
          this.patches.splice(idx, 1);
          return true;
        }
        makeReplacementFunc() {
          const _this = this;
          return function(...args) {
            return _this._callback(this, ...args);
          };
        }
        _callback(thisObject, ...args) {
          const { patches } = this;
          if (!patches.length)
            return this.original.call(thisObject, ...args);
          const ctx = new PatchContext_1.PatchContext(thisObject, args);
          let idx = 0;
          do {
            try {
              patches[idx].before(ctx, ...ctx.args);
            } catch (err) {
              this.patcher.handleError("before", this, err, patches[idx]);
              ctx.result = null;
              ctx._returnEarly = false;
              continue;
            }
            if (ctx._returnEarly) {
              idx++;
              break;
            }
          } while (++idx < patches.length);
          if (!ctx._returnEarly) {
            try {
              ctx.result = this.original.call(ctx.thisObject, ...ctx.args);
            } catch (err) {
              ctx.error = err;
            }
          }
          idx--;
          do {
            const lastResult = ctx.result;
            const lastError = ctx.error;
            try {
              patches[idx].after(ctx, ...ctx.args);
            } catch (err) {
              this.patcher.handleError("after", this, err, patches[idx]);
              if (lastError !== null) {
                ctx.error = lastError;
              } else {
                ctx.result = lastResult;
              }
            }
          } while (--idx >= 0);
          return ctx.resultOrError;
        }
      };
      exports.PatchInfo = PatchInfo;
    }
  });

  // node_modules/.pnpm/jsposed@1.0.4/node_modules/jsposed/dist/Patcher.js
  var require_Patcher = __commonJS({
    "node_modules/.pnpm/jsposed@1.0.4/node_modules/jsposed/dist/Patcher.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.Patcher = void 0;
      var patch_1 = require_patch();
      var PatchInfo_1 = require_PatchInfo();
      var patchInfoSym = Symbol.for("jsposed.patchInfo");
      function getMethod(obj, methodName) {
        if (obj == null)
          throw new Error("obj may not be null or undefined");
        const method = obj[methodName];
        if (method == null)
          throw new Error("No such method: " + methodName);
        if (typeof method !== "function")
          throw new Error(methodName + " is not a function");
        return method;
      }
      var Patcher2 = class {
        /**
         * @param name A custom error for this patcher. This will be used for logging errors
         * @param handleError A custom error handler. If not specified, `console.error` will be used to print the patcher name, method name, and the error
         */
        constructor(name = "JsPosed", handleError) {
          this.name = name;
          this._unpatches = [];
          if (handleError)
            this.handleError = handleError;
        }
        handleError(kind, info, err, patch) {
          console.error(`[Patcher<${this.name}>] Error in ${kind} patch of method "${info.methodName}"
`, err, "\nFaulty Callback:", patch[kind]);
        }
        /**
         * Call the original method, bypassing all patches
         * @param method The method to call
         * @param thisObject The `this` to call the method with
         * @param args The arguments to pass to the method
         * @returns Result of the method
         */
        callOriginal(method, thisObject, ...args) {
          var _a, _b;
          if (typeof method !== "function")
            throw new Error("method must be a function");
          const actual = (_b = (_a = method[patchInfoSym]) === null || _a === void 0 ? void 0 : _a.original) !== null && _b !== void 0 ? _b : method;
          return actual.call(thisObject, ...args);
        }
        /**
         * Patch a method
         * @param obj Object holding the method
         * @param methodName Name of the method
         * @param patch Patch
         * @returns Unpatch
         */
        patch(obj, methodName, patch) {
          const method = getMethod(obj, methodName);
          let patchInfo = method[patchInfoSym];
          if (!patchInfo) {
            patchInfo = new PatchInfo_1.PatchInfo(this, obj, methodName, method);
            const replacement = obj[methodName] = patchInfo.makeReplacementFunc();
            Object.defineProperties(replacement, Object.getOwnPropertyDescriptors(method));
            Object.defineProperty(replacement, patchInfoSym, {
              value: patchInfo,
              enumerable: false,
              writable: true,
              configurable: true
            });
          }
          patchInfo.addPatch(patch);
          const unpatch = new patch_1.Unpatch(this, obj, methodName, patch);
          this._unpatches.push(unpatch);
          return unpatch;
        }
        /**
         * Remove a patch
         * @param obj Object holding the method
         * @param methodName Method name
         * @param patch Patch to remove
         */
        unpatch(obj, methodName, patch) {
          const method = getMethod(obj, methodName);
          const patchInfo = method[patchInfoSym];
          if (patchInfo) {
            patchInfo.removePatch(patch);
            if (patchInfo.patchCount === 0) {
              obj[methodName] = patchInfo.original;
            }
          }
        }
        /**
         * Remove all patches
         */
        unpatchAll() {
          for (const unpatch of this._unpatches) {
            unpatch.unpatch();
          }
          this._unpatches = [];
        }
        /**
         * Add a patch that will run before the original method
         * @param obj Object holding the method
         * @param methodName Method name
         * @param before Patch
         * @param priority Patch priority
         * @returns
         */
        before(obj, methodName, before, priority = patch_1.PatchPriority.DEFAULT) {
          return this.patch(obj, methodName, new patch_1.Patch({ before, priority }));
        }
        /**
         * Add a patch that will run instead of the original method
         * @param obj Object holding the method
         * @param methodName Method name
         * @param instead Patch
         * @param priority Patch priority
         * @returns
         */
        instead(obj, methodName, instead, priority = patch_1.PatchPriority.DEFAULT) {
          return this.patch(obj, methodName, new patch_1.Patch({ instead, priority }));
        }
        /**
         * Add a patch that will run after the original method
         * @param obj Object holding the method
         * @param methodName Method name
         * @param after Patch
         * @param priority Patch priority
         * @returns
         */
        after(obj, methodName, after, priority = patch_1.PatchPriority.DEFAULT) {
          return this.patch(obj, methodName, new patch_1.Patch({ after, priority }));
        }
      };
      exports.Patcher = Patcher2;
    }
  });

  // node_modules/.pnpm/jsposed@1.0.4/node_modules/jsposed/dist/types.js
  var require_types = __commonJS({
    "node_modules/.pnpm/jsposed@1.0.4/node_modules/jsposed/dist/types.js"(exports) {
      "use strict";
      Object.defineProperty(exports, "__esModule", { value: true });
    }
  });

  // node_modules/.pnpm/jsposed@1.0.4/node_modules/jsposed/dist/index.js
  var require_dist = __commonJS({
    "node_modules/.pnpm/jsposed@1.0.4/node_modules/jsposed/dist/index.js"(exports) {
      "use strict";
      var __createBinding = exports && exports.__createBinding || (Object.create ? function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
          desc = { enumerable: true, get: function() {
            return m[k];
          } };
        }
        Object.defineProperty(o, k2, desc);
      } : function(o, m, k, k2) {
        if (k2 === void 0)
          k2 = k;
        o[k2] = m[k];
      });
      var __exportStar = exports && exports.__exportStar || function(m, exports2) {
        for (var p in m)
          if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p))
            __createBinding(exports2, m, p);
      };
      Object.defineProperty(exports, "__esModule", { value: true });
      __exportStar(require_Patcher(), exports);
      __exportStar(require_PatchContext(), exports);
      __exportStar(require_PatchInfo(), exports);
      __exportStar(require_patch(), exports);
      __exportStar(require_types(), exports);
    }
  });

  // src/index.js
  var import_jsposed = __toESM(require_dist());
  var patcher = new import_jsposed.Patcher();
  window.patcher = patcher;
})();
