module.exports =
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
/******/ 		var threw = true;
/******/ 		try {
/******/ 			modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete installedModules[moduleId];
/******/ 		}
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
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("react");

/***/ }),
/* 1 */,
/* 2 */,
/* 3 */,
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(5);


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });

// EXTERNAL MODULE: external "react"
var external__react_ = __webpack_require__(0);
var external__react__default = /*#__PURE__*/__webpack_require__.n(external__react_);

// EXTERNAL MODULE: external "next/head"
var head_ = __webpack_require__(6);
var head__default = /*#__PURE__*/__webpack_require__.n(head_);

// EXTERNAL MODULE: ./style.scss
var style = __webpack_require__(7);
var style_default = /*#__PURE__*/__webpack_require__.n(style);

// EXTERNAL MODULE: external "react-tabs"
var external__react_tabs_ = __webpack_require__(8);
var external__react_tabs__default = /*#__PURE__*/__webpack_require__.n(external__react_tabs_);

// CONCATENATED MODULE: ./components/BottomNavBar.jsx
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




var BottomNavBar_BottomNavBar =
/*#__PURE__*/
function (_Component) {
  _inherits(BottomNavBar, _Component);

  function BottomNavBar(props) {
    var _this;

    _classCallCheck(this, BottomNavBar);

    _this = _possibleConstructorReturn(this, (BottomNavBar.__proto__ || Object.getPrototypeOf(BottomNavBar)).call(this, props));
    _this.state = {
      dataObj: [],
      isLoading: true,
      error: null
    };
    return _this;
  }

  _createClass(BottomNavBar, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this2 = this;

      fetch("http://54.169.203.113/MovieList").then(function (response) {
        return response.json();
      }).then(function (data) {
        return _this2.setState({
          dataObj: data.data.comingsoon,
          isLoading: false
        });
      }).catch(function (error) {
        return _this2.setState({
          error: error,
          isLoading: false
        });
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _state = this.state,
          dataObj = _state.dataObj,
          isLoading = _state.isLoading,
          error = _state.error;

      if (error) {
        return external__react__default.a.createElement("p", null, error.message);
      }

      if (isLoading) {
        return external__react__default.a.createElement("p", null, "Loading...");
      }

      {
        console.log(dataObj);
      }
      return external__react__default.a.createElement(external__react_tabs_["Tabs"], null, external__react__default.a.createElement(external__react_tabs_["TabPanel"], null, external__react__default.a.createElement("div", {
        className: "showing__container"
      }, dataObj.map(function (item, i) {
        return external__react__default.a.createElement("div", {
          className: "showing__cell",
          key: i
        }, external__react__default.a.createElement("img", {
          className: "showing__poster",
          src: item.poster_ori
        }), external__react__default.a.createElement("span", {
          className: "showing__title"
        }, item.title_th));
      }))), external__react__default.a.createElement(external__react_tabs_["TabPanel"], null, external__react__default.a.createElement("h2", null, "Any content 2")), external__react__default.a.createElement(external__react_tabs_["TabPanel"], null, external__react__default.a.createElement("h2", null, "Any content 3")), external__react__default.a.createElement(external__react_tabs_["TabList"], null, external__react__default.a.createElement("div", {
        className: "react-tabs__tabs-container"
      }, external__react__default.a.createElement(external__react_tabs_["Tab"], null, "\u0E20\u0E32\u0E1E\u0E22\u0E19\u0E15\u0E4C"), external__react__default.a.createElement(external__react_tabs_["Tab"], null, "\u0E42\u0E23\u0E07\u0E20\u0E32\u0E1E\u0E22\u0E19\u0E15\u0E4C"), external__react__default.a.createElement(external__react_tabs_["Tab"], null, "\u0E15\u0E31\u0E4B\u0E27\u0E2B\u0E19\u0E31\u0E07"))));
    }
  }]);

  return BottomNavBar;
}(external__react_["Component"]);

/* harmony default export */ var components_BottomNavBar = (BottomNavBar_BottomNavBar);
// CONCATENATED MODULE: ./pages/index.jsx
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return pages__default; });
function pages__typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { pages__typeof = function _typeof(obj) { return typeof obj; }; } else { pages__typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return pages__typeof(obj); }

function pages__classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function pages__defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function pages__createClass(Constructor, protoProps, staticProps) { if (protoProps) pages__defineProperties(Constructor.prototype, protoProps); if (staticProps) pages__defineProperties(Constructor, staticProps); return Constructor; }

function pages__possibleConstructorReturn(self, call) { if (call && (pages__typeof(call) === "object" || typeof call === "function")) { return call; } return pages__assertThisInitialized(self); }

function pages__assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function pages__inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }






var pages__default =
/*#__PURE__*/
function (_Component) {
  pages__inherits(_default, _Component);

  function _default() {
    pages__classCallCheck(this, _default);

    return pages__possibleConstructorReturn(this, (_default.__proto__ || Object.getPrototypeOf(_default)).apply(this, arguments));
  }

  pages__createClass(_default, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if ('serviceWorker' in navigator) {
        window.addEventListener('load', function () {
          navigator.serviceWorker.register('/service-worker.js').then(function (registration) {
            console.log('SW registered: ', registration);
          }).catch(function (registrationError) {
            console.log('SW registration failed: ', registrationError);
          });
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      return external__react__default.a.createElement("div", null, external__react__default.a.createElement(head__default.a, null, external__react__default.a.createElement("title", null, "True Major Cineplex"), external__react__default.a.createElement("meta", {
        name: "viewport",
        content: "initial-scale=1.0, width=device-width"
      })), external__react__default.a.createElement("h1", {
        className: "home-title"
      }, "Now Showing"), external__react__default.a.createElement(components_BottomNavBar, null));
    }
  }]);

  return _default;
}(external__react_["Component"]);



/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("next/head");

/***/ }),
/* 7 */
/***/ (function(module, exports) {



/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("react-tabs");

/***/ })
/******/ ]);