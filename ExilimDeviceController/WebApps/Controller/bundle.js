/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	// CSSの呼び出し
	__webpack_require__(1);

	// クラスとして呼べるようにする
	var project = __webpack_require__(5);

	/*
	(function(){
	    'use strict';
	    // メインクラスを呼び出せるようにする
	    window.main = new project.Main();
	})();

	// d

	*/

	window.main = new project.Main();





/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(4)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!../../node_modules/css-loader/index.js!./style.css", function() {
				var newContent = require("!!../../node_modules/css-loader/index.js!./style.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "/**/\n.debug-btns {\n    margin-top: 5%;\n}\n\n.debug-btn {\n    margin: 5px 10px;\n}\n\n.video-box {\n    height: 240px;\n    width: 320px;\n    /*text-align: center;*/\n    background-color: black;\n    position: relative;\n    /*left: 0;*/\n    /*right: 0;*/\n    margin: 5% auto;\n}\n\n.video-view {\n    height: 240px;\n    width: 320px;\n    object-fit: contain;\n    margin: 0;\n    position: absolute;\n    left: 0;\n    right: 0;\n    top: 0;\n    bottom: 0;\n}\n\n.preview-btn {\n\n}\n\n.log-view {\n    width: 90%;\n    /*height: 100%;*/\n    margin: auto;\n    overflow-y: scroll;\n}\n\n.flexbox-container {\n    display: -webkit-box; /* Android4.3以前ブラウザ用 */\n    display: -webkit-flex; /* iOS8以前Safari用 */\n    display: flex;\n    -webkit-box-align: center; /* Android4.3以前ブラウザ用 縦方向中央揃え */\n    -webkit-align-items: center; /* iOS8以前Safari用 縦方向中央揃え */\n    align-items: center; /* 縦方向中央揃え */\n    -webkit-box-pack: center; /* Android4.3以前ブラウザ用 横方向中央揃え */\n    -webkit-justify-content: center; /* iOS8以前Safari用 横方向中央揃え */\n    justify-content: center; /* 横方向中央揃え */\n}\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(self.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	/**
	 * プロジェクトの起点となるプログラム
	 */
	var HomePage_1 = __webpack_require__(6);
	var ExilimPlugin_1 = __webpack_require__(7);
	var DemoPage_1 = __webpack_require__(8);
	var Main = (function () {
	    function Main() {
	        this.currentItem = {};
	        console.log('Main ------------');
	        this.homePage = new HomePage_1.HomePage();
	        this.demoPage = new DemoPage_1.DemoPage();
	        this.exilimPlugin = new ExilimPlugin_1.ExilimPlugin();
	        // ページ初期化イベントをページ記述依存にしない記述
	        // コレを避ける→$(document).on('pageinit', '#detail-page', function() {
	        document.addEventListener('pageinit', this.handlerPageInit);
	    }
	    Main.prototype.handlerNavigatePrePush = function (event) {
	        // 遷移イベントを把握する
	        console.log('handlerNavigatePrePush');
	        // console.log(event);
	    };
	    Main.prototype.handlerPageInit = function (event) {
	        // ページの初期化自体はページ初期化イベントpageinitで行う
	        console.log('handlerPageInit');
	        console.log('event.target.id : ' + event.target.id);
	        if (event.target.id == 'home-page') {
	            main.homePage.pageinit(this);
	        }
	        else if (event.target.id == 'demo-page') {
	            main.demoPage.pageinit(this);
	        }
	    };
	    Main.prototype.ready = function () {
	        // ナビゲーションの関連付け
	        // findComponentでOnsenUIつきDOMの捜索
	        // https://ja.onsen.io/v1/guide.html#CallingComponentAPIsfromJavaScript
	        this.navi = ons.findComponent('ons-navigator#main-navi', document.body);
	        // ナビゲーションイベントの設置
	        this.navi.on('prepush', this.handlerNavigatePrePush);
	    };
	    return Main;
	}());
	exports.Main = Main;


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	var HomePage = (function () {
	    function HomePage() {
	    }
	    HomePage.prototype.pageinit = function (instance) {
	        var _this = this;
	        this._instance = instance;
	        this.imageElm = $('#preview');
	        this.logTextElm = $('#log-text');
	        this.logMessage = '';
	        this.isPlay = false;
	        var address = 'localhost';
	        $('#setup-btn').on('click', function () {
	            main.exilimPlugin.setUpCamera(address, function (errorMessage, json) {
                     if( errorMessage ) {
                         alert('setUpCamera error: ' + errorMessage);
                         return;
                     }
	                _this.writeLogMessage('setUpCamera: message = ' + JSON.stringify(json));
	            });
	        });
	        $('#start-liveview-btn').on('click', function () {
	            if (main.exilimPlugin.getApiKey == null) {
                    alert('apiKey is null');
	                return;
	            }
	            _this.startPreViewOnMediaStream(function (errorMessage, json) {
                     if( errorMessage ) {
                         alert('startPreViewOnMediaStream error: ' + errorMessage);
                         return;
                     }
	                _this.writeLogMessage('startPreViewOnMediaStream: message = ' + JSON.stringify(json));
	            });
	        });
	        $('#stop-liveview-btn').on('click', function () {
	            _this.isPlay = false;
	            main.exilimPlugin.stopLiveViewOnMediaStream(function (errorMessage, json) {
                     if( errorMessage ) {
                         alert('stopLiveViewOnMediaStream error: ' + errorMessage);
                         return;
                     }
	                _this.writeLogMessage('stopLiveViewOnMediaStream: message = ' + JSON.stringify(json));
	            });
	        });
	        $('#get-liveview-btn').on('click', function () {
	            if (main.exilimPlugin.getApiKey == null) {
                    alert('apiKey is null');
	                return;
	            }
	            _this.getLiveView(function (errorMessage, uri) {
                     if( errorMessage ) {
                         alert('getLiveView error: ' + errorMessage);
                         return;
                     }
	                _this.writeLogMessage('getLiveView: URI = ' + uri);
	            });
	        });
	        $('#take-photo-btn').on('click', function () {
	            if (main.exilimPlugin.getApiKey == null) {
                    alert('apiKey is null');
	                return;
	            }
	            main.exilimPlugin.takePhoto(function (errorMessage, json) {
                     if( errorMessage ) {
                         alert('takePhoto error: ' + errorMessage);
                         return;
                     }
	                _this.writeLogMessage('takePhoto: message = ' + JSON.stringify(json));
	            });
	        });
            $('#start-record-btn').on('click', function () {
                if (main.exilimPlugin.getApiKey == null) {
                    alert('apiKey is null');
                    return;
                }
                main.exilimPlugin.startRecord(function (errorMessage, json) {
                     if( errorMessage ) {
                         alert('startRecord error: ' + errorMessage);
                         return;
                     }
                    _this.writeLogMessage('startRecord: message = ' + JSON.stringify(json));
                });
            });
            $('#stop-record-btn').on('click', function () {
                if (main.exilimPlugin.getApiKey == null) {
                    alert('apiKey is null');
                    return;
                }
                main.exilimPlugin.stopRecord(function (errorMessage, json) {
                     if( errorMessage ) {
                         alert('stopRecord error: ' + errorMessage);
                         return;
                     }
                    _this.writeLogMessage('stopRecord: message = ' + JSON.stringify(json));
                });
            });
            $('#zoom-in-max-btn').on('click', function () {
                if (main.exilimPlugin.getApiKey == null) {
                    alert('apiKey is null');
                    return;
                }
                main.exilimPlugin.zoom('in', 'max', function (errorMessage, json) {
                     if( errorMessage ) {
                         alert('zoom error: ' + errorMessage);
                         return;
                     }
                    _this.writeLogMessage('zoomInMax: message = ' + JSON.stringify(json));
                });
            });
            $('#zoom-in-oneshot-btn').on('click', function () {
                if (main.exilimPlugin.getApiKey == null) {
                    alert('apiKey is null');
                    return;
                }
                main.exilimPlugin.zoom('in', '1shot', function (errorMessage, json) {
                     if( errorMessage ) {
                         alert('zoom error: ' + errorMessage);
                         return;
                     }
                    _this.writeLogMessage('zoomIn1shot: message = ' + JSON.stringify(json));
                });
            });
            $('#zoom-in-start-btn').on('click', function () {
                if (main.exilimPlugin.getApiKey == null) {
                    alert('apiKey is null');
                    return;
                }
                main.exilimPlugin.zoom('in', 'in-start', function (errorMessage, json) {
                     if( errorMessage ) {
                         alert('zoom error: ' + errorMessage);
                         return;
                     }
                    _this.writeLogMessage('zoomInStart: message = ' + JSON.stringify(json));
                });
            });
            $('#zoom-stop-btn').on('click', function () {
                if (main.exilimPlugin.getApiKey == null) {
                    alert('apiKey is null');
                    return;
                }
                main.exilimPlugin.zoom('in', 'in-stop', function (errorMessage, json) {
                     if( errorMessage ) {
                         alert('zoom error: ' + errorMessage);
                         return;
                     }
                    _this.writeLogMessage('zoomStop: message = ' + JSON.stringify(json));
                });
            });
            $('#zoom-out-start-btn').on('click', function () {
                if (main.exilimPlugin.getApiKey == null) {
                    alert('apiKey is null');
                    return;
                }
                main.exilimPlugin.zoom('out', 'in-start', function (errorMessage, json) {
                     if( errorMessage ) {
                         alert('zoom error: ' + errorMessage);
                         return;
                     }
                    _this.writeLogMessage('zoomOutStart: message = ' + JSON.stringify(json));
                });
            });
            $('#zoom-out-oneshot-btn').on('click', function () {
                if (main.exilimPlugin.getApiKey == null) {
                    alert('apiKey is null');
                    return;
                }
                main.exilimPlugin.zoom('out', '1shot', function (errorMessage, json) {
                     if( errorMessage ) {
                         alert('zoom error: ' + errorMessage);
                         return;
                     }
                    _this.writeLogMessage('zoomOut1shot: message = ' + JSON.stringify(json));
                });
            });
            $('#zoom-out-max-btn').on('click', function () {
                if (main.exilimPlugin.getApiKey == null) {
                    alert('apiKey is null');
                    return;
                }
                main.exilimPlugin.zoom('out', 'max', function (errorMessage, json) {
                     if( errorMessage ) {
                         alert('zoom error: ' + errorMessage);
                         return;
                     }
                    _this.writeLogMessage('zoomOutMax: message = ' + JSON.stringify(json));
                });
            });
	        $(this.imageElm).on('click', function () {
	            _this.isPlay = !_this.isPlay;
	            if (!_this.isPlay) {
	                main.exilimPlugin.stopLiveViewOnMediaStream(function (errorMessage, json) {
                     if( errorMessage ) {
                         alert('stopLiveViewOnMediaStream error: ' + errorMessage);
                         return;
                     }
                    _this.writeLogMessage('stopLiveViewOnMediaStream: message = ' + JSON.stringify(json));
	                });
	                return;
	            }
	            if (main.exilimPlugin.getApiKey == null) {
	                main.exilimPlugin.setUpCamera('localhost', function (errorMessage, json) {
                         if( errorMessage ) {
                             alert('setUpCamera error: ' + errorMessage);
                             return;
                         }
	                    console.log("message = " + JSON.stringify(json));
	                    _this.writeLogMessage('setUpCamera: message = ' + JSON.stringify(json));
	                    var count = 0;
	                    var timer = setInterval(function () {
	                        _this.startPreViewOnMediaStream(function (errorMessage, json) {
                                if( errorMessage ) {
                                    alert('startPreViewOnMediaStream error: ' + errorMessage);
                                    return;
                                }
	                            _this.writeLogMessage('startPreViewOnMediaStream: message = ' + JSON.stringify(json));
	                            ++count;
	                            if (count > 1) {
	                                clearInterval(timer);
	                            }
	                        });
	                    }, 500);
	                });
	            }
	            else {
	                var count_1 = 0;
	                var timer_1 = setInterval(function () {
	                    _this.startPreViewOnMediaStream(function (errorMessage, json) {
                            if( errorMessage ) {
                                alert('startPreViewOnMediaStream error: ' + errorMessage);
                                return;
                            }
	                        _this.writeLogMessage('startPreViewOnMediaStream: message = ' + JSON.stringify(json));
	                        ++count_1;
	                        if (count_1 > 1) {
	                            clearInterval(timer_1);
	                        }
	                    });
	                }, 500);
	            }
	        });
	    };
	    HomePage.prototype.writeLogMessage = function (message) {
	        this.logMessage = message;
	        this.logTextElm.html(this.logMessage);
	    };
	    /**
	     * ライブビュー取得を連続して行う
	     * @param element
	     */
	    HomePage.prototype.playLiveView = function (element) {
	        var _this = this;
	        if (!this.isPlay) {
	            return;
	        }
	        this.getLiveView(function (message) {
	            if (message == null) {
	                _this.isPlay = false;
	                return;
	            }
	            _this.playLiveView(element);
	        });
	    };
	    /**
	     * ライブビューを起動させる
         * @param callback 失敗時はエラーメッセージ（第一引数）、成功時は受信したJSONレスポンス（第二引数）
	     */
	    HomePage.prototype.startLiveView = function (callback) {
	        var _this = this;
	        main.exilimPlugin.startLiveView(function (errorMessage, json) {
                if (errorMessage) {
                    callback(errorMessage);
                    return;
                }
                _this.writeLogMessage('startLiveView: message = ' + JSON.stringify(json));
	            if (!json.hasOwnProperty('result')) {
	                console.log('Error: invalid response = ' + JSON.stringify(json));
                    callback('Error: invalid response = ' + JSON.stringify(json),null);
                    return;
	            }
	            else if (json.result != 0) {
	                console.log('Error: result = ' + json.result + ', ' + JSON.stringify(json));
                    callback('Error: invalid response = ' + JSON.stringify(json),null);
                    return;
	            }
	            callback(null, message);
	        });
	    };
	    /**
	     * ライブビュー画像を取得する
         * @param callback 失敗時はエラーメッセージ（第一引数）、成功時は受信したJSONレスポンス（第二引数）
	     */
	    HomePage.prototype.getLiveView = function (callback) {
	        var _this = this;
	        main.exilimPlugin.getLiveView(function (errorMessage, json) {
                if (errorMessage) {
                    callback(errorMessage,null);
                    return;
                }
	            if (!json.hasOwnProperty('result') || !json.hasOwnProperty('media') || !json.media.hasOwnProperty('uri')) {
	                console.log('Error: invalid message = ' + JSON.stringify(json));
	                callback('Error: invalid message = ' + JSON.stringify(json));
	                return;
	            }
	            if (json.result != 0) {
	                console.log('Error: result = ' + json.result + ', ' + JSON.stringify(json));
	                callback('Error: result = ' + json.result + ', ' + JSON.stringify(json));
	                return;
	            }
	            var uri = json.media.uri + '?r=' + Math.random();
	            _this.imageElm.attr('src', uri);
	            callback(null, json);
	        });
	    };
	    /**
	     * ライブビューを開始する
         * @param callback 失敗時はエラーメッセージ（第一引数）、成功時は受信したJSONレスポンス（第二引数）
	     */
	    HomePage.prototype.startPreViewOnMediaStream = function (callback) {
	        var _this = this;
	        main.exilimPlugin.startLiveViewOnMediaStream(function (errorMessage, json) {
                if (errorMessage) {
                    callback(errorMessage,null);
                    return;
                }
	            if (!json.hasOwnProperty('result') || !json.hasOwnProperty('uri')) {
	                console.log('Error: invalid message = ' + JSON.stringify(json));
	                callback('Error: invalid message = ' + JSON.stringify(json));
	                return;
	            }
	            _this.imageElm.attr('src', json.uri);
	            callback(null, json);
	        });
	    };
	    return HomePage;
	}());
	exports.HomePage = HomePage;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	/**
	 * Exilimプラグインを扱うクラス
	 *
	 * Created by dobashik on 2017/03/16
	 */
	var ExilimPlugin = (function () {
	    /**
	     * コンストラクタ
	     */
	    function ExilimPlugin() {
	        this.EXILIM_PLUGIN_NAME = 'Exilim';
	        this.serverAddress = null;
	        this.apiKey = null;
	        // $.ajaxのデフォルト値を設定
	        $.ajaxSetup({
	            dataType: 'json',
	            timeout: 10000,
	            headers: {
	                'pragma': 'no-cache',
	                'Cache-Control': 'no-cache',
	                'If-Modified-Since': 'Thu, 01 Jun 1970 00:00:00 GMT'
	            }
	        });
	        $(document).ajaxSend(function (event, jqXHR, ajaxOptions) {
	            // ローディングの表示
	        }).ajaxComplete(function (event, jqXHR, ajaxOptions) {
	            // ローディングの非表示
	        }).ajaxError(function (event, jqXHR, settings, exception) {
	            if (jqXHR.status) {
	                switch (jqXHR.status) {
	                    case 404:
	                        // ステータスコードが404の時
	                        console.log('status:' + jqXHR.status + ', statusText: ' + jqXHR.statusText);
	                        break;
	                    case 500:
	                        // ステータスコードが500の時
	                        console.log('status:' + jqXHR.status + ', statusText: ' + jqXHR.statusText);
	                        break;
	                    default:
	                        // その他のステータスコードの時
	                        console.log('status:' + jqXHR.status + ', statusText: ' + jqXHR.statusText);
	                        break;
	                }
	            }
	            else if (exception === 'parsererror') {
	            }
	            else if (exception === 'timeout') {
	                // タイムアウトした時の処理
	                console.log('exception: ' + exception);
	            }
	            else if (exception === 'abort') {
	            }
	            else {
	                // その他のエラー
	                console.log('status: ' + jqXHR.status + ', exception: ' + exception);
	            }
	        });
	    }
	    Object.defineProperty(ExilimPlugin.prototype, "getApiKey", {
	        get: function () {
	            return this.apiKey;
	        },
	        enumerable: true,
	        configurable: true
	    });
	    /**
	     * カメラと通信のための初期化を行う
	     * @param address サーバのアドレス
	     * @param callback 失敗時はエラーメッセージ（第一引数）、成功時は受信したJSONレスポンス（第二引数）
	     */
	    ExilimPlugin.prototype.setUpCamera = function (address, callback) {
	        var _this = this;
	        console.log("setUpCamera");
	        if (!address) {
	            callback('Error: invalid address = ' + address);
	            return;
	        }
	        this.serverAddress = address;
	        var url = "http://" + address + ":4035/gotapi/servicediscovery";
	        console.log('GET: url= ' + url);
	        this.get(url, {}, function (message) {
	            console.log('message= ' + JSON.stringify(message));
	            for (var _i = 0, _a = message.services; _i < _a.length; _i++) {
	                var service = _a[_i];
	                if (service.hasOwnProperty('name') && service.name == _this.EXILIM_PLUGIN_NAME) {
	                    _this.apiKey = service.id;
	                    break;
	                }
	            }
	            callback(null, message);
	        }, 'json');
	    };
	    /**
	     * mediaStreamRecordingプロファイルを使ったライブビューを開始する
         * @param callback 失敗時はエラーメッセージ（第一引数）、成功時は受信したJSONレスポンス（第二引数）
	     */
	    ExilimPlugin.prototype.startLiveViewOnMediaStream = function (callback) {
	        console.log("startLiveViewOnMediaStream");
	        if (this.apiKey == null) {
	            callback('Error: apiKey is null');
	            return;
	        }
	        else if (this.serverAddress == null) {
	            callback('Error: server address is null');
	            return;
	        }
	        var url = "http://" + this.serverAddress + ":4035/gotapi/mediaStreamRecording/preview?serviceId=" + this.apiKey;
	        console.log('PUT: url= ' + url);
	        this.put(url, {}, function (message) {
                console.log('message= ' + JSON.stringify(message));
                if (message.result != 0) {
                     callback('Error: ' + JSON.stringify(message));
                     return;
                }
	            callback(null, message);
	        }, 'json');
	    };
	    /**
	     * mediaStreamRecordingプロファイルを使ったライブビューを停止する
         * @param callback 失敗時はエラーメッセージ（第一引数）、成功時は受信したJSONレスポンス（第二引数）
	     */
	    ExilimPlugin.prototype.stopLiveViewOnMediaStream = function (callback) {
	        console.log("stopLiveViewOnMediaStream");
	        if (this.apiKey == null) {
	            callback('Error: apiKey is null');
	            return;
	        }
	        else if (this.serverAddress == null) {
	            callback('Error: server address is null');
	            return;
	        }
	        var url = "http://" + this.serverAddress + ":4035/gotapi/mediaStreamRecording/preview?serviceId=" + this.apiKey;
	        console.log('DELETE: url= ' + url);
	        this.delete(url, {}, function (message) {
	            console.log('message= ' + JSON.stringify(message));
                if (message.result != 0) {
                     callback('Error: ' + JSON.stringify(message));
                     return;
                }
	            callback(null, message);
	        }, 'json');
	    };
	    /**
	     * 静止画を撮影する
         * @param callback 失敗時はエラーメッセージ（第一引数）、成功時は受信したJSONレスポンス（第二引数）
	     */
	    ExilimPlugin.prototype.takePhoto = function (callback) {
	        console.log("takePhoto");
	        if (this.apiKey == null) {
	            callback('Error: apiKey is null');
	            return;
	        }
	        else if (this.serverAddress == null) {
	            callback('Error: server address is null');
	            return;
	        }
	        var url = "http://" + this.serverAddress + ":4035/gotapi/mediastreamRecording/takephoto?serviceId=" + this.apiKey;
	        console.log('POST: url= ' + url);
	        $.post(url, {
	            target: 'camera'
	        }, function (message) {
	            console.log('message= ' + JSON.stringify(message));
                if (message.result != 0) {
                     callback('Error: ' + JSON.stringify(message));
                     return;
                }
	            callback(null, message);
	        });
	        // c.setRequestMethod(method);
	        // c.setRequestProperty("Connection", "Keep-Alive");
	        // c.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
	        // c.setInstanceFollowRedirects(false);
	        // c.setRequestProperty("Accept-Language", "jp");
	        //         public void sendTakePhoto() {
	        //             if (mApiId != null && sStr_UrlText != null) {
	        //                 String url, str;
	        //
	        // //            url = "http://"+textUrl.getText()+":4035/gotapi/record?serviceId="+mApiId+"&action=disconnect";
	        //                 url = "http://" + sStr_UrlText + ":4035/gotapi/mediastreamRecording/takephoto";
	        //
	        //                 Map<String, String> map = new HashMap<String, String>();
	        //                 map.put("serviceId", mApiId);
	        //                 map.put("target", String.valueOf("camera"));
	        //
	        //                 str = new String(sendHttp(url, "POST", map));
	        //
	        //                 if (str != null) {
	        //                     Log.e(TAG, "sendLiveViewEnd Http_ERR");
	        //                 }
	        //             }
	        //         }
	    };
        /**
         * 動画の撮影を開始する
         * @param callback 失敗時はエラーメッセージ（第一引数）、成功時は受信したJSONレスポンス（第二引数）
         */
        ExilimPlugin.prototype.startRecord = function (callback) {
            console.log("startRecord");
            if (this.apiKey == null) {
                callback('Error: apiKey is null');
                return;
            }
            else if (this.serverAddress == null) {
                callback('Error: server address is null');
                return;
            }
            var url = "http://" + this.serverAddress + ":4035/gotapi/mediastreamRecording/record?serviceId=" + this.apiKey;
            console.log('POST: url= ' + url);
            $.post(url, {
                target: 'camera'
            }, function (message) {
                if (message.result != 0) {
                     callback('Error: ' + JSON.stringify(message));
                     return;
                }
                callback(null, message);
            });
        };
        /**
         * 動画の撮影を停止する
         * @param callback 失敗時はエラーメッセージ（第一引数）、成功時は受信したJSONレスポンス（第二引数）
         */
        ExilimPlugin.prototype.stopRecord = function (callback) {
            console.log("stopRecord");
            if (this.apiKey == null) {
                callback('Error: apiKey is null');
                return;
            }
            else if (this.serverAddress == null) {
                callback('Error: server address is null');
                return;
            }
            var url = "http://" + this.serverAddress + ":4035/gotapi/mediastreamRecording/stop?serviceId=" + this.apiKey;
            console.log('PUT: url= ' + url);
            this.put(url, {}, function (message) {
                if (message.result != 0) {
                     callback('Error: ' + JSON.stringify(message));
                     return;
                }
                callback(null, message);
            }, 'json');
        };
        /**
         * ズームする
         * @param callback 失敗時はエラーメッセージ（第一引数）、成功時は受信したJSONレスポンス（第二引数）
         */
        ExilimPlugin.prototype.zoom = function (direction,movement,callback) {
            console.log("zoomIn");
            if (this.apiKey == null) {
                callback('Error: apiKey is null');
                return;
            }
            else if (this.serverAddress == null) {
                callback('Error: server address is null');
                return;
            }
            var url = "http://" + this.serverAddress + ":4035/gotapi/camera/zoom?serviceId=" + this.apiKey + "&direction=" + direction + "&movement=" + movement;
            console.log('PUT: url= ' + url);
            this.put(url, {}, function (message) {
                console.log('message= ' + JSON.stringify(message));
                if (message.result != 0) {
                     callback('Error: ' + JSON.stringify(message));
                     return;
                }
                callback(null, message);
            }, 'json');
        };
	    ExilimPlugin.prototype.get = function (url, data, callback, type) {
	        if ($.isFunction(data)) {
	            type = type || callback;
	            callback = data;
	            data = {};
	        }
	        return $.ajax({
	            url: url,
	            success: callback,
	            data: data,
	            dataType: type,
	            statusCode: {
	                404: function () {
	                    alert("page not found");
	                }
	            }
	        }).done(function (data, textStatus, jqXHR) {
	            console.log('status:' + jqXHR.status + ', textStatus: ' + textStatus);
	            // console.log('data: ' + JSON.stringify(data));
	        }).fail(function (jqXHR, textStatus, errorThrown) {
	            console.log('status:' + jqXHR.status + ', textStatus: ' + textStatus + ', errorThrown: ' + errorThrown);
	            alert('status:' + jqXHR.status + ', textStatus: ' + textStatus + ', errorThrown: ' + errorThrown);
	        }).always(function () {
	            // alert("finish");
	        });
	    };
	    ExilimPlugin.prototype.put = function (url, data, callback, type) {
	        if ($.isFunction(data)) {
	            type = type || callback;
	            callback = data;
	            data = {};
	        }
	        return $.ajax({
	            url: url,
	            type: 'PUT',
	            success: callback,
	            data: data,
	            dataType: type,
	            statusCode: {
	                404: function () {
	                    alert("page not found");
	                }
	            }
	        }).done(function (data, textStatus, jqXHR) {
	            console.log('status:' + jqXHR.status + ', textStatus: ' + textStatus);
	            // console.log('data: ' + JSON.stringify(data));
	        }).fail(function (jqXHR, textStatus, errorThrown) {
	            console.log('status:' + jqXHR.status + ', textStatus: ' + textStatus + ', errorThrown: ' + errorThrown);
	            alert('status:' + jqXHR.status + ', textStatus: ' + textStatus + ', errorThrown: ' + errorThrown);
	        }).always(function () {
	            // alert("finish");
	        });
	    };
	    ExilimPlugin.prototype.delete = function (url, data, callback, type) {
	        if ($.isFunction(data)) {
	            type = type || callback;
	            callback = data;
	            data = {};
	        }
	        return $.ajax({
	            url: url,
	            type: 'DELETE',
	            success: callback,
	            data: data,
	            dataType: type,
	            statusCode: {
	                404: function () {
	                    alert("page not found");
	                }
	            }
	        }).done(function (data, textStatus, jqXHR) {
	            console.log('status:' + jqXHR.status + ', textStatus: ' + textStatus);
	            // console.log('data: ' + JSON.stringify(data));
	        }).fail(function (jqXHR, textStatus, errorThrown) {
	            console.log('status:' + jqXHR.status + ', textStatus: ' + textStatus + ', errorThrown: ' + errorThrown);
	            alert('status:' + jqXHR.status + ', textStatus: ' + textStatus + ', errorThrown: ' + errorThrown);
	        }).always(function () {
	            // alert("finish");
	        });
	    };
	    return ExilimPlugin;
	}());
	exports.ExilimPlugin = ExilimPlugin;


/***/ },
/* 8 */
/***/ function(module, exports) {

	"use strict";
	var DemoPage = (function () {
	    function DemoPage() {
	    }
	    DemoPage.prototype.pageinit = function (instance) {
	        var _this = this;
	        this._instance = instance;
	        this.imageElm = $('#demo-preview');
	        this.logTextElm = $('#demo-log-text');
	        this.logMessage = '';
	        this.isPlay = false;
	        this.address = 'okaka0301.ddo.jp';
	        $('#demo-setup-btn').on('click', function () {
	            if ($('#demo-domain-input').val() != '') {
	                _this.address = $('#demo-domain-input').val();
	            }
	            main.exilimPlugin.setUpCamera(_this.address, function (errorMessage,json) {
	                _this.writeLogMessage('setUpCamera: message = ' + JSON.stringify(json));
	            });
	        });
	        $('#demo-start-liveview-btn').on('click', function () {
	            _this.isPlay = true;
	            _this.startPreViewOnMediaStream(function (errorMessage,json) {
	                _this.writeLogMessage('startPreViewOnMediaStream: message = ' + JSON.stringify(json));
	            });
	        });
	        $('#demo-stop-liveview-btn').on('click', function () {
	            _this.isPlay = false;
	            main.exilimPlugin.stopLiveViewOnMediaStream(function (errorMessage,json) {
	                _this.writeLogMessage('stopLiveViewOnMediaStream: message = ' + JSON.stringify(json));
	            });
	        });
	        $('#demo-take-photo-btn').on('click', function () {
	            main.exilimPlugin.takePhoto(function (errorMessage,json) {
	                _this.writeLogMessage('takePhoto: message = ' + JSON.stringify(json));
	            });
	        });
	        $(this.imageElm).on('click', function () {
	            _this.isPlay = !_this.isPlay;
	            if (!_this.isPlay) {
	                main.exilimPlugin.stopLiveViewOnMediaStream(function (errorMessage,json) {
	                    _this.writeLogMessage('stopLiveViewOnMediaStream: message = ' + JSON.stringify(json));
	                });
	                return;
	            }
	            if (main.exilimPlugin.getApiKey == null) {
	                main.exilimPlugin.setUpCamera('localhost', function (errorMessage,json) {
	                    console.log("message = " + JSON.stringify(json));
	                    _this.writeLogMessage('setUpCamera: message = ' + JSON.stringify(json));
	                    var count = 0;
	                    var timer = setInterval(function () {
	                        _this.startPreViewOnMediaStream(function (errorMessage,json) {
	                            _this.writeLogMessage('startPreViewOnMediaStream: message = ' + JSON.stringify(json));
	                            ++count;
	                            if (count > 1) {
	                                clearInterval(timer);
	                            }
	                        });
	                    }, 500);
	                });
	            }
	            else {
	                var count_1 = 0;
	                var timer_1 = setInterval(function () {
	                    _this.startPreViewOnMediaStream(function (errorMessage,json) {
	                        _this.writeLogMessage('startPreViewOnMediaStream: message = ' + JSON.stringify(json));
	                        ++count_1;
	                        if (count_1 > 1) {
	                            clearInterval(timer_1);
	                        }
	                    });
	                }, 500);
	            }
	        });
	    };
	    /**
	     * MotionJPEG形式でのライブビューを開始する
	     * @param callback
	     */
	    DemoPage.prototype.startPreViewOnMediaStream = function (callback) {
	        var _this = this;
	        main.exilimPlugin.startLiveViewOnMediaStream(function (errorMessage,json) {
	            if (!json.hasOwnProperty('result') || !json.hasOwnProperty('uri')) {
	                console.log('Error: invalid message = ' + JSON.stringify(json));
	                callback('Error: invalid message = ' + JSON.stringify(json));
	                return;
	            }
	            _this.imageElm.attr('src', json.uri);
	            callback(null,message);
	        });
	    };
	    DemoPage.prototype.writeLogMessage = function (message) {
	        this.logMessage += message;
	        this.logMessage += '<br><br>';
	        this.logTextElm.html(this.logMessage);
	    };
	    return DemoPage;
	}());
	exports.DemoPage = DemoPage;

/***/ }
/******/ ]);
