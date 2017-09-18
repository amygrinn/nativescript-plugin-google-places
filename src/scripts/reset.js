/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!*****************************!*\
  !*** ./scripts/resetter.js ***!
  \*****************************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! fs */ 1);
var path = __webpack_require__(/*! path */ 2);

var pluginConfigFile = "google-places.config.json"
var pluginConfigPath = path.join("../../", pluginConfigFile);

var config = {};

if(fs.existsSync(pluginConfigPath)) {
    try {
        config = JSON.parse(fs.readFileSync(pluginConfigPath));
        resetiOS();
        resetBrowser();
        try {
            fs.unlinkSync(pluginConfigPath);
        } catch(error) {
            console.log("Failed to delete " + pluginConfigFile);
        }
    } catch(e) {
        console.log("Failed reading " + pluginConfigFile);
        console.log(e);
    }
}

function resetiOS() {
    if(config.ios) {
        let iosSource = './plugin-google-places.ios.js';

        var regEx = new RegExp(config.ios.key, "g");
        var newIosFile = fs.readFileSync(iosSource).toString().replace(regEx, "__API_KEY__");
        try {
            fs.writeFileSync(iosSource, newIosFile);
        } catch(err) {
            console.log("Failed to write " + iosSource);
            console.log(err);
        }
    }
}

function resetBrowser() {
    if(config.browser) {
        let commonSource = './plugin-google-places.common.js';

        var regEx = new RegExp(config.browser.key, "g");
        var newCommonFile = fs.readFileSync(commonSource).toString().replace(regEx, "__API_KEY__");
        try {
            fs.writeFileSync(commonSource, newCommonFile);
        } catch(err) {
            console.log("Failed to write " + commonSource);
            console.log(err);
        }
    }
}

/***/ }),
/* 1 */
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 2 */
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ })
/******/ ]);