// This code implements the `-sMODULARIZE` settings by taking the generated
// JS program code (INNER_JS_CODE) and wrapping it in a factory function.

// When targeting node and ES6 we use `await import ..` in the generated code
// so the outer function needs to be marked as async.
async function Scalatrix(moduleArg = {}) {
  var moduleRtn;

// include: shell.js
// include: minimum_runtime_check.js
(function() {
  // "30.0.0" -> 300000
  function humanReadableVersionToPacked(str) {
    str = str.split('-')[0]; // Remove any trailing part from e.g. "12.53.3-alpha"
    var vers = str.split('.').slice(0, 3);
    while(vers.length < 3) vers.push('00');
    vers = vers.map((n, i, arr) => n.padStart(2, '0'));
    return vers.join('');
  }
  // 300000 -> "30.0.0"
  var packedVersionToHumanReadable = n => [n / 10000 | 0, (n / 100 | 0) % 100, n % 100].join('.');

  var TARGET_NOT_SUPPORTED = 2147483647;

  // Note: We use a typeof check here instead of optional chaining using
  // globalThis because older browsers might not have globalThis defined.
  var currentNodeVersion = typeof process !== 'undefined' && process.versions?.node ? humanReadableVersionToPacked(process.versions.node) : TARGET_NOT_SUPPORTED;
  if (currentNodeVersion < 160000) {
    throw new Error(`This emscripten-generated code requires node v${ packedVersionToHumanReadable(160000) } (detected v${packedVersionToHumanReadable(currentNodeVersion)})`);
  }

  var userAgent = typeof navigator !== 'undefined' && navigator.userAgent;
  if (!userAgent) {
    return;
  }

  var currentSafariVersion = userAgent.includes("Safari/") && !userAgent.includes("Chrome/") && userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/) ? humanReadableVersionToPacked(userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentSafariVersion < 150000) {
    throw new Error(`This emscripten-generated code requires Safari v${ packedVersionToHumanReadable(150000) } (detected v${currentSafariVersion})`);
  }

  var currentFirefoxVersion = userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/) ? parseFloat(userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentFirefoxVersion < 79) {
    throw new Error(`This emscripten-generated code requires Firefox v79 (detected v${currentFirefoxVersion})`);
  }

  var currentChromeVersion = userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/) ? parseFloat(userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentChromeVersion < 85) {
    throw new Error(`This emscripten-generated code requires Chrome v85 (detected v${currentChromeVersion})`);
  }
})();

// end include: minimum_runtime_check.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.
var Module = moduleArg;

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = !!globalThis.window;
var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != 'renderer';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

if (ENVIRONMENT_IS_NODE) {
  // When building an ES module `require` is not normally available.
  // We need to use `createRequire()` to construct the require()` function.
  const { createRequire } = await import('node:module');
  /** @suppress{duplicate} */
  var require = createRequire(import.meta.url);

}

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)


var arguments_ = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

var _scriptName = import.meta.url;

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

if (ENVIRONMENT_IS_NODE) {
  const isNode = globalThis.process?.versions?.node && globalThis.process?.type != 'renderer';
  if (!isNode) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  var fs = require('node:fs');

  if (_scriptName.startsWith('file:')) {
    scriptDirectory = require('node:path').dirname(require('node:url').fileURLToPath(_scriptName)) + '/';
  }

// include: node_shell_read.js
readBinary = (filename) => {
  // We need to re-wrap `file://` strings to URLs.
  filename = isFileURI(filename) ? new URL(filename) : filename;
  var ret = fs.readFileSync(filename);
  assert(Buffer.isBuffer(ret));
  return ret;
};

readAsync = async (filename, binary = true) => {
  // See the comment in the `readBinary` function.
  filename = isFileURI(filename) ? new URL(filename) : filename;
  var ret = fs.readFileSync(filename, binary ? undefined : 'utf8');
  assert(binary ? Buffer.isBuffer(ret) : typeof ret == 'string');
  return ret;
};
// end include: node_shell_read.js
  if (process.argv.length > 1) {
    thisProgram = process.argv[1].replace(/\\/g, '/');
  }

  arguments_ = process.argv.slice(2);

  quit_ = (status, toThrow) => {
    process.exitCode = status;
    throw toThrow;
  };

} else
if (ENVIRONMENT_IS_SHELL) {

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL('.', _scriptName).href; // includes trailing slash
  } catch {
    // Must be a `blob:` or `data:` URL (e.g. `blob:http://site.com/etc/etc`), we cannot
    // infer anything from them.
  }

  if (!(globalThis.window || globalThis.WorkerGlobalScope)) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  {
// include: web_or_worker_shell_read.js
if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.responseType = 'arraybuffer';
      xhr.send(null);
      return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
    };
  }

  readAsync = async (url) => {
    // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
    // See https://github.com/github/fetch/pull/92#issuecomment-140665932
    // Cordova or Electron apps are typically loaded from a file:// url.
    // So use XHR on webview if URL is a file URL.
    if (isFileURI(url)) {
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            resolve(xhr.response);
            return;
          }
          reject(xhr.status);
        };
        xhr.onerror = reject;
        xhr.send(null);
      });
    }
    var response = await fetch(url, { credentials: 'same-origin' });
    if (response.ok) {
      return response.arrayBuffer();
    }
    throw new Error(response.status + ' : ' + response.url);
  };
// end include: web_or_worker_shell_read.js
  }
} else
{
  throw new Error('environment detection error');
}

var out = console.log.bind(console);
var err = console.error.bind(console);

var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var FETCHFS = 'FETCHFS is no longer included by default; build with -lfetchfs.js';
var ICASEFS = 'ICASEFS is no longer included by default; build with -licasefs.js';
var JSFILEFS = 'JSFILEFS is no longer included by default; build with -ljsfilefs.js';
var OPFS = 'OPFS is no longer included by default; build with -lopfs.js';

var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';

// perform assertions in shell.js after we set up out() and err(), as otherwise
// if an assertion fails it cannot print the message

assert(!ENVIRONMENT_IS_SHELL, 'shell environment detected but not enabled at build time.  Add `shell` to `-sENVIRONMENT` to enable.');

// end include: shell.js

// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary;

if (!globalThis.WebAssembly) {
  err('no native wasm support detected');
}

// Wasm globals

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */
var isFileURI = (filename) => filename.startsWith('file://');

// include: runtime_common.js
// include: runtime_stack_check.js
// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with SAFE_HEAP and ASAN which also
  // monitor writes to address zero.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  HEAPU32[((max)>>2)] = 0x02135467;
  HEAPU32[(((max)+(4))>>2)] = 0x89BACDFE;
  // Also test the global address 0 for integrity.
  HEAPU32[((0)>>2)] = 1668509029;
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  var cookie1 = HEAPU32[((max)>>2)];
  var cookie2 = HEAPU32[(((max)+(4))>>2)];
  if (cookie1 != 0x02135467 || cookie2 != 0x89BACDFE) {
    abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords 0x89BACDFE and 0x2135467, but received ${ptrToString(cookie2)} ${ptrToString(cookie1)}`);
  }
  // Also test the global address 0 for integrity.
  if (HEAPU32[((0)>>2)] != 0x63736d65 /* 'emsc' */) {
    abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }
}
// end include: runtime_stack_check.js
// include: runtime_exceptions.js
// end include: runtime_exceptions.js
// include: runtime_debug.js
var runtimeDebug = true; // Switch to false at runtime to disable logging at the right times

// Used by XXXXX_DEBUG settings to output debug messages.
function dbg(...args) {
  if (!runtimeDebug && typeof runtimeDebug != 'undefined') return;
  // TODO(sbc): Make this configurable somehow.  Its not always convenient for
  // logging to show up as warnings.
  console.warn(...args);
}

// Endianness check
(() => {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) abort('Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)');
})();

function consumedModuleProp(prop) {
  if (!Object.getOwnPropertyDescriptor(Module, prop)) {
    Object.defineProperty(Module, prop, {
      configurable: true,
      set() {
        abort(`Attempt to set \`Module.${prop}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`);

      }
    });
  }
}

function makeInvalidEarlyAccess(name) {
  return () => assert(false, `call to '${name}' via reference taken before Wasm module initialization`);

}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === 'FS_createPath' ||
         name === 'FS_createDataFile' ||
         name === 'FS_createPreloadedFile' ||
         name === 'FS_preloadFile' ||
         name === 'FS_unlink' ||
         name === 'addRunDependency' ||
         // The old FS has some functionality that WasmFS lacks.
         name === 'FS_createLazyFile' ||
         name === 'FS_createDevice' ||
         name === 'removeRunDependency';
}

function missingLibrarySymbol(sym) {

  // Any symbol that is not included from the JS library is also (by definition)
  // not exported on the Module object.
  unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get() {
        var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        abort(msg);
      },
    });
  }
}

// end include: runtime_debug.js
// include: binaryDecode.js
// Prevent Closure from minifying the binaryDecode() function, or otherwise
// Closure may analyze through the WASM_BINARY_DATA placeholder string into this
// function, leading into incorrect results.
/** @noinline */
function binaryDecode(bin) {
  for (var i = 0, l = bin.length, o = new Uint8Array(l), c; i < l; ++i) {
    c = bin.charCodeAt(i);
    o[i] = ~c >> 8 & c; // Recover the null byte in a manner that is compatible with https://crbug.com/453961758
  }
  return o;
}
// end include: binaryDecode.js
var readyPromiseResolve, readyPromiseReject;

// Memory management
var
/** @type {!Int8Array} */
  HEAP8,
/** @type {!Uint8Array} */
  HEAPU8,
/** @type {!Int16Array} */
  HEAP16,
/** @type {!Uint16Array} */
  HEAPU16,
/** @type {!Int32Array} */
  HEAP32,
/** @type {!Uint32Array} */
  HEAPU32,
/** @type {!Float32Array} */
  HEAPF32,
/** @type {!Float64Array} */
  HEAPF64;

// BigInt64Array type is not correctly defined in closure
var
/** not-@type {!BigInt64Array} */
  HEAP64,
/* BigUint64Array type is not correctly defined in closure
/** not-@type {!BigUint64Array} */
  HEAPU64;

var runtimeInitialized = false;



function updateMemoryViews() {
  var b = wasmMemory.buffer;
  HEAP8 = new Int8Array(b);
  HEAP16 = new Int16Array(b);
  HEAPU8 = new Uint8Array(b);
  HEAPU16 = new Uint16Array(b);
  HEAP32 = new Int32Array(b);
  HEAPU32 = new Uint32Array(b);
  HEAPF32 = new Float32Array(b);
  HEAPF64 = new Float64Array(b);
  HEAP64 = new BigInt64Array(b);
  HEAPU64 = new BigUint64Array(b);
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
assert(globalThis.Int32Array && globalThis.Float64Array && Int32Array.prototype.subarray && Int32Array.prototype.set,
       'JS engine does not provide full typed array support');

function preRun() {
  if (Module['preRun']) {
    if (typeof Module['preRun'] == 'function') Module['preRun'] = [Module['preRun']];
    while (Module['preRun'].length) {
      addOnPreRun(Module['preRun'].shift());
    }
  }
  consumedModuleProp('preRun');
  // Begin ATPRERUNS hooks
  callRuntimeCallbacks(onPreRuns);
  // End ATPRERUNS hooks
}

function initRuntime() {
  assert(!runtimeInitialized);
  runtimeInitialized = true;

  checkStackCookie();

  // Begin ATINITS hooks
  if (!Module['noFSInit'] && !FS.initialized) FS.init();
TTY.init();
  // End ATINITS hooks

  wasmExports['__wasm_call_ctors']();

  // Begin ATPOSTCTORS hooks
  FS.ignorePermissions = false;
  // End ATPOSTCTORS hooks
}

function preMain() {
  checkStackCookie();
  // No ATMAINS hooks
}

function postRun() {
  checkStackCookie();
   // PThreads reuse the runtime from the main thread.

  if (Module['postRun']) {
    if (typeof Module['postRun'] == 'function') Module['postRun'] = [Module['postRun']];
    while (Module['postRun'].length) {
      addOnPostRun(Module['postRun'].shift());
    }
  }
  consumedModuleProp('postRun');

  // Begin ATPOSTRUNS hooks
  callRuntimeCallbacks(onPostRuns);
  // End ATPOSTRUNS hooks
}

/** @param {string|number=} what */
function abort(what) {
  Module['onAbort']?.(what);

  what = 'Aborted(' + what + ')';
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  readyPromiseReject?.(e);
  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

function createExportWrapper(name, nargs) {
  return (...args) => {
    assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
    var f = wasmExports[name];
    assert(f, `exported native function \`${name}\` not found`);
    // Only assert for too many arguments. Too few can be valid since the missing arguments will be zero filled.
    assert(args.length <= nargs, `native function \`${name}\` called with ${args.length} args but expects ${nargs}`);
    return f(...args);
  };
}

var wasmBinaryFile;

function findWasmBinary() {
  return binaryDecode(' asm    f``||||||`|````||`  ``| `|| `|| ` ` `|| `||| `` ` `||||`|`||` `| `| `| ` `|`~~``|`` ` `\r `\n `	 `|`~~ ` `~`||`||`||`|||`~`~~`|`|`||`||`|||`|`|| `|| `||||`||`| `|`|~`|~~|` |`| `|||`|`~`~`~~ `~~|`~ `~`|`~ `} `~~~~ `| `~~~~`~~`~~ `~`~~`~~}`~ `~~`~`~`~`}`}`|`\n``~`~ `|`~~`~~``~~` ` ~`~ Â#env\r__assert_fail env__cxa_throw env_embind_register_class "env_embind_register_class_property #env%_embind_register_class_class_function $env\r_emval_decref env_emval_create_invoker env\r_emval_invoke %env_emval_run_destructors env_embind_register_void \renv_embind_register_bool env_embind_register_integer !env_embind_register_bigint &env_embind_register_float env_embind_register_std_string \renv_embind_register_std_wstring env_embind_register_emval env_embind_register_memory_view env_embind_register_value_object  env#_embind_register_value_object_field #env_embind_finalize_value_object env_embind_register_iterable env_embind_register_function \'env"_embind_register_class_constructor  env_embind_register_class_function #env_embind_register_optional \renv	_abort_js wasi_snapshot_preview1fd_close wasi_snapshot_preview1fd_write wasi_snapshot_preview1fd_seek (envemscripten_resize_heap wasi_snapshot_preview1fd_read wasi_snapshot_preview1environ_sizes_get wasi_snapshot_preview1environ_get env	_tzset_js ÕÓ \r)\r*\r\r\r\r\r\r	\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r*\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r+,\r\r\r\r\r\r\r\r\r\r\r\r\n\n\r	\r\r\r\r\r!\r\r\r\r\r!\r!\r\r\r\r\r!\r\r!\r\r\r\r\r\r\r\r\r\r\r-\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r!\r! \r\r\r \r.\r-\r\r\r\r!!  !!  \r\r\r\r\r\r\r\r/\r\r\r0\r\r\r\r1\r\r\r\r\r\r\r\r\r\r\r\r\r\r/\r\r\r\r\r//\r\r\r\r\r\r /\r\r\r\r\r\r/\r\r\r\r\r\r23 **4!567/8\r90\r:\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r*;,;**:<=>****:?+*@*+ ABB!\r;\rCCD\rEF\r\r\r\r\rGG\rE\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\rHI\rJJKLLJ\rJCJJMJN OPQRSTUPUVVW/XY\r\r \rZVV![XY\r\r Z![\r\r!\\\\..]\\\\.^\r_`\\\\\\\\^\r_`\r\r\r\r         !    !         !    !  \r  \r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r a# \r\r\r\r\r\r\r\r\r\r\r\r\r\r a# \r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\rb#c\r\rb#c\r\r \r \r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r\r!!\r\r\r!!\r\r\r\r\r\r\r\r\r\r\r\rVddddVddWX/YeeeeB-Feee-FF---\r\r\'\r\'\r\r\r\r\r\r\r\r\r!! !!!   p««AA A Âmemory __wasm_call_ctors #\r__getTypeName í__indirect_function_table malloc Ðmain fflush äemscripten_stack_get_end Ýemscripten_stack_get_base Üstrerror þfree Òemscripten_stack_init Úemscripten_stack_get_free Û_emscripten_stack_restore ó_emscripten_stack_alloc ôemscripten_stack_get_current õ	Ë Aª$*EkçÞÖîïó÷ú&\'()/01§ª°H²IVjW»¾ÄÈØåä ¡¢ÚÛàáåæêëðñö÷Ô¨®Ú¸ÅÆ	Ð	Ù	á	í	÷	\n\n\n\n¢\n¨\n¯\n¿\nÆ\nÌ\nÒ\nÙ\nß\nç\ní\nó\nù\nÿ\n¥¦ª«°±µ¶º»¿ÀÆÉÏÑÓÕ×ÙÛßàäåêëðñõûþ													¥	¨	®	°	²	´	¶	¸	º	¾	¯µ¾ÌÓ¤ª¶ÂÈï\r\rª\r¶\r¼\rã\rÂÃÆÌÍÏèéëìíïðñòüýÿ¤¦¥§»¼¾¿ÀÁÂÃÄÌÍÏÐÔÖØ×Ùíïîðæç¹º×ØãÜÝ£¤¨ª«µ¶·¹ºæÒÙ¡ñõ ¡£¤¥¦§ø±²·¼½ÂÃÆíîñóõ÷ûïðòôöøü¨©ª«¬­®¯ÇÈÊÌÍÎÏÑÒÓÔÕÖ×ØÙÚÛÝßàáâäåæçèéêëì¡¢£¤¥©¥ª¸ÁÄÇÊÍÐÕØÛ¦âìñóõ÷ùûÿ§£¨«®ºÀ¨ÂËÏÑÓÕÛÝ©«æçèéëíðÿ¬®ÿ °¯²±£³©¬­®¯°²³´´µ¶·¸¹º»¼½µ¾ÁÂÃÆÇÉÊË¶ÌÍÎÏÐÑÒÓÔ·Øì¸¡¹ÎÝºÞê»òóô¼õö÷æç¸¹¼º»Á½ÄÝÚË¾ÜÙÌ¿ÛÖÏÀÑâãåæßàëìïðñ\nË°Ó Ú½èð# A k!   6  6  6  6  6  6  6 (!  (6   (6  (6  (6  (6  (6 B# Ak!   6  6  6 (!  (6   (6 # Ak! $   6  6 (!   (  (( l ( ((lj (j ( (( l ( ((lj (j¥  Aj$ # Ak! $   6  6 (!   (  (( l ( ((lj (  ((l ( ((lj ( (( l ( ((lj ( ((l ( ((lj (  ((l ( ((lj (j ( ((l ( ((lj (jA    Aj$ # Ak! $   6 (!  (  (l ( (lk6@ (\r AÑ AÏ AA¢    ( (m! (!A  k (m! (!A  k (m! (  (m!	 ( (l ( (lk!\nA  \nk (m! (  (l ( (lk!      	 A  k (mA    Aj$ Ñ# A k! $    6  6  6  6@ ((  ((l (( (( lk\r A² AÏ A\'AÑ   @ ((  ((l (( (( lk\r A AÏ A)AÑ   A - ¨ô !A !@ Aÿq AÿqFAqE\r Aô !A!A !	   	 	  	 	A   A!\nA  \n: ¨ô A !A  6 ô A !A  6¤ô   ((  ((l (( (( lk6 ((  ((l ((  ((lk (m!\rA  \r6ô  ((  (( l ((  (( lk (m!A  6ô  (( ((l (( ((lk (m!A  6ô  ((  ((l ((  ((lk (m!A  6ô Aô ! A j$  # AÀ k!   6<  90  9(  9   9  9  9 (<!  +09   +(9  + 9  +9  +9   +9( |# Ak! $   6  6 (! + ! (+ ! + (+¢  ¢  +  ! +! (+ !	    + (+¢  	¢  +( ¬  Aj$ B# A k!   6  9  9 (!  +9   +9 ¡|# Ak! $   6  6 (! + ! (( ·! + ((·¢  ¢  +  ! +! (( ·!	    + ((·¢  	¢  +( ¬  Aj$ Ì|# Ak! $   6  6 (! + ! (+ ! + (+¢  ¢ ! + ! (+!	 + (+¢  	¢ !\n +! (+ ! + (+¢  ¢ !\r +! (+! + (+¢  ¢ ! + ! (+ ! + (+(¢  ¢  +  ! +! (+ !    \n \r   + (+(¢  ¢  +( A    Aj$ |# Ak! $   6  6 (! + ! (+ ! + (+¢  ¢  +  ! +! (+ !	    + (+¢  	¢  +( ¬  Aj$ Ì|# Ak! $   6  6 (! + ! (+ ! + (+¢  ¢ ! + ! (+!	 + (+¢  	¢ !\n +! (+ ! + (+¢  ¢ !\r +! (+! + (+¢  ¢ ! + ! (+ ! + (+(¢  ¢  +  ! +! (+ !    \n \r   + (+(¢  ¢  +( A    Aj$ µ|# Ak! $   6 (! + ! +!  + +¢  ¢ 9 @ + ² DH¯¼ò×z>dAq\r A´ AÏ AÚ A¢    + + £! + + £! + + £! +  + £!	 +!\n + ! + +(¢ \n ¢  + £! + !\r +(!      	  + + ¢ \r ¢  + £A    Aj$ # Ak!   9 +¡# Að k! $    6l  6h (l! ´   (hµ  A 6d@@ (d (hHAqE\r Aj¶   Aj·  Aj¸   (dAj6d  Að j$ X# Ak! $    6 (!  ¹ 6  ( º   (»  Aj$ ©# A k! $    6  6 (!@ ( ¼ KAqE\r @ ( ½ KAqE\r ¾   (! ¹ ! Aj   ¿   AjÀ  AjÁ  A j$ É|~~# Ak! $    6 (!A !   ¥  Aj!A ·!   ¬  A ·9 A :   A(j!B !  7  7  7  Ã  AÀ j!B !	  	7  	7  	7  Ã  Aj$  B# Ak! $    6  6 ( (Â  Aj$ L# Ak! $    6 (! AÀ jÄ  A(jÄ  Aj$  -# Ak!   6 (! ( ( kAØ m# Ak! $    6  6 (!  (6@@ ( (GAqE\r (A¨j!  6       (6 Aj$ g# Ak! $    6  6 (!    (AØ lj   ¹ AØ lj  Aj$ -# Ak!   6 (! ( ( kAØ m\\# Ak! $    6  ( 6  6 Aj Aj ( ! Aj$   AÔ   á# A k! $    6  6  6  6 (!  6 A 6  (6@@ (\r  A 6  (! (! Aj     (6   (6 (  (AØ lj!  6  6  (  (AØ lj6 (!	 A j$  	# Ak! $    6  6 (!   ((! ( ( kAØ m!  A  kAØ lj6  (   (  (   (! ( 6  ( 6  (Ajñ  Aj (Ajñ  Aj (Ajñ  ((! ( 6   ¹   Aj$ r# Ak! $    6 (!  6  @ ( A GAqE\r  ( (     (! Aj$  # Ak! $    6  6 (!  (6@@ ( (IAqE\r   (¿   (AØ j6   (À 6  (6 (A¨j! Aj$  <# Ak! $    6 (! å  Aj$  <# Ak! $    6 (!   Aj$  r# A k! $    6  9  6  6 (! Æ   +9  (6  (³  A j$  Q# Ak! $    6 (! A 6  A 6 A 6 Ç  Aj$  <# Ak! $    6 (! Ç  Aj$  µ# A k! $    6  6  9  6  6 A Aq:    + ( (A      ( ( (É  AAq: @ - Aq\r   A    A j$ \n	||||# Ak! $    6  6  6  6 (! (!  )(7ø  ) 7ð  )7è  )7à  )7Ø  ) 7Ð A ·9ð A ·9ø AÀj AÐj÷   AÀjÊ 6¼  AÀjË 6¸ (¼! A¨j AÐj ­  (¸! Aj AÐj ­  (!	 A  	k6  ( (k6 A¸j¶  A°j!\nA ! \n  ¥  A¸j )°7  (! A¸j!\r A j  \r­  A¸jAj!  )¨7  ) 7   +9Ð  (Ì  A¸jÍ  AÈ j A¸jÎ  A6D@@ (D (HAqE\r +X +° !@@A · eAqE\r  +X +° D      ð?cAqE\r  (¼! AÈ j Ï  +X +  !@@A · eAqE\r  +X +  D      ð?cAqE\r  (¸! AÈ j Ï  (¼! (¸! A<j  Ð  AÈ j A<jÏ  (! AÈ j! A(j  ­  AÈ jAj!  )07  )(7   + +P ¢9`  ( (DjÌ  AÈ jÍ   (DAj6D  AÈ j A¸jÍ  A6$@@ ($ (NAqE\r +X +°¡!@@A · eAqE\r  +X +°¡D      ð?cAqE\r  (¼! AÈ j Ñ  +X + ¡!@@A · eAqE\r  +X + ¡D      ð?cAqE\r  (¸! AÈ j Ñ  (¼! (¸! Aj  Ð  AÈ j AjÑ  (! AÈ j! Aj  ­  AÈ jAj!    )7   )7   + +P ¢9`  ( ($jÌ  AÈ jÍ   ($Aj6$  AÈ j¸  A¸j¸  Aj$ 9# Ak! $    6 (Ò ! Aj$  9# Ak! $    6 (Ó ! Aj$  0# Ak!   6  6 ((  (AØ lj# Ak! $    6  6 (! (!  -  :    )7  )7  )7  ) 7  A(j (A(jÔ  AÀ j (AÀ jÔ  Aj$  # Ak! $    6  6 (! (!  -  :    )7  )7  )7  ) 7  A(j (A(jÕ  AÀ j (AÀ jÕ  Aj$  K# Ak!   6  6 (!  ((  ( j6   (( (j6]# Ak! $   6  6 (!   (  (( j ( ((j¥  Aj$ S# Ak!   6  6 (! (( !  (  k6  ((!  ( k6# Ak!   6 (# Ak!   6 (AjU# Ak! $    6  6 (!  (é   (+9 Aj$  U# Ak! $    6  6 (!  (õ   (+9 Aj$  Þ|# A k! $    6  6 (! A 6@@ ( ¹ IAqE\r   (Ì 6 (! (!   ­  (Aj!  )7  ) 7  + (+ ¢! ( 9 (A :    (Aj6  A j$ §# A k! $    6  6  6 (!  (6@@ ( ( (jHAqE\r@@@ (A HAq\r  ( ¹ OAqE\rAè AÜ Ø  (¯ Aô Ø    (Ù 6A ! (è !Aè !At!   j( jAÚ  AÜ Ø  (¯ Aì Ø  (( ¯ !	Aî !\n 	 \nØ  ((¯ Aå Ø  (+²  \nØ  (+² Añ Ø    (è j( jAÚ   (+² A­ Ø @ (-  AqE\r Aè Aí Ø  (A(jÛ Aã Ø Aè A Ø   (Aj6  A j$ P# Ak! $    6  6 ( ( (Ü Ý ! Aj$  0# Ak!   6  6 ((  (AØ lj># Ak!   6  6 (!  (6  (6 (V# Ak! $    6  6 ( (Þ  (ß Ý ! Aj$  9# Ak! $    6 (à ! Aj$  ô# A k! $    6  6  6 (! Aj ¨ @ AjÙ AqE\r  (! Aj Ú  (! (!@@  ( Atj( jÛ A°qA FAqE\r  ( (j! (! !	 ( (j!\n (!  ( Atj( j! (!\r \r \r( Atj( jÜ ! (!A!    	 \n   t uÝ 6@ AjÞ AqE\r  (!  ( Atj( jAß  Aj©  (! A j$  ?# Ak! $    6 (ÿ û ! Aj$  a# Ak! $    6 (!@@ ÷ AqE\r  ü ! ø ! ! Aj$  R# Ak! $    6 (!   ( æ ç 6 (! Aj$  R# Ak! $    6 (!   (æ ç 6 (! Aj$  K# Ak! $    6  6 ( (è AsAq! Aj$  # Ak!   6 (( -# Ak!   6 (!  ( Aj6  T# Ak! $    6 (! A 6 B 7    A ù  Aj$  # Ak!   6 (O# Ak! $    6  6 (! Aj ô  (! Aj$  O# Ak! $    6  6 (  ( FAq! Aj$  ²# A k! $    6  6 (!@@  (FAqE\r   6  ( @ ÷ AqE\r    (Þ  (ß  6@ (÷ AqE\r    (Þ  (ß  6   Aj   (! Aj   (!  (6  ) 7   6 Aj  (! A j$  # Ak!   6 (b# Ak! $    6 (! ´   ì   í  î  î  Aj$  }# Ak! $    6  6 (! A 6  A 6 A 6 (ï   ((  (( (¹ ð  Aj$  x# Ak! $    6  6 (!  (ñ  Aj (Ajñ  Aj (Ajñ   (ò  Aj$ L# Ak! $    6 (! Aj ó  Ajô  Aj$  # Ak!   6´# A k! $    6  6  6  6 (! Aj ó  (! Aj È @ (A KAqE\r   (É   ( ( (Ê  AjË  AjÌ  A j$ P# Ak!   6  6  (( 6 (( ! ( 6  (! ( 6 A# Ak! $    6  6 ( (õ  Aj$ 1# Ak!   6  6 (!  (6  y# Ak! $    6 (!@ ( ( A GAqE\r  ( ´  (   (  ( (  ( ¼   Aj$ º# Ak! $    6  6 (!  6 (ö @@ (÷ Aq\r  (!  (6  ) 7   ø ù   (ú û  (ü   (! Aj$  # Ak!   68# Ak!   6 (- Av!A ! Aÿq AÿqGAq\'# Ak!   6 (- Aÿ qAÿqe# Ak! $    6  6 (!  Þ  ý jAj Þ  (jAjþ  Aj$ # Ak!   6 (( # Ak!   6 (# Ak!   6 ((^# Ak! $    6 (!@@ ÷ AqE\r   !A! Ak! Aj$  %# Ak!   6  6  6a# Ak! $    6 (!@@ ÷ AqE\r  ú !  ! ! Aj$  )# Ak!   6 ((AÿÿÿÿqA t9# Ak! $    6 ( ! Aj$  # Ak!   6 (<# Ak! $    6 (!   Aj$  # Ak!   6 (# Ak!   6 (( A# Ak! $    6  6 ( (  Aj$ a# Ak! $    6 (!  Þ  ß jAj Þ  ý jAjþ  Aj$ 1# Ak!   6  6 (!  (6  I# Ak! $    6  6  (6   (  Aj$ ;# Ak! $    6 (!   Aj$  # Ak!   6  61# Ak!  6   6 (!  (6  G# Ak! $    6 (! (  ( ß ù  Aj$ # Ak!   6 (A# Ak! $    6  6 ( (  Aj$ <# Ak! $    6 ((  ! Aj$  l# Ak! $    6  6  6 (!     ¼ AØ lj ( (  Aj$ =# Ak! $    6  6 (¸  Aj$ ,# Ak!   6  6  6  6 9# Ak! $    6 (  ! Aj$  	 ¡ E# Ak! $    6  6 ( ( ! Aj$  K# Ak! $    6A· !  (£  AÌï A   P# Ak! $   6  6   ( (¤ 6    (6 Aj$ c# Ak! $    6 (!    ¹ AØ lj   ¼ AØ lj  Aj$ # AÀ k! $    6<  68  64  60  (06, (<! Aj  A,j A0j¨  Aj  (6  )7  Aj ©   (86@@ ( (4GAqE\r (< (0  (ª   (AØ j6  (0AØ j60  Aj«  (< (8 (4¬  Aj­  AÀ j$ g# Ak! $    6  6 (!    ¼ AØ lj   (AØ lj  Aj$ ># Ak! $    6 (!  (»  Aj$ -# Ak!   6 (! ( ( kAØ mM# Ak! $    6  6  6 ( ( (¼  Aj$ p# Ak! $    6  6 (! (!@@ Aj  ¢ AqE\r  (! (! ! Aj$  # Ak!   6A®ô¢	 Aÿÿÿÿ9# Ak!   6  6  6 ((  (( IAqV# Ak! $    6  6 (!  (ù  A¸ï Aj6  Aj$  g# Ak! $    6  6 (!@ (  KAqE\r ¥   (A¦ ! Aj$  ,A· !   ä   AÌî A   # Ak! $    6  6  (AØ l6 @@ (§ AqE\r   (  (ï 6  ( é 6 (! Aj$  "# Ak!   6 (AKAqS# Ak!   6  6  6  6  (!  (6   (6  ( 6 ]# A k! $    6  (6  ) 7  (6  )7    ®  A j$ M# Ak! $    6  6  6 ( ( (¯  Aj$ !# Ak!   6 (A: o# Ak! $    6  6  6@@ ( (GAqE\r ( (   (AØ j6  Aj$ V# Ak! $    6 (!  6@ - Aq\r  °  (! Aj$  ;# Ak!   6 (!  (6  ) 7  A :  I# Ak! $    6  6  6 ( (±  Aj$ z# Ak! $    6 (! ( ! (( ! Aj µ  (( ! Aj µ   ( (¶  Aj$ # Ak! $    6  6 (! (!  -  :    )7  )7  )7  ) 7  A(j (A(j²  AÀ j (AÀ j²  Aj$  U# Ak! $    6  6 (!  (³   (+9 Aj$  È# A k! $    6  6 (!  6 (! Aj ´ !  (6  ) 7  A 6 B 7  (!  (6  ) 7  (A ù @ ÷ Aq\r   ß ù  (! A j$  X# Ak! $    6  6@ (÷ Aq\r  (  (! Aj$  1# Ak!   6  6 (!  (6  x# Ak! $   6  6   6@@ Aj Aj· AqE\r ( Aj¸   Aj¹   Aj$ O# Ak! $    6  6 (º  (º GAq! Aj$  8# Ak!   6  (( 6 (A¨j!  6 .# Ak!   6 (!  ( A¨j6  # Ak!   6 (( A# Ak! $    6  6 ( (½  Aj$ J# Ak! $    6  6  6 ( (A¾  Aj$ z# Ak! $    6  6 (!@@ ( (GAqE\r (! (A¨j!  6      Aj$ # Ak! $    6  6  6  (AØ l6 @@ (§ AqE\r  ( (  (ô  ( ( í  Aj$ z# A k! $    6  6 (! Aj AÁ   (  (ª   (AØ j6 AjÂ  A j$ ±# A k! $    6  6 (!  ¹ AjÃ ! ¹ ! Aj   ¿   (  (ª   (AØ j6  AjÀ  (! AjÁ  A j$  # Ak! $    6  6  6 (!  (6   ((6  (( (AØ lj6 (  (Ä  Aj$  # Ak! $    6 (!  6 (! (  6@ ( (GAqE\r  (  ( ( ( kAØ m»  (! Aj$  Á# A k! $    6  6 (!  ½ 6@ ( (KAqE\r ¾    ¼ 6@@ ( (AvOAqE\r   (6  (At6  Aj AjÅ ( 6 (! A j$  t# Ak! $    6  6 (!    ¹ AØ lj   ¹ AØ lj (AØ lj  Aj$ E# Ak! $    6  6 ( (Æ ! Aj$  p# Ak! $    6  6 (! (!@@ Aj  ¢ AqE\r  (! (! ! Aj$  # Ak!   6 (I# Ak! $    6  6  (6   (Í  Aj$ # Ak! $    6  6 (!@ ( ½ KAqE\r ¾   (!      ( 6   ( 6  (  (AØ lj6 A   Aj$ # A k! $    6  6  6  6 (! (! Aj  Á    ( ( (Î 6 AjÂ  A j$ !# Ak!   6 (A: V# Ak! $    6 (!  6@ - Aq\r  ô  (! Aj$  8# Ak!  6   6 (!  (6  A :  # A k! $    6  6  6  6 (! (! Aj  Ï   ( ( ( (Ð Ñ 6 ( (Ò ! A j$  `# Ak! $   6  6  (Ð 6  (Ð 6    Aj Ó  Aj$ 9# Ak! $    6 (Õ ! Aj$  # AÀ k! $    6<  68  64  60  (06, (<! Aj  A,j A0j¨  Aj  (6  )7  Aj © @@ (8 (4GAqE\r (< (0  (8Ô   (8AØ j68  (0AØ j60  Aj«  (0! Aj­  AÀ j$  E# Ak! $    6  6 ( (Ö ! Aj$  D# Ak! $   6  6   ( (×  Aj$ M# Ak! $    6  6  6 ( ( (Ø  Aj$ 9# Ak! $    6 ( ! Aj$  T# Ak! $    6  6 ( ( ( kAØ mAØ lj! Aj$  H# Ak!   6  6  6 (!  (( 6   (( 6 I# Ak! $    6  6  6 ( (Î  Aj$ "# Ak!   6 (-  AqZ# Ak! $    6  6 (! (!   ( Atj( jæ 6  Aj$  # Ak!   6 ((\n# Ak! $    6 (!@ AÌ jç Aq\r A !A!   t uè !A!  t u! AÌ j é  AÌ jê !A!	  	t 	u!\n Aj$  \n¹# AÀ k! $    68  64  60  6,  6(  : \'@@ (8A FAqE\r   (86<  (, (4k6   ((á 6@@ ( ( JAqE\r  ( !  ( k6 A 6  (0 (4k6@ (A JAqE\r @ (8 (4 (â  (GAqE\r  A 68  (86<@ (A JAqE\r  (! - \'!	 Aj!\nA! \n  	 t uã @@ (8 Ajä  (â  (GAqE\r  A 68  (86< A6 A 6 Aj @ (    (, (0k6@ (A JAqE\r @ (8 (0 (â  (GAqE\r  A 68  (86< ((A å   (86< (<! AÀ j$   %# Ak!   6 (( A FAqA# Ak! $    6  6 ( (ë  Aj$ 9# Ak! $    6 ( ! Aj$  # Ak!   6 ((b# Ak! $    6  6  6 (!  ( ( ( (0  ! Aj$  n# Ak! $    6  6  :  (!   (! - !A!    t u  Aj$  ?# Ak! $    6 (ì í ! Aj$  ># Ak!   6  6 (!  (6  (6 (9# Ak! $    6 (ñ ! Aj$  "# Ak!   6 (- Aq# Ak! $    6  :  (! Aj Ó  Ajò ! - !A!   t uó ! Aj« A!  t u!	 Aj$  	8# Ak!   6  6 (! A:   (6   # Ak!   6 ((  K# Ak! $    6  6 (!  ( (rÕ  Aj$ a# Ak! $    6 (!@@ ÷ AqE\r  î ! ï ! ! Aj$  # Ak!   6 (# Ak!   6 (( 9# Ak! $    6 (ð ! Aj$  # Ak!   6 (# Ak!   6 ((?# Ak! $    6 (A¸ ° ! Aj$  v# Ak! $    6  :  (! - ! ( (!A!   t u   !A!  t u!	 Aj$  	1# Ak!   6  6 (!  (6  # Ak!   6  6`|# Ak! $    9 +² Díµ ÷Æ°>c!D        !D      ð?  ! Aj$  ¶	||||# A k! $   6 (! Aèj ±  AØjD      ð?A ·¬  AÈj Aèj AØj«  AÀj!A !   ¥  A¸j!A !   ¥  A¨j!A ·!	  	 	¬  A : § A : ¦@@ +Èö A ·bAqE\r  +ÐA ·d!\nAA \nAq! AjA  ¥   )7¸ A: § (! AjAA ¥  Aj  Aj­   )7°  )7¨@@ +°² D      ð?cAqE\r  +°A ·d!\rAA \rAq! Aøj A ¥   )ø7À A: ¦  )¸7À@@ +Ðö A ·bAqE\r  +ÈA ·d!AA Aq! Aðj A ¥   )ð7¸ A: § (! AØjA A¥  Aàj  AØj­   )è7°  )à7¨@@ +°² D      ð?cAqE\r  +°A ·d!AA Aq! AÐjA  ¥   )Ð7À A: ¦  )¸7À@@ +È +Ð¡ö A ·bAqE\r  +ÈA ·d!AA Aq! AÈj A ¥   )È7¸ A: § (! A°jAA ¥  A¸j  A°j­   )À7°  )¸7¨@@ +°² D      ð?cAqE\r  +°A ·d!AA Aq! A¨jA  ¥   )¨7À A: ¦  )¸7À  +È²  +Ð² d: @@ - AqE\r   +Ð +È£² 9   +È +Ð£² 9   + ü6 A6ü  (6  Aüj6 A6 Aj  )7 Aj Ajø  A 6à A6ä  Aàj6è A6ì Aðj  )è7 Aðj Ajø   +  (·¡9Ø@@ Ajù AIAqE\r@@ - AqE\r   Aðjú ( 6À +È +Ð¢A ·d! AA Aq Ajú ( l6Ä  Ajú ( 6À +È +Ð¢A ·d! AA Aq Aðjú ( l6Ä (! (À·! (Ä·! A¸j  ¬  AÈj  A¸j«   )Ð7°  )È7¨@ +¨A ·cAqE\r  A¨j A¨jû   )°7°  )¨7¨ A j AÀjü   ) 7À@ +°D      ð?cAqE\r  +°D      ð¿dAqE\r @@ - §Aq\r  A: §  )À7¸ A: ¦ +Ø! D      ð? £ü6 +Ø! D      ð? £ (·¡9Ø (!  Ajù Ak!!   Aj !ý ( l!" Ajù Ak!#  " Aj #ý ( j6 Aj Ajþ  (!$ Aðjù Ak!% $ Aðj %ý ( l!& Aðjù Ak!\'  & Aðj \'ý ( j6 Aðj Ajþ   Aðjÿ  Ajÿ @@ - §Aq\r  Aj!(A !) ( ) )¥  Aj!*A !+ * + +¥    Aj Aj @ - ¦Aq\r  A¸j!,   , ,  Aj!-A !. - . .¥  Að j!/A ·!0 / 0 0¬  Aà j!1A ·!2 1 2 2¬  A: _ (!3 AÈ j 3 AÀj­   )P7x  )H7p (!4 A8j 4 A¸j­   )@7h  )87`@ +p +`dAqE\r  AÀj A¸j  Að j Aà j @@ - _AqE\r A : _ A 6X@@ +`A ·dAqE\r @ +`A ·d!5A !6 5Aq!7 6!8@ 7E\r  +hD      ð¿d!9A !: 9Aq!; :!8 ;E\r  +hD      ð?c!8@ 8AqE\r   )¸7 A¸j AÀjÑ  (!< A(j < A¸j­   )07h  )(7` A: _  (XAj6X  )7¸ (!= Aj = A¸j­   ) 7h  )7`@ (XAFAqE\r  A : _@ +p +`dAqE\r  AÀj A¸j  Að j Aà j  A: _ @@ +pA ·fAqE\r  +p +` A ·dAq\rAê A AA®   @ +p +`eAq\r A¼ A AA®      AÀj A¸j  A j$ q# Ak! $    6 (! A 6  A 6 A 6           Aj$  ,# Ak!   6 (! ( ( kAu"# Ak!   6 ((A|jF# Ak! $   6 (!   +  +¬  Aj$ V# Ak! $   6 (! ( !A  k! (!   A  k¥  Aj$ /# Ak!   6  6 ((  (AtjB# Ak! $    6  6 ( (  Aj$ L# Ak! $    6 (! Aj   Aj  Aj$  K# Ak!   6  6  6 (!  () 7  Aj () 7  K# Ak!   6  6  6 (!  () 7  Aj () 7  L# Ak!   6  6  () 7  (! ( ) 7  ( ) 7 v# A k!   6  6 (!  )7  ) 7 (! (!  )7  ) 7  (!  )7  )7 <# Ak! $    6 (!   Aj$  # Ak!   6 (( ,# Ak!   6 (! (  (Atj# Ak!   6 ((´# A k! $    6  6  6  6 (! Aj   (! Aj  @ (A KAqE\r   (   ( ( (  Aj  Aj  A j$ # Ak! $    6  6 (!  (6@@ ( (IAqE\r   (Æ   (Aj6   (Ç 6  (6 (A|j! Aj$  1# Ak!   6  6 (!  (6  y# Ak! $    6 (!@ ( ( A GAqE\r  ( À  ( Á  (  ( (  (  Â  Aj$ # Ak!   6 (I# Ak! $    6  6  (6   (  Aj$ # Ak! $    6  6 (!@ (  KAqE\r    (!      ( 6   ( 6  (  (Atj6 A   Aj$ # A k! $    6  6  6  6 (! (! Aj      ( ( ( 6 Aj  A j$ !# Ak!   6 (A: V# Ak! $    6 (!  6@ - Aq\r    (! Aj$  8# Ak!  6   6 (!  (6  A :  \\# Ak! $    6  ( 6  6 Aj Aj ( ! Aj$   AÔ   P# Ak! $   6  6   ( ( 6    (6 Aj$ e# Ak! $    6  6 (!     Atj   (Atj  Aj$ ~# Ak! $    6  6  6 (!  (6   ((6  (( (Atj6 (  (£  Aj$  # A k! $    6  6  6  6 (! (! Aj  ¤   ( ( ( (¥ ¦ 6 ( (§ ! A j$  # Ak! $    6 (!  6 (! (  6@ ( (GAqE\r  (  ( ( ( kAu¨  (! Aj$  9# Ak! $    6 ( ! Aj$  g# Ak! $    6  6 (!@ (  KAqE\r ¥   (A  ! Aj$  <# Ak! $    6 (( ¢ ! Aj$  ,# Ak!   6 (! ( ( kAuk# Ak! $    6  6  6 (!      Atj ( (¡  Aj$ # Ak!   6Aÿÿÿÿ# Ak! $    6  6  (At6 @@ (§ AqE\r   (  (ï 6  ( é 6 (! Aj$  ,# Ak!   6  6  6  6 # Ak!   6 (q# Ak! $    6  6 (!    ù Atj   ù Atj (Atj  Aj$ `# Ak! $   6  6  (© 6  (© 6    Aj ª  Aj$ 9# Ak! $    6 (° ! Aj$  ÿ# AÀ k! $    6<  68  64  60  (06, (<! Aj  A,j A0j«  Aj  (6  )7  Aj ¬ @@ (8 (4GAqE\r (< (0¢  (8­   (8Aj68  (0Aj60  Aj®  (0! Aj¯  AÀ j$  E# Ak! $    6  6 ( (± ! Aj$  e# Ak! $    6  6 (!    (Atj   ù Atj  Aj$ 9# Ak! $    6 (³ ! Aj$  D# Ak! $   6  6   ( (²  Aj$ S# Ak!   6  6  6  6  (!  (6   (6  ( 6 ]# A k! $    6  (6  ) 7  (6  )7    µ  A j$ M# Ak! $    6  6  6 ( ( (¶  Aj$ !# Ak!   6 (A: V# Ak! $    6 (!  6@ - Aq\r  ·  (! Aj$  9# Ak! $    6 (¢ ! Aj$  R# Ak! $    6  6 ( ( (¢ kAuAtj! Aj$  H# Ak!   6  6  6 (!  (( 6   (( 6 9# Ak! $    6 (´ ! Aj$  # Ak!   6 (;# Ak!   6 (!  (6  ) 7  A :  5# Ak!   6  6  6 ( (( 6 z# Ak! $    6 (! ( ! (( ! Aj ¸  (( ! Aj ¸   ( (¹  Aj$ 1# Ak!   6  6 (!  (6  x# Ak! $   6  6   6@@ Aj Ajº AqE\r ( Aj» ¼  Aj½   Aj$ O# Ak! $    6  6 (¾  (¾ GAq! Aj$  7# Ak!   6  (( 6 (A|j!  6 A# Ak! $    6  6 ( (¿  Aj$ -# Ak!   6 (!  ( A|j6  # Ak!   6 (( # Ak!   6  6X# Ak! $    6 (!  ù 6  ( Ã   (¨  Aj$ a# Ak! $    6 (!    ù Atj    Atj  Aj$ M# Ak! $    6  6  6 ( ( (Ä  Aj$ # Ak! $    6  6 (!  (6@@ ( (GAqE\r (A|j!  6  ¢ ¼    (6 Aj$ J# Ak! $    6  6  6 ( (AÅ  Aj$ # Ak! $    6  6  6  (At6 @@ (§ AqE\r  ( (  (ô  ( ( í  Aj$ y# A k! $    6  6 (! Aj A   (¢  (È   (Aj6 Aj  A j$ °# A k! $    6  6 (!  ù AjÉ ! ù ! Aj   Ê   (¢  (È   (Aj6  AjË  (! AjÌ  A j$  M# Ak! $    6  6  6 ( ( (Í  Aj$ Á# A k! $    6  6 (!   6@ ( (KAqE\r      6@@ ( (AvOAqE\r   (6  (At6  Aj AjÅ ( 6 (! A j$  ß# A k! $    6  6  6  6 (!  6 A 6  (6@@ (\r  A 6  (! (! Aj     (6   (6 (  (Atj!  6  6  (  (Atj6 (!	 A j$  	# Ak! $    6  6 (! Á  ((! ( ( kAu!  A  kAtj6  ( ¢  (¢  (¢ Î  (! ( 6  ( 6  (AjÏ  Aj (AjÏ  Aj (AjÏ  ((! ( 6   ù   Aj$ r# Ak! $    6 (!  6 Ð @ ( A GAqE\r  ( (  Ñ Â  (! Aj$  5# Ak!   6  6  6 ( (( 6 ~# Ak! $    6  6  6  6  ( ¢ ! (¢ ! ( (kAuAt!@ E\r    ü\n   Aj$ P# Ak!   6  6  (( 6 (( ! ( 6  (! ( 6 ># Ak! $    6 (!  (Ò  Aj$ ,# Ak!   6 (! ( ( kAuA# Ak! $    6  6 ( (Ó  Aj$ y# Ak! $    6  6 (!@@ ( (GAqE\r (! (A|j!  6  ¢ ¼   Aj$ Õ# A k! $   6  6  6  6  6  6  (+ 9h  (+9p D      ð?9x A ·9 A ·9 A ·9 A ·9 A ·9  A ·9¨  (+ 9°  (+9¸ D      ð?9À  (+ 9È  (+9Ð D      ð?9Ø A ·9à A ·9è A ·9ð A ·9ø A ·9 A ·9  (+ 9  (+9 D      ð?9   (+ 9¨  (+9° D      ð?9¸ A ·9À A ·9È A ·9Ð A ·9Ø A ·9à A ·9è  (+ 9ð  (+9ø D      ð?9  (+ 98  (+9@  (+ 9H  (+9P  (+ 9X  (+9` Aj Aè j A8jÛ    AjA Õ +  AjAÕ +  AjAÕ +  AjAÕ +  AjAÕ +  AjAÕ + ª  A j$ ,# Ak!   6  6 ( (AtjÙ	|# A k! $    6  6  6  6  9  9  (! AÈ j!A !	  	 	¥  AÐ j!\nA ! \n  ¥  AØ j!A !\r  \r \r¥  Aø j×  Aj!D      ð?!A ·!       ª  A¸j!A!A !       ¤  AÐj!A !   ¥  AØjDn¹ÂPZp@AA<Å   ( ( ( + + Ø  A j$  Q# Ak! $    6 (! A 6  A 6 A 6 Ù  Aj$  Ì|\r# AÐk! $    6Ì  6È  6Ä  6À  9¸  9° (Ì!@ (ÈA JAq\r A Aè AA¥   @ (ÄA JAq\r A Aè AA¥    +°!@@A · eAqE\r  +°D      ð?eAq\rAÕ Aè AA¥     (È (Äj6¬  (È (ÄÚ 6¨  (È (¨m6¤  (Ä (¨m6   (¤ ( j6  (È6   (Ä6  (¬6  (¤6  ( 6  (6  (À6  (¨6$  +¸90  +¸ (¨·£98  +°9@ (¤!	 ( !\n Aj 	 \nÛ  Aø j AjÜ  AjÝ   Aø jÞ 6( Aø j! Aü j ß  Aô jAA ¥  Aj Aü j Aô jà  AÐj )7  Aü jÝ  AÀ j á  Aj!  )h7(  )`7   )X7  )P7  )H7  )@7  â  Aj!\r (¬Aj! A j \rD      ð? A È  AØj A jã  A jë  AjAA ¥  Aj!A!   ¥  AÐj! (¤! ( ! Aj  ¥  Aj Aj  Aj© ! A¸j!  )7  )7  ) 7  AÐj$ <# Ak! $    6 (! ·  Aj$  n# Ak! $    6  6@@ (\r   (6  ( ( (oÚ 6 (! Aj$  Ì# A0k! $    6,  6(  6$ A Aq: #  ×   ((6  ($6@ (AJ!A! Aq! !@ \r  (AJ!@ AqE\r @@ ( (JAqE\r  (!  ( k6 A :    Ajë  (!	  ( 	k6 A:    Ajë  Aj  ì  Aj  í  Aj Ajî  AAq: #@ - #Aq\r   Ý  A0j$ G# Ak! $    6  6 (!  (  Aj$  L# Ak! $    6 (! Aj ÷  Ajø  Aj$  # Ak!   6 ((ì# A0k! $    6(  6$ ((!  6, A 6  A 6 A 6 ($ @ ($Þ A KAqE\r   ($Þ   ($! Aj ù  ($! Aj ú  ($Þ !  )7  )7   Aj    (,! A0j$  ú# A0k! $   6,  6(  ((( 6$  (((6   6 (! Aj ù  (! Aj ú @@ Aj Ajû AqE\r  Ajü : @@ - AqE\r   ($ ( j6   (  ($j6$ Ajý     ($ ( ¥  A0j$ Ò|\n|# Að k! $   6l (l! (·! D      à? £9` AÐ j!A ·!   ¬  (Ð·! (Ô·! AÀ j  ¬  (·!	 (·!\n A0j 	 \n¬  +` (AtAj·¢! A jA · ¬  +@ +8¢! +` (AtAj·¢!\r Aj  \r¬  +8! +` (AtAj·¢!   ¬    AÐ j AÀ j A0j A j Aj Ô  Að j$ ×# Ak! $    6 (! AjAA ¥  Aü jA A¥  Aj!  )7H AÐ j  )H7  AÐ j   Aà j  AÐ j¯   +`9p Aj!  )|7 A j  )7 A j Aj  A0j  A j¯   +09@@@ +p +@dAqE\r  AÈ j )7  AÐ j )|7   +p9`  +@9h  ( 6  (6  AÈ j )|7  AÐ j )7   +@9`  +p9h  (6  ( 6  AÈ j! AÐ j! Aj    AØ j )7   +` +h¡9p Aj$ m# Ak! $    6  6 (!  (  Aj! (Aj!  (6  ) 7  Aj$  |# Ak! $    6 (! A ·9 @ +@A ·dAqE\r  +@!D      ð? £D      ð?¡D      ð? ! D-DTû!ù? ¡9  + ! Aj$  ò|# A k! $    6 (!  ä 9 A 6@@ ( Aø jÞ IAqE\r@@ Aø j (æ AqE\r   +¤ D      ð?¡Aç 9 +¤ !D      ð? £D      ð?¡! A è 9  (Aj6  +! A j$  H# Ak! $    6  6 ( (é Aq! Aj$  H|# Ak! $    9  6 + (·ê ! Aj$  H|# Ak! $    6  9  (· + ê ! Aj$  t# Ak! $    6  6 ((  (AvAtj! (Aq!A t!      Aq! Aj$  G|# Ak! $    9  9  + +  ! Aj$  # Ak! $    6  6 (!@ ( ï FAqE\r    (Ajð ñ   (Aj6 (-  !  ò   Aqó  Aj$ @# Ak! $    6  6   (A ö  Aj$ G# Ak! $    6  6 (!    (ö  Aj$ ]# A k! $    6  6 Aj  ô  Aj ô  Aj Ajõ  A j$ <# Ak! $    6 ((¸ ! Aj$  Ñ# A k! $    6  6 (!  ¹ 6@ ( (KAqE\r º    ï 6@@ ( (AvOAqE\r   (6  (At6  (¿ 6  Aj AjÅ ( 6 (! A j$  î# A0k! $    6,  6( (,!@ (( ï KAqE\r @ (( ¹ KAqE\r º   »  Aj Aj¼  ((! Aj   Aj ì  Aj í  Þ ! Aj Aj Aj ½   Aj¾  AjÝ  A0j$ C# Ak! $   6 (!    (Ak  Aj$ v# Ak!   6  Aq:  (!@@ - AqE\r  (! ( !   ( r6  (As! ( !   ( q6  A# Ak!   6  6 (!  (( 6   ((6 ]# A k! $    6  6 Aj  ô  Aj ô  Aj Ajø  A j$ ]# Ak! $    6  6  6   ((  (AvAtj (Aq÷  Aj$ 1# Ak!   6  6 (!  (6  `# Ak! $    6 (!@ ( ( A GAqE\r  (  ( (  ( (´  Aj$ 9# Ak! $   6   (A þ  Aj$ @# Ak! $   6 (!    (þ  Aj$ K# Ak! $    6  6 ( (ÿ AsAq! Aj$  h# Ak! $    6 (! ( ! (!A t! Aj    Aj Aq! Aj$  W# Ak!   6 (!@@ (AGAqE\r   (Aj6 A 6  ( Aj6  V# Ak! $   6  6   ((  (AvAtj (Aqÿ  Aj$ `# Ak!   6  6 ((  (( F!A ! Aq! !@ E\r  (( ((F! AqB# Ak!   6  6  6 (!  (6   (6 2# Ak!   6 (! ( (  (qA GAqK# Ak! $    6  6 ( ( AsAq! Aj$  O# Ak! $   6 (! ( ! (!   A t  Aj$ 2# Ak!   6 (! ( (  (qA GAqW# Ak!   6 (!@@ (AGAqE\r   (Aj6 A 6  ( Aj6  # Ak!   6# Ak! $    6  6 (!@ ( ¹ KAqE\r º   (Ã !   Ä   ( 6  A 6  (6 Aj$ # Að k! $    6l  6h (l!  ) 7`  ) 7X AÐ j í  AÀ j  )`7  )X7 AÀ j Aj Aj AÐ j   (h (j6 A8j í @ (<E\r  A0j í  A(j í  (,!A  k! A 6$ Aj A0j  A$jÆ  Að j$ `# Ak!   6  6 ((  (( F!A ! Aq! !@ E\r  (( ((F! AqB# Ak!   6  6  6 (!  (6   (6 z# A k! $    6  6  6  6  9  9    ( ( ( + + A    A j$ 6# Ak!   6 (!  ( ·9   (·9 ]# Ak! $   6  6 (!   (  (( k ( ((k¥  Aj$ ||# AÀ k! $    6<  90  9(  9  (<! + ! Aj! +0! +(!	   	¬  Aj  «   + ¢!\n AÀ j$  \n# Ak! $    6  6 (! ¥   (¦   (( 6   ((6  ((6 (A 6  (A 6 (A 6 Aj$ p# Ak! $    6  6 (!@  (GAqE\r   (£   ((  ((¤  Aj$  Ã|# AÐ k! $    6L  6H  6D  98  90  6, (L! A6( A6$  +89 +8! D      ð? ¡9 A 6@@ ( (HHAqE\r@@ + +dAqE\r   (( ($j6$ +!	  + 	¡9  ($ ((j6( +!\n  + \n¡9  (Aj6   (( (,l ($ (,l (D +0 +8Ø  AÐ j$ È|# AÐ k! $    6L  6H  6D  98  90  6, A6( A6$  +89 +8! D      ð? ¡9 A 6@@ ( (HHAqE\r@@ + +dAqE\r   (( ($j6$ +!  + ¡9  ($ ((j6( +!	  + 	¡9  (Aj6    (( (,l ($ (,l (D +0 +8A    AÐ j$ |# AÐ k! $    6L  9@ (LAø j! A4j ß  A,j A4jì  A$j A4jí  A,j A$jî   +@9 A 6@@ ( A4jÞ IAqE\r (! Aj A4j  @@ Aj AqE\r   +¤ D      ð? Aç 9 +¤ !D      ð? £D      ð? ! A è 9  (Aj6  +!D-DTû!ù? ¡¤ D      ð? !D      ð? £!	 A4jÝ  AÐ j$  	C# Ak! $   6  6   ( (  Aj$ a# Ak! $   6  6 ((  (AvAtj! (Aq!   A t  Aj$ |||# A°k! $    6¬  6¨ (¬! AØj (¨Ö  (¨! Aj!  )(7(  ) 7   )7  )7  )7  ) 7  (¨! ( ! (! Aj  ¥  Aj  )7 Aj Aj  Aj  Aj¯  +!	 (¨!\n AØj!A !   ¥  Aàj  )Ø7 Aàj Aj  Aðj \n Aàj¯   	 +ð¡90 (¨!\r (! (! A°j  ¥  A¸j  )°7 A¸j Aj  AÈj \r A¸j¯  +È! (¨! Aj!A !   ¥  Aj  )7  Aj A j  A j  Aj¯    + ¡98 (¨!  AÐj) 7` Aè j  )`7( Aè j A(j  Aø j  Aè j¯  +x! (¨! A8j!A !   ¥  AÀ j  )870 AÀ j A0j  AÐ j  AÀ j¯    +P¡ +8£9@ â  A°j$ ?# Ak! $    6 (!  Aj  Aj$ Ê|# Aà k! $    6\\  9P (\\! +P! Aj! A8j  ­    +8¡9H Aj!  )(70  ) 7(  )7   )7  )7  ) 7  +H +( 9(  Aj  Aà j$ ­|# Aðk! $    6ì  9à (ì! Aj!  )(7Ø  ) 7Ð  )7È  )7À  )7¸  ) 7° Aj!D      ð?!A ·!	   	 	  	 	ª  Aè j A°j ­   +h9x +à +x¡!\n AÐ j A°j ­   \n +P +x¡£9`  +`9 A j Aj A°j®   )H7Ø  )@7Ð  )87È  )07À  )(7¸  ) 7° +x! Aj A°j ­    +¡9  +9Ð  A°j  Aðj$ Í# AÐk! $    6Ì  9À (Ì! Aj! A°j  ­  Aj! A j  ­  Aj!	 Aj 	 ­   +À9  ) 7H AÐ j  )H7  AÐ j    ) 70 A8j  )07 A8j Aj   ) 7 A j  )7 A j Aj  Aà j AÐ j A8j A j A°j A j AjÔ   Aà j  AÐj$ Ú|# Aà k! $    6\\  6X  9P  6L  6H (X! A Aq: G   +P (L (HÅ  (H! A  k6@@@ (@ (L (HkHAqE\r (@! (!	A!\n   	 \ntj 	o6< (@! (!    \ntj mAj68  AØjê  (<Ì 64   ê  (@ (HjÌ 60 ( !\r (! Aj \r ¥  (8! A j Aj   (4! A(j A j Ð  (0 )(7  Aj! (0! Aj  ­  (0!  )7  )7 (4+ (8· +0¢ ! (0 9 +P! (0!   + ¢9 (4-  ! (0 Aq:   (4A(j! (0A(j Ô   (@Aj6@  AAq: G@ - GAq\r   ë  Aà j$ W# Ak! $   6  6 (!   (  (l ( (l¥  Aj$ |# A0k! $    6,  6(  9  (,!  (( 6 A 6@@ ( ((ê ¹ IAqE\r ( (k! (!A!    tj o6 ( (k! (!	   	 tj 	mAj6  AØjê  (Ì 6  ((ê  (Ì 6 (+ (· +0¢ !\n ( \n9 + ! (!   + ¢9 (-  !\r ( \rAq:   (A(j! (A(j Ô   (Aj6  A0j$ # Ak!   6 ((# Ak!   6 (!  (  (l ( ( lk (j6@@@ (A HAq\r  ( (NAqE\r A Aq:  AAq:  - Aq[# A k! $    6  6 (!  ) 7  )7    Ajé  A j$ [# A k! $    6  6 (!  ) 7  )7    Ajê  A j$ h# A k! $    6  6  6 (!  ) 7 (!  )7      ë  A j$ A# Ak! $    6  6 ( (¥  Aj$ ]# Ak! $    6  6  6 ( ( ( ( (¦ §  Aj$ # Ak!   6  6E# Ak! $    6  6 ( (­ ! Aj$  Ç# A0k! $    6,  6(  6$  6  (,!  ( 6@@ ( ¼ MAqE\r @@ ( ¹ KAqE\r   (( ¹ ¨ 6 (( ( ( ©   ( ($ ( ¹ kÊ  ((! ($! ( ! Aj   ª   (6  («  ¬    (Ã É   (( ($ (Ê  A0j$ N# Ak! $    6  6 (! Aj ®  (! Aj$  g# A k! $    6  6  6 (! (! (! Aj   ª  (! A j$  O# Ak! $   6  6  6   ( ( (¯  Aj$ _# Ak! $    6  6 (!  ¹ 6  (º   (»  Aj$ |# Ak! $    6 (!@ ( A GAqE\r  ´     (  ¼   A 6 A 6 A 6  Aj$ -# Ak!   6  6 ( (kAØ mQ# Ak! $    6  6  (° 6 ( (±  Aj$ Â# A0k! $   6,  6(  6$ (,! ((! Aj  Ï  (! ( ! ($Ð !	 Aj Aj   	²   (, (³ 6  ($ (Ò 6   Aj AjÓ  A0j$ # Ak!   6 (=# Ak!   6  6 (! (!  (  AØ lj6 # Ak! $   6  6  6  6 @@ ( (GAqE\r (! (  Í   (AØ j6  ( AØ j6     Aj Ó  Aj$ E# Ak! $    6  6 ( (Ò ! Aj$  M# Ak! $    6  6  6 ( ( (µ  Aj$ J# Ak! $    6  6  6 ( (A¶  Aj$ # Ak! $    6  6  6  (At6 @@ (§ AqE\r  ( (  (ô  ( ( í  Aj$ # Ak!   6 (# Ak!   6 (At{# Ak! $    6  (À 6  6@@ (Av (MAqE\r  (! (¸ ! ! Aj$   AÔ   ?# Ak! $    6 (! Aj Á  Aj$ ]# Ak! $    6  6 (! A 6  A 6 A 6  (Â  Aj$  ý# Aà k! $    6\\  6X  6T  6P (\\! AÈ j ô  AÀ j ô  A8j í  A(j AÈ j AÀ j A8jÅ   (P (j6 A j í @ ($E\r  Aj í  Aj í  (!A  k! A 6 Aj Aj  AjÆ  Aà j$ x# Ak! $    6  6 (!  (Ç  Aj (AjÈ  Aj (AjÈ   (É  Aj$ "# Ak!   6 (AjA`q9# Ak! $    6 (Ê ! Aj$  C# Ak! $    6  6 (! Ë  Aj$  C# Ak! $    6  6 (! ·  Aj$  C# Ak!   6@@ (A KAqE\r  (AkAvAj!A ! P# Ak! $   6  6   ( (Ì 6    (6 Aj$ # A0k! $    6,  6(  6$  6  Aj ô  Aj ô  Aj ô    Aj Aj AjÎ  A0j$ r# A k! $    6  6  6  6 Aj ô  (Ï ! (!   Aj  Ð  A j$ P# Ak!   6  6  (( 6 (( ! ( 6  (! ( 6 P# Ak!   6  6  (( 6 (( ! ( 6  (! ( 6 A# Ak! $    6  6 ( (ö  Aj$ # Ak!   6Aÿÿÿÿ# Ak!   6 (g# Ak! $    6  6 (!@ ( À KAqE\r ¥   (AÍ ! Aj$  # Ak! $    6  6  (At6 @@ (§ AqE\r   (  (ï 6  ( é 6 (! Aj$  ö# A k! $    6  6  6  6 Aø j ô  Að j ô  Aj Aø j Að jÑ  Aj! AÔ j ô  AjAj! AÌ j ô  A<j ô  AÄ j A<jÒ  Aà j Aß j AÔ j AÌ j AÄ jÓ  A,j ô  Aà j! A$j ô  A4j A,j A$jÔ  Aj ô  Aà jAj! Aj ô  Aj Aj AjÕ    A4j AjÖ  A j$ # Ak!   6 (¡# A k! $    6  6  6  6@@ (A KAqE\r (( A G! Aj   Aj Aqó     (Aj6    ô  A j$ # A0k! $    6,  6(  6$ Aj ô  Aj AjÒ  Aj ô  Aj AjÒ    Aj AjÖ  A0j$ F# Ak! $    6  6  ô    Ú  Aj$ # Aà k! $    6\\  6X  6T  6P  6L@@ ( (FAqE\r  A<j ô  A4j ô  A,j ô  AÄ j A<j A4j A,j×     AÄ jØ  Aj ô  Aj ô  Aj ô  A$j Aj Aj AjÙ     A$jØ  Aà j$ f# A k! $    6  6  6 Aj ô  Aj ô    Aj AjÕ  A j$ f# A k! $    6  6  6 Aj ô  Aj ô    Aj AjÜ  A j$ K# Ak! $    6  6  6   ( (Û  Aj$ í# AÀ k! $    6<  68  64  60 A 6,   Þ 6(@ ((A JAqE\r @ (E\r  (! A  k6$  ($6  Aj A(jß ( 6  ( !  (( k6(  ($ ( k (à 6  ( (  (q6 (As! ( !   ( q6  (!	 ( !\n \n 	 \n( r6  (  (jAv!  (  Atj6   (  (jAq6  ( Aj6   ((A m6 ( á  (  (Atjá  ( á â  (At!  (( k6( (!\r  (  \rAtj6 @ ((A JAqE\r  (!  (  Atj6  ((! A  kã 6  ( (  (q6 (As! ( !   ( q6  (! ( !   ( r6   ((6   ô  AÀ j$ K# Ak! $    6  6  6   ( (Ý  Aj$ ò	&# Aà k! $    6\\  6X  6T  6P A 6L   Þ 6H@ (HA JAqE\r @ (E\r  (! A  k6D  (D6<  A<j AÈ jß ( 6@ (@!  (H k6H  (D (@k (à 68  ( (  (8q64 (! A  k60  (@6(  (06$  A(j A$j ( 6,  (0 (,k (à 68 (8As! ( !	 	  	( q6 @@ ( (KAqE\r  (4 ( (kt!\n ( !  \n ( r6  (4 ( (kv! ( !\r \r  \r( r6  (, (jAv!  (  Atj6   (, (jAq6 (,!  (@ k6@@ (@A JAqE\r  (@! A  kã 68 (8As! ( !   ( q6  (4 ( (,jv! ( !   ( r6   (@6  ( Aj6  (! A  k6   (ä 6@@ (HA NAqE\r  ( ( 6 (As! ( !   ( q6  ( (t! ( !   ( r6   ( Aj6  (! ( !   ( q6  ( ( v! ( !   ( r6   (HA k6H  ( Aj6  @ (HA JAqE\r  (H! A  kã 6  ( (  (q6  ( 6  AÈ j Ajß ( 6  (  (k (à 6 (As! ( !      ( q6  ( (t!! ( !" " ! "( r6  ( (jAv!#  (  #Atj6   ( (jAq6 (!$  (H $k6H@ (HA JAqE\r  (H!% A  %kã 6 (As!& ( !\' \' & \'( q6  ( (v!( ( !) ) ( )( r6   (H6   ô  Aà j$ <# Ak! $    6  6   ô  Aj$ `# Ak! $    6  6  6 (!  (ô  Aj (ô  Aj$  C# Ak! $    6  6  6   ô  Aj$ `# Ak! $    6  6  6 (!  (ô  Aj (ô  Aj$  G# Ak!   6  6 ((  (( kAuAt ((j ((kE# Ak! $    6  6 ( (å ! Aj$  L# Ak! $    6  6 (ä  (ã q! Aj$  # Ak!   6 (g# A k! $    6  6  6 (! (! (! Aj   æ  (! A j$  ## Ak!   6 (!A v## Ak!   6 (!A tp# Ak! $    6  6 (! (!@@ Aj  ç AqE\r  (! (! ! Aj$  O# Ak! $   6  6  6   ( ( (è  Aj$ 9# Ak!   6  6  6 ((  (( HAqÂ# A0k! $   6,  6(  6$ (,! ((! Aj  é  (! ( ! ($ê !	 Aj Aj   	ë   (, (ì 6  ($ (í 6   Aj Ajî  A0j$ `# Ak! $   6  6  (ê 6  (ê 6    Aj î  Aj$ 9# Ak! $    6 (ð ! Aj$  V# Ak! $   6  6  6  6    ( ( ( ï  Aj$ E# Ak! $    6  6 ( (í ! Aj$  E# Ak! $    6  6 ( (ò ! Aj$  D# Ak! $   6  6   ( (ñ  Aj$ # A k! $   6  6  6  ( (kAu6 ( ( (ó   ( (Atj6   Aj Ajô  A j$ 9# Ak! $    6 (á ! Aj$  H# Ak!   6  6  6 (!  (( 6   (( 6 R# Ak! $    6  6 ( ( (á kAuAtj! Aj$  u# Ak!   6  6  6  (6 @ ( A KAqE\r  (! (! ( AkAtAj!@ E\r    ü\n   (D# Ak! $   6  6   ( (õ  Aj$ H# Ak!   6  6  6 (!  (( 6   (( 6 # Ak!   6  6B# Ak!   6  6  6 (!  (6   (6 u# Ak! $    6  6@    AqE\r @@   ù ú AqE\r   û      Aj$ Q# Ak!   6 (!@@ (E\r   (Aj6 A6  ( A|j6  	# Ak!   6  6 ((  (( I!A! Aq! !@ \r  ((  (( F!A ! Aq!	 !\n@ 	E\r  (( ((I!\n \n! Aqk# A k! $    6  6 (! Aj ô  (! Aj ô  Aj Ajü  A j$ o# A0k! $    6,  6( A j    Aj    ) 7  )7 Aj Ajý  A0j$ L# Ak! $     :    þ   - Aqó  Aj$ N# Ak! $    6  6 ( ( Aqó ! Aj$  B# Ak!   6  6  6 (!  (6   (6 {# A0k! $    6,  6(  ) 7   ) 7 Aj ô   ) 7  )7    Aj  Aj  A0j$ # AÀk! $    6¼  6¸  ) 7   ) 7 A¨j  ) 7  )7  A¨j Aj    A¨j) 7x  A¨jAj) 7p Aà j ô  Aè j Aà jÒ  Aj Aj  )x7  )p7 Aj Aj Aj Aj Aè j   ) 7P  Aj) 7H AØ j  )P7(  )H7  AØ j A(j A j  A8j ô  AjAj! A0j ô  AÀ j A8j A0jÕ    AØ j AÀ j  AÀj$ # A0k! $   ) 7  A(j  ) 7  A(j    ) 7 Aj  )7 Aj Aj    A(j Aj  A0j$ # Að k! $    6l  6h  6d@@ ( (FAqE\r   ) 7P  ) 7H AÀ j ô  AÜ j  )P7  )H7  AÜ j Aj  AÀ j     AÜ j   ) 70  ) 7( A j ô  A8j  )07  )(7 A8j Aj Aj A j     A8j  Að j$ Z# A k! $   ) 7  ) 7  )7  )7    Aj   A j$ K# Ak! $    6  6  6   ( (  Aj$ A# Ak! $   ) 7  )7      Aj$ D# Ak! $   6  6   ( (  Aj$ Ý# A0k! $    6,  6( A 6$    6 @ ( A JAqE\r @ (E\r  (! A  k6  (6  Aj A jß ( 6 (!  (  k6   ( (k (à 6  ( (  (q6 (As! ( !   ( q6  (!	 ( !\n \n 	 \n( r6  ( (jAv!  (  Atj6   ( (jAq6  ( Aj6   ( A m6 (   (  (Atj  ( á   (At!  (  k6  (!\r  (  \rAtj6 @ ( A JAqE\r  (!  (  Atj6  ( ! A  kã 6  ( (  (q6  (As! ( !   ( q6  ( ! ( !   ( r6   ( 6   ô  A0j$ K# Ak! $    6  6  6   ( (  Aj$ ä	&# AÐ k! $    6L  6H A 6D    6@@ (@A JAqE\r @ (E\r  (! A  k6<  (<64  A4j AÀ jß ( 68 (8!  (@ k6@  (< (8k (à 60  ( (  (0q6, (! A  k6(  (86   ((6  A j Aj ( 6$  (( ($k (à 60 (0As! ( !	 	  	( q6 @@ ( (KAqE\r  (, ( (kt!\n ( !  \n ( r6  (, ( (kv! ( !\r \r  \r( r6  ($ (jAv!  (  Atj6   ($ (jAq6 ($!  (8 k68@ (8A JAqE\r  (8! A  kã 60 (0As! ( !   ( q6  (, ( ($jv! ( !   ( r6   (86  ( Aj6  (! A  k6  (ä 6@@ (@A NAqE\r  ( ( 6 (As! ( !   ( q6  ( (t! ( !   ( r6   ( Aj6  (! ( !   ( q6  ( (v! ( !   ( r6   (@A k6@  ( Aj6  @ (@A JAqE\r  (@! A  kã 6  ( (  (q6  (6  AÀ j Ajß ( 6  ( (k (à 6 (As! ( !      ( q6  ( (t!! ( !" " ! "( r6  ( (jAv!#  (  #Atj6   ( (jAq6 (!$  (@ $k6@@ (@A JAqE\r  (@!% A  %kã 6 (As!& ( !\' \' & \'( q6  ( (v!( ( !) ) ( )( r6   (@6   ô  AÐ j$ _# Ak! $    6  6  6 (!  () 7  Aj (ô  Aj$  Z# A k! $   ) 7  ) 7  )7  )7    Aj ¤  A j$ K# Ak!   6  6  6 (!  () 7  Aj () 7  \r    ) 7 _# Ak! $    6  6  6 (!  () 7  Aj (ô  Aj$  G# Ak!   6  6 ((  (( kAuAt ((j ((k# Ak!   6 (g# A k! $    6  6  6 (! (! (! Aj     (! A j$  O# Ak! $   6  6  6   ( ( (  Aj$ Â# A0k! $   6,  6(  6$ (,! ((! Aj    (! ( ! ($ê !	 Aj Aj   	   (, ( 6  ($ (í 6   Aj Aj  A0j$ `# Ak! $   6  6  ( 6  ( 6    Aj   Aj$ V# Ak! $   6  6  6  6    ( ( (   Aj$ E# Ak! $    6  6 ( ( ! Aj$  D# Ak! $   6  6   ( (  Aj$ 9# Ak! $    6 ( ! Aj$  D# Ak! $   6  6   ( (  Aj$ # A k! $   6  6  6  ( (kAu6 ( ( (    ( (Atj6   Aj Aj¡  A j$ H# Ak!   6  6  6 (!  (( 6   (( 6 E# Ak! $    6  6 ( (£ ! Aj$  H# Ak!   6  6  6 (!  (( 6   (( 6 9# Ak! $    6 ( ! Aj$  u# Ak!   6  6  6  (6 @ ( A KAqE\r  (! (! ( AkAtAj!@ E\r    ü\n   (D# Ak! $   6  6   ( (¢  Aj$ H# Ak!   6  6  6 (!  (( 6   (( 6 R# Ak! $    6  6 ( ( ( kAuAtj! Aj$  \r    ) 7 i# Ak! $    6 (!@ ( A GAqE\r   (  (´  A 6  A 6 A 6 Aj$ A# Ak! $    6  6 ( (§  Aj$ # Ak!   6  6Î# A k! $    6  6 A Aq:   ©  (!A  Atj( ! Aj     Ajª  Aj  (!  A  Atj( 6    (« 9 AAq: @ - Aq\r   ¬  A j$ <# Ak! $    6 (! å  Aj$  G# Ak! $    6  6 (!  (­  Aj$  <|# Ak! $    6 (¸ ! Aj$  <# Ak! $    6 (!   Aj$  Ö# A k! $    6  6 (!  @ ÷ AqE\r   î   é   (ß 6  (÷ As:   (ê  (!  (6  ) 7  (!A !  ë  (ï !  :   Ajì @@ - AqE\r   (GAqE\r  ( (í  (A ù @ ÷ Aq\r  ( GAqE\r   ø ù  A j$ Ô# A0k! $    6,  6( A6$  A(j A$j¯ ( 6( A Aq: #  °  A 6@@ ( ((HAqE\r (!  ¨    ±  ¬   (Aj6  AAq: #@ - #Aq\r   ²  A0j$ E# Ak! $    6  6 ( (³ ! Aj$  Q# Ak! $    6 (! A 6  A 6 A 6 ´  Aj$  B# Ak! $    6  6 ( (µ  Aj$ L# Ak! $    6 (! Aj ¶  Aj·  Aj$  p# Ak! $    6  6 (! (!@@ Aj  ã AqE\r  (! (! ! Aj$  <# Ak! $    6 (! ñ  Aj$  # Ak! $    6  6 (!  (6@@ ( (IAqE\r   (   (Aj6   ( 6  (6 (Ahj! Aj$  1# Ak!   6  6 (!  (6  y# Ak! $    6 (!@ ( ( A GAqE\r  ( ò  ( ó  (  ( (  ( ô õ  Aj$ ¢# Ak! $    6  6  9  9x  9p A : o  ¹   +x (¸¢ +£ü6h  +p (¸¢ +£ü6d  (h6`@@ (` (dLAqE\r AÈ jÃ  (`! A$j  Aì ! A0j A$j º  (! Aj    A<j A0j Aj»  AÈ j A<jª  A<j  Aj  A0j  A$j   (`· +¢ (¸£9X@ +X +xDíµ ÷Æ°>¡fAqE\r  +X +pDíµ ÷Æ°> eAqE\r    AÈ j¼  AÈ jÄ   (`Aj6`    à 6   á 6 ( (½  AAq: o@ - oAq\r   ¾  Aj$ Q# Ak! $    6 (! A 6  A 6 A 6 ¿  Aj$  Q# Ak! $    6  6  6   ( ( ³  Aj$ Q# Ak! $    6  6  6   ( (À ³  Aj$ B# Ak! $    6  6 ( (Á  Aj$ Z# A k! $    6  6  (6  (6 ( ( AjÂ  A j$ L# Ak! $    6 (! Aj Ã  AjÄ  Aj$  <# Ak! $    6 (! ª  Aj$  V# Ak! $    6  6 ( (Þ  (ß  ! Aj$  # Ak! $    6  6 (!  (6@@ ( (IAqE\r   (º   (Aj6   (» 6  (6 (Ahj! Aj$  Î# A0k! $    6,  6(  6$  (,6   ((6 (  (â   (,6 (ã !  ((6  (ã  ($ä   (,6 (ã !  ((6  (ã  ($å  A0j$ 1# Ak!   6  6 (!  (6  y# Ak! $    6 (!@ ( ( A GAqE\r  ( «  ( ¬  (  ( (  ( ­ ®  Aj$ ö\n	# Aàk! $    6Ü  6Ø  6Ô  9È  9À A´j¹  A¨j°  A6¤@@ (¤ (ÔHAqE\r  (¤6  A ·9  6  (Æ 6  (Ç 6@@ Aj AjÈ AqE\r AjÉ ! Aðj Ê @@ (  (üp\r (ü!  (  n6   + + 9  Aðj¬  AjË    ( AF: ï@ - ïAqE\r  AÐj©  (¤! AÄj   AÐj AÄjª  AÄj   (¤6Ü  +9à A¨j AÐj±  AÐj¬   (¤Aj6¤   A¨j6À  (ÀÆ 6¼  (ÀÇ 6¸@@@ A¼j A¸jÈ AqE\r A¼jÉ !	 A j 	Ê   A¨j6  (Æ 6  (Ç 6@@ Aj AjÈ AqE\r AjÉ !\n Aø j \nÊ @@ (¬ (Ì AKAqE\r  A6t@ (¬ (ÔMAqE\r  ( (ÔMAqE\r  AØ jÃ  A j! AÀ j A Í  Aø j! AÌ j AÀ j Î  AØ j AÌ jª  AÌ j  AÀ j   +° +¡9h A´j AØ j¼  AØ jÄ  A 6t Aø j¬ @@ (t\r   AjË   A j¬  A¼jË   A Aq: ?  ¹   A´j68  (8à 64  (8á 60@@ A4j A0jâ AqE\r A4jã !\r Aj \rÕ @ +( +ÈDíµ ÷Æ°>¡dAqE\r  +( +ÀDíµ ÷Æ°> cAqE\r    Aj¼  AjÄ  A4jä     à 6   á 6 ( (Ï  AAq: ? A6t@ - ?Aq\r   ¾  A¨j²  A´j¾  Aàj$  R# Ak! $    6 (!   ( Ð Ñ 6 (! Aj$  R# Ak! $    6 (!   (Ð Ñ 6 (! Aj$  K# Ak! $    6  6 ( (Ò AsAq! Aj$  # Ak!   6 (( m# Ak! $    6  6 (!  (õ  Aj! (Aj!  (6  ) 7  Aj$  -# Ak!   6 (!  ( Aj6  g# Ak! $    6  6 (! Aj Ó ! (!  Aj Ó Ô ! Aj$  # A0k! $    6,  6(  6$ ((Õ  ((! Aj Ö  ($! Aj ×  A#j  )7  )7    A#j Aj Ø  A0j$ Q# Ak! $    6  6  6   ( (À ³  Aj$ Z# A k! $    6  6  (6  (6 ( ( AjÙ  A j$ # Ak!   6 (O# Ak! $    6  6 (! Aj   (! Aj$  O# Ak! $    6  6 (ä  (ä FAq! Aj$  ## Ak!   6  6 (Ü# A k! $    6  6@ ( (IAqE\r   (6  (6  (6@@ (\r   (6 (!  ( p6@ (\r   (6  ( (r6  (å 6 (å !  ( v6@  ( (å v6@@ ( (KAqE\r   ( (k6  (6  ( (k6 (\r   ( (t6 (! A j$  # Ak!   6J# Ak! $   6 (!   Þ  ß   Aj$ T# Ak! $    6  6 (!  (6   ( 6 Aj$  # A k! $    6  6 A Aq:     j! (ö     Aj    ì í 6 (      (  j      (    jj! A :   Ajì  AAq: @ - Aq\r     A j$ Î# A0k! $    6,  6(  6$  (,6   ((6 (  (â   (,6 (ã !  ((6  (ã  ($«   (,6 (ã !  ((6  (ã  ($¬  A0j$ ô# Aàk! $    6Ü  6Ø  6Ô  9È  9À A Aq: ¿  ¹   (ÔÛ 9° A6¨  (Ô· +È ¢ü6¤  A¨j A¤jÜ ( 6¬  (Ô· +À ¢ü6   (¬6@@ ( ( LAqE\r AjÃ   ( (ÔÝ 6|  ( (|m6x  (Ô (|m6t (x! AÐ j   AÜ j AÐ jA º  (t! AÄ j   Aè j AÜ j AÄ j»  Aj Aè jª  Aè j  AÄ j  AÜ j  AÐ j   +°9  (6@  6<  (<Æ 68  (<Ç 64@@ A8j A4jÈ AqE\r A8jÉ ! Aj Ê @@ (@ ($p\r ($!	  (@ 	n6@  +( + 9  Aj¬  A8jË    (@Û  + 9@ + +ÈDíµ ÷Æ°>¡fAqE\r  + +ÀDíµ ÷Æ°> eAqE\r    Aj¼  AjÄ   (Aj6    à 6   á 6 ( (Þ  AAq: ¿@ - ¿Aq\r   ¾  Aàj$ <|# Ak! $    6 (· ! Aj$  E# Ak! $    6  6 ( (ß ! Aj$  g# Ak! $    6  6 (! Aj à ! (!  Aj à Ô ! Aj$  Z# A k! $    6  6  (6  (6 ( ( Ajá  A j$ p# Ak! $    6  6 (! (!@@ Aj  ã AqE\r  (! (! ! Aj$  # Ak! $    6  6@@ (A NAqE\r   (6@ (æ FAqE\r  (! A  k6 (! A  k6 (! Aj$  Î# A0k! $    6,  6(  6$  (,6   ((6 (  (â   (,6 (ã !  ((6  (ã  ($Ã   (,6 (ã !  ((6  (ã  ($Ä  A0j$ c# Ak! $    6  6 (!  (Ü 6    ( 6 (! Aj$  9# Ak!   6  6  6 ((  (( HAq# Ak!   6 (( &# Ak!   6 (! hA  	 ç 	 Ax:~# Ak!   7 )! z§! B Q!AÀ   AqM# Ak! $    6  6  6 ( ( (î  Aj$ A# Ak! $    6  6 ( (ï  Aj$ V# Ak!   6  6 (! - ! - !Aÿ !   q Aqr:    - q: 2# Ak!   6  6 (-  ! ( :  e# Ak! $    6  6 (!  Þ  (jAj Þ  ß jAjþ  Aj$ J# Ak! $    6  6  6 ( (Að  Aj$ # Ak!   6  6# Ak! $    6  6  6  (A t6 @@ (§ AqE\r  ( (  (ô  ( ( í  Aj$ # Ak!   6 (X# Ak! $    6 (!  ö 6  ( ÷   (ø  Aj$ a# Ak! $    6 (!  ù  ö Alj ù  ô Aljú  Aj$ ,# Ak!   6 (! ( ( kAmM# Ak! $    6  6  6 ( ( (û  Aj$ ,# Ak!   6 (! ( ( kAm# Ak! $    6  6 (!  (6@@ ( (GAqE\r (Ahj!  6  ü ý    (6 Aj$ e# Ak! $    6  6 (!  ù  (Alj ù  ö Aljú  Aj$ <# Ak! $    6 (( ü ! Aj$  k# Ak! $    6  6  6 (! ù  ù  ô Alj ( (ÿ  Aj$ J# Ak! $    6  6  6 ( (A  Aj$ # Ak!   6 (A# Ak! $    6  6 ( (þ  Aj$ =# Ak! $    6  6 (¬  Aj$ ,# Ak!   6  6  6  6 # Ak! $    6  6  6  (Al6 @@ (§ AqE\r  ( (  (ô  ( ( í  Aj$ y# A k! $    6  6 (! Aj A   (ü  (   (Aj6 Aj  A j$ °# A k! $    6  6 (!  ö Aj ! ö ! Aj      (ü  (   (Aj6  Aj  (! Aj  A j$  ~# Ak! $    6  6  6 (!  (6   ((6  (( (Alj6 (  (  Aj$  M# Ak! $    6  6  6 ( ( (  Aj$ # Ak! $    6 (!  6 (! (  6@ ( (GAqE\r  (  ( ( ( kAmø  (! Aj$  Á# A k! $    6  6 (!   6@ ( (KAqE\r     ô 6@@ ( (AvOAqE\r   (6  (At6  Aj AjÅ ( 6 (! A j$  ß# A k! $    6  6  6  6 (!  6 A 6  (6@@ (\r  A 6  (! (! Aj     (6   (6 (  (Alj!  6  6  (  (Alj6 (!	 A j$  	# Ak! $    6  6 (! ó  ((! ( ( kAm!  A  kAlj6  ( ü  (ü  (ü   (! ( 6  ( 6  (Aj  Aj (Aj  Aj (Aj  ((! ( 6   ö   Aj$ r# Ak! $    6 (!  6  @ ( A GAqE\r  ( (   õ  (! Aj$  q# Ak! $    6  6 (!  ù  ö Alj ù  ö Alj (Aljú  Aj$ I# Ak! $    6  6  6 ( (Ê  Aj$ \\# Ak! $    6  ( 6  6 Aj Aj ( ! Aj$   AÔ   P# Ak! $   6  6   ( ( 6    (6 Aj$ # AÀ k! $    6<  68  64  60  (06, (<! Aj  A,j A0j  Aj  (6  )7  Aj    (86@@ ( (4GAqE\r (< (0ü  (   (Aj6  (0Aj60  Aj  (< (8 (4  Aj  AÀ j$ P# Ak!   6  6  (( 6 (( ! ( 6  (! ( 6 e# Ak! $    6  6 (!  ù  ô Alj ù  (Aljú  Aj$ ># Ak! $    6 (!  (¨  Aj$ ,# Ak!   6 (! ( ( kAm9# Ak! $    6 ( ! Aj$  # Ak!   6AªÕªÕ g# Ak! $    6  6 (!@ (  KAqE\r ¥   (A ! Aj$  # Ak! $    6  6  (Al6 @@ (§ AqE\r   (  (ï 6  ( é 6 (! Aj$  S# Ak!   6  6  6  6  (!  (6   (6  ( 6 ]# A k! $    6  (6  ) 7  (6  )7      A j$ M# Ak! $    6  6  6 ( ( (  Aj$ !# Ak!   6 (A: n# Ak! $    6  6  6@@ ( (GAqE\r ( (ý   (Aj6  Aj$ V# Ak! $    6 (!  6@ - Aq\r     (! Aj$  ;# Ak!   6 (!  (6  ) 7  A :  I# Ak! $    6  6  6 ( (¡  Aj$ z# Ak! $    6 (! ( ! (( ! Aj ¢  (( ! Aj ¢   ( (£  Aj$ m# Ak! $    6  6 (!  (³  Aj! (Aj!  (6  ) 7  Aj$  1# Ak!   6  6 (!  (6  x# Ak! $   6  6   6@@ Aj Aj¤ AqE\r ( Aj¥ ý  Aj¦   Aj$ O# Ak! $    6  6 (§  (§ GAq! Aj$  7# Ak!   6  (( 6 (Ahj!  6 -# Ak!   6 (!  ( Ahj6  # Ak!   6 (( A# Ak! $    6  6 ( (©  Aj$ y# Ak! $    6  6 (!@@ ( (GAqE\r (! (Ahj!  6  ü ý   Aj$ # Ak!   6 (X# Ak! $    6 (!  ¯ 6  ( °   (±  Aj$ a# Ak! $    6 (!  ²  ¯ Alj ²  ­ Alj³  Aj$ ,# Ak!   6 (! ( ( kAmM# Ak! $    6  6  6 ( ( (´  Aj$ ,# Ak!   6 (! ( ( kAm# Ak! $    6  6 (!  (6@@ ( (GAqE\r (Ahj!  6  µ ¶    (6 Aj$ e# Ak! $    6  6 (!  ²  (Alj ²  ¯ Alj³  Aj$ <# Ak! $    6 (( µ ! Aj$  k# Ak! $    6  6  6 (! ²  ²  ­ Alj ( (¸  Aj$ J# Ak! $    6  6  6 ( (A¹  Aj$ # Ak!   6 (A# Ak! $    6  6 ( (·  Aj$ =# Ak! $    6  6 (Ä  Aj$ ,# Ak!   6  6  6  6 # Ak! $    6  6  6  (Al6 @@ (§ AqE\r  ( (  (ô  ( ( í  Aj$ y# A k! $    6  6 (! Aj A¼   (µ  (½   (Aj6 Aj¾  A j$ °# A k! $    6  6 (!  ¯ Aj¿ ! ¯ ! Aj   À   (µ  (½   (Aj6  AjÁ  (! AjÂ  A j$  ~# Ak! $    6  6  6 (!  (6   ((6  (( (Alj6 (  (Ã  Aj$  M# Ak! $    6  6  6 ( ( (Ä  Aj$ # Ak! $    6 (!  6 (! (  6@ ( (GAqE\r  (  ( ( ( kAm±  (! Aj$  Á# A k! $    6  6 (!  Å 6@ ( (KAqE\r Æ    ­ 6@@ ( (AvOAqE\r   (6  (At6  Aj AjÅ ( 6 (! A j$  ß# A k! $    6  6  6  6 (!  6 A 6  (6@@ (\r  A 6  (! (! Aj  Ç   (6   (6 (  (Alj!  6  6  (  (Alj6 (!	 A j$  	# Ak! $    6  6 (! ¬  ((! ( ( kAm!  A  kAlj6  ( µ  (µ  (µ È  (! ( 6  ( 6  (AjÉ  Aj (AjÉ  Aj (AjÉ  ((! ( 6   ¯ Ê  Aj$ r# Ak! $    6 (!  6 Ë @ ( A GAqE\r  ( (  Ì ®  (! Aj$  q# Ak! $    6  6 (!  ²  ¯ Alj ²  ¯ Alj (Alj³  Aj$ I# Ak! $    6  6  6 ( (Õ  Aj$ \\# Ak! $    6  (Í 6  6 Aj Aj ( ! Aj$   AÔ   P# Ak! $   6  6   ( (Ï 6    (6 Aj$ # AÀ k! $    6<  68  64  60  (06, (<! Aj  A,j A0jÑ  Aj  (6  )7  Aj Ò   (86@@ ( (4GAqE\r (< (0µ  (Ó   (Aj6  (0Aj60  AjÔ  (< (8 (4Õ  AjÖ  AÀ j$ P# Ak!   6  6  (( 6 (( ! ( 6  (! ( 6 e# Ak! $    6  6 (!  ²  ­ Alj ²  (Alj³  Aj$ ># Ak! $    6 (!  (à  Aj$ ,# Ak!   6 (! ( ( kAm9# Ak! $    6 (Î ! Aj$  # Ak!   6AªÕªÕ g# Ak! $    6  6 (!@ ( Í KAqE\r ¥   (AÐ ! Aj$  # Ak! $    6  6  (Al6 @@ (§ AqE\r   (  (ï 6  ( é 6 (! Aj$  S# Ak!   6  6  6  6  (!  (6   (6  ( 6 ]# A k! $    6  (6  ) 7  (6  )7    ×  A j$ M# Ak! $    6  6  6 ( ( (Ø  Aj$ !# Ak!   6 (A: n# Ak! $    6  6  6@@ ( (GAqE\r ( (¶   (Aj6  Aj$ V# Ak! $    6 (!  6@ - Aq\r  Ù  (! Aj$  ;# Ak!   6 (!  (6  ) 7  A :  I# Ak! $    6  6  6 ( (²  Aj$ z# Ak! $    6 (! ( ! (( ! Aj Ú  (( ! Aj Ú   ( (Û  Aj$ 1# Ak!   6  6 (!  (6  x# Ak! $   6  6   6@@ Aj AjÜ AqE\r ( AjÝ ¶  AjÞ   Aj$ O# Ak! $    6  6 (ß  (ß GAq! Aj$  7# Ak!   6  (( 6 (Ahj!  6 -# Ak!   6 (!  ( Ahj6  # Ak!   6 (( A# Ak! $    6  6 ( (á  Aj$ y# Ak! $    6  6 (!@@ ( (GAqE\r (! (Ahj!  6  µ ¶   Aj$ # Ak!   6  6C# Ak! $    6  (6 (é ! Aj$  # Ak! $    6  6  6@@ ( (FAqE\r   ( (kAmæ ç At6  ( ( ( ( AAqè  Aj$ %# Ak!   6  6  6# Ak!   6 (@# Ak! $    6 (ê !A k! Aj$  Ò	# AÀ k! $    6<  68  64  60  : / A6( A6$@@  (8 (<kAm6  ( ! AK@@@@@@    (4! (8Ahj!  68@   (<ë AqE\r  A<j A8jì  (<!	 (<Aj!\n (8Ahj!  68 	 \n  (4í  (<! (<Aj!\r (<A0j! (8Ahj!  68  \r   (4î  (<! (<Aj! (<A0j! (<AÈ j! (8Ahj!  68      (4ï @ ( AHAqE\r @@ - /AqE\r  (< (8 (4ð  (< (8 (4ñ @ (0\r  (< (8 (8 (4ò   (0Aj60  ( Am6@@ ( AJAqE\r  (< (< (Alj (8Ahj (4í  (<Aj (< (AkAlj (8APj (4í  (<A0j (< (AjAlj (8A¸j (4í  (< (AkAlj (< (Alj (< (AjAlj (4í   (< (Alj6 A<j Ajó  (< (Alj (< (8Ahj (4í @ - /Aq\r  (4 (<Ahj (<ë Aq\r   (< (8 (4ô 6<@@A AqE\r  (<! (8! (4! Aj   õ  (<! (8! (4! Aj   ö   (6@ - AqE\r   (< ( (4÷ Aq: @ (Aj (8 (4÷ AqE\r @ - AqE\r   (68@ - AqE\r  (Aj!  6  6< (< ( (4 (0 - /Aqè  A : / (Aj!  6  6<  AÀ j$ 9# Ak! $    6 Aj ! Aj$  &# Ak!   6 (! gA  9# Ak!   6  6  6 (+ (+cAqG# Ak! $    6  6 ((  (( ø  Aj$ à# A k! $    6  6  6  6@@ ( ( (ë Aq\r @ ( ( (ë Aq\r  A Aq:  Aj Ajì @ ( ( (ë AqE\r  Aj Ajì  AAq: @ ( ( (ë AqE\r  Aj Ajì  AAq:  Aj Ajì @ ( ( (ë AqE\r  Aj Ajì  AAq:  - Aq! A j$  ë# A k! $    6  6  6  6  6 ( ( ( (í @ ( ( (ë AqE\r  Aj Ajì @ ( ( (ë AqE\r  Aj Ajì @ ( ( (ë AqE\r  Aj Ajì  A j$ ¤# A k! $    6  6  6  6  6  6 ( ( ( ( (î @ ( ( (ë AqE\r  Aj Ajì @ ( ( (ë AqE\r  Aj Ajì @ ( ( (ë AqE\r  Aj Ajì @ ( ( (ë AqE\r  Aj Ajì  A j$ 	# AÀ k! $    6<  68  64@@ (< (8FAqE\r   (<60  (0Aj60@ (0 (8GAqE\r  (06,  (,Ahj6,@ (4 (0 (,ë AqE\r  A0jù ! Aj ²   (,6  (06,@ Ajù ! (, ú   (6, (, (<G!A ! Aq! !	@ E\r  (4!\n (Ahj!  6 \n Aj ë !	 	Aq\r  (, Ajú  AjÄ   (0Aj60  AÀ j$ Û# AÀ k! $    6<  68  64@@ (< (8FAqE\r   (<Ahj60  (<Aj6,@ (, (8GAqE\r  (,Ahj6(@ (4 (, ((ë AqE\r  A,jù ! Aj ²   ((6  (,6(@ Ajù ! (( ú   (6( (4! (Ahj!  6  Aj ë Aq\r  (( Ajú  AjÄ   (,Aj6,  AÀ j$ ¿# A k! $    6  6  6  6@@ ( (FAqE\r   ( (û 6 ( (ü   ( ( ( (ý 6 ( (ü   (6 (! A j$  G# Ak! $    6  6 ((  (( ø  Aj$ è# AÀ k! $    6<  68  64  (<60  (86, A<jù ! Aj ²  (4! (8Ahj!@@  Aj ë AqE\r @  (<Aj6< (4! (<!  Aj ë AsAq\r @ (<Aj!	  	6< 	 (8I!\nA ! \nAq! !\r@ E\r  (4! (<!  Aj ë As!\r@ \rAqE\r @ (< (8IAqE\r @  (8Ahj68 (4! (8!  Aj ë Aq\r @@ (< (8IAqE\r A<j A8jì @  (<Aj6< (4! (<!  Aj ë AsAq\r @  (8Ahj68 (4! (8!  Aj ë Aq\r    (<Ahj6@ (0 (GAqE\r  Ajù ! (0 ú  ( Ajú  (<! AjÄ  AÀ j$  Þ# AÐ k! $   6L  6H  6D  (L6@  (H6< AÌ jù ! A j ²  (D! (HAhj!@@  A j ë AqE\r @  (LAj6L (D! (L!	  A j 	ë AsAq\r @ (LAj!\n  \n6L \n (HI!A ! Aq!\r !@ \rE\r  (D! (L!  A j ë As!@ AqE\r @ (L (HIAqE\r @  (HAhj6H (D! (H!  A j ë Aq\r   (L (HO: @ - Aq\r  AÌ j AÈ jì   (LAj6L  (HAhj6 B 7 B 7@@ ( (LkAmAÿ NAqE\r@ )B QAqE\r  (L (D A j Ajþ @ )B QAqE\r  ( (D A j Ajÿ  (L ( Aj Aj  )B Q!AÀ A  Aq!  (L Alj6L )B Q!AÀ A  Aq!  (A  kAlj6  (D! AÌ j Aj  A j Aj Aj  AÌ j Aj Aj Aj   (LAhj6@ (@ (GAqE\r  Ajù ! (@ ú  ( A jú    Aj Aj  A jÄ  AÐ j$ º	# AÀ k! $   6<  68  64  (<60  (86, A<jù ! Aj ² @  (<Aj6< (4 (< Ajë Aq\r @@ (0 (<AhjFAqE\r @ (< (8I!A ! Aq! !	@ E\r  (4!\n (8Ahj!  68 \n  Ajë As!	@ 	AqE\r @  (8Ahj68 (4 (8 Ajë AsAq\r   (< (8OAq: @@ (< (8IAqE\r A<j A8jì @  (<Aj6< (4 (< Ajë Aq\r @  (8Ahj68 (4 (8 Ajë AsAq\r    (<Ahj6@ (0 (GAqE\r  Ajù ! (0 ú  ( Ajú    Aj Aj  AjÄ  AÀ j$ þ# AÀ k! $    68  64  60 (4 (8kAm! AK@@@@@@@    AAq: ? (0! (4Ahj!  64@   (8ë AqE\r  A8j A4jì  AAq: ? (8! (8Aj! (4Ahj!	  	64   	 (0í  AAq: ? (8!\n (8Aj! (8A0j! (4Ahj!\r  \r64 \n   \r (0î  AAq: ? (8! (8Aj! (8A0j! (8AÈ j! (4Ahj!  64      (0ï  AAq: ?  (8A0j6, (8 (8Aj (, (0í  A6( A 6$  (,Aj6 @@ (  (4GAqE\r@ (0 (  (,ë AqE\r  A jù ! Aj ²   (,6  ( 6,@ Ajù ! (, ú   (6, (, (8G!A ! Aq! !@ E\r  (0! (Ahj!  6  Aj ë ! Aq\r  (, Ajú  ($Aj!  6$@@ AFAqE\r  ( Aj!  6    (4FAq: ? A6  A 6  AjÄ @ (     ( 6,  ( Aj6   AAq: ? - ?Aq! AÀ j$   A# Ak! $    6  6 ( (  Aj$ <# Ak! $    6  (( ! Aj$  U# Ak! $    6  6 (!  (ª   (+9 Aj$  ## Ak!   6  6 (# Ak!   6  6µ# A k! $    6  6  6  6@@ ( (FAqE\r   ( (û 6 ( ( (   ( (kAm6  (6@@ ( (GAqE\r@ ( ( (ë AqE\r  Aj Ajì  ( ( ( (   (Aj6  ( ( (   (6 (! A j$  È~# A k! $    6  6  6  6  (6 A 6@@ (AÀ HAqE\r  ( ( (ë As:  - Aq­ (­! (!   ) 7   (Aj6  (Aj6  A j$ Å~# A k! $    6  6  6  6  (6 A 6@@ (AÀ HAqE\r  ( ( (ë :  - Aq­ (­! (!   ) 7   (Aj6  (Ahj6  A j$ ~# A k! $    6  6  6  6@ () B R!A ! Aq! !@ E\r  () B R!@ AqE\r   () è 6 ()  !	 ( 	7   () è 6 ()  !\n ( \n7   ( (Alj6 (! (!  A  kAlj6  Aj   A j$ Ù~~# AÀ k! $    6<  68  64  60  6,  6(  (8(  (<( kAmAj6$@@ (,) B QAqE\r  (() B QAqE\r   ($Am6   ($ ( k6@@ (,) B QAqE\r   ($AÀ k6  AÀ 6 AÀ 6   ($AÀ k6@ (,) B QAqE\r   (<( 6 A 6@@ ( ( HAqE\r  (4 ( (0ë As:  - Aq­ (­! (,!   ) 7   (Aj6  (Aj6 @ (() B QAqE\r   (8( 6 A 6@@ ( (HAqE\r  (4 ( (0ë :  - Aq­ (­!	 ((!\n \n 	 \n) 7   (Ahj6  (Aj6  (<(  (8(  (, (( @@ (,) B QAqE\r  ( !A ! ! (<!\r \r \r(  Alj6 @@ (() B QAqE\r  (!A ! ! (8!  ( A  kAlj6  AÀ j$ ï~~# A k! $    6  6  6  6@@ () B RAqE\r @@ () B RAqE\r ()  ! A? k6 (­!B B}! (!   ) 7   ((  (Alj6@ ( (( GAqE\r  (!	 Aj 	ì  (!\n \n \n( Ahj6   (( Aj! ( 6 @ () B RAqE\r @@ () B RAqE\r ()  ! A? k6 (­!\rB \rB}! (!   ) 7  (( ! (!  A  kAlj6 @ (  (( GAqE\r  (!  ì  (!  ( Aj6   A j$ D# Ak! $   6  6   ( (  Aj$ o# A k! $    6  6 (!  ²  (! ( ú  ( ú  Ä  A j$  ¼# A k! $    6  6  6  (6  ( (kAm6@ (AJAqE\r   (AkAm6@@ (A NAqE\r ( ( ( ( (Alj   (Aj6  A j$ # A0k! $    6,  6(  6$  6   (  (,kAm6@@@ ($AHAq\r  ($AkAm (HAqE\r  (AtAj6  (, (Alj6@ (Aj ($HAqE\r  (( ( (Ajë AqE\r   (Aj6  (Aj6@ (( ( ( ë AqE\r  A jù !  ² @@ Ajù ! (  ú   (6 @ ($AkAm (HAqE\r   (AtAj6  (, (Alj6@ (Aj ($HAqE\r  (( ( (Ajë AqE\r   (Aj6  (Aj6 (( ( ë AsAq\r  (  ú  Ä  A0j$ ¾# A k! $    6  6  6  (6  (6  ( (kAm6@@ (AJAqE\r ( ( ( (   (Ahj6  (Aj6  ( ( (å  A j$ °# AÀ k! $    6<  68  64  60  (46,@ (0AJAqE\r  A<jù ! Aj ²   (< (, (0 6  (8Ahj68@@ ( (8FAqE\r  ( Ajú  A8jù ! ( ú   (Aj6 (8 Ajú  (< ( (, ( (<kAm  AjÄ  AÀ j$ # A k! $    6  6  6  (6  (6 A 6 (Aj!  ( Alj6  (AtAj6@ (Aj (HAqE\r  ( ( (Ajë AqE\r   (Aj6  (Aj6 Ajù ! ( ú   (6@ ( (AkAmJAqE\r  (! A j$   Ç# A0k! $    6,  6(  6$  6 @ ( AJAqE\r   ( AkAm6   (, ( Alj6 ($! (! ((Ahj!  6(@   ë AqE\r  A(jù !  ² @@ Ajù !	 (( 	ú   (6(@ ( \r   ( AkAm6   (, ( Alj6 ($ ( ë Aq\r  (( ú  Ä  A0j$ 9~# Ak!   7 )! )! )!  B  }G# Ak! $    6  6 ((  (( ø  Aj$ :~# Ak!   7 )! y§! B Q!AÀ   AqK# Ak!   6  6  6 (!  (( 6   (-  Aq:  9# Ak! $    6 ( ! Aj$  F# Ak! $    6  (( 6 ( ! Aj$  ?# Ak! $    6 Aj µ ! Aj$  1# Ak!   6  6 (!  (6  # Ak!   6 ((# A0k! $    6$  6   6 ($!  6,@ (   KAqE\r   @@ (  AqE\r  A 6 B 7  (6  )7   ( ë   (  Aj6   ( 6 ( (   (    (¡   ( ¢   ( ù  (,! A0j$  # Ak!   6 (( W# Ak! $    6  6  6 ( ( (£  (! Aj$  B# Ak!   6  6  6  (!  (6   ( 6 9# Ak! $    6 (Ü ! Aj$  ¸# A k! $    6  (¤ 6@@ (¥ AvMAqE\r   (Ak6  (Ak6 A : @@ - AqE\r  (AkAk! (AvAkAk!  6 (! A j$   Aµ   "# Ak!   6 (AIAq# Ak! $    6@@ (AIAqE\r  A\n6 A6  (Aj¦ Ak6 @ ( AFAqE\r   ( Aj6   ( 6 (! Aj$  E# Ak! $    6  6 ( (§ ! Aj$  # Ak!   6  6f# Ak!   6  6 (! (A v! (!  Aÿÿÿÿq Axqr6  (AÿÿÿÿqAxr6+# Ak!   6  6 ( (6 +# Ak!   6  6 ( (6u# Ak!   6  6  6  (6 @ ( A KAqE\r  (! (! ( AkA tAj!@ E\r    ü\n   (9# Ak! $    6 (¨ ! Aj$  	 © "# Ak!   6 (AjAxqg# Ak! $    6  6 (!@ ( ¤ KAqE\r ¥   (Aª ! Aj$  # Ak!   6A A# Ak! $    6  6  (A t6 @@ (§ AqE\r   (  (ï 6  ( é 6 (! Aj$  # Ak! $    6  6  6@@ ( (FAqE\r   ( (kAmæ ç At6  ( ( ( ( AAq­  Aj$ %# Ak!   6  6  6«"# A°k! $    6¬  6¨  6¤  6   :  A6 A6@@  (¨ (¬kAm6 (! AK@@@@@@    (¤! (¨Ahj!  6¨ Aø j Õ  (¬!	 Aà j 	Õ   Aø j Aà j® !\n Aà jÄ  Aø jÄ @ \nAqE\r  A¬j A¨jì  (¬! (¬Aj! (¨Ahj!\r  \r6¨   \r (¤¯  (¬! (¬Aj! (¬A0j! (¨Ahj!  6¨     (¤°  (¬! (¬Aj! (¬A0j! (¬AÈ j! (¨Ahj!  6¨      (¤± @ (AHAqE\r @@ - AqE\r  (¬ (¨ (¤²  (¬ (¨ (¤³ @ ( \r  (¬ (¨ (¨ (¤´   ( Aj6   (Am6\\@@ (AJAqE\r  (¬ (¬ (\\Alj (¨Ahj (¤¯  (¬Aj (¬ (\\AkAlj (¨APj (¤¯  (¬A0j (¬ (\\AjAlj (¨A¸j (¤¯  (¬ (\\AkAlj (¬ (\\Alj (¬ (\\AjAlj (¤¯   (¬ (\\Alj6X A¬j AØ jó  (¬ (\\Alj (¬ (¨Ahj (¤¯  - ! A Aq: ? A Aq: A ! Aq! !@ \r  (¤! (¬Ahj! AÀ j Õ  AAq: ? (¬! A j Õ  AAq:   AÀ j A j® As! !@ - AqE\r  A jÄ @ - ?AqE\r  AÀ jÄ @ AqE\r   (¬ (¨ (¤µ 6¬@@A AqE\r  (¬! (¨!  (¤!! Aj    !¶  (¬!" (¨!# (¤!$ Aj " # $·   (6@ - AqE\r   (¬ ( (¤¸ Aq: @ (Aj (¨ (¤¸ AqE\r @ - AqE\r   (6¨@ - AqE\r  (Aj!%  %6  %6¬ (¬ ( (¤ (  - Aq­  A :  (Aj!&  &6  &6¬  A°j$ 3# Ak!   6  6  6 + +cAq# Ak! $    6  6  6  6ü (ü! (! Aàj Õ  (! AÈj Õ   Aàj AÈj® As! AÈjÄ  AàjÄ @@ AqE\r  (ü!	 (!\n A°j \nÕ  (! Aj Õ  	 A°j Aj® As! AjÄ  A°jÄ @ AqE\r  A Aq:  Aj Ajì  (ü!\r (! Aj Õ  (! Aè j Õ  \r Aj Aè j® ! Aè jÄ  AjÄ @ AqE\r  Aj Ajì  AAq:  (ü! (! AÐ j Õ  (! A8j Õ   AÐ j A8j® ! A8jÄ  AÐ jÄ @ AqE\r  Aj Ajì  AAq:  Aj Ajì  (ü! (! A j Õ  (! Aj Õ   A j Aj® ! AjÄ  A jÄ @ AqE\r  Aj Ajì  AAq:  - Aq! Aj$  ì\r# A°k! $    6¬  6¨  6¤  6   6 (¬ (¨ (¤ (¯  (! ( ! Aj Õ  (¤! Aè j Õ   Aj Aè j® !	 Aè jÄ  AjÄ @ 	AqE\r  A¤j A jì  (!\n (¤! AÐ j Õ  (¨! A8j Õ  \n AÐ j A8j® !\r A8jÄ  AÐ jÄ @ \rAqE\r  A¨j A¤jì  (! (¨! A j Õ  (¬! Aj Õ   A j Aj® ! AjÄ  A jÄ @ AqE\r  A¬j A¨jì  A°j$ ü# Aàk! $    6Ü  6Ø  6Ô  6Ð  6Ì  6È (Ü (Ø (Ô (Ð (È°  (È! (Ì! A°j Õ  (Ð!	 Aj 	Õ   A°j Aj® !\n AjÄ  A°jÄ @ \nAqE\r  AÐj AÌjì  (È! (Ð! Aj Õ  (Ô!\r Aè j \rÕ   Aj Aè j® ! Aè jÄ  AjÄ @ AqE\r  AÔj AÐjì  (È! (Ô! AÐ j Õ  (Ø! A8j Õ   AÐ j A8j® ! A8jÄ  AÐ jÄ @ AqE\r  AØj AÔjì  (È! (Ø! A j Õ  (Ü! Aj Õ   A j Aj® ! AjÄ  A jÄ @ AqE\r  AÜj AØjì  Aàj$ ÿ# A°k! $    6¬  6¨  6¤@@ (¬ (¨FAqE\r   (¬6   ( Aj6 @ (  (¨GAqE\r  ( 6  (Ahj6 (¤! ( ! Aj Õ  (! Aè j Õ   Aj Aè j® ! Aè jÄ  AjÄ @ AqE\r  A jù ! AÐ j ²   (6L  ( 6@ AÌ jù !	 ( 	ú   (L6 ( (¬G!\n A Aq: / A Aq: A ! \nAq! !\r@ E\r  (¤! A0j AÐ jÕ  AAq: / (LAhj!  6L Aj Õ  AAq:   A0j Aj® !\r \r!@ - AqE\r  AjÄ @ - /AqE\r  A0jÄ  Aq\r  ( AÐ jú  AÐ jÄ   ( Aj6   A°j$ \n# A k! $    6  6  6@@ ( (FAqE\r   (Ahj6  (Aj6@ ( (GAqE\r  (Ahj6 (! (! Að j Õ  (! AØ j Õ   Að j AØ j® ! AØ jÄ  Að jÄ @ AqE\r  Ajù ! AÀ j ²   (6<  (6@ A<jù !	 ( 	ú   (<6 (!\n A j AÀ jÕ  (<Ahj!  6< Aj Õ  \n A j Aj® ! AjÄ  A jÄ  Aq\r  ( AÀ jú  AÀ jÄ   (Aj6  A j$ ¿# A k! $    6  6  6  6@@ ( (FAqE\r   ( (û 6 ( (ü   ( ( ( (¹ 6 ( (ü   (6 (! A j$  ö# Aðk! $    6ì  6è  6ä  (ì6à  (è6Ü Aìjù ! AÀj ²  (ä! A¨j AÀjÕ  (èAhj! Aj Õ   A¨j Aj® ! AjÄ  A¨jÄ @@ AqE\r @  (ìAj6ì (ä! Aøj AÀjÕ  (ì!	 Aàj 	Õ   Aøj Aàj® As!\n AàjÄ  AøjÄ  \nAq\r @ (ìAj!  6ì  (èI! A Aq: Ç A Aq: §A !\r Aq! \r!@ E\r  (ä! AÈj AÀjÕ  AAq: Ç (ì! A¨j Õ  AAq: §  AÈj A¨j® As! !@ - §AqE\r  A¨jÄ @ - ÇAqE\r  AÈjÄ @ AqE\r @ (ì (èIAqE\r @  (èAhj6è (ä! Aj AÀjÕ  (è! Að j Õ   Aj Að j® ! Að jÄ  AjÄ  Aq\r @@ (ì (èIAqE\r Aìj Aèjì @  (ìAj6ì (ä! AØ j AÀjÕ  (ì! AÀ j Õ   AØ j AÀ j® As! AÀ jÄ  AØ jÄ  Aq\r @  (èAhj6è (ä! A(j AÀjÕ  (è! Aj Õ   A(j Aj® ! AjÄ  A(jÄ  Aq\r    (ìAhj6@ (à (GAqE\r  Ajù ! (à ú  ( AÀjú  (ì! AÀjÄ  Aðj$  Þ	# A k! $   6  6  6  (6  (6 Ajù ! Aðj ²  (! AØj AðjÕ  (Ahj! AÀj Õ   AØj AÀj® ! AÀjÄ  AØjÄ @@ AqE\r @  (Aj6 (!	 A¨j AðjÕ  (!\n Aj \nÕ  	 A¨j Aj® As! AjÄ  A¨jÄ  Aq\r @ (Aj!  6  (I!\r A Aq: w A Aq: WA ! \rAq! !@ E\r  (! Aø j AðjÕ  AAq: w (! AØ j Õ  AAq: W  Aø j AØ j® As! !@ - WAqE\r  AØ jÄ @ - wAqE\r  Aø jÄ @ AqE\r @ ( (IAqE\r @  (Ahj6 (! A8j AðjÕ  (! A j Õ   A8j A j® ! A jÄ  A8jÄ  Aq\r   ( (O: @ - Aq\r  Aj Ajì   (Aj6  (Ahj6 B 7 B 7@@ ( (kAmAÿ NAqE\r@ )B QAqE\r  ( ( Aðj Ajº @ )B QAqE\r  ( ( Aðj Aj»  ( ( Aj Aj  )B Q!AÀ A  Aq!  ( Alj6 )B Q!AÀ A  Aq!  (A  kAlj6  (! Aj Aj  Aðj Aj Aj¼  Aj Aj Aj Aj   (Ahj6@ ( (GAqE\r  Ajù ! ( ú  ( Aðjú    Aj Aj  AðjÄ  A j$  # AÀk! $   6¼  6¸  6´  (¼6°  (¸6¬ A¼jù ! Aj ² @  (¼Aj6¼ (´! (¼! Aøj Õ  Aàj AjÕ   Aøj Aàj® ! AàjÄ  AøjÄ  Aq\r @@ (° (¼AhjFAqE\r @ (¼ (¸I!	 A Aq: Ç A Aq: §A !\n 	Aq! \n!@ E\r  (´!\r (¸Ahj!  6¸ AÈj Õ  AAq: Ç A¨j AjÕ  AAq: § \r AÈj A¨j® As! !@ - §AqE\r  A¨jÄ @ - ÇAqE\r  AÈjÄ @ AqE\r @  (¸Ahj6¸ (´! (¸! Aj Õ  Að j AjÕ   Aj Að j® As! Að jÄ  AjÄ  Aq\r   (¼ (¸OAq: o@@ (¼ (¸IAqE\r A¼j A¸jì @  (¼Aj6¼ (´! (¼! AÐ j Õ  A8j AjÕ   AÐ j A8j® ! A8jÄ  AÐ jÄ  Aq\r @  (¸Ahj6¸ (´! (¸! A j Õ  Aj AjÕ   A j Aj® As! AjÄ  A jÄ  Aq\r    (¼Ahj6@ (° (GAqE\r  Ajù ! (° ú  ( Ajú    Aj Aï j  AjÄ  AÀj$ ä	"# Aàk! $    6Ø  6Ô  6Ð (Ô (ØkAm! AK@@@@@@@    AAq: ß (Ð! (ÔAhj!  6Ô A¸j Õ  (Ø! A j Õ   A¸j A j® ! A jÄ  A¸jÄ @ AqE\r  AØj AÔjì  AAq: ß (Ø!	 (ØAj!\n (ÔAhj!  6Ô 	 \n  (Ð¯  AAq: ß (Ø! (ØAj!\r (ØA0j! (ÔAhj!  6Ô  \r   (Ð°  AAq: ß (Ø! (ØAj! (ØA0j! (ØAÈ j! (ÔAhj!  6Ô      (Ð±  AAq: ß  (ØA0j6 (Ø (ØAj ( (Ð¯  A6 A 6  (Aj6@@ ( (ÔGAqE\r (Ð! (! Aø j Õ  (! Aà j Õ   Aø j Aà j® ! Aà jÄ  Aø jÄ @ AqE\r  Ajù ! AÈ j ²   (6D  (6@ AÄ jù ! ( ú   (D6 ( (ØG! A Aq: \' A Aq: A ! Aq! !@ E\r  (Ð! A(j AÈ jÕ  AAq: \' (DAhj!    6D Aj  Õ  AAq:   A(j Aj® ! !!@ - AqE\r  AjÄ @ - \'AqE\r  A(jÄ  !Aq\r  ( AÈ jú  (Aj!"  "6@@ "AFAqE\r  (Aj!#  #6  # (ÔFAq: ß A6  A 6  AÈ jÄ @ (     (6  (Aj6  AAq: ß - ßAq!$ Aàj$  $ ù# AÐ k! $    6H  6D  6@  6<@@ (H (DFAqE\r   (D (@û 6L (H (D (<½   (D (HkAm68  (D64@@ (4 (@GAqE\r (<! (4! Aj Õ  (H!  Õ   Aj ® ! Ä  AjÄ @ AqE\r  A4j AÈ jì  (H (< (8 (H¾   (4Aj64  (H (D (<¿   (46L (L!	 AÐ j$  	~# AÐ k! $    6L  6H  6D  6@  (L6< A 68@@ (8AÀ HAqE\r (H! (<! Aj Õ   (DÕ   Aj ® As! Ä  AjÄ   : 7 - 7Aq­ (8­! (@!	 	  	) 7   (8Aj68  (<Aj6<  AÐ j$ ~# AÐ k! $    6L  6H  6D  6@  (L6< A 68@@ (8AÀ HAqE\r (H! (<! Aj Õ   (DÕ   Aj ® ! Ä  AjÄ   : 7 - 7Aq­ (8­! (@!	 	  	) 7   (8Aj68  (<Ahj6<  AÐ j$ ~~# A k! $    6  6  6  6  6  6  ((  (( kAmAj6@@ () B QAqE\r  () B QAqE\r   (Am6  ( (k6|@@ () B QAqE\r   (AÀ k6 AÀ 6| AÀ 6  (AÀ k6|@ () B QAqE\r   (( 6x A 6t@@ (t (HAqE\r (! (x! AØ j Õ  (!	 AÀ j 	Õ   AØ j AÀ j® As!\n AÀ jÄ  AØ jÄ   \n: s - sAq­ (t­! (!   ) 7   (xAj6x  (tAj6t @ () B QAqE\r   (( 6< A 68@@ (8 (|HAqE\r (!\r (<! Aj Õ   (Õ  \r Aj ® ! Ä  AjÄ   : 7 - 7Aq­ (8­! (!   ) 7   (<Ahj6<  (8Aj68  ((  ((  ( ( @@ () B QAqE\r  (!A ! ! (!  (  Alj6 @@ () B QAqE\r  (|!A ! ! (!  ( A  kAlj6  A j$ ¼# A k! $    6  6  6  (6  ( (kAm6@ (AJAqE\r   (AkAm6@@ (A NAqE\r ( ( ( ( (Alj¾   (Aj6  A j$ À# Ak! $    6  6  6  6  ( (kAm6ü@@@ (AHAq\r  (AkAm (üHAqE\r  (üAtAj6ü  ( (üAlj6ø (üAj (H! A Aq: ß A Aq: ¿A ! Aq! !@ E\r  (!	 (ø!\n Aàj \nÕ  AAq: ß (øAj! AÀj Õ  AAq: ¿ 	 Aàj AÀj® ! !@ - ¿AqE\r  AÀjÄ @ - ßAqE\r  AàjÄ @ AqE\r   (øAj6ø  (üAj6ü (!\r (ø! A j Õ  (! Aj Õ  \r A j Aj® ! AjÄ  A jÄ @ AqE\r  Ajù ! Að j ² @@ Aøjù ! ( ú   (ø6@ (AkAm (üHAqE\r   (üAtAj6ü  ( (üAlj6ø (üAj (H! A Aq: W A Aq: 7A ! Aq! !@ E\r  (! (ø! AØ j Õ  AAq: W (øAj! A8j Õ  AAq: 7  AØ j A8j® ! !@ - 7AqE\r  A8jÄ @ - WAqE\r  AØ jÄ @ AqE\r   (øAj6ø  (üAj6ü (! (ø! Aj Õ   Að jÕ   Aj ® As! Ä  AjÄ  Aq\r  ( Að jú  Að jÄ  Aj$ ¾# A k! $    6  6  6  (6  (6  ( (kAm6@@ (AJAqE\r ( ( ( (À   (Ahj6  (Aj6  ( ( (¬  A j$ °# AÀ k! $    6<  68  64  60  (46,@ (0AJAqE\r  A<jù ! Aj ²   (< (, (0Á 6  (8Ahj68@@ ( (8FAqE\r  ( Ajú  A8jù ! ( ú   (Aj6 (8 Ajú  (< ( (, ( (<kAmÂ  AjÄ  AÀ j$ Á# Aà k! $    6\\  6X  6T  (\\6P  (\\6L A 6H (HAj!  (L Alj6L  (HAtAj6H (HAj (TH! A Aq: / A Aq: A ! Aq! !@ E\r  (X!	 (L!\n A0j \nÕ  AAq: / (LAj! Aj Õ  AAq:  	 A0j Aj® ! !@ - AqE\r  AjÄ @ - /AqE\r  A0jÄ @ AqE\r   (LAj6L  (HAj6H AÌ jù !\r (P \rú   (L6P@ (H (TAkAmJAqE\r  (P! Aà j$   í\n# Ak! $    6  6  6  6@ (AJAqE\r   (AkAm6  ( (Alj6| (! (|! Aà j Õ  (Ahj!  6 AÈ j Õ   Aà j AÈ j® ! AÈ jÄ  Aà jÄ @ AqE\r  Ajù !	 A0j 	² @@ Aü jù !\n ( \nú   (|6@ (\r   (AkAm6  ( (Alj6| (! (|! Aj Õ   A0jÕ   Aj ® !\r Ä  AjÄ  \rAq\r  ( A0jú  A0jÄ  Aj$ # Ak! $    6  6  6@@ ( (FAqE\r   ( (kAmæ ç At6  ( ( ( ( AAqÅ  Aj$ %# Ak!   6  6  6«"# A°k! $    6¬  6¨  6¤  6   :  A6 A6@@  (¨ (¬kAm6 (! AK@@@@@@    (¤! (¨Ahj!  6¨ Aø j Õ  (¬!	 Aà j 	Õ   Aø j Aà jÆ !\n Aà jÄ  Aø jÄ @ \nAqE\r  A¬j A¨jì  (¬! (¬Aj! (¨Ahj!\r  \r6¨   \r (¤Ç  (¬! (¬Aj! (¬A0j! (¨Ahj!  6¨     (¤È  (¬! (¬Aj! (¬A0j! (¬AÈ j! (¨Ahj!  6¨      (¤É @ (AHAqE\r @@ - AqE\r  (¬ (¨ (¤Ê  (¬ (¨ (¤Ë @ ( \r  (¬ (¨ (¨ (¤Ì   ( Aj6   (Am6\\@@ (AJAqE\r  (¬ (¬ (\\Alj (¨Ahj (¤Ç  (¬Aj (¬ (\\AkAlj (¨APj (¤Ç  (¬A0j (¬ (\\AjAlj (¨A¸j (¤Ç  (¬ (\\AkAlj (¬ (\\Alj (¬ (\\AjAlj (¤Ç   (¬ (\\Alj6X A¬j AØ jó  (¬ (\\Alj (¬ (¨Ahj (¤Ç  - ! A Aq: ? A Aq: A ! Aq! !@ \r  (¤! (¬Ahj! AÀ j Õ  AAq: ? (¬! A j Õ  AAq:   AÀ j A jÆ As! !@ - AqE\r  A jÄ @ - ?AqE\r  AÀ jÄ @ AqE\r   (¬ (¨ (¤Í 6¬@@A AqE\r  (¬! (¨!  (¤!! Aj    !Î  (¬!" (¨!# (¤!$ Aj " # $Ï   (6@ - AqE\r   (¬ ( (¤Ð Aq: @ (Aj (¨ (¤Ð AqE\r @ - AqE\r   (6¨@ - AqE\r  (Aj!%  %6  %6¬ (¬ ( (¤ (  - AqÅ  A :  (Aj!&  &6  &6¬  A°j$ 3# Ak!   6  6  6 + +cAq# Ak! $    6  6  6  6ü (ü! (! Aàj Õ  (! AÈj Õ   Aàj AÈjÆ As! AÈjÄ  AàjÄ @@ AqE\r  (ü!	 (!\n A°j \nÕ  (! Aj Õ  	 A°j AjÆ As! AjÄ  A°jÄ @ AqE\r  A Aq:  Aj Ajì  (ü!\r (! Aj Õ  (! Aè j Õ  \r Aj Aè jÆ ! Aè jÄ  AjÄ @ AqE\r  Aj Ajì  AAq:  (ü! (! AÐ j Õ  (! A8j Õ   AÐ j A8jÆ ! A8jÄ  AÐ jÄ @ AqE\r  Aj Ajì  AAq:  Aj Ajì  (ü! (! A j Õ  (! Aj Õ   A j AjÆ ! AjÄ  A jÄ @ AqE\r  Aj Ajì  AAq:  - Aq! Aj$  ì\r# A°k! $    6¬  6¨  6¤  6   6 (¬ (¨ (¤ (Ç  (! ( ! Aj Õ  (¤! Aè j Õ   Aj Aè jÆ !	 Aè jÄ  AjÄ @ 	AqE\r  A¤j A jì  (!\n (¤! AÐ j Õ  (¨! A8j Õ  \n AÐ j A8jÆ !\r A8jÄ  AÐ jÄ @ \rAqE\r  A¨j A¤jì  (! (¨! A j Õ  (¬! Aj Õ   A j AjÆ ! AjÄ  A jÄ @ AqE\r  A¬j A¨jì  A°j$ ü# Aàk! $    6Ü  6Ø  6Ô  6Ð  6Ì  6È (Ü (Ø (Ô (Ð (ÈÈ  (È! (Ì! A°j Õ  (Ð!	 Aj 	Õ   A°j AjÆ !\n AjÄ  A°jÄ @ \nAqE\r  AÐj AÌjì  (È! (Ð! Aj Õ  (Ô!\r Aè j \rÕ   Aj Aè jÆ ! Aè jÄ  AjÄ @ AqE\r  AÔj AÐjì  (È! (Ô! AÐ j Õ  (Ø! A8j Õ   AÐ j A8jÆ ! A8jÄ  AÐ jÄ @ AqE\r  AØj AÔjì  (È! (Ø! A j Õ  (Ü! Aj Õ   A j AjÆ ! AjÄ  A jÄ @ AqE\r  AÜj AØjì  Aàj$ ÿ# A°k! $    6¬  6¨  6¤@@ (¬ (¨FAqE\r   (¬6   ( Aj6 @ (  (¨GAqE\r  ( 6  (Ahj6 (¤! ( ! Aj Õ  (! Aè j Õ   Aj Aè jÆ ! Aè jÄ  AjÄ @ AqE\r  A jù ! AÐ j ²   (6L  ( 6@ AÌ jù !	 ( 	ú   (L6 ( (¬G!\n A Aq: / A Aq: A ! \nAq! !\r@ E\r  (¤! A0j AÐ jÕ  AAq: / (LAhj!  6L Aj Õ  AAq:   A0j AjÆ !\r \r!@ - AqE\r  AjÄ @ - /AqE\r  A0jÄ  Aq\r  ( AÐ jú  AÐ jÄ   ( Aj6   A°j$ \n# A k! $    6  6  6@@ ( (FAqE\r   (Ahj6  (Aj6@ ( (GAqE\r  (Ahj6 (! (! Að j Õ  (! AØ j Õ   Að j AØ jÆ ! AØ jÄ  Að jÄ @ AqE\r  Ajù ! AÀ j ²   (6<  (6@ A<jù !	 ( 	ú   (<6 (!\n A j AÀ jÕ  (<Ahj!  6< Aj Õ  \n A j AjÆ ! AjÄ  A jÄ  Aq\r  ( AÀ jú  AÀ jÄ   (Aj6  A j$ ¿# A k! $    6  6  6  6@@ ( (FAqE\r   ( (û 6 ( (ü   ( ( ( (Ñ 6 ( (ü   (6 (! A j$  ö# Aðk! $    6ì  6è  6ä  (ì6à  (è6Ü Aìjù ! AÀj ²  (ä! A¨j AÀjÕ  (èAhj! Aj Õ   A¨j AjÆ ! AjÄ  A¨jÄ @@ AqE\r @  (ìAj6ì (ä! Aøj AÀjÕ  (ì!	 Aàj 	Õ   Aøj AàjÆ As!\n AàjÄ  AøjÄ  \nAq\r @ (ìAj!  6ì  (èI! A Aq: Ç A Aq: §A !\r Aq! \r!@ E\r  (ä! AÈj AÀjÕ  AAq: Ç (ì! A¨j Õ  AAq: §  AÈj A¨jÆ As! !@ - §AqE\r  A¨jÄ @ - ÇAqE\r  AÈjÄ @ AqE\r @ (ì (èIAqE\r @  (èAhj6è (ä! Aj AÀjÕ  (è! Að j Õ   Aj Að jÆ ! Að jÄ  AjÄ  Aq\r @@ (ì (èIAqE\r Aìj Aèjì @  (ìAj6ì (ä! AØ j AÀjÕ  (ì! AÀ j Õ   AØ j AÀ jÆ As! AÀ jÄ  AØ jÄ  Aq\r @  (èAhj6è (ä! A(j AÀjÕ  (è! Aj Õ   A(j AjÆ ! AjÄ  A(jÄ  Aq\r    (ìAhj6@ (à (GAqE\r  Ajù ! (à ú  ( AÀjú  (ì! AÀjÄ  Aðj$  Þ	# A k! $   6  6  6  (6  (6 Ajù ! Aðj ²  (! AØj AðjÕ  (Ahj! AÀj Õ   AØj AÀjÆ ! AÀjÄ  AØjÄ @@ AqE\r @  (Aj6 (!	 A¨j AðjÕ  (!\n Aj \nÕ  	 A¨j AjÆ As! AjÄ  A¨jÄ  Aq\r @ (Aj!  6  (I!\r A Aq: w A Aq: WA ! \rAq! !@ E\r  (! Aø j AðjÕ  AAq: w (! AØ j Õ  AAq: W  Aø j AØ jÆ As! !@ - WAqE\r  AØ jÄ @ - wAqE\r  Aø jÄ @ AqE\r @ ( (IAqE\r @  (Ahj6 (! A8j AðjÕ  (! A j Õ   A8j A jÆ ! A jÄ  A8jÄ  Aq\r   ( (O: @ - Aq\r  Aj Ajì   (Aj6  (Ahj6 B 7 B 7@@ ( (kAmAÿ NAqE\r@ )B QAqE\r  ( ( Aðj AjÒ @ )B QAqE\r  ( ( Aðj AjÓ  ( ( Aj Aj  )B Q!AÀ A  Aq!  ( Alj6 )B Q!AÀ A  Aq!  (A  kAlj6  (! Aj Aj  Aðj Aj AjÔ  Aj Aj Aj Aj   (Ahj6@ ( (GAqE\r  Ajù ! ( ú  ( Aðjú    Aj Aj  AðjÄ  A j$  # AÀk! $   6¼  6¸  6´  (¼6°  (¸6¬ A¼jù ! Aj ² @  (¼Aj6¼ (´! (¼! Aøj Õ  Aàj AjÕ   Aøj AàjÆ ! AàjÄ  AøjÄ  Aq\r @@ (° (¼AhjFAqE\r @ (¼ (¸I!	 A Aq: Ç A Aq: §A !\n 	Aq! \n!@ E\r  (´!\r (¸Ahj!  6¸ AÈj Õ  AAq: Ç A¨j AjÕ  AAq: § \r AÈj A¨jÆ As! !@ - §AqE\r  A¨jÄ @ - ÇAqE\r  AÈjÄ @ AqE\r @  (¸Ahj6¸ (´! (¸! Aj Õ  Að j AjÕ   Aj Að jÆ As! Að jÄ  AjÄ  Aq\r   (¼ (¸OAq: o@@ (¼ (¸IAqE\r A¼j A¸jì @  (¼Aj6¼ (´! (¼! AÐ j Õ  A8j AjÕ   AÐ j A8jÆ ! A8jÄ  AÐ jÄ  Aq\r @  (¸Ahj6¸ (´! (¸! A j Õ  Aj AjÕ   A j AjÆ As! AjÄ  A jÄ  Aq\r    (¼Ahj6@ (° (GAqE\r  Ajù ! (° ú  ( Ajú    Aj Aï j  AjÄ  AÀj$ ä	"# Aàk! $    6Ø  6Ô  6Ð (Ô (ØkAm! AK@@@@@@@    AAq: ß (Ð! (ÔAhj!  6Ô A¸j Õ  (Ø! A j Õ   A¸j A jÆ ! A jÄ  A¸jÄ @ AqE\r  AØj AÔjì  AAq: ß (Ø!	 (ØAj!\n (ÔAhj!  6Ô 	 \n  (ÐÇ  AAq: ß (Ø! (ØAj!\r (ØA0j! (ÔAhj!  6Ô  \r   (ÐÈ  AAq: ß (Ø! (ØAj! (ØA0j! (ØAÈ j! (ÔAhj!  6Ô      (ÐÉ  AAq: ß  (ØA0j6 (Ø (ØAj ( (ÐÇ  A6 A 6  (Aj6@@ ( (ÔGAqE\r (Ð! (! Aø j Õ  (! Aà j Õ   Aø j Aà jÆ ! Aà jÄ  Aø jÄ @ AqE\r  Ajù ! AÈ j ²   (6D  (6@ AÄ jù ! ( ú   (D6 ( (ØG! A Aq: \' A Aq: A ! Aq! !@ E\r  (Ð! A(j AÈ jÕ  AAq: \' (DAhj!    6D Aj  Õ  AAq:   A(j AjÆ ! !!@ - AqE\r  AjÄ @ - \'AqE\r  A(jÄ  !Aq\r  ( AÈ jú  (Aj!"  "6@@ "AFAqE\r  (Aj!#  #6  # (ÔFAq: ß A6  A 6  AÈ jÄ @ (     (6  (Aj6  AAq: ß - ßAq!$ Aàj$  $ ù# AÐ k! $    6H  6D  6@  6<@@ (H (DFAqE\r   (D (@û 6L (H (D (<Õ   (D (HkAm68  (D64@@ (4 (@GAqE\r (<! (4! Aj Õ  (H!  Õ   Aj Æ ! Ä  AjÄ @ AqE\r  A4j AÈ jì  (H (< (8 (HÖ   (4Aj64  (H (D (<×   (46L (L!	 AÐ j$  	~# AÐ k! $    6L  6H  6D  6@  (L6< A 68@@ (8AÀ HAqE\r (H! (<! Aj Õ   (DÕ   Aj Æ As! Ä  AjÄ   : 7 - 7Aq­ (8­! (@!	 	  	) 7   (8Aj68  (<Aj6<  AÐ j$ ~# AÐ k! $    6L  6H  6D  6@  (L6< A 68@@ (8AÀ HAqE\r (H! (<! Aj Õ   (DÕ   Aj Æ ! Ä  AjÄ   : 7 - 7Aq­ (8­! (@!	 	  	) 7   (8Aj68  (<Ahj6<  AÐ j$ ~~# A k! $    6  6  6  6  6  6  ((  (( kAmAj6@@ () B QAqE\r  () B QAqE\r   (Am6  ( (k6|@@ () B QAqE\r   (AÀ k6 AÀ 6| AÀ 6  (AÀ k6|@ () B QAqE\r   (( 6x A 6t@@ (t (HAqE\r (! (x! AØ j Õ  (!	 AÀ j 	Õ   AØ j AÀ jÆ As!\n AÀ jÄ  AØ jÄ   \n: s - sAq­ (t­! (!   ) 7   (xAj6x  (tAj6t @ () B QAqE\r   (( 6< A 68@@ (8 (|HAqE\r (!\r (<! Aj Õ   (Õ  \r Aj Æ ! Ä  AjÄ   : 7 - 7Aq­ (8­! (!   ) 7   (<Ahj6<  (8Aj68  ((  ((  ( ( @@ () B QAqE\r  (!A ! ! (!  (  Alj6 @@ () B QAqE\r  (|!A ! ! (!  ( A  kAlj6  A j$ ¼# A k! $    6  6  6  (6  ( (kAm6@ (AJAqE\r   (AkAm6@@ (A NAqE\r ( ( ( ( (AljÖ   (Aj6  A j$ À# Ak! $    6  6  6  6  ( (kAm6ü@@@ (AHAq\r  (AkAm (üHAqE\r  (üAtAj6ü  ( (üAlj6ø (üAj (H! A Aq: ß A Aq: ¿A ! Aq! !@ E\r  (!	 (ø!\n Aàj \nÕ  AAq: ß (øAj! AÀj Õ  AAq: ¿ 	 Aàj AÀjÆ ! !@ - ¿AqE\r  AÀjÄ @ - ßAqE\r  AàjÄ @ AqE\r   (øAj6ø  (üAj6ü (!\r (ø! A j Õ  (! Aj Õ  \r A j AjÆ ! AjÄ  A jÄ @ AqE\r  Ajù ! Að j ² @@ Aøjù ! ( ú   (ø6@ (AkAm (üHAqE\r   (üAtAj6ü  ( (üAlj6ø (üAj (H! A Aq: W A Aq: 7A ! Aq! !@ E\r  (! (ø! AØ j Õ  AAq: W (øAj! A8j Õ  AAq: 7  AØ j A8jÆ ! !@ - 7AqE\r  A8jÄ @ - WAqE\r  AØ jÄ @ AqE\r   (øAj6ø  (üAj6ü (! (ø! Aj Õ   Að jÕ   Aj Æ As! Ä  AjÄ  Aq\r  ( Að jú  Að jÄ  Aj$ ¾# A k! $    6  6  6  (6  (6  ( (kAm6@@ (AJAqE\r ( ( ( (Ø   (Ahj6  (Aj6  ( ( (Ä  A j$ °# AÀ k! $    6<  68  64  60  (46,@ (0AJAqE\r  A<jù ! Aj ²   (< (, (0Ù 6  (8Ahj68@@ ( (8FAqE\r  ( Ajú  A8jù ! ( ú   (Aj6 (8 Ajú  (< ( (, ( (<kAmÚ  AjÄ  AÀ j$ Á# Aà k! $    6\\  6X  6T  (\\6P  (\\6L A 6H (HAj!  (L Alj6L  (HAtAj6H (HAj (TH! A Aq: / A Aq: A ! Aq! !@ E\r  (X!	 (L!\n A0j \nÕ  AAq: / (LAj! Aj Õ  AAq:  	 A0j AjÆ ! !@ - AqE\r  AjÄ @ - /AqE\r  A0jÄ @ AqE\r   (LAj6L  (HAj6H AÌ jù !\r (P \rú   (L6P@ (H (TAkAmJAqE\r  (P! Aà j$   í\n# Ak! $    6  6  6  6@ (AJAqE\r   (AkAm6  ( (Alj6| (! (|! Aà j Õ  (Ahj!  6 AÈ j Õ   Aà j AÈ jÆ ! AÈ jÄ  Aà jÄ @ AqE\r  Ajù !	 A0j 	² @@ Aü jù !\n ( \nú   (|6@ (\r   (AkAm6  ( (Alj6| (! (|! Aj Õ   A0jÕ   Aj Æ !\r Ä  AjÄ  \rAq\r  ( A0jú  A0jÄ  Aj$ \n||||||||# Ak! $   6  6 (!A ! Aè j  ü\n   (!  )(7`  ) 7X  )7P  )7H  )7@  ) 78 A 64@@ (4AHAqE\r  (460 (4!  Aè j Ü  (4Õ + ² 9(  (4Aj6$@@ ($AHAqE\r ($!@ Aè j Ü  (4Õ + ²  +(dAqE\r  ($!	  Aè j 	Ü  (4Õ + ² 9(  ($60  ($Aj6$ @ +(D»½×Ùß|Û=cAqE\r A· !\n \nA û  \nAìï A   @ (0 (4GAqE\r  (4! Aè j Ü ! (0!\r  Aè j \rÜ Ý  (4! A8j Õ ! (0!  A8j Õ Þ   (4Aj6 @@ ( AHAqE\r ( ! Aè j Ü  (4Õ + ! (4!   Aè j Ü  (4Õ + £9  (4Aj6@@ (AHAqE\r +! (4! Aè j Ü  (Õ + ! ( ! Aè j Ü  (Õ !  +   ¢ 9   (Aj6  +! (4! A8j Õ + ! ( ! A8j Õ !  +   ¢ 9  ( ! Aè j Ü  (4Õ A ·9   ( Aj6    (4Aj64  A6@@ (A NAqE\r (! A8j Õ + !    (Õ   9   (Aj6@@ (AHAqE\r (!! Aè j !Ü  (Õ + !"   (Õ + !#   (Õ !$ $ $+  # "¢ 9   (Aj6  (!% Aè j %Ü  (Õ + !&   (Õ !\' \' \'+  &£9   (Aj6  Aj$ ,# Ak!   6  6 ( (A0ljA# Ak! $    6  6 ( (ß  Aj$ R|# Ak!   6  6  (+ 9  (+ ! ( 9  + ! ( 9 ]# Ak! $    6  6 (! à  à A0j (à á  Aj$ # Ak!   6 (g# A k! $    6  6  6 (! (! (! Aj   â  (! A j$  # Ak! $   6  6  6@@ ( (GAqE\r Aj Ajã   (Aj6  (Aj6    Aj Ajä  Aj$ G# Ak! $    6  6 ((  (( å  Aj$ H# Ak!   6  6  6 (!  (( 6   (( 6 A# Ak! $    6  6 ( (Þ  Aj$ ÷# A k! $    6  6 ((HAF! AA Aq6@@ ((HAFAqE\r A! ((Ak!  6  (  ((l ( ((lk6  (· ( (j·D      à?  ((·£¢ü6 A Aq:   A ç @ (E\r @@ (A HAqE\r  (Aj6  A è  @@ (A JAqE\r  (Ak6  A è   AAq: @ - Aq\r     A j$ [# Ak! $    6  6 (!    ( (Ü ÿ  Aj$  E# Ak! $    6  6 ( ( ! Aj$  ý# AÀ k! $    6<  68  (  (j (8(Atj (8(o64 A Aq: 3   (4Aj  (8!  ) 7 Aj  )7 Aj  Ajæ  A$j Aj  Î    A$jª  A$j  Aj  AAq: 3@ - 3Aq\r     AÀ j$  # AÀ k! $    6<  68  (  (jAj (8(Atj (8(o64  (4AÁ j: 3 A Aq: 2 - 3!A!A!     t uã  (8!  ) 7 Aj  )7 Aj  Ajæ  A$j Aj  Î    A$jª  A$j  Aj  AAq: 2@ - 2Aq\r     AÀ j$ á# A0k! $    6,  6(  6$ A Aq: # ((!  ) 7  )7     ê   ($· ( ·A ·  (·  (((·£ ü6 (! Aj     Ajì  Aj  AAq: #@ - #Aq\r     A0j$ E# Ak! $    6  6 ( (À ! Aj$  \r   (    A (¬ô 6A   6¬ô Ý A ê A  A¸ê A¦ AA  AÄê AÃ AAAÿ  AÜê A¼ AAAÿ  AÐê Aº AA Aÿ Aèê A  AA~Aÿÿ Aôê A AA Aÿÿ Aë AÔ AAxAÿÿÿÿ Aë AË AA A Aë A£ AAxAÿÿÿÿ A¤ë A AA A A°ë A ABBÿÿÿÿÿÿÿÿÿ  A¼ë A AB B AÈë AÇ A AÔë A A Aø© AÂ  Aô AA¨  A¼ AAÎ  A AAÝ  A ´  AÔ A AÇ  Aü A A  A¤ AAå  AÌ AA  Aô AA³  A AAÛ  AÄ AAø  Aì AA±  A AAÏ  Aü A AÞ  A¤ AA½  AÌ AA   Aô AAþ  A AA¦  AÄ AA  A¼ AAã  Aä A	AÁ  A AA  A´ AAö  C A A 6°ô A A 6´ô ï A A (¬ô 6´ô A A°ô 6¬ô  A¸ô ò B# Ak! $    6 (! A ô  Aj$  [¸# Ak!   $     A»j6Ð  A 6Ìö   A 6È  ø 6Ä  ù 6À  A 6¼û ü ý þ   (Èÿ   (È  (Ä   (Ä  (À   (À  (Ì  (¼   (¼     A»j6Ô    (Ô6ì  A 6è  (ì!  (è    6äAê !   6àA !   6Ü  (ä!A !   6ÔA !   6Ðû   (à  AÛj (   (Ô   (Ô  AÜj   AÛj (   (Ð   (Ð  AÜj     6ÌAè !   6È  A6Ä  (Ì!   6¼   6¸û   (È  AÃj (   (¼   (¼  AÄj   AÃj (   (¸   (¸  AÄj     6´Aä !	   	6°A!\n   \n6¬  (´!   6¤   6 û   (°  A«j (   (¤   (¤  A¬j   A«j (   (    (   A¬j     6Aº !   6  A6  (!\r   6   6û   (  Aj (   (   (  Aj   Aj (   (   (  Aj     \r6A !   6A!   6ü  (!   6ô   6ðû   (  Aûj (   (ô   (ô  Aüj   Aûj (   (ð   (ð  Aüj     6ìA· !   6è  A6ä  (ì!   6Ü   6Øû   (è  Aãj (   (Ü   (Ü  Aäj   Aãj (   (Ø   (Ø  Aäj     6´  A 6°    )°7è  (è!  (ì!   6AÐ !   6   6ü   6ø  (!  (!  (ø!    (ü6ô   6ð    )ð7À   AÀj    6¬  A 6¨    )¨7  (!  (!   6¤Aµ !   6    6   6  (¤!  ( !  (!    (6   6    )7¸   A¸j    6¤  A 6     ) 7¨  (¨!  (¬!    6ÄA¢ !!   !6À    6¼   6¸  (Ä!"  (À!#  (¸!$    (¼6´   $6°    )°7° #  A°j    "6Ø  AÑ 6Ô  A 6Ð  A 6Èû   (Ô  AÏj   AÏj   (È   (È  (Ð       Aj6ð  A 6ì   A 6è   6ä   6à  A 6Ü   þ   (è   (è  (ä   (ä  (à   (à  (ì  (Ü   (Ü     Aj6ô    (ô6ô  A 6ð  (ô!%  (ð    %6   6   6ü  (!&A !\'   \'6ôA !(   (6ð   (  Aûj (   (ô    (ô  Aüj¡   Aûj (   (ð¢   (ð  Aüj¡     &6ì   6è   \n6ä  (ì!)   \'6Ü   (6Ø   (è  Aãj (   (Ü    (Ü  Aäj¡   Aãj (   (Ø¢   (Ø  Aäj¡     )6Ô   	6Ð   6Ì  (Ô!*   \'6Ä   (6À   (Ð  AËj (   (Ä    (Ä  AÌj¡   AËj (   (À¢   (À  AÌj¡     *6¼   6¸  A6´  (¼!+   \'6¬   (6¨   (¸  A³j (   (¬    (¬  A´j¡   A³j (   (¨¢   (¨  A´j¡     +6¤   6   A 6  (¤!,   \'6   (6   (   Aj (   (    (  Aj¡   Aj (   (¢   (  Aj¡     ,6   6  A(6  (!-   \'6ü   (6ø   (  Aj (   (ü    (ü  Aj¡   Aj (   (ø¢   (ø  Aj¡     6  A 6    )7  (!.  (!/   -6¤   6    /6   .6  (¤!0  ( !1  (!2    (6   26    )7¨ 1  A¨j£    6  A 6    )7¨  (¨!3  (¬!4   06Ä   6À   46¼   36¸  (Ä!5  (À!6  (¸!7    (¼6´   76°    )°7  6  A j¤    6  A 6    )7È  (È!8  (Ì!9   56ä   !6à   96Ü   86Ø  (à!:  (Ø!;    (Ü6Ô   ;6Ð    )Ð7 :  Aj¥     Aj6ü  A¥ 6ø¦   A 6ô  ¨ 6ð  © 6ì  A 6è« ¬ ­ þ   (ô®   (ô  (ð   (ð  (ì   (ì  (ø  (è¯   (è     Aj6    (6ü  A 6ø  (ü!<  (ø±    <6  AÁ 6  A  6  (!=  A¡ 6«   (  Aj³   Aj´   (µ   (  (      6ü  A¢ 6ø    )ø7  (!>  (!?   =6´  AÝ 6°   ?6¬   >6¨  (´!@  (°!A  (¨!B    (¬6¤   B6     ) 7 A  Aj¶    6ô  A£ 6ð    )ð7¸  (¸!C  (¼!D   @6Ô  AÌ 6Ð   D6Ì   C6È  (Ô!E  (Ð!F  (È!G    (Ì6Ä   G6À    )À7 F  Aj·    6ì  A¤ 6è    )è7Ø  (Ø!H  (Ü!I   E6ô  A½ 6ð   I6ì   H6è  (ô!J  (ð!K  (è!L    (ì6ä   L6à    )à7 K  Aj¸    6ä  A¥ 6à    )à7ø  (ø!M  (ü!N   J6	  A¦ 6	   N6	   M6	  (	!O  (	!P    (	6	   P6	    )	7x O  Aø j¹     Aßj6¬	  A­ 6¨	º   A¦ 6¤	  ¼ 6 	  ½ 6	  A§ 6	¿ À Á þ   (¤	Â   (¤	  ( 	   ( 	  (	   (	  (¨	  (	Ã   (	     Aßj6À	  Aß 6¼	  A¨ 6¸	  (À	!Q  A© 6°	¿   (¼	  A·	jÅ   A·	jÆ   (°	Ç   (°	  (¸	      Q6Ô	  A² 6Ð	  Aª 6Ì	  (Ô	!R  A« 6Ä	¿   (Ð	  AË	jÉ   AË	jÊ   (Ä	Ë   (Ä	  (Ì	      6Ø  A¬ 6Ô    )Ô7Ø	  (Ø	!S  (Ü	!T   R6ô	  A× 6ð	   T6ì	   S6è	  (ô	!U  (ð	!V  (è	!W    (ì	6ä	   W6à	    )à	7p V  Að jÌ    6Ð  A­ 6Ì    )Ì7ø	  (ø	!X  (ü	!Y   U6\n  A¥ 6\n   Y6\n   X6\n  (\n!Z  (\n![  (\n!\\    (\n6\n   \\6\n    )\n7h [  Aè jÍ    6È  A® 6Ä    )Ä7\n  (\n!]  (\n!^   Z6´\n  AÜ 6°\n   ^6¬\n   ]6¨\n  (´\n!_  (°\n!`  (¨\n!a    (¬\n6¤\n   a6 \n    ) \n7` `  Aà jÎ    6À  A¯ 6¼    )¼7Ø\n  (Ø\n!b  (Ü\n!c   _6ô\n  Aü 6ð\n   c6ì\n   b6è\n  (ô\n!d  (ð\n!e  (è\n!f    (ì\n6ä\n   f6à\n    )à\n7X e  AØ jÏ    6¸  A° 6´    )´7¸\n  (¸\n!g  (¼\n!h   d6Ô\n  AÇ 6Ð\n   h6Ì\n   g6È\n  (Ô\n!i  (Ð\n!j  (È\n!k    (Ì\n6Ä\n   k6À\n    )À\n7P j  AÐ jÏ    6°  A± 6¬    )¬7ø\n  (ø\n!l  (ü\n!m   i6  A 6   m6   l6  (!n  (!o  (!p    (6   p6    )7H o  AÈ jÐ    6¨  A² 6¤    )¤7¸  (¸!q  (¼!r   n6Ô  Aç 6Ð   r6Ì   q6È  (Ô!s  (Ð!t  (È!u    (Ì6Ä   u6À    )À7@ t  AÀ jÑ    6   A³ 6    )7  (!v  (!w   s6´  A 6°   w6¬   v6¨  (´!x  (°!y  (¨!z    (¬6¤   z6     ) 78 y  A8jÑ    6  A´ 6    )7Ø  (Ø!{  (Ü!|   x6ô  AØ 6ð   |6ì   {6è  (ô!}  (ð!~  (è!    (ì6ä   6à    )à70 ~  A0jÒ    6  Aµ 6    )7ø  (ø!  (ü!   }6  A¬ 6   6   6  (!  (!  (!    (6   6    )7(   A(jÓ    6  A¶ 6    )7  (!  (!   6´  A¼ 6°   6¬   6¨  (´!  (°!  (¨!    (¬6¤   6     ) 7    A jÔ    6  A· 6ü    )ü7¸  (¸!  (¼!   6Ô  A÷ 6Ð   6Ì   6È  (Ô!  (Ð!  (È!    (Ì6Ä   6À    )À7   AjÕ    6ø  A¸ 6ô    )ô7Ø  (Ø!  (Ü!   6ô  A 6ð   6ì   6è  (ô!  (ð!  (è!    (ì6ä   6à    )à7   AjÖ    6ð  A¹ 6ì    )ì7ø  (ø!  (ü!   6\r  A 6\r   6\r   6\r  (\r!  (\r!  (\r!    (\r6\r   6\r    )\r7   Aj×    6è  Aº 6ä    )ä7\r  (\r!  (\r!   6´\r  A 6°\r   6¬\r   6¨\r  (´\r!  (°\r!  (¨\r!    (¬\r6¤\r   6 \r    ) \r7    Ø    6à  A» 6Ü    )Ü7¸\r  (¸\r!  (¼\r!   6Ô\r  A 6Ð\r   6Ì\r   6È\r  (Ô\r!   (Ð\r!¡  (È\r!¢    (Ì\r6Ä\r   ¢6À\r    )À\r7È ¡  AÈjÙ     6´  AÜ 6°  AÈ 6¬  (´!£  A¼ 6¤  A½ 6 ¿   (°  A«jÜ (   (¤Ý   (¤  A¬jÞ   A«jÜ (   ( ß   (   A¬jÞ     £6  AË 6  AÐ 6  (!¤  A¼ 6  A½ 6¿   (  AjÜ (   (Ý   (  AjÞ   AjÜ (   (ß   (  AjÞ     ¤6  AÑ 6  AØ 6ü\r  (!¥  A¼ 6ô\r  A½ 6ð\r¿   (  Aû\rjÜ (   (ô\rÝ   (ô\r  Aü\rjÞ   Aû\rjÜ (   (ð\rß   (ð\r  Aü\rjÞ     ¥6Ä  A 6À  Aà 6¼  (Ä!¦  A¾ 6´  A¿ 6°¿   (À  A»j (   (´â   (´  A¼jã   A»j (   (°ä   (°  A¼jã     ¦6¬  A 6¨  Aè 6¤  (¬!§  A¾ 6  A¿ 6¿   (¨  A£j (   (â   (  A¤jã   A£j (   (ä   (  A¤jã     §6  A 6  Að 6  (!¨  A¾ 6  A¿ 6¿   (  Aj (   (â   (  Ajã   Aj (   (ä   (  Ajã     ¨6  Aê 6  A 6  (!©  AÀ 6  AÁ 6¿   (  Aj (   (ç   (  Ajè   Aj (   (é   (  Ajè     ©6  Aè 6  A6ü  (!ª  AÀ 6ô  AÁ 6ð¿   (  Aûj (   (ôç   (ô  Aüjè   Aûj (   (ðé   (ð  Aüjè     ª6ì  Aü 6è  A6ä  (ì!«  AÀ 6Ü  AÁ 6Ø¿   (è  Aãj (   (Üç   (Ü  Aäjè   Aãj (   (Øé   (Ø  Aäjè     «6Ô  AÒ 6Ð  A6Ì  (Ô!¬  AÀ 6Ä  AÁ 6À¿   (Ð  AËj (   (Äç   (Ä  AÌjè   AËj (   (Àé   (À  AÌjè     ¬6¼  AÏ 6¸  A6´  (¼!­  AÀ 6¬  AÁ 6¨¿   (¸  A³j (   (¬ç   (¬  A´jè   A³j (   (¨é   (¨  A´jè     ­6¤  AÌ 6   A6  (¤!®  AÀ 6  AÁ 6¿   (   Aj (   (ç   (  Ajè   Aj (   (é   (  Ajè     ®6  A· 6  A6  (!¯  AÀ 6ü  AÁ 6ø¿   (  Aj (   (üç   (ü  Ajè   Aj (   (øé   (ø  Ajè     ¯6ô  A 6ð  A$6ì  (ô!°  AÀ 6ä  AÁ 6à¿   (ð  Aëj (   (äç   (ä  Aìjè   Aëj (   (àé   (à  Aìjè     °6Ü  AÎ 6Ø  A(6Ô  (Ü!±  AÀ 6Ì  AÁ 6È¿   (Ø  AÓj (   (Ìç   (Ì  AÔjè   AÓj (   (Èé   (È  AÔjè     ±6ü  A 6ø  A06ô  (ü!²  A¾ 6ì  A¿ 6è¿   (ø  Aój (   (ìâ   (ì  Aôjã   Aój (   (èä   (è  Aôjã     ²6ä  Aë 6à  A86Ü  (ä!³  A¾ 6Ô  A¿ 6Ð¿   (à  AÛj (   (Ôâ   (Ô  AÜjã   AÛj (   (Ðä   (Ð  AÜjã     ³6Ì  AÛ 6È  AÀ 6Ä  (Ì!´  A¾ 6¼  A¿ 6¸¿   (È  AÃj (   (¼â   (¼  AÄjã   AÃj (   (¸ä   (¸  AÄjã     ´6´  Aî 6°  A6¬  (´!µ  AÂ 6¤  AÃ 6 ¿   (°  A«jì (   (¤í   (¤  A¬jî   A«jì (   ( ï   (   A¬jî     µ6Ì  Aþ 6È  A¸6Ä  (Ì!¶  AÄ 6¼  AÅ 6¸¿   (È  AÃjò (   (¼ó   (¼  AÄjô   AÃjò (   (¸õ   (¸  AÄjô     ¶6ì\r  Að 6è\r  AÐ6ä\r  (ì\r!·  A¼ 6Ü\r  A½ 6Ø\r¿   (è\r  Aã\rjÜ (   (Ü\rÝ   (Ü\r  Aä\rjÞ   Aã\rjÜ (   (Ø\rß   (Ø\r  Aä\rjÞ     ·6ä  A 6à  AØ6Ü  AÆ 6Ô  AÇ 6Ð¿   (à  AÛjø (   (Ôù   (Ô  AÜjú   AÛjø (   (Ðû   (Ð  AÜjú    AÛjAª ü   AÛjAÇ A ý A Aý   AÛjþ   AÚjAÅ ÿ   AÚjAÇ A  A A   AÚj   AÙjAÂ    AÙjAÐ A  AÞ A Aé A   AÙj A¼  Aã AÈ    A×jAØ    A×jA± A  A¶ A A A   A×j A½ AÉ  A  Aþ AÊ    AÕjAï    AÕjA± A  A A   AÕj Aº  Aþ AË  A AÌ  A° AÍ    Aj$ c# Ak! $    6  6 (!  (6  A 6 (   î  Aj$  # Ak!   A 6A  9# Ak! $    6 (Â ! Aj$   A  A H# Ak! $    6 (!@ A FAq\r  Aí  Aj$ 	 Ã 	 Ä 	 Å  A # Ak!   6Aû  # Ak!   6Aþ  # Ak!   6A¡ # A k! $    6  6  6  6  6  6Aé !  ((  ((  ((  ((  ((  (( ¤  A j$  l# Ak! $    6 AÎ 6û  AjÇ  AjÈ  (É  ( (  Aj$ I# Ak! $    6  6 ( (( jÎ ! Aj$  X# Ak! $    6  6  6 (Í ! ( (( j 6  Aj$ 4# Ak! $    6Ï ! Aj$  # Ak!   6A¼¡ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6AÀ¡ Ã# A k! $  ( ! (!   6  6  6 AÏ 6û ! (! AjÑ ! AjÒ ! (Ó !	 (!\n AjÔ !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 AÐ 6û ! (! AjÚ ! AjÛ ! (Ü !	 (!\n AjÝ !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 AÑ 6û ! (! Ajâ ! Ajã ! (ä !	 (!\n Ajå !A !A !\r     	 \n   \rAq \rAq  A j$ # A k! $    6  6  6  6  6 (! (Ö  (Ö  (Ö  (Ö    ç ! A j$  # Ak!   6A4# Ak! $    6è ! Aj$  # Ak!   6A´¢  9# Ak! $    6 (é ! Aj$   A  A H# Ak! $    6 (!@ A FAq\r  A0í  Aj$ 	 ê 	 ë 	 ì # Ak!   6AÄ£ # Ak!   6AÇ£ # A k! $    6  6  6  6  6  6A0é !  (+  (+  (+  (+  (+  (+ ª  A j$  l# Ak! $    6 AÒ 6  Ajî  Ajï  (ð  ( (  Aj$ K|# Ak! $    6  6 ( (( jõ ! Aj$  Z|# Ak! $    6  6  9  + ô ! ( (( j 9  Aj$ 4# Ak! $    6ö ! Aj$  # Ak!   6Aü£ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6A¤ Ã# A k! $  ( ! (!   6  6  6 AÓ 6 ! (! Ajø ! Ajù ! (ú !	 (!\n Ajû !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 AÔ 6 ! (! Aj ! Aj ! ( !	 (!\n Aj !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 AÕ 6 ! (! Aj ! Aj ! ( !	 (!\n Aj !A !A !\r     	 \n   \rAq \rAq  A j$  9# Ak! $    6 ( ! Aj$   A  A Q# Ak! $    6 (!@ A FAq\r  ë  A í  Aj$ 	  	  	  # Ak!   6A½¥ # Ak!   6AÀ¥ X# Ak! $    6  6A é !  (+  (( A<Å  Aj$  l# Ak! $    6 AÖ 6«  Aj  Aj  (  ( (  Aj$ ¼|# AÀ k! $    6<  68  90  6,  6( (<! (8 ! +0ô ! (,Í !	 ((Í !\n Aj   	 \n    Aj ! Ajë  AÀ j$  # Ak!   6A4# Ak! $    6 ! Aj$  # Ak!   6Aô¥ Ã# A k! $  ( ! (!   6  6  6 A× 6« ! (! Aj ! Aj ! ( !	 (!\n Aj !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 AØ 6« ! (! Aj£ ! Aj¤ ! (¥ !	 (!\n Aj¦ !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 AÙ 6« ! (! Aj© ! Ajª ! (« !	 (!\n Aj¬ !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 AÚ 6« ! (! Aj° ! Aj± ! (² !	 (!\n Aj³ !A !A !\r     	 \n   \rAq \rAq  A j$  9# Ak! $    6 (¶ ! Aj$   A  A R# Ak! $    6 (!@ A FAq\r  ·  Aøí  Aj$ 	 ¸ 	 ¹ 	 º # Ak!   6Aû§ # Ak!   6Aþ§ Þ|# A°k! $    6¬  6¨  6¤  9  9  6 (¬! (¨Í ! (¤Í !	 +ô !\n +ô ! (Í ! Aj  	 \n      Aj» !\r Aj·  A°j$  \r# Ak!   6A4# Ak! $    6¼ ! Aj$  # Ak!   6A¨¨ Þ|# A k! $    6  6  6  6  9  9 (! (Í ! (Í !	 (Í !\n +ô ! +ô ! Aj  	 \n      Aj» !\r Aj·  A j$  \r# Ak!   6A4# Ak! $    6¾ ! Aj$  # Ak!   6AÈ¨ Ã# A k! $  ( ! (!   6  6  6 AÛ 6¿ ! (! AjÀ ! AjÁ ! (Â !	 (!\n AjÃ !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 AÜ 6¿ ! (! AjÇ ! AjÈ ! (É !	 (!\n AjÊ !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 AÝ 6¿ ! (! AjÍ ! AjÎ ! (Ï !	 (!\n AjÐ !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 AÞ 6¿ ! (! AjÓ ! AjÔ ! (Õ !	 (!\n AjÖ !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 Aß 6¿ ! (! AjÚ ! AjÛ ! (Ü !	 (!\n AjÝ !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 Aà 6¿ ! (! Ajà ! Ajá ! (â !	 (!\n Ajã !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 Aá 6¿ ! (! Ajè ! Ajé ! (ê !	 (!\n Ajë !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 Aâ 6¿ ! (! Ajî ! Ajï ! (ð !	 (!\n Ajñ !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 Aã 6¿ ! (! Ajô ! Ajõ ! (ö !	 (!\n Aj÷ !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 Aä 6¿ ! (! Ajú ! Ajû ! (ü !	 (!\n Ajý !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 Aå 6¿ ! (! Aj ! Aj ! ( !	 (!\n Aj !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 Aæ 6¿ ! (! Aj ! Aj ! ( !	 (!\n Aj !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 Aç 6¿ ! (! Aj ! Aj ! ( !	 (!\n Aj !A !A !\r     	 \n   \rAq \rAq  A j$ Ã# A k! $  ( ! (!   6  6  6 Aè 6¿ ! (! Aj ! Aj ! ( !	 (!\n Aj !A !A !\r     	 \n   \rAq \rAq  A j$ I# Ak! $    6  6 ( (( j ! Aj$  [# Ak! $    6  6  6 (Ö ! ( (( j ) 7  Aj$ 4# Ak! $    6 ! Aj$  # Ak!   6A°¬ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6A´¬ K|# Ak! $    6  6 ( (( jõ ! Aj$  Z|# Ak! $    6  6  9  + ô ! ( (( j 9  Aj$ # Ak!   6A¹¬ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6A½¬ I# Ak! $    6  6 ( (( jÎ ! Aj$  X# Ak! $    6  6  6 (Í ! ( (( j 6  Aj$ # Ak!   6AÂ¬ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6AÆ¬ I# Ak! $    6  6 ( (( j ! Aj$  # Ak! $    6  6  6 ( ! ( (( j!  )(7(  ) 7   )7  )7  )7  ) 7  Aj$ 4# Ak! $    6 ! Aj$  # Ak!   6AÐ¬ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6AÔ¬ I# Ak! $    6  6 ( (( jç ! Aj$  s# Ak! $    6  6  6 (Þ ! ( (( j!  )7  )7  ) 7  Aj$ 4# Ak! $    6 ! Aj$  # Ak!   6Aà¬ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6Aä¬ I# Ak! $    6  6 ( (( j ! Aj$  \\# Ak! $    6  6  6 ( ! ( (( j ã  Aj$ 4# Ak! $    6 ! Aj$  # Ak!   6Að¬ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6Aô¬ # Ak! $    6  6 (!   Aé 6 Aê 6   ( (  ( (   (   Aj$  ª# A k! $    6  6  6 (! Aë 6 Aì 6  (   (¡  ( Aj¢    (£  ( Aj¢   A j$  H# Ak! $    6 (!   ¤  Aj$  # Ak! $    6  6 (!   Aí 6 Aî 6 §  ( (¨  ( ( ©  (   Aj$  ª# A k! $    6  6  6 (! Aï 6 Að 6§  (¬  (­  ( Aj® ¬  (¯  ( Aj®   A j$  H# Ak! $    6 (!§   ¤  Aj$  # Ak! $    6  6 (!   Añ 6 Aò 6 ²  ( (³  ( ( ´  (   Aj$  ª# A k! $    6  6  6 (! Aó 6 Aô 6²  (§  (·  ( Aj¸ §  (¹  ( Aj¸   A j$  ª# A k! $    6  6  6 (! Aõ 6 Aö 6²  (  (¼  ( Aj½   (¾  ( Aj½   A j$  ª# A k! $    6  6  6 (! A÷ 6 Aø 6²  (   (Á  ( AjÂ    (Ã  ( AjÂ   A j$  H# Ak! $    6 (!²   ¤  Aj$  Í# Ak! $    6Ä  (!  Aj6(  6$Å  Aù 6  Ç 6 È 6 Aú 6Ê Ë Ì þ  ( Í  (  (  ( (  ( ($ (Î  (   Aj6,  (,6| Aû 6x (|! (xÐ   68 A· 64 Aü 60 (8! (4 (0Ò   6D A 6@ Aý 6< (D! (@ (<Ô   6P A 6L Aþ 6H (P! (L (HÖ   6\\ Aú 6X Aÿ 6T (\\! (X (TØ   6h Aö 6d A 6` (h! (d (`Ú   6t A 6p Aú 6lÊ ²  (p (l  Aj$ # Ak! $    6  6 A 6  (! AjÜ ! AjÝ ! ( Þ ! ( ! (!A !	       	Aq 	Aq  Aj$ # Ak! $    6  6 (!   A 6 A 6 á  ( (â  ( ( ã  (   Aj$  ª# A k! $    6  6  6 (! A 6 A 6á  (æ  (ç  ( Ajè æ  (é  ( Ajè   A j$  ª# A k! $    6  6  6 (! A 6 A 6á  (ì  (í  ( Ajî ì  (ï  ( Ajî   A j$  ª# A k! $    6  6  6 (! A 6 A 6á  (   (ò  ( Ajó    (ô  ( Ajó   A j$  H# Ak! $    6 (!á   ¤  Aj$  # Ak! $    6  6 A 6  (! Ajö ! Aj÷ ! ( ø ! ( ! (!A !	       	Aq 	Aq  Aj$ Í# Ak! $    6ù  (!  Aj6(  6$ú  A 6  ü 6 ý 6 A 6ÿ   þ  (   (  (  ( (  ( ($ (  (   Aj6,  (,6| A 6x (|! (x   68 A· 64 A 60 (8! (4 (0   6D A 6@ A 6< (D! (@ (<   6P A 6L A 6H (P! (L (H   6\\ Aú 6X A 6T (\\! (X (T   6h Aö 6d A 6` (h! (d (`   6t A 6p Aú 6lÿ á  (p (l  Aj$ # Ak! $    6  6 A 6  (! Aj ! Aj ! (  ! ( ! (!A !	       	Aq 	Aq  Aj$ # Ak! $    6  6 (!   A 6 A 6   ( (  ( (   (   Aj$  ª# A k! $    6  6  6 (! A 6 A 6  (æ  (  ( Aj æ  (  ( Aj   A j$  ª# A k! $    6  6  6 (! A 6 A 6  (   (   ( Aj¡    (¢  ( Aj¡   A j$  H# Ak! $    6 (!   ¤  Aj$  Í# Ak! $    6£  (!  Aj6(  6$¤  A 6  ¦ 6 § 6 A 6© ª « þ  ( ¬  (  (  ( (  ( ($ (­  (   Aj6,  (,6| A 6x (|! (x¯   68 A· 64 A 60 (8! (4 (0±   6D A 6@ A 6< (D! (@ (<³   6P A 6L A 6H (P! (L (Hµ   6\\ Aú 6X A  6T (\\! (X (T·   6h Aö 6d A¡ 6` (h! (d (`¹   6t A 6p Aú 6l©   (p (l  Aj$ # Ak! $    6  6 A¢ 6  (! Aj» ! Aj¼ ! ( ½ ! ( ! (!A !	       	Aq 	Aq  Aj$ # Ak! $    6  6 A£ 6  (! Aj¿ ! AjÀ ! ( Á ! ( ! (!A !	       	Aq 	Aq  Aj$ # Ak!   6 (%|Aé ! A ·!    ¬   H# Ak! $    6 (!@ A FAq\r  Aí  Aj$ 	   # Ak!   6Aù¬ # Ak!   6Aû¬ K|# Ak! $    6  6 ( (( jõ ! Aj$  Z|# Ak! $    6  6  9  + ô ! ( (( j 9  Aj$ 	 ¡ # Ak!   6Aþ¬ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6A­ # Ak!   6 ("Aé ! A !    ¥   H# Ak! $    6 (!@ A FAq\r  Aí  Aj$ 	 ¢ # Ak!   6A­ # Ak!   6A­ I# Ak! $    6  6 ( (( jÎ ! Aj$  X# Ak! $    6  6  6 (Í ! ( (( j 6  Aj$ 	 £ # Ak!   6A­ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6A­ AØ é !   ¶   R# Ak! $    6 (!@ A FAq\r  ¸  AØ í  Aj$ 	 ¤ # Ak!   6A²­ # Ak!   6A´­ I# Ak! $    6  6 ( (( j ! Aj$  [# Ak! $    6  6  6 (Ö ! ( (( j ) 7  Aj$ # Ak!   6A·­ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6A»­ I# Ak! $    6  6 ( (( j¥ ! Aj$  i# Ak! $    6  6  6 (ý ! ( (( j!  )7  ) 7  Aj$ # Ak!   6AÀ­ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6AÄ­ K|# Ak! $    6  6 ( (( jõ ! Aj$  Z|# Ak! $    6  6  9  + ô ! ( (( j 9  Aj$ # Ak!   6AÉ­ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6AÍ­ =@@A - Àô AqE\r A! A   : Àô ¦ ²   9# Ak! $    6 (« ! Aj$   A  A Q# Ak! $    6 (!@ A FAq\r  î  Aí  Aj$ 	 ¬ 	 ­ 	 ® # Ak!   6AÄ³ # Ak!   6AÇ³ Aé !   Æ   l# Ak! $    6 A¤ 6Ê  Aj°  Aj±  (²  ( (  Aj$ A# Ak! $    6  6 ( (·  Aj$ ®\n# Ak! $    6  6 A¥ 6 Ê ! (! Aj¶ ! Aj· ! ( ¸ ! ( ! Aj¹ !	A !\nA !       	 \n Aq Aq  Aj$ M# Ak! $    6  6  6 ( ( (§  Aj$ ®\n# Ak! $    6  6 A¦ 6 Ê ! (! Aj¿ ! AjÀ ! ( Á ! ( ! AjÂ !	A !\nA !       	 \n Aq Aq  Aj$ 9# Ak! $    6 (¹ ! Aj$  ®\n# Ak! $    6  6 A§ 6 Ê ! (! AjÍ ! AjÎ ! ( Ï ! ( ! AjÐ !	A !\nA !       	 \n Aq Aq  Aj$ y# Ak! $    6  6  6@@ ( (¹ IAqE\r    ( (Ù ¨   ©  Aj$ ®\n# Ak! $    6  6 A¨ 6 Ê ! (! AjÔ ! AjÕ ! ( Ö ! ( ! Aj× !	A !\nA !       	 \n Aq Aq  Aj$ a# Ak! $    6  6  6 (! ( (Ì  Í AAq! Aj$  ®\n# Ak! $    6  6 A© 6 Ê ! (! Aj ! Aj ! (  ! ( ! Aj !	A !\nA !       	 \n Aq Aq  Aj$ Ø	# Aà k! $    6\\  6X  6T  6P  6L  6H  6D (\\! (Xý !	 (Tý !\n (Pý ! (Lý ! (Hý !\r (Dý ! Aj 	 \n   \r     Aj ! Aà j$  # Ak!   6A4# Ak! $    6 ! Aj$  # Ak!   6Aµ 5~Aé ! B !   7   7   7   ©   Q# Ak! $    6 (!@ A FAq\r  ¬  Aí  Aj$ 	  # Ak!   6A½µ # Ak!   6A¿µ I# Ak! $    6  6 ( (( jä ! Aj$  r# A k! $    6  6  6 (! Aj   ( (( j Ajª  Aj  A j$ 	  # Ak!   6AÂµ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6AÆµ I# Ak! $    6  6 ( (( jÑ ! Aj$  X# Ak! $    6  6  6 (Ã ! ( (( j 6  Aj$ 	  # Ak!   6AËµ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6AÏµ K|# Ak! $    6  6 ( (( jõ ! Aj$  Z|# Ak! $    6  6  9  + ô ! ( (( j 9  Aj$ # Ak!   6AÔµ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6AØµ t# A0k! $    6,  6( (,! ((Ã ! Aj     Aj ! Aj¬  A0j$  # Ak!   6A4# Ak! $    6 ! Aj$  # Ak!   6Aèµ =@@A - Ìô AqE\r A! A   : Ìô  á   9# Ak! $    6 (  ! Aj$   A  A Q# Ak! $    6 (!@ A FAq\r  ²  Aí  Aj$ 	 ¡ 	 ¢ 	 £ # Ak!   6A¼ # Ak!   6A¢¼ Aé !   °   l# Ak! $    6 Aª 6ÿ  Aj¥  Aj¦  (§  ( (  Aj$ A# Ak! $    6  6 ( (  Aj$ ®\n# Ak! $    6  6 A« 6 ÿ ! (! Aj« ! Aj¬ ! ( ­ ! ( ! Aj® !	A !\nA !       	 \n Aq Aq  Aj$ M# Ak! $    6  6  6 ( ( (  Aj$ ®\n# Ak! $    6  6 A¬ 6 ÿ ! (! Aj· ! Aj¸ ! ( ¹ ! ( ! Ajº !	A !\nA !       	 \n Aq Aq  Aj$ 9# Ak! $    6 (ö ! Aj$  ®\n# Ak! $    6  6 A­ 6 ÿ ! (! AjÃ ! AjÄ ! ( Å ! ( ! AjÆ !	A !\nA !       	 \n Aq Aq  Aj$ y# Ak! $    6  6  6@@ ( (ö IAqE\r    ( (      Aj$ ®\n# Ak! $    6  6 A® 6 ÿ ! (! AjÉ ! AjÊ ! ( Ë ! ( ! AjÌ !	A !\nA !       	 \n Aq Aq  Aj$ a# Ak! $    6  6  6 (! ( (   AAq! Aj$  ®\n# Ak! $    6  6 A¯ 6 ÿ ! (! Ajð ! Ajñ ! ( ò ! ( ! Ajó !	A !\nA !       	 \n Aq Aq  Aj$ t# A k! $    6  6 (! (Í ! Aj     Ajõ ! Aj²  A j$  # Ak!   6A4# Ak! $    6ö ! Aj$  # Ak!   6AÀ½ 5~Aé ! B !   7   7   7   Ã   Q# Ak! $    6 (!@ A FAq\r  Ä  Aí  Aj$ 	  # Ak!   6Aè½ # Ak!   6Aê½ I# Ak! $    6  6 ( (( jä ! Aj$  r# A k! $    6  6  6 (! Aj   ( (( j Ajª  Aj  A j$ # Ak!   6Aí½ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6Añ½ K|# Ak! $    6  6 ( (( jõ ! Aj$  Z|# Ak! $    6  6  9  + ô ! ( (( j 9  Aj$ # Ak!   6Aö½ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6Aú½ =@@A - Øô AqE\r A! A   : Øô     9# Ak! $    6 ( ! Aj$   A  A Q# Ak! $    6 (!@ A FAq\r  ¾  Aí  Aj$ 	  	  	  # Ak!   6A¢Ä # Ak!   6A¥Ä Aé !   ¹   l# Ak! $    6 A° 6©  Aj  Aj  (  ( (  Aj$ A# Ak! $    6  6 ( (  Aj$ ®\n# Ak! $    6  6 A± 6 © ! (! Aj ! Aj  ! ( ¡ ! ( ! Aj¢ !	A !\nA !       	 \n Aq Aq  Aj$ M# Ak! $    6  6  6 ( ( (  Aj$ ®\n# Ak! $    6  6 A² 6 © ! (! Aj« ! Aj¬ ! ( ­ ! ( ! Aj® !	A !\nA !       	 \n Aq Aq  Aj$ 9# Ak! $    6 (¯ ! Aj$  ®\n# Ak! $    6  6 A³ 6 © ! (! Aj· ! Aj¸ ! ( ¹ ! ( ! Ajº !	A !\nA !       	 \n Aq Aq  Aj$ y# Ak! $    6  6  6@@ ( (¯ IAqE\r    ( (      Aj$ ®\n# Ak! $    6  6 A´ 6 © ! (! Aj½ ! Aj¾ ! ( ¿ ! ( ! AjÀ !	A !\nA !       	 \n Aq Aq  Aj$ a# Ak! $    6  6  6 (! ( (  Ô AAq! Aj$  ®\n# Ak! $    6  6 Aµ 6 © ! (! Ajä ! Ajå ! ( æ ! ( ! Ajç !	A !\nA !       	 \n Aq Aq  Aj$ Ù|# AÀ k! $    6<  68  64  9(  9  (<! (8¯ ! Aj ÷  (4Í ! +(ô !	 + ô !\n Aj Aj  	 \n    Ajé ! Aj¾  Aj²  AÀ j$  # Ak!   6A4# Ak! $    6ê ! Aj$  # Ak!   6AÔÅ º|# A0k! $    6,  6(  9   9  9 (,! ((Ã ! + ô ! +ô !	 +ô !\n Aj   	 \n    Ajé ! Aj¾  A0j$  # Ak!   6A4# Ak! $    6ÿ ! Aj$  # Ak!   6AôÅ # Ak!   6AÜ 	 AÜ 	 A  	 AÄ  ò# AÀ k! $    6<  68  64  60  6,  6(  6$ (<!  (8Ê 6   (4Ê 6  (0Ê 6  (,Ê 6  ((Ê 6  ($Ê 6 A j Aj Aj Aj Aj Aj   Ë !	 AÀ j$  	# Ak!   6A4# Ak! $    6Ì ! Aj$  # Ak!   6A¬¡ 9# Ak! $    6 (Í ! Aj$  # Ak!   6 (	 A¡ # Ak!   6 (# Ak!   6 (( 	 A¸¡ »\n# A k! $    6  6  6 (Õ ! (! (! ( !  Auj!@@ AqE\r  (  j( !	 !	 	!\n (Ö ! Aj   \n   Aj× ! A j$  # Ak!   6A4# Ak! $    6Ø ! Aj$  # Ak!   6Aò¡ c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  # Ak!   6 (# Ak!   6 (C# Ak! $    6Aé !  () 7  Aj$  	 AÈ¡ »\n# A0k! $    6,  6(  6$ ((Õ ! (,! (! ( !  Auj!@@ AqE\r  (  j( !	 !	 	!\n ($Þ ! Aj   \n   Ajß ! A0j$  # Ak!   6A4# Ak! $    6à ! Aj$  # Ak!   6A¢ c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  # Ak!   6 ([# Ak! $    6Aé ! (!  )7  )7  ) 7  Aj$  	 Aø¡ ¥	# A0k! $    6,  6( ((Õ ! (,! (! ( !  Auj!@@ AqE\r  (  j( ! ! !	 Aj  	   Ajß !\n A0j$  \n# Ak!   6A4# Ak! $    6æ ! Aj$  # Ak!   6A¢ c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  	 A¢ [# Ak! $    6Aé ! (!  )7  )7  ) 7  Aj$  	 A ¢ # Ak!   6A¼¢ 	 A¼¢ 	 Aä¢ 	 A£ ò# Að k! $    6l  9`  9X  9P  9H  9@  98 (l!  +`ñ 90  +Xñ 9(  +Pñ 9   +Hñ 9  +@ñ 9  +8ñ 9 A0j A(j A j Aj Aj Aj   ò !	 Að j$  	# Ak!   6A4# Ak! $    6ó ! Aj$  # Ak!   6Aì£ ;|# Ak! $    9 +ô ! Aj$  # Ak!   6 (	 AÐ£ # Ak!   9 +# Ak!   6 (+ 	 Aø£ »\n# A0k! $    6,  6(  6$ ((ü ! (,! (! ( !  Auj!@@ AqE\r  (  j( !	 !	 	!\n ($ý ! Aj   \n   Ajþ ! A0j$  # Ak!   6A4# Ak! $    6ÿ ! Aj$  # Ak!   6A²¤ c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  # Ak!   6 (# Ak!   6 (Q# Ak! $    6Aé ! (!  )7  ) 7  Aj$  	 A¤ ½\n# AÐ k! $    6L  6H  6D (Hü ! (L! (! ( !  Auj!@@ AqE\r  (  j( !	 !	 	!\n (D ! Aj   \n   Aj ! AÐ j$  # Ak!   6A4# Ak! $    6 ! Aj$  # Ak!   6AÄ¤ c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  # Ak!   6 (y# Ak! $    6A0é ! (!  )(7(  ) 7   )7  )7  )7  ) 7  Aj$  	 A¸¤ §	# AÀ k! $    6<  68 (8ü ! (<! (! ( !  Auj!@@ AqE\r  (  j( ! ! !	 Aj  	   Aj !\n AÀ j$  \n# Ak!   6A4# Ak! $    6 ! Aj$  # Ak!   6AÔ¤ c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  	 AÌ¤ # Ak!   6AØ¤ 	 AØ¤ 	 Aô¤ 	 A¥ # A0k! $    6,  9   6 (,!  + ñ 9  (Ê 6 Aj Aj    ! A0j$  # Ak!   6A4# Ak! $    6 ! Aj$  # Ak!   6AÐ¥ # Ak!   6 (	 AÄ¥ D# Ak! $    6A é !  (  Aj$  	 Aà¥ m# Ak! $    6  6 (!  (ì  Aj! (Aj!  (6  ) 7  Aj$  Ç# A k! $    6  6  6  6  6 (  ! (! (! ( !	  Auj!\n@@ AqE\r  \n(  	j( ! 	! ! \n (  (Í  (Í     A j$ # Ak!   6A4# Ak! $    6¡ ! Aj$  # Ak!   6A¦ c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  # Ak!   6 (	 A¦ £# Ak! $    6  6  6 (  ! (! (! ( !  Auj!@@ AqE\r  (  j( !	 !	 	!\n  (  \n   Aj$ # Ak!   6A4# Ak! $    6§ ! Aj$  # Ak!   6A¨¦ c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  	 A¦ # Ak! $    6  6 (  ! (! (! ( !  Auj!@@ AqE\r  (  j( ! !    ­ !	 Aj$  	# Ak!   6A4# Ak! $    6® ! Aj$  # Ak!   6Aö¦ c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  D# Ak! $    6Aé !  (ì  Aj$  	 A°¦ µ# Ak! $    6  6  6  6  (´ ! (! (! ( !  Auj!	@@ AqE\r  	(  j( !\n !\n \n! 	 (Í  ( Í     Aj$ # Ak!   6A4# Ak! $    6µ ! Aj$  # Ak!   6A§ c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  # Ak!   6 (	 A§ # Ak!   6A§ M# Ak! $    6 (! AØjë  Aø jÝ  Aj$  	 A§ 	 A´§ 	 AØ§ E# Ak! $    6Aøé !  (½  Aj$  	 A¨ # Ak! $    6  6 (!  (Aø ü\n   Aø j (Aø jß  Aj (AjAÐ ü\n   AØj (AØj  Aj$  	 A°¨ ë# A0k! $    6,  6(  6$  6   9  9  6 ((Ä ! (,!	 	(!\n 	( !  \nAuj!@@ \nAqE\r  (  j( !\r !\r \r!  ($Í  ( Í  +ô  +ô  (Í     A0j$ # Ak!   6A4# Ak! $    6Å ! Aj$  # Ak!   6Aì¨ c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  # Ak!   6 (	 AÐ¨ ë# A0k! $    6,  6(  6$  6   6  9  9 ((Ä ! (,!	 	(!\n 	( !  \nAuj!@@ \nAqE\r  (  j( !\r !\r \r!  ($Í  ( Í  (Í  +ô  +ô     A0j$ # Ak!   6A4# Ak! $    6Ë ! Aj$  # Ak!   6A© c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  	 A© Ý|# A0k! $    6,  6(  9   9  9 ((Ä ! (,! (! ( !	  Auj!\n@@ AqE\r  \n(  	j( ! 	! !  \n + ô  +ô  +ô    9 Ajõ !\r A0j$  \r# Ak!   6A4# Ak! $    6Ñ ! Aj$  # Ak!   6AÄ© c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  	 A°© £|# A k! $    6  6 (× ! (! (! ( !  Auj!@@ AqE\r  (  j( ! !     9 Ajõ !	 A j$  	# Ak!   6A4# Ak! $    6Ø ! Aj$  # Ak!   6AÔ© c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  # Ak!   6 (	 AÌ© ¹|# A k! $    6  6  9 (Ä ! (! (! ( !  Auj!@@ AqE\r  (  j( !	 !	 	!\n   +ô  \n  9 Ajõ ! A j$  # Ak!   6A4# Ak! $    6Þ ! Aj$  # Ak!   6Aä© c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  	 AØ© Ý	# A0k! $    6,  6(  6$ ((× ! (,! (! ( !  Auj!@@ AqE\r  (  j( !	 !	 	!\n  ($Ö ) 7 Aj  )7  Aj   \n   Ajä ! Aj  A0j$  # Ak!   6A4# Ak! $    6å ! Aj$  # Ak!   6A¿ª c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  # Ak! $    6  (æ A tAjÐ 6 (æ ! ( 6  (Aj! (Þ ! (æ A t!@ E\r    ü\n   (! Aj$  	 Aì© 9# Ak! $    6 (ß ! Aj$  ø\n# AÀ k! $    6<  68  64  60 (8× ! (<! (! ( !  Auj!	@@ AqE\r  	(  j( !\n !\n \n!  (4Ö ) 7 (0Í ! A$j  )7 A$j 	 Aj     A$jä !\r A$j  AÀ j$  \r# Ak!   6A4# Ak! $    6ì ! Aj$  # Ak!   6Aàª c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  	 AÐª # Ak! $    6  6 (Ä ! (! (! ( !  Auj!@@ AqE\r  (  j( ! !     Aj$ # Ak!   6A4# Ak! $    6ò ! Aj$  # Ak!   6Aðª c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  	 Aèª Ò|# A0k! $    6,  6(  6$  9 ((Ä ! (,! (! ( !  Auj!	@@ AqE\r  	(  j( !\n !\n \n!  ($Ö ) 7 +ô !  )7 	 Aj     A0j$ # Ak!   6A4# Ak! $    6ø ! Aj$  # Ak!   6A« c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  	 A« ý|# AÀ k! $    6<  68  64  60  9( (8Ä ! (<! (! ( !	  Auj!\n@@ AqE\r  \n(  	j( ! 	! !  (4Ö ) 7   (0Ö ) 7 +(ô !\r  ) 7  )7 \n Aj Aj \r    AÀ j$ # Ak!   6A4# Ak! $    6þ ! Aj$  # Ak!   6A´« c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  	 A « £|# AÐ k! $    6L  6H  6D  6@  6<  90 (HÄ ! (L! (!	 ( !\n  	Auj!@@ 	AqE\r  (  \nj( ! \n! !\r  (DÖ ) 7(  (@Ö ) 7   (<Ö ) 7 +0ô !  )(7  ) 7  )7   Aj Aj   \r   AÐ j$ # Ak!   6A4# Ak! $    6 ! Aj$  # Ak!   6AØ« c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  	 AÀ« ù|# AÀ k! $    6<  68  90  6,  6( (8Ä ! (<! (! ( !	  Auj!\n@@ AqE\r  \n(  	j( ! 	! ! +0ô !\r (,Í ! ((Í ! Aj \n \r      Aj ! Ajë  AÀ j$  # Ak!   6A4# Ak! $    6 ! Aj$  # Ak!   6Aô« c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  	 Aà« µ# A k! $    6  6  6  9 (Ä ! (! (! ( !  Auj!	@@ AqE\r  	(  j( !\n !\n \n! 	 (  +ô     A j$ # Ak!   6A4# Ak! $    6 ! Aj$  # Ak!   6A¬ c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  # Ak!   6 (	 A¬ Ê	# A0k! $    6,  6(  6$ ((× ! (,! (! ( !  Auj!@@ AqE\r  (  j( !	 !	 	!\n  ($Ö ) 7  )7  Aj \n  Aq Aq! A0j$  # Ak!   6A4# Ak! $    6 ! Aj$  # Ak!   6A¤¬ c# Ak! $    6Aé ! (! ( !  (6  6   6 (! Aj$  "# Ak!   Aq:  - Aq	 A¬ C# Ak! $    6Aé !  () 7  Aj$  	 A¬¬ y# Ak! $    6A0é ! (!  )(7(  ) 7   )7  )7  )7  ) 7  Aj$  	 AÌ¬ 	 AÜ¬ D# Ak! $    6A é !  (  Aj$  	 Aì¬ 	 A¤ 	 AÔë 	 AÔ¡ 	 Aë 	 A­ Q# Ak! $    6Aé ! (!  )7  ) 7  Aj$  	 ª ¨# Ak! $    6  6  6 (!  ¹ 6 @@ (  (IAqE\r   ( ( k (Å @ (  (KAqE\r   (  (AØ lj«  Aj$ H# Ak! $    6  6 (!  (ý  Aj$  <# Ak! $    6 (! þ  Aj$  	 AÔ­ # Ak!   6A¸¦ 	 A¸¦ 	 A´² 	 Aü² D# Ak! $    6 (  ³ ! Aj$  # Ak!   6A4# Ak! $    6´ ! Aj$  # Ak!   6AÐ³ # Ak!   6 (	 AÌ³ # Að k! $    6l  6h  6d (l( ! (hº ! (d! Aj »   Aj    Aj¸  Að j$ # Ak!   6A4# Ak! $    6¼ ! Aj$  # Ak!   6Aà³ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6 (E# Ak! $    6  6   (½ Î  Aj$ 	 AÔ³ # Ak!   6 (w# Ak! $    6  6  6  6  (( ! (º  (Ã  ( ½     Aj$ # Ak!   6A4# Ak! $    6Ä ! Aj$  # Ak!   6A´ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6 (	 Að³ Ò# A k! $    6  6  6 (!@@ ( (kAØ m (OAqE\r   ( (Æ   ¹  (jÃ ! ¹ !    ¿  (! (!   Ç   À  Á  A j$ À# A k! $    6  6  6 (! (! Aj  Á   (6  (6 @@ (  (GAqE\r  (   (È  ( AØ j!  6   6  AjÂ  A j$ «# A k! $    6  6  6 (! Aj! (! Aj  É @@ ( (GAqE\r ( (  (È   (AØ j6  AjÊ  A j$ M# Ak! $    6  6  6 ( ( (Ë  Aj$ \\# Ak!   6  6  6 (!  (( 6   ((  (AØ lj6  (6 1# Ak!   6 (! ( ! ( 6  I# Ak! $    6  6  6 ( (Î  Aj$ g# Ak! $    6  6 (( !  (º    6 AjÑ ! Aj$  # Ak!   6A4# Ak! $    6Ò ! Aj$  # Ak!   6A´ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6 (( 	 A´ # Ak! $    6|  6x  6t (|( ! (xº ! (tÃ ! Aj      AjØ ! AjÙ  Aj$  # Ak!   6A4# Ak! $    6Ú ! Aj$  # Ak!   6AÈ´ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  ¤# A0k! $    6$@@  Û AqE\r   Ü ! Aj Ý   AjÞ 6, Ajß  Ajà   AjÞ 6, Ajß  (,! A0j$  <# Ak! $    6 (! á  Aj$  	 A¼´ <# Ak! $    6 (â Aq! Aj$  9# Ak! $    6 (ä ! Aj$  S# Ak! $    6  6 (! (!A !    å  Aj$  9# Ak! $    6 (ã ! Aj$  g# Ak! $    6 (!  6@ æ AqE\r  ç   A 6 (! Aj$  5# Ak! $    6  Aè  Aj$ <# Ak! $    6 (! ø  Aj$  "# Ak!   6 (- XAqN# Ak! $    6 (!  ç 6 A 6 (! Aj$  # Ak!   6 (±# A0k! $    6,  6(  6$  6 A - Èô Aq!A !@ Aÿq AÿqFAqE\r A´ é A´ ê A !A  6Äô A!A  : Èô  ( !	 Aj 	ë  A 6A (Äô !\n ((! ($! Ajì !\r  \n   Aj \r í 6 (! Aj î    (ï  Ajð  A0j$ %# Ak!   6 ((AKAq# Ak!   6 ((O# Ak! $    6  6 (!  6   (6 Aj$  # Ak!   6A4# Ak! $    6ñ ! Aj$  # A k! $    6  6 (!  ò 6 (!  Aj6  6 ( (ó ô  (õ  A j$  9# Ak! $    6 (ö ! Aj$  # Ak!   9 +ü1# Ak!   6  6 (!  (6  ># Ak! $    6  6   (÷  Aj$ ]# Ak! $    6 (!  6@ ( A GAqE\r  (   (! Aj$  	 A´ # Ak!   6 (E# Ak! $    6AØ é !  (Î  Aj$  F# Ak!   6  6 (! ((  6  (!  ( Aj6 # Ak!   6# Ak!   6 (?# Ak! $    6  6   (è  Aj$ <# Ak! $    6 (! ù  Aj$  <# Ak! $    6 (! ú  Aj$  <# Ak! $    6 (! û  Aj$  <# Ak! $    6 (! ü  Aj$  X# Ak! $    6 (!  6@ - XAqE\r  ¸  (! Aj$  H# Ak! $    6  6 (!  (ÿ  Aj$  <# Ak! $    6 (!   Aj$  H# Ak! $    6  6 (!  (  Aj$  H# Ak! $    6  6 (!  (  Aj$  H# Ak! $    6  6 (!  (  Aj$  H# Ak! $    6  6 (!  (  Aj$  O# Ak! $    6  6 (!  (Î  A: X Aj$  <# Ak! $    6 (!   Aj$  <# Ak! $    6 (!   Aj$  <# Ak! $    6 (!   Aj$  <# Ak! $    6 (!   Aj$  .# Ak!   6 (! A :   A : X # A k! $    6  6  6  6 (( ! (º  (Ã  (½    Aq Aq! A j$  # Ak!   6A4# Ak! $    6 ! Aj$  # Ak!   6Aà´ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  	 AÐ´ 	 Að´ 	 Aµ J# Ak! $    6  6   (Aj ((   Aj$ 	 Aø© \\# Ak! $    6  6  6 (!    ( (ÿ  Aj$  	 Aë D# Ak! $    6Aé !  (Ê  Aj$  	 Aàµ 	  B# Ak! $    6  6 ( (³  Aj$ §# Ak! $    6  6  6 (!  ö 6 @@ (  (IAqE\r   ( ( k (¼ @ (  (KAqE\r   (  (Alj½  Aj$ /# Ak!   6  6 ((  (AljH# Ak! $    6  6 (!  (ã  Aj$  <# Ak! $    6 (! ä  Aj$  /# Ak!   6  6 ((  (Aljm# Ak! $    6  6 (!  (é  Aj! (Aj!  (6  ) 7  Aj$  	 Aìµ # Ak!   6A¬º 	 A¬º 	 Aøº 	 AÌ» D# Ak! $    6 (  ¨ ! Aj$  # Ak!   6A4# Ak! $    6© ! Aj$  # Ak!   6A¬¼ # Ak!   6 (	 A¨¼ # A0k! $    6,  6(  6$ (,( ! ((¯ ! ($! Aj °   Aj    Aj¬  A0j$ # Ak!   6A4# Ak! $    6± ! Aj$  # Ak!   6A¼¼ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6 (E# Ak! $    6  6   (² Ê  Aj$ 	 A°¼ # Ak!   6 (# Ak! $    6  6 (!  (6@@ ( (IAqE\r   (´   (Aj6   (µ 6  (6 (Ahj! Aj$  y# A k! $    6  6 (! Aj A   (ü  (   (Aj6 Aj  A j$ °# A k! $    6  6 (!  ö Aj ! ö ! Aj      (ü  (   (Aj6  Aj  (! Aj  A j$  w# Ak! $    6  6  6  6  (( ! (¯  (Ã  ( ²     Aj$ # Ak!   6A4# Ak! $    6» ! Aj$  # Ak!   6Aà¼ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  	 AÐ¼ Ñ# A k! $    6  6  6 (!@@ ( (kAm (OAqE\r   ( (¾   ö  (j ! ö !      (! (!   ¿       A j$ _# Ak! $    6  6 (!  ö 6  (÷   (ø  Aj$ ¿# A k! $    6  6  6 (! (! Aj     (6  (6 @@ (  (GAqE\r  ( ü  (  ( Aj!  6   6  Aj  A j$ ª# A k! $    6  6  6 (! Aj! (! Aj  À @@ ( (GAqE\r ( (ü  (   (Aj6  AjÁ  A j$ [# Ak!   6  6  6 (!  (( 6   ((  (Alj6  (6 1# Ak!   6 (! ( ! ( 6  g# Ak! $    6  6 (( !  (¯    6 AjÑ ! Aj$  # Ak!   6A4# Ak! $    6Ç ! Aj$  # Ak!   6Að¼ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  	 Aè¼ # AÀ k! $    6<  68  64 (<( ! (8¯ ! (4Ã ! Aj      AjÍ ! AjÎ  AÀ j$  # Ak!   6A4# Ak! $    6Ï ! Aj$  # Ak!   6A½ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  ¤# A0k! $    6$@@  Ð AqE\r   Ñ ! Aj Ò   AjÞ 6, Ajß  Ajà   AjÞ 6, Ajß  (,! A0j$  <# Ak! $    6 (! Ó  Aj$  	 A½ <# Ak! $    6 (Ô Aq! Aj$  9# Ak! $    6 (Õ ! Aj$  S# Ak! $    6  6 (! (!A !    Ö  Aj$  <# Ak! $    6 (! Þ  Aj$  "# Ak!   6 (- Aq# Ak!   6 (±# A0k! $    6,  6(  6$  6 A - Ôô Aq!A !@ Aÿq AÿqFAqE\r Aô¼ × Aô¼ Ø A !A  6Ðô A!A  : Ôô  ( !	 Aj 	Ù  A 6A (Ðô !\n ((! ($! AjÚ !\r  \n   Aj \r í 6 (! Aj î    (ï  Ajð  A0j$ # Ak!   6A4# Ak! $    6Û ! Aj$  # A k! $    6  6 (!  ò 6 (!  Aj6  6 ( (Ü Ý  (õ  A j$  9# Ak! $    6 (ö ! Aj$  	 Aø¼ D# Ak! $    6Aé !  (Ê  Aj$  F# Ak!   6  6 (! ((  6  (!  ( Aj6 <# Ak! $    6 (! ß  Aj$  <# Ak! $    6 (! à  Aj$  <# Ak! $    6 (! á  Aj$  <# Ak! $    6 (! â  Aj$  X# Ak! $    6 (!  6@ - AqE\r  ¬  (! Aj$  H# Ak! $    6  6 (!  (å  Aj$  <# Ak! $    6 (! ê  Aj$  H# Ak! $    6  6 (!  (æ  Aj$  H# Ak! $    6  6 (!  (ç  Aj$  H# Ak! $    6  6 (!  (è  Aj$  H# Ak! $    6  6 (!  (é  Aj$  O# Ak! $    6  6 (!  (Ê  A:  Aj$  <# Ak! $    6 (! ë  Aj$  <# Ak! $    6 (! ì  Aj$  <# Ak! $    6 (! í  Aj$  <# Ak! $    6 (! î  Aj$  .# Ak!   6 (! A :   A :  # A k! $    6  6  6  6 (( ! (¯  (Ã  (²    Aq Aq! A j$  # Ak!   6A4# Ak! $    6ô ! Aj$  # Ak!   6A°½ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  	 A ½ D# Ak! $    6Aé !  (÷  Aj$  	 A¸½ }# Ak! $    6  6 (! A 6  A 6 A 6 (ø   ((  (( (ö ù  Aj$  # Ak!   6´# A k! $    6  6  6  6 (! Aj ¶  (! Aj ú @ (A KAqE\r   (û   ( ( (ü  Ajý  Ajþ  A j$ I# Ak! $    6  6  (6   (ÿ  Aj$ # Ak! $    6  6 (!@ (  KAqE\r    (!      ( 6   ( 6  (  (Alj6 A   Aj$ # A k! $    6  6  6  6 (! (! Aj      ( ( ( 6 Aj  A j$ !# Ak!   6 (A: V# Ak! $    6 (!  6@ - Aq\r  ·  (! Aj$  8# Ak!  6   6 (!  (6  A :  # A k! $    6  6  6  6 (! (! Aj     ( ( ( (  6 ( ( ! A j$  `# Ak! $   6  6  ( 6  ( 6    Aj   Aj$ 9# Ak! $    6 ( ! Aj$  ÿ# AÀ k! $    6<  68  64  60  (06, (<! Aj  A,j A0j  Aj  (6  )7  Aj  @@ (8 (4GAqE\r (< (0ü  (8   (8Aj68  (0Aj60  Aj  (0! Aj  AÀ j$  E# Ak! $    6  6 ( ( ! Aj$  D# Ak! $   6  6   ( (  Aj$ M# Ak! $    6  6  6 ( ( (  Aj$ 9# Ak! $    6 (ü ! Aj$  R# Ak! $    6  6 ( ( (ü kAmAlj! Aj$  H# Ak!   6  6  6 (!  (( 6   (( 6 I# Ak! $    6  6  6 ( (Ê  Aj$ 	 AÄ½ 	  B# Ak! $    6  6 ( (§  Aj$ §# Ak! $    6  6  6 (!  ¯ 6 @@ (  (IAqE\r   ( ( k (° @ (  (KAqE\r   (  (Alj±  Aj$ /# Ak!   6  6 ((  (AljH# Ak! $    6  6 (!  (×  Aj$  <# Ak! $    6 (! Ø  Aj$  /# Ak!   6  6 ((  (Alj	 A¾ # Ak!   6A´Â 	 A´Â 	 AüÂ 	 AÐÃ D# Ak! $    6 (   ! Aj$  # Ak!   6A4# Ak! $    6 ! Aj$  # Ak!   6A¬Ä # Ak!   6 (	 A¨Ä # A0k! $    6,  6(  6$ (,( ! ((£ ! ($! Aj ¤   Aj    AjÄ  A0j$ # Ak!   6A4# Ak! $    6¥ ! Aj$  # Ak!   6A¼Ä Q# Ak! $    6Aé !  (( 6   6 (! Aj$  # Ak!   6 (E# Ak! $    6  6   (¦ Õ  Aj$ 	 A°Ä # Ak!   6 (# Ak! $    6  6 (!  (6@@ ( (IAqE\r   (¨   (Aj6   (© 6  (6 (Ahj! Aj$  y# A k! $    6  6 (! Aj A¼   (µ  (Ó   (Aj6 Aj¾  A j$ °# A k! $    6  6 (!  ¯ Aj¿ ! ¯ ! Aj   À   (µ  (Ó   (Aj6  AjÁ  (! AjÂ  A j$  w# Ak! $    6  6  6  6  (( ! (£  (Ã  ( ¦     Aj$ # Ak!   6A4# Ak! $    6¯ ! Aj$  # Ak!   6AàÄ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  	 AÐÄ Ñ# A k! $    6  6  6 (!@@ ( (kAm (OAqE\r   ( (²   ¯  (j¿ ! ¯ !    À  (! (!   ³   Á  Â  A j$ _# Ak! $    6  6 (!  ¯ 6  (°   (±  Aj$ ¿# A k! $    6  6  6 (! (! Aj  ¼   (6  (6 @@ (  (GAqE\r  ( µ  (½  ( Aj!  6   6  Aj¾  A j$ ª# A k! $    6  6  6 (! Aj! (! Aj  ´ @@ ( (GAqE\r ( (µ  (½   (Aj6  Ajµ  A j$ [# Ak!   6  6  6 (!  (( 6   ((  (Alj6  (6 1# Ak!   6 (! ( ! ( 6  g# Ak! $    6  6 (( !  (£    6 AjÑ ! Aj$  # Ak!   6A4# Ak! $    6» ! Aj$  # Ak!   6AðÄ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  	 AèÄ # AÀ k! $    6<  68  64 (<( ! (8£ ! (4Ã ! Aj      AjÁ ! AjÂ  AÀ j$  # Ak!   6A4# Ak! $    6Ã ! Aj$  # Ak!   6AÅ Q# Ak! $    6Aé !  (( 6   6 (! Aj$  ¤# A0k! $    6$@@  Ä AqE\r   Å ! Aj Æ   AjÞ 6, Ajß  Ajà   AjÞ 6, Ajß  (,! A0j$  <# Ak! $    6 (! Ç  Aj$  	 AÅ <# Ak! $    6 (È Aq! Aj$  9# Ak! $    6 (É ! Aj$  S# Ak! $    6  6 (! (!A !    Ê  Aj$  <# Ak! $    6 (! Ò  Aj$  "# Ak!   6 (- Aq# Ak!   6 (±# A0k! $    6,  6(  6$  6 A - àô Aq!A !@ Aÿq AÿqFAqE\r AôÄ Ë AôÄ Ì A !A  6Üô A!A  : àô  ( !	 Aj 	Í  A 6A (Üô !\n ((! ($! AjÎ !\r  \n   Aj \r í 6 (! Aj î    (ï  Ajð  A0j$ # Ak!   6A4# Ak! $    6Ï ! Aj$  # A k! $    6  6 (!  ò 6 (!  Aj6  6 ( (Ð Ñ  (õ  A j$  9# Ak! $    6 (ö ! Aj$  	 AøÄ D# Ak! $    6Aé !  (Õ  Aj$  F# Ak!   6  6 (! ((  6  (!  ( Aj6 <# Ak! $    6 (! Ó  Aj$  <# Ak! $    6 (! Ô  Aj$  <# Ak! $    6 (! Õ  Aj$  <# Ak! $    6 (! Ö  Aj$  X# Ak! $    6 (!  6@ - AqE\r  Ä  (! Aj$  H# Ak! $    6  6 (!  (Ù  Aj$  <# Ak! $    6 (! Þ  Aj$  H# Ak! $    6  6 (!  (Ú  Aj$  H# Ak! $    6  6 (!  (Û  Aj$  H# Ak! $    6  6 (!  (Ü  Aj$  H# Ak! $    6  6 (!  (Ý  Aj$  O# Ak! $    6  6 (!  (Õ  A:  Aj$  <# Ak! $    6 (! ß  Aj$  <# Ak! $    6 (! à  Aj$  <# Ak! $    6 (! á  Aj$  <# Ak! $    6 (! â  Aj$  .# Ak!   6 (! A :   A :  # A k! $    6  6  6  6 (( ! (£  (Ã  (¦    Aq Aq! A j$  # Ak!   6A4# Ak! $    6è ! Aj$  # Ak!   6A°Å Q# Ak! $    6Aé !  (( 6   6 (! Aj$  	 A Å D# Ak! $    6Aé !  (ë  Aj$  	 AÀÅ }# Ak! $    6  6 (! A 6  A 6 A 6 (ì   ((  (( (¯ í  Aj$  # Ak!   6´# A k! $    6  6  6  6 (! Aj Ã  (! Aj î @ (A KAqE\r   (ï   ( ( (ð  Ajñ  Ajò  A j$ I# Ak! $    6  6  (6   (ó  Aj$ # Ak! $    6  6 (!@ ( Å KAqE\r Æ   (!   Ç   ( 6   ( 6  (  (Alj6 A Ê  Aj$ # A k! $    6  6  6  6 (! (! Aj  ¼    ( ( (ô 6 Aj¾  A j$ !# Ak!   6 (A: V# Ak! $    6 (!  6@ - Aq\r  Ä  (! Aj$  8# Ak!  6   6 (!  (6  A :  # A k! $    6  6  6  6 (! (! Aj  õ   ( ( ( (ö ÷ 6 ( (ø ! A j$  `# Ak! $   6  6  (ö 6  (ö 6    Aj ù  Aj$ 9# Ak! $    6 (û ! Aj$  ÿ# AÀ k! $    6<  68  64  60  (06, (<! Aj  A,j A0jÑ  Aj  (6  )7  Aj Ò @@ (8 (4GAqE\r (< (0µ  (8ú   (8Aj68  (0Aj60  AjÔ  (0! AjÖ  AÀ j$  E# Ak! $    6  6 ( (ü ! Aj$  D# Ak! $   6  6   ( (ý  Aj$ M# Ak! $    6  6  6 ( ( (þ  Aj$ 9# Ak! $    6 (µ ! Aj$  R# Ak! $    6  6 ( ( (µ kAmAlj! Aj$  H# Ak!   6  6  6 (!  (( 6   (( 6 I# Ak! $    6  6  6 ( (Õ  Aj$ 	 AàÅ 	 ñ 	 õ ~|@  ½"B §Aÿÿÿÿq"AÀ I\r   D-DTû!ù?  ¦   Bÿÿÿÿÿÿÿÿÿ Bøÿ V@@@ AÿÿïþK\r A! AòO\r   ! @ AÿÿËÿK\r @ AÿÿÿK\r      D      ð¿   D       @ £! A !  D      ð¿   D      ð? £! A!@ AÿÿK\r   D      ø¿   D      ø?¢D      ð? £! A!D      ð¿  £! A!    ¢" ¢"    D/lj,D´¢¿¢DýÞR-Þ­¿ ¢Dmt¯ò°³¿ ¢Dq#þÆq¼¿ ¢DÄëÉ¿ ¢!      DÚ"ã:­?¢Dë\rv$K{©? ¢DQ=Ð f\r±? ¢Dn LÅÍE·? ¢Dÿ $IÂ? ¢D\rUUUUUÕ? ¢!@ AÿÿïþK\r        ¢¡ At"+Æ      ¢ + Æ ¡  ¡¡"    B S!      ½Ô~|@@  Bÿÿÿÿÿÿÿÿÿ Bøÿ V\r    Bÿÿÿÿÿÿÿÿÿ Bøÿ T\r    @ ½"B §"AÀ|j §"r\r     AvAq"  ½"B?§r!@@ B §Aÿÿÿÿq" §r\r   !@@  D-DTû!	@D-DTû!	À@ Aÿÿÿÿq" r\r D-DTû!ù?  ¦@@ AÀÿG\r  AÀÿG\r At+ÀÆ @@ AÀÿF\r  A j O\rD-DTû!ù?  ¦@@ E\r D        ! A j I\r   £  !@@@   D-DTû!	@ D\\3&¦¡¼ ¡ D\\3&¦¡¼ D-DTû!	À  At+àÆ !    ½       ¢# Ak"  9 +   D       p    D        £~|~@@   Aÿq"D      < "kD      @  kI\r @  O\r   D      ð?   ½!@ D      @ I\r D        ! BxQ\r@ D      ð I\r   D      ð? @ B S\r A   B³È@T\r A  A   BBV!    A +ÀÇ " " ¡¡"   ¢" ¢  A +èÇ ¢A +àÇ  ¢   A +ØÇ ¢A +ÐÇ  ¢  A +ÈÇ ¢ ½"§AtAðq"+ðÇ    !  B- )øÇ |!@ \r       ¿"  ¢  ! 	   ½B4§Ç|@ BB R\r  Bx|¿"  ¢  "    @ Bð?|¿"  ¢"  " D      ð?cE\r  D       ¢ D          D      ð? "    ¡   D      ð? ¡   D      ð¿ "   D        a!   D       ¢ # Ak" B7  + # Ak  9   \' D      ð¿D      ð?   D        £# Ak"  9 +     ¡"   £~|~   !@  ½"BêÖ@|BÿÿÿÿV\r @ Bø?R\r D        A +ð× "  D      ð¿ " ½Bp¿"¢"    ¢"  A +¸Ø ¢A +°Ø  ¢" "  ¢"	 	   A +øØ ¢A +ðØ  ¢  A +èØ ¢A +àØ   ¢   A +ØØ ¢A +ÐØ  ¢  A +ÈØ ¢A +ÀØ    ¢   ¡ ¢  A +ø× ¢    ¡    @@ A~jA~K\r @  D        b\r A  Bøÿ Q\r@@ AÿÿK\r  AðÿqAðÿG\r     D      0C¢½Bà||! B@|"\nB.§A?qAt"+Ù  \nB4¹ "A +ð× " +Ù   \nBx}¿ +á ¡ +á ¡¢" ½Bp¿"¢" "    ¢"  ¢  A +¨Ø ¢A + Ø  ¢   A +Ø ¢A +Ø  ¢  A +Ø ¢A +Ø    ¢   ¡ ¢A +ø×   ¢    ¡    !   	   ½B0§   A*   Aõ ]A Aõ 6üõ  ! A A A k6Ôõ A A 6Ðõ A   6´õ A A (¨ð 6Øõ 9# Ak"$   6     Å ! Aj$    @    ü\n    @ AI\r         j!@@   sAq\r @@  Aq\r   !@ \r   !  !@  -  :   Aj! Aj"AqE\r  I\r  A|q!@ AÀ I\r   A@j"K\r @  ( 6   (6  (6  (6  (6  (6  (6  (6  ( 6   ($6$  ((6(  (,6,  (060  (464  (868  (<6< AÀ j! AÀ j" M\r   O\r@  ( 6  Aj! Aj" I\r @ AO\r   !@ AO\r   ! A|j!  !@  -  :    - :   - :   - :  Aj! Aj" M\r @  O\r @  -  :   Aj! Aj" G\r   -@   Aj"Ð "\r A        !@@  AqE\r @  -  \r     k  !@ Aj"AqE\r -  \r @ "Aj!A ( "k rAxqAxF\r @ "Aj! -  \r    k®~|@@  ½"Bÿÿÿÿ Bðåò?T"E\r D-DTû!é?  ¡D\\3&¦<   BU"¡ ! D        !        ¢"¢"DcUUUUUÕ?¢    ¢"    DsS`ÛËuó¾¢D¦7 ~? ¢DeòòØDC? ¢D(VÉ"mm? ¢D7Öôd? ¢DzþÁ?       DÔz¿tp*û>¢Dé§ð2¸? ¢Dh÷&0? ¢DàþÈÛW? ¢Dnéã&? ¢DþA³º¡«? ¢ ¢  ¢   " !@ \r A Atk·"     ¢   £¡ "  ¡"  Aq@ E\r D      ð¿ £" ½Bp¿"  ½Bp¿"  ¡¡¢  ¢D      ð?  ¢  ! ® @@ AH\r   D      à¢! @ AÿO\r  Axj!  D      à¢!  Aý AýIApj! AxJ\r   D      `¢! @ A¸pM\r  AÉj!  D      `¢!  Aðh AðhKAj!   Aÿj­B4¿¢   |||# A°k"$  A}jAm"A  A J"Ahl j!@ AtAé j( "	 Aj"\njA H\r  	 j!  \nk!A !@@@ A N\r D        ! At(é ·! AÀj Atj 9  Aj! Aj" G\r  Ahj!\rA ! 	A  	A J! AH!@@@ E\r D        !  \nj!A !D        !@   Atj+  AÀj  kAtj+ ¢  ! Aj" G\r   Atj 9   F! Aj! E\r A/ k!A0 k! AtAé j! 	!@@  Atj+ !A ! !@ AH\r @ Aàj Atj D      p>¢ü·"D      pÁ¢  ü6   AtjAxj+   ! Aj! Aj" G\r   \r  !  D      À?¢¡ D       À¢ " ü"·¡!@@@@@ \rAH"\r  Aàj AtjA|j" ( "  u" tk"6   u!  j! \r\r Aàj AtjA|j( Au! AH\rA! D      à?f\r A !A !A !A!@ AH\r @ Aàj Atj"\n( !@@@@ E\r Aÿÿÿ! E\rA! \n  k6 A!A !A !A! Aj" G\r @ \r Aÿÿÿ!@@ \rAj Aÿÿÿ! Aàj AtjA|j" (  q6  Aj! AG\r D      ð? ¡!A! \r  D      ð? \r  ¡!@ D        b\r A ! !@  	L\r @ Aàj Aj"Atj(  r!  	J\r  E\r @ \rAhj!\r Aàj Aj"Atj( E\r A!@ "Aj! Aàj 	 kAtj( E\r   j!@ AÀj  j"Atj  Aj"Atj( ·9 A !D        !@ AH\r @   Atj+  AÀj  kAtj+ ¢  ! Aj" G\r   Atj 9   H\r  !@@ A k  "D      pAfE\r  Aàj Atj D      p>¢ü"·D      pÁ¢  ü6  Aj! !\r ü! Aàj Atj 6 D      ð? \r  !@ A H\r  !@  "Atj  Aàj Atj( ·¢9  Aj! D      p>¢! \r A ! !@ 	  	 H!  k!\n  Atj! A !D        !@ At"+àþ    j+ ¢  !  G! Aj! \r  A j \nAtj 9  Aj!  G! Aj! \r @@@@@  D        !@ A L\r  !@ A j Atj"Axj" + " + " "9     ¡ 9  AK! Aj! \r  AF\r  !@ A j Atj"Axj" + " + " "9     ¡ 9  AK! Aj! \r D        !@  A j Atj+  ! AK! Aj! \r  + ! \r  9  +¨!  9  9D        !@ A H\r @ "Aj!  A j Atj+  ! \r     9 D        !@ A H\r  !@ "Aj!  A j Atj+  ! \r     9  +  ¡!A!@ AH\r @  A j Atj+  !  G! Aj! \r     9  9  +¨!  9  9 A°j$  Aqº\n~|# A0k"$ @@@@  ½"B §"Aÿÿÿÿq"AúÔ½K\r  Aÿÿ?qAûÃ$F\r@ Aü²K\r @ B S\r    D  @Tû!ù¿ " D1cba´Ð½ "9     ¡D1cba´Ð½ 9A!   D  @Tû!ù? " D1cba´Ð= "9     ¡D1cba´Ð= 9A!@ B S\r    D  @Tû!	À " D1cba´à½ "9     ¡D1cba´à½ 9A!   D  @Tû!	@ " D1cba´à= "9     ¡D1cba´à= 9A~!@ A»ñK\r @ A¼û×K\r  Aü²ËF\r@ B S\r    D  0|ÙÀ " DÊ§é½ "9     ¡DÊ§é½ 9A!   D  0|Ù@ " DÊ§é= "9     ¡DÊ§é= 9A}! AûÃäF\r@ B S\r    D  @Tû!À " D1cba´ð½ "9     ¡D1cba´ð½ 9A!   D  @Tû!@ " D1cba´ð= "9     ¡D1cba´ð= 9A|! AúÃäK\r  DÈÉm0_ä?¢D      8C D      8Ã "ü!@@   D  @Tû!ù¿¢ " D1cba´Ð=¢"¡"	D-DTû!é¿cE\r  Aj! D      ð¿ "D1cba´Ð=¢!   D  @Tû!ù¿¢ ! 	D-DTû!é?dE\r  Aj! D      ð? "D1cba´Ð=¢!   D  @Tû!ù¿¢ !   ¡" 9 @ Av"\n  ½B4§AÿqkAH\r    D  `a´Ð=¢" ¡"	 Dsp.£;¢  	¡  ¡¡"¡" 9 @ \n  ½B4§AÿqkA2N\r  	!  	 D   .£;¢" ¡" DÁI %{9¢ 	 ¡  ¡¡"¡" 9     ¡ ¡9@ AÀÿI\r      ¡" 9    9A ! AjAr! BÿÿÿÿÿÿÿB°Á ¿!  Aj!A!\n@   ü·"9    ¡D      pA¢!  \nAq!A !\n ! \r    9 A!@ "\nAj! Aj \nAtj+ D        a\r  Aj  AvAêwj \nAjA¢ ! + ! @ BU\r    9   +9A  k!   9   +9 A0j$  # Ak"$ @@  ½B §Aÿÿÿÿq"AûÃ¤ÿK\r  AòI\r  D        A  ! @ AÀÿI\r     ¡!    £ ! +  + Aq !  Aj$    A  A  A  A  A  A    A ö ¬ A¤ö  A ö ­ \\    (H"Aj r6H@  ( "AqE\r    A r6 A  B 7    (,"6   6     (0j6A é A G!@@@  AqE\r  E\r  Aÿq!@  -   F\r Aj"A G!  Aj" AqE\r \r  E\r@  -   AÿqF\r  AI\r  AÿqAl!@A  (  s"k rAxqAxG\r  Aj!  A|j"AK\r  E\r Aÿq!@@  -   G\r     Aj!  Aj"\r A   A  ± "  k   A¨ö ~@  ½"B4§Aÿq"AÿF\r @ \r @@  D        b\r A !  D      ðC¢ ´ !  ( A@j!  6     Axj6  BÿÿÿÿÿÿÿBð?¿!   æ@@ ("\r A ! ° \r (!@   ("kM\r      ($  @@ (PA H\r  E\r  !@@   j"Aj-  A\nF\r Aj"E\r      ($  " I\r  k! (!  !A !      ( j6  j! g  l!@@ (LAJ\r     µ !  ¥ !    µ !  E\r  ¦ @   G\r  A     nò~@ E\r    :     j"Aj :   AI\r    :    :  A}j :   A~j :   AI\r    :  A|j :   A	I\r   A   kAq"j" AÿqAl"6    kA|q"j"A|j 6  A	I\r   6  6 Axj 6  Atj 6  AI\r   6  6  6  6 Apj 6  Alj 6  Ahj 6  Adj 6   AqAr"k"A I\r  ­B~!  j!@  7  7  7  7  A j! A`j"AK\r   # AÐk"$   6Ì A jA A(ü   (Ì6È@@A   AÈj AÐ j A j  ¹ A N\r A!@@  (LA N\r A!  ¥ E!    ( "A_q6 @@@@  (0\r   AÐ 60  A 6  B 7  (,!   6,A !  (\rA!  ° \r    AÈj AÐ j A j  ¹ ! A q!@ E\r   A A   ($    A 60   6,  A 6  (!  B 7 A !    ( " r6 A  A q! \r   ¦  AÐj$  ~# AÀ k"$   6< A)j! A\'j!	 A(j!\nA !A !@@@@@A !\r@ ! \r AÿÿÿÿsJ\r \r j! !\r@@@@@@ -  "E\r @@@@ Aÿq"\r  \r! A%G\r \r!@@ - A%F\r  ! \rAj!\r - ! Aj"! A%F\r  \r k"\r Aÿÿÿÿs"J\r\n@  E\r     \rº  \r\r  6< Aj!\rA!@ , APj"A	K\r  - A$G\r  Aj!\rA! !  \r6<A !@@ \r,  "A`j"AM\r  \r!A ! \r!A t"AÑqE\r @  \rAj"6<  r! \r, "A`j"A O\r !\rA t"AÑq\r @@ A*G\r @@ , APj"\rA	K\r  - A$G\r @@  \r   \rAtjA\n6 A !  \rAtj( ! Aj!A! \r Aj!@  \r   6<A !A !  ( "\rAj6  \r( !A !  6< AJ\rA  k! AÀ r! A<j» "A H\r (<!A !\rA!@@ -  A.F\r A !@ - A*G\r @@ , APj"A	K\r  - A$G\r @@  \r   AtjA\n6 A !  Atj( ! Aj! \r Aj!@  \r A !  ( "Aj6  ( !  6< AJ!  Aj6<A! A<j» ! (<!@ \r!A! ",  "\rAjAFI\r Aj! A:l \rjAßþ j-  "\rAjAÿqAI\r   6<@@ \rAF\r  \rE\r\r@ A H\r @  \r   Atj \r6 \r   Atj) 70  E\r	 A0j \r  ¼  AJ\rA !\r  E\r	  -  A q\r Aÿÿ{q"  AÀ q!A !A ! \n!@@@@@@@@@@@@@@@@@ -  "À"\rASq \r AqAF \r "\rA¨j!	\n  \n!@ \rA¿j  \rAÓ F\rA !A ! )0!A !\r@@@@@@@   (0 6  (0 6  (0 ¬7  (0 ;  (0 :   (0 6  (0 ¬7  A AK! Ar!Aø !\rA !A ! )0" \n \rA q½ ! P\r AqE\r \rAvA j!A!A !A ! )0" \n¾ ! AqE\r   k"\r  \rJ!@ )0"BU\r  B  }"70A!A !@ AqE\r A!A  !A¡ A  Aq"!  \n¿ !  A Hq\r Aÿÿ{q  !@ B R\r  \r  \n! \n!A !  \n k Pj"\r  \rJ!\r - 0!\r (0"\rAÞ  \r!   Aÿÿÿÿ AÿÿÿÿI² "\rj!@ AL\r  ! \r!\r ! \r! -  \r )0"PE\rA !\r	@ E\r  (0!A !\r  A  A  À  A 6  >  Aj60 Aj!A!A !\r@@ ( "E\r Aj È "A H\r   \rkK\r Aj!  \rj"\r I\r A=! \rA H\r\r  A   \r À @ \r\r A !\rA ! (0!@ ( "E\r Aj È " j" \rK\r   Aj º  Aj!  \rI\r   A   \r AÀ sÀ   \r  \rJ!\r	  A Hq\r\nA=!   +0    \r   "\rA N\r \r- ! \rAj!\r   \r\n E\rA!\r@@  \rAtj( "E\r  \rAtj   ¼ A! \rAj"\rA\nG\r @ \rA\nI\r A!@  \rAtj( \rA! \rAj"\rA\nF\r A!  \r: \'A! 	! \n! ! \n!   k"  J" AÿÿÿÿsJ\rA=!   j"  J"\r K\r  A  \r  À     º   A0 \r  AsÀ   A0  A À     º   A  \r  AÀ sÀ  (<!A !A=!³  6 A! AÀ j$   @  -  A q\r     µ {A !@  ( ",  APj"A	M\r A @A!@ AÌ³æ K\r A  A\nl"j  AÿÿÿÿsK!   Aj"6  , ! ! ! APj"A\nI\r  ¾ @@@@@@@@@@@@@@@@@@@ Awj 	\n\r  ( "Aj6    ( 6   ( "Aj6    4 7   ( "Aj6    5 7   ( "Aj6    4 7   ( "Aj6    5 7   ( AjAxq"Aj6    ) 7   ( "Aj6    2 7   ( "Aj6    3 7   ( "Aj6    0  7   ( "Aj6    1  7   ( AjAxq"Aj6    ) 7   ( "Aj6    5 7   ( AjAxq"Aj6    ) 7   ( AjAxq"Aj6    ) 7   ( "Aj6    4 7   ( "Aj6    5 7   ( AjAxq"Aj6    + 9       5 @  P\r @ Aj"  §Aq- ð  r:    B" B R\r  . @  P\r @ Aj"  §AqA0r:    B" B R\r  {~@  BT\r @ Aj"  " B\n" B\n~}§A0r:   BÿÿÿÿV\r @  P\r   §!@ Aj"  A\nn"A\nlkA0r:   A	K! ! \r  # Ak"$ @  L\r  AÀq\r     k"A AI"· @ \r @   Aº  A~j"AÿK\r     º  Aj$      A¶ A· ¸ Ã~~|# A°k"$ A ! A 6,@@ Ä "BU\r A!	A© !\n "Ä !@ AqE\r A!	A¬ !\nA¯ Aª  Aq"	!\n 	E!@@ Bøÿ Bøÿ R\r   A   	Aj" Aÿÿ{qÀ    \n 	º   Aö Aº  A q"Aì Aê    bAº   A    AÀ sÀ     J!\r Aj!@@@@  A,j´ "  "D        a\r   (,"Aj6, A r"Aá G\r A r"Aá F\rA  A H! (,!  Acj"6,A  A H! D      °A¢! A0jA A  A Hj"!@  ü"6  Aj!  ¸¡D    eÍÍA¢"D        b\r @@ AN\r  ! ! ! ! !@ A AI!@ A|j" I\r  ­!B !@  5   |" BëÜ"BëÜ~}>  A|j" O\r  BëÜT\r  A|j" > @@ " M\r A|j"( E\r   (, k"6, ! A J\r @ AJ\r  AjA	nAj! Aæ F!@A  k"A	 A	I!\r@@  I\r A A ( !AëÜ \rv!A \rtAs!A ! !@  ( " \rv j6   q l! Aj" I\r A A ( ! E\r   6  Aj!  (, \rj"6,   j" " Atj   kAu J! A H\r A !@  O\r   kAuA	l!A\n! ( "A\nI\r @ Aj!  A\nl"O\r @ A   Aæ Fk A G Aç Fqk"  kAuA	lAwjN\r  A0jA`A¤b A Hj AÈ j"A	m"Atj!\rA\n!@  A	lk"AJ\r @ A\nl! Aj"AG\r  \rAj!@@ \r( "  n" lk"\r   F\r@@ Aq\r D      @C! AëÜG\r \r M\r \rA|j-  AqE\rD     @C!D      à?D      ð?D      ø?  FD      ø?  Av"F  I!@ \r  \n-  A-G\r  ! ! \r  k"6     a\r  \r  j"6 @ AëÜI\r @ \rA 6 @ \rA|j"\r O\r  A|j"A 6  \r \r( Aj"6  AÿëÜK\r   kAuA	l!A\n! ( "A\nI\r @ Aj!  A\nl"O\r  \rAj"   K!@@ " M"\r A|j"( E\r @@ Aç F\r  Aq! AsA A " J A{Jq"\r j!AA~ \r j! Aq"\r Aw!@ \r  A|j( "\rE\r A\n!A ! \rA\np\r @ "Aj! \r A\nl"pE\r  As!  kAuA	l!@ A_qAÆ G\r A !   jAwj"A  A J"  H!A !   j jAwj"A  A J"  H!A!\r AýÿÿÿAþÿÿÿ  r"J\r  A GjAj!@@ A_q"AÆ G\r   AÿÿÿÿsJ\r A  A J!@   Au"s k­ ¿ "kAJ\r @ Aj"A0:    kAH\r  A~j" :  A!\r AjA-A+ A H:    k" AÿÿÿÿsJ\rA!\r  j" 	AÿÿÿÿsJ\r  A    	j" À    \n 	º   A0   AsÀ @@@@ AÆ G\r  AjA	r!    K"!@ 5  ¿ !@@  F\r   AjM\r@ Aj"A0:    AjK\r   G\r  Aj"A0:       kº  Aj" M\r @ E\r   AÚ Aº   O\r AH\r@@ 5  ¿ " AjM\r @ Aj"A0:    AjK\r     A	 A	Hº  Awj! Aj" O\r A	J! ! \r @ A H\r   Aj  K!\r AjA	r! !@@ 5  ¿ " G\r  Aj"A0:  @@  F\r   AjM\r@ Aj"A0:    AjK\r    Aº  Aj!  rE\r   AÚ Aº      k"   Jº   k! Aj" \rO\r AJ\r   A0 AjAA À      kº  !  A0 A	jA	A À   A    AÀ sÀ     J!\r \n AtAuA	qj!@ AK\r A k!D      0@!@ D      0@¢! Aj"\r @ -  A-G\r    ¡ !    ¡!@ (," Au"s k­ ¿ " G\r  Aj"A0:   (,! 	Ar! A q! A~j" Aj:   AjA-A+ A H:   AH AqEq! Aj!@ " ü"Að j-   r:    ·¡D      0@¢!@ Aj" AjkAG\r  D        a q\r  A.:  Aj! D        b\r A!\r Aýÿÿÿ   k"j"kJ\r   A    Aj  Ajk" A~j H  "j" À     º   A0   AsÀ    Aj º   A0  kA A À     º   A    AÀ sÀ     J!\r A°j$  \r.  ( AjAxq"Aj6    )  )à 9    ½# A k"$     Aj " 6   A Gk6 A Aü  A6L A¸ 6$ A6P  Aj6,  Aj6T  A :     Á ! A j$  ¶  (T"( !@ ("  (  ("k"  I"E\r       (  j"6   ( k"6@    I"E\r       (  j"6   ( k6 A :      (,"6   6 ¬A!@@  E\r  Aÿ M\r@@ (`( \r  AqA¿F\r³ A6 @ AÿK\r    A?qAr:    AvAÀr:  A@@ A°I\r  A@qAÀG\r   A?qAr:    AvAàr:     AvA?qAr: A@ A|jAÿÿ?K\r    A?qAr:    AvAðr:     AvA?qAr:    AvA?qAr: A³ A6 A!    :  A @  \r A    A Ç 	    @  \r A ³   6 A      (<Ë  Ê # A k"$    ("6  (!  6  6   k"6  j! Aj!A!@@@@@  (< AjA Aj Ê E\r  !@  ("F\r@ AJ\r  ! AA   ("K"	j" (   A  	k"j6  AA 	j" (  k6   k! !  (<   	k" Aj Ê E\r  AG\r    (,"6   6     (0j6 !A !  A 6  B 7    ( A r6  AF\r   (k! A j$  K# Ak"$     Aÿq Aj Ê ! )! Aj$ B     (<  Î ø&# Ak"$ @@@@@  AôK\r @A (´ö "A  AjAøq  AI"Av"v" AqE\r @@  AsAq j"At"AÜö j" (äö "(" G\r A  A~ wq6´ö   A (Äö I\r  ( G\r   6   6 Aj!   Ar6  j" (Ar6 A (¼ö "M\r@  E\r @@   tA t" A   krqh"At"AÜö j" (äö " ("G\r A  A~ wq"6´ö  A (Äö I\r (  G\r  6  6   Ar6   j"  k"Ar6   j 6 @ E\r  AxqAÜö j!A (Èö !@@ A Avt"q\r A   r6´ö  ! ("A (Äö I\r  6  6  6  6  Aj! A  6Èö A  6¼ö A (¸ö "	E\r 	hAt(äø "(Axq k! !@@@ (" \r  (" E\r  (Axq k"   I"!    !  !  A (Äö "\nI\r (!@@ ("  F\r  (" \nI\r ( G\r  ( G\r   6   6@@@ ("E\r  Aj! ("E\r Aj!@ ! " Aj!  ("\r   Aj!  ("\r   \nI\r A 6 A ! @ E\r @@  ("At"(äø G\r  Aäø j  6   \rA  	A~ wq6¸ö   \nI\r@@ ( G\r    6   6  E\r   \nI\r   6@ ("E\r   \nI\r   6   6 ("E\r   \nI\r   6   6@@ AK\r    j" Ar6   j"   (Ar6  Ar6  j" Ar6  j 6 @ E\r  AxqAÜö j!A (Èö ! @@A Avt" q\r A   r6´ö  ! (" \nI\r   6   6   6   6A  6Èö A  6¼ö  Aj! A!  A¿K\r   Aj"Axq!A (¸ö "E\r A!@  AôÿÿK\r  A& Avg" kvAq  AtkA>j!A  k!@@@@ At(äø "\r A ! A !A !  A A Avk AFt!A !@@ (Axq k" O\r  ! ! \r A ! ! !    ("   AvAqj("F   !  At! ! \r @   r\r A !A t" A   kr q" E\r  hAt(äø !   E\r@  (Axq k" I!@  ("\r   (!   !    ! !  \r  E\r  A (¼ö  kO\r  A (Äö "I\r (!@@ ("  F\r  (" I\r ( G\r  ( G\r   6   6@@@ ("E\r  Aj! ("E\r Aj!@ ! " Aj!  ("\r   Aj!  ("\r   I\r A 6 A ! @ E\r @@  ("At"(äø G\r  Aäø j  6   \rA  A~ wq"6¸ö   I\r@@ ( G\r    6   6  E\r   I\r   6@ ("E\r   I\r   6   6 ("E\r   I\r   6   6@@ AK\r    j" Ar6   j"   (Ar6  Ar6  j" Ar6  j 6 @ AÿK\r  AøqAÜö j! @@A (´ö "A Avt"q\r A   r6´ö   !  (" I\r   6  6   6  6A! @ AÿÿÿK\r  A& Avg" kvAq  AtrA>s!    6 B 7  AtAäø j!@@@ A  t"q\r A   r6¸ö   6   6 A A  Avk  AFt!  ( !@ "(Axq F\r  Av!  At!   Aqj"("\r  Aj"  I\r   6   6  6  6  I\r ("  I\r   6  6 A 6  6   6 Aj! @A (¼ö "  I\r A (Èö !@@   k"AI\r   j" Ar6   j 6   Ar6   Ar6   j"   (Ar6A !A !A  6¼ö A  6Èö  Aj! @A (Àö " M\r A   k"6Àö A A (Ìö "  j"6Ìö   Ar6   Ar6  Aj! @@A (ú E\r A (ú !A B7ú A B 7ú A  AjApqAØªÕªs6ú A A 6 ú A A 6ðù A !A !   A/j"j"A  k"q" M\rA ! @A (ìù "E\r A (äù " j" M\r  K\r@@@A - ðù Aq\r @@@@@A (Ìö "E\r Aôù ! @@   ( "I\r     (jI\r  (" \r A Ù "AF\r !@A (ú " Aj" qE\r   k  jA   kqj!  M\r@A (ìù " E\r A (äù " j" M\r   K\r Ù "  G\r  k q"Ù "  (   (jF\r !   AF\r@  A0jI\r   !  kA (ú "jA  kq"Ù AF\r  j!  ! AG\rA A (ðù Ar6ðù  Ù !A Ù !  AF\r  AF\r   O\r   k" A(jM\rA A (äù  j" 6äù @  A (èù M\r A   6èù @@@@A (Ìö "E\r Aôù ! @   ( "  ("jF\r  (" \r @@A (Äö " E\r    O\rA  6Äö A ! A  6øù A  6ôù A A6Ôö A A (ú 6Øö A A 6ú @  At" AÜö j"6äö   6èö   Aj" A G\r A  AXj" Ax kAq"k"6Àö A   j"6Ìö   Ar6   jA(6A A (ú 6Ðö   O\r   I\r   (Aq\r     j6A  Ax kAq" j"6Ìö A A (Àö  j"  k" 6Àö    Ar6  jA(6A A (ú 6Ðö @ A (Äö O\r A  6Äö   j!Aôù ! @@@  ( " F\r  (" \r   - AqE\rAôù ! @@@   ( "I\r     (j"I\r  (!  A  AXj" Ax kAq"k"6Àö A   j"6Ìö   Ar6   jA(6A A (ú 6Ðö   A\' kAqjAQj"    AjI"A6 A )üù 7 A )ôù 7A  Aj6üù A  6øù A  6ôù A A 6ú  Aj! @  A6  Aj!  Aj!   I\r   F\r   (A~q6   k"Ar6  6 @@ AÿK\r  AøqAÜö j! @@A (´ö "A Avt"q\r A   r6´ö   !  ("A (Äö I\r   6  6A!A!A! @ AÿÿÿK\r  A& Avg" kvAq  AtrA>s!    6 B 7  AtAäø j!@@@A (¸ö "A  t"q\r A   r6¸ö   6   6 A A  Avk  AFt!  ( !@ "(Axq F\r  Av!  At!   Aqj"("\r  Aj" A (Äö I\r   6   6A!A! ! !  A (Äö "I\r ("  I\r   6  6   6A ! A!A!  j 6   j  6 A (Àö "  M\r A    k"6Àö A A (Ìö "  j"6Ìö   Ar6   Ar6  Aj! ³ A06 A ! É     6     ( j6   Ñ !  Aj$   \n  Ax  kAqj" Ar6 Ax kAqj"  j"k! @@@ A (Ìö G\r A  6Ìö A A (Àö   j"6Àö   Ar6@ A (Èö G\r A  6Èö A A (¼ö   j"6¼ö   Ar6  j 6 @ ("AqAG\r  (!@@ AÿK\r @ (" AøqAÜö j"F\r  A (Äö I\r ( G\r@  G\r A A (´ö A~ Avwq6´ö @  F\r  A (Äö I\r ( G\r  6  6 (!@@  F\r  ("A (Äö I\r ( G\r ( G\r  6  6@@@ ("E\r  Aj! ("E\r Aj!@ !	 "Aj! ("\r  Aj! ("\r  	A (Äö I\r 	A 6 A ! E\r @@  ("At"(äø G\r  Aäø j 6  \rA A (¸ö A~ wq6¸ö  A (Äö I\r@@ ( G\r   6  6 E\r A (Äö "I\r  6@ ("E\r   I\r  6  6 ("E\r   I\r  6  6 Axq"  j!   j"(!  A~q6   Ar6   j  6 @  AÿK\r   AøqAÜö j!@@A (´ö "A  Avt" q\r A    r6´ö  !  (" A (Äö I\r  6   6  6   6A!@  AÿÿÿK\r   A&  Avg"kvAq AtrA>s!  6 B 7 AtAäø j!@@@A (¸ö "A t"q\r A   r6¸ö   6   6  A A Avk AFt! ( !@ "(Axq  F\r Av! At!  Aqj"("\r  Aj"A (Äö I\r  6   6  6  6 A (Äö " I\r ("  I\r  6  6 A 6  6  6 AjÉ  Ä\n@@  E\r   Axj"A (Äö "I\r  A|j( "AqAF\r  Axq" j!@ Aq\r  AqE\r  ( "k" I\r   j! @ A (Èö F\r  (!@ AÿK\r @ (" AøqAÜö j"F\r   I\r ( G\r@  G\r A A (´ö A~ Avwq6´ö @  F\r   I\r ( G\r  6  6 (!@@  F\r  (" I\r ( G\r ( G\r  6  6@@@ ("E\r  Aj! ("E\r Aj!@ ! "Aj! ("\r  Aj! ("\r   I\r A 6 A ! E\r@@  ("At"(äø G\r  Aäø j 6  \rA A (¸ö A~ wq6¸ö   I\r@@ ( G\r   6  6 E\r  I\r  6@ ("E\r   I\r  6  6 ("E\r  I\r  6  6 ("AqAG\r A   6¼ö   A~q6   Ar6   6   O\r ("AqE\r@@ Aq\r @ A (Ìö G\r A  6Ìö A A (Àö   j" 6Àö    Ar6 A (Èö G\rA A 6¼ö A A 6Èö @ A (Èö "	G\r A  6Èö A A (¼ö   j" 6¼ö    Ar6   j  6  (!@@ AÿK\r @ (" AøqAÜö j"F\r   I\r ( G\r@  G\r A A (´ö A~ Avwq6´ö @  F\r   I\r ( G\r  6  6 (!\n@@  F\r  (" I\r ( G\r ( G\r  6  6@@@ ("E\r  Aj! ("E\r Aj!@ ! "Aj! ("\r  Aj! ("\r   I\r A 6 A ! \nE\r @@  ("At"(äø G\r  Aäø j 6  \rA A (¸ö A~ wq6¸ö  \n I\r@@ \n( G\r  \n 6 \n 6 E\r  I\r  \n6@ ("E\r   I\r  6  6 ("E\r   I\r  6  6  Axq  j" Ar6   j  6   	G\rA   6¼ö   A~q6   Ar6   j  6 @  AÿK\r   AøqAÜö j!@@A (´ö "A  Avt" q\r A    r6´ö  !  ("  I\r  6   6  6   6A!@  AÿÿÿK\r   A&  Avg"kvAq AtrA>s!  6 B 7 AtAäø j!@@@@A (¸ö "A t"q\r A   r6¸ö   6 A! A!  A A Avk AFt! ( !@ "(Axq  F\r Av! At!  Aqj"("\r  Aj"  I\r   6 A! A! ! ! !  I\r (" I\r  6  6A !A! A!  j 6   6   j 6 A A (Ôö Aj"A 6Ôö É  @  \r  Ð @ A@I\r ³ A06 A @  AxjA AjAxq AIÔ "E\r  Aj@ Ð "\r A    A|Ax  A|j( "Aq Axqj"   I   Ò  		@@  A (Äö "I\r   ("Aq"AF\r  Axq"E\r    j"("AqE\r @ \r A ! AI\r@  AjI\r   !  kA (ú AtM\rA !@  I\r @  k"AI\r     AqrAr6   j" Ar6  (Ar6  ×   A !@ A (Ìö G\r A (Àö  j" M\r    AqrAr6   j"  k"Ar6A  6Àö A  6Ìö   @ A (Èö G\r A !A (¼ö  j" I\r@@  k"AI\r     AqrAr6   j" Ar6   j" 6   (A~q6   Aq rAr6   j" (Ar6A !A !A  6Èö A  6¼ö   A ! Aq\r Axq j" I\r (!@@ AÿK\r @ (" AøqAÜö j"	F\r   I\r ( G\r@  G\r A A (´ö A~ Avwq6´ö @  	F\r   I\r ( G\r  6  6 (!\n@@  F\r  (" I\r ( G\r ( G\r  6  6@@@ ("E\r  Aj! ("E\r Aj!@ !	 "Aj! ("\r  Aj! ("\r  	 I\r 	A 6 A ! \nE\r @@  ("At"(äø G\r  Aäø j 6  \rA A (¸ö A~ wq6¸ö  \n I\r@@ \n( G\r  \n 6 \n 6 E\r  I\r  \n6@ ("E\r   I\r  6  6 ("E\r   I\r  6  6@  k"AK\r    Aq rAr6   j" (Ar6      AqrAr6   j" Ar6   j" (Ar6  ×   É   ±A!@@  A  AK" Ajq\r  ! @ " At!   I\r @ A@  kI\r ³ A06 A @A AjAxq AI"  jAjÐ "\r A  Axj!@@  Aj q\r  !  A|j"( "Axq   jAjA   kqAxj"A     kAKj"  k"k!@ Aq\r  ( !   6    j6      (AqrAr6   j" (Ar6   ( AqrAr6   j" (Ar6  × @  ("AqE\r  Axq" AjM\r     AqrAr6   j"  k"Ar6   j" (Ar6  ×   Ajx@@@ AG\r  Ð !A! Aq\r Av"E\r iAK\r@ A@ kM\r A0 A AK Õ !@ \r A0   6 A ! ø	   j!@@@@  ("AqE\r A (Äö ! AqE\r    ( "k" A (Äö "I\r  j!@  A (Èö F\r   (!@ AÿK\r @  (" AøqAÜö j"F\r   I\r (  G\r@  G\r A A (´ö A~ Avwq6´ö @  F\r   I\r (  G\r  6  6  (!@@   F\r   (" I\r (  G\r (  G\r  6  6@@@  ("E\r   Aj!  ("E\r  Aj!@ ! "Aj! ("\r  Aj! ("\r   I\r A 6 A ! E\r@@    ("At"(äø G\r  Aäø j 6  \rA A (¸ö A~ wq6¸ö   I\r@@ (  G\r   6  6 E\r  I\r  6@  ("E\r   I\r  6  6  ("E\r  I\r  6  6 ("AqAG\r A  6¼ö   A~q6   Ar6  6   I\r@@ ("Aq\r @ A (Ìö G\r A   6Ìö A A (Àö  j"6Àö    Ar6  A (Èö G\rA A 6¼ö A A 6Èö @ A (Èö "	G\r A   6Èö A A (¼ö  j"6¼ö    Ar6   j 6  (!@@ AÿK\r @ (" AøqAÜö j"F\r   I\r ( G\r@  G\r A A (´ö A~ Avwq6´ö @  F\r   I\r ( G\r  6  6 (!\n@@  F\r  (" I\r ( G\r ( G\r  6  6@@@ ("E\r  Aj! ("E\r Aj!@ ! "Aj! ("\r  Aj! ("\r   I\r A 6 A ! \nE\r @@  ("At"(äø G\r  Aäø j 6  \rA A (¸ö A~ wq6¸ö  \n I\r@@ \n( G\r  \n 6 \n 6 E\r  I\r  \n6@ ("E\r   I\r  6  6 ("E\r   I\r  6  6   Axq j"Ar6   j 6    	G\rA  6¼ö   A~q6   Ar6   j 6 @ AÿK\r  AøqAÜö j!@@A (´ö "A Avt"q\r A   r6´ö  ! (" I\r   6   6   6   6A!@ AÿÿÿK\r  A& Avg"kvAq AtrA>s!   6  B 7 AtAäø j!@@@A (¸ö "A t"q\r A   r6¸ö    6    6 A A Avk AFt! ( !@ "(Axq F\r Av! At!  Aqj"("\r  Aj" I\r   6    6    6    6  I\r (" I\r   6   6  A 6   6   6É   ? Atd~@@  ­B|BøÿÿÿA (Äñ " ­|"BÿÿÿÿV\r Ø  §"O\r  \r³ A06 AA  6Äñ     A $ A AjApq$  # # k #  # S~@@ AÀ qE\r   A@j­!B ! E\r  AÀ  k­  ­"!  !   7    7S~@@ AÀ qE\r   A@j­!B ! E\r  AÀ  k­  ­"!  !   7    7©~# A k"$  Bÿÿÿÿÿÿ?!@@ B0Bÿÿ"§"AÿjAýK\r   B< B! Aj­!@@  Bÿÿÿÿÿÿÿÿ" BT\r  B|!  BR\r  B |!B   BÿÿÿÿÿÿÿV"!  ­ |!@   P\r  BÿÿR\r   B< BB! Bÿ!@ AþM\r Bÿ!B ! @Aø Aø  P"" k"Að L\r B ! B !  BÀ  !A !@  F\r  Aj   A kÞ  ) )B R!     ß  ) "B< )B! @@ Bÿÿÿÿÿÿÿÿ ­"BT\r   B|!  BR\r   B  |!   B    BÿÿÿÿÿÿÿV"!  ­! A j$  B4 B  ¿ ¶ û@@@@ Aÿq"E\r @  AqE\r  Aÿq!@  -  "E\r  F\r  Aj" Aq\r A  ( "k rAxqAxG\r Al!@A  s"k rAxqAxG\r  (!  Aj"!  A krAxqAxF\r      j  !@ " -  "E\r  Aj!  AÿqG\r   ö# A k"$   6A !    (0"A Gk6  (,!  6  6A !@@@  (< AjA Aj Ê \r  ("A J\rA A !    (  r6  !  ("M\r     (,"6     kj6@  (0E\r    Aj6  jAj -  :   ! A j$  û@  \r A !@A (èó E\r A (èó ä !@A (Àñ E\r A (Àñ ä  r!@® ( " E\r @@@  (LA N\r A!  ¥ E!@  (  (F\r   ä  r!@ \r   ¦   (8" \r ¯  @@  (LA N\r A!  ¥ E!@@@  (  (F\r   A A   ($    (\r A! E\r@  ("  ("F\r     k¬A  ((  A !  A 6  B 7  B 7 \r  ¦      (H"Aj r6H@  (  (F\r   A A   ($    A 6  B 7@  ( "AqE\r    A r6 A    (,  (0j"6   6 AtAu\n   ×    æ   AÔ í    A 6   Aj«      è   A í 0   A 6   Aj   B 7  B 7  B 7      \r   Bî     7  B 7   \r   Bî  A  A ÷# Ak"$ A !@@  L\r@@  ó   ô O\r  Aÿÿÿÿ6   ô   ó k6   k6 Aj Aj Ajõ õ ( !   ó  ö    ÷     ( ((  "ø F\r  ù :  A!  j!  j!  Aj$     (   (    ú      û        ( j6 A   À8# Ak"$  Aj    ! Aj$      @ E\r  E\r     ü\n     ø K@    ( ($  ø G\r ø   ó ,  þ !  A÷     Aÿq ø ä# Ak"$ A !@@  L\r@      I\r    ,  þ   ( (4  ø F\r Aj! Aj!       k6   k6 Aj Ajõ ( !     ö       j!  j!  Aj$     (   (     ( j6 ø       Aì  " Ajæ        ( Atj( j     AÜ í      ( Atj( j \n       (H# Ak"$ @    ( Atj( j E\r  Aj  ¨ @ Aj E\r     ( Atj( j  AG\r     ( Atj( jA  Aj©  Aj$      (   A¸ °         (  À.A !@  E\r   ( Atj(  qA G!    (            (E\n       -       ( (     È  È sAs   AI? @  ó   ô G\r     ( ($    ó ,  þ O@  ó   ô G\r     ( ((    ó ,  þ !  A÷       ( rÕ     FU @      G\r    þ   ( (4      :    A   þ    (     ( j6 ¢  Aÿÿÿÿ      A £ " Ajæ        ( Atj( j¤    ¤ AØ í      ( Atj( j¦ h    6  A :  @  ( Atj( j E\r @  ( Atj( j E\r   ( Atj( j    A:    ©@  (" ( Atj( j E\r   (" ( Atj( j E\r   (" ( Atj( j AÀ qE\r á \r   (" ( Atj( j  AG\r   (" ( Atj( jA      Aø °      ( Atj( j 6   3@  AÌ j"É \r    A Ê Ë  Ì À   ( E         ( (      ° # Ak"$  Aj  ¨ @ Aj E\r     ( Atj( j ! Aj    ( Atj( jÓ  Ajª ! Aj«    « !    ( Atj( j"¬ !@@ AÊ q"AÀ F\r  AG\r ± !   (    ® 6 Aj­ E\r     ( Atj( jA  Aj©  Aj$          ³ ß# Ak"$  Aj  ¨ @ Aj E\r  Aj    ( Atj( jÓ  Ajª ! Aj«    « !    ( Atj( j"¬ !   (    ´ 6 Aj­ E\r     ( Atj( jA  Aj©  Aj$            ( (      3@  ( "E\r    ø  E\r   A 6             ( (0  \n   ×    ¹   AÔ í    A¬ 6   Aj«      »   A í 0   A¬ 6   Aj   B 7  B 7  B 7      \r   Bî \r   Bî  A  A # Ak"$ A !@@  L\r@@  Å   Æ O\r  Aÿÿÿÿ6   Æ   Å kAu6   k6 Aj Aj Ajõ õ ( !   Å  Ç    È   Atj!    ( ((  "É F\r  Ê 6  Aj!A!  j!  Aj$     (   (     Ë      ( Atj6 A     @ E\r  At"E\r     ü\n     É K@    ( ($  É G\r É   Å ( Î !  AÈ      É ê# Ak"$ A !@@  L\r@  Ñ   Ò I\r    ( Î   ( (4  É F\r Aj! Aj!   Ò   Ñ kAu6   k6 Aj Ajõ ( !  Ñ   Ç    Ó   j!  Atj!  Aj$     (   (     ( Atj6 É       A Õ " Aj¹        ( Atj( jÖ    Ö AÜ í      ( Atj( jØ \n       (H# Ak"$ @    ( Atj( jã E\r  Aj  ñ @ Ajä E\r     ( Atj( jã å AG\r     ( Atj( jAâ  Ajò  Aj$      A° °     æ \r   ( ç        ( (     ( è        \n       -       ( (     Î  Î sAs? @  Å   Æ G\r     ( ($    Å ( Î O@  Å   Æ G\r     ( ((    Å ( Î !  AÈ      FU @  Ñ   Ò G\r    Î   ( (4    Ñ  6   Aë  Î      ( Atj6      A¼ ì " Aj¹        ( Atj( jí    í AØ í      ( Atj( jï h    6  A :  @  ( Atj( jÚ E\r @  ( Atj( jÛ E\r   ( Atj( jÛ Ü   A:    ©@  (" ( Atj( jã E\r   (" ( Atj( jÚ E\r   (" ( Atj( j AÀ qE\r á \r   (" ( Atj( jã å AG\r   (" ( Atj( jAâ      3@  ( "E\r   ê É é E\r   A 6             ( (0  $   A 6  B 7   ø " A ù   \n    ,         jAj    jAj    ý þ     ÿ       Aj ! @   E\r   ¢   £    ö# Ak"$    @   E\r     ¢    ¥   !  !   ¦    (6   ) 7  A §  £ ! A :   Aj¨ @@   F"\r  \r   ©  A ù    !@ \r  \r      ù  Aj$   ( !   ( 6   6 \n   - Av2         jAj      jAj    - Aÿ q               ® ¯      ! @   E\r           6   \r    Å    Æ   %A\n!@   E\r    Aj!     A  # @  ø  E\r ø As!      (Aÿÿÿÿq   (\n       AÀ °      ( (       %            ( (   A« A ²  8# Ak"$  Aj   Ç ! Aj$     %            ( (       ( (           ( (  \r  (  ( H    ! @   E\r              ( \n   ¡       ( \n   ¤         ª     « \r    Aÿ q:     -  :  ,       jAj      jAj    A¬  \' @ ­ E\r     ô    í    AK    ° Ü# Ak"$ @   ± K\r @@ ² E\r    §   £ ! Aj   ³ Aj´  (" (µ    ¶    (·    ¸    þ ¹ ! A :   Aj¨    ù  Aj$ º      k   » "   ¼ AvKvAwj   AI0A\n!@  AI\r   Aj¿ "   Aj"   AF!      ¾  	    6     Axr6	    6    þ    k" ö    j Aµ ½   ¼  À +# Ak"$    6 Aò  ²       Á \n   AjAxq A   Â !   6   6 # @   » M\r Ã   AÄ  A× A ²  # @ ­ E\r    ï   é     6      ( !      ù \r  (  ( I:@  ( "E\r @  ø  \r   ( E  A 6 A   - P# Ak"$  Aj  Ó  Aj  Í !  Aj«  Aj$       6    A:      (        ( (  :@  ( "E\r @ ç É é \r   ( E  A 6 A      ( (,     ø "   Ñ ÿ   \n   Û G  ((!@@ \r      ($ Aj"At"j(   (  j(        Aj     Ö -      (Er"6@  ( qE\r AÈ Ù  8# Ak"$  Aj   Ç ! Aj$     \\   Aô 6 @  (E\r   A Ò   Aj«   ( Ò   ($Ò   (0Ò   (<Ò      × AÈ í +# Ak"$    6 A÷  ²  C   A 6   6  A 6  B à 7   E6  A jA A(ü   Aj \n     A  B  A ­A!@  AF\r @@ (LA N\r A! ¥ E!@@@ ("\r  å  ("E\r  (,AxjK\r \r ¦ A  Aj"6   :    ( Aoq6 @ \r  ¦   Aÿq! X# Ak"$ A!@  å \r    AjA  (   AG\r  - ! Aj$  \n   â c@@  (L"A H\r  E\r Aÿÿÿÿq (G\r@  ("  (F\r    Aj6 -    à   ã r@  AÌ j"ä E\r   ¥ @@  ("  (F\r    Aj6 -  !   à ! @ å AqE\r  æ       ( "Aÿÿÿÿ 6    ( !  A 6  \r   A§ @@  (LA N\r A!  ¥ E!@@ \r   (H!@  (\r   Að AØ  (`( 6  (H"\r   AA AH"6H@ \r   ¦  ×@ \r A @@ E\r @ -  "À"A H\r @  E\r    6  A G@ (`( \r A!  E\r   Aÿ¿q6 A A¾~j"A2K\r  At( !@ AK\r   AlAzjtA H\r - "Av"Apj  AujrAK\r @ Aj Atr"A H\r A!  E\r   6 A - Aj"A?K\r   At"r!@ A H\r A!  E\r   6 A - Aj"A?K\r A!  E\r    Atr6 A³ A6 A! Ø AÈ  "( !@@@@ \r  \rA A~! E\r@@ E\r  !@ -  "À"A H\r @  E\r    6  A G@ (`( \r A!  E\r   Aÿ¿q6 A A¾~j"A2K\r At( ! Aj"E\r Aj! -  "Av"Apj Au jrAK\r @ Aj!@ AÿqAj Atr"A H\r  A 6 @  E\r    6   k E\r Aj",  "A@H\r  A 6 ³ A6 A!   6 A~G "(`!@  (HA J\r   Aç    (6`  ë !   6`  ¾# A k"$ @@@  ("  ("F\r  Aj   kè "AF\r     ( A AKj6 B 7A !@ !@@  ("  (F\r    Aj6  -  :    à ":  AJ\r A! AqE\r    ( A r6 ³ A6 A! Aj AjA Ajé "A~F\r A! AG\r  AqE\r    ( A r6  -   ß  (! A j$  @@  (LAJ\r   ê   ¥ !  ê !@ E\r   ¦  \n   ì µ# Ak"$  "(`!@@ (LA N\r A! ¥ E!@ (HA J\r  Aç   (6`A !@ (\r  å  (E!A!@  AF\r  \r  Aj  A Ç "A H\r  (" (, jAxjI\r @@  Aÿ K\r   Aj"6   :     k"6  Aj    ( Aoq6   !@ \r  ¦   6` Aj$  ³# Ak"$   : @@  ("\r @  ° E\r A!  (!@  (" F\r   (P Aÿq"F\r    Aj6  :  @   AjA  ($  AF\r A! - ! Aj$  # Ak"$  "(`!@ (HA J\r  Aç   (6`@@@@  Aÿ K\r @   (PF\r  (" (F\r   Aj6   :     ï ! @ ("Aj (O\r    È "A H\r  ( j6 Aj  È "A H\r Aj  µ  I\r  AG\r  ( A r6 A!   6` Aj$   D@ (LAJ\r    ð  ¥ !   ð ! @ E\r  ¦    Aä ó ? @A - æ \r Aå ô Añ A A Þ A A: æ   ×AÌ A ( "õ Aè A ( "ö Aø A ( "ö A  ö A (Ì Atj( AÌ jAè ÷ A (ø Atj( Aø jø A (ø Atj( Aø jAè ÷ A  ù A´  ú AÄ  ú AÔ  ú A ( Atj( A jA´ û A (Ä Atj( AÄ jø A (Ä Atj( AÄ jA´ û   h# Ak"$   6  B 7   Aj6  AÜ j" Aj Ajü   6   Ajý  Aj$ h# Ak"$   6  B 7   Aj6  AØ j" Aj Ajþ   6   Ajÿ  Aj$   (H!   6H    AÀ    h# Ak"$   6  B 7   Aj6  AÜ j" Aj Aj   6   Aj  Aj$ h# Ak"$   6  B 7   Aj6  AØ j" Aj Aj   6   Aj  Aj$   (H!   6H     (  (      (      (  (      (      (" r6     (  (       ( ¡     (  ( ³     ( ´ 8 Aè  A  A´ Ü AÔ Ü    Aå  # Ak"$   ê "  6(   6   Aä 6 ø !  A : 4   60 Aj  ü    Aj  ( (   Aj«  Aj$   J  Aj !  AÄ Aj6  AÄ A j6   A 6  A (Ä j       è A8í H     "6$    6,    ($ : 5@  (,A	H\r AÑ ü     A  ~# A k"$ @@  - 4AG\r   (0! E\rø !  A : 4   60@@  - 5AG\r   (  Aj E\r , þ !@@ \r    (  ,  E\r   60 , þ ! A6A ! Aj  A,j ( "A  A J!@@  F\r  ( á "AF\r Aj j :   Aj!  AjAj!@@@  ((") !@  ($  Aj Aj j" Aj Aj  Aj Aj   (( 7  AF\r  ( á "AF\r  :   Aj!   - : @@ \r @ AH\r Aj Aj"j,  þ   ( ß AF\r    , þ 60 , þ !ø ! A j$     A ß# A k"$ @@ ø  E\r   - 4\r    (0"ø  As: 4  - 4!@@@  - 5AG\r  AqE\r   (0!   (  ù  \r AqE\r    (0ù : @@  ($  (( Aj AjAj Aj Aj A j Aj Aj   (0!  AjAj6  : @ (" AjM\r  Aj"6 ,    ( ß AF\r   A: 4   60ø ! A j$      ß AG  @  á " AF\r    :    AG     8# Ak"$  Aj    ! Aj$     \r  (  ( H    " AÄ Aj6       Ú   A 6H  AÌ j    A 6  Aì Aj6      A :   ø 6  }# Ak"$   ê "  6   AÈ 6  Aj  ü  Aj ! Aj«    6(   6$    : , Aj$   C  Aj !  Aô Aj6  Aô A j6   A (ô j       è A0í 4     ( (      "6$    : ,# Ak"$  Aj!@@  ($  (( Aj  Aj !A! AjA ( Ajk"  ( ¶  G\r@ Aj AA   ( ä ! Aj$  @@  - ,\r A ! A  A J!@  F\r@   ,  þ   ( (4  ø G\r   Aj! Aj!  A   ( ¶ ! ®# A k"$ @@@ ø  \r   ù ": @  - ,AG\r    (  E\r  Aj6 A j! AjAj! Aj!@  ($  ((   Aj Aj  Aj ! ( F\r@ AG\r  AA  ( ¶ AF\r AK\r AjA ( Ajk"  ( ¶  G\r (! AF\r   ! ø !  A j$   ?# Ak"$    :  AjAA ¶ !  Aj$   AF# Ak"$   ½ "  6(   6   A° 6 É !  A : 4   60 Aj  ¢    Aj  ( (   Aj«  Aj$   J  Aj° !  Aä Aj6  Aä A j6   A 6  A (ä j ±       Aj    » A8í H    ¥ "6$   ¦ 6,    ($§ : 5@  (,A	H\r AÑ ü     AÈ °      ( (       ( (     A © ~# A k"$ @@  - 4AG\r   (0! E\rÉ !  A : 4   60@@  - 5AG\r   (  Aj® E\r (Î !@@ \r    (  (¬ E\r   60 (Î ! A6A ! Aj  A,j ( "A  A J!@@  F\r  ( á "AF\r Aj j :   Aj!  Aj!@@@  ((") !@  ($  Aj Aj j" Aj Aj  Aj¯ Aj   (( 7  AF\r  ( á "AF\r  :   Aj!   , 6@@ \r @ AH\r Aj Aj"j,  Î   ( ß AF\r    (Î 60 (Î !É ! A j$     A© Ù# A k"$ @@ É é E\r   - 4\r    (0"É é As: 4  - 4!@@@  - 5AG\r  AqE\r   (0!   (  Ê ¬ \r AqE\r    (0Ê 6@@  ($  (( Aj Aj Aj Aj A j Aj­ Aj   (0!  Aj6  : @ (" AjM\r  Aj"6 ,    ( ß AF\r   A: 4   60É ! A j$      î AG%            ( (    @  í " AF\r    6   AG%            ( (      " AØ Aj6       Ú   A 6H  AÌ j²    A :   É 6  }# Ak"$   ½ "  6   A 6  Aj  ¢  Aj¥ ! Aj«    6(   6$   § : , Aj$   C  Aj° !  A Aj6  A A j6   A ( j ±      » A0í 4     ( (     ¥ "6$   § : ,# Ak"$  Aj!@@  ($  (( Aj  Aj¸ !A! AjA ( Ajk"  ( ¶  G\r@ Aj AA   ( ä ! Aj$           ( (  @@  - ,\r A ! A  A J!@  F\r@   ( Î   ( (4  É G\r   Aj! Aj!  A   ( ¶ ! «# A k"$ @@@ É é \r   Ê "6@  - ,AG\r    ( » E\r  Aj6 A j! Aj! Aj!@  ($  ((   Aj Aj  Aj­ ! ( F\r@ AG\r  AA  ( ¶ AF\r AK\r AjA ( Ajk"  ( ¶  G\r (! AF\r  ¼ ! É !  A j$       ñ AG# @  É é E\r É As!    ò    Aß q    AjAI   A r    A¿jAI   APjA\nI  A rAjAIr\n   À \n   APjA\nI\n   Â G   7p    (,  ("k¬7x  (!@ P\r    k¬Y\r   §j!   6hâ~  )x  ("  (,"k¬|!@@@  )p"P\r   Y\r  à "AJ\r  (!  (,!  B7p   6h     k¬|7xA B|!  (!  (!@  )p"B Q\r   }"  k¬Y\r   §j!   6h     (," k¬|7x@  K\r  Aj :   ê~# Ak"$  ¼"Aÿÿÿq!@@ Av"Aÿq"E\r @ AÿF\r  ­B! AÿqAÿ j!B ! ­B!B !Aÿÿ!@ \r B !A !B !  ­B  g"AÑ jÞ Aÿ  k! )BÀ ! ) !   7    ­B0 Av­B? 7 Aj$ ¡~# Ak"$ @@ \r B !B !   Au"s k"­B  g"AÑ jÞ  )BÀ A k­B0|BB  A H! ) !   7    7 Aj$ µ~~~# Aà k"$  Bÿÿÿÿÿÿ?!  B! Bÿÿÿÿÿÿ?"B !	 B0§Aÿÿq!\n@@@ B0§Aÿÿq"A~jA~I\r A ! \nA~jA~K\r@ P Bÿÿÿÿÿÿÿÿÿ "\rBÀÿÿ T \rBÀÿÿ Q\r  B !@ P Bÿÿÿÿÿÿÿÿÿ "BÀÿÿ T BÀÿÿ Q\r  B ! !@  \rBÀÿÿ B R\r @  PE\r Bàÿÿ !B ! BÀÿÿ !B !@  BÀÿÿ B R\r   \r!B !@ PE\r Bàÿÿ ! BÀÿÿ !@  \rB R\r B !@  B R\r B !A !@ \rBÿÿÿÿÿÿ?V\r  AÐ j     P"yBÀ B  |§"AqjÞ A k! )X"B !	 )P! Bÿÿÿÿÿÿ?V\r  AÀ j     P"yBÀ B  |§"AqjÞ   kAj! )H! )@!  \nj jAj!\n@@ B"B B" B "~" B"B " 	B"	~|"\r T­ \r B1 Bÿÿÿÿ" Bÿÿÿÿ"~|" \rT­|  	~|  Bþÿ"\r ~"  ~|" T­   Bÿÿÿÿ"~|" T­||" T­|  	~"  ~|" T­B  B |  B |" T­|  \r 	~"  ~|"	  ~|"  ~|"B  	 T­  	T­|  T­|B |" T­|   \r ~"	  ~|"B   	T­B |" T­  B |" T­||" T­|   B " \r ~|" T­|" T­|" T­|"BÀ P\r  \nAj!\n B?! B B?! B B?! B!  B!@ \nAÿÿH\r  BÀÿÿ !B !@@ \nA J\r @A \nk"Aÿ K\r  A0j   \nAÿ j"\nÞ  A j   \nÞ  Aj   ß     ß  )  ) )0 )8B R­! )( )! )! ) !B ! \n­B0 Bÿÿÿÿÿÿ?!  !@ P BU BQ\r   B|"P­|!@  BB Q\r  !   B|" T­|!   7    7 Aà j$  A  A ~~~# Að k"$  Bÿÿÿÿÿÿÿÿÿ !@@@ P" Bÿÿÿÿÿÿÿÿÿ "BÀ|BÀT P\r  B R BÀ|"	BÀV 	BÀQ\r@  BÀÿÿ T BÀÿÿ Q\r  B ! !@ P BÀÿÿ T BÀÿÿ Q\r  B !@  BÀÿÿ B R\r Bàÿÿ      BP"!B   !  BÀÿÿ P\r@  B R\r   B R\r  !  !  PE\r  ! !    V  V  Q"\n!   \n"	Bÿÿÿÿÿÿ?!   \n"B0§Aÿÿq!@ 	B0§Aÿÿq"\r  Aà j     P"yBÀ B  |§"AqjÞ A k! )h! )`!   \n! Bÿÿÿÿÿÿ?!@ \r  AÐ j     P"\nyBÀ B  \n|§"\nAqjÞ A \nk! )X! )P! B B=B! B B=! B!  !@  F\r @  k"\nAÿ M\r B !B! AÀ j  A \nkÞ  A0j   \nß  )0 )@ )HB R­! )8! B! B!@@ BU\r B !B !    P\r  }!  }  T­}"BÿÿÿÿÿÿÿV\r A j     P"\nyBÀ B  \n§Atj"\nÞ   \nk! )(! ) !  |  |" T­|"BP\r  B B? B! Aj! B! 	B!@ AÿÿH\r  BÀÿÿ !B !A !\n@@ A L\r  !\n Aj   Aÿ jÞ    A kß  )  ) )B R­! )! B B=! \n­B0 BBÿÿÿÿÿÿ? ! §Aq!@@@@@É  @ AF\r    AK­|" T­|! !   B|" T­|! !   B R A Gq­|" T­|! !   P A Gq­|" T­|! ! E\rÊ    7    7 Að j$ ô~# Ak"$  ½"Bÿÿÿÿÿÿÿ!@@ B4Bÿ"P\r @ BÿQ\r  B! B<! Bø |! B! B<!Bÿÿ!@ PE\r B !B !B !  B  y§"A1jÞ  )BÀ !Aø  k­! ) !   7    B0 B 7 Aj$ æ~A!@  B R Bÿÿÿÿÿÿÿÿÿ "BÀÿÿ V BÀÿÿ Q\r  B R Bÿÿÿÿÿÿÿÿÿ "BÀÿÿ V BÀÿÿ Q\r @     PE\r A @  B S\r @   T  S  QE\r A     B R@   V  U  QE\r A     B R! Ø~A!@  B R Bÿÿÿÿÿÿÿÿÿ "BÀÿÿ V BÀÿÿ Q\r  B R Bÿÿÿÿÿÿÿÿÿ "BÀÿÿ V BÀÿÿ Q\r @     PE\r A @  B S\r    T  S  Q\r     B R   V  U  Q\r      B R! <    7    B0§Aq BÀÿÿ B0§r­B0 Bÿÿÿÿÿÿ?7~# Ak"$ @@ \r B !B !  ­B Að  g"AskÞ  )BÀ A k­B0|! ) !   7    7 Aj$ T# Ak"$      BË  ) !   )7   7  Aj$ æ# AÐ k"$ @@ AH\r  A j  B Bÿÿ È  )(! ) !@ AÿÿO\r  Aj! Aj  B Bÿÿ È  Aýÿ AýÿIA~j! )! )! AJ\r  AÀ j  B B9È  )H! )@!@ Aô~M\r  Aÿ j! A0j  B B9È  Aè} Aè}KAþj! )8! )0!   B  Aÿÿ j­B0È    )7   ) 7  AÐ j$ u~    ~  ~| B " B "~| Bÿÿÿÿ" Bÿÿÿÿ"~"B   ~|"B | Bÿÿÿÿ  ~|"B |7   B  Bÿÿÿÿ7 ~~~# AÐk"$  Bÿÿÿÿÿÿ?! Bÿÿÿÿÿÿ?!  B! B0§Aÿÿq!	@@@ B0§Aÿÿq"\nA~jA~I\r A ! 	A~jA~K\r@ P Bÿÿÿÿÿÿÿÿÿ "BÀÿÿ T BÀÿÿ Q\r  B !@ P Bÿÿÿÿÿÿÿÿÿ "BÀÿÿ T BÀÿÿ Q\r  B ! !@  BÀÿÿ B R\r @  BÀÿÿ PE\r B !Bàÿÿ ! BÀÿÿ !B !@  BÀÿÿ B R\r B !@  B R\r Bàÿÿ    P!B !@  B R\r  BÀÿÿ !B !A !@ Bÿÿÿÿÿÿ?V\r  AÀj     P"yBÀ B  |§"AqjÞ A k! )È! )À! Bÿÿÿÿÿÿ?V\r  A°j     P"\ryBÀ B  \r|§"\rAqjÞ  \r jApj! )¸! )°! A j B1 BÀ "B"B B°æ¼õ  }"B Ó  AjB  )¨}B  B Ó  Aj )B? )B"B  B Ó  Aðj B B  )}B Ó  Aàj )ðB? )øB"B  B Ó  AÐj B B  )è}B Ó  AÀj )ÐB? )ØB"B  B Ó  A°j B B  )È}B Ó  A j B  )°B? )¸BB|"B Ó  Aj BB  B Ó  Að j B B  )¨ ) " )|" T­| BV­|}B Ó  AjB }B  B Ó   \n 	kj"\nAÿÿ j!	@@ )p"B" )B? )"B|"B|"B " BÀ "B"B "~" B"B " )xB B? B?|  T­|  T­|B|"B "~|" T­  Bÿÿÿÿ" B?" BBÿÿÿÿ"~|" T­|  ~|  ~"  ~|" T­B  B |  B |" T­|  Bÿÿÿÿ" ~"  ~|" T­   Bþÿÿÿ"~|" T­||" T­|   ~"  ~|"  ~|"  ~|"B   T­  T­|  T­|B |" T­|    ~"  ~|"B   T­B |" T­  B |" T­||" T­| A   B "  ~| T­B"V  Q­|" T­|"Bÿÿÿÿÿÿÿ V\r   ! AÐ j  BÀ T"­""   B A?s­"  Ó  \nAþÿ j 	 Aj!	 B1 )X} )P"B R­}!B  }! Aà j B B?" B"  Ó  B0 )h} )`"B R­}!B  }! !@ 	AÿÿH\r  BÀÿÿ !B !@@ 	AH\r  B B?! 	­B0 Bÿÿÿÿÿÿ?! B!@ 	AJ\r B ! AÀ j  A 	kß  A0j   	Að jÞ  A j   )@" )H"Ó  )8 )(B ) "B?} )0" B"T­}!  }! Aj  BB Ó    BB Ó    B" |" V   T­|" V  Q­|" T­|"  BÀÿÿ T  )V  )"V  Qq­|" T­|"  BÀÿÿ T  ) V  )"V  Qq­|" T­| !   7    7 AÐj$ K~ Bÿÿÿÿÿÿ?!@@ B0§Aÿÿq"AÿÿF\r A! \rAA   P   P! ç~~# Ak"$ @@@  B B Í E\r   Õ E\r  B0§"Aÿÿq"AÿÿG\r Aj    È   )" )"  Ô  )! ) !@  Bÿÿÿÿÿÿÿÿÿ "  Bÿÿÿÿÿÿÿÿÿ "	Í A J\r @    	Í E\r  ! Að j  B B È  )x! )p! B0§Aÿÿq!\n@@ E\r  ! Aà j  B BÀ»À È  )h"B0§Aj! )`!@ \n\r  AÐ j  	B BÀ»À È  )X"	B0§Aj!\n )P! 	Bÿÿÿÿÿÿ?BÀ ! Bÿÿÿÿÿÿ?BÀ !@  \nL\r @@@  }  T­}"	B S\r @ 	  }"B R\r  A j  B B È  )(! ) ! 	B B?! B B?! B! Aj" \nJ\r  \n!@@  }  T­}"	B Y\r  !	 	  }"B R\r  A0j  B B È  )8! )0!@ 	Bÿÿÿÿÿÿ?V\r @ B?! Aj! B!  	B"	BÀ T\r  Aq!\n@ A J\r  AÀ j  	Bÿÿÿÿÿÿ? Aø j \nr­B0B BÀÃ?È  )H! )@! 	Bÿÿÿÿÿÿ?  \nr­B0!   7    7 Aj$     Bÿÿÿÿÿÿÿÿÿ 7   7 Ù	~~# A0k"$ B !@@ AK\r  At"(¼ ! (° !@@@ (" (hF\r   Aj6 -  ! Å ! Ù \r A!@@ AUj  AA A-F!@ (" (hF\r   Aj6 -  ! Å !A !	@@@@ A_qAÉ F\r A !\n@ 	AF\r@@ (" (hF\r   Aj6 -  ! Å ! 	, ² ! 	Aj"\n!	  A rF\r @ \nAF\r  \nAF\r E\r \nAI\r \nAF\r@ )p"B S\r   (Aj6 E\r  \nAI\r  B S!@@ \r   (Aj6 \nAj"\nAK\r   ²C  Æ  )! ) !@@@@@@ \n\r A !	@ A_qAÎ F\r A !\n@ 	AF\r@@ (" (hF\r   Aj6 -  ! Å ! 	, ÷ ! 	Aj"\n!	  A rF\r  \n @@ (" (hF\r   Aj6 -  ! Å !@@ A(G\r A!	B !Bàÿÿ ! )pB S\r  (Aj6@@@ (" (hF\r   Aj6 -  ! Å ! A¿j!\n@@ APjA\nI\r  \nAI\r  Aj!\n Aß F\r  \nAO\r 	Aj!	Bàÿÿ ! A)F\r@ )p"B S\r   (Aj6@@ E\r  	\r³ A6 B !@@ B S\r   (Aj6 	Aj"	E\r B !@ )pB S\r   (Aj6³ A6   Ä @ A0G\r @@ ("	 (hF\r   	Aj6 	-  !	 Å !	@ 	A_qAØ G\r  Aj     Ú  )! )! )pB S\r   (Aj6 A j      Û  )(! ) !B !B !   7    7 A0j$    A F  AwjAIrÍ\n~~~~~# A°k"$ @@ (" (hF\r   Aj6 -  ! Å !A !B !	A !\n@@@@@ A0F\r  A.G\r (" (hF\r  Aj6 -  !@ (" (hF\r A!\n  Aj6 -  !A!\n Å !  Å !B !	@ A0F\r A!@@@ (" (hF\r   Aj6 -  ! Å ! 	B|!	 A0F\r A!A!\nBÀÿ?!A !B !\rB !B !A !B !@@ !@@ APj"A\nI\r  A r!@ A.F\r  AjAK\r A.G\r  \rA! !	 A©j  A9J!@@ BU\r   Atj!@ BV\r  A0j Ç  A j  B BÀý?È  Aj )0 )8 ) " )("È   ) ) \r Ë  )! ) !\r E\r  \r  AÐ j  B Bÿ?È  AÀ j )P )X \r Ë A! )H! )@!\r B|!A!\n@ (" (hF\r   Aj6 -  ! Å ! @@ \n\r @@@ )pB S\r   ("Aj6 E\r  A~j6 E\r  A}j6 \r B Ä  Aà jD         ·¦Ì  )h! )`!\r@ BU\r  !@ At! B|"BR\r @@@@ A_qAÐ G\r   Ü "BR\r@ E\r  )pBU\rB !\r B Ä B !B ! )pB S\r  (Aj6B !@ \r  Að jD         ·¦Ì  )x! )p!\r@ 	  B |B`|"A  k­W\r ³ AÄ 6  A j Ç  Aj )  )¨BBÿÿÿÿÿÿ¿ÿÿ È  Aj ) )BBÿÿÿÿÿÿ¿ÿÿ È  )! )!\r@  A~j¬S\r @ AL\r @ A j \r B BÀÿ¿Ë  \r B Bÿ?Î ! Aj \r  )  \r AJ" )¨  Ë  At" r! B|! )! )!\r AJ\r @@ A  k­|"	§"A  A J  	 ­S"Añ I\r  Aj Ç B !	 )! )!B ! AàjD      ð?A k  Ì  AÐj Ç  Aðj )à )è )Ð" )Ø"Ï  )ø! )ð!	 AÀj  AqE A I \r B B Í A Gqq"rÐ  A°j   )À )ÈÈ  Aj )° )¸ 	 Ë  A j  B  \r B   È  Aj )  )¨ ) )Ë  Aðj ) ) 	 Ñ @ )ð"\r )ø"B B Í \r ³ AÄ 6  Aàj \r  §Ò  )è! )à!\r³ AÄ 6  AÐj Ç  AÀj )Ð )ØB BÀ È  A°j )À )ÈB BÀ È  )¸! )°!\r   \r7    7 A°j$ ­	~~~~|# AÆ k"$ A !A  k"	 k!\nB !A !@@@@@ A0F\r  A.G\r (" (hF\r  Aj6 -  !@ (" (hF\r A!  Aj6 -  !A! Å !  Å !B !@ A0G\r @@@ (" (hF\r   Aj6 -  ! Å ! B|! A0F\r A!A!A !\r A 6 APj!@@@@@@@ A.F"\r B ! A	M\r A !A !B !A !A !\rA !@@@ AqE\r @ \r  !A! E! B|!@ \rAüJ\r  §! Aj \rAtj!@ E\r   ( A\nljAPj!   A0F!  6 A!A  Aj" A	F"! \r j!\r A0F\r   (FAr6FAÜ!@@ (" (hF\r   Aj6 -  ! Å ! APj! A.F"\r  A\nI\r    !@ E\r  A_qAÅ G\r @  Ü "BR\r  E\rB ! )pB S\r   (Aj6  |! E! A H\r )pB S\r   (Aj6 E\r³ A6 B ! B Ä B !@ ("\r  D         ·¦Ì  )! ) !@ B	U\r   R\r @ AK\r   v\r A0j Ç  A j Ð  Aj )0 )8 )  )(È  )! )!@  	Av­W\r ³ AÄ 6  Aà j Ç  AÐ j )` )hBBÿÿÿÿÿÿ¿ÿÿ È  AÀ j )P )XBBÿÿÿÿÿÿ¿ÿÿ È  )H! )@!@  A~j¬Y\r ³ AÄ 6  Aj Ç  Aj ) )B BÀ È  Að j ) )B BÀ È  )x! )p!@ E\r @ AJ\r  Aj \rAtj"( !@ A\nl! Aj"A	G\r   6  \rAj!\r §!@ A	N\r  BU\r   J\r @ B	R\r  AÀj Ç  A°j (Ð  A j )À )È )° )¸È  )¨! ) !@ BU\r  Aj Ç  Aj (Ð  Aðj ) ) ) )È  AàjA kAt( Ç  AÐj )ð )ø )à )èÔ  )Ø! )Ð! (!@  A}ljAj"AJ\r   v\r Aàj Ç  AÐj Ð  AÀj )à )è )Ð )ØÈ  A°j AtAè j( Ç  A j )À )È )° )¸È  )¨! ) !@ \r"Aj!\r Aj Atj"A|j( E\r A !@@ A	o"\r A ! A	j  B S!@@ \r A !A !AëÜA kAtA j( "\rm!	A !A !A !@ Aj Atj" ( " \rn" j"6  AjAÿq   F Eq"! Awj  ! 	   \rlkl! Aj" G\r  E\r   6  Aj!  kA	j!@ Aj Atj!	 A$H!@@@ \r  A$G\r 	( AÑéùO\r Aÿj!\rA !@ !@@ Aj \rAÿq"Atj"5 B ­|"BëÜZ\r A !  BëÜ"BëÜ~}! §!  >      P  F  AjAÿq"G! Aj!\r  G\r  Acj! ! E\r @@ AjAÿq" F\r  ! Aj AþjAÿqAtj" (  Aj Atj( r6  ! A	j! Aj Atj 6 @@ AjAÿq! Aj AjAÿqAtj!	@A	A A-J!\r@@ !A !@@@  jAÿq" F\r Aj Atj( " At( "I\r  K\r Aj"AG\r  A$G\r B !A !B !@@  jAÿq" G\r  Aj AjAÿq"AtjA|jA 6  Aj Aj Atj( Ð  Aðj  B Bå·À È  Aàj )ð )ø ) )Ë  )è! )à! Aj"AG\r  AÐj Ç  AÀj   )Ð )ØÈ B ! )È! )À! Añ j" k"A  A J   J""Að M\rB !B !B ! \r j! !  F\r AëÜ \rv!A \rtAs!A ! !@ Aj Atj" ( " \rv j"6  AjAÿq   F Eq"! Awj  !  q l! AjAÿq" G\r  E\r@  F\r  Aj Atj 6  ! 	 	( Ar6  AjD      ð?Aá k  Ì  A°j ) )  Ï  )¸! )°! AjD      ð?Añ  k  Ì  A j   ) )Ö  Aðj   ) " )¨"Ñ  Aàj   )ð )øË  )è! )à!@ AjAÿq"\r F\r @@ Aj \rAtj( "\rAÿÉµîK\r @ \r\r  AjAÿq F\r Aðj ·D      Ð?¢Ì  Aàj   )ð )øË  )è! )à!@ \rAÊµîF\r  AÐj ·D      è?¢Ì  AÀj   )Ð )ØË  )È! )À! ·!@ AjAÿq G\r  Aj D      à?¢Ì  Aj   ) )Ë  )! )! A°j D      è?¢Ì  A j   )° )¸Ë  )¨! ) ! Aï K\r  AÐj  B BÀÿ?Ö  )Ð )ØB B Í \r  AÀj  B BÀÿ?Ë  )È! )À! A°j    Ë  A j )° )¸  Ñ  )¨! ) !@ Aÿÿÿÿq \nA~jL\r  Aj  ×  Aj  B Bÿ?È  ) )B B¸À Î ! )  AJ"! )  !  B B Í !@  j"Aî j \nJ\r    G A Hrq A GqE\r³ AÄ 6  Aðj   Ò  )ø! )ð!   7   7  AÆ j$ Ó~@@  ("  (hF\r    Aj6 -  !  Å !@@@@@ AUj  @@  ("  (hF\r    Aj6 -  !  Å ! A-F! AFj! E\r AuK\r  )pB S\r    (Aj6 AFj!A ! ! AvI\r B !@ APjA\nO\r A !@  A\nlj!@@  ("  (hF\r    Aj6 -  !  Å ! APj!@ APj"A	K\r  AÌ³æ H\r ¬! A\nO\r @ ­ B\n~|!@@  ("  (hF\r    Aj6 -  !  Å ! BP|!@ APj"A	K\r  B®×ÇÂë£S\r A\nO\r @@@  ("  (hF\r    Aj6 -  !  Å ! APjA\nI\r @  )pB S\r     (Aj6B  }  !B!  )pB S\r     (Aj6B Â~~# Ak"$ @@@ A$K\r  AG\r³ A6 B !@@@  ("  (hF\r    Aj6 -  !  Å ! Þ \r A !@@ AUj  AA  A-F!@  ("  (hF\r    Aj6 -  !  Å !@@@@@ A G AGq\r  A0G\r @@  ("  (hF\r    Aj6 -  !  Å !@ A_qAØ G\r @@  ("  (hF\r    Aj6 -  !  Å !A! AÑ j-  AI\rB !@@  )pB S\r     ("Aj6 E\r   A~j6 \rB !  B Ä  \rA! A\n " AÑ j-  K\r B !@  )pB S\r     (Aj6  B Ä ³ A6  A\nG\r B !@ APj"A	K\r A !@@@  ("  (hF\r    Aj6 -  !  Å ! A\nl j!@ APj"A	K\r  A³æÌI\r ­! A	K\r B\n~! ­!	@@@  ("  (hF\r    Aj6 -  !  Å !  	|!@@@ APj"A	K\r  B³æÌ³æÌT\r A	M\r B\n~" ­"	BX\rA\n!@@@  AjqE\r   AÑ j-  "\nK\r  AÑ j-  "M\r AlAvAq, Ñ !A !\n@@@  ("  (hF\r    Aj6 -  !  Å !  \n t"r!\n@  AÑ j-  "M"\r\r  AÀ I\r \n­! \r\rB ­"	" T\r@ ­Bÿ!@@  ("  (hF\r    Aj6 -  !  Å !  	 !  AÑ j-  "M\r  X\r A !@@@  ("  (hF\r    Aj6 -  !  Å ! \n  lj!@  AÑ j-  "\nM"\r  AÇãñ8I\r ­! \r ­!@  ~"	 \n­Bÿ"BV\r@@  ("  (hF\r    Aj6 -  !  Å ! 	 |!  AÑ j-  "\nM\r  B  B Ó  )B R\r B !  AÑ j-  M\r @@@  ("  (hF\r    Aj6 -  !  Å !  AÑ j-  K\r ³ AÄ 6  A  BP! !@  )pB S\r     (Aj6@  T\r @ §Aq\r  \r ³ AÄ 6  B|!  X\r ³ AÄ 6   ¬" }! Aj$     A F  AwjAIr~# A k"$  Bÿÿÿÿÿÿ?!@@ B0Bÿÿ"§"AÿjAýK\r  B§!@@  P Bÿÿÿ"BT BQ\r  Aj!   BB R\r  Aq j!A   AÿÿÿK"!AA  j!@   P\r  BÿÿR\r  B§Ar!Aÿ!@ AþM\r Aÿ!A !@Aÿ Aÿ  P"" k"Að L\r A !A !  BÀ  !A !@  F\r  Aj   A kÞ  ) )B R!     ß  )"B§!@@ )  ­" P Bÿÿÿ"BT BQ\r  Aj!   BB R\r  Aq j! As  AÿÿÿK"! A j$  At B §Axqr r¾ @  \r A  ( EÒ~	~# A°k"$ @@  (LA N\r A!  ¥ E!@@@  (\r   å   (E\r@ -  "\r A !B !A !@@@@@@ Aÿq"â E\r @ "Aj! - â \r   B Ä @@@  ("  (hF\r    Aj6 -  !  Å ! â \r   (!@  )pB S\r    Aj"6  )x |   (,k¬|!@@@@ A%G\r  - "A*F\r A%G\r  B Ä @@ -  A%G\r @@@  ("  (hF\r    Aj6 -  !  Å ! â \r  Aj!@  ("  (hF\r    Aj6 -  !  Å !@  -  F\r @  )pB S\r     (Aj6 AJ\r\n \r\n	  )x |  (  (,k¬|! ! Aj!A !@ APj"	A	K\r  - A$G\r  Aj!  	ã ! Aj! ( ! Aj!A !\nA !	@ -  "APjAÿqA	K\r @ 	A\nl AÿqjAPj!	 - ! Aj! APjAÿqA\nI\r @@ AÿqAí F\r  ! Aj!A ! A G!\n - !A !\r Aj!A!@@@@@@ AÿqA¿j:																								 								 Aj  - Aè F"!A~A ! Aj  - Aì F"!AA !A!A!A ! !A  -  "A/qAF"!@ A r  "AÛ F\r @@ Aî F\r  Aã G\r 	A 	AJ!	   ä   B Ä @@@  ("  (hF\r    Aj6 -  !  Å ! â \r   (!@  )pB S\r    Aj"6  )x |   (,k¬|!   	¬"Ä @@  ("  (hF\r    Aj6  Å A H\r@  )pB S\r     (Aj6A!@@@@@@@@@@@@ A¨j!  A¿j"AK\r\nA tAñ qE\r\n Aj   A Ø   )xB   (  (,k¬}Q\r E\r	 )! )! 	@ ArAó G\r  A jAA·  A :   Aó G\r A : A A : . A 6* A j - "AÞ F"A·  A :   Aj Aj !@@@@ AA j-  "A-F\r  AÝ F\r AÞ G! !  AÞ G": N  AÞ G": ~ Aj!@@@ -  "A-F\r  E\r AÝ F\r\nA-! - "E\r  AÝ F\r  Aj!@@ Aj-  " I\r  !@ A j Aj"j :    -  "I\r  ! A j j :  Aj! A!A\n!A !   A BÝ !  )xB   (  (,k¬}Q\r	@ Að G\r  E\r   >    ä    ß 8    à 9   7   7A 	Aj Aã G"!@@ AG\r  !	@ \nE\r  AtÐ "	E\r B 7¨A !@@@ 	!@@@  ("	  (hF\r    	Aj6 	-  !	  Å !	 A j 	jAj-  E\r  	:  Aj AjA A¨jé "	A~F\r @ 	AG\r A !@ E\r   Atj (6  Aj! \nE\r   G\r   AtAr"AtÓ "	\r A ! !\rA!\nA ! !\r A¨jà \r !\r@ \nE\r A ! Ð "	E\r@ 	!@@@  ("	  (hF\r    	Aj6 	-  !	  Å !	@ A j 	jAj-  \r A !\r !  j 	:   Aj" G\r   AtAr"Ó "	\r A !\r !A!\nA !@ E\r @@@  ("	  (hF\r    	Aj6 	-  !	  Å !	@ A j 	jAj-  \r A !\r ! !  j 	:   Aj! @@@  ("  (hF\r    Aj6 -  !  Å ! A j jAj-  \r A !A !A !\rA !  (!	@  )pB S\r    	Aj"	6  )x 	  (,k¬|"P\r   QrE\r@ \nE\r   6  Aã F\r @ \rE\r  \r AtjA 6 @ \r A !  jA :    )x |  (  (,k¬|!  A Gj! Aj! - "\r A!\nA !A !\r A ! \nE\r Ò  \rÒ A!@ \r   ¦  A°j$     A F  AwjAIr6# Ak"  6    AtjA|j   AK" Aj6  ( C @  E\r @@@@ Aj    <     =    >    7 \\# Ak"$  A Aü  A6L   6, A 6    6T   á !  Aj$   ]  (T!   A  Aj"± " k  "   I"     j"6T   6    j6 7# Ak"$   6    å ! Aj$  # Ak" $ @  Aj  Aj  \r A   (AtAjÐ "6è  E\r @  (Ð "E\r A (è "  (AtjA 6   ¡ E\rA A 6è   Aj$ u@ \r A @@  -  "\r A ! @@ Aÿq -  "G\r E\r Aj"E\r Aj!  - !  Aj!  \r A ! Aÿq!    -  k@  A=â "  G\r A A !@     k"j-  \r A (è "E\r  ( "E\r @@@    é \r  (  j"-  A=F\r (! Aj! \r  Aj! Y -  !@  -  "E\r   AÿqG\r @ - !  - "E\r Aj!  Aj!   AÿqF\r   Aÿqk´@ -  \r @AÊ ê "E\r  -  \r@  AlAà jê "E\r  -  \r@Aå ê "E\r  -  \rA£ !A !@@@  j-  "E\r A/F\rA! Aj"AG\r  !A£ !@@@@@ -  "A.F\r   j-  \r  ! AÃ G\r - E\r A£ ë E\r  A ë \r@  \r A´ ! - A.F\rA @A (ð "E\r @  Ajë E\r ( "\r @A$Ð "E\r  A )´ 7  Aj"     jA :   A (ð 6 A  6ð  A´    r! @@@ AI\r    rAq\r@  (  ( G\r Aj!  Aj!  A|j"AK\r  E\r@@  -  " -  "G\r Aj!  Aj!  Aj"E\r   kA /   A G  Aô G  Að G  A G  AØ Gqqqq* Aì ¬     ð !Aì ­  # A k"$ A !@@@A t  q!@@ E\r  \r   Atj( !  A  ì ! Aj Atj 6  AF\r Aj"AG\r @ î \r AØ ! AjAØ Aí E\rAð ! AjAð Aí E\rA !@A - ¤ \r @ At A ì 6ô  Aj"AG\r A A: ¤ A A (ô 6 Aô ! AjAô Aí E\rA ! AjA Aí E\rAÐ "E\r  )7  )7  )7 A ! A j$   A¨ ò @@  ( AG\rAÀ A¨ ó  @  ( \r   ô A¨ õ     A¨ ò   ö A¨ õ AÀ ÷ A¨ õ \n   ¨     ª 	   A6 \n   © 	   A6 \n   «  @  î E\r   Ò #  !@ "Aj! ( \r    kAuÛ~@  B~|BV\r   §"A¼jAu!@@@ Aq\r  Aj! E\rA! E\rA !  6  Açl A£ljAÖ¯ãj¬  B|"   B"B~}"B?§ §j!@@@@@ §"Aj  B S"\r A!A !@@ AÈH\r @ A¬I\r  AÔ}j!A! A¸~j!A! Aj  Aã J"! \rA !A ! \r Av! AqE! E\r  6   Bç~  Al Aá ljj k¬B£~|BªºÃ|\'  AtA° j( "A£j     AJÂ~~# Ak"$   4!@  ("AI\r   Am"Alk"Aj  A H!  Auj¬ |!  Ajú !  (û !  (!  4!  4!  4 ! Aj$    ¬| Aj¬B£~| B~| B<~|| @A -  Aq\r A ¨ @A -  Aq\r Að Aô A  AÀ ¢ A AÀ 6ü A A  6ø A A:  A © )   ((! A ¬ ý A ­   Ô@  AG\r A¥ AÑ  (   Au!@  Aÿÿq"AÿÿG\r  AJ\r   Atj( " AjAî   A ! @@@@@ Aj  AK\rAà !  A1K\rAð !  AK\rA° !  E\r @  "Aj!  -  \r  Aj"\r        B Ý~# Ak"$ @@@@ A$J\r A !  -  "\r  !³ A6 B !  !@@ À E\r - ! Aj"! \r  !@ Aÿq"AUj  AA  A-F! Aj!@@ ArAG\r  -  A0G\r A!	@ - AßqAØ G\r  Aj!A!\n Aj! A !\n A\n !\nA !	 \n­!A !B !@@@ -  "APj"AÿqA\nI\r @ AjAÿqAK\r  A©j! A¿jAÿqAK\r AIj! \n AÿqL\r  B  B Ó A!@ )B R\r   ~"\r ­Bÿ"BV\r  \r |!A!	 ! Aj! ! @ E\r      	6 @@@ E\r ³ AÄ 6  A  B"P! !  T\r B!@ §\r  \r ³ AÄ 6  B|!  X\r ³ AÄ 6   ¬" }! Aj$     A F  AwjAIr     B      Bÿÿÿÿ §Û\n~# AÐ k"$ A !A0!A¨!	A !\n@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ A[jV!...........................\'.	\n...\r.... ...... &......%.. ("\nAM\r"+ ("\nAK\r* \nAj!\n" ("\nAK\r) \nAj!\n! ("\nAK\r( \nAj!\n  4Bì|Bä !#Aß ! 4!"A³ ! 4"Bì|!@@ ("\nAJ\r   Bë|  AF! \nAéI\r  Bí|   AF!A0! Aç F\r! 4!A0!A!\n@ ("\r B!! ¬"Bt|  AJ!  (Aj¬!A0!A!\n (Aj¬! 4! A6 A !\nA§A¦ (AJ!\nAÄ ! ü  4$}! 4 ! A6 A !\nA± ! ("\nA \n¬! ( (kAjAn­! ( (AjApkAjAn­!  ­! 4!A0!A!\nA©!	\nAª!		 4Bì|Bä " B?" }!\n 4"Bì|!@ B¤?Y\r A0!  70   Aä Aÿ  A0j 6   !\n@ ( AJ\r  A 6 A !\n  ($"\nAm"Aä l \n AlkÁA<mÁj6@   Aä A  AÀ j 6   !\n@ ( AJ\r  A 6 A !\n þ !\n A6 Að !\n Bä ! \nAr!\n \n ÿ !\nA«!	 	 ÿ !   Aä     "\n6   A  \n!\nA0!A!\nA!\n@@   "Aß F\r  A-G\r  7   Aä A  Aj 6   !\n  7(  \n6    Aä Aù  A j 6   !\n  7  \n6    Aä Aò   6   !\nAÜ !\n  \n 6  AÐ j$  \n¦A5!@@  ("  ("AjApkAjAn  k"AñjApAIj"A5F\r  ! \rA4!@@ AjApA|j   (AoAj E\rA5@@ AójApA}j   ( \rA! 	# Ak"$ @@ \r A !A !@@@@@@@@ -  "A%F\r  \r !A !A!	@ - "\nASj  \nAß F\r \n\r   j :   Aj! \n! - !\nA!	@@  	j \nAÿq"A+Fj"	,  APjA	K\r  	 AjA\n ! (!\n  	6A ! 	!\nA !@ \n-  "A½j"\rAK\r A \rtAqE\r  ! \r  \n 	G!@@ AÏ F\r  AÅ F\r  \n! \nAj! \n- ! Aj Aü j À    "E\r@@ \r  (|!	@@@ -  "AUj   (|!	 (|Aj!	 - ! Aj!@ AÿqA0G\r @ , "APjA	K\r Aj! 	Aj!	 A0F\r   	6|A !@ "\nAj!  \nj,  APjA\nI\r   	  	K!@@@ (AqN\r A-!\n A+G\r  	k \njAA (-  AÃ FI\rA+!\n   j \n:   Aj! Aj!  	M\r   O\r @   jA0:   Aj! Aj" 	M\r  I\r   	  k" 	 I"6|   j    (| j! Aj!  I\r  Aj   F!A !   jA :   Aj$  > @  A°pj    AñÿÿJ" AqE\r A @  Aìj" Aä oE\r A  AoE/ @ E\r @@  (  G\r     Aj!  Aj"\r A : "(`!@  E\r  Aõ     AF6`A  Aõ Fç# Ak"$ A !@ ( "E\r  E\r  A   !A !@@ Aj   AI ( A Ç "AG\r A!@@  \r A ! @ AK\r   I\r   Aj    k!   j! @ ( \r A !  j! Aj! Aj"\r @  E\r   6  Aj$  Ú ( !@@@@@@@@@@@@ E\r  ( "E\r @  \r  ! A 6  !@@ (`( \r   E\r E\r !@@ ,  "E\r   Aÿ¿q6   Aj!  Aj! Aj"\r   A 6  A 6   k !  E\r !A !  A!A !A!@@@   -  Av"Apj Au jrAK\r Aj!@@ Aq\r  !@ ,  A@H\r  Aj! Aj!@ A q\r  !@ ,  A@H\r  Aj! Aj! Aj!A!@@ ,  "AH\r  Aq\r  ( "Aÿýûwj rAxq\r @ A|j! "Aj! ("Aÿýûwj rAxqE\r @ ÀAH\r  Aj! Aj! AÿqA¾~j"A2K\r Aj! At( !A ! @@@   E\r@@ -  "À"A L\r@ AI\r  Aq\r @@ ( "Aÿýûwj rAxq\r   Aÿq6    - 6   - 6   - 6  Aj!  Aj! A|j"AK\r  -  ! Aÿq! ÀAH\r   6   Aj!  Aj! Aj"E\r	  A¾~j"A2K\r Aj! At( !A! -  "Av"Apj  AujrAK\r Aj!@@@@ Aj Atr"AL\r  ! -  Aj"A?K\r Aj!  At"	r!@ 	AL\r  ! -  Aj"A?K\r Aj!  Atr!   6  Aj!  Aj! ³ A6  Aj!A !  Aj! \r -  ! Aÿq\r @  E\r   A 6  A 6   k³ A6   E\r  6 A  6  ¥# Ak"$   ( "6 A  !   Aj  !A !@@@@ E\r  E\r @ Av!	@ AK\r  	 O\r  !	  Aj 	  	 I  !\n (!	@ \nAG\r A !A! A  \n  AjF"k!  Atj!  j 	kA  	! \n j! 	E\r 	! \r  !	 	E\r E\r  E\r  !\n@@@@  	  é "AjAK\r @@ Aj  A 6 A 6   ( j"	6 \nAj!\n Aj"\r \n! Aj!  k! \n! \r @  E\r   (6  Aj$   AA (`(  A     AÔ  é             D}# Ak"$     A   )  )ß ! Aj$  ~# A k"$   6<  6 A6 AjB Ä   Aj AØ  )! ) !@ E\r    ( (<kj (j6    7   7  A j$ D|# Ak"$     A  )  )à ! Aj$  H~# Ak"$    A  ) !   )7   7  Aj$           F~# Ak"$      ) !   )7   7  Aj$ x# Ak"$   6  6A!@A A   Å "A H\r    Aj"Ð "6  E\r     (Å ! Aj$  \n    \n   æ       Aí `   kj!@@@  F\rA!  F\r ,  " ,  "H\r@  N\r A Aj! Aj!   G!          ø "              ½ ¾ BA !@  G\r   At ,  j"Aq"Av r s! Aj! \n       ¢   Aí V@@@  F\rA!  F\r ( " ( "H\r@  N\r A Aj! Aj!   G!      ¦    § "   ¨   \n   Á        Â Ã BA !@  G\r   (  Atj"Aq"Av r s! Aj! ª# A k"$   6@@  Aq\r  A6          ( (  !@@@ (   A :   A:   A:   A6   Ó   ! «   Ó  ¬ ! «   ­  Ar ®   Aj   Aj"  A¯  F:   (!@ Atj " G\r  A j$     (       Að °      ( (       ( (  # Ak"$   6|  ± ! A 6A !	 AjA  Aj² !\n Aj!@@@@ Aå I\r  Ð "E\r \n ³  ! !@@  G\r A !\r@@@   Aü j \r  \r@   Aü j E\r   ( Ar6 @  F\r -  AF\r Aj! Aj!    !@ \r   ´ ! \rAj!A ! ! !@@  G\r  !\r AqE\r    !\r ! ! 	 jAI\r@@  G\r  !\r@ -  AG\r    F\r  A :   	Aj!	 Aj! Aj! @ -  AG\r   \rµ ,  !@ \r   ´ !@@  G\r A!   G\r A:  A! 	Aj!	 A :   Aj! Aj! Aj!  AA ¶ ":   Aj! Aj! 	 j!	  k! õ    ( Ar6  \n·  Aj$     (  Ã ê          6    ( 6  ,  ( !   6 @ E\r    (        ( (  \r     j    E   A ³           ¹ # Ak"$   6ø  6ü º !    AÐj» !  AÄj  A÷j¼  A¸j÷ !      A ½ "6´  Aj6 A 6@@ Aüj Aøj \r@ (´   jG\r   !   At        A ½ "j6´ Aüj    A´j Aj , ÷ AÄj Aj Aj  ¾ \r Aüj  @ AÄj E\r  ("  AjkAJ\r    Aj6   (6    (´  ¿ 6  AÄj Aj ( À @ Aüj Aøj E\r   ( Ar6  (ü!   AÄj  Aj$  6 @@   AÊ q" E\r @  AÀ G\r A  AG\rAA A\n      [# Ak"$  Aj Ó   Aj¬ " :       Aj«  Aj$ \r   ý  j# Ak"\n$  \n  : @@@ ( " G\r @@  Aÿq" 	- G\r A+!   	- G\rA-!   Aj6    :  @  E\r    G\r A !  ( "	 kAJ\r ( !   	Aj6  	  6 A!  	 	Aj \nAjß  	k"	AJ\r@@@ Axj   	 H\r AG\r  	AH\r  ( " F\r  kAJ\rA!  Aj-  A0G\rA !  A 6   Aj6   	- Ð :    ( " Aj6    	AÐ j-  :    ( Aj6 A ! A !  A 6  \nAj$   ò~# Ak"$ @@@@@   F\r ³ "( ! A 6    Aj Ý  !@@ ( " E\r  ( G\r  AÄ F\r  6  ( F\r A6  A6 A !  ¬S\r  ¡ ¬U\r  §! A6 @ BS\r ¡ ! ! Aj$  ¾   !@  kAH\r  E\r     A|j!   "   j!@@@ ,  !   O\r@  AH\r   ª N\r  (  ,  G\r Aj!   kAJj!   AH\r  ª N\r ( Aj ,  I\r A6         Â # Ak"$   6ø  6ü º !    AÐj» !  AÄj  A÷j¼  A¸j÷ !      A ½ "6´  Aj6 A 6@@ Aüj Aøj \r@ (´   jG\r   !   At        A ½ "j6´ Aüj    A´j Aj , ÷ AÄj Aj Aj  ¾ \r Aüj  @ AÄj E\r  ("  AjkAJ\r    Aj6   (6    (´  Ã 7  AÄj Aj ( À @ Aüj Aøj E\r   ( Ar6  (ü!   AÄj  Aj$  é~# Ak"$ @@@@@   F\r ³ "( ! A 6    Aj Ý  !@@ ( " E\r  ( G\r  AÄ F\r  6  ( F\r A6  A6 B !  S\r   Y\r A6 @ BS\r  ! ! Aj$          Å # Ak"$   6ø  6ü º !    AÐj» !  AÄj  A÷j¼  A¸j÷ !      A ½ "6´  Aj6 A 6@@ Aüj Aøj \r@ (´   jG\r   !   At        A ½ "j6´ Aüj    A´j Aj , ÷ AÄj Aj Aj  ¾ \r Aüj  @ AÄj E\r  ("  AjkAJ\r    Aj6   (6    (´  Æ ;  AÄj Aj ( À @ Aüj Aøj E\r   ( Ar6  (ü!   AÄj  Aj$  ~# Ak"$ @@@@@@   F\r @  -  "A-G\r   Aj"  G\r  A6 ³ "( ! A 6    Aj Ý   !@@ ( " E\r  ( G\r  AÄ F\r  6  ( F\r A6  A6 A !  ¡ ­X\r A6 ¡ ! A  §" k   A-F!  Aj$   Aÿÿq        È # Ak"$   6ø  6ü º !    AÐj» !  AÄj  A÷j¼  A¸j÷ !      A ½ "6´  Aj6 A 6@@ Aüj Aøj \r@ (´   jG\r   !   At        A ½ "j6´ Aüj    A´j Aj , ÷ AÄj Aj Aj  ¾ \r Aüj  @ AÄj E\r  ("  AjkAJ\r    Aj6   (6    (´  É 6  AÄj Aj ( À @ Aüj Aøj E\r   ( Ar6  (ü!   AÄj  Aj$  ~# Ak"$ @@@@@@   F\r @  -  "A-G\r   Aj"  G\r  A6 ³ "( ! A 6    Aj Ý   !@@ ( " E\r  ( G\r  AÄ F\r  6  ( F\r A6  A6 A !  Ú ­X\r A6 Ú ! A  §" k   A-F!  Aj$           Ë # Ak"$   6ø  6ü º !    AÐj» !  AÄj  A÷j¼  A¸j÷ !      A ½ "6´  Aj6 A 6@@ Aüj Aøj \r@ (´   jG\r   !   At        A ½ "j6´ Aüj    A´j Aj , ÷ AÄj Aj Aj  ¾ \r Aüj  @ AÄj E\r  ("  AjkAJ\r    Aj6   (6    (´  Ì 6  AÄj Aj ( À @ Aüj Aøj E\r   ( Ar6  (ü!   AÄj  Aj$  ~# Ak"$ @@@@@@   F\r @  -  "A-G\r   Aj"  G\r  A6 ³ "( ! A 6    Aj Ý   !@@ ( " E\r  ( G\r  AÄ F\r  6  ( F\r A6  A6 A !  ¼ ­X\r A6 ¼ ! A  §" k   A-F!  Aj$           Î # Ak"$   6ø  6ü º !    AÐj» !  AÄj  A÷j¼  A¸j÷ !      A ½ "6´  Aj6 A 6@@ Aüj Aøj \r@ (´   jG\r   !   At        A ½ "j6´ Aüj    A´j Aj , ÷ AÄj Aj Aj  ¾ \r Aüj  @ AÄj E\r  ("  AjkAJ\r    Aj6   (6    (´  Ï 7  AÄj Aj ( À @ Aüj Aøj E\r   ( Ar6  (ü!   AÄj  Aj$  ~# Ak"$ @@@@@@   F\r @  -  "A-G\r   Aj"  G\r  A6 ³ "( ! A 6    Aj Ý   !@@ ( " E\r  ( G\r  AÄ F\r  6  ( F\r A6  A6 B !£  Z\r A6 £ !B  }  A-F! Aj$          Ñ ´# Ak"$   6ø  6ü AÀj  AÐj AÏj AÎjÒ  A´j÷ !      A ½ "6°  Aj6 A 6 A:  AÅ : A !@@@ Aüj Aøj \r @ (°   jG\r   !   At        A ½ "j6° Aüj  Aj Aj  A°j , Ï , Î AÀj Aj Aj Aj AÐjÓ \r  Aq\rA ! (° k"AH\r@@ -  "AUj"	   A.F\rA! APjAÿqA\nI\r AF\r@ 	   - "A.F\rA! APjAÿqA	M\r@ AÀj E\r  - AqE\r  (" AjkAJ\r   Aj6  (6    (° Ô 8  AÀj Aj ( À @ Aüj Aøj E\r   ( Ar6  (ü!   AÀj  Aj$  A! Aüj  # Ak"$  Aj Ó  Aj AÐ Aì  Ü   Aj¬ " :     :       Aj«  Aj$ # Ak"$    : @@@   G\r  -  AG\rA !  A :    ( "Aj6  A.:    E\r 	( " kAJ\r \n( ! 	 Aj6   6 @@   G\r   E\r  -  AG\r 	( "  kAJ\r \n( ! 	  Aj6    6 A !  \nA 6   Aj Ajß  k"AJ\r AÐ j,  !@@@@ A~qAjj @ ( " F\r A!  Aj,  ¾  ,  ¾ G\r  Aj6   :   AÐ :   ¾ "  ,  G\r    ¿ :   -  AG\r  A :    E\r  	( "  kAJ\r  \n( ! 	  Aj6    6   ( " Aj6    :  A !  AJ\r \n \n( Aj6 A ! A!  Aj$   ±}# Ak"$ @@@@   F\r ³ "( ! A 6    Aj¥ !@@ ( " E\r  ( F\r  6  ( G\r  AÄ G\r A6 C    !C    ! A6  Aj$          Ö ´# Ak"$   6ø  6ü AÀj  AÐj AÏj AÎjÒ  A´j÷ !      A ½ "6°  Aj6 A 6 A:  AÅ : A !@@@ Aüj Aøj \r @ (°   jG\r   !   At        A ½ "j6° Aüj  Aj Aj  A°j , Ï , Î AÀj Aj Aj Aj AÐjÓ \r  Aq\rA ! (° k"AH\r@@ -  "AUj"	   A.F\rA! APjAÿqA\nI\r AF\r@ 	   - "A.F\rA! APjAÿqA	M\r@ AÀj E\r  - AqE\r  (" AjkAJ\r   Aj6  (6    (° × 9  AÀj Aj ( À @ Aüj Aøj E\r   ( Ar6  (ü!   AÀj  Aj$  A! Aüj  ¹|# Ak"$ @@@@   F\r ³ "( ! A 6    Aj§ !@@ ( " E\r  ( F\r  6  ( G\r  AÄ G\r A6 D        !D        ! A6  Aj$          Ù Ë~# Ak"$   6  6 AÐj  Aàj Aßj AÞjÒ  AÄj÷ !      A ½ "6À  A j6 A 6 A:  AÅ : A !@@@ Aj Aj \r @ (À   jG\r   !   At        A ½ "j6À Aj  Aj Aj  AÀj , ß , Þ AÐj A j Aj Aj AàjÓ \r  Aq\rA ! (À k"AH\r@@ -  "AUj"	   A.F\rA! APjAÿqA\nI\r AF\r@ 	   - "A.F\rA! APjAÿqA	M\r@ AÐj E\r  - AqE\r  (" A jkAJ\r   Aj6  (6    (À Ú  ) !\n  )7  \n7  AÐj A j ( À @ Aj Aj E\r   ( Ar6  (!   AÐj  Aj$  A! Aj  Þ~# A k"$ @@@@  F\r ³ "( ! A 6  Aj  Aj©  )! )! ( "E\rB !	B !\n ( G\r !	 !\n AÄ G\r A6 B !B !  6 B !	B !\n ( F\r A6  	! \n!   7    7 A j$ # Ak"$   6ø  6ü AÄj÷ ! Aj Ó  Aj AÐ Aê  AÐjÜ  Aj«  A¸j÷ !      A ½ "6´  Aj6 A 6@@ Aüj Aøj \r@ (´   jG\r   !   At        A ½ "j6´ Aüj A  A´j AjA   Aj Aj AÐj¾ \r Aüj    (´ k   !Ý !  6@  AÒ  AjÞ AF\r  A6 @ Aüj Aøj E\r   ( Ar6  (ü!     Aj$          ( (   K@A - ü E\r A (ø AÿÿÿÿAî A á ! A A: ü A   6ø   <# Ak"$   ( 6      à ! Aj$  I# Ak"$          Aj  !  Aj$   \\# Ak"$   6  6 Aj Ajþ !    (å ! ÿ  Aj$       ï ª# A k"$   6@@  Aq\r  A6          ( (  !@@@ (   A :   A:   A:   A6   Ó  Ý ! «   Ó  ã ! «   ä  Ar å   Aj   Aj"  Aæ  F:   (!@ Atj " G\r  A j$     Aø °      ( (       ( (  # Ak"$   6|  ç ! A 6A !	 AjA  Aj² !\n Aj!@@@@ Aå I\r  Ð "E\r \n ³  ! !@@  G\r A !\r@@@   Aü jÞ \r  \r@   Aü jÞ E\r   ( Ar6 @  F\r -  AF\r Aj! Aj!   ß !@ \r   è ! \rAj!A ! ! !@@  G\r  !\r AqE\r  á  !\r ! ! 	 jAI\r@@  G\r  !\r@ -  AG\r  é  F\r  A :   	Aj!	 Aj! Aj! @ -  AG\r   \rê ( !@ \r   è !@@  G\r A! é  G\r A:  A! 	Aj!	 A :   Aj! Aj! Aj!  AA ë ":   Aj! Aj! 	 j!	  k! õ    ( Ar6  \n·  Aj$      «       ( (  ! @   E\r            Atj   é E        í # AÐk"$   6È  6Ì º !    AÐjî !  AÄj  AÄjï  A¸j÷ !      A ½ "6´  Aj6 A 6@@ AÌj AÈjÞ \r@ (´   jG\r   !   At        A ½ "j6´ AÌjß    A´j Aj (Ä AÄj Aj Aj  ð \r AÌjá  @ AÄj E\r  ("  AjkAJ\r    Aj6   (6    (´  ¿ 6  AÄj Aj ( À @ AÌj AÈjÞ E\r   ( Ar6  (Ì!   AÄj  AÐj$       ¬ [# Ak"$  Aj Ó   Ajã " 6      Aj«  Aj$ # Ak"\n$  \n  6@@@ ( " G\r @@   	(`G\r A+!    	(dG\rA-!   Aj6    :  @  E\r    G\r A !  ( "	 kAJ\r ( !   	Aj6  	  6 A!  	 	Aè j \nAj  	kAu"	AJ\r@@@ Axj   	 H\r AG\r  	AH\r  ( " F\r  kAJ\rA!  Aj-  A0G\rA !  A 6   Aj6   	- Ð :    ( " Aj6    	AÐ j-  :    ( Aj6 A ! A !  A 6  \nAj$           ò # AÐk"$   6È  6Ì º !    AÐjî !  AÄj  AÄjï  A¸j÷ !      A ½ "6´  Aj6 A 6@@ AÌj AÈjÞ \r@ (´   jG\r   !   At        A ½ "j6´ AÌjß    A´j Aj (Ä AÄj Aj Aj  ð \r AÌjá  @ AÄj E\r  ("  AjkAJ\r    Aj6   (6    (´  Ã 7  AÄj Aj ( À @ AÌj AÈjÞ E\r   ( Ar6  (Ì!   AÄj  AÐj$          ô # AÐk"$   6È  6Ì º !    AÐjî !  AÄj  AÄjï  A¸j÷ !      A ½ "6´  Aj6 A 6@@ AÌj AÈjÞ \r@ (´   jG\r   !   At        A ½ "j6´ AÌjß    A´j Aj (Ä AÄj Aj Aj  ð \r AÌjá  @ AÄj E\r  ("  AjkAJ\r    Aj6   (6    (´  Æ ;  AÄj Aj ( À @ AÌj AÈjÞ E\r   ( Ar6  (Ì!   AÄj  AÐj$          ö # AÐk"$   6È  6Ì º !    AÐjî !  AÄj  AÄjï  A¸j÷ !      A ½ "6´  Aj6 A 6@@ AÌj AÈjÞ \r@ (´   jG\r   !   At        A ½ "j6´ AÌjß    A´j Aj (Ä AÄj Aj Aj  ð \r AÌjá  @ AÄj E\r  ("  AjkAJ\r    Aj6   (6    (´  É 6  AÄj Aj ( À @ AÌj AÈjÞ E\r   ( Ar6  (Ì!   AÄj  AÐj$          ø # AÐk"$   6È  6Ì º !    AÐjî !  AÄj  AÄjï  A¸j÷ !      A ½ "6´  Aj6 A 6@@ AÌj AÈjÞ \r@ (´   jG\r   !   At        A ½ "j6´ AÌjß    A´j Aj (Ä AÄj Aj Aj  ð \r AÌjá  @ AÄj E\r  ("  AjkAJ\r    Aj6   (6    (´  Ì 6  AÄj Aj ( À @ AÌj AÈjÞ E\r   ( Ar6  (Ì!   AÄj  AÐj$          ú # AÐk"$   6È  6Ì º !    AÐjî !  AÄj  AÄjï  A¸j÷ !      A ½ "6´  Aj6 A 6@@ AÌj AÈjÞ \r@ (´   jG\r   !   At        A ½ "j6´ AÌjß    A´j Aj (Ä AÄj Aj Aj  ð \r AÌjá  @ AÄj E\r  ("  AjkAJ\r    Aj6   (6    (´  Ï 7  AÄj Aj ( À @ AÌj AÈjÞ E\r   ( Ar6  (Ì!   AÄj  AÐj$          ü ´# Aàk"$   6Ø  6Ü AÌj  Aàj AÜj AØjý  AÀj÷ !      A ½ "6¼  Aj6 A 6 A:  AÅ : A !@@@ AÜj AØjÞ \r @ (¼   jG\r   !   At        A ½ "j6¼ AÜjß  Aj Aj  A¼j (Ü (Ø AÌj Aj Aj Aj Aàjþ \r  Aq\rA ! (¼ k"AH\r@@ -  "AUj"	   A.F\rA! APjAÿqA\nI\r AF\r@ 	   - "A.F\rA! APjAÿqA	M\r@ AÌj E\r  - AqE\r  (" AjkAJ\r   Aj6  (6    (¼ Ô 8  AÌj Aj ( À @ AÜj AØjÞ E\r   ( Ar6  (Ü!   AÌj  Aàj$  A! AÜjá  # Ak"$  Aj Ó  AjÝ AÐ Aì     Ajã " 6    6      Aj«  Aj$ §# Ak"$    6@@@   G\r  -  AG\rA !  A :    ( "Aj6  A.:    E\r 	( " kAJ\r \n( ! 	 Aj6   6 @@   G\r   E\r  -  AG\r 	( "  kAJ\r \n( ! 	  Aj6    6 A !  \nA 6   Að j Aj  k" Au"AJ\r AÐ j,  !@@@  A{q" AØ F\r   Aà G\r@ ( " F\r A!  Aj,  ¾  ,  ¾ G\r  Aj6   :   AÐ :   ¾ "  ,  G\r    ¿ :   -  AG\r  A :    E\r  	( "  kAJ\r  \n( ! 	  Aj6    6   ( " Aj6    :  A !  AJ\r \n \n( Aj6 A ! A!  Aj$            ´# Aàk"$   6Ø  6Ü AÌj  Aàj AÜj AØjý  AÀj÷ !      A ½ "6¼  Aj6 A 6 A:  AÅ : A !@@@ AÜj AØjÞ \r @ (¼   jG\r   !   At        A ½ "j6¼ AÜjß  Aj Aj  A¼j (Ü (Ø AÌj Aj Aj Aj Aàjþ \r  Aq\rA ! (¼ k"AH\r@@ -  "AUj"	   A.F\rA! APjAÿqA\nI\r AF\r@ 	   - "A.F\rA! APjAÿqA	M\r@ AÌj E\r  - AqE\r  (" AjkAJ\r   Aj6  (6    (¼ × 9  AÌj Aj ( À @ AÜj AØjÞ E\r   ( Ar6  (Ü!   AÌj  Aàj$  A! AÜjá           Ë~# Aðk"$   6è  6ì AÜj  Aðj Aìj Aèjý  AÐj÷ !      A ½ "6Ì  A j6 A 6 A:  AÅ : A !@@@ Aìj AèjÞ \r @ (Ì   jG\r   !   At        A ½ "j6Ì Aìjß  Aj Aj  AÌj (ì (è AÜj A j Aj Aj Aðjþ \r  Aq\rA ! (Ì k"AH\r@@ -  "AUj"	   A.F\rA! APjAÿqA\nI\r AF\r@ 	   - "A.F\rA! APjAÿqA	M\r@ AÜj E\r  - AqE\r  (" A jkAJ\r   Aj6  (6    (Ì Ú  ) !\n  )7  \n7  AÜj A j ( À @ Aìj AèjÞ E\r   ( Ar6  (ì!   AÜj  Aðj$  A! Aìjá  # AÀk"$   6¸  6¼ AÄj÷ ! Aj Ó  AjÝ AÐ Aê  AÐj  Aj«  A¸j÷ !      A ½ "6´  Aj6 A 6@@ A¼j A¸jÞ \r@ (´   jG\r   !   At        A ½ "j6´ A¼jß A  A´j AjA   Aj Aj AÐjð \r A¼já    (´ k   !Ý !  6@  AÒ  AjÞ AF\r  A6 @ A¼j A¸jÞ E\r   ( Ar6  (¼!     AÀj$          ( (0  I# Ak"$          Aj  !  Aj$        ( (       ( (       ( (  \n   à     ,     kß "        Þ      ( (       ( (       ( (  \n   ã     (    kAuâ "        á ¶# A k"$   6@@  Aq\r         ( (  ! Aj Ó  Aj¬ ! Aj« @@ E\r  Aj ­  Aj ®   Aj 6@  Aj 6@ Aj Aj E\r  (! Aj  Aj ,  ! Ajµ  ¶  Aj  Aj·   A j$       ý       ý    j       F   (      ( Aj6   4# Ak"$  Aj ä ( ! Aj$     (         Þ# AÀ k"$   "AÊ q"AF! A3j!	  !\n@ AJ\r  \r  AÀ F\r  A-: 3 A4j!	 \n !\nAA\n ! AÀ F!@ \r  AÀ F\r  A H\r  AqE\r  	A+:   	Aj!	A  !@ E\r  AqE\r @ AÀ G\r  	A0:   	Aj!	 AG\r  	A0:   	AØ Aø  Aq:  	Aj!	 A(j 	 AÀ j \n  @@ AqAG\r @ 	 (("F\r 	 	,   :   	Aj!	  ((! A3j    !	 ((! Aj Ó  A3j 	  Aj Aj Aj Aj¡  Aj«   Aj ( (  ¢ !	 AÀ j$  	    A   kÏ@@@@@ A~jAw      ­      ®      ¯      ° @  ± "  kL\r   A=6   6   j"!@ Aj"   n" lk-  :    M! ! \r   A 6   6    A`j    AjAÿqAIÀi @  A°q"A G\r  @ AG\r @@  -  "AUj    Aj   kAH\r  A0G\r   - A rAø G\r   Aj!   «# Ak"$   ! Aj ¬ " @@ Aj¶ E\r      Ü      kj"6   6   !	@@  -  "\nAUj    \nÀÍ !\n  ( "Aj6   \n:    Aj!	@  	kAH\r  	-  A0G\r  	- A rAø G\r  A0Í !\n  ( "Aj6   \n:    	, Í !\n  ( "Aj6   \n:   	Aj!	 	 Þ A !\n  !A ! 	!@@  I\r   	  kj ( Þ  ( !@ Aj ½ -  E\r  \n Aj ½ ,  G\r   ( "\nAj6  \n :     Aj AjIj!A !\n  ,  Í !\r  ( "Aj6   \r:   Aj! \nAj!\n       kj  F6  Aj  Aj$ Î# Ak"$ A !@  E\r  Û !@  k"	AH\r     	¸  	G\r@   k"L\r    Aj  k" ± "	ú  ¸ ! 	   G\r@  k"AH\r     ¸  G\r A Ü   ! Aj$         ¤ ê~# Að k"$   "AÊ q"AF! AÐ j!	 ¥ !\n@ BU\r  \r  AÀ F\r  A-: P AÐ jAr!	 \n¦ !\nAA\n ! AÀ F!@ \r  AÀ F\r  B S\r  AqE\r  	A+:   	Aj!	A  !@ P\r  AqE\r @ AÀ G\r  	A0:   	Aj!	 AG\r  	A0:   	AØ Aø  Aq:  	Aj!	 AÈ j 	 Aè j \n § @@ AqAG\r @ 	 (H"F\r 	 	,   :   	Aj!	  (H! AÐ j    !	 (H! Aj Ó  AÐ j 	  Aj Aj Aj Aj¡  Aj«   Aj ( (  ¢ !	 Að j$  	    B   }×~@@@@@ A~jAw      Õ      Ö      ×      Ø @  Ù "  kL\r   A=6   6  ¬!  j"!@ Aj"   " ~}§-  :    Z! ! \r   A 6   6        © ÷# AÀ k"$ AAA\n  "AÊ q"AF AÀ F! A3j!	 ª !\n@ E\r  AqE\r @ AÀ G\r  A0: 3 A4j!	 AG\r  A0: 3 AØ Aø  Aq: 4 A5j!	 A(j 	 AÀ j \n  @@ AqAG\r @ 	 (("F\r 	 	,   :   	Aj!	  ((! A3j    !	 ((! Aj Ó  A3j 	  Aj Aj Aj Aj¡  Aj«   Aj ( (  ¢ !	 AÀ j$  	          ¬ ~# Að k"$ AAA\n  "AÊ q"AF AÀ F! AÐ j!	 ­ !\n@ P\r  AqE\r @ AÀ G\r  A0: P AÐ jAr!	 AG\r  A0: P AØ Aø  Aq: Q AÐ jAr!	 AÈ j 	 Aè j \n § @@ AqAG\r @ 	 (H"F\r 	 	,   :   	Aj!	  (H! AÐ j    !	 (H! Aj Ó  AÐ j 	  Aj Aj Aj Aj¡  Aj«   Aj ( (  ¢ !	 Að j$  	          A ¯ È# A k"$   9 B%7 AjAr   ° !  Að j6lÝ !@@ E\r   ± 6  Að jA  Aj A j Aj² ! Að jA  Aj Aj³ ! A 6  Aä jA  A j´ ! Að j!	@@ AH\r Ý !@@ E\r   ± 6  Aì j  Aj A j Ajµ ! Aì j  Aj Aj¶ ! AF\r  (l·  (l!	 	 	 j"\n   ! A 6  AjA  A j´ !	@@ (l" Að jG\r  A j! AtÐ "E\r 	 ·  (l! Aj Ó    \n  Aj Aj Aj¸  Aj«    ( (  ¢ ! 	¹  ¹  A j$  õ  ë@ AqE\r   A+:    Aj! @ AqE\r   A#:    Aj! @ Aq"AF\r   A®Ô ;    Aj!  Aq!@@ -  "E\r   :    Aj!  Aj! @@@ AF\r  AG\rAÆ Aæ  !AÅ Aå  !@ AG\r AÁ Aá  !AÇ Aç  !   :   AG   (L# Ak"$  ( !  + 9  6       å ! Aj$  ># Ak"$   + 9       å ! Aj$      6    ( 6  J# Ak"$  ( !  + 9  6      Ò ! Aj$  <# Ak"$   + 9      Ò ! Aj$  ,  ( !   6 @ E\r    (  ¢\n# Ak"$   ! Aj ¬ "	   6   !\n@@  -  "AUj    ÀÍ !  ( "Aj6   :    Aj!\n \n!@@  \nkAL\r  \n! \n-  A0G\r  \n! \n- A rAø G\r  A0Í !  ( "Aj6   :    \n, Í !  ( "Aj6   :   \nAj"\n!@  O\r ,  Ý à E\r Aj! @  O\r ,  Ý á E\r Aj! @@ Aj¶ E\r   \n  ( Ü   (   \nkj6  \n Þ A ! 	 !\rA ! \n!@@  I\r   \n  kj ( Þ @ Aj ½ ,  AH\r   Aj ½ ,  G\r   ( "Aj6   \r:     Aj AjIj!A !  ,  Í !  ( "Aj6   :   Aj! Aj! @@@@  I\r  ! Aj! ,  "A.G\r 	 !  ( "Aj6   :      ( Ü   (   kj"6       kj  F6  Aj  Aj$   Í !  ( "Aj6   :   !    A ·           AÏ » Ð# A°k"$   7¨  7  B%7 AjAr   ° !  Að j6lÝ !@@ E\r   ± 6  Að jA  Aj A j A j¼ ! Að jA  Aj A j½ ! A 6  Aä jA  A j´ !	 Að j!\n@@ AH\r Ý !@@ E\r   ± 6  Aì j  Aj A j A j¾ ! Aì j  Aj A j¿ ! AF\r 	 (l·  (l!\n \n \n j"   ! A 6  AjA  A j´ !\n@@ (l" Að jG\r  A j! AtÐ "E\r \n ·  (l! Aj Ó      Aj Aj Aj¸  Aj«    ( (  ¢ ! \n¹  	¹  A°j$  õ  _~# A k"$  ( ! ) ! Aj )7   7  6       å ! A j$  N~# Ak"$  ) !  )7  7       å ! Aj$  ]~# A k"$  ( ! ) ! Aj )7   7  6      Ò ! A j$  L~# Ak"$  ) !  )7  7      Ò ! Aj$  ?   "Aµû~qArÁ       © !  Á    (!   6 ¶# A k"$   6@@  Aq\r         ( (  ! Aj Ó  Ajã ! Aj« @@ E\r  Aj ä  Aj å   AjÃ 6@  AjÄ 6@ Aj AjÅ E\r  (! Aj  AjÆ ( ! Ajó  ô  AjÇ  Ajõ   A j$       È É      È   é AtjÉ    Ê  Ê F   (      ( Aj6   ! @   E\r   ¤   § 4# Ak"$  Aj å ( ! Aj$     (        Ì ä# Ak"$   "AÊ q"AF! Aj!	  !\n@ AJ\r  \r  AÀ F\r  A-:  Aj!	 \n !\nAA\n ! AÀ F!@ \r  AÀ F\r  A H\r  AqE\r  	A+:   	Aj!	A  !@ E\r  AqE\r @ AÀ G\r  	A0:   	Aj!	 AG\r  	A0:   	AØ Aø  Aq:  	Aj!	 Aø j 	 Aj \n  @@ AqAG\r @ 	 (x"F\r 	 	,   :   	Aj!	  (x! Aj    !	 (x! Aj Ó  Aj 	  Aj Aj Aj AjÍ  Aj«   Aj ( (  Î !	 Aj$  	´# Ak"$  Ý ! Aj ã " @@ Aj¶ E\r            kAtj"6   6   !	@@  -  "\nAUj    \nÀÏ !\n  ( "Aj6   \n6   Aj!	@  	kAH\r  	-  A0G\r  	- A rAø G\r  A0Ï !\n  ( "Aj6   \n6   	, Ï !\n  ( "Aj6   \n6  	Aj!	 	 Þ A !\n  !A ! 	!@@  I\r   	  kAtj ( â  ( !@ Aj ½ -  E\r  \n Aj ½ ,  G\r   ( "\nAj6  \n 6    Aj AjIj!A !\n  ,  Ï !\r  ( "Aj6   \r6  Aj! \nAj!\n       kAtj  F6  Aj  Aj$ ×# Ak"$ A !@  E\r  Û !@  kAu"	AH\r     	ö  	G\r@   kAu"L\r    Aj  k" È "	é  ö ! 	   G\r@  kAu"AH\r     ö  G\r A Ü   ! Aj$         Ð î~# Aðk"$   "AÊ q"AF! AÐj!	 ¥ !\n@ BU\r  \r  AÀ F\r  A-: Ð AÐjAr!	 \n¦ !\nAA\n ! AÀ F!@ \r  AÀ F\r  B S\r  AqE\r  	A+:   	Aj!	A  !@ P\r  AqE\r @ AÀ G\r  	A0:   	Aj!	 AG\r  	A0:   	AØ Aø  Aq:  	Aj!	 AÈj 	 Aèj \n § @@ AqAG\r @ 	 (È"F\r 	 	,   :   	Aj!	  (È! AÐj    !	 (È! Aj Ó  AÐj 	  Aj Aj Aj AjÍ  Aj«   Aj ( (  Î !	 Aðj$  	       Ò # Ak"$ AAA\n  "AÊ q"AF AÀ F! Aj!	 ª !\n@ E\r  AqE\r @ AÀ G\r  A0:  Aj!	 AG\r  A0:  AØ Aø  Aq:  Aj!	 Aø j 	 Aj \n  @@ AqAG\r @ 	 (x"F\r 	 	,   :   	Aj!	  (x! Aj    !	 (x! Aj Ó  Aj 	  Aj Aj Aj AjÍ  Aj«   Aj ( (  Î !	 Aj$  	       Ô ~# Aðk"$ AAA\n  "AÊ q"AF AÀ F! AÐj!	 ­ !\n@ P\r  AqE\r @ AÀ G\r  A0: Ð AÐjAr!	 AG\r  A0: Ð AØ Aø  Aq: Ñ AÐjAr!	 AÈj 	 Aèj \n § @@ AqAG\r @ 	 (È"F\r 	 	,   :   	Aj!	  (È! AÐj    !	 (È! Aj Ó  AÐj 	  Aj Aj Aj AjÍ  Aj«   Aj ( (  Î !	 Aðj$  	       A Ö Í# AÀk"$   9¸ B%7° A°jAr   ° !  Aj6Ý !@@ E\r   ± 6  AjA  A°j A j A¸j² ! AjA  A°j A¸j³ ! A 6  AjA  A j´ ! Aj!	@@ AH\r Ý !@@ E\r   ± 6  Aj  A°j A j A¸jµ ! Aj  A°j A¸j¶ ! AF\r  (·  (!	 	 	 j"\n   ! A 6  AjA  A j× !	@@ (" AjG\r  A j! AtÐ "E\r 	 Ø  (! Aj Ó    \n  Aj Aj AjÙ  Aj«    ( (  Î ! 	Ú  ¹  AÀj$  õ      6    ( 6  ,  ( !   6 @ E\r    (  ³\n# Ak"$  Ý ! Aj ã "	   6   !\n@@  -  "AUj    ÀÏ !  ( "Aj6   6   Aj!\n \n!@@  \nkAL\r  \n! \n-  A0G\r  \n! \n- A rAø G\r  A0Ï !  ( "Aj6   6   \n, Ï !  ( "Aj6   6  \nAj"\n!@  O\r ,  Ý à E\r Aj! @  O\r ,  Ý á E\r Aj! @@ Aj¶ E\r   \n  (    (   \nkAtj6  \n Þ A ! 	 !\rA ! \n!@@  I\r   \n  kAtj ( â @ Aj ½ ,  AH\r   Aj ½ ,  G\r   ( "Aj6   \r6    Aj AjIj!A !  ,  Ï !  ( "Aj6   6  Aj! Aj! @@@  O\r Aj!@ ,  "A.F\r   Ï !  ( "Aj6   6  ! 	 !  ( "Aj"6   6  ( ! !       (   kAtj"6       kAtj  F6  Aj  Aj$    A Ø           AÏ Ü Õ# AÐk"$   7È  7À B%7¸ A¸jAr   ° !  Aj6Ý !@@ E\r   ± 6  AjA  A¸j A j AÀj¼ ! AjA  A¸j AÀj½ ! A 6  AjA  A j´ !	 Aj!\n@@ AH\r Ý !@@ E\r   ± 6  Aj  A¸j A j AÀj¾ ! Aj  A¸j AÀj¿ ! AF\r 	 (·  (!\n \n \n j"   ! A 6  AjA  A j× !\n@@ (" AjG\r  A j! AtÐ "E\r \n Ø  (! Aj Ó      Aj Aj AjÙ  Aj«    ( (  Î ! \nÚ  	¹  AÐj$  õ  ?   "Aµû~qArÁ       Ò !  Á      ß     æ     Á     Ã     ã     é ±# Ak"$   6  6 Aj Ó  Aj ! Aj«  A 6 A !@@  F\r \r@ Aj Aj \r @@  ,  A å A%G\r  Aj" F\rA !	@@  ,  A å "AÅ F\r A!\n AÿqA0F\r  ! Aj"	 F\rA!\n  	,  A å ! !	    ( (     	  ( ($  6  \njAj!@ A ,   E\r @@ Aj" F\r A ,   \r @ Aj Aj \r A Aj  E\r Aj  @  Aj ´   ,  ´ G\r  Aj! Aj  A6  ( ! A6 @ Aj Aj E\r   ( Ar6  (! Aj$         ( ($   AP# Ak"$  B¥é©ÒÉÎÓ 7        Aj Ajä ! Aj$  G         Aj  ((  "     jä n# Ak"$   6 Aj Ó  Aj ! Aj«    Aj Aj   ê  (! Aj$  M @    Aj  ((   "   A¨j  A ¯   k" A§J\r    AmAo6 n# Ak"$   6 Aj Ó  Aj ! Aj«    Aj Aj   ì  (! Aj$  M @    Aj  ((  "   A j  A ¯   k" AJ\r    AmAo6 n# Ak"$   6 Aj Ó  Aj ! Aj«    Aj Aj   î  (! Aj$  F     Aï !@ -  Aq\r   AÐj Aìj  Aä I AÅ HAqj6 ü# Ak"$   6A !@@@   Aj E\r A! @ AÀ    " \r A!   A å !@@    APj!   Aj \r AH\r AÀ    " E\r Aj! A\nl  A å j!    Aj E\rA!   (   r6  Aj$  ½# Ak"$   6 A 6   Ó   !	 « @@@@@@@@@@@@@@@@@@@@@@@@@@@ A¿j9 \n 	\r   Aj Aj   	ê    Aj Aj   	ì   Aj  ((  !    (          jä 6   Aj Aj   	ñ  B¥Ú½©ÂìËù 7           Ajä 6 B¥²µ©Ò­Ëä 7           Ajä 6   Aj Aj   	ò    Aj Aj   	ó    Aj Aj   	ô    Aj Aj   	õ    Aj Aj   	ö    Aj   	÷ \r   Aj Aj   	ø  A ( ø 6  A ) ñ 7           Ajä 6 A -  :  A ( ü 6           Ajä 6\n    Aj   	ù 	 B¥é©ÒÉÎÓ 7           Ajä 6   Aj Aj   	ú          ( (  !  Aj  ((  !    (          jä 6   Aj Aj   	î    Aj Aj   	û  A%F\r  ( Ar6    Aj   	ü  (! Aj$  A     Aï ! ( !@ AjAK\r  Aq\r   6   Ar6 >     Aï ! ( !@ AJ\r  Aq\r   6   Ar6 A     Aï ! ( !@ AjAK\r  Aq\r   6   Ar6 ?     Aï ! ( !@ AíJ\r  Aq\r   6   Ar6 C     Aï ! ( !@ Aj"AK\r  Aq\r   6   Ar6 >     Aï ! ( !@ A;J\r  Aq\r   6   Ar6 |# Ak"$   6@@  Aj \r A   E\r   @  Aj E\r   ( Ar6  Aj$  @  Aj  ((  "  A   Aj kG\r   ( Ar6       Aj  A ¯ ! ( !@   G\r  AG\r  A 6 @   kAG\r  AJ\r   Aj6 >     Aï ! ( !@ A<J\r  Aq\r   6   Ar6 >     Aï ! ( !@ AJ\r  Aq\r   6   Ar6 ,     Aï !@ -  Aq\r   Aqj6 # Ak"$   6@@@  Aj E\r A!@   A å A%F\r A!   Aj E\rA!  (  r6  Aj$ ±# Ak"$   6  6 Aj Ó  AjÝ ! Aj«  A 6 A !@@  F\r \r@ Aj AjÞ \r @@  ( A þ A%G\r  Aj" F\rA !	@@  ( A þ "AÅ F\r A!\n AÿqA0F\r  ! Aj"	 F\rA!\n  	( A þ ! !	    ( (     	  ( ($  6  \njAj!@ A ( à E\r @@ Aj" F\r A ( à \r @ Aj AjÞ \r A Ajß à E\r Ajá  @  Ajß è   ( è G\r  Aj! Ajá  A6  ( ! A6 @ Aj AjÞ E\r   ( Ar6  (! Aj$         ( (4   Au# A k"$  A )¸ 7 A )° 7 A )¨ 7 A )  7          A jý ! A j$  J         Aj  ((  "    é Atjý      ! @   E\r   ×   í    \n   - Av   (   - Aÿ qn# Ak"$   6 Aj Ó  AjÝ ! Aj«    Aj Aj     (! Aj$  M @    Aj  ((   "   A¨j  A æ   k" A§J\r    AmAo6 n# Ak"$   6 Aj Ó  AjÝ ! Aj«    Aj Aj     (! Aj$  M @    Aj  ((  "   A j  A æ   k" AJ\r    AmAo6 n# Ak"$   6 Aj Ó  AjÝ ! Aj«    Aj Aj     (! Aj$  F     A !@ -  Aq\r   AÐj Aìj  Aä I AÅ HAqj6 ü# Ak"$   6A !@@@   AjÞ E\r A! @ AÀ   ß "à \r A!   A þ !@@  á  APj!   AjÞ \r AH\r AÀ   ß "à E\r Aj! A\nl  A þ j!    AjÞ E\rA!   (   r6  Aj$  »	# A0k"$   6, A 6   Ó  Ý !	 « @@@@@@@@@@@@@@@@@@@@@@@@@@@ A¿j9 \n 	\r   Aj A,j   	    Aj A,j   	   Aj  ((  !    (,         é Atjý 6,   Aj A,j   	  A )¨ 7 A )  7 A ) 7 A ) 7           A jý 6, A )È 7 A )À 7 A )¸ 7 A )° 7           A jý 6,   Aj A,j   	    Aj A,j   	    Aj A,j   	    Aj A,j   	    Aj A,j   	    A,j   	 \r   Aj A,j   	  AÐ A,ü\n            A,jý 6, A ( 6 A ) 7 A ) 7           Ajý 6,\n    A,j   	 	 A )¸ 7 A )° 7 A )¨ 7 A )  7           A jý 6,   Aj A,j   	          ( (  !  Aj  ((  !    (,         é Atjý 6,   Aj A,j   	    Aj A,j   	  A%F\r  ( Ar6    A,j   	  (,! A0j$  A     A ! ( !@ AjAK\r  Aq\r   6   Ar6 >     A ! ( !@ AJ\r  Aq\r   6   Ar6 A     A ! ( !@ AjAK\r  Aq\r   6   Ar6 ?     A ! ( !@ AíJ\r  Aq\r   6   Ar6 C     A ! ( !@ Aj"AK\r  Aq\r   6   Ar6 >     A ! ( !@ A;J\r  Aq\r   6   Ar6 |# Ak"$   6@@  AjÞ \r A ß à E\r á  @  AjÞ E\r   ( Ar6  Aj$  @  Aj  ((  " é A   Ajé kG\r   ( Ar6       Aj  A æ ! ( !@   G\r  AG\r  A 6 @   kAG\r  AJ\r   Aj6 >     A ! ( !@ A<J\r  Aq\r   6   Ar6 >     A ! ( !@ AJ\r  Aq\r   6   Ar6 ,     A !@ -  Aq\r   Aqj6 # Ak"$   6@@@  AjÞ E\r A!@  ß A þ A%F\r A! á  AjÞ E\rA!  (  r6  Aj$ ^# Ak"$   Aô j6  Aj Aj Aj     Aj (  !  Aj$   }# Ak"$  A :   :   : \r A%: @ E\r  A\rj Aj      (    Aj   ( ¡ j6  Aj$ :# Ak"$  Aj    ¢  (! Aj$    -  !   -  :    :      k              ï ^# A k"$   A j6  Aj Aj Aj   ¤  Aj ( ¥ !  A j$   # Ak"$   Aj6   A j Aj     B 7  A j6@  Aj  ( ¦  Aj  ( § " AG\r A ü      Atj6  Aj$ :# Ak"$  Aj    ¨  (! Aj$  \n    kAu       ¢       ü  ª  «  Aÿ  ª    ÷    ÷    ÷    AA-±    ø "       A    A 6     A 6   ª  ª    ÷    ÷    ÷    AA-±  A    A 6     A 6   ¿  À  Aÿÿÿÿ ¿    ÷    Ä $   A 6  B 7   § " A Å   2        ª AtjAj    AtjAjÒ    Ä    AA-È    § "       A    A 6     A 6   ¿  ¿    ÷    Ä    Ä    AA-È  A    A 6     A 6  ^  Ö @  \r    (6   ) 7      Å      ×           ( ê# Ak"$   6  6 A 6 Aj A j Aj´ ! Aj Ó  Aj ! A : @ Aj   Aj    Aj   Aj AjÚ E\r  A (  6  A )  7  Aj Aj Aö jÜ  A 6 AjA  Aj´ ! Aj!@@ ( Û kAã H\r   ( Û kAjÐ ·  Û E\r Û ! !@ - AG\r  A-:   Aj! Û !@@@  (I\r  A :    6  A  ç AG\r ¹   Aj Aö j Aö jÜ  ß  Aö jkj-  :   Aj! Aj! Aå ü  õ  @ Aj Aj E\r   ( Ar6  (! Aj«  ¹  Aj$   Ä# Ak"$   \n6  6@@   Aj E\r   ( Ar6 A !  A 6L  Aè j Að j AÌ jÝ "Þ "\n6d  \nAj6` AÌ j÷ !\r AÀ j÷ ! A4j÷ ! A(j÷ ! Aj÷ !   AÜ j AÛ j AÚ j \r    Ajß  	 Û 6  Aq!A !A !@ !@@@@ AF\r    Aj \r A !\n !@@@@@@ AÜ j j"-   	 AF\r@ A    E\r  Aj  A à   Ajá    ( Ar6 A !  AF\r@   Aj \r A    E\r Aj  A à   Ajá   @  E\r    Aÿq A ½ -  G\r     A :      AK!@  E\r    Aÿq A ½ -  G\r     A:      AK!@  E\r   E\r   ( Ar6 A ! @  \r   E\r   E:  @ \r  AI\r  \r A ! AF - _AÿqA GqE\r   6 Aj Ajâ !\n@ E\r  Aj-  AK\r @@   6 \n Ajã \r A \nä ,   E\r \nå     6@ \n Ajæ "  K\r    6 Aj ç     è \r   6 \n Aj Ajâ ( 6   \n( 6@@   6 Aj Ajã \r   Aj \r   Aÿq Ajä -  G\r    Ajå   E\r   6 Aj Ajã \r  ( Ar6 A ! @@   Aj \r@@ AÀ    " E\r @ 	( " (G\r   	 Ajé  	( ! 	 Aj6   :   \nAj!\n \r E\r \nE\r Aÿq - ZAÿqG\r@ (d" (`G\r   Aä j Aà jê  (d!  Aj6d  \n6 A !\n    @ Þ  (d"F\r  \nE\r @  (`G\r   Aä j Aà jê  (d!  Aj6d  \n6 @ (AH\r @@   Aj \r    Aÿq - [F\r  ( Ar6 A ! @    (AH\r@@   Aj \r  AÀ     \r  ( Ar6 A ! @ 	(  (G\r   	 Ajé    !\n 	 	( "Aj6   \n:    (Aj6  ! 	(  Û G\r  ( Ar6 A ! @ E\r A!\n@ \n  O\r@@   Aj \r    Aÿq  \nµ -  F\r  ( Ar6 A !     \nAj!\n A!  Þ  (dF\r A !  A 6 \r Þ  (d AjÀ @ (E\r   ( Ar6 A!          \r  ë  ! Aj!  Aj$      (    A\nj    6    ( 6     ( ò# Ak"\n$ @@  E\r  \nAj ó "ô   \n(6   \nAj õ   \nAjû  \nAj  \nAj ö   \nAjû  \nAj   ÷ :    ø :   \nAj ù   \nAjû  \nAj  \nAj ú   \nAjû  \nAj  û ! \nAj ü "ý   \n(6   \nAj þ   \nAjû  \nAj  \nAj ÿ   \nAjû  \nAj    :     :   \nAj    \nAjû  \nAj  \nAj    \nAjû  \nAj   ! 	 6  \nAj$     (  À (     ,      ( 6         F   (      ( Aj6         k   A  k       Á# Ak"$    ( !@@ (   Û k"¼ AvO\r  At!¼ ! A AK! ( !  Û !@@ A G\r A !	  Û !	@ 	 Ó "	E\r @@ A F\r      Û ! E\r  	  ü\n   A 6   Aj 	 Aj´ "  ¹    Û   kj6    Û  j6  Aj$ õ  Á# Ak"$    ( !@@ (   Þ k"¼ AvO\r  At!¼ ! A ! ( !  Þ !@@ A G\r A !	  Þ !	@ 	 Ó "	E\r @@ A F\r      Þ ! E\r  	  ü\n   A 6   Aj 	 AjÝ "  ë    Þ   kj6    Þ  A|qj6  Aj$ õ     A    ð# Ak"$   6  6 A 6 Aj A j Aj´ ! Aj Ó  Aj ! A : @ Aj   Aj    Aj   Aj AjÚ E\r  í @ - AG\r   A-Í   A0Í ! Û ! ("Aj! Aÿq!@@  O\r -   G\r Aj!    î @ Aj Aj E\r   ( Ar6  (! Aj«  ¹  Aj$  ¡# Ak"$ @@   E\r    !  ¢ ! A :   Aj¨   A ¸    !  £ ! A :   Aj¨   A §    ©  Aj$ ø# Ak"$    !   !@  ® "E\r @   ï \r @  k O\r      k j  A A ð    ñ     ý  jþ ¹ ! A :   Aj¨     jò         "       Aj$   &          jAj  s# Ak"$     Aj Aj   (          Ù     k j¸  Aj  Aj$ 5         jAj      j jAj % @   E\r    ¸    §    A° °      ( (,       ( (        ( (       ( (       ( (       ( (       ( (       ( ($     A¨ °      ( (,       ( (        ( (       ( (       ( (       ( (       ( (       ( ($      6   :       ( G# Ak"$         Aj ! Aj$  A# Ak"$    ( 6 Aj   (!  Aj$      Aj  ( !  A 6  $     ·     ( 6     Aj  ( !  A 6  $          ( 6      þ ,  ( !   6 @ E\r    (  ð# Aðk"$   6è  6ì A 6 AÈj AÐj Aj× ! AÀj Ó  AÀjÝ ! A : ¿@ Aìj   AÀj    A¿j   AÄj Aàj E\r  A (  6 · A )  7°  A°j Aºj Aj  A 6 AjA  Aj´ ! Aj!@@ (Ä  kAH\r   (Ä  kAuAjÐ ·  Û E\r Û ! !@ - ¿AG\r  A-:   Aj!  !@@@  (ÄI\r  A :    6  A  ç AG\r ¹   A°j Aj Aj    AjkAuj-  :   Aj! Aj! Aå ü  õ  @ Aìj AèjÞ E\r   ( Ar6  (ì! AÀj«  Ú  Aðj$  §# Ak"$   \n6  6@@   AjÞ E\r   ( Ar6 A !  A 6H  Aè j Að j AÈ jÝ "Þ "\n6d  \nAj6` AÈ j÷ !\r A<jÄ ! A0jÄ ! A$jÄ ! AjÄ !   AÜ j AØ j AÔ j \r    Aj  	  6  Aq!A !A !@ !@@@@ AF\r    AjÞ \r A !\n !@@@@@@ AÜ j j"-   	 AF\r@ A  ß à E\r  Aj  A    Aj    ( Ar6 A !  AF\r@   AjÞ \r A  ß à E\r Aj  A    Aj   @ é E\r   ß  A  ( G\r   á  A :     é AK!@ é E\r   ß  A  ( G\r   á  A:     é AK!@ é E\r  é E\r   ( Ar6 A ! @ é \r  é E\r  é E:  @ \r  AI\r  \r A ! AF - _AÿqA GqE\r  Ã 6 Aj Aj !\n@ E\r  Aj-  AK\r @@  Ä 6 \n Aj \r A \n ( à E\r \n    Ã 6@ \n Aj " é K\r   Ä 6 Aj   Ä  Ã  \r  Ã 6 \n Aj Aj ( 6   \n( 6@@  Ä 6 Aj Aj \r   AjÞ \r  ß  Aj ( G\r  á  Aj   E\r  Ä 6 Aj Aj \r  ( Ar6 A ! @@   AjÞ \r@@ AÀ   ß "à E\r @ 	( " (G\r   	 Aj   	( ! 	 Aj6   6  \nAj!\n \r E\r \nE\r  (TG\r@ (d" (`G\r   Aä j Aà jê  (d!  Aj6d  \n6 A !\n  á  @ Þ  (d"F\r  \nE\r @  (`G\r   Aä j Aà jê  (d!  Aj6d  \n6 @ (AH\r @@   AjÞ \r   ß  (XF\r  ( Ar6 A ! @  á  (AH\r@@   AjÞ \r  AÀ   ß à \r  ( Ar6 A ! @ 	(  (G\r   	 Aj    ß !\n 	 	( "Aj6   \n6   (Aj6  ! 	(   G\r  ( Ar6 A ! @ E\r A!\n@ \n é O\r@@   AjÞ \r   ß   \nê ( F\r  ( Ar6 A !   á  \nAj!\n A!  Þ  (dF\r A !  A 6 \r Þ  (d AjÀ @ (E\r   ( Ar6 A!          \r  ë  ! Aj!  Aj$      (    A(jò# Ak"\n$ @@  E\r  \nAj ³ "´   \n(6   \nAj µ   \nAj¶  \nAj  \nAj ·   \nAj¶  \nAj   ¸ 6   ¹ 6  \nAj º   \nAjû  \nAj  \nAj »   \nAj¶  \nAj  ¼ ! \nAj ½ "¾   \n(6   \nAj ¿   \nAj¶  \nAj  \nAj À   \nAj¶  \nAj   Á 6   Â 6  \nAj Ã   \nAjû  \nAj  \nAj Ä   \nAj¶  \nAj  Å ! 	 6  \nAj$     ( è  ( Æ    (    È  Atj    ( 6      Ç  Ê F   (      ( Aj6      Ç  Ê kAu   A  kÉ      È Á# Ak"$   Ê ( !@@ (    k"¼ AvO\r  At!¼ ! A ! ( !   !@@ A G\r A !	   !	@ 	 Ó "	E\r @@ A F\r   Ë    ! E\r  	  ü\n   A 6   Aj 	 Aj× "Ì  Ú       kj6      A|qj6  Aj$ õ  è# AÀk"$   6¸  6¼ A 6 Aj A j Aj× ! Aj Ó  AjÝ ! A : @ A¼j   Aj    Aj   Aj A°j E\r  ¢ @ - AG\r   A-Ï   A0Ï !  ! ("A|j!@@  O\r (  G\r Aj!    £ @ A¼j A¸jÞ E\r   ( Ar6  (¼! Aj«  Ú  AÀj$  ¡# Ak"$ @@   E\r    !  ¤ ! A 6  Aj¥   A ¦    !  § ! A 6  Aj¥   A ¨    ©  Aj$ þ# Ak"$   é !  ª !@  « "E\r @   ¬ \r @  k O\r      k j  A A ­    ®     È  Atj¯ ° ! A 6  Aj¥     j±    Aj    ² "  é     Aj$      (     ( 6 	    6\n   Ï \r    Aÿ q: 2       AtjAj     é AtjAjÒ %A!@   E\r   Ö Aj!      )         é AtjAj  s# Ak"$   Ú  Aj Aj   (               k j¦  Aj  Aj$ >        é AtjAj     é Atj AtjAjÒ    "    ¯    k" AuÇ    j% @   E\r    ¦    ¨            AÀ °      ( (,       ( (       Í        ( (       ( (       ( (       ( (       ( (       ( ($     A¸ °      ( (,       ( (        ( (       ( (       ( (       ( (       ( (       ( ($      6   6      ( G# Ak"$         Aj ! Aj$  A# Ak"$    ( 6 Aj ¥  (!  Aj$      Aj  ( !  A 6  $    Ë Ø    Ê ( 6  ö# Ak"$   Ú @   E\r     ¤   Ö Û  é !  !   ¦    (6   ) 7  A ¨  § ! A 6  Aj¥ @@   F"\r  \r   ©  A Å    !@ \r  \r      Å  Aj$ # AÀk"$   7¸  7°  7   7  AÀj6¼ AÀjAä A   ! A 6ÐA !	 AÈjA  AÐj´ !\n A 6Ð AÀjA  AÐj´ ! AÐj!@@ Aä I\r  A¼jÝ A  A°j¿ "AF\r \n (¼·   Ð ·  A Ï \r Û ! A¼j Ó  A¼j "\r (¼"  j Ü @ AH\r  (¼-  A-F!	  	 A¼j A¸j A·j A¶j A¨j÷ " Aj÷ " Aj÷ " AjÐ  A 6  AjA  A j´ !@@  ("L\r     kAtj  j (jAj!    j (jAj! A j!@ Aå I\r   Ð ·  Û "E\r  Aj Aj     j \r 	 A¸j , · , ¶    (Ñ    ( (  ¢ ! ¹        A¼j«  ¹  \n¹  AÀj$  õ  \r   Ó As¾# Ak"\n$ @@  E\r  ó !@@ E\r  \nAj ô   \n(6   \nAj õ   \nAjû  \nAj  \nAj Ô   \n(6   \nAj ö   \nAjû  \nAj   ÷ :    ø :   \nAj ù   \nAjû  \nAj  \nAj ú   \nAjû  \nAj  û ! ü !@@ E\r  \nAj ý   \n(6   \nAj þ   \nAjû  \nAj  \nAj Õ   \n(6   \nAj ÿ   \nAjû  \nAj    :     :   \nAj    \nAjû  \nAj  \nAj    \nAjû  \nAj   ! 	 6  \nAj$ î\n# Ak"$    6  Aq!A !@@ AG\r @ \r AM\r   \rÖ 6  AjA×  \rØ  ( Ù 6 @ A°q"AF\r @ A G\r  ( !    6  Aj$ @@@@@@  j-     ( 6   ( 6  A Í !  ( "Aj6   :   \r¶ \r \rA µ -  !  ( "Aj6   :   ¶ ! E\r \r  Ö  Ø  ( Ù 6  ( !  j"!@@  O\r AÀ  ,   E\r Aj!  !@ AH\r @@  M\r A F\r Aj! Aj"-  !  ( "Aj6   :   @@ \r A ! A0Í !@@  ( "Aj6  AH\r  :   Aj!   	:  @@  G\r  A0Í !  ( "Aj6   :  @@ ¶ E\r Ú ! A µ ,  !A !A !@  F\r@@  F\r  !  ( "Aj6   \n:  A !@ Aj"  I\r  !@  µ -  ª AÿqG\r Ú !  µ ,  ! Aj"-  !  ( "Aj6   :   Aj!   ( Þ  Aj! \\# Ak"$   6  6 Aj Ajþ !    ( ! ÿ  Aj$  \n   ( A G     ( ((       ( ((        ì A# Ak"$    ( 6 Aj î  (!  Aj$            jì :# Ak"$  Aj    ë  (! Aj$   í    (  (!   6 # A°k"$  A¬j Ó  A¬j !A !@  E\r  A µ -   A-Í AÿqF!   A¬j A¨j A§j A¦j Aj÷ "	 Aj÷ "\n Aj÷ " Aü jÐ  A 6 AjA  Aj´ !@@   (|L\r   ! (|!\r    \rkAtj \n j (|jAj!\r   \n j (|jAj!\r Aj!@ \rAå I\r   \rÐ ·  Û "\r õ    Aj         j   A¨j , § , ¦ 	 \n  (|Ñ    ( (   ¢ ! ¹    \n  	  A¬j«  A°j$  # A k"$   7  7  7   7  A j6 A jAä A   ! A 6A !	 AøjA  Aj´ !\n A 6 AðjA  Aj× ! Aj!@@ Aä I\r  AjÝ A  Aj¿ "AF\r \n (·   AtÐ Ø  A ß \r  ! Aìj Ó  AìjÝ "\r ("  j  @ AH\r  (-  A-F!	  	 Aìj Aèj Aäj Aàj AÔj÷ " AÈjÄ " A¼jÄ " A¸jà  A 6  AjA  A j× !@@  (¸"L\r  é   kAtj é j (¸jAj! é  é j (¸jAj! A j!@ Aå I\r   AtÐ Ø   "E\r  Aj Aj     Atj \r 	 Aèj (ä (à    (¸á    ( (  Î ! Ú        Aìj«  Ú  \n¹  A j$  õ  \r   â As¾# Ak"\n$ @@  E\r  ³ !@@ E\r  \nAj ´   \n(6   \nAj µ   \nAj¶  \nAj  \nAj ã   \n(6   \nAj ·   \nAj¶  \nAj   ¸ 6   ¹ 6  \nAj º   \nAjû  \nAj  \nAj »   \nAj¶  \nAj  ¼ ! ½ !@@ E\r  \nAj ¾   \n(6   \nAj ¿   \nAj¶  \nAj  \nAj ä   \n(6   \nAj À   \nAj¶  \nAj   Á 6   Â 6  \nAj Ã   \nAjû  \nAj  \nAj Ä   \nAj¶  \nAj  Å ! 	 6  \nAj$ \n# Ak"$    6 AA  ! Aq!A !@@ AG\r @ \ré AM\r   \rå 6  AjAæ  \rç  ( è 6 @ A°q"AF\r @ A G\r  ( !    6  Aj$ @@@@@@  j-     ( 6   ( 6  A Ï !  ( "Aj6   6  \rë \r \rA ê ( !  ( "Aj6   6  ë ! E\r \r  å  ç  ( è 6  ( !  j"!@@  O\r AÀ  ( à E\r Aj! @ AH\r  ( ! !@@  M\r A F\r Aj! A|j"( !  Aj"6   6  ! @@ \r A ! A0Ï ! ( !@@ AH\r  Aj"6   6  Aj! !   ( "Aj6   	6 @@  G\r  A0Ï !  ( "Aj6   6 @@ ¶ E\r Ú ! A µ ,  !A !A !@  F\r@@  F\r  !  ( "Aj6   \n6 A !@ Aj"  I\r  !@  µ -  ª AÿqG\r Ú !  µ ,  ! A|j"( !  ( "Aj6   6  Aj!   ( â  Aj! \n   ( A G     ( ((       ( ((        ð A# Ak"$    ( 6 Aj ñ  (!  Aj$           é Atjð :# Ak"$  Aj    ï  (! Aj$     È ¯ £# Aàk"$  AÜj Ó  AÜjÝ !A !@ é E\r  A ê (  A-Ï F!   AÜj AØj AÔj AÐj AÄj÷ "	 A¸jÄ "\n A¬jÄ " A¨jà  A 6 AjA  Aj× !@@ é  (¨L\r  é ! (¨!\r é   \rkAtj \né j (¨jAj!\r é  \né j (¨jAj!\r Aj!@ \rAå I\r   \rAtÐ Ø   "\r õ    Aj        é Atj   AØj (Ô (Ð 	 \n  (¨á    ( (   Î ! Ú    \n  	  AÜj«  Aàj$        ¨ 4# Ak"$  Aj » ( ! Aj$   A     (  j6         ¼ 4# Ak"$  Aj Ï ( ! Aj$       (  Atj6    A\r    õ   A\r    Õ  1   A¡ 6 @  (Ý F\r   (        ú "AÈ 6  AjAû !  AjAî Ð   ü ý  A¢ þ ÿ  A¢    A¢    A¬¢    A´¢    A¼¢    AÈ¢    AÐ¢    AØ¢    Aà¢    Aè¢    A£    A£    A¤£    A¬£    A´£    A¼£    AÄ£   ¡  AÌ£ ¢ £  AÔ£ ¤ ¥  AÜ£ ¦ §  Aä£ ¨ ©  Aì£ ª «  Aô£ ¬ ­  Aü£ ® ¯  A¤ ° ±  A¤ ² ³  A ¤ ´ µ  A¬¤ ¶ ·  A´¤ ¸      Aj¹ "A¤ 6  ~# Ak"$   A 6  B 7   Ajº  Aj Aj  » ( ¼ @ E\r    ½    ¾  Aj¿  Aj$   %  À !    ( Á    Â  A¢ AÅ     AØ Ã Ä  A¢ AÆ     Aà Ã Ä  A¢ A A AÇ     A¸ Ã Ä  A¬¢ AÈ     A° Ã Ä  A´¢ AÉ     AÀ Ã Ä  A¼¢ AÊ     AÈ Ã Ä  AÈ¢ AË     AÐ Ã Ä  AÐ¢ AÌ     Aà Ã Ä  AØ¢ AÍ     AØ Ã Ä  Aà¢ AÎ     Aè Ã Ä  Aè¢ AÏ     Að Ã Ä  A£ AÐ     Aø Ã Ä  A£ AÑ     Aè Ã Ä  A¤£ AÒ     Að Ã Ä  A¬£ AÓ     Aø Ã Ä  A´£ AÔ     A Ã Ä  A¼£ AÕ     A¨ Ã Ä  AÄ£ AÖ     A° Ã Ä  AÌ£ A×     A¸ Ã Ä  AÔ£ AØ     AÀ Ã Ä  AÜ£ AÙ     AÈ Ã Ä  Aä£ AÚ     AÐ Ã Ä  Aì£ AÛ     AØ Ã Ä  Aô£ AÜ     Aà Ã Ä  Aü£ AÝ     A Ã Ä  A¤ AÞ     A Ã Ä  A¤ Aß     A Ã Ä  A ¤ Aà     A  Ã Ä  A¬¤ Aá     Aè Ã Ä  A´¤ Aâ     Að Ã Ä     6  AÀÕ Aj6      A : x      6   \r    Ð v# Ak"$ @   Ñ M\r Ò   Aj  Aj Ó    ("6   6     (Atj6  A Ô  Aj$ y# Ak"$   Aj! Aj   Õ "(!  (!@@   G\r  Ö  Aj$    × Ø    Aj" 6 	   A:     (  ( kAu=  Aj!  (!@@  F\r  A|j"× é     6,     Û  Atj  Û   À AtjÝ @# Ak"$    6   Aj   (!  Aj$   Aj¢# Ak"$  å  Aj ë !@   Aj"À I\r   Ají @  ä ( E\r   ä ( î  ï !   ä   6  ì  Aj$     ú "Aè¬ 6      ú "A­ 6  ?    ú  " :   6 AÜ 6 @ \r  A 6     ú  "AÈ¤ 6      ú ° "Aà¥ 6  *    ú ° "A¡ 6  Ý 6     ú ° "Aô¦ 6      ú ° "AÜ¨ 6      ú ° "Aè§ 6      ú ° "AÐ© 6  .    ú "A®Ø ; AÈ¡ 6  Aj÷  1    ú "B®À7 Að¡ 6  Aj÷      ú "A¨­ 6      ú "A ¯ 6      ú "Aô° 6      ú "Aà² 6      ú  "AÄº 6      ú  "AØ» 6      ú  "AÌ¼ 6      ú  "AÀ½ 6      ú  "A´¾ 6      ú  "AÜ¿ 6      ú  "AÁ 6      ú  "A¬Â 6  1    ú "Aj !  A¨´ 6   AØ´ 6  1    ú "Aj !  A´¶ 6   Aä¶ 6  %    ú "Aj  A¤¸ 6  %    ú "Aj  AÄ¹ 6      ú  "AÔÃ 6      ú  "AÌÄ 6  k# Ak" $ @A -   \r   æ 6A   Aj  Ajç A A:   A è !  Aj$  \r   (  Atj   Ajé I# Ak" $   A6A   Ajú A û !  Aj$      ( ü        ( Aj"6  ( @   ø \r     Aj ù (     6      ð   A@   À "M\r     kö @  O\r     (  Atj÷ 3@  Ajó "AG\r     ( (   AF  ( !  A 6  "  ( !  A 6 @ E\r  ñ {  AÈ 6   Aj!A !@@  À O\r@  ä ( E\r   ä ( î  Aj!   Aj  ò    5# Ak"$  Aj  » ô  Aj$       ( Aj"6  D@  ( "( E\r  ü   ( ì   ( " Aj  (   Ü í    ñ Aí # A k"$ @@  (  (kAu I\r    ¾  Aj    À  jë   À   Ajò " ó    ô  õ  A j$ "  À !   Á    Â 1A !@   Aj" À O\r    ù ( A G! \r   (  Atj    ( ù        6   : @A - ¨ \r A¤ ã þ A A: ¨ A¤ ÿ             ( "6      @  A û F\r   å  @  A û F\r   î   ý ( "6     V# Ak"$ @   AF\r    Aj Aj   A ñ  Aj$     Aí      ( (     (          6   \n    \n   ø     Aí /A !@  E\r  AtA j(  qA G! S@@  F\rA !@ (  E\r  ( AtA j( !  6  Aj! Aj!  B @@  F\r@ (  E\r  ( AtA j(  q\r Aj!  @ @@  F\r (  E\r ( AtA j(  qE\r Aj!  \n        Aß q  AjAfI* @@  F\r  (  6  Aj!  \n        A r  A¥jAfI* @@  F\r  (  6  Aj!    + @@  F\r  ,  6  Aj! Aj!       ÀF@@  F\r !@ (  E\r  ( !  :   Aj! Aj!     7  AÜ 6 @  ("E\r   - AqE\r  î        Aí \n        Aß q  AjAÿqAæI* @@  F\r  ,   :   Aj!  \n  ¢      A r  A¥jAÿqAæI* @@  F\r  ,  ¢ :   Aj!    + @@  F\r  -  :   Aj! Aj!       F@@  F\r !@ ,   E\r  -  !  :   Aj! Aj!      Aí    6   6 A   6   6 A   6 A A AH# Ak"$   6   k6 Aj Aj ( ! Aj$   A      ø Aí þ# Ak"$  !	@@@ 	 G\r  !	 	( E\r 	Aj!	   6   6 @@@@@  F\r   F\r   ) 7A!\n@@@@   	 kAu  k   (³ "Aj   6 @  ( F\r  (  Aj  (´ "	AF\r  (  	j"6  Aj!   (  j"6   F\r@ 	 G\r  ( ! !	 AjA    (´ "	AF\r Aj!@ 	  ( kM\r A!\n@@ 	E\r -  !  ( "\nAj6  \n :   	Aj!	 Aj!   ( Aj"6  !	@@ 	 G\r  !	 	( E\r 	Aj!	   6  ( !  G!\n ( ! A!\n Aj$  \n        µ       ¶ V# Ak"$   6 Aj Ajþ !       ! ÿ  Aj$  R# Ak"$   6 Aj Ajþ !    Ç ! ÿ  Aj$  º# Ak"$  !	@@@ 	 G\r  !	 	-  E\r 	Aj!	   6   6 @@@  F\r   F\r   ) 7@@@@@   	 k  kAu   (¸ "\nAG\r @  6   ( F\rA!@@@   	 k Aj  (¹ "Aj   6  !  j! ( Aj!   (  \nAtj"6   F\r ( ! 	 F\r  A   (¹ E\rA!	  ( Aj"6   ( Aj"6  !	@ 	 F\r 	-  E\r 	Aj!	   6 A!	 ( !  G!	 Aj$  	 !	         º        » V# Ak"$   6 Aj Ajþ !       ! ÿ  Aj$  T# Ak"$   6 Aj Ajþ !     é ! ÿ  Aj$  ¨# Ak"$   6 A!@ AjA    (´ "AjAI\r A! Aj"  ( kK\r  Aj!@@ \r A ! -  !   ( "Aj6    :   Aj! Aj!  Aj$  6 @A A A  (¾ E\r A@  (" \r A  ¿ AF      À \n   Á R# Ak"$   6 Aj Ajþ !    è ! ÿ  Aj$  L# Ak"$    6 Aj Ajþ !  !  ÿ  Aj$   A fA !A !@@  O\r  F\rA!@@   k   (Ä "Aj  ! Aj!  j!  j!        Å R# Ak"$   6 Aj Ajþ !     ! ÿ  Aj$   @  (" \r A  ¿     Aí W# Ak"$    Aj   AjAÿÿÃ A É !  (6   (6  Aj$     6   6 @@ AqE\r   kAH\r  Aj6  Aï:    ( "Aj6  A»:    ( "Aj6  A¿:   ( ! @@@   I\r A !A!   / "I\r@@@ Aÿ K\r A!  ( " kAH\r   Aj6    :  @ AÿK\r   ( " kAH\r   Aj6    AvAÀr:    ( " Aj6    A?qAr:  @ Aÿ¯K\r   ( " kAH\r   Aj6    AvAàr:    ( " Aj6    AvA?qAr:    ( " Aj6    A?qAr:  @ Aÿ·K\r A!   kAH\r  /"AøqA¸G\r  ( "	kAH\r AÀq"A\nt A\ntAøqr AÿqrAj K\r   Aj6   	Aj6  	 AvAj" AvAðr:    ( "Aj6    AtA0q AvAqrAr:    ( " Aj6    AvAq AtA0qrAr:    ( "Aj6   A?qAr:   AÀI\r  ( " kAH\r   Aj6    AvAàr:    ( " Aj6    AvA¿q:    ( " Aj6    A?qAr:    ( Aj" 6 A AW# Ak"$    Aj   AjAÿÿÃ A Ë !  (6   (6  Aj$  Ü   6   6 @   kAH\r  AqE\r   -  AïG\r   - A»G\r   - A¿G\r    Aj" 6  ( !@@@@   O\r  O\rA!   -  "I\r@@ ÀA H\r   ; A! AÂI\r@ AßK\r @   kAN\r A  - "	AÀqAG\rA! 	A?q AtAÀqr" K\r  ; A!@ AïK\r A!   k"\nAH\r  , !	@@@ AíF\r  AàG\r 	A`qA G\r 	A N\r 	A¿J\r \nAF\r  - "\nAÀqAG\rA! \nA?q 	A?qAt Atrr"Aÿÿq K\r  ; A! AôK\rA!   k"	AH\r  - "\nÀ!@@@@ A~j  Að jAÿqA0O\r AN\r A¿J\r 	AF\r  - "AÀqAG\r 	AF\r  - "	AÀqAG\r  kAH\rA! 	A?q"	 At"AÀq \nAtAàq Aq"\rAtrrr K\r  	 AÀqrA¸r;A!  \rAt \nAt"AÀqr A<qr AvAqrAÀÿ jA°r;  Aj!    j" 6   Aj"6     I! A   6 A A  A     AÿÿÃ A Ð ±  !@   kAH\r   ! AqE\r   !  -  AïG\r   !  - A»G\r   AA   - A¿Fj!A !@@  O\r  M\r  -  "I\r@@ ÀA H\r  Aj! AÂI\r@ AßK\r   kAH\r - "AÀqAG\r A?q AtAÀqr K\r Aj!@ AïK\r   kAH\r - ! , !@@@ AíF\r  AàG\r A`qA F\r A N\r A¿J\r AÀqAG\r A?qAt AtAàqr A?qr K\r Aj! AôK\r  kAH\r  kAI\r - !	 - ! , !@@@@ A~j  Að jAÿqA0O\r AN\r A¿J\r AÀqAG\r 	AÀqAG\r A?qAt AtAð qr AtAÀqr 	A?qr K\r Aj! Aj! Aj!    k A    Aí W# Ak"$    Aj   AjAÿÿÃ A É !  (6   (6  Aj$  W# Ak"$    Aj   AjAÿÿÃ A Ë !  (6   (6  Aj$     6 A A  A     AÿÿÃ A Ð  A    Aí W# Ak"$    Aj   AjAÿÿÃ A Ü !  (6   (6  Aj$  ¯    6   6 @@ AqE\r   kAH\r  Aj6  Aï:    ( " Aj6   A»:    ( " Aj6   A¿:   ( ! @@@   I\r A !A!  ( "  K\r  ApqA°F\r@@  Aÿ K\r A!  ( "kAH\r  Aj6    :  @  AÿK\r   ( "kAH\r  Aj6    AvAÀr:    ( "Aj6    A?qAr:    ( "k!@  AÿÿK\r  AH\r  Aj6    AvAàr:    ( "Aj6    AvA?qAr:    ( "Aj6    A?qAr:   AH\r  Aj6    AvAðr:    ( "Aj6    AvA?qAr:    ( "Aj6    AvA?qAr:    ( "Aj6    A?qAr:    ( Aj" 6   AW# Ak"$    Aj   AjAÿÿÃ A Þ !  (6   (6  Aj$  ô   6   6 @   kAH\r  AqE\r   -  AïG\r   - A»G\r   - A¿G\r    Aj" 6  ( !@@@@   O\r  O\r  ,  "Aÿq!@@ A H\r   I\rA! ABI\r@ A_K\r @   kAN\r AA!  - "	AÀqAG\rA! 	A?q AtAÀqr" M\r@ AoK\r A!   k"\nAH\r  , !	@@@ AíF\r  AàG\r 	A`qA F\r 	A H\r 	A¿J\r \nAF\r  - "\nAÀqAG\rA! \nA?q 	A?qAt AtAàqrr" K\rA! AtK\rA!   k"	AH\r  , !\n@@@@ A~j  \nAð jAÿqA0O\r \nAN\r \nA¿J\r 	AF\r  - "AÀqAG\r 	AF\r  - "	AÀqAG\rA! 	A?q AtAÀq \nA?qAt AtAð qrrr" K\rA!  6     j" 6   Aj"6     I! A   6 A A  A     AÿÿÃ A ã   !@   kAH\r   ! AqE\r   !  -  AïG\r   !  - A»G\r   AA   - A¿Fj!A !@@  O\r  O\r ,  "Aÿq!@@ A H\r   I\rA! ABI\r@ A_K\r   kAH\r - "AÀqAG\r A?q AtAÀqr K\rA!@ AoK\r   kAH\r - ! , !@@@ AíF\r  AàG\r A`qA F\r A N\r A¿J\r AÀqAG\r A?qAt AtAàqr A?qr K\rA! AtK\r  kAH\r - !	 - ! , !@@@@ A~j  Að jAÿqA0O\r AN\r A¿J\r AÀqAG\r 	AÀqAG\r A?qAt AtAð qr AtAÀqr 	A?qr K\rA! Aj!  j!    k A    Aí W# Ak"$    Aj   AjAÿÿÃ A Ü !  (6   (6  Aj$  W# Ak"$    Aj   AjAÿÿÃ A Þ !  (6   (6  Aj$     6 A A  A     AÿÿÃ A ã  A!   AÈ¡ 6   Aj       í Aí !   Að¡ 6   Aj       ï Aí    ,    (   , 	   (    Ajõ     Ajõ    A Ð    A¢ ù    § "   ú    \n       Aª Ð    A¤¢ ù     â      A @A -  E\r A (  A A:  A A 6 A º @A - ¸ \r A A A Þ A A: ¸ A Aú ý A A ý A¨ Aß ý A´ Aç ý AÀ AÖ ý AÌ A ý AØ Añ ý Aä AÕ ý Að Aì ý Aü A ý A A¦ ý A AÍ ý A  AÁ ý A¬ AÍ ý %A¸ !@ Atj "A G\r A @A -  E\r A (  A A:  A AÀ 6 AÀ º @A - è \r A A A Þ A A: è AÀ AÅ  AÌ A¸Å  AØ AÔÅ  Aä AôÅ  Að AÆ  Aü AÀÆ  A AÜÆ  A AÇ  A  AÇ  A¬ A Ç  A¸ A°Ç  AÄ AÀÇ  AÐ AÐÇ  AÜ AàÇ  %Aè !@ Atj "AÀ G\r     ¤ A @A -  E\r A (  A A:  A Að 6 Að ø @A -  \r A A A Þ A A:  Að AÃ ý Aü Aº ý A Aý ý A A« ý A  A ý A¬ A° ý A¸ AË ý AÄ A÷ ý AÐ A ý AÜ A® ý Aè Aø ý Aô A ý A Aú ý A Aæ ý A AØ ý A¤ AÐ ý A° A ý A¼ AÙ ý AÈ A¢ ý AÔ A ý Aà AÅ ý Aì AÃ ý Aø AÉ ý A Aâ ý %A !@ Atj "Að G\r A @A -  E\r A (  A A:  A A  6 A  ø @A - À¡ \r A A A Þ A A: À¡ A  AðÇ  A¬ AÈ  A¸ A´È  AÄ AÌÈ  AÐ AäÈ  AÜ AôÈ  Aè AÉ  Aô AÉ  A  A¸É  A  AàÉ  A  AÊ  A¤  A¤Ê  A°  AÈÊ  A¼  AØÊ  AÈ  AèÊ  AÔ  AøÊ  Aà  AäÈ  Aì  AË  Aø  AË  A¡ A¨Ë  A¡ A¸Ë  A¡ AÈË  A¨¡ AØË  A´¡ AèË  %AÀ¡ !@ Atj "A  G\r A @A - ¤ E\r A (   A A: ¤ A AÐ¡ 6  AÐ¡ V @A - è¡ \r A A A Þ A A: è¡ AÐ¡ AÁ ý AÜ¡ A¾ ý %Aè¡ !@ Atj "AÐ¡ G\r A @A - ¬ E\r A (¨  A A: ¬ A Að¡ 6¨ Að¡ V @A - ¢ \r A A A Þ A A: ¢ Að¡ AøË  Aü¡ AÌ  %A¢ !@ Atj "Að¡ G\r 6 @A - ­ \r A A A Þ A A: ­ Aìó  Aìó  I @A - ¼ \r A° A¼¢ ù A A A Þ A A: ¼ A°  A°  6 @A - ½ \r A A A Þ A A: ½ Aøó  Aøó  I @A - Ì \r AÀ Aà¢ ù A A A Þ A A: Ì AÀ  AÀ  I @A - Ü \r AÐ Aî Ð A A A Þ A A: Ü AÐ  AÐ  I @A - ì \r Aà A£ ù A A A Þ A A: ì Aà  Aà  I @A - ü \r Að AÉ Ð A A A Þ A A: ü Að  Að  I @A -  \r A AØ£ ù A A A Þ A A:  A  A  T# Ak"$   6 Aj Ajþ !      ! ÿ  Aj$    @  ( Ý F\r   (      ú         Aí     Aí     Aí     Aí    Ajª          © Aí    Aj­          ¬ Aí    ° Aí    Aj£       ² Aí    Aj£        Aí     Aí     Aí     Aí     Aí     Aí     Aí     Aí     Aí     Aí     ¿ Ü# Ak"$ @   ± K\r @@ ² E\r    §   £ ! Aj   ³ Aj´  (" (µ    ¶    (·    ¸    þ À ! A :   Aj¨    ù  Aj$ º      k        k" ö    j       Ä Ü# Ak"$ @   Å K\r @@ Æ E\r    ¨   § ! Aj   Ç AjÈ  (" (É    Ê    (Ë    ¦    ¯ Ì ! A 6  Aj¥    Å  Aj$ Í  \n    kAu   Î "   ¼ AvKvAwj   AI0A!@  AI\r   AjÑ "   Aj"   AF!      Ð  	    6     Axr6"        k" AuÇ    j Aµ ½   ¼ Av        Ó \n   AjA~q    Ô !   6   6 # @   Î M\r Ã   AÕ *   At! @ ­ E\r    ï   é    (Aÿÿÿÿq     ý þ  Ø v# Ak"$ @    "M\r     kñ    ò  A :   j Aj¨ @  O\r    ©  Aj$   ´# Ak"$ @   ± " kK\r   ý !	@  AvAxjO\r   At6   j6 Aj AjÔ ( ³ ! Aj   Aj´  (" (µ @ E\r  þ  	þ  ö @   j"F\r  þ  j j 	þ  j j  kö @ Aj"AF\r    	 ¥    ¶    (·  Aj$ º  8        é AtjAj     ª AtjAjÒ      Ü    AÝ .  At!@ ­ E\r     ô    í       þ kj     ± \n   þ       ¯ kj      \n   ¯     6       6   o# Ak"$    6@   F\r @  Aj"6   O\r Aj Ajç   (Aj" 6 (!  Aj$    (  ( è      o# Ak"$    6@   F\r @  A|j"6   O\r Aj Ajê   (Aj" 6 (!  Aj$    (  ( ë     ì   ( !   ( 6   6 \n   î    # A k"$  Aj  ð  Aj Aj ( ( ñ ò    (ó 6   (ô 6   Aj Ajõ  A j$      ö \n   ÷ # Ak"$   6  6@@  F\r ,  ! Ajµ  ¶   Aj"6 Aj·     Aj Ajõ  Aj$     ù     ú      ø M# Ak"$    6   6   Aj Ajû  Aj$        ( 6    ( 6             ( 6    ( 6  # A k"$  Aj  ý  Aj Aj ( ( þ ÿ    ( 6   ( 6   Aj Aj  A j$       \n    # Ak"$   6  6@@  F\r ( ! Ajó  ô   Aj"6 Ajõ     Aj Aj  Aj$                 M# Ak"$    6   6   Aj Aj  Aj$        ( 6    ( 6             ( 6    ( 6  l# Ak"$   6   6  6A !@ Aj Aj Aj \r  Aj Aj Aj ! Aj$  \r  (  ( I\n           k      í E6# Ak"$    6 Aj !  Aj$   \n    \r   (  <# Ak"$    6 Aj þ !  Aj$        (  j6       6   \r     ¿# Ak"$ @   Å " kK\r   È !	@  AvAxjO\r   At6   j6 Aj AjÔ ( Ç ! Aj   AjÈ  (" (É @ E\r  ¯  	¯  Ç @   j"F\r  ¯  At"j Atj 	¯  j Atj  kÇ @ Aj"AF\r    	 Û    Ê    (Ë  Aj$ Í            6      ( !     é Å \n    kAul# Ak"$   6   6  6A !@ Aj Aj Aj \r  Aj Aj Aj ! Aj$         «  \r  (  ( IÜ# Ak"$ @   Å K\r @@ Æ E\r    ¨   § ! Aj   Ç AjÈ  (" (É    Ê    (Ë    ¦    ¯ ° ! A 6  Aj¥    Å  Aj$ Í  \n   ¡        kAu       Atí E6# Ak"$    6 Aj¢ !  Aj$   \n   £ \r   ( ¤ <# Ak"$    6 AjÊ ¯ !  Aj$        (  Atj6       §  # A k"$  Aj  ©  Aj Aj ( (  ª    (« 6   ( 6   Aj Aj¬  A j$      ­       ®     °      ¯ M# Ak"$   ± 6  ± 6   Aj Aj²  Aj$ U# Ak"$   6    k"û    j6   Aj Aj·  Aj$     ( 6    ( 6      ¹ \n   ³     ( 6    ( 6  6# Ak"$    6 Aj´ !  Aj$   \n   µ \r   ( ¶ <# Ak"$    6 Aj  !  Aj$        ¸     ( 6    ( 6      º D# Ak"$    6 Aj  Aj´ k× !  Aj$       6   # A k"$  Aj  ½  Aj Aj ( (  ¾    (¿ 6   ( 6   Aj AjÀ  A j$      Á       Â     Ä      Ã M# Ak"$   Å 6  Å 6   Aj AjÆ  Aj$ X# Ak"$   6    k"AuË    j6   Aj AjË  Aj$     ( 6    ( 6      Í \n   Ç     ( 6    ( 6  6# Ak"$    6 AjÈ !  Aj$   \n   É \r   ( Ê <# Ak"$    6 AjÇ  !  Aj$        Ì     ( 6    ( 6      Î G# Ak"$    6 Aj  AjÈ kAuæ !  Aj$       6      A :    R# Ak"$    AjÙ 6 ¡ 6 Aj Aj ( !  Aj$    AÔ ½       Ú ,     Û   Ü Atj  Û  AtjÝ 0   6    ("6    Atj6  æ   9  ( "  ("6@   ("F\r    ( kAuÂ        ç \n   Þ    A ß !   6   6 \r   ( ×    (  ( kAu(   Û   Û   Ü Atj  å  AÿÿÿÿW# Ak"$ @@ AK\r   - xAq\r   A: x Ajà  á !  Aj$   \n   â # @   ã M\r Ã   Aä     ¼ Av*   At! @ ­ E\r    ï   é  8     Û   À Atj  Û   À Atj AtjÝ \n   è    A 6   \n  ê  w# Ak"$   6@   Ñ "K\r @  Ü " AvO\r   At6 Aj AjÔ ( ! Aj$  Ò  2     Û   À Atj  Û   Ü AtjÝ      î K# Ak"$ @@   G\r   A : x Ajà   ï  Aj$    Að .  At!@ ­ E\r     ô    í    î # Ak"$    6A !  A 6@@ \r A ! Aj  Ó  (! (!   6     Atj"6    Atj6   6 Aj$   v# Ak"$  Aj  Aj ö "( !@@  (F\r  ( × Ø   ( Aj"6   ÷  Aj$ ¥  ì   (! (!  Aj  ( "×   (×    kj"× ø   6    ( 6   Ajù   Aj Ajù   Aj Ajù   (6     À Ô 0  ú @  ( "E\r   (   û í   ( ( !   6   6     Atj6     (  ( 6   / × ! × !@  k"E\r    ü\n    ( !   ( 6   6      (ü    (  ( kAu    ý 7@@   ("F\r   A|j"6  ( × é      (  6   @  ( "E\r     \n   ù o# Ak"$    6@   F\r @  A|j"6   O\r Aj Aj   (Aj" 6 (!  Aj$    (  (                         AÌ 6      A¼Ì 6      Ý 6           \n        6      (   \n    \n       (  6   ( A A (¬ Aj" 6¬   y# Ak"$ @   é "M\r     k®    ±  A 6  Atj Aj¥ @  O\r    ©  Aj$   \n    kAm AÐ           Ax    \r B\r Bÿÿÿÿÿÿÿÿÿ         ¢  Aÿÿ ¤  B    Ý ¦           Ý ¨       L~# Ak"$    Ý ª  ) !   )7   7  Aj$ H~# Ak"$       ) !   )7   7  Aj$ \n    kAm[# Ak"$  Aj Ó  AjÝ AÐ Aê    Aj«  Aj$  E@@  k"A	J\r A=! ²  J\rA !  ³ !   6   6       ´       µ       ¶ n  l" l!  l!A !@   O\r  Ar@   O\r  Ar@   O\r  Ar@   O\r  Aj Aj!   n!  .A   Ar· kAÑ	lAu"   AtAàÌ j( Oj    ¸ @@ Ñ "  kL\r A=!  j"!@@ AO\r @ Aj" Aq- É :   Av"\r A ! AtA<qAàÎ jA A|j"Ã  Av!    6   6 @@ Ó "  kL\r A=!  j"!@@ AÁ O\r @ Aj" Aq- « :   Av"\r A ! AtAþ qA Ï jA A~j"Ã  Av!    6   6 A=!@ Ô "  kJ\r   j"!@@ AI\r AtAþqA Ð jA A~j"Ã  Av! A ! E\r @ Aj" Aq- ð :   Av"\r    6   6    gÛ @ A¿=K\r @ AÎ K\r @ Aã K\r @ A	K\r    ¹    º @ AçK\r    »    ¼ @ AK\r    ½    ¾ @ AÿÁ×/K\r @ Aÿ¬âK\r    ¿    À @ AÿëÜK\r    Á    Â     A0j:    Aj  AtAÍ jA  Ã #   Aä n"¹   Aä lkº #   Aä n"º   Aä lkº %   AÎ n"¹   AÎ lk¼ %   AÎ n"º   AÎ lk¼ %   AÀ=n"¹   AÀ=lk¾ %   AÀ=n"º   AÀ=lk¾ \'   AÂ×/n"¹   AÂ×/lkÀ \'   AÂ×/n"º   AÂ×/lkÀ       j Ä :# Ak"$  Aj    Å  (! Aj$        Æ # A k"$  Aj  Ç  Aj Aj ( (  ª    (È 6   ( 6   Aj AjÉ  A j$      Ê     Ì      Ë M# Ak"$   Í 6  Í 6   Aj Aj²  Aj$     ( 6    ( 6      Ï \n   Î \n        Ð        kj A   ArÒ k   g A"  ArÒ kAm A#  ArÒ kAmE@@  k"AJ\r A=! Ú  J\rA !  Û !   6   6       Ü       Ý       Þ |~  l" l­! ­! ­!  l­!A !@   Z\r  Ar@   Z\r  Ar@   Z\r  Ar@   Z\r  Aj Aj!   !  /AÀ   Bß kAÑ	lAu"   AtA Ô j) Zj    à @@ â "  kL\r A=!  j"!@@ BZ\r @ Aj" §Aq- É :   B"B R\r A ! §AtA<qAàÎ jA A|j"Ã  B!    6   6 @@ ã "  kL\r A=!  j"!@@ BÁ Z\r @ Aj" §Aq- « :   B"B R\r A ! §AtAþ qA Ï jA A~j"Ã  B!    6   6 A=!@ ä "  kJ\r   j"!@@ BT\r §AtAþqA Ð jA A~j"Ã  B! A ! E\r @ Aj" §Aq- ð :   B"B R\r    6   6    y§Z~@ BÿÿÿÿV\r    §¸ @ BÈ¯ %T\r   BÈ¯ %"BÈ¯ %~}!   §¸ !    á )~   BÂ×/"§º   BÂ×/~}§À  AÀ   Bß k AÂ   Bß kAm AÃ   Bß kAm^# Ak"$   6  6 Aj Ajþ !     (Å ! ÿ  Aj$       T# Ak"$ A !@  Aq\r    p\r  Aj   Ö ! A  (  ! Aj$   @  ê " \r ë   >  A  AK!@@ Ð "\rµ " E\r      	 õ  \n   Ò \n   ì \n   ì  @   ð "\r ë  L A AK!  A  AK! @@   ñ "\rµ "E\r     $      jAjA   kq"  Kè \n   ó \n   Ò     ò  A A ²     Aî Aj6   V  "A\rjé "A 6  6  6  ø !@ Aj"E\r    ü\n     6      Aj(   ö " Aôî Aj6   Aj ÷    A(   ö " Aï Aj6   Aj ÷   +# Ak"$    6 A´  ²  EAõ !@  AK\r @@  \r A !   At/Ö " E\r  A´Ø j!      ý Þ# Ak"$ @   ± K\r @@ ² E\r    §   £ ! Aj   ³ Aj´  (" (µ    ¶    (·    ¸  þ   ö  A :   j Aj¨    ù  Aj$ º  Þ# Ak"$ @   ± K\r @@ ² E\r    §   £ ! Aj   ³ Aj´  (" (µ    ¶    (·    ¸  þ     A :   j Aj¨    ù  Aj$ º  9# Ak"$   :     Aj  Aj$       £  ¤ 2    @   E\r     ¢    ¥   |   !   !@  K\r @  M\r     kñ   ý þ "       Ø      k A       ¯# Ak"$ @ E\r @   "   "k O\r      k j  A A ð    ñ   ý "þ  j       j"ò  A :   j Aj¨  Aj$        Ñ  ³# Ak"$ @@   "   "k I\r  E\r   ñ   ý þ " j  ö     j"ò  A :   j Aj¨      k j  A     Aj$   ®# A k"$ @   ± "	 kK\r   ý !\n@  	AvAxjO\r   At6   j6 Aj AjÔ ( ³ !	    Aj Aj   (   Aj   	Aj´  ("	 (µ @ E\r  	þ  \nþ  ö @ E\r  	þ  j  ö    j"k!@  F\r  	þ  j j \nþ  j j ö @ Aj"AF\r    \n ¥    	¶    (·     j j"¸  A :  	 j Aj¨  Aj  A j$ º  ÷# Ak"$   : @@   "\r A\n!   !   Aj!   !@@@  G\r    A  A A ð   Añ   Añ  \r   £ !   Aj§   ¢ !   Aj¸   j"  Aj¨  A :   Aj Aj¨  Aj$      û 1@    "M\r     k     × Ê# Ak"$ @@@ ² E\r   £ !   §    ± K\r Aj   ³ Aj´  (" (µ    ¶    (·    ¸  þ   Ajö    ù  Aj$ º       Ñ  Ê# Ak"$    !   !@@  O\r @  M\r     kñ   ¢ !   ¸  þ   ö  A :   j Aj¨   O\r   ©    Aj  kAj A      Aj$   º# Ak"$    !@@ A\nK\r @  M\r     kñ   £ !   §  þ   ö  A :   j Aj¨   O\r   ©   A\n Avj A      Aj$   á# Ak"$ @   Å K\r @@ Æ E\r    ¨   § ! Aj   Ç AjÈ  (" (É    Ê    (Ë    ¦  ¯   Ç  A 6  Atj Aj¥    Å  Aj$ Í  á# Ak"$ @   Å K\r @@ Æ E\r    ¨   § ! Aj   Ç AjÈ  (" (É    Ê    (Ë    ¦  ¯     A 6  Atj Aj¥    Å  Aj$ Í  9# Ak"$   6    Aj  Aj$       £  ¥ 2   Ú @   E\r     ¤   Ö Û   |  ª !  é !@  K\r @  M\r     k®   È ¯ "             k A       ¹# Ak"$ @@  ª "  é "k I\r  E\r   ®   È ¯ " Atj  Ç     j"±  A 6  Atj Aj¥      k j  A     Aj$   ¿# A k"$ @   Å "	 kK\r   È !\n@  	AvAxjO\r   At6   j6 Aj AjÔ ( Ç !	  Ú  Aj Aj   (   Aj   	AjÈ  ("	 (É @ E\r  	¯  \n¯  Ç @ E\r  	¯  Atj  Ç    j"k!@  F\r  	¯  At"j Atj \n¯  j Atj Ç @ Aj"AF\r    \n Û    	Ê    (Ë     j j"¦  A 6 	 Atj Aj¥  Aj  A j$ Í  ú# Ak"$   6@@   "\r A!   !  Ö Aj!   !@@@  G\r    A  A A ­   A®   A®  \r   § !   Aj¨   ¤ !   Aj¦   Atj"  Aj¥  A 6  Aj Aj¥  Aj$      Ë Ê# Ak"$ @@@ Æ E\r   § !   ¨    Å K\r Aj   Ç AjÈ  (" (É    Ê    (Ë    ¦  ¯   AjÇ    Å  Aj$ Í       ú       J# A k"$  Aj Aj A j     Aj (  A j$ ># Ak"$  Aj   ¦    Aj§  Aj$    ø "          ¡ J# A k"$  Aj Aj A j ¢    Aj (  A j$ ># Ak"$  Aj   ©    Aj§  Aj$    ) @@ E\r   -  :   Aj!  Aj!    ) @@ E\r   ( 6  Aj!  Aj!    E ± !@  F\r  AJ\r  A-:   Aj! ¨ !     ©     ( 6    (6 A   kE@@  k"A	J\r A=! ª  J\rA !  « !   6   6 .A   Ar· kAÑ	lAu"   AtAàÌ j( Oj    ¸     ­ {@@ (L"A H\r  E\r Aÿÿÿÿq (G\r@  Aÿq" (PF\r  (" (F\r   Aj6   :     ï    ® @ AÌ j"¯ E\r  ¥ @@  Aÿq" (PF\r  (" (F\r   Aj6   :    ï !@ ° AqE\r  ±      ( "Aÿÿÿÿ 6    ( !  A 6  \r   A§ ]# Ak"$   6A ( "   Á @     jAj-  A\nF\r A\n ¬ É  W# Ak"$ Aâ AAA ( "¶   6    Á A\n ¬ É     (  A¼¤ ´  A    AÐ jÐ AÐ j A¾ A ³  \n   ò      ¹ Aí    ¹ Aí    ¹ Aí    ¹ Aí    ¹ Aí     A Â 9 @ \r   ( (F@   G\r A  Ã  Ã ë E   (# AÐ k"$ A!@@   A Â \r A ! E\r A ! A ç AÐç A Å "E\r  ( "E\r AjA A8ü  A: K A6    6  6 A6D  Aj A ( (  @ (,"AG\r   ($6  AF! AÐ j$   Að 6 Aç6 A 6 AÆ  ³  # Ak"$  Aj  Æ  (" A Â ! (!@@ E\r       ( Ç !      È "\r        É ! Aj$  /   ( "Axj( "6    j6    A|j( 6Ì# AÀ k"$ A !@@ A H\r  A  A  kF! A~F\r  B 7  6  6   6  6 B 7 B 7$ B 7, A 6< B74  Aj  AA  ( (    A  (AF! AÀ j$  º# AÀ k"$ A !@ A H\r    k"  H\r  B 7  6  6  6 B 7 B 7$ B 7, A 6< B74   6  Aj  AA  ( (     A  (! AÀ j$  ê# AÀ k"$   6  6   6  6A ! AjA A\'ü  A 6< A: ;  Aj AA  ( (¡  @@@ ((  (A  ($AFA  ( AFA  (,AF!@ (AF\r  (,\r ( AG\r ($AG\r (! AÀ j$  w@ ($"\r   6  6 A6$  (86@@ ( (8G\r  ( G\r  (AG\r  6 A: 6 A6  Aj6$% @   (A Â E\r     Ê F @   (A Â E\r     Ê   ("      ( (    ("Aq!@@ - 7AG\r  Au! E\r (  Î !@ \r  Au!   ( Ã 68  (!A !A !  ( "    j A Aq  ( (  \n    j( @   (A Â E\r      Ê   (!  Aj"   Í @ AI\r   Atj!  Aj! @     Í  - 6\r  Aj"  I\r YA!@@  - Aq\r A ! E\r A ç Aè A Å "E\r - AqA G!    Â ! ÿ# AÀ k"$ @@ A¬ê A Â E\r  A 6 A!@    Ð E\r A! ( "E\r  ( 6 @ E\r A ! A ç A°è A Å "E\r@ ( "E\r   ( 6  ("  ("AsqAq\r As qAà q\rA!  ( (A Â \r@  (A ê A Â E\r  ("E\r A ç Aàè A Å E!  ("E\r A !@ A ç A°è A Å "E\r   - AqE\r  (Ò !A !@ A ç Aé A Å "E\r   - AqE\r  (Ó !A ! A ç AÐç A Å " E\r ("E\rA ! A ç AÐç A Å "E\r ( ! AjA A8ü   A G: ; A6   6  6 A64  Aj A ( (  @ ("AG\r   (A  6  AF!A ! AÀ j$  Ê@@@ \r A A ! A ç A°è A Å "E\r (  (Asq\r@  ( (A Â E\r A  - AqE\r  ("E\r@ A ç A°è A Å " E\r  (!A ! A ç Aé A Å " E\r    (Ó ! jA !@ E\r  A ç Aé A Å "E\r  (  (Asq\r A !  ( (A Â E\r   ( (A Â !   A: 5@  (G\r  A: 4@@ ("\r  A6$  6  6 AG\r (0AF\r@  G\r @ ("AG\r   6 ! (0AG\r AF\r  ($Aj6$ A: 6  @  (G\r  (AF\r   6è@   ( Â E\r     Õ @@@   (  Â E\r @@  (F\r   (G\r AG\r A6   6  (,AF\r  Aj"  (Atj!A !A !@@@@@  O\r  A ;4    A ×  - 6\r  - 5AG\r@ - 4AG\r  (AF\rA!A!  - AqE\rA!  - Aq\rA!AA Aq!  6, Aq\r A6, Aj!   (!  Aj"    Ø  AI\r  Atj!  Aj!@@  (" Aq\r  ($AG\r@ - 6\r     Ø  Aj" I\r @  Aq\r @ - 6\r ($AF\r     Ø  Aj" I\r @ - 6\r@ ($AG\r  (AF\r     Ø  Aj" I\r   6  ((Aj6( ($AG\r  (AG\r  A: 6Y  ("Au!@ AqE\r  (  Î !  ( "     j A Aq   ( (   W  ("Au!@ AqE\r  (  Î !  ( "    j A Aq   ( (¡   @   ( Â E\r     Õ @@   (  Â E\r @@  (F\r   (G\r AG\r A6   6 @ (,AF\r  A ;4  ("    A   ( (   @ - 5AG\r  A6, - 4E\r A6,  6  ((Aj6( ($AG\r (AG\r A: 6  ("       ( (¡  ¤ @   ( Â E\r     Õ @   (  Â E\r @@  (F\r   (G\r AG\r A6   6  6   ((Aj6(@ ($AG\r  (AG\r  A: 6 A6,¯@   ( Â E\r      Ô  - 5!  (! A : 5 - 4! A : 4  Aj"	     ×   - 4"\nr!  - 5"r!@ AI\r  	 Atj!	  Aj!@ - 6\r@@ \nAqE\r  (AF\r  - Aq\r AqE\r   - AqE\r A ;4      ×  - 5" rAq! - 4"\n rAq! Aj" 	I\r   Aq: 5  Aq: 4L @   ( Â E\r      Ô   ("        ( (   \' @   ( Â E\r      Ô       Þ   Aí  AÝ    ö " AÜí Aj6      Þ   Aí  A¼    á " Aðí Aj6      Þ   Aí  AÔ $   Aôî Aj6   Ajè   Þ 7@  ú E\r   ( é "Ajê AJ\r  ì      Atj    ( Aj"6     ç   Aí \r   Ají    ( $   Aï Aj6   Ajè   Þ    î   Aí \r   Ají    ç   Aí    \n   $ #   kApq"$   # ô A¡ðâ¯ â­ 0123456789abcdefghijklmnopqrstuvwxyz  Hz infinity February January July apply Thursday Tuesday Wednesday Saturday Sunday Monday Friday May %m/%d/%y tx -+   0X0x -0X+0X 0X-0x+0x 0x zr.x <= zs.x Nov Thu unsupported locale for standard input August generateDefaultPrimeList unsigned short print retuneZeroPoint retuneOnePoint unsigned int PseudoPrimeInt nodeLabelDigit set get generateHarmonicSeriesPitchSet generateETPitchSet generateJIPitchSet Oct float Sat linearFromTwoDots affineFromThreeDots retuneTwoPoints retuneThreePoints repetitions adjustParams fromParams getNodes %s:%d: %s Apr vector generator money_get error Unknown error s_fr chroma_fr L_fr log2fr nodeLabelLetter October number pseudoPrimeFromIndexNumber nodeLabelLetterWithOctaveNumber November September December Matrix is singular or nearly singular unsigned char ios_base::clear Mar coordToFreq /home/john/repos/scalatrix/src/mos.cpp /emsdk/emscripten/system/lib/libcxxabi/src/private_typeinfo.cpp /home/john/repos/scalatrix/src/affine_transform.cpp /home/john/repos/scalatrix/src/lattice.cpp findClosestWithinStrip Sep %I:%M:%S %p Sun Jun std::exception Mon v_gen nan Jan mosTransform IntegerAffineTransform Jul bool April label push_back Fri Vector2i depth bad_array_new_length pitch PitchSetPitch March Aug unsigned long long unsigned long std::wstring basic_string std::string std::u16string std::u32string inf 0123456789abcdef %.0Lf %Lf resize equave true Tue inverse false June applyAffine fromAffine retuneWithAffine recalcWithAffine impliedAffine angle gFromAngle double base_scale nodeInScale bad_cast was thrown in -fno-exceptions mode bad_array_new_length was thrown in -fno-exceptions mode bad_alloc was thrown in -fno-exceptions mode VectorNode angleStd natural_coord tuning_coord period %0*lld %*lld +%lld %+.4ld void locale not supported Wed Vector2d %Y-%m-%d std::bad_alloc s_vec chroma_vec L_vec Dec Feb a \\ %a %b %d %H:%M:%S %Y POSIX generateScaleFromMOS retuneScaleWithMOS %H:%M:%S NAN PM AM %H:%M LC_ALL ASCII adjustG fromG LANG INF C catching a class without an object? emscripten::memory_view<short> emscripten::memory_view<unsigned short> emscripten::memory_view<int> emscripten::memory_view<unsigned int> emscripten::memory_view<float> emscripten::memory_view<uint8_t> emscripten::memory_view<int8_t> emscripten::memory_view<uint16_t> emscripten::memory_view<int16_t> emscripten::memory_view<uint64_t> emscripten::memory_view<int64_t> emscripten::memory_view<uint32_t> emscripten::memory_view<int32_t> emscripten::memory_view<char> emscripten::memory_view<unsigned char> emscripten::memory_view<signed char> emscripten::memory_view<long> emscripten::memory_view<unsigned long> emscripten::memory_view<double> : 0123456789 C.UTF-8 01234567 std::abs(det) > 1e-7 01 n0 b0 a0 0.0 <= g && g <= 1.0 zr.x >= 0 && zr.x + zs.x > 0 b > 0 a > 0 b1.x * b2.y - b1.y * b2.x != 0 a1.x * a2.y - a1.y * a2.x != 0 det != 0 . - (null) ) -> ( : ( % length_error was thrown in -fno-exceptions mode with message "%s" runtime_error was thrown in -fno-exceptions mode with message "%s" ios_base::failure was thrown in -fno-exceptions mode with message "%s" Pure virtual function called! Node  libc++abi:  ,  )   out of range\n 	                           \r                  %   )   +   /   5   ;   =   C   G   I   O   S   Y   a   èu ü NSt3__212basic_stringIwNS_11char_traitsIwEENS_9allocatorIwEEEE  èu D\r NSt3__212basic_stringIDsNS_11char_traitsIDsEENS_9allocatorIDsEEEE   èu \r NSt3__212basic_stringIDiNS_11char_traitsIDiEENS_9allocatorIDiEEEE   èu Ü\r N10emscripten11memory_viewIcEE  èu  N10emscripten11memory_viewIaEE  èu , N10emscripten11memory_viewIhEE  èu T N10emscripten11memory_viewIsEE  èu | N10emscripten11memory_viewItEE  èu ¤ N10emscripten11memory_viewIiEE  èu Ì N10emscripten11memory_viewIjEE  èu ô N10emscripten11memory_viewIlEE  èu  N10emscripten11memory_viewImEE  èu D N10emscripten11memory_viewIxEE  èu l N10emscripten11memory_viewIyEE  èu  N10emscripten11memory_viewIfEE  èu ¼ N10emscripten11memory_viewIdEE  èu ä N9scalatrix22IntegerAffineTransformE    Èv      Ü PN9scalatrix22IntegerAffineTransformE   Èv T    Ü PKN9scalatrix22IntegerAffineTransformE pp v vp               u u u u u u ppiiiiii    u ipp vppi    Ô D Ô èu Ü N9scalatrix8Vector2iE pppp  Ü D Ü pppp    Ü D ppp         Ü Ô Ô Ô Ô pppppp  èu D N9scalatrix15AffineTransformE   Èv t     < PN9scalatrix15AffineTransformE  Èv ¤    < PKN9scalatrix15AffineTransformE pp vp       d Ôu Ôu Ôu Ôu Ôu Ôu ppdddddd    Ôu dpp vppd       èu  N9scalatrix8Vector2dE pppp  <  < pppp    <  ppp èu ` N9scalatrix5ScaleE  Èv      X PN9scalatrix5ScaleE Èv ¨    X PKN9scalatrix5ScaleE pp vp  t Ôu u ppdi            X < Ôu u u pppdii       u t < u u vpppii   u t < vppp    8 t èu @ NSt3__26vectorIN9scalatrix4NodeENS_9allocatorIS2_EEEE ppp        u  u u vppii   èu   N9scalatrix3MOSE    Èv Ä      PN9scalatrix3MOSE   Èv è     PKN9scalatrix3MOSE pp vp                 u u Ôu Ôu u ppiiddi  u u u Ôu Ôu ppiiidd  u ´ u u Ôu Ôu u vppiiddi             u ´ u u u Ôu Ôu vppiiidd            Ôu ´ Ôu Ôu Ôu dppddd  Ôu Ø dpp Ôu ´ Ôu dppd    ø Ø Ô èu   NSt3__212basic_stringIcNS_11char_traitsIcEENS_9allocatorIcEEEE pppp             ø Ø Ô u ppppi    u ´ vpp              u ´ Ô Ôu vpppd            u ´ Ô Ô Ôu vppppd       u ´ Ô Ô Ô Ôu vpppppd X ´ Ôu u u pppdii       u ´ X Ôu vpppd   8u Ø Ô ippp    Ô ppp vppp dpp vppd ipp vppi  < ppp vppp    Ü ppp vppp    X ppp vppp p vp dpp vppd p vp ipp vppi    èu   N9scalatrix4NodeE p vp ppp vppp ppp vppp dpp vppd   lv ü        $     Ð           NSt3__28optionalIN9scalatrix4NodeEEE    v 0 p NSt3__227__optional_move_assign_baseIN9scalatrix4NodeELb0EEE    v | ¼ NSt3__227__optional_copy_assign_baseIN9scalatrix4NodeELb0EEE    v È   NSt3__220__optional_move_baseIN9scalatrix4NodeELb0EEE   v  D NSt3__220__optional_copy_baseIN9scalatrix4NodeELb0EEE   v P  NSt3__223__optional_storage_baseIN9scalatrix4NodeELb0EEE    èu  NSt3__224__optional_destruct_baseIN9scalatrix4NodeELb0EEE   èu Ø NSt3__218__sfinae_ctor_baseILb1ELb1EEE  èu  NSt3__220__sfinae_assign_baseILb1ELb1EEE    Èv D     8 PNSt3__26vectorIN9scalatrix4NodeENS_9allocatorIS2_EEEE  Èv     8 PKNSt3__26vectorIN9scalatrix4NodeENS_9allocatorIS2_EEEE pp vp   4 pp   u 8  vppp             u 8 u  vppip   u 8 ipp        èu ( N10emscripten3valE  Ô 8 u pppi    8u 8 u  ippip           <       pppppppp    èu   N9scalatrix14PseudoPrimeIntE p vp ppp vppp ipp vppi dpp vppd     u ppi lv         D     Ð           NSt3__28optionalIN9scalatrix14PseudoPrimeIntEEE v P  NSt3__227__optional_move_assign_baseIN9scalatrix14PseudoPrimeIntELb0EEE v ¤ ì NSt3__227__optional_copy_assign_baseIN9scalatrix14PseudoPrimeIntELb0EEE v ø < NSt3__220__optional_move_baseIN9scalatrix14PseudoPrimeIntELb0EEE    v H  NSt3__220__optional_copy_baseIN9scalatrix14PseudoPrimeIntELb0EEE    v  Ü NSt3__223__optional_storage_baseIN9scalatrix14PseudoPrimeIntELb0EEE èu ä NSt3__224__optional_destruct_baseIN9scalatrix14PseudoPrimeIntELb0EEE    èu 4 NSt3__26vectorIN9scalatrix14PseudoPrimeIntENS_9allocatorIS2_EEEE    Èv      , PNSt3__26vectorIN9scalatrix14PseudoPrimeIntENS_9allocatorIS2_EEEE   Èv Ü    , PKNSt3__26vectorIN9scalatrix14PseudoPrimeIntENS_9allocatorIS2_EEEE pp vp    x pp   u ,  vppp                 u , u  vppip   u , ipp        ì , u pppi                8u , u  ippip   , u ppi èu Ì N9scalatrix13PitchSetPitchE p vp ppp vppp dpp vppd  lv (        X     Ð           NSt3__28optionalIN9scalatrix13PitchSetPitchEEE  v d ¬ NSt3__227__optional_move_assign_baseIN9scalatrix13PitchSetPitchELb0EEE  v ¸    NSt3__227__optional_copy_assign_baseIN9scalatrix13PitchSetPitchELb0EEE  v   L  NSt3__220__optional_move_baseIN9scalatrix13PitchSetPitchELb0EEE v X    NSt3__220__optional_copy_baseIN9scalatrix13PitchSetPitchELb0EEE v ¤  è  NSt3__223__optional_storage_baseIN9scalatrix13PitchSetPitchELb0EEE  èu ð  NSt3__224__optional_destruct_baseIN9scalatrix13PitchSetPitchELb0EEE èu <! NSt3__26vectorIN9scalatrix13PitchSetPitchENS_9allocatorIS2_EEEE Èv !     4! PNSt3__26vectorIN9scalatrix13PitchSetPitchENS_9allocatorIS2_EEEE    Èv à!    4! PKNSt3__26vectorIN9scalatrix13PitchSetPitchENS_9allocatorIS2_EEEE pp vp |! pp   u 4! Ä vppp                 u 4! u Ä vppip   u 4! ipp       Ä   4! u pppi                8u 4! u Ä ippip           4! , u Ôu Ôu pppidd      4! u Ôu Ôu Ôu ppiddd      O»ag¬Ý?-DTû!é?öÒsï?-DTû!ù?âe/"+z<\\3&¦<½Ëðzp<\\3&¦<-DTû!é?-DTû!é¿Ò!3|Ù@Ò!3|ÙÀ               -DTû!	@-DTû!	Àþ+eGg@      8C  úþB.v¿:;¼÷½½ýÿÿÿÿß?<TUUUUÅ?+ÏUU¥?Ð¤g?      ÈBï9úþB.æ?$Äÿ½¿Î?µô×k¬?ÌPFÒ«²?:Nà×U?              ð?n¿O;<53û©=öï?]ÜØ`q¼aw>ìï?Ñfz^¼nèãï?ög5RÒ<tÓ°Ùï?úù#Î¼ÞöÝ)kÐï?aÈæaN÷`<ÈuEÇï?Ó3[ä£<óÆÊ>¾ï?m{]¦<ùlXµï?üïýµ<÷Gr+¬ï?Ñ/p=¾><¢ÑÓ2ì£ï?n4j¼Óþ¯fï?½/*RV¼Q[Ðï?UêNïP¼Ì1lÀ½ï?ôÕ¹#É¼à-©®ï?¯U\\éãÓ<Q¥Èzï?H¥ê¼{Q}<¸rï?=2ÞUð¼ê8ùjï?¿S?<uËoë[cï?&ëvÙ¼Ô\\à[ï?`/:>÷ì<ª¹h1Tï?8Ëç¼Ùü"PMï?Ã¦DAo<Öb;Fï?}ä°z<Ü}I?ï?¨¨ãý<8bunz8ï?}Htò^<?¦²OÎ1ï?òç+G<Ý|âeE+ï?^q?{¸¼cõáß$ï?1«	má÷<áÞõï?ú¿o!=¼ÙÚÐï?´\nr7<ä¦ï?ËÎn<V/>©¯ï?¶«°MuM<·1\nþï?Lt¬âB<1ØLüpï?JøÓ]9Ý<ÿd²üî?[;£¼ñ_Åöî?hPKÌíJ¼Ë©:7§ñî?-Qø¼fØm®ìî?Ò6>èÑq¼÷å4Ûçî?Î³¼å¨Ã-ãî?mL*§H<"4L¦Þî?i(z`¼¬EÚî?[H§X¼*.÷!\nÖî?Ig,|¼¨PÙõÑî?¬Â`ícC<-a`Îî?ïd;	f<W íAÊî?y¡ÚáÌn<Ð<Áµ¢Æî?0?ÿ<ÞÓ×ð*Ãî?°¯z»Îv<\'*6ÕÚ¿î?wàTë½<\rÝý²¼î?£q 4¼§,v²¹î?I£ÜÌÞ¼BfÏ¢Ú¶î?_8½ÆÞx¼OV+´î?ö\\{ìF¼]Ê¤±î?×ý5<Ú\'µ6G¯î?/·{<ýÇÔ­î?	Tâác<)THÝ«î?êÆPÇ4<·FY&©î?5Àd+æ2<H!­o§î?vaJä¼	Üv¹á¥î?¨Mï;Å3¼U:°~¤î?®é+xS¼ ÃÌ4F£î?XXVxÝÎ¼%"U8¢î?d~ªW<s©LÔU¡î?("^¿ï³¼Í;f î?¹4­j¼¿Úu î?î©m¸ïgc¼/e<²î?QàT=Ü¼Qù}î?Ï>Z~dx¼t_ìèuî?°}ÀJî¼t¥Hî?æU2¼ÉgBVëî?ÓÔ	^Ë<?]ÞOi î?¥M¹Ü2{¼ës¡î?kÀgTýì<2Á0í¡î?UlÖ«áëe<bNÏ6ó¢î?BÏ³/Å¡¼>T\'¤î?47;ñ¶i¼ÎL¥î?ÿ:^¼­Ç#F§î?nWrØPÔ¼íDÙ¨î? [g­<fÙÇªî?´êðÁ/·<Û *Bå¬î?ÿçÅ`¶e¼Dµ2¯î?D_óYö{<6w®±î?=§	¼Æÿ[´î?)l¸©]¼åÅÍ°7·î?Y¹|ù#l¼RÈËDºî?ªùô"CC¼PNÞ½î?Kf×lÊ¼ºÊpñÀî?\'Î+ü¯q<ð£Äî?»s\ná5Òm<##ãcÈî?c"b"Å¼eå]{fÌî?Õ1âã<3-JìÐî?»¼ÓÑ»¼]%>²Õî?Ò1î1Ì<X³0Ùî?³Zsni<¿ýyUkÞî?´Íß¼zóÓ¿kãî?3Ëw<­ÓZèî?úÙÑJ{¼f¶)îî?º®ÜVÙÃU¼ûO¸¢óî?@ö¦=¤¼:Yårùî?4­8ôÖh¼G^ûòvÿî?5Xkâî¼J¡0°ï?ÍÝ_\n×ÿt<ÒÁKï?¬úû½¼	×[Âï?³¯0®ns<RÝï?ý\\2ã<zÐÿ_« ï?¬Y	Ñà<KÑW.ñ\'ï?gN8¯Íc<µçm/ï?hl,kg<iïÜ 7ï?ÒµÌ¼úÃ]U?ï?oúÿ?]­¼|J-Gï?I©u8®\r¼ò\rOï?§=¦£t<¤ûÜXï?"@ ¼Éã`ï?¬ÁÕPZ<2Ûæiï?Kk¬Y:<`´ó!sï?>´!Õ¼_{3|ï?É\rG;¹*¼)¡õFï?Ó:`¶t<ö?ç.ï?qrQìÅ<LÇûQï?ðÓ÷¼Ú¤¢¯¤ï?}t#â®¼ñg-H¯ï? ªA¼Ã<\'Zaîºï?2ë©Ã+<ºk7+Åï?îÑ1©d<@En[vÐï?íã;äº7¼¾­ýÛï?ÍM;w<ØÁçï?Ì`AÁS<ñq+Âóï?   eG÷? ¢ï.üç=9+eGç¿¾:Ü	ÇÞ?û/pdG×¿HLPlwÒ?¼ê(³ÇÎ¿.ùá%bÊ?þ+eGç¿÷:Ü	ÇÞ??|+eG×¿ä[ðPlwÒ?åvÝ	ÇÎ¿6çÄvaÊ?§d¼?Ç¿JðTÑÄ?<8,§äÂ¿fîZ(/³À?ø¬±k($÷? °Íî_	á¿¡ÌÒf÷áö? Ðv½à¿Ô0=¡ö? øè®Cà¿lÐ2ìaö? @6ÅþÞ¿øú#ö? à·ÙýÝ¿lÏ¤[çõ? Ç®ÿÜ¿¸O!Z¬õ?  ý8Ü¿níqõ? à:2gÛ¿5øY	9õ? °-Z/Ú¿Ý­aíOõ? `øZ!Ù¿Ð{H¸Êô? q°M0Ø¿îO3´9ô? à©ùA×¿iÕ¯ßË`ô? µ+UÖ¿S¹äNf-ô? ¢#kÕ¿¦Øûó?  _eÔ¿6X·Éó?  ö7éÓ¿Jý¶Jó? `S¡ºÒ¿µàió? @Ê@ÙÑ¿²çä:ó? à@:úÐ¿±½\ró? 0ç2Ð¿×q²Ê%àò? `ú¢}Î¿ÍÏ´ò? =cÈÓÌ¿PË|,°ò?  L&Ë¿åMc"^ò? àO/|É¿±=V4ò?  ?ÖÇ¿8¯>ãFò? à§3Æ¿Ý£Íýîâñ?  WéõÄ¿09XJ»ñ?  à$äùÂ¿ "Sñ? ÀýZYbÁ¿<×ÕÀnñ? ½u¿¿Âä·G_Hñ? Àù[W{¼¿Ñ ­X#ñ? ôÆ`¹¿\'"Sðþð?  ¶GâL¶¿:Ðw Ûð? @²x?³¿ÙYÖæ·ð? ÀB}8°¿@{þ>ð?  µoª¿;ÅÊ%sð?  wOz¤¿\\\räQð?  Å¨#¿¢ Á0ð?  x)&j¿!~³%ð?  èØø w¿k§Êù~Àï?  P±Sþ?ñöÓeDï? áÌ¡?Ìî? üM¬?èZ:Wî? @W2ª³?æ=½ðÖåí? Ð ¹?³8ÿ¶wí? @Úér¾?CéMrµí? `PÒÜÁ?cuÜ²¤ì?  Þ«vÄ?QËÖè?ì?  âwCÇ?LO+Ýë? @©ÞÉ?Ê` l}ë? àÒj¸\rÌ?3.n6 ë? àÎ¯\nÎ?9P)&pÅê? g´\nyÐ?Ý1\'¼mê? Àh¬Ñ?ñ?¼Óê? àþÔÛÒ?­þgIÑÂé? ÅNFÔ?|ôäpé? ð:	¾-Õ?ò¼9û é? ÐP QÖ?ñY÷Óè? ðêÍÒq×?mö¹ëåè? }Ø?¹X¶<è? `áU¨Ù?"Æÿôç? ÐÓn¾Ú?Ê"­ç? à ®òÐÛ?ÿùÜgç? @¿=¤àÜ?\n¹  æ?¶D«<¦4W `æ?©÷bêÿa<Åò%Ãÿæ?º<ËÏ~<Z¹8 àæ?&sVÿ<ãàÿç?±_\'@ý<Y `ç?A#´uýr¼Õ[e  ç?v+$|æx<¦éY2 àç?·"ö&äb¼Ò²´íÿè?/É¥F¼Ãüú- `è?ò¢ô÷m<Pk÷ÿè?ýI	S¼fg9 àè?E{Ç¾ó¼E¿âÿé?< @4úw¼Ñ\\Ìÿ_é?]i ÿv¼gGº;  é?~ìÄÄøp<¥-¹çÿßé?FGÙ<¯ý.×ÿê?~®ÍMUj¼ÿÞÿ_ê?k²é©}<+^Êÿê?ÞLµÉ¼ê­Ýÿßê?<.`êÈX<M=\rñÿë?x\'­Ýú¼Z!Îÿ_ë?7ÆËS<tæPÙÿë? ÎAÙ÷s<¯¨ àë?À]!Ä\nu<ßF[  ì?ÉÁéS¦îk<®÷¹@ `ì?ÖpJ\'|¼ýUb  ì?Lèv@z¼]	LÙÿßì?×µù3ù<ÏÖuùÿí?¾á_f,X¼V¢ÿ_í?óÒ({¼"ÿí?6¢4Q<~¼e àí?Ø¤u¼Gö  î?àbï	/<Ø¦×W `î?ú÷Xu~¼Àí\'  î?E	¼|Ëõl àî?ôv\'¼Ì}+x  ï?StrÙ¼\nE& `ï?Üÿ\'\' q@¼3Õèÿï?°¨ýáÜX¼Õÿßï?nËù<g#)  ð?F2eó<hÖããÿ_ð?{®Ýú<W§\n  ð?ûÓÞâW¼Ì?_ àð?ðÅ3¼õº¯øÿñ?Âºf»ú¼­Måÿ_ñ?ïç7¼á6¬  ñ?ÿõ\n <HBÈ àñ? ]Úäû¼n^þ  ò?CûLÐý¼Ø& `ò?Ñy*þ<Úæ¦)  ò?Å^qsp¼9>)àÿßò?ù¦²Ú9|<ðÜ÷ÿó?TRÜn3ñ}<`Zðÿ_ó?ë1ÍLV¼Ì®.  ó?w¤ÓKçðu<6²; àó?3Ë}<ÿÑ  ô?(=-Ï¯~<±|8\r `ô?¦e7<V  ô?Ò¼O\\ú¼óC5 àô?)Sí%x¼Ìÿõ?ÜTwØ<o³ýÿ_õ?(Ð1ç	¼º÷òÿõ?{rh÷<4üëÿßõ?>é0.¼            ù¢ DNn ü) ÑW\' Ý4õ bÛÀ < AC cQþ »Þ« ·aÅ :n$ ÒMB Ià 	ê. Ñ ëþ )± è>§ õ5 D». é ´&p A~_ Ö9 S9 ô9 _ (ù½ ø; Þÿ  /ï \nZ mm Ï~6 	Ë\' FO· f? -ê_ º\'u åëÇ ={ñ ÷9 R ûkê ±_ ] 0V {üF ð«k  ¼Ï 6ô ã© ^a æ e  _ @h Øÿ \'sM 1 ÊV É¨s {â` kÀ ÄG ÍgÃ 	èÜ Y* vÄ ¦ D¯Ý WÑ ¥> ÿ 3~? Â2è OÞ »}2 &=Ã kï ø^ 5: òÊ ñ |! j$| Õnú 0-w ;C µÆ Ã ­ÄÂ ,MA  ] }F ãq- Æ 3b  ´Ò| ´§ 7UÕ ×>ö £ Mvü d* p×« c|ø z°W ç ÀIV ;ÖÙ §8 $#Ë Öw ZT#  ¹ ñ\n Îß 1ÿ fj Wa ¬ûG ~Ø "e· 2è æ¿` ïÄÍ l6	 ]?Ô Þ× X;Þ Þ Ò"( (è âXM ÆÊ2 ã à}Ë ÀP ó§ à[ .4 b H õ[ ­° éò HJC gÓ ªÝØ ®_B jaÎ \n(¤ Ó´ ¦ò \\w £Â a< sx ¯Z o×½ -¦c ô¿Ë ï &Ág UÊE ÊÙ6 (¨Ò Âa Éw & F ÄYÄ ÈÅD M²  ó ÔC­ )Iå ýÕ  ¾ü Ì pÎî >õ ìñ ³çÃ Çø(  Áq> .	³ Eó  « { .µ GÂ {2/ Um r§ kç 1Ë yJ Ayâ ôß è âæ 1 ík __6 »ý H´ g¤l qrB ]2 ¸ ¼å	 1% ÷t9 0 \r Kh ,îX Gª tç ½Ö$ ÷}¦ nHr ï ¦ ´ö ÑSQ Ï\nò  3 õK~ ²ch Ý>_ @]  UR) 7dÀ mØ 2H2 [Lu NqÔ ETn 	Á *õi fÕ \' ]P ´;Û êvÅ ù Ik} \'º i) ÆÌ¬ ­T âj Ù ,rP ¤¾ w ó0p  ü\' êq¨ fÂI dà= Ý £? Cý \r 1AÞ 9 Ýp ·ç ß; 7+ \\  Z  èØ l¯ ÛÿK 8 Yv b¥ aË» Ç¹ @½ Òò Iu\' ë¶ö Û"» \nª &/ dv 	;3  Q:ª £Â ¯í® \\& mÂM -z ÀV ? 	ðö +@ m1 9´   ØÃ[ õÄ Æ­K NÊ¥ §7Í æ©6 « ÝBh cÞ vï hR üÛ7 ®¡« ß1  ®¡ ûÚ dMf í· )e0 WV¿ Gÿ: jù¹ u¾ó (ß «0 fö Ë ú" Ùä =³¤ W 6Í	 NBé ¾¤ 3#µ ðª Oe¨ ÒÁ¥ ? [xÍ #ùv { r Æ¦S onâ ïë  JX ÄÚ· ªfº vÏÏ Ñ ±ñ- Á Ã­w HÚ ÷]  Æô ¬ð/ Ýì ?\\¼ ÐÞm Ç *Û¶ £%:  ¯ ­S ¶W )-´ K~ Ú§ vª {Y¡ * Ü·- úåý Ûþ ¾ý ävl ©ü >p n ýÿ (> ag3 * M½ê ³ç¯ mn g9 1¿[ ×H 0ß Ç-C %a5 ÉpÎ 0Ë¸ ¿lý ¤ ¢ lä ZÝ  !oG bÒ ¹\\ paI kVà R PU7 Õ· 3ñÄ n_ ]0ä .© ²Ã ¡26 ·¤ ê±Ô ÷! iä \'ÿw  @- OÍ   ¥ ³¢Ó /]\n ´ùB ÚË }¾Ð ÛÁ «½ Ê¢ j\\ .U \' U ð á d A ¾Þ Úý* k%¶ {4 óþ ¹¿ hjO J*¨ OÄZ -ø¼ ×Z ôÇ \rM  :¦ ¤W_ ?± 8 Ì  qÝ ÉÞ¶ ¿`õ Me k °¬ ²ÀÐ QUH û rÃ £; À@5 Ü{ àEÌ N)ú ÖÊÈ èóA |dÞ dØ Ù¾1 ¤Ã wXÔ iãÅ ðÚ º:< FF Uu_ Ò½õ nÆ ¬.] Dí >B aÄ )ýé çÖó "|Ê o5 àÅ ÿ× njâ °ýÆ Á |]t k­² Ín >r{ Æj ÷Ï© )sß µÉº · Q â²\r tº$ å}` tØ \r,  ~f ) zv ýý¾ VEï Ù~6 ìÙ º¹ Äü 1¨\' ñnÃ Å6 Ø¨V ´¨µ ÏÌ - oW4 ,V Îã Ö ¹ k^ª >* _Ì ýJ áôû ;m â, éÔ ü´© ïîÑ .5É /9a 8!D ÙÈ ü\n ûJj /Ø S´ N T"Ì *UÜ ÀÆÖ  p¸ id &Z` ?Rî  ôµ üËõ 4¼- 4¼î è]Ì Ý^` g 3ï É¸ aX áW¼ QÆ Ø> ÝqH -Ý ¯¡ !,F Yó× Ùz TÀ Oú Vü åy® "6 8­" gÜ Uèª &8 Êç Q\r¤ 3± ©× iH e²ð § L ùÑ6 !³ {J Ï! @Ü ÜGU át: gëB þß ^Ô_ {g¤ º¬z Uö¢ +# AºU Yn !* 9G ãæ åÔ Iû@ ÿVé Ê ÅY ú+ ÓÁÅ ÅÏ ÛZ® GÅ Cb !; ,y a *L{ , C¿ & x< ¨Ää åÛ{ Ä:Â &ôê ÷g \r¿ e£+ =± ½| ¤QÜ \'Ýc iáÝ  ¨) hÎ( 	í´ D  NÊ pc ~|# ¹2 §õ Vç !ñ µ* o~M ¥Q µù« ßÖ Ýa 6 Ä: ¢¡ rím 9z ¸© k2\\ F\'[  4í Ò w üôU YM àq            @û!ù?    -Dt>   Fø<   `QÌx;   ð9   @ %z8   "ã6    ói5            	             \n\n\n  	  	                               \r \r   	   	                                               	                                                  	                                                   	                                              	                                                      	                                                   	         0123456789ABCDEF0x     C ¼   ½   ¾   ¿   À   Á   Â   Ã   Ä   Å   Æ   Ç   È   É          HC Ê   Ë   øÿÿÿøÿÿÿHC Ì   Í   ÐA äA        C Î   Ï   üÿÿÿüÿÿÿC Ð   Ñ    B B      D Ò   Ó   Ô   Õ   Ö   ×   Ø   Ù   Ú   Û   Ü   Ý   Þ   ß          \\D à   á   øÿÿÿøÿÿÿ\\D â   ã   pB B        ¤D ä   å   üÿÿÿüÿÿÿ¤D æ   ç    B ´B     ÔB è   é   v àB üD NSt3__29basic_iosIcNS_11char_traitsIcEEEE   èu C NSt3__215basic_streambufIcNS_11char_traitsIcEEEE    lv `C        ÔB ôÿÿNSt3__213basic_istreamIcNS_11char_traitsIcEEEE  lv ¨C        ÔB ôÿÿNSt3__213basic_ostreamIcNS_11char_traitsIcEEEE      èC ê   ë   v ôC üD NSt3__29basic_iosIwNS_11char_traitsIwEEEE   èu (D NSt3__215basic_streambufIwNS_11char_traitsIwEEEE    lv tD        èC ôÿÿNSt3__213basic_istreamIwNS_11char_traitsIwEEEE  lv ¼D        èC ôÿÿNSt3__213basic_ostreamIwNS_11char_traitsIwEEEE      üD ì   í   èu E NSt3__28ios_baseE   Èx Xy Þ    ÿÿÿÿÿÿÿÿÿÿÿÿ E    C.UTF-8                                             4E                               À  À  À  À  À  À  À	  À\n  À  À  À\r  À  À  À  À  À  À  À  À  À  À  À  À  À  À  À  À  À  À  À   ³  Ã  Ã  Ã  Ã  Ã  Ã  Ã  Ã	  Ã\n  Ã  Ã  Ã\r  Ó  Ã  Ã  » Ã Ã Ã Û    F ¼   ò   ó   ¿   À   Á   Â   Ã   Ä   ô   õ   ö   È   É   v ¨F C NSt3__210__stdinbufIcEE      G ¼   ÷   ø   ¿   À   Á   ù   Ã   Ä   Å   Æ   Ç   ú   û   v G C NSt3__211__stdoutbufIcEE        hG Ò   ü   ý   Õ   Ö   ×   Ø   Ù   Ú   þ   ÿ      Þ   ß   v tG  D NSt3__210__stdinbufIwEE     ÌG Ò       Õ   Ö   ×     Ù   Ú   Û   Ü   Ý       v ØG  D NSt3__211__stdoutbufIwEE                Ñt W½*pRÿÿ>\'\n   d   è  \'    @B   áõ   5   q   kÿÿÿÎûÿÿ¿ÿÿ        ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ 	ÿÿÿÿÿÿÿ\n\r !"#ÿÿÿÿÿÿ\n\r !"#ÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿÿ        LC_CTYPE    LC_NUMERIC  LC_TIME     LC_COLLATE  LC_MONETARY LC_MESSAGES             Þ( ÈM  §v  4 Ç î  ~\\@ég È U¸.               Sun Mon Tue Wed Thu Fri Sat Sunday Monday Tuesday Wednesday Thursday Friday Saturday Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec January February March April May June July August September October November December AM PM %a %b %e %T %Y %m/%d/%y %H:%M:%S %I:%M:%S %p   %m/%d/%y 0123456789 %a %b %e %T %Y %H:%M:%S     ^[yY] ^[nN] yes no              0123456789abcdefABCDEFxX+-pPiInN %I:%M:%S %p%H:%M               %   m   /   %   d   /   %   y   %   Y   -   %   m   -   %   d   %   I   :   %   M   :   %   S       %   p       %   H   :   %   M               %   H   :   %   M   :   %   S       U           äU                !  "  #  $                                                                                                                                                        B  B  B  B  B  B  B  B  B  B                       *  *  *  *  *  *  *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *   *                     2  2  2  2  2  2  2   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2   2                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      <U %  &    \'  (  )  *  +  ,  -      V .  /    0  1  2  3  4      <V 5  6    7  8  9  :  ;  t   r   u   e       f   a   l   s   e       %   m   /   %   d   /   %   y       %   H   :   %   M   :   %   S       %   a       %   b       %   d       %   H   :   %   M   :   %   S       %   Y       %   I   :   %   M   :   %   S       %   p           R <  =    v (R Ôj NSt3__26locale5facetE       R <  >    ?  @  A  B  C  D  E  F  G  H  I  J  lv ¤R        R    ¸R    NSt3__25ctypeIwEE   èu ÀR NSt3__210ctype_baseE        S <  K    L  M  N  O  P  Q  R  lv (S        R    LS    NSt3__27codecvtIcc11__mbstate_tEE   èu TS NSt3__212codecvt_baseE      S <  S    T  U  V  W  X  Y  Z  lv ¼S        R    LS    NSt3__27codecvtIDsc11__mbstate_tEE      T <  [    \\  ]  ^  _  `  a  b  lv 0T        R    LS    NSt3__27codecvtIDsDu11__mbstate_tEE     T <  c    d  e  f  g  h  i  j  lv ¤T        R    LS    NSt3__27codecvtIDic11__mbstate_tEE      øT <  k    l  m  n  o  p  q  r  lv U        R    LS    NSt3__27codecvtIDiDu11__mbstate_tEE lv \\U        R    LS    NSt3__27codecvtIwc11__mbstate_tEE   v U R NSt3__26locale5__impE   v °U R NSt3__27collateIcEE v ÐU R NSt3__27collateIwEE lv V        R    ¸R    NSt3__25ctypeIcEE   v $V R NSt3__28numpunctIcEE    v HV R NSt3__28numpunctIwEE        ¤U s  t    u  v  w      ÄU x  y    z  {  |      àV <  }    ~                      lv  W        R    DW     NSt3__27num_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEEE lv \\W        tW     NSt3__29__num_getIcEE   èu |W NSt3__214__num_get_baseE        ØW <                            lv øW        R    <X     NSt3__27num_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEEE lv TX        tW     NSt3__29__num_getIwEE        X <                      lv ÀX        R    Y     NSt3__27num_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEEE lv Y        4Y     NSt3__29__num_putIcEE   èu <Y NSt3__214__num_put_baseE        Y <           ¡  ¢  £  ¤  ¥  ¦  lv ¬Y        R    ðY     NSt3__27num_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEEE lv Z        4Y     NSt3__29__num_putIwEE       tZ §  ¨    ©  ª  «  ¬  ­  ®  ¯  øÿÿÿtZ °  ±  ²  ³  ´  µ  ¶  lv Z        R    äZ     [    NSt3__28time_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEEE    èu ìZ NSt3__29time_baseE  èu [ NSt3__220__time_get_c_storageIcEE       [ ·  ¸    ¹  º  »  ¼  ½  ¾  ¿  øÿÿÿ[ À  Á  Â  Ã  Ä  Å  Æ  lv ¨[        R    äZ    ð[    NSt3__28time_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEEE    èu ø[ NSt3__220__time_get_c_storageIwEE       4\\ Ç  È    É  lv T\\        R    \\    NSt3__28time_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEEE    èu ¤\\ NSt3__210__time_putE        Ô\\ Ê  Ë    Ì  lv ô\\        R    \\    NSt3__28time_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEEE        t] <  Í    Î  Ï  Ð  Ñ  Ò  Ó  Ô  Õ  Ö  lv ]        R    °]    NSt3__210moneypunctIcLb0EEE èu ¸] NSt3__210money_baseE        ^ <  ×    Ø  Ù  Ú  Û  Ü  Ý  Þ  ß  à  lv (^        R    °]    NSt3__210moneypunctIcLb1EEE     |^ <  á    â  ã  ä  å  æ  ç  è  é  ê  lv ^        R    °]    NSt3__210moneypunctIwLb0EEE     ð^ <  ë    ì  í  î  ï  ð  ñ  ò  ó  ô  lv _        R    °]    NSt3__210moneypunctIwLb1EEE     H_ <  õ    ö  ÷  lv h_        R    °_     NSt3__29money_getIcNS_19istreambuf_iteratorIcNS_11char_traitsIcEEEEEE   èu ¸_ NSt3__211__money_getIcEE        ð_ <  ø    ù  ú  lv `        R    X`     NSt3__29money_getIwNS_19istreambuf_iteratorIwNS_11char_traitsIwEEEEEE   èu `` NSt3__211__money_getIwEE        ` <  û    ü  ý  lv ¸`        R     a     NSt3__29money_putIcNS_19ostreambuf_iteratorIcNS_11char_traitsIcEEEEEE   èu a NSt3__211__money_putIcEE        @a <  þ    ÿ     lv `a        R    ¨a     NSt3__29money_putIwNS_19ostreambuf_iteratorIwNS_11char_traitsIwEEEEEE   èu °a NSt3__211__money_putIwEE        ìa <            lv b        R    $b    NSt3__28messagesIcEE    èu ,b NSt3__213messages_baseE     db <            lv b        R    $b    NSt3__28messagesIwEE    S   u   n   d   a   y       M   o   n   d   a   y       T   u   e   s   d   a   y       W   e   d   n   e   s   d   a   y       T   h   u   r   s   d   a   y       F   r   i   d   a   y       S   a   t   u   r   d   a   y       S   u   n       M   o   n       T   u   e       W   e   d       T   h   u       F   r   i       S   a   t       J   a   n   u   a   r   y       F   e   b   r   u   a   r   y       M   a   r   c   h       A   p   r   i   l       M   a   y       J   u   n   e       J   u   l   y       A   u   g   u   s   t       S   e   p   t   e   m   b   e   r       O   c   t   o   b   e   r       N   o   v   e   m   b   e   r       D   e   c   e   m   b   e   r       J   a   n       F   e   b       M   a   r       A   p   r       J   u   n       J   u   l       A   u   g       S   e   p       O   c   t       N   o   v       D   e   c       A   M       P   M            [ °  ±  ²  ³  ´  µ  ¶      ð[ À  Á  Â  Ã  Ä  Å  Æ              \n   d   è  \'    @B   áõ Ê;        00010203040506070809101112131415161718192021222324252627282930313233343536373839404142434445464748495051525354555657585960616263646566676869707172737475767778798081828384858687888990919293949596979899        000000010010001101000101011001111000100110101011110011011110111100010203040506071011121314151617202122232425262730313233343536374041424344454647505152535455565760616263646566677071727374757677000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f202122232425262728292a2b2c2d2e2f303132333435363738393a3b3c3d3e3f404142434445464748494a4b4c4d4e4f505152535455565758595a5b5c5d5e5f606162636465666768696a6b6c6d6e6f707172737475767778797a7b7c7d7e7f808182838485868788898a8b8c8d8e8f909192939495969798999a9b9c9d9e9fa0a1a2a3a4a5a6a7a8a9aaabacadaeafb0b1b2b3b4b5b6b7b8b9babbbcbdbebfc0c1c2c3c4c5c6c7c8c9cacbcccdcecfd0d1d2d3d4d5d6d7d8d9dadbdcdddedfe0e1e2e3e4e5e6e7e8e9eaebecedeeeff0f1f2f3f4f5f6f7f8f9fafbfcfdfeff        \n       d       è      \'            @B           áõ     Ê;     äT    èvH    ¥Ôè     rN	   @zóZ   Æ¤~   Áoò#   ]xEc  d§³¶à\r  è#Ç    Ôj 	  \n    èu Üj NSt3__214__shared_countE               N ë§~ uú ¹,ý·z¼ Ì¢ =I×  *_·úXÙýÊ½áÍÜ@x }gaì å\nÔ Ì>Ov¯  D ® ®` úw!ë+ `A ©£nN                                                        *                    \'9H                                  8R`S  Ê        »Ûë+;PSuccess Illegal byte sequence Domain error Result not representable Not a tty Permission denied Operation not permitted No such file or directory No such process File exists Value too large for defined data type No space left on device Out of memory Resource busy Interrupted system call Resource temporarily unavailable Invalid seek Cross-device link Read-only file system Directory not empty Connection reset by peer Operation timed out Connection refused Host is down Host is unreachable Address in use Broken pipe I/O error No such device or address Block device required No such device Not a directory Is a directory Text file busy Exec format error Invalid argument Argument list too long Symbolic link loop Filename too long Too many open files in system No file descriptors available Bad file descriptor No child process Bad address File too large Too many links No locks available Resource deadlock would occur State not recoverable Owner died Operation canceled Function not implemented No message of desired type Identifier removed Device not a stream No data available Device timeout Out of streams resources Link has been severed Protocol error Bad message File descriptor in bad state Not a socket Destination address required Message too large Protocol wrong type for socket Protocol not available Protocol not supported Socket type not supported Not supported Protocol family not supported Address family not supported by protocol Address not available Network is down Network unreachable Connection reset by network Connection aborted No buffer space available Socket is connected Socket not connected Cannot send after socket shutdown Operation already in progress Operation in progress Stale file handle Remote I/O error Quota exceeded No medium found Wrong medium type Multihop attempted Required key not available Key has expired Key has been revoked Key was rejected by service v ¬s x N10__cxxabiv116__shim_type_infoE    v Üs  s N10__cxxabiv117__class_type_infoE   v t  s N10__cxxabiv117__pbase_type_infoE   v <t  t N10__cxxabiv119__pointer_type_infoE v lt  s N10__cxxabiv120__function_type_infoE    v  t  t N10__cxxabiv129__pointer_to_member_type_infoE       ìt   \r        v øt  s N10__cxxabiv123__fundamental_type_infoE Øt (u v   Øt 4u Dn  Øt @u b   Øt Lu c   Øt Xu h   Øt du a   Øt pu s   Øt |u t   Øt u i   Øt u j   Øt  u l   Øt ¬u m   Øt ¸u x   Øt Äu y   Øt Ðu f   Øt Üu d       Ðs                     0v                 v <v Ðs N10__cxxabiv120__si_class_type_infoE        v                 v v Ðs N10__cxxabiv121__vmi_class_type_infoE       0t               0w       !      Lw    "  #      w    $  %  èu  w St9exception    v <w w St9bad_alloc    v Xw 0w St20bad_array_new_length        w    &  \'      ìw    (  )  v ¨w w St11logic_error     Ìw    *  \'  v Øw w St12length_error    v øw w St13runtime_error   èu x St9type_info  A¨ðÜ                   ¹                       º   »   4{                            ÿÿÿÿÿÿÿÿ                                                            0x @ 	           ¹                   î       »   8}                            ÿÿÿÿ                                                                           ï                       º   ð   H                           ÿÿÿÿ\n                                                               Xy %m/%d/%y   %H:%M:%S    target_features+bulk-memory+bulk-memory-opt+call-indirect-overlong+\nmultivalue+mutable-globals+nontrapping-fptoint+reference-types+sign-ext');
}

function getBinarySync(file) {
  return file;
}

async function getWasmBinary(binaryFile) {

  // Otherwise, getBinarySync should be able to get it synchronously
  return getBinarySync(binaryFile);
}

async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile);
    var instance = await WebAssembly.instantiate(binary, imports);
    return instance;
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`);

    // Warn on some common problems.
    if (isFileURI(binaryFile)) {
      err(`warning: Loading from a file URI (${binaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
    }
    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
  // prepare imports
  var imports = {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  };
  return imports;
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm() {
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  /** @param {WebAssembly.Module=} module*/
  function receiveInstance(instance, module) {
    wasmExports = instance.exports;

    assignWasmExports(wasmExports);

    updateMemoryViews();

    return wasmExports;
  }

  // Prefer streaming instantiation if available.
  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    return receiveInstance(result['instance']);
  }

  var info = getWasmImports();

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  if (Module['instantiateWasm']) {
    return new Promise((resolve, reject) => {
      try {
        Module['instantiateWasm'](info, (inst, mod) => {
          resolve(receiveInstance(inst, mod));
        });
      } catch(e) {
        err(`Module.instantiateWasm callback failed with error: ${e}`);
        reject(e);
      }
    });
  }

  wasmBinaryFile ??= findWasmBinary();
  var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
  var exports = receiveInstantiationResult(result);
  return exports;
}

// end include: preamble.js

// Begin JS library code


  class ExitStatus {
      name = 'ExitStatus';
      constructor(status) {
        this.message = `Program terminated with exit(${status})`;
        this.status = status;
      }
    }

  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    };
  var onPostRuns = [];
  var addOnPostRun = (cb) => onPostRuns.push(cb);

  var onPreRuns = [];
  var addOnPreRun = (cb) => onPreRuns.push(cb);

  /** @noinline */
  var base64Decode = (b64) => {
      if (ENVIRONMENT_IS_NODE) {
        var buf = Buffer.from(b64, 'base64');
        return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
      }
  
      assert(b64.length % 4 == 0);
      var b1, b2, i = 0, j = 0, bLength = b64.length;
      var output = new Uint8Array((bLength*3>>2) - (b64[bLength-2] == '=') - (b64[bLength-1] == '='));
      for (; i < bLength; i += 4, j += 3) {
        b1 = base64ReverseLookup[b64.charCodeAt(i+1)];
        b2 = base64ReverseLookup[b64.charCodeAt(i+2)];
        output[j] = base64ReverseLookup[b64.charCodeAt(i)] << 2 | b1 >> 4;
        output[j+1] = b1 << 4 | b2 >> 2;
        output[j+2] = b2 << 6 | base64ReverseLookup[b64.charCodeAt(i+3)];
      }
      return output;
    };


  
    /**
   * @param {number} ptr
   * @param {string} type
   */
  function getValue(ptr, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': return HEAP8[ptr];
      case 'i8': return HEAP8[ptr];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP64[((ptr)>>3)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      case '*': return HEAPU32[((ptr)>>2)];
      default: abort(`invalid type for getValue: ${type}`);
    }
  }

  var noExitRuntime = true;

  var ptrToString = (ptr) => {
      assert(typeof ptr === 'number', `ptrToString expects a number, got ${typeof ptr}`);
      // Convert to 32-bit unsigned value
      ptr >>>= 0;
      return '0x' + ptr.toString(16).padStart(8, '0');
    };

  
    /**
   * @param {number} ptr
   * @param {number} value
   * @param {string} type
   */
  function setValue(ptr, value, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': HEAP8[ptr] = value; break;
      case 'i8': HEAP8[ptr] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': HEAP64[((ptr)>>3)] = BigInt(value); break;
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      case '*': HEAPU32[((ptr)>>2)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }

  var stackRestore = (val) => __emscripten_stack_restore(val);

  var stackSave = () => _emscripten_stack_get_current();

  var warnOnce = (text) => {
      warnOnce.shown ||= {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = 'warning: ' + text;
        err(text);
      }
    };

  

  var UTF8Decoder = globalThis.TextDecoder && new TextDecoder();
  
  var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
      var maxIdx = idx + maxBytesToRead;
      if (ignoreNul) return maxIdx;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.
      // As a tiny code save trick, compare idx against maxIdx using a negation,
      // so that maxBytesToRead=undefined/NaN means Infinity.
      while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
      return idx;
    };
  
  
    /**
   * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
   * array that contains uint8 values, returns a copy of that string as a
   * Javascript String object.
   * heapOrArray is either a regular array, or a JavaScript typed array view.
   * @param {number=} idx
   * @param {number=} maxBytesToRead
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */
  var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
  
      var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
  
      // When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 0xF8) != 0xF0) warnOnce('Invalid UTF-8 leading byte ' + ptrToString(u0) + ' encountered when deserializing a UTF-8 string in wasm memory to a JS string!');
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
  
        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };
  
    /**
   * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
   * emscripten HEAP, returns a copy of that string as a Javascript String object.
   *
   * @param {number} ptr
   * @param {number=} maxBytesToRead - An optional length that specifies the
   *   maximum number of bytes to read. You can omit this parameter to scan the
   *   string until the first 0 byte. If maxBytesToRead is passed, and the string
   *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
   *   string will cut short at that byte index.
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */
  var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => {
      assert(typeof ptr == 'number', `UTF8ToString expects a number (got ${typeof ptr})`);
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : '';
    };
  var ___assert_fail = (condition, filename, line, func) =>
      abort(`Assertion failed: ${UTF8ToString(condition)}, at: ` + [filename ? UTF8ToString(filename) : 'unknown filename', line, func ? UTF8ToString(func) : 'unknown function']);

  class ExceptionInfo {
      // excPtr - Thrown object pointer to wrap. Metadata pointer is calculated from it.
      constructor(excPtr) {
        this.excPtr = excPtr;
        this.ptr = excPtr - 24;
      }
  
      set_type(type) {
        HEAPU32[(((this.ptr)+(4))>>2)] = type;
      }
  
      get_type() {
        return HEAPU32[(((this.ptr)+(4))>>2)];
      }
  
      set_destructor(destructor) {
        HEAPU32[(((this.ptr)+(8))>>2)] = destructor;
      }
  
      get_destructor() {
        return HEAPU32[(((this.ptr)+(8))>>2)];
      }
  
      set_caught(caught) {
        caught = caught ? 1 : 0;
        HEAP8[(this.ptr)+(12)] = caught;
      }
  
      get_caught() {
        return HEAP8[(this.ptr)+(12)] != 0;
      }
  
      set_rethrown(rethrown) {
        rethrown = rethrown ? 1 : 0;
        HEAP8[(this.ptr)+(13)] = rethrown;
      }
  
      get_rethrown() {
        return HEAP8[(this.ptr)+(13)] != 0;
      }
  
      // Initialize native structure fields. Should be called once after allocated.
      init(type, destructor) {
        this.set_adjusted_ptr(0);
        this.set_type(type);
        this.set_destructor(destructor);
      }
  
      set_adjusted_ptr(adjustedPtr) {
        HEAPU32[(((this.ptr)+(16))>>2)] = adjustedPtr;
      }
  
      get_adjusted_ptr() {
        return HEAPU32[(((this.ptr)+(16))>>2)];
      }
    }
  
  var exceptionLast = 0;
  
  var uncaughtExceptionCount = 0;
  var ___cxa_throw = (ptr, type, destructor) => {
      var info = new ExceptionInfo(ptr);
      // Initialize ExceptionInfo content after it was allocated in __cxa_allocate_exception.
      info.init(type, destructor);
      exceptionLast = ptr;
      uncaughtExceptionCount++;
      assert(false, 'Exception thrown, but exception catching is not enabled. Compile with -sNO_DISABLE_EXCEPTION_CATCHING or -sEXCEPTION_CATCHING_ALLOWED=[..] to catch.');
    };

  var __abort_js = () =>
      abort('native code called abort()');

  var structRegistrations = {
  };
  
  var runDestructors = (destructors) => {
      while (destructors.length) {
        var ptr = destructors.pop();
        var del = destructors.pop();
        del(ptr);
      }
    };
  
  /** @suppress {globalThis} */
  function readPointer(pointer) {
      return this.fromWireType(HEAPU32[((pointer)>>2)]);
    }
  
  var awaitingDependencies = {
  };
  
  var registeredTypes = {
  };
  
  var typeDependencies = {
  };
  
  var InternalError =  class InternalError extends Error { constructor(message) { super(message); this.name = 'InternalError'; }};
  var throwInternalError = (message) => { throw new InternalError(message); };
  var whenDependentTypesAreResolved = (myTypes, dependentTypes, getTypeConverters) => {
      myTypes.forEach((type) => typeDependencies[type] = dependentTypes);
  
      function onComplete(typeConverters) {
        var myTypeConverters = getTypeConverters(typeConverters);
        if (myTypeConverters.length !== myTypes.length) {
          throwInternalError('Mismatched type converter count');
        }
        for (var i = 0; i < myTypes.length; ++i) {
          registerType(myTypes[i], myTypeConverters[i]);
        }
      }
  
      var typeConverters = new Array(dependentTypes.length);
      var unregisteredTypes = [];
      var registered = 0;
      for (let [i, dt] of dependentTypes.entries()) {
        if (registeredTypes.hasOwnProperty(dt)) {
          typeConverters[i] = registeredTypes[dt];
        } else {
          unregisteredTypes.push(dt);
          if (!awaitingDependencies.hasOwnProperty(dt)) {
            awaitingDependencies[dt] = [];
          }
          awaitingDependencies[dt].push(() => {
            typeConverters[i] = registeredTypes[dt];
            ++registered;
            if (registered === unregisteredTypes.length) {
              onComplete(typeConverters);
            }
          });
        }
      }
      if (0 === unregisteredTypes.length) {
        onComplete(typeConverters);
      }
    };
  var __embind_finalize_value_object = (structType) => {
      var reg = structRegistrations[structType];
      delete structRegistrations[structType];
  
      var rawConstructor = reg.rawConstructor;
      var rawDestructor = reg.rawDestructor;
      var fieldRecords = reg.fields;
      var fieldTypes = fieldRecords.map((field) => field.getterReturnType).
                concat(fieldRecords.map((field) => field.setterArgumentType));
      whenDependentTypesAreResolved([structType], fieldTypes, (fieldTypes) => {
        var fields = {};
        for (var [i, field] of fieldRecords.entries()) {
          const getterReturnType = fieldTypes[i];
          const getter = field.getter;
          const getterContext = field.getterContext;
          const setterArgumentType = fieldTypes[i + fieldRecords.length];
          const setter = field.setter;
          const setterContext = field.setterContext;
          fields[field.fieldName] = {
            read: (ptr) => getterReturnType.fromWireType(getter(getterContext, ptr)),
            write: (ptr, o) => {
              var destructors = [];
              setter(setterContext, ptr, setterArgumentType.toWireType(destructors, o));
              runDestructors(destructors);
            },
            optional: getterReturnType.optional,
          };
        }
  
        return [{
          name: reg.name,
          fromWireType: (ptr) => {
            var rv = {};
            for (var i in fields) {
              rv[i] = fields[i].read(ptr);
            }
            rawDestructor(ptr);
            return rv;
          },
          toWireType: (destructors, o) => {
            // todo: Here we have an opportunity for -O3 level "unsafe" optimizations:
            // assume all fields are present without checking.
            for (var fieldName in fields) {
              if (!(fieldName in o) && !fields[fieldName].optional) {
                throw new TypeError(`Missing field: "${fieldName}"`);
              }
            }
            var ptr = rawConstructor();
            for (fieldName in fields) {
              fields[fieldName].write(ptr, o[fieldName]);
            }
            if (destructors !== null) {
              destructors.push(rawDestructor, ptr);
            }
            return ptr;
          },
          readValueFromPointer: readPointer,
          destructorFunction: rawDestructor,
        }];
      });
    };

  var AsciiToString = (ptr) => {
      var str = '';
      while (1) {
        var ch = HEAPU8[ptr++];
        if (!ch) return str;
        str += String.fromCharCode(ch);
      }
    };
  
  
  
  
  var BindingError =  class BindingError extends Error { constructor(message) { super(message); this.name = 'BindingError'; }};
  var throwBindingError = (message) => { throw new BindingError(message); };
  /** @param {Object=} options */
  function sharedRegisterType(rawType, registeredInstance, options = {}) {
      var name = registeredInstance.name;
      if (!rawType) {
        throwBindingError(`type "${name}" must have a positive integer typeid pointer`);
      }
      if (registeredTypes.hasOwnProperty(rawType)) {
        if (options.ignoreDuplicateRegistrations) {
          return;
        } else {
          throwBindingError(`Cannot register type '${name}' twice`);
        }
      }
  
      registeredTypes[rawType] = registeredInstance;
      delete typeDependencies[rawType];
  
      if (awaitingDependencies.hasOwnProperty(rawType)) {
        var callbacks = awaitingDependencies[rawType];
        delete awaitingDependencies[rawType];
        callbacks.forEach((cb) => cb());
      }
    }
  /** @param {Object=} options */
  function registerType(rawType, registeredInstance, options = {}) {
      return sharedRegisterType(rawType, registeredInstance, options);
    }
  
  var integerReadValueFromPointer = (name, width, signed) => {
      // integers are quite common, so generate very specialized functions
      switch (width) {
        case 1: return signed ?
          (pointer) => HEAP8[pointer] :
          (pointer) => HEAPU8[pointer];
        case 2: return signed ?
          (pointer) => HEAP16[((pointer)>>1)] :
          (pointer) => HEAPU16[((pointer)>>1)]
        case 4: return signed ?
          (pointer) => HEAP32[((pointer)>>2)] :
          (pointer) => HEAPU32[((pointer)>>2)]
        case 8: return signed ?
          (pointer) => HEAP64[((pointer)>>3)] :
          (pointer) => HEAPU64[((pointer)>>3)]
        default:
          throw new TypeError(`invalid integer width (${width}): ${name}`);
      }
    };
  
  var embindRepr = (v) => {
      if (v === null) {
          return 'null';
      }
      var t = typeof v;
      if (t === 'object' || t === 'array' || t === 'function') {
          return v.toString();
      } else {
          return '' + v;
      }
    };
  
  var assertIntegerRange = (typeName, value, minRange, maxRange) => {
      if (value < minRange || value > maxRange) {
        throw new TypeError(`Passing a number "${embindRepr(value)}" from JS side to C/C++ side to an argument of type "${typeName}", which is outside the valid range [${minRange}, ${maxRange}]!`);
      }
    };
  /** @suppress {globalThis} */
  var __embind_register_bigint = (primitiveType, name, size, minRange, maxRange) => {
      name = AsciiToString(name);
  
      const isUnsignedType = minRange === 0n;
  
      let fromWireType = (value) => value;
      if (isUnsignedType) {
        // uint64 get converted to int64 in ABI, fix them up like we do for 32-bit integers.
        const bitSize = size * 8;
        fromWireType = (value) => {
          return BigInt.asUintN(bitSize, value);
        }
        maxRange = fromWireType(maxRange);
      }
  
      registerType(primitiveType, {
        name,
        fromWireType: fromWireType,
        toWireType: (destructors, value) => {
          if (typeof value == "number") {
            value = BigInt(value);
          }
          else if (typeof value != "bigint") {
            throw new TypeError(`Cannot convert "${embindRepr(value)}" to ${this.name}`);
          }
          assertIntegerRange(name, value, minRange, maxRange);
          return value;
        },
        readValueFromPointer: integerReadValueFromPointer(name, size, !isUnsignedType),
        destructorFunction: null, // This type does not need a destructor
      });
    };

  
  /** @suppress {globalThis} */
  var __embind_register_bool = (rawType, name, trueValue, falseValue) => {
      name = AsciiToString(name);
      registerType(rawType, {
        name,
        fromWireType: function(wt) {
          // ambiguous emscripten ABI: sometimes return values are
          // true or false, and sometimes integers (0 or 1)
          return !!wt;
        },
        toWireType: function(destructors, o) {
          return o ? trueValue : falseValue;
        },
        readValueFromPointer: function(pointer) {
          return this.fromWireType(HEAPU8[pointer]);
        },
        destructorFunction: null, // This type does not need a destructor
      });
    };

  
  
  var shallowCopyInternalPointer = (o) => {
      return {
        count: o.count,
        deleteScheduled: o.deleteScheduled,
        preservePointerOnDelete: o.preservePointerOnDelete,
        ptr: o.ptr,
        ptrType: o.ptrType,
        smartPtr: o.smartPtr,
        smartPtrType: o.smartPtrType,
      };
    };
  
  var throwInstanceAlreadyDeleted = (obj) => {
      function getInstanceTypeName(handle) {
        return handle.$$.ptrType.registeredClass.name;
      }
      throwBindingError(getInstanceTypeName(obj) + ' instance already deleted');
    };
  
  var finalizationRegistry = false;
  
  var detachFinalizer = (handle) => {};
  
  var runDestructor = ($$) => {
      if ($$.smartPtr) {
        $$.smartPtrType.rawDestructor($$.smartPtr);
      } else {
        $$.ptrType.registeredClass.rawDestructor($$.ptr);
      }
    };
  var releaseClassHandle = ($$) => {
      $$.count.value -= 1;
      var toDelete = 0 === $$.count.value;
      if (toDelete) {
        runDestructor($$);
      }
    };
  
  var downcastPointer = (ptr, ptrClass, desiredClass) => {
      if (ptrClass === desiredClass) {
        return ptr;
      }
      if (undefined === desiredClass.baseClass) {
        return null; // no conversion
      }
  
      var rv = downcastPointer(ptr, ptrClass, desiredClass.baseClass);
      if (rv === null) {
        return null;
      }
      return desiredClass.downcast(rv);
    };
  
  var registeredPointers = {
  };
  
  var registeredInstances = {
  };
  
  var getBasestPointer = (class_, ptr) => {
      if (ptr === undefined) {
          throwBindingError('ptr should not be undefined');
      }
      while (class_.baseClass) {
          ptr = class_.upcast(ptr);
          class_ = class_.baseClass;
      }
      return ptr;
    };
  var getInheritedInstance = (class_, ptr) => {
      ptr = getBasestPointer(class_, ptr);
      return registeredInstances[ptr];
    };
  
  
  var makeClassHandle = (prototype, record) => {
      if (!record.ptrType || !record.ptr) {
        throwInternalError('makeClassHandle requires ptr and ptrType');
      }
      var hasSmartPtrType = !!record.smartPtrType;
      var hasSmartPtr = !!record.smartPtr;
      if (hasSmartPtrType !== hasSmartPtr) {
        throwInternalError('Both smartPtrType and smartPtr must be specified');
      }
      record.count = { value: 1 };
      return attachFinalizer(Object.create(prototype, {
        $$: {
          value: record,
          writable: true,
        },
      }));
    };
  /** @suppress {globalThis} */
  function RegisteredPointer_fromWireType(ptr) {
      // ptr is a raw pointer (or a raw smartpointer)
  
      // rawPointer is a maybe-null raw pointer
      var rawPointer = this.getPointee(ptr);
      if (!rawPointer) {
        this.destructor(ptr);
        return null;
      }
  
      var registeredInstance = getInheritedInstance(this.registeredClass, rawPointer);
      if (undefined !== registeredInstance) {
        // JS object has been neutered, time to repopulate it
        if (0 === registeredInstance.$$.count.value) {
          registeredInstance.$$.ptr = rawPointer;
          registeredInstance.$$.smartPtr = ptr;
          return registeredInstance['clone']();
        } else {
          // else, just increment reference count on existing object
          // it already has a reference to the smart pointer
          var rv = registeredInstance['clone']();
          this.destructor(ptr);
          return rv;
        }
      }
  
      function makeDefaultHandle() {
        if (this.isSmartPointer) {
          return makeClassHandle(this.registeredClass.instancePrototype, {
            ptrType: this.pointeeType,
            ptr: rawPointer,
            smartPtrType: this,
            smartPtr: ptr,
          });
        } else {
          return makeClassHandle(this.registeredClass.instancePrototype, {
            ptrType: this,
            ptr,
          });
        }
      }
  
      var actualType = this.registeredClass.getActualType(rawPointer);
      var registeredPointerRecord = registeredPointers[actualType];
      if (!registeredPointerRecord) {
        return makeDefaultHandle.call(this);
      }
  
      var toType;
      if (this.isConst) {
        toType = registeredPointerRecord.constPointerType;
      } else {
        toType = registeredPointerRecord.pointerType;
      }
      var dp = downcastPointer(
          rawPointer,
          this.registeredClass,
          toType.registeredClass);
      if (dp === null) {
        return makeDefaultHandle.call(this);
      }
      if (this.isSmartPointer) {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
          ptrType: toType,
          ptr: dp,
          smartPtrType: this,
          smartPtr: ptr,
        });
      } else {
        return makeClassHandle(toType.registeredClass.instancePrototype, {
          ptrType: toType,
          ptr: dp,
        });
      }
    }
  var attachFinalizer = (handle) => {
      if (!globalThis.FinalizationRegistry) {
        attachFinalizer = (handle) => handle;
        return handle;
      }
      // If the running environment has a FinalizationRegistry (see
      // https://github.com/tc39/proposal-weakrefs), then attach finalizers
      // for class handles.  We check for the presence of FinalizationRegistry
      // at run-time, not build-time.
      finalizationRegistry = new FinalizationRegistry((info) => {
        console.warn(info.leakWarning);
        releaseClassHandle(info.$$);
      });
      attachFinalizer = (handle) => {
        var $$ = handle.$$;
        var hasSmartPtr = !!$$.smartPtr;
        if (hasSmartPtr) {
          // We should not call the destructor on raw pointers in case other code expects the pointee to live
          var info = { $$: $$ };
          // Create a warning as an Error instance in advance so that we can store
          // the current stacktrace and point to it when / if a leak is detected.
          // This is more useful than the empty stacktrace of `FinalizationRegistry`
          // callback.
          var cls = $$.ptrType.registeredClass;
          var err = new Error(`Embind found a leaked C++ instance ${cls.name} <${ptrToString($$.ptr)}>.\n` +
          "We'll free it automatically in this case, but this functionality is not reliable across various environments.\n" +
          "Make sure to invoke .delete() manually once you're done with the instance instead.\n" +
          "Originally allocated"); // `.stack` will add "at ..." after this sentence
          if ('captureStackTrace' in Error) {
            Error.captureStackTrace(err, RegisteredPointer_fromWireType);
          }
          info.leakWarning = err.stack.replace(/^Error: /, '');
          finalizationRegistry.register(handle, info, handle);
        }
        return handle;
      };
      detachFinalizer = (handle) => finalizationRegistry.unregister(handle);
      return attachFinalizer(handle);
    };
  
  
  
  
  var deletionQueue = [];
  var flushPendingDeletes = () => {
      while (deletionQueue.length) {
        var obj = deletionQueue.pop();
        obj.$$.deleteScheduled = false;
        obj['delete']();
      }
    };
  
  var delayFunction;
  var init_ClassHandle = () => {
      let proto = ClassHandle.prototype;
  
      Object.assign(proto, {
        "isAliasOf"(other) {
          if (!(this instanceof ClassHandle)) {
            return false;
          }
          if (!(other instanceof ClassHandle)) {
            return false;
          }
  
          var leftClass = this.$$.ptrType.registeredClass;
          var left = this.$$.ptr;
          other.$$ = /** @type {Object} */ (other.$$);
          var rightClass = other.$$.ptrType.registeredClass;
          var right = other.$$.ptr;
  
          while (leftClass.baseClass) {
            left = leftClass.upcast(left);
            leftClass = leftClass.baseClass;
          }
  
          while (rightClass.baseClass) {
            right = rightClass.upcast(right);
            rightClass = rightClass.baseClass;
          }
  
          return leftClass === rightClass && left === right;
        },
  
        "clone"() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
  
          if (this.$$.preservePointerOnDelete) {
            this.$$.count.value += 1;
            return this;
          } else {
            var clone = attachFinalizer(Object.create(Object.getPrototypeOf(this), {
              $$: {
                value: shallowCopyInternalPointer(this.$$),
              }
            }));
  
            clone.$$.count.value += 1;
            clone.$$.deleteScheduled = false;
            return clone;
          }
        },
  
        "delete"() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
  
          if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
            throwBindingError('Object already scheduled for deletion');
          }
  
          detachFinalizer(this);
          releaseClassHandle(this.$$);
  
          if (!this.$$.preservePointerOnDelete) {
            this.$$.smartPtr = undefined;
            this.$$.ptr = undefined;
          }
        },
  
        "isDeleted"() {
          return !this.$$.ptr;
        },
  
        "deleteLater"() {
          if (!this.$$.ptr) {
            throwInstanceAlreadyDeleted(this);
          }
          if (this.$$.deleteScheduled && !this.$$.preservePointerOnDelete) {
            throwBindingError('Object already scheduled for deletion');
          }
          deletionQueue.push(this);
          if (deletionQueue.length === 1 && delayFunction) {
            delayFunction(flushPendingDeletes);
          }
          this.$$.deleteScheduled = true;
          return this;
        },
      });
  
      // Support `using ...` from https://github.com/tc39/proposal-explicit-resource-management.
      const symbolDispose = Symbol.dispose;
      if (symbolDispose) {
        proto[symbolDispose] = proto['delete'];
      }
    };
  /** @constructor */
  function ClassHandle() {
    }
  
  var createNamedFunction = (name, func) => Object.defineProperty(func, 'name', { value: name });
  
  
  var ensureOverloadTable = (proto, methodName, humanName) => {
      if (undefined === proto[methodName].overloadTable) {
        var prevFunc = proto[methodName];
        // Inject an overload resolver function that routes to the appropriate overload based on the number of arguments.
        proto[methodName] = function(...args) {
          // TODO This check can be removed in -O3 level "unsafe" optimizations.
          if (!proto[methodName].overloadTable.hasOwnProperty(args.length)) {
            throwBindingError(`Function '${humanName}' called with an invalid number of arguments (${args.length}) - expects one of (${proto[methodName].overloadTable})!`);
          }
          return proto[methodName].overloadTable[args.length].apply(this, args);
        };
        // Move the previous function into the overload table.
        proto[methodName].overloadTable = [];
        proto[methodName].overloadTable[prevFunc.argCount] = prevFunc;
      }
    };
  
  /** @param {number=} numArguments */
  var exposePublicSymbol = (name, value, numArguments) => {
      if (Module.hasOwnProperty(name)) {
        if (undefined === numArguments || (undefined !== Module[name].overloadTable && undefined !== Module[name].overloadTable[numArguments])) {
          throwBindingError(`Cannot register public name '${name}' twice`);
        }
  
        // We are exposing a function with the same name as an existing function. Create an overload table and a function selector
        // that routes between the two.
        ensureOverloadTable(Module, name, name);
        if (Module[name].overloadTable.hasOwnProperty(numArguments)) {
          throwBindingError(`Cannot register multiple overloads of a function with the same number of arguments (${numArguments})!`);
        }
        // Add the new function into the overload table.
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        Module[name].argCount = numArguments;
      }
    };
  
  var char_0 = 48;
  
  var char_9 = 57;
  var makeLegalFunctionName = (name) => {
      assert(typeof name === 'string');
      name = name.replace(/[^a-zA-Z0-9_]/g, '$');
      var f = name.charCodeAt(0);
      if (f >= char_0 && f <= char_9) {
        return `_${name}`;
      }
      return name;
    };
  
  
  /** @constructor */
  function RegisteredClass(name,
                               constructor,
                               instancePrototype,
                               rawDestructor,
                               baseClass,
                               getActualType,
                               upcast,
                               downcast) {
      this.name = name;
      this.constructor = constructor;
      this.instancePrototype = instancePrototype;
      this.rawDestructor = rawDestructor;
      this.baseClass = baseClass;
      this.getActualType = getActualType;
      this.upcast = upcast;
      this.downcast = downcast;
      this.pureVirtualFunctions = [];
    }
  
  
  var upcastPointer = (ptr, ptrClass, desiredClass) => {
      while (ptrClass !== desiredClass) {
        if (!ptrClass.upcast) {
          throwBindingError(`Expected null or instance of ${desiredClass.name}, got an instance of ${ptrClass.name}`);
        }
        ptr = ptrClass.upcast(ptr);
        ptrClass = ptrClass.baseClass;
      }
      return ptr;
    };
  
  /** @suppress {globalThis} */
  function constNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError(`null is not a valid ${this.name}`);
        }
        return 0;
      }
  
      if (!handle.$$) {
        throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
      }
      if (!handle.$$.ptr) {
        throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
  
  
  /** @suppress {globalThis} */
  function genericPointerToWireType(destructors, handle) {
      var ptr;
      if (handle === null) {
        if (this.isReference) {
          throwBindingError(`null is not a valid ${this.name}`);
        }
  
        if (this.isSmartPointer) {
          ptr = this.rawConstructor();
          if (destructors !== null) {
            destructors.push(this.rawDestructor, ptr);
          }
          return ptr;
        } else {
          return 0;
        }
      }
  
      if (!handle || !handle.$$) {
        throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
      }
      if (!handle.$$.ptr) {
        throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
      }
      if (!this.isConst && handle.$$.ptrType.isConst) {
        throwBindingError(`Cannot convert argument of type ${(handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name)} to parameter type ${this.name}`);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
  
      if (this.isSmartPointer) {
        // TODO: this is not strictly true
        // We could support BY_EMVAL conversions from raw pointers to smart pointers
        // because the smart pointer can hold a reference to the handle
        if (undefined === handle.$$.smartPtr) {
          throwBindingError('Passing raw pointer to smart pointer is illegal');
        }
  
        switch (this.sharingPolicy) {
          case 0: // NONE
            // no upcasting
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              throwBindingError(`Cannot convert argument of type ${(handle.$$.smartPtrType ? handle.$$.smartPtrType.name : handle.$$.ptrType.name)} to parameter type ${this.name}`);
            }
            break;
  
          case 1: // INTRUSIVE
            ptr = handle.$$.smartPtr;
            break;
  
          case 2: // BY_EMVAL
            if (handle.$$.smartPtrType === this) {
              ptr = handle.$$.smartPtr;
            } else {
              var clonedHandle = handle['clone']();
              ptr = this.rawShare(
                ptr,
                Emval.toHandle(() => clonedHandle['delete']())
              );
              if (destructors !== null) {
                destructors.push(this.rawDestructor, ptr);
              }
            }
            break;
  
          default:
            throwBindingError('Unsupported sharing policy');
        }
      }
      return ptr;
    }
  
  
  
  /** @suppress {globalThis} */
  function nonConstNoSmartPtrRawPointerToWireType(destructors, handle) {
      if (handle === null) {
        if (this.isReference) {
          throwBindingError(`null is not a valid ${this.name}`);
        }
        return 0;
      }
  
      if (!handle.$$) {
        throwBindingError(`Cannot pass "${embindRepr(handle)}" as a ${this.name}`);
      }
      if (!handle.$$.ptr) {
        throwBindingError(`Cannot pass deleted object as a pointer of type ${this.name}`);
      }
      if (handle.$$.ptrType.isConst) {
        throwBindingError(`Cannot convert argument of type ${handle.$$.ptrType.name} to parameter type ${this.name}`);
      }
      var handleClass = handle.$$.ptrType.registeredClass;
      var ptr = upcastPointer(handle.$$.ptr, handleClass, this.registeredClass);
      return ptr;
    }
  
  
  
  var init_RegisteredPointer = () => {
      Object.assign(RegisteredPointer.prototype, {
        getPointee(ptr) {
          if (this.rawGetPointee) {
            ptr = this.rawGetPointee(ptr);
          }
          return ptr;
        },
        destructor(ptr) {
          this.rawDestructor?.(ptr);
        },
        readValueFromPointer: readPointer,
        fromWireType: RegisteredPointer_fromWireType,
      });
    };
  /** @constructor
    @param {*=} pointeeType,
    @param {*=} sharingPolicy,
    @param {*=} rawGetPointee,
    @param {*=} rawConstructor,
    @param {*=} rawShare,
    @param {*=} rawDestructor,
     */
  function RegisteredPointer(
      name,
      registeredClass,
      isReference,
      isConst,
  
      // smart pointer properties
      isSmartPointer,
      pointeeType,
      sharingPolicy,
      rawGetPointee,
      rawConstructor,
      rawShare,
      rawDestructor
    ) {
      this.name = name;
      this.registeredClass = registeredClass;
      this.isReference = isReference;
      this.isConst = isConst;
  
      // smart pointer properties
      this.isSmartPointer = isSmartPointer;
      this.pointeeType = pointeeType;
      this.sharingPolicy = sharingPolicy;
      this.rawGetPointee = rawGetPointee;
      this.rawConstructor = rawConstructor;
      this.rawShare = rawShare;
      this.rawDestructor = rawDestructor;
  
      if (!isSmartPointer && registeredClass.baseClass === undefined) {
        if (isConst) {
          this.toWireType = constNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        } else {
          this.toWireType = nonConstNoSmartPtrRawPointerToWireType;
          this.destructorFunction = null;
        }
      } else {
        this.toWireType = genericPointerToWireType;
        // Here we must leave this.destructorFunction undefined, since whether genericPointerToWireType returns
        // a pointer that needs to be freed up is runtime-dependent, and cannot be evaluated at registration time.
        // TODO: Create an alternative mechanism that allows removing the use of var destructors = []; array in
        //       craftInvokerFunction altogether.
      }
    }
  
  /** @param {number=} numArguments */
  var replacePublicSymbol = (name, value, numArguments) => {
      if (!Module.hasOwnProperty(name)) {
        throwInternalError('Replacing nonexistent public symbol');
      }
      // If there's an overload table for this symbol, replace the symbol in the overload table instead.
      if (undefined !== Module[name].overloadTable && undefined !== numArguments) {
        Module[name].overloadTable[numArguments] = value;
      } else {
        Module[name] = value;
        Module[name].argCount = numArguments;
      }
    };
  
  
  
  var wasmTableMirror = [];
  
  
  var getWasmTableEntry = (funcPtr) => {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        /** @suppress {checkTypes} */
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      /** @suppress {checkTypes} */
      assert(wasmTable.get(funcPtr) == func, 'JavaScript-side Wasm function table mirror is out of date!');
      return func;
    };
  var embind__requireFunction = (signature, rawFunction, isAsync = false) => {
      assert(!isAsync, 'Async bindings are only supported with JSPI.');
  
      signature = AsciiToString(signature);
  
      function makeDynCaller() {
        var rtn = getWasmTableEntry(rawFunction);
        return rtn;
      }
  
      var fp = makeDynCaller();
      if (typeof fp != 'function') {
          throwBindingError(`unknown function pointer with signature ${signature}: ${rawFunction}`);
      }
      return fp;
    };
  
  
  
  class UnboundTypeError extends Error {}
  
  
  
  var getTypeName = (type) => {
      var ptr = ___getTypeName(type);
      var rv = AsciiToString(ptr);
      _free(ptr);
      return rv;
    };
  var throwUnboundTypeError = (message, types) => {
      var unboundTypes = [];
      var seen = {};
      function visit(type) {
        if (seen[type]) {
          return;
        }
        if (registeredTypes[type]) {
          return;
        }
        if (typeDependencies[type]) {
          typeDependencies[type].forEach(visit);
          return;
        }
        unboundTypes.push(type);
        seen[type] = true;
      }
      types.forEach(visit);
  
      throw new UnboundTypeError(`${message}: ` + unboundTypes.map(getTypeName).join([', ']));
    };
  
  var __embind_register_class = (rawType,
                             rawPointerType,
                             rawConstPointerType,
                             baseClassRawType,
                             getActualTypeSignature,
                             getActualType,
                             upcastSignature,
                             upcast,
                             downcastSignature,
                             downcast,
                             name,
                             destructorSignature,
                             rawDestructor) => {
      name = AsciiToString(name);
      getActualType = embind__requireFunction(getActualTypeSignature, getActualType);
      upcast &&= embind__requireFunction(upcastSignature, upcast);
      downcast &&= embind__requireFunction(downcastSignature, downcast);
      rawDestructor = embind__requireFunction(destructorSignature, rawDestructor);
      var legalFunctionName = makeLegalFunctionName(name);
  
      exposePublicSymbol(legalFunctionName, function() {
        // this code cannot run if baseClassRawType is zero
        throwUnboundTypeError(`Cannot construct ${name} due to unbound types`, [baseClassRawType]);
      });
  
      whenDependentTypesAreResolved(
        [rawType, rawPointerType, rawConstPointerType],
        baseClassRawType ? [baseClassRawType] : [],
        (base) => {
          base = base[0];
  
          var baseClass;
          var basePrototype;
          if (baseClassRawType) {
            baseClass = base.registeredClass;
            basePrototype = baseClass.instancePrototype;
          } else {
            basePrototype = ClassHandle.prototype;
          }
  
          var constructor = createNamedFunction(name, function(...args) {
            if (Object.getPrototypeOf(this) !== instancePrototype) {
              throw new BindingError(`Use 'new' to construct ${name}`);
            }
            if (undefined === registeredClass.constructor_body) {
              throw new BindingError(`${name} has no accessible constructor`);
            }
            var body = registeredClass.constructor_body[args.length];
            if (undefined === body) {
              throw new BindingError(`Tried to invoke ctor of ${name} with invalid number of parameters (${args.length}) - expected (${Object.keys(registeredClass.constructor_body).toString()}) parameters instead!`);
            }
            return body.apply(this, args);
          });
  
          var instancePrototype = Object.create(basePrototype, {
            constructor: { value: constructor },
          });
  
          constructor.prototype = instancePrototype;
  
          var registeredClass = new RegisteredClass(name,
                                                    constructor,
                                                    instancePrototype,
                                                    rawDestructor,
                                                    baseClass,
                                                    getActualType,
                                                    upcast,
                                                    downcast);
  
          if (registeredClass.baseClass) {
            // Keep track of class hierarchy. Used to allow sub-classes to inherit class functions.
            registeredClass.baseClass.__derivedClasses ??= [];
  
            registeredClass.baseClass.__derivedClasses.push(registeredClass);
          }
  
          var referenceConverter = new RegisteredPointer(name,
                                                         registeredClass,
                                                         true,
                                                         false,
                                                         false);
  
          var pointerConverter = new RegisteredPointer(name + '*',
                                                       registeredClass,
                                                       false,
                                                       false,
                                                       false);
  
          var constPointerConverter = new RegisteredPointer(name + ' const*',
                                                            registeredClass,
                                                            false,
                                                            true,
                                                            false);
  
          registeredPointers[rawType] = {
            pointerType: pointerConverter,
            constPointerType: constPointerConverter
          };
  
          replacePublicSymbol(legalFunctionName, constructor);
  
          return [referenceConverter, pointerConverter, constPointerConverter];
        }
      );
    };

  
  
  
  function usesDestructorStack(argTypes) {
      // Skip return value at index 0 - it's not deleted here.
      for (var i = 1; i < argTypes.length; ++i) {
        // The type does not define a destructor function - must use dynamic stack
        if (argTypes[i] !== null && argTypes[i].destructorFunction === undefined) {
          return true;
        }
      }
      return false;
    }
  
  
  function checkArgCount(numArgs, minArgs, maxArgs, humanName, throwBindingError) {
      if (numArgs < minArgs || numArgs > maxArgs) {
        var argCountMessage = minArgs == maxArgs ? minArgs : `${minArgs} to ${maxArgs}`;
        throwBindingError(`function ${humanName} called with ${numArgs} arguments, expected ${argCountMessage}`);
      }
    }
  function createJsInvoker(argTypes, isClassMethodFunc, returns, isAsync) {
      var needsDestructorStack = usesDestructorStack(argTypes);
      var argCount = argTypes.length - 2;
      var argsList = [];
      var argsListWired = ['fn'];
      if (isClassMethodFunc) {
        argsListWired.push('thisWired');
      }
      for (var i = 0; i < argCount; ++i) {
        argsList.push(`arg${i}`)
        argsListWired.push(`arg${i}Wired`)
      }
      argsList = argsList.join(',')
      argsListWired = argsListWired.join(',')
  
      var invokerFnBody = `return function (${argsList}) {\n`;
  
      invokerFnBody += "checkArgCount(arguments.length, minArgs, maxArgs, humanName, throwBindingError);\n";
  
      if (needsDestructorStack) {
        invokerFnBody += "var destructors = [];\n";
      }
  
      var dtorStack = needsDestructorStack ? "destructors" : "null";
      var args1 = ["humanName", "throwBindingError", "invoker", "fn", "runDestructors", "fromRetWire", "toClassParamWire"];
  
      if (isClassMethodFunc) {
        invokerFnBody += `var thisWired = toClassParamWire(${dtorStack}, this);\n`;
      }
  
      for (var i = 0; i < argCount; ++i) {
        var argName = `toArg${i}Wire`;
        invokerFnBody += `var arg${i}Wired = ${argName}(${dtorStack}, arg${i});\n`;
        args1.push(argName);
      }
  
      invokerFnBody += (returns || isAsync ? "var rv = ":"") + `invoker(${argsListWired});\n`;
  
      var returnVal = returns ? "rv" : "";
  
      if (needsDestructorStack) {
        invokerFnBody += "runDestructors(destructors);\n";
      } else {
        for (var i = isClassMethodFunc?1:2; i < argTypes.length; ++i) { // Skip return value at index 0 - it's not deleted here. Also skip class type if not a method.
          var paramName = (i === 1 ? "thisWired" : ("arg"+(i - 2)+"Wired"));
          if (argTypes[i].destructorFunction !== null) {
            invokerFnBody += `${paramName}_dtor(${paramName});\n`;
            args1.push(`${paramName}_dtor`);
          }
        }
      }
  
      if (returns) {
        invokerFnBody += "var ret = fromRetWire(rv);\n" +
                         "return ret;\n";
      } else {
      }
  
      invokerFnBody += "}\n";
  
      args1.push('checkArgCount', 'minArgs', 'maxArgs');
      invokerFnBody = `if (arguments.length !== ${args1.length}){ throw new Error(humanName + "Expected ${args1.length} closure arguments " + arguments.length + " given."); }\n${invokerFnBody}`;
      return new Function(args1, invokerFnBody);
    }
  
  function getRequiredArgCount(argTypes) {
      var requiredArgCount = argTypes.length - 2;
      for (var i = argTypes.length - 1; i >= 2; --i) {
        if (!argTypes[i].optional) {
          break;
        }
        requiredArgCount--;
      }
      return requiredArgCount;
    }
  
  function craftInvokerFunction(humanName, argTypes, classType, cppInvokerFunc, cppTargetFunc, /** boolean= */ isAsync) {
      // humanName: a human-readable string name for the function to be generated.
      // argTypes: An array that contains the embind type objects for all types in the function signature.
      //    argTypes[0] is the type object for the function return value.
      //    argTypes[1] is the type object for function this object/class type, or null if not crafting an invoker for a class method.
      //    argTypes[2...] are the actual function parameters.
      // classType: The embind type object for the class to be bound, or null if this is not a method of a class.
      // cppInvokerFunc: JS Function object to the C++-side function that interops into C++ code.
      // cppTargetFunc: Function pointer (an integer to FUNCTION_TABLE) to the target C++ function the cppInvokerFunc will end up calling.
      // isAsync: Optional. If true, returns an async function. Async bindings are only supported with JSPI.
      var argCount = argTypes.length;
  
      if (argCount < 2) {
        throwBindingError("argTypes array size mismatch! Must at least get return value and 'this' types!");
      }
  
      assert(!isAsync, 'Async bindings are only supported with JSPI.');
      var isClassMethodFunc = (argTypes[1] !== null && classType !== null);
  
      // Free functions with signature "void function()" do not need an invoker that marshalls between wire types.
      // TODO: This omits argument count check - enable only at -O3 or similar.
      //    if (ENABLE_UNSAFE_OPTS && argCount == 2 && argTypes[0].name == "void" && !isClassMethodFunc) {
      //       return FUNCTION_TABLE[fn];
      //    }
  
      // Determine if we need to use a dynamic stack to store the destructors for the function parameters.
      // TODO: Remove this completely once all function invokers are being dynamically generated.
      var needsDestructorStack = usesDestructorStack(argTypes);
  
      var returns = !argTypes[0].isVoid;
  
      var expectedArgCount = argCount - 2;
      var minArgs = getRequiredArgCount(argTypes);
      // Build the arguments that will be passed into the closure around the invoker
      // function.
      var retType = argTypes[0];
      var instType = argTypes[1];
      var closureArgs = [humanName, throwBindingError, cppInvokerFunc, cppTargetFunc, runDestructors, retType.fromWireType.bind(retType), instType?.toWireType.bind(instType)];
      for (var i = 2; i < argCount; ++i) {
        var argType = argTypes[i];
        closureArgs.push(argType.toWireType.bind(argType));
      }
      if (!needsDestructorStack) {
        // Skip return value at index 0 - it's not deleted here. Also skip class type if not a method.
        for (var i = isClassMethodFunc?1:2; i < argTypes.length; ++i) {
          if (argTypes[i].destructorFunction !== null) {
            closureArgs.push(argTypes[i].destructorFunction);
          }
        }
      }
      closureArgs.push(checkArgCount, minArgs, expectedArgCount);
  
      let invokerFactory = createJsInvoker(argTypes, isClassMethodFunc, returns, isAsync);
      var invokerFn = invokerFactory(...closureArgs);
      return createNamedFunction(humanName, invokerFn);
    }
  
  
  var heap32VectorToArray = (count, firstElement) => {
      var array = [];
      for (var i = 0; i < count; i++) {
        // TODO(https://github.com/emscripten-core/emscripten/issues/17310):
        // Find a way to hoist the `>> 2` or `>> 3` out of this loop.
        array.push(HEAPU32[(((firstElement)+(i * 4))>>2)]);
      }
      return array;
    };
  
  
  
  
  
  var getFunctionName = (signature) => {
      signature = signature.trim();
      const argsIndex = signature.indexOf("(");
      if (argsIndex === -1) return signature;
      assert(signature.endsWith(")"), "Parentheses for argument names should match.");
      return signature.slice(0, argsIndex);
    };
  var __embind_register_class_class_function = (rawClassType,
                                            methodName,
                                            argCount,
                                            rawArgTypesAddr,
                                            invokerSignature,
                                            rawInvoker,
                                            fn,
                                            isAsync,
                                            isNonnullReturn) => {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      methodName = AsciiToString(methodName);
      methodName = getFunctionName(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker, isAsync);
      whenDependentTypesAreResolved([], [rawClassType], (classType) => {
        classType = classType[0];
        var humanName = `${classType.name}.${methodName}`;
  
        function unboundTypesHandler() {
          throwUnboundTypeError(`Cannot call ${humanName} due to unbound types`, rawArgTypes);
        }
  
        if (methodName.startsWith('@@')) {
          methodName = Symbol[methodName.substring(2)];
        }
  
        var proto = classType.registeredClass.constructor;
        if (undefined === proto[methodName]) {
          // This is the first function to be registered with this name.
          unboundTypesHandler.argCount = argCount-1;
          proto[methodName] = unboundTypesHandler;
        } else {
          // There was an existing function with the same name registered. Set up
          // a function overload routing table.
          ensureOverloadTable(proto, methodName, humanName);
          proto[methodName].overloadTable[argCount-1] = unboundTypesHandler;
        }
  
        whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
          // Replace the initial unbound-types-handler stub with the proper
          // function. If multiple overloads are registered, the function handlers
          // go into an overload table.
          var invokerArgsArray = [argTypes[0] /* return value */, null /* no class 'this'*/].concat(argTypes.slice(1) /* actual params */);
          var func = craftInvokerFunction(humanName, invokerArgsArray, null /* no class 'this'*/, rawInvoker, fn, isAsync);
          if (undefined === proto[methodName].overloadTable) {
            func.argCount = argCount-1;
            proto[methodName] = func;
          } else {
            proto[methodName].overloadTable[argCount-1] = func;
          }
  
          if (classType.registeredClass.__derivedClasses) {
            for (const derivedClass of classType.registeredClass.__derivedClasses) {
              if (!derivedClass.constructor.hasOwnProperty(methodName)) {
                // TODO: Add support for overloads
                derivedClass.constructor[methodName] = func;
              }
            }
          }
  
          return [];
        });
        return [];
      });
    };

  
  
  
  var __embind_register_class_constructor = (
      rawClassType,
      argCount,
      rawArgTypesAddr,
      invokerSignature,
      invoker,
      rawConstructor
    ) => {
      assert(argCount > 0);
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      invoker = embind__requireFunction(invokerSignature, invoker);
      var args = [rawConstructor];
      var destructors = [];
  
      whenDependentTypesAreResolved([], [rawClassType], (classType) => {
        classType = classType[0];
        var humanName = `constructor ${classType.name}`;
  
        if (undefined === classType.registeredClass.constructor_body) {
          classType.registeredClass.constructor_body = [];
        }
        if (undefined !== classType.registeredClass.constructor_body[argCount - 1]) {
          throw new BindingError(`Cannot register multiple constructors with identical number of parameters (${argCount-1}) for class '${classType.name}'! Overload resolution is currently only performed using the parameter count, not actual type info!`);
        }
        classType.registeredClass.constructor_body[argCount - 1] = () => {
          throwUnboundTypeError(`Cannot construct ${classType.name} due to unbound types`, rawArgTypes);
        };
  
        whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
          // Insert empty slot for context type (argTypes[1]).
          argTypes.splice(1, 0, null);
          classType.registeredClass.constructor_body[argCount - 1] = craftInvokerFunction(humanName, argTypes, null, invoker, rawConstructor);
          return [];
        });
        return [];
      });
    };

  
  
  
  
  
  
  var __embind_register_class_function = (rawClassType,
                                      methodName,
                                      argCount,
                                      rawArgTypesAddr, // [ReturnType, ThisType, Args...]
                                      invokerSignature,
                                      rawInvoker,
                                      context,
                                      isPureVirtual,
                                      isAsync,
                                      isNonnullReturn) => {
      var rawArgTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      methodName = AsciiToString(methodName);
      methodName = getFunctionName(methodName);
      rawInvoker = embind__requireFunction(invokerSignature, rawInvoker, isAsync);
  
      whenDependentTypesAreResolved([], [rawClassType], (classType) => {
        classType = classType[0];
        var humanName = `${classType.name}.${methodName}`;
  
        if (methodName.startsWith("@@")) {
          methodName = Symbol[methodName.substring(2)];
        }
  
        if (isPureVirtual) {
          classType.registeredClass.pureVirtualFunctions.push(methodName);
        }
  
        function unboundTypesHandler() {
          throwUnboundTypeError(`Cannot call ${humanName} due to unbound types`, rawArgTypes);
        }
  
        var proto = classType.registeredClass.instancePrototype;
        var method = proto[methodName];
        if (undefined === method || (undefined === method.overloadTable && method.className !== classType.name && method.argCount === argCount - 2)) {
          // This is the first overload to be registered, OR we are replacing a
          // function in the base class with a function in the derived class.
          unboundTypesHandler.argCount = argCount - 2;
          unboundTypesHandler.className = classType.name;
          proto[methodName] = unboundTypesHandler;
        } else {
          // There was an existing function with the same name registered. Set up
          // a function overload routing table.
          ensureOverloadTable(proto, methodName, humanName);
          proto[methodName].overloadTable[argCount - 2] = unboundTypesHandler;
        }
  
        whenDependentTypesAreResolved([], rawArgTypes, (argTypes) => {
          var memberFunction = craftInvokerFunction(humanName, argTypes, classType, rawInvoker, context, isAsync);
  
          // Replace the initial unbound-handler-stub function with the
          // appropriate member function, now that all types are resolved. If
          // multiple overloads are registered for this function, the function
          // goes into an overload table.
          if (undefined === proto[methodName].overloadTable) {
            // Set argCount in case an overload is registered later
            memberFunction.argCount = argCount - 2;
            proto[methodName] = memberFunction;
          } else {
            proto[methodName].overloadTable[argCount - 2] = memberFunction;
          }
  
          return [];
        });
        return [];
      });
    };

  
  
  
  
  
  
  
  var validateThis = (this_, classType, humanName) => {
      if (!(this_ instanceof Object)) {
        throwBindingError(`${humanName} with invalid "this": ${this_}`);
      }
      if (!(this_ instanceof classType.registeredClass.constructor)) {
        throwBindingError(`${humanName} incompatible with "this" of type ${this_.constructor.name}`);
      }
      if (!this_.$$.ptr) {
        throwBindingError(`cannot call emscripten binding method ${humanName} on deleted object`);
      }
  
      // todo: kill this
      return upcastPointer(this_.$$.ptr,
                           this_.$$.ptrType.registeredClass,
                           classType.registeredClass);
    };
  var __embind_register_class_property = (classType,
                                      fieldName,
                                      getterReturnType,
                                      getterSignature,
                                      getter,
                                      getterContext,
                                      setterArgumentType,
                                      setterSignature,
                                      setter,
                                      setterContext) => {
      fieldName = AsciiToString(fieldName);
      getter = embind__requireFunction(getterSignature, getter);
  
      whenDependentTypesAreResolved([], [classType], (classType) => {
        classType = classType[0];
        var humanName = `${classType.name}.${fieldName}`;
        var desc = {
          get() {
            throwUnboundTypeError(`Cannot access ${humanName} due to unbound types`, [getterReturnType, setterArgumentType]);
          },
          enumerable: true,
          configurable: true
        };
        if (setter) {
          desc.set = () => throwUnboundTypeError(`Cannot access ${humanName} due to unbound types`, [getterReturnType, setterArgumentType]);
        } else {
          desc.set = (v) => throwBindingError(humanName + ' is a read-only property');
        }
  
        Object.defineProperty(classType.registeredClass.instancePrototype, fieldName, desc);
  
        whenDependentTypesAreResolved(
          [],
          (setter ? [getterReturnType, setterArgumentType] : [getterReturnType]),
        (types) => {
          var getterReturnType = types[0];
          var desc = {
            get() {
              var ptr = validateThis(this, classType, humanName + ' getter');
              return getterReturnType.fromWireType(getter(getterContext, ptr));
            },
            enumerable: true
          };
  
          if (setter) {
            setter = embind__requireFunction(setterSignature, setter);
            var setterArgumentType = types[1];
            desc.set = function(v) {
              var ptr = validateThis(this, classType, humanName + ' setter');
              var destructors = [];
              setter(setterContext, ptr, setterArgumentType.toWireType(destructors, v));
              runDestructors(destructors);
            };
          }
  
          Object.defineProperty(classType.registeredClass.instancePrototype, fieldName, desc);
          return [];
        });
  
        return [];
      });
    };

  
  var emval_freelist = [];
  
  var emval_handles = [0,1,,1,null,1,true,1,false,1];
  var __emval_decref = (handle) => {
      if (handle > 9 && 0 === --emval_handles[handle + 1]) {
        assert(emval_handles[handle] !== undefined, `Decref for unallocated handle.`);
        emval_handles[handle] = undefined;
        emval_freelist.push(handle);
      }
    };
  
  
  
  var Emval = {
  toValue:(handle) => {
        if (!handle) {
            throwBindingError(`Cannot use deleted val. handle = ${handle}`);
        }
        // handle 2 is supposed to be `undefined`.
        assert(handle === 2 || emval_handles[handle] !== undefined && handle % 2 === 0, `invalid handle: ${handle}`);
        return emval_handles[handle];
      },
  toHandle:(value) => {
        switch (value) {
          case undefined: return 2;
          case null: return 4;
          case true: return 6;
          case false: return 8;
          default:{
            const handle = emval_freelist.pop() || emval_handles.length;
            emval_handles[handle] = value;
            emval_handles[handle + 1] = 1;
            return handle;
          }
        }
      },
  };
  
  var EmValType = {
      name: 'emscripten::val',
      fromWireType: (handle) => {
        var rv = Emval.toValue(handle);
        __emval_decref(handle);
        return rv;
      },
      toWireType: (destructors, value) => Emval.toHandle(value),
      readValueFromPointer: readPointer,
      destructorFunction: null, // This type does not need a destructor
  
      // TODO: do we need a deleteObject here?  write a test where
      // emval is passed into JS via an interface
    };
  var __embind_register_emval = (rawType) => registerType(rawType, EmValType);

  var floatReadValueFromPointer = (name, width) => {
      switch (width) {
        case 4: return function(pointer) {
          return this.fromWireType(HEAPF32[((pointer)>>2)]);
        };
        case 8: return function(pointer) {
          return this.fromWireType(HEAPF64[((pointer)>>3)]);
        };
        default:
          throw new TypeError(`invalid float width (${width}): ${name}`);
      }
    };
  
  
  
  var __embind_register_float = (rawType, name, size) => {
      name = AsciiToString(name);
      registerType(rawType, {
        name,
        fromWireType: (value) => value,
        toWireType: (destructors, value) => {
          if (typeof value != "number" && typeof value != "boolean") {
            throw new TypeError(`Cannot convert ${embindRepr(value)} to ${this.name}`);
          }
          // The VM will perform JS to Wasm value conversion, according to the spec:
          // https://www.w3.org/TR/wasm-js-api-1/#towebassemblyvalue
          return value;
        },
        readValueFromPointer: floatReadValueFromPointer(name, size),
        destructorFunction: null, // This type does not need a destructor
      });
    };

  
  
  
  
  
  
  
  
  var __embind_register_function = (name, argCount, rawArgTypesAddr, signature, rawInvoker, fn, isAsync, isNonnullReturn) => {
      var argTypes = heap32VectorToArray(argCount, rawArgTypesAddr);
      name = AsciiToString(name);
      name = getFunctionName(name);
  
      rawInvoker = embind__requireFunction(signature, rawInvoker, isAsync);
  
      exposePublicSymbol(name, function() {
        throwUnboundTypeError(`Cannot call ${name} due to unbound types`, argTypes);
      }, argCount - 1);
  
      whenDependentTypesAreResolved([], argTypes, (argTypes) => {
        var invokerArgsArray = [argTypes[0] /* return value */, null /* no class 'this'*/].concat(argTypes.slice(1) /* actual params */);
        replacePublicSymbol(name, craftInvokerFunction(name, invokerArgsArray, null /* no class 'this'*/, rawInvoker, fn, isAsync), argCount - 1);
        return [];
      });
    };

  
  
  
  
  /** @suppress {globalThis} */
  var __embind_register_integer = (primitiveType, name, size, minRange, maxRange) => {
      name = AsciiToString(name);
  
      const isUnsignedType = minRange === 0;
  
      let fromWireType = (value) => value;
      if (isUnsignedType) {
        var bitshift = 32 - 8*size;
        fromWireType = (value) => (value << bitshift) >>> bitshift;
        maxRange = fromWireType(maxRange);
      }
  
      registerType(primitiveType, {
        name,
        fromWireType: fromWireType,
        toWireType: (destructors, value) => {
          if (typeof value != "number" && typeof value != "boolean") {
            throw new TypeError(`Cannot convert "${embindRepr(value)}" to ${name}`);
          }
          assertIntegerRange(name, value, minRange, maxRange);
          // The VM will perform JS to Wasm value conversion, according to the spec:
          // https://www.w3.org/TR/wasm-js-api-1/#towebassemblyvalue
          return value;
        },
        readValueFromPointer: integerReadValueFromPointer(name, size, minRange !== 0),
        destructorFunction: null, // This type does not need a destructor
      });
    };

  
  var installIndexedIterator = (proto, sizeMethodName, getMethodName) => {
      const makeIterator = (size, getValue) => {
        let index = 0;
        return {
          next() {
            if (index >= size) {
              return { done: true };
            }
            const current = index;
            index++;
            const value = getValue(current);
            return { value, done: false };
          },
          [Symbol.iterator]() {
            return this;
          },
        };
      };
  
      if (!proto[Symbol.iterator]) {
        proto[Symbol.iterator] = function() {
          const size = this[sizeMethodName]();
          return makeIterator(size, (i) => this[getMethodName](i));
        };
      }
    };
  
  var __embind_register_iterable = (rawClassType, rawElementType, sizeMethodName, getMethodName) => {
      sizeMethodName = AsciiToString(sizeMethodName);
      getMethodName = AsciiToString(getMethodName);
      whenDependentTypesAreResolved([], [rawClassType, rawElementType], (types) => {
        const classType = types[0];
        installIndexedIterator(classType.registeredClass.instancePrototype, sizeMethodName, getMethodName);
        return [];
      });
    };

  
  var __embind_register_memory_view = (rawType, dataTypeIndex, name) => {
      var typeMapping = [
        Int8Array,
        Uint8Array,
        Int16Array,
        Uint16Array,
        Int32Array,
        Uint32Array,
        Float32Array,
        Float64Array,
        BigInt64Array,
        BigUint64Array,
      ];
  
      var TA = typeMapping[dataTypeIndex];
  
      function decodeMemoryView(handle) {
        var size = HEAPU32[((handle)>>2)];
        var data = HEAPU32[(((handle)+(4))>>2)];
        return new TA(HEAP8.buffer, data, size);
      }
  
      name = AsciiToString(name);
      registerType(rawType, {
        name,
        fromWireType: decodeMemoryView,
        readValueFromPointer: decodeMemoryView,
      }, {
        ignoreDuplicateRegistrations: true,
      });
    };

  
  var EmValOptionalType = Object.assign({optional: true}, EmValType);;
  var __embind_register_optional = (rawOptionalType, rawType) => {
      registerType(rawOptionalType, EmValOptionalType);
    };

  
  
  
  
  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      assert(typeof str === 'string', `stringToUTF8Array expects a string (got ${typeof str})`);
      // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
      // undefined and false each don't write out any bytes.
      if (!(maxBytesToWrite > 0))
        return 0;
  
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
      for (var i = 0; i < str.length; ++i) {
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
        // and https://www.ietf.org/rfc/rfc2279.txt
        // and https://tools.ietf.org/html/rfc3629
        var u = str.codePointAt(i);
        if (u <= 0x7F) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 0x7FF) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 0xC0 | (u >> 6);
          heap[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 0xE0 | (u >> 12);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          if (u > 0x10FFFF) warnOnce('Invalid Unicode code point ' + ptrToString(u) + ' encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).');
          heap[outIdx++] = 0xF0 | (u >> 18);
          heap[outIdx++] = 0x80 | ((u >> 12) & 63);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
          // Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
          // We need to manually skip over the second code unit for correct iteration.
          i++;
        }
      }
      // Null-terminate the pointer to the buffer.
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF8(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };
  
  var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var c = str.charCodeAt(i); // possibly a lead surrogate
        if (c <= 0x7F) {
          len++;
        } else if (c <= 0x7FF) {
          len += 2;
        } else if (c >= 0xD800 && c <= 0xDFFF) {
          len += 4; ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
  
  
  
  var __embind_register_std_string = (rawType, name) => {
      name = AsciiToString(name);
      var stdStringIsUTF8 = true;
  
      registerType(rawType, {
        name,
        // For some method names we use string keys here since they are part of
        // the public/external API and/or used by the runtime-generated code.
        fromWireType(value) {
          var length = HEAPU32[((value)>>2)];
          var payload = value + 4;
  
          var str;
          if (stdStringIsUTF8) {
            str = UTF8ToString(payload, length, true);
          } else {
            str = '';
            for (var i = 0; i < length; ++i) {
              str += String.fromCharCode(HEAPU8[payload + i]);
            }
          }
  
          _free(value);
  
          return str;
        },
        toWireType(destructors, value) {
          if (value instanceof ArrayBuffer) {
            value = new Uint8Array(value);
          }
  
          var length;
          var valueIsOfTypeString = (typeof value == 'string');
  
          // We accept `string` or array views with single byte elements
          if (!(valueIsOfTypeString || (ArrayBuffer.isView(value) && value.BYTES_PER_ELEMENT == 1))) {
            throwBindingError('Cannot pass non-string to std::string');
          }
          if (stdStringIsUTF8 && valueIsOfTypeString) {
            length = lengthBytesUTF8(value);
          } else {
            length = value.length;
          }
  
          // assumes POINTER_SIZE alignment
          var base = _malloc(4 + length + 1);
          var ptr = base + 4;
          HEAPU32[((base)>>2)] = length;
          if (valueIsOfTypeString) {
            if (stdStringIsUTF8) {
              stringToUTF8(value, ptr, length + 1);
            } else {
              for (var i = 0; i < length; ++i) {
                var charCode = value.charCodeAt(i);
                if (charCode > 255) {
                  _free(base);
                  throwBindingError('String has UTF-16 code units that do not fit in 8 bits');
                }
                HEAPU8[ptr + i] = charCode;
              }
            }
          } else {
            HEAPU8.set(value, ptr);
          }
  
          if (destructors !== null) {
            destructors.push(_free, base);
          }
          return base;
        },
        readValueFromPointer: readPointer,
        destructorFunction(ptr) {
          _free(ptr);
        },
      });
    };

  
  
  
  var UTF16Decoder = globalThis.TextDecoder ? new TextDecoder('utf-16le') : undefined;;
  
  var UTF16ToString = (ptr, maxBytesToRead, ignoreNul) => {
      assert(ptr % 2 == 0, 'Pointer passed to UTF16ToString must be aligned to two bytes!');
      var idx = ((ptr)>>1);
      var endIdx = findStringEnd(HEAPU16, idx, maxBytesToRead / 2, ignoreNul);
  
      // When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
      if (endIdx - idx > 16 && UTF16Decoder)
        return UTF16Decoder.decode(HEAPU16.subarray(idx, endIdx));
  
      // Fallback: decode without UTF16Decoder
      var str = '';
  
      // If maxBytesToRead is not passed explicitly, it will be undefined, and the
      // for-loop's condition will always evaluate to true. The loop is then
      // terminated on the first null char.
      for (var i = idx; i < endIdx; ++i) {
        var codeUnit = HEAPU16[i];
        // fromCharCode constructs a character from a UTF-16 code unit, so we can
        // pass the UTF16 string right through.
        str += String.fromCharCode(codeUnit);
      }
  
      return str;
    };
  
  var stringToUTF16 = (str, outPtr, maxBytesToWrite) => {
      assert(outPtr % 2 == 0, 'Pointer passed to stringToUTF16 must be aligned to two bytes!');
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF16(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
      maxBytesToWrite ??= 0x7FFFFFFF;
      if (maxBytesToWrite < 2) return 0;
      maxBytesToWrite -= 2; // Null terminator.
      var startPtr = outPtr;
      var numCharsToWrite = (maxBytesToWrite < str.length*2) ? (maxBytesToWrite / 2) : str.length;
      for (var i = 0; i < numCharsToWrite; ++i) {
        // charCodeAt returns a UTF-16 encoded code unit, so it can be directly written to the HEAP.
        var codeUnit = str.charCodeAt(i); // possibly a lead surrogate
        HEAP16[((outPtr)>>1)] = codeUnit;
        outPtr += 2;
      }
      // Null-terminate the pointer to the HEAP.
      HEAP16[((outPtr)>>1)] = 0;
      return outPtr - startPtr;
    };
  
  var lengthBytesUTF16 = (str) => str.length*2;
  
  var UTF32ToString = (ptr, maxBytesToRead, ignoreNul) => {
      assert(ptr % 4 == 0, 'Pointer passed to UTF32ToString must be aligned to four bytes!');
      var str = '';
      var startIdx = ((ptr)>>2);
      // If maxBytesToRead is not passed explicitly, it will be undefined, and this
      // will always evaluate to true. This saves on code size.
      for (var i = 0; !(i >= maxBytesToRead / 4); i++) {
        var utf32 = HEAPU32[startIdx + i];
        if (!utf32 && !ignoreNul) break;
        str += String.fromCodePoint(utf32);
      }
      return str;
    };
  
  var stringToUTF32 = (str, outPtr, maxBytesToWrite) => {
      assert(outPtr % 4 == 0, 'Pointer passed to stringToUTF32 must be aligned to four bytes!');
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF32(str, outPtr, maxBytesToWrite) is missing the third parameter that specifies the length of the output buffer!');
      // Backwards compatibility: if max bytes is not specified, assume unsafe unbounded write is allowed.
      maxBytesToWrite ??= 0x7FFFFFFF;
      if (maxBytesToWrite < 4) return 0;
      var startPtr = outPtr;
      var endPtr = startPtr + maxBytesToWrite - 4;
      for (var i = 0; i < str.length; ++i) {
        var codePoint = str.codePointAt(i);
        // Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
        // We need to manually skip over the second code unit for correct iteration.
        if (codePoint > 0xFFFF) {
          i++;
        }
        HEAP32[((outPtr)>>2)] = codePoint;
        outPtr += 4;
        if (outPtr + 4 > endPtr) break;
      }
      // Null-terminate the pointer to the HEAP.
      HEAP32[((outPtr)>>2)] = 0;
      return outPtr - startPtr;
    };
  
  var lengthBytesUTF32 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        var codePoint = str.codePointAt(i);
        // Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
        // We need to manually skip over the second code unit for correct iteration.
        if (codePoint > 0xFFFF) {
          i++;
        }
        len += 4;
      }
  
      return len;
    };
  var __embind_register_std_wstring = (rawType, charSize, name) => {
      name = AsciiToString(name);
      var decodeString, encodeString, lengthBytesUTF;
      if (charSize === 2) {
        decodeString = UTF16ToString;
        encodeString = stringToUTF16;
        lengthBytesUTF = lengthBytesUTF16;
      } else {
        assert(charSize === 4, 'only 2-byte and 4-byte strings are currently supported');
        decodeString = UTF32ToString;
        encodeString = stringToUTF32;
        lengthBytesUTF = lengthBytesUTF32;
      }
      registerType(rawType, {
        name,
        fromWireType: (value) => {
          // Code mostly taken from _embind_register_std_string fromWireType
          var length = HEAPU32[((value)>>2)];
          var str = decodeString(value + 4, length * charSize, true);
  
          _free(value);
  
          return str;
        },
        toWireType: (destructors, value) => {
          if (!(typeof value == 'string')) {
            throwBindingError(`Cannot pass non-string to C++ string type ${name}`);
          }
  
          // assumes POINTER_SIZE alignment
          var length = lengthBytesUTF(value);
          var ptr = _malloc(4 + length + charSize);
          HEAPU32[((ptr)>>2)] = length / charSize;
  
          encodeString(value, ptr + 4, length + charSize);
  
          if (destructors !== null) {
            destructors.push(_free, ptr);
          }
          return ptr;
        },
        readValueFromPointer: readPointer,
        destructorFunction(ptr) {
          _free(ptr);
        }
      });
    };

  
  
  var __embind_register_value_object = (
      rawType,
      name,
      constructorSignature,
      rawConstructor,
      destructorSignature,
      rawDestructor
    ) => {
      structRegistrations[rawType] = {
        name: AsciiToString(name),
        rawConstructor: embind__requireFunction(constructorSignature, rawConstructor),
        rawDestructor: embind__requireFunction(destructorSignature, rawDestructor),
        fields: [],
      };
    };

  
  
  var __embind_register_value_object_field = (
      structType,
      fieldName,
      getterReturnType,
      getterSignature,
      getter,
      getterContext,
      setterArgumentType,
      setterSignature,
      setter,
      setterContext
    ) => {
      structRegistrations[structType].fields.push({
        fieldName: AsciiToString(fieldName),
        getterReturnType,
        getter: embind__requireFunction(getterSignature, getter),
        getterContext,
        setterArgumentType,
        setter: embind__requireFunction(setterSignature, setter),
        setterContext,
      });
    };

  
  var __embind_register_void = (rawType, name) => {
      name = AsciiToString(name);
      registerType(rawType, {
        isVoid: true, // void return values can be optimized out sometimes
        name,
        fromWireType: () => undefined,
        // TODO: assert if anything else is given?
        toWireType: (destructors, o) => undefined,
      });
    };

  var emval_methodCallers = [];
  var emval_addMethodCaller = (caller) => {
      var id = emval_methodCallers.length;
      emval_methodCallers.push(caller);
      return id;
    };
  
  
  
  var requireRegisteredType = (rawType, humanName) => {
      var impl = registeredTypes[rawType];
      if (undefined === impl) {
        throwBindingError(`${humanName} has unknown type ${getTypeName(rawType)}`);
      }
      return impl;
    };
  var emval_lookupTypes = (argCount, argTypes) => {
      var a = new Array(argCount);
      for (var i = 0; i < argCount; ++i) {
        a[i] = requireRegisteredType(HEAPU32[(((argTypes)+(i*4))>>2)],
                                     `parameter ${i}`);
      }
      return a;
    };
  
  
  var emval_returnValue = (toReturnWire, destructorsRef, handle) => {
      var destructors = [];
      var result = toReturnWire(destructors, handle);
      if (destructors.length) {
        // void, primitives and any other types w/o destructors don't need to allocate a handle
        HEAPU32[((destructorsRef)>>2)] = Emval.toHandle(destructors);
      }
      return result;
    };
  
  
  var emval_symbols = {
  };
  
  var getStringOrSymbol = (address) => {
      var symbol = emval_symbols[address];
      if (symbol === undefined) {
        return AsciiToString(address);
      }
      return symbol;
    };
  var __emval_create_invoker = (argCount, argTypesPtr, kind) => {
      var GenericWireTypeSize = 8;
  
      var [retType, ...argTypes] = emval_lookupTypes(argCount, argTypesPtr);
      var toReturnWire = retType.toWireType.bind(retType);
      var argFromPtr = argTypes.map(type => type.readValueFromPointer.bind(type));
      argCount--; // remove the extracted return type
  
      var captures = {'toValue': Emval.toValue};
      var args = argFromPtr.map((argFromPtr, i) => {
        var captureName = `argFromPtr${i}`;
        captures[captureName] = argFromPtr;
        return `${captureName}(args${i ? '+' + i * GenericWireTypeSize : ''})`;
      });
      var functionBody;
      switch (kind){
        case 0:
          functionBody = 'toValue(handle)';
          break;
        case 2:
          functionBody = 'new (toValue(handle))';
          break;
        case 3:
          functionBody = '';
          break;
        case 1:
          captures['getStringOrSymbol'] = getStringOrSymbol;
          functionBody = 'toValue(handle)[getStringOrSymbol(methodName)]';
          break;
      }
      functionBody += `(${args})`;
      if (!retType.isVoid) {
        captures['toReturnWire'] = toReturnWire;
        captures['emval_returnValue'] = emval_returnValue;
        functionBody = `return emval_returnValue(toReturnWire, destructorsRef, ${functionBody})`;
      }
      functionBody = `return function (handle, methodName, destructorsRef, args) {
${functionBody}
}`;
  
      var invokerFunction = new Function(Object.keys(captures), functionBody)(...Object.values(captures));
      var functionName = `methodCaller<(${argTypes.map(t => t.name)}) => ${retType.name}>`;
      return emval_addMethodCaller(createNamedFunction(functionName, invokerFunction));
    };


  
  
  var __emval_invoke = (caller, handle, methodName, destructorsRef, args) => {
      return emval_methodCallers[caller](handle, methodName, destructorsRef, args);
    };

  
  
  var __emval_run_destructors = (handle) => {
      var destructors = Emval.toValue(handle);
      runDestructors(destructors);
      __emval_decref(handle);
    };

  
  var __tzset_js = (timezone, daylight, std_name, dst_name) => {
      // TODO: Use (malleable) environment variables instead of system settings.
      var currentYear = new Date().getFullYear();
      var winter = new Date(currentYear, 0, 1);
      var summer = new Date(currentYear, 6, 1);
      var winterOffset = winter.getTimezoneOffset();
      var summerOffset = summer.getTimezoneOffset();
  
      // Local standard timezone offset. Local standard time is not adjusted for
      // daylight savings.  This code uses the fact that getTimezoneOffset returns
      // a greater value during Standard Time versus Daylight Saving Time (DST).
      // Thus it determines the expected output during Standard Time, and it
      // compares whether the output of the given date the same (Standard) or less
      // (DST).
      var stdTimezoneOffset = Math.max(winterOffset, summerOffset);
  
      // timezone is specified as seconds west of UTC ("The external variable
      // `timezone` shall be set to the difference, in seconds, between
      // Coordinated Universal Time (UTC) and local standard time."), the same
      // as returned by stdTimezoneOffset.
      // See http://pubs.opengroup.org/onlinepubs/009695399/functions/tzset.html
      HEAPU32[((timezone)>>2)] = stdTimezoneOffset * 60;
  
      HEAP32[((daylight)>>2)] = Number(winterOffset != summerOffset);
  
      var extractZone = (timezoneOffset) => {
        // Why inverse sign?
        // Read here https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
        var sign = timezoneOffset >= 0 ? "-" : "+";
  
        var absOffset = Math.abs(timezoneOffset)
        var hours = String(Math.floor(absOffset / 60)).padStart(2, "0");
        var minutes = String(absOffset % 60).padStart(2, "0");
  
        return `UTC${sign}${hours}${minutes}`;
      }
  
      var winterName = extractZone(winterOffset);
      var summerName = extractZone(summerOffset);
      assert(winterName);
      assert(summerName);
      assert(lengthBytesUTF8(winterName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${winterName})`);
      assert(lengthBytesUTF8(summerName) <= 16, `timezone name truncated to fit in TZNAME_MAX (${summerName})`);
      if (summerOffset < winterOffset) {
        // Northern hemisphere
        stringToUTF8(winterName, std_name, 17);
        stringToUTF8(summerName, dst_name, 17);
      } else {
        stringToUTF8(winterName, dst_name, 17);
        stringToUTF8(summerName, std_name, 17);
      }
    };

  var abortOnCannotGrowMemory = (requestedSize) => {
      abort(`Cannot enlarge memory arrays to size ${requestedSize} bytes (OOM). Either (1) compile with -sINITIAL_MEMORY=X with X higher than the current value ${HEAP8.length}, (2) compile with -sALLOW_MEMORY_GROWTH which allows increasing the size at runtime, or (3) if you want malloc to return NULL (0) instead of this abort, compile with -sABORTING_MALLOC=0`);
    };
  var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      requestedSize >>>= 0;
      abortOnCannotGrowMemory(requestedSize);
    };

  var ENV = {
  };
  
  var getExecutableName = () => thisProgram || './this.program';
  var getEnvStrings = () => {
      if (!getEnvStrings.strings) {
        // Default values.
        // Browser language detection #8751
        var lang = (globalThis.navigator?.language ?? 'C').replace('-', '_') + '.UTF-8';
        var env = {
          'USER': 'web_user',
          'LOGNAME': 'web_user',
          'PATH': '/',
          'PWD': '/',
          'HOME': '/home/web_user',
          'LANG': lang,
          '_': getExecutableName()
        };
        // Apply the user-provided values, if any.
        for (var x in ENV) {
          // x is a key in ENV; if ENV[x] is undefined, that means it was
          // explicitly set to be so. We allow user code to do that to
          // force variables with default values to remain unset.
          if (ENV[x] === undefined) delete env[x];
          else env[x] = ENV[x];
        }
        var strings = [];
        for (var x in env) {
          strings.push(`${x}=${env[x]}`);
        }
        getEnvStrings.strings = strings;
      }
      return getEnvStrings.strings;
    };
  
  var _environ_get = (__environ, environ_buf) => {
      var bufSize = 0;
      var envp = 0;
      for (var string of getEnvStrings()) {
        var ptr = environ_buf + bufSize;
        HEAPU32[(((__environ)+(envp))>>2)] = ptr;
        bufSize += stringToUTF8(string, ptr, Infinity) + 1;
        envp += 4;
      }
      return 0;
    };

  
  var _environ_sizes_get = (penviron_count, penviron_buf_size) => {
      var strings = getEnvStrings();
      HEAPU32[((penviron_count)>>2)] = strings.length;
      var bufSize = 0;
      for (var string of strings) {
        bufSize += lengthBytesUTF8(string) + 1;
      }
      HEAPU32[((penviron_buf_size)>>2)] = bufSize;
      return 0;
    };

  var PATH = {
  isAbs:(path) => path.charAt(0) === '/',
  splitPath:(filename) => {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },
  normalizeArray:(parts, allowAboveRoot) => {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },
  normalize:(path) => {
        var isAbsolute = PATH.isAbs(path),
            trailingSlash = path.slice(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter((p) => !!p), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },
  dirname:(path) => {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.slice(0, -1);
        }
        return root + dir;
      },
  basename:(path) => path && path.match(/([^\/]+|\/)\/*$/)[1],
join:(...paths) => PATH.normalize(paths.join('/')),
join2:(l, r) => PATH.normalize(l + '/' + r),
};

var initRandomFill = () => {
    // This block is not needed on v19+ since crypto.getRandomValues is builtin
    if (ENVIRONMENT_IS_NODE) {
      var nodeCrypto = require('node:crypto');
      return (view) => nodeCrypto.randomFillSync(view);
    }

    return (view) => crypto.getRandomValues(view);
  };
var randomFill = (view) => {
    // Lazily init on the first invocation.
    (randomFill = initRandomFill())(view);
  };



var PATH_FS = {
resolve:(...args) => {
      var resolvedPath = '',
        resolvedAbsolute = false;
      for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = (i >= 0) ? args[i] : FS.cwd();
        // Skip empty and invalid entries
        if (typeof path != 'string') {
          throw new TypeError('Arguments to path.resolve must be strings');
        } else if (!path) {
          return ''; // an invalid portion invalidates the whole thing
        }
        resolvedPath = path + '/' + resolvedPath;
        resolvedAbsolute = PATH.isAbs(path);
      }
      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)
      resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter((p) => !!p), !resolvedAbsolute).join('/');
      return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
    },
relative:(from, to) => {
      from = PATH_FS.resolve(from).slice(1);
      to = PATH_FS.resolve(to).slice(1);
      function trim(arr) {
        var start = 0;
        for (; start < arr.length; start++) {
          if (arr[start] !== '') break;
        }
        var end = arr.length - 1;
        for (; end >= 0; end--) {
          if (arr[end] !== '') break;
        }
        if (start > end) return [];
        return arr.slice(start, end - start + 1);
      }
      var fromParts = trim(from.split('/'));
      var toParts = trim(to.split('/'));
      var length = Math.min(fromParts.length, toParts.length);
      var samePartsLength = length;
      for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
          samePartsLength = i;
          break;
        }
      }
      var outputParts = [];
      for (var i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push('..');
      }
      outputParts = outputParts.concat(toParts.slice(samePartsLength));
      return outputParts.join('/');
    },
};



var FS_stdin_getChar_buffer = [];


/** @type {function(string, boolean=, number=)} */
  var intArrayFromString = (stringy, dontAddNull, length) => {
      var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
      var u8array = new Array(len);
      var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
      if (dontAddNull) u8array.length = numBytesWritten;
      return u8array;
    };
  var FS_stdin_getChar = () => {
      if (!FS_stdin_getChar_buffer.length) {
        var result = null;
        if (ENVIRONMENT_IS_NODE) {
          // we will read data by chunks of BUFSIZE
          var BUFSIZE = 256;
          var buf = Buffer.alloc(BUFSIZE);
          var bytesRead = 0;
  
          // For some reason we must suppress a closure warning here, even though
          // fd definitely exists on process.stdin, and is even the proper way to
          // get the fd of stdin,
          // https://github.com/nodejs/help/issues/2136#issuecomment-523649904
          // This started to happen after moving this logic out of library_tty.js,
          // so it is related to the surrounding code in some unclear manner.
          /** @suppress {missingProperties} */
          var fd = process.stdin.fd;
  
          try {
            bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
          } catch(e) {
            // Cross-platform differences: on Windows, reading EOF throws an
            // exception, but on other OSes, reading EOF returns 0. Uniformize
            // behavior by treating the EOF exception to return 0.
            if (e.toString().includes('EOF')) bytesRead = 0;
            else throw e;
          }
  
          if (bytesRead > 0) {
            result = buf.slice(0, bytesRead).toString('utf-8');
          }
        } else
        if (globalThis.window?.prompt) {
          // Browser.
          result = window.prompt('Input: ');  // returns null on cancel
          if (result !== null) {
            result += '\n';
          }
        } else
        {}
        if (!result) {
          return null;
        }
        FS_stdin_getChar_buffer = intArrayFromString(result, true);
      }
      return FS_stdin_getChar_buffer.shift();
    };
  var TTY = {
  ttys:[],
  init() {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process.stdin.setEncoding('utf8');
        // }
      },
  shutdown() {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process.stdin.pause();
        // }
      },
  register(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },
  stream_ops:{
  open(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },
  close(stream) {
          // flush any pending line data
          stream.tty.ops.fsync(stream.tty);
        },
  fsync(stream) {
          stream.tty.ops.fsync(stream.tty);
        },
  read(stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.atime = Date.now();
          }
          return bytesRead;
        },
  write(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.mtime = stream.node.ctime = Date.now();
          }
          return i;
        },
  },
  default_tty_ops:{
  get_char(tty) {
          return FS_stdin_getChar();
        },
  put_char(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
          }
        },
  fsync(tty) {
          if (tty.output?.length > 0) {
            out(UTF8ArrayToString(tty.output));
            tty.output = [];
          }
        },
  ioctl_tcgets(tty) {
          // typical setting
          return {
            c_iflag: 25856,
            c_oflag: 5,
            c_cflag: 191,
            c_lflag: 35387,
            c_cc: [
              0x03, 0x1c, 0x7f, 0x15, 0x04, 0x00, 0x01, 0x00, 0x11, 0x13, 0x1a, 0x00,
              0x12, 0x0f, 0x17, 0x16, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            ]
          };
        },
  ioctl_tcsets(tty, optional_actions, data) {
          // currently just ignore
          return 0;
        },
  ioctl_tiocgwinsz(tty) {
          return [24, 80];
        },
  },
  default_tty1_ops:{
  put_char(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
  fsync(tty) {
          if (tty.output?.length > 0) {
            err(UTF8ArrayToString(tty.output));
            tty.output = [];
          }
        },
  },
  };
  
  
  var mmapAlloc = (size) => {
      abort('internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported');
    };
  var MEMFS = {
  ops_table:null,
  mount(mount) {
        return MEMFS.createNode(null, '/', 16895, 0);
      },
  createNode(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // not supported
          throw new FS.ErrnoError(63);
        }
        MEMFS.ops_table ||= {
          dir: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
              lookup: MEMFS.node_ops.lookup,
              mknod: MEMFS.node_ops.mknod,
              rename: MEMFS.node_ops.rename,
              unlink: MEMFS.node_ops.unlink,
              rmdir: MEMFS.node_ops.rmdir,
              readdir: MEMFS.node_ops.readdir,
              symlink: MEMFS.node_ops.symlink
            },
            stream: {
              llseek: MEMFS.stream_ops.llseek
            }
          },
          file: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr
            },
            stream: {
              llseek: MEMFS.stream_ops.llseek,
              read: MEMFS.stream_ops.read,
              write: MEMFS.stream_ops.write,
              mmap: MEMFS.stream_ops.mmap,
              msync: MEMFS.stream_ops.msync
            }
          },
          link: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
              readlink: MEMFS.node_ops.readlink
            },
            stream: {}
          },
          chrdev: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr
            },
            stream: FS.chrdev_stream_ops
          }
        };
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          node.usedBytes = 0; // The actual number of bytes used in the typed array, as opposed to contents.length which gives the whole capacity.
          // When the byte data of the file is populated, this will point to either a typed array, or a normal JS array. Typed arrays are preferred
          // for performance, and used by default. However, typed arrays are not resizable like normal JS arrays are, so there is a small disk size
          // penalty involved for appending file writes that continuously grow a file similar to std::vector capacity vs used -scheme.
          node.contents = null; 
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.atime = node.mtime = node.ctime = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
          parent.atime = parent.mtime = parent.ctime = node.atime;
        }
        return node;
      },
  getFileDataAsTypedArray(node) {
        if (!node.contents) return new Uint8Array(0);
        if (node.contents.subarray) return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
        return new Uint8Array(node.contents);
      },
  expandFileStorage(node, newCapacity) {
        var prevCapacity = node.contents ? node.contents.length : 0;
        if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
        // Don't expand strictly to the given requested limit if it's only a very small increase, but instead geometrically grow capacity.
        // For small filesizes (<1MB), perform size*2 geometric increase, but for large sizes, do a much more conservative size*1.125 increase to
        // avoid overshooting the allocation cap by a very large margin.
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>> 0);
        if (prevCapacity != 0) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
        var oldContents = node.contents;
        node.contents = new Uint8Array(newCapacity); // Allocate new storage.
        if (node.usedBytes > 0) node.contents.set(oldContents.subarray(0, node.usedBytes), 0); // Copy old data over to the new storage.
      },
  resizeFileStorage(node, newSize) {
        if (node.usedBytes == newSize) return;
        if (newSize == 0) {
          node.contents = null; // Fully decommit when requesting a resize to zero.
          node.usedBytes = 0;
        } else {
          var oldContents = node.contents;
          node.contents = new Uint8Array(newSize); // Allocate new storage.
          if (oldContents) {
            node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
          }
          node.usedBytes = newSize;
        }
      },
  node_ops:{
  getattr(node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.atime);
          attr.mtime = new Date(node.mtime);
          attr.ctime = new Date(node.ctime);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },
  setattr(node, attr) {
          for (const key of ["mode", "atime", "mtime", "ctime"]) {
            if (attr[key] != null) {
              node[key] = attr[key];
            }
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },
  lookup(parent, name) {
          throw new FS.ErrnoError(44);
        },
  mknod(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },
  rename(old_node, new_dir, new_name) {
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {}
          if (new_node) {
            if (FS.isDir(old_node.mode)) {
              // if we're overwriting a directory at new_name, make sure it's empty.
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
            FS.hashRemoveNode(new_node);
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          new_dir.contents[new_name] = old_node;
          old_node.name = new_name;
          new_dir.ctime = new_dir.mtime = old_node.parent.ctime = old_node.parent.mtime = Date.now();
        },
  unlink(parent, name) {
          delete parent.contents[name];
          parent.ctime = parent.mtime = Date.now();
        },
  rmdir(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
          parent.ctime = parent.mtime = Date.now();
        },
  readdir(node) {
          return ['.', '..', ...Object.keys(node.contents)];
        },
  symlink(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 0o777 | 40960, 0);
          node.link = oldpath;
          return node;
        },
  readlink(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        },
  },
  stream_ops:{
  read(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          assert(size >= 0);
          if (size > 8 && contents.subarray) { // non-trivial, and typed array
            buffer.set(contents.subarray(position, position + size), offset);
          } else {
            for (var i = 0; i < size; i++) buffer[offset + i] = contents[position + i];
          }
          return size;
        },
  write(stream, buffer, offset, length, position, canOwn) {
          // The data buffer should be a typed array view
          assert(!(buffer instanceof ArrayBuffer));
  
          if (!length) return 0;
          var node = stream.node;
          node.mtime = node.ctime = Date.now();
  
          if (buffer.subarray && (!node.contents || node.contents.subarray)) { // This write is from a typed array to a typed array?
            if (canOwn) {
              assert(position === 0, 'canOwn must imply no weird position inside the file');
              node.contents = buffer.subarray(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
              node.contents = buffer.slice(offset, offset + length);
              node.usedBytes = length;
              return length;
            } else if (position + length <= node.usedBytes) { // Writing to an already allocated and used subrange of the file?
              node.contents.set(buffer.subarray(offset, offset + length), position);
              return length;
            }
          }
  
          // Appending to an existing file and we need to reallocate, or source data did not come as a typed array.
          MEMFS.expandFileStorage(node, position+length);
          if (node.contents.subarray && buffer.subarray) {
            // Use typed array write which is available.
            node.contents.set(buffer.subarray(offset, offset + length), position);
          } else {
            for (var i = 0; i < length; i++) {
             node.contents[position + i] = buffer[offset + i]; // Or fall back to manual write if not.
            }
          }
          node.usedBytes = Math.max(node.usedBytes, position + length);
          return length;
        },
  llseek(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },
  mmap(stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if (!(flags & 2) && contents && contents.buffer === HEAP8.buffer) {
            // We can't emulate MAP_SHARED when the file is not backed by the
            // buffer we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            allocated = true;
            ptr = mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            if (contents) {
              // Try to avoid unnecessary slices.
              if (position > 0 || position + length < contents.length) {
                if (contents.subarray) {
                  contents = contents.subarray(position, position + length);
                } else {
                  contents = Array.prototype.slice.call(contents, position, position + length);
                }
              }
              HEAP8.set(contents, ptr);
            }
          }
          return { ptr, allocated };
        },
  msync(stream, buffer, offset, length, mmapFlags) {
          MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          // should we check if bytesWritten and length are the same?
          return 0;
        },
  },
  };
  
  var FS_modeStringToFlags = (str) => {
      var flagModes = {
        'r': 0,
        'r+': 2,
        'w': 512 | 64 | 1,
        'w+': 512 | 64 | 2,
        'a': 1024 | 64 | 1,
        'a+': 1024 | 64 | 2,
      };
      var flags = flagModes[str];
      if (typeof flags == 'undefined') {
        throw new Error(`Unknown file open mode: ${str}`);
      }
      return flags;
    };
  
  var FS_getMode = (canRead, canWrite) => {
      var mode = 0;
      if (canRead) mode |= 292 | 73;
      if (canWrite) mode |= 146;
      return mode;
    };
  
  
  
  
  var strError = (errno) => UTF8ToString(_strerror(errno));
  
  var ERRNO_CODES = {
      'EPERM': 63,
      'ENOENT': 44,
      'ESRCH': 71,
      'EINTR': 27,
      'EIO': 29,
      'ENXIO': 60,
      'E2BIG': 1,
      'ENOEXEC': 45,
      'EBADF': 8,
      'ECHILD': 12,
      'EAGAIN': 6,
      'EWOULDBLOCK': 6,
      'ENOMEM': 48,
      'EACCES': 2,
      'EFAULT': 21,
      'ENOTBLK': 105,
      'EBUSY': 10,
      'EEXIST': 20,
      'EXDEV': 75,
      'ENODEV': 43,
      'ENOTDIR': 54,
      'EISDIR': 31,
      'EINVAL': 28,
      'ENFILE': 41,
      'EMFILE': 33,
      'ENOTTY': 59,
      'ETXTBSY': 74,
      'EFBIG': 22,
      'ENOSPC': 51,
      'ESPIPE': 70,
      'EROFS': 69,
      'EMLINK': 34,
      'EPIPE': 64,
      'EDOM': 18,
      'ERANGE': 68,
      'ENOMSG': 49,
      'EIDRM': 24,
      'ECHRNG': 106,
      'EL2NSYNC': 156,
      'EL3HLT': 107,
      'EL3RST': 108,
      'ELNRNG': 109,
      'EUNATCH': 110,
      'ENOCSI': 111,
      'EL2HLT': 112,
      'EDEADLK': 16,
      'ENOLCK': 46,
      'EBADE': 113,
      'EBADR': 114,
      'EXFULL': 115,
      'ENOANO': 104,
      'EBADRQC': 103,
      'EBADSLT': 102,
      'EDEADLOCK': 16,
      'EBFONT': 101,
      'ENOSTR': 100,
      'ENODATA': 116,
      'ETIME': 117,
      'ENOSR': 118,
      'ENONET': 119,
      'ENOPKG': 120,
      'EREMOTE': 121,
      'ENOLINK': 47,
      'EADV': 122,
      'ESRMNT': 123,
      'ECOMM': 124,
      'EPROTO': 65,
      'EMULTIHOP': 36,
      'EDOTDOT': 125,
      'EBADMSG': 9,
      'ENOTUNIQ': 126,
      'EBADFD': 127,
      'EREMCHG': 128,
      'ELIBACC': 129,
      'ELIBBAD': 130,
      'ELIBSCN': 131,
      'ELIBMAX': 132,
      'ELIBEXEC': 133,
      'ENOSYS': 52,
      'ENOTEMPTY': 55,
      'ENAMETOOLONG': 37,
      'ELOOP': 32,
      'EOPNOTSUPP': 138,
      'EPFNOSUPPORT': 139,
      'ECONNRESET': 15,
      'ENOBUFS': 42,
      'EAFNOSUPPORT': 5,
      'EPROTOTYPE': 67,
      'ENOTSOCK': 57,
      'ENOPROTOOPT': 50,
      'ESHUTDOWN': 140,
      'ECONNREFUSED': 14,
      'EADDRINUSE': 3,
      'ECONNABORTED': 13,
      'ENETUNREACH': 40,
      'ENETDOWN': 38,
      'ETIMEDOUT': 73,
      'EHOSTDOWN': 142,
      'EHOSTUNREACH': 23,
      'EINPROGRESS': 26,
      'EALREADY': 7,
      'EDESTADDRREQ': 17,
      'EMSGSIZE': 35,
      'EPROTONOSUPPORT': 66,
      'ESOCKTNOSUPPORT': 137,
      'EADDRNOTAVAIL': 4,
      'ENETRESET': 39,
      'EISCONN': 30,
      'ENOTCONN': 53,
      'ETOOMANYREFS': 141,
      'EUSERS': 136,
      'EDQUOT': 19,
      'ESTALE': 72,
      'ENOTSUP': 138,
      'ENOMEDIUM': 148,
      'EILSEQ': 25,
      'EOVERFLOW': 61,
      'ECANCELED': 11,
      'ENOTRECOVERABLE': 56,
      'EOWNERDEAD': 62,
      'ESTRPIPE': 135,
    };
  
  var asyncLoad = async (url) => {
      var arrayBuffer = await readAsync(url);
      assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
      return new Uint8Array(arrayBuffer);
    };
  
  
  var FS_createDataFile = (...args) => FS.createDataFile(...args);
  
  var getUniqueRunDependency = (id) => {
      var orig = id;
      while (1) {
        if (!runDependencyTracking[id]) return id;
        id = orig + Math.random();
      }
    };
  
  var runDependencies = 0;
  
  
  var dependenciesFulfilled = null;
  
  var runDependencyTracking = {
  };
  
  var runDependencyWatcher = null;
  var removeRunDependency = (id) => {
      runDependencies--;
  
      Module['monitorRunDependencies']?.(runDependencies);
  
      assert(id, 'removeRunDependency requires an ID');
      assert(runDependencyTracking[id]);
      delete runDependencyTracking[id];
      if (runDependencies == 0) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        if (dependenciesFulfilled) {
          var callback = dependenciesFulfilled;
          dependenciesFulfilled = null;
          callback(); // can add another dependenciesFulfilled
        }
      }
    };
  
  
  var addRunDependency = (id) => {
      runDependencies++;
  
      Module['monitorRunDependencies']?.(runDependencies);
  
      assert(id, 'addRunDependency requires an ID')
      assert(!runDependencyTracking[id]);
      runDependencyTracking[id] = 1;
      if (runDependencyWatcher === null && globalThis.setInterval) {
        // Check for missing dependencies every few seconds
        runDependencyWatcher = setInterval(() => {
          if (ABORT) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null;
            return;
          }
          var shown = false;
          for (var dep in runDependencyTracking) {
            if (!shown) {
              shown = true;
              err('still waiting on run dependencies:');
            }
            err(`dependency: ${dep}`);
          }
          if (shown) {
            err('(end of list)');
          }
        }, 10000);
        // Prevent this timer from keeping the runtime alive if nothing
        // else is.
        runDependencyWatcher.unref?.()
      }
    };
  
  
  var preloadPlugins = [];
  var FS_handledByPreloadPlugin = async (byteArray, fullname) => {
      // Ensure plugins are ready.
      if (typeof Browser != 'undefined') Browser.init();
  
      for (var plugin of preloadPlugins) {
        if (plugin['canHandle'](fullname)) {
          assert(plugin['handle'].constructor.name === 'AsyncFunction', 'Filesystem plugin handlers must be async functions (See #24914)')
          return plugin['handle'](byteArray, fullname);
        }
      }
      // If no plugin handled this file then return the original/unmodified
      // byteArray.
      return byteArray;
    };
  var FS_preloadFile = async (parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) => {
      // TODO we should allow people to just pass in a complete filename instead
      // of parent and name being that we just join them anyways
      var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
      var dep = getUniqueRunDependency(`cp ${fullname}`); // might have several active requests for the same fullname
      addRunDependency(dep);
  
      try {
        var byteArray = url;
        if (typeof url == 'string') {
          byteArray = await asyncLoad(url);
        }
  
        byteArray = await FS_handledByPreloadPlugin(byteArray, fullname);
        preFinish?.();
        if (!dontCreateFile) {
          FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
        }
      } finally {
        removeRunDependency(dep);
      }
    };
  var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
      FS_preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish).then(onload).catch(onerror);
    };
  var FS = {
  root:null,
  mounts:[],
  devices:{
  },
  streams:[],
  nextInode:1,
  nameTable:null,
  currentPath:"/",
  initialized:false,
  ignorePermissions:true,
  filesystems:null,
  syncFSRequests:0,
  readFiles:{
  },
  ErrnoError:class extends Error {
        name = 'ErrnoError';
        // We set the `name` property to be able to identify `FS.ErrnoError`
        // - the `name` is a standard ECMA-262 property of error objects. Kind of good to have it anyway.
        // - when using PROXYFS, an error can come from an underlying FS
        // as different FS objects have their own FS.ErrnoError each,
        // the test `err instanceof FS.ErrnoError` won't detect an error coming from another filesystem, causing bugs.
        // we'll use the reliable test `err.name == "ErrnoError"` instead
        constructor(errno) {
          super(runtimeInitialized ? strError(errno) : '');
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
        }
      },
  FSStream:class {
        shared = {};
        get object() {
          return this.node;
        }
        set object(val) {
          this.node = val;
        }
        get isRead() {
          return (this.flags & 2097155) !== 1;
        }
        get isWrite() {
          return (this.flags & 2097155) !== 0;
        }
        get isAppend() {
          return (this.flags & 1024);
        }
        get flags() {
          return this.shared.flags;
        }
        set flags(val) {
          this.shared.flags = val;
        }
        get position() {
          return this.shared.position;
        }
        set position(val) {
          this.shared.position = val;
        }
      },
  FSNode:class {
        node_ops = {};
        stream_ops = {};
        readMode = 292 | 73;
        writeMode = 146;
        mounted = null;
        constructor(parent, name, mode, rdev) {
          if (!parent) {
            parent = this;  // root node sets parent to itself
          }
          this.parent = parent;
          this.mount = parent.mount;
          this.id = FS.nextInode++;
          this.name = name;
          this.mode = mode;
          this.rdev = rdev;
          this.atime = this.mtime = this.ctime = Date.now();
        }
        get read() {
          return (this.mode & this.readMode) === this.readMode;
        }
        set read(val) {
          val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
        }
        get write() {
          return (this.mode & this.writeMode) === this.writeMode;
        }
        set write(val) {
          val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
        }
        get isFolder() {
          return FS.isDir(this.mode);
        }
        get isDevice() {
          return FS.isChrdev(this.mode);
        }
      },
  lookupPath(path, opts = {}) {
        if (!path) {
          throw new FS.ErrnoError(44);
        }
        opts.follow_mount ??= true
  
        if (!PATH.isAbs(path)) {
          path = FS.cwd() + '/' + path;
        }
  
        // limit max consecutive symlinks to 40 (SYMLOOP_MAX).
        linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
          // split the absolute path
          var parts = path.split('/').filter((p) => !!p);
  
          // start at the root
          var current = FS.root;
          var current_path = '/';
  
          for (var i = 0; i < parts.length; i++) {
            var islast = (i === parts.length-1);
            if (islast && opts.parent) {
              // stop resolving
              break;
            }
  
            if (parts[i] === '.') {
              continue;
            }
  
            if (parts[i] === '..') {
              current_path = PATH.dirname(current_path);
              if (FS.isRoot(current)) {
                path = current_path + '/' + parts.slice(i + 1).join('/');
                // We're making progress here, don't let many consecutive ..'s
                // lead to ELOOP
                nlinks--;
                continue linkloop;
              } else {
                current = current.parent;
              }
              continue;
            }
  
            current_path = PATH.join2(current_path, parts[i]);
            try {
              current = FS.lookupNode(current, parts[i]);
            } catch (e) {
              // if noent_okay is true, suppress a ENOENT in the last component
              // and return an object with an undefined node. This is needed for
              // resolving symlinks in the path when creating a file.
              if ((e?.errno === 44) && islast && opts.noent_okay) {
                return { path: current_path };
              }
              throw e;
            }
  
            // jump to the mount's root node if this is a mountpoint
            if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
              current = current.mounted.root;
            }
  
            // by default, lookupPath will not follow a symlink if it is the final path component.
            // setting opts.follow = true will override this behavior.
            if (FS.isLink(current.mode) && (!islast || opts.follow)) {
              if (!current.node_ops.readlink) {
                throw new FS.ErrnoError(52);
              }
              var link = current.node_ops.readlink(current);
              if (!PATH.isAbs(link)) {
                link = PATH.dirname(current_path) + '/' + link;
              }
              path = link + '/' + parts.slice(i + 1).join('/');
              continue linkloop;
            }
          }
          return { path: current_path, node: current };
        }
        throw new FS.ErrnoError(32);
      },
  getPath(node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? `${mount}/${path}` : mount + path;
          }
          path = path ? `${node.name}/${path}` : node.name;
          node = node.parent;
        }
      },
  hashName(parentid, name) {
        var hash = 0;
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },
  hashAddNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },
  hashRemoveNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },
  lookupNode(parent, name) {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },
  createNode(parent, name, mode, rdev) {
        assert(typeof parent == 'object')
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },
  destroyNode(node) {
        FS.hashRemoveNode(node);
      },
  isRoot(node) {
        return node === node.parent;
      },
  isMountpoint(node) {
        return !!node.mounted;
      },
  isFile(mode) {
        return (mode & 61440) === 32768;
      },
  isDir(mode) {
        return (mode & 61440) === 16384;
      },
  isLink(mode) {
        return (mode & 61440) === 40960;
      },
  isChrdev(mode) {
        return (mode & 61440) === 8192;
      },
  isBlkdev(mode) {
        return (mode & 61440) === 24576;
      },
  isFIFO(mode) {
        return (mode & 61440) === 4096;
      },
  isSocket(mode) {
        return (mode & 49152) === 49152;
      },
  flagsToPermissionString(flag) {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },
  nodePermissions(node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.includes('r') && !(node.mode & 292)) {
          return 2;
        } else if (perms.includes('w') && !(node.mode & 146)) {
          return 2;
        } else if (perms.includes('x') && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },
  mayLookup(dir) {
        if (!FS.isDir(dir.mode)) return 54;
        var errCode = FS.nodePermissions(dir, 'x');
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },
  mayCreate(dir, name) {
        if (!FS.isDir(dir.mode)) {
          return 54;
        }
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },
  mayDelete(dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var errCode = FS.nodePermissions(dir, 'wx');
        if (errCode) {
          return errCode;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else {
          if (FS.isDir(node.mode)) {
            return 31;
          }
        }
        return 0;
      },
  mayOpen(node, flags) {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        } else if (FS.isDir(node.mode)) {
          if (FS.flagsToPermissionString(flags) !== 'r' // opening for write
              || (flags & (512 | 64))) { // TODO: check for O_SEARCH? (== search for dir only)
            return 31;
          }
        }
        return FS.nodePermissions(node, FS.flagsToPermissionString(flags));
      },
  checkOpExists(op, err) {
        if (!op) {
          throw new FS.ErrnoError(err);
        }
        return op;
      },
  MAX_OPEN_FDS:4096,
  nextfd() {
        for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },
  getStreamChecked(fd) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        return stream;
      },
  getStream:(fd) => FS.streams[fd],
  createStream(stream, fd = -1) {
        assert(fd >= -1);
  
        // clone it, so we can return an instance of FSStream
        stream = Object.assign(new FS.FSStream(), stream);
        if (fd == -1) {
          fd = FS.nextfd();
        }
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },
  closeStream(fd) {
        FS.streams[fd] = null;
      },
  dupStream(origStream, fd = -1) {
        var stream = FS.createStream(origStream, fd);
        stream.stream_ops?.dup?.(stream);
        return stream;
      },
  doSetAttr(stream, node, attr) {
        var setattr = stream?.stream_ops.setattr;
        var arg = setattr ? stream : node;
        setattr ??= node.node_ops.setattr;
        FS.checkOpExists(setattr, 63)
        setattr(arg, attr);
      },
  chrdev_stream_ops:{
  open(stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          stream.stream_ops.open?.(stream);
        },
  llseek() {
          throw new FS.ErrnoError(70);
        },
  },
  major:(dev) => ((dev) >> 8),
  minor:(dev) => ((dev) & 0xff),
  makedev:(ma, mi) => ((ma) << 8 | (mi)),
  registerDevice(dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },
  getDevice:(dev) => FS.devices[dev],
  getMounts(mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push(...m.mounts);
        }
  
        return mounts;
      },
  syncfs(populate, callback) {
        if (typeof populate == 'function') {
          callback = populate;
          populate = false;
        }
  
        FS.syncFSRequests++;
  
        if (FS.syncFSRequests > 1) {
          err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function doCallback(errCode) {
          assert(FS.syncFSRequests > 0);
          FS.syncFSRequests--;
          return callback(errCode);
        }
  
        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        };
  
        // sync all mounts
        for (var mount of mounts) {
          if (mount.type.syncfs) {
            mount.type.syncfs(mount, populate, done);
          } else {
            done(null);
          }
        }
      },
  mount(type, opts, mountpoint) {
        if (typeof type == 'string') {
          // The filesystem was not included, and instead we have an error
          // message stored in the variable.
          throw type;
        }
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }
  
        var mount = {
          type,
          opts,
          mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },
  unmount(mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        for (var [hash, current] of Object.entries(FS.nameTable)) {
          while (current) {
            var next = current.name_next;
  
            if (mounts.includes(current.mount)) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        }
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },
  lookup(parent, name) {
        return parent.node_ops.lookup(parent, name);
      },
  mknod(path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name) {
          throw new FS.ErrnoError(28);
        }
        if (name === '.' || name === '..') {
          throw new FS.ErrnoError(20);
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },
  statfs(path) {
        return FS.statfsNode(FS.lookupPath(path, {follow: true}).node);
      },
  statfsStream(stream) {
        // We keep a separate statfsStream function because noderawfs overrides
        // it. In noderawfs, stream.node is sometimes null. Instead, we need to
        // look at stream.path.
        return FS.statfsNode(stream.node);
      },
  statfsNode(node) {
        // NOTE: None of the defaults here are true. We're just returning safe and
        //       sane values. Currently nodefs and rawfs replace these defaults,
        //       other file systems leave them alone.
        var rtn = {
          bsize: 4096,
          frsize: 4096,
          blocks: 1e6,
          bfree: 5e5,
          bavail: 5e5,
          files: FS.nextInode,
          ffree: FS.nextInode - 1,
          fsid: 42,
          flags: 2,
          namelen: 255,
        };
  
        if (node.node_ops.statfs) {
          Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
        }
        return rtn;
      },
  create(path, mode = 0o666) {
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },
  mkdir(path, mode = 0o777) {
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },
  mkdirTree(path, mode) {
        var dirs = path.split('/');
        var d = '';
        for (var dir of dirs) {
          if (!dir) continue;
          if (d || PATH.isAbs(path)) d += '/';
          d += dir;
          try {
            FS.mkdir(d, mode);
          } catch(e) {
            if (e.errno != 20) throw e;
          }
        }
      },
  mkdev(path, mode, dev) {
        if (typeof dev == 'undefined') {
          dev = mode;
          mode = 0o666;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },
  symlink(oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },
  rename(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
  
        // let the errors from non existent directories percolate up
        lookup = FS.lookupPath(old_path, { parent: true });
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, { parent: true });
        new_dir = lookup.node;
  
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(28);
        }
        // new path should not be an ancestor of the old path
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(55);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        errCode = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(10);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, 'w');
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
          // update old node (we do this here to avoid each backend
          // needing to)
          old_node.parent = new_dir;
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },
  rmdir(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },
  readdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
        return readdir(node);
      },
  unlink(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
          // According to POSIX, we should map EISDIR to EPERM, but
          // we instead do what Linux does (and we must, as we use
          // the musl linux libc).
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },
  readlink(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return link.node_ops.readlink(link);
      },
  stat(path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
        return getattr(node);
      },
  fstat(fd) {
        var stream = FS.getStreamChecked(fd);
        var node = stream.node;
        var getattr = stream.stream_ops.getattr;
        var arg = getattr ? stream : node;
        getattr ??= node.node_ops.getattr;
        FS.checkOpExists(getattr, 63)
        return getattr(arg);
      },
  lstat(path) {
        return FS.stat(path, true);
      },
  doChmod(stream, node, mode, dontFollow) {
        FS.doSetAttr(stream, node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          ctime: Date.now(),
          dontFollow
        });
      },
  chmod(path, mode, dontFollow) {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        FS.doChmod(null, node, mode, dontFollow);
      },
  lchmod(path, mode) {
        FS.chmod(path, mode, true);
      },
  fchmod(fd, mode) {
        var stream = FS.getStreamChecked(fd);
        FS.doChmod(stream, stream.node, mode, false);
      },
  doChown(stream, node, dontFollow) {
        FS.doSetAttr(stream, node, {
          timestamp: Date.now(),
          dontFollow
          // we ignore the uid / gid for now
        });
      },
  chown(path, uid, gid, dontFollow) {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        FS.doChown(null, node, dontFollow);
      },
  lchown(path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },
  fchown(fd, uid, gid) {
        var stream = FS.getStreamChecked(fd);
        FS.doChown(stream, stream.node, false);
      },
  doTruncate(stream, node, len) {
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, 'w');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.doSetAttr(stream, node, {
          size: len,
          timestamp: Date.now()
        });
      },
  truncate(path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        FS.doTruncate(null, node, len);
      },
  ftruncate(fd, len) {
        var stream = FS.getStreamChecked(fd);
        if (len < 0 || (stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.doTruncate(stream, stream.node, len);
      },
  utime(path, atime, mtime) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        var setattr = FS.checkOpExists(node.node_ops.setattr, 63);
        setattr(node, {
          atime: atime,
          mtime: mtime
        });
      },
  open(path, flags, mode = 0o666) {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }
        flags = typeof flags == 'string' ? FS_modeStringToFlags(flags) : flags;
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        var isDirPath;
        if (typeof path == 'object') {
          node = path;
        } else {
          isDirPath = path.endsWith("/");
          // noent_okay makes it so that if the final component of the path
          // doesn't exist, lookupPath returns `node: undefined`. `path` will be
          // updated to point to the target of all symlinks.
          var lookup = FS.lookupPath(path, {
            follow: !(flags & 131072),
            noent_okay: true
          });
          node = lookup.node;
          path = lookup.path;
        }
        // perhaps we need to create the node
        var created = false;
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(20);
            }
          } else if (isDirPath) {
            throw new FS.ErrnoError(31);
          } else {
            // node doesn't exist, try to create it
            // Ignore the permission bits here to ensure we can `open` this new
            // file below. We use chmod below to apply the permissions once the
            // file is open.
            node = FS.mknod(path, mode | 0o777, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // if asked only for a directory, then this must be one
        if ((flags & 65536) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
        // check permissions, if this is not a file we just created now (it is ok to
        // create and write to a file with read-only permissions; it is read-only
        // for later use)
        if (!created) {
          var errCode = FS.mayOpen(node, flags);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        // do truncation if necessary
        if ((flags & 512) && !created) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512 | 131072);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        });
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (created) {
          FS.chmod(node, mode & 0o777);
        }
        if (Module['logReadFiles'] && !(flags & 1)) {
          if (!(path in FS.readFiles)) {
            FS.readFiles[path] = 1;
          }
        }
        return stream;
      },
  close(stream) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null; // free readdir state
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },
  isClosed(stream) {
        return stream.fd === null;
      },
  llseek(stream, offset, whence) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },
  read(stream, buffer, offset, length, position) {
        assert(offset >= 0);
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },
  write(stream, buffer, offset, length, position, canOwn) {
        assert(offset >= 0);
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },
  mmap(stream, length, position, prot, flags) {
        // User requests writing to file (prot & PROT_WRITE != 0).
        // Checking if we have permissions to write to the file unless
        // MAP_PRIVATE flag is set. According to POSIX spec it is possible
        // to write to file opened in read-only mode with MAP_PRIVATE flag,
        // as all modifications will be visible only in the memory of
        // the current process.
        if ((prot & 2) !== 0
            && (flags & 2) === 0
            && (stream.flags & 2097155) !== 2) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        if (!length) {
          throw new FS.ErrnoError(28);
        }
        return stream.stream_ops.mmap(stream, length, position, prot, flags);
      },
  msync(stream, buffer, offset, length, mmapFlags) {
        assert(offset >= 0);
        if (!stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },
  ioctl(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },
  readFile(path, opts = {}) {
        opts.flags = opts.flags || 0;
        opts.encoding = opts.encoding || 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          abort(`Invalid encoding type "${opts.encoding}"`);
        }
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          buf = UTF8ArrayToString(buf);
        }
        FS.close(stream);
        return buf;
      },
  writeFile(path, data, opts = {}) {
        opts.flags = opts.flags || 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        if (typeof data == 'string') {
          data = new Uint8Array(intArrayFromString(data, true));
        }
        if (ArrayBuffer.isView(data)) {
          FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        } else {
          abort('Unsupported data type');
        }
        FS.close(stream);
      },
  cwd:() => FS.currentPath,
  chdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var errCode = FS.nodePermissions(lookup.node, 'x');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
      },
  createDefaultDirectories() {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },
  createDefaultDevices() {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: () => 0,
          write: (stream, buffer, offset, length, pos) => length,
          llseek: () => 0,
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using err() rather than out()
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // setup /dev/[u]random
        // use a buffer to avoid overhead of individual crypto calls per byte
        var randomBuffer = new Uint8Array(1024), randomLeft = 0;
        var randomByte = () => {
          if (randomLeft === 0) {
            randomFill(randomBuffer);
            randomLeft = randomBuffer.byteLength;
          }
          return randomBuffer[--randomLeft];
        };
        FS.createDevice('/dev', 'random', randomByte);
        FS.createDevice('/dev', 'urandom', randomByte);
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },
  createSpecialDirectories() {
        // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
        // name of the stream for fd 6 (see test_unistd_ttyname)
        FS.mkdir('/proc');
        var proc_self = FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
          mount() {
            var node = FS.createNode(proc_self, 'fd', 16895, 73);
            node.stream_ops = {
              llseek: MEMFS.stream_ops.llseek,
            };
            node.node_ops = {
              lookup(parent, name) {
                var fd = +name;
                var stream = FS.getStreamChecked(fd);
                var ret = {
                  parent: null,
                  mount: { mountpoint: 'fake' },
                  node_ops: { readlink: () => stream.path },
                  id: fd + 1,
                };
                ret.parent = ret; // make it look like a simple root node
                return ret;
              },
              readdir() {
                return Array.from(FS.streams.entries())
                  .filter(([k, v]) => v)
                  .map(([k, v]) => k.toString());
              }
            };
            return node;
          }
        }, {}, '/proc/self/fd');
      },
  createStandardStreams(input, output, error) {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (input) {
          FS.createDevice('/dev', 'stdin', input);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (output) {
          FS.createDevice('/dev', 'stdout', null, output);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (error) {
          FS.createDevice('/dev', 'stderr', null, error);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 0);
        var stdout = FS.open('/dev/stdout', 1);
        var stderr = FS.open('/dev/stderr', 1);
        assert(stdin.fd === 0, `invalid handle for stdin (${stdin.fd})`);
        assert(stdout.fd === 1, `invalid handle for stdout (${stdout.fd})`);
        assert(stderr.fd === 2, `invalid handle for stderr (${stderr.fd})`);
      },
  staticInit() {
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
  
        FS.filesystems = {
          'MEMFS': MEMFS,
        };
      },
  init(input, output, error) {
        assert(!FS.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.initialized = true;
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        input ??= Module['stdin'];
        output ??= Module['stdout'];
        error ??= Module['stderr'];
  
        FS.createStandardStreams(input, output, error);
      },
  quit() {
        FS.initialized = false;
        // force-flush all streams, so we get musl std streams printed out
        _fflush(0);
        // close all of our streams
        for (var stream of FS.streams) {
          if (stream) {
            FS.close(stream);
          }
        }
      },
  findObject(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (!ret.exists) {
          return null;
        }
        return ret.object;
      },
  analyzePath(path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },
  createPath(parent, path, canRead, canWrite) {
        parent = typeof parent == 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            if (e.errno != 20) throw e;
          }
          parent = current;
        }
        return current;
      },
  createFile(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(canRead, canWrite);
        return FS.create(path, mode);
      },
  createDataFile(parent, name, data, canRead, canWrite, canOwn) {
        var path = name;
        if (parent) {
          parent = typeof parent == 'string' ? parent : FS.getPath(parent);
          path = name ? PATH.join2(parent, name) : parent;
        }
        var mode = FS_getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          if (typeof data == 'string') {
            var arr = new Array(data.length);
            for (var i = 0, len = data.length; i < len; ++i) arr[i] = data.charCodeAt(i);
            data = arr;
          }
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 577);
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
      },
  createDevice(parent, name, input, output) {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(!!input, !!output);
        FS.createDevice.major ??= 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open(stream) {
            stream.seekable = false;
          },
          close(stream) {
            // flush any pending line data
            if (output?.buffer?.length) {
              output(10);
            }
          },
          read(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.atime = Date.now();
            }
            return bytesRead;
          },
          write(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.mtime = stream.node.ctime = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },
  forceLoadFile(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        if (globalThis.XMLHttpRequest) {
          abort("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else { // Command-line.
          try {
            obj.contents = readBinary(obj.url);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
      },
  createLazyFile(parent, name, url, canRead, canWrite) {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array).
        // Actual getting is abstracted away for eventual reuse.
        class LazyUint8Array {
          lengthKnown = false;
          chunks = []; // Loaded chunks. Index is the chunk number
          get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = (idx / this.chunkSize)|0;
            return this.getter(chunkNum)[chunkOffset];
          }
          setDataGetter(getter) {
            this.getter = getter;
          }
          cacheLength() {
            // Find length
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
  
            var chunkSize = 1024*1024; // Chunk size in bytes
  
            if (!hasByteServing) chunkSize = datalength;
  
            // Function to get a range from the remote URL.
            var doXHR = (from, to) => {
              if (from > to) abort("invalid range (" + from + ", " + to + ") or no bytes requested!");
              if (to > datalength-1) abort("only " + datalength + " bytes available! programmer error!");
  
              // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
              // Some hints to the browser that we want binary data.
              xhr.responseType = 'arraybuffer';
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
              }
  
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load " + url + ". Status: " + xhr.status);
              if (xhr.response !== undefined) {
                return new Uint8Array(/** @type{Array<number>} */(xhr.response || []));
              }
              return intArrayFromString(xhr.responseText || '', true);
            };
            var lazyArray = this;
            lazyArray.setDataGetter((chunkNum) => {
              var start = chunkNum * chunkSize;
              var end = (chunkNum+1) * chunkSize - 1; // including this byte
              end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
              if (typeof lazyArray.chunks[chunkNum] == 'undefined') {
                lazyArray.chunks[chunkNum] = doXHR(start, end);
              }
              if (typeof lazyArray.chunks[chunkNum] == 'undefined') abort('doXHR failed!');
              return lazyArray.chunks[chunkNum];
            });
  
            if (usesGzip || !datalength) {
              // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
              chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
              datalength = this.getter(0).length;
              chunkSize = datalength;
              out("LazyFiles on gzip forces download of the whole file when length is accessed");
            }
  
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true;
          }
          get length() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._length;
          }
          get chunkSize() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._chunkSize;
          }
        }
  
        if (globalThis.XMLHttpRequest) {
          if (!ENVIRONMENT_IS_WORKER) abort('Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc');
          var lazyArray = new LazyUint8Array();
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // Add a function that defers querying the file size until it is asked the first time.
        Object.defineProperties(node, {
          usedBytes: {
            get: function() { return this.contents.length; }
          }
        });
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        for (const [key, fn] of Object.entries(node.stream_ops)) {
          stream_ops[key] = (...args) => {
            FS.forceLoadFile(node);
            return fn(...args);
          };
        }
        function writeChunks(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        }
        // use a custom read function
        stream_ops.read = (stream, buffer, offset, length, position) => {
          FS.forceLoadFile(node);
          return writeChunks(stream, buffer, offset, length, position)
        };
        // use a custom mmap function
        stream_ops.mmap = (stream, length, position, prot, flags) => {
          FS.forceLoadFile(node);
          var ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS.ErrnoError(48);
          }
          writeChunks(stream, HEAP8, ptr, length, position);
          return { ptr, allocated: true };
        };
        node.stream_ops = stream_ops;
        return node;
      },
  absolutePath() {
        abort('FS.absolutePath has been removed; use PATH_FS.resolve instead');
      },
  createFolder() {
        abort('FS.createFolder has been removed; use FS.mkdir instead');
      },
  createLink() {
        abort('FS.createLink has been removed; use FS.symlink instead');
      },
  joinPath() {
        abort('FS.joinPath has been removed; use PATH.join instead');
      },
  mmapAlloc() {
        abort('FS.mmapAlloc has been replaced by the top level function mmapAlloc');
      },
  standardizePath() {
        abort('FS.standardizePath has been removed; use PATH.normalize instead');
      },
  };
  
  var SYSCALLS = {
  calculateAt(dirfd, path, allowEmpty) {
        if (PATH.isAbs(path)) {
          return path;
        }
        // relative path
        var dir;
        if (dirfd === -100) {
          dir = FS.cwd();
        } else {
          var dirstream = SYSCALLS.getStreamFromFD(dirfd);
          dir = dirstream.path;
        }
        if (path.length == 0) {
          if (!allowEmpty) {
            throw new FS.ErrnoError(44);;
          }
          return dir;
        }
        return dir + '/' + path;
      },
  writeStat(buf, stat) {
        HEAPU32[((buf)>>2)] = stat.dev;
        HEAPU32[(((buf)+(4))>>2)] = stat.mode;
        HEAPU32[(((buf)+(8))>>2)] = stat.nlink;
        HEAPU32[(((buf)+(12))>>2)] = stat.uid;
        HEAPU32[(((buf)+(16))>>2)] = stat.gid;
        HEAPU32[(((buf)+(20))>>2)] = stat.rdev;
        HEAP64[(((buf)+(24))>>3)] = BigInt(stat.size);
        HEAP32[(((buf)+(32))>>2)] = 4096;
        HEAP32[(((buf)+(36))>>2)] = stat.blocks;
        var atime = stat.atime.getTime();
        var mtime = stat.mtime.getTime();
        var ctime = stat.ctime.getTime();
        HEAP64[(((buf)+(40))>>3)] = BigInt(Math.floor(atime / 1000));
        HEAPU32[(((buf)+(48))>>2)] = (atime % 1000) * 1000 * 1000;
        HEAP64[(((buf)+(56))>>3)] = BigInt(Math.floor(mtime / 1000));
        HEAPU32[(((buf)+(64))>>2)] = (mtime % 1000) * 1000 * 1000;
        HEAP64[(((buf)+(72))>>3)] = BigInt(Math.floor(ctime / 1000));
        HEAPU32[(((buf)+(80))>>2)] = (ctime % 1000) * 1000 * 1000;
        HEAP64[(((buf)+(88))>>3)] = BigInt(stat.ino);
        return 0;
      },
  writeStatFs(buf, stats) {
        HEAPU32[(((buf)+(4))>>2)] = stats.bsize;
        HEAPU32[(((buf)+(60))>>2)] = stats.bsize;
        HEAP64[(((buf)+(8))>>3)] = BigInt(stats.blocks);
        HEAP64[(((buf)+(16))>>3)] = BigInt(stats.bfree);
        HEAP64[(((buf)+(24))>>3)] = BigInt(stats.bavail);
        HEAP64[(((buf)+(32))>>3)] = BigInt(stats.files);
        HEAP64[(((buf)+(40))>>3)] = BigInt(stats.ffree);
        HEAPU32[(((buf)+(48))>>2)] = stats.fsid;
        HEAPU32[(((buf)+(64))>>2)] = stats.flags;  // ST_NOSUID
        HEAPU32[(((buf)+(56))>>2)] = stats.namelen;
      },
  doMsync(addr, stream, len, flags, offset) {
        if (!FS.isFile(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (flags & 2) {
          // MAP_PRIVATE calls need not to be synced back to underlying fs
          return 0;
        }
        var buffer = HEAPU8.slice(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
      },
  getStreamFromFD(fd) {
        var stream = FS.getStreamChecked(fd);
        return stream;
      },
  varargs:undefined,
  getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
  };
  function _fd_close(fd) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  /** @param {number=} offset */
  var doReadv = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        var curr = FS.read(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break; // nothing more to read
        if (typeof offset != 'undefined') {
          offset += curr;
        }
      }
      return ret;
    };
  
  function _fd_read(fd, iov, iovcnt, pnum) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doReadv(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  
  var INT53_MAX = 9007199254740992;
  
  var INT53_MIN = -9007199254740992;
  var bigintToI53Checked = (num) => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);
  function _fd_seek(fd, offset, whence, newOffset) {
    offset = bigintToI53Checked(offset);
  
  
  try {
  
      if (isNaN(offset)) return 61;
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.llseek(stream, offset, whence);
      HEAP64[((newOffset)>>3)] = BigInt(stream.position);
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  ;
  }

  /** @param {number=} offset */
  var doWritev = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        var curr = FS.write(stream, HEAP8, ptr, len, offset);
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) {
          // No more space to write.
          break;
        }
        if (typeof offset != 'undefined') {
          offset += curr;
        }
      }
      return ret;
    };
  
  function _fd_write(fd, iov, iovcnt, pnum) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doWritev(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }

  
  var runtimeKeepaliveCounter = 0;
  var keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0;
  var _proc_exit = (code) => {
      EXITSTATUS = code;
      if (!keepRuntimeAlive()) {
        Module['onExit']?.(code);
        ABORT = true;
      }
      quit_(code, new ExitStatus(code));
    };
  
  
  /** @param {boolean|number=} implicit */
  var exitJS = (status, implicit) => {
      EXITSTATUS = status;
  
      checkUnflushedContent();
  
      // if exit() was called explicitly, warn the user if the runtime isn't actually being shut down
      if (keepRuntimeAlive() && !implicit) {
        var msg = `program exited (with status: ${status}), but keepRuntimeAlive() is set (counter=${runtimeKeepaliveCounter}) due to an async operation, so halting execution but not exiting the runtime or preventing further async execution (you can use emscripten_force_exit, if you want to force a true shutdown)`;
        readyPromiseReject?.(msg);
        err(msg);
      }
  
      _proc_exit(status);
    };

  var handleException = (e) => {
      // Certain exception types we do not treat as errors since they are used for
      // internal control flow.
      // 1. ExitStatus, which is thrown by exit()
      // 2. "unwind", which is thrown by emscripten_unwind_to_js_event_loop() and others
      //    that wish to return to JS event loop.
      if (e instanceof ExitStatus || e == 'unwind') {
        return EXITSTATUS;
      }
      checkStackCookie();
      if (e instanceof WebAssembly.RuntimeError) {
        if (_emscripten_stack_get_current() <= 0) {
          err('Stack overflow detected.  You can try increasing -sSTACK_SIZE (currently set to 65536)');
        }
      }
      quit_(1, e);
    };

  var getCFunc = (ident) => {
      var func = Module['_' + ident]; // closure exported function
      assert(func, 'Cannot call unknown function ' + ident + ', make sure it is exported');
      return func;
    };
  
  var writeArrayToMemory = (array, buffer) => {
      assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
      HEAP8.set(array, buffer);
    };
  
  
  
  var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
  var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8(str, ret, size);
      return ret;
    };
  
  
  
  
  
    /**
   * @param {string|null=} returnType
   * @param {Array=} argTypes
   * @param {Array=} args
   * @param {Object=} opts
   */
  var ccall = (ident, returnType, argTypes, args, opts) => {
      // For fast lookup of conversion functions
      var toC = {
        'string': (str) => {
          var ret = 0;
          if (str !== null && str !== undefined && str !== 0) { // null string
            ret = stringToUTF8OnStack(str);
          }
          return ret;
        },
        'array': (arr) => {
          var ret = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        }
      };
  
      function convertReturnValue(ret) {
        if (returnType === 'string') {
          return UTF8ToString(ret);
        }
        if (returnType === 'boolean') return Boolean(ret);
        return ret;
      }
  
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      assert(returnType !== 'array', 'Return type should not be "array".');
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var ret = func(...cArgs);
      function onDone(ret) {
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret);
      }
  
      ret = onDone(ret);
      return ret;
    };

  
    /**
   * @param {string=} returnType
   * @param {Array=} argTypes
   * @param {Object=} opts
   */
  var cwrap = (ident, returnType, argTypes, opts) => {
      return (...args) => ccall(ident, returnType, argTypes, args, opts);
    };

    // Precreate a reverse lookup table from chars
    // "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" back to
    // bytes to make decoding fast.
    for (var base64ReverseLookup = new Uint8Array(123/*'z'+1*/), i = 25; i >= 0; --i) {
      base64ReverseLookup[48+i] = 52+i; // '0-9'
      base64ReverseLookup[65+i] = i; // 'A-Z'
      base64ReverseLookup[97+i] = 26+i; // 'a-z'
    }
    base64ReverseLookup[43] = 62; // '+'
    base64ReverseLookup[47] = 63; // '/'
  ;
init_ClassHandle();
init_RegisteredPointer();
assert(emval_handles.length === 5 * 2);

  FS.createPreloadedFile = FS_createPreloadedFile;
  FS.preloadFile = FS_preloadFile;
  FS.staticInit();;
// End JS library code

// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.

{

  // Begin ATMODULES hooks
  if (Module['noExitRuntime']) noExitRuntime = Module['noExitRuntime'];
if (Module['preloadPlugins']) preloadPlugins = Module['preloadPlugins'];
if (Module['print']) out = Module['print'];
if (Module['printErr']) err = Module['printErr'];
if (Module['wasmBinary']) wasmBinary = Module['wasmBinary'];
  // End ATMODULES hooks

  checkIncomingModuleAPI();

  if (Module['arguments']) arguments_ = Module['arguments'];
  if (Module['thisProgram']) thisProgram = Module['thisProgram'];

  // Assertions on removed incoming Module JS APIs.
  assert(typeof Module['memoryInitializerPrefixURL'] == 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['pthreadMainPrefixURL'] == 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['cdInitializerPrefixURL'] == 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['filePackagePrefixURL'] == 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['read'] == 'undefined', 'Module.read option was removed');
  assert(typeof Module['readAsync'] == 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
  assert(typeof Module['readBinary'] == 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
  assert(typeof Module['setWindowTitle'] == 'undefined', 'Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)');
  assert(typeof Module['TOTAL_MEMORY'] == 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
  assert(typeof Module['ENVIRONMENT'] == 'undefined', 'Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)');
  assert(typeof Module['STACK_SIZE'] == 'undefined', 'STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time')
  // If memory is defined in wasm, the user can't provide it, or set INITIAL_MEMORY
  assert(typeof Module['wasmMemory'] == 'undefined', 'Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally');
  assert(typeof Module['INITIAL_MEMORY'] == 'undefined', 'Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically');

  if (Module['preInit']) {
    if (typeof Module['preInit'] == 'function') Module['preInit'] = [Module['preInit']];
    while (Module['preInit'].length > 0) {
      Module['preInit'].shift()();
    }
  }
  consumedModuleProp('preInit');
}

// Begin runtime exports
  Module['ccall'] = ccall;
  Module['cwrap'] = cwrap;
  var missingLibrarySymbols = [
  'writeI53ToI64',
  'writeI53ToI64Clamped',
  'writeI53ToI64Signaling',
  'writeI53ToU64Clamped',
  'writeI53ToU64Signaling',
  'readI53FromI64',
  'readI53FromU64',
  'convertI32PairToI53',
  'convertI32PairToI53Checked',
  'convertU32PairToI53',
  'getTempRet0',
  'setTempRet0',
  'zeroMemory',
  'getHeapMax',
  'growMemory',
  'withStackSave',
  'inetPton4',
  'inetNtop4',
  'inetPton6',
  'inetNtop6',
  'readSockaddr',
  'writeSockaddr',
  'readEmAsmArgs',
  'jstoi_q',
  'autoResumeAudioContext',
  'getDynCaller',
  'dynCall',
  'runtimeKeepalivePush',
  'runtimeKeepalivePop',
  'callUserCallback',
  'maybeExit',
  'asmjsMangle',
  'alignMemory',
  'HandleAllocator',
  'addOnInit',
  'addOnPostCtor',
  'addOnPreMain',
  'addOnExit',
  'STACK_SIZE',
  'STACK_ALIGN',
  'POINTER_SIZE',
  'ASSERTIONS',
  'convertJsFunctionToWasm',
  'getEmptyTableSlot',
  'updateTableMap',
  'getFunctionAddress',
  'addFunction',
  'removeFunction',
  'intArrayToString',
  'stringToAscii',
  'stringToNewUTF8',
  'registerKeyEventCallback',
  'maybeCStringToJsString',
  'findEventTarget',
  'getBoundingClientRect',
  'fillMouseEventData',
  'registerMouseEventCallback',
  'registerWheelEventCallback',
  'registerUiEventCallback',
  'registerFocusEventCallback',
  'fillDeviceOrientationEventData',
  'registerDeviceOrientationEventCallback',
  'fillDeviceMotionEventData',
  'registerDeviceMotionEventCallback',
  'screenOrientation',
  'fillOrientationChangeEventData',
  'registerOrientationChangeEventCallback',
  'fillFullscreenChangeEventData',
  'registerFullscreenChangeEventCallback',
  'JSEvents_requestFullscreen',
  'JSEvents_resizeCanvasForFullscreen',
  'registerRestoreOldStyle',
  'hideEverythingExceptGivenElement',
  'restoreHiddenElements',
  'setLetterbox',
  'softFullscreenResizeWebGLRenderTarget',
  'doRequestFullscreen',
  'fillPointerlockChangeEventData',
  'registerPointerlockChangeEventCallback',
  'registerPointerlockErrorEventCallback',
  'requestPointerLock',
  'fillVisibilityChangeEventData',
  'registerVisibilityChangeEventCallback',
  'registerTouchEventCallback',
  'fillGamepadEventData',
  'registerGamepadEventCallback',
  'registerBeforeUnloadEventCallback',
  'fillBatteryEventData',
  'registerBatteryEventCallback',
  'setCanvasElementSize',
  'getCanvasElementSize',
  'jsStackTrace',
  'getCallstack',
  'convertPCtoSourceLocation',
  'checkWasiClock',
  'wasiRightsToMuslOFlags',
  'wasiOFlagsToMuslOFlags',
  'safeSetTimeout',
  'setImmediateWrapped',
  'safeRequestAnimationFrame',
  'clearImmediateWrapped',
  'registerPostMainLoop',
  'registerPreMainLoop',
  'getPromise',
  'makePromise',
  'idsToPromises',
  'makePromiseCallback',
  'findMatchingCatch',
  'Browser_asyncPrepareDataCounter',
  'isLeapYear',
  'ydayFromDate',
  'arraySum',
  'addDays',
  'getSocketFromFD',
  'getSocketAddress',
  'FS_mkdirTree',
  '_setNetworkCallback',
  'heapObjectForWebGLType',
  'toTypedArrayIndex',
  'webgl_enable_ANGLE_instanced_arrays',
  'webgl_enable_OES_vertex_array_object',
  'webgl_enable_WEBGL_draw_buffers',
  'webgl_enable_WEBGL_multi_draw',
  'webgl_enable_EXT_polygon_offset_clamp',
  'webgl_enable_EXT_clip_control',
  'webgl_enable_WEBGL_polygon_mode',
  'emscriptenWebGLGet',
  'computeUnpackAlignedImageSize',
  'colorChannelsInGlTextureFormat',
  'emscriptenWebGLGetTexPixelData',
  'emscriptenWebGLGetUniform',
  'webglGetUniformLocation',
  'webglPrepareUniformLocationsBeforeFirstUse',
  'webglGetLeftBracePos',
  'emscriptenWebGLGetVertexAttrib',
  '__glGetActiveAttribOrUniform',
  'writeGLArray',
  'registerWebGlEventCallback',
  'runAndAbortIfError',
  'emscriptenWebGLGetIndexed',
  'webgl_enable_WEBGL_draw_instanced_base_vertex_base_instance',
  'webgl_enable_WEBGL_multi_draw_instanced_base_vertex_base_instance',
  'ALLOC_NORMAL',
  'ALLOC_STACK',
  'allocate',
  'writeStringToMemory',
  'writeAsciiToMemory',
  'allocateUTF8',
  'allocateUTF8OnStack',
  'demangle',
  'stackTrace',
  'getNativeTypeSize',
  'getFunctionArgsName',
  'createJsInvokerSignature',
  'getEnumValueType',
  'PureVirtualError',
  'registerInheritedInstance',
  'unregisterInheritedInstance',
  'getInheritedInstanceCount',
  'getLiveInheritedInstances',
  'enumReadValueFromPointer',
  'setDelayFunction',
  'count_emval_handles',
];
missingLibrarySymbols.forEach(missingLibrarySymbol)

  var unexportedSymbols = [
  'run',
  'out',
  'err',
  'callMain',
  'abort',
  'wasmExports',
  'HEAPF32',
  'HEAPF64',
  'HEAP8',
  'HEAPU8',
  'HEAP16',
  'HEAPU16',
  'HEAP32',
  'HEAPU32',
  'HEAP64',
  'HEAPU64',
  'writeStackCookie',
  'checkStackCookie',
  'INT53_MAX',
  'INT53_MIN',
  'bigintToI53Checked',
  'stackSave',
  'stackRestore',
  'stackAlloc',
  'createNamedFunction',
  'ptrToString',
  'exitJS',
  'abortOnCannotGrowMemory',
  'ENV',
  'ERRNO_CODES',
  'strError',
  'DNS',
  'Protocols',
  'Sockets',
  'timers',
  'warnOnce',
  'readEmAsmArgsArray',
  'getExecutableName',
  'handleException',
  'keepRuntimeAlive',
  'asyncLoad',
  'mmapAlloc',
  'wasmTable',
  'wasmMemory',
  'getUniqueRunDependency',
  'noExitRuntime',
  'addRunDependency',
  'removeRunDependency',
  'addOnPreRun',
  'addOnPostRun',
  'freeTableIndexes',
  'functionsInTableMap',
  'setValue',
  'getValue',
  'PATH',
  'PATH_FS',
  'UTF8Decoder',
  'UTF8ArrayToString',
  'UTF8ToString',
  'stringToUTF8Array',
  'stringToUTF8',
  'lengthBytesUTF8',
  'intArrayFromString',
  'AsciiToString',
  'UTF16Decoder',
  'UTF16ToString',
  'stringToUTF16',
  'lengthBytesUTF16',
  'UTF32ToString',
  'stringToUTF32',
  'lengthBytesUTF32',
  'stringToUTF8OnStack',
  'writeArrayToMemory',
  'JSEvents',
  'specialHTMLTargets',
  'findCanvasEventTarget',
  'currentFullscreenStrategy',
  'restoreOldWindowedStyle',
  'UNWIND_CACHE',
  'ExitStatus',
  'getEnvStrings',
  'doReadv',
  'doWritev',
  'initRandomFill',
  'randomFill',
  'emSetImmediate',
  'emClearImmediate_deps',
  'emClearImmediate',
  'promiseMap',
  'uncaughtExceptionCount',
  'exceptionLast',
  'exceptionCaught',
  'ExceptionInfo',
  'Browser',
  'requestFullscreen',
  'requestFullScreen',
  'setCanvasSize',
  'getUserMedia',
  'createContext',
  'getPreloadedImageData__data',
  'wget',
  'MONTH_DAYS_REGULAR',
  'MONTH_DAYS_LEAP',
  'MONTH_DAYS_REGULAR_CUMULATIVE',
  'MONTH_DAYS_LEAP_CUMULATIVE',
  'base64Decode',
  'SYSCALLS',
  'preloadPlugins',
  'FS_createPreloadedFile',
  'FS_preloadFile',
  'FS_modeStringToFlags',
  'FS_getMode',
  'FS_stdin_getChar_buffer',
  'FS_stdin_getChar',
  'FS_unlink',
  'FS_createPath',
  'FS_createDevice',
  'FS_readFile',
  'FS',
  'FS_root',
  'FS_mounts',
  'FS_devices',
  'FS_streams',
  'FS_nextInode',
  'FS_nameTable',
  'FS_currentPath',
  'FS_initialized',
  'FS_ignorePermissions',
  'FS_filesystems',
  'FS_syncFSRequests',
  'FS_readFiles',
  'FS_lookupPath',
  'FS_getPath',
  'FS_hashName',
  'FS_hashAddNode',
  'FS_hashRemoveNode',
  'FS_lookupNode',
  'FS_createNode',
  'FS_destroyNode',
  'FS_isRoot',
  'FS_isMountpoint',
  'FS_isFile',
  'FS_isDir',
  'FS_isLink',
  'FS_isChrdev',
  'FS_isBlkdev',
  'FS_isFIFO',
  'FS_isSocket',
  'FS_flagsToPermissionString',
  'FS_nodePermissions',
  'FS_mayLookup',
  'FS_mayCreate',
  'FS_mayDelete',
  'FS_mayOpen',
  'FS_checkOpExists',
  'FS_nextfd',
  'FS_getStreamChecked',
  'FS_getStream',
  'FS_createStream',
  'FS_closeStream',
  'FS_dupStream',
  'FS_doSetAttr',
  'FS_chrdev_stream_ops',
  'FS_major',
  'FS_minor',
  'FS_makedev',
  'FS_registerDevice',
  'FS_getDevice',
  'FS_getMounts',
  'FS_syncfs',
  'FS_mount',
  'FS_unmount',
  'FS_lookup',
  'FS_mknod',
  'FS_statfs',
  'FS_statfsStream',
  'FS_statfsNode',
  'FS_create',
  'FS_mkdir',
  'FS_mkdev',
  'FS_symlink',
  'FS_rename',
  'FS_rmdir',
  'FS_readdir',
  'FS_readlink',
  'FS_stat',
  'FS_fstat',
  'FS_lstat',
  'FS_doChmod',
  'FS_chmod',
  'FS_lchmod',
  'FS_fchmod',
  'FS_doChown',
  'FS_chown',
  'FS_lchown',
  'FS_fchown',
  'FS_doTruncate',
  'FS_truncate',
  'FS_ftruncate',
  'FS_utime',
  'FS_open',
  'FS_close',
  'FS_isClosed',
  'FS_llseek',
  'FS_read',
  'FS_write',
  'FS_mmap',
  'FS_msync',
  'FS_ioctl',
  'FS_writeFile',
  'FS_cwd',
  'FS_chdir',
  'FS_createDefaultDirectories',
  'FS_createDefaultDevices',
  'FS_createSpecialDirectories',
  'FS_createStandardStreams',
  'FS_staticInit',
  'FS_init',
  'FS_quit',
  'FS_findObject',
  'FS_analyzePath',
  'FS_createFile',
  'FS_createDataFile',
  'FS_forceLoadFile',
  'FS_createLazyFile',
  'FS_absolutePath',
  'FS_createFolder',
  'FS_createLink',
  'FS_joinPath',
  'FS_mmapAlloc',
  'FS_standardizePath',
  'MEMFS',
  'TTY',
  'PIPEFS',
  'SOCKFS',
  'tempFixedLengthArray',
  'miniTempWebGLFloatBuffers',
  'miniTempWebGLIntBuffers',
  'GL',
  'AL',
  'GLUT',
  'EGL',
  'GLEW',
  'IDBStore',
  'SDL',
  'SDL_gfx',
  'print',
  'printErr',
  'jstoi_s',
  'InternalError',
  'BindingError',
  'throwInternalError',
  'throwBindingError',
  'registeredTypes',
  'awaitingDependencies',
  'typeDependencies',
  'tupleRegistrations',
  'structRegistrations',
  'sharedRegisterType',
  'whenDependentTypesAreResolved',
  'getTypeName',
  'getFunctionName',
  'heap32VectorToArray',
  'requireRegisteredType',
  'usesDestructorStack',
  'checkArgCount',
  'getRequiredArgCount',
  'createJsInvoker',
  'UnboundTypeError',
  'EmValType',
  'EmValOptionalType',
  'throwUnboundTypeError',
  'ensureOverloadTable',
  'exposePublicSymbol',
  'replacePublicSymbol',
  'embindRepr',
  'registeredInstances',
  'getBasestPointer',
  'getInheritedInstance',
  'registeredPointers',
  'registerType',
  'integerReadValueFromPointer',
  'floatReadValueFromPointer',
  'assertIntegerRange',
  'readPointer',
  'installIndexedIterator',
  'runDestructors',
  'craftInvokerFunction',
  'embind__requireFunction',
  'genericPointerToWireType',
  'constNoSmartPtrRawPointerToWireType',
  'nonConstNoSmartPtrRawPointerToWireType',
  'init_RegisteredPointer',
  'RegisteredPointer',
  'RegisteredPointer_fromWireType',
  'runDestructor',
  'releaseClassHandle',
  'finalizationRegistry',
  'detachFinalizer_deps',
  'detachFinalizer',
  'attachFinalizer',
  'makeClassHandle',
  'init_ClassHandle',
  'ClassHandle',
  'throwInstanceAlreadyDeleted',
  'deletionQueue',
  'flushPendingDeletes',
  'delayFunction',
  'RegisteredClass',
  'shallowCopyInternalPointer',
  'downcastPointer',
  'upcastPointer',
  'validateThis',
  'char_0',
  'char_9',
  'makeLegalFunctionName',
  'emval_freelist',
  'emval_handles',
  'emval_symbols',
  'getStringOrSymbol',
  'Emval',
  'emval_returnValue',
  'emval_lookupTypes',
  'emval_methodCallers',
  'emval_addMethodCaller',
];
unexportedSymbols.forEach(unexportedRuntimeSymbol);

  // End runtime exports
  // Begin JS library exports
  // End JS library exports

// end include: postlibrary.js

function checkIncomingModuleAPI() {
  ignoredModuleProp('fetchSettings');
}

// Imports from the Wasm binary.
var ___getTypeName = makeInvalidEarlyAccess('___getTypeName');
var _malloc = makeInvalidEarlyAccess('_malloc');
var _main = Module['_main'] = makeInvalidEarlyAccess('_main');
var _fflush = makeInvalidEarlyAccess('_fflush');
var _emscripten_stack_get_end = makeInvalidEarlyAccess('_emscripten_stack_get_end');
var _emscripten_stack_get_base = makeInvalidEarlyAccess('_emscripten_stack_get_base');
var _strerror = makeInvalidEarlyAccess('_strerror');
var _free = makeInvalidEarlyAccess('_free');
var _emscripten_stack_init = makeInvalidEarlyAccess('_emscripten_stack_init');
var _emscripten_stack_get_free = makeInvalidEarlyAccess('_emscripten_stack_get_free');
var __emscripten_stack_restore = makeInvalidEarlyAccess('__emscripten_stack_restore');
var __emscripten_stack_alloc = makeInvalidEarlyAccess('__emscripten_stack_alloc');
var _emscripten_stack_get_current = makeInvalidEarlyAccess('_emscripten_stack_get_current');
var memory = makeInvalidEarlyAccess('memory');
var __indirect_function_table = makeInvalidEarlyAccess('__indirect_function_table');
var wasmMemory = makeInvalidEarlyAccess('wasmMemory');
var wasmTable = makeInvalidEarlyAccess('wasmTable');

function assignWasmExports(wasmExports) {
  assert(typeof wasmExports['__getTypeName'] != 'undefined', 'missing Wasm export: __getTypeName');
  assert(typeof wasmExports['malloc'] != 'undefined', 'missing Wasm export: malloc');
  assert(typeof wasmExports['main'] != 'undefined', 'missing Wasm export: main');
  assert(typeof wasmExports['fflush'] != 'undefined', 'missing Wasm export: fflush');
  assert(typeof wasmExports['emscripten_stack_get_end'] != 'undefined', 'missing Wasm export: emscripten_stack_get_end');
  assert(typeof wasmExports['emscripten_stack_get_base'] != 'undefined', 'missing Wasm export: emscripten_stack_get_base');
  assert(typeof wasmExports['strerror'] != 'undefined', 'missing Wasm export: strerror');
  assert(typeof wasmExports['free'] != 'undefined', 'missing Wasm export: free');
  assert(typeof wasmExports['emscripten_stack_init'] != 'undefined', 'missing Wasm export: emscripten_stack_init');
  assert(typeof wasmExports['emscripten_stack_get_free'] != 'undefined', 'missing Wasm export: emscripten_stack_get_free');
  assert(typeof wasmExports['_emscripten_stack_restore'] != 'undefined', 'missing Wasm export: _emscripten_stack_restore');
  assert(typeof wasmExports['_emscripten_stack_alloc'] != 'undefined', 'missing Wasm export: _emscripten_stack_alloc');
  assert(typeof wasmExports['emscripten_stack_get_current'] != 'undefined', 'missing Wasm export: emscripten_stack_get_current');
  assert(typeof wasmExports['memory'] != 'undefined', 'missing Wasm export: memory');
  assert(typeof wasmExports['__indirect_function_table'] != 'undefined', 'missing Wasm export: __indirect_function_table');
  ___getTypeName = createExportWrapper('__getTypeName', 1);
  _malloc = createExportWrapper('malloc', 1);
  _main = Module['_main'] = createExportWrapper('main', 2);
  _fflush = createExportWrapper('fflush', 1);
  _emscripten_stack_get_end = wasmExports['emscripten_stack_get_end'];
  _emscripten_stack_get_base = wasmExports['emscripten_stack_get_base'];
  _strerror = createExportWrapper('strerror', 1);
  _free = createExportWrapper('free', 1);
  _emscripten_stack_init = wasmExports['emscripten_stack_init'];
  _emscripten_stack_get_free = wasmExports['emscripten_stack_get_free'];
  __emscripten_stack_restore = wasmExports['_emscripten_stack_restore'];
  __emscripten_stack_alloc = wasmExports['_emscripten_stack_alloc'];
  _emscripten_stack_get_current = wasmExports['emscripten_stack_get_current'];
  memory = wasmMemory = wasmExports['memory'];
  __indirect_function_table = wasmTable = wasmExports['__indirect_function_table'];
}

var wasmImports = {
  /** @export */
  __assert_fail: ___assert_fail,
  /** @export */
  __cxa_throw: ___cxa_throw,
  /** @export */
  _abort_js: __abort_js,
  /** @export */
  _embind_finalize_value_object: __embind_finalize_value_object,
  /** @export */
  _embind_register_bigint: __embind_register_bigint,
  /** @export */
  _embind_register_bool: __embind_register_bool,
  /** @export */
  _embind_register_class: __embind_register_class,
  /** @export */
  _embind_register_class_class_function: __embind_register_class_class_function,
  /** @export */
  _embind_register_class_constructor: __embind_register_class_constructor,
  /** @export */
  _embind_register_class_function: __embind_register_class_function,
  /** @export */
  _embind_register_class_property: __embind_register_class_property,
  /** @export */
  _embind_register_emval: __embind_register_emval,
  /** @export */
  _embind_register_float: __embind_register_float,
  /** @export */
  _embind_register_function: __embind_register_function,
  /** @export */
  _embind_register_integer: __embind_register_integer,
  /** @export */
  _embind_register_iterable: __embind_register_iterable,
  /** @export */
  _embind_register_memory_view: __embind_register_memory_view,
  /** @export */
  _embind_register_optional: __embind_register_optional,
  /** @export */
  _embind_register_std_string: __embind_register_std_string,
  /** @export */
  _embind_register_std_wstring: __embind_register_std_wstring,
  /** @export */
  _embind_register_value_object: __embind_register_value_object,
  /** @export */
  _embind_register_value_object_field: __embind_register_value_object_field,
  /** @export */
  _embind_register_void: __embind_register_void,
  /** @export */
  _emval_create_invoker: __emval_create_invoker,
  /** @export */
  _emval_decref: __emval_decref,
  /** @export */
  _emval_invoke: __emval_invoke,
  /** @export */
  _emval_run_destructors: __emval_run_destructors,
  /** @export */
  _tzset_js: __tzset_js,
  /** @export */
  emscripten_resize_heap: _emscripten_resize_heap,
  /** @export */
  environ_get: _environ_get,
  /** @export */
  environ_sizes_get: _environ_sizes_get,
  /** @export */
  fd_close: _fd_close,
  /** @export */
  fd_read: _fd_read,
  /** @export */
  fd_seek: _fd_seek,
  /** @export */
  fd_write: _fd_write
};


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

var calledRun;

function callMain() {
  assert(runDependencies == 0, 'cannot call main when async dependencies remain! (listen on Module["onRuntimeInitialized"])');
  assert(typeof onPreRuns === 'undefined' || onPreRuns.length == 0, 'cannot call main when preRun functions remain to be called');

  var entryFunction = _main;

  var argc = 0;
  var argv = 0;

  try {

    var ret = entryFunction(argc, argv);

    // if we're not running an evented main loop, it's time to exit
    exitJS(ret, /* implicit = */ true);
    return ret;
  } catch (e) {
    return handleException(e);
  }
}

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

function run() {

  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }

  stackCheckInit();

  preRun();

  // a preRun added a dependency, run will be called later
  if (runDependencies > 0) {
    dependenciesFulfilled = run;
    return;
  }

  function doRun() {
    // run may have just been called through dependencies being fulfilled just in this very frame,
    // or while the async setStatus time below was happening
    assert(!calledRun);
    calledRun = true;
    Module['calledRun'] = true;

    if (ABORT) return;

    initRuntime();

    preMain();

    readyPromiseResolve?.(Module);
    Module['onRuntimeInitialized']?.();
    consumedModuleProp('onRuntimeInitialized');

    var noInitialRun = Module['noInitialRun'] || false;
    if (!noInitialRun) callMain();

    postRun();
  }

  if (Module['setStatus']) {
    Module['setStatus']('Running...');
    setTimeout(() => {
      setTimeout(() => Module['setStatus'](''), 1);
      doRun();
    }, 1);
  } else
  {
    doRun();
  }
  checkStackCookie();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = (x) => {
    has = true;
  }
  try { // it doesn't matter if it fails
    _fflush(0);
    // also flush in the JS FS layer
    for (var name of ['stdout', 'stderr']) {
      var info = FS.analyzePath('/dev/' + name);
      if (!info) return;
      var stream = info.object;
      var rdev = stream.rdev;
      var tty = TTY.ttys[rdev];
      if (tty?.output?.length) {
        has = true;
      }
    }
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.');
  }
}

var wasmExports;

// In modularize mode the generated code is within a factory function so we
// can use await here (since it's not top-level-await).
wasmExports = await (createWasm());

run();

// end include: postamble.js

// include: postamble_modularize.js
// In MODULARIZE mode we wrap the generated code in a factory function
// and return either the Module itself, or a promise of the module.
//
// We assign to the `moduleRtn` global here and configure closure to see
// this as an extern so it won't get minified.

if (runtimeInitialized)  {
  moduleRtn = Module;
} else {
  // Set up the promise that indicates the Module is initialized
  moduleRtn = new Promise((resolve, reject) => {
    readyPromiseResolve = resolve;
    readyPromiseReject = reject;
  });
}

// Assertion for attempting to access module properties on the incoming
// moduleArg.  In the past we used this object as the prototype of the module
// and assigned properties to it, but now we return a distinct object.  This
// keeps the instance private until it is ready (i.e the promise has been
// resolved).
for (const prop of Object.keys(Module)) {
  if (!(prop in moduleArg)) {
    Object.defineProperty(moduleArg, prop, {
      configurable: true,
      get() {
        abort(`Access to module property ('${prop}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`)
      }
    });
  }
}
// end include: postamble_modularize.js



  return moduleRtn;
}

// Export using a UMD style export, or ES6 exports if selected
export default Scalatrix;

