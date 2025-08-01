﻿/******/ (function (modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if (installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
            /******/
        };

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
        /******/
    }


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
    /******/
})
/************************************************************************/
/******/([
/* 0 */
/***/ function (module, exports, __webpack_require__) {

        module.exports = __webpack_require__(1);


        /***/
    },
/* 1 */
/***/ function (module, exports, __webpack_require__) {

        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _from = __webpack_require__(70);

        var _from2 = _interopRequireDefault(_from);

        var _extends2 = __webpack_require__(79);

        var _extends3 = _interopRequireDefault(_extends2);

        var _classCallCheck2 = __webpack_require__(84);

        var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

        var _createClass2 = __webpack_require__(85);

        var _createClass3 = _interopRequireDefault(_createClass2);

        __webpack_require__(89);

        var _filesaver = __webpack_require__(92);

        var _tableToData = __webpack_require__(95);

        var _tableToData2 = _interopRequireDefault(_tableToData);

        var _dataToWorksheet = __webpack_require__(96);

        var _dataToWorksheet2 = _interopRequireDefault(_dataToWorksheet);

        var _decodeCell = __webpack_require__(99);

        var _encodeCell = __webpack_require__(97);

        var _list = __webpack_require__(100);

        var _list2 = _interopRequireDefault(_list);

        var _number = __webpack_require__(101);

        var _number2 = _interopRequireDefault(_number);

        var _date = __webpack_require__(102);

        var _date2 = _interopRequireDefault(_date);

        var _input = __webpack_require__(103);

        var _input2 = _interopRequireDefault(_input);

        var _boolean = __webpack_require__(104);

        var _boolean2 = _interopRequireDefault(_boolean);

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        /**
         * @param {string} defaultFileName - The file name if download
         * doesn't provide a name. Default: 'file'.
         * @ param {string} tableNameDataAttribute - The identifier of
         * the name of the table as a data-attribute. Default: 'excel-name'
         * results to `<table data-excel-name="Another table">...</table>`.
         */
        var defaultOptions = {
            defaultFileName: 'file',
            tableNameDataAttribute: 'excel-name',

            /**
             * The event will be fired before add worksheet
             * into workbook
             *
             * @param {object} worksheet
             * @param {string} name - worksheet name
             * @returns {object} worksheet
             */
            beforeWorksheetAdded: function beforeWorksheetAdded(worksheet, name) {
                return worksheet;
            }
        };

        /**
         * The default type handlers: lists, numbers, dates, input fields and booleans.
         */
        var typeHandlers = [_list2.default, _input2.default, _number2.default, _date2.default, _boolean2.default];

        /**
         * Creates a `Table2Excel` object to export HTMLTableElements
         * to a xlsx-file via its function `export`.
         */

        var Table2Excel = function () {
            /**
             * @param {object} options - Overrides the default options.
             */
            function Table2Excel() {
                var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                (0, _classCallCheck3.default)(this, Table2Excel);

                (0, _extends3.default)(this, defaultOptions, options);
            }

            /**
             * Exports HTMLTableElements to a xlsx-file.
             *
             * @param {NodeList} tables - The tables to export.
             * @param {string} fileName - The file name.
             */


            (0, _createClass3.default)(Table2Excel, [{
                key: 'export',
                value: function _export(tables) {
                    var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaultFileName;

                    this.download(this.getWorkbook(tables), fileName);
                }

                /**
                 * Get the XLSX-Workbook object of an array of tables.
                 *
                 * @param {NodeList} tables - The tables.
                 * @returns {object} - The XLSX-Workbook object of the tables.
                 */

            }, {
                key: 'getWorkbook',
                value: function getWorkbook(tables) {
                    var _this = this;

                    return (0, _from2.default)(tables.length ? tables : [tables]).reduce(function (workbook, table, index) {
                        var dataName = '';

                        if (table.querySelector('caption')) {
                            dataName = table.querySelector('caption').innerText;
                        } else {
                            dataName = table.getAttribute('data-' + _this.tableNameDataAttribute);
                        }

                        var name = dataName || (index + 1).toString();

                        var worksheet = _this.getWorksheet(table);

                        if (typeof _this.beforeWorksheetAdded === 'function') {
                            worksheet = _this.beforeWorksheetAdded(worksheet, name);
                        }

                        workbook.SheetNames.push(name);
                        workbook.Sheets[name] = worksheet;

                        return workbook;
                    }, { SheetNames: [], Sheets: {} });
                }

                /**
                 * Get the XLSX-Worksheet object of a table.
                 *
                 * @param {HTMLTableElement} table - The table.
                 * @returns {object} - The XLSX-Worksheet object of the table.
                 */

            }, {
                key: 'getWorksheet',
                value: function getWorksheet(table) {
                    if (!table || table.tagName !== 'TABLE') {
                        throw new Error('Element must be a table');
                    }

                    return (0, _dataToWorksheet2.default)((0, _tableToData2.default)(table), typeHandlers);
                }

                /**
                 * Change top-left table corner.
                 * At the same time there is a shift of all internal objects
                 *
                 * @param {object} WS - worksheet object
                 * @param {object} newPos - new top-left coordinate
                 * @returns {object}
                 */

            }, {
                key: 'depositionWorksheetTable',
                value: function depositionWorksheetTable() {
                    var WS = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
                    var newPos = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : { c: 0, r: 0 };

                    var decodeCellItem = {},
                        decodeRangeItem = {},
                        newWS = {
                            '!merges': [],
                            '!ref': ''
                        };

                    for (var key in WS) {
                        switch (key) {
                            case '!merges':
                                for (var mergeKey in WS[key]) {
                                    newWS['!merges'].push({
                                        e: {
                                            c: WS[key][mergeKey].e.c + newPos.c,
                                            r: WS[key][mergeKey].e.r + newPos.r
                                        },
                                        s: {
                                            c: WS[key][mergeKey].s.c + newPos.c,
                                            r: WS[key][mergeKey].s.r + newPos.r
                                        }
                                    });
                                }
                                break;
                            case '!ref':
                                decodeRangeItem = (0, _decodeCell.decodeRange)(WS[key]);

                                /**
                                 * We don't move start range position (A1)
                                 */
                                decodeRangeItem.e.c += newPos.c;
                                decodeRangeItem.e.r += newPos.r;

                                newWS['!ref'] = (0, _encodeCell.encodeRange)(decodeRangeItem);
                                break;
                            case '!cols':
                                newWS['!cols'] = WS[key];

                                for (var i = 0; i < newPos.c; i++) {
                                    newWS['!cols'].unshift(null);
                                }

                                break;
                            default:
                                decodeCellItem = (0, _decodeCell.decodeCell)(key);
                                decodeCellItem.c += newPos.c;
                                decodeCellItem.r += newPos.r;

                                newWS[(0, _encodeCell.encodeCell)(decodeCellItem)] = WS[key];
                                break;
                        }
                    }
                    return newWS;
                }

                /**
                 * Exports a XLSX-Workbook object to a xlsx-file.
                 *
                 * @param {object} workbook - The XLSX-Workbook.
                 * @param {string} fileName - The file name.
                 */

            }, {
                key: 'download',
                value: function download(workbook) {
                    var fileName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.defaultFileName;

                    function convert(data) {
                        var buffer = new ArrayBuffer(data.length);
                        var view = new Uint8Array(buffer);
                        for (var i = 0; i <= data.length; i++) {
                            view[i] = data.charCodeAt(i) & 0xFF;
                        }
                        return buffer;
                    }

                    var data = window.XLSX.write(workbook, {
                        bookType: 'xlsx',
                        type: 'binary'
                    });

                    var blob = new Blob([convert(data)], { type: 'application/octet-stream' });
                    (0, _filesaver.saveAs)(blob, fileName + '.xlsx');
                }
            }]);
            return Table2Excel;
        }();

        // add global reference to `window` if defined


        exports.default = Table2Excel;
        if (window) window.Table2Excel = Table2Excel;

        /**
         * Adds the type handler to the beginning of the list of type handlers.
         * This way it can override general solutions provided by the default handlers
         * with more specific ones.
         *
         * @param {function} typeHandler - Type handler that generates a cell
         * object for a specific cell that fulfills specific criteria.
         * *
         * * @param {HTMLTableCellElement} cell - The cell that should be parsed to a cell object.
         * * @param {string} text - The text of the cell.
         * *
         * * @returns {object} - Cell object (see: https://github.com/SheetJS/js-xlsx#cell-object)
         * * or `null` iff the cell doesn't fulfill the criteria of the type handler.
         */
        Table2Excel.extend = function extendCellTypes(typeHandler) {
            typeHandlers.unshift(typeHandler);
        };

        /***/
    },
/* 2 */
/***/ function (module, exports, __webpack_require__) {

        "use strict";

        exports.__esModule = true;

        var _iterator = __webpack_require__(3);

        var _iterator2 = _interopRequireDefault(_iterator);

        var _symbol = __webpack_require__(54);

        var _symbol2 = _interopRequireDefault(_symbol);

        var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
            return typeof obj === "undefined" ? "undefined" : _typeof(obj);
        } : function (obj) {
            return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
        };

        /***/
    },
/* 3 */
/***/ function (module, exports, __webpack_require__) {

        module.exports = { "default": __webpack_require__(4), __esModule: true };

        /***/
    },
/* 4 */
/***/ function (module, exports, __webpack_require__) {

        __webpack_require__(5);
        __webpack_require__(49);
        module.exports = __webpack_require__(53).f('iterator');

        /***/
    },
/* 5 */
/***/ function (module, exports, __webpack_require__) {

        'use strict';
        var $at = __webpack_require__(6)(true);

        // 21.1.3.27 String.prototype[@@iterator]()
        __webpack_require__(9)(String, 'String', function (iterated) {
            this._t = String(iterated); // target
            this._i = 0;                // next index
            // 21.1.5.2.1 %StringIteratorPrototype%.next()
        }, function () {
            var O = this._t
                , index = this._i
                , point;
            if (index >= O.length) return { value: undefined, done: true };
            point = $at(O, index);
            this._i += point.length;
            return { value: point, done: false };
        });

        /***/
    },
/* 6 */
/***/ function (module, exports, __webpack_require__) {

        var toInteger = __webpack_require__(7)
            , defined = __webpack_require__(8);
        // true  -> String#at
        // false -> String#codePointAt
        module.exports = function (TO_STRING) {
            return function (that, pos) {
                var s = String(defined(that))
                    , i = toInteger(pos)
                    , l = s.length
                    , a, b;
                if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
                a = s.charCodeAt(i);
                return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
                    ? TO_STRING ? s.charAt(i) : a
                    : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
            };
        };

        /***/
    },
/* 7 */
/***/ function (module, exports) {

        // 7.1.4 ToInteger
        var ceil = Math.ceil
            , floor = Math.floor;
        module.exports = function (it) {
            return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
        };

        /***/
    },
/* 8 */
/***/ function (module, exports) {

        // 7.2.1 RequireObjectCoercible(argument)
        module.exports = function (it) {
            if (it == undefined) throw TypeError("Can't call method on  " + it);
            return it;
        };

        /***/
    },
/* 9 */
/***/ function (module, exports, __webpack_require__) {

        'use strict';
        var LIBRARY = __webpack_require__(10)
            , $export = __webpack_require__(11)
            , redefine = __webpack_require__(26)
            , hide = __webpack_require__(16)
            , has = __webpack_require__(27)
            , Iterators = __webpack_require__(28)
            , $iterCreate = __webpack_require__(29)
            , setToStringTag = __webpack_require__(45)
            , getPrototypeOf = __webpack_require__(47)
            , ITERATOR = __webpack_require__(46)('iterator')
            , BUGGY = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
            , FF_ITERATOR = '@@iterator'
            , KEYS = 'keys'
            , VALUES = 'values';

        var returnThis = function () { return this; };

        module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
            $iterCreate(Constructor, NAME, next);
            var getMethod = function (kind) {
                if (!BUGGY && kind in proto) return proto[kind];
                switch (kind) {
                    case KEYS: return function keys() { return new Constructor(this, kind); };
                    case VALUES: return function values() { return new Constructor(this, kind); };
                } return function entries() { return new Constructor(this, kind); };
            };
            var TAG = NAME + ' Iterator'
                , DEF_VALUES = DEFAULT == VALUES
                , VALUES_BUG = false
                , proto = Base.prototype
                , $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
                , $default = $native || getMethod(DEFAULT)
                , $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
                , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
                , methods, key, IteratorPrototype;
            // Fix native
            if ($anyNative) {
                IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
                if (IteratorPrototype !== Object.prototype) {
                    // Set @@toStringTag to native iterators
                    setToStringTag(IteratorPrototype, TAG, true);
                    // fix for some old engines
                    if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
                }
            }
            // fix Array#{values, @@iterator}.name in V8 / FF
            if (DEF_VALUES && $native && $native.name !== VALUES) {
                VALUES_BUG = true;
                $default = function values() { return $native.call(this); };
            }
            // Define iterator
            if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
                hide(proto, ITERATOR, $default);
            }
            // Plug for library
            Iterators[NAME] = $default;
            Iterators[TAG] = returnThis;
            if (DEFAULT) {
                methods = {
                    values: DEF_VALUES ? $default : getMethod(VALUES),
                    keys: IS_SET ? $default : getMethod(KEYS),
                    entries: $entries
                };
                if (FORCED) for (key in methods) {
                    if (!(key in proto)) redefine(proto, key, methods[key]);
                } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
            }
            return methods;
        };

        /***/
    },
/* 10 */
/***/ function (module, exports) {

        module.exports = true;

        /***/
    },
/* 11 */
/***/ function (module, exports, __webpack_require__) {

        var global = __webpack_require__(12)
            , core = __webpack_require__(13)
            , ctx = __webpack_require__(14)
            , hide = __webpack_require__(16)
            , PROTOTYPE = 'prototype';

        var $export = function (type, name, source) {
            var IS_FORCED = type & $export.F
                , IS_GLOBAL = type & $export.G
                , IS_STATIC = type & $export.S
                , IS_PROTO = type & $export.P
                , IS_BIND = type & $export.B
                , IS_WRAP = type & $export.W
                , exports = IS_GLOBAL ? core : core[name] || (core[name] = {})
                , expProto = exports[PROTOTYPE]
                , target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
                , key, own, out;
            if (IS_GLOBAL) source = name;
            for (key in source) {
                // contains in native
                own = !IS_FORCED && target && target[key] !== undefined;
                if (own && key in exports) continue;
                // export native or passed
                out = own ? target[key] : source[key];
                // prevent global pollution for namespaces
                exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
                    // bind timers to global for call from export context
                    : IS_BIND && own ? ctx(out, global)
                        // wrap global constructors for prevent change them in library
                        : IS_WRAP && target[key] == out ? (function (C) {
                            var F = function (a, b, c) {
                                if (this instanceof C) {
                                    switch (arguments.length) {
                                        case 0: return new C;
                                        case 1: return new C(a);
                                        case 2: return new C(a, b);
                                    } return new C(a, b, c);
                                } return C.apply(this, arguments);
                            };
                            F[PROTOTYPE] = C[PROTOTYPE];
                            return F;
                            // make static versions for prototype methods
                        })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
                // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
                if (IS_PROTO) {
                    (exports.virtual || (exports.virtual = {}))[key] = out;
                    // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
                    if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
                }
            }
        };
        // type bitmap
        $export.F = 1;   // forced
        $export.G = 2;   // global
        $export.S = 4;   // static
        $export.P = 8;   // proto
        $export.B = 16;  // bind
        $export.W = 32;  // wrap
        $export.U = 64;  // safe
        $export.R = 128; // real proto method for `library` 
        module.exports = $export;

        /***/
    },
/* 12 */
/***/ function (module, exports) {

        // https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
        var global = module.exports = typeof window != 'undefined' && window.Math == Math
            ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
        if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

        /***/
    },
/* 13 */
/***/ function (module, exports) {

        var core = module.exports = { version: '2.4.0' };
        if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

        /***/
    },
/* 14 */
/***/ function (module, exports, __webpack_require__) {

        // optional / simple context binding
        var aFunction = __webpack_require__(15);
        module.exports = function (fn, that, length) {
            aFunction(fn);
            if (that === undefined) return fn;
            switch (length) {
                case 1: return function (a) {
                    return fn.call(that, a);
                };
                case 2: return function (a, b) {
                    return fn.call(that, a, b);
                };
                case 3: return function (a, b, c) {
                    return fn.call(that, a, b, c);
                };
            }
            return function (/* ...args */) {
                return fn.apply(that, arguments);
            };
        };

        /***/
    },
/* 15 */
/***/ function (module, exports) {

        module.exports = function (it) {
            if (typeof it != 'function') throw TypeError(it + ' is not a function!');
            return it;
        };

        /***/
    },
/* 16 */
/***/ function (module, exports, __webpack_require__) {

        var dP = __webpack_require__(17)
            , createDesc = __webpack_require__(25);
        module.exports = __webpack_require__(21) ? function (object, key, value) {
            return dP.f(object, key, createDesc(1, value));
        } : function (object, key, value) {
            object[key] = value;
            return object;
        };

        /***/
    },
/* 17 */
/***/ function (module, exports, __webpack_require__) {

        var anObject = __webpack_require__(18)
            , IE8_DOM_DEFINE = __webpack_require__(20)
            , toPrimitive = __webpack_require__(24)
            , dP = Object.defineProperty;

        exports.f = __webpack_require__(21) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
            anObject(O);
            P = toPrimitive(P, true);
            anObject(Attributes);
            if (IE8_DOM_DEFINE) try {
                return dP(O, P, Attributes);
            } catch (e) { /* empty */ }
            if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
            if ('value' in Attributes) O[P] = Attributes.value;
            return O;
        };

        /***/
    },
/* 18 */
/***/ function (module, exports, __webpack_require__) {

        var isObject = __webpack_require__(19);
        module.exports = function (it) {
            if (!isObject(it)) throw TypeError(it + ' is not an object!');
            return it;
        };

        /***/
    },
/* 19 */
/***/ function (module, exports) {

        module.exports = function (it) {
            return typeof it === 'object' ? it !== null : typeof it === 'function';
        };

        /***/
    },
/* 20 */
/***/ function (module, exports, __webpack_require__) {

        module.exports = !__webpack_require__(21) && !__webpack_require__(22)(function () {
            return Object.defineProperty(__webpack_require__(23)('div'), 'a', { get: function () { return 7; } }).a != 7;
        });

        /***/
    },
/* 21 */
/***/ function (module, exports, __webpack_require__) {

        // Thank's IE8 for his funny defineProperty
        module.exports = !__webpack_require__(22)(function () {
            return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
        });

        /***/
    },
/* 22 */
/***/ function (module, exports) {

        module.exports = function (exec) {
            try {
                return !!exec();
            } catch (e) {
                return true;
            }
        };

        /***/
    },
/* 23 */
/***/ function (module, exports, __webpack_require__) {

        var isObject = __webpack_require__(19)
            , document = __webpack_require__(12).document
            // in old IE typeof document.createElement is 'object'
            , is = isObject(document) && isObject(document.createElement);
        module.exports = function (it) {
            return is ? document.createElement(it) : {};
        };

        /***/
    },
/* 24 */
/***/ function (module, exports, __webpack_require__) {

        // 7.1.1 ToPrimitive(input [, PreferredType])
        var isObject = __webpack_require__(19);
        // instead of the ES6 spec version, we didn't implement @@toPrimitive case
        // and the second argument - flag - preferred type is a string
        module.exports = function (it, S) {
            if (!isObject(it)) return it;
            var fn, val;
            if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
            if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
            if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
            throw TypeError("Can't convert object to primitive value");
        };

        /***/
    },
/* 25 */
/***/ function (module, exports) {

        module.exports = function (bitmap, value) {
            return {
                enumerable: !(bitmap & 1),
                configurable: !(bitmap & 2),
                writable: !(bitmap & 4),
                value: value
            };
        };

        /***/
    },
/* 26 */
/***/ function (module, exports, __webpack_require__) {

        module.exports = __webpack_require__(16);

        /***/
    },
/* 27 */
/***/ function (module, exports) {

        var hasOwnProperty = {}.hasOwnProperty;
        module.exports = function (it, key) {
            return hasOwnProperty.call(it, key);
        };

        /***/
    },
/* 28 */
/***/ function (module, exports) {

        module.exports = {};

        /***/
    },
/* 29 */
/***/ function (module, exports, __webpack_require__) {

        'use strict';
        var create = __webpack_require__(30)
            , descriptor = __webpack_require__(25)
            , setToStringTag = __webpack_require__(45)
            , IteratorPrototype = {};

        // 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
        __webpack_require__(16)(IteratorPrototype, __webpack_require__(46)('iterator'), function () { return this; });

        module.exports = function (Constructor, NAME, next) {
            Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
            setToStringTag(Constructor, NAME + ' Iterator');
        };

        /***/
    },
/* 30 */
/***/ function (module, exports, __webpack_require__) {

        // 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
        var anObject = __webpack_require__(18)
            , dPs = __webpack_require__(31)
            , enumBugKeys = __webpack_require__(43)
            , IE_PROTO = __webpack_require__(40)('IE_PROTO')
            , Empty = function () { /* empty */ }
            , PROTOTYPE = 'prototype';

        // Create object with fake `null` prototype: use iframe Object with cleared prototype
        var createDict = function () {
            // Thrash, waste and sodomy: IE GC bug
            var iframe = __webpack_require__(23)('iframe')
                , i = enumBugKeys.length
                , lt = '<'
                , gt = '>'
                , iframeDocument;
            iframe.style.display = 'none';
            __webpack_require__(44).appendChild(iframe);
            iframe.src = 'javascript:'; // eslint-disable-line no-script-url
            // createDict = iframe.contentWindow.Object;
            // html.removeChild(iframe);
            iframeDocument = iframe.contentWindow.document;
            iframeDocument.open();
            iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
            iframeDocument.close();
            createDict = iframeDocument.F;
            while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
            return createDict();
        };

        module.exports = Object.create || function create(O, Properties) {
            var result;
            if (O !== null) {
                Empty[PROTOTYPE] = anObject(O);
                result = new Empty;
                Empty[PROTOTYPE] = null;
                // add "__proto__" for Object.getPrototypeOf polyfill
                result[IE_PROTO] = O;
            } else result = createDict();
            return Properties === undefined ? result : dPs(result, Properties);
        };


        /***/
    },
/* 31 */
/***/ function (module, exports, __webpack_require__) {

        var dP = __webpack_require__(17)
            , anObject = __webpack_require__(18)
            , getKeys = __webpack_require__(32);

        module.exports = __webpack_require__(21) ? Object.defineProperties : function defineProperties(O, Properties) {
            anObject(O);
            var keys = getKeys(Properties)
                , length = keys.length
                , i = 0
                , P;
            while (length > i) dP.f(O, P = keys[i++], Properties[P]);
            return O;
        };

        /***/
    },
/* 32 */
/***/ function (module, exports, __webpack_require__) {

        // 19.1.2.14 / 15.2.3.14 Object.keys(O)
        var $keys = __webpack_require__(33)
            , enumBugKeys = __webpack_require__(43);

        module.exports = Object.keys || function keys(O) {
            return $keys(O, enumBugKeys);
        };

        /***/
    },
/* 33 */
/***/ function (module, exports, __webpack_require__) {

        var has = __webpack_require__(27)
            , toIObject = __webpack_require__(34)
            , arrayIndexOf = __webpack_require__(37)(false)
            , IE_PROTO = __webpack_require__(40)('IE_PROTO');

        module.exports = function (object, names) {
            var O = toIObject(object)
                , i = 0
                , result = []
                , key;
            for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
            // Don't enum bug & hidden keys
            while (names.length > i) if (has(O, key = names[i++])) {
                ~arrayIndexOf(result, key) || result.push(key);
            }
            return result;
        };

        /***/
    },
/* 34 */
/***/ function (module, exports, __webpack_require__) {

        // to indexed object, toObject with fallback for non-array-like ES3 strings
        var IObject = __webpack_require__(35)
            , defined = __webpack_require__(8);
        module.exports = function (it) {
            return IObject(defined(it));
        };

        /***/
    },
/* 35 */
/***/ function (module, exports, __webpack_require__) {

        // fallback for non-array-like ES3 and non-enumerable old V8 strings
        var cof = __webpack_require__(36);
        module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
            return cof(it) == 'String' ? it.split('') : Object(it);
        };

        /***/
    },
/* 36 */
/***/ function (module, exports) {

        var toString = {}.toString;

        module.exports = function (it) {
            return toString.call(it).slice(8, -1);
        };

        /***/
    },
/* 37 */
/***/ function (module, exports, __webpack_require__) {

        // false -> Array#indexOf
        // true  -> Array#includes
        var toIObject = __webpack_require__(34)
            , toLength = __webpack_require__(38)
            , toIndex = __webpack_require__(39);
        module.exports = function (IS_INCLUDES) {
            return function ($this, el, fromIndex) {
                var O = toIObject($this)
                    , length = toLength(O.length)
                    , index = toIndex(fromIndex, length)
                    , value;
                // Array#includes uses SameValueZero equality algorithm
                if (IS_INCLUDES && el != el) while (length > index) {
                    value = O[index++];
                    if (value != value) return true;
                    // Array#toIndex ignores holes, Array#includes - not
                } else for (; length > index; index++)if (IS_INCLUDES || index in O) {
                    if (O[index] === el) return IS_INCLUDES || index || 0;
                } return !IS_INCLUDES && -1;
            };
        };

        /***/
    },
/* 38 */
/***/ function (module, exports, __webpack_require__) {

        // 7.1.15 ToLength
        var toInteger = __webpack_require__(7)
            , min = Math.min;
        module.exports = function (it) {
            return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
        };

        /***/
    },
/* 39 */
/***/ function (module, exports, __webpack_require__) {

        var toInteger = __webpack_require__(7)
            , max = Math.max
            , min = Math.min;
        module.exports = function (index, length) {
            index = toInteger(index);
            return index < 0 ? max(index + length, 0) : min(index, length);
        };

        /***/
    },
/* 40 */
/***/ function (module, exports, __webpack_require__) {

        var shared = __webpack_require__(41)('keys')
            , uid = __webpack_require__(42);
        module.exports = function (key) {
            return shared[key] || (shared[key] = uid(key));
        };

        /***/
    },
/* 41 */
/***/ function (module, exports, __webpack_require__) {

        var global = __webpack_require__(12)
            , SHARED = '__core-js_shared__'
            , store = global[SHARED] || (global[SHARED] = {});
        module.exports = function (key) {
            return store[key] || (store[key] = {});
        };

        /***/
    },
/* 42 */
/***/ function (module, exports) {

        var id = 0
            , px = Math.random();
        module.exports = function (key) {
            return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
        };

        /***/
    },
/* 43 */
/***/ function (module, exports) {

        // IE 8- don't enum bug keys
        module.exports = (
            'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
        ).split(',');

        /***/
    },
/* 44 */
/***/ function (module, exports, __webpack_require__) {

        module.exports = __webpack_require__(12).document && document.documentElement;

        /***/
    },
/* 45 */
/***/ function (module, exports, __webpack_require__) {

        var def = __webpack_require__(17).f
            , has = __webpack_require__(27)
            , TAG = __webpack_require__(46)('toStringTag');

        module.exports = function (it, tag, stat) {
            if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
        };

        /***/
    },
/* 46 */
/***/ function (module, exports, __webpack_require__) {

        var store = __webpack_require__(41)('wks')
            , uid = __webpack_require__(42)
            , Symbol = __webpack_require__(12).Symbol
            , USE_SYMBOL = typeof Symbol == 'function';

        var $exports = module.exports = function (name) {
            return store[name] || (store[name] =
                USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
        };

        $exports.store = store;

        /***/
    },
/* 47 */
/***/ function (module, exports, __webpack_require__) {

        // 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
        var has = __webpack_require__(27)
            , toObject = __webpack_require__(48)
            , IE_PROTO = __webpack_require__(40)('IE_PROTO')
            , ObjectProto = Object.prototype;

        module.exports = Object.getPrototypeOf || function (O) {
            O = toObject(O);
            if (has(O, IE_PROTO)) return O[IE_PROTO];
            if (typeof O.constructor == 'function' && O instanceof O.constructor) {
                return O.constructor.prototype;
            } return O instanceof Object ? ObjectProto : null;
        };

        /***/
    },
/* 48 */
/***/ function (module, exports, __webpack_require__) {

        // 7.1.13 ToObject(argument)
        var defined = __webpack_require__(8);
        module.exports = function (it) {
            return Object(defined(it));
        };

        /***/
    },
/* 49 */
/***/ function (module, exports, __webpack_require__) {

        __webpack_require__(50);
        var global = __webpack_require__(12)
            , hide = __webpack_require__(16)
            , Iterators = __webpack_require__(28)
            , TO_STRING_TAG = __webpack_require__(46)('toStringTag');

        for (var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++) {
            var NAME = collections[i]
                , Collection = global[NAME]
                , proto = Collection && Collection.prototype;
            if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
            Iterators[NAME] = Iterators.Array;
        }

        /***/
    },
/* 50 */
/***/ function (module, exports, __webpack_require__) {

        'use strict';
        var addToUnscopables = __webpack_require__(51)
            , step = __webpack_require__(52)
            , Iterators = __webpack_require__(28)
            , toIObject = __webpack_require__(34);

        // 22.1.3.4 Array.prototype.entries()
        // 22.1.3.13 Array.prototype.keys()
        // 22.1.3.29 Array.prototype.values()
        // 22.1.3.30 Array.prototype[@@iterator]()
        module.exports = __webpack_require__(9)(Array, 'Array', function (iterated, kind) {
            this._t = toIObject(iterated); // target
            this._i = 0;                   // next index
            this._k = kind;                // kind
            // 22.1.5.2.1 %ArrayIteratorPrototype%.next()
        }, function () {
            var O = this._t
                , kind = this._k
                , index = this._i++;
            if (!O || index >= O.length) {
                this._t = undefined;
                return step(1);
            }
            if (kind == 'keys') return step(0, index);
            if (kind == 'values') return step(0, O[index]);
            return step(0, [index, O[index]]);
        }, 'values');

        // argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
        Iterators.Arguments = Iterators.Array;

        addToUnscopables('keys');
        addToUnscopables('values');
        addToUnscopables('entries');

        /***/
    },
/* 51 */
/***/ function (module, exports) {

        module.exports = function () { /* empty */ };

        /***/
    },
/* 52 */
/***/ function (module, exports) {

        module.exports = function (done, value) {
            return { value: value, done: !!done };
        };

        /***/
    },
/* 53 */
/***/ function (module, exports, __webpack_require__) {

        exports.f = __webpack_require__(46);

        /***/
    },
/* 54 */
/***/ function (module, exports, __webpack_require__) {

        module.exports = { "default": __webpack_require__(55), __esModule: true };

        /***/
    },
/* 55 */
/***/ function (module, exports, __webpack_require__) {

        __webpack_require__(56);
        __webpack_require__(67);
        __webpack_require__(68);
        __webpack_require__(69);
        module.exports = __webpack_require__(13).Symbol;

        /***/
    },
/* 56 */
/***/ function (module, exports, __webpack_require__) {

        'use strict';
        // ECMAScript 6 symbols shim
        var global = __webpack_require__(12)
            , has = __webpack_require__(27)
            , DESCRIPTORS = __webpack_require__(21)
            , $export = __webpack_require__(11)
            , redefine = __webpack_require__(26)
            , META = __webpack_require__(57).KEY
            , $fails = __webpack_require__(22)
            , shared = __webpack_require__(41)
            , setToStringTag = __webpack_require__(45)
            , uid = __webpack_require__(42)
            , wks = __webpack_require__(46)
            , wksExt = __webpack_require__(53)
            , wksDefine = __webpack_require__(58)
            , keyOf = __webpack_require__(59)
            , enumKeys = __webpack_require__(60)
            , isArray = __webpack_require__(63)
            , anObject = __webpack_require__(18)
            , toIObject = __webpack_require__(34)
            , toPrimitive = __webpack_require__(24)
            , createDesc = __webpack_require__(25)
            , _create = __webpack_require__(30)
            , gOPNExt = __webpack_require__(64)
            , $GOPD = __webpack_require__(66)
            , $DP = __webpack_require__(17)
            , $keys = __webpack_require__(32)
            , gOPD = $GOPD.f
            , dP = $DP.f
            , gOPN = gOPNExt.f
            , $Symbol = global.Symbol
            , $JSON = global.JSON
            , _stringify = $JSON && $JSON.stringify
            , PROTOTYPE = 'prototype'
            , HIDDEN = wks('_hidden')
            , TO_PRIMITIVE = wks('toPrimitive')
            , isEnum = {}.propertyIsEnumerable
            , SymbolRegistry = shared('symbol-registry')
            , AllSymbols = shared('symbols')
            , OPSymbols = shared('op-symbols')
            , ObjectProto = Object[PROTOTYPE]
            , USE_NATIVE = typeof $Symbol == 'function'
            , QObject = global.QObject;
        // Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
        var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

        // fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
        var setSymbolDesc = DESCRIPTORS && $fails(function () {
            return _create(dP({}, 'a', {
                get: function () { return dP(this, 'a', { value: 7 }).a; }
            })).a != 7;
        }) ? function (it, key, D) {
            var protoDesc = gOPD(ObjectProto, key);
            if (protoDesc) delete ObjectProto[key];
            dP(it, key, D);
            if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
        } : dP;

        var wrap = function (tag) {
            var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
            sym._k = tag;
            return sym;
        };

        var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
            return typeof it == 'symbol';
        } : function (it) {
            return it instanceof $Symbol;
        };

        var $defineProperty = function defineProperty(it, key, D) {
            if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
            anObject(it);
            key = toPrimitive(key, true);
            anObject(D);
            if (has(AllSymbols, key)) {
                if (!D.enumerable) {
                    if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
                    it[HIDDEN][key] = true;
                } else {
                    if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
                    D = _create(D, { enumerable: createDesc(0, false) });
                } return setSymbolDesc(it, key, D);
            } return dP(it, key, D);
        };
        var $defineProperties = function defineProperties(it, P) {
            anObject(it);
            var keys = enumKeys(P = toIObject(P))
                , i = 0
                , l = keys.length
                , key;
            while (l > i) $defineProperty(it, key = keys[i++], P[key]);
            return it;
        };
        var $create = function create(it, P) {
            return P === undefined ? _create(it) : $defineProperties(_create(it), P);
        };
        var $propertyIsEnumerable = function propertyIsEnumerable(key) {
            var E = isEnum.call(this, key = toPrimitive(key, true));
            if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
            return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
        };
        var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
            it = toIObject(it);
            key = toPrimitive(key, true);
            if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
            var D = gOPD(it, key);
            if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
            return D;
        };
        var $getOwnPropertyNames = function getOwnPropertyNames(it) {
            var names = gOPN(toIObject(it))
                , result = []
                , i = 0
                , key;
            while (names.length > i) {
                if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
            } return result;
        };
        var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
            var IS_OP = it === ObjectProto
                , names = gOPN(IS_OP ? OPSymbols : toIObject(it))
                , result = []
                , i = 0
                , key;
            while (names.length > i) {
                if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
            } return result;
        };

        // 19.4.1.1 Symbol([description])
        if (!USE_NATIVE) {
            $Symbol = function Symbol() {
                if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
                var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
                var $set = function (value) {
                    if (this === ObjectProto) $set.call(OPSymbols, value);
                    if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
                    setSymbolDesc(this, tag, createDesc(1, value));
                };
                if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
                return wrap(tag);
            };
            redefine($Symbol[PROTOTYPE], 'toString', function toString() {
                return this._k;
            });

            $GOPD.f = $getOwnPropertyDescriptor;
            $DP.f = $defineProperty;
            __webpack_require__(65).f = gOPNExt.f = $getOwnPropertyNames;
            __webpack_require__(62).f = $propertyIsEnumerable;
            __webpack_require__(61).f = $getOwnPropertySymbols;

            if (DESCRIPTORS && !__webpack_require__(10)) {
                redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
            }

            wksExt.f = function (name) {
                return wrap(wks(name));
            }
        }

        $export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

        for (var symbols = (
            // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
            'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
        ).split(','), i = 0; symbols.length > i;)wks(symbols[i++]);

        for (var symbols = $keys(wks.store), i = 0; symbols.length > i;)wksDefine(symbols[i++]);

        $export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
            // 19.4.2.1 Symbol.for(key)
            'for': function (key) {
                return has(SymbolRegistry, key += '')
                    ? SymbolRegistry[key]
                    : SymbolRegistry[key] = $Symbol(key);
            },
            // 19.4.2.5 Symbol.keyFor(sym)
            keyFor: function keyFor(key) {
                if (isSymbol(key)) return keyOf(SymbolRegistry, key);
                throw TypeError(key + ' is not a symbol!');
            },
            useSetter: function () { setter = true; },
            useSimple: function () { setter = false; }
        });

        $export($export.S + $export.F * !USE_NATIVE, 'Object', {
            // 19.1.2.2 Object.create(O [, Properties])
            create: $create,
            // 19.1.2.4 Object.defineProperty(O, P, Attributes)
            defineProperty: $defineProperty,
            // 19.1.2.3 Object.defineProperties(O, Properties)
            defineProperties: $defineProperties,
            // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
            getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
            // 19.1.2.7 Object.getOwnPropertyNames(O)
            getOwnPropertyNames: $getOwnPropertyNames,
            // 19.1.2.8 Object.getOwnPropertySymbols(O)
            getOwnPropertySymbols: $getOwnPropertySymbols
        });

        // 24.3.2 JSON.stringify(value [, replacer [, space]])
        $JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
            var S = $Symbol();
            // MS Edge converts symbol values to JSON as {}
            // WebKit converts symbol values to JSON as null
            // V8 throws on boxed symbols
            return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
        })), 'JSON', {
            stringify: function stringify(it) {
                if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
                var args = [it]
                    , i = 1
                    , replacer, $replacer;
                while (arguments.length > i) args.push(arguments[i++]);
                replacer = args[1];
                if (typeof replacer == 'function') $replacer = replacer;
                if ($replacer || !isArray(replacer)) replacer = function (key, value) {
                    if ($replacer) value = $replacer.call(this, key, value);
                    if (!isSymbol(value)) return value;
                };
                args[1] = replacer;
                return _stringify.apply($JSON, args);
            }
        });

        // 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
        $Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(16)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
        // 19.4.3.5 Symbol.prototype[@@toStringTag]
        setToStringTag($Symbol, 'Symbol');
        // 20.2.1.9 Math[@@toStringTag]
        setToStringTag(Math, 'Math', true);
        // 24.3.3 JSON[@@toStringTag]
        setToStringTag(global.JSON, 'JSON', true);

        /***/
    },
/* 57 */
/***/ function (module, exports, __webpack_require__) {

        var META = __webpack_require__(42)('meta')
            , isObject = __webpack_require__(19)
            , has = __webpack_require__(27)
            , setDesc = __webpack_require__(17).f
            , id = 0;
        var isExtensible = Object.isExtensible || function () {
            return true;
        };
        var FREEZE = !__webpack_require__(22)(function () {
            return isExtensible(Object.preventExtensions({}));
        });
        var setMeta = function (it) {
            setDesc(it, META, {
                value: {
                    i: 'O' + ++id, // object ID
                    w: {}          // weak collections IDs
                }
            });
        };
        var fastKey = function (it, create) {
            // return primitive with prefix
            if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
            if (!has(it, META)) {
                // can't set metadata to uncaught frozen object
                if (!isExtensible(it)) return 'F';
                // not necessary to add metadata
                if (!create) return 'E';
                // add missing metadata
                setMeta(it);
                // return object ID
            } return it[META].i;
        };
        var getWeak = function (it, create) {
            if (!has(it, META)) {
                // can't set metadata to uncaught frozen object
                if (!isExtensible(it)) return true;
                // not necessary to add metadata
                if (!create) return false;
                // add missing metadata
                setMeta(it);
                // return hash weak collections IDs
            } return it[META].w;
        };
        // add metadata on freeze-family methods calling
        var onFreeze = function (it) {
            if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
            return it;
        };
        var meta = module.exports = {
            KEY: META,
            NEED: false,
            fastKey: fastKey,
            getWeak: getWeak,
            onFreeze: onFreeze
        };

        /***/
    },
/* 58 */
/***/ function (module, exports, __webpack_require__) {

        var global = __webpack_require__(12)
            , core = __webpack_require__(13)
            , LIBRARY = __webpack_require__(10)
            , wksExt = __webpack_require__(53)
            , defineProperty = __webpack_require__(17).f;
        module.exports = function (name) {
            var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
            if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
        };

        /***/
    },
/* 59 */
/***/ function (module, exports, __webpack_require__) {

        var getKeys = __webpack_require__(32)
            , toIObject = __webpack_require__(34);
        module.exports = function (object, el) {
            var O = toIObject(object)
                , keys = getKeys(O)
                , length = keys.length
                , index = 0
                , key;
            while (length > index) if (O[key = keys[index++]] === el) return key;
        };

        /***/
    },
/* 60 */
/***/ function (module, exports, __webpack_require__) {

        // all enumerable object keys, includes symbols
        var getKeys = __webpack_require__(32)
            , gOPS = __webpack_require__(61)
            , pIE = __webpack_require__(62);
        module.exports = function (it) {
            var result = getKeys(it)
                , getSymbols = gOPS.f;
            if (getSymbols) {
                var symbols = getSymbols(it)
                    , isEnum = pIE.f
                    , i = 0
                    , key;
                while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
            } return result;
        };

        /***/
    },
/* 61 */
/***/ function (module, exports) {

        exports.f = Object.getOwnPropertySymbols;

        /***/
    },
/* 62 */
/***/ function (module, exports) {

        exports.f = {}.propertyIsEnumerable;

        /***/
    },
/* 63 */
/***/ function (module, exports, __webpack_require__) {

        // 7.2.2 IsArray(argument)
        var cof = __webpack_require__(36);
        module.exports = Array.isArray || function isArray(arg) {
            return cof(arg) == 'Array';
        };

        /***/
    },
/* 64 */
/***/ function (module, exports, __webpack_require__) {

        // fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
        var toIObject = __webpack_require__(34)
            , gOPN = __webpack_require__(65).f
            , toString = {}.toString;

        var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
            ? Object.getOwnPropertyNames(window) : [];

        var getWindowNames = function (it) {
            try {
                return gOPN(it);
            } catch (e) {
                return windowNames.slice();
            }
        };

        module.exports.f = function getOwnPropertyNames(it) {
            return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
        };


        /***/
    },
/* 65 */
/***/ function (module, exports, __webpack_require__) {

        // 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
        var $keys = __webpack_require__(33)
            , hiddenKeys = __webpack_require__(43).concat('length', 'prototype');

        exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
            return $keys(O, hiddenKeys);
        };

        /***/
    },
/* 66 */
/***/ function (module, exports, __webpack_require__) {

        var pIE = __webpack_require__(62)
            , createDesc = __webpack_require__(25)
            , toIObject = __webpack_require__(34)
            , toPrimitive = __webpack_require__(24)
            , has = __webpack_require__(27)
            , IE8_DOM_DEFINE = __webpack_require__(20)
            , gOPD = Object.getOwnPropertyDescriptor;

        exports.f = __webpack_require__(21) ? gOPD : function getOwnPropertyDescriptor(O, P) {
            O = toIObject(O);
            P = toPrimitive(P, true);
            if (IE8_DOM_DEFINE) try {
                return gOPD(O, P);
            } catch (e) { /* empty */ }
            if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
        };

        /***/
    },
/* 67 */
/***/ function (module, exports) {



        /***/
    },
/* 68 */
/***/ function (module, exports, __webpack_require__) {

        __webpack_require__(58)('asyncIterator');

        /***/
    },
/* 69 */
/***/ function (module, exports, __webpack_require__) {

        __webpack_require__(58)('observable');

        /***/
    },
/* 70 */
/***/ function (module, exports, __webpack_require__) {

        module.exports = { "default": __webpack_require__(71), __esModule: true };

        /***/
    },
/* 71 */
/***/ function (module, exports, __webpack_require__) {

        __webpack_require__(5);
        __webpack_require__(72);
        module.exports = __webpack_require__(13).Array.from;

        /***/
    },
/* 72 */
/***/ function (module, exports, __webpack_require__) {

        'use strict';
        var ctx = __webpack_require__(14)
            , $export = __webpack_require__(11)
            , toObject = __webpack_require__(48)
            , call = __webpack_require__(73)
            , isArrayIter = __webpack_require__(74)
            , toLength = __webpack_require__(38)
            , createProperty = __webpack_require__(75)
            , getIterFn = __webpack_require__(76);

        $export($export.S + $export.F * !__webpack_require__(78)(function (iter) { Array.from(iter); }), 'Array', {
            // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
            from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/) {
                var O = toObject(arrayLike)
                    , C = typeof this == 'function' ? this : Array
                    , aLen = arguments.length
                    , mapfn = aLen > 1 ? arguments[1] : undefined
                    , mapping = mapfn !== undefined
                    , index = 0
                    , iterFn = getIterFn(O)
                    , length, result, step, iterator;
                if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
                // if object isn't iterable or it's array with default iterator - use simple case
                if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
                    for (iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++) {
                        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
                    }
                } else {
                    length = toLength(O.length);
                    for (result = new C(length); length > index; index++) {
                        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
                    }
                }
                result.length = index;
                return result;
            }
        });


        /***/
    },
/* 73 */
/***/ function (module, exports, __webpack_require__) {

        // call something on iterator step with safe closing on error
        var anObject = __webpack_require__(18);
        module.exports = function (iterator, fn, value, entries) {
            try {
                return entries ? fn(anObject(value)[0], value[1]) : fn(value);
                // 7.4.6 IteratorClose(iterator, completion)
            } catch (e) {
                var ret = iterator['return'];
                if (ret !== undefined) anObject(ret.call(iterator));
                throw e;
            }
        };

        /***/
    },
/* 74 */
/***/ function (module, exports, __webpack_require__) {

        // check on default Array iterator
        var Iterators = __webpack_require__(28)
            , ITERATOR = __webpack_require__(46)('iterator')
            , ArrayProto = Array.prototype;

        module.exports = function (it) {
            return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
        };

        /***/
    },
/* 75 */
/***/ function (module, exports, __webpack_require__) {

        'use strict';
        var $defineProperty = __webpack_require__(17)
            , createDesc = __webpack_require__(25);

        module.exports = function (object, index, value) {
            if (index in object) $defineProperty.f(object, index, createDesc(0, value));
            else object[index] = value;
        };

        /***/
    },
/* 76 */
/***/ function (module, exports, __webpack_require__) {

        var classof = __webpack_require__(77)
            , ITERATOR = __webpack_require__(46)('iterator')
            , Iterators = __webpack_require__(28);
        module.exports = __webpack_require__(13).getIteratorMethod = function (it) {
            if (it != undefined) return it[ITERATOR]
                || it['@@iterator']
                || Iterators[classof(it)];
        };

        /***/
    },
/* 77 */
/***/ function (module, exports, __webpack_require__) {

        // getting tag from 19.1.3.6 Object.prototype.toString()
        var cof = __webpack_require__(36)
            , TAG = __webpack_require__(46)('toStringTag')
            // ES3 wrong here
            , ARG = cof(function () { return arguments; }()) == 'Arguments';

        // fallback for IE11 Script Access Denied error
        var tryGet = function (it, key) {
            try {
                return it[key];
            } catch (e) { /* empty */ }
        };

        module.exports = function (it) {
            var O, T, B;
            return it === undefined ? 'Undefined' : it === null ? 'Null'
                // @@toStringTag case
                : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
                    // builtinTag case
                    : ARG ? cof(O)
                        // ES3 arguments fallback
                        : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
        };

        /***/
    },
/* 78 */
/***/ function (module, exports, __webpack_require__) {

        var ITERATOR = __webpack_require__(46)('iterator')
            , SAFE_CLOSING = false;

        try {
            var riter = [7][ITERATOR]();
            riter['return'] = function () { SAFE_CLOSING = true; };
            Array.from(riter, function () { throw 2; });
        } catch (e) { /* empty */ }

        module.exports = function (exec, skipClosing) {
            if (!skipClosing && !SAFE_CLOSING) return false;
            var safe = false;
            try {
                var arr = [7]
                    , iter = arr[ITERATOR]();
                iter.next = function () { return { done: safe = true }; };
                arr[ITERATOR] = function () { return iter; };
                exec(arr);
            } catch (e) { /* empty */ }
            return safe;
        };

        /***/
    },
/* 79 */
/***/ function (module, exports, __webpack_require__) {

        "use strict";

        exports.__esModule = true;

        var _assign = __webpack_require__(80);

        var _assign2 = _interopRequireDefault(_assign);

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        exports.default = _assign2.default || function (target) {
            for (var i = 1; i < arguments.length; i++) {
                var source = arguments[i];

                for (var key in source) {
                    if (Object.prototype.hasOwnProperty.call(source, key)) {
                        target[key] = source[key];
                    }
                }
            }

            return target;
        };

        /***/
    },
/* 80 */
/***/ function (module, exports, __webpack_require__) {

        module.exports = { "default": __webpack_require__(81), __esModule: true };

        /***/
    },
/* 81 */
/***/ function (module, exports, __webpack_require__) {

        __webpack_require__(82);
        module.exports = __webpack_require__(13).Object.assign;

        /***/
    },
/* 82 */
/***/ function (module, exports, __webpack_require__) {

        // 19.1.3.1 Object.assign(target, source)
        var $export = __webpack_require__(11);

        $export($export.S + $export.F, 'Object', { assign: __webpack_require__(83) });

        /***/
    },
/* 83 */
/***/ function (module, exports, __webpack_require__) {

        'use strict';
        // 19.1.2.1 Object.assign(target, source, ...)
        var getKeys = __webpack_require__(32)
            , gOPS = __webpack_require__(61)
            , pIE = __webpack_require__(62)
            , toObject = __webpack_require__(48)
            , IObject = __webpack_require__(35)
            , $assign = Object.assign;

        // should work with symbols and should have deterministic property order (V8 bug)
        module.exports = !$assign || __webpack_require__(22)(function () {
            var A = {}
                , B = {}
                , S = Symbol()
                , K = 'abcdefghijklmnopqrst';
            A[S] = 7;
            K.split('').forEach(function (k) { B[k] = k; });
            return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
        }) ? function assign(target, source) { // eslint-disable-line no-unused-vars
            var T = toObject(target)
                , aLen = arguments.length
                , index = 1
                , getSymbols = gOPS.f
                , isEnum = pIE.f;
            while (aLen > index) {
                var S = IObject(arguments[index++])
                    , keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
                    , length = keys.length
                    , j = 0
                    , key;
                while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
            } return T;
        } : $assign;

        /***/
    },
/* 84 */
/***/ function (module, exports) {

        "use strict";

        exports.__esModule = true;

        exports.default = function (instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function");
            }
        };

        /***/
    },
/* 85 */
/***/ function (module, exports, __webpack_require__) {

        "use strict";

        exports.__esModule = true;

        var _defineProperty = __webpack_require__(86);

        var _defineProperty2 = _interopRequireDefault(_defineProperty);

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        exports.default = function () {
            function defineProperties(target, props) {
                for (var i = 0; i < props.length; i++) {
                    var descriptor = props[i];
                    descriptor.enumerable = descriptor.enumerable || false;
                    descriptor.configurable = true;
                    if ("value" in descriptor) descriptor.writable = true;
                    (0, _defineProperty2.default)(target, descriptor.key, descriptor);
                }
            }

            return function (Constructor, protoProps, staticProps) {
                if (protoProps) defineProperties(Constructor.prototype, protoProps);
                if (staticProps) defineProperties(Constructor, staticProps);
                return Constructor;
            };
        }();

        /***/
    },
/* 86 */
/***/ function (module, exports, __webpack_require__) {

        module.exports = { "default": __webpack_require__(87), __esModule: true };

        /***/
    },
/* 87 */
/***/ function (module, exports, __webpack_require__) {

        __webpack_require__(88);
        var $Object = __webpack_require__(13).Object;
        module.exports = function defineProperty(it, key, desc) {
            return $Object.defineProperty(it, key, desc);
        };

        /***/
    },
/* 88 */
/***/ function (module, exports, __webpack_require__) {

        var $export = __webpack_require__(11);
        // 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
        $export($export.S + $export.F * !__webpack_require__(21), 'Object', { defineProperty: __webpack_require__(17).f });

        /***/
    },
/* 89 */
/***/ function (module, exports, __webpack_require__) {

        __webpack_require__(90)(__webpack_require__(91))

        /***/
    },
/* 90 */
/***/ function (module, exports) {

        /*
            MIT License http://www.opensource.org/licenses/mit-license.php
            Author Tobias Koppers @sokra
        */
        module.exports = function (src) {
            if (typeof execScript !== "undefined")
                execScript(src);
            else
                eval.call(null, src);
        }


        /***/
    },
/* 91 */
/***/ function (module, exports) {

        module.exports = "/* xlsx.js (C) 2013-2015 SheetJS -- http://sheetjs.com */\n!function(e){if(\"object\"==typeof exports&&\"undefined\"!=typeof module)module.exports=e();else if(\"function\"==typeof define&&define.amd)define([],e);else{var f;\"undefined\"!=typeof window?f=window:\"undefined\"!=typeof global?f=global:\"undefined\"!=typeof self&&(f=self),f.JSZip=e()}}(function(){var define,module,exports;return function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require==\"function\"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error(\"Cannot find module '\"+o+\"'\")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require==\"function\"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s}({1:[function(_dereq_,module,exports){\"use strict\";var _keyStr=\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\";exports.encode=function(input,utf8){var output=\"\";var chr1,chr2,chr3,enc1,enc2,enc3,enc4;var i=0;while(i<input.length){chr1=input.charCodeAt(i++);chr2=input.charCodeAt(i++);chr3=input.charCodeAt(i++);enc1=chr1>>2;enc2=(chr1&3)<<4|chr2>>4;enc3=(chr2&15)<<2|chr3>>6;enc4=chr3&63;if(isNaN(chr2)){enc3=enc4=64}else if(isNaN(chr3)){enc4=64}output=output+_keyStr.charAt(enc1)+_keyStr.charAt(enc2)+_keyStr.charAt(enc3)+_keyStr.charAt(enc4)}return output};exports.decode=function(input,utf8){var output=\"\";var chr1,chr2,chr3;var enc1,enc2,enc3,enc4;var i=0;input=input.replace(/[^A-Za-z0-9\\+\\/\\=]/g,\"\");while(i<input.length){enc1=_keyStr.indexOf(input.charAt(i++));enc2=_keyStr.indexOf(input.charAt(i++));enc3=_keyStr.indexOf(input.charAt(i++));enc4=_keyStr.indexOf(input.charAt(i++));chr1=enc1<<2|enc2>>4;chr2=(enc2&15)<<4|enc3>>2;chr3=(enc3&3)<<6|enc4;output=output+String.fromCharCode(chr1);if(enc3!=64){output=output+String.fromCharCode(chr2)}if(enc4!=64){output=output+String.fromCharCode(chr3)}}return output}},{}],2:[function(_dereq_,module,exports){\"use strict\";function CompressedObject(){this.compressedSize=0;this.uncompressedSize=0;this.crc32=0;this.compressionMethod=null;this.compressedContent=null}CompressedObject.prototype={getContent:function(){return null},getCompressedContent:function(){return null}};module.exports=CompressedObject},{}],3:[function(_dereq_,module,exports){\"use strict\";exports.STORE={magic:\"\\x00\\x00\",compress:function(content){return content},uncompress:function(content){return content},compressInputType:null,uncompressInputType:null};exports.DEFLATE=_dereq_(\"./flate\")},{\"./flate\":8}],4:[function(_dereq_,module,exports){\"use strict\";var utils=_dereq_(\"./utils\");var table=[0,1996959894,3993919788,2567524794,124634137,1886057615,3915621685,2657392035,249268274,2044508324,3772115230,2547177864,162941995,2125561021,3887607047,2428444049,498536548,1789927666,4089016648,2227061214,450548861,1843258603,4107580753,2211677639,325883990,1684777152,4251122042,2321926636,335633487,1661365465,4195302755,2366115317,997073096,1281953886,3579855332,2724688242,1006888145,1258607687,3524101629,2768942443,901097722,1119000684,3686517206,2898065728,853044451,1172266101,3705015759,2882616665,651767980,1373503546,3369554304,3218104598,565507253,1454621731,3485111705,3099436303,671266974,1594198024,3322730930,2970347812,795835527,1483230225,3244367275,3060149565,1994146192,31158534,2563907772,4023717930,1907459465,112637215,2680153253,3904427059,2013776290,251722036,2517215374,3775830040,2137656763,141376813,2439277719,3865271297,1802195444,476864866,2238001368,4066508878,1812370925,453092731,2181625025,4111451223,1706088902,314042704,2344532202,4240017532,1658658271,366619977,2362670323,4224994405,1303535960,984961486,2747007092,3569037538,1256170817,1037604311,2765210733,3554079995,1131014506,879679996,2909243462,3663771856,1141124467,855842277,2852801631,3708648649,1342533948,654459306,3188396048,3373015174,1466479909,544179635,3110523913,3462522015,1591671054,702138776,2966460450,3352799412,1504918807,783551873,3082640443,3233442989,3988292384,2596254646,62317068,1957810842,3939845945,2647816111,81470997,1943803523,3814918930,2489596804,225274430,2053790376,3826175755,2466906013,167816743,2097651377,4027552580,2265490386,503444072,1762050814,4150417245,2154129355,426522225,1852507879,4275313526,2312317920,282753626,1742555852,4189708143,2394877945,397917763,1622183637,3604390888,2714866558,953729732,1340076626,3518719985,2797360999,1068828381,1219638859,3624741850,2936675148,906185462,1090812512,3747672003,2825379669,829329135,1181335161,3412177804,3160834842,628085408,1382605366,3423369109,3138078467,570562233,1426400815,3317316542,2998733608,733239954,1555261956,3268935591,3050360625,752459403,1541320221,2607071920,3965973030,1969922972,40735498,2617837225,3943577151,1913087877,83908371,2512341634,3803740692,2075208622,213261112,2463272603,3855990285,2094854071,198958881,2262029012,4057260610,1759359992,534414190,2176718541,4139329115,1873836001,414664567,2282248934,4279200368,1711684554,285281116,2405801727,4167216745,1634467795,376229701,2685067896,3608007406,1308918612,956543938,2808555105,3495958263,1231636301,1047427035,2932959818,3654703836,1088359270,936918e3,2847714899,3736837829,1202900863,817233897,3183342108,3401237130,1404277552,615818150,3134207493,3453421203,1423857449,601450431,3009837614,3294710456,1567103746,711928724,3020668471,3272380065,1510334235,755167117];module.exports=function crc32(input,crc){if(typeof input===\"undefined\"||!input.length){return 0}var isArray=utils.getTypeOf(input)!==\"string\";if(typeof crc==\"undefined\"){crc=0}var x=0;var y=0;var b=0;crc=crc^-1;for(var i=0,iTop=input.length;i<iTop;i++){b=isArray?input[i]:input.charCodeAt(i);y=(crc^b)&255;x=table[y];crc=crc>>>8^x}return crc^-1}},{\"./utils\":21}],5:[function(_dereq_,module,exports){\"use strict\";var utils=_dereq_(\"./utils\");function DataReader(data){this.data=null;this.length=0;this.index=0}DataReader.prototype={checkOffset:function(offset){this.checkIndex(this.index+offset)},checkIndex:function(newIndex){if(this.length<newIndex||newIndex<0){throw new Error(\"End of data reached (data length = \"+this.length+\", asked index = \"+newIndex+\"). Corrupted zip ?\")}},setIndex:function(newIndex){this.checkIndex(newIndex);this.index=newIndex},skip:function(n){this.setIndex(this.index+n)},byteAt:function(i){},readInt:function(size){var result=0,i;this.checkOffset(size);for(i=this.index+size-1;i>=this.index;i--){result=(result<<8)+this.byteAt(i)}this.index+=size;return result},readString:function(size){return utils.transformTo(\"string\",this.readData(size))},readData:function(size){},lastIndexOfSignature:function(sig){},readDate:function(){var dostime=this.readInt(4);return new Date((dostime>>25&127)+1980,(dostime>>21&15)-1,dostime>>16&31,dostime>>11&31,dostime>>5&63,(dostime&31)<<1)}};module.exports=DataReader},{\"./utils\":21}],6:[function(_dereq_,module,exports){\"use strict\";exports.base64=false;exports.binary=false;exports.dir=false;exports.createFolders=false;exports.date=null;exports.compression=null;exports.comment=null},{}],7:[function(_dereq_,module,exports){\"use strict\";var utils=_dereq_(\"./utils\");exports.string2binary=function(str){return utils.string2binary(str)};exports.string2Uint8Array=function(str){return utils.transformTo(\"uint8array\",str)};exports.uint8Array2String=function(array){return utils.transformTo(\"string\",array)};exports.string2Blob=function(str){var buffer=utils.transformTo(\"arraybuffer\",str);return utils.arrayBuffer2Blob(buffer)};exports.arrayBuffer2Blob=function(buffer){return utils.arrayBuffer2Blob(buffer)};exports.transformTo=function(outputType,input){return utils.transformTo(outputType,input)};exports.getTypeOf=function(input){return utils.getTypeOf(input)};exports.checkSupport=function(type){return utils.checkSupport(type)};exports.MAX_VALUE_16BITS=utils.MAX_VALUE_16BITS;exports.MAX_VALUE_32BITS=utils.MAX_VALUE_32BITS;exports.pretty=function(str){return utils.pretty(str)};exports.findCompression=function(compressionMethod){return utils.findCompression(compressionMethod)};exports.isRegExp=function(object){return utils.isRegExp(object)}},{\"./utils\":21}],8:[function(_dereq_,module,exports){\"use strict\";var USE_TYPEDARRAY=typeof Uint8Array!==\"undefined\"&&typeof Uint16Array!==\"undefined\"&&typeof Uint32Array!==\"undefined\";var pako=_dereq_(\"pako\");exports.uncompressInputType=USE_TYPEDARRAY?\"uint8array\":\"array\";exports.compressInputType=USE_TYPEDARRAY?\"uint8array\":\"array\";exports.magic=\"\\b\\x00\";exports.compress=function(input){return pako.deflateRaw(input)};exports.uncompress=function(input){return pako.inflateRaw(input)}},{pako:24}],9:[function(_dereq_,module,exports){\"use strict\";var base64=_dereq_(\"./base64\");function JSZip(data,options){if(!(this instanceof JSZip))return new JSZip(data,options);this.files={};this.comment=null;this.root=\"\";if(data){this.load(data,options)}this.clone=function(){var newObj=new JSZip;for(var i in this){if(typeof this[i]!==\"function\"){newObj[i]=this[i]}}return newObj}}JSZip.prototype=_dereq_(\"./object\");JSZip.prototype.load=_dereq_(\"./load\");JSZip.support=_dereq_(\"./support\");JSZip.defaults=_dereq_(\"./defaults\");JSZip.utils=_dereq_(\"./deprecatedPublicUtils\");JSZip.base64={encode:function(input){return base64.encode(input)},decode:function(input){return base64.decode(input)}};JSZip.compressions=_dereq_(\"./compressions\");module.exports=JSZip},{\"./base64\":1,\"./compressions\":3,\"./defaults\":6,\"./deprecatedPublicUtils\":7,\"./load\":10,\"./object\":13,\"./support\":17}],10:[function(_dereq_,module,exports){\"use strict\";var base64=_dereq_(\"./base64\");var ZipEntries=_dereq_(\"./zipEntries\");module.exports=function(data,options){var files,zipEntries,i,input;options=options||{};if(options.base64){data=base64.decode(data)}zipEntries=new ZipEntries(data,options);files=zipEntries.files;for(i=0;i<files.length;i++){input=files[i];this.file(input.fileName,input.decompressed,{binary:true,optimizedBinaryString:true,date:input.date,dir:input.dir,comment:input.fileComment.length?input.fileComment:null,createFolders:options.createFolders})}if(zipEntries.zipComment.length){this.comment=zipEntries.zipComment}return this}},{\"./base64\":1,\"./zipEntries\":22}],11:[function(_dereq_,module,exports){(function(Buffer){\"use strict\";module.exports=function(data,encoding){return new Buffer(data,encoding)};module.exports.test=function(b){return Buffer.isBuffer(b)}}).call(this,typeof Buffer!==\"undefined\"?Buffer:undefined)},{}],12:[function(_dereq_,module,exports){\"use strict\";var Uint8ArrayReader=_dereq_(\"./uint8ArrayReader\");function NodeBufferReader(data){this.data=data;this.length=this.data.length;this.index=0}NodeBufferReader.prototype=new Uint8ArrayReader;NodeBufferReader.prototype.readData=function(size){this.checkOffset(size);var result=this.data.slice(this.index,this.index+size);this.index+=size;return result};module.exports=NodeBufferReader},{\"./uint8ArrayReader\":18}],13:[function(_dereq_,module,exports){\"use strict\";var support=_dereq_(\"./support\");var utils=_dereq_(\"./utils\");var crc32=_dereq_(\"./crc32\");var signature=_dereq_(\"./signature\");var defaults=_dereq_(\"./defaults\");var base64=_dereq_(\"./base64\");var compressions=_dereq_(\"./compressions\");var CompressedObject=_dereq_(\"./compressedObject\");var nodeBuffer=_dereq_(\"./nodeBuffer\");var utf8=_dereq_(\"./utf8\");var StringWriter=_dereq_(\"./stringWriter\");var Uint8ArrayWriter=_dereq_(\"./uint8ArrayWriter\");var getRawData=function(file){if(file._data instanceof CompressedObject){file._data=file._data.getContent();file.options.binary=true;file.options.base64=false;if(utils.getTypeOf(file._data)===\"uint8array\"){var copy=file._data;file._data=new Uint8Array(copy.length);if(copy.length!==0){file._data.set(copy,0)}}}return file._data};var getBinaryData=function(file){var result=getRawData(file),type=utils.getTypeOf(result);if(type===\"string\"){if(!file.options.binary){if(support.nodebuffer){return nodeBuffer(result,\"utf-8\")}}return file.asBinary()}return result};var dataToString=function(asUTF8){var result=getRawData(this);if(result===null||typeof result===\"undefined\"){return\"\"}if(this.options.base64){result=base64.decode(result)}if(asUTF8&&this.options.binary){result=out.utf8decode(result)}else{result=utils.transformTo(\"string\",result)}if(!asUTF8&&!this.options.binary){result=utils.transformTo(\"string\",out.utf8encode(result))}return result};var ZipObject=function(name,data,options){this.name=name;this.dir=options.dir;this.date=options.date;this.comment=options.comment;this._data=data;this.options=options;this._initialMetadata={dir:options.dir,date:options.date}};ZipObject.prototype={asText:function(){return dataToString.call(this,true)},asBinary:function(){return dataToString.call(this,false)},asNodeBuffer:function(){var result=getBinaryData(this);return utils.transformTo(\"nodebuffer\",result)},asUint8Array:function(){var result=getBinaryData(this);return utils.transformTo(\"uint8array\",result)},asArrayBuffer:function(){return this.asUint8Array().buffer}};var decToHex=function(dec,bytes){var hex=\"\",i;for(i=0;i<bytes;i++){hex+=String.fromCharCode(dec&255);dec=dec>>>8}return hex};var extend=function(){var result={},i,attr;for(i=0;i<arguments.length;i++){for(attr in arguments[i]){if(arguments[i].hasOwnProperty(attr)&&typeof result[attr]===\"undefined\"){result[attr]=arguments[i][attr]}}}return result};var prepareFileAttrs=function(o){o=o||{};if(o.base64===true&&(o.binary===null||o.binary===undefined)){o.binary=true}o=extend(o,defaults);o.date=o.date||new Date;if(o.compression!==null)o.compression=o.compression.toUpperCase();return o};var fileAdd=function(name,data,o){var dataType=utils.getTypeOf(data),parent;o=prepareFileAttrs(o);if(o.createFolders&&(parent=parentFolder(name))){folderAdd.call(this,parent,true)}if(o.dir||data===null||typeof data===\"undefined\"){o.base64=false;o.binary=false;data=null}else if(dataType===\"string\"){if(o.binary&&!o.base64){if(o.optimizedBinaryString!==true){data=utils.string2binary(data)}}}else{o.base64=false;o.binary=true;if(!dataType&&!(data instanceof CompressedObject)){throw new Error(\"The data of '\"+name+\"' is in an unsupported format !\")}if(dataType===\"arraybuffer\"){data=utils.transformTo(\"uint8array\",data)}}var object=new ZipObject(name,data,o);this.files[name]=object;return object};var parentFolder=function(path){if(path.slice(-1)==\"/\"){path=path.substring(0,path.length-1)}var lastSlash=path.lastIndexOf(\"/\");return lastSlash>0?path.substring(0,lastSlash):\"\"};var folderAdd=function(name,createFolders){if(name.slice(-1)!=\"/\"){name+=\"/\"}createFolders=typeof createFolders!==\"undefined\"?createFolders:false;if(!this.files[name]){fileAdd.call(this,name,null,{dir:true,createFolders:createFolders})}return this.files[name]};var generateCompressedObjectFrom=function(file,compression){var result=new CompressedObject,content;if(file._data instanceof CompressedObject){result.uncompressedSize=file._data.uncompressedSize;result.crc32=file._data.crc32;if(result.uncompressedSize===0||file.dir){compression=compressions[\"STORE\"];result.compressedContent=\"\";result.crc32=0}else if(file._data.compressionMethod===compression.magic){result.compressedContent=file._data.getCompressedContent()}else{content=file._data.getContent();result.compressedContent=compression.compress(utils.transformTo(compression.compressInputType,content))}}else{content=getBinaryData(file);if(!content||content.length===0||file.dir){compression=compressions[\"STORE\"];content=\"\"}result.uncompressedSize=content.length;result.crc32=crc32(content);result.compressedContent=compression.compress(utils.transformTo(compression.compressInputType,content))}result.compressedSize=result.compressedContent.length;result.compressionMethod=compression.magic;return result};var generateZipParts=function(name,file,compressedObject,offset){var data=compressedObject.compressedContent,utfEncodedFileName=utils.transformTo(\"string\",utf8.utf8encode(file.name)),comment=file.comment||\"\",utfEncodedComment=utils.transformTo(\"string\",utf8.utf8encode(comment)),useUTF8ForFileName=utfEncodedFileName.length!==file.name.length,useUTF8ForComment=utfEncodedComment.length!==comment.length,o=file.options,dosTime,dosDate,extraFields=\"\",unicodePathExtraField=\"\",unicodeCommentExtraField=\"\",dir,date;if(file._initialMetadata.dir!==file.dir){dir=file.dir}else{dir=o.dir}if(file._initialMetadata.date!==file.date){date=file.date}else{date=o.date}dosTime=date.getHours();dosTime=dosTime<<6;dosTime=dosTime|date.getMinutes();dosTime=dosTime<<5;dosTime=dosTime|date.getSeconds()/2;dosDate=date.getFullYear()-1980;dosDate=dosDate<<4;dosDate=dosDate|date.getMonth()+1;dosDate=dosDate<<5;dosDate=dosDate|date.getDate();if(useUTF8ForFileName){unicodePathExtraField=decToHex(1,1)+decToHex(crc32(utfEncodedFileName),4)+utfEncodedFileName;extraFields+=\"up\"+decToHex(unicodePathExtraField.length,2)+unicodePathExtraField}if(useUTF8ForComment){unicodeCommentExtraField=decToHex(1,1)+decToHex(this.crc32(utfEncodedComment),4)+utfEncodedComment;extraFields+=\"uc\"+decToHex(unicodeCommentExtraField.length,2)+unicodeCommentExtraField}var header=\"\";header+=\"\\n\\x00\";header+=useUTF8ForFileName||useUTF8ForComment?\"\\x00\\b\":\"\\x00\\x00\";header+=compressedObject.compressionMethod;header+=decToHex(dosTime,2);header+=decToHex(dosDate,2);header+=decToHex(compressedObject.crc32,4);header+=decToHex(compressedObject.compressedSize,4);header+=decToHex(compressedObject.uncompressedSize,4);header+=decToHex(utfEncodedFileName.length,2);header+=decToHex(extraFields.length,2);var fileRecord=signature.LOCAL_FILE_HEADER+header+utfEncodedFileName+extraFields;var dirRecord=signature.CENTRAL_FILE_HEADER+\"\u0014\\x00\"+header+decToHex(utfEncodedComment.length,2)+\"\\x00\\x00\"+\"\\x00\\x00\"+(dir===true?\"\u0010\\x00\\x00\\x00\":\"\\x00\\x00\\x00\\x00\")+decToHex(offset,4)+utfEncodedFileName+extraFields+utfEncodedComment;return{fileRecord:fileRecord,dirRecord:dirRecord,compressedObject:compressedObject}};var out={load:function(stream,options){throw new Error(\"Load method is not defined. Is the file jszip-load.js included ?\")},filter:function(search){var result=[],filename,relativePath,file,fileClone;for(filename in this.files){if(!this.files.hasOwnProperty(filename)){continue}file=this.files[filename];fileClone=new ZipObject(file.name,file._data,extend(file.options));relativePath=filename.slice(this.root.length,filename.length);if(filename.slice(0,this.root.length)===this.root&&search(relativePath,fileClone)){result.push(fileClone)}}return result},file:function(name,data,o){if(arguments.length===1){if(utils.isRegExp(name)){var regexp=name;return this.filter(function(relativePath,file){return!file.dir&&regexp.test(relativePath)})}else{return this.filter(function(relativePath,file){return!file.dir&&relativePath===name})[0]||null}}else{name=this.root+name;fileAdd.call(this,name,data,o)}return this},folder:function(arg){if(!arg){return this}if(utils.isRegExp(arg)){return this.filter(function(relativePath,file){return file.dir&&arg.test(relativePath)})}var name=this.root+arg;var newFolder=folderAdd.call(this,name);var ret=this.clone();ret.root=newFolder.name;return ret},remove:function(name){name=this.root+name;var file=this.files[name];if(!file){if(name.slice(-1)!=\"/\"){name+=\"/\"}file=this.files[name]}if(file&&!file.dir){delete this.files[name]}else{var kids=this.filter(function(relativePath,file){return file.name.slice(0,name.length)===name});for(var i=0;i<kids.length;i++){delete this.files[kids[i].name]}}return this},generate:function(options){options=extend(options||{},{base64:true,compression:\"STORE\",type:\"base64\",comment:null});utils.checkSupport(options.type);var zipData=[],localDirLength=0,centralDirLength=0,writer,i,utfEncodedComment=utils.transformTo(\"string\",this.utf8encode(options.comment||this.comment||\"\"));for(var name in this.files){if(!this.files.hasOwnProperty(name)){continue}var file=this.files[name];var compressionName=file.options.compression||options.compression.toUpperCase();var compression=compressions[compressionName];if(!compression){throw new Error(compressionName+\" is not a valid compression method !\")}var compressedObject=generateCompressedObjectFrom.call(this,file,compression);var zipPart=generateZipParts.call(this,name,file,compressedObject,localDirLength);localDirLength+=zipPart.fileRecord.length+compressedObject.compressedSize;centralDirLength+=zipPart.dirRecord.length;zipData.push(zipPart)}var dirEnd=\"\";dirEnd=signature.CENTRAL_DIRECTORY_END+\"\\x00\\x00\"+\"\\x00\\x00\"+decToHex(zipData.length,2)+decToHex(zipData.length,2)+decToHex(centralDirLength,4)+decToHex(localDirLength,4)+decToHex(utfEncodedComment.length,2)+utfEncodedComment;var typeName=options.type.toLowerCase();if(typeName===\"uint8array\"||typeName===\"arraybuffer\"||typeName===\"blob\"||typeName===\"nodebuffer\"){writer=new Uint8ArrayWriter(localDirLength+centralDirLength+dirEnd.length)}else{writer=new StringWriter(localDirLength+centralDirLength+dirEnd.length)}for(i=0;i<zipData.length;i++){writer.append(zipData[i].fileRecord);writer.append(zipData[i].compressedObject.compressedContent)}for(i=0;i<zipData.length;i++){writer.append(zipData[i].dirRecord)}writer.append(dirEnd);var zip=writer.finalize();switch(options.type.toLowerCase()){case\"uint8array\":case\"arraybuffer\":case\"nodebuffer\":return utils.transformTo(options.type.toLowerCase(),zip);case\"blob\":return utils.arrayBuffer2Blob(utils.transformTo(\"arraybuffer\",zip));case\"base64\":return options.base64?base64.encode(zip):zip;default:return zip}},crc32:function(input,crc){return crc32(input,crc)},utf8encode:function(string){return utils.transformTo(\"string\",utf8.utf8encode(string))},utf8decode:function(input){return utf8.utf8decode(input)}};module.exports=out},{\"./base64\":1,\"./compressedObject\":2,\"./compressions\":3,\"./crc32\":4,\"./defaults\":6,\"./nodeBuffer\":11,\"./signature\":14,\"./stringWriter\":16,\"./support\":17,\"./uint8ArrayWriter\":19,\"./utf8\":20,\"./utils\":21}],14:[function(_dereq_,module,exports){\"use strict\";exports.LOCAL_FILE_HEADER=\"PK\u0003\u0004\";exports.CENTRAL_FILE_HEADER=\"PK\u0001\u0002\";exports.CENTRAL_DIRECTORY_END=\"PK\u0005\u0006\";exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR=\"PK\u0006\u0007\";exports.ZIP64_CENTRAL_DIRECTORY_END=\"PK\u0006\u0006\";exports.DATA_DESCRIPTOR=\"PK\u0007\\b\"},{}],15:[function(_dereq_,module,exports){\"use strict\";var DataReader=_dereq_(\"./dataReader\");var utils=_dereq_(\"./utils\");function StringReader(data,optimizedBinaryString){this.data=data;if(!optimizedBinaryString){this.data=utils.string2binary(this.data)}this.length=this.data.length;this.index=0}StringReader.prototype=new DataReader;StringReader.prototype.byteAt=function(i){return this.data.charCodeAt(i)};StringReader.prototype.lastIndexOfSignature=function(sig){return this.data.lastIndexOf(sig)};StringReader.prototype.readData=function(size){this.checkOffset(size);var result=this.data.slice(this.index,this.index+size);this.index+=size;return result};module.exports=StringReader},{\"./dataReader\":5,\"./utils\":21}],16:[function(_dereq_,module,exports){\"use strict\";var utils=_dereq_(\"./utils\");var StringWriter=function(){this.data=[]};StringWriter.prototype={append:function(input){input=utils.transformTo(\"string\",input);this.data.push(input)},finalize:function(){return this.data.join(\"\")}};module.exports=StringWriter},{\"./utils\":21}],17:[function(_dereq_,module,exports){(function(Buffer){\"use strict\";exports.base64=true;exports.array=true;exports.string=true;exports.arraybuffer=typeof ArrayBuffer!==\"undefined\"&&typeof Uint8Array!==\"undefined\";exports.nodebuffer=typeof Buffer!==\"undefined\";exports.uint8array=typeof Uint8Array!==\"undefined\";if(typeof ArrayBuffer===\"undefined\"){exports.blob=false}else{var buffer=new ArrayBuffer(0);try{exports.blob=new Blob([buffer],{type:\"application/zip\"}).size===0}catch(e){try{var Builder=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder;var builder=new Builder;builder.append(buffer);exports.blob=builder.getBlob(\"application/zip\").size===0}catch(e){exports.blob=false}}}}).call(this,typeof Buffer!==\"undefined\"?Buffer:undefined)},{}],18:[function(_dereq_,module,exports){\"use strict\";var DataReader=_dereq_(\"./dataReader\");function Uint8ArrayReader(data){if(data){this.data=data;this.length=this.data.length;this.index=0}}Uint8ArrayReader.prototype=new DataReader;Uint8ArrayReader.prototype.byteAt=function(i){return this.data[i]};Uint8ArrayReader.prototype.lastIndexOfSignature=function(sig){var sig0=sig.charCodeAt(0),sig1=sig.charCodeAt(1),sig2=sig.charCodeAt(2),sig3=sig.charCodeAt(3);for(var i=this.length-4;i>=0;--i){if(this.data[i]===sig0&&this.data[i+1]===sig1&&this.data[i+2]===sig2&&this.data[i+3]===sig3){return i}}return-1};Uint8ArrayReader.prototype.readData=function(size){this.checkOffset(size);if(size===0){return new Uint8Array(0)}var result=this.data.subarray(this.index,this.index+size);this.index+=size;return result};module.exports=Uint8ArrayReader},{\"./dataReader\":5}],19:[function(_dereq_,module,exports){\"use strict\";var utils=_dereq_(\"./utils\");var Uint8ArrayWriter=function(length){this.data=new Uint8Array(length);this.index=0};Uint8ArrayWriter.prototype={append:function(input){if(input.length!==0){input=utils.transformTo(\"uint8array\",input);this.data.set(input,this.index);this.index+=input.length}},finalize:function(){return this.data}};module.exports=Uint8ArrayWriter},{\"./utils\":21}],20:[function(_dereq_,module,exports){\"use strict\";var utils=_dereq_(\"./utils\");var support=_dereq_(\"./support\");var nodeBuffer=_dereq_(\"./nodeBuffer\");var _utf8len=new Array(256);for(var i=0;i<256;i++){_utf8len[i]=i>=252?6:i>=248?5:i>=240?4:i>=224?3:i>=192?2:1}_utf8len[254]=_utf8len[254]=1;var string2buf=function(str){var buf,c,c2,m_pos,i,str_len=str.length,buf_len=0;for(m_pos=0;m_pos<str_len;m_pos++){c=str.charCodeAt(m_pos);if((c&64512)===55296&&m_pos+1<str_len){c2=str.charCodeAt(m_pos+1);if((c2&64512)===56320){c=65536+(c-55296<<10)+(c2-56320);m_pos++}}buf_len+=c<128?1:c<2048?2:c<65536?3:4}if(support.uint8array){buf=new Uint8Array(buf_len)}else{buf=new Array(buf_len)}for(i=0,m_pos=0;i<buf_len;m_pos++){c=str.charCodeAt(m_pos);if((c&64512)===55296&&m_pos+1<str_len){c2=str.charCodeAt(m_pos+1);if((c2&64512)===56320){c=65536+(c-55296<<10)+(c2-56320);m_pos++}}if(c<128){buf[i++]=c}else if(c<2048){buf[i++]=192|c>>>6;buf[i++]=128|c&63}else if(c<65536){buf[i++]=224|c>>>12;buf[i++]=128|c>>>6&63;buf[i++]=128|c&63}else{buf[i++]=240|c>>>18;buf[i++]=128|c>>>12&63;buf[i++]=128|c>>>6&63;buf[i++]=128|c&63}}return buf};var utf8border=function(buf,max){var pos;max=max||buf.length;if(max>buf.length){max=buf.length}pos=max-1;while(pos>=0&&(buf[pos]&192)===128){pos--}if(pos<0){return max}if(pos===0){return max}return pos+_utf8len[buf[pos]]>max?pos:max};var buf2string=function(buf){var str,i,out,c,c_len;var len=buf.length;var utf16buf=new Array(len*2);for(out=0,i=0;i<len;){c=buf[i++];if(c<128){utf16buf[out++]=c;continue}c_len=_utf8len[c];if(c_len>4){utf16buf[out++]=65533;i+=c_len-1;continue}c&=c_len===2?31:c_len===3?15:7;while(c_len>1&&i<len){c=c<<6|buf[i++]&63;c_len--}if(c_len>1){utf16buf[out++]=65533;continue}if(c<65536){utf16buf[out++]=c}else{c-=65536;utf16buf[out++]=55296|c>>10&1023;utf16buf[out++]=56320|c&1023}}if(utf16buf.length!==out){if(utf16buf.subarray){utf16buf=utf16buf.subarray(0,out)}else{utf16buf.length=out}}return utils.applyFromCharCode(utf16buf)};exports.utf8encode=function utf8encode(str){if(support.nodebuffer){return nodeBuffer(str,\"utf-8\")}return string2buf(str)};exports.utf8decode=function utf8decode(buf){if(support.nodebuffer){return utils.transformTo(\"nodebuffer\",buf).toString(\"utf-8\")}buf=utils.transformTo(support.uint8array?\"uint8array\":\"array\",buf);var result=[],k=0,len=buf.length,chunk=65536;while(k<len){var nextBoundary=utf8border(buf,Math.min(k+chunk,len));if(support.uint8array){result.push(buf2string(buf.subarray(k,nextBoundary)))}else{result.push(buf2string(buf.slice(k,nextBoundary)))}k=nextBoundary}return result.join(\"\")}},{\"./nodeBuffer\":11,\"./support\":17,\"./utils\":21}],21:[function(_dereq_,module,exports){\"use strict\";var support=_dereq_(\"./support\");var compressions=_dereq_(\"./compressions\");var nodeBuffer=_dereq_(\"./nodeBuffer\");exports.string2binary=function(str){var result=\"\";for(var i=0;i<str.length;i++){result+=String.fromCharCode(str.charCodeAt(i)&255)}return result};exports.arrayBuffer2Blob=function(buffer){exports.checkSupport(\"blob\");try{return new Blob([buffer],{type:\"application/zip\"})}catch(e){try{var Builder=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder;var builder=new Builder;builder.append(buffer);return builder.getBlob(\"application/zip\")}catch(e){throw new Error(\"Bug : can't construct the Blob.\")}}};function identity(input){return input}function stringToArrayLike(str,array){for(var i=0;i<str.length;++i){array[i]=str.charCodeAt(i)&255}return array}function arrayLikeToString(array){var chunk=65536;var result=[],len=array.length,type=exports.getTypeOf(array),k=0,canUseApply=true;try{switch(type){case\"uint8array\":String.fromCharCode.apply(null,new Uint8Array(0));break;case\"nodebuffer\":String.fromCharCode.apply(null,nodeBuffer(0));break}}catch(e){canUseApply=false}if(!canUseApply){var resultStr=\"\";for(var i=0;i<array.length;i++){resultStr+=String.fromCharCode(array[i])}return resultStr}while(k<len&&chunk>1){try{if(type===\"array\"||type===\"nodebuffer\"){result.push(String.fromCharCode.apply(null,array.slice(k,Math.min(k+chunk,len))))}else{result.push(String.fromCharCode.apply(null,array.subarray(k,Math.min(k+chunk,len))))}k+=chunk}catch(e){chunk=Math.floor(chunk/2)}}return result.join(\"\")}exports.applyFromCharCode=arrayLikeToString;function arrayLikeToArrayLike(arrayFrom,arrayTo){for(var i=0;i<arrayFrom.length;i++){arrayTo[i]=arrayFrom[i]}return arrayTo}var transform={};transform[\"string\"]={string:identity,array:function(input){return stringToArrayLike(input,new Array(input.length))},arraybuffer:function(input){return transform[\"string\"][\"uint8array\"](input).buffer},uint8array:function(input){return stringToArrayLike(input,new Uint8Array(input.length))},nodebuffer:function(input){return stringToArrayLike(input,nodeBuffer(input.length))}};transform[\"array\"]={string:arrayLikeToString,array:identity,arraybuffer:function(input){return new Uint8Array(input).buffer},uint8array:function(input){return new Uint8Array(input)},nodebuffer:function(input){return nodeBuffer(input)}};transform[\"arraybuffer\"]={string:function(input){return arrayLikeToString(new Uint8Array(input))},array:function(input){return arrayLikeToArrayLike(new Uint8Array(input),new Array(input.byteLength))},arraybuffer:identity,uint8array:function(input){return new Uint8Array(input)},nodebuffer:function(input){return nodeBuffer(new Uint8Array(input))}};transform[\"uint8array\"]={string:arrayLikeToString,array:function(input){return arrayLikeToArrayLike(input,new Array(input.length))},arraybuffer:function(input){return input.buffer},uint8array:identity,nodebuffer:function(input){return nodeBuffer(input)}};transform[\"nodebuffer\"]={string:arrayLikeToString,array:function(input){return arrayLikeToArrayLike(input,new Array(input.length))},arraybuffer:function(input){return transform[\"nodebuffer\"][\"uint8array\"](input).buffer},uint8array:function(input){return arrayLikeToArrayLike(input,new Uint8Array(input.length))},nodebuffer:identity};exports.transformTo=function(outputType,input){if(!input){input=\"\"}if(!outputType){return input}exports.checkSupport(outputType);var inputType=exports.getTypeOf(input);var result=transform[inputType][outputType](input);return result};exports.getTypeOf=function(input){if(typeof input===\"string\"){return\"string\"}if(Object.prototype.toString.call(input)===\"[object Array]\"){return\"array\"}if(support.nodebuffer&&nodeBuffer.test(input)){return\"nodebuffer\"}if(support.uint8array&&input instanceof Uint8Array){return\"uint8array\"}if(support.arraybuffer&&input instanceof ArrayBuffer){return\"arraybuffer\"}};exports.checkSupport=function(type){var supported=support[type.toLowerCase()];if(!supported){throw new Error(type+\" is not supported by this browser\")}};exports.MAX_VALUE_16BITS=65535;exports.MAX_VALUE_32BITS=-1;exports.pretty=function(str){var res=\"\",code,i;for(i=0;i<(str||\"\").length;i++){code=str.charCodeAt(i);res+=\"\\\\x\"+(code<16?\"0\":\"\")+code.toString(16).toUpperCase();\n}return res};exports.findCompression=function(compressionMethod){for(var method in compressions){if(!compressions.hasOwnProperty(method)){continue}if(compressions[method].magic===compressionMethod){return compressions[method]}}return null};exports.isRegExp=function(object){return Object.prototype.toString.call(object)===\"[object RegExp]\"}},{\"./compressions\":3,\"./nodeBuffer\":11,\"./support\":17}],22:[function(_dereq_,module,exports){\"use strict\";var StringReader=_dereq_(\"./stringReader\");var NodeBufferReader=_dereq_(\"./nodeBufferReader\");var Uint8ArrayReader=_dereq_(\"./uint8ArrayReader\");var utils=_dereq_(\"./utils\");var sig=_dereq_(\"./signature\");var ZipEntry=_dereq_(\"./zipEntry\");var support=_dereq_(\"./support\");var jszipProto=_dereq_(\"./object\");function ZipEntries(data,loadOptions){this.files=[];this.loadOptions=loadOptions;if(data){this.load(data)}}ZipEntries.prototype={checkSignature:function(expectedSignature){var signature=this.reader.readString(4);if(signature!==expectedSignature){throw new Error(\"Corrupted zip or bug : unexpected signature \"+\"(\"+utils.pretty(signature)+\", expected \"+utils.pretty(expectedSignature)+\")\")}},readBlockEndOfCentral:function(){this.diskNumber=this.reader.readInt(2);this.diskWithCentralDirStart=this.reader.readInt(2);this.centralDirRecordsOnThisDisk=this.reader.readInt(2);this.centralDirRecords=this.reader.readInt(2);this.centralDirSize=this.reader.readInt(4);this.centralDirOffset=this.reader.readInt(4);this.zipCommentLength=this.reader.readInt(2);this.zipComment=this.reader.readString(this.zipCommentLength);this.zipComment=jszipProto.utf8decode(this.zipComment)},readBlockZip64EndOfCentral:function(){this.zip64EndOfCentralSize=this.reader.readInt(8);this.versionMadeBy=this.reader.readString(2);this.versionNeeded=this.reader.readInt(2);this.diskNumber=this.reader.readInt(4);this.diskWithCentralDirStart=this.reader.readInt(4);this.centralDirRecordsOnThisDisk=this.reader.readInt(8);this.centralDirRecords=this.reader.readInt(8);this.centralDirSize=this.reader.readInt(8);this.centralDirOffset=this.reader.readInt(8);this.zip64ExtensibleData={};var extraDataSize=this.zip64EndOfCentralSize-44,index=0,extraFieldId,extraFieldLength,extraFieldValue;while(index<extraDataSize){extraFieldId=this.reader.readInt(2);extraFieldLength=this.reader.readInt(4);extraFieldValue=this.reader.readString(extraFieldLength);this.zip64ExtensibleData[extraFieldId]={id:extraFieldId,length:extraFieldLength,value:extraFieldValue}}},readBlockZip64EndOfCentralLocator:function(){this.diskWithZip64CentralDirStart=this.reader.readInt(4);this.relativeOffsetEndOfZip64CentralDir=this.reader.readInt(8);this.disksCount=this.reader.readInt(4);if(this.disksCount>1){throw new Error(\"Multi-volumes zip are not supported\")}},readLocalFiles:function(){var i,file;for(i=0;i<this.files.length;i++){file=this.files[i];this.reader.setIndex(file.localHeaderOffset);this.checkSignature(sig.LOCAL_FILE_HEADER);file.readLocalPart(this.reader);file.handleUTF8()}},readCentralDir:function(){var file;this.reader.setIndex(this.centralDirOffset);while(this.reader.readString(4)===sig.CENTRAL_FILE_HEADER){file=new ZipEntry({zip64:this.zip64},this.loadOptions);file.readCentralPart(this.reader);this.files.push(file)}},readEndOfCentral:function(){var offset=this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);if(offset===-1){throw new Error(\"Corrupted zip : can't find end of central directory\")}this.reader.setIndex(offset);this.checkSignature(sig.CENTRAL_DIRECTORY_END);this.readBlockEndOfCentral();if(this.diskNumber===utils.MAX_VALUE_16BITS||this.diskWithCentralDirStart===utils.MAX_VALUE_16BITS||this.centralDirRecordsOnThisDisk===utils.MAX_VALUE_16BITS||this.centralDirRecords===utils.MAX_VALUE_16BITS||this.centralDirSize===utils.MAX_VALUE_32BITS||this.centralDirOffset===utils.MAX_VALUE_32BITS){this.zip64=true;offset=this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);if(offset===-1){throw new Error(\"Corrupted zip : can't find the ZIP64 end of central directory locator\")}this.reader.setIndex(offset);this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);this.readBlockZip64EndOfCentralLocator();this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);this.readBlockZip64EndOfCentral()}},prepareReader:function(data){var type=utils.getTypeOf(data);if(type===\"string\"&&!support.uint8array){this.reader=new StringReader(data,this.loadOptions.optimizedBinaryString)}else if(type===\"nodebuffer\"){this.reader=new NodeBufferReader(data)}else{this.reader=new Uint8ArrayReader(utils.transformTo(\"uint8array\",data))}},load:function(data){this.prepareReader(data);this.readEndOfCentral();this.readCentralDir();this.readLocalFiles()}};module.exports=ZipEntries},{\"./nodeBufferReader\":12,\"./object\":13,\"./signature\":14,\"./stringReader\":15,\"./support\":17,\"./uint8ArrayReader\":18,\"./utils\":21,\"./zipEntry\":23}],23:[function(_dereq_,module,exports){\"use strict\";var StringReader=_dereq_(\"./stringReader\");var utils=_dereq_(\"./utils\");var CompressedObject=_dereq_(\"./compressedObject\");var jszipProto=_dereq_(\"./object\");function ZipEntry(options,loadOptions){this.options=options;this.loadOptions=loadOptions}ZipEntry.prototype={isEncrypted:function(){return(this.bitFlag&1)===1},useUTF8:function(){return(this.bitFlag&2048)===2048},prepareCompressedContent:function(reader,from,length){return function(){var previousIndex=reader.index;reader.setIndex(from);var compressedFileData=reader.readData(length);reader.setIndex(previousIndex);return compressedFileData}},prepareContent:function(reader,from,length,compression,uncompressedSize){return function(){var compressedFileData=utils.transformTo(compression.uncompressInputType,this.getCompressedContent());var uncompressedFileData=compression.uncompress(compressedFileData);if(uncompressedFileData.length!==uncompressedSize){throw new Error(\"Bug : uncompressed data size mismatch\")}return uncompressedFileData}},readLocalPart:function(reader){var compression,localExtraFieldsLength;reader.skip(22);this.fileNameLength=reader.readInt(2);localExtraFieldsLength=reader.readInt(2);this.fileName=reader.readString(this.fileNameLength);reader.skip(localExtraFieldsLength);if(this.compressedSize==-1||this.uncompressedSize==-1){throw new Error(\"Bug or corrupted zip : didn't get enough informations from the central directory \"+\"(compressedSize == -1 || uncompressedSize == -1)\")}compression=utils.findCompression(this.compressionMethod);if(compression===null){throw new Error(\"Corrupted zip : compression \"+utils.pretty(this.compressionMethod)+\" unknown (inner file : \"+this.fileName+\")\")}this.decompressed=new CompressedObject;this.decompressed.compressedSize=this.compressedSize;this.decompressed.uncompressedSize=this.uncompressedSize;this.decompressed.crc32=this.crc32;this.decompressed.compressionMethod=this.compressionMethod;this.decompressed.getCompressedContent=this.prepareCompressedContent(reader,reader.index,this.compressedSize,compression);this.decompressed.getContent=this.prepareContent(reader,reader.index,this.compressedSize,compression,this.uncompressedSize);if(this.loadOptions.checkCRC32){this.decompressed=utils.transformTo(\"string\",this.decompressed.getContent());if(jszipProto.crc32(this.decompressed)!==this.crc32){throw new Error(\"Corrupted zip : CRC32 mismatch\")}}},readCentralPart:function(reader){this.versionMadeBy=reader.readString(2);this.versionNeeded=reader.readInt(2);this.bitFlag=reader.readInt(2);this.compressionMethod=reader.readString(2);this.date=reader.readDate();this.crc32=reader.readInt(4);this.compressedSize=reader.readInt(4);this.uncompressedSize=reader.readInt(4);this.fileNameLength=reader.readInt(2);this.extraFieldsLength=reader.readInt(2);this.fileCommentLength=reader.readInt(2);this.diskNumberStart=reader.readInt(2);this.internalFileAttributes=reader.readInt(2);this.externalFileAttributes=reader.readInt(4);this.localHeaderOffset=reader.readInt(4);if(this.isEncrypted()){throw new Error(\"Encrypted zip are not supported\")}this.fileName=reader.readString(this.fileNameLength);this.readExtraFields(reader);this.parseZIP64ExtraField(reader);this.fileComment=reader.readString(this.fileCommentLength);this.dir=this.externalFileAttributes&16?true:false},parseZIP64ExtraField:function(reader){if(!this.extraFields[1]){return}var extraReader=new StringReader(this.extraFields[1].value);if(this.uncompressedSize===utils.MAX_VALUE_32BITS){this.uncompressedSize=extraReader.readInt(8)}if(this.compressedSize===utils.MAX_VALUE_32BITS){this.compressedSize=extraReader.readInt(8)}if(this.localHeaderOffset===utils.MAX_VALUE_32BITS){this.localHeaderOffset=extraReader.readInt(8)}if(this.diskNumberStart===utils.MAX_VALUE_32BITS){this.diskNumberStart=extraReader.readInt(4)}},readExtraFields:function(reader){var start=reader.index,extraFieldId,extraFieldLength,extraFieldValue;this.extraFields=this.extraFields||{};while(reader.index<start+this.extraFieldsLength){extraFieldId=reader.readInt(2);extraFieldLength=reader.readInt(2);extraFieldValue=reader.readString(extraFieldLength);this.extraFields[extraFieldId]={id:extraFieldId,length:extraFieldLength,value:extraFieldValue}}},handleUTF8:function(){if(this.useUTF8()){this.fileName=jszipProto.utf8decode(this.fileName);this.fileComment=jszipProto.utf8decode(this.fileComment)}else{var upath=this.findExtraFieldUnicodePath();if(upath!==null){this.fileName=upath}var ucomment=this.findExtraFieldUnicodeComment();if(ucomment!==null){this.fileComment=ucomment}}},findExtraFieldUnicodePath:function(){var upathField=this.extraFields[28789];if(upathField){var extraReader=new StringReader(upathField.value);if(extraReader.readInt(1)!==1){return null}if(jszipProto.crc32(this.fileName)!==extraReader.readInt(4)){return null}return jszipProto.utf8decode(extraReader.readString(upathField.length-5))}return null},findExtraFieldUnicodeComment:function(){var ucommentField=this.extraFields[25461];if(ucommentField){var extraReader=new StringReader(ucommentField.value);if(extraReader.readInt(1)!==1){return null}if(jszipProto.crc32(this.fileComment)!==extraReader.readInt(4)){return null}return jszipProto.utf8decode(extraReader.readString(ucommentField.length-5))}return null}};module.exports=ZipEntry},{\"./compressedObject\":2,\"./object\":13,\"./stringReader\":15,\"./utils\":21}],24:[function(_dereq_,module,exports){\"use strict\";var assign=_dereq_(\"./lib/utils/common\").assign;var deflate=_dereq_(\"./lib/deflate\");var inflate=_dereq_(\"./lib/inflate\");var constants=_dereq_(\"./lib/zlib/constants\");var pako={};assign(pako,deflate,inflate,constants);module.exports=pako},{\"./lib/deflate\":25,\"./lib/inflate\":26,\"./lib/utils/common\":27,\"./lib/zlib/constants\":30}],25:[function(_dereq_,module,exports){\"use strict\";var zlib_deflate=_dereq_(\"./zlib/deflate.js\");var utils=_dereq_(\"./utils/common\");var strings=_dereq_(\"./utils/strings\");var msg=_dereq_(\"./zlib/messages\");var zstream=_dereq_(\"./zlib/zstream\");var Z_NO_FLUSH=0;var Z_FINISH=4;var Z_OK=0;var Z_STREAM_END=1;var Z_DEFAULT_COMPRESSION=-1;var Z_DEFAULT_STRATEGY=0;var Z_DEFLATED=8;var Deflate=function(options){this.options=utils.assign({level:Z_DEFAULT_COMPRESSION,method:Z_DEFLATED,chunkSize:16384,windowBits:15,memLevel:8,strategy:Z_DEFAULT_STRATEGY,to:\"\"},options||{});var opt=this.options;if(opt.raw&&opt.windowBits>0){opt.windowBits=-opt.windowBits}else if(opt.gzip&&opt.windowBits>0&&opt.windowBits<16){opt.windowBits+=16}this.err=0;this.msg=\"\";this.ended=false;this.chunks=[];this.strm=new zstream;this.strm.avail_out=0;var status=zlib_deflate.deflateInit2(this.strm,opt.level,opt.method,opt.windowBits,opt.memLevel,opt.strategy);if(status!==Z_OK){throw new Error(msg[status])}if(opt.header){zlib_deflate.deflateSetHeader(this.strm,opt.header)}};Deflate.prototype.push=function(data,mode){var strm=this.strm;var chunkSize=this.options.chunkSize;var status,_mode;if(this.ended){return false}_mode=mode===~~mode?mode:mode===true?Z_FINISH:Z_NO_FLUSH;if(typeof data===\"string\"){strm.input=strings.string2buf(data)}else{strm.input=data}strm.next_in=0;strm.avail_in=strm.input.length;do{if(strm.avail_out===0){strm.output=new utils.Buf8(chunkSize);strm.next_out=0;strm.avail_out=chunkSize}status=zlib_deflate.deflate(strm,_mode);if(status!==Z_STREAM_END&&status!==Z_OK){this.onEnd(status);this.ended=true;return false}if(strm.avail_out===0||strm.avail_in===0&&_mode===Z_FINISH){if(this.options.to===\"string\"){this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output,strm.next_out)))}else{this.onData(utils.shrinkBuf(strm.output,strm.next_out))}}}while((strm.avail_in>0||strm.avail_out===0)&&status!==Z_STREAM_END);if(_mode===Z_FINISH){status=zlib_deflate.deflateEnd(this.strm);this.onEnd(status);this.ended=true;return status===Z_OK}return true};Deflate.prototype.onData=function(chunk){this.chunks.push(chunk)};Deflate.prototype.onEnd=function(status){if(status===Z_OK){if(this.options.to===\"string\"){this.result=this.chunks.join(\"\")}else{this.result=utils.flattenChunks(this.chunks)}}this.chunks=[];this.err=status;this.msg=this.strm.msg};function deflate(input,options){var deflator=new Deflate(options);deflator.push(input,true);if(deflator.err){throw deflator.msg}return deflator.result}function deflateRaw(input,options){options=options||{};options.raw=true;return deflate(input,options)}function gzip(input,options){options=options||{};options.gzip=true;return deflate(input,options)}exports.Deflate=Deflate;exports.deflate=deflate;exports.deflateRaw=deflateRaw;exports.gzip=gzip},{\"./utils/common\":27,\"./utils/strings\":28,\"./zlib/deflate.js\":32,\"./zlib/messages\":37,\"./zlib/zstream\":39}],26:[function(_dereq_,module,exports){\"use strict\";var zlib_inflate=_dereq_(\"./zlib/inflate.js\");var utils=_dereq_(\"./utils/common\");var strings=_dereq_(\"./utils/strings\");var c=_dereq_(\"./zlib/constants\");var msg=_dereq_(\"./zlib/messages\");var zstream=_dereq_(\"./zlib/zstream\");var gzheader=_dereq_(\"./zlib/gzheader\");var Inflate=function(options){this.options=utils.assign({chunkSize:16384,windowBits:0,to:\"\"},options||{});var opt=this.options;if(opt.raw&&opt.windowBits>=0&&opt.windowBits<16){opt.windowBits=-opt.windowBits;if(opt.windowBits===0){opt.windowBits=-15}}if(opt.windowBits>=0&&opt.windowBits<16&&!(options&&options.windowBits)){opt.windowBits+=32}if(opt.windowBits>15&&opt.windowBits<48){if((opt.windowBits&15)===0){opt.windowBits|=15}}this.err=0;this.msg=\"\";this.ended=false;this.chunks=[];this.strm=new zstream;this.strm.avail_out=0;var status=zlib_inflate.inflateInit2(this.strm,opt.windowBits);if(status!==c.Z_OK){throw new Error(msg[status])}this.header=new gzheader;zlib_inflate.inflateGetHeader(this.strm,this.header)};Inflate.prototype.push=function(data,mode){var strm=this.strm;var chunkSize=this.options.chunkSize;var status,_mode;var next_out_utf8,tail,utf8str;if(this.ended){return false}_mode=mode===~~mode?mode:mode===true?c.Z_FINISH:c.Z_NO_FLUSH;if(typeof data===\"string\"){strm.input=strings.binstring2buf(data)}else{strm.input=data}strm.next_in=0;strm.avail_in=strm.input.length;do{if(strm.avail_out===0){strm.output=new utils.Buf8(chunkSize);strm.next_out=0;strm.avail_out=chunkSize}status=zlib_inflate.inflate(strm,c.Z_NO_FLUSH);if(status!==c.Z_STREAM_END&&status!==c.Z_OK){this.onEnd(status);this.ended=true;return false}if(strm.next_out){if(strm.avail_out===0||status===c.Z_STREAM_END||strm.avail_in===0&&_mode===c.Z_FINISH){if(this.options.to===\"string\"){next_out_utf8=strings.utf8border(strm.output,strm.next_out);tail=strm.next_out-next_out_utf8;utf8str=strings.buf2string(strm.output,next_out_utf8);strm.next_out=tail;strm.avail_out=chunkSize-tail;if(tail){utils.arraySet(strm.output,strm.output,next_out_utf8,tail,0)}this.onData(utf8str)}else{this.onData(utils.shrinkBuf(strm.output,strm.next_out))}}}}while(strm.avail_in>0&&status!==c.Z_STREAM_END);if(status===c.Z_STREAM_END){_mode=c.Z_FINISH}if(_mode===c.Z_FINISH){status=zlib_inflate.inflateEnd(this.strm);this.onEnd(status);this.ended=true;return status===c.Z_OK}return true};Inflate.prototype.onData=function(chunk){this.chunks.push(chunk)};Inflate.prototype.onEnd=function(status){if(status===c.Z_OK){if(this.options.to===\"string\"){this.result=this.chunks.join(\"\")}else{this.result=utils.flattenChunks(this.chunks)}}this.chunks=[];this.err=status;this.msg=this.strm.msg};function inflate(input,options){var inflator=new Inflate(options);inflator.push(input,true);if(inflator.err){throw inflator.msg}return inflator.result}function inflateRaw(input,options){options=options||{};options.raw=true;return inflate(input,options)}exports.Inflate=Inflate;exports.inflate=inflate;exports.inflateRaw=inflateRaw;exports.ungzip=inflate},{\"./utils/common\":27,\"./utils/strings\":28,\"./zlib/constants\":30,\"./zlib/gzheader\":33,\"./zlib/inflate.js\":35,\"./zlib/messages\":37,\"./zlib/zstream\":39}],27:[function(_dereq_,module,exports){\"use strict\";var TYPED_OK=typeof Uint8Array!==\"undefined\"&&typeof Uint16Array!==\"undefined\"&&typeof Int32Array!==\"undefined\";exports.assign=function(obj){var sources=Array.prototype.slice.call(arguments,1);while(sources.length){var source=sources.shift();if(!source){continue}if(typeof source!==\"object\"){throw new TypeError(source+\"must be non-object\")}for(var p in source){if(source.hasOwnProperty(p)){obj[p]=source[p]}}}return obj};exports.shrinkBuf=function(buf,size){if(buf.length===size){return buf}if(buf.subarray){return buf.subarray(0,size)}buf.length=size;return buf};var fnTyped={arraySet:function(dest,src,src_offs,len,dest_offs){if(src.subarray&&dest.subarray){dest.set(src.subarray(src_offs,src_offs+len),dest_offs);return}for(var i=0;i<len;i++){dest[dest_offs+i]=src[src_offs+i]}},flattenChunks:function(chunks){var i,l,len,pos,chunk,result;len=0;for(i=0,l=chunks.length;i<l;i++){len+=chunks[i].length}result=new Uint8Array(len);pos=0;for(i=0,l=chunks.length;i<l;i++){chunk=chunks[i];result.set(chunk,pos);pos+=chunk.length}return result}};var fnUntyped={arraySet:function(dest,src,src_offs,len,dest_offs){for(var i=0;i<len;i++){dest[dest_offs+i]=src[src_offs+i]}},flattenChunks:function(chunks){return[].concat.apply([],chunks)}};exports.setTyped=function(on){if(on){exports.Buf8=Uint8Array;exports.Buf16=Uint16Array;exports.Buf32=Int32Array;exports.assign(exports,fnTyped)}else{exports.Buf8=Array;exports.Buf16=Array;exports.Buf32=Array;exports.assign(exports,fnUntyped)}};exports.setTyped(TYPED_OK)},{}],28:[function(_dereq_,module,exports){\"use strict\";var utils=_dereq_(\"./common\");var STR_APPLY_OK=true;var STR_APPLY_UIA_OK=true;try{String.fromCharCode.apply(null,[0])}catch(__){STR_APPLY_OK=false}try{String.fromCharCode.apply(null,new Uint8Array(1))}catch(__){STR_APPLY_UIA_OK=false}var _utf8len=new utils.Buf8(256);for(var i=0;i<256;i++){_utf8len[i]=i>=252?6:i>=248?5:i>=240?4:i>=224?3:i>=192?2:1}_utf8len[254]=_utf8len[254]=1;exports.string2buf=function(str){var buf,c,c2,m_pos,i,str_len=str.length,buf_len=0;for(m_pos=0;m_pos<str_len;m_pos++){c=str.charCodeAt(m_pos);if((c&64512)===55296&&m_pos+1<str_len){c2=str.charCodeAt(m_pos+1);if((c2&64512)===56320){c=65536+(c-55296<<10)+(c2-56320);m_pos++}}buf_len+=c<128?1:c<2048?2:c<65536?3:4}buf=new utils.Buf8(buf_len);for(i=0,m_pos=0;i<buf_len;m_pos++){c=str.charCodeAt(m_pos);if((c&64512)===55296&&m_pos+1<str_len){c2=str.charCodeAt(m_pos+1);if((c2&64512)===56320){c=65536+(c-55296<<10)+(c2-56320);m_pos++}}if(c<128){buf[i++]=c}else if(c<2048){buf[i++]=192|c>>>6;buf[i++]=128|c&63}else if(c<65536){buf[i++]=224|c>>>12;buf[i++]=128|c>>>6&63;buf[i++]=128|c&63}else{buf[i++]=240|c>>>18;buf[i++]=128|c>>>12&63;buf[i++]=128|c>>>6&63;buf[i++]=128|c&63}}return buf};function buf2binstring(buf,len){if(len<65537){if(buf.subarray&&STR_APPLY_UIA_OK||!buf.subarray&&STR_APPLY_OK){return String.fromCharCode.apply(null,utils.shrinkBuf(buf,len))}}var result=\"\";for(var i=0;i<len;i++){result+=String.fromCharCode(buf[i])}return result}exports.buf2binstring=function(buf){return buf2binstring(buf,buf.length)};exports.binstring2buf=function(str){var buf=new utils.Buf8(str.length);for(var i=0,len=buf.length;i<len;i++){buf[i]=str.charCodeAt(i)}return buf};exports.buf2string=function(buf,max){var i,out,c,c_len;var len=max||buf.length;var utf16buf=new Array(len*2);for(out=0,i=0;i<len;){c=buf[i++];if(c<128){utf16buf[out++]=c;continue}c_len=_utf8len[c];if(c_len>4){utf16buf[out++]=65533;i+=c_len-1;continue}c&=c_len===2?31:c_len===3?15:7;while(c_len>1&&i<len){c=c<<6|buf[i++]&63;c_len--}if(c_len>1){utf16buf[out++]=65533;continue}if(c<65536){utf16buf[out++]=c}else{c-=65536;utf16buf[out++]=55296|c>>10&1023;utf16buf[out++]=56320|c&1023}}return buf2binstring(utf16buf,out)};exports.utf8border=function(buf,max){var pos;max=max||buf.length;if(max>buf.length){max=buf.length}pos=max-1;while(pos>=0&&(buf[pos]&192)===128){pos--}if(pos<0){return max}if(pos===0){return max}return pos+_utf8len[buf[pos]]>max?pos:max}},{\"./common\":27}],29:[function(_dereq_,module,exports){\"use strict\";function adler32(adler,buf,len,pos){var s1=adler&65535|0,s2=adler>>>16&65535|0,n=0;while(len!==0){n=len>2e3?2e3:len;len-=n;do{s1=s1+buf[pos++]|0;s2=s2+s1|0}while(--n);s1%=65521;s2%=65521}return s1|s2<<16|0}module.exports=adler32},{}],30:[function(_dereq_,module,exports){module.exports={Z_NO_FLUSH:0,Z_PARTIAL_FLUSH:1,Z_SYNC_FLUSH:2,Z_FULL_FLUSH:3,Z_FINISH:4,Z_BLOCK:5,Z_TREES:6,Z_OK:0,Z_STREAM_END:1,Z_NEED_DICT:2,Z_ERRNO:-1,Z_STREAM_ERROR:-2,Z_DATA_ERROR:-3,Z_BUF_ERROR:-5,Z_NO_COMPRESSION:0,Z_BEST_SPEED:1,Z_BEST_COMPRESSION:9,Z_DEFAULT_COMPRESSION:-1,Z_FILTERED:1,Z_HUFFMAN_ONLY:2,Z_RLE:3,Z_FIXED:4,Z_DEFAULT_STRATEGY:0,Z_BINARY:0,Z_TEXT:1,Z_UNKNOWN:2,Z_DEFLATED:8}},{}],31:[function(_dereq_,module,exports){\"use strict\";function makeTable(){var c,table=[];for(var n=0;n<256;n++){c=n;for(var k=0;k<8;k++){c=c&1?3988292384^c>>>1:c>>>1}table[n]=c}return table}var crcTable=makeTable();function crc32(crc,buf,len,pos){var t=crcTable,end=pos+len;crc=crc^-1;for(var i=pos;i<end;i++){crc=crc>>>8^t[(crc^buf[i])&255]}return crc^-1}module.exports=crc32},{}],32:[function(_dereq_,module,exports){\"use strict\";var utils=_dereq_(\"../utils/common\");var trees=_dereq_(\"./trees\");var adler32=_dereq_(\"./adler32\");var crc32=_dereq_(\"./crc32\");var msg=_dereq_(\"./messages\");var Z_NO_FLUSH=0;var Z_PARTIAL_FLUSH=1;var Z_FULL_FLUSH=3;var Z_FINISH=4;var Z_BLOCK=5;var Z_OK=0;var Z_STREAM_END=1;var Z_STREAM_ERROR=-2;var Z_DATA_ERROR=-3;var Z_BUF_ERROR=-5;var Z_DEFAULT_COMPRESSION=-1;var Z_FILTERED=1;var Z_HUFFMAN_ONLY=2;var Z_RLE=3;var Z_FIXED=4;var Z_DEFAULT_STRATEGY=0;var Z_UNKNOWN=2;var Z_DEFLATED=8;var MAX_MEM_LEVEL=9;var MAX_WBITS=15;var DEF_MEM_LEVEL=8;var LENGTH_CODES=29;var LITERALS=256;var L_CODES=LITERALS+1+LENGTH_CODES;var D_CODES=30;var BL_CODES=19;var HEAP_SIZE=2*L_CODES+1;var MAX_BITS=15;var MIN_MATCH=3;var MAX_MATCH=258;var MIN_LOOKAHEAD=MAX_MATCH+MIN_MATCH+1;var PRESET_DICT=32;var INIT_STATE=42;var EXTRA_STATE=69;var NAME_STATE=73;var COMMENT_STATE=91;var HCRC_STATE=103;var BUSY_STATE=113;var FINISH_STATE=666;var BS_NEED_MORE=1;var BS_BLOCK_DONE=2;var BS_FINISH_STARTED=3;var BS_FINISH_DONE=4;var OS_CODE=3;function err(strm,errorCode){strm.msg=msg[errorCode];return errorCode}function rank(f){return(f<<1)-(f>4?9:0)}function zero(buf){var len=buf.length;while(--len>=0){buf[len]=0}}function flush_pending(strm){var s=strm.state;var len=s.pending;if(len>strm.avail_out){len=strm.avail_out}if(len===0){return}utils.arraySet(strm.output,s.pending_buf,s.pending_out,len,strm.next_out);strm.next_out+=len;s.pending_out+=len;strm.total_out+=len;strm.avail_out-=len;s.pending-=len;if(s.pending===0){s.pending_out=0}}function flush_block_only(s,last){trees._tr_flush_block(s,s.block_start>=0?s.block_start:-1,s.strstart-s.block_start,last);s.block_start=s.strstart;flush_pending(s.strm)}function put_byte(s,b){s.pending_buf[s.pending++]=b}function putShortMSB(s,b){s.pending_buf[s.pending++]=b>>>8&255;s.pending_buf[s.pending++]=b&255}function read_buf(strm,buf,start,size){var len=strm.avail_in;if(len>size){len=size}if(len===0){return 0}strm.avail_in-=len;utils.arraySet(buf,strm.input,strm.next_in,len,start);if(strm.state.wrap===1){strm.adler=adler32(strm.adler,buf,len,start)}else if(strm.state.wrap===2){strm.adler=crc32(strm.adler,buf,len,start)}strm.next_in+=len;strm.total_in+=len;return len}function longest_match(s,cur_match){var chain_length=s.max_chain_length;var scan=s.strstart;var match;var len;var best_len=s.prev_length;var nice_match=s.nice_match;var limit=s.strstart>s.w_size-MIN_LOOKAHEAD?s.strstart-(s.w_size-MIN_LOOKAHEAD):0;var _win=s.window;var wmask=s.w_mask;var prev=s.prev;var strend=s.strstart+MAX_MATCH;var scan_end1=_win[scan+best_len-1];var scan_end=_win[scan+best_len];if(s.prev_length>=s.good_match){chain_length>>=2}if(nice_match>s.lookahead){nice_match=s.lookahead}do{match=cur_match;if(_win[match+best_len]!==scan_end||_win[match+best_len-1]!==scan_end1||_win[match]!==_win[scan]||_win[++match]!==_win[scan+1]){continue}scan+=2;match++;do{}while(_win[++scan]===_win[++match]&&_win[++scan]===_win[++match]&&_win[++scan]===_win[++match]&&_win[++scan]===_win[++match]&&_win[++scan]===_win[++match]&&_win[++scan]===_win[++match]&&_win[++scan]===_win[++match]&&_win[++scan]===_win[++match]&&scan<strend);len=MAX_MATCH-(strend-scan);scan=strend-MAX_MATCH;if(len>best_len){s.match_start=cur_match;best_len=len;if(len>=nice_match){break}scan_end1=_win[scan+best_len-1];scan_end=_win[scan+best_len]}}while((cur_match=prev[cur_match&wmask])>limit&&--chain_length!==0);if(best_len<=s.lookahead){return best_len}return s.lookahead}function fill_window(s){var _w_size=s.w_size;var p,n,m,more,str;do{more=s.window_size-s.lookahead-s.strstart;if(s.strstart>=_w_size+(_w_size-MIN_LOOKAHEAD)){utils.arraySet(s.window,s.window,_w_size,_w_size,0);s.match_start-=_w_size;s.strstart-=_w_size;s.block_start-=_w_size;n=s.hash_size;p=n;do{m=s.head[--p];s.head[p]=m>=_w_size?m-_w_size:0}while(--n);n=_w_size;p=n;do{m=s.prev[--p];s.prev[p]=m>=_w_size?m-_w_size:0}while(--n);more+=_w_size}if(s.strm.avail_in===0){break}n=read_buf(s.strm,s.window,s.strstart+s.lookahead,more);s.lookahead+=n;if(s.lookahead+s.insert>=MIN_MATCH){str=s.strstart-s.insert;s.ins_h=s.window[str];s.ins_h=(s.ins_h<<s.hash_shift^s.window[str+1])&s.hash_mask;while(s.insert){s.ins_h=(s.ins_h<<s.hash_shift^s.window[str+MIN_MATCH-1])&s.hash_mask;s.prev[str&s.w_mask]=s.head[s.ins_h];s.head[s.ins_h]=str;str++;s.insert--;if(s.lookahead+s.insert<MIN_MATCH){break}}}}while(s.lookahead<MIN_LOOKAHEAD&&s.strm.avail_in!==0)}function deflate_stored(s,flush){var max_block_size=65535;if(max_block_size>s.pending_buf_size-5){max_block_size=s.pending_buf_size-5}for(;;){if(s.lookahead<=1){fill_window(s);if(s.lookahead===0&&flush===Z_NO_FLUSH){return BS_NEED_MORE}if(s.lookahead===0){break}}s.strstart+=s.lookahead;s.lookahead=0;var max_start=s.block_start+max_block_size;if(s.strstart===0||s.strstart>=max_start){s.lookahead=s.strstart-max_start;s.strstart=max_start;flush_block_only(s,false);if(s.strm.avail_out===0){return BS_NEED_MORE}}if(s.strstart-s.block_start>=s.w_size-MIN_LOOKAHEAD){flush_block_only(s,false);if(s.strm.avail_out===0){return BS_NEED_MORE}}}s.insert=0;if(flush===Z_FINISH){flush_block_only(s,true);if(s.strm.avail_out===0){return BS_FINISH_STARTED}return BS_FINISH_DONE}if(s.strstart>s.block_start){flush_block_only(s,false);if(s.strm.avail_out===0){return BS_NEED_MORE}}return BS_NEED_MORE}function deflate_fast(s,flush){var hash_head;var bflush;for(;;){if(s.lookahead<MIN_LOOKAHEAD){fill_window(s);if(s.lookahead<MIN_LOOKAHEAD&&flush===Z_NO_FLUSH){return BS_NEED_MORE}if(s.lookahead===0){break}}hash_head=0;if(s.lookahead>=MIN_MATCH){s.ins_h=(s.ins_h<<s.hash_shift^s.window[s.strstart+MIN_MATCH-1])&s.hash_mask;hash_head=s.prev[s.strstart&s.w_mask]=s.head[s.ins_h];s.head[s.ins_h]=s.strstart}if(hash_head!==0&&s.strstart-hash_head<=s.w_size-MIN_LOOKAHEAD){s.match_length=longest_match(s,hash_head)}if(s.match_length>=MIN_MATCH){bflush=trees._tr_tally(s,s.strstart-s.match_start,s.match_length-MIN_MATCH);s.lookahead-=s.match_length;if(s.match_length<=s.max_lazy_match&&s.lookahead>=MIN_MATCH){s.match_length--;do{s.strstart++;s.ins_h=(s.ins_h<<s.hash_shift^s.window[s.strstart+MIN_MATCH-1])&s.hash_mask;hash_head=s.prev[s.strstart&s.w_mask]=s.head[s.ins_h];s.head[s.ins_h]=s.strstart}while(--s.match_length!==0);s.strstart++}else{s.strstart+=s.match_length;s.match_length=0;s.ins_h=s.window[s.strstart];s.ins_h=(s.ins_h<<s.hash_shift^s.window[s.strstart+1])&s.hash_mask}}else{bflush=trees._tr_tally(s,0,s.window[s.strstart]);s.lookahead--;s.strstart++}if(bflush){flush_block_only(s,false);if(s.strm.avail_out===0){return BS_NEED_MORE}}}s.insert=s.strstart<MIN_MATCH-1?s.strstart:MIN_MATCH-1;if(flush===Z_FINISH){flush_block_only(s,true);if(s.strm.avail_out===0){return BS_FINISH_STARTED}return BS_FINISH_DONE}if(s.last_lit){flush_block_only(s,false);if(s.strm.avail_out===0){return BS_NEED_MORE}}return BS_BLOCK_DONE}function deflate_slow(s,flush){var hash_head;var bflush;var max_insert;for(;;){if(s.lookahead<MIN_LOOKAHEAD){fill_window(s);if(s.lookahead<MIN_LOOKAHEAD&&flush===Z_NO_FLUSH){return BS_NEED_MORE}if(s.lookahead===0){break}}hash_head=0;if(s.lookahead>=MIN_MATCH){s.ins_h=(s.ins_h<<s.hash_shift^s.window[s.strstart+MIN_MATCH-1])&s.hash_mask;hash_head=s.prev[s.strstart&s.w_mask]=s.head[s.ins_h];s.head[s.ins_h]=s.strstart}s.prev_length=s.match_length;s.prev_match=s.match_start;s.match_length=MIN_MATCH-1;if(hash_head!==0&&s.prev_length<s.max_lazy_match&&s.strstart-hash_head<=s.w_size-MIN_LOOKAHEAD){s.match_length=longest_match(s,hash_head);if(s.match_length<=5&&(s.strategy===Z_FILTERED||s.match_length===MIN_MATCH&&s.strstart-s.match_start>4096)){s.match_length=MIN_MATCH-1}}if(s.prev_length>=MIN_MATCH&&s.match_length<=s.prev_length){max_insert=s.strstart+s.lookahead-MIN_MATCH;bflush=trees._tr_tally(s,s.strstart-1-s.prev_match,s.prev_length-MIN_MATCH);s.lookahead-=s.prev_length-1;s.prev_length-=2;do{if(++s.strstart<=max_insert){s.ins_h=(s.ins_h<<s.hash_shift^s.window[s.strstart+MIN_MATCH-1])&s.hash_mask;hash_head=s.prev[s.strstart&s.w_mask]=s.head[s.ins_h];s.head[s.ins_h]=s.strstart}}while(--s.prev_length!==0);s.match_available=0;s.match_length=MIN_MATCH-1;s.strstart++;if(bflush){flush_block_only(s,false);if(s.strm.avail_out===0){return BS_NEED_MORE}}}else if(s.match_available){bflush=trees._tr_tally(s,0,s.window[s.strstart-1]);if(bflush){flush_block_only(s,false)}s.strstart++;s.lookahead--;if(s.strm.avail_out===0){return BS_NEED_MORE}}else{s.match_available=1;s.strstart++;s.lookahead--}}if(s.match_available){bflush=trees._tr_tally(s,0,s.window[s.strstart-1]);s.match_available=0}s.insert=s.strstart<MIN_MATCH-1?s.strstart:MIN_MATCH-1;if(flush===Z_FINISH){flush_block_only(s,true);if(s.strm.avail_out===0){return BS_FINISH_STARTED}return BS_FINISH_DONE}if(s.last_lit){flush_block_only(s,false);if(s.strm.avail_out===0){return BS_NEED_MORE}}return BS_BLOCK_DONE}function deflate_rle(s,flush){var bflush;var prev;var scan,strend;var _win=s.window;for(;;){if(s.lookahead<=MAX_MATCH){fill_window(s);if(s.lookahead<=MAX_MATCH&&flush===Z_NO_FLUSH){return BS_NEED_MORE}if(s.lookahead===0){break}}s.match_length=0;if(s.lookahead>=MIN_MATCH&&s.strstart>0){scan=s.strstart-1;prev=_win[scan];if(prev===_win[++scan]&&prev===_win[++scan]&&prev===_win[++scan]){strend=s.strstart+MAX_MATCH;do{}while(prev===_win[++scan]&&prev===_win[++scan]&&prev===_win[++scan]&&prev===_win[++scan]&&prev===_win[++scan]&&prev===_win[++scan]&&prev===_win[++scan]&&prev===_win[++scan]&&scan<strend);s.match_length=MAX_MATCH-(strend-scan);if(s.match_length>s.lookahead){s.match_length=s.lookahead}}}if(s.match_length>=MIN_MATCH){bflush=trees._tr_tally(s,1,s.match_length-MIN_MATCH);s.lookahead-=s.match_length;s.strstart+=s.match_length;s.match_length=0}else{bflush=trees._tr_tally(s,0,s.window[s.strstart]);s.lookahead--;s.strstart++}if(bflush){flush_block_only(s,false);if(s.strm.avail_out===0){return BS_NEED_MORE}}}s.insert=0;if(flush===Z_FINISH){flush_block_only(s,true);if(s.strm.avail_out===0){return BS_FINISH_STARTED}return BS_FINISH_DONE}if(s.last_lit){flush_block_only(s,false);if(s.strm.avail_out===0){return BS_NEED_MORE}}return BS_BLOCK_DONE}function deflate_huff(s,flush){\nvar bflush;for(;;){if(s.lookahead===0){fill_window(s);if(s.lookahead===0){if(flush===Z_NO_FLUSH){return BS_NEED_MORE}break}}s.match_length=0;bflush=trees._tr_tally(s,0,s.window[s.strstart]);s.lookahead--;s.strstart++;if(bflush){flush_block_only(s,false);if(s.strm.avail_out===0){return BS_NEED_MORE}}}s.insert=0;if(flush===Z_FINISH){flush_block_only(s,true);if(s.strm.avail_out===0){return BS_FINISH_STARTED}return BS_FINISH_DONE}if(s.last_lit){flush_block_only(s,false);if(s.strm.avail_out===0){return BS_NEED_MORE}}return BS_BLOCK_DONE}var Config=function(good_length,max_lazy,nice_length,max_chain,func){this.good_length=good_length;this.max_lazy=max_lazy;this.nice_length=nice_length;this.max_chain=max_chain;this.func=func};var configuration_table;configuration_table=[new Config(0,0,0,0,deflate_stored),new Config(4,4,8,4,deflate_fast),new Config(4,5,16,8,deflate_fast),new Config(4,6,32,32,deflate_fast),new Config(4,4,16,16,deflate_slow),new Config(8,16,32,32,deflate_slow),new Config(8,16,128,128,deflate_slow),new Config(8,32,128,256,deflate_slow),new Config(32,128,258,1024,deflate_slow),new Config(32,258,258,4096,deflate_slow)];function lm_init(s){s.window_size=2*s.w_size;zero(s.head);s.max_lazy_match=configuration_table[s.level].max_lazy;s.good_match=configuration_table[s.level].good_length;s.nice_match=configuration_table[s.level].nice_length;s.max_chain_length=configuration_table[s.level].max_chain;s.strstart=0;s.block_start=0;s.lookahead=0;s.insert=0;s.match_length=s.prev_length=MIN_MATCH-1;s.match_available=0;s.ins_h=0}function DeflateState(){this.strm=null;this.status=0;this.pending_buf=null;this.pending_buf_size=0;this.pending_out=0;this.pending=0;this.wrap=0;this.gzhead=null;this.gzindex=0;this.method=Z_DEFLATED;this.last_flush=-1;this.w_size=0;this.w_bits=0;this.w_mask=0;this.window=null;this.window_size=0;this.prev=null;this.head=null;this.ins_h=0;this.hash_size=0;this.hash_bits=0;this.hash_mask=0;this.hash_shift=0;this.block_start=0;this.match_length=0;this.prev_match=0;this.match_available=0;this.strstart=0;this.match_start=0;this.lookahead=0;this.prev_length=0;this.max_chain_length=0;this.max_lazy_match=0;this.level=0;this.strategy=0;this.good_match=0;this.nice_match=0;this.dyn_ltree=new utils.Buf16(HEAP_SIZE*2);this.dyn_dtree=new utils.Buf16((2*D_CODES+1)*2);this.bl_tree=new utils.Buf16((2*BL_CODES+1)*2);zero(this.dyn_ltree);zero(this.dyn_dtree);zero(this.bl_tree);this.l_desc=null;this.d_desc=null;this.bl_desc=null;this.bl_count=new utils.Buf16(MAX_BITS+1);this.heap=new utils.Buf16(2*L_CODES+1);zero(this.heap);this.heap_len=0;this.heap_max=0;this.depth=new utils.Buf16(2*L_CODES+1);zero(this.depth);this.l_buf=0;this.lit_bufsize=0;this.last_lit=0;this.d_buf=0;this.opt_len=0;this.static_len=0;this.matches=0;this.insert=0;this.bi_buf=0;this.bi_valid=0}function deflateResetKeep(strm){var s;if(!strm||!strm.state){return err(strm,Z_STREAM_ERROR)}strm.total_in=strm.total_out=0;strm.data_type=Z_UNKNOWN;s=strm.state;s.pending=0;s.pending_out=0;if(s.wrap<0){s.wrap=-s.wrap}s.status=s.wrap?INIT_STATE:BUSY_STATE;strm.adler=s.wrap===2?0:1;s.last_flush=Z_NO_FLUSH;trees._tr_init(s);return Z_OK}function deflateReset(strm){var ret=deflateResetKeep(strm);if(ret===Z_OK){lm_init(strm.state)}return ret}function deflateSetHeader(strm,head){if(!strm||!strm.state){return Z_STREAM_ERROR}if(strm.state.wrap!==2){return Z_STREAM_ERROR}strm.state.gzhead=head;return Z_OK}function deflateInit2(strm,level,method,windowBits,memLevel,strategy){if(!strm){return Z_STREAM_ERROR}var wrap=1;if(level===Z_DEFAULT_COMPRESSION){level=6}if(windowBits<0){wrap=0;windowBits=-windowBits}else if(windowBits>15){wrap=2;windowBits-=16}if(memLevel<1||memLevel>MAX_MEM_LEVEL||method!==Z_DEFLATED||windowBits<8||windowBits>15||level<0||level>9||strategy<0||strategy>Z_FIXED){return err(strm,Z_STREAM_ERROR)}if(windowBits===8){windowBits=9}var s=new DeflateState;strm.state=s;s.strm=strm;s.wrap=wrap;s.gzhead=null;s.w_bits=windowBits;s.w_size=1<<s.w_bits;s.w_mask=s.w_size-1;s.hash_bits=memLevel+7;s.hash_size=1<<s.hash_bits;s.hash_mask=s.hash_size-1;s.hash_shift=~~((s.hash_bits+MIN_MATCH-1)/MIN_MATCH);s.window=new utils.Buf8(s.w_size*2);s.head=new utils.Buf16(s.hash_size);s.prev=new utils.Buf16(s.w_size);s.lit_bufsize=1<<memLevel+6;s.pending_buf_size=s.lit_bufsize*4;s.pending_buf=new utils.Buf8(s.pending_buf_size);s.d_buf=s.lit_bufsize>>1;s.l_buf=(1+2)*s.lit_bufsize;s.level=level;s.strategy=strategy;s.method=method;return deflateReset(strm)}function deflateInit(strm,level){return deflateInit2(strm,level,Z_DEFLATED,MAX_WBITS,DEF_MEM_LEVEL,Z_DEFAULT_STRATEGY)}function deflate(strm,flush){var old_flush,s;var beg,val;if(!strm||!strm.state||flush>Z_BLOCK||flush<0){return strm?err(strm,Z_STREAM_ERROR):Z_STREAM_ERROR}s=strm.state;if(!strm.output||!strm.input&&strm.avail_in!==0||s.status===FINISH_STATE&&flush!==Z_FINISH){return err(strm,strm.avail_out===0?Z_BUF_ERROR:Z_STREAM_ERROR)}s.strm=strm;old_flush=s.last_flush;s.last_flush=flush;if(s.status===INIT_STATE){if(s.wrap===2){strm.adler=0;put_byte(s,31);put_byte(s,139);put_byte(s,8);if(!s.gzhead){put_byte(s,0);put_byte(s,0);put_byte(s,0);put_byte(s,0);put_byte(s,0);put_byte(s,s.level===9?2:s.strategy>=Z_HUFFMAN_ONLY||s.level<2?4:0);put_byte(s,OS_CODE);s.status=BUSY_STATE}else{put_byte(s,(s.gzhead.text?1:0)+(s.gzhead.hcrc?2:0)+(!s.gzhead.extra?0:4)+(!s.gzhead.name?0:8)+(!s.gzhead.comment?0:16));put_byte(s,s.gzhead.time&255);put_byte(s,s.gzhead.time>>8&255);put_byte(s,s.gzhead.time>>16&255);put_byte(s,s.gzhead.time>>24&255);put_byte(s,s.level===9?2:s.strategy>=Z_HUFFMAN_ONLY||s.level<2?4:0);put_byte(s,s.gzhead.os&255);if(s.gzhead.extra&&s.gzhead.extra.length){put_byte(s,s.gzhead.extra.length&255);put_byte(s,s.gzhead.extra.length>>8&255)}if(s.gzhead.hcrc){strm.adler=crc32(strm.adler,s.pending_buf,s.pending,0)}s.gzindex=0;s.status=EXTRA_STATE}}else{var header=Z_DEFLATED+(s.w_bits-8<<4)<<8;var level_flags=-1;if(s.strategy>=Z_HUFFMAN_ONLY||s.level<2){level_flags=0}else if(s.level<6){level_flags=1}else if(s.level===6){level_flags=2}else{level_flags=3}header|=level_flags<<6;if(s.strstart!==0){header|=PRESET_DICT}header+=31-header%31;s.status=BUSY_STATE;putShortMSB(s,header);if(s.strstart!==0){putShortMSB(s,strm.adler>>>16);putShortMSB(s,strm.adler&65535)}strm.adler=1}}if(s.status===EXTRA_STATE){if(s.gzhead.extra){beg=s.pending;while(s.gzindex<(s.gzhead.extra.length&65535)){if(s.pending===s.pending_buf_size){if(s.gzhead.hcrc&&s.pending>beg){strm.adler=crc32(strm.adler,s.pending_buf,s.pending-beg,beg)}flush_pending(strm);beg=s.pending;if(s.pending===s.pending_buf_size){break}}put_byte(s,s.gzhead.extra[s.gzindex]&255);s.gzindex++}if(s.gzhead.hcrc&&s.pending>beg){strm.adler=crc32(strm.adler,s.pending_buf,s.pending-beg,beg)}if(s.gzindex===s.gzhead.extra.length){s.gzindex=0;s.status=NAME_STATE}}else{s.status=NAME_STATE}}if(s.status===NAME_STATE){if(s.gzhead.name){beg=s.pending;do{if(s.pending===s.pending_buf_size){if(s.gzhead.hcrc&&s.pending>beg){strm.adler=crc32(strm.adler,s.pending_buf,s.pending-beg,beg)}flush_pending(strm);beg=s.pending;if(s.pending===s.pending_buf_size){val=1;break}}if(s.gzindex<s.gzhead.name.length){val=s.gzhead.name.charCodeAt(s.gzindex++)&255}else{val=0}put_byte(s,val)}while(val!==0);if(s.gzhead.hcrc&&s.pending>beg){strm.adler=crc32(strm.adler,s.pending_buf,s.pending-beg,beg)}if(val===0){s.gzindex=0;s.status=COMMENT_STATE}}else{s.status=COMMENT_STATE}}if(s.status===COMMENT_STATE){if(s.gzhead.comment){beg=s.pending;do{if(s.pending===s.pending_buf_size){if(s.gzhead.hcrc&&s.pending>beg){strm.adler=crc32(strm.adler,s.pending_buf,s.pending-beg,beg)}flush_pending(strm);beg=s.pending;if(s.pending===s.pending_buf_size){val=1;break}}if(s.gzindex<s.gzhead.comment.length){val=s.gzhead.comment.charCodeAt(s.gzindex++)&255}else{val=0}put_byte(s,val)}while(val!==0);if(s.gzhead.hcrc&&s.pending>beg){strm.adler=crc32(strm.adler,s.pending_buf,s.pending-beg,beg)}if(val===0){s.status=HCRC_STATE}}else{s.status=HCRC_STATE}}if(s.status===HCRC_STATE){if(s.gzhead.hcrc){if(s.pending+2>s.pending_buf_size){flush_pending(strm)}if(s.pending+2<=s.pending_buf_size){put_byte(s,strm.adler&255);put_byte(s,strm.adler>>8&255);strm.adler=0;s.status=BUSY_STATE}}else{s.status=BUSY_STATE}}if(s.pending!==0){flush_pending(strm);if(strm.avail_out===0){s.last_flush=-1;return Z_OK}}else if(strm.avail_in===0&&rank(flush)<=rank(old_flush)&&flush!==Z_FINISH){return err(strm,Z_BUF_ERROR)}if(s.status===FINISH_STATE&&strm.avail_in!==0){return err(strm,Z_BUF_ERROR)}if(strm.avail_in!==0||s.lookahead!==0||flush!==Z_NO_FLUSH&&s.status!==FINISH_STATE){var bstate=s.strategy===Z_HUFFMAN_ONLY?deflate_huff(s,flush):s.strategy===Z_RLE?deflate_rle(s,flush):configuration_table[s.level].func(s,flush);if(bstate===BS_FINISH_STARTED||bstate===BS_FINISH_DONE){s.status=FINISH_STATE}if(bstate===BS_NEED_MORE||bstate===BS_FINISH_STARTED){if(strm.avail_out===0){s.last_flush=-1}return Z_OK}if(bstate===BS_BLOCK_DONE){if(flush===Z_PARTIAL_FLUSH){trees._tr_align(s)}else if(flush!==Z_BLOCK){trees._tr_stored_block(s,0,0,false);if(flush===Z_FULL_FLUSH){zero(s.head);if(s.lookahead===0){s.strstart=0;s.block_start=0;s.insert=0}}}flush_pending(strm);if(strm.avail_out===0){s.last_flush=-1;return Z_OK}}}if(flush!==Z_FINISH){return Z_OK}if(s.wrap<=0){return Z_STREAM_END}if(s.wrap===2){put_byte(s,strm.adler&255);put_byte(s,strm.adler>>8&255);put_byte(s,strm.adler>>16&255);put_byte(s,strm.adler>>24&255);put_byte(s,strm.total_in&255);put_byte(s,strm.total_in>>8&255);put_byte(s,strm.total_in>>16&255);put_byte(s,strm.total_in>>24&255)}else{putShortMSB(s,strm.adler>>>16);putShortMSB(s,strm.adler&65535)}flush_pending(strm);if(s.wrap>0){s.wrap=-s.wrap}return s.pending!==0?Z_OK:Z_STREAM_END}function deflateEnd(strm){var status;if(!strm||!strm.state){return Z_STREAM_ERROR}status=strm.state.status;if(status!==INIT_STATE&&status!==EXTRA_STATE&&status!==NAME_STATE&&status!==COMMENT_STATE&&status!==HCRC_STATE&&status!==BUSY_STATE&&status!==FINISH_STATE){return err(strm,Z_STREAM_ERROR)}strm.state=null;return status===BUSY_STATE?err(strm,Z_DATA_ERROR):Z_OK}exports.deflateInit=deflateInit;exports.deflateInit2=deflateInit2;exports.deflateReset=deflateReset;exports.deflateResetKeep=deflateResetKeep;exports.deflateSetHeader=deflateSetHeader;exports.deflate=deflate;exports.deflateEnd=deflateEnd;exports.deflateInfo=\"pako deflate (from Nodeca project)\"},{\"../utils/common\":27,\"./adler32\":29,\"./crc32\":31,\"./messages\":37,\"./trees\":38}],33:[function(_dereq_,module,exports){\"use strict\";function GZheader(){this.text=0;this.time=0;this.xflags=0;this.os=0;this.extra=null;this.extra_len=0;this.name=\"\";this.comment=\"\";this.hcrc=0;this.done=false}module.exports=GZheader},{}],34:[function(_dereq_,module,exports){\"use strict\";var BAD=30;var TYPE=12;module.exports=function inflate_fast(strm,start){var state;var _in;var last;var _out;var beg;var end;var dmax;var wsize;var whave;var wnext;var window;var hold;var bits;var lcode;var dcode;var lmask;var dmask;var here;var op;var len;var dist;var from;var from_source;var input,output;state=strm.state;_in=strm.next_in;input=strm.input;last=_in+(strm.avail_in-5);_out=strm.next_out;output=strm.output;beg=_out-(start-strm.avail_out);end=_out+(strm.avail_out-257);dmax=state.dmax;wsize=state.wsize;whave=state.whave;wnext=state.wnext;window=state.window;hold=state.hold;bits=state.bits;lcode=state.lencode;dcode=state.distcode;lmask=(1<<state.lenbits)-1;dmask=(1<<state.distbits)-1;top:do{if(bits<15){hold+=input[_in++]<<bits;bits+=8;hold+=input[_in++]<<bits;bits+=8}here=lcode[hold&lmask];dolen:for(;;){op=here>>>24;hold>>>=op;bits-=op;op=here>>>16&255;if(op===0){output[_out++]=here&65535}else if(op&16){len=here&65535;op&=15;if(op){if(bits<op){hold+=input[_in++]<<bits;bits+=8}len+=hold&(1<<op)-1;hold>>>=op;bits-=op}if(bits<15){hold+=input[_in++]<<bits;bits+=8;hold+=input[_in++]<<bits;bits+=8}here=dcode[hold&dmask];dodist:for(;;){op=here>>>24;hold>>>=op;bits-=op;op=here>>>16&255;if(op&16){dist=here&65535;op&=15;if(bits<op){hold+=input[_in++]<<bits;bits+=8;if(bits<op){hold+=input[_in++]<<bits;bits+=8}}dist+=hold&(1<<op)-1;if(dist>dmax){strm.msg=\"invalid distance too far back\";state.mode=BAD;break top}hold>>>=op;bits-=op;op=_out-beg;if(dist>op){op=dist-op;if(op>whave){if(state.sane){strm.msg=\"invalid distance too far back\";state.mode=BAD;break top}}from=0;from_source=window;if(wnext===0){from+=wsize-op;if(op<len){len-=op;do{output[_out++]=window[from++]}while(--op);from=_out-dist;from_source=output}}else if(wnext<op){from+=wsize+wnext-op;op-=wnext;if(op<len){len-=op;do{output[_out++]=window[from++]}while(--op);from=0;if(wnext<len){op=wnext;len-=op;do{output[_out++]=window[from++]}while(--op);from=_out-dist;from_source=output}}}else{from+=wnext-op;if(op<len){len-=op;do{output[_out++]=window[from++]}while(--op);from=_out-dist;from_source=output}}while(len>2){output[_out++]=from_source[from++];output[_out++]=from_source[from++];output[_out++]=from_source[from++];len-=3}if(len){output[_out++]=from_source[from++];if(len>1){output[_out++]=from_source[from++]}}}else{from=_out-dist;do{output[_out++]=output[from++];output[_out++]=output[from++];output[_out++]=output[from++];len-=3}while(len>2);if(len){output[_out++]=output[from++];if(len>1){output[_out++]=output[from++]}}}}else if((op&64)===0){here=dcode[(here&65535)+(hold&(1<<op)-1)];continue dodist}else{strm.msg=\"invalid distance code\";state.mode=BAD;break top}break}}else if((op&64)===0){here=lcode[(here&65535)+(hold&(1<<op)-1)];continue dolen}else if(op&32){state.mode=TYPE;break top}else{strm.msg=\"invalid literal/length code\";state.mode=BAD;break top}break}}while(_in<last&&_out<end);len=bits>>3;_in-=len;bits-=len<<3;hold&=(1<<bits)-1;strm.next_in=_in;strm.next_out=_out;strm.avail_in=_in<last?5+(last-_in):5-(_in-last);strm.avail_out=_out<end?257+(end-_out):257-(_out-end);state.hold=hold;state.bits=bits;return}},{}],35:[function(_dereq_,module,exports){\"use strict\";var utils=_dereq_(\"../utils/common\");var adler32=_dereq_(\"./adler32\");var crc32=_dereq_(\"./crc32\");var inflate_fast=_dereq_(\"./inffast\");var inflate_table=_dereq_(\"./inftrees\");var CODES=0;var LENS=1;var DISTS=2;var Z_FINISH=4;var Z_BLOCK=5;var Z_TREES=6;var Z_OK=0;var Z_STREAM_END=1;var Z_NEED_DICT=2;var Z_STREAM_ERROR=-2;var Z_DATA_ERROR=-3;var Z_MEM_ERROR=-4;var Z_BUF_ERROR=-5;var Z_DEFLATED=8;var HEAD=1;var FLAGS=2;var TIME=3;var OS=4;var EXLEN=5;var EXTRA=6;var NAME=7;var COMMENT=8;var HCRC=9;var DICTID=10;var DICT=11;var TYPE=12;var TYPEDO=13;var STORED=14;var COPY_=15;var COPY=16;var TABLE=17;var LENLENS=18;var CODELENS=19;var LEN_=20;var LEN=21;var LENEXT=22;var DIST=23;var DISTEXT=24;var MATCH=25;var LIT=26;var CHECK=27;var LENGTH=28;var DONE=29;var BAD=30;var MEM=31;var SYNC=32;var ENOUGH_LENS=852;var ENOUGH_DISTS=592;var MAX_WBITS=15;var DEF_WBITS=MAX_WBITS;function ZSWAP32(q){return(q>>>24&255)+(q>>>8&65280)+((q&65280)<<8)+((q&255)<<24)}function InflateState(){this.mode=0;this.last=false;this.wrap=0;this.havedict=false;this.flags=0;this.dmax=0;this.check=0;this.total=0;this.head=null;this.wbits=0;this.wsize=0;this.whave=0;this.wnext=0;this.window=null;this.hold=0;this.bits=0;this.length=0;this.offset=0;this.extra=0;this.lencode=null;this.distcode=null;this.lenbits=0;this.distbits=0;this.ncode=0;this.nlen=0;this.ndist=0;this.have=0;this.next=null;this.lens=new utils.Buf16(320);this.work=new utils.Buf16(288);this.lendyn=null;this.distdyn=null;this.sane=0;this.back=0;this.was=0}function inflateResetKeep(strm){var state;if(!strm||!strm.state){return Z_STREAM_ERROR}state=strm.state;strm.total_in=strm.total_out=state.total=0;strm.msg=\"\";if(state.wrap){strm.adler=state.wrap&1}state.mode=HEAD;state.last=0;state.havedict=0;state.dmax=32768;state.head=null;state.hold=0;state.bits=0;state.lencode=state.lendyn=new utils.Buf32(ENOUGH_LENS);state.distcode=state.distdyn=new utils.Buf32(ENOUGH_DISTS);state.sane=1;state.back=-1;return Z_OK}function inflateReset(strm){var state;if(!strm||!strm.state){return Z_STREAM_ERROR}state=strm.state;state.wsize=0;state.whave=0;state.wnext=0;return inflateResetKeep(strm)}function inflateReset2(strm,windowBits){var wrap;var state;if(!strm||!strm.state){return Z_STREAM_ERROR}state=strm.state;if(windowBits<0){wrap=0;windowBits=-windowBits}else{wrap=(windowBits>>4)+1;if(windowBits<48){windowBits&=15}}if(windowBits&&(windowBits<8||windowBits>15)){return Z_STREAM_ERROR}if(state.window!==null&&state.wbits!==windowBits){state.window=null}state.wrap=wrap;state.wbits=windowBits;return inflateReset(strm)}function inflateInit2(strm,windowBits){var ret;var state;if(!strm){return Z_STREAM_ERROR}state=new InflateState;strm.state=state;state.window=null;ret=inflateReset2(strm,windowBits);if(ret!==Z_OK){strm.state=null}return ret}function inflateInit(strm){return inflateInit2(strm,DEF_WBITS)}var virgin=true;var lenfix,distfix;function fixedtables(state){if(virgin){var sym;lenfix=new utils.Buf32(512);distfix=new utils.Buf32(32);sym=0;while(sym<144){state.lens[sym++]=8}while(sym<256){state.lens[sym++]=9}while(sym<280){state.lens[sym++]=7}while(sym<288){state.lens[sym++]=8}inflate_table(LENS,state.lens,0,288,lenfix,0,state.work,{bits:9});sym=0;while(sym<32){state.lens[sym++]=5}inflate_table(DISTS,state.lens,0,32,distfix,0,state.work,{bits:5});virgin=false}state.lencode=lenfix;state.lenbits=9;state.distcode=distfix;state.distbits=5}function updatewindow(strm,src,end,copy){var dist;var state=strm.state;if(state.window===null){state.wsize=1<<state.wbits;state.wnext=0;state.whave=0;state.window=new utils.Buf8(state.wsize)}if(copy>=state.wsize){utils.arraySet(state.window,src,end-state.wsize,state.wsize,0);state.wnext=0;state.whave=state.wsize}else{dist=state.wsize-state.wnext;if(dist>copy){dist=copy}utils.arraySet(state.window,src,end-copy,dist,state.wnext);copy-=dist;if(copy){utils.arraySet(state.window,src,end-copy,copy,0);state.wnext=copy;state.whave=state.wsize}else{state.wnext+=dist;if(state.wnext===state.wsize){state.wnext=0}if(state.whave<state.wsize){state.whave+=dist}}}return 0}function inflate(strm,flush){var state;var input,output;var next;var put;var have,left;var hold;var bits;var _in,_out;var copy;var from;var from_source;var here=0;var here_bits,here_op,here_val;var last_bits,last_op,last_val;var len;var ret;var hbuf=new utils.Buf8(4);var opts;var n;var order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];if(!strm||!strm.state||!strm.output||!strm.input&&strm.avail_in!==0){return Z_STREAM_ERROR}state=strm.state;if(state.mode===TYPE){state.mode=TYPEDO}put=strm.next_out;output=strm.output;left=strm.avail_out;next=strm.next_in;input=strm.input;have=strm.avail_in;hold=state.hold;bits=state.bits;_in=have;_out=left;ret=Z_OK;inf_leave:for(;;){switch(state.mode){case HEAD:if(state.wrap===0){state.mode=TYPEDO;break}while(bits<16){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}if(state.wrap&2&&hold===35615){state.check=0;hbuf[0]=hold&255;hbuf[1]=hold>>>8&255;state.check=crc32(state.check,hbuf,2,0);hold=0;bits=0;state.mode=FLAGS;break}state.flags=0;if(state.head){state.head.done=false}if(!(state.wrap&1)||(((hold&255)<<8)+(hold>>8))%31){strm.msg=\"incorrect header check\";state.mode=BAD;break}if((hold&15)!==Z_DEFLATED){strm.msg=\"unknown compression method\";state.mode=BAD;break}hold>>>=4;bits-=4;len=(hold&15)+8;if(state.wbits===0){state.wbits=len}else if(len>state.wbits){strm.msg=\"invalid window size\";state.mode=BAD;break}state.dmax=1<<len;strm.adler=state.check=1;state.mode=hold&512?DICTID:TYPE;hold=0;bits=0;break;case FLAGS:while(bits<16){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}state.flags=hold;if((state.flags&255)!==Z_DEFLATED){strm.msg=\"unknown compression method\";state.mode=BAD;break}if(state.flags&57344){strm.msg=\"unknown header flags set\";state.mode=BAD;break}if(state.head){state.head.text=hold>>8&1}if(state.flags&512){hbuf[0]=hold&255;hbuf[1]=hold>>>8&255;state.check=crc32(state.check,hbuf,2,0)}hold=0;bits=0;state.mode=TIME;case TIME:while(bits<32){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}if(state.head){state.head.time=hold}if(state.flags&512){hbuf[0]=hold&255;hbuf[1]=hold>>>8&255;hbuf[2]=hold>>>16&255;hbuf[3]=hold>>>24&255;state.check=crc32(state.check,hbuf,4,0)}hold=0;bits=0;state.mode=OS;case OS:while(bits<16){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}if(state.head){state.head.xflags=hold&255;state.head.os=hold>>8}if(state.flags&512){hbuf[0]=hold&255;hbuf[1]=hold>>>8&255;state.check=crc32(state.check,hbuf,2,0)}hold=0;bits=0;state.mode=EXLEN;case EXLEN:if(state.flags&1024){while(bits<16){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}state.length=hold;if(state.head){state.head.extra_len=hold}if(state.flags&512){hbuf[0]=hold&255;hbuf[1]=hold>>>8&255;state.check=crc32(state.check,hbuf,2,0)}hold=0;bits=0}else if(state.head){state.head.extra=null}state.mode=EXTRA;case EXTRA:if(state.flags&1024){copy=state.length;if(copy>have){copy=have}if(copy){if(state.head){len=state.head.extra_len-state.length;if(!state.head.extra){state.head.extra=new Array(state.head.extra_len)}utils.arraySet(state.head.extra,input,next,copy,len)}if(state.flags&512){state.check=crc32(state.check,input,copy,next)}have-=copy;next+=copy;state.length-=copy}if(state.length){break inf_leave}}state.length=0;state.mode=NAME;case NAME:if(state.flags&2048){if(have===0){break inf_leave}copy=0;do{len=input[next+copy++];if(state.head&&len&&state.length<65536){state.head.name+=String.fromCharCode(len)}}while(len&&copy<have);if(state.flags&512){state.check=crc32(state.check,input,copy,next)}have-=copy;next+=copy;if(len){break inf_leave}}else if(state.head){state.head.name=null}state.length=0;state.mode=COMMENT;case COMMENT:if(state.flags&4096){if(have===0){break inf_leave}copy=0;do{len=input[next+copy++];if(state.head&&len&&state.length<65536){state.head.comment+=String.fromCharCode(len)}}while(len&&copy<have);if(state.flags&512){state.check=crc32(state.check,input,copy,next)}have-=copy;next+=copy;if(len){break inf_leave}}else if(state.head){state.head.comment=null}state.mode=HCRC;case HCRC:if(state.flags&512){while(bits<16){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}if(hold!==(state.check&65535)){strm.msg=\"header crc mismatch\";state.mode=BAD;break}hold=0;bits=0}if(state.head){state.head.hcrc=state.flags>>9&1;state.head.done=true}strm.adler=state.check=0;state.mode=TYPE;break;case DICTID:while(bits<32){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}strm.adler=state.check=ZSWAP32(hold);hold=0;bits=0;state.mode=DICT;case DICT:if(state.havedict===0){strm.next_out=put;strm.avail_out=left;strm.next_in=next;strm.avail_in=have;state.hold=hold;state.bits=bits;return Z_NEED_DICT}strm.adler=state.check=1;state.mode=TYPE;case TYPE:if(flush===Z_BLOCK||flush===Z_TREES){break inf_leave}case TYPEDO:if(state.last){hold>>>=bits&7;bits-=bits&7;state.mode=CHECK;break}while(bits<3){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}state.last=hold&1;hold>>>=1;bits-=1;switch(hold&3){case 0:state.mode=STORED;break;case 1:fixedtables(state);state.mode=LEN_;if(flush===Z_TREES){hold>>>=2;bits-=2;break inf_leave}break;case 2:state.mode=TABLE;break;case 3:strm.msg=\"invalid block type\";state.mode=BAD}hold>>>=2;bits-=2;break;case STORED:hold>>>=bits&7;bits-=bits&7;while(bits<32){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}if((hold&65535)!==(hold>>>16^65535)){strm.msg=\"invalid stored block lengths\";state.mode=BAD;break}state.length=hold&65535;hold=0;bits=0;state.mode=COPY_;if(flush===Z_TREES){break inf_leave}case COPY_:state.mode=COPY;case COPY:copy=state.length;if(copy){if(copy>have){copy=have}if(copy>left){copy=left}if(copy===0){break inf_leave}utils.arraySet(output,input,next,copy,put);have-=copy;next+=copy;left-=copy;put+=copy;state.length-=copy;break}state.mode=TYPE;break;case TABLE:while(bits<14){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}state.nlen=(hold&31)+257;hold>>>=5;bits-=5;state.ndist=(hold&31)+1;hold>>>=5;bits-=5;state.ncode=(hold&15)+4;hold>>>=4;bits-=4;if(state.nlen>286||state.ndist>30){strm.msg=\"too many length or distance symbols\";state.mode=BAD;break}state.have=0;state.mode=LENLENS;case LENLENS:while(state.have<state.ncode){while(bits<3){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}state.lens[order[state.have++]]=hold&7;hold>>>=3;bits-=3}while(state.have<19){state.lens[order[state.have++]]=0}state.lencode=state.lendyn;state.lenbits=7;opts={bits:state.lenbits};ret=inflate_table(CODES,state.lens,0,19,state.lencode,0,state.work,opts);state.lenbits=opts.bits;if(ret){strm.msg=\"invalid code lengths set\";state.mode=BAD;break}state.have=0;state.mode=CODELENS;case CODELENS:while(state.have<state.nlen+state.ndist){for(;;){here=state.lencode[hold&(1<<state.lenbits)-1];here_bits=here>>>24;here_op=here>>>16&255;here_val=here&65535;if(here_bits<=bits){break}if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}if(here_val<16){hold>>>=here_bits;bits-=here_bits;state.lens[state.have++]=here_val}else{if(here_val===16){n=here_bits+2;while(bits<n){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}hold>>>=here_bits;bits-=here_bits;if(state.have===0){strm.msg=\"invalid bit length repeat\";state.mode=BAD;break}len=state.lens[state.have-1];copy=3+(hold&3);hold>>>=2;bits-=2}else if(here_val===17){n=here_bits+3;while(bits<n){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}hold>>>=here_bits;bits-=here_bits;len=0;copy=3+(hold&7);hold>>>=3;bits-=3}else{n=here_bits+7;while(bits<n){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}hold>>>=here_bits;bits-=here_bits;len=0;copy=11+(hold&127);hold>>>=7;bits-=7}if(state.have+copy>state.nlen+state.ndist){strm.msg=\"invalid bit length repeat\";state.mode=BAD;break}while(copy--){state.lens[state.have++]=len}}}if(state.mode===BAD){break}if(state.lens[256]===0){strm.msg=\"invalid code -- missing end-of-block\";state.mode=BAD;break}state.lenbits=9;opts={bits:state.lenbits};ret=inflate_table(LENS,state.lens,0,state.nlen,state.lencode,0,state.work,opts);state.lenbits=opts.bits;if(ret){strm.msg=\"invalid literal/lengths set\";state.mode=BAD;break}state.distbits=6;state.distcode=state.distdyn;opts={bits:state.distbits};ret=inflate_table(DISTS,state.lens,state.nlen,state.ndist,state.distcode,0,state.work,opts);state.distbits=opts.bits;if(ret){strm.msg=\"invalid distances set\";state.mode=BAD;break}state.mode=LEN_;if(flush===Z_TREES){break inf_leave}case LEN_:state.mode=LEN;case LEN:if(have>=6&&left>=258){strm.next_out=put;strm.avail_out=left;strm.next_in=next;strm.avail_in=have;state.hold=hold;state.bits=bits;inflate_fast(strm,_out);put=strm.next_out;output=strm.output;left=strm.avail_out;next=strm.next_in;input=strm.input;have=strm.avail_in;hold=state.hold;bits=state.bits;if(state.mode===TYPE){state.back=-1}break}state.back=0;for(;;){here=state.lencode[hold&(1<<state.lenbits)-1];here_bits=here>>>24;here_op=here>>>16&255;here_val=here&65535;if(here_bits<=bits){break}if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}if(here_op&&(here_op&240)===0){last_bits=here_bits;last_op=here_op;last_val=here_val;for(;;){here=state.lencode[last_val+((hold&(1<<last_bits+last_op)-1)>>last_bits)];here_bits=here>>>24;here_op=here>>>16&255;here_val=here&65535;if(last_bits+here_bits<=bits){break}if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}hold>>>=last_bits;bits-=last_bits;state.back+=last_bits}hold>>>=here_bits;bits-=here_bits;state.back+=here_bits;state.length=here_val;if(here_op===0){state.mode=LIT;break}if(here_op&32){state.back=-1;state.mode=TYPE;break}if(here_op&64){strm.msg=\"invalid literal/length code\";state.mode=BAD;break}state.extra=here_op&15;state.mode=LENEXT;case LENEXT:if(state.extra){n=state.extra;while(bits<n){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}state.length+=hold&(1<<state.extra)-1;hold>>>=state.extra;bits-=state.extra;state.back+=state.extra}state.was=state.length;state.mode=DIST;case DIST:for(;;){here=state.distcode[hold&(1<<state.distbits)-1];here_bits=here>>>24;here_op=here>>>16&255;here_val=here&65535;if(here_bits<=bits){break}if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}if((here_op&240)===0){last_bits=here_bits;last_op=here_op;last_val=here_val;for(;;){here=state.distcode[last_val+((hold&(1<<last_bits+last_op)-1)>>last_bits)];here_bits=here>>>24;here_op=here>>>16&255;here_val=here&65535;if(last_bits+here_bits<=bits){break}if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}hold>>>=last_bits;bits-=last_bits;state.back+=last_bits}hold>>>=here_bits;bits-=here_bits;state.back+=here_bits;if(here_op&64){strm.msg=\"invalid distance code\";state.mode=BAD;break}state.offset=here_val;state.extra=here_op&15;state.mode=DISTEXT;case DISTEXT:if(state.extra){n=state.extra;while(bits<n){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}state.offset+=hold&(1<<state.extra)-1;hold>>>=state.extra;bits-=state.extra;state.back+=state.extra}if(state.offset>state.dmax){strm.msg=\"invalid distance too far back\";state.mode=BAD;break}state.mode=MATCH;case MATCH:if(left===0){break inf_leave}copy=_out-left;if(state.offset>copy){copy=state.offset-copy;if(copy>state.whave){if(state.sane){strm.msg=\"invalid distance too far back\";state.mode=BAD;break}}if(copy>state.wnext){copy-=state.wnext;from=state.wsize-copy}else{from=state.wnext-copy}if(copy>state.length){copy=state.length}from_source=state.window}else{from_source=output;from=put-state.offset;copy=state.length}if(copy>left){copy=left}left-=copy;state.length-=copy;do{output[put++]=from_source[from++]}while(--copy);if(state.length===0){state.mode=LEN}break;case LIT:if(left===0){break inf_leave}output[put++]=state.length;left--;state.mode=LEN;break;case CHECK:if(state.wrap){while(bits<32){if(have===0){break inf_leave}have--;hold|=input[next++]<<bits;bits+=8}_out-=left;strm.total_out+=_out;state.total+=_out;if(_out){strm.adler=state.check=state.flags?crc32(state.check,output,_out,put-_out):adler32(state.check,output,_out,put-_out)}_out=left;if((state.flags?hold:ZSWAP32(hold))!==state.check){strm.msg=\"incorrect data check\";state.mode=BAD;break}hold=0;bits=0}state.mode=LENGTH;case LENGTH:if(state.wrap&&state.flags){while(bits<32){if(have===0){break inf_leave}have--;hold+=input[next++]<<bits;bits+=8}if(hold!==(state.total&4294967295)){strm.msg=\"incorrect length check\";state.mode=BAD;break}hold=0;bits=0}state.mode=DONE;case DONE:ret=Z_STREAM_END;break inf_leave;case BAD:ret=Z_DATA_ERROR;break inf_leave;case MEM:return Z_MEM_ERROR;case SYNC:default:return Z_STREAM_ERROR}}strm.next_out=put;strm.avail_out=left;strm.next_in=next;strm.avail_in=have;state.hold=hold;state.bits=bits;if(state.wsize||_out!==strm.avail_out&&state.mode<BAD&&(state.mode<CHECK||flush!==Z_FINISH)){if(updatewindow(strm,strm.output,strm.next_out,_out-strm.avail_out)){state.mode=MEM;return Z_MEM_ERROR}}_in-=strm.avail_in;_out-=strm.avail_out;strm.total_in+=_in;strm.total_out+=_out;state.total+=_out;if(state.wrap&&_out){strm.adler=state.check=state.flags?crc32(state.check,output,_out,strm.next_out-_out):adler32(state.check,output,_out,strm.next_out-_out)}strm.data_type=state.bits+(state.last?64:0)+(state.mode===TYPE?128:0)+(state.mode===LEN_||state.mode===COPY_?256:0);if((_in===0&&_out===0||flush===Z_FINISH)&&ret===Z_OK){ret=Z_BUF_ERROR}return ret}function inflateEnd(strm){if(!strm||!strm.state){return Z_STREAM_ERROR}var state=strm.state;if(state.window){state.window=null}strm.state=null;return Z_OK}function inflateGetHeader(strm,head){var state;if(!strm||!strm.state){return Z_STREAM_ERROR}state=strm.state;if((state.wrap&2)===0){return Z_STREAM_ERROR}state.head=head;head.done=false;return Z_OK}exports.inflateReset=inflateReset;exports.inflateReset2=inflateReset2;exports.inflateResetKeep=inflateResetKeep;exports.inflateInit=inflateInit;exports.inflateInit2=inflateInit2;exports.inflate=inflate;exports.inflateEnd=inflateEnd;exports.inflateGetHeader=inflateGetHeader;\nexports.inflateInfo=\"pako inflate (from Nodeca project)\"},{\"../utils/common\":27,\"./adler32\":29,\"./crc32\":31,\"./inffast\":34,\"./inftrees\":36}],36:[function(_dereq_,module,exports){\"use strict\";var utils=_dereq_(\"../utils/common\");var MAXBITS=15;var ENOUGH_LENS=852;var ENOUGH_DISTS=592;var CODES=0;var LENS=1;var DISTS=2;var lbase=[3,4,5,6,7,8,9,10,11,13,15,17,19,23,27,31,35,43,51,59,67,83,99,115,131,163,195,227,258,0,0];var lext=[16,16,16,16,16,16,16,16,17,17,17,17,18,18,18,18,19,19,19,19,20,20,20,20,21,21,21,21,16,72,78];var dbase=[1,2,3,4,5,7,9,13,17,25,33,49,65,97,129,193,257,385,513,769,1025,1537,2049,3073,4097,6145,8193,12289,16385,24577,0,0];var dext=[16,16,16,16,17,17,18,18,19,19,20,20,21,21,22,22,23,23,24,24,25,25,26,26,27,27,28,28,29,29,64,64];module.exports=function inflate_table(type,lens,lens_index,codes,table,table_index,work,opts){var bits=opts.bits;var len=0;var sym=0;var min=0,max=0;var root=0;var curr=0;var drop=0;var left=0;var used=0;var huff=0;var incr;var fill;var low;var mask;var next;var base=null;var base_index=0;var end;var count=new utils.Buf16(MAXBITS+1);var offs=new utils.Buf16(MAXBITS+1);var extra=null;var extra_index=0;var here_bits,here_op,here_val;for(len=0;len<=MAXBITS;len++){count[len]=0}for(sym=0;sym<codes;sym++){count[lens[lens_index+sym]]++}root=bits;for(max=MAXBITS;max>=1;max--){if(count[max]!==0){break}}if(root>max){root=max}if(max===0){table[table_index++]=1<<24|64<<16|0;table[table_index++]=1<<24|64<<16|0;opts.bits=1;return 0}for(min=1;min<max;min++){if(count[min]!==0){break}}if(root<min){root=min}left=1;for(len=1;len<=MAXBITS;len++){left<<=1;left-=count[len];if(left<0){return-1}}if(left>0&&(type===CODES||max!==1)){return-1}offs[1]=0;for(len=1;len<MAXBITS;len++){offs[len+1]=offs[len]+count[len]}for(sym=0;sym<codes;sym++){if(lens[lens_index+sym]!==0){work[offs[lens[lens_index+sym]]++]=sym}}if(type===CODES){base=extra=work;end=19}else if(type===LENS){base=lbase;base_index-=257;extra=lext;extra_index-=257;end=256}else{base=dbase;extra=dext;end=-1}huff=0;sym=0;len=min;next=table_index;curr=root;drop=0;low=-1;used=1<<root;mask=used-1;if(type===LENS&&used>ENOUGH_LENS||type===DISTS&&used>ENOUGH_DISTS){return 1}var i=0;for(;;){i++;here_bits=len-drop;if(work[sym]<end){here_op=0;here_val=work[sym]}else if(work[sym]>end){here_op=extra[extra_index+work[sym]];here_val=base[base_index+work[sym]]}else{here_op=32+64;here_val=0}incr=1<<len-drop;fill=1<<curr;min=fill;do{fill-=incr;table[next+(huff>>drop)+fill]=here_bits<<24|here_op<<16|here_val|0}while(fill!==0);incr=1<<len-1;while(huff&incr){incr>>=1}if(incr!==0){huff&=incr-1;huff+=incr}else{huff=0}sym++;if(--count[len]===0){if(len===max){break}len=lens[lens_index+work[sym]]}if(len>root&&(huff&mask)!==low){if(drop===0){drop=root}next+=min;curr=len-drop;left=1<<curr;while(curr+drop<max){left-=count[curr+drop];if(left<=0){break}curr++;left<<=1}used+=1<<curr;if(type===LENS&&used>ENOUGH_LENS||type===DISTS&&used>ENOUGH_DISTS){return 1}low=huff&mask;table[low]=root<<24|curr<<16|next-table_index|0}}if(huff!==0){table[next+huff]=len-drop<<24|64<<16|0}opts.bits=root;return 0}},{\"../utils/common\":27}],37:[function(_dereq_,module,exports){\"use strict\";module.exports={2:\"need dictionary\",1:\"stream end\",0:\"\",\"-1\":\"file error\",\"-2\":\"stream error\",\"-3\":\"data error\",\"-4\":\"insufficient memory\",\"-5\":\"buffer error\",\"-6\":\"incompatible version\"}},{}],38:[function(_dereq_,module,exports){\"use strict\";var utils=_dereq_(\"../utils/common\");var Z_FIXED=4;var Z_BINARY=0;var Z_TEXT=1;var Z_UNKNOWN=2;function zero(buf){var len=buf.length;while(--len>=0){buf[len]=0}}var STORED_BLOCK=0;var STATIC_TREES=1;var DYN_TREES=2;var MIN_MATCH=3;var MAX_MATCH=258;var LENGTH_CODES=29;var LITERALS=256;var L_CODES=LITERALS+1+LENGTH_CODES;var D_CODES=30;var BL_CODES=19;var HEAP_SIZE=2*L_CODES+1;var MAX_BITS=15;var Buf_size=16;var MAX_BL_BITS=7;var END_BLOCK=256;var REP_3_6=16;var REPZ_3_10=17;var REPZ_11_138=18;var extra_lbits=[0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];var extra_dbits=[0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];var extra_blbits=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7];var bl_order=[16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];var DIST_CODE_LEN=512;var static_ltree=new Array((L_CODES+2)*2);zero(static_ltree);var static_dtree=new Array(D_CODES*2);zero(static_dtree);var _dist_code=new Array(DIST_CODE_LEN);zero(_dist_code);var _length_code=new Array(MAX_MATCH-MIN_MATCH+1);zero(_length_code);var base_length=new Array(LENGTH_CODES);zero(base_length);var base_dist=new Array(D_CODES);zero(base_dist);var StaticTreeDesc=function(static_tree,extra_bits,extra_base,elems,max_length){this.static_tree=static_tree;this.extra_bits=extra_bits;this.extra_base=extra_base;this.elems=elems;this.max_length=max_length;this.has_stree=static_tree&&static_tree.length};var static_l_desc;var static_d_desc;var static_bl_desc;var TreeDesc=function(dyn_tree,stat_desc){this.dyn_tree=dyn_tree;this.max_code=0;this.stat_desc=stat_desc};function d_code(dist){return dist<256?_dist_code[dist]:_dist_code[256+(dist>>>7)]}function put_short(s,w){s.pending_buf[s.pending++]=w&255;s.pending_buf[s.pending++]=w>>>8&255}function send_bits(s,value,length){if(s.bi_valid>Buf_size-length){s.bi_buf|=value<<s.bi_valid&65535;put_short(s,s.bi_buf);s.bi_buf=value>>Buf_size-s.bi_valid;s.bi_valid+=length-Buf_size}else{s.bi_buf|=value<<s.bi_valid&65535;s.bi_valid+=length}}function send_code(s,c,tree){send_bits(s,tree[c*2],tree[c*2+1])}function bi_reverse(code,len){var res=0;do{res|=code&1;code>>>=1;res<<=1}while(--len>0);return res>>>1}function bi_flush(s){if(s.bi_valid===16){put_short(s,s.bi_buf);s.bi_buf=0;s.bi_valid=0}else if(s.bi_valid>=8){s.pending_buf[s.pending++]=s.bi_buf&255;s.bi_buf>>=8;s.bi_valid-=8}}function gen_bitlen(s,desc){var tree=desc.dyn_tree;var max_code=desc.max_code;var stree=desc.stat_desc.static_tree;var has_stree=desc.stat_desc.has_stree;var extra=desc.stat_desc.extra_bits;var base=desc.stat_desc.extra_base;var max_length=desc.stat_desc.max_length;var h;var n,m;var bits;var xbits;var f;var overflow=0;for(bits=0;bits<=MAX_BITS;bits++){s.bl_count[bits]=0}tree[s.heap[s.heap_max]*2+1]=0;for(h=s.heap_max+1;h<HEAP_SIZE;h++){n=s.heap[h];bits=tree[tree[n*2+1]*2+1]+1;if(bits>max_length){bits=max_length;overflow++}tree[n*2+1]=bits;if(n>max_code){continue}s.bl_count[bits]++;xbits=0;if(n>=base){xbits=extra[n-base]}f=tree[n*2];s.opt_len+=f*(bits+xbits);if(has_stree){s.static_len+=f*(stree[n*2+1]+xbits)}}if(overflow===0){return}do{bits=max_length-1;while(s.bl_count[bits]===0){bits--}s.bl_count[bits]--;s.bl_count[bits+1]+=2;s.bl_count[max_length]--;overflow-=2}while(overflow>0);for(bits=max_length;bits!==0;bits--){n=s.bl_count[bits];while(n!==0){m=s.heap[--h];if(m>max_code){continue}if(tree[m*2+1]!==bits){s.opt_len+=(bits-tree[m*2+1])*tree[m*2];tree[m*2+1]=bits}n--}}}function gen_codes(tree,max_code,bl_count){var next_code=new Array(MAX_BITS+1);var code=0;var bits;var n;for(bits=1;bits<=MAX_BITS;bits++){next_code[bits]=code=code+bl_count[bits-1]<<1}for(n=0;n<=max_code;n++){var len=tree[n*2+1];if(len===0){continue}tree[n*2]=bi_reverse(next_code[len]++,len)}}function tr_static_init(){var n;var bits;var length;var code;var dist;var bl_count=new Array(MAX_BITS+1);length=0;for(code=0;code<LENGTH_CODES-1;code++){base_length[code]=length;for(n=0;n<1<<extra_lbits[code];n++){_length_code[length++]=code}}_length_code[length-1]=code;dist=0;for(code=0;code<16;code++){base_dist[code]=dist;for(n=0;n<1<<extra_dbits[code];n++){_dist_code[dist++]=code}}dist>>=7;for(;code<D_CODES;code++){base_dist[code]=dist<<7;for(n=0;n<1<<extra_dbits[code]-7;n++){_dist_code[256+dist++]=code}}for(bits=0;bits<=MAX_BITS;bits++){bl_count[bits]=0}n=0;while(n<=143){static_ltree[n*2+1]=8;n++;bl_count[8]++}while(n<=255){static_ltree[n*2+1]=9;n++;bl_count[9]++}while(n<=279){static_ltree[n*2+1]=7;n++;bl_count[7]++}while(n<=287){static_ltree[n*2+1]=8;n++;bl_count[8]++}gen_codes(static_ltree,L_CODES+1,bl_count);for(n=0;n<D_CODES;n++){static_dtree[n*2+1]=5;static_dtree[n*2]=bi_reverse(n,5)}static_l_desc=new StaticTreeDesc(static_ltree,extra_lbits,LITERALS+1,L_CODES,MAX_BITS);static_d_desc=new StaticTreeDesc(static_dtree,extra_dbits,0,D_CODES,MAX_BITS);static_bl_desc=new StaticTreeDesc(new Array(0),extra_blbits,0,BL_CODES,MAX_BL_BITS)}function init_block(s){var n;for(n=0;n<L_CODES;n++){s.dyn_ltree[n*2]=0}for(n=0;n<D_CODES;n++){s.dyn_dtree[n*2]=0}for(n=0;n<BL_CODES;n++){s.bl_tree[n*2]=0}s.dyn_ltree[END_BLOCK*2]=1;s.opt_len=s.static_len=0;s.last_lit=s.matches=0}function bi_windup(s){if(s.bi_valid>8){put_short(s,s.bi_buf)}else if(s.bi_valid>0){s.pending_buf[s.pending++]=s.bi_buf}s.bi_buf=0;s.bi_valid=0}function copy_block(s,buf,len,header){bi_windup(s);if(header){put_short(s,len);put_short(s,~len)}utils.arraySet(s.pending_buf,s.window,buf,len,s.pending);s.pending+=len}function smaller(tree,n,m,depth){var _n2=n*2;var _m2=m*2;return tree[_n2]<tree[_m2]||tree[_n2]===tree[_m2]&&depth[n]<=depth[m]}function pqdownheap(s,tree,k){var v=s.heap[k];var j=k<<1;while(j<=s.heap_len){if(j<s.heap_len&&smaller(tree,s.heap[j+1],s.heap[j],s.depth)){j++}if(smaller(tree,v,s.heap[j],s.depth)){break}s.heap[k]=s.heap[j];k=j;j<<=1}s.heap[k]=v}function compress_block(s,ltree,dtree){var dist;var lc;var lx=0;var code;var extra;if(s.last_lit!==0){do{dist=s.pending_buf[s.d_buf+lx*2]<<8|s.pending_buf[s.d_buf+lx*2+1];lc=s.pending_buf[s.l_buf+lx];lx++;if(dist===0){send_code(s,lc,ltree)}else{code=_length_code[lc];send_code(s,code+LITERALS+1,ltree);extra=extra_lbits[code];if(extra!==0){lc-=base_length[code];send_bits(s,lc,extra)}dist--;code=d_code(dist);send_code(s,code,dtree);extra=extra_dbits[code];if(extra!==0){dist-=base_dist[code];send_bits(s,dist,extra)}}}while(lx<s.last_lit)}send_code(s,END_BLOCK,ltree)}function build_tree(s,desc){var tree=desc.dyn_tree;var stree=desc.stat_desc.static_tree;var has_stree=desc.stat_desc.has_stree;var elems=desc.stat_desc.elems;var n,m;var max_code=-1;var node;s.heap_len=0;s.heap_max=HEAP_SIZE;for(n=0;n<elems;n++){if(tree[n*2]!==0){s.heap[++s.heap_len]=max_code=n;s.depth[n]=0}else{tree[n*2+1]=0}}while(s.heap_len<2){node=s.heap[++s.heap_len]=max_code<2?++max_code:0;tree[node*2]=1;s.depth[node]=0;s.opt_len--;if(has_stree){s.static_len-=stree[node*2+1]}}desc.max_code=max_code;for(n=s.heap_len>>1;n>=1;n--){pqdownheap(s,tree,n)}node=elems;do{n=s.heap[1];s.heap[1]=s.heap[s.heap_len--];pqdownheap(s,tree,1);m=s.heap[1];s.heap[--s.heap_max]=n;s.heap[--s.heap_max]=m;tree[node*2]=tree[n*2]+tree[m*2];s.depth[node]=(s.depth[n]>=s.depth[m]?s.depth[n]:s.depth[m])+1;tree[n*2+1]=tree[m*2+1]=node;s.heap[1]=node++;pqdownheap(s,tree,1)}while(s.heap_len>=2);s.heap[--s.heap_max]=s.heap[1];gen_bitlen(s,desc);gen_codes(tree,max_code,s.bl_count)}function scan_tree(s,tree,max_code){var n;var prevlen=-1;var curlen;var nextlen=tree[0*2+1];var count=0;var max_count=7;var min_count=4;if(nextlen===0){max_count=138;min_count=3}tree[(max_code+1)*2+1]=65535;for(n=0;n<=max_code;n++){curlen=nextlen;nextlen=tree[(n+1)*2+1];if(++count<max_count&&curlen===nextlen){continue}else if(count<min_count){s.bl_tree[curlen*2]+=count}else if(curlen!==0){if(curlen!==prevlen){s.bl_tree[curlen*2]++}s.bl_tree[REP_3_6*2]++}else if(count<=10){s.bl_tree[REPZ_3_10*2]++}else{s.bl_tree[REPZ_11_138*2]++}count=0;prevlen=curlen;if(nextlen===0){max_count=138;min_count=3}else if(curlen===nextlen){max_count=6;min_count=3}else{max_count=7;min_count=4}}}function send_tree(s,tree,max_code){var n;var prevlen=-1;var curlen;var nextlen=tree[0*2+1];var count=0;var max_count=7;var min_count=4;if(nextlen===0){max_count=138;min_count=3}for(n=0;n<=max_code;n++){curlen=nextlen;nextlen=tree[(n+1)*2+1];if(++count<max_count&&curlen===nextlen){continue}else if(count<min_count){do{send_code(s,curlen,s.bl_tree)}while(--count!==0)}else if(curlen!==0){if(curlen!==prevlen){send_code(s,curlen,s.bl_tree);count--}send_code(s,REP_3_6,s.bl_tree);send_bits(s,count-3,2)}else if(count<=10){send_code(s,REPZ_3_10,s.bl_tree);send_bits(s,count-3,3)}else{send_code(s,REPZ_11_138,s.bl_tree);send_bits(s,count-11,7)}count=0;prevlen=curlen;if(nextlen===0){max_count=138;min_count=3}else if(curlen===nextlen){max_count=6;min_count=3}else{max_count=7;min_count=4}}}function build_bl_tree(s){var max_blindex;scan_tree(s,s.dyn_ltree,s.l_desc.max_code);scan_tree(s,s.dyn_dtree,s.d_desc.max_code);build_tree(s,s.bl_desc);for(max_blindex=BL_CODES-1;max_blindex>=3;max_blindex--){if(s.bl_tree[bl_order[max_blindex]*2+1]!==0){break}}s.opt_len+=3*(max_blindex+1)+5+5+4;return max_blindex}function send_all_trees(s,lcodes,dcodes,blcodes){var rank;send_bits(s,lcodes-257,5);send_bits(s,dcodes-1,5);send_bits(s,blcodes-4,4);for(rank=0;rank<blcodes;rank++){send_bits(s,s.bl_tree[bl_order[rank]*2+1],3)}send_tree(s,s.dyn_ltree,lcodes-1);send_tree(s,s.dyn_dtree,dcodes-1)}function detect_data_type(s){var black_mask=4093624447;var n;for(n=0;n<=31;n++,black_mask>>>=1){if(black_mask&1&&s.dyn_ltree[n*2]!==0){return Z_BINARY}}if(s.dyn_ltree[9*2]!==0||s.dyn_ltree[10*2]!==0||s.dyn_ltree[13*2]!==0){return Z_TEXT}for(n=32;n<LITERALS;n++){if(s.dyn_ltree[n*2]!==0){return Z_TEXT}}return Z_BINARY}var static_init_done=false;function _tr_init(s){if(!static_init_done){tr_static_init();static_init_done=true}s.l_desc=new TreeDesc(s.dyn_ltree,static_l_desc);s.d_desc=new TreeDesc(s.dyn_dtree,static_d_desc);s.bl_desc=new TreeDesc(s.bl_tree,static_bl_desc);s.bi_buf=0;s.bi_valid=0;init_block(s)}function _tr_stored_block(s,buf,stored_len,last){send_bits(s,(STORED_BLOCK<<1)+(last?1:0),3);copy_block(s,buf,stored_len,true)}function _tr_align(s){send_bits(s,STATIC_TREES<<1,3);send_code(s,END_BLOCK,static_ltree);bi_flush(s)}function _tr_flush_block(s,buf,stored_len,last){var opt_lenb,static_lenb;var max_blindex=0;if(s.level>0){if(s.strm.data_type===Z_UNKNOWN){s.strm.data_type=detect_data_type(s)}build_tree(s,s.l_desc);build_tree(s,s.d_desc);max_blindex=build_bl_tree(s);opt_lenb=s.opt_len+3+7>>>3;static_lenb=s.static_len+3+7>>>3;if(static_lenb<=opt_lenb){opt_lenb=static_lenb}}else{opt_lenb=static_lenb=stored_len+5}if(stored_len+4<=opt_lenb&&buf!==-1){_tr_stored_block(s,buf,stored_len,last)}else if(s.strategy===Z_FIXED||static_lenb===opt_lenb){send_bits(s,(STATIC_TREES<<1)+(last?1:0),3);compress_block(s,static_ltree,static_dtree)}else{send_bits(s,(DYN_TREES<<1)+(last?1:0),3);send_all_trees(s,s.l_desc.max_code+1,s.d_desc.max_code+1,max_blindex+1);compress_block(s,s.dyn_ltree,s.dyn_dtree)}init_block(s);if(last){bi_windup(s)}}function _tr_tally(s,dist,lc){s.pending_buf[s.d_buf+s.last_lit*2]=dist>>>8&255;s.pending_buf[s.d_buf+s.last_lit*2+1]=dist&255;s.pending_buf[s.l_buf+s.last_lit]=lc&255;s.last_lit++;if(dist===0){s.dyn_ltree[lc*2]++}else{s.matches++;dist--;s.dyn_ltree[(_length_code[lc]+LITERALS+1)*2]++;s.dyn_dtree[d_code(dist)*2]++}return s.last_lit===s.lit_bufsize-1}exports._tr_init=_tr_init;exports._tr_stored_block=_tr_stored_block;exports._tr_flush_block=_tr_flush_block;exports._tr_tally=_tr_tally;exports._tr_align=_tr_align},{\"../utils/common\":27}],39:[function(_dereq_,module,exports){\"use strict\";function ZStream(){this.input=null;this.next_in=0;this.avail_in=0;this.total_in=0;this.output=null;this.next_out=0;this.avail_out=0;this.total_out=0;this.msg=\"\";this.state=null;this.data_type=2;this.adler=0}module.exports=ZStream},{}]},{},[9])(9)});var XLSX={};(function make_xlsx(XLSX){XLSX.version=\"0.8.11\";var current_codepage=1200,current_cptable;if(typeof module!==\"undefined\"&&typeof require!==\"undefined\"){if(typeof cptable===\"undefined\")cptable=require(\"./dist/cpexcel\");current_cptable=cptable[current_codepage]}function reset_cp(){set_cp(1200)}var set_cp=function(cp){current_codepage=cp};function char_codes(data){var o=[];for(var i=0,len=data.length;i<len;++i)o[i]=data.charCodeAt(i);return o}var debom_xml=function(data){return data};var _getchar=function _gc1(x){return String.fromCharCode(x)};if(typeof cptable!==\"undefined\"){set_cp=function(cp){current_codepage=cp;current_cptable=cptable[cp]};debom_xml=function(data){if(data.charCodeAt(0)===255&&data.charCodeAt(1)===254){return cptable.utils.decode(1200,char_codes(data.substr(2)))}return data};_getchar=function _gc2(x){if(current_codepage===1200)return String.fromCharCode(x);return cptable.utils.decode(current_codepage,[x&255,x>>8])[0]}}var Base64=function make_b64(){var map=\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\";return{encode:function(input,utf8){var o=\"\";var c1,c2,c3,e1,e2,e3,e4;for(var i=0;i<input.length;){c1=input.charCodeAt(i++);c2=input.charCodeAt(i++);c3=input.charCodeAt(i++);e1=c1>>2;e2=(c1&3)<<4|c2>>4;e3=(c2&15)<<2|c3>>6;e4=c3&63;if(isNaN(c2)){e3=e4=64}else if(isNaN(c3)){e4=64}o+=map.charAt(e1)+map.charAt(e2)+map.charAt(e3)+map.charAt(e4)}return o},decode:function b64_decode(input,utf8){var o=\"\";var c1,c2,c3;var e1,e2,e3,e4;input=input.replace(/[^A-Za-z0-9\\+\\/\\=]/g,\"\");for(var i=0;i<input.length;){e1=map.indexOf(input.charAt(i++));e2=map.indexOf(input.charAt(i++));e3=map.indexOf(input.charAt(i++));e4=map.indexOf(input.charAt(i++));c1=e1<<2|e2>>4;c2=(e2&15)<<4|e3>>2;c3=(e3&3)<<6|e4;o+=String.fromCharCode(c1);if(e3!=64){o+=String.fromCharCode(c2)}if(e4!=64){o+=String.fromCharCode(c3)}}return o}}}();var has_buf=typeof Buffer!==\"undefined\";function new_raw_buf(len){return new(has_buf?Buffer:Array)(len)}function s2a(s){if(has_buf)return new Buffer(s,\"binary\");return s.split(\"\").map(function(x){return x.charCodeAt(0)&255})}var bconcat=function(bufs){return[].concat.apply([],bufs)};var chr0=/\\u0000/g,chr1=/[\\u0001-\\u0006]/;var SSF={};var make_ssf=function make_ssf(SSF){SSF.version=\"0.8.1\";function _strrev(x){var o=\"\",i=x.length-1;while(i>=0)o+=x.charAt(i--);return o}function fill(c,l){var o=\"\";while(o.length<l)o+=c;return o}function pad0(v,d){var t=\"\"+v;return t.length>=d?t:fill(\"0\",d-t.length)+t}function pad_(v,d){var t=\"\"+v;return t.length>=d?t:fill(\" \",d-t.length)+t}function rpad_(v,d){var t=\"\"+v;return t.length>=d?t:t+fill(\" \",d-t.length)}function pad0r1(v,d){var t=\"\"+Math.round(v);return t.length>=d?t:fill(\"0\",d-t.length)+t}function pad0r2(v,d){var t=\"\"+v;return t.length>=d?t:fill(\"0\",d-t.length)+t}var p2_32=Math.pow(2,32);function pad0r(v,d){if(v>p2_32||v<-p2_32)return pad0r1(v,d);var i=Math.round(v);return pad0r2(i,d)}function isgeneral(s,i){return s.length>=7+i&&(s.charCodeAt(i)|32)===103&&(s.charCodeAt(i+1)|32)===101&&(s.charCodeAt(i+2)|32)===110&&(s.charCodeAt(i+3)|32)===101&&(s.charCodeAt(i+4)|32)===114&&(s.charCodeAt(i+5)|32)===97&&(s.charCodeAt(i+6)|32)===108}var opts_fmt=[[\"date1904\",0],[\"output\",\"\"],[\"WTF\",false]];function fixopts(o){for(var y=0;y!=opts_fmt.length;++y)if(o[opts_fmt[y][0]]===undefined)o[opts_fmt[y][0]]=opts_fmt[y][1]}SSF.opts=opts_fmt;var table_fmt={0:\"General\",1:\"0\",2:\"0.00\",3:\"#,##0\",4:\"#,##0.00\",9:\"0%\",10:\"0.00%\",11:\"0.00E+00\",12:\"# ?/?\",13:\"# ??/??\",14:\"m/d/yy\",15:\"d-mmm-yy\",16:\"d-mmm\",17:\"mmm-yy\",18:\"h:mm AM/PM\",19:\"h:mm:ss AM/PM\",20:\"h:mm\",21:\"h:mm:ss\",22:\"m/d/yy h:mm\",37:\"#,##0 ;(#,##0)\",38:\"#,##0 ;[Red](#,##0)\",39:\"#,##0.00;(#,##0.00)\",40:\"#,##0.00;[Red](#,##0.00)\",45:\"mm:ss\",46:\"[h]:mm:ss\",47:\"mmss.0\",48:\"##0.0E+0\",49:\"@\",56:'\"上午/下午 \"hh\"時\"mm\"分\"ss\"秒 \"',65535:\"General\"};var days=[[\"Sun\",\"Sunday\"],[\"Mon\",\"Monday\"],[\"Tue\",\"Tuesday\"],[\"Wed\",\"Wednesday\"],[\"Thu\",\"Thursday\"],[\"Fri\",\"Friday\"],[\"Sat\",\"Saturday\"]];var months=[[\"J\",\"Jan\",\"January\"],[\"F\",\"Feb\",\"February\"],[\"M\",\"Mar\",\"March\"],[\"A\",\"Apr\",\"April\"],[\"M\",\"May\",\"May\"],[\"J\",\"Jun\",\"June\"],[\"J\",\"Jul\",\"July\"],[\"A\",\"Aug\",\"August\"],[\"S\",\"Sep\",\"September\"],[\"O\",\"Oct\",\"October\"],[\"N\",\"Nov\",\"November\"],[\"D\",\"Dec\",\"December\"]];function frac(x,D,mixed){var sgn=x<0?-1:1;var B=x*sgn;var P_2=0,P_1=1,P=0;var Q_2=1,Q_1=0,Q=0;var A=Math.floor(B);while(Q_1<D){A=Math.floor(B);P=A*P_1+P_2;Q=A*Q_1+Q_2;if(B-A<5e-10)break;B=1/(B-A);P_2=P_1;P_1=P;Q_2=Q_1;Q_1=Q}if(Q>D){Q=Q_1;P=P_1}if(Q>D){Q=Q_2;P=P_2}if(!mixed)return[0,sgn*P,Q];if(Q===0)throw\"Unexpected state: \"+P+\" \"+P_1+\" \"+P_2+\" \"+Q+\" \"+Q_1+\" \"+Q_2;var q=Math.floor(sgn*P/Q);return[q,sgn*P-q*Q,Q]}function general_fmt_int(v,opts){return\"\"+v}SSF._general_int=general_fmt_int;var general_fmt_num=function make_general_fmt_num(){var gnr1=/\\.(\\d*[1-9])0+$/,gnr2=/\\.0*$/,gnr4=/\\.(\\d*[1-9])0+/,gnr5=/\\.0*[Ee]/,gnr6=/(E[+-])(\\d)$/;function gfn2(v){var w=v<0?12:11;var o=gfn5(v.toFixed(12));if(o.length<=w)return o;o=v.toPrecision(10);if(o.length<=w)return o;return v.toExponential(5)}function gfn3(v){var o=v.toFixed(11).replace(gnr1,\".$1\");if(o.length>(v<0?12:11))o=v.toPrecision(6);return o}function gfn4(o){for(var i=0;i!=o.length;++i)if((o.charCodeAt(i)|32)===101)return o.replace(gnr4,\".$1\").replace(gnr5,\"E\").replace(\"e\",\"E\").replace(gnr6,\"$10$2\");return o}function gfn5(o){return o.indexOf(\".\")>-1?o.replace(gnr2,\"\").replace(gnr1,\".$1\"):o}return function general_fmt_num(v,opts){var V=Math.floor(Math.log(Math.abs(v))*Math.LOG10E),o;if(V>=-4&&V<=-1)o=v.toPrecision(10+V);else if(Math.abs(V)<=9)o=gfn2(v);else if(V===10)o=v.toFixed(10).substr(0,12);else o=gfn3(v);return gfn5(gfn4(o))}}();SSF._general_num=general_fmt_num;function general_fmt(v,opts){switch(typeof v){case\"string\":return v;case\"boolean\":return v?\"TRUE\":\"FALSE\";case\"number\":return(v|0)===v?general_fmt_int(v,opts):general_fmt_num(v,opts)}throw new Error(\"unsupported value in General format: \"+v)}SSF._general=general_fmt;function fix_hijri(date,o){return 0}function parse_date_code(v,opts,b2){if(v>2958465||v<0)return null;var date=v|0,time=Math.floor(86400*(v-date)),dow=0;var dout=[];var out={D:date,T:time,u:86400*(v-date)-time,y:0,m:0,d:0,H:0,M:0,S:0,q:0};if(Math.abs(out.u)<1e-6)out.u=0;fixopts(opts!=null?opts:opts=[]);if(opts.date1904)date+=1462;if(out.u>.999){out.u=0;if(++time==86400){time=0;++date}}if(date===60){dout=b2?[1317,10,29]:[1900,2,29];dow=3}else if(date===0){dout=b2?[1317,8,29]:[1900,1,0];dow=6}else{if(date>60)--date;var d=new Date(1900,0,1);d.setDate(d.getDate()+date-1);dout=[d.getFullYear(),d.getMonth()+1,d.getDate()];dow=d.getDay();if(date<60)dow=(dow+6)%7;if(b2)dow=fix_hijri(d,dout)}out.y=dout[0];out.m=dout[1];out.d=dout[2];out.S=time%60;time=Math.floor(time/60);out.M=time%60;time=Math.floor(time/60);out.H=time;out.q=dow;return out}SSF.parse_date_code=parse_date_code;function write_date(type,fmt,val,ss0){var o=\"\",ss=0,tt=0,y=val.y,out,outl=0;switch(type){case 98:y=val.y+543;case 121:switch(fmt.length){case 1:case 2:out=y%100;outl=2;break;default:out=y%1e4;outl=4;break}break;case 109:switch(fmt.length){case 1:case 2:out=val.m;outl=fmt.length;break;case 3:return months[val.m-1][1];case 5:return months[val.m-1][0];default:return months[val.m-1][2]}break;case 100:switch(fmt.length){case 1:case 2:out=val.d;outl=fmt.length;break;case 3:return days[val.q][0];default:return days[val.q][1]}break;case 104:switch(fmt.length){case 1:case 2:out=1+(val.H+11)%12;outl=fmt.length;break;default:throw\"bad hour format: \"+fmt}break;case 72:switch(fmt.length){case 1:case 2:out=val.H;outl=fmt.length;break;default:throw\"bad hour format: \"+fmt}break;case 77:switch(fmt.length){case 1:case 2:out=val.M;outl=fmt.length;break;default:throw\"bad minute format: \"+fmt}break;case 115:if(val.u===0)switch(fmt){case\"s\":case\"ss\":return pad0(val.S,fmt.length);case\".0\":case\".00\":case\".000\":}switch(fmt){case\"s\":case\"ss\":case\".0\":case\".00\":case\".000\":if(ss0>=2)tt=ss0===3?1e3:100;else tt=ss0===1?10:1;ss=Math.round(tt*(val.S+val.u));if(ss>=60*tt)ss=0;if(fmt===\"s\")return ss===0?\"0\":\"\"+ss/tt;o=pad0(ss,2+ss0);if(fmt===\"ss\")return o.substr(0,2);return\".\"+o.substr(2,fmt.length-1);default:throw\"bad second format: \"+fmt}case 90:switch(fmt){case\"[h]\":case\"[hh]\":out=val.D*24+val.H;break;case\"[m]\":case\"[mm]\":out=(val.D*24+val.H)*60+val.M;break;case\"[s]\":case\"[ss]\":out=((val.D*24+val.H)*60+val.M)*60+Math.round(val.S+val.u);break;default:throw\"bad abstime format: \"+fmt}outl=fmt.length===3?1:2;break;case 101:out=y;outl=1}if(outl>0)return pad0(out,outl);else return\"\"}function commaify(s){if(s.length<=3)return s;var j=s.length%3,o=s.substr(0,j);for(;j!=s.length;j+=3)o+=(o.length>0?\",\":\"\")+s.substr(j,3);return o}var write_num=function make_write_num(){var pct1=/%/g;function write_num_pct(type,fmt,val){var sfmt=fmt.replace(pct1,\"\"),mul=fmt.length-sfmt.length;return write_num(type,sfmt,val*Math.pow(10,2*mul))+fill(\"%\",mul)}function write_num_cm(type,fmt,val){var idx=fmt.length-1;while(fmt.charCodeAt(idx-1)===44)--idx;return write_num(type,fmt.substr(0,idx),val/Math.pow(10,3*(fmt.length-idx)))}function write_num_exp(fmt,val){var o;var idx=fmt.indexOf(\"E\")-fmt.indexOf(\".\")-1;if(fmt.match(/^#+0.0E\\+0$/)){var period=fmt.indexOf(\".\");if(period===-1)period=fmt.indexOf(\"E\");var ee=Math.floor(Math.log(Math.abs(val))*Math.LOG10E)%period;if(ee<0)ee+=period;o=(val/Math.pow(10,ee)).toPrecision(idx+1+(period+ee)%period);if(o.indexOf(\"e\")===-1){var fakee=Math.floor(Math.log(Math.abs(val))*Math.LOG10E);if(o.indexOf(\".\")===-1)o=o[0]+\".\"+o.substr(1)+\"E+\"+(fakee-o.length+ee);else o+=\"E+\"+(fakee-ee);while(o.substr(0,2)===\"0.\"){o=o[0]+o.substr(2,period)+\".\"+o.substr(2+period);o=o.replace(/^0+([1-9])/,\"$1\").replace(/^0+\\./,\"0.\")}o=o.replace(/\\+-/,\"-\")}o=o.replace(/^([+-]?)(\\d*)\\.(\\d*)[Ee]/,function($$,$1,$2,$3){return $1+$2+$3.substr(0,(period+ee)%period)+\".\"+$3.substr(ee)+\"E\"})}else o=val.toExponential(idx);if(fmt.match(/E\\+00$/)&&o.match(/e[+-]\\d$/))o=o.substr(0,o.length-1)+\"0\"+o[o.length-1];if(fmt.match(/E\\-/)&&o.match(/e\\+/))o=o.replace(/e\\+/,\"e\");return o.replace(\"e\",\"E\")}var frac1=/# (\\?+)( ?)\\/( ?)(\\d+)/;function write_num_f1(r,aval,sign){var den=parseInt(r[4]),rr=Math.round(aval*den),base=Math.floor(rr/den);var myn=rr-base*den,myd=den;return sign+(base===0?\"\":\"\"+base)+\" \"+(myn===0?fill(\" \",r[1].length+1+r[4].length):pad_(myn,r[1].length)+r[2]+\"/\"+r[3]+pad0(myd,r[4].length))}function write_num_f2(r,aval,sign){return sign+(aval===0?\"\":\"\"+aval)+fill(\" \",r[1].length+2+r[4].length)}var dec1=/^#*0*\\.(0+)/;var closeparen=/\\).*[0#]/;var phone=/\\(###\\) ###\\\\?-####/;function hashq(str){var o=\"\",cc;for(var i=0;i!=str.length;++i)switch(cc=str.charCodeAt(i)){case 35:break;case 63:o+=\" \";break;case 48:o+=\"0\";break;default:o+=String.fromCharCode(cc)}return o}function rnd(val,d){var dd=Math.pow(10,d);return\"\"+Math.round(val*dd)/dd}function dec(val,d){return Math.round((val-Math.floor(val))*Math.pow(10,d))}function flr(val){if(val<2147483647&&val>-2147483648)return\"\"+(val>=0?val|0:val-1|0);return\"\"+Math.floor(val)}function write_num_flt(type,fmt,val){if(type.charCodeAt(0)===40&&!fmt.match(closeparen)){var ffmt=fmt.replace(/\\( */,\"\").replace(/ \\)/,\"\").replace(/\\)/,\"\");if(val>=0)return write_num_flt(\"n\",ffmt,val);return\"(\"+write_num_flt(\"n\",ffmt,-val)+\")\"}if(fmt.charCodeAt(fmt.length-1)===44)return write_num_cm(type,fmt,val);if(fmt.indexOf(\"%\")!==-1)return write_num_pct(type,fmt,val);if(fmt.indexOf(\"E\")!==-1)return write_num_exp(fmt,val);if(fmt.charCodeAt(0)===36)return\"$\"+write_num_flt(type,fmt.substr(fmt[1]==\" \"?2:1),val);var o,oo;var r,ri,ff,aval=Math.abs(val),sign=val<0?\"-\":\"\";if(fmt.match(/^00+$/))return sign+pad0r(aval,fmt.length);if(fmt.match(/^[#?]+$/)){o=pad0r(val,0);if(o===\"0\")o=\"\";return o.length>fmt.length?o:hashq(fmt.substr(0,fmt.length-o.length))+o}if((r=fmt.match(frac1))!==null)return write_num_f1(r,aval,sign);if(fmt.match(/^#+0+$/)!==null)return sign+pad0r(aval,fmt.length-fmt.indexOf(\"0\"));if((r=fmt.match(dec1))!==null){o=rnd(val,r[1].length).replace(/^([^\\.]+)$/,\"$1.\"+r[1]).replace(/\\.$/,\".\"+r[1]).replace(/\\.(\\d*)$/,function($$,$1){return\".\"+$1+fill(\"0\",r[1].length-$1.length)});return fmt.indexOf(\"0.\")!==-1?o:o.replace(/^0\\./,\".\")}fmt=fmt.replace(/^#+([0.])/,\"$1\");if((r=fmt.match(/^(0*)\\.(#*)$/))!==null){return sign+rnd(aval,r[2].length).replace(/\\.(\\d*[1-9])0*$/,\".$1\").replace(/^(-?\\d*)$/,\"$1.\").replace(/^0\\./,r[1].length?\"0.\":\".\")}if((r=fmt.match(/^#,##0(\\.?)$/))!==null)return sign+commaify(pad0r(aval,0));if((r=fmt.match(/^#,##0\\.([#0]*0)$/))!==null){return val<0?\"-\"+write_num_flt(type,fmt,-val):commaify(\"\"+Math.floor(val))+\".\"+pad0(dec(val,r[1].length),r[1].length)}if((r=fmt.match(/^#,#*,#0/))!==null)return write_num_flt(type,fmt.replace(/^#,#*,/,\"\"),val);if((r=fmt.match(/^([0#]+)(\\\\?-([0#]+))+$/))!==null){o=_strrev(write_num_flt(type,fmt.replace(/[\\\\-]/g,\"\"),val));ri=0;return _strrev(_strrev(fmt.replace(/\\\\/g,\"\")).replace(/[0#]/g,function(x){return ri<o.length?o[ri++]:x===\"0\"?\"0\":\"\"}))}if(fmt.match(phone)!==null){o=write_num_flt(type,\"##########\",val);return\"(\"+o.substr(0,3)+\") \"+o.substr(3,3)+\"-\"+o.substr(6)}var oa=\"\";if((r=fmt.match(/^([#0?]+)( ?)\\/( ?)([#0?]+)/))!==null){ri=Math.min(r[4].length,7);ff=frac(aval,Math.pow(10,ri)-1,false);o=\"\"+sign;oa=write_num(\"n\",r[1],ff[1]);if(oa[oa.length-1]==\" \")oa=oa.substr(0,oa.length-1)+\"0\";o+=oa+r[2]+\"/\"+r[3];oa=rpad_(ff[2],ri);if(oa.length<r[4].length)oa=hashq(r[4].substr(r[4].length-oa.length))+oa;o+=oa;return o}if((r=fmt.match(/^# ([#0?]+)( ?)\\/( ?)([#0?]+)/))!==null){ri=Math.min(Math.max(r[1].length,r[4].length),7);ff=frac(aval,Math.pow(10,ri)-1,true);return sign+(ff[0]||(ff[1]?\"\":\"0\"))+\" \"+(ff[1]?pad_(ff[1],ri)+r[2]+\"/\"+r[3]+rpad_(ff[2],ri):fill(\" \",2*ri+1+r[2].length+r[3].length))}if((r=fmt.match(/^[#0?]+$/))!==null){o=pad0r(val,0);if(fmt.length<=o.length)return o;return hashq(fmt.substr(0,fmt.length-o.length))+o}if((r=fmt.match(/^([#0?]+)\\.([#0]+)$/))!==null){o=\"\"+val.toFixed(Math.min(r[2].length,10)).replace(/([^0])0+$/,\"$1\");ri=o.indexOf(\".\");var lres=fmt.indexOf(\".\")-ri,rres=fmt.length-o.length-lres;return hashq(fmt.substr(0,lres)+o+fmt.substr(fmt.length-rres))}if((r=fmt.match(/^00,000\\.([#0]*0)$/))!==null){ri=dec(val,r[1].length);return val<0?\"-\"+write_num_flt(type,fmt,-val):commaify(flr(val)).replace(/^\\d,\\d{3}$/,\"0$&\").replace(/^\\d*$/,function($$){return\"00,\"+($$.length<3?pad0(0,3-$$.length):\"\")+$$})+\".\"+pad0(ri,r[1].length)}switch(fmt){case\"#,###\":var x=commaify(pad0r(aval,0));return x!==\"0\"?sign+x:\"\";default:}throw new Error(\"unsupported format |\"+fmt+\"|\")}function write_num_cm2(type,fmt,val){var idx=fmt.length-1;while(fmt.charCodeAt(idx-1)===44)--idx;return write_num(type,fmt.substr(0,idx),val/Math.pow(10,3*(fmt.length-idx)))}function write_num_pct2(type,fmt,val){var sfmt=fmt.replace(pct1,\"\"),mul=fmt.length-sfmt.length;return write_num(type,sfmt,val*Math.pow(10,2*mul))+fill(\"%\",mul)}function write_num_exp2(fmt,val){var o;var idx=fmt.indexOf(\"E\")-fmt.indexOf(\".\")-1;if(fmt.match(/^#+0.0E\\+0$/)){var period=fmt.indexOf(\".\");if(period===-1)period=fmt.indexOf(\"E\");var ee=Math.floor(Math.log(Math.abs(val))*Math.LOG10E)%period;if(ee<0)ee+=period;o=(val/Math.pow(10,ee)).toPrecision(idx+1+(period+ee)%period);if(!o.match(/[Ee]/)){var fakee=Math.floor(Math.log(Math.abs(val))*Math.LOG10E);if(o.indexOf(\".\")===-1)o=o[0]+\".\"+o.substr(1)+\"E+\"+(fakee-o.length+ee);else o+=\"E+\"+(fakee-ee);o=o.replace(/\\+-/,\"-\")}o=o.replace(/^([+-]?)(\\d*)\\.(\\d*)[Ee]/,function($$,$1,$2,$3){return $1+$2+$3.substr(0,(period+ee)%period)+\".\"+$3.substr(ee)+\"E\"})}else o=val.toExponential(idx);if(fmt.match(/E\\+00$/)&&o.match(/e[+-]\\d$/))o=o.substr(0,o.length-1)+\"0\"+o[o.length-1];if(fmt.match(/E\\-/)&&o.match(/e\\+/))o=o.replace(/e\\+/,\"e\");return o.replace(\"e\",\"E\")}function write_num_int(type,fmt,val){if(type.charCodeAt(0)===40&&!fmt.match(closeparen)){var ffmt=fmt.replace(/\\( */,\"\").replace(/ \\)/,\"\").replace(/\\)/,\"\");if(val>=0)return write_num_int(\"n\",ffmt,val);return\"(\"+write_num_int(\"n\",ffmt,-val)+\")\"}if(fmt.charCodeAt(fmt.length-1)===44)return write_num_cm2(type,fmt,val);if(fmt.indexOf(\"%\")!==-1)return write_num_pct2(type,fmt,val);if(fmt.indexOf(\"E\")!==-1)return write_num_exp2(fmt,val);if(fmt.charCodeAt(0)===36)return\"$\"+write_num_int(type,fmt.substr(fmt[1]==\" \"?2:1),val);var o;var r,ri,ff,aval=Math.abs(val),sign=val<0?\"-\":\"\";if(fmt.match(/^00+$/))return sign+pad0(aval,fmt.length);if(fmt.match(/^[#?]+$/)){o=\"\"+val;if(val===0)o=\"\";return o.length>fmt.length?o:hashq(fmt.substr(0,fmt.length-o.length))+o}if((r=fmt.match(frac1))!==null)return write_num_f2(r,aval,sign);if(fmt.match(/^#+0+$/)!==null)return sign+pad0(aval,fmt.length-fmt.indexOf(\"0\"));if((r=fmt.match(dec1))!==null){o=(\"\"+val).replace(/^([^\\.]+)$/,\"$1.\"+r[1]).replace(/\\.$/,\".\"+r[1]).replace(/\\.(\\d*)$/,function($$,$1){return\".\"+$1+fill(\"0\",r[1].length-$1.length)});return fmt.indexOf(\"0.\")!==-1?o:o.replace(/^0\\./,\".\");\n}fmt=fmt.replace(/^#+([0.])/,\"$1\");if((r=fmt.match(/^(0*)\\.(#*)$/))!==null){return sign+(\"\"+aval).replace(/\\.(\\d*[1-9])0*$/,\".$1\").replace(/^(-?\\d*)$/,\"$1.\").replace(/^0\\./,r[1].length?\"0.\":\".\")}if((r=fmt.match(/^#,##0(\\.?)$/))!==null)return sign+commaify(\"\"+aval);if((r=fmt.match(/^#,##0\\.([#0]*0)$/))!==null){return val<0?\"-\"+write_num_int(type,fmt,-val):commaify(\"\"+val)+\".\"+fill(\"0\",r[1].length)}if((r=fmt.match(/^#,#*,#0/))!==null)return write_num_int(type,fmt.replace(/^#,#*,/,\"\"),val);if((r=fmt.match(/^([0#]+)(\\\\?-([0#]+))+$/))!==null){o=_strrev(write_num_int(type,fmt.replace(/[\\\\-]/g,\"\"),val));ri=0;return _strrev(_strrev(fmt.replace(/\\\\/g,\"\")).replace(/[0#]/g,function(x){return ri<o.length?o[ri++]:x===\"0\"?\"0\":\"\"}))}if(fmt.match(phone)!==null){o=write_num_int(type,\"##########\",val);return\"(\"+o.substr(0,3)+\") \"+o.substr(3,3)+\"-\"+o.substr(6)}var oa=\"\";if((r=fmt.match(/^([#0?]+)( ?)\\/( ?)([#0?]+)/))!==null){ri=Math.min(r[4].length,7);ff=frac(aval,Math.pow(10,ri)-1,false);o=\"\"+sign;oa=write_num(\"n\",r[1],ff[1]);if(oa[oa.length-1]==\" \")oa=oa.substr(0,oa.length-1)+\"0\";o+=oa+r[2]+\"/\"+r[3];oa=rpad_(ff[2],ri);if(oa.length<r[4].length)oa=hashq(r[4].substr(r[4].length-oa.length))+oa;o+=oa;return o}if((r=fmt.match(/^# ([#0?]+)( ?)\\/( ?)([#0?]+)/))!==null){ri=Math.min(Math.max(r[1].length,r[4].length),7);ff=frac(aval,Math.pow(10,ri)-1,true);return sign+(ff[0]||(ff[1]?\"\":\"0\"))+\" \"+(ff[1]?pad_(ff[1],ri)+r[2]+\"/\"+r[3]+rpad_(ff[2],ri):fill(\" \",2*ri+1+r[2].length+r[3].length))}if((r=fmt.match(/^[#0?]+$/))!==null){o=\"\"+val;if(fmt.length<=o.length)return o;return hashq(fmt.substr(0,fmt.length-o.length))+o}if((r=fmt.match(/^([#0]+)\\.([#0]+)$/))!==null){o=\"\"+val.toFixed(Math.min(r[2].length,10)).replace(/([^0])0+$/,\"$1\");ri=o.indexOf(\".\");var lres=fmt.indexOf(\".\")-ri,rres=fmt.length-o.length-lres;return hashq(fmt.substr(0,lres)+o+fmt.substr(fmt.length-rres))}if((r=fmt.match(/^00,000\\.([#0]*0)$/))!==null){return val<0?\"-\"+write_num_int(type,fmt,-val):commaify(\"\"+val).replace(/^\\d,\\d{3}$/,\"0$&\").replace(/^\\d*$/,function($$){return\"00,\"+($$.length<3?pad0(0,3-$$.length):\"\")+$$})+\".\"+pad0(0,r[1].length)}switch(fmt){case\"#,###\":var x=commaify(\"\"+aval);return x!==\"0\"?sign+x:\"\";default:}throw new Error(\"unsupported format |\"+fmt+\"|\")}return function write_num(type,fmt,val){return(val|0)===val?write_num_int(type,fmt,val):write_num_flt(type,fmt,val)}}();function split_fmt(fmt){var out=[];var in_str=false,cc;for(var i=0,j=0;i<fmt.length;++i)switch(cc=fmt.charCodeAt(i)){case 34:in_str=!in_str;break;case 95:case 42:case 92:++i;break;case 59:out[out.length]=fmt.substr(j,i-j);j=i+1}out[out.length]=fmt.substr(j);if(in_str===true)throw new Error(\"Format |\"+fmt+\"| unterminated string \");return out}SSF._split=split_fmt;var abstime=/\\[[HhMmSs]*\\]/;function eval_fmt(fmt,v,opts,flen){var out=[],o=\"\",i=0,c=\"\",lst=\"t\",q,dt,j,cc;var hr=\"H\";while(i<fmt.length){switch(c=fmt[i]){case\"G\":if(!isgeneral(fmt,i))throw new Error(\"unrecognized character \"+c+\" in \"+fmt);out[out.length]={t:\"G\",v:\"General\"};i+=7;break;case'\"':for(o=\"\";(cc=fmt.charCodeAt(++i))!==34&&i<fmt.length;)o+=String.fromCharCode(cc);out[out.length]={t:\"t\",v:o};++i;break;case\"\\\\\":var w=fmt[++i],t=w===\"(\"||w===\")\"?w:\"t\";out[out.length]={t:t,v:w};++i;break;case\"_\":out[out.length]={t:\"t\",v:\" \"};i+=2;break;case\"@\":out[out.length]={t:\"T\",v:v};++i;break;case\"B\":case\"b\":if(fmt[i+1]===\"1\"||fmt[i+1]===\"2\"){if(dt==null){dt=parse_date_code(v,opts,fmt[i+1]===\"2\");if(dt==null)return\"\"}out[out.length]={t:\"X\",v:fmt.substr(i,2)};lst=c;i+=2;break}case\"M\":case\"D\":case\"Y\":case\"H\":case\"S\":case\"E\":c=c.toLowerCase();case\"m\":case\"d\":case\"y\":case\"h\":case\"s\":case\"e\":case\"g\":if(v<0)return\"\";if(dt==null){dt=parse_date_code(v,opts);if(dt==null)return\"\"}o=c;while(++i<fmt.length&&fmt[i].toLowerCase()===c)o+=c;if(c===\"m\"&&lst.toLowerCase()===\"h\")c=\"M\";if(c===\"h\")c=hr;out[out.length]={t:c,v:o};lst=c;break;case\"A\":q={t:c,v:\"A\"};if(dt==null)dt=parse_date_code(v,opts);if(fmt.substr(i,3)===\"A/P\"){if(dt!=null)q.v=dt.H>=12?\"P\":\"A\";q.t=\"T\";hr=\"h\";i+=3}else if(fmt.substr(i,5)===\"AM/PM\"){if(dt!=null)q.v=dt.H>=12?\"PM\":\"AM\";q.t=\"T\";i+=5;hr=\"h\"}else{q.t=\"t\";++i}if(dt==null&&q.t===\"T\")return\"\";out[out.length]=q;lst=c;break;case\"[\":o=c;while(fmt[i++]!==\"]\"&&i<fmt.length)o+=fmt[i];if(o.substr(-1)!==\"]\")throw'unterminated \"[\" block: |'+o+\"|\";if(o.match(abstime)){if(dt==null){dt=parse_date_code(v,opts);if(dt==null)return\"\"}out[out.length]={t:\"Z\",v:o.toLowerCase()}}else{o=\"\"}break;case\".\":if(dt!=null){o=c;while((c=fmt[++i])===\"0\")o+=c;out[out.length]={t:\"s\",v:o};break}case\"0\":case\"#\":o=c;while(\"0#?.,E+-%\".indexOf(c=fmt[++i])>-1||c==\"\\\\\"&&fmt[i+1]==\"-\"&&\"0#\".indexOf(fmt[i+2])>-1)o+=c;out[out.length]={t:\"n\",v:o};break;case\"?\":o=c;while(fmt[++i]===c)o+=c;q={t:c,v:o};out[out.length]=q;lst=c;break;case\"*\":++i;if(fmt[i]==\" \"||fmt[i]==\"*\")++i;break;case\"(\":case\")\":out[out.length]={t:flen===1?\"t\":c,v:c};++i;break;case\"1\":case\"2\":case\"3\":case\"4\":case\"5\":case\"6\":case\"7\":case\"8\":case\"9\":o=c;while(\"0123456789\".indexOf(fmt[++i])>-1)o+=fmt[i];out[out.length]={t:\"D\",v:o};break;case\" \":out[out.length]={t:c,v:c};++i;break;default:if(\",$-+/():!^&'~{}<>=€acfijklopqrtuvwxz\".indexOf(c)===-1)throw new Error(\"unrecognized character \"+c+\" in \"+fmt);out[out.length]={t:\"t\",v:c};++i;break}}var bt=0,ss0=0,ssm;for(i=out.length-1,lst=\"t\";i>=0;--i){switch(out[i].t){case\"h\":case\"H\":out[i].t=hr;lst=\"h\";if(bt<1)bt=1;break;case\"s\":if(ssm=out[i].v.match(/\\.0+$/))ss0=Math.max(ss0,ssm[0].length-1);if(bt<3)bt=3;case\"d\":case\"y\":case\"M\":case\"e\":lst=out[i].t;break;case\"m\":if(lst===\"s\"){out[i].t=\"M\";if(bt<2)bt=2}break;case\"X\":if(out[i].v===\"B2\");break;case\"Z\":if(bt<1&&out[i].v.match(/[Hh]/))bt=1;if(bt<2&&out[i].v.match(/[Mm]/))bt=2;if(bt<3&&out[i].v.match(/[Ss]/))bt=3}}switch(bt){case 0:break;case 1:if(dt.u>=.5){dt.u=0;++dt.S}if(dt.S>=60){dt.S=0;++dt.M}if(dt.M>=60){dt.M=0;++dt.H}break;case 2:if(dt.u>=.5){dt.u=0;++dt.S}if(dt.S>=60){dt.S=0;++dt.M}break}var nstr=\"\",jj;for(i=0;i<out.length;++i){switch(out[i].t){case\"t\":case\"T\":case\" \":case\"D\":break;case\"X\":out[i]=undefined;break;case\"d\":case\"m\":case\"y\":case\"h\":case\"H\":case\"M\":case\"s\":case\"e\":case\"b\":case\"Z\":out[i].v=write_date(out[i].t.charCodeAt(0),out[i].v,dt,ss0);out[i].t=\"t\";break;case\"n\":case\"(\":case\"?\":jj=i+1;while(out[jj]!=null&&((c=out[jj].t)===\"?\"||c===\"D\"||(c===\" \"||c===\"t\")&&out[jj+1]!=null&&(out[jj+1].t===\"?\"||out[jj+1].t===\"t\"&&out[jj+1].v===\"/\")||out[i].t===\"(\"&&(c===\" \"||c===\"n\"||c===\")\")||c===\"t\"&&(out[jj].v===\"/\"||\"$€\".indexOf(out[jj].v)>-1||out[jj].v===\" \"&&out[jj+1]!=null&&out[jj+1].t==\"?\"))){out[i].v+=out[jj].v;out[jj]=undefined;++jj}nstr+=out[i].v;i=jj-1;break;case\"G\":out[i].t=\"t\";out[i].v=general_fmt(v,opts);break}}var vv=\"\",myv,ostr;if(nstr.length>0){myv=v<0&&nstr.charCodeAt(0)===45?-v:v;ostr=write_num(nstr.charCodeAt(0)===40?\"(\":\"n\",nstr,myv);jj=ostr.length-1;var decpt=out.length;for(i=0;i<out.length;++i)if(out[i]!=null&&out[i].v.indexOf(\".\")>-1){decpt=i;break}var lasti=out.length;if(decpt===out.length&&ostr.indexOf(\"E\")===-1){for(i=out.length-1;i>=0;--i){if(out[i]==null||\"n?(\".indexOf(out[i].t)===-1)continue;if(jj>=out[i].v.length-1){jj-=out[i].v.length;out[i].v=ostr.substr(jj+1,out[i].v.length)}else if(jj<0)out[i].v=\"\";else{out[i].v=ostr.substr(0,jj+1);jj=-1}out[i].t=\"t\";lasti=i}if(jj>=0&&lasti<out.length)out[lasti].v=ostr.substr(0,jj+1)+out[lasti].v}else if(decpt!==out.length&&ostr.indexOf(\"E\")===-1){jj=ostr.indexOf(\".\")-1;for(i=decpt;i>=0;--i){if(out[i]==null||\"n?(\".indexOf(out[i].t)===-1)continue;j=out[i].v.indexOf(\".\")>-1&&i===decpt?out[i].v.indexOf(\".\")-1:out[i].v.length-1;vv=out[i].v.substr(j+1);for(;j>=0;--j){if(jj>=0&&(out[i].v[j]===\"0\"||out[i].v[j]===\"#\"))vv=ostr[jj--]+vv}out[i].v=vv;out[i].t=\"t\";lasti=i}if(jj>=0&&lasti<out.length)out[lasti].v=ostr.substr(0,jj+1)+out[lasti].v;jj=ostr.indexOf(\".\")+1;for(i=decpt;i<out.length;++i){if(out[i]==null||\"n?(\".indexOf(out[i].t)===-1&&i!==decpt)continue;j=out[i].v.indexOf(\".\")>-1&&i===decpt?out[i].v.indexOf(\".\")+1:0;vv=out[i].v.substr(0,j);for(;j<out[i].v.length;++j){if(jj<ostr.length)vv+=ostr[jj++]}out[i].v=vv;out[i].t=\"t\";lasti=i}}}for(i=0;i<out.length;++i)if(out[i]!=null&&\"n(?\".indexOf(out[i].t)>-1){myv=flen>1&&v<0&&i>0&&out[i-1].v===\"-\"?-v:v;out[i].v=write_num(out[i].t,out[i].v,myv);out[i].t=\"t\"}var retval=\"\";for(i=0;i!==out.length;++i)if(out[i]!=null)retval+=out[i].v;return retval}SSF._eval=eval_fmt;var cfregex=/\\[[=<>]/;var cfregex2=/\\[([=<>]*)(-?\\d+\\.?\\d*)\\]/;function chkcond(v,rr){if(rr==null)return false;var thresh=parseFloat(rr[2]);switch(rr[1]){case\"=\":if(v==thresh)return true;break;case\">\":if(v>thresh)return true;break;case\"<\":if(v<thresh)return true;break;case\"<>\":if(v!=thresh)return true;break;case\">=\":if(v>=thresh)return true;break;case\"<=\":if(v<=thresh)return true;break}return false}function choose_fmt(f,v){var fmt=split_fmt(f);var l=fmt.length,lat=fmt[l-1].indexOf(\"@\");if(l<4&&lat>-1)--l;if(fmt.length>4)throw\"cannot find right format for |\"+fmt+\"|\";if(typeof v!==\"number\")return[4,fmt.length===4||lat>-1?fmt[fmt.length-1]:\"@\"];switch(fmt.length){case 1:fmt=lat>-1?[\"General\",\"General\",\"General\",fmt[0]]:[fmt[0],fmt[0],fmt[0],\"@\"];break;case 2:fmt=lat>-1?[fmt[0],fmt[0],fmt[0],fmt[1]]:[fmt[0],fmt[1],fmt[0],\"@\"];break;case 3:fmt=lat>-1?[fmt[0],fmt[1],fmt[0],fmt[2]]:[fmt[0],fmt[1],fmt[2],\"@\"];break;case 4:break}var ff=v>0?fmt[0]:v<0?fmt[1]:fmt[2];if(fmt[0].indexOf(\"[\")===-1&&fmt[1].indexOf(\"[\")===-1)return[l,ff];if(fmt[0].match(cfregex)!=null||fmt[1].match(cfregex)!=null){var m1=fmt[0].match(cfregex2);var m2=fmt[1].match(cfregex2);return chkcond(v,m1)?[l,fmt[0]]:chkcond(v,m2)?[l,fmt[1]]:[l,fmt[m1!=null&&m2!=null?2:1]]}return[l,ff]}function format(fmt,v,o){fixopts(o!=null?o:o=[]);var sfmt=\"\";switch(typeof fmt){case\"string\":sfmt=fmt;break;case\"number\":sfmt=(o.table!=null?o.table:table_fmt)[fmt];break}if(isgeneral(sfmt,0))return general_fmt(v,o);var f=choose_fmt(sfmt,v);if(isgeneral(f[1]))return general_fmt(v,o);if(v===true)v=\"TRUE\";else if(v===false)v=\"FALSE\";else if(v===\"\"||v==null)return\"\";return eval_fmt(f[1],v,o,f[0])}SSF._table=table_fmt;SSF.load=function load_entry(fmt,idx){table_fmt[idx]=fmt};SSF.format=format;SSF.get_table=function get_table(){return table_fmt};SSF.load_table=function load_table(tbl){for(var i=0;i!=392;++i)if(tbl[i]!==undefined)SSF.load(tbl[i],i)}};make_ssf(SSF);var XLMLFormatMap={\"General Number\":\"General\",\"General Date\":SSF._table[22],\"Long Date\":\"dddd, mmmm dd, yyyy\",\"Medium Date\":SSF._table[15],\"Short Date\":SSF._table[14],\"Long Time\":SSF._table[19],\"Medium Time\":SSF._table[18],\"Short Time\":SSF._table[20],Currency:'\"$\"#,##0.00_);[Red]\\\\(\"$\"#,##0.00\\\\)',Fixed:SSF._table[2],Standard:SSF._table[4],Percent:SSF._table[10],Scientific:SSF._table[11],\"Yes/No\":'\"Yes\";\"Yes\";\"No\";@',\"True/False\":'\"True\";\"True\";\"False\";@',\"On/Off\":'\"Yes\";\"Yes\";\"No\";@'};var DO_NOT_EXPORT_CFB=true;var CFB=function _CFB(){var exports={};exports.version=\"0.10.2\";function parse(file){var mver=3;var ssz=512;var nmfs=0;var ndfs=0;var dir_start=0;var minifat_start=0;var difat_start=0;var fat_addrs=[];var blob=file.slice(0,512);prep_blob(blob,0);var mv=check_get_mver(blob);mver=mv[0];switch(mver){case 3:ssz=512;break;case 4:ssz=4096;break;default:throw\"Major Version: Expected 3 or 4 saw \"+mver}if(ssz!==512){blob=file.slice(0,ssz);prep_blob(blob,28)}var header=file.slice(0,ssz);check_shifts(blob,mver);var nds=blob.read_shift(4,\"i\");if(mver===3&&nds!==0)throw\"# Directory Sectors: Expected 0 saw \"+nds;blob.l+=4;dir_start=blob.read_shift(4,\"i\");blob.l+=4;blob.chk(\"00100000\",\"Mini Stream Cutoff Size: \");minifat_start=blob.read_shift(4,\"i\");nmfs=blob.read_shift(4,\"i\");difat_start=blob.read_shift(4,\"i\");ndfs=blob.read_shift(4,\"i\");for(var q,j=0;j<109;++j){q=blob.read_shift(4,\"i\");if(q<0)break;fat_addrs[j]=q}var sectors=sectorify(file,ssz);sleuth_fat(difat_start,ndfs,sectors,ssz,fat_addrs);var sector_list=make_sector_list(sectors,dir_start,fat_addrs,ssz);sector_list[dir_start].name=\"!Directory\";if(nmfs>0&&minifat_start!==ENDOFCHAIN)sector_list[minifat_start].name=\"!MiniFAT\";sector_list[fat_addrs[0]].name=\"!FAT\";sector_list.fat_addrs=fat_addrs;sector_list.ssz=ssz;var files={},Paths=[],FileIndex=[],FullPaths=[],FullPathDir={};read_directory(dir_start,sector_list,sectors,Paths,nmfs,files,FileIndex);build_full_paths(FileIndex,FullPathDir,FullPaths,Paths);var root_name=Paths.shift();Paths.root=root_name;var find_path=make_find_path(FullPaths,Paths,FileIndex,files,root_name);return{raw:{header:header,sectors:sectors},FileIndex:FileIndex,FullPaths:FullPaths,FullPathDir:FullPathDir,find:find_path}}function check_get_mver(blob){blob.chk(HEADER_SIGNATURE,\"Header Signature: \");blob.chk(HEADER_CLSID,\"CLSID: \");var mver=blob.read_shift(2,\"u\");return[blob.read_shift(2,\"u\"),mver]}function check_shifts(blob,mver){var shift=9;blob.chk(\"feff\",\"Byte Order: \");switch(shift=blob.read_shift(2)){case 9:if(mver!==3)throw\"MajorVersion/SectorShift Mismatch\";break;case 12:if(mver!==4)throw\"MajorVersion/SectorShift Mismatch\";break;default:throw\"Sector Shift: Expected 9 or 12 saw \"+shift}blob.chk(\"0600\",\"Mini Sector Shift: \");blob.chk(\"000000000000\",\"Reserved: \")}function sectorify(file,ssz){var nsectors=Math.ceil(file.length/ssz)-1;var sectors=new Array(nsectors);for(var i=1;i<nsectors;++i)sectors[i-1]=file.slice(i*ssz,(i+1)*ssz);sectors[nsectors-1]=file.slice(nsectors*ssz);return sectors}function build_full_paths(FI,FPD,FP,Paths){var i=0,L=0,R=0,C=0,j=0,pl=Paths.length;var dad=new Array(pl),q=new Array(pl);for(;i<pl;++i){dad[i]=q[i]=i;FP[i]=Paths[i]}for(;j<q.length;++j){i=q[j];L=FI[i].L;R=FI[i].R;C=FI[i].C;if(dad[i]===i){if(L!==-1&&dad[L]!==L)dad[i]=dad[L];if(R!==-1&&dad[R]!==R)dad[i]=dad[R]}if(C!==-1)dad[C]=i;if(L!==-1){dad[L]=dad[i];q.push(L)}if(R!==-1){dad[R]=dad[i];q.push(R)}}for(i=1;i!==pl;++i)if(dad[i]===i){if(R!==-1&&dad[R]!==R)dad[i]=dad[R];else if(L!==-1&&dad[L]!==L)dad[i]=dad[L]}for(i=1;i<pl;++i){if(FI[i].type===0)continue;j=dad[i];if(j===0)FP[i]=FP[0]+\"/\"+FP[i];else while(j!==0){FP[i]=FP[j]+\"/\"+FP[i];j=dad[j]}dad[i]=0}FP[0]+=\"/\";for(i=1;i<pl;++i){if(FI[i].type!==2)FP[i]+=\"/\";FPD[FP[i]]=FI[i]}}function make_find_path(FullPaths,Paths,FileIndex,files,root_name){var UCFullPaths=new Array(FullPaths.length);var UCPaths=new Array(Paths.length),i;for(i=0;i<FullPaths.length;++i)UCFullPaths[i]=FullPaths[i].toUpperCase().replace(chr0,\"\").replace(chr1,\"!\");for(i=0;i<Paths.length;++i)UCPaths[i]=Paths[i].toUpperCase().replace(chr0,\"\").replace(chr1,\"!\");return function find_path(path){var k;if(path.charCodeAt(0)===47){k=true;path=root_name+path}else k=path.indexOf(\"/\")!==-1;var UCPath=path.toUpperCase().replace(chr0,\"\").replace(chr1,\"!\");var w=k===true?UCFullPaths.indexOf(UCPath):UCPaths.indexOf(UCPath);if(w===-1)return null;return k===true?FileIndex[w]:files[Paths[w]]}}function sleuth_fat(idx,cnt,sectors,ssz,fat_addrs){var q;if(idx===ENDOFCHAIN){if(cnt!==0)throw\"DIFAT chain shorter than expected\"}else if(idx!==-1){var sector=sectors[idx],m=(ssz>>>2)-1;for(var i=0;i<m;++i){if((q=__readInt32LE(sector,i*4))===ENDOFCHAIN)break;fat_addrs.push(q)}sleuth_fat(__readInt32LE(sector,ssz-4),cnt-1,sectors,ssz,fat_addrs)}}function get_sector_list(sectors,start,fat_addrs,ssz,chkd){var sl=sectors.length;var buf,buf_chain;if(!chkd)chkd=new Array(sl);var modulus=ssz-1,j,jj;buf=[];buf_chain=[];for(j=start;j>=0;){chkd[j]=true;buf[buf.length]=j;buf_chain.push(sectors[j]);var addr=fat_addrs[Math.floor(j*4/ssz)];jj=j*4&modulus;if(ssz<4+jj)throw\"FAT boundary crossed: \"+j+\" 4 \"+ssz;j=__readInt32LE(sectors[addr],jj)}return{nodes:buf,data:__toBuffer([buf_chain])}}function make_sector_list(sectors,dir_start,fat_addrs,ssz){var sl=sectors.length,sector_list=new Array(sl);var chkd=new Array(sl),buf,buf_chain;var modulus=ssz-1,i,j,k,jj;for(i=0;i<sl;++i){buf=[];k=i+dir_start;if(k>=sl)k-=sl;if(chkd[k]===true)continue;buf_chain=[];for(j=k;j>=0;){chkd[j]=true;buf[buf.length]=j;buf_chain.push(sectors[j]);var addr=fat_addrs[Math.floor(j*4/ssz)];jj=j*4&modulus;if(ssz<4+jj)throw\"FAT boundary crossed: \"+j+\" 4 \"+ssz;j=__readInt32LE(sectors[addr],jj)}sector_list[k]={nodes:buf,data:__toBuffer([buf_chain])}}return sector_list}function read_directory(dir_start,sector_list,sectors,Paths,nmfs,files,FileIndex){var blob;var minifat_store=0,pl=Paths.length?2:0;var sector=sector_list[dir_start].data;var i=0,namelen=0,name,o,ctime,mtime;for(;i<sector.length;i+=128){blob=sector.slice(i,i+128);prep_blob(blob,64);namelen=blob.read_shift(2);if(namelen===0)continue;name=__utf16le(blob,0,namelen-pl);Paths.push(name);o={name:name,type:blob.read_shift(1),color:blob.read_shift(1),L:blob.read_shift(4,\"i\"),R:blob.read_shift(4,\"i\"),C:blob.read_shift(4,\"i\"),clsid:blob.read_shift(16),state:blob.read_shift(4,\"i\")};ctime=blob.read_shift(2)+blob.read_shift(2)+blob.read_shift(2)+blob.read_shift(2);if(ctime!==0){o.ctime=ctime;o.ct=read_date(blob,blob.l-8)}mtime=blob.read_shift(2)+blob.read_shift(2)+blob.read_shift(2)+blob.read_shift(2);if(mtime!==0){o.mtime=mtime;o.mt=read_date(blob,blob.l-8)}o.start=blob.read_shift(4,\"i\");o.size=blob.read_shift(4,\"i\");if(o.type===5){minifat_store=o.start;if(nmfs>0&&minifat_store!==ENDOFCHAIN)sector_list[minifat_store].name=\"!StreamData\"}else if(o.size>=4096){o.storage=\"fat\";if(sector_list[o.start]===undefined)sector_list[o.start]=get_sector_list(sectors,o.start,sector_list.fat_addrs,sector_list.ssz);sector_list[o.start].name=o.name;o.content=sector_list[o.start].data.slice(0,o.size);prep_blob(o.content,0)}else{o.storage=\"minifat\";if(minifat_store!==ENDOFCHAIN&&o.start!==ENDOFCHAIN){o.content=sector_list[minifat_store].data.slice(o.start*MSSZ,o.start*MSSZ+o.size);prep_blob(o.content,0)}}files[name]=o;FileIndex.push(o)}}function read_date(blob,offset){return new Date((__readUInt32LE(blob,offset+4)/1e7*Math.pow(2,32)+__readUInt32LE(blob,offset)/1e7-11644473600)*1e3)}var fs;function readFileSync(filename,options){if(fs===undefined)fs=require(\"fs\");return parse(fs.readFileSync(filename),options)}function readSync(blob,options){switch(options!==undefined&&options.type!==undefined?options.type:\"base64\"){case\"file\":return readFileSync(blob,options);case\"base64\":return parse(s2a(Base64.decode(blob)),options);case\"binary\":return parse(s2a(blob),options)}return parse(blob)}var MSSZ=64;var ENDOFCHAIN=-2;var HEADER_SIGNATURE=\"d0cf11e0a1b11ae1\";var HEADER_CLSID=\"00000000000000000000000000000000\";var consts={MAXREGSECT:-6,DIFSECT:-4,FATSECT:-3,ENDOFCHAIN:ENDOFCHAIN,FREESECT:-1,HEADER_SIGNATURE:HEADER_SIGNATURE,HEADER_MINOR_VERSION:\"3e00\",MAXREGSID:-6,NOSTREAM:-1,HEADER_CLSID:HEADER_CLSID,EntryTypes:[\"unknown\",\"storage\",\"stream\",\"lockbytes\",\"property\",\"root\"]};exports.read=readSync;exports.parse=parse;exports.utils={ReadShift:ReadShift,CheckField:CheckField,prep_blob:prep_blob,bconcat:bconcat,consts:consts};return exports}();if(typeof require!==\"undefined\"&&typeof module!==\"undefined\"&&typeof DO_NOT_EXPORT_CFB===\"undefined\"){module.exports=CFB}function isval(x){return x!==undefined&&x!==null}function keys(o){return Object.keys(o)}function evert_key(obj,key){var o=[],K=keys(obj);for(var i=0;i!==K.length;++i)o[obj[K[i]][key]]=K[i];return o}function evert(obj){var o=[],K=keys(obj);for(var i=0;i!==K.length;++i)o[obj[K[i]]]=K[i];return o}function evert_num(obj){var o=[],K=keys(obj);for(var i=0;i!==K.length;++i)o[obj[K[i]]]=parseInt(K[i],10);return o}function evert_arr(obj){var o=[],K=keys(obj);for(var i=0;i!==K.length;++i){if(o[obj[K[i]]]==null)o[obj[K[i]]]=[];o[obj[K[i]]].push(K[i])}return o}function datenum(v,date1904){if(date1904)v+=1462;var epoch=Date.parse(v);return(epoch+22091616e5)/(24*60*60*1e3)}function cc2str(arr){var o=\"\";for(var i=0;i!=arr.length;++i)o+=String.fromCharCode(arr[i]);return o}function getdata(data){if(!data)return null;if(data.name.substr(-4)===\".bin\"){if(data.data)return char_codes(data.data);if(data.asNodeBuffer&&has_buf)return data.asNodeBuffer();if(data._data&&data._data.getContent)return Array.prototype.slice.call(data._data.getContent())}else{if(data.data)return data.name.substr(-4)!==\".bin\"?debom_xml(data.data):char_codes(data.data);if(data.asNodeBuffer&&has_buf)return debom_xml(data.asNodeBuffer().toString(\"binary\"));if(data.asBinary)return debom_xml(data.asBinary());if(data._data&&data._data.getContent)return debom_xml(cc2str(Array.prototype.slice.call(data._data.getContent(),0)))}return null}function safegetzipfile(zip,file){var f=file;if(zip.files[f])return zip.files[f];f=file.toLowerCase();if(zip.files[f])return zip.files[f];f=f.replace(/\\//g,\"\\\\\");if(zip.files[f])return zip.files[f];return null}function getzipfile(zip,file){var o=safegetzipfile(zip,file);if(o==null)throw new Error(\"Cannot find file \"+file+\" in zip\");return o}function getzipdata(zip,file,safe){if(!safe)return getdata(getzipfile(zip,file));if(!file)return null;try{return getzipdata(zip,file)}catch(e){return null}}var _fs,jszip;if(typeof JSZip!==\"undefined\")jszip=JSZip;if(typeof exports!==\"undefined\"){if(typeof module!==\"undefined\"&&module.exports){if(has_buf&&typeof jszip===\"undefined\")jszip=require(\"js\"+\"zip\");if(typeof jszip===\"undefined\")jszip=require(\"./js\"+\"zip\").JSZip;_fs=require(\"f\"+\"s\")}}var attregexg=/([\\w:]+)=((?:\")([^\"]*)(?:\")|(?:')([^']*)(?:'))/g;var tagregex=/<[^>]*>/g;var nsregex=/<\\w*:/,nsregex2=/<(\\/?)\\w+:/;function parsexmltag(tag,skip_root){var z=[];var eq=0,c=0;for(;eq!==tag.length;++eq)if((c=tag.charCodeAt(eq))===32||c===10||c===13)break;if(!skip_root)z[0]=tag.substr(0,eq);if(eq===tag.length)return z;var m=tag.match(attregexg),j=0,w=\"\",v=\"\",i=0,q=\"\",cc=\"\";if(m)for(i=0;i!=m.length;++i){cc=m[i];for(c=0;c!=cc.length;++c)if(cc.charCodeAt(c)===61)break;q=cc.substr(0,c);v=cc.substring(c+2,cc.length-1);for(j=0;j!=q.length;++j)if(q.charCodeAt(j)===58)break;if(j===q.length)z[q]=v;else z[(j===5&&q.substr(0,5)===\"xmlns\"?\"xmlns\":\"\")+q.substr(j+1)]=v}return z}function strip_ns(x){return x.replace(nsregex2,\"<$1\")}var encodings={\"&quot;\":'\"',\"&apos;\":\"'\",\"&gt;\":\">\",\"&lt;\":\"<\",\"&amp;\":\"&\"};var rencoding=evert(encodings);var rencstr=\"&<>'\\\"\".split(\"\");var unescapexml=function(){var encregex=/&[a-z]*;/g,coderegex=/_x([\\da-fA-F]+)_/g;return function unescapexml(text){var s=text+\"\";return s.replace(encregex,function($$){return encodings[$$]}).replace(coderegex,function(m,c){return String.fromCharCode(parseInt(c,16))})}}();var decregex=/[&<>'\"]/g,charegex=/[\\u0000-\\u0008\\u000b-\\u001f]/g;function escapexml(text){var s=text+\"\";return s.replace(decregex,function(y){return rencoding[y]}).replace(charegex,function(s){return\"_x\"+(\"000\"+s.charCodeAt(0).toString(16)).substr(-4)+\"_\"})}var xlml_fixstr=function(){var entregex=/&#(\\d+);/g;function entrepl($$,$1){return String.fromCharCode(parseInt($1,10))}return function xlml_fixstr(str){return str.replace(entregex,entrepl)}}();function parsexmlbool(value,tag){switch(value){case\"1\":case\"true\":case\"TRUE\":return true;default:return false}}var utf8read=function utf8reada(orig){var out=\"\",i=0,c=0,d=0,e=0,f=0,w=0;while(i<orig.length){c=orig.charCodeAt(i++);if(c<128){out+=String.fromCharCode(c);continue}d=orig.charCodeAt(i++);if(c>191&&c<224){out+=String.fromCharCode((c&31)<<6|d&63);continue}e=orig.charCodeAt(i++);if(c<240){out+=String.fromCharCode((c&15)<<12|(d&63)<<6|e&63);continue}f=orig.charCodeAt(i++);w=((c&7)<<18|(d&63)<<12|(e&63)<<6|f&63)-65536;out+=String.fromCharCode(55296+(w>>>10&1023));out+=String.fromCharCode(56320+(w&1023))}return out};if(has_buf){var utf8readb=function utf8readb(data){var out=new Buffer(2*data.length),w,i,j=1,k=0,ww=0,c;for(i=0;i<data.length;i+=j){j=1;if((c=data.charCodeAt(i))<128)w=c;else if(c<224){w=(c&31)*64+(data.charCodeAt(i+1)&63);j=2}else if(c<240){w=(c&15)*4096+(data.charCodeAt(i+1)&63)*64+(data.charCodeAt(i+2)&63);j=3}else{j=4;w=(c&7)*262144+(data.charCodeAt(i+1)&63)*4096+(data.charCodeAt(i+2)&63)*64+(data.charCodeAt(i+3)&63);w-=65536;ww=55296+(w>>>10&1023);w=56320+(w&1023)}if(ww!==0){out[k++]=ww&255;out[k++]=ww>>>8;ww=0}out[k++]=w%256;out[k++]=w>>>8}out.length=k;return out.toString(\"ucs2\")};var corpus=\"foo bar bazâð£\";if(utf8read(corpus)==utf8readb(corpus))utf8read=utf8readb;var utf8readc=function utf8readc(data){return Buffer(data,\"binary\").toString(\"utf8\")};if(utf8read(corpus)==utf8readc(corpus))utf8read=utf8readc}var matchtag=function(){var mtcache={};return function matchtag(f,g){var t=f+\"|\"+g;if(mtcache[t]!==undefined)return mtcache[t];return mtcache[t]=new RegExp(\"<(?:\\\\w+:)?\"+f+'(?: xml:space=\"preserve\")?(?:[^>]*)>([^☃]*)</(?:\\\\w+:)?'+f+\">\",g||\"\")}}();var vtregex=function(){var vt_cache={};return function vt_regex(bt){if(vt_cache[bt]!==undefined)return vt_cache[bt];return vt_cache[bt]=new RegExp(\"<vt:\"+bt+\">(.*?)</vt:\"+bt+\">\",\"g\")}}();var vtvregex=/<\\/?vt:variant>/g,vtmregex=/<vt:([^>]*)>(.*)</;function parseVector(data){var h=parsexmltag(data);var matches=data.match(vtregex(h.baseType))||[];if(matches.length!=h.size)throw\"unexpected vector length \"+matches.length+\" != \"+h.size;var res=[];matches.forEach(function(x){var v=x.replace(vtvregex,\"\").match(vtmregex);res.push({v:v[2],t:v[1]})});return res}var wtregex=/(^\\s|\\s$|\\n)/;function writetag(f,g){return\"<\"+f+(g.match(wtregex)?' xml:space=\"preserve\"':\"\")+\">\"+g+\"</\"+f+\">\"}function wxt_helper(h){return keys(h).map(function(k){return\" \"+k+'=\"'+h[k]+'\"'}).join(\"\")}function writextag(f,g,h){return\"<\"+f+(isval(h)?wxt_helper(h):\"\")+(isval(g)?(g.match(wtregex)?' xml:space=\"preserve\"':\"\")+\">\"+g+\"</\"+f:\"/\")+\">\"}function write_w3cdtf(d,t){try{return d.toISOString().replace(/\\.\\d*/,\"\")}catch(e){if(t)throw e}}function write_vt(s){switch(typeof s){case\"string\":return writextag(\"vt:lpwstr\",s);case\"number\":return writextag((s|0)==s?\"vt:i4\":\"vt:r8\",String(s));case\"boolean\":return writextag(\"vt:bool\",s?\"true\":\"false\")}if(s instanceof Date)return writextag(\"vt:filetime\",write_w3cdtf(s));throw new Error(\"Unable to serialize \"+s)}var XML_HEADER='<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\\r\\n';var XMLNS={dc:\"http://purl.org/dc/elements/1.1/\",dcterms:\"http://purl.org/dc/terms/\",dcmitype:\"http://purl.org/dc/dcmitype/\",mx:\"http://schemas.microsoft.com/office/mac/excel/2008/main\",r:\"http://schemas.openxmlformats.org/officeDocument/2006/relationships\",sjs:\"http://schemas.openxmlformats.org/package/2006/sheetjs/core-properties\",vt:\"http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes\",xsi:\"http://www.w3.org/2001/XMLSchema-instance\",xsd:\"http://www.w3.org/2001/XMLSchema\"};XMLNS.main=[\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\",\"http://purl.oclc.org/ooxml/spreadsheetml/main\",\"http://schemas.microsoft.com/office/excel/2006/main\",\"http://schemas.microsoft.com/office/excel/2006/2\"];function readIEEE754(buf,idx,isLE,nl,ml){if(isLE===undefined)isLE=true;if(!nl)nl=8;if(!ml&&nl===8)ml=52;var e,m,el=nl*8-ml-1,eMax=(1<<el)-1,eBias=eMax>>1;var bits=-7,d=isLE?-1:1,i=isLE?nl-1:0,s=buf[idx+i];i+=d;e=s&(1<<-bits)-1;s>>>=-bits;bits+=el;for(;bits>0;e=e*256+buf[idx+i],i+=d,bits-=8);m=e&(1<<-bits)-1;e>>>=-bits;bits+=ml;for(;bits>0;m=m*256+buf[idx+i],i+=d,bits-=8);if(e===eMax)return m?NaN:(s?-1:1)*Infinity;else if(e===0)e=1-eBias;else{m=m+Math.pow(2,ml);e=e-eBias}return(s?-1:1)*m*Math.pow(2,e-ml)}var __toBuffer,___toBuffer;__toBuffer=___toBuffer=function toBuffer_(bufs){var x=[];for(var i=0;i<bufs[0].length;++i){x.push.apply(x,bufs[0][i])}return x};var __utf16le,___utf16le;__utf16le=___utf16le=function utf16le_(b,s,e){var ss=[];for(var i=s;i<e;i+=2)ss.push(String.fromCharCode(__readUInt16LE(b,i)));return ss.join(\"\")};var __hexlify,___hexlify;__hexlify=___hexlify=function hexlify_(b,s,l){return b.slice(s,s+l).map(function(x){return(x<16?\"0\":\"\")+x.toString(16)}).join(\"\")};var __utf8,___utf8;__utf8=___utf8=function(b,s,e){var ss=[];for(var i=s;i<e;i++)ss.push(String.fromCharCode(__readUInt8(b,i)));return ss.join(\"\")};var __lpstr,___lpstr;__lpstr=___lpstr=function lpstr_(b,i){var len=__readUInt32LE(b,i);return len>0?__utf8(b,i+4,i+4+len-1):\"\"};var __lpwstr,___lpwstr;__lpwstr=___lpwstr=function lpwstr_(b,i){var len=2*__readUInt32LE(b,i);return len>0?__utf8(b,i+4,i+4+len-1):\"\"};var __double,___double;__double=___double=function(b,idx){return readIEEE754(b,idx)};var is_buf=function is_buf_a(a){return Array.isArray(a)};if(has_buf){__utf16le=function utf16le_b(b,s,e){if(!Buffer.isBuffer(b))return ___utf16le(b,s,e);return b.toString(\"utf16le\",s,e)};__hexlify=function(b,s,l){return Buffer.isBuffer(b)?b.toString(\"hex\",s,s+l):___hexlify(b,s,l)};__lpstr=function lpstr_b(b,i){if(!Buffer.isBuffer(b))return ___lpstr(b,i);var len=b.readUInt32LE(i);return len>0?b.toString(\"utf8\",i+4,i+4+len-1):\"\"};__lpwstr=function lpwstr_b(b,i){if(!Buffer.isBuffer(b))return ___lpwstr(b,i);var len=2*b.readUInt32LE(i);return b.toString(\"utf16le\",i+4,i+4+len-1)};__utf8=function utf8_b(s,e){return this.toString(\"utf8\",s,e)};__toBuffer=function(bufs){return bufs[0].length>0&&Buffer.isBuffer(bufs[0][0])?Buffer.concat(bufs[0]):___toBuffer(bufs)};bconcat=function(bufs){return Buffer.isBuffer(bufs[0])?Buffer.concat(bufs):[].concat.apply([],bufs)};__double=function double_(b,i){if(Buffer.isBuffer(b))return b.readDoubleLE(i);return ___double(b,i)};is_buf=function is_buf_b(a){return Buffer.isBuffer(a)||Array.isArray(a)}}if(typeof cptable!==\"undefined\"){__utf16le=function(b,s,e){return cptable.utils.decode(1200,b.slice(s,e))};__utf8=function(b,s,e){return cptable.utils.decode(65001,b.slice(s,e))};__lpstr=function(b,i){var len=__readUInt32LE(b,i);return len>0?cptable.utils.decode(current_codepage,b.slice(i+4,i+4+len-1)):\"\"};__lpwstr=function(b,i){var len=2*__readUInt32LE(b,i);return len>0?cptable.utils.decode(1200,b.slice(i+4,i+4+len-1)):\"\"}}var __readUInt8=function(b,idx){return b[idx]};var __readUInt16LE=function(b,idx){return b[idx+1]*(1<<8)+b[idx]};var __readInt16LE=function(b,idx){var u=b[idx+1]*(1<<8)+b[idx];return u<32768?u:(65535-u+1)*-1};var __readUInt32LE=function(b,idx){return b[idx+3]*(1<<24)+(b[idx+2]<<16)+(b[idx+1]<<8)+b[idx]};var __readInt32LE=function(b,idx){return b[idx+3]<<24|b[idx+2]<<16|b[idx+1]<<8|b[idx]};var ___unhexlify=function(s){return s.match(/../g).map(function(x){return parseInt(x,16)})};var __unhexlify=typeof Buffer!==\"undefined\"?function(s){return Buffer.isBuffer(s)?new Buffer(s,\"hex\"):___unhexlify(s)}:___unhexlify;function ReadShift(size,t){var o=\"\",oI,oR,oo=[],w,vv,i,loc;switch(t){case\"dbcs\":loc=this.l;if(has_buf&&Buffer.isBuffer(this))o=this.slice(this.l,this.l+2*size).toString(\"utf16le\");else for(i=0;i!=size;++i){o+=String.fromCharCode(__readUInt16LE(this,loc));loc+=2}size*=2;break;case\"utf8\":o=__utf8(this,this.l,this.l+size);break;case\"utf16le\":size*=2;o=__utf16le(this,this.l,this.l+size);break;case\"lpstr\":o=__lpstr(this,this.l);size=5+o.length;break;case\"lpwstr\":o=__lpwstr(this,this.l);size=5+o.length;if(o[o.length-1]==\"\\x00\")size+=2;break;case\"cstr\":size=0;o=\"\";while((w=__readUInt8(this,this.l+size++))!==0)oo.push(_getchar(w));o=oo.join(\"\");break;case\"wstr\":size=0;o=\"\";while((w=__readUInt16LE(this,this.l+size))!==0){oo.push(_getchar(w));size+=2}size+=2;o=oo.join(\"\");break;case\"dbcs-cont\":o=\"\";loc=this.l;for(i=0;i!=size;++i){if(this.lens&&this.lens.indexOf(loc)!==-1){w=__readUInt8(this,loc);this.l=loc+1;vv=ReadShift.call(this,size-i,w?\"dbcs-cont\":\"sbcs-cont\");return oo.join(\"\")+vv}oo.push(_getchar(__readUInt16LE(this,loc)));loc+=2}o=oo.join(\"\");size*=2;break;case\"sbcs-cont\":o=\"\";loc=this.l;for(i=0;i!=size;++i){if(this.lens&&this.lens.indexOf(loc)!==-1){w=__readUInt8(this,loc);this.l=loc+1;vv=ReadShift.call(this,size-i,w?\"dbcs-cont\":\"sbcs-cont\");return oo.join(\"\")+vv}oo.push(_getchar(__readUInt8(this,loc)));loc+=1}o=oo.join(\"\");break;default:switch(size){case 1:oI=__readUInt8(this,this.l);this.l++;return oI;case 2:oI=(t===\"i\"?__readInt16LE:__readUInt16LE)(this,this.l);this.l+=2;return oI;case 4:if(t===\"i\"||(this[this.l+3]&128)===0){oI=__readInt32LE(this,this.l);this.l+=4;return oI}else{oR=__readUInt32LE(this,this.l);this.l+=4;return oR}break;case 8:if(t===\"f\"){oR=__double(this,this.l);this.l+=8;return oR}case 16:o=__hexlify(this,this.l,size);break}}this.l+=size;return o}function WriteShift(t,val,f){var size,i;if(f===\"dbcs\"){for(i=0;i!=val.length;++i)this.writeUInt16LE(val.charCodeAt(i),this.l+2*i);size=2*val.length}else switch(t){case 1:size=1;this[this.l]=val&255;break;case 3:size=3;this[this.l+2]=val&255;val>>>=8;\nthis[this.l+1]=val&255;val>>>=8;this[this.l]=val&255;break;case 4:size=4;this.writeUInt32LE(val,this.l);break;case 8:size=8;if(f===\"f\"){this.writeDoubleLE(val,this.l);break}case 16:break;case-4:size=4;this.writeInt32LE(val,this.l);break}this.l+=size;return this}function CheckField(hexstr,fld){var m=__hexlify(this,this.l,hexstr.length>>1);if(m!==hexstr)throw fld+\"Expected \"+hexstr+\" saw \"+m;this.l+=hexstr.length>>1}function prep_blob(blob,pos){blob.l=pos;blob.read_shift=ReadShift;blob.chk=CheckField;blob.write_shift=WriteShift}function parsenoop(blob,length){blob.l+=length}function writenoop(blob,length){blob.l+=length}function new_buf(sz){var o=new_raw_buf(sz);prep_blob(o,0);return o}function recordhopper(data,cb,opts){var tmpbyte,cntbyte,length;prep_blob(data,data.l||0);while(data.l<data.length){var RT=data.read_shift(1);if(RT&128)RT=(RT&127)+((data.read_shift(1)&127)<<7);var R=XLSBRecordEnum[RT]||XLSBRecordEnum[65535];tmpbyte=data.read_shift(1);length=tmpbyte&127;for(cntbyte=1;cntbyte<4&&tmpbyte&128;++cntbyte)length+=((tmpbyte=data.read_shift(1))&127)<<7*cntbyte;var d=R.f(data,length,opts);if(cb(d,R,RT))return}}function buf_array(){var bufs=[],blksz=2048;var newblk=function ba_newblk(sz){var o=new_buf(sz);prep_blob(o,0);return o};var curbuf=newblk(blksz);var endbuf=function ba_endbuf(){curbuf.length=curbuf.l;if(curbuf.length>0)bufs.push(curbuf);curbuf=null};var next=function ba_next(sz){if(sz<curbuf.length-curbuf.l)return curbuf;endbuf();return curbuf=newblk(Math.max(sz+1,blksz))};var end=function ba_end(){endbuf();return __toBuffer([bufs])};var push=function ba_push(buf){endbuf();curbuf=buf;next(blksz)};return{next:next,push:push,end:end,_bufs:bufs}}function write_record(ba,type,payload,length){var t=evert_RE[type],l;if(!length)length=XLSBRecordEnum[t].p||(payload||[]).length||0;l=1+(t>=128?1:0)+1+length;if(length>=128)++l;if(length>=16384)++l;if(length>=2097152)++l;var o=ba.next(l);if(t<=127)o.write_shift(1,t);else{o.write_shift(1,(t&127)+128);o.write_shift(1,t>>7)}for(var i=0;i!=4;++i){if(length>=128){o.write_shift(1,(length&127)+128);length>>=7}else{o.write_shift(1,length);break}}if(length>0&&is_buf(payload))ba.push(payload)}function shift_cell_xls(cell,tgt){if(tgt.s){if(cell.cRel)cell.c+=tgt.s.c;if(cell.rRel)cell.r+=tgt.s.r}else{cell.c+=tgt.c;cell.r+=tgt.r}cell.cRel=cell.rRel=0;while(cell.c>=256)cell.c-=256;while(cell.r>=65536)cell.r-=65536;return cell}function shift_range_xls(cell,range){cell.s=shift_cell_xls(cell.s,range.s);cell.e=shift_cell_xls(cell.e,range.s);return cell}var OFFCRYPTO={};var make_offcrypto=function(O,_crypto){var crypto;if(typeof _crypto!==\"undefined\")crypto=_crypto;else if(typeof require!==\"undefined\"){try{crypto=require(\"cry\"+\"pto\")}catch(e){crypto=null}}O.rc4=function(key,data){var S=new Array(256);var c=0,i=0,j=0,t=0;for(i=0;i!=256;++i)S[i]=i;for(i=0;i!=256;++i){j=j+S[i]+key[i%key.length].charCodeAt(0)&255;t=S[i];S[i]=S[j];S[j]=t}i=j=0;out=Buffer(data.length);for(c=0;c!=data.length;++c){i=i+1&255;j=(j+S[i])%256;t=S[i];S[i]=S[j];S[j]=t;out[c]=data[c]^S[S[i]+S[j]&255]}return out};if(crypto){O.md5=function(hex){return crypto.createHash(\"md5\").update(hex).digest(\"hex\")}}else{O.md5=function(hex){throw\"unimplemented\"}}};make_offcrypto(OFFCRYPTO,typeof crypto!==\"undefined\"?crypto:undefined);function parse_StrRun(data,length){return{ich:data.read_shift(2),ifnt:data.read_shift(2)}}function parse_RichStr(data,length){var start=data.l;var flags=data.read_shift(1);var str=parse_XLWideString(data);var rgsStrRun=[];var z={t:str,h:str};if((flags&1)!==0){var dwSizeStrRun=data.read_shift(4);for(var i=0;i!=dwSizeStrRun;++i)rgsStrRun.push(parse_StrRun(data));z.r=rgsStrRun}else z.r=\"<t>\"+escapexml(str)+\"</t>\";if((flags&2)!==0){}data.l=start+length;return z}function write_RichStr(str,o){if(o==null)o=new_buf(5+2*str.t.length);o.write_shift(1,0);write_XLWideString(str.t,o);return o}function parse_XLSBCell(data){var col=data.read_shift(4);var iStyleRef=data.read_shift(2);iStyleRef+=data.read_shift(1)<<16;var fPhShow=data.read_shift(1);return{c:col,iStyleRef:iStyleRef}}function write_XLSBCell(cell,o){if(o==null)o=new_buf(8);o.write_shift(-4,cell.c);o.write_shift(3,cell.iStyleRef===undefined?cell.iStyleRef:cell.s);o.write_shift(1,0);return o}function parse_XLSBCodeName(data,length){return parse_XLWideString(data,length)}function parse_XLNullableWideString(data){var cchCharacters=data.read_shift(4);return cchCharacters===0||cchCharacters===4294967295?\"\":data.read_shift(cchCharacters,\"dbcs\")}function write_XLNullableWideString(data,o){if(!o)o=new_buf(127);o.write_shift(4,data.length>0?data.length:4294967295);if(data.length>0)o.write_shift(0,data,\"dbcs\");return o}function parse_XLWideString(data){var cchCharacters=data.read_shift(4);return cchCharacters===0?\"\":data.read_shift(cchCharacters,\"dbcs\")}function write_XLWideString(data,o){if(o==null)o=new_buf(4+2*data.length);o.write_shift(4,data.length);if(data.length>0)o.write_shift(0,data,\"dbcs\");return o}var parse_RelID=parse_XLNullableWideString;var write_RelID=write_XLNullableWideString;function parse_RkNumber(data){var b=data.slice(data.l,data.l+4);var fX100=b[0]&1,fInt=b[0]&2;data.l+=4;b[0]&=252;var RK=fInt===0?__double([0,0,0,0,b[0],b[1],b[2],b[3]],0):__readInt32LE(b,0)>>2;return fX100?RK/100:RK}function parse_UncheckedRfX(data){var cell={s:{},e:{}};cell.s.r=data.read_shift(4);cell.e.r=data.read_shift(4);cell.s.c=data.read_shift(4);cell.e.c=data.read_shift(4);return cell}function write_UncheckedRfX(r,o){if(!o)o=new_buf(16);o.write_shift(4,r.s.r);o.write_shift(4,r.e.r);o.write_shift(4,r.s.c);o.write_shift(4,r.e.c);return o}function parse_Xnum(data,length){return data.read_shift(8,\"f\")}function write_Xnum(data,o){return(o||new_buf(8)).write_shift(8,\"f\",data)}var BErr={0:\"#NULL!\",7:\"#DIV/0!\",15:\"#VALUE!\",23:\"#REF!\",29:\"#NAME?\",36:\"#NUM!\",42:\"#N/A\",43:\"#GETTING_DATA\",255:\"#WTF?\"};var RBErr=evert_num(BErr);function parse_BrtColor(data,length){var out={};var d=data.read_shift(1);out.fValidRGB=d&1;out.xColorType=d>>>1;out.index=data.read_shift(1);out.nTintAndShade=data.read_shift(2,\"i\");out.bRed=data.read_shift(1);out.bGreen=data.read_shift(1);out.bBlue=data.read_shift(1);out.bAlpha=data.read_shift(1)}function parse_FontFlags(data,length){var d=data.read_shift(1);data.l++;var out={fItalic:d&2,fStrikeout:d&8,fOutline:d&16,fShadow:d&32,fCondense:d&64,fExtend:d&128};return out}{var VT_EMPTY=0;var VT_NULL=1;var VT_I2=2;var VT_I4=3;var VT_R4=4;var VT_R8=5;var VT_CY=6;var VT_DATE=7;var VT_BSTR=8;var VT_ERROR=10;var VT_BOOL=11;var VT_VARIANT=12;var VT_DECIMAL=14;var VT_I1=16;var VT_UI1=17;var VT_UI2=18;var VT_UI4=19;var VT_I8=20;var VT_UI8=21;var VT_INT=22;var VT_UINT=23;var VT_LPSTR=30;var VT_LPWSTR=31;var VT_FILETIME=64;var VT_BLOB=65;var VT_STREAM=66;var VT_STORAGE=67;var VT_STREAMED_Object=68;var VT_STORED_Object=69;var VT_BLOB_Object=70;var VT_CF=71;var VT_CLSID=72;var VT_VERSIONED_STREAM=73;var VT_VECTOR=4096;var VT_ARRAY=8192;var VT_STRING=80;var VT_USTR=81;var VT_CUSTOM=[VT_STRING,VT_USTR]}var DocSummaryPIDDSI={1:{n:\"CodePage\",t:VT_I2},2:{n:\"Category\",t:VT_STRING},3:{n:\"PresentationFormat\",t:VT_STRING},4:{n:\"ByteCount\",t:VT_I4},5:{n:\"LineCount\",t:VT_I4},6:{n:\"ParagraphCount\",t:VT_I4},7:{n:\"SlideCount\",t:VT_I4},8:{n:\"NoteCount\",t:VT_I4},9:{n:\"HiddenCount\",t:VT_I4},10:{n:\"MultimediaClipCount\",t:VT_I4},11:{n:\"Scale\",t:VT_BOOL},12:{n:\"HeadingPair\",t:VT_VECTOR|VT_VARIANT},13:{n:\"DocParts\",t:VT_VECTOR|VT_LPSTR},14:{n:\"Manager\",t:VT_STRING},15:{n:\"Company\",t:VT_STRING},16:{n:\"LinksDirty\",t:VT_BOOL},17:{n:\"CharacterCount\",t:VT_I4},19:{n:\"SharedDoc\",t:VT_BOOL},22:{n:\"HLinksChanged\",t:VT_BOOL},23:{n:\"AppVersion\",t:VT_I4,p:\"version\"},26:{n:\"ContentType\",t:VT_STRING},27:{n:\"ContentStatus\",t:VT_STRING},28:{n:\"Language\",t:VT_STRING},29:{n:\"Version\",t:VT_STRING},255:{}};var SummaryPIDSI={1:{n:\"CodePage\",t:VT_I2},2:{n:\"Title\",t:VT_STRING},3:{n:\"Subject\",t:VT_STRING},4:{n:\"Author\",t:VT_STRING},5:{n:\"Keywords\",t:VT_STRING},6:{n:\"Comments\",t:VT_STRING},7:{n:\"Template\",t:VT_STRING},8:{n:\"LastAuthor\",t:VT_STRING},9:{n:\"RevNumber\",t:VT_STRING},10:{n:\"EditTime\",t:VT_FILETIME},11:{n:\"LastPrinted\",t:VT_FILETIME},12:{n:\"CreatedDate\",t:VT_FILETIME},13:{n:\"ModifiedDate\",t:VT_FILETIME},14:{n:\"PageCount\",t:VT_I4},15:{n:\"WordCount\",t:VT_I4},16:{n:\"CharCount\",t:VT_I4},17:{n:\"Thumbnail\",t:VT_CF},18:{n:\"ApplicationName\",t:VT_LPSTR},19:{n:\"DocumentSecurity\",t:VT_I4},255:{}};var SpecialProperties={2147483648:{n:\"Locale\",t:VT_UI4},2147483651:{n:\"Behavior\",t:VT_UI4},1919054434:{}};(function(){for(var y in SpecialProperties)if(SpecialProperties.hasOwnProperty(y))DocSummaryPIDDSI[y]=SummaryPIDSI[y]=SpecialProperties[y]})();var CountryEnum={1:\"US\",2:\"CA\",3:\"\",7:\"RU\",20:\"EG\",30:\"GR\",31:\"NL\",32:\"BE\",33:\"FR\",34:\"ES\",36:\"HU\",39:\"IT\",41:\"CH\",43:\"AT\",44:\"GB\",45:\"DK\",46:\"SE\",47:\"NO\",48:\"PL\",49:\"DE\",52:\"MX\",55:\"BR\",61:\"AU\",64:\"NZ\",66:\"TH\",81:\"JP\",82:\"KR\",84:\"VN\",86:\"CN\",90:\"TR\",105:\"JS\",213:\"DZ\",216:\"MA\",218:\"LY\",351:\"PT\",354:\"IS\",358:\"FI\",420:\"CZ\",886:\"TW\",961:\"LB\",962:\"JO\",963:\"SY\",964:\"IQ\",965:\"KW\",966:\"SA\",971:\"AE\",972:\"IL\",974:\"QA\",981:\"IR\",65535:\"US\"};var XLSFillPattern=[null,\"solid\",\"mediumGray\",\"darkGray\",\"lightGray\",\"darkHorizontal\",\"darkVertical\",\"darkDown\",\"darkUp\",\"darkGrid\",\"darkTrellis\",\"lightHorizontal\",\"lightVertical\",\"lightDown\",\"lightUp\",\"lightGrid\",\"lightTrellis\",\"gray125\",\"gray0625\"];function rgbify(arr){return arr.map(function(x){return[x>>16&255,x>>8&255,x&255]})}var XLSIcv=rgbify([0,16777215,16711680,65280,255,16776960,16711935,65535,0,16777215,16711680,65280,255,16776960,16711935,65535,8388608,32768,128,8421376,8388736,32896,12632256,8421504,10066431,10040166,16777164,13434879,6684774,16744576,26316,13421823,128,16711935,16776960,65535,8388736,8388608,32896,255,52479,13434879,13434828,16777113,10079487,16751052,13408767,16764057,3368703,3394764,10079232,16763904,16750848,16737792,6710937,9868950,13158,3381606,13056,3355392,10040064,10040166,3355545,3355443,16777215,0]);var ct2type={\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\":\"workbooks\",\"application/vnd.ms-excel.binIndexWs\":\"TODO\",\"application/vnd.ms-excel.chartsheet\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.chartsheet+xml\":\"TODO\",\"application/vnd.ms-excel.dialogsheet\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.dialogsheet+xml\":\"TODO\",\"application/vnd.ms-excel.macrosheet\":\"TODO\",\"application/vnd.ms-excel.macrosheet+xml\":\"TODO\",\"application/vnd.ms-excel.intlmacrosheet\":\"TODO\",\"application/vnd.ms-excel.binIndexMs\":\"TODO\",\"application/vnd.openxmlformats-package.core-properties+xml\":\"coreprops\",\"application/vnd.openxmlformats-officedocument.custom-properties+xml\":\"custprops\",\"application/vnd.openxmlformats-officedocument.extended-properties+xml\":\"extprops\",\"application/vnd.openxmlformats-officedocument.customXmlProperties+xml\":\"TODO\",\"application/vnd.ms-excel.comments\":\"comments\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.comments+xml\":\"comments\",\"application/vnd.ms-excel.pivotTable\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotTable+xml\":\"TODO\",\"application/vnd.ms-excel.calcChain\":\"calcchains\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.calcChain+xml\":\"calcchains\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.printerSettings\":\"TODO\",\"application/vnd.ms-office.activeX\":\"TODO\",\"application/vnd.ms-office.activeX+xml\":\"TODO\",\"application/vnd.ms-excel.attachedToolbars\":\"TODO\",\"application/vnd.ms-excel.connections\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.connections+xml\":\"TODO\",\"application/vnd.ms-excel.externalLink\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.externalLink+xml\":\"TODO\",\"application/vnd.ms-excel.sheetMetadata\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheetMetadata+xml\":\"TODO\",\"application/vnd.ms-excel.pivotCacheDefinition\":\"TODO\",\"application/vnd.ms-excel.pivotCacheRecords\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheDefinition+xml\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.pivotCacheRecords+xml\":\"TODO\",\"application/vnd.ms-excel.queryTable\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.queryTable+xml\":\"TODO\",\"application/vnd.ms-excel.userNames\":\"TODO\",\"application/vnd.ms-excel.revisionHeaders\":\"TODO\",\"application/vnd.ms-excel.revisionLog\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionHeaders+xml\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.revisionLog+xml\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.userNames+xml\":\"TODO\",\"application/vnd.ms-excel.tableSingleCells\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.tableSingleCells+xml\":\"TODO\",\"application/vnd.ms-excel.slicer\":\"TODO\",\"application/vnd.ms-excel.slicerCache\":\"TODO\",\"application/vnd.ms-excel.slicer+xml\":\"TODO\",\"application/vnd.ms-excel.slicerCache+xml\":\"TODO\",\"application/vnd.ms-excel.wsSortMap\":\"TODO\",\"application/vnd.ms-excel.table\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.table+xml\":\"TODO\",\"application/vnd.openxmlformats-officedocument.theme+xml\":\"themes\",\"application/vnd.ms-excel.Timeline+xml\":\"TODO\",\"application/vnd.ms-excel.TimelineCache+xml\":\"TODO\",\"application/vnd.ms-office.vbaProject\":\"vba\",\"application/vnd.ms-office.vbaProjectSignature\":\"vba\",\"application/vnd.ms-office.volatileDependencies\":\"TODO\",\"application/vnd.openxmlformats-officedocument.spreadsheetml.volatileDependencies+xml\":\"TODO\",\"application/vnd.ms-excel.controlproperties+xml\":\"TODO\",\"application/vnd.openxmlformats-officedocument.model+data\":\"TODO\",\"application/vnd.ms-excel.Survey+xml\":\"TODO\",\"application/vnd.openxmlformats-officedocument.drawing+xml\":\"TODO\",\"application/vnd.openxmlformats-officedocument.drawingml.chart+xml\":\"TODO\",\"application/vnd.openxmlformats-officedocument.drawingml.chartshapes+xml\":\"TODO\",\"application/vnd.openxmlformats-officedocument.drawingml.diagramColors+xml\":\"TODO\",\"application/vnd.openxmlformats-officedocument.drawingml.diagramData+xml\":\"TODO\",\"application/vnd.openxmlformats-officedocument.drawingml.diagramLayout+xml\":\"TODO\",\"application/vnd.openxmlformats-officedocument.drawingml.diagramStyle+xml\":\"TODO\",\"application/vnd.openxmlformats-officedocument.vmlDrawing\":\"TODO\",\"application/vnd.openxmlformats-package.relationships+xml\":\"rels\",\"application/vnd.openxmlformats-officedocument.oleObject\":\"TODO\",sheet:\"js\"};var CT_LIST=function(){var o={workbooks:{xlsx:\"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml\",xlsm:\"application/vnd.ms-excel.sheet.macroEnabled.main+xml\",xlsb:\"application/vnd.ms-excel.sheet.binary.macroEnabled.main\",xltx:\"application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml\"},strs:{xlsx:\"application/vnd.openxmlformats-officedocument.spreadsheetml.sharedStrings+xml\",xlsb:\"application/vnd.ms-excel.sharedStrings\"},sheets:{xlsx:\"application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml\",xlsb:\"application/vnd.ms-excel.worksheet\"},styles:{xlsx:\"application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml\",xlsb:\"application/vnd.ms-excel.styles\"}};keys(o).forEach(function(k){if(!o[k].xlsm)o[k].xlsm=o[k].xlsx});keys(o).forEach(function(k){keys(o[k]).forEach(function(v){ct2type[o[k][v]]=k})});return o}();var type2ct=evert_arr(ct2type);XMLNS.CT=\"http://schemas.openxmlformats.org/package/2006/content-types\";function parse_ct(data,opts){var ctext={};if(!data||!data.match)return data;var ct={workbooks:[],sheets:[],calcchains:[],themes:[],styles:[],coreprops:[],extprops:[],custprops:[],strs:[],comments:[],vba:[],TODO:[],rels:[],xmlns:\"\"};(data.match(tagregex)||[]).forEach(function(x){var y=parsexmltag(x);switch(y[0].replace(nsregex,\"<\")){case\"<?xml\":break;case\"<Types\":ct.xmlns=y[\"xmlns\"+(y[0].match(/<(\\w+):/)||[\"\",\"\"])[1]];break;case\"<Default\":ctext[y.Extension]=y.ContentType;break;case\"<Override\":if(ct[ct2type[y.ContentType]]!==undefined)ct[ct2type[y.ContentType]].push(y.PartName);else if(opts.WTF)console.error(y);break}});if(ct.xmlns!==XMLNS.CT)throw new Error(\"Unknown Namespace: \"+ct.xmlns);ct.calcchain=ct.calcchains.length>0?ct.calcchains[0]:\"\";ct.sst=ct.strs.length>0?ct.strs[0]:\"\";ct.style=ct.styles.length>0?ct.styles[0]:\"\";ct.defaults=ctext;delete ct.calcchains;return ct}var CTYPE_XML_ROOT=writextag(\"Types\",null,{xmlns:XMLNS.CT,\"xmlns:xsd\":XMLNS.xsd,\"xmlns:xsi\":XMLNS.xsi});var CTYPE_DEFAULTS=[[\"xml\",\"application/xml\"],[\"bin\",\"application/vnd.ms-excel.sheet.binary.macroEnabled.main\"],[\"rels\",type2ct.rels[0]]].map(function(x){return writextag(\"Default\",null,{Extension:x[0],ContentType:x[1]})});function write_ct(ct,opts){var o=[],v;o[o.length]=XML_HEADER;o[o.length]=CTYPE_XML_ROOT;o=o.concat(CTYPE_DEFAULTS);var f1=function(w){if(ct[w]&&ct[w].length>0){v=ct[w][0];o[o.length]=writextag(\"Override\",null,{PartName:(v[0]==\"/\"?\"\":\"/\")+v,ContentType:CT_LIST[w][opts.bookType||\"xlsx\"]})}};var f2=function(w){ct[w].forEach(function(v){o[o.length]=writextag(\"Override\",null,{PartName:(v[0]==\"/\"?\"\":\"/\")+v,ContentType:CT_LIST[w][opts.bookType||\"xlsx\"]})})};var f3=function(t){(ct[t]||[]).forEach(function(v){o[o.length]=writextag(\"Override\",null,{PartName:(v[0]==\"/\"?\"\":\"/\")+v,ContentType:type2ct[t][0]})})};f1(\"workbooks\");f2(\"sheets\");f3(\"themes\");[\"strs\",\"styles\"].forEach(f1);[\"coreprops\",\"extprops\",\"custprops\"].forEach(f3);if(o.length>2){o[o.length]=\"</Types>\";o[1]=o[1].replace(\"/>\",\">\")}return o.join(\"\")}var RELS={WB:\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument\",SHEET:\"http://sheetjs.openxmlformats.org/officeDocument/2006/relationships/officeDocument\"};function parse_rels(data,currentFilePath){if(!data)return data;if(currentFilePath.charAt(0)!==\"/\"){currentFilePath=\"/\"+currentFilePath}var rels={};var hash={};var resolveRelativePathIntoAbsolute=function(to){var toksFrom=currentFilePath.split(\"/\");toksFrom.pop();var toksTo=to.split(\"/\");var reversed=[];while(toksTo.length!==0){var tokTo=toksTo.shift();if(tokTo===\"..\"){toksFrom.pop()}else if(tokTo!==\".\"){toksFrom.push(tokTo)}}return toksFrom.join(\"/\")};data.match(tagregex).forEach(function(x){var y=parsexmltag(x);if(y[0]===\"<Relationship\"){var rel={};rel.Type=y.Type;rel.Target=y.Target;rel.Id=y.Id;rel.TargetMode=y.TargetMode;var canonictarget=y.TargetMode===\"External\"?y.Target:resolveRelativePathIntoAbsolute(y.Target);rels[canonictarget]=rel;hash[y.Id]=rel}});rels[\"!id\"]=hash;return rels}XMLNS.RELS=\"http://schemas.openxmlformats.org/package/2006/relationships\";var RELS_ROOT=writextag(\"Relationships\",null,{xmlns:XMLNS.RELS});function write_rels(rels){var o=[];o[o.length]=XML_HEADER;o[o.length]=RELS_ROOT;keys(rels[\"!id\"]).forEach(function(rid){var rel=rels[\"!id\"][rid];o[o.length]=writextag(\"Relationship\",null,rel)});if(o.length>2){o[o.length]=\"</Relationships>\";o[1]=o[1].replace(\"/>\",\">\")}return o.join(\"\")}var CORE_PROPS=[[\"cp:category\",\"Category\"],[\"cp:contentStatus\",\"ContentStatus\"],[\"cp:keywords\",\"Keywords\"],[\"cp:lastModifiedBy\",\"LastAuthor\"],[\"cp:lastPrinted\",\"LastPrinted\"],[\"cp:revision\",\"RevNumber\"],[\"cp:version\",\"Version\"],[\"dc:creator\",\"Author\"],[\"dc:description\",\"Comments\"],[\"dc:identifier\",\"Identifier\"],[\"dc:language\",\"Language\"],[\"dc:subject\",\"Subject\"],[\"dc:title\",\"Title\"],[\"dcterms:created\",\"CreatedDate\",\"date\"],[\"dcterms:modified\",\"ModifiedDate\",\"date\"]];XMLNS.CORE_PROPS=\"http://schemas.openxmlformats.org/package/2006/metadata/core-properties\";RELS.CORE_PROPS=\"http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties\";var CORE_PROPS_REGEX=function(){var r=new Array(CORE_PROPS.length);for(var i=0;i<CORE_PROPS.length;++i){var f=CORE_PROPS[i];var g=\"(?:\"+f[0].substr(0,f[0].indexOf(\":\"))+\":)\"+f[0].substr(f[0].indexOf(\":\")+1);r[i]=new RegExp(\"<\"+g+\"[^>]*>(.*)</\"+g+\">\")}return r}();function parse_core_props(data){var p={};for(var i=0;i<CORE_PROPS.length;++i){var f=CORE_PROPS[i],cur=data.match(CORE_PROPS_REGEX[i]);if(cur!=null&&cur.length>0)p[f[1]]=cur[1];if(f[2]===\"date\"&&p[f[1]])p[f[1]]=new Date(p[f[1]])}return p}var CORE_PROPS_XML_ROOT=writextag(\"cp:coreProperties\",null,{\"xmlns:cp\":XMLNS.CORE_PROPS,\"xmlns:dc\":XMLNS.dc,\"xmlns:dcterms\":XMLNS.dcterms,\"xmlns:dcmitype\":XMLNS.dcmitype,\"xmlns:xsi\":XMLNS.xsi});function cp_doit(f,g,h,o,p){if(p[f]!=null||g==null||g===\"\")return;p[f]=g;o[o.length]=h?writextag(f,g,h):writetag(f,g)}function write_core_props(cp,opts){var o=[XML_HEADER,CORE_PROPS_XML_ROOT],p={};if(opts&&opts.Props){if(opts.Props.title)o[o.length]=\"<dc:title>\"+opts.Props.title+\"</dc:title>\";if(opts.Props.subject)o[o.length]=\"<dc:subject>\"+opts.Props.subject+\"</dc:subject>\";if(opts.Props.creator)o[o.length]=\"<dc:creator>\"+opts.Props.creator+\"</dc:creator>\";if(opts.Props.keywords)o[o.length]=\"<cp:keywords>\"+opts.Props.keywords+\"</cp:keywords>\";if(opts.Props.description)o[o.length]=\"<dc:description>\"+opts.Props.description+\"</dc:description>\"}if(cp){if(cp.CreatedDate!=null)cp_doit(\"dcterms:created\",typeof cp.CreatedDate===\"string\"?cp.CreatedDate:write_w3cdtf(cp.CreatedDate,opts.WTF),{\"xsi:type\":\"dcterms:W3CDTF\"},o,p);if(cp.ModifiedDate!=null)cp_doit(\"dcterms:modified\",typeof cp.ModifiedDate===\"string\"?cp.ModifiedDate:write_w3cdtf(cp.ModifiedDate,opts.WTF),{\"xsi:type\":\"dcterms:W3CDTF\"},o,p);for(var i=0;i!=CORE_PROPS.length;++i){var f=CORE_PROPS[i];cp_doit(f[0],cp[f[1]],null,o,p)}}if(o.length>2){o[o.length]=\"</cp:coreProperties>\";o[1]=o[1].replace(\"/>\",\">\")}return o.join(\"\")}var EXT_PROPS=[[\"Application\",\"Application\",\"string\"],[\"AppVersion\",\"AppVersion\",\"string\"],[\"Company\",\"Company\",\"string\"],[\"DocSecurity\",\"DocSecurity\",\"string\"],[\"Manager\",\"Manager\",\"string\"],[\"HyperlinksChanged\",\"HyperlinksChanged\",\"bool\"],[\"SharedDoc\",\"SharedDoc\",\"bool\"],[\"LinksUpToDate\",\"LinksUpToDate\",\"bool\"],[\"ScaleCrop\",\"ScaleCrop\",\"bool\"],[\"HeadingPairs\",\"HeadingPairs\",\"raw\"],[\"TitlesOfParts\",\"TitlesOfParts\",\"raw\"]];XMLNS.EXT_PROPS=\"http://schemas.openxmlformats.org/officeDocument/2006/extended-properties\";RELS.EXT_PROPS=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties\";function parse_ext_props(data,p){var q={};if(!p)p={};EXT_PROPS.forEach(function(f){switch(f[2]){case\"string\":p[f[1]]=(data.match(matchtag(f[0]))||[])[1];break;case\"bool\":p[f[1]]=(data.match(matchtag(f[0]))||[])[1]===\"true\";break;case\"raw\":var cur=data.match(new RegExp(\"<\"+f[0]+\"[^>]*>(.*)</\"+f[0]+\">\"));if(cur&&cur.length>0)q[f[1]]=cur[1];break}});if(q.HeadingPairs&&q.TitlesOfParts){var v=parseVector(q.HeadingPairs);var j=0,widx=0;for(var i=0;i!==v.length;++i){switch(v[i].v){case\"Worksheets\":widx=j;p.Worksheets=+v[++i].v;break;case\"Named Ranges\":++i;break}}var parts=parseVector(q.TitlesOfParts).map(function(x){return utf8read(x.v)});p.SheetNames=parts.slice(widx,widx+p.Worksheets)}return p}var EXT_PROPS_XML_ROOT=writextag(\"Properties\",null,{xmlns:XMLNS.EXT_PROPS,\"xmlns:vt\":XMLNS.vt});function write_ext_props(cp,opts){var o=[],p={},W=writextag;if(!cp)cp={};cp.Application=\"SheetJS\";o[o.length]=XML_HEADER;o[o.length]=EXT_PROPS_XML_ROOT;EXT_PROPS.forEach(function(f){if(cp[f[1]]===undefined)return;var v;switch(f[2]){case\"string\":v=cp[f[1]];break;case\"bool\":v=cp[f[1]]?\"true\":\"false\";break}if(v!==undefined)o[o.length]=W(f[0],v)});o[o.length]=W(\"HeadingPairs\",W(\"vt:vector\",W(\"vt:variant\",\"<vt:lpstr>Worksheets</vt:lpstr>\")+W(\"vt:variant\",W(\"vt:i4\",String(cp.Worksheets))),{size:2,baseType:\"variant\"}));o[o.length]=W(\"TitlesOfParts\",W(\"vt:vector\",cp.SheetNames.map(function(s){return\"<vt:lpstr>\"+s+\"</vt:lpstr>\"}).join(\"\"),{size:cp.Worksheets,baseType:\"lpstr\"}));if(o.length>2){o[o.length]=\"</Properties>\";o[1]=o[1].replace(\"/>\",\">\")}return o.join(\"\")}XMLNS.CUST_PROPS=\"http://schemas.openxmlformats.org/officeDocument/2006/custom-properties\";RELS.CUST_PROPS=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/custom-properties\";var custregex=/<[^>]+>[^<]*/g;function parse_cust_props(data,opts){var p={},name;var m=data.match(custregex);if(m)for(var i=0;i!=m.length;++i){var x=m[i],y=parsexmltag(x);switch(y[0]){case\"<?xml\":break;case\"<Properties\":if(y.xmlns!==XMLNS.CUST_PROPS)throw\"unrecognized xmlns \"+y.xmlns;if(y.xmlnsvt&&y.xmlnsvt!==XMLNS.vt)throw\"unrecognized vt \"+y.xmlnsvt;break;case\"<property\":name=y.name;break;case\"</property>\":name=null;break;default:if(x.indexOf(\"<vt:\")===0){var toks=x.split(\">\");var type=toks[0].substring(4),text=toks[1];switch(type){case\"lpstr\":case\"lpwstr\":case\"bstr\":case\"lpwstr\":p[name]=unescapexml(text);break;case\"bool\":p[name]=parsexmlbool(text,\"<vt:bool>\");break;case\"i1\":case\"i2\":case\"i4\":case\"i8\":case\"int\":case\"uint\":p[name]=parseInt(text,10);break;case\"r4\":case\"r8\":case\"decimal\":p[name]=parseFloat(text);break;case\"filetime\":case\"date\":p[name]=new Date(text);break;case\"cy\":case\"error\":p[name]=unescapexml(text);break;default:if(typeof console!==\"undefined\")console.warn(\"Unexpected\",x,type,toks)}}else if(x.substr(0,2)===\"</\"){}else if(opts.WTF)throw new Error(x)}}return p}var CUST_PROPS_XML_ROOT=writextag(\"Properties\",null,{xmlns:XMLNS.CUST_PROPS,\"xmlns:vt\":XMLNS.vt});function write_cust_props(cp,opts){var o=[XML_HEADER,CUST_PROPS_XML_ROOT];if(!cp)return o.join(\"\");var pid=1;keys(cp).forEach(function custprop(k){++pid;o[o.length]=writextag(\"property\",write_vt(cp[k]),{fmtid:\"{D5CDD505-2E9C-101B-9397-08002B2CF9AE}\",pid:pid,name:k})});if(o.length>2){o[o.length]=\"</Properties>\";o[1]=o[1].replace(\"/>\",\">\")}return o.join(\"\")}function xlml_set_prop(Props,tag,val){switch(tag){case\"Description\":tag=\"Comments\";break}Props[tag]=val}function parse_FILETIME(blob){var dwLowDateTime=blob.read_shift(4),dwHighDateTime=blob.read_shift(4);return new Date((dwHighDateTime/1e7*Math.pow(2,32)+dwLowDateTime/1e7-11644473600)*1e3).toISOString().replace(/\\.000/,\"\")}function parse_lpstr(blob,type,pad){var str=blob.read_shift(0,\"lpstr\");if(pad)blob.l+=4-(str.length+1&3)&3;return str}function parse_lpwstr(blob,type,pad){var str=blob.read_shift(0,\"lpwstr\");if(pad)blob.l+=4-(str.length+1&3)&3;return str}function parse_VtStringBase(blob,stringType,pad){if(stringType===31)return parse_lpwstr(blob);return parse_lpstr(blob,stringType,pad)}function parse_VtString(blob,t,pad){return parse_VtStringBase(blob,t,pad===false?0:4)}function parse_VtUnalignedString(blob,t){if(!t)throw new Error(\"dafuq?\");return parse_VtStringBase(blob,t,0)}function parse_VtVecUnalignedLpstrValue(blob){var length=blob.read_shift(4);var ret=[];for(var i=0;i!=length;++i)ret[i]=blob.read_shift(0,\"lpstr\");return ret}function parse_VtVecUnalignedLpstr(blob){return parse_VtVecUnalignedLpstrValue(blob)}function parse_VtHeadingPair(blob){var headingString=parse_TypedPropertyValue(blob,VT_USTR);var headerParts=parse_TypedPropertyValue(blob,VT_I4);return[headingString,headerParts]}function parse_VtVecHeadingPairValue(blob){var cElements=blob.read_shift(4);var out=[];for(var i=0;i!=cElements/2;++i)out.push(parse_VtHeadingPair(blob));return out}function parse_VtVecHeadingPair(blob){return parse_VtVecHeadingPairValue(blob)}function parse_dictionary(blob,CodePage){var cnt=blob.read_shift(4);var dict={};for(var j=0;j!=cnt;++j){var pid=blob.read_shift(4);var len=blob.read_shift(4);dict[pid]=blob.read_shift(len,CodePage===1200?\"utf16le\":\"utf8\").replace(chr0,\"\").replace(chr1,\"!\")}if(blob.l&3)blob.l=blob.l>>2+1<<2;return dict}function parse_BLOB(blob){var size=blob.read_shift(4);var bytes=blob.slice(blob.l,blob.l+size);if(size&3>0)blob.l+=4-(size&3)&3;return bytes}function parse_ClipboardData(blob){var o={};o.Size=blob.read_shift(4);blob.l+=o.Size;return o}function parse_VtVector(blob,cb){}function parse_TypedPropertyValue(blob,type,_opts){var t=blob.read_shift(2),ret,opts=_opts||{};blob.l+=2;if(type!==VT_VARIANT)if(t!==type&&VT_CUSTOM.indexOf(type)===-1)throw new Error(\"Expected type \"+type+\" saw \"+t);switch(type===VT_VARIANT?t:type){case 2:ret=blob.read_shift(2,\"i\");if(!opts.raw)blob.l+=2;return ret;case 3:ret=blob.read_shift(4,\"i\");return ret;case 11:return blob.read_shift(4)!==0;case 19:ret=blob.read_shift(4);return ret;case 30:return parse_lpstr(blob,t,4).replace(chr0,\"\");case 31:return parse_lpwstr(blob);case 64:return parse_FILETIME(blob);case 65:return parse_BLOB(blob);case 71:return parse_ClipboardData(blob);case 80:return parse_VtString(blob,t,!opts.raw&&4).replace(chr0,\"\");case 81:return parse_VtUnalignedString(blob,t,4).replace(chr0,\"\");case 4108:return parse_VtVecHeadingPair(blob);case 4126:return parse_VtVecUnalignedLpstr(blob);default:throw new Error(\"TypedPropertyValue unrecognized type \"+type+\" \"+t)}}function parse_PropertySet(blob,PIDSI){var start_addr=blob.l;var size=blob.read_shift(4);var NumProps=blob.read_shift(4);var Props=[],i=0;var CodePage=0;var Dictionary=-1,DictObj;for(i=0;i!=NumProps;++i){var PropID=blob.read_shift(4);var Offset=blob.read_shift(4);Props[i]=[PropID,Offset+start_addr]}var PropH={};for(i=0;i!=NumProps;++i){if(blob.l!==Props[i][1]){var fail=true;if(i>0&&PIDSI)switch(PIDSI[Props[i-1][0]].t){case 2:if(blob.l+2===Props[i][1]){blob.l+=2;fail=false}break;case 80:if(blob.l<=Props[i][1]){blob.l=Props[i][1];fail=false}break;case 4108:if(blob.l<=Props[i][1]){blob.l=Props[i][1];fail=false}break}if(!PIDSI&&blob.l<=Props[i][1]){fail=false;blob.l=Props[i][1]}if(fail)throw new Error(\"Read Error: Expected address \"+Props[i][1]+\" at \"+blob.l+\" :\"+i)}if(PIDSI){var piddsi=PIDSI[Props[i][0]];PropH[piddsi.n]=parse_TypedPropertyValue(blob,piddsi.t,{raw:true});if(piddsi.p===\"version\")PropH[piddsi.n]=String(PropH[piddsi.n]>>16)+\".\"+String(PropH[piddsi.n]&65535);if(piddsi.n==\"CodePage\")switch(PropH[piddsi.n]){case 0:PropH[piddsi.n]=1252;case 1e4:case 1252:case 874:case 1250:case 1251:case 1253:case 1254:case 1255:case 1256:case 1257:case 1258:case 932:case 936:case 949:case 950:case 1200:case 1201:case 65e3:case-536:case 65001:case-535:set_cp(CodePage=PropH[piddsi.n]);break;default:throw new Error(\"Unsupported CodePage: \"+PropH[piddsi.n])}}else{if(Props[i][0]===1){CodePage=PropH.CodePage=parse_TypedPropertyValue(blob,VT_I2);set_cp(CodePage);if(Dictionary!==-1){var oldpos=blob.l;blob.l=Props[Dictionary][1];DictObj=parse_dictionary(blob,CodePage);blob.l=oldpos}}else if(Props[i][0]===0){if(CodePage===0){Dictionary=i;blob.l=Props[i+1][1];continue}DictObj=parse_dictionary(blob,CodePage)}else{var name=DictObj[Props[i][0]];var val;switch(blob[blob.l]){case 65:blob.l+=4;val=parse_BLOB(blob);break;case 30:blob.l+=4;val=parse_VtString(blob,blob[blob.l-4]);break;case 31:blob.l+=4;val=parse_VtString(blob,blob[blob.l-4]);break;case 3:blob.l+=4;val=blob.read_shift(4,\"i\");break;case 19:blob.l+=4;val=blob.read_shift(4);break;case 5:blob.l+=4;val=blob.read_shift(8,\"f\");break;case 11:blob.l+=4;val=parsebool(blob,4);break;case 64:blob.l+=4;val=new Date(parse_FILETIME(blob));break;default:throw new Error(\"unparsed value: \"+blob[blob.l])}PropH[name]=val}}}blob.l=start_addr+size;return PropH}function parse_PropertySetStream(file,PIDSI){var blob=file.content;prep_blob(blob,0);var NumSets,FMTID0,FMTID1,Offset0,Offset1;blob.chk(\"feff\",\"Byte Order: \");var vers=blob.read_shift(2);var SystemIdentifier=blob.read_shift(4);blob.chk(CFB.utils.consts.HEADER_CLSID,\"CLSID: \");NumSets=blob.read_shift(4);if(NumSets!==1&&NumSets!==2)throw\"Unrecognized #Sets: \"+NumSets;FMTID0=blob.read_shift(16);Offset0=blob.read_shift(4);if(NumSets===1&&Offset0!==blob.l)throw\"Length mismatch\";else if(NumSets===2){FMTID1=blob.read_shift(16);Offset1=blob.read_shift(4)}var PSet0=parse_PropertySet(blob,PIDSI);var rval={SystemIdentifier:SystemIdentifier};for(var y in PSet0)rval[y]=PSet0[y];rval.FMTID=FMTID0;if(NumSets===1)return rval;if(blob.l!==Offset1)throw\"Length mismatch 2: \"+blob.l+\" !== \"+Offset1;var PSet1;try{PSet1=parse_PropertySet(blob,null)}catch(e){}for(y in PSet1)rval[y]=PSet1[y];rval.FMTID=[FMTID0,FMTID1];return rval}function parsenoop2(blob,length){blob.read_shift(length);return null}function parslurp(blob,length,cb){var arr=[],target=blob.l+length;while(blob.l<target)arr.push(cb(blob,target-blob.l));if(target!==blob.l)throw new Error(\"Slurp error\");return arr}function parslurp2(blob,length,cb){var arr=[],target=blob.l+length,len=blob.read_shift(2);\nwhile(len--!==0)arr.push(cb(blob,target-blob.l));if(target!==blob.l)throw new Error(\"Slurp error\");return arr}function parsebool(blob,length){return blob.read_shift(length)===1}function parseuint16(blob){return blob.read_shift(2,\"u\")}function parseuint16a(blob,length){return parslurp(blob,length,parseuint16)}var parse_Boolean=parsebool;function parse_Bes(blob){var v=blob.read_shift(1),t=blob.read_shift(1);return t===1?v:v===1}function parse_ShortXLUnicodeString(blob,length,opts){var cch=blob.read_shift(1);var width=1,encoding=\"sbcs-cont\";var cp=current_codepage;if(opts&&opts.biff>=8)current_codepage=1200;if(opts===undefined||opts.biff!==5){var fHighByte=blob.read_shift(1);if(fHighByte){width=2;encoding=\"dbcs-cont\"}}var o=cch?blob.read_shift(cch,encoding):\"\";current_codepage=cp;return o}function parse_XLUnicodeRichExtendedString(blob){var cp=current_codepage;current_codepage=1200;var cch=blob.read_shift(2),flags=blob.read_shift(1);var fHighByte=flags&1,fExtSt=flags&4,fRichSt=flags&8;var width=1+(flags&1);var cRun,cbExtRst;var z={};if(fRichSt)cRun=blob.read_shift(2);if(fExtSt)cbExtRst=blob.read_shift(4);var encoding=flags&1?\"dbcs-cont\":\"sbcs-cont\";var msg=cch===0?\"\":blob.read_shift(cch,encoding);if(fRichSt)blob.l+=4*cRun;if(fExtSt)blob.l+=cbExtRst;z.t=msg;if(!fRichSt){z.raw=\"<t>\"+z.t+\"</t>\";z.r=z.t}current_codepage=cp;return z}function parse_XLUnicodeStringNoCch(blob,cch,opts){var retval;var fHighByte=blob.read_shift(1);if(fHighByte===0){retval=blob.read_shift(cch,\"sbcs-cont\")}else{retval=blob.read_shift(cch,\"dbcs-cont\")}return retval}function parse_XLUnicodeString(blob,length,opts){var cch=blob.read_shift(opts!==undefined&&opts.biff>0&&opts.biff<8?1:2);if(cch===0){blob.l++;return\"\"}return parse_XLUnicodeStringNoCch(blob,cch,opts)}function parse_XLUnicodeString2(blob,length,opts){if(opts.biff!==5&&opts.biff!==2)return parse_XLUnicodeString(blob,length,opts);var cch=blob.read_shift(1);if(cch===0){blob.l++;return\"\"}return blob.read_shift(cch,\"sbcs-cont\")}var parse_ControlInfo=parsenoop;var parse_URLMoniker=function(blob,length){var len=blob.read_shift(4),start=blob.l;var extra=false;if(len>24){blob.l+=len-24;if(blob.read_shift(16)===\"795881f43b1d7f48af2c825dc4852763\")extra=true;blob.l=start}var url=blob.read_shift((extra?len-24:len)>>1,\"utf16le\").replace(chr0,\"\");if(extra)blob.l+=24;return url};var parse_FileMoniker=function(blob,length){var cAnti=blob.read_shift(2);var ansiLength=blob.read_shift(4);var ansiPath=blob.read_shift(ansiLength,\"cstr\");var endServer=blob.read_shift(2);var versionNumber=blob.read_shift(2);var cbUnicodePathSize=blob.read_shift(4);if(cbUnicodePathSize===0)return ansiPath.replace(/\\\\/g,\"/\");var cbUnicodePathBytes=blob.read_shift(4);var usKeyValue=blob.read_shift(2);var unicodePath=blob.read_shift(cbUnicodePathBytes>>1,\"utf16le\").replace(chr0,\"\");return unicodePath};var parse_HyperlinkMoniker=function(blob,length){var clsid=blob.read_shift(16);length-=16;switch(clsid){case\"e0c9ea79f9bace118c8200aa004ba90b\":return parse_URLMoniker(blob,length);case\"0303000000000000c000000000000046\":return parse_FileMoniker(blob,length);default:throw\"unsupported moniker \"+clsid}};var parse_HyperlinkString=function(blob,length){var len=blob.read_shift(4);var o=blob.read_shift(len,\"utf16le\").replace(chr0,\"\");return o};var parse_Hyperlink=function(blob,length){var end=blob.l+length;var sVer=blob.read_shift(4);if(sVer!==2)throw new Error(\"Unrecognized streamVersion: \"+sVer);var flags=blob.read_shift(2);blob.l+=2;var displayName,targetFrameName,moniker,oleMoniker,location,guid,fileTime;if(flags&16)displayName=parse_HyperlinkString(blob,end-blob.l);if(flags&128)targetFrameName=parse_HyperlinkString(blob,end-blob.l);if((flags&257)===257)moniker=parse_HyperlinkString(blob,end-blob.l);if((flags&257)===1)oleMoniker=parse_HyperlinkMoniker(blob,end-blob.l);if(flags&8)location=parse_HyperlinkString(blob,end-blob.l);if(flags&32)guid=blob.read_shift(16);if(flags&64)fileTime=parse_FILETIME(blob,8);blob.l=end;var target=targetFrameName||moniker||oleMoniker;if(location)target+=\"#\"+location;return{Target:target}};function parse_LongRGBA(blob,length){var r=blob.read_shift(1),g=blob.read_shift(1),b=blob.read_shift(1),a=blob.read_shift(1);return[r,g,b,a]}function parse_LongRGB(blob,length){var x=parse_LongRGBA(blob,length);x[3]=0;return x}function parse_XLSCell(blob,length){var rw=blob.read_shift(2);var col=blob.read_shift(2);var ixfe=blob.read_shift(2);return{r:rw,c:col,ixfe:ixfe}}function parse_frtHeader(blob){var rt=blob.read_shift(2);var flags=blob.read_shift(2);blob.l+=8;return{type:rt,flags:flags}}function parse_OptXLUnicodeString(blob,length,opts){return length===0?\"\":parse_XLUnicodeString2(blob,length,opts)}var HIDEOBJENUM=[\"SHOWALL\",\"SHOWPLACEHOLDER\",\"HIDEALL\"];var parse_HideObjEnum=parseuint16;function parse_XTI(blob,length){var iSupBook=blob.read_shift(2),itabFirst=blob.read_shift(2,\"i\"),itabLast=blob.read_shift(2,\"i\");return[iSupBook,itabFirst,itabLast]}function parse_RkRec(blob,length){var ixfe=blob.read_shift(2);var RK=parse_RkNumber(blob);return[ixfe,RK]}function parse_AddinUdf(blob,length){blob.l+=4;length-=4;var l=blob.l+length;var udfName=parse_ShortXLUnicodeString(blob,length);var cb=blob.read_shift(2);l-=blob.l;if(cb!==l)throw\"Malformed AddinUdf: padding = \"+l+\" != \"+cb;blob.l+=cb;return udfName}function parse_Ref8U(blob,length){var rwFirst=blob.read_shift(2);var rwLast=blob.read_shift(2);var colFirst=blob.read_shift(2);var colLast=blob.read_shift(2);return{s:{c:colFirst,r:rwFirst},e:{c:colLast,r:rwLast}}}function parse_RefU(blob,length){var rwFirst=blob.read_shift(2);var rwLast=blob.read_shift(2);var colFirst=blob.read_shift(1);var colLast=blob.read_shift(1);return{s:{c:colFirst,r:rwFirst},e:{c:colLast,r:rwLast}}}var parse_Ref=parse_RefU;function parse_FtCmo(blob,length){blob.l+=4;var ot=blob.read_shift(2);var id=blob.read_shift(2);var flags=blob.read_shift(2);blob.l+=12;return[id,ot,flags]}function parse_FtNts(blob,length){var out={};blob.l+=4;blob.l+=16;out.fSharedNote=blob.read_shift(2);blob.l+=4;return out}function parse_FtCf(blob,length){var out={};blob.l+=4;blob.cf=blob.read_shift(2);return out}var FtTab={21:parse_FtCmo,19:parsenoop,18:function(blob,length){blob.l+=12},17:function(blob,length){blob.l+=8},16:parsenoop,15:parsenoop,13:parse_FtNts,12:function(blob,length){blob.l+=24},11:function(blob,length){blob.l+=10},10:function(blob,length){blob.l+=16},9:parsenoop,8:function(blob,length){blob.l+=6},7:parse_FtCf,6:function(blob,length){blob.l+=6},4:parsenoop,0:function(blob,length){blob.l+=4}};function parse_FtArray(blob,length,ot){var s=blob.l;var fts=[];while(blob.l<s+length){var ft=blob.read_shift(2);blob.l-=2;try{fts.push(FtTab[ft](blob,s+length-blob.l))}catch(e){blob.l=s+length;return fts}}if(blob.l!=s+length)blob.l=s+length;return fts}var parse_FontIndex=parseuint16;function parse_BOF(blob,length){var o={};o.BIFFVer=blob.read_shift(2);length-=2;switch(o.BIFFVer){case 1536:case 1280:case 2:case 7:break;default:throw\"Unexpected BIFF Ver \"+o.BIFFVer}blob.read_shift(length);return o}function parse_InterfaceHdr(blob,length){if(length===0)return 1200;var q;if((q=blob.read_shift(2))!==1200)throw\"InterfaceHdr codePage \"+q;return 1200}function parse_WriteAccess(blob,length,opts){if(opts.enc){blob.l+=length;return\"\"}var l=blob.l;var UserName=parse_XLUnicodeString(blob,0,opts);blob.read_shift(length+l-blob.l);return UserName}function parse_BoundSheet8(blob,length,opts){var pos=blob.read_shift(4);var hidden=blob.read_shift(1)>>6;var dt=blob.read_shift(1);switch(dt){case 0:dt=\"Worksheet\";break;case 1:dt=\"Macrosheet\";break;case 2:dt=\"Chartsheet\";break;case 6:dt=\"VBAModule\";break}var name=parse_ShortXLUnicodeString(blob,0,opts);if(name.length===0)name=\"Sheet1\";return{pos:pos,hs:hidden,dt:dt,name:name}}function parse_SST(blob,length){var cnt=blob.read_shift(4);var ucnt=blob.read_shift(4);var strs=[];for(var i=0;i!=ucnt;++i){strs.push(parse_XLUnicodeRichExtendedString(blob))}strs.Count=cnt;strs.Unique=ucnt;return strs}function parse_ExtSST(blob,length){var extsst={};extsst.dsst=blob.read_shift(2);blob.l+=length-2;return extsst}function parse_Row(blob,length){var rw=blob.read_shift(2),col=blob.read_shift(2),Col=blob.read_shift(2),rht=blob.read_shift(2);blob.read_shift(4);var flags=blob.read_shift(1);blob.read_shift(1);blob.read_shift(2);return{r:rw,c:col,cnt:Col-col}}function parse_ForceFullCalculation(blob,length){var header=parse_frtHeader(blob);if(header.type!=2211)throw\"Invalid Future Record \"+header.type;var fullcalc=blob.read_shift(4);return fullcalc!==0}var parse_CompressPictures=parsenoop2;function parse_RecalcId(blob,length){blob.read_shift(2);return blob.read_shift(4)}function parse_DefaultRowHeight(blob,length){var f=blob.read_shift(2),miyRw;miyRw=blob.read_shift(2);var fl={Unsynced:f&1,DyZero:(f&2)>>1,ExAsc:(f&4)>>2,ExDsc:(f&8)>>3};return[fl,miyRw]}function parse_Window1(blob,length){var xWn=blob.read_shift(2),yWn=blob.read_shift(2),dxWn=blob.read_shift(2),dyWn=blob.read_shift(2);var flags=blob.read_shift(2),iTabCur=blob.read_shift(2),iTabFirst=blob.read_shift(2);var ctabSel=blob.read_shift(2),wTabRatio=blob.read_shift(2);return{Pos:[xWn,yWn],Dim:[dxWn,dyWn],Flags:flags,CurTab:iTabCur,FirstTab:iTabFirst,Selected:ctabSel,TabRatio:wTabRatio}}function parse_Font(blob,length,opts){blob.l+=14;var name=parse_ShortXLUnicodeString(blob,0,opts);return name}function parse_LabelSst(blob,length){var cell=parse_XLSCell(blob);cell.isst=blob.read_shift(4);return cell}function parse_Label(blob,length,opts){var cell=parse_XLSCell(blob,6);var str=parse_XLUnicodeString(blob,length-6,opts);cell.val=str;return cell}function parse_Format(blob,length,opts){var ifmt=blob.read_shift(2);var fmtstr=parse_XLUnicodeString2(blob,0,opts);return[ifmt,fmtstr]}function parse_Dimensions(blob,length){var w=length===10?2:4;var r=blob.read_shift(w),R=blob.read_shift(w),c=blob.read_shift(2),C=blob.read_shift(2);blob.l+=2;return{s:{r:r,c:c},e:{r:R,c:C}}}function parse_RK(blob,length){var rw=blob.read_shift(2),col=blob.read_shift(2);var rkrec=parse_RkRec(blob);return{r:rw,c:col,ixfe:rkrec[0],rknum:rkrec[1]}}function parse_MulRk(blob,length){var target=blob.l+length-2;var rw=blob.read_shift(2),col=blob.read_shift(2);var rkrecs=[];while(blob.l<target)rkrecs.push(parse_RkRec(blob));if(blob.l!==target)throw\"MulRK read error\";var lastcol=blob.read_shift(2);if(rkrecs.length!=lastcol-col+1)throw\"MulRK length mismatch\";return{r:rw,c:col,C:lastcol,rkrec:rkrecs}}function parse_CellStyleXF(blob,length,style){var o={};var a=blob.read_shift(4),b=blob.read_shift(4);var c=blob.read_shift(4),d=blob.read_shift(2);o.patternType=XLSFillPattern[c>>26];o.icvFore=d&127;o.icvBack=d>>7&127;return o}function parse_CellXF(blob,length){return parse_CellStyleXF(blob,length,0)}function parse_StyleXF(blob,length){return parse_CellStyleXF(blob,length,1)}function parse_XF(blob,length){var o={};o.ifnt=blob.read_shift(2);o.ifmt=blob.read_shift(2);o.flags=blob.read_shift(2);o.fStyle=o.flags>>2&1;length-=6;o.data=parse_CellStyleXF(blob,length,o.fStyle);return o}function parse_Guts(blob,length){blob.l+=4;var out=[blob.read_shift(2),blob.read_shift(2)];if(out[0]!==0)out[0]--;if(out[1]!==0)out[1]--;if(out[0]>7||out[1]>7)throw\"Bad Gutters: \"+out;return out}function parse_BoolErr(blob,length){var cell=parse_XLSCell(blob,6);var val=parse_Bes(blob,2);cell.val=val;cell.t=val===true||val===false?\"b\":\"e\";return cell}function parse_Number(blob,length){var cell=parse_XLSCell(blob,6);var xnum=parse_Xnum(blob,8);cell.val=xnum;return cell}var parse_XLHeaderFooter=parse_OptXLUnicodeString;function parse_SupBook(blob,length,opts){var end=blob.l+length;var ctab=blob.read_shift(2);var cch=blob.read_shift(2);var virtPath;if(cch>=1&&cch<=255)virtPath=parse_XLUnicodeStringNoCch(blob,cch);var rgst=blob.read_shift(end-blob.l);opts.sbcch=cch;return[cch,ctab,virtPath,rgst]}function parse_ExternName(blob,length,opts){var flags=blob.read_shift(2);var body;var o={fBuiltIn:flags&1,fWantAdvise:flags>>>1&1,fWantPict:flags>>>2&1,fOle:flags>>>3&1,fOleLink:flags>>>4&1,cf:flags>>>5&1023,fIcon:flags>>>15&1};if(opts.sbcch===14849)body=parse_AddinUdf(blob,length-2);o.body=body||blob.read_shift(length-2);return o}function parse_Lbl(blob,length,opts){if(opts.biff<8)return parse_Label(blob,length,opts);var target=blob.l+length;var flags=blob.read_shift(2);var chKey=blob.read_shift(1);var cch=blob.read_shift(1);var cce=blob.read_shift(2);blob.l+=2;var itab=blob.read_shift(2);blob.l+=4;var name=parse_XLUnicodeStringNoCch(blob,cch,opts);var rgce=parse_NameParsedFormula(blob,target-blob.l,opts,cce);return{chKey:chKey,Name:name,rgce:rgce}}function parse_ExternSheet(blob,length,opts){if(opts.biff<8)return parse_ShortXLUnicodeString(blob,length,opts);var o=parslurp2(blob,length,parse_XTI);var oo=[];if(opts.sbcch===1025){for(var i=0;i!=o.length;++i)oo.push(opts.snames[o[i][1]]);return oo}else return o}function parse_ShrFmla(blob,length,opts){var ref=parse_RefU(blob,6);blob.l++;var cUse=blob.read_shift(1);length-=8;return[parse_SharedParsedFormula(blob,length,opts),cUse]}function parse_Array(blob,length,opts){var ref=parse_Ref(blob,6);blob.l+=6;length-=12;return[ref,parse_ArrayParsedFormula(blob,length,opts,ref)]}function parse_MTRSettings(blob,length){var fMTREnabled=blob.read_shift(4)!==0;var fUserSetThreadCount=blob.read_shift(4)!==0;var cUserThreadCount=blob.read_shift(4);return[fMTREnabled,fUserSetThreadCount,cUserThreadCount]}function parse_NoteSh(blob,length,opts){if(opts.biff<8)return;var row=blob.read_shift(2),col=blob.read_shift(2);var flags=blob.read_shift(2),idObj=blob.read_shift(2);var stAuthor=parse_XLUnicodeString2(blob,0,opts);if(opts.biff<8)blob.read_shift(1);return[{r:row,c:col},stAuthor,idObj,flags]}function parse_Note(blob,length,opts){return parse_NoteSh(blob,length,opts)}function parse_MergeCells(blob,length){var merges=[];var cmcs=blob.read_shift(2);while(cmcs--)merges.push(parse_Ref8U(blob,length));return merges}function parse_Obj(blob,length){var cmo=parse_FtCmo(blob,22);var fts=parse_FtArray(blob,length-22,cmo[1]);return{cmo:cmo,ft:fts}}function parse_TxO(blob,length,opts){var s=blob.l;try{blob.l+=4;var ot=(opts.lastobj||{cmo:[0,0]}).cmo[1];var controlInfo;if([0,5,7,11,12,14].indexOf(ot)==-1)blob.l+=6;else controlInfo=parse_ControlInfo(blob,6,opts);var cchText=blob.read_shift(2);var cbRuns=blob.read_shift(2);var ifntEmpty=parse_FontIndex(blob,2);var len=blob.read_shift(2);blob.l+=len;var texts=\"\";for(var i=1;i<blob.lens.length-1;++i){if(blob.l-s!=blob.lens[i])throw\"TxO: bad continue record\";var hdr=blob[blob.l];var t=parse_XLUnicodeStringNoCch(blob,blob.lens[i+1]-blob.lens[i]-1);texts+=t;if(texts.length>=(hdr?cchText:2*cchText))break}if(texts.length!==cchText&&texts.length!==cchText*2){throw\"cchText: \"+cchText+\" != \"+texts.length}blob.l=s+length;return{t:texts}}catch(e){blob.l=s+length;return{t:texts||\"\"}}}var parse_HLink=function(blob,length){var ref=parse_Ref8U(blob,8);blob.l+=16;var hlink=parse_Hyperlink(blob,length-24);return[ref,hlink]};var parse_HLinkTooltip=function(blob,length){var end=blob.l+length;blob.read_shift(2);var ref=parse_Ref8U(blob,8);var wzTooltip=blob.read_shift((length-10)/2,\"dbcs-cont\");wzTooltip=wzTooltip.replace(chr0,\"\");return[ref,wzTooltip]};function parse_Country(blob,length){var o=[],d;d=blob.read_shift(2);o[0]=CountryEnum[d]||d;d=blob.read_shift(2);o[1]=CountryEnum[d]||d;return o}function parse_ClrtClient(blob,length){var ccv=blob.read_shift(2);var o=[];while(ccv-->0)o.push(parse_LongRGB(blob,8));return o}function parse_Palette(blob,length){var ccv=blob.read_shift(2);var o=[];while(ccv-->0)o.push(parse_LongRGB(blob,8));return o}function parse_XFCRC(blob,length){blob.l+=2;var o={cxfs:0,crc:0};o.cxfs=blob.read_shift(2);o.crc=blob.read_shift(4);return o}var parse_Style=parsenoop;var parse_StyleExt=parsenoop;var parse_ColInfo=parsenoop;var parse_Window2=parsenoop;var parse_Backup=parsebool;var parse_Blank=parse_XLSCell;var parse_BottomMargin=parse_Xnum;var parse_BuiltInFnGroupCount=parseuint16;var parse_CalcCount=parseuint16;var parse_CalcDelta=parse_Xnum;var parse_CalcIter=parsebool;var parse_CalcMode=parseuint16;var parse_CalcPrecision=parsebool;var parse_CalcRefMode=parsenoop2;var parse_CalcSaveRecalc=parsebool;var parse_CodePage=parseuint16;var parse_Compat12=parsebool;var parse_Date1904=parsebool;var parse_DefColWidth=parseuint16;var parse_DSF=parsenoop2;var parse_EntExU2=parsenoop2;var parse_EOF=parsenoop2;var parse_Excel9File=parsenoop2;var parse_FeatHdr=parsenoop2;var parse_FontX=parseuint16;var parse_Footer=parse_XLHeaderFooter;var parse_GridSet=parseuint16;var parse_HCenter=parsebool;var parse_Header=parse_XLHeaderFooter;var parse_HideObj=parse_HideObjEnum;var parse_InterfaceEnd=parsenoop2;var parse_LeftMargin=parse_Xnum;var parse_Mms=parsenoop2;var parse_ObjProtect=parsebool;var parse_Password=parseuint16;var parse_PrintGrid=parsebool;var parse_PrintRowCol=parsebool;var parse_PrintSize=parseuint16;var parse_Prot4Rev=parsebool;var parse_Prot4RevPass=parseuint16;var parse_Protect=parsebool;var parse_RefreshAll=parsebool;var parse_RightMargin=parse_Xnum;var parse_RRTabId=parseuint16a;var parse_ScenarioProtect=parsebool;var parse_Scl=parseuint16a;var parse_String=parse_XLUnicodeString;var parse_SxBool=parsebool;var parse_TopMargin=parse_Xnum;var parse_UsesELFs=parsebool;var parse_VCenter=parsebool;var parse_WinProtect=parsebool;var parse_WriteProtect=parsenoop;var parse_VerticalPageBreaks=parsenoop;var parse_HorizontalPageBreaks=parsenoop;var parse_Selection=parsenoop;var parse_Continue=parsenoop;var parse_Pane=parsenoop;var parse_Pls=parsenoop;var parse_DCon=parsenoop;var parse_DConRef=parsenoop;var parse_DConName=parsenoop;var parse_XCT=parsenoop;var parse_CRN=parsenoop;var parse_FileSharing=parsenoop;var parse_Uncalced=parsenoop;var parse_Template=parsenoop;var parse_Intl=parsenoop;var parse_WsBool=parsenoop;var parse_Sort=parsenoop;var parse_Sync=parsenoop;var parse_LPr=parsenoop;var parse_DxGCol=parsenoop;var parse_FnGroupName=parsenoop;var parse_FilterMode=parsenoop;var parse_AutoFilterInfo=parsenoop;var parse_AutoFilter=parsenoop;var parse_Setup=parsenoop;var parse_ScenMan=parsenoop;var parse_SCENARIO=parsenoop;var parse_SxView=parsenoop;var parse_Sxvd=parsenoop;var parse_SXVI=parsenoop;var parse_SxIvd=parsenoop;var parse_SXLI=parsenoop;var parse_SXPI=parsenoop;var parse_DocRoute=parsenoop;var parse_RecipName=parsenoop;var parse_MulBlank=parsenoop;var parse_SXDI=parsenoop;var parse_SXDB=parsenoop;var parse_SXFDB=parsenoop;var parse_SXDBB=parsenoop;var parse_SXNum=parsenoop;var parse_SxErr=parsenoop;var parse_SXInt=parsenoop;var parse_SXString=parsenoop;var parse_SXDtr=parsenoop;var parse_SxNil=parsenoop;var parse_SXTbl=parsenoop;var parse_SXTBRGIITM=parsenoop;var parse_SxTbpg=parsenoop;var parse_ObProj=parsenoop;var parse_SXStreamID=parsenoop;var parse_DBCell=parsenoop;var parse_SXRng=parsenoop;var parse_SxIsxoper=parsenoop;var parse_BookBool=parsenoop;var parse_DbOrParamQry=parsenoop;var parse_OleObjectSize=parsenoop;var parse_SXVS=parsenoop;var parse_BkHim=parsenoop;var parse_MsoDrawingGroup=parsenoop;var parse_MsoDrawing=parsenoop;var parse_MsoDrawingSelection=parsenoop;var parse_PhoneticInfo=parsenoop;var parse_SxRule=parsenoop;var parse_SXEx=parsenoop;var parse_SxFilt=parsenoop;var parse_SxDXF=parsenoop;var parse_SxItm=parsenoop;var parse_SxName=parsenoop;var parse_SxSelect=parsenoop;var parse_SXPair=parsenoop;var parse_SxFmla=parsenoop;var parse_SxFormat=parsenoop;var parse_SXVDEx=parsenoop;var parse_SXFormula=parsenoop;var parse_SXDBEx=parsenoop;var parse_RRDInsDel=parsenoop;var parse_RRDHead=parsenoop;var parse_RRDChgCell=parsenoop;var parse_RRDRenSheet=parsenoop;var parse_RRSort=parsenoop;var parse_RRDMove=parsenoop;var parse_RRFormat=parsenoop;var parse_RRAutoFmt=parsenoop;var parse_RRInsertSh=parsenoop;var parse_RRDMoveBegin=parsenoop;var parse_RRDMoveEnd=parsenoop;var parse_RRDInsDelBegin=parsenoop;var parse_RRDInsDelEnd=parsenoop;var parse_RRDConflict=parsenoop;var parse_RRDDefName=parsenoop;var parse_RRDRstEtxp=parsenoop;var parse_LRng=parsenoop;var parse_CUsr=parsenoop;var parse_CbUsr=parsenoop;var parse_UsrInfo=parsenoop;var parse_UsrExcl=parsenoop;var parse_FileLock=parsenoop;var parse_RRDInfo=parsenoop;var parse_BCUsrs=parsenoop;var parse_UsrChk=parsenoop;var parse_UserBView=parsenoop;var parse_UserSViewBegin=parsenoop;var parse_UserSViewEnd=parsenoop;var parse_RRDUserView=parsenoop;var parse_Qsi=parsenoop;var parse_CondFmt=parsenoop;var parse_CF=parsenoop;var parse_DVal=parsenoop;var parse_DConBin=parsenoop;var parse_Lel=parsenoop;var parse_XLSCodeName=parse_XLUnicodeString;var parse_SXFDBType=parsenoop;var parse_ObNoMacros=parsenoop;var parse_Dv=parsenoop;var parse_Index=parsenoop;var parse_Table=parsenoop;var parse_BigName=parsenoop;var parse_ContinueBigName=parsenoop;var parse_WebPub=parsenoop;var parse_QsiSXTag=parsenoop;var parse_DBQueryExt=parsenoop;var parse_ExtString=parsenoop;var parse_TxtQry=parsenoop;var parse_Qsir=parsenoop;var parse_Qsif=parsenoop;var parse_RRDTQSIF=parsenoop;var parse_OleDbConn=parsenoop;var parse_WOpt=parsenoop;var parse_SXViewEx=parsenoop;var parse_SXTH=parsenoop;var parse_SXPIEx=parsenoop;var parse_SXVDTEx=parsenoop;var parse_SXViewEx9=parsenoop;var parse_ContinueFrt=parsenoop;var parse_RealTimeData=parsenoop;var parse_ChartFrtInfo=parsenoop;var parse_FrtWrapper=parsenoop;var parse_StartBlock=parsenoop;var parse_EndBlock=parsenoop;var parse_StartObject=parsenoop;var parse_EndObject=parsenoop;var parse_CatLab=parsenoop;var parse_YMult=parsenoop;var parse_SXViewLink=parsenoop;var parse_PivotChartBits=parsenoop;var parse_FrtFontList=parsenoop;var parse_SheetExt=parsenoop;var parse_BookExt=parsenoop;var parse_SXAddl=parsenoop;var parse_CrErr=parsenoop;var parse_HFPicture=parsenoop;var parse_Feat=parsenoop;var parse_DataLabExt=parsenoop;var parse_DataLabExtContents=parsenoop;var parse_CellWatch=parsenoop;var parse_FeatHdr11=parsenoop;var parse_Feature11=parsenoop;var parse_DropDownObjIds=parsenoop;var parse_ContinueFrt11=parsenoop;var parse_DConn=parsenoop;var parse_List12=parsenoop;var parse_Feature12=parsenoop;var parse_CondFmt12=parsenoop;var parse_CF12=parsenoop;var parse_CFEx=parsenoop;var parse_AutoFilter12=parsenoop;var parse_ContinueFrt12=parsenoop;var parse_MDTInfo=parsenoop;var parse_MDXStr=parsenoop;var parse_MDXTuple=parsenoop;var parse_MDXSet=parsenoop;var parse_MDXProp=parsenoop;var parse_MDXKPI=parsenoop;var parse_MDB=parsenoop;var parse_PLV=parsenoop;var parse_DXF=parsenoop;var parse_TableStyles=parsenoop;var parse_TableStyle=parsenoop;var parse_TableStyleElement=parsenoop;var parse_NamePublish=parsenoop;var parse_NameCmt=parsenoop;var parse_SortData=parsenoop;var parse_GUIDTypeLib=parsenoop;var parse_FnGrp12=parsenoop;var parse_NameFnGrp12=parsenoop;var parse_HeaderFooter=parsenoop;var parse_CrtLayout12=parsenoop;var parse_CrtMlFrt=parsenoop;var parse_CrtMlFrtContinue=parsenoop;var parse_ShapePropsStream=parsenoop;var parse_TextPropsStream=parsenoop;var parse_RichTextStream=parsenoop;var parse_CrtLayout12A=parsenoop;var parse_Units=parsenoop;var parse_Chart=parsenoop;var parse_Series=parsenoop;var parse_DataFormat=parsenoop;var parse_LineFormat=parsenoop;var parse_MarkerFormat=parsenoop;var parse_AreaFormat=parsenoop;var parse_PieFormat=parsenoop;var parse_AttachedLabel=parsenoop;var parse_SeriesText=parsenoop;var parse_ChartFormat=parsenoop;var parse_Legend=parsenoop;var parse_SeriesList=parsenoop;var parse_Bar=parsenoop;var parse_Line=parsenoop;var parse_Pie=parsenoop;var parse_Area=parsenoop;var parse_Scatter=parsenoop;var parse_CrtLine=parsenoop;var parse_Axis=parsenoop;var parse_Tick=parsenoop;var parse_ValueRange=parsenoop;var parse_CatSerRange=parsenoop;var parse_AxisLine=parsenoop;var parse_CrtLink=parsenoop;var parse_DefaultText=parsenoop;var parse_Text=parsenoop;var parse_ObjectLink=parsenoop;var parse_Frame=parsenoop;var parse_Begin=parsenoop;var parse_End=parsenoop;var parse_PlotArea=parsenoop;var parse_Chart3d=parsenoop;var parse_PicF=parsenoop;var parse_DropBar=parsenoop;var parse_Radar=parsenoop;var parse_Surf=parsenoop;var parse_RadarArea=parsenoop;var parse_AxisParent=parsenoop;var parse_LegendException=parsenoop;var parse_ShtProps=parsenoop;var parse_SerToCrt=parsenoop;var parse_AxesUsed=parsenoop;var parse_SBaseRef=parsenoop;var parse_SerParent=parsenoop;var parse_SerAuxTrend=parsenoop;var parse_IFmtRecord=parsenoop;var parse_Pos=parsenoop;var parse_AlRuns=parsenoop;var parse_BRAI=parsenoop;var parse_SerAuxErrBar=parsenoop;var parse_SerFmt=parsenoop;var parse_Chart3DBarShape=parsenoop;var parse_Fbi=parsenoop;var parse_BopPop=parsenoop;var parse_AxcExt=parsenoop;var parse_Dat=parsenoop;var parse_PlotGrowth=parsenoop;var parse_SIIndex=parsenoop;var parse_GelFrame=parsenoop;var parse_BopPopCustom=parsenoop;var parse_Fbi2=parsenoop;function parse_BIFF5String(blob){var len=blob.read_shift(1);return blob.read_shift(len,\"sbcs-cont\")}function parse_BIFF2STR(blob,length,opts){var cell=parse_XLSCell(blob,6);++blob.l;var str=parse_XLUnicodeString2(blob,length-7,opts);cell.val=str;return cell}function parse_BIFF2NUM(blob,length,opts){var cell=parse_XLSCell(blob,6);++blob.l;var num=parse_Xnum(blob,8);cell.val=num;return cell}var CS2CP={0:1252,1:65001,2:65001,77:1e4,128:932,129:949,130:1361,134:936,136:950,161:1253,162:1254,163:1258,177:1255,178:1256,186:1257,204:1251,222:874,238:1250,255:1252,69:6969};var parse_rs=function parse_rs_factory(){var tregex=matchtag(\"t\"),rpregex=matchtag(\"rPr\"),rregex=/<r>/g,rend=/<\\/r>/,nlregex=/\\r\\n/g;var parse_rpr=function parse_rpr(rpr,intro,outro){var font={},cp=65001;var m=rpr.match(tagregex),i=0;if(m)for(;i!=m.length;++i){var y=parsexmltag(m[i]);switch(y[0]){case\"<condense\":break;case\"<extend\":break;case\"<shadow\":case\"<shadow/>\":break;case\"<charset\":if(y.val==\"1\")break;cp=CS2CP[parseInt(y.val,10)];break;case\"<outline\":case\"<outline/>\":break;case\"<rFont\":font.name=y.val;break;case\"<sz\":font.sz=y.val;break;case\"<strike\":if(!y.val)break;case\"<strike/>\":font.strike=1;break;case\"</strike>\":break;case\"<u\":if(!y.val)break;case\"<u/>\":font.u=1;break;case\"</u>\":break;case\"<b\":if(!y.val)break;case\"<b/>\":font.b=1;break;case\"</b>\":break;case\"<i\":if(!y.val)break;case\"<i/>\":font.i=1;break;case\"</i>\":break;case\"<color\":if(y.rgb)font.color=y.rgb.substr(2,6);break;case\"<family\":font.family=y.val;break;case\"<vertAlign\":break;case\"<scheme\":break;default:if(y[0].charCodeAt(1)!==47)throw\"Unrecognized rich format \"+y[0]}}var style=[];if(font.b)style.push(\"font-weight: bold;\");if(font.i)style.push(\"font-style: italic;\");intro.push('<span style=\"'+style.join(\"\")+'\">');outro.push(\"</span>\");return cp};function parse_r(r){var terms=[[],\"\",[]];var t=r.match(tregex),cp=65001;if(!isval(t))return\"\";terms[1]=t[1];var rpr=r.match(rpregex);if(isval(rpr))cp=parse_rpr(rpr[1],terms[0],terms[2]);return terms[0].join(\"\")+terms[1].replace(nlregex,\"<br/>\")+terms[2].join(\"\")}return function parse_rs(rs){return rs.replace(rregex,\"\").split(rend).map(parse_r).join(\"\")}}();var sitregex=/<t[^>]*>([^<]*)<\\/t>/g,sirregex=/<r>/;function parse_si(x,opts){var html=opts?opts.cellHTML:true;var z={};if(!x)return null;var y;if(x.charCodeAt(1)===116){z.t=utf8read(unescapexml(x.substr(x.indexOf(\">\")+1).split(/<\\/t>/)[0]));z.r=x;if(html)z.h=z.t}else if(y=x.match(sirregex)){z.r=x;z.t=utf8read(unescapexml(x.match(sitregex).join(\"\").replace(tagregex,\"\")));if(html)z.h=parse_rs(x)}return z}var sstr0=/<sst([^>]*)>([\\s\\S]*)<\\/sst>/;var sstr1=/<(?:si|sstItem)>/g;var sstr2=/<\\/(?:si|sstItem)>/;function parse_sst_xml(data,opts){var s=[],ss;var sst=data.match(sstr0);if(isval(sst)){ss=sst[2].replace(sstr1,\"\").split(sstr2);for(var i=0;i!=ss.length;++i){var o=parse_si(ss[i],opts);if(o!=null)s[s.length]=o}sst=parsexmltag(sst[1]);s.Count=sst.count;s.Unique=sst.uniqueCount}return s}RELS.SST=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/sharedStrings\";var straywsregex=/^\\s|\\s$|[\\t\\n\\r]/;function write_sst_xml(sst,opts){if(!opts.bookSST)return\"\";var o=[XML_HEADER];o[o.length]=writextag(\"sst\",null,{xmlns:XMLNS.main[0],count:sst.Count,uniqueCount:sst.Unique});for(var i=0;i!=sst.length;++i){if(sst[i]==null)continue;var s=sst[i];var sitag=\"<si>\";if(s.r)sitag+=s.r;else{sitag+=\"<t\";if(s.t.match(straywsregex))sitag+=' xml:space=\"preserve\"';sitag+=\">\"+escapexml(s.t)+\"</t>\"}sitag+=\"</si>\";o[o.length]=sitag}if(o.length>2){o[o.length]=\"</sst>\";o[1]=o[1].replace(\"/>\",\">\")}return o.join(\"\")}function parse_BrtBeginSst(data,length){return[data.read_shift(4),data.read_shift(4)]}function parse_sst_bin(data,opts){var s=[];var pass=false;recordhopper(data,function hopper_sst(val,R,RT){switch(R.n){case\"BrtBeginSst\":s.Count=val[0];s.Unique=val[1];break;case\"BrtSSTItem\":s.push(val);break;case\"BrtEndSst\":return true;case\"BrtFRTBegin\":pass=true;break;case\"BrtFRTEnd\":pass=false;break;default:if(!pass||opts.WTF)throw new Error(\"Unexpected record \"+RT+\" \"+R.n)}});return s}function write_BrtBeginSst(sst,o){if(!o)o=new_buf(8);o.write_shift(4,sst.Count);o.write_shift(4,sst.Unique);return o}var write_BrtSSTItem=write_RichStr;function write_sst_bin(sst,opts){var ba=buf_array();write_record(ba,\"BrtBeginSst\",write_BrtBeginSst(sst));for(var i=0;i<sst.length;++i)write_record(ba,\"BrtSSTItem\",write_BrtSSTItem(sst[i]));write_record(ba,\"BrtEndSst\");return ba.end()}function _JS2ANSI(str){if(typeof cptable!==\"undefined\")return cptable.utils.encode(1252,str);return str.split(\"\").map(function(x){return x.charCodeAt(0)})}function parse_Version(blob,length){var o={};o.Major=blob.read_shift(2);o.Minor=blob.read_shift(2);return o}function parse_EncryptionHeader(blob,length){var o={};o.Flags=blob.read_shift(4);var tmp=blob.read_shift(4);if(tmp!==0)throw\"Unrecognized SizeExtra: \"+tmp;o.AlgID=blob.read_shift(4);switch(o.AlgID){case 0:case 26625:case 26126:case 26127:case 26128:break;default:throw\"Unrecognized encryption algorithm: \"+o.AlgID}parsenoop(blob,length-12);return o}function parse_EncryptionVerifier(blob,length){return parsenoop(blob,length)}function parse_RC4CryptoHeader(blob,length){var o={};var vers=o.EncryptionVersionInfo=parse_Version(blob,4);length-=4;if(vers.Minor!=2)throw\"unrecognized minor version code: \"+vers.Minor;if(vers.Major>4||vers.Major<2)throw\"unrecognized major version code: \"+vers.Major;o.Flags=blob.read_shift(4);length-=4;var sz=blob.read_shift(4);length-=4;o.EncryptionHeader=parse_EncryptionHeader(blob,sz);length-=sz;o.EncryptionVerifier=parse_EncryptionVerifier(blob,length);return o}function parse_RC4Header(blob,length){var o={};var vers=o.EncryptionVersionInfo=parse_Version(blob,4);length-=4;if(vers.Major!=1||vers.Minor!=1)throw\"unrecognized version code \"+vers.Major+\" : \"+vers.Minor;o.Salt=blob.read_shift(16);o.EncryptedVerifier=blob.read_shift(16);o.EncryptedVerifierHash=blob.read_shift(16);return o}function crypto_CreatePasswordVerifier_Method1(Password){var Verifier=0,PasswordArray;var PasswordDecoded=_JS2ANSI(Password);var len=PasswordDecoded.length+1,i,PasswordByte;var Intermediate1,Intermediate2,Intermediate3;PasswordArray=new_raw_buf(len);PasswordArray[0]=PasswordDecoded.length;for(i=1;i!=len;++i)PasswordArray[i]=PasswordDecoded[i-1];for(i=len-1;i>=0;--i){PasswordByte=PasswordArray[i];Intermediate1=(Verifier&16384)===0?0:1;Intermediate2=Verifier<<1&32767;Intermediate3=Intermediate1|Intermediate2;Verifier=Intermediate3^PasswordByte}return Verifier^52811}var crypto_CreateXorArray_Method1=function(){var PadArray=[187,255,255,186,255,255,185,128,0,190,15,0,191,15,0];var InitialCode=[57840,7439,52380,33984,4364,3600,61902,12606,6258,57657,54287,34041,10252,43370,20163];var XorMatrix=[44796,19929,39858,10053,20106,40212,10761,31585,63170,64933,60267,50935,40399,11199,17763,35526,1453,2906,5812,11624,23248,885,1770,3540,7080,14160,28320,56640,55369,41139,20807,41614,21821,43642,17621,28485,56970,44341,19019,38038,14605,29210,60195,50791,40175,10751,21502,43004,24537,18387,36774,3949,7898,15796,31592,63184,47201,24803,49606,37805,14203,28406,56812,17824,35648,1697,3394,6788,13576,27152,43601,17539,35078,557,1114,2228,4456,30388,60776,51953,34243,7079,14158,28316,14128,28256,56512,43425,17251,34502,7597,13105,26210,52420,35241,883,1766,3532,4129,8258,16516,33032,4657,9314,18628];\nvar Ror=function(Byte){return(Byte/2|Byte*128)&255};var XorRor=function(byte1,byte2){return Ror(byte1^byte2)};var CreateXorKey_Method1=function(Password){var XorKey=InitialCode[Password.length-1];var CurrentElement=104;for(var i=Password.length-1;i>=0;--i){var Char=Password[i];for(var j=0;j!=7;++j){if(Char&64)XorKey^=XorMatrix[CurrentElement];Char*=2;--CurrentElement}}return XorKey};return function(password){var Password=_JS2ANSI(password);var XorKey=CreateXorKey_Method1(Password);var Index=Password.length;var ObfuscationArray=new_raw_buf(16);for(var i=0;i!=16;++i)ObfuscationArray[i]=0;var Temp,PasswordLastChar,PadIndex;if((Index&1)===1){Temp=XorKey>>8;ObfuscationArray[Index]=XorRor(PadArray[0],Temp);--Index;Temp=XorKey&255;PasswordLastChar=Password[Password.length-1];ObfuscationArray[Index]=XorRor(PasswordLastChar,Temp)}while(Index>0){--Index;Temp=XorKey>>8;ObfuscationArray[Index]=XorRor(Password[Index],Temp);--Index;Temp=XorKey&255;ObfuscationArray[Index]=XorRor(Password[Index],Temp)}Index=15;PadIndex=15-Password.length;while(PadIndex>0){Temp=XorKey>>8;ObfuscationArray[Index]=XorRor(PadArray[PadIndex],Temp);--Index;--PadIndex;Temp=XorKey&255;ObfuscationArray[Index]=XorRor(Password[Index],Temp);--Index;--PadIndex}return ObfuscationArray}}();var crypto_DecryptData_Method1=function(password,Data,XorArrayIndex,XorArray,O){if(!O)O=Data;if(!XorArray)XorArray=crypto_CreateXorArray_Method1(password);var Index,Value;for(Index=0;Index!=Data.length;++Index){Value=Data[Index];Value^=XorArray[XorArrayIndex];Value=(Value>>5|Value<<3)&255;O[Index]=Value;++XorArrayIndex}return[O,XorArrayIndex,XorArray]};var crypto_MakeXorDecryptor=function(password){var XorArrayIndex=0,XorArray=crypto_CreateXorArray_Method1(password);return function(Data){var O=crypto_DecryptData_Method1(null,Data,XorArrayIndex,XorArray);XorArrayIndex=O[1];return O[0]}};function parse_XORObfuscation(blob,length,opts,out){var o={key:parseuint16(blob),verificationBytes:parseuint16(blob)};if(opts.password)o.verifier=crypto_CreatePasswordVerifier_Method1(opts.password);out.valid=o.verificationBytes===o.verifier;if(out.valid)out.insitu_decrypt=crypto_MakeXorDecryptor(opts.password);return o}function parse_FilePassHeader(blob,length,oo){var o=oo||{};o.Info=blob.read_shift(2);blob.l-=2;if(o.Info===1)o.Data=parse_RC4Header(blob,length);else o.Data=parse_RC4CryptoHeader(blob,length);return o}function parse_FilePass(blob,length,opts){var o={Type:blob.read_shift(2)};if(o.Type)parse_FilePassHeader(blob,length-2,o);else parse_XORObfuscation(blob,length-2,opts,o);return o}function hex2RGB(h){var o=h.substr(h[0]===\"#\"?1:0,6);return[parseInt(o.substr(0,2),16),parseInt(o.substr(2,2),16),parseInt(o.substr(4,2),16)]}function rgb2Hex(rgb){for(var i=0,o=1;i!=3;++i)o=o*256+(rgb[i]>255?255:rgb[i]<0?0:rgb[i]);return o.toString(16).toUpperCase().substr(1)}function rgb2HSL(rgb){var R=rgb[0]/255,G=rgb[1]/255,B=rgb[2]/255;var M=Math.max(R,G,B),m=Math.min(R,G,B),C=M-m;if(C===0)return[0,0,R];var H6=0,S=0,L2=M+m;S=C/(L2>1?2-L2:L2);switch(M){case R:H6=((G-B)/C+6)%6;break;case G:H6=(B-R)/C+2;break;case B:H6=(R-G)/C+4;break}return[H6/6,S,L2/2]}function hsl2RGB(hsl){var H=hsl[0],S=hsl[1],L=hsl[2];var C=S*2*(L<.5?L:1-L),m=L-C/2;var rgb=[m,m,m],h6=6*H;var X;if(S!==0)switch(h6|0){case 0:case 6:X=C*h6;rgb[0]+=C;rgb[1]+=X;break;case 1:X=C*(2-h6);rgb[0]+=X;rgb[1]+=C;break;case 2:X=C*(h6-2);rgb[1]+=C;rgb[2]+=X;break;case 3:X=C*(4-h6);rgb[1]+=X;rgb[2]+=C;break;case 4:X=C*(h6-4);rgb[2]+=C;rgb[0]+=X;break;case 5:X=C*(6-h6);rgb[2]+=X;rgb[0]+=C;break}for(var i=0;i!=3;++i)rgb[i]=Math.round(rgb[i]*255);return rgb}function rgb_tint(hex,tint){if(tint==0)return hex;var hsl=rgb2HSL(hex2RGB(hex));if(tint<0)hsl[2]=hsl[2]*(1+tint);else hsl[2]=1-(1-hsl[2])*(1-tint);var rev=rgb2Hex(hsl2RGB(hsl));return rev}var DEF_MDW=7,MAX_MDW=15,MIN_MDW=1,MDW=DEF_MDW;function width2px(width){return(width+(128/MDW|0)/256)*MDW|0}function px2char(px){return((px-5)/MDW*100+.5|0)/100}function char2width(chr){return((chr*MDW+5)/MDW*256|0)/256}function cycle_width(collw){return char2width(px2char(width2px(collw)))}function find_mdw(collw,coll){if(cycle_width(collw)!=collw){for(MDW=DEF_MDW;MDW>MIN_MDW;--MDW)if(cycle_width(collw)===collw)break;if(MDW===MIN_MDW)for(MDW=DEF_MDW+1;MDW<MAX_MDW;++MDW)if(cycle_width(collw)===collw)break;if(MDW===MAX_MDW)MDW=DEF_MDW}}var XLMLPatternTypeMap={None:\"none\",Solid:\"solid\",Gray50:\"mediumGray\",Gray75:\"darkGray\",Gray25:\"lightGray\",HorzStripe:\"darkHorizontal\",VertStripe:\"darkVertical\",ReverseDiagStripe:\"darkDown\",DiagStripe:\"darkUp\",DiagCross:\"darkGrid\",ThickDiagCross:\"darkTrellis\",ThinHorzStripe:\"lightHorizontal\",ThinVertStripe:\"lightVertical\",ThinReverseDiagStripe:\"lightDown\",ThinHorzCross:\"lightGrid\"};var styles={};var themes={};function parse_fills(t,opts){styles.Fills=[];var fill={};t[0].match(tagregex).forEach(function(x){var y=parsexmltag(x);switch(y[0]){case\"<fills\":case\"<fills>\":case\"</fills>\":break;case\"<fill>\":break;case\"</fill>\":styles.Fills.push(fill);fill={};break;case\"<patternFill\":if(y.patternType)fill.patternType=y.patternType;break;case\"<patternFill/>\":case\"</patternFill>\":break;case\"<bgColor\":if(!fill.bgColor)fill.bgColor={};if(y.indexed)fill.bgColor.indexed=parseInt(y.indexed,10);if(y.theme)fill.bgColor.theme=parseInt(y.theme,10);if(y.tint)fill.bgColor.tint=parseFloat(y.tint);if(y.theme&&themes.themeElements&&themes.themeElements.clrScheme){fill.bgColor.rgb=rgb_tint(themes.themeElements.clrScheme[fill.bgColor.theme].rgb,fill.bgColor.tint||0);if(opts.WTF)fill.bgColor.raw_rgb=rgb_tint(themes.themeElements.clrScheme[fill.bgColor.theme].rgb,0)}if(y.rgb)fill.bgColor.rgb=y.rgb;break;case\"<bgColor/>\":case\"</bgColor>\":break;case\"<fgColor\":if(!fill.fgColor)fill.fgColor={};if(y.theme)fill.fgColor.theme=parseInt(y.theme,10);if(y.tint)fill.fgColor.tint=parseFloat(y.tint);if(y.theme&&themes.themeElements&&themes.themeElements.clrScheme){fill.fgColor.rgb=rgb_tint(themes.themeElements.clrScheme[fill.fgColor.theme].rgb,fill.fgColor.tint||0);if(opts.WTF)fill.fgColor.raw_rgb=rgb_tint(themes.themeElements.clrScheme[fill.fgColor.theme].rgb,0)}if(y.rgb)fill.fgColor.rgb=y.rgb;break;case\"<fgColor/>\":case\"</fgColor>\":break;default:if(opts.WTF)throw\"unrecognized \"+y[0]+\" in fills\"}})}function parse_fonts(t,opts){styles.Fonts=[];var font={};t[0].match(tagregex).forEach(function(x){var y=parsexmltag(x);switch(y[0]){case\"<fonts\":case\"<fonts>\":case\"</fonts>\":break;case\"<font\":break;case\"</font>\":styles.Fonts.push(font);font={};break;case\"<name\":if(y.val)font.name=y.val;break;case\"<name/>\":case\"</name>\":break;case\"<b/>\":font.bold=true;break;case\"<u/>\":font.underline=true;break;case\"<i/>\":font.italic=true;break;case\"<strike/>\":font.strike=true;break;case\"<outline/>\":font.outline=true;break;case\"<shadow/>\":font.shadow=true;break;case\"<sz\":if(y.val)font.sz=y.val;break;case\"<sz/>\":case\"</sz>\":break;case\"<vertAlign\":if(y.val)font.vertAlign=y.val;break;case\"<vertAlign/>\":case\"</vertAlign>\":break;case\"<color\":if(!font.color)font.color={};if(y.theme)font.color.theme=y.theme;if(y.tint)font.color.tint=y.tint;if(y.theme&&themes.themeElements&&themes.themeElements.clrScheme){font.color.rgb=rgb_tint(themes.themeElements.clrScheme[font.color.theme].rgb,font.color.tint||0)}if(y.rgb)font.color.rgb=y.rgb;break;case\"<color/>\":case\"</color>\":break}})}function parse_borders(t,opts){styles.Borders=[];var border={},sub_border={};t[0].match(tagregex).forEach(function(x){var y=parsexmltag(x);switch(y[0]){case\"<borders\":case\"<borders>\":case\"</borders>\":break;case\"<border\":case\"<border>\":border={};if(y.diagonalUp){border.diagonalUp=y.diagonalUp}if(y.diagonalDown){border.diagonalDown=y.diagonalDown}styles.Borders.push(border);break;break;case\"</border>\":break;case\"<left\":sub_border=border.left={};if(y.style){sub_border.style=y.style}break;case\"<right\":sub_border=border.right={};if(y.style){sub_border.style=y.style}break;case\"<top\":sub_border=border.top={};if(y.style){sub_border.style=y.style}break;case\"<bottom\":sub_border=border.bottom={};if(y.style){sub_border.style=y.style}break;case\"<diagonal\":sub_border=border.diagonal={};if(y.style){sub_border.style=y.style}break;case\"<color\":sub_border.color={};if(y.theme)sub_border.color.theme=y.theme;if(y.theme&&themes.themeElements&&themes.themeElements.clrScheme){sub_border.color.rgb=rgb_tint(themes.themeElements.clrScheme[sub_border.color.theme].rgb,sub_border.color.tint||0)}if(y.tint)sub_border.color.tint=y.tint;if(y.rgb)sub_border.color.rgb=y.rgb;if(y.auto)sub_border.color.auto=y.auto;break;case\"<name/>\":case\"</name>\":break;default:break}})}function parse_numFmts(t,opts){styles.NumberFmt=[];var k=keys(SSF._table);for(var i=0;i<k.length;++i)styles.NumberFmt[k[i]]=SSF._table[k[i]];var m=t[0].match(tagregex);for(i=0;i<m.length;++i){var y=parsexmltag(m[i]);switch(y[0]){case\"<numFmts\":case\"</numFmts>\":case\"<numFmts/>\":case\"<numFmts>\":break;case\"<numFmt\":{var f=unescapexml(utf8read(y.formatCode)),j=parseInt(y.numFmtId,10);styles.NumberFmt[j]=f;if(j>0)SSF.load(f,j)}break;default:if(opts.WTF)throw\"unrecognized \"+y[0]+\" in numFmts\"}}}function write_numFmts(NF,opts){var o=[\"<numFmts>\"];[[5,8],[23,26],[41,44],[63,66],[164,392]].forEach(function(r){for(var i=r[0];i<=r[1];++i)if(NF[i]!==undefined)o[o.length]=writextag(\"numFmt\",null,{numFmtId:i,formatCode:escapexml(NF[i])})});if(o.length===1)return\"\";o[o.length]=\"</numFmts>\";o[0]=writextag(\"numFmts\",null,{count:o.length-2}).replace(\"/>\",\">\");return o.join(\"\")}function parse_cellXfs(t,opts){styles.CellXf=[];var xf;t[0].match(tagregex).forEach(function(x){var y=parsexmltag(x);switch(y[0]){case\"<cellXfs\":case\"<cellXfs>\":case\"<cellXfs/>\":case\"</cellXfs>\":break;case\"<xf\":xf=y;delete xf[0];delete y[0];if(xf.numFmtId)xf.numFmtId=parseInt(xf.numFmtId,10);if(xf.fillId)xf.fillId=parseInt(xf.fillId,10);styles.CellXf.push(xf);break;case\"</xf>\":break;case\"<alignment\":case\"<alignment/>\":var alignment={};if(y.vertical){alignment.vertical=y.vertical}if(y.horizontal){alignment.horizontal=y.horizontal}if(y.textRotation!=undefined){alignment.textRotation=y.textRotation}if(y.indent){alignment.indent=y.indent}if(y.wrapText){alignment.wrapText=y.wrapText}xf.alignment=alignment;break;case\"<protection\":case\"</protection>\":case\"<protection/>\":break;case\"<extLst\":case\"</extLst>\":break;case\"<ext\":break;default:if(opts.WTF)throw\"unrecognized \"+y[0]+\" in cellXfs\"}})}function write_cellXfs(cellXfs){var o=[];o[o.length]=writextag(\"cellXfs\",null);cellXfs.forEach(function(c){o[o.length]=writextag(\"xf\",null,c)});o[o.length]=\"</cellXfs>\";if(o.length===2)return\"\";o[0]=writextag(\"cellXfs\",null,{count:o.length-2}).replace(\"/>\",\">\");return o.join(\"\")}var parse_sty_xml=function make_pstyx(){var numFmtRegex=/<numFmts([^>]*)>.*<\\/numFmts>/;var cellXfRegex=/<cellXfs([^>]*)>.*<\\/cellXfs>/;var fillsRegex=/<fills([^>]*)>.*<\\/fills>/;var bordersRegex=/<borders([^>]*)>.*<\\/borders>/;return function parse_sty_xml(data,opts){var t;if(t=data.match(numFmtRegex))parse_numFmts(t,opts);if(t=data.match(/<fonts([^>]*)>.*<\\/fonts>/))parse_fonts(t,opts);if(t=data.match(fillsRegex))parse_fills(t,opts);if(t=data.match(bordersRegex))parse_borders(t,opts);if(t=data.match(cellXfRegex))parse_cellXfs(t,opts);return styles}}();var STYLES_XML_ROOT=writextag(\"styleSheet\",null,{xmlns:XMLNS.main[0],\"xmlns:vt\":XMLNS.vt});RELS.STY=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles\";function write_sty_xml(wb,opts){if(typeof style_builder!=\"undefined\"&&typeof\"require\"!=\"undefined\"){return style_builder.toXml()}var o=[XML_HEADER,STYLES_XML_ROOT],w;if((w=write_numFmts(wb.SSF))!=null)o[o.length]=w;o[o.length]='<fonts count=\"1\"><font><sz val=\"12\"/><color theme=\"1\"/><name val=\"Calibri\"/><family val=\"2\"/><scheme val=\"minor\"/></font></fonts>';o[o.length]='<fills count=\"2\"><fill><patternFill patternType=\"none\"/></fill><fill><patternFill patternType=\"gray125\"/></fill></fills>';o[o.length]='<borders count=\"1\"><border><left/><right/><top/><bottom/><diagonal/></border></borders>';o[o.length]='<cellStyleXfs count=\"1\"><xf numFmtId=\"0\" fontId=\"0\" fillId=\"0\" borderId=\"0\"/></cellStyleXfs>';if(w=write_cellXfs(opts.cellXfs))o[o.length]=w;o[o.length]='<cellStyles count=\"1\"><cellStyle name=\"Normal\" xfId=\"0\" builtinId=\"0\"/></cellStyles>';o[o.length]='<dxfs count=\"0\"/>';o[o.length]='<tableStyles count=\"0\" defaultTableStyle=\"TableStyleMedium9\" defaultPivotStyle=\"PivotStyleMedium4\"/>';if(o.length>2){o[o.length]=\"</styleSheet>\";o[1]=o[1].replace(\"/>\",\">\")}return o.join(\"\")}function parse_BrtFmt(data,length){var ifmt=data.read_shift(2);var stFmtCode=parse_XLWideString(data,length-2);return[ifmt,stFmtCode]}function parse_BrtFont(data,length){var out={flags:{}};out.dyHeight=data.read_shift(2);out.grbit=parse_FontFlags(data,2);out.bls=data.read_shift(2);out.sss=data.read_shift(2);out.uls=data.read_shift(1);out.bFamily=data.read_shift(1);out.bCharSet=data.read_shift(1);data.l++;out.brtColor=parse_BrtColor(data,8);out.bFontScheme=data.read_shift(1);out.name=parse_XLWideString(data,length-21);out.flags.Bold=out.bls===700;out.flags.Italic=out.grbit.fItalic;out.flags.Strikeout=out.grbit.fStrikeout;out.flags.Outline=out.grbit.fOutline;out.flags.Shadow=out.grbit.fShadow;out.flags.Condense=out.grbit.fCondense;out.flags.Extend=out.grbit.fExtend;out.flags.Sub=out.sss&2;out.flags.Sup=out.sss&1;return out}function parse_BrtXF(data,length){var ixfeParent=data.read_shift(2);var ifmt=data.read_shift(2);parsenoop(data,length-4);return{ixfe:ixfeParent,ifmt:ifmt}}function parse_sty_bin(data,opts){styles.NumberFmt=[];for(var y in SSF._table)styles.NumberFmt[y]=SSF._table[y];styles.CellXf=[];var state=\"\";var pass=false;recordhopper(data,function hopper_sty(val,R,RT){switch(R.n){case\"BrtFmt\":styles.NumberFmt[val[0]]=val[1];SSF.load(val[1],val[0]);break;case\"BrtFont\":break;case\"BrtKnownFonts\":break;case\"BrtFill\":break;case\"BrtBorder\":break;case\"BrtXF\":if(state===\"CELLXFS\"){styles.CellXf.push(val)}break;case\"BrtStyle\":break;case\"BrtDXF\":break;case\"BrtMRUColor\":break;case\"BrtIndexedColor\":break;case\"BrtBeginStyleSheet\":break;case\"BrtEndStyleSheet\":break;case\"BrtBeginTableStyle\":break;case\"BrtTableStyleElement\":break;case\"BrtEndTableStyle\":break;case\"BrtBeginFmts\":state=\"FMTS\";break;case\"BrtEndFmts\":state=\"\";break;case\"BrtBeginFonts\":state=\"FONTS\";break;case\"BrtEndFonts\":state=\"\";break;case\"BrtACBegin\":state=\"ACFONTS\";break;case\"BrtACEnd\":state=\"\";break;case\"BrtBeginFills\":state=\"FILLS\";break;case\"BrtEndFills\":state=\"\";break;case\"BrtBeginBorders\":state=\"BORDERS\";break;case\"BrtEndBorders\":state=\"\";break;case\"BrtBeginCellStyleXFs\":state=\"CELLSTYLEXFS\";break;case\"BrtEndCellStyleXFs\":state=\"\";break;case\"BrtBeginCellXFs\":state=\"CELLXFS\";break;case\"BrtEndCellXFs\":state=\"\";break;case\"BrtBeginStyles\":state=\"STYLES\";break;case\"BrtEndStyles\":state=\"\";break;case\"BrtBeginDXFs\":state=\"DXFS\";break;case\"BrtEndDXFs\":state=\"\";break;case\"BrtBeginTableStyles\":state=\"TABLESTYLES\";break;case\"BrtEndTableStyles\":state=\"\";break;case\"BrtBeginColorPalette\":state=\"COLORPALETTE\";break;case\"BrtEndColorPalette\":state=\"\";break;case\"BrtBeginIndexedColors\":state=\"INDEXEDCOLORS\";break;case\"BrtEndIndexedColors\":state=\"\";break;case\"BrtBeginMRUColors\":state=\"MRUCOLORS\";break;case\"BrtEndMRUColors\":state=\"\";break;case\"BrtFRTBegin\":pass=true;break;case\"BrtFRTEnd\":pass=false;break;case\"BrtBeginStyleSheetExt14\":break;case\"BrtBeginSlicerStyles\":break;case\"BrtEndSlicerStyles\":break;case\"BrtBeginTimelineStylesheetExt15\":break;case\"BrtEndTimelineStylesheetExt15\":break;case\"BrtBeginTimelineStyles\":break;case\"BrtEndTimelineStyles\":break;case\"BrtEndStyleSheetExt14\":break;default:if(!pass||opts.WTF)throw new Error(\"Unexpected record \"+RT+\" \"+R.n)}});return styles}function write_sty_bin(data,opts){var ba=buf_array();write_record(ba,\"BrtBeginStyleSheet\");write_record(ba,\"BrtEndStyleSheet\");return ba.end()}RELS.THEME=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/theme\";function parse_clrScheme(t,opts){themes.themeElements.clrScheme=[];var color={};t[0].match(tagregex).forEach(function(x){var y=parsexmltag(x);switch(y[0]){case\"<a:clrScheme\":case\"</a:clrScheme>\":break;case\"<a:srgbClr\":color.rgb=y.val;break;case\"<a:sysClr\":color.rgb=y.lastClr;break;case\"<a:dk1>\":case\"</a:dk1>\":case\"<a:dk2>\":case\"</a:dk2>\":case\"<a:lt1>\":case\"</a:lt1>\":case\"<a:lt2>\":case\"</a:lt2>\":case\"<a:accent1>\":case\"</a:accent1>\":case\"<a:accent2>\":case\"</a:accent2>\":case\"<a:accent3>\":case\"</a:accent3>\":case\"<a:accent4>\":case\"</a:accent4>\":case\"<a:accent5>\":case\"</a:accent5>\":case\"<a:accent6>\":case\"</a:accent6>\":case\"<a:hlink>\":case\"</a:hlink>\":case\"<a:folHlink>\":case\"</a:folHlink>\":if(y[0][1]===\"/\"){themes.themeElements.clrScheme.push(color);color={}}else{color.name=y[0].substring(3,y[0].length-1)}break;default:if(opts.WTF)throw\"unrecognized \"+y[0]+\" in clrScheme\"}})}function parse_fontScheme(t,opts){}function parse_fmtScheme(t,opts){}var clrsregex=/<a:clrScheme([^>]*)>[^\\u2603]*<\\/a:clrScheme>/;var fntsregex=/<a:fontScheme([^>]*)>[^\\u2603]*<\\/a:fontScheme>/;var fmtsregex=/<a:fmtScheme([^>]*)>[^\\u2603]*<\\/a:fmtScheme>/;function parse_themeElements(data,opts){themes.themeElements={};var t;[[\"clrScheme\",clrsregex,parse_clrScheme],[\"fontScheme\",fntsregex,parse_fontScheme],[\"fmtScheme\",fmtsregex,parse_fmtScheme]].forEach(function(m){if(!(t=data.match(m[1])))throw m[0]+\" not found in themeElements\";m[2](t,opts)})}var themeltregex=/<a:themeElements([^>]*)>[^\\u2603]*<\\/a:themeElements>/;function parse_theme_xml(data,opts){if(!data||data.length===0)return themes;var t;if(!(t=data.match(themeltregex)))throw\"themeElements not found in theme\";parse_themeElements(t[0],opts);return themes}function write_theme(opts){if(opts.themeXml){return opts.themeXml}return'<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>\\n<a:theme xmlns:a=\"http://schemas.openxmlformats.org/drawingml/2006/main\" name=\"Office Theme\"><a:themeElements><a:clrScheme name=\"Office\"><a:dk1><a:sysClr val=\"windowText\" lastClr=\"000000\"/></a:dk1><a:lt1><a:sysClr val=\"window\" lastClr=\"FFFFFF\"/></a:lt1><a:dk2><a:srgbClr val=\"1F497D\"/></a:dk2><a:lt2><a:srgbClr val=\"EEECE1\"/></a:lt2><a:accent1><a:srgbClr val=\"4F81BD\"/></a:accent1><a:accent2><a:srgbClr val=\"C0504D\"/></a:accent2><a:accent3><a:srgbClr val=\"9BBB59\"/></a:accent3><a:accent4><a:srgbClr val=\"8064A2\"/></a:accent4><a:accent5><a:srgbClr val=\"4BACC6\"/></a:accent5><a:accent6><a:srgbClr val=\"F79646\"/></a:accent6><a:hlink><a:srgbClr val=\"0000FF\"/></a:hlink><a:folHlink><a:srgbClr val=\"800080\"/></a:folHlink></a:clrScheme><a:fontScheme name=\"Office\"><a:majorFont><a:latin typeface=\"Cambria\"/><a:ea typeface=\"\"/><a:cs typeface=\"\"/><a:font script=\"Jpan\" typeface=\"ＭＳ Ｐゴシック\"/><a:font script=\"Hang\" typeface=\"맑은 고딕\"/><a:font script=\"Hans\" typeface=\"宋体\"/><a:font script=\"Hant\" typeface=\"新細明體\"/><a:font script=\"Arab\" typeface=\"Times New Roman\"/><a:font script=\"Hebr\" typeface=\"Times New Roman\"/><a:font script=\"Thai\" typeface=\"Tahoma\"/><a:font script=\"Ethi\" typeface=\"Nyala\"/><a:font script=\"Beng\" typeface=\"Vrinda\"/><a:font script=\"Gujr\" typeface=\"Shruti\"/><a:font script=\"Khmr\" typeface=\"MoolBoran\"/><a:font script=\"Knda\" typeface=\"Tunga\"/><a:font script=\"Guru\" typeface=\"Raavi\"/><a:font script=\"Cans\" typeface=\"Euphemia\"/><a:font script=\"Cher\" typeface=\"Plantagenet Cherokee\"/><a:font script=\"Yiii\" typeface=\"Microsoft Yi Baiti\"/><a:font script=\"Tibt\" typeface=\"Microsoft Himalaya\"/><a:font script=\"Thaa\" typeface=\"MV Boli\"/><a:font script=\"Deva\" typeface=\"Mangal\"/><a:font script=\"Telu\" typeface=\"Gautami\"/><a:font script=\"Taml\" typeface=\"Latha\"/><a:font script=\"Syrc\" typeface=\"Estrangelo Edessa\"/><a:font script=\"Orya\" typeface=\"Kalinga\"/><a:font script=\"Mlym\" typeface=\"Kartika\"/><a:font script=\"Laoo\" typeface=\"DokChampa\"/><a:font script=\"Sinh\" typeface=\"Iskoola Pota\"/><a:font script=\"Mong\" typeface=\"Mongolian Baiti\"/><a:font script=\"Viet\" typeface=\"Times New Roman\"/><a:font script=\"Uigh\" typeface=\"Microsoft Uighur\"/><a:font script=\"Geor\" typeface=\"Sylfaen\"/></a:majorFont><a:minorFont><a:latin typeface=\"Calibri\"/><a:ea typeface=\"\"/><a:cs typeface=\"\"/><a:font script=\"Jpan\" typeface=\"ＭＳ Ｐゴシック\"/><a:font script=\"Hang\" typeface=\"맑은 고딕\"/><a:font script=\"Hans\" typeface=\"宋体\"/><a:font script=\"Hant\" typeface=\"新細明體\"/><a:font script=\"Arab\" typeface=\"Arial\"/><a:font script=\"Hebr\" typeface=\"Arial\"/><a:font script=\"Thai\" typeface=\"Tahoma\"/><a:font script=\"Ethi\" typeface=\"Nyala\"/><a:font script=\"Beng\" typeface=\"Vrinda\"/><a:font script=\"Gujr\" typeface=\"Shruti\"/><a:font script=\"Khmr\" typeface=\"DaunPenh\"/><a:font script=\"Knda\" typeface=\"Tunga\"/><a:font script=\"Guru\" typeface=\"Raavi\"/><a:font script=\"Cans\" typeface=\"Euphemia\"/><a:font script=\"Cher\" typeface=\"Plantagenet Cherokee\"/><a:font script=\"Yiii\" typeface=\"Microsoft Yi Baiti\"/><a:font script=\"Tibt\" typeface=\"Microsoft Himalaya\"/><a:font script=\"Thaa\" typeface=\"MV Boli\"/><a:font script=\"Deva\" typeface=\"Mangal\"/><a:font script=\"Telu\" typeface=\"Gautami\"/><a:font script=\"Taml\" typeface=\"Latha\"/><a:font script=\"Syrc\" typeface=\"Estrangelo Edessa\"/><a:font script=\"Orya\" typeface=\"Kalinga\"/><a:font script=\"Mlym\" typeface=\"Kartika\"/><a:font script=\"Laoo\" typeface=\"DokChampa\"/><a:font script=\"Sinh\" typeface=\"Iskoola Pota\"/><a:font script=\"Mong\" typeface=\"Mongolian Baiti\"/><a:font script=\"Viet\" typeface=\"Arial\"/><a:font script=\"Uigh\" typeface=\"Microsoft Uighur\"/><a:font script=\"Geor\" typeface=\"Sylfaen\"/></a:minorFont></a:fontScheme><a:fmtScheme name=\"Office\"><a:fillStyleLst><a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill><a:gradFill rotWithShape=\"1\"><a:gsLst><a:gs pos=\"0\"><a:schemeClr val=\"phClr\"><a:tint val=\"50000\"/><a:satMod val=\"300000\"/></a:schemeClr></a:gs><a:gs pos=\"35000\"><a:schemeClr val=\"phClr\"><a:tint val=\"37000\"/><a:satMod val=\"300000\"/></a:schemeClr></a:gs><a:gs pos=\"100000\"><a:schemeClr val=\"phClr\"><a:tint val=\"15000\"/><a:satMod val=\"350000\"/></a:schemeClr></a:gs></a:gsLst><a:lin ang=\"16200000\" scaled=\"1\"/></a:gradFill><a:gradFill rotWithShape=\"1\"><a:gsLst><a:gs pos=\"0\"><a:schemeClr val=\"phClr\"><a:tint val=\"100000\"/><a:shade val=\"100000\"/><a:satMod val=\"130000\"/></a:schemeClr></a:gs><a:gs pos=\"100000\"><a:schemeClr val=\"phClr\"><a:tint val=\"50000\"/><a:shade val=\"100000\"/><a:satMod val=\"350000\"/></a:schemeClr></a:gs></a:gsLst><a:lin ang=\"16200000\" scaled=\"0\"/></a:gradFill></a:fillStyleLst><a:lnStyleLst><a:ln w=\"9525\" cap=\"flat\" cmpd=\"sng\" algn=\"ctr\"><a:solidFill><a:schemeClr val=\"phClr\"><a:shade val=\"95000\"/><a:satMod val=\"105000\"/></a:schemeClr></a:solidFill><a:prstDash val=\"solid\"/></a:ln><a:ln w=\"25400\" cap=\"flat\" cmpd=\"sng\" algn=\"ctr\"><a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill><a:prstDash val=\"solid\"/></a:ln><a:ln w=\"38100\" cap=\"flat\" cmpd=\"sng\" algn=\"ctr\"><a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill><a:prstDash val=\"solid\"/></a:ln></a:lnStyleLst><a:effectStyleLst><a:effectStyle><a:effectLst><a:outerShdw blurRad=\"40000\" dist=\"20000\" dir=\"5400000\" rotWithShape=\"0\"><a:srgbClr val=\"000000\"><a:alpha val=\"38000\"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad=\"40000\" dist=\"23000\" dir=\"5400000\" rotWithShape=\"0\"><a:srgbClr val=\"000000\"><a:alpha val=\"35000\"/></a:srgbClr></a:outerShdw></a:effectLst></a:effectStyle><a:effectStyle><a:effectLst><a:outerShdw blurRad=\"40000\" dist=\"23000\" dir=\"5400000\" rotWithShape=\"0\"><a:srgbClr val=\"000000\"><a:alpha val=\"35000\"/></a:srgbClr></a:outerShdw></a:effectLst><a:scene3d><a:camera prst=\"orthographicFront\"><a:rot lat=\"0\" lon=\"0\" rev=\"0\"/></a:camera><a:lightRig rig=\"threePt\" dir=\"t\"><a:rot lat=\"0\" lon=\"0\" rev=\"1200000\"/></a:lightRig></a:scene3d><a:sp3d><a:bevelT w=\"63500\" h=\"25400\"/></a:sp3d></a:effectStyle></a:effectStyleLst><a:bgFillStyleLst><a:solidFill><a:schemeClr val=\"phClr\"/></a:solidFill><a:gradFill rotWithShape=\"1\"><a:gsLst><a:gs pos=\"0\"><a:schemeClr val=\"phClr\"><a:tint val=\"40000\"/><a:satMod val=\"350000\"/></a:schemeClr></a:gs><a:gs pos=\"40000\"><a:schemeClr val=\"phClr\"><a:tint val=\"45000\"/><a:shade val=\"99000\"/><a:satMod val=\"350000\"/></a:schemeClr></a:gs><a:gs pos=\"100000\"><a:schemeClr val=\"phClr\"><a:shade val=\"20000\"/><a:satMod val=\"255000\"/></a:schemeClr></a:gs></a:gsLst><a:path path=\"circle\"><a:fillToRect l=\"50000\" t=\"-80000\" r=\"50000\" b=\"180000\"/></a:path></a:gradFill><a:gradFill rotWithShape=\"1\"><a:gsLst><a:gs pos=\"0\"><a:schemeClr val=\"phClr\"><a:tint val=\"80000\"/><a:satMod val=\"300000\"/></a:schemeClr></a:gs><a:gs pos=\"100000\"><a:schemeClr val=\"phClr\"><a:shade val=\"30000\"/><a:satMod val=\"200000\"/></a:schemeClr></a:gs></a:gsLst><a:path path=\"circle\"><a:fillToRect l=\"50000\" t=\"50000\" r=\"50000\" b=\"50000\"/></a:path></a:gradFill></a:bgFillStyleLst></a:fmtScheme></a:themeElements><a:objectDefaults><a:spDef><a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx=\"1\"><a:schemeClr val=\"accent1\"/></a:lnRef><a:fillRef idx=\"3\"><a:schemeClr val=\"accent1\"/></a:fillRef><a:effectRef idx=\"2\"><a:schemeClr val=\"accent1\"/></a:effectRef><a:fontRef idx=\"minor\"><a:schemeClr val=\"lt1\"/></a:fontRef></a:style></a:spDef><a:lnDef><a:spPr/><a:bodyPr/><a:lstStyle/><a:style><a:lnRef idx=\"2\"><a:schemeClr val=\"accent1\"/></a:lnRef><a:fillRef idx=\"0\"><a:schemeClr val=\"accent1\"/></a:fillRef><a:effectRef idx=\"1\"><a:schemeClr val=\"accent1\"/></a:effectRef><a:fontRef idx=\"minor\"><a:schemeClr val=\"tx1\"/></a:fontRef></a:style></a:lnDef></a:objectDefaults><a:extraClrSchemeLst/></a:theme>'}function parse_Theme(blob,length){var dwThemeVersion=blob.read_shift(4);if(dwThemeVersion===124226)return;blob.l+=length-4}function parse_ColorTheme(blob,length){return blob.read_shift(4)}function parse_FullColorExt(blob,length){var o={};o.xclrType=blob.read_shift(2);o.nTintShade=blob.read_shift(2);switch(o.xclrType){case 0:blob.l+=4;break;case 1:o.xclrValue=parse_IcvXF(blob,4);break;case 2:o.xclrValue=parse_LongRGBA(blob,4);break;case 3:o.xclrValue=parse_ColorTheme(blob,4);break;case 4:blob.l+=4;break}blob.l+=8;return o}function parse_IcvXF(blob,length){return parsenoop(blob,length)}function parse_XFExtGradient(blob,length){return parsenoop(blob,length)}function parse_ExtProp(blob,length){var extType=blob.read_shift(2);var cb=blob.read_shift(2);var o=[extType];switch(extType){case 4:case 5:case 7:case 8:case 9:case 10:case 11:case 13:o[1]=parse_FullColorExt(blob,cb);break;case 6:o[1]=parse_XFExtGradient(blob,cb);break;case 14:case 15:o[1]=blob.read_shift(cb===5?1:2);break;default:throw new Error(\"Unrecognized ExtProp type: \"+extType+\" \"+cb)}return o}function parse_XFExt(blob,length){var end=blob.l+length;blob.l+=2;var ixfe=blob.read_shift(2);blob.l+=2;var cexts=blob.read_shift(2);var ext=[];while(cexts-->0)ext.push(parse_ExtProp(blob,end-blob.l));return{ixfe:ixfe,ext:ext}}function update_xfext(xf,xfext){xfext.forEach(function(xfe){switch(xfe[0]){case 4:break;case 5:break;case 7:case 8:case 9:case 10:break;case 13:break;case 14:break;default:throw\"bafuq\"+xfe[0].toString(16)}})}function parse_cc_xml(data,opts){var d=[];var l=0,i=1;(data.match(tagregex)||[]).forEach(function(x){var y=parsexmltag(x);switch(y[0]){case\"<?xml\":break;case\"<calcChain\":case\"<calcChain>\":case\"</calcChain>\":break;case\"<c\":delete y[0];if(y.i)i=y.i;else y.i=i;d.push(y);break}});return d}function write_cc_xml(data,opts){}function parse_BrtCalcChainItem$(data,length){var out={};out.i=data.read_shift(4);var cell={};cell.r=data.read_shift(4);cell.c=data.read_shift(4);out.r=encode_cell(cell);var flags=data.read_shift(1);if(flags&2)out.l=\"1\";if(flags&8)out.a=\"1\";return out}function parse_cc_bin(data,opts){var out=[];var pass=false;recordhopper(data,function hopper_cc(val,R,RT){switch(R.n){case\"BrtCalcChainItem$\":out.push(val);break;case\"BrtBeginCalcChain$\":break;case\"BrtEndCalcChain$\":break;default:if(!pass||opts.WTF)throw new Error(\"Unexpected record \"+RT+\" \"+R.n)}});return out}function write_cc_bin(data,opts){}function parse_comments(zip,dirComments,sheets,sheetRels,opts){for(var i=0;i!=dirComments.length;++i){var canonicalpath=dirComments[i];var comments=parse_cmnt(getzipdata(zip,canonicalpath.replace(/^\\//,\"\"),true),canonicalpath,opts);if(!comments||!comments.length)continue;var sheetNames=keys(sheets);for(var j=0;j!=sheetNames.length;++j){var sheetName=sheetNames[j];var rels=sheetRels[sheetName];if(rels){var rel=rels[canonicalpath];if(rel)insertCommentsIntoSheet(sheetName,sheets[sheetName],comments)}}}}function insertCommentsIntoSheet(sheetName,sheet,comments){comments.forEach(function(comment){var cell=sheet[comment.ref];if(!cell){cell={};sheet[comment.ref]=cell;var range=safe_decode_range(sheet[\"!ref\"]||\"BDWGO1000001:A1\");var thisCell=decode_cell(comment.ref);if(range.s.r>thisCell.r)range.s.r=thisCell.r;if(range.e.r<thisCell.r)range.e.r=thisCell.r;if(range.s.c>thisCell.c)range.s.c=thisCell.c;if(range.e.c<thisCell.c)range.e.c=thisCell.c;var encoded=encode_range(range);if(encoded!==sheet[\"!ref\"])sheet[\"!ref\"]=encoded}if(!cell.c)cell.c=[];var o={a:comment.author,t:comment.t,r:comment.r};if(comment.h)o.h=comment.h;cell.c.push(o)})}function parse_comments_xml(data,opts){if(data.match(/<(?:\\w+:)?comments *\\/>/))return[];var authors=[];var commentList=[];data.match(/<(?:\\w+:)?authors>([^\\u2603]*)<\\/(?:\\w+:)?authors>/)[1].split(/<\\/\\w*:?author>/).forEach(function(x){if(x===\"\"||x.trim()===\"\")return;authors.push(x.match(/<(?:\\w+:)?author[^>]*>(.*)/)[1])});(data.match(/<(?:\\w+:)?commentList>([^\\u2603]*)<\\/(?:\\w+:)?commentList>/)||[\"\",\"\"])[1].split(/<\\/\\w*:?comment>/).forEach(function(x,index){if(x===\"\"||x.trim()===\"\")return;var y=parsexmltag(x.match(/<(?:\\w+:)?comment[^>]*>/)[0]);var comment={author:y.authorId&&authors[y.authorId]?authors[y.authorId]:undefined,ref:y.ref,guid:y.guid};var cell=decode_cell(y.ref);if(opts.sheetRows&&opts.sheetRows<=cell.r)return;var textMatch=x.match(/<text>([^\\u2603]*)<\\/text>/);if(!textMatch||!textMatch[1])return;var rt=parse_si(textMatch[1]);comment.r=rt.r;comment.t=rt.t;if(opts.cellHTML)comment.h=rt.h;commentList.push(comment)});return commentList}function write_comments_xml(data,opts){}function parse_BrtBeginComment(data,length){var out={};out.iauthor=data.read_shift(4);var rfx=parse_UncheckedRfX(data,16);out.rfx=rfx.s;out.ref=encode_cell(rfx.s);data.l+=16;return out}var parse_BrtCommentAuthor=parse_XLWideString;var parse_BrtCommentText=parse_RichStr;function parse_comments_bin(data,opts){var out=[];var authors=[];var c={};var pass=false;recordhopper(data,function hopper_cmnt(val,R,RT){switch(R.n){case\"BrtCommentAuthor\":authors.push(val);break;case\"BrtBeginComment\":c=val;break;case\"BrtCommentText\":c.t=val.t;c.h=val.h;c.r=val.r;break;case\"BrtEndComment\":c.author=authors[c.iauthor];delete c.iauthor;if(opts.sheetRows&&opts.sheetRows<=c.rfx.r)break;delete c.rfx;out.push(c);break;case\"BrtBeginComments\":break;case\"BrtEndComments\":break;case\"BrtBeginCommentAuthors\":break;case\"BrtEndCommentAuthors\":break;case\"BrtBeginCommentList\":break;case\"BrtEndCommentList\":break;default:if(!pass||opts.WTF)throw new Error(\"Unexpected record \"+RT+\" \"+R.n)}});return out}function write_comments_bin(data,opts){}var rc_to_a1=function(){var rcregex=/(^|[^A-Za-z])R(\\[?)(-?\\d+|)\\]?C(\\[?)(-?\\d+|)\\]?/g;var rcbase;function rcfunc($$,$1,$2,$3,$4,$5){var R=$3.length>0?parseInt($3,10)|0:0,C=$5.length>0?parseInt($5,10)|0:0;if(C<0&&$4.length===0)C=0;if($4.length>0)C+=rcbase.c;if($2.length>0)R+=rcbase.r;return $1+encode_col(C)+encode_row(R)}return function rc_to_a1(fstr,base){rcbase=base;return fstr.replace(rcregex,rcfunc)}}();function parseread(l){return function(blob,length){blob.l+=l;return}}function parseread1(blob,length){blob.l+=1;return}function parse_ColRelU(blob,length){var c=blob.read_shift(2);return[c&16383,c>>14&1,c>>15&1]}function parse_RgceArea(blob,length){var r=blob.read_shift(2),R=blob.read_shift(2);var c=parse_ColRelU(blob,2);var C=parse_ColRelU(blob,2);return{s:{r:r,c:c[0],cRel:c[1],rRel:c[2]},e:{r:R,c:C[0],cRel:C[1],rRel:C[2]}}}function parse_RgceAreaRel(blob,length){var r=blob.read_shift(2),R=blob.read_shift(2);var c=parse_ColRelU(blob,2);var C=parse_ColRelU(blob,2);return{s:{r:r,c:c[0],cRel:c[1],rRel:c[2]},e:{r:R,c:C[0],cRel:C[1],rRel:C[2]}}}function parse_RgceLoc(blob,length){var r=blob.read_shift(2);var c=parse_ColRelU(blob,2);return{r:r,c:c[0],cRel:c[1],rRel:c[2]}}function parse_RgceLocRel(blob,length){var r=blob.read_shift(2);var cl=blob.read_shift(2);\nvar cRel=(cl&32768)>>15,rRel=(cl&16384)>>14;cl&=16383;if(cRel!==0)while(cl>=256)cl-=256;return{r:r,c:cl,cRel:cRel,rRel:rRel}}function parse_PtgArea(blob,length){var type=(blob[blob.l++]&96)>>5;var area=parse_RgceArea(blob,8);return[type,area]}function parse_PtgArea3d(blob,length){var type=(blob[blob.l++]&96)>>5;var ixti=blob.read_shift(2);var area=parse_RgceArea(blob,8);return[type,ixti,area]}function parse_PtgAreaErr(blob,length){var type=(blob[blob.l++]&96)>>5;blob.l+=8;return[type]}function parse_PtgAreaErr3d(blob,length){var type=(blob[blob.l++]&96)>>5;var ixti=blob.read_shift(2);blob.l+=8;return[type,ixti]}function parse_PtgAreaN(blob,length){var type=(blob[blob.l++]&96)>>5;var area=parse_RgceAreaRel(blob,8);return[type,area]}function parse_PtgArray(blob,length){var type=(blob[blob.l++]&96)>>5;blob.l+=7;return[type]}function parse_PtgAttrBaxcel(blob,length){var bitSemi=blob[blob.l+1]&1;var bitBaxcel=1;blob.l+=4;return[bitSemi,bitBaxcel]}function parse_PtgAttrChoose(blob,length){blob.l+=2;var offset=blob.read_shift(2);var o=[];for(var i=0;i<=offset;++i)o.push(blob.read_shift(2));return o}function parse_PtgAttrGoto(blob,length){var bitGoto=blob[blob.l+1]&255?1:0;blob.l+=2;return[bitGoto,blob.read_shift(2)]}function parse_PtgAttrIf(blob,length){var bitIf=blob[blob.l+1]&255?1:0;blob.l+=2;return[bitIf,blob.read_shift(2)]}function parse_PtgAttrSemi(blob,length){var bitSemi=blob[blob.l+1]&255?1:0;blob.l+=4;return[bitSemi]}function parse_PtgAttrSpaceType(blob,length){var type=blob.read_shift(1),cch=blob.read_shift(1);return[type,cch]}function parse_PtgAttrSpace(blob,length){blob.read_shift(2);return parse_PtgAttrSpaceType(blob,2)}function parse_PtgAttrSpaceSemi(blob,length){blob.read_shift(2);return parse_PtgAttrSpaceType(blob,2)}function parse_PtgRef(blob,length){var ptg=blob[blob.l]&31;var type=(blob[blob.l]&96)>>5;blob.l+=1;var loc=parse_RgceLoc(blob,4);return[type,loc]}function parse_PtgRefN(blob,length){var ptg=blob[blob.l]&31;var type=(blob[blob.l]&96)>>5;blob.l+=1;var loc=parse_RgceLocRel(blob,4);return[type,loc]}function parse_PtgRef3d(blob,length){var ptg=blob[blob.l]&31;var type=(blob[blob.l]&96)>>5;blob.l+=1;var ixti=blob.read_shift(2);var loc=parse_RgceLoc(blob,4);return[type,ixti,loc]}function parse_PtgFunc(blob,length){var ptg=blob[blob.l]&31;var type=(blob[blob.l]&96)>>5;blob.l+=1;var iftab=blob.read_shift(2);return[FtabArgc[iftab],Ftab[iftab]]}function parse_PtgFuncVar(blob,length){blob.l++;var cparams=blob.read_shift(1),tab=parsetab(blob);return[cparams,(tab[0]===0?Ftab:Cetab)[tab[1]]]}function parsetab(blob,length){return[blob[blob.l+1]>>7,blob.read_shift(2)&32767]}var parse_PtgAttrSum=parseread(4);var parse_PtgConcat=parseread1;function parse_PtgExp(blob,length){blob.l++;var row=blob.read_shift(2);var col=blob.read_shift(2);return[row,col]}function parse_PtgErr(blob,length){blob.l++;return BErr[blob.read_shift(1)]}function parse_PtgInt(blob,length){blob.l++;return blob.read_shift(2)}function parse_PtgBool(blob,length){blob.l++;return blob.read_shift(1)!==0}function parse_PtgNum(blob,length){blob.l++;return parse_Xnum(blob,8)}function parse_PtgStr(blob,length){blob.l++;return parse_ShortXLUnicodeString(blob)}function parse_SerAr(blob){var val=[];switch(val[0]=blob.read_shift(1)){case 4:val[1]=parsebool(blob,1)?\"TRUE\":\"FALSE\";blob.l+=7;break;case 16:val[1]=BErr[blob[blob.l]];blob.l+=8;break;case 0:blob.l+=8;break;case 1:val[1]=parse_Xnum(blob,8);break;case 2:val[1]=parse_XLUnicodeString(blob);break}return val}function parse_PtgExtraMem(blob,cce){var count=blob.read_shift(2);var out=[];for(var i=0;i!=count;++i)out.push(parse_Ref8U(blob,8));return out}function parse_PtgExtraArray(blob){var cols=1+blob.read_shift(1);var rows=1+blob.read_shift(2);for(var i=0,o=[];i!=rows&&(o[i]=[]);++i)for(var j=0;j!=cols;++j)o[i][j]=parse_SerAr(blob);return o}function parse_PtgName(blob,length){var type=blob.read_shift(1)>>>5&3;var nameindex=blob.read_shift(4);return[type,0,nameindex]}function parse_PtgNameX(blob,length){var type=blob.read_shift(1)>>>5&3;var ixti=blob.read_shift(2);var nameindex=blob.read_shift(4);return[type,ixti,nameindex]}function parse_PtgMemArea(blob,length){var type=blob.read_shift(1)>>>5&3;blob.l+=4;var cce=blob.read_shift(2);return[type,cce]}function parse_PtgMemFunc(blob,length){var type=blob.read_shift(1)>>>5&3;var cce=blob.read_shift(2);return[type,cce]}function parse_PtgRefErr(blob,length){var type=blob.read_shift(1)>>>5&3;blob.l+=4;return[type]}var parse_PtgAdd=parseread1;var parse_PtgDiv=parseread1;var parse_PtgEq=parseread1;var parse_PtgGe=parseread1;var parse_PtgGt=parseread1;var parse_PtgIsect=parseread1;var parse_PtgLe=parseread1;var parse_PtgLt=parseread1;var parse_PtgMissArg=parseread1;var parse_PtgMul=parseread1;var parse_PtgNe=parseread1;var parse_PtgParen=parseread1;var parse_PtgPercent=parseread1;var parse_PtgPower=parseread1;var parse_PtgRange=parseread1;var parse_PtgSub=parseread1;var parse_PtgUminus=parseread1;var parse_PtgUnion=parseread1;var parse_PtgUplus=parseread1;var parse_PtgMemErr=parsenoop;var parse_PtgMemNoMem=parsenoop;var parse_PtgRefErr3d=parsenoop;var parse_PtgTbl=parsenoop;var PtgTypes={1:{n:\"PtgExp\",f:parse_PtgExp},2:{n:\"PtgTbl\",f:parse_PtgTbl},3:{n:\"PtgAdd\",f:parse_PtgAdd},4:{n:\"PtgSub\",f:parse_PtgSub},5:{n:\"PtgMul\",f:parse_PtgMul},6:{n:\"PtgDiv\",f:parse_PtgDiv},7:{n:\"PtgPower\",f:parse_PtgPower},8:{n:\"PtgConcat\",f:parse_PtgConcat},9:{n:\"PtgLt\",f:parse_PtgLt},10:{n:\"PtgLe\",f:parse_PtgLe},11:{n:\"PtgEq\",f:parse_PtgEq},12:{n:\"PtgGe\",f:parse_PtgGe},13:{n:\"PtgGt\",f:parse_PtgGt},14:{n:\"PtgNe\",f:parse_PtgNe},15:{n:\"PtgIsect\",f:parse_PtgIsect},16:{n:\"PtgUnion\",f:parse_PtgUnion},17:{n:\"PtgRange\",f:parse_PtgRange},18:{n:\"PtgUplus\",f:parse_PtgUplus},19:{n:\"PtgUminus\",f:parse_PtgUminus},20:{n:\"PtgPercent\",f:parse_PtgPercent},21:{n:\"PtgParen\",f:parse_PtgParen},22:{n:\"PtgMissArg\",f:parse_PtgMissArg},23:{n:\"PtgStr\",f:parse_PtgStr},28:{n:\"PtgErr\",f:parse_PtgErr},29:{n:\"PtgBool\",f:parse_PtgBool},30:{n:\"PtgInt\",f:parse_PtgInt},31:{n:\"PtgNum\",f:parse_PtgNum},32:{n:\"PtgArray\",f:parse_PtgArray},33:{n:\"PtgFunc\",f:parse_PtgFunc},34:{n:\"PtgFuncVar\",f:parse_PtgFuncVar},35:{n:\"PtgName\",f:parse_PtgName},36:{n:\"PtgRef\",f:parse_PtgRef},37:{n:\"PtgArea\",f:parse_PtgArea},38:{n:\"PtgMemArea\",f:parse_PtgMemArea},39:{n:\"PtgMemErr\",f:parse_PtgMemErr},40:{n:\"PtgMemNoMem\",f:parse_PtgMemNoMem},41:{n:\"PtgMemFunc\",f:parse_PtgMemFunc},42:{n:\"PtgRefErr\",f:parse_PtgRefErr},43:{n:\"PtgAreaErr\",f:parse_PtgAreaErr},44:{n:\"PtgRefN\",f:parse_PtgRefN},45:{n:\"PtgAreaN\",f:parse_PtgAreaN},57:{n:\"PtgNameX\",f:parse_PtgNameX},58:{n:\"PtgRef3d\",f:parse_PtgRef3d},59:{n:\"PtgArea3d\",f:parse_PtgArea3d},60:{n:\"PtgRefErr3d\",f:parse_PtgRefErr3d},61:{n:\"PtgAreaErr3d\",f:parse_PtgAreaErr3d},255:{}};var PtgDupes={64:32,96:32,65:33,97:33,66:34,98:34,67:35,99:35,68:36,100:36,69:37,101:37,70:38,102:38,71:39,103:39,72:40,104:40,73:41,105:41,74:42,106:42,75:43,107:43,76:44,108:44,77:45,109:45,89:57,121:57,90:58,122:58,91:59,123:59,92:60,124:60,93:61,125:61};(function(){for(var y in PtgDupes)PtgTypes[y]=PtgTypes[PtgDupes[y]]})();var Ptg18={};var Ptg19={1:{n:\"PtgAttrSemi\",f:parse_PtgAttrSemi},2:{n:\"PtgAttrIf\",f:parse_PtgAttrIf},4:{n:\"PtgAttrChoose\",f:parse_PtgAttrChoose},8:{n:\"PtgAttrGoto\",f:parse_PtgAttrGoto},16:{n:\"PtgAttrSum\",f:parse_PtgAttrSum},32:{n:\"PtgAttrBaxcel\",f:parse_PtgAttrBaxcel},64:{n:\"PtgAttrSpace\",f:parse_PtgAttrSpace},65:{n:\"PtgAttrSpaceSemi\",f:parse_PtgAttrSpaceSemi},255:{}};function parse_Formula(blob,length,opts){var cell=parse_XLSCell(blob,6);var val=parse_FormulaValue(blob,8);var flags=blob.read_shift(1);blob.read_shift(1);var chn=blob.read_shift(4);var cbf=\"\";if(opts.biff===5)blob.l+=length-20;else cbf=parse_XLSCellParsedFormula(blob,length-20,opts);return{cell:cell,val:val[0],formula:cbf,shared:flags>>3&1,tt:val[1]}}function parse_FormulaValue(blob){var b;if(__readUInt16LE(blob,blob.l+6)!==65535)return[parse_Xnum(blob),\"n\"];switch(blob[blob.l]){case 0:blob.l+=8;return[\"String\",\"s\"];case 1:b=blob[blob.l+2]===1;blob.l+=8;return[b,\"b\"];case 2:b=blob[blob.l+2];blob.l+=8;return[b,\"e\"];case 3:blob.l+=8;return[\"\",\"s\"]}}function parse_RgbExtra(blob,length,rgce,opts){if(opts.biff<8)return parsenoop(blob,length);var target=blob.l+length;var o=[];for(var i=0;i!==rgce.length;++i){switch(rgce[i][0]){case\"PtgArray\":rgce[i][1]=parse_PtgExtraArray(blob);o.push(rgce[i][1]);break;case\"PtgMemArea\":rgce[i][2]=parse_PtgExtraMem(blob,rgce[i][1]);o.push(rgce[i][2]);break;default:break}}length=target-blob.l;if(length!==0)o.push(parsenoop(blob,length));return o}function parse_NameParsedFormula(blob,length,opts,cce){var target=blob.l+length;var rgce=parse_Rgce(blob,cce);var rgcb;if(target!==blob.l)rgcb=parse_RgbExtra(blob,target-blob.l,rgce,opts);return[rgce,rgcb]}function parse_XLSCellParsedFormula(blob,length,opts){var target=blob.l+length;var rgcb,cce=blob.read_shift(2);if(cce==65535)return[[],parsenoop(blob,length-2)];var rgce=parse_Rgce(blob,cce);if(length!==cce+2)rgcb=parse_RgbExtra(blob,length-cce-2,rgce,opts);return[rgce,rgcb]}function parse_SharedParsedFormula(blob,length,opts){var target=blob.l+length;var rgcb,cce=blob.read_shift(2);var rgce=parse_Rgce(blob,cce);if(cce==65535)return[[],parsenoop(blob,length-2)];if(length!==cce+2)rgcb=parse_RgbExtra(blob,target-cce-2,rgce,opts);return[rgce,rgcb]}function parse_ArrayParsedFormula(blob,length,opts,ref){var target=blob.l+length;var rgcb,cce=blob.read_shift(2);if(cce==65535)return[[],parsenoop(blob,length-2)];var rgce=parse_Rgce(blob,cce);if(length!==cce+2)rgcb=parse_RgbExtra(blob,target-cce-2,rgce,opts);return[rgce,rgcb]}function parse_Rgce(blob,length){var target=blob.l+length;var R,id,ptgs=[];while(target!=blob.l){length=target-blob.l;id=blob[blob.l];R=PtgTypes[id];if(id===24||id===25){id=blob[blob.l+1];R=(id===24?Ptg18:Ptg19)[id]}if(!R||!R.f){ptgs.push(parsenoop(blob,length))}else{ptgs.push([R.n,R.f(blob,length)])}}return ptgs}function mapper(x){return x.map(function f2(y){return y[1]}).join(\",\")}function stringify_formula(formula,range,cell,supbooks,opts){if(opts!==undefined&&opts.biff===5)return\"BIFF5??\";var _range=range!==undefined?range:{s:{c:0,r:0}};var stack=[],e1,e2,type,c,ixti,nameidx,r;if(!formula[0]||!formula[0][0])return\"\";for(var ff=0,fflen=formula[0].length;ff<fflen;++ff){var f=formula[0][ff];switch(f[0]){case\"PtgUminus\":stack.push(\"-\"+stack.pop());break;case\"PtgUplus\":stack.push(\"+\"+stack.pop());break;case\"PtgPercent\":stack.push(stack.pop()+\"%\");break;case\"PtgAdd\":e1=stack.pop();e2=stack.pop();stack.push(e2+\"+\"+e1);break;case\"PtgSub\":e1=stack.pop();e2=stack.pop();stack.push(e2+\"-\"+e1);break;case\"PtgMul\":e1=stack.pop();e2=stack.pop();stack.push(e2+\"*\"+e1);break;case\"PtgDiv\":e1=stack.pop();e2=stack.pop();stack.push(e2+\"/\"+e1);break;case\"PtgPower\":e1=stack.pop();e2=stack.pop();stack.push(e2+\"^\"+e1);break;case\"PtgConcat\":e1=stack.pop();e2=stack.pop();stack.push(e2+\"&\"+e1);break;case\"PtgLt\":e1=stack.pop();e2=stack.pop();stack.push(e2+\"<\"+e1);break;case\"PtgLe\":e1=stack.pop();e2=stack.pop();stack.push(e2+\"<=\"+e1);break;case\"PtgEq\":e1=stack.pop();e2=stack.pop();stack.push(e2+\"=\"+e1);break;case\"PtgGe\":e1=stack.pop();e2=stack.pop();stack.push(e2+\">=\"+e1);break;case\"PtgGt\":e1=stack.pop();e2=stack.pop();stack.push(e2+\">\"+e1);break;case\"PtgNe\":e1=stack.pop();e2=stack.pop();stack.push(e2+\"<>\"+e1);break;case\"PtgIsect\":e1=stack.pop();e2=stack.pop();stack.push(e2+\" \"+e1);break;case\"PtgUnion\":e1=stack.pop();e2=stack.pop();stack.push(e2+\",\"+e1);break;case\"PtgRange\":break;case\"PtgAttrChoose\":break;case\"PtgAttrGoto\":break;case\"PtgAttrIf\":break;case\"PtgRef\":type=f[1][0];c=shift_cell_xls(decode_cell(encode_cell(f[1][1])),_range);stack.push(encode_cell(c));break;case\"PtgRefN\":type=f[1][0];c=shift_cell_xls(decode_cell(encode_cell(f[1][1])),cell);stack.push(encode_cell(c));break;case\"PtgRef3d\":type=f[1][0];ixti=f[1][1];c=shift_cell_xls(f[1][2],_range);stack.push(supbooks[1][ixti+1]+\"!\"+encode_cell(c));break;case\"PtgFunc\":case\"PtgFuncVar\":var argc=f[1][0],func=f[1][1];if(!argc)argc=0;var args=stack.slice(-argc);stack.length-=argc;if(func===\"User\")func=args.shift();stack.push(func+\"(\"+args.join(\",\")+\")\");break;case\"PtgBool\":stack.push(f[1]?\"TRUE\":\"FALSE\");break;case\"PtgInt\":stack.push(f[1]);break;case\"PtgNum\":stack.push(String(f[1]));break;case\"PtgStr\":stack.push('\"'+f[1]+'\"');break;case\"PtgErr\":stack.push(f[1]);break;case\"PtgArea\":type=f[1][0];r=shift_range_xls(f[1][1],_range);stack.push(encode_range(r));break;case\"PtgArea3d\":type=f[1][0];ixti=f[1][1];r=f[1][2];stack.push(supbooks[1][ixti+1]+\"!\"+encode_range(r));break;case\"PtgAttrSum\":stack.push(\"SUM(\"+stack.pop()+\")\");break;case\"PtgAttrSemi\":break;case\"PtgName\":nameidx=f[1][2];var lbl=supbooks[0][nameidx];var name=lbl.Name;if(name in XLSXFutureFunctions)name=XLSXFutureFunctions[name];stack.push(name);break;case\"PtgNameX\":var bookidx=f[1][1];nameidx=f[1][2];var externbook;if(supbooks[bookidx+1])externbook=supbooks[bookidx+1][nameidx];else if(supbooks[bookidx-1])externbook=supbooks[bookidx-1][nameidx];if(!externbook)externbook={body:\"??NAMEX??\"};stack.push(externbook.body);break;case\"PtgParen\":stack.push(\"(\"+stack.pop()+\")\");break;case\"PtgRefErr\":stack.push(\"#REF!\");break;case\"PtgExp\":c={c:f[1][1],r:f[1][0]};var q={c:cell.c,r:cell.r};if(supbooks.sharedf[encode_cell(c)]){var parsedf=supbooks.sharedf[encode_cell(c)];stack.push(stringify_formula(parsedf,_range,q,supbooks,opts))}else{var fnd=false;for(e1=0;e1!=supbooks.arrayf.length;++e1){e2=supbooks.arrayf[e1];if(c.c<e2[0].s.c||c.c>e2[0].e.c)continue;if(c.r<e2[0].s.r||c.r>e2[0].e.r)continue;stack.push(stringify_formula(e2[1],_range,q,supbooks,opts))}if(!fnd)stack.push(f[1])}break;case\"PtgArray\":stack.push(\"{\"+f[1].map(mapper).join(\";\")+\"}\");break;case\"PtgMemArea\":break;case\"PtgAttrSpace\":break;case\"PtgTbl\":break;case\"PtgMemErr\":break;case\"PtgMissArg\":stack.push(\"\");break;case\"PtgAreaErr\":break;case\"PtgAreaN\":stack.push(\"\");break;case\"PtgRefErr3d\":break;case\"PtgMemFunc\":break;default:throw\"Unrecognized Formula Token: \"+f}}return stack[0]}function parse_XLSBCellParsedFormula(data,length){var cce=data.read_shift(4);return parsenoop(data,length-4)}var PtgDataType={1:\"REFERENCE\",2:\"VALUE\",3:\"ARRAY\"};var Cetab={0:\"BEEP\",1:\"OPEN\",2:\"OPEN.LINKS\",3:\"CLOSE.ALL\",4:\"SAVE\",5:\"SAVE.AS\",6:\"FILE.DELETE\",7:\"PAGE.SETUP\",8:\"PRINT\",9:\"PRINTER.SETUP\",10:\"QUIT\",11:\"NEW.WINDOW\",12:\"ARRANGE.ALL\",13:\"WINDOW.SIZE\",14:\"WINDOW.MOVE\",15:\"FULL\",16:\"CLOSE\",17:\"RUN\",22:\"SET.PRINT.AREA\",23:\"SET.PRINT.TITLES\",24:\"SET.PAGE.BREAK\",25:\"REMOVE.PAGE.BREAK\",26:\"FONT\",27:\"DISPLAY\",28:\"PROTECT.DOCUMENT\",29:\"PRECISION\",30:\"A1.R1C1\",31:\"CALCULATE.NOW\",32:\"CALCULATION\",34:\"DATA.FIND\",35:\"EXTRACT\",36:\"DATA.DELETE\",37:\"SET.DATABASE\",38:\"SET.CRITERIA\",39:\"SORT\",40:\"DATA.SERIES\",41:\"TABLE\",42:\"FORMAT.NUMBER\",43:\"ALIGNMENT\",44:\"STYLE\",45:\"BORDER\",46:\"CELL.PROTECTION\",47:\"COLUMN.WIDTH\",48:\"UNDO\",49:\"CUT\",50:\"COPY\",51:\"PASTE\",52:\"CLEAR\",53:\"PASTE.SPECIAL\",54:\"EDIT.DELETE\",55:\"INSERT\",56:\"FILL.RIGHT\",57:\"FILL.DOWN\",61:\"DEFINE.NAME\",62:\"CREATE.NAMES\",63:\"FORMULA.GOTO\",64:\"FORMULA.FIND\",65:\"SELECT.LAST.CELL\",66:\"SHOW.ACTIVE.CELL\",67:\"GALLERY.AREA\",68:\"GALLERY.BAR\",69:\"GALLERY.COLUMN\",70:\"GALLERY.LINE\",71:\"GALLERY.PIE\",72:\"GALLERY.SCATTER\",73:\"COMBINATION\",74:\"PREFERRED\",75:\"ADD.OVERLAY\",76:\"GRIDLINES\",77:\"SET.PREFERRED\",78:\"AXES\",79:\"LEGEND\",80:\"ATTACH.TEXT\",81:\"ADD.ARROW\",82:\"SELECT.CHART\",83:\"SELECT.PLOT.AREA\",84:\"PATTERNS\",85:\"MAIN.CHART\",86:\"OVERLAY\",87:\"SCALE\",88:\"FORMAT.LEGEND\",89:\"FORMAT.TEXT\",90:\"EDIT.REPEAT\",91:\"PARSE\",92:\"JUSTIFY\",93:\"HIDE\",94:\"UNHIDE\",95:\"WORKSPACE\",96:\"FORMULA\",97:\"FORMULA.FILL\",98:\"FORMULA.ARRAY\",99:\"DATA.FIND.NEXT\",100:\"DATA.FIND.PREV\",101:\"FORMULA.FIND.NEXT\",102:\"FORMULA.FIND.PREV\",103:\"ACTIVATE\",104:\"ACTIVATE.NEXT\",105:\"ACTIVATE.PREV\",106:\"UNLOCKED.NEXT\",107:\"UNLOCKED.PREV\",108:\"COPY.PICTURE\",109:\"SELECT\",110:\"DELETE.NAME\",111:\"DELETE.FORMAT\",112:\"VLINE\",113:\"HLINE\",114:\"VPAGE\",115:\"HPAGE\",116:\"VSCROLL\",117:\"HSCROLL\",118:\"ALERT\",119:\"NEW\",120:\"CANCEL.COPY\",121:\"SHOW.CLIPBOARD\",122:\"MESSAGE\",124:\"PASTE.LINK\",125:\"APP.ACTIVATE\",126:\"DELETE.ARROW\",127:\"ROW.HEIGHT\",128:\"FORMAT.MOVE\",129:\"FORMAT.SIZE\",130:\"FORMULA.REPLACE\",131:\"SEND.KEYS\",132:\"SELECT.SPECIAL\",133:\"APPLY.NAMES\",134:\"REPLACE.FONT\",135:\"FREEZE.PANES\",136:\"SHOW.INFO\",137:\"SPLIT\",138:\"ON.WINDOW\",139:\"ON.DATA\",140:\"DISABLE.INPUT\",142:\"OUTLINE\",143:\"LIST.NAMES\",144:\"FILE.CLOSE\",145:\"SAVE.WORKBOOK\",146:\"DATA.FORM\",147:\"COPY.CHART\",148:\"ON.TIME\",149:\"WAIT\",150:\"FORMAT.FONT\",151:\"FILL.UP\",152:\"FILL.LEFT\",153:\"DELETE.OVERLAY\",155:\"SHORT.MENUS\",159:\"SET.UPDATE.STATUS\",161:\"COLOR.PALETTE\",162:\"DELETE.STYLE\",163:\"WINDOW.RESTORE\",164:\"WINDOW.MAXIMIZE\",166:\"CHANGE.LINK\",167:\"CALCULATE.DOCUMENT\",168:\"ON.KEY\",169:\"APP.RESTORE\",170:\"APP.MOVE\",171:\"APP.SIZE\",172:\"APP.MINIMIZE\",173:\"APP.MAXIMIZE\",174:\"BRING.TO.FRONT\",175:\"SEND.TO.BACK\",185:\"MAIN.CHART.TYPE\",186:\"OVERLAY.CHART.TYPE\",187:\"SELECT.END\",188:\"OPEN.MAIL\",189:\"SEND.MAIL\",190:\"STANDARD.FONT\",191:\"CONSOLIDATE\",192:\"SORT.SPECIAL\",193:\"GALLERY.3D.AREA\",194:\"GALLERY.3D.COLUMN\",195:\"GALLERY.3D.LINE\",196:\"GALLERY.3D.PIE\",197:\"VIEW.3D\",198:\"GOAL.SEEK\",199:\"WORKGROUP\",200:\"FILL.GROUP\",201:\"UPDATE.LINK\",202:\"PROMOTE\",203:\"DEMOTE\",204:\"SHOW.DETAIL\",206:\"UNGROUP\",207:\"OBJECT.PROPERTIES\",208:\"SAVE.NEW.OBJECT\",209:\"SHARE\",210:\"SHARE.NAME\",211:\"DUPLICATE\",212:\"APPLY.STYLE\",213:\"ASSIGN.TO.OBJECT\",214:\"OBJECT.PROTECTION\",215:\"HIDE.OBJECT\",216:\"SET.EXTRACT\",217:\"CREATE.PUBLISHER\",218:\"SUBSCRIBE.TO\",219:\"ATTRIBUTES\",220:\"SHOW.TOOLBAR\",222:\"PRINT.PREVIEW\",223:\"EDIT.COLOR\",224:\"SHOW.LEVELS\",225:\"FORMAT.MAIN\",226:\"FORMAT.OVERLAY\",227:\"ON.RECALC\",228:\"EDIT.SERIES\",229:\"DEFINE.STYLE\",240:\"LINE.PRINT\",243:\"ENTER.DATA\",249:\"GALLERY.RADAR\",250:\"MERGE.STYLES\",251:\"EDITION.OPTIONS\",252:\"PASTE.PICTURE\",253:\"PASTE.PICTURE.LINK\",254:\"SPELLING\",256:\"ZOOM\",259:\"INSERT.OBJECT\",260:\"WINDOW.MINIMIZE\",265:\"SOUND.NOTE\",266:\"SOUND.PLAY\",267:\"FORMAT.SHAPE\",268:\"EXTEND.POLYGON\",269:\"FORMAT.AUTO\",272:\"GALLERY.3D.BAR\",273:\"GALLERY.3D.SURFACE\",274:\"FILL.AUTO\",276:\"CUSTOMIZE.TOOLBAR\",277:\"ADD.TOOL\",278:\"EDIT.OBJECT\",279:\"ON.DOUBLECLICK\",280:\"ON.ENTRY\",281:\"WORKBOOK.ADD\",282:\"WORKBOOK.MOVE\",283:\"WORKBOOK.COPY\",284:\"WORKBOOK.OPTIONS\",285:\"SAVE.WORKSPACE\",288:\"CHART.WIZARD\",289:\"DELETE.TOOL\",290:\"MOVE.TOOL\",291:\"WORKBOOK.SELECT\",292:\"WORKBOOK.ACTIVATE\",293:\"ASSIGN.TO.TOOL\",295:\"COPY.TOOL\",296:\"RESET.TOOL\",297:\"CONSTRAIN.NUMERIC\",298:\"PASTE.TOOL\",302:\"WORKBOOK.NEW\",305:\"SCENARIO.CELLS\",306:\"SCENARIO.DELETE\",307:\"SCENARIO.ADD\",308:\"SCENARIO.EDIT\",309:\"SCENARIO.SHOW\",310:\"SCENARIO.SHOW.NEXT\",311:\"SCENARIO.SUMMARY\",312:\"PIVOT.TABLE.WIZARD\",313:\"PIVOT.FIELD.PROPERTIES\",314:\"PIVOT.FIELD\",315:\"PIVOT.ITEM\",316:\"PIVOT.ADD.FIELDS\",318:\"OPTIONS.CALCULATION\",319:\"OPTIONS.EDIT\",320:\"OPTIONS.VIEW\",321:\"ADDIN.MANAGER\",322:\"MENU.EDITOR\",323:\"ATTACH.TOOLBARS\",324:\"VBAActivate\",325:\"OPTIONS.CHART\",328:\"VBA.INSERT.FILE\",330:\"VBA.PROCEDURE.DEFINITION\",336:\"ROUTING.SLIP\",338:\"ROUTE.DOCUMENT\",339:\"MAIL.LOGON\",342:\"INSERT.PICTURE\",343:\"EDIT.TOOL\",344:\"GALLERY.DOUGHNUT\",350:\"CHART.TREND\",352:\"PIVOT.ITEM.PROPERTIES\",354:\"WORKBOOK.INSERT\",355:\"OPTIONS.TRANSITION\",356:\"OPTIONS.GENERAL\",370:\"FILTER.ADVANCED\",373:\"MAIL.ADD.MAILER\",374:\"MAIL.DELETE.MAILER\",375:\"MAIL.REPLY\",376:\"MAIL.REPLY.ALL\",377:\"MAIL.FORWARD\",378:\"MAIL.NEXT.LETTER\",379:\"DATA.LABEL\",380:\"INSERT.TITLE\",381:\"FONT.PROPERTIES\",382:\"MACRO.OPTIONS\",383:\"WORKBOOK.HIDE\",384:\"WORKBOOK.UNHIDE\",385:\"WORKBOOK.DELETE\",386:\"WORKBOOK.NAME\",388:\"GALLERY.CUSTOM\",390:\"ADD.CHART.AUTOFORMAT\",391:\"DELETE.CHART.AUTOFORMAT\",392:\"CHART.ADD.DATA\",393:\"AUTO.OUTLINE\",394:\"TAB.ORDER\",395:\"SHOW.DIALOG\",396:\"SELECT.ALL\",397:\"UNGROUP.SHEETS\",398:\"SUBTOTAL.CREATE\",399:\"SUBTOTAL.REMOVE\",400:\"RENAME.OBJECT\",412:\"WORKBOOK.SCROLL\",413:\"WORKBOOK.NEXT\",414:\"WORKBOOK.PREV\",415:\"WORKBOOK.TAB.SPLIT\",416:\"FULL.SCREEN\",417:\"WORKBOOK.PROTECT\",420:\"SCROLLBAR.PROPERTIES\",421:\"PIVOT.SHOW.PAGES\",422:\"TEXT.TO.COLUMNS\",423:\"FORMAT.CHARTTYPE\",424:\"LINK.FORMAT\",425:\"TRACER.DISPLAY\",430:\"TRACER.NAVIGATE\",431:\"TRACER.CLEAR\",432:\"TRACER.ERROR\",433:\"PIVOT.FIELD.GROUP\",434:\"PIVOT.FIELD.UNGROUP\",435:\"CHECKBOX.PROPERTIES\",436:\"LABEL.PROPERTIES\",437:\"LISTBOX.PROPERTIES\",438:\"EDITBOX.PROPERTIES\",439:\"PIVOT.REFRESH\",440:\"LINK.COMBO\",441:\"OPEN.TEXT\",442:\"HIDE.DIALOG\",443:\"SET.DIALOG.FOCUS\",444:\"ENABLE.OBJECT\",445:\"PUSHBUTTON.PROPERTIES\",446:\"SET.DIALOG.DEFAULT\",447:\"FILTER\",448:\"FILTER.SHOW.ALL\",449:\"CLEAR.OUTLINE\",450:\"FUNCTION.WIZARD\",451:\"ADD.LIST.ITEM\",452:\"SET.LIST.ITEM\",453:\"REMOVE.LIST.ITEM\",454:\"SELECT.LIST.ITEM\",455:\"SET.CONTROL.VALUE\",456:\"SAVE.COPY.AS\",458:\"OPTIONS.LISTS.ADD\",459:\"OPTIONS.LISTS.DELETE\",460:\"SERIES.AXES\",461:\"SERIES.X\",462:\"SERIES.Y\",463:\"ERRORBAR.X\",464:\"ERRORBAR.Y\",465:\"FORMAT.CHART\",466:\"SERIES.ORDER\",467:\"MAIL.LOGOFF\",468:\"CLEAR.ROUTING.SLIP\",469:\"APP.ACTIVATE.MICROSOFT\",470:\"MAIL.EDIT.MAILER\",471:\"ON.SHEET\",472:\"STANDARD.WIDTH\",473:\"SCENARIO.MERGE\",474:\"SUMMARY.INFO\",475:\"FIND.FILE\",476:\"ACTIVE.CELL.FONT\",477:\"ENABLE.TIPWIZARD\",478:\"VBA.MAKE.ADDIN\",480:\"INSERTDATATABLE\",481:\"WORKGROUP.OPTIONS\",482:\"MAIL.SEND.MAILER\",485:\"AUTOCORRECT\",489:\"POST.DOCUMENT\",491:\"PICKLIST\",493:\"VIEW.SHOW\",494:\"VIEW.DEFINE\",495:\"VIEW.DELETE\",509:\"SHEET.BACKGROUND\",510:\"INSERT.MAP.OBJECT\",511:\"OPTIONS.MENONO\",517:\"MSOCHECKS\",518:\"NORMAL\",519:\"LAYOUT\",520:\"RM.PRINT.AREA\",521:\"CLEAR.PRINT.AREA\",522:\"ADD.PRINT.AREA\",523:\"MOVE.BRK\",545:\"HIDECURR.NOTE\",546:\"HIDEALL.NOTES\",547:\"DELETE.NOTE\",548:\"TRAVERSE.NOTES\",549:\"ACTIVATE.NOTES\",620:\"PROTECT.REVISIONS\",621:\"UNPROTECT.REVISIONS\",647:\"OPTIONS.ME\",653:\"WEB.PUBLISH\",667:\"NEWWEBQUERY\",673:\"PIVOT.TABLE.CHART\",753:\"OPTIONS.SAVE\",755:\"OPTIONS.SPELL\",808:\"HIDEALL.INKANNOTS\"};var Ftab={0:\"COUNT\",1:\"IF\",2:\"ISNA\",3:\"ISERROR\",4:\"SUM\",5:\"AVERAGE\",6:\"MIN\",7:\"MAX\",8:\"ROW\",9:\"COLUMN\",10:\"NA\",11:\"NPV\",12:\"STDEV\",13:\"DOLLAR\",14:\"FIXED\",15:\"SIN\",16:\"COS\",17:\"TAN\",18:\"ATAN\",19:\"PI\",20:\"SQRT\",21:\"EXP\",22:\"LN\",23:\"LOG10\",24:\"ABS\",25:\"INT\",26:\"SIGN\",27:\"ROUND\",28:\"LOOKUP\",29:\"INDEX\",30:\"REPT\",31:\"MID\",32:\"LEN\",33:\"VALUE\",34:\"TRUE\",35:\"FALSE\",36:\"AND\",37:\"OR\",38:\"NOT\",39:\"MOD\",40:\"DCOUNT\",41:\"DSUM\",42:\"DAVERAGE\",43:\"DMIN\",44:\"DMAX\",45:\"DSTDEV\",46:\"VAR\",47:\"DVAR\",48:\"TEXT\",49:\"LINEST\",50:\"TREND\",51:\"LOGEST\",52:\"GROWTH\",53:\"GOTO\",54:\"HALT\",55:\"RETURN\",56:\"PV\",57:\"FV\",58:\"NPER\",59:\"PMT\",60:\"RATE\",61:\"MIRR\",62:\"IRR\",63:\"RAND\",64:\"MATCH\",65:\"DATE\",66:\"TIME\",67:\"DAY\",68:\"MONTH\",69:\"YEAR\",70:\"WEEKDAY\",71:\"HOUR\",72:\"MINUTE\",73:\"SECOND\",74:\"NOW\",75:\"AREAS\",76:\"ROWS\",77:\"COLUMNS\",78:\"OFFSET\",79:\"ABSREF\",80:\"RELREF\",81:\"ARGUMENT\",82:\"SEARCH\",83:\"TRANSPOSE\",84:\"ERROR\",85:\"STEP\",86:\"TYPE\",87:\"ECHO\",88:\"SET.NAME\",89:\"CALLER\",90:\"DEREF\",91:\"WINDOWS\",92:\"SERIES\",93:\"DOCUMENTS\",94:\"ACTIVE.CELL\",95:\"SELECTION\",96:\"RESULT\",97:\"ATAN2\",98:\"ASIN\",99:\"ACOS\",100:\"CHOOSE\",101:\"HLOOKUP\",102:\"VLOOKUP\",103:\"LINKS\",104:\"INPUT\",105:\"ISREF\",106:\"GET.FORMULA\",107:\"GET.NAME\",108:\"SET.VALUE\",109:\"LOG\",110:\"EXEC\",111:\"CHAR\",112:\"LOWER\",113:\"UPPER\",114:\"PROPER\",115:\"LEFT\",116:\"RIGHT\",117:\"EXACT\",118:\"TRIM\",119:\"REPLACE\",120:\"SUBSTITUTE\",121:\"CODE\",122:\"NAMES\",123:\"DIRECTORY\",124:\"FIND\",125:\"CELL\",126:\"ISERR\",127:\"ISTEXT\",128:\"ISNUMBER\",129:\"ISBLANK\",130:\"T\",131:\"N\",132:\"FOPEN\",133:\"FCLOSE\",134:\"FSIZE\",135:\"FREADLN\",136:\"FREAD\",137:\"FWRITELN\",138:\"FWRITE\",139:\"FPOS\",140:\"DATEVALUE\",141:\"TIMEVALUE\",142:\"SLN\",143:\"SYD\",144:\"DDB\",145:\"GET.DEF\",146:\"REFTEXT\",147:\"TEXTREF\",148:\"INDIRECT\",149:\"REGISTER\",150:\"CALL\",151:\"ADD.BAR\",152:\"ADD.MENU\",153:\"ADD.COMMAND\",154:\"ENABLE.COMMAND\",155:\"CHECK.COMMAND\",156:\"RENAME.COMMAND\",157:\"SHOW.BAR\",158:\"DELETE.MENU\",159:\"DELETE.COMMAND\",160:\"GET.CHART.ITEM\",161:\"DIALOG.BOX\",162:\"CLEAN\",163:\"MDETERM\",164:\"MINVERSE\",165:\"MMULT\",166:\"FILES\",167:\"IPMT\",168:\"PPMT\",169:\"COUNTA\",170:\"CANCEL.KEY\",171:\"FOR\",172:\"WHILE\",173:\"BREAK\",174:\"NEXT\",175:\"INITIATE\",176:\"REQUEST\",177:\"POKE\",178:\"EXECUTE\",179:\"TERMINATE\",180:\"RESTART\",181:\"HELP\",182:\"GET.BAR\",183:\"PRODUCT\",184:\"FACT\",185:\"GET.CELL\",186:\"GET.WORKSPACE\",187:\"GET.WINDOW\",188:\"GET.DOCUMENT\",189:\"DPRODUCT\",190:\"ISNONTEXT\",191:\"GET.NOTE\",192:\"NOTE\",193:\"STDEVP\",194:\"VARP\",195:\"DSTDEVP\",196:\"DVARP\",197:\"TRUNC\",198:\"ISLOGICAL\",199:\"DCOUNTA\",200:\"DELETE.BAR\",201:\"UNREGISTER\",204:\"USDOLLAR\",205:\"FINDB\",206:\"SEARCHB\",207:\"REPLACEB\",208:\"LEFTB\",209:\"RIGHTB\",210:\"MIDB\",211:\"LENB\",212:\"ROUNDUP\",213:\"ROUNDDOWN\",214:\"ASC\",215:\"DBCS\",216:\"RANK\",219:\"ADDRESS\",220:\"DAYS360\",221:\"TODAY\",222:\"VDB\",223:\"ELSE\",224:\"ELSE.IF\",225:\"END.IF\",226:\"FOR.CELL\",227:\"MEDIAN\",228:\"SUMPRODUCT\",229:\"SINH\",230:\"COSH\",231:\"TANH\",232:\"ASINH\",233:\"ACOSH\",234:\"ATANH\",235:\"DGET\",236:\"CREATE.OBJECT\",237:\"VOLATILE\",238:\"LAST.ERROR\",239:\"CUSTOM.UNDO\",240:\"CUSTOM.REPEAT\",241:\"FORMULA.CONVERT\",242:\"GET.LINK.INFO\",243:\"TEXT.BOX\",244:\"INFO\",245:\"GROUP\",246:\"GET.OBJECT\",247:\"DB\",248:\"PAUSE\",251:\"RESUME\",252:\"FREQUENCY\",253:\"ADD.TOOLBAR\",254:\"DELETE.TOOLBAR\",255:\"User\",256:\"RESET.TOOLBAR\",257:\"EVALUATE\",258:\"GET.TOOLBAR\",259:\"GET.TOOL\",260:\"SPELLING.CHECK\",261:\"ERROR.TYPE\",262:\"APP.TITLE\",263:\"WINDOW.TITLE\",264:\"SAVE.TOOLBAR\",265:\"ENABLE.TOOL\",266:\"PRESS.TOOL\",267:\"REGISTER.ID\",268:\"GET.WORKBOOK\",269:\"AVEDEV\",270:\"BETADIST\",271:\"GAMMALN\",272:\"BETAINV\",273:\"BINOMDIST\",274:\"CHIDIST\",275:\"CHIINV\",276:\"COMBIN\",277:\"CONFIDENCE\",278:\"CRITBINOM\",279:\"EVEN\",280:\"EXPONDIST\",281:\"FDIST\",282:\"FINV\",283:\"FISHER\",284:\"FISHERINV\",285:\"FLOOR\",286:\"GAMMADIST\",287:\"GAMMAINV\",288:\"CEILING\",289:\"HYPGEOMDIST\",290:\"LOGNORMDIST\",291:\"LOGINV\",292:\"NEGBINOMDIST\",293:\"NORMDIST\",294:\"NORMSDIST\",295:\"NORMINV\",296:\"NORMSINV\",297:\"STANDARDIZE\",298:\"ODD\",299:\"PERMUT\",300:\"POISSON\",301:\"TDIST\",302:\"WEIBULL\",303:\"SUMXMY2\",304:\"SUMX2MY2\",305:\"SUMX2PY2\",306:\"CHITEST\",307:\"CORREL\",308:\"COVAR\",309:\"FORECAST\",310:\"FTEST\",311:\"INTERCEPT\",312:\"PEARSON\",313:\"RSQ\",314:\"STEYX\",315:\"SLOPE\",316:\"TTEST\",317:\"PROB\",318:\"DEVSQ\",319:\"GEOMEAN\",320:\"HARMEAN\",321:\"SUMSQ\",322:\"KURT\",323:\"SKEW\",324:\"ZTEST\",325:\"LARGE\",326:\"SMALL\",327:\"QUARTILE\",328:\"PERCENTILE\",329:\"PERCENTRANK\",330:\"MODE\",331:\"TRIMMEAN\",332:\"TINV\",334:\"MOVIE.COMMAND\",335:\"GET.MOVIE\",336:\"CONCATENATE\",337:\"POWER\",338:\"PIVOT.ADD.DATA\",339:\"GET.PIVOT.TABLE\",340:\"GET.PIVOT.FIELD\",341:\"GET.PIVOT.ITEM\",342:\"RADIANS\",343:\"DEGREES\",344:\"SUBTOTAL\",345:\"SUMIF\",346:\"COUNTIF\",347:\"COUNTBLANK\",348:\"SCENARIO.GET\",349:\"OPTIONS.LISTS.GET\",350:\"ISPMT\",351:\"DATEDIF\",352:\"DATESTRING\",353:\"NUMBERSTRING\",354:\"ROMAN\",355:\"OPEN.DIALOG\",356:\"SAVE.DIALOG\",357:\"VIEW.GET\",358:\"GETPIVOTDATA\",359:\"HYPERLINK\",360:\"PHONETIC\",361:\"AVERAGEA\",362:\"MAXA\",363:\"MINA\",364:\"STDEVPA\",365:\"VARPA\",366:\"STDEVA\",367:\"VARA\",368:\"BAHTTEXT\",369:\"THAIDAYOFWEEK\",370:\"THAIDIGIT\",371:\"THAIMONTHOFYEAR\",372:\"THAINUMSOUND\",373:\"THAINUMSTRING\",374:\"THAISTRINGLENGTH\",375:\"ISTHAIDIGIT\",376:\"ROUNDBAHTDOWN\",377:\"ROUNDBAHTUP\",378:\"THAIYEAR\",379:\"RTD\"};var FtabArgc={2:1,3:1,15:1,16:1,17:1,18:1,20:1,21:1,22:1,23:1,24:1,25:1,26:1,27:2,30:2,31:3,32:1,33:1,38:1,39:2,40:3,41:3,42:3,43:3,44:3,45:3,47:3,48:2,53:1,61:3,65:3,66:3,67:1,68:1,69:1,71:1,72:1,73:1,75:1,76:1,77:1,79:2,80:2,83:1,86:1,90:1,97:2,98:1,99:1,105:1,111:1,112:1,113:1,114:1,117:2,118:1,119:4,121:1,126:1,127:1,128:1,129:1,130:1,131:1,133:1,134:1,135:1,136:2,137:2,138:2,140:1,141:1,142:3,143:4,162:1,163:1,164:1,165:2,172:1,175:2,176:2,177:3,178:2,179:1,184:1,189:3,190:1,195:3,196:3,198:1,199:3,201:1,207:4,210:3,211:1,212:2,213:2,214:1,215:1,229:1,230:1,231:1,232:1,233:1,234:1,235:3,244:1,252:2,257:1,261:1,271:1,273:4,274:2,275:2,276:2,277:3,278:3,279:1,280:3,281:3,282:3,283:1,284:1,285:2,286:4,287:3,288:2,289:4,290:3,291:3,292:3,293:4,294:1,295:3,296:1,297:3,298:1,299:2,300:3,301:3,302:4,303:2,304:2,305:2,306:2,307:2,308:2,309:3,310:2,311:2,312:2,313:2,314:2,315:2,316:4,325:2,326:2,327:2,328:2,331:2,332:2,337:2,342:1,343:1,346:2,347:1,350:4,351:3,352:1,353:2,360:1,368:1,369:1,370:1,371:1,372:1,373:1,374:1,375:1,376:1,377:1,378:1,65535:0};var XLSXFutureFunctions={\"_xlfn.ACOT\":\"ACOT\",\"_xlfn.ACOTH\":\"ACOTH\",\"_xlfn.AGGREGATE\":\"AGGREGATE\",\"_xlfn.ARABIC\":\"ARABIC\",\"_xlfn.AVERAGEIF\":\"AVERAGEIF\",\"_xlfn.AVERAGEIFS\":\"AVERAGEIFS\",\"_xlfn.BASE\":\"BASE\",\"_xlfn.BETA.DIST\":\"BETA.DIST\",\"_xlfn.BETA.INV\":\"BETA.INV\",\"_xlfn.BINOM.DIST\":\"BINOM.DIST\",\"_xlfn.BINOM.DIST.RANGE\":\"BINOM.DIST.RANGE\",\"_xlfn.BINOM.INV\":\"BINOM.INV\",\"_xlfn.BITAND\":\"BITAND\",\"_xlfn.BITLSHIFT\":\"BITLSHIFT\",\"_xlfn.BITOR\":\"BITOR\",\"_xlfn.BITRSHIFT\":\"BITRSHIFT\",\"_xlfn.BITXOR\":\"BITXOR\",\"_xlfn.CEILING.MATH\":\"CEILING.MATH\",\"_xlfn.CEILING.PRECISE\":\"CEILING.PRECISE\",\"_xlfn.CHISQ.DIST\":\"CHISQ.DIST\",\"_xlfn.CHISQ.DIST.RT\":\"CHISQ.DIST.RT\",\"_xlfn.CHISQ.INV\":\"CHISQ.INV\",\"_xlfn.CHISQ.INV.RT\":\"CHISQ.INV.RT\",\"_xlfn.CHISQ.TEST\":\"CHISQ.TEST\",\"_xlfn.COMBINA\":\"COMBINA\",\"_xlfn.CONFIDENCE.NORM\":\"CONFIDENCE.NORM\",\"_xlfn.CONFIDENCE.T\":\"CONFIDENCE.T\",\"_xlfn.COT\":\"COT\",\"_xlfn.COTH\":\"COTH\",\"_xlfn.COUNTIFS\":\"COUNTIFS\",\"_xlfn.COVARIANCE.P\":\"COVARIANCE.P\",\"_xlfn.COVARIANCE.S\":\"COVARIANCE.S\",\"_xlfn.CSC\":\"CSC\",\"_xlfn.CSCH\":\"CSCH\",\"_xlfn.DAYS\":\"DAYS\",\"_xlfn.DECIMAL\":\"DECIMAL\",\"_xlfn.ECMA.CEILING\":\"ECMA.CEILING\",\"_xlfn.ERF.PRECISE\":\"ERF.PRECISE\",\"_xlfn.ERFC.PRECISE\":\"ERFC.PRECISE\",\"_xlfn.EXPON.DIST\":\"EXPON.DIST\",\"_xlfn.F.DIST\":\"F.DIST\",\"_xlfn.F.DIST.RT\":\"F.DIST.RT\",\"_xlfn.F.INV\":\"F.INV\",\"_xlfn.F.INV.RT\":\"F.INV.RT\",\"_xlfn.F.TEST\":\"F.TEST\",\"_xlfn.FILTERXML\":\"FILTERXML\",\"_xlfn.FLOOR.MATH\":\"FLOOR.MATH\",\"_xlfn.FLOOR.PRECISE\":\"FLOOR.PRECISE\",\"_xlfn.FORMULATEXT\":\"FORMULATEXT\",\"_xlfn.GAMMA\":\"GAMMA\",\"_xlfn.GAMMA.DIST\":\"GAMMA.DIST\",\"_xlfn.GAMMA.INV\":\"GAMMA.INV\",\"_xlfn.GAMMALN.PRECISE\":\"GAMMALN.PRECISE\",\"_xlfn.GAUSS\":\"GAUSS\",\"_xlfn.HYPGEOM.DIST\":\"HYPGEOM.DIST\",\"_xlfn.IFNA\":\"IFNA\",\"_xlfn.IFERROR\":\"IFERROR\",\"_xlfn.IMCOSH\":\"IMCOSH\",\"_xlfn.IMCOT\":\"IMCOT\",\"_xlfn.IMCSC\":\"IMCSC\",\"_xlfn.IMCSCH\":\"IMCSCH\",\"_xlfn.IMSEC\":\"IMSEC\",\"_xlfn.IMSECH\":\"IMSECH\",\"_xlfn.IMSINH\":\"IMSINH\",\"_xlfn.IMTAN\":\"IMTAN\",\"_xlfn.ISFORMULA\":\"ISFORMULA\",\"_xlfn.ISO.CEILING\":\"ISO.CEILING\",\"_xlfn.ISOWEEKNUM\":\"ISOWEEKNUM\",\"_xlfn.LOGNORM.DIST\":\"LOGNORM.DIST\",\"_xlfn.LOGNORM.INV\":\"LOGNORM.INV\",\"_xlfn.MODE.MULT\":\"MODE.MULT\",\"_xlfn.MODE.SNGL\":\"MODE.SNGL\",\"_xlfn.MUNIT\":\"MUNIT\",\"_xlfn.NEGBINOM.DIST\":\"NEGBINOM.DIST\",\"_xlfn.NETWORKDAYS.INTL\":\"NETWORKDAYS.INTL\",\"_xlfn.NIGBINOM\":\"NIGBINOM\",\"_xlfn.NORM.DIST\":\"NORM.DIST\",\"_xlfn.NORM.INV\":\"NORM.INV\",\"_xlfn.NORM.S.DIST\":\"NORM.S.DIST\",\"_xlfn.NORM.S.INV\":\"NORM.S.INV\",\"_xlfn.NUMBERVALUE\":\"NUMBERVALUE\",\"_xlfn.PDURATION\":\"PDURATION\",\"_xlfn.PERCENTILE.EXC\":\"PERCENTILE.EXC\",\"_xlfn.PERCENTILE.INC\":\"PERCENTILE.INC\",\"_xlfn.PERCENTRANK.EXC\":\"PERCENTRANK.EXC\",\"_xlfn.PERCENTRANK.INC\":\"PERCENTRANK.INC\",\"_xlfn.PERMUTATIONA\":\"PERMUTATIONA\",\"_xlfn.PHI\":\"PHI\",\"_xlfn.POISSON.DIST\":\"POISSON.DIST\",\"_xlfn.QUARTILE.EXC\":\"QUARTILE.EXC\",\"_xlfn.QUARTILE.INC\":\"QUARTILE.INC\",\"_xlfn.QUERYSTRING\":\"QUERYSTRING\",\"_xlfn.RANK.AVG\":\"RANK.AVG\",\"_xlfn.RANK.EQ\":\"RANK.EQ\",\"_xlfn.RRI\":\"RRI\",\"_xlfn.SEC\":\"SEC\",\"_xlfn.SECH\":\"SECH\",\"_xlfn.SHEET\":\"SHEET\",\"_xlfn.SHEETS\":\"SHEETS\",\"_xlfn.SKEW.P\":\"SKEW.P\",\"_xlfn.STDEV.P\":\"STDEV.P\",\"_xlfn.STDEV.S\":\"STDEV.S\",\"_xlfn.SUMIFS\":\"SUMIFS\",\"_xlfn.T.DIST\":\"T.DIST\",\"_xlfn.T.DIST.2T\":\"T.DIST.2T\",\"_xlfn.T.DIST.RT\":\"T.DIST.RT\",\"_xlfn.T.INV\":\"T.INV\",\"_xlfn.T.INV.2T\":\"T.INV.2T\",\"_xlfn.T.TEST\":\"T.TEST\",\"_xlfn.UNICHAR\":\"UNICHAR\",\"_xlfn.UNICODE\":\"UNICODE\",\"_xlfn.VAR.P\":\"VAR.P\",\"_xlfn.VAR.S\":\"VAR.S\",\"_xlfn.WEBSERVICE\":\"WEBSERVICE\",\"_xlfn.WEIBULL.DIST\":\"WEIBULL.DIST\",\"_xlfn.WORKDAY.INTL\":\"WORKDAY.INTL\",\"_xlfn.XOR\":\"XOR\",\"_xlfn.Z.TEST\":\"Z.TEST\"};var strs={};var _ssfopts={};RELS.WS=\"http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet\";function get_sst_id(sst,str){for(var i=0,len=sst.length;i<len;++i)if(sst[i].t===str){sst.Count++;return i}sst[len]={t:str};sst.Count++;sst.Unique++;return len}function get_cell_style(styles,cell,opts){if(typeof style_builder!=\"undefined\"){if(/^\\d+$/.exec(cell.s)){return cell.s}if(cell.s&&cell.s==+cell.s){return cell.s}var s=cell.s||{};if(cell.z)s.numFmt=cell.z;return style_builder.addStyle(s)}else{var z=opts.revssf[cell.z!=null?cell.z:\"General\"];for(var i=0,len=styles.length;i!=len;++i)if(styles[i].numFmtId===z)return i;styles[len]={numFmtId:z,fontId:0,fillId:0,borderId:0,xfId:0,applyNumberFormat:1};return len}}function get_cell_style_csf(cellXf){if(cellXf){var s={};if(typeof cellXf.numFmtId!=undefined){s.numFmt=SSF._table[cellXf.numFmtId]}if(cellXf.fillId){s.fill=styles.Fills[cellXf.fillId]}if(cellXf.fontId){s.font=styles.Fonts[cellXf.fontId]}if(cellXf.borderId){s.border=styles.Borders[cellXf.borderId];\n}if(cellXf.applyAlignment==1){s.alignment=cellXf.alignment}return JSON.parse(JSON.stringify(s))}return null}function safe_format(p,fmtid,fillid,opts){try{if(p.t===\"e\")p.w=p.w||BErr[p.v];else if(fmtid===0){if(p.t===\"n\"){if((p.v|0)===p.v)p.w=SSF._general_int(p.v,_ssfopts);else p.w=SSF._general_num(p.v,_ssfopts)}else if(p.t===\"d\"){var dd=datenum(p.v);if((dd|0)===dd)p.w=SSF._general_int(dd,_ssfopts);else p.w=SSF._general_num(dd,_ssfopts)}else if(p.v===undefined)return\"\";else p.w=SSF._general(p.v,_ssfopts)}else if(p.t===\"d\")p.w=SSF.format(fmtid,datenum(p.v),_ssfopts);else p.w=SSF.format(fmtid,p.v,_ssfopts);if(opts.cellNF)p.z=SSF._table[fmtid]}catch(e){if(opts.WTF)throw e}}function parse_ws_xml_dim(ws,s){var d=safe_decode_range(s);if(d.s.r<=d.e.r&&d.s.c<=d.e.c&&d.s.r>=0&&d.s.c>=0)ws[\"!ref\"]=encode_range(d)}var mergecregex=/<mergeCell ref=\"[A-Z0-9:]+\"\\s*\\/>/g;var sheetdataregex=/<(?:\\w+:)?sheetData>([^\\u2603]*)<\\/(?:\\w+:)?sheetData>/;var hlinkregex=/<hyperlink[^>]*\\/>/g;var dimregex=/\"(\\w*:\\w*)\"/;var colregex=/<col[^>]*\\/>/g;function parse_ws_xml(data,opts,rels){if(!data)return data;var s={};var ridx=data.indexOf(\"<dimension\");if(ridx>0){var ref=data.substr(ridx,50).match(dimregex);if(ref!=null)parse_ws_xml_dim(s,ref[1])}var mergecells=[];if(data.indexOf(\"</mergeCells>\")!==-1){var merges=data.match(mergecregex);for(ridx=0;ridx!=merges.length;++ridx)mergecells[ridx]=safe_decode_range(merges[ridx].substr(merges[ridx].indexOf('\"')+1))}var columns=[];if(opts.cellStyles&&data.indexOf(\"</cols>\")!==-1){var cols=data.match(colregex);parse_ws_xml_cols(columns,cols)}var refguess={s:{r:1e6,c:1e6},e:{r:0,c:0}};var mtch=data.match(sheetdataregex);if(mtch)parse_ws_xml_data(mtch[1],s,opts,refguess);if(data.indexOf(\"</hyperlinks>\")!==-1)parse_ws_xml_hlinks(s,data.match(hlinkregex),rels);if(!s[\"!ref\"]&&refguess.e.c>=refguess.s.c&&refguess.e.r>=refguess.s.r)s[\"!ref\"]=encode_range(refguess);if(opts.sheetRows>0&&s[\"!ref\"]){var tmpref=safe_decode_range(s[\"!ref\"]);if(opts.sheetRows<+tmpref.e.r){tmpref.e.r=opts.sheetRows-1;if(tmpref.e.r>refguess.e.r)tmpref.e.r=refguess.e.r;if(tmpref.e.r<tmpref.s.r)tmpref.s.r=tmpref.e.r;if(tmpref.e.c>refguess.e.c)tmpref.e.c=refguess.e.c;if(tmpref.e.c<tmpref.s.c)tmpref.s.c=tmpref.e.c;s[\"!fullref\"]=s[\"!ref\"];s[\"!ref\"]=encode_range(tmpref)}}if(mergecells.length>0)s[\"!merges\"]=mergecells;if(columns.length>0)s[\"!cols\"]=columns;return s}function write_ws_xml_merges(merges){if(merges.length==0)return\"\";var o='<mergeCells count=\"'+merges.length+'\">';for(var i=0;i!=merges.length;++i)o+='<mergeCell ref=\"'+encode_range(merges[i])+'\"/>';return o+\"</mergeCells>\"}function write_ws_xml_pagesetup(setup){var pageSetup=writextag(\"pageSetup\",null,{scale:setup.scale||\"100\",orientation:setup.orientation||\"portrait\",horizontalDpi:setup.horizontalDpi||\"4294967292\",verticalDpi:setup.verticalDpi||\"4294967292\"});return pageSetup}function parse_ws_xml_hlinks(s,data,rels){for(var i=0;i!=data.length;++i){var val=parsexmltag(data[i],true);if(!val.ref)return;var rel=rels?rels[\"!id\"][val.id]:null;if(rel){val.Target=rel.Target;if(val.location)val.Target+=\"#\"+val.location;val.Rel=rel}else{val.Target=val.location;rel={Target:val.location,TargetMode:\"Internal\"};val.Rel=rel}var rng=safe_decode_range(val.ref);for(var R=rng.s.r;R<=rng.e.r;++R)for(var C=rng.s.c;C<=rng.e.c;++C){var addr=encode_cell({c:C,r:R});if(!s[addr])s[addr]={t:\"stub\",v:undefined};s[addr].l=val}}}function parse_ws_xml_cols(columns,cols){var seencol=false;for(var coli=0;coli!=cols.length;++coli){var coll=parsexmltag(cols[coli],true);var colm=parseInt(coll.min,10)-1,colM=parseInt(coll.max,10)-1;delete coll.min;delete coll.max;if(!seencol&&coll.width){seencol=true;find_mdw(+coll.width,coll)}if(coll.width){coll.wpx=width2px(+coll.width);coll.wch=px2char(coll.wpx);coll.MDW=MDW}while(colm<=colM)columns[colm++]=coll}}function write_ws_xml_cols(ws,cols){var o=[\"<cols>\"],col,width;for(var i=0;i!=cols.length;++i){if(!(col=cols[i]))continue;var p={min:i+1,max:i+1};width=-1;if(col.wpx)width=px2char(col.wpx);else if(col.wch)width=col.wch;if(width>-1){p.width=char2width(width);p.customWidth=1}o[o.length]=writextag(\"col\",null,p)}o[o.length]=\"</cols>\";return o.join(\"\")}function write_ws_xml_cell(cell,ref,ws,opts,idx,wb){if(cell.v===undefined&&cell.s===undefined)return\"\";var vv=\"\";var oldt=cell.t,oldv=cell.v;switch(cell.t){case\"b\":vv=cell.v?\"1\":\"0\";break;case\"n\":vv=\"\"+cell.v;break;case\"e\":vv=BErr[cell.v];break;case\"d\":if(opts.cellDates)vv=new Date(cell.v).toISOString();else{cell.t=\"n\";vv=\"\"+(cell.v=datenum(cell.v));if(typeof cell.z===\"undefined\")cell.z=SSF._table[14]}break;default:vv=cell.v;break}var v=writetag(\"v\",escapexml(vv)),o={r:ref};var os=get_cell_style(opts.cellXfs,cell,opts);if(os!==0)o.s=os;switch(cell.t){case\"n\":break;case\"d\":o.t=\"d\";break;case\"b\":o.t=\"b\";break;case\"e\":o.t=\"e\";break;default:if(opts.bookSST){v=writetag(\"v\",\"\"+get_sst_id(opts.Strings,cell.v));o.t=\"s\";break}o.t=\"str\";break}if(cell.t!=oldt){cell.t=oldt;cell.v=oldv}return writextag(\"c\",v,o)}var parse_ws_xml_data=function parse_ws_xml_data_factory(){var cellregex=/<(?:\\w+:)?c[ >]/,rowregex=/<\\/(?:\\w+:)?row>/;var rregex=/r=[\"']([^\"']*)[\"']/,isregex=/<is>([\\S\\s]*?)<\\/is>/;var match_v=matchtag(\"v\"),match_f=matchtag(\"f\");return function parse_ws_xml_data(sdata,s,opts,guess){var ri=0,x=\"\",cells=[],cref=[],idx=0,i=0,cc=0,d=\"\",p;var tag,tagr=0,tagc=0;var sstr;var fmtid=0,fillid=0,do_format=Array.isArray(styles.CellXf),cf;for(var marr=sdata.split(rowregex),mt=0,marrlen=marr.length;mt!=marrlen;++mt){x=marr[mt].trim();var xlen=x.length;if(xlen===0)continue;for(ri=0;ri<xlen;++ri)if(x.charCodeAt(ri)===62)break;++ri;tag=parsexmltag(x.substr(0,ri),true);tagr=typeof tag.r!==\"undefined\"?parseInt(tag.r,10):tagr+1;tagc=-1;if(opts.sheetRows&&opts.sheetRows<tagr)continue;if(guess.s.r>tagr-1)guess.s.r=tagr-1;if(guess.e.r<tagr-1)guess.e.r=tagr-1;cells=x.substr(ri).split(cellregex);for(ri=typeof tag.r===\"undefined\"?0:1;ri!=cells.length;++ri){x=cells[ri].trim();if(x.length===0)continue;cref=x.match(rregex);idx=ri;i=0;cc=0;x=\"<c \"+(x.substr(0,1)==\"<\"?\">\":\"\")+x;if(cref!==null&&cref.length===2){idx=0;d=cref[1];for(i=0;i!=d.length;++i){if((cc=d.charCodeAt(i)-64)<1||cc>26)break;idx=26*idx+cc}--idx;tagc=idx}else++tagc;for(i=0;i!=x.length;++i)if(x.charCodeAt(i)===62)break;++i;tag=parsexmltag(x.substr(0,i),true);if(!tag.r)tag.r=utils.encode_cell({r:tagr-1,c:tagc});d=x.substr(i);p={t:\"\"};if((cref=d.match(match_v))!==null&&cref[1]!==\"\")p.v=unescapexml(cref[1]);if(opts.cellFormula&&(cref=d.match(match_f))!==null)p.f=unescapexml(cref[1]);if(tag.t===undefined&&tag.s===undefined&&p.v===undefined){if(!opts.sheetStubs)continue;p.t=\"stub\"}else p.t=tag.t||\"n\";if(guess.s.c>idx)guess.s.c=idx;if(guess.e.c<idx)guess.e.c=idx;switch(p.t){case\"n\":p.v=parseFloat(p.v);if(isNaN(p.v))p.v=\"\";break;case\"s\":sstr=strs[parseInt(p.v,10)];p.v=sstr.t;p.r=sstr.r;if(opts.cellHTML)p.h=sstr.h;break;case\"str\":p.t=\"s\";p.v=p.v!=null?utf8read(p.v):\"\";if(opts.cellHTML)p.h=p.v;break;case\"inlineStr\":cref=d.match(isregex);p.t=\"s\";if(cref!==null){sstr=parse_si(cref[1]);p.v=sstr.t}else p.v=\"\";break;case\"b\":p.v=parsexmlbool(p.v);break;case\"d\":if(!opts.cellDates){p.v=datenum(p.v);p.t=\"n\"}break;case\"e\":p.w=p.v;p.v=RBErr[p.v];break}fmtid=fillid=0;if(do_format&&tag.s!==undefined){cf=styles.CellXf[tag.s];if(opts.cellStyles){p.s=get_cell_style_csf(cf)}if(cf!=null){if(cf.numFmtId!=null)fmtid=cf.numFmtId;if(opts.cellStyles&&cf.fillId!=null)fillid=cf.fillId}}safe_format(p,fmtid,fillid,opts);s[tag.r]=p}}}}();function write_ws_xml_data(ws,opts,idx,wb){var o=[],r=[],range=safe_decode_range(ws[\"!ref\"]),cell,ref,rr=\"\",cols=[],R,C;for(C=range.s.c;C<=range.e.c;++C)cols[C]=encode_col(C);for(R=range.s.r;R<=range.e.r;++R){r=[];rr=encode_row(R);for(C=range.s.c;C<=range.e.c;++C){ref=cols[C]+rr;if(ws[ref]===undefined)continue;if((cell=write_ws_xml_cell(ws[ref],ref,ws,opts,idx,wb))!=null)r.push(cell)}if(r.length>0)o[o.length]=writextag(\"row\",r.join(\"\"),{r:rr})}return o.join(\"\")}var WS_XML_ROOT=writextag(\"worksheet\",null,{xmlns:XMLNS.main[0],\"xmlns:r\":XMLNS.r});function write_ws_xml(idx,opts,wb){var o=[XML_HEADER,WS_XML_ROOT];var s=wb.SheetNames[idx],sidx=0,rdata=\"\";var ws=wb.Sheets[s];if(ws===undefined)ws={};var ref=ws[\"!ref\"];if(ref===undefined)ref=\"A1\";o[o.length]=writextag(\"dimension\",null,{ref:ref});var sheetView=writextag(\"sheetView\",null,{showGridLines:opts.showGridLines==false?\"0\":\"1\",tabSelected:opts.tabSelected===undefined?\"0\":opts.tabSelected,workbookViewId:opts.workbookViewId===undefined?\"0\":opts.workbookViewId});o[o.length]=writextag(\"sheetViews\",sheetView);if(ws[\"!cols\"]!==undefined&&ws[\"!cols\"].length>0)o[o.length]=write_ws_xml_cols(ws,ws[\"!cols\"]);o[sidx=o.length]=\"<sheetData/>\";if(ws[\"!ref\"]!==undefined){rdata=write_ws_xml_data(ws,opts,idx,wb);if(rdata.length>0)o[o.length]=rdata}if(o.length>sidx+1){o[o.length]=\"</sheetData>\";o[sidx]=o[sidx].replace(\"/>\",\">\")}if(ws[\"!merges\"]!==undefined&&ws[\"!merges\"].length>0)o[o.length]=write_ws_xml_merges(ws[\"!merges\"]);if(ws[\"!pageSetup\"]!==undefined)o[o.length]=write_ws_xml_pagesetup(ws[\"!pageSetup\"]);if(ws[\"!rowBreaks\"]!==undefined)o[o.length]=write_ws_xml_row_breaks(ws[\"!rowBreaks\"]);if(ws[\"!colBreaks\"]!==undefined)o[o.length]=write_ws_xml_col_breaks(ws[\"!colBreaks\"]);if(o.length>2){o[o.length]=\"</worksheet>\";o[1]=o[1].replace(\"/>\",\">\")}return o.join(\"\")}function write_ws_xml_row_breaks(breaks){console.log(\"Writing breaks\");var brk=[];for(var i=0;i<breaks.length;i++){var thisBreak=\"\"+breaks[i];var nextBreak=\"\"+(breaks[i+1]||\"16383\");brk.push(writextag(\"brk\",null,{id:thisBreak,max:nextBreak,man:\"1\"}))}return writextag(\"rowBreaks\",brk.join(\" \"),{count:brk.length,manualBreakCount:brk.length})}function write_ws_xml_col_breaks(breaks){console.log(\"Writing breaks\");var brk=[];for(var i=0;i<breaks.length;i++){var thisBreak=\"\"+breaks[i];var nextBreak=\"\"+(breaks[i+1]||\"1048575\");brk.push(writextag(\"brk\",null,{id:thisBreak,max:nextBreak,man:\"1\"}))}return writextag(\"colBreaks\",brk.join(\" \"),{count:brk.length,manualBreakCount:brk.length})}function parse_BrtRowHdr(data,length){var z=[];z.r=data.read_shift(4);data.l+=length-4;return z}var parse_BrtWsDim=parse_UncheckedRfX;var write_BrtWsDim=write_UncheckedRfX;function parse_BrtWsProp(data,length){var z={};data.l+=19;z.name=parse_XLSBCodeName(data,length-19);return z}function parse_BrtCellBlank(data,length){var cell=parse_XLSBCell(data);return[cell]}function write_BrtCellBlank(cell,val,o){if(o==null)o=new_buf(8);return write_XLSBCell(val,o)}function parse_BrtCellBool(data,length){var cell=parse_XLSBCell(data);var fBool=data.read_shift(1);return[cell,fBool,\"b\"]}function parse_BrtCellError(data,length){var cell=parse_XLSBCell(data);var fBool=data.read_shift(1);return[cell,fBool,\"e\"]}function parse_BrtCellIsst(data,length){var cell=parse_XLSBCell(data);var isst=data.read_shift(4);return[cell,isst,\"s\"]}function parse_BrtCellReal(data,length){var cell=parse_XLSBCell(data);var value=parse_Xnum(data);return[cell,value,\"n\"]}function parse_BrtCellRk(data,length){var cell=parse_XLSBCell(data);var value=parse_RkNumber(data);return[cell,value,\"n\"]}function parse_BrtCellSt(data,length){var cell=parse_XLSBCell(data);var value=parse_XLWideString(data);return[cell,value,\"str\"]}function parse_BrtFmlaBool(data,length,opts){var cell=parse_XLSBCell(data);var value=data.read_shift(1);var o=[cell,value,\"b\"];if(opts.cellFormula){var formula=parse_XLSBCellParsedFormula(data,length-9);o[3]=\"\"}else data.l+=length-9;return o}function parse_BrtFmlaError(data,length,opts){var cell=parse_XLSBCell(data);var value=data.read_shift(1);var o=[cell,value,\"e\"];if(opts.cellFormula){var formula=parse_XLSBCellParsedFormula(data,length-9);o[3]=\"\"}else data.l+=length-9;return o}function parse_BrtFmlaNum(data,length,opts){var cell=parse_XLSBCell(data);var value=parse_Xnum(data);var o=[cell,value,\"n\"];if(opts.cellFormula){var formula=parse_XLSBCellParsedFormula(data,length-16);o[3]=\"\"}else data.l+=length-16;return o}function parse_BrtFmlaString(data,length,opts){var start=data.l;var cell=parse_XLSBCell(data);var value=parse_XLWideString(data);var o=[cell,value,\"str\"];if(opts.cellFormula){var formula=parse_XLSBCellParsedFormula(data,start+length-data.l)}else data.l=start+length;return o}var parse_BrtMergeCell=parse_UncheckedRfX;function parse_BrtHLink(data,length,opts){var end=data.l+length;var rfx=parse_UncheckedRfX(data,16);var relId=parse_XLNullableWideString(data);var loc=parse_XLWideString(data);var tooltip=parse_XLWideString(data);var display=parse_XLWideString(data);data.l=end;return{rfx:rfx,relId:relId,loc:loc,tooltip:tooltip,display:display}}function parse_ws_bin(data,opts,rels){if(!data)return data;if(!rels)rels={\"!id\":{}};var s={};var ref;var refguess={s:{r:1e6,c:1e6},e:{r:0,c:0}};var pass=false,end=false;var row,p,cf,R,C,addr,sstr,rr;var mergecells=[];recordhopper(data,function ws_parse(val,R){if(end)return;switch(R.n){case\"BrtWsDim\":ref=val;break;case\"BrtRowHdr\":row=val;if(opts.sheetRows&&opts.sheetRows<=row.r)end=true;rr=encode_row(row.r);break;case\"BrtFmlaBool\":case\"BrtFmlaError\":case\"BrtFmlaNum\":case\"BrtFmlaString\":case\"BrtCellBool\":case\"BrtCellError\":case\"BrtCellIsst\":case\"BrtCellReal\":case\"BrtCellRk\":case\"BrtCellSt\":p={t:val[2]};switch(val[2]){case\"n\":p.v=val[1];break;case\"s\":sstr=strs[val[1]];p.v=sstr.t;p.r=sstr.r;break;case\"b\":p.v=val[1]?true:false;break;case\"e\":p.v=val[1];p.w=BErr[p.v];break;case\"str\":p.t=\"s\";p.v=utf8read(val[1]);break}if(opts.cellFormula&&val.length>3)p.f=val[3];if(cf=styles.CellXf[val[0].iStyleRef])safe_format(p,cf.ifmt,null,opts);s[encode_col(C=val[0].c)+rr]=p;if(refguess.s.r>row.r)refguess.s.r=row.r;if(refguess.s.c>C)refguess.s.c=C;if(refguess.e.r<row.r)refguess.e.r=row.r;if(refguess.e.c<C)refguess.e.c=C;break;case\"BrtCellBlank\":if(!opts.sheetStubs)break;p={t:\"s\",v:undefined};s[encode_col(C=val[0].c)+rr]=p;if(refguess.s.r>row.r)refguess.s.r=row.r;if(refguess.s.c>C)refguess.s.c=C;if(refguess.e.r<row.r)refguess.e.r=row.r;if(refguess.e.c<C)refguess.e.c=C;break;case\"BrtBeginMergeCells\":break;case\"BrtEndMergeCells\":break;case\"BrtMergeCell\":mergecells.push(val);break;case\"BrtHLink\":var rel=rels[\"!id\"][val.relId];if(rel){val.Target=rel.Target;if(val.loc)val.Target+=\"#\"+val.loc;val.Rel=rel}for(R=val.rfx.s.r;R<=val.rfx.e.r;++R)for(C=val.rfx.s.c;C<=val.rfx.e.c;++C){addr=encode_cell({c:C,r:R});if(!s[addr])s[addr]={t:\"s\",v:undefined};s[addr].l=val}break;case\"BrtArrFmla\":break;case\"BrtShrFmla\":break;case\"BrtBeginSheet\":break;case\"BrtWsProp\":break;case\"BrtSheetCalcProp\":break;case\"BrtBeginWsViews\":break;case\"BrtBeginWsView\":break;case\"BrtPane\":break;case\"BrtSel\":break;case\"BrtEndWsView\":break;case\"BrtEndWsViews\":break;case\"BrtACBegin\":break;case\"BrtRwDescent\":break;case\"BrtACEnd\":break;case\"BrtWsFmtInfoEx14\":break;case\"BrtWsFmtInfo\":break;case\"BrtBeginColInfos\":break;case\"BrtColInfo\":break;case\"BrtEndColInfos\":break;case\"BrtBeginSheetData\":break;case\"BrtEndSheetData\":break;case\"BrtSheetProtection\":break;case\"BrtPrintOptions\":break;case\"BrtMargins\":break;case\"BrtPageSetup\":break;case\"BrtFRTBegin\":pass=true;break;case\"BrtFRTEnd\":pass=false;break;case\"BrtEndSheet\":break;case\"BrtDrawing\":break;case\"BrtLegacyDrawing\":break;case\"BrtLegacyDrawingHF\":break;case\"BrtPhoneticInfo\":break;case\"BrtBeginHeaderFooter\":break;case\"BrtEndHeaderFooter\":break;case\"BrtBrk\":break;case\"BrtBeginRwBrk\":break;case\"BrtEndRwBrk\":break;case\"BrtBeginColBrk\":break;case\"BrtEndColBrk\":break;case\"BrtBeginUserShViews\":break;case\"BrtBeginUserShView\":break;case\"BrtEndUserShView\":break;case\"BrtEndUserShViews\":break;case\"BrtBkHim\":break;case\"BrtBeginOleObjects\":break;case\"BrtOleObject\":break;case\"BrtEndOleObjects\":break;case\"BrtBeginListParts\":break;case\"BrtListPart\":break;case\"BrtEndListParts\":break;case\"BrtBeginSortState\":break;case\"BrtBeginSortCond\":break;case\"BrtEndSortCond\":break;case\"BrtEndSortState\":break;case\"BrtBeginConditionalFormatting\":break;case\"BrtEndConditionalFormatting\":break;case\"BrtBeginCFRule\":break;case\"BrtEndCFRule\":break;case\"BrtBeginDVals\":break;case\"BrtDVal\":break;case\"BrtEndDVals\":break;case\"BrtRangeProtection\":break;case\"BrtBeginDCon\":break;case\"BrtEndDCon\":break;case\"BrtBeginDRefs\":break;case\"BrtDRef\":break;case\"BrtEndDRefs\":break;case\"BrtBeginActiveXControls\":break;case\"BrtActiveX\":break;case\"BrtEndActiveXControls\":break;case\"BrtBeginAFilter\":break;case\"BrtEndAFilter\":break;case\"BrtBeginFilterColumn\":break;case\"BrtBeginFilters\":break;case\"BrtFilter\":break;case\"BrtEndFilters\":break;case\"BrtEndFilterColumn\":break;case\"BrtDynamicFilter\":break;case\"BrtTop10Filter\":break;case\"BrtBeginCustomFilters\":break;case\"BrtCustomFilter\":break;case\"BrtEndCustomFilters\":break;case\"BrtBeginSmartTags\":break;case\"BrtBeginCellSmartTags\":break;case\"BrtBeginCellSmartTag\":break;case\"BrtCellSmartTagProperty\":break;case\"BrtEndCellSmartTag\":break;case\"BrtEndCellSmartTags\":break;case\"BrtEndSmartTags\":break;case\"BrtBeginCellWatches\":break;case\"BrtCellWatch\":break;case\"BrtEndCellWatches\":break;case\"BrtTable\":break;case\"BrtBeginCellIgnoreECs\":break;case\"BrtCellIgnoreEC\":break;case\"BrtEndCellIgnoreECs\":break;default:if(!pass||opts.WTF)throw new Error(\"Unexpected record \"+R.n)}},opts);if(!s[\"!ref\"]&&(refguess.s.r<1e6||ref.e.r>0||ref.e.c>0||ref.s.r>0||ref.s.c>0))s[\"!ref\"]=encode_range(ref);if(opts.sheetRows&&s[\"!ref\"]){var tmpref=safe_decode_range(s[\"!ref\"]);if(opts.sheetRows<+tmpref.e.r){tmpref.e.r=opts.sheetRows-1;if(tmpref.e.r>refguess.e.r)tmpref.e.r=refguess.e.r;if(tmpref.e.r<tmpref.s.r)tmpref.s.r=tmpref.e.r;if(tmpref.e.c>refguess.e.c)tmpref.e.c=refguess.e.c;if(tmpref.e.c<tmpref.s.c)tmpref.s.c=tmpref.e.c;s[\"!fullref\"]=s[\"!ref\"];s[\"!ref\"]=encode_range(tmpref)}}if(mergecells.length>0)s[\"!merges\"]=mergecells;return s}function write_ws_bin_cell(ba,cell,R,C,opts){if(cell.v===undefined)return\"\";var vv=\"\";switch(cell.t){case\"b\":vv=cell.v?\"1\":\"0\";break;case\"n\":case\"e\":vv=\"\"+cell.v;break;default:vv=cell.v;break}var o={r:R,c:C};o.s=get_cell_style(opts.cellXfs,cell,opts);switch(cell.t){case\"s\":case\"str\":if(opts.bookSST){vv=get_sst_id(opts.Strings,cell.v);o.t=\"s\";break}o.t=\"str\";break;case\"n\":break;case\"b\":o.t=\"b\";break;case\"e\":o.t=\"e\";break}write_record(ba,\"BrtCellBlank\",write_BrtCellBlank(cell,o))}function write_CELLTABLE(ba,ws,idx,opts,wb){var range=safe_decode_range(ws[\"!ref\"]||\"A1\"),ref,rr=\"\",cols=[];write_record(ba,\"BrtBeginSheetData\");for(var R=range.s.r;R<=range.e.r;++R){rr=encode_row(R);for(var C=range.s.c;C<=range.e.c;++C){if(R===range.s.r)cols[C]=encode_col(C);ref=cols[C]+rr;if(!ws[ref])continue;write_ws_bin_cell(ba,ws[ref],R,C,opts)}}write_record(ba,\"BrtEndSheetData\")}function write_ws_bin(idx,opts,wb){var ba=buf_array();var s=wb.SheetNames[idx],ws=wb.Sheets[s]||{};var r=safe_decode_range(ws[\"!ref\"]||\"A1\");write_record(ba,\"BrtBeginSheet\");write_record(ba,\"BrtWsDim\",write_BrtWsDim(r));write_CELLTABLE(ba,ws,idx,opts,wb);write_record(ba,\"BrtEndSheet\");return ba.end()}var WBPropsDef=[[\"allowRefreshQuery\",\"0\"],[\"autoCompressPictures\",\"1\"],[\"backupFile\",\"0\"],[\"checkCompatibility\",\"0\"],[\"codeName\",\"\"],[\"date1904\",\"0\"],[\"dateCompatibility\",\"1\"],[\"filterPrivacy\",\"0\"],[\"hidePivotFieldList\",\"0\"],[\"promptedSolutions\",\"0\"],[\"publishItems\",\"0\"],[\"refreshAllConnections\",false],[\"saveExternalLinkValues\",\"1\"],[\"showBorderUnselectedTables\",\"1\"],[\"showInkAnnotation\",\"1\"],[\"showObjects\",\"all\"],[\"showPivotChartFilter\",\"0\"]];var WBViewDef=[[\"activeTab\",\"0\"],[\"autoFilterDateGrouping\",\"1\"],[\"firstSheet\",\"0\"],[\"minimized\",\"0\"],[\"showHorizontalScroll\",\"1\"],[\"showSheetTabs\",\"1\"],[\"showVerticalScroll\",\"1\"],[\"tabRatio\",\"600\"],[\"visibility\",\"visible\"]];var SheetDef=[[\"state\",\"visible\"]];var CalcPrDef=[[\"calcCompleted\",\"true\"],[\"calcMode\",\"auto\"],[\"calcOnSave\",\"true\"],[\"concurrentCalc\",\"true\"],[\"fullCalcOnLoad\",\"false\"],[\"fullPrecision\",\"true\"],[\"iterate\",\"false\"],[\"iterateCount\",\"100\"],[\"iterateDelta\",\"0.001\"],[\"refMode\",\"A1\"]];var CustomWBViewDef=[[\"autoUpdate\",\"false\"],[\"changesSavedWin\",\"false\"],[\"includeHiddenRowCol\",\"true\"],[\"includePrintSettings\",\"true\"],[\"maximized\",\"false\"],[\"minimized\",\"false\"],[\"onlySync\",\"false\"],[\"personalView\",\"false\"],[\"showComments\",\"commIndicator\"],[\"showFormulaBar\",\"true\"],[\"showHorizontalScroll\",\"true\"],[\"showObjects\",\"all\"],[\"showSheetTabs\",\"true\"],[\"showStatusbar\",\"true\"],[\"showVerticalScroll\",\"true\"],[\"tabRatio\",\"600\"],[\"xWindow\",\"0\"],[\"yWindow\",\"0\"]];function push_defaults_array(target,defaults){for(var j=0;j!=target.length;++j){var w=target[j];for(var i=0;i!=defaults.length;++i){var z=defaults[i];if(w[z[0]]==null)w[z[0]]=z[1]}}}function push_defaults(target,defaults){for(var i=0;i!=defaults.length;++i){var z=defaults[i];if(target[z[0]]==null)target[z[0]]=z[1]}}function parse_wb_defaults(wb){push_defaults(wb.WBProps,WBPropsDef);push_defaults(wb.CalcPr,CalcPrDef);push_defaults_array(wb.WBView,WBViewDef);push_defaults_array(wb.Sheets,SheetDef);_ssfopts.date1904=parsexmlbool(wb.WBProps.date1904,\"date1904\")}var wbnsregex=/<\\w+:workbook/;function parse_wb_xml(data,opts){var wb={AppVersion:{},WBProps:{},WBView:[],Sheets:[],CalcPr:{},xmlns:\"\"};var pass=false,xmlns=\"xmlns\";data.match(tagregex).forEach(function xml_wb(x){var y=parsexmltag(x);switch(strip_ns(y[0])){case\"<?xml\":break;case\"<workbook\":if(x.match(wbnsregex))xmlns=\"xmlns\"+x.match(/<(\\w+):/)[1];wb.xmlns=y[xmlns];break;case\"</workbook>\":break;case\"<fileVersion\":delete y[0];wb.AppVersion=y;break;case\"<fileVersion/>\":break;case\"<fileSharing\":case\"<fileSharing/>\":break;case\"<workbookPr\":delete y[0];wb.WBProps=y;break;case\"<workbookPr/>\":delete y[0];wb.WBProps=y;break;case\"<workbookProtection\":break;case\"<workbookProtection/>\":break;case\"<bookViews>\":case\"</bookViews>\":break;case\"<workbookView\":delete y[0];wb.WBView.push(y);break;case\"<sheets>\":case\"</sheets>\":break;case\"<sheet\":delete y[0];y.name=utf8read(y.name);wb.Sheets.push(y);break;case\"<functionGroups\":case\"<functionGroups/>\":break;case\"<functionGroup\":break;case\"<externalReferences\":case\"</externalReferences>\":case\"<externalReferences>\":break;case\"<externalReference\":break;case\"<definedNames/>\":break;case\"<definedNames>\":case\"<definedNames\":pass=true;break;case\"</definedNames>\":pass=false;break;case\"<definedName\":case\"<definedName/>\":case\"</definedName>\":break;case\"<calcPr\":delete y[0];wb.CalcPr=y;break;case\"<calcPr/>\":delete y[0];wb.CalcPr=y;break;case\"<oleSize\":break;case\"<customWorkbookViews>\":case\"</customWorkbookViews>\":case\"<customWorkbookViews\":break;case\"<customWorkbookView\":case\"</customWorkbookView>\":break;case\"<pivotCaches>\":case\"</pivotCaches>\":case\"<pivotCaches\":break;case\"<pivotCache\":break;case\"<smartTagPr\":case\"<smartTagPr/>\":break;case\"<smartTagTypes\":case\"<smartTagTypes>\":case\"</smartTagTypes>\":break;case\"<smartTagType\":break;case\"<webPublishing\":case\"<webPublishing/>\":break;case\"<fileRecoveryPr\":case\"<fileRecoveryPr/>\":break;case\"<webPublishObjects>\":case\"<webPublishObjects\":case\"</webPublishObjects>\":break;case\"<webPublishObject\":break;case\"<extLst>\":case\"</extLst>\":case\"<extLst/>\":break;case\"<ext\":pass=true;break;case\"</ext>\":pass=false;break;case\"<ArchID\":break;case\"<AlternateContent\":pass=true;break;case\"</AlternateContent>\":pass=false;break;default:if(!pass&&opts.WTF)throw\"unrecognized \"+y[0]+\" in workbook\"}});if(XMLNS.main.indexOf(wb.xmlns)===-1)throw new Error(\"Unknown Namespace: \"+wb.xmlns);parse_wb_defaults(wb);return wb}var WB_XML_ROOT=writextag(\"workbook\",null,{xmlns:XMLNS.main[0],\"xmlns:r\":XMLNS.r});function safe1904(wb){try{return parsexmlbool(wb.Workbook.WBProps.date1904)?\"true\":\"false\"}catch(e){return\"false\"}}function write_wb_xml(wb,opts){var o=[XML_HEADER];o[o.length]=WB_XML_ROOT;o[o.length]=writextag(\"workbookPr\",null,{date1904:safe1904(wb)});o[o.length]=\"<sheets>\";for(var i=0;i!=wb.SheetNames.length;++i)o[o.length]=writextag(\"sheet\",null,{name:wb.SheetNames[i].substr(0,31),sheetId:\"\"+(i+1),\"r:id\":\"rId\"+(i+1)});o[o.length]=\"</sheets>\";var hasPrintHeaders=false;for(var i=0;i!=wb.SheetNames.length;++i){var sheetName=wb.SheetNames[i];var sheet=wb.Sheets[sheetName];if(sheet[\"!printHeader\"]){if(sheet[\"!printHeader\"].length!==2){throw\"!printHeaders must be an array of length 2: \"+sheet[\"!printHeader\"]}hasPrintHeaders=true}}if(hasPrintHeaders){o[o.length]=\"<definedNames>\";for(var i=0;i!=wb.SheetNames.length;++i){var sheetName=wb.SheetNames[i];var sheet=wb.Sheets[sheetName];if(sheet[\"!printHeader\"])var range=\"'\"+sheetName+\"'!\"+sheet[\"!printHeader\"];console.log(\"!!!!\"+range);o[o.length]=writextag(\"definedName\",range,{name:\"_xlnm.Print_Titles\",localSheetId:\"\"+i})}o[o.length]=\"</definedNames>\"}if(o.length>2){o[o.length]=\"</workbook>\";o[1]=o[1].replace(\"/>\",\">\")}return o.join(\"\")}function parse_BrtBundleSh(data,length){var z={};z.hsState=data.read_shift(4);z.iTabID=data.read_shift(4);z.strRelID=parse_RelID(data,length-8);z.name=parse_XLWideString(data);return z}function write_BrtBundleSh(data,o){if(!o)o=new_buf(127);o.write_shift(4,data.hsState);o.write_shift(4,data.iTabID);write_RelID(data.strRelID,o);write_XLWideString(data.name.substr(0,31),o);return o}function parse_BrtWbProp(data,length){data.read_shift(4);var dwThemeVersion=data.read_shift(4);var strName=length>8?parse_XLWideString(data):\"\";return[dwThemeVersion,strName]}function write_BrtWbProp(data,o){if(!o)o=new_buf(8);o.write_shift(4,0);o.write_shift(4,0);return o}function parse_BrtFRTArchID$(data,length){var o={};data.read_shift(4);o.ArchID=data.read_shift(4);data.l+=length-8;return o}function parse_wb_bin(data,opts){var wb={AppVersion:{},WBProps:{},WBView:[],Sheets:[],CalcPr:{},xmlns:\"\"};var pass=false,z;recordhopper(data,function hopper_wb(val,R){switch(R.n){case\"BrtBundleSh\":wb.Sheets.push(val);break;case\"BrtBeginBook\":break;case\"BrtFileVersion\":break;case\"BrtWbProp\":break;case\"BrtACBegin\":break;case\"BrtAbsPath15\":break;case\"BrtACEnd\":break;case\"BrtWbFactoid\":break;case\"BrtBookProtection\":break;case\"BrtBeginBookViews\":break;case\"BrtBookView\":break;case\"BrtEndBookViews\":break;case\"BrtBeginBundleShs\":break;case\"BrtEndBundleShs\":break;case\"BrtBeginFnGroup\":break;case\"BrtEndFnGroup\":break;case\"BrtBeginExternals\":break;case\"BrtSupSelf\":break;case\"BrtSupBookSrc\":break;case\"BrtExternSheet\":break;case\"BrtEndExternals\":break;case\"BrtName\":break;case\"BrtCalcProp\":break;case\"BrtUserBookView\":break;case\"BrtBeginPivotCacheIDs\":break;case\"BrtBeginPivotCacheID\":break;case\"BrtEndPivotCacheID\":break;case\"BrtEndPivotCacheIDs\":break;case\"BrtWebOpt\":break;case\"BrtFileRecover\":break;case\"BrtFileSharing\":break;case\"BrtBeginSmartTagTypes\":break;case\"BrtSmartTagType\":break;case\"BrtEndSmartTagTypes\":break;case\"BrtFRTBegin\":pass=true;break;case\"BrtFRTArchID$\":break;case\"BrtWorkBookPr15\":break;case\"BrtFRTEnd\":pass=false;break;case\"BrtEndBook\":break;default:if(!pass||opts.WTF)throw new Error(\"Unexpected record \"+R.n)}});parse_wb_defaults(wb);return wb}function write_BUNDLESHS(ba,wb,opts){write_record(ba,\"BrtBeginBundleShs\");for(var idx=0;idx!=wb.SheetNames.length;++idx){var d={hsState:0,iTabID:idx+1,strRelID:\"rId\"+(idx+1),name:wb.SheetNames[idx]};write_record(ba,\"BrtBundleSh\",write_BrtBundleSh(d))}write_record(ba,\"BrtEndBundleShs\")}function write_BrtFileVersion(data,o){if(!o)o=new_buf(127);for(var i=0;i!=4;++i)o.write_shift(4,0);write_XLWideString(\"SheetJS\",o);write_XLWideString(XLSX.version,o);write_XLWideString(XLSX.version,o);write_XLWideString(\"7262\",o);o.length=o.l;return o}function write_BOOKVIEWS(ba,wb,opts){write_record(ba,\"BrtBeginBookViews\");write_record(ba,\"BrtEndBookViews\")}function write_BrtCalcProp(data,o){if(!o)o=new_buf(26);o.write_shift(4,0);o.write_shift(4,1);o.write_shift(4,0);write_Xnum(0,o);o.write_shift(-4,1023);o.write_shift(1,51);o.write_shift(1,0);return o}function write_BrtFileRecover(data,o){if(!o)o=new_buf(1);o.write_shift(1,0);return o}function write_wb_bin(wb,opts){var ba=buf_array();write_record(ba,\"BrtBeginBook\");write_record(ba,\"BrtFileVersion\",write_BrtFileVersion());write_record(ba,\"BrtWbProp\",write_BrtWbProp());write_BOOKVIEWS(ba,wb,opts);write_BUNDLESHS(ba,wb,opts);write_record(ba,\"BrtCalcProp\",write_BrtCalcProp());write_record(ba,\"BrtFileRecover\",write_BrtFileRecover());write_record(ba,\"BrtEndBook\");return ba.end()}function parse_wb(data,name,opts){return(name.substr(-4)===\".bin\"?parse_wb_bin:parse_wb_xml)(data,opts)}function parse_ws(data,name,opts,rels){return(name.substr(-4)===\".bin\"?parse_ws_bin:parse_ws_xml)(data,opts,rels)}function parse_sty(data,name,opts){return(name.substr(-4)===\".bin\"?parse_sty_bin:parse_sty_xml)(data,opts)}function parse_theme(data,name,opts){return parse_theme_xml(data,opts)}function parse_sst(data,name,opts){return(name.substr(-4)===\".bin\"?parse_sst_bin:parse_sst_xml)(data,opts)}function parse_cmnt(data,name,opts){return(name.substr(-4)===\".bin\"?parse_comments_bin:parse_comments_xml)(data,opts)}function parse_cc(data,name,opts){return(name.substr(-4)===\".bin\"?parse_cc_bin:parse_cc_xml)(data,opts)}function write_wb(wb,name,opts){return(name.substr(-4)===\".bin\"?write_wb_bin:write_wb_xml)(wb,opts)}function write_ws(data,name,opts,wb){return(name.substr(-4)===\".bin\"?write_ws_bin:write_ws_xml)(data,opts,wb)}function write_sty(data,name,opts){return(name.substr(-4)===\".bin\"?write_sty_bin:write_sty_xml)(data,opts)}function write_sst(data,name,opts){return(name.substr(-4)===\".bin\"?write_sst_bin:write_sst_xml)(data,opts)}var attregexg2=/([\\w:]+)=((?:\")([^\"]*)(?:\")|(?:')([^']*)(?:'))/g;var attregex2=/([\\w:]+)=((?:\")(?:[^\"]*)(?:\")|(?:')(?:[^']*)(?:'))/;var _chr=function(c){return String.fromCharCode(c)};function xlml_parsexmltag(tag,skip_root){var words=tag.split(/\\s+/);var z=[];if(!skip_root)z[0]=words[0];if(words.length===1)return z;var m=tag.match(attregexg2),y,j,w,i;if(m)for(i=0;i!=m.length;++i){y=m[i].match(attregex2);if((j=y[1].indexOf(\":\"))===-1)z[y[1]]=y[2].substr(1,y[2].length-2);else{if(y[1].substr(0,6)===\"xmlns:\")w=\"xmlns\"+y[1].substr(6);else w=y[1].substr(j+1);z[w]=y[2].substr(1,y[2].length-2)}}return z}function xlml_parsexmltagobj(tag){var words=tag.split(/\\s+/);var z={};if(words.length===1)return z;var m=tag.match(attregexg2),y,j,w,i;if(m)for(i=0;i!=m.length;++i){y=m[i].match(attregex2);if((j=y[1].indexOf(\":\"))===-1)z[y[1]]=y[2].substr(1,y[2].length-2);else{if(y[1].substr(0,6)===\"xmlns:\")w=\"xmlns\"+y[1].substr(6);else w=y[1].substr(j+1);z[w]=y[2].substr(1,y[2].length-2)}}return z}function xlml_format(format,value){var fmt=XLMLFormatMap[format]||unescapexml(format);if(fmt===\"General\")return SSF._general(value);return SSF.format(fmt,value)}function xlml_set_custprop(Custprops,Rn,cp,val){switch((cp[0].match(/dt:dt=\"([\\w.]+)\"/)||[\"\",\"\"])[1]){case\"boolean\":val=parsexmlbool(val);break;case\"i2\":case\"int\":val=parseInt(val,10);break;case\"r4\":case\"float\":val=parseFloat(val);break;case\"date\":case\"dateTime.tz\":val=new Date(val);break;case\"i8\":case\"string\":case\"fixed\":case\"uuid\":case\"bin.base64\":break;default:throw\"bad custprop:\"+cp[0]}Custprops[unescapexml(Rn[3])]=val}function safe_format_xlml(cell,nf,o){try{if(cell.t===\"e\"){cell.w=cell.w||BErr[cell.v]}else if(nf===\"General\"){if(cell.t===\"n\"){if((cell.v|0)===cell.v)cell.w=SSF._general_int(cell.v);else cell.w=SSF._general_num(cell.v)}else cell.w=SSF._general(cell.v)}else cell.w=xlml_format(nf||\"General\",cell.v);if(o.cellNF)cell.z=XLMLFormatMap[nf]||nf||\"General\"}catch(e){if(o.WTF)throw e}}function process_style_xlml(styles,stag,opts){if(opts.cellStyles){if(stag.Interior){var I=stag.Interior;if(I.Pattern)I.patternType=XLMLPatternTypeMap[I.Pattern]||I.Pattern}}styles[stag.ID]=stag}function parse_xlml_data(xml,ss,data,cell,base,styles,csty,row,o){var nf=\"General\",sid=cell.StyleID,S={};o=o||{};var interiors=[];if(sid===undefined&&row)sid=row.StyleID;if(sid===undefined&&csty)sid=csty.StyleID;while(styles[sid]!==undefined){if(styles[sid].nf)nf=styles[sid].nf;if(styles[sid].Interior)interiors.push(styles[sid].Interior);if(!styles[sid].Parent)break;sid=styles[sid].Parent}switch(data.Type){case\"Boolean\":cell.t=\"b\";cell.v=parsexmlbool(xml);break;case\"String\":cell.t=\"s\";cell.r=xlml_fixstr(unescapexml(xml));cell.v=xml.indexOf(\"<\")>-1?ss:cell.r;break;case\"DateTime\":cell.v=(Date.parse(xml)-new Date(Date.UTC(1899,11,30)))/(24*60*60*1e3);if(cell.v!==cell.v)cell.v=unescapexml(xml);else if(cell.v>=1&&cell.v<60)cell.v=cell.v-1;if(!nf||nf==\"General\")nf=\"yyyy-mm-dd\";case\"Number\":if(cell.v===undefined)cell.v=+xml;\nif(!cell.t)cell.t=\"n\";break;case\"Error\":cell.t=\"e\";cell.v=RBErr[xml];cell.w=xml;break;default:cell.t=\"s\";cell.v=xlml_fixstr(ss);break}safe_format_xlml(cell,nf,o);if(o.cellFormula!=null&&cell.Formula){cell.f=rc_to_a1(unescapexml(cell.Formula),base);cell.Formula=undefined}if(o.cellStyles){interiors.forEach(function(x){if(!S.patternType&&x.patternType)S.patternType=x.patternType});cell.s=S}cell.ixfe=cell.StyleID!==undefined?cell.StyleID:\"Default\"}function xlml_clean_comment(comment){comment.t=comment.v;comment.v=comment.w=comment.ixfe=undefined}function xlml_normalize(d){if(has_buf&&Buffer.isBuffer(d))return d.toString(\"utf8\");if(typeof d===\"string\")return d;throw\"badf\"}var xlmlregex=/<(\\/?)([a-z0-9]*:|)(\\w+)[^>]*>/gm;function parse_xlml_xml(d,opts){var str=xlml_normalize(d);var Rn;var state=[],tmp;var sheets={},sheetnames=[],cursheet={},sheetname=\"\";var table={},cell={},row={},dtag,didx;var c=0,r=0;var refguess={s:{r:1e6,c:1e6},e:{r:0,c:0}};var styles={},stag={};var ss=\"\",fidx=0;var mergecells=[];var Props={},Custprops={},pidx=0,cp={};var comments=[],comment={};var cstys=[],csty;xlmlregex.lastIndex=0;while(Rn=xlmlregex.exec(str))switch(Rn[3]){case\"Data\":if(state[state.length-1][1])break;if(Rn[1]===\"/\")parse_xlml_data(str.slice(didx,Rn.index),ss,dtag,state[state.length-1][0]==\"Comment\"?comment:cell,{c:c,r:r},styles,cstys[c],row,opts);else{ss=\"\";dtag=xlml_parsexmltag(Rn[0]);didx=Rn.index+Rn[0].length}break;case\"Cell\":if(Rn[1]===\"/\"){if(comments.length>0)cell.c=comments;if((!opts.sheetRows||opts.sheetRows>r)&&cell.v!==undefined)cursheet[encode_col(c)+encode_row(r)]=cell;if(cell.HRef){cell.l={Target:cell.HRef,tooltip:cell.HRefScreenTip};cell.HRef=cell.HRefScreenTip=undefined}if(cell.MergeAcross||cell.MergeDown){var cc=c+(parseInt(cell.MergeAcross,10)|0);var rr=r+(parseInt(cell.MergeDown,10)|0);mergecells.push({s:{c:c,r:r},e:{c:cc,r:rr}})}++c;if(cell.MergeAcross)c+=+cell.MergeAcross}else{cell=xlml_parsexmltagobj(Rn[0]);if(cell.Index)c=+cell.Index-1;if(c<refguess.s.c)refguess.s.c=c;if(c>refguess.e.c)refguess.e.c=c;if(Rn[0].substr(-2)===\"/>\")++c;comments=[]}break;case\"Row\":if(Rn[1]===\"/\"||Rn[0].substr(-2)===\"/>\"){if(r<refguess.s.r)refguess.s.r=r;if(r>refguess.e.r)refguess.e.r=r;if(Rn[0].substr(-2)===\"/>\"){row=xlml_parsexmltag(Rn[0]);if(row.Index)r=+row.Index-1}c=0;++r}else{row=xlml_parsexmltag(Rn[0]);if(row.Index)r=+row.Index-1}break;case\"Worksheet\":if(Rn[1]===\"/\"){if((tmp=state.pop())[0]!==Rn[3])throw\"Bad state: \"+tmp;sheetnames.push(sheetname);if(refguess.s.r<=refguess.e.r&&refguess.s.c<=refguess.e.c)cursheet[\"!ref\"]=encode_range(refguess);if(mergecells.length)cursheet[\"!merges\"]=mergecells;sheets[sheetname]=cursheet}else{refguess={s:{r:1e6,c:1e6},e:{r:0,c:0}};r=c=0;state.push([Rn[3],false]);tmp=xlml_parsexmltag(Rn[0]);sheetname=tmp.Name;cursheet={};mergecells=[]}break;case\"Table\":if(Rn[1]===\"/\"){if((tmp=state.pop())[0]!==Rn[3])throw\"Bad state: \"+tmp}else if(Rn[0].slice(-2)==\"/>\")break;else{table=xlml_parsexmltag(Rn[0]);state.push([Rn[3],false]);cstys=[]}break;case\"Style\":if(Rn[1]===\"/\")process_style_xlml(styles,stag,opts);else stag=xlml_parsexmltag(Rn[0]);break;case\"NumberFormat\":stag.nf=xlml_parsexmltag(Rn[0]).Format||\"General\";break;case\"Column\":if(state[state.length-1][0]!==\"Table\")break;csty=xlml_parsexmltag(Rn[0]);cstys[csty.Index-1||cstys.length]=csty;for(var i=0;i<+csty.Span;++i)cstys[cstys.length]=csty;break;case\"NamedRange\":break;case\"NamedCell\":break;case\"B\":break;case\"I\":break;case\"U\":break;case\"S\":break;case\"Sub\":break;case\"Sup\":break;case\"Span\":break;case\"Border\":break;case\"Alignment\":break;case\"Borders\":break;case\"Font\":if(Rn[0].substr(-2)===\"/>\")break;else if(Rn[1]===\"/\")ss+=str.slice(fidx,Rn.index);else fidx=Rn.index+Rn[0].length;break;case\"Interior\":if(!opts.cellStyles)break;stag.Interior=xlml_parsexmltag(Rn[0]);break;case\"Protection\":break;case\"Author\":case\"Title\":case\"Description\":case\"Created\":case\"Keywords\":case\"Subject\":case\"Category\":case\"Company\":case\"LastAuthor\":case\"LastSaved\":case\"LastPrinted\":case\"Version\":case\"Revision\":case\"TotalTime\":case\"HyperlinkBase\":case\"Manager\":if(Rn[0].substr(-2)===\"/>\")break;else if(Rn[1]===\"/\")xlml_set_prop(Props,Rn[3],str.slice(pidx,Rn.index));else pidx=Rn.index+Rn[0].length;break;case\"Paragraphs\":break;case\"Styles\":case\"Workbook\":if(Rn[1]===\"/\"){if((tmp=state.pop())[0]!==Rn[3])throw\"Bad state: \"+tmp}else state.push([Rn[3],false]);break;case\"Comment\":if(Rn[1]===\"/\"){if((tmp=state.pop())[0]!==Rn[3])throw\"Bad state: \"+tmp;xlml_clean_comment(comment);comments.push(comment)}else{state.push([Rn[3],false]);tmp=xlml_parsexmltag(Rn[0]);comment={a:tmp.Author}}break;case\"Name\":break;case\"ComponentOptions\":case\"DocumentProperties\":case\"CustomDocumentProperties\":case\"OfficeDocumentSettings\":case\"PivotTable\":case\"PivotCache\":case\"Names\":case\"MapInfo\":case\"PageBreaks\":case\"QueryTable\":case\"DataValidation\":case\"AutoFilter\":case\"Sorting\":case\"Schema\":case\"data\":case\"ConditionalFormatting\":case\"SmartTagType\":case\"SmartTags\":case\"ExcelWorkbook\":case\"WorkbookOptions\":case\"WorksheetOptions\":if(Rn[1]===\"/\"){if((tmp=state.pop())[0]!==Rn[3])throw\"Bad state: \"+tmp}else if(Rn[0].charAt(Rn[0].length-2)!==\"/\")state.push([Rn[3],true]);break;default:var seen=true;switch(state[state.length-1][0]){case\"OfficeDocumentSettings\":switch(Rn[3]){case\"AllowPNG\":break;case\"RemovePersonalInformation\":break;case\"DownloadComponents\":break;case\"LocationOfComponents\":break;case\"Colors\":break;case\"Color\":break;case\"Index\":break;case\"RGB\":break;case\"PixelsPerInch\":break;case\"TargetScreenSize\":break;case\"ReadOnlyRecommended\":break;default:seen=false}break;case\"ComponentOptions\":switch(Rn[3]){case\"Toolbar\":break;case\"HideOfficeLogo\":break;case\"SpreadsheetAutoFit\":break;case\"Label\":break;case\"Caption\":break;case\"MaxHeight\":break;case\"MaxWidth\":break;case\"NextSheetNumber\":break;default:seen=false}break;case\"ExcelWorkbook\":switch(Rn[3]){case\"WindowHeight\":break;case\"WindowWidth\":break;case\"WindowTopX\":break;case\"WindowTopY\":break;case\"TabRatio\":break;case\"ProtectStructure\":break;case\"ProtectWindows\":break;case\"ActiveSheet\":break;case\"DisplayInkNotes\":break;case\"FirstVisibleSheet\":break;case\"SupBook\":break;case\"SheetName\":break;case\"SheetIndex\":break;case\"SheetIndexFirst\":break;case\"SheetIndexLast\":break;case\"Dll\":break;case\"AcceptLabelsInFormulas\":break;case\"DoNotSaveLinkValues\":break;case\"Date1904\":break;case\"Iteration\":break;case\"MaxIterations\":break;case\"MaxChange\":break;case\"Path\":break;case\"Xct\":break;case\"Count\":break;case\"SelectedSheets\":break;case\"Calculation\":break;case\"Uncalced\":break;case\"StartupPrompt\":break;case\"Crn\":break;case\"ExternName\":break;case\"Formula\":break;case\"ColFirst\":break;case\"ColLast\":break;case\"WantAdvise\":break;case\"Boolean\":break;case\"Error\":break;case\"Text\":break;case\"OLE\":break;case\"NoAutoRecover\":break;case\"PublishObjects\":break;case\"DoNotCalculateBeforeSave\":break;case\"Number\":break;case\"RefModeR1C1\":break;case\"EmbedSaveSmartTags\":break;default:seen=false}break;case\"WorkbookOptions\":switch(Rn[3]){case\"OWCVersion\":break;case\"Height\":break;case\"Width\":break;default:seen=false}break;case\"WorksheetOptions\":switch(Rn[3]){case\"Unsynced\":break;case\"Visible\":break;case\"Print\":break;case\"Panes\":break;case\"Scale\":break;case\"Pane\":break;case\"Number\":break;case\"Layout\":break;case\"Header\":break;case\"Footer\":break;case\"PageSetup\":break;case\"PageMargins\":break;case\"Selected\":break;case\"ProtectObjects\":break;case\"EnableSelection\":break;case\"ProtectScenarios\":break;case\"ValidPrinterInfo\":break;case\"HorizontalResolution\":break;case\"VerticalResolution\":break;case\"NumberofCopies\":break;case\"ActiveRow\":break;case\"ActiveCol\":break;case\"ActivePane\":break;case\"TopRowVisible\":break;case\"TopRowBottomPane\":break;case\"LeftColumnVisible\":break;case\"LeftColumnRightPane\":break;case\"FitToPage\":break;case\"RangeSelection\":break;case\"PaperSizeIndex\":break;case\"PageLayoutZoom\":break;case\"PageBreakZoom\":break;case\"FilterOn\":break;case\"DoNotDisplayGridlines\":break;case\"SplitHorizontal\":break;case\"SplitVertical\":break;case\"FreezePanes\":break;case\"FrozenNoSplit\":break;case\"FitWidth\":break;case\"FitHeight\":break;case\"CommentsLayout\":break;case\"Zoom\":break;case\"LeftToRight\":break;case\"Gridlines\":break;case\"AllowSort\":break;case\"AllowFilter\":break;case\"AllowInsertRows\":break;case\"AllowDeleteRows\":break;case\"AllowInsertCols\":break;case\"AllowDeleteCols\":break;case\"AllowInsertHyperlinks\":break;case\"AllowFormatCells\":break;case\"AllowSizeCols\":break;case\"AllowSizeRows\":break;case\"NoSummaryRowsBelowDetail\":break;case\"TabColorIndex\":break;case\"DoNotDisplayHeadings\":break;case\"ShowPageLayoutZoom\":break;case\"NoSummaryColumnsRightDetail\":break;case\"BlackAndWhite\":break;case\"DoNotDisplayZeros\":break;case\"DisplayPageBreak\":break;case\"RowColHeadings\":break;case\"DoNotDisplayOutline\":break;case\"NoOrientation\":break;case\"AllowUsePivotTables\":break;case\"ZeroHeight\":break;case\"ViewableRange\":break;case\"Selection\":break;case\"ProtectContents\":break;default:seen=false}break;case\"PivotTable\":case\"PivotCache\":switch(Rn[3]){case\"ImmediateItemsOnDrop\":break;case\"ShowPageMultipleItemLabel\":break;case\"CompactRowIndent\":break;case\"Location\":break;case\"PivotField\":break;case\"Orientation\":break;case\"LayoutForm\":break;case\"LayoutSubtotalLocation\":break;case\"LayoutCompactRow\":break;case\"Position\":break;case\"PivotItem\":break;case\"DataType\":break;case\"DataField\":break;case\"SourceName\":break;case\"ParentField\":break;case\"PTLineItems\":break;case\"PTLineItem\":break;case\"CountOfSameItems\":break;case\"Item\":break;case\"ItemType\":break;case\"PTSource\":break;case\"CacheIndex\":break;case\"ConsolidationReference\":break;case\"FileName\":break;case\"Reference\":break;case\"NoColumnGrand\":break;case\"NoRowGrand\":break;case\"BlankLineAfterItems\":break;case\"Hidden\":break;case\"Subtotal\":break;case\"BaseField\":break;case\"MapChildItems\":break;case\"Function\":break;case\"RefreshOnFileOpen\":break;case\"PrintSetTitles\":break;case\"MergeLabels\":break;case\"DefaultVersion\":break;case\"RefreshName\":break;case\"RefreshDate\":break;case\"RefreshDateCopy\":break;case\"VersionLastRefresh\":break;case\"VersionLastUpdate\":break;case\"VersionUpdateableMin\":break;case\"VersionRefreshableMin\":break;case\"Calculation\":break;default:seen=false}break;case\"PageBreaks\":switch(Rn[3]){case\"ColBreaks\":break;case\"ColBreak\":break;case\"RowBreaks\":break;case\"RowBreak\":break;case\"ColStart\":break;case\"ColEnd\":break;case\"RowEnd\":break;default:seen=false}break;case\"AutoFilter\":switch(Rn[3]){case\"AutoFilterColumn\":break;case\"AutoFilterCondition\":break;case\"AutoFilterAnd\":break;case\"AutoFilterOr\":break;default:seen=false}break;case\"QueryTable\":switch(Rn[3]){case\"Id\":break;case\"AutoFormatFont\":break;case\"AutoFormatPattern\":break;case\"QuerySource\":break;case\"QueryType\":break;case\"EnableRedirections\":break;case\"RefreshedInXl9\":break;case\"URLString\":break;case\"HTMLTables\":break;case\"Connection\":break;case\"CommandText\":break;case\"RefreshInfo\":break;case\"NoTitles\":break;case\"NextId\":break;case\"ColumnInfo\":break;case\"OverwriteCells\":break;case\"DoNotPromptForFile\":break;case\"TextWizardSettings\":break;case\"Source\":break;case\"Number\":break;case\"Decimal\":break;case\"ThousandSeparator\":break;case\"TrailingMinusNumbers\":break;case\"FormatSettings\":break;case\"FieldType\":break;case\"Delimiters\":break;case\"Tab\":break;case\"Comma\":break;case\"AutoFormatName\":break;case\"VersionLastEdit\":break;case\"VersionLastRefresh\":break;default:seen=false}break;case\"Sorting\":case\"ConditionalFormatting\":case\"DataValidation\":switch(Rn[3]){case\"Range\":break;case\"Type\":break;case\"Min\":break;case\"Max\":break;case\"Sort\":break;case\"Descending\":break;case\"Order\":break;case\"CaseSensitive\":break;case\"Value\":break;case\"ErrorStyle\":break;case\"ErrorMessage\":break;case\"ErrorTitle\":break;case\"CellRangeList\":break;case\"InputMessage\":break;case\"InputTitle\":break;case\"ComboHide\":break;case\"InputHide\":break;case\"Condition\":break;case\"Qualifier\":break;case\"UseBlank\":break;case\"Value1\":break;case\"Value2\":break;case\"Format\":break;default:seen=false}break;case\"MapInfo\":case\"Schema\":case\"data\":switch(Rn[3]){case\"Map\":break;case\"Entry\":break;case\"Range\":break;case\"XPath\":break;case\"Field\":break;case\"XSDType\":break;case\"FilterOn\":break;case\"Aggregate\":break;case\"ElementType\":break;case\"AttributeType\":break;case\"schema\":case\"element\":case\"complexType\":case\"datatype\":case\"all\":case\"attribute\":case\"extends\":break;case\"row\":break;default:seen=false}break;case\"SmartTags\":break;default:seen=false;break}if(seen)break;if(!state[state.length-1][1])throw\"Unrecognized tag: \"+Rn[3]+\"|\"+state.join(\"|\");if(state[state.length-1][0]===\"CustomDocumentProperties\"){if(Rn[0].substr(-2)===\"/>\")break;else if(Rn[1]===\"/\")xlml_set_custprop(Custprops,Rn,cp,str.slice(pidx,Rn.index));else{cp=Rn;pidx=Rn.index+Rn[0].length}break}if(opts.WTF)throw\"Unrecognized tag: \"+Rn[3]+\"|\"+state.join(\"|\")}var out={};if(!opts.bookSheets&&!opts.bookProps)out.Sheets=sheets;out.SheetNames=sheetnames;out.SSF=SSF.get_table();out.Props=Props;out.Custprops=Custprops;return out}function parse_xlml(data,opts){fix_read_opts(opts=opts||{});switch(opts.type||\"base64\"){case\"base64\":return parse_xlml_xml(Base64.decode(data),opts);case\"binary\":case\"buffer\":case\"file\":return parse_xlml_xml(data,opts);case\"array\":return parse_xlml_xml(data.map(_chr).join(\"\"),opts)}}function write_xlml(wb,opts){}function parse_compobj(obj){var v={};var o=obj.content;var l=28,m;m=__lpstr(o,l);l+=4+__readUInt32LE(o,l);v.UserType=m;m=__readUInt32LE(o,l);l+=4;switch(m){case 0:break;case 4294967295:case 4294967294:l+=4;break;default:if(m>400)throw new Error(\"Unsupported Clipboard: \"+m.toString(16));l+=m}m=__lpstr(o,l);l+=m.length===0?0:5+m.length;v.Reserved1=m;if((m=__readUInt32LE(o,l))!==1907550708)return v;throw\"Unsupported Unicode Extension\"}function slurp(R,blob,length,opts){var l=length;var bufs=[];var d=blob.slice(blob.l,blob.l+l);if(opts&&opts.enc&&opts.enc.insitu_decrypt)switch(R.n){case\"BOF\":case\"FilePass\":case\"FileLock\":case\"InterfaceHdr\":case\"RRDInfo\":case\"RRDHead\":case\"UsrExcl\":break;default:if(d.length===0)break;opts.enc.insitu_decrypt(d)}bufs.push(d);blob.l+=l;var next=XLSRecordEnum[__readUInt16LE(blob,blob.l)];while(next!=null&&next.n===\"Continue\"){l=__readUInt16LE(blob,blob.l+2);bufs.push(blob.slice(blob.l+4,blob.l+4+l));blob.l+=4+l;next=XLSRecordEnum[__readUInt16LE(blob,blob.l)]}var b=bconcat(bufs);prep_blob(b,0);var ll=0;b.lens=[];for(var j=0;j<bufs.length;++j){b.lens.push(ll);ll+=bufs[j].length}return R.f(b,b.length,opts)}function safe_format_xf(p,opts,date1904){if(!p.XF)return;try{var fmtid=p.XF.ifmt||0;if(p.t===\"e\"){p.w=p.w||BErr[p.v]}else if(fmtid===0){if(p.t===\"n\"){if((p.v|0)===p.v)p.w=SSF._general_int(p.v);else p.w=SSF._general_num(p.v)}else p.w=SSF._general(p.v)}else p.w=SSF.format(fmtid,p.v,{date1904:date1904||false});if(opts.cellNF)p.z=SSF._table[fmtid]}catch(e){if(opts.WTF)throw e}}function make_cell(val,ixfe,t){return{v:val,ixfe:ixfe,t:t}}function parse_workbook(blob,options){var wb={opts:{}};var Sheets={};var out={};var Directory={};var found_sheet=false;var range={};var last_formula=null;var sst=[];var cur_sheet=\"\";var Preamble={};var lastcell,last_cell,cc,cmnt,rng,rngC,rngR;var shared_formulae={};var array_formulae=[];var temp_val;var country;var cell_valid=true;var XFs=[];var palette=[];var get_rgb=function getrgb(icv){if(icv<8)return XLSIcv[icv];if(icv<64)return palette[icv-8]||XLSIcv[icv];return XLSIcv[icv]};var process_cell_style=function pcs(cell,line){var xfd=line.XF.data;if(!xfd||!xfd.patternType)return;line.s={};line.s.patternType=xfd.patternType;var t;if(t=rgb2Hex(get_rgb(xfd.icvFore))){line.s.fgColor={rgb:t}}if(t=rgb2Hex(get_rgb(xfd.icvBack))){line.s.bgColor={rgb:t}}};var addcell=function addcell(cell,line,options){if(!cell_valid)return;if(options.cellStyles&&line.XF&&line.XF.data)process_cell_style(cell,line);lastcell=cell;last_cell=encode_cell(cell);if(range.s){if(cell.r<range.s.r)range.s.r=cell.r;if(cell.c<range.s.c)range.s.c=cell.c}if(range.e){if(cell.r+1>range.e.r)range.e.r=cell.r+1;if(cell.c+1>range.e.c)range.e.c=cell.c+1}if(options.sheetRows&&lastcell.r>=options.sheetRows)cell_valid=false;else out[last_cell]=line};var opts={enc:false,sbcch:0,snames:[],sharedf:shared_formulae,arrayf:array_formulae,rrtabid:[],lastuser:\"\",biff:8,codepage:0,winlocked:0,wtf:false};if(options.password)opts.password=options.password;var mergecells=[];var objects=[];var supbooks=[[]];var sbc=0,sbci=0,sbcli=0;supbooks.SheetNames=opts.snames;supbooks.sharedf=opts.sharedf;supbooks.arrayf=opts.arrayf;var last_Rn=\"\";var file_depth=0;opts.codepage=1200;set_cp(1200);while(blob.l<blob.length-1){var s=blob.l;var RecordType=blob.read_shift(2);if(RecordType===0&&last_Rn===\"EOF\")break;var length=blob.l===blob.length?0:blob.read_shift(2),y;var R=XLSRecordEnum[RecordType];if(R&&R.f){if(options.bookSheets){if(last_Rn===\"BoundSheet8\"&&R.n!==\"BoundSheet8\")break}last_Rn=R.n;if(R.r===2||R.r==12){var rt=blob.read_shift(2);length-=2;if(!opts.enc&&rt!==RecordType)throw\"rt mismatch\";if(R.r==12){blob.l+=10;length-=10}}var val;if(R.n===\"EOF\")val=R.f(blob,length,opts);else val=slurp(R,blob,length,opts);var Rn=R.n;if(opts.biff===5||opts.biff===2)switch(Rn){case\"Lbl\":Rn=\"Label\";break}switch(Rn){case\"Date1904\":wb.opts.Date1904=val;break;case\"WriteProtect\":wb.opts.WriteProtect=true;break;case\"FilePass\":if(!opts.enc)blob.l=0;opts.enc=val;if(opts.WTF)console.error(val);if(!options.password)throw new Error(\"File is password-protected\");if(val.Type!==0)throw new Error(\"Encryption scheme unsupported\");if(!val.valid)throw new Error(\"Password is incorrect\");break;case\"WriteAccess\":opts.lastuser=val;break;case\"FileSharing\":break;case\"CodePage\":if(val===21010)val=1200;else if(val===32769)val=1252;opts.codepage=val;set_cp(val);break;case\"RRTabId\":opts.rrtabid=val;break;case\"WinProtect\":opts.winlocked=val;break;case\"Template\":break;case\"RefreshAll\":wb.opts.RefreshAll=val;break;case\"BookBool\":break;case\"UsesELFs\":break;case\"MTRSettings\":{if(val[0]&&val[1])throw\"Unsupported threads: \"+val}break;case\"CalcCount\":wb.opts.CalcCount=val;break;case\"CalcDelta\":wb.opts.CalcDelta=val;break;case\"CalcIter\":wb.opts.CalcIter=val;break;case\"CalcMode\":wb.opts.CalcMode=val;break;case\"CalcPrecision\":wb.opts.CalcPrecision=val;break;case\"CalcSaveRecalc\":wb.opts.CalcSaveRecalc=val;break;case\"CalcRefMode\":opts.CalcRefMode=val;break;case\"Uncalced\":break;case\"ForceFullCalculation\":wb.opts.FullCalc=val;break;case\"WsBool\":break;case\"XF\":XFs.push(val);break;case\"ExtSST\":break;case\"BookExt\":break;case\"RichTextStream\":break;case\"BkHim\":break;case\"SupBook\":supbooks[++sbc]=[val];sbci=0;break;case\"ExternName\":supbooks[sbc][++sbci]=val;break;case\"Index\":break;case\"Lbl\":supbooks[0][++sbcli]=val;break;case\"ExternSheet\":supbooks[sbc]=supbooks[sbc].concat(val);sbci+=val.length;break;case\"Protect\":out[\"!protect\"]=val;break;case\"Password\":if(val!==0&&opts.WTF)console.error(\"Password verifier: \"+val);break;case\"Prot4Rev\":case\"Prot4RevPass\":break;case\"BoundSheet8\":{Directory[val.pos]=val;opts.snames.push(val.name)}break;case\"EOF\":{if(--file_depth)break;if(range.e){out[\"!range\"]=range;if(range.e.r>0&&range.e.c>0){range.e.r--;range.e.c--;out[\"!ref\"]=encode_range(range);range.e.r++;range.e.c++}if(mergecells.length>0)out[\"!merges\"]=mergecells;if(objects.length>0)out[\"!objects\"]=objects}if(cur_sheet===\"\")Preamble=out;else Sheets[cur_sheet]=out;out={}}break;case\"BOF\":{if(opts.biff!==8);else if(val.BIFFVer===1280)opts.biff=5;else if(val.BIFFVer===2)opts.biff=2;else if(val.BIFFVer===7)opts.biff=2;if(file_depth++)break;cell_valid=true;out={};if(opts.biff===2){if(cur_sheet===\"\")cur_sheet=\"Sheet1\";range={s:{r:0,c:0},e:{r:0,c:0}}}else cur_sheet=(Directory[s]||{name:\"\"}).name;mergecells=[];objects=[]}break;case\"Number\":case\"BIFF2NUM\":{temp_val={ixfe:val.ixfe,XF:XFs[val.ixfe],v:val.val,t:\"n\"};if(temp_val.XF)safe_format_xf(temp_val,options,wb.opts.Date1904);addcell({c:val.c,r:val.r},temp_val,options)}break;case\"BoolErr\":{temp_val={ixfe:val.ixfe,XF:XFs[val.ixfe],v:val.val,t:val.t};if(temp_val.XF)safe_format_xf(temp_val,options,wb.opts.Date1904);addcell({c:val.c,r:val.r},temp_val,options)}break;case\"RK\":{temp_val={ixfe:val.ixfe,XF:XFs[val.ixfe],v:val.rknum,t:\"n\"};if(temp_val.XF)safe_format_xf(temp_val,options,wb.opts.Date1904);addcell({c:val.c,r:val.r},temp_val,options)}break;case\"MulRk\":{for(var j=val.c;j<=val.C;++j){var ixfe=val.rkrec[j-val.c][0];temp_val={ixfe:ixfe,XF:XFs[ixfe],v:val.rkrec[j-val.c][1],t:\"n\"};if(temp_val.XF)safe_format_xf(temp_val,options,wb.opts.Date1904);addcell({c:j,r:val.r},temp_val,options)}}break;case\"Formula\":{switch(val.val){case\"String\":last_formula=val;break;case\"Array Formula\":throw\"Array Formula unsupported\";default:temp_val={v:val.val,ixfe:val.cell.ixfe,t:val.tt};temp_val.XF=XFs[temp_val.ixfe];if(options.cellFormula)temp_val.f=\"=\"+stringify_formula(val.formula,range,val.cell,supbooks,opts);if(temp_val.XF)safe_format_xf(temp_val,options,wb.opts.Date1904);addcell(val.cell,temp_val,options);last_formula=val}}break;case\"String\":{if(last_formula){last_formula.val=val;temp_val={v:last_formula.val,ixfe:last_formula.cell.ixfe,t:\"s\"};temp_val.XF=XFs[temp_val.ixfe];if(options.cellFormula)temp_val.f=\"=\"+stringify_formula(last_formula.formula,range,last_formula.cell,supbooks,opts);if(temp_val.XF)safe_format_xf(temp_val,options,wb.opts.Date1904);addcell(last_formula.cell,temp_val,options);last_formula=null}}break;case\"Array\":{array_formulae.push(val)}break;case\"ShrFmla\":{if(!cell_valid)break;shared_formulae[encode_cell(last_formula.cell)]=val[0]}break;case\"LabelSst\":temp_val=make_cell(sst[val.isst].t,val.ixfe,\"s\");temp_val.XF=XFs[temp_val.ixfe];if(temp_val.XF)safe_format_xf(temp_val,options,wb.opts.Date1904);addcell({c:val.c,r:val.r},temp_val,options);break;case\"Label\":case\"BIFF2STR\":temp_val=make_cell(val.val,val.ixfe,\"s\");temp_val.XF=XFs[temp_val.ixfe];if(temp_val.XF)safe_format_xf(temp_val,options,wb.opts.Date1904);addcell({c:val.c,r:val.r},temp_val,options);break;case\"Dimensions\":{if(file_depth===1)range=val}break;case\"SST\":{sst=val}break;case\"Format\":{SSF.load(val[1],val[0])}break;case\"MergeCells\":mergecells=mergecells.concat(val);break;case\"Obj\":objects[val.cmo[0]]=opts.lastobj=val;break;case\"TxO\":opts.lastobj.TxO=val;break;case\"HLink\":{for(rngR=val[0].s.r;rngR<=val[0].e.r;++rngR)for(rngC=val[0].s.c;rngC<=val[0].e.c;++rngC)if(out[encode_cell({c:rngC,r:rngR})])out[encode_cell({c:rngC,r:rngR})].l=val[1]}break;case\"HLinkTooltip\":{for(rngR=val[0].s.r;rngR<=val[0].e.r;++rngR)for(rngC=val[0].s.c;rngC<=val[0].e.c;++rngC)if(out[encode_cell({c:rngC,r:rngR})])out[encode_cell({c:rngC,r:rngR})].l.tooltip=val[1]}break;case\"Note\":{if(opts.biff<=5&&opts.biff>=2)break;cc=out[encode_cell(val[0])];var noteobj=objects[val[2]];if(!cc)break;if(!cc.c)cc.c=[];cmnt={a:val[1],t:noteobj.TxO.t};cc.c.push(cmnt)}break;default:switch(R.n){case\"ClrtClient\":break;case\"XFExt\":update_xfext(XFs[val.ixfe],val.ext);break;case\"NameCmt\":break;case\"Header\":break;case\"Footer\":break;case\"HCenter\":break;case\"VCenter\":break;case\"Pls\":break;case\"Setup\":break;case\"DefColWidth\":break;case\"GCW\":break;case\"LHRecord\":break;case\"ColInfo\":break;case\"Row\":break;case\"DBCell\":break;case\"MulBlank\":break;case\"EntExU2\":break;case\"SxView\":break;case\"Sxvd\":break;case\"SXVI\":break;case\"SXVDEx\":break;case\"SxIvd\":break;case\"SXDI\":break;case\"SXLI\":break;case\"SXEx\":break;case\"QsiSXTag\":break;case\"Selection\":break;case\"Feat\":break;case\"FeatHdr\":case\"FeatHdr11\":break;case\"Feature11\":case\"Feature12\":case\"List12\":break;case\"Blank\":break;case\"Country\":country=val;break;case\"RecalcId\":break;case\"DefaultRowHeight\":case\"DxGCol\":break;case\"Fbi\":case\"Fbi2\":case\"GelFrame\":break;case\"Font\":break;case\"XFCRC\":break;case\"Style\":break;case\"StyleExt\":break;case\"Palette\":palette=val;break;case\"Theme\":break;case\"ScenarioProtect\":break;case\"ObjProtect\":break;case\"CondFmt12\":break;case\"Table\":break;case\"TableStyles\":break;case\"TableStyle\":break;case\"TableStyleElement\":break;case\"SXStreamID\":break;case\"SXVS\":break;case\"DConRef\":break;case\"SXAddl\":break;case\"DConBin\":break;case\"DConName\":break;case\"SXPI\":break;case\"SxFormat\":break;case\"SxSelect\":break;case\"SxRule\":break;case\"SxFilt\":break;case\"SxItm\":break;case\"SxDXF\":break;case\"ScenMan\":break;case\"DCon\":break;case\"CellWatch\":break;case\"PrintRowCol\":break;case\"PrintGrid\":break;case\"PrintSize\":break;case\"XCT\":break;case\"CRN\":break;case\"Scl\":{}break;case\"SheetExt\":{}break;case\"SheetExtOptional\":{}break;case\"ObNoMacros\":{}break;case\"ObProj\":{}break;case\"CodeName\":{}break;case\"GUIDTypeLib\":{}break;case\"WOpt\":break;case\"PhoneticInfo\":break;case\"OleObjectSize\":break;case\"DXF\":case\"DXFN\":case\"DXFN12\":case\"DXFN12List\":case\"DXFN12NoCB\":break;case\"Dv\":case\"DVal\":break;case\"BRAI\":case\"Series\":case\"SeriesText\":break;case\"DConn\":break;case\"DbOrParamQry\":break;case\"DBQueryExt\":break;case\"IFmtRecord\":break;case\"CondFmt\":case\"CF\":case\"CF12\":case\"CFEx\":break;case\"Excel9File\":break;case\"Units\":break;case\"InterfaceHdr\":case\"Mms\":case\"InterfaceEnd\":case\"DSF\":case\"BuiltInFnGroupCount\":case\"Window1\":case\"Window2\":case\"HideObj\":case\"GridSet\":case\"Guts\":case\"UserBView\":case\"UserSViewBegin\":case\"UserSViewEnd\":case\"Pane\":break;default:switch(R.n){case\"Dat\":case\"Begin\":case\"End\":case\"StartBlock\":case\"EndBlock\":case\"Frame\":case\"Area\":case\"Axis\":case\"AxisLine\":case\"Tick\":break;case\"AxesUsed\":case\"CrtLayout12\":case\"CrtLayout12A\":case\"CrtLink\":case\"CrtLine\":case\"CrtMlFrt\":case\"CrtMlFrtContinue\":break;case\"LineFormat\":case\"AreaFormat\":case\"Chart\":case\"Chart3d\":case\"Chart3DBarShape\":case\"ChartFormat\":case\"ChartFrtInfo\":break;case\"PlotArea\":case\"PlotGrowth\":break;case\"SeriesList\":case\"SerParent\":case\"SerAuxTrend\":break;case\"DataFormat\":case\"SerToCrt\":case\"FontX\":break;case\"CatSerRange\":case\"AxcExt\":case\"SerFmt\":break;case\"ShtProps\":break;case\"DefaultText\":case\"Text\":case\"CatLab\":break;case\"DataLabExtContents\":break;case\"Legend\":case\"LegendException\":break;case\"Pie\":case\"Scatter\":break;case\"PieFormat\":case\"MarkerFormat\":break;case\"StartObject\":case\"EndObject\":break;case\"AlRuns\":case\"ObjectLink\":break;case\"SIIndex\":break;case\"AttachedLabel\":case\"YMult\":break;case\"Line\":case\"Bar\":break;case\"Surf\":break;case\"AxisParent\":break;case\"Pos\":break;case\"ValueRange\":break;case\"SXViewEx9\":break;case\"SXViewLink\":break;case\"PivotChartBits\":break;case\"SBaseRef\":break;case\"TextPropsStream\":break;case\"LnExt\":break;case\"MkrExt\":break;case\"CrtCoopt\":break;case\"Qsi\":case\"Qsif\":case\"Qsir\":case\"QsiSXTag\":break;case\"TxtQry\":break;case\"FilterMode\":break;case\"AutoFilter\":case\"AutoFilterInfo\":break;case\"AutoFilter12\":break;case\"DropDownObjIds\":break;case\"Sort\":break;case\"SortData\":break;case\"ShapePropsStream\":break;case\"MsoDrawing\":case\"MsoDrawingGroup\":case\"MsoDrawingSelection\":break;case\"ImData\":break;case\"WebPub\":case\"AutoWebPub\":case\"RightMargin\":case\"LeftMargin\":case\"TopMargin\":case\"BottomMargin\":case\"HeaderFooter\":case\"HFPicture\":case\"PLV\":case\"HorizontalPageBreaks\":case\"VerticalPageBreaks\":case\"Backup\":case\"CompressPictures\":case\"Compat12\":break;case\"Continue\":case\"ContinueFrt12\":break;case\"FrtFontList\":case\"FrtWrapper\":break;case\"ExternCount\":break;case\"RString\":break;case\"TabIdConf\":case\"Radar\":case\"RadarArea\":case\"DropBar\":case\"Intl\":case\"CoordList\":case\"SerAuxErrBar\":break;default:switch(R.n){case\"SCENARIO\":case\"DConBin\":case\"PicF\":case\"DataLabExt\":case\"Lel\":case\"BopPop\":case\"BopPopCustom\":case\"RealTimeData\":case\"Name\":break;default:if(options.WTF)throw\"Unrecognized Record \"+R.n}}}}}else blob.l+=length}var sheetnamesraw=opts.biff===2?[\"Sheet1\"]:Object.keys(Directory).sort(function(a,b){return Number(a)-Number(b)}).map(function(x){return Directory[x].name});var sheetnames=sheetnamesraw.slice();wb.Directory=sheetnamesraw;wb.SheetNames=sheetnamesraw;if(!options.bookSheets)wb.Sheets=Sheets;wb.Preamble=Preamble;wb.Strings=sst;wb.SSF=SSF.get_table();if(opts.enc)wb.Encryption=opts.enc;wb.Metadata={};if(country!==undefined)wb.Metadata.Country=country;return wb}function parse_xlscfb(cfb,options){if(!options)options={};fix_read_opts(options);reset_cp();var CompObj,Summary,Workbook;if(cfb.find){CompObj=cfb.find(\"!CompObj\");Summary=cfb.find(\"!SummaryInformation\");Workbook=cfb.find(\"/Workbook\")}else{prep_blob(cfb,0);Workbook={content:cfb}}if(!Workbook)Workbook=cfb.find(\"/Book\");var CompObjP,SummaryP,WorkbookP;if(CompObj)CompObjP=parse_compobj(CompObj);if(options.bookProps&&!options.bookSheets)WorkbookP={};else{if(Workbook)WorkbookP=parse_workbook(Workbook.content,options,!!Workbook.find);else throw new Error(\"Cannot find Workbook stream\")}if(cfb.find)parse_props(cfb);var props={};for(var y in cfb.Summary)props[y]=cfb.Summary[y];for(y in cfb.DocSummary)props[y]=cfb.DocSummary[y];WorkbookP.Props=WorkbookP.Custprops=props;if(options.bookFiles)WorkbookP.cfb=cfb;WorkbookP.CompObjP=CompObjP;return WorkbookP}function parse_props(cfb){var DSI=cfb.find(\"!DocumentSummaryInformation\");if(DSI)try{cfb.DocSummary=parse_PropertySetStream(DSI,DocSummaryPIDDSI)}catch(e){}var SI=cfb.find(\"!SummaryInformation\");if(SI)try{cfb.Summary=parse_PropertySetStream(SI,SummaryPIDSI)}catch(e){}}var XLSBRecordEnum={0:{n:\"BrtRowHdr\",f:parse_BrtRowHdr},1:{n:\"BrtCellBlank\",f:parse_BrtCellBlank},2:{n:\"BrtCellRk\",f:parse_BrtCellRk},3:{n:\"BrtCellError\",f:parse_BrtCellError},4:{n:\"BrtCellBool\",f:parse_BrtCellBool},5:{n:\"BrtCellReal\",f:parse_BrtCellReal},6:{n:\"BrtCellSt\",f:parse_BrtCellSt},7:{n:\"BrtCellIsst\",f:parse_BrtCellIsst},8:{n:\"BrtFmlaString\",f:parse_BrtFmlaString},9:{n:\"BrtFmlaNum\",f:parse_BrtFmlaNum},10:{n:\"BrtFmlaBool\",f:parse_BrtFmlaBool},11:{n:\"BrtFmlaError\",f:parse_BrtFmlaError},16:{n:\"BrtFRTArchID$\",f:parse_BrtFRTArchID$},19:{n:\"BrtSSTItem\",f:parse_RichStr},20:{n:\"BrtPCDIMissing\",f:parsenoop},21:{n:\"BrtPCDINumber\",f:parsenoop},22:{n:\"BrtPCDIBoolean\",f:parsenoop},23:{n:\"BrtPCDIError\",f:parsenoop},24:{n:\"BrtPCDIString\",f:parsenoop},25:{n:\"BrtPCDIDatetime\",f:parsenoop},26:{n:\"BrtPCDIIndex\",f:parsenoop},27:{n:\"BrtPCDIAMissing\",f:parsenoop},28:{n:\"BrtPCDIANumber\",f:parsenoop},29:{n:\"BrtPCDIABoolean\",f:parsenoop},30:{n:\"BrtPCDIAError\",f:parsenoop},31:{n:\"BrtPCDIAString\",f:parsenoop},32:{n:\"BrtPCDIADatetime\",f:parsenoop},33:{n:\"BrtPCRRecord\",f:parsenoop},34:{n:\"BrtPCRRecordDt\",f:parsenoop},35:{n:\"BrtFRTBegin\",f:parsenoop},36:{n:\"BrtFRTEnd\",f:parsenoop},37:{n:\"BrtACBegin\",f:parsenoop},38:{n:\"BrtACEnd\",f:parsenoop},39:{n:\"BrtName\",f:parsenoop},40:{n:\"BrtIndexRowBlock\",f:parsenoop},42:{n:\"BrtIndexBlock\",f:parsenoop},43:{n:\"BrtFont\",f:parse_BrtFont},44:{n:\"BrtFmt\",f:parse_BrtFmt},45:{n:\"BrtFill\",f:parsenoop},46:{n:\"BrtBorder\",f:parsenoop},47:{n:\"BrtXF\",f:parse_BrtXF},48:{n:\"BrtStyle\",f:parsenoop},49:{n:\"BrtCellMeta\",f:parsenoop},50:{n:\"BrtValueMeta\",f:parsenoop},51:{n:\"BrtMdb\",f:parsenoop},52:{n:\"BrtBeginFmd\",f:parsenoop},53:{n:\"BrtEndFmd\",f:parsenoop},54:{n:\"BrtBeginMdx\",f:parsenoop},55:{n:\"BrtEndMdx\",f:parsenoop},56:{n:\"BrtBeginMdxTuple\",f:parsenoop},57:{n:\"BrtEndMdxTuple\",f:parsenoop},58:{n:\"BrtMdxMbrIstr\",f:parsenoop},59:{n:\"BrtStr\",f:parsenoop},60:{n:\"BrtColInfo\",f:parsenoop},62:{n:\"BrtCellRString\",f:parsenoop},63:{n:\"BrtCalcChainItem$\",f:parse_BrtCalcChainItem$},64:{n:\"BrtDVal\",f:parsenoop},65:{n:\"BrtSxvcellNum\",f:parsenoop},66:{n:\"BrtSxvcellStr\",f:parsenoop},67:{n:\"BrtSxvcellBool\",f:parsenoop},68:{n:\"BrtSxvcellErr\",f:parsenoop},69:{n:\"BrtSxvcellDate\",f:parsenoop},70:{n:\"BrtSxvcellNil\",f:parsenoop},128:{n:\"BrtFileVersion\",f:parsenoop},129:{n:\"BrtBeginSheet\",f:parsenoop},130:{n:\"BrtEndSheet\",f:parsenoop},131:{n:\"BrtBeginBook\",f:parsenoop,p:0},132:{n:\"BrtEndBook\",f:parsenoop},133:{n:\"BrtBeginWsViews\",f:parsenoop},134:{n:\"BrtEndWsViews\",f:parsenoop},135:{n:\"BrtBeginBookViews\",f:parsenoop},136:{n:\"BrtEndBookViews\",f:parsenoop},137:{n:\"BrtBeginWsView\",f:parsenoop},138:{n:\"BrtEndWsView\",f:parsenoop},139:{n:\"BrtBeginCsViews\",f:parsenoop},140:{n:\"BrtEndCsViews\",f:parsenoop},141:{n:\"BrtBeginCsView\",f:parsenoop},142:{n:\"BrtEndCsView\",f:parsenoop},143:{n:\"BrtBeginBundleShs\",f:parsenoop},144:{n:\"BrtEndBundleShs\",f:parsenoop},145:{n:\"BrtBeginSheetData\",f:parsenoop},146:{n:\"BrtEndSheetData\",f:parsenoop},147:{n:\"BrtWsProp\",f:parse_BrtWsProp},148:{n:\"BrtWsDim\",f:parse_BrtWsDim,p:16},151:{n:\"BrtPane\",f:parsenoop},152:{n:\"BrtSel\",f:parsenoop},153:{n:\"BrtWbProp\",f:parse_BrtWbProp},154:{n:\"BrtWbFactoid\",f:parsenoop},155:{n:\"BrtFileRecover\",f:parsenoop\n},156:{n:\"BrtBundleSh\",f:parse_BrtBundleSh},157:{n:\"BrtCalcProp\",f:parsenoop},158:{n:\"BrtBookView\",f:parsenoop},159:{n:\"BrtBeginSst\",f:parse_BrtBeginSst},160:{n:\"BrtEndSst\",f:parsenoop},161:{n:\"BrtBeginAFilter\",f:parsenoop},162:{n:\"BrtEndAFilter\",f:parsenoop},163:{n:\"BrtBeginFilterColumn\",f:parsenoop},164:{n:\"BrtEndFilterColumn\",f:parsenoop},165:{n:\"BrtBeginFilters\",f:parsenoop},166:{n:\"BrtEndFilters\",f:parsenoop},167:{n:\"BrtFilter\",f:parsenoop},168:{n:\"BrtColorFilter\",f:parsenoop},169:{n:\"BrtIconFilter\",f:parsenoop},170:{n:\"BrtTop10Filter\",f:parsenoop},171:{n:\"BrtDynamicFilter\",f:parsenoop},172:{n:\"BrtBeginCustomFilters\",f:parsenoop},173:{n:\"BrtEndCustomFilters\",f:parsenoop},174:{n:\"BrtCustomFilter\",f:parsenoop},175:{n:\"BrtAFilterDateGroupItem\",f:parsenoop},176:{n:\"BrtMergeCell\",f:parse_BrtMergeCell},177:{n:\"BrtBeginMergeCells\",f:parsenoop},178:{n:\"BrtEndMergeCells\",f:parsenoop},179:{n:\"BrtBeginPivotCacheDef\",f:parsenoop},180:{n:\"BrtEndPivotCacheDef\",f:parsenoop},181:{n:\"BrtBeginPCDFields\",f:parsenoop},182:{n:\"BrtEndPCDFields\",f:parsenoop},183:{n:\"BrtBeginPCDField\",f:parsenoop},184:{n:\"BrtEndPCDField\",f:parsenoop},185:{n:\"BrtBeginPCDSource\",f:parsenoop},186:{n:\"BrtEndPCDSource\",f:parsenoop},187:{n:\"BrtBeginPCDSRange\",f:parsenoop},188:{n:\"BrtEndPCDSRange\",f:parsenoop},189:{n:\"BrtBeginPCDFAtbl\",f:parsenoop},190:{n:\"BrtEndPCDFAtbl\",f:parsenoop},191:{n:\"BrtBeginPCDIRun\",f:parsenoop},192:{n:\"BrtEndPCDIRun\",f:parsenoop},193:{n:\"BrtBeginPivotCacheRecords\",f:parsenoop},194:{n:\"BrtEndPivotCacheRecords\",f:parsenoop},195:{n:\"BrtBeginPCDHierarchies\",f:parsenoop},196:{n:\"BrtEndPCDHierarchies\",f:parsenoop},197:{n:\"BrtBeginPCDHierarchy\",f:parsenoop},198:{n:\"BrtEndPCDHierarchy\",f:parsenoop},199:{n:\"BrtBeginPCDHFieldsUsage\",f:parsenoop},200:{n:\"BrtEndPCDHFieldsUsage\",f:parsenoop},201:{n:\"BrtBeginExtConnection\",f:parsenoop},202:{n:\"BrtEndExtConnection\",f:parsenoop},203:{n:\"BrtBeginECDbProps\",f:parsenoop},204:{n:\"BrtEndECDbProps\",f:parsenoop},205:{n:\"BrtBeginECOlapProps\",f:parsenoop},206:{n:\"BrtEndECOlapProps\",f:parsenoop},207:{n:\"BrtBeginPCDSConsol\",f:parsenoop},208:{n:\"BrtEndPCDSConsol\",f:parsenoop},209:{n:\"BrtBeginPCDSCPages\",f:parsenoop},210:{n:\"BrtEndPCDSCPages\",f:parsenoop},211:{n:\"BrtBeginPCDSCPage\",f:parsenoop},212:{n:\"BrtEndPCDSCPage\",f:parsenoop},213:{n:\"BrtBeginPCDSCPItem\",f:parsenoop},214:{n:\"BrtEndPCDSCPItem\",f:parsenoop},215:{n:\"BrtBeginPCDSCSets\",f:parsenoop},216:{n:\"BrtEndPCDSCSets\",f:parsenoop},217:{n:\"BrtBeginPCDSCSet\",f:parsenoop},218:{n:\"BrtEndPCDSCSet\",f:parsenoop},219:{n:\"BrtBeginPCDFGroup\",f:parsenoop},220:{n:\"BrtEndPCDFGroup\",f:parsenoop},221:{n:\"BrtBeginPCDFGItems\",f:parsenoop},222:{n:\"BrtEndPCDFGItems\",f:parsenoop},223:{n:\"BrtBeginPCDFGRange\",f:parsenoop},224:{n:\"BrtEndPCDFGRange\",f:parsenoop},225:{n:\"BrtBeginPCDFGDiscrete\",f:parsenoop},226:{n:\"BrtEndPCDFGDiscrete\",f:parsenoop},227:{n:\"BrtBeginPCDSDTupleCache\",f:parsenoop},228:{n:\"BrtEndPCDSDTupleCache\",f:parsenoop},229:{n:\"BrtBeginPCDSDTCEntries\",f:parsenoop},230:{n:\"BrtEndPCDSDTCEntries\",f:parsenoop},231:{n:\"BrtBeginPCDSDTCEMembers\",f:parsenoop},232:{n:\"BrtEndPCDSDTCEMembers\",f:parsenoop},233:{n:\"BrtBeginPCDSDTCEMember\",f:parsenoop},234:{n:\"BrtEndPCDSDTCEMember\",f:parsenoop},235:{n:\"BrtBeginPCDSDTCQueries\",f:parsenoop},236:{n:\"BrtEndPCDSDTCQueries\",f:parsenoop},237:{n:\"BrtBeginPCDSDTCQuery\",f:parsenoop},238:{n:\"BrtEndPCDSDTCQuery\",f:parsenoop},239:{n:\"BrtBeginPCDSDTCSets\",f:parsenoop},240:{n:\"BrtEndPCDSDTCSets\",f:parsenoop},241:{n:\"BrtBeginPCDSDTCSet\",f:parsenoop},242:{n:\"BrtEndPCDSDTCSet\",f:parsenoop},243:{n:\"BrtBeginPCDCalcItems\",f:parsenoop},244:{n:\"BrtEndPCDCalcItems\",f:parsenoop},245:{n:\"BrtBeginPCDCalcItem\",f:parsenoop},246:{n:\"BrtEndPCDCalcItem\",f:parsenoop},247:{n:\"BrtBeginPRule\",f:parsenoop},248:{n:\"BrtEndPRule\",f:parsenoop},249:{n:\"BrtBeginPRFilters\",f:parsenoop},250:{n:\"BrtEndPRFilters\",f:parsenoop},251:{n:\"BrtBeginPRFilter\",f:parsenoop},252:{n:\"BrtEndPRFilter\",f:parsenoop},253:{n:\"BrtBeginPNames\",f:parsenoop},254:{n:\"BrtEndPNames\",f:parsenoop},255:{n:\"BrtBeginPName\",f:parsenoop},256:{n:\"BrtEndPName\",f:parsenoop},257:{n:\"BrtBeginPNPairs\",f:parsenoop},258:{n:\"BrtEndPNPairs\",f:parsenoop},259:{n:\"BrtBeginPNPair\",f:parsenoop},260:{n:\"BrtEndPNPair\",f:parsenoop},261:{n:\"BrtBeginECWebProps\",f:parsenoop},262:{n:\"BrtEndECWebProps\",f:parsenoop},263:{n:\"BrtBeginEcWpTables\",f:parsenoop},264:{n:\"BrtEndECWPTables\",f:parsenoop},265:{n:\"BrtBeginECParams\",f:parsenoop},266:{n:\"BrtEndECParams\",f:parsenoop},267:{n:\"BrtBeginECParam\",f:parsenoop},268:{n:\"BrtEndECParam\",f:parsenoop},269:{n:\"BrtBeginPCDKPIs\",f:parsenoop},270:{n:\"BrtEndPCDKPIs\",f:parsenoop},271:{n:\"BrtBeginPCDKPI\",f:parsenoop},272:{n:\"BrtEndPCDKPI\",f:parsenoop},273:{n:\"BrtBeginDims\",f:parsenoop},274:{n:\"BrtEndDims\",f:parsenoop},275:{n:\"BrtBeginDim\",f:parsenoop},276:{n:\"BrtEndDim\",f:parsenoop},277:{n:\"BrtIndexPartEnd\",f:parsenoop},278:{n:\"BrtBeginStyleSheet\",f:parsenoop},279:{n:\"BrtEndStyleSheet\",f:parsenoop},280:{n:\"BrtBeginSXView\",f:parsenoop},281:{n:\"BrtEndSXVI\",f:parsenoop},282:{n:\"BrtBeginSXVI\",f:parsenoop},283:{n:\"BrtBeginSXVIs\",f:parsenoop},284:{n:\"BrtEndSXVIs\",f:parsenoop},285:{n:\"BrtBeginSXVD\",f:parsenoop},286:{n:\"BrtEndSXVD\",f:parsenoop},287:{n:\"BrtBeginSXVDs\",f:parsenoop},288:{n:\"BrtEndSXVDs\",f:parsenoop},289:{n:\"BrtBeginSXPI\",f:parsenoop},290:{n:\"BrtEndSXPI\",f:parsenoop},291:{n:\"BrtBeginSXPIs\",f:parsenoop},292:{n:\"BrtEndSXPIs\",f:parsenoop},293:{n:\"BrtBeginSXDI\",f:parsenoop},294:{n:\"BrtEndSXDI\",f:parsenoop},295:{n:\"BrtBeginSXDIs\",f:parsenoop},296:{n:\"BrtEndSXDIs\",f:parsenoop},297:{n:\"BrtBeginSXLI\",f:parsenoop},298:{n:\"BrtEndSXLI\",f:parsenoop},299:{n:\"BrtBeginSXLIRws\",f:parsenoop},300:{n:\"BrtEndSXLIRws\",f:parsenoop},301:{n:\"BrtBeginSXLICols\",f:parsenoop},302:{n:\"BrtEndSXLICols\",f:parsenoop},303:{n:\"BrtBeginSXFormat\",f:parsenoop},304:{n:\"BrtEndSXFormat\",f:parsenoop},305:{n:\"BrtBeginSXFormats\",f:parsenoop},306:{n:\"BrtEndSxFormats\",f:parsenoop},307:{n:\"BrtBeginSxSelect\",f:parsenoop},308:{n:\"BrtEndSxSelect\",f:parsenoop},309:{n:\"BrtBeginISXVDRws\",f:parsenoop},310:{n:\"BrtEndISXVDRws\",f:parsenoop},311:{n:\"BrtBeginISXVDCols\",f:parsenoop},312:{n:\"BrtEndISXVDCols\",f:parsenoop},313:{n:\"BrtEndSXLocation\",f:parsenoop},314:{n:\"BrtBeginSXLocation\",f:parsenoop},315:{n:\"BrtEndSXView\",f:parsenoop},316:{n:\"BrtBeginSXTHs\",f:parsenoop},317:{n:\"BrtEndSXTHs\",f:parsenoop},318:{n:\"BrtBeginSXTH\",f:parsenoop},319:{n:\"BrtEndSXTH\",f:parsenoop},320:{n:\"BrtBeginISXTHRws\",f:parsenoop},321:{n:\"BrtEndISXTHRws\",f:parsenoop},322:{n:\"BrtBeginISXTHCols\",f:parsenoop},323:{n:\"BrtEndISXTHCols\",f:parsenoop},324:{n:\"BrtBeginSXTDMPS\",f:parsenoop},325:{n:\"BrtEndSXTDMPs\",f:parsenoop},326:{n:\"BrtBeginSXTDMP\",f:parsenoop},327:{n:\"BrtEndSXTDMP\",f:parsenoop},328:{n:\"BrtBeginSXTHItems\",f:parsenoop},329:{n:\"BrtEndSXTHItems\",f:parsenoop},330:{n:\"BrtBeginSXTHItem\",f:parsenoop},331:{n:\"BrtEndSXTHItem\",f:parsenoop},332:{n:\"BrtBeginMetadata\",f:parsenoop},333:{n:\"BrtEndMetadata\",f:parsenoop},334:{n:\"BrtBeginEsmdtinfo\",f:parsenoop},335:{n:\"BrtMdtinfo\",f:parsenoop},336:{n:\"BrtEndEsmdtinfo\",f:parsenoop},337:{n:\"BrtBeginEsmdb\",f:parsenoop},338:{n:\"BrtEndEsmdb\",f:parsenoop},339:{n:\"BrtBeginEsfmd\",f:parsenoop},340:{n:\"BrtEndEsfmd\",f:parsenoop},341:{n:\"BrtBeginSingleCells\",f:parsenoop},342:{n:\"BrtEndSingleCells\",f:parsenoop},343:{n:\"BrtBeginList\",f:parsenoop},344:{n:\"BrtEndList\",f:parsenoop},345:{n:\"BrtBeginListCols\",f:parsenoop},346:{n:\"BrtEndListCols\",f:parsenoop},347:{n:\"BrtBeginListCol\",f:parsenoop},348:{n:\"BrtEndListCol\",f:parsenoop},349:{n:\"BrtBeginListXmlCPr\",f:parsenoop},350:{n:\"BrtEndListXmlCPr\",f:parsenoop},351:{n:\"BrtListCCFmla\",f:parsenoop},352:{n:\"BrtListTrFmla\",f:parsenoop},353:{n:\"BrtBeginExternals\",f:parsenoop},354:{n:\"BrtEndExternals\",f:parsenoop},355:{n:\"BrtSupBookSrc\",f:parsenoop},357:{n:\"BrtSupSelf\",f:parsenoop},358:{n:\"BrtSupSame\",f:parsenoop},359:{n:\"BrtSupTabs\",f:parsenoop},360:{n:\"BrtBeginSupBook\",f:parsenoop},361:{n:\"BrtPlaceholderName\",f:parsenoop},362:{n:\"BrtExternSheet\",f:parsenoop},363:{n:\"BrtExternTableStart\",f:parsenoop},364:{n:\"BrtExternTableEnd\",f:parsenoop},366:{n:\"BrtExternRowHdr\",f:parsenoop},367:{n:\"BrtExternCellBlank\",f:parsenoop},368:{n:\"BrtExternCellReal\",f:parsenoop},369:{n:\"BrtExternCellBool\",f:parsenoop},370:{n:\"BrtExternCellError\",f:parsenoop},371:{n:\"BrtExternCellString\",f:parsenoop},372:{n:\"BrtBeginEsmdx\",f:parsenoop},373:{n:\"BrtEndEsmdx\",f:parsenoop},374:{n:\"BrtBeginMdxSet\",f:parsenoop},375:{n:\"BrtEndMdxSet\",f:parsenoop},376:{n:\"BrtBeginMdxMbrProp\",f:parsenoop},377:{n:\"BrtEndMdxMbrProp\",f:parsenoop},378:{n:\"BrtBeginMdxKPI\",f:parsenoop},379:{n:\"BrtEndMdxKPI\",f:parsenoop},380:{n:\"BrtBeginEsstr\",f:parsenoop},381:{n:\"BrtEndEsstr\",f:parsenoop},382:{n:\"BrtBeginPRFItem\",f:parsenoop},383:{n:\"BrtEndPRFItem\",f:parsenoop},384:{n:\"BrtBeginPivotCacheIDs\",f:parsenoop},385:{n:\"BrtEndPivotCacheIDs\",f:parsenoop},386:{n:\"BrtBeginPivotCacheID\",f:parsenoop},387:{n:\"BrtEndPivotCacheID\",f:parsenoop},388:{n:\"BrtBeginISXVIs\",f:parsenoop},389:{n:\"BrtEndISXVIs\",f:parsenoop},390:{n:\"BrtBeginColInfos\",f:parsenoop},391:{n:\"BrtEndColInfos\",f:parsenoop},392:{n:\"BrtBeginRwBrk\",f:parsenoop},393:{n:\"BrtEndRwBrk\",f:parsenoop},394:{n:\"BrtBeginColBrk\",f:parsenoop},395:{n:\"BrtEndColBrk\",f:parsenoop},396:{n:\"BrtBrk\",f:parsenoop},397:{n:\"BrtUserBookView\",f:parsenoop},398:{n:\"BrtInfo\",f:parsenoop},399:{n:\"BrtCUsr\",f:parsenoop},400:{n:\"BrtUsr\",f:parsenoop},401:{n:\"BrtBeginUsers\",f:parsenoop},403:{n:\"BrtEOF\",f:parsenoop},404:{n:\"BrtUCR\",f:parsenoop},405:{n:\"BrtRRInsDel\",f:parsenoop},406:{n:\"BrtRREndInsDel\",f:parsenoop},407:{n:\"BrtRRMove\",f:parsenoop},408:{n:\"BrtRREndMove\",f:parsenoop},409:{n:\"BrtRRChgCell\",f:parsenoop},410:{n:\"BrtRREndChgCell\",f:parsenoop},411:{n:\"BrtRRHeader\",f:parsenoop},412:{n:\"BrtRRUserView\",f:parsenoop},413:{n:\"BrtRRRenSheet\",f:parsenoop},414:{n:\"BrtRRInsertSh\",f:parsenoop},415:{n:\"BrtRRDefName\",f:parsenoop},416:{n:\"BrtRRNote\",f:parsenoop},417:{n:\"BrtRRConflict\",f:parsenoop},418:{n:\"BrtRRTQSIF\",f:parsenoop},419:{n:\"BrtRRFormat\",f:parsenoop},420:{n:\"BrtRREndFormat\",f:parsenoop},421:{n:\"BrtRRAutoFmt\",f:parsenoop},422:{n:\"BrtBeginUserShViews\",f:parsenoop},423:{n:\"BrtBeginUserShView\",f:parsenoop},424:{n:\"BrtEndUserShView\",f:parsenoop},425:{n:\"BrtEndUserShViews\",f:parsenoop},426:{n:\"BrtArrFmla\",f:parsenoop},427:{n:\"BrtShrFmla\",f:parsenoop},428:{n:\"BrtTable\",f:parsenoop},429:{n:\"BrtBeginExtConnections\",f:parsenoop},430:{n:\"BrtEndExtConnections\",f:parsenoop},431:{n:\"BrtBeginPCDCalcMems\",f:parsenoop},432:{n:\"BrtEndPCDCalcMems\",f:parsenoop},433:{n:\"BrtBeginPCDCalcMem\",f:parsenoop},434:{n:\"BrtEndPCDCalcMem\",f:parsenoop},435:{n:\"BrtBeginPCDHGLevels\",f:parsenoop},436:{n:\"BrtEndPCDHGLevels\",f:parsenoop},437:{n:\"BrtBeginPCDHGLevel\",f:parsenoop},438:{n:\"BrtEndPCDHGLevel\",f:parsenoop},439:{n:\"BrtBeginPCDHGLGroups\",f:parsenoop},440:{n:\"BrtEndPCDHGLGroups\",f:parsenoop},441:{n:\"BrtBeginPCDHGLGroup\",f:parsenoop},442:{n:\"BrtEndPCDHGLGroup\",f:parsenoop},443:{n:\"BrtBeginPCDHGLGMembers\",f:parsenoop},444:{n:\"BrtEndPCDHGLGMembers\",f:parsenoop},445:{n:\"BrtBeginPCDHGLGMember\",f:parsenoop},446:{n:\"BrtEndPCDHGLGMember\",f:parsenoop},447:{n:\"BrtBeginQSI\",f:parsenoop},448:{n:\"BrtEndQSI\",f:parsenoop},449:{n:\"BrtBeginQSIR\",f:parsenoop},450:{n:\"BrtEndQSIR\",f:parsenoop},451:{n:\"BrtBeginDeletedNames\",f:parsenoop},452:{n:\"BrtEndDeletedNames\",f:parsenoop},453:{n:\"BrtBeginDeletedName\",f:parsenoop},454:{n:\"BrtEndDeletedName\",f:parsenoop},455:{n:\"BrtBeginQSIFs\",f:parsenoop},456:{n:\"BrtEndQSIFs\",f:parsenoop},457:{n:\"BrtBeginQSIF\",f:parsenoop},458:{n:\"BrtEndQSIF\",f:parsenoop},459:{n:\"BrtBeginAutoSortScope\",f:parsenoop},460:{n:\"BrtEndAutoSortScope\",f:parsenoop},461:{n:\"BrtBeginConditionalFormatting\",f:parsenoop},462:{n:\"BrtEndConditionalFormatting\",f:parsenoop},463:{n:\"BrtBeginCFRule\",f:parsenoop},464:{n:\"BrtEndCFRule\",f:parsenoop},465:{n:\"BrtBeginIconSet\",f:parsenoop},466:{n:\"BrtEndIconSet\",f:parsenoop},467:{n:\"BrtBeginDatabar\",f:parsenoop},468:{n:\"BrtEndDatabar\",f:parsenoop},469:{n:\"BrtBeginColorScale\",f:parsenoop},470:{n:\"BrtEndColorScale\",f:parsenoop},471:{n:\"BrtCFVO\",f:parsenoop},472:{n:\"BrtExternValueMeta\",f:parsenoop},473:{n:\"BrtBeginColorPalette\",f:parsenoop},474:{n:\"BrtEndColorPalette\",f:parsenoop},475:{n:\"BrtIndexedColor\",f:parsenoop},476:{n:\"BrtMargins\",f:parsenoop},477:{n:\"BrtPrintOptions\",f:parsenoop},478:{n:\"BrtPageSetup\",f:parsenoop},479:{n:\"BrtBeginHeaderFooter\",f:parsenoop},480:{n:\"BrtEndHeaderFooter\",f:parsenoop},481:{n:\"BrtBeginSXCrtFormat\",f:parsenoop},482:{n:\"BrtEndSXCrtFormat\",f:parsenoop},483:{n:\"BrtBeginSXCrtFormats\",f:parsenoop},484:{n:\"BrtEndSXCrtFormats\",f:parsenoop},485:{n:\"BrtWsFmtInfo\",f:parsenoop},486:{n:\"BrtBeginMgs\",f:parsenoop},487:{n:\"BrtEndMGs\",f:parsenoop},488:{n:\"BrtBeginMGMaps\",f:parsenoop},489:{n:\"BrtEndMGMaps\",f:parsenoop},490:{n:\"BrtBeginMG\",f:parsenoop},491:{n:\"BrtEndMG\",f:parsenoop},492:{n:\"BrtBeginMap\",f:parsenoop},493:{n:\"BrtEndMap\",f:parsenoop},494:{n:\"BrtHLink\",f:parse_BrtHLink},495:{n:\"BrtBeginDCon\",f:parsenoop},496:{n:\"BrtEndDCon\",f:parsenoop},497:{n:\"BrtBeginDRefs\",f:parsenoop},498:{n:\"BrtEndDRefs\",f:parsenoop},499:{n:\"BrtDRef\",f:parsenoop},500:{n:\"BrtBeginScenMan\",f:parsenoop},501:{n:\"BrtEndScenMan\",f:parsenoop},502:{n:\"BrtBeginSct\",f:parsenoop},503:{n:\"BrtEndSct\",f:parsenoop},504:{n:\"BrtSlc\",f:parsenoop},505:{n:\"BrtBeginDXFs\",f:parsenoop},506:{n:\"BrtEndDXFs\",f:parsenoop},507:{n:\"BrtDXF\",f:parsenoop},508:{n:\"BrtBeginTableStyles\",f:parsenoop},509:{n:\"BrtEndTableStyles\",f:parsenoop},510:{n:\"BrtBeginTableStyle\",f:parsenoop},511:{n:\"BrtEndTableStyle\",f:parsenoop},512:{n:\"BrtTableStyleElement\",f:parsenoop},513:{n:\"BrtTableStyleClient\",f:parsenoop},514:{n:\"BrtBeginVolDeps\",f:parsenoop},515:{n:\"BrtEndVolDeps\",f:parsenoop},516:{n:\"BrtBeginVolType\",f:parsenoop},517:{n:\"BrtEndVolType\",f:parsenoop},518:{n:\"BrtBeginVolMain\",f:parsenoop},519:{n:\"BrtEndVolMain\",f:parsenoop},520:{n:\"BrtBeginVolTopic\",f:parsenoop},521:{n:\"BrtEndVolTopic\",f:parsenoop},522:{n:\"BrtVolSubtopic\",f:parsenoop},523:{n:\"BrtVolRef\",f:parsenoop},524:{n:\"BrtVolNum\",f:parsenoop},525:{n:\"BrtVolErr\",f:parsenoop},526:{n:\"BrtVolStr\",f:parsenoop},527:{n:\"BrtVolBool\",f:parsenoop},528:{n:\"BrtBeginCalcChain$\",f:parsenoop},529:{n:\"BrtEndCalcChain$\",f:parsenoop},530:{n:\"BrtBeginSortState\",f:parsenoop},531:{n:\"BrtEndSortState\",f:parsenoop},532:{n:\"BrtBeginSortCond\",f:parsenoop},533:{n:\"BrtEndSortCond\",f:parsenoop},534:{n:\"BrtBookProtection\",f:parsenoop},535:{n:\"BrtSheetProtection\",f:parsenoop},536:{n:\"BrtRangeProtection\",f:parsenoop},537:{n:\"BrtPhoneticInfo\",f:parsenoop},538:{n:\"BrtBeginECTxtWiz\",f:parsenoop},539:{n:\"BrtEndECTxtWiz\",f:parsenoop},540:{n:\"BrtBeginECTWFldInfoLst\",f:parsenoop},541:{n:\"BrtEndECTWFldInfoLst\",f:parsenoop},542:{n:\"BrtBeginECTwFldInfo\",f:parsenoop},548:{n:\"BrtFileSharing\",f:parsenoop},549:{n:\"BrtOleSize\",f:parsenoop},550:{n:\"BrtDrawing\",f:parsenoop},551:{n:\"BrtLegacyDrawing\",f:parsenoop},552:{n:\"BrtLegacyDrawingHF\",f:parsenoop},553:{n:\"BrtWebOpt\",f:parsenoop},554:{n:\"BrtBeginWebPubItems\",f:parsenoop},555:{n:\"BrtEndWebPubItems\",f:parsenoop},556:{n:\"BrtBeginWebPubItem\",f:parsenoop},557:{n:\"BrtEndWebPubItem\",f:parsenoop},558:{n:\"BrtBeginSXCondFmt\",f:parsenoop},559:{n:\"BrtEndSXCondFmt\",f:parsenoop},560:{n:\"BrtBeginSXCondFmts\",f:parsenoop},561:{n:\"BrtEndSXCondFmts\",f:parsenoop},562:{n:\"BrtBkHim\",f:parsenoop},564:{n:\"BrtColor\",f:parsenoop},565:{n:\"BrtBeginIndexedColors\",f:parsenoop},566:{n:\"BrtEndIndexedColors\",f:parsenoop},569:{n:\"BrtBeginMRUColors\",f:parsenoop},570:{n:\"BrtEndMRUColors\",f:parsenoop},572:{n:\"BrtMRUColor\",f:parsenoop},573:{n:\"BrtBeginDVals\",f:parsenoop},574:{n:\"BrtEndDVals\",f:parsenoop},577:{n:\"BrtSupNameStart\",f:parsenoop},578:{n:\"BrtSupNameValueStart\",f:parsenoop},579:{n:\"BrtSupNameValueEnd\",f:parsenoop},580:{n:\"BrtSupNameNum\",f:parsenoop},581:{n:\"BrtSupNameErr\",f:parsenoop},582:{n:\"BrtSupNameSt\",f:parsenoop},583:{n:\"BrtSupNameNil\",f:parsenoop},584:{n:\"BrtSupNameBool\",f:parsenoop},585:{n:\"BrtSupNameFmla\",f:parsenoop},586:{n:\"BrtSupNameBits\",f:parsenoop},587:{n:\"BrtSupNameEnd\",f:parsenoop},588:{n:\"BrtEndSupBook\",f:parsenoop},589:{n:\"BrtCellSmartTagProperty\",f:parsenoop},590:{n:\"BrtBeginCellSmartTag\",f:parsenoop},591:{n:\"BrtEndCellSmartTag\",f:parsenoop},592:{n:\"BrtBeginCellSmartTags\",f:parsenoop},593:{n:\"BrtEndCellSmartTags\",f:parsenoop},594:{n:\"BrtBeginSmartTags\",f:parsenoop},595:{n:\"BrtEndSmartTags\",f:parsenoop},596:{n:\"BrtSmartTagType\",f:parsenoop},597:{n:\"BrtBeginSmartTagTypes\",f:parsenoop},598:{n:\"BrtEndSmartTagTypes\",f:parsenoop},599:{n:\"BrtBeginSXFilters\",f:parsenoop},600:{n:\"BrtEndSXFilters\",f:parsenoop},601:{n:\"BrtBeginSXFILTER\",f:parsenoop},602:{n:\"BrtEndSXFilter\",f:parsenoop},603:{n:\"BrtBeginFills\",f:parsenoop},604:{n:\"BrtEndFills\",f:parsenoop},605:{n:\"BrtBeginCellWatches\",f:parsenoop},606:{n:\"BrtEndCellWatches\",f:parsenoop},607:{n:\"BrtCellWatch\",f:parsenoop},608:{n:\"BrtBeginCRErrs\",f:parsenoop},609:{n:\"BrtEndCRErrs\",f:parsenoop},610:{n:\"BrtCrashRecErr\",f:parsenoop},611:{n:\"BrtBeginFonts\",f:parsenoop},612:{n:\"BrtEndFonts\",f:parsenoop},613:{n:\"BrtBeginBorders\",f:parsenoop},614:{n:\"BrtEndBorders\",f:parsenoop},615:{n:\"BrtBeginFmts\",f:parsenoop},616:{n:\"BrtEndFmts\",f:parsenoop},617:{n:\"BrtBeginCellXFs\",f:parsenoop},618:{n:\"BrtEndCellXFs\",f:parsenoop},619:{n:\"BrtBeginStyles\",f:parsenoop},620:{n:\"BrtEndStyles\",f:parsenoop},625:{n:\"BrtBigName\",f:parsenoop},626:{n:\"BrtBeginCellStyleXFs\",f:parsenoop},627:{n:\"BrtEndCellStyleXFs\",f:parsenoop},628:{n:\"BrtBeginComments\",f:parsenoop},629:{n:\"BrtEndComments\",f:parsenoop},630:{n:\"BrtBeginCommentAuthors\",f:parsenoop},631:{n:\"BrtEndCommentAuthors\",f:parsenoop},632:{n:\"BrtCommentAuthor\",f:parse_BrtCommentAuthor},633:{n:\"BrtBeginCommentList\",f:parsenoop},634:{n:\"BrtEndCommentList\",f:parsenoop},635:{n:\"BrtBeginComment\",f:parse_BrtBeginComment},636:{n:\"BrtEndComment\",f:parsenoop},637:{n:\"BrtCommentText\",f:parse_BrtCommentText},638:{n:\"BrtBeginOleObjects\",f:parsenoop},639:{n:\"BrtOleObject\",f:parsenoop},640:{n:\"BrtEndOleObjects\",f:parsenoop},641:{n:\"BrtBeginSxrules\",f:parsenoop},642:{n:\"BrtEndSxRules\",f:parsenoop},643:{n:\"BrtBeginActiveXControls\",f:parsenoop},644:{n:\"BrtActiveX\",f:parsenoop},645:{n:\"BrtEndActiveXControls\",f:parsenoop},646:{n:\"BrtBeginPCDSDTCEMembersSortBy\",f:parsenoop},648:{n:\"BrtBeginCellIgnoreECs\",f:parsenoop},649:{n:\"BrtCellIgnoreEC\",f:parsenoop},650:{n:\"BrtEndCellIgnoreECs\",f:parsenoop},651:{n:\"BrtCsProp\",f:parsenoop},652:{n:\"BrtCsPageSetup\",f:parsenoop},653:{n:\"BrtBeginUserCsViews\",f:parsenoop},654:{n:\"BrtEndUserCsViews\",f:parsenoop},655:{n:\"BrtBeginUserCsView\",f:parsenoop},656:{n:\"BrtEndUserCsView\",f:parsenoop},657:{n:\"BrtBeginPcdSFCIEntries\",f:parsenoop},658:{n:\"BrtEndPCDSFCIEntries\",f:parsenoop},659:{n:\"BrtPCDSFCIEntry\",f:parsenoop},660:{n:\"BrtBeginListParts\",f:parsenoop},661:{n:\"BrtListPart\",f:parsenoop},662:{n:\"BrtEndListParts\",f:parsenoop},663:{n:\"BrtSheetCalcProp\",f:parsenoop},664:{n:\"BrtBeginFnGroup\",f:parsenoop},665:{n:\"BrtFnGroup\",f:parsenoop},666:{n:\"BrtEndFnGroup\",f:parsenoop},667:{n:\"BrtSupAddin\",f:parsenoop},668:{n:\"BrtSXTDMPOrder\",f:parsenoop},669:{n:\"BrtCsProtection\",f:parsenoop},671:{n:\"BrtBeginWsSortMap\",f:parsenoop},672:{n:\"BrtEndWsSortMap\",f:parsenoop},673:{n:\"BrtBeginRRSort\",f:parsenoop},674:{n:\"BrtEndRRSort\",f:parsenoop},675:{n:\"BrtRRSortItem\",f:parsenoop},676:{n:\"BrtFileSharingIso\",f:parsenoop},677:{n:\"BrtBookProtectionIso\",f:parsenoop},678:{n:\"BrtSheetProtectionIso\",f:parsenoop},679:{n:\"BrtCsProtectionIso\",f:parsenoop},680:{n:\"BrtRangeProtectionIso\",f:parsenoop},1024:{n:\"BrtRwDescent\",f:parsenoop},1025:{n:\"BrtKnownFonts\",f:parsenoop},1026:{n:\"BrtBeginSXTupleSet\",f:parsenoop},1027:{n:\"BrtEndSXTupleSet\",f:parsenoop},1028:{n:\"BrtBeginSXTupleSetHeader\",f:parsenoop},1029:{n:\"BrtEndSXTupleSetHeader\",f:parsenoop},1030:{n:\"BrtSXTupleSetHeaderItem\",f:parsenoop},1031:{n:\"BrtBeginSXTupleSetData\",f:parsenoop},1032:{n:\"BrtEndSXTupleSetData\",f:parsenoop},1033:{n:\"BrtBeginSXTupleSetRow\",f:parsenoop},1034:{n:\"BrtEndSXTupleSetRow\",f:parsenoop},1035:{n:\"BrtSXTupleSetRowItem\",f:parsenoop},1036:{n:\"BrtNameExt\",f:parsenoop},1037:{n:\"BrtPCDH14\",f:parsenoop},1038:{n:\"BrtBeginPCDCalcMem14\",f:parsenoop},1039:{n:\"BrtEndPCDCalcMem14\",f:parsenoop},1040:{n:\"BrtSXTH14\",f:parsenoop},1041:{n:\"BrtBeginSparklineGroup\",f:parsenoop},1042:{n:\"BrtEndSparklineGroup\",f:parsenoop},1043:{n:\"BrtSparkline\",f:parsenoop},1044:{n:\"BrtSXDI14\",f:parsenoop},1045:{n:\"BrtWsFmtInfoEx14\",f:parsenoop},1046:{n:\"BrtBeginConditionalFormatting14\",f:parsenoop},1047:{n:\"BrtEndConditionalFormatting14\",f:parsenoop},1048:{n:\"BrtBeginCFRule14\",f:parsenoop},1049:{n:\"BrtEndCFRule14\",f:parsenoop},1050:{n:\"BrtCFVO14\",f:parsenoop},1051:{n:\"BrtBeginDatabar14\",f:parsenoop},1052:{n:\"BrtBeginIconSet14\",f:parsenoop},1053:{n:\"BrtDVal14\",f:parsenoop},1054:{n:\"BrtBeginDVals14\",f:parsenoop},1055:{n:\"BrtColor14\",f:parsenoop},1056:{n:\"BrtBeginSparklines\",f:parsenoop},1057:{n:\"BrtEndSparklines\",f:parsenoop},1058:{n:\"BrtBeginSparklineGroups\",f:parsenoop},1059:{n:\"BrtEndSparklineGroups\",f:parsenoop},1061:{n:\"BrtSXVD14\",f:parsenoop},1062:{n:\"BrtBeginSxview14\",f:parsenoop},1063:{n:\"BrtEndSxview14\",f:parsenoop},1066:{n:\"BrtBeginPCD14\",f:parsenoop},1067:{n:\"BrtEndPCD14\",f:parsenoop},1068:{n:\"BrtBeginExtConn14\",f:parsenoop},1069:{n:\"BrtEndExtConn14\",f:parsenoop},1070:{n:\"BrtBeginSlicerCacheIDs\",f:parsenoop},1071:{n:\"BrtEndSlicerCacheIDs\",f:parsenoop},1072:{n:\"BrtBeginSlicerCacheID\",f:parsenoop},1073:{n:\"BrtEndSlicerCacheID\",f:parsenoop},1075:{n:\"BrtBeginSlicerCache\",f:parsenoop},1076:{n:\"BrtEndSlicerCache\",f:parsenoop},1077:{n:\"BrtBeginSlicerCacheDef\",f:parsenoop},1078:{n:\"BrtEndSlicerCacheDef\",f:parsenoop},1079:{n:\"BrtBeginSlicersEx\",f:parsenoop},1080:{n:\"BrtEndSlicersEx\",f:parsenoop},1081:{n:\"BrtBeginSlicerEx\",f:parsenoop},1082:{n:\"BrtEndSlicerEx\",f:parsenoop},1083:{n:\"BrtBeginSlicer\",f:parsenoop},1084:{n:\"BrtEndSlicer\",f:parsenoop},1085:{n:\"BrtSlicerCachePivotTables\",f:parsenoop},1086:{n:\"BrtBeginSlicerCacheOlapImpl\",f:parsenoop},1087:{n:\"BrtEndSlicerCacheOlapImpl\",f:parsenoop},1088:{n:\"BrtBeginSlicerCacheLevelsData\",f:parsenoop},1089:{n:\"BrtEndSlicerCacheLevelsData\",f:parsenoop},1090:{n:\"BrtBeginSlicerCacheLevelData\",f:parsenoop},1091:{n:\"BrtEndSlicerCacheLevelData\",f:parsenoop},1092:{n:\"BrtBeginSlicerCacheSiRanges\",f:parsenoop},1093:{n:\"BrtEndSlicerCacheSiRanges\",f:parsenoop},1094:{n:\"BrtBeginSlicerCacheSiRange\",f:parsenoop},1095:{n:\"BrtEndSlicerCacheSiRange\",f:parsenoop},1096:{n:\"BrtSlicerCacheOlapItem\",f:parsenoop},1097:{n:\"BrtBeginSlicerCacheSelections\",f:parsenoop},1098:{n:\"BrtSlicerCacheSelection\",f:parsenoop},1099:{n:\"BrtEndSlicerCacheSelections\",f:parsenoop},1100:{n:\"BrtBeginSlicerCacheNative\",f:parsenoop},1101:{n:\"BrtEndSlicerCacheNative\",f:parsenoop},1102:{n:\"BrtSlicerCacheNativeItem\",f:parsenoop},1103:{n:\"BrtRangeProtection14\",f:parsenoop},1104:{n:\"BrtRangeProtectionIso14\",f:parsenoop},1105:{n:\"BrtCellIgnoreEC14\",f:parsenoop},1111:{n:\"BrtList14\",f:parsenoop},1112:{n:\"BrtCFIcon\",f:parsenoop},1113:{n:\"BrtBeginSlicerCachesPivotCacheIDs\",f:parsenoop},1114:{n:\"BrtEndSlicerCachesPivotCacheIDs\",f:parsenoop},1115:{n:\"BrtBeginSlicers\",f:parsenoop},1116:{n:\"BrtEndSlicers\",f:parsenoop},1117:{n:\"BrtWbProp14\",f:parsenoop},1118:{n:\"BrtBeginSXEdit\",f:parsenoop},1119:{n:\"BrtEndSXEdit\",f:parsenoop},1120:{n:\"BrtBeginSXEdits\",f:parsenoop},1121:{n:\"BrtEndSXEdits\",f:parsenoop},1122:{n:\"BrtBeginSXChange\",f:parsenoop},1123:{n:\"BrtEndSXChange\",f:parsenoop},1124:{n:\"BrtBeginSXChanges\",f:parsenoop},1125:{n:\"BrtEndSXChanges\",f:parsenoop},1126:{n:\"BrtSXTupleItems\",f:parsenoop},1128:{n:\"BrtBeginSlicerStyle\",f:parsenoop},1129:{n:\"BrtEndSlicerStyle\",f:parsenoop},1130:{n:\"BrtSlicerStyleElement\",f:parsenoop},1131:{n:\"BrtBeginStyleSheetExt14\",f:parsenoop},1132:{n:\"BrtEndStyleSheetExt14\",f:parsenoop},1133:{n:\"BrtBeginSlicerCachesPivotCacheID\",f:parsenoop},1134:{n:\"BrtEndSlicerCachesPivotCacheID\",f:parsenoop},1135:{n:\"BrtBeginConditionalFormattings\",f:parsenoop},1136:{n:\"BrtEndConditionalFormattings\",f:parsenoop},1137:{n:\"BrtBeginPCDCalcMemExt\",f:parsenoop},1138:{n:\"BrtEndPCDCalcMemExt\",f:parsenoop},1139:{n:\"BrtBeginPCDCalcMemsExt\",f:parsenoop},1140:{n:\"BrtEndPCDCalcMemsExt\",f:parsenoop},1141:{n:\"BrtPCDField14\",f:parsenoop},1142:{n:\"BrtBeginSlicerStyles\",f:parsenoop},1143:{n:\"BrtEndSlicerStyles\",f:parsenoop},1144:{n:\"BrtBeginSlicerStyleElements\",f:parsenoop},1145:{n:\"BrtEndSlicerStyleElements\",f:parsenoop},1146:{n:\"BrtCFRuleExt\",f:parsenoop},1147:{n:\"BrtBeginSXCondFmt14\",f:parsenoop},1148:{n:\"BrtEndSXCondFmt14\",f:parsenoop},1149:{n:\"BrtBeginSXCondFmts14\",f:parsenoop},1150:{n:\"BrtEndSXCondFmts14\",f:parsenoop},1152:{n:\"BrtBeginSortCond14\",f:parsenoop},1153:{n:\"BrtEndSortCond14\",f:parsenoop},1154:{n:\"BrtEndDVals14\",f:parsenoop},1155:{n:\"BrtEndIconSet14\",f:parsenoop},1156:{n:\"BrtEndDatabar14\",f:parsenoop},1157:{n:\"BrtBeginColorScale14\",f:parsenoop},1158:{n:\"BrtEndColorScale14\",f:parsenoop},1159:{n:\"BrtBeginSxrules14\",f:parsenoop},1160:{n:\"BrtEndSxrules14\",f:parsenoop},1161:{n:\"BrtBeginPRule14\",f:parsenoop},1162:{n:\"BrtEndPRule14\",f:parsenoop},1163:{n:\"BrtBeginPRFilters14\",f:parsenoop},1164:{n:\"BrtEndPRFilters14\",f:parsenoop},1165:{n:\"BrtBeginPRFilter14\",f:parsenoop},1166:{n:\"BrtEndPRFilter14\",f:parsenoop},1167:{n:\"BrtBeginPRFItem14\",f:parsenoop},1168:{n:\"BrtEndPRFItem14\",f:parsenoop},1169:{n:\"BrtBeginCellIgnoreECs14\",f:parsenoop},1170:{n:\"BrtEndCellIgnoreECs14\",f:parsenoop},1171:{n:\"BrtDxf14\",f:parsenoop},1172:{n:\"BrtBeginDxF14s\",f:parsenoop},1173:{n:\"BrtEndDxf14s\",f:parsenoop},1177:{n:\"BrtFilter14\",f:parsenoop},1178:{n:\"BrtBeginCustomFilters14\",f:parsenoop},1180:{n:\"BrtCustomFilter14\",f:parsenoop},1181:{n:\"BrtIconFilter14\",f:parsenoop},1182:{n:\"BrtPivotCacheConnectionName\",f:parsenoop},2048:{n:\"BrtBeginDecoupledPivotCacheIDs\",f:parsenoop},2049:{n:\"BrtEndDecoupledPivotCacheIDs\",f:parsenoop},2050:{n:\"BrtDecoupledPivotCacheID\",f:parsenoop},2051:{n:\"BrtBeginPivotTableRefs\",f:parsenoop},2052:{n:\"BrtEndPivotTableRefs\",f:parsenoop},2053:{n:\"BrtPivotTableRef\",f:parsenoop},2054:{n:\"BrtSlicerCacheBookPivotTables\",f:parsenoop},2055:{n:\"BrtBeginSxvcells\",f:parsenoop},2056:{n:\"BrtEndSxvcells\",f:parsenoop},2057:{n:\"BrtBeginSxRow\",f:parsenoop},2058:{n:\"BrtEndSxRow\",f:parsenoop},2060:{n:\"BrtPcdCalcMem15\",f:parsenoop},2067:{n:\"BrtQsi15\",f:parsenoop},2068:{n:\"BrtBeginWebExtensions\",f:parsenoop},2069:{n:\"BrtEndWebExtensions\",f:parsenoop},2070:{n:\"BrtWebExtension\",f:parsenoop},2071:{n:\"BrtAbsPath15\",f:parsenoop},2072:{n:\"BrtBeginPivotTableUISettings\",f:parsenoop},2073:{n:\"BrtEndPivotTableUISettings\",f:parsenoop},2075:{n:\"BrtTableSlicerCacheIDs\",f:parsenoop},2076:{n:\"BrtTableSlicerCacheID\",f:parsenoop},2077:{n:\"BrtBeginTableSlicerCache\",f:parsenoop},2078:{n:\"BrtEndTableSlicerCache\",f:parsenoop},2079:{n:\"BrtSxFilter15\",f:parsenoop},2080:{n:\"BrtBeginTimelineCachePivotCacheIDs\",f:parsenoop},2081:{n:\"BrtEndTimelineCachePivotCacheIDs\",f:parsenoop},2082:{n:\"BrtTimelineCachePivotCacheID\",f:parsenoop},2083:{n:\"BrtBeginTimelineCacheIDs\",f:parsenoop},2084:{n:\"BrtEndTimelineCacheIDs\",f:parsenoop},2085:{n:\"BrtBeginTimelineCacheID\",f:parsenoop},2086:{n:\"BrtEndTimelineCacheID\",f:parsenoop},2087:{n:\"BrtBeginTimelinesEx\",f:parsenoop},2088:{n:\"BrtEndTimelinesEx\",f:parsenoop},2089:{n:\"BrtBeginTimelineEx\",f:parsenoop},2090:{n:\"BrtEndTimelineEx\",f:parsenoop},2091:{n:\"BrtWorkBookPr15\",f:parsenoop},2092:{n:\"BrtPCDH15\",f:parsenoop},2093:{n:\"BrtBeginTimelineStyle\",f:parsenoop},2094:{n:\"BrtEndTimelineStyle\",f:parsenoop},2095:{n:\"BrtTimelineStyleElement\",f:parsenoop},2096:{n:\"BrtBeginTimelineStylesheetExt15\",f:parsenoop},2097:{n:\"BrtEndTimelineStylesheetExt15\",f:parsenoop},2098:{n:\"BrtBeginTimelineStyles\",f:parsenoop},2099:{n:\"BrtEndTimelineStyles\",f:parsenoop},2100:{n:\"BrtBeginTimelineStyleElements\",f:parsenoop},2101:{n:\"BrtEndTimelineStyleElements\",f:parsenoop},2102:{n:\"BrtDxf15\",f:parsenoop},2103:{n:\"BrtBeginDxfs15\",f:parsenoop},2104:{n:\"brtEndDxfs15\",f:parsenoop},2105:{n:\"BrtSlicerCacheHideItemsWithNoData\",f:parsenoop},2106:{n:\"BrtBeginItemUniqueNames\",f:parsenoop},2107:{n:\"BrtEndItemUniqueNames\",f:parsenoop},2108:{n:\"BrtItemUniqueName\",f:parsenoop},2109:{n:\"BrtBeginExtConn15\",f:parsenoop},2110:{n:\"BrtEndExtConn15\",f:parsenoop},2111:{n:\"BrtBeginOledbPr15\",f:parsenoop},2112:{n:\"BrtEndOledbPr15\",f:parsenoop},2113:{n:\"BrtBeginDataFeedPr15\",f:parsenoop},2114:{n:\"BrtEndDataFeedPr15\",f:parsenoop},2115:{n:\"BrtTextPr15\",f:parsenoop},2116:{n:\"BrtRangePr15\",f:parsenoop},2117:{n:\"BrtDbCommand15\",f:parsenoop},2118:{n:\"BrtBeginDbTables15\",f:parsenoop},2119:{n:\"BrtEndDbTables15\",f:parsenoop},2120:{n:\"BrtDbTable15\",f:parsenoop},2121:{n:\"BrtBeginDataModel\",f:parsenoop},2122:{n:\"BrtEndDataModel\",f:parsenoop},2123:{n:\"BrtBeginModelTables\",f:parsenoop},2124:{n:\"BrtEndModelTables\",f:parsenoop},2125:{n:\"BrtModelTable\",f:parsenoop},2126:{n:\"BrtBeginModelRelationships\",f:parsenoop},2127:{n:\"BrtEndModelRelationships\",f:parsenoop},2128:{n:\"BrtModelRelationship\",f:parsenoop},2129:{n:\"BrtBeginECTxtWiz15\",f:parsenoop},2130:{n:\"BrtEndECTxtWiz15\",f:parsenoop},2131:{n:\"BrtBeginECTWFldInfoLst15\",f:parsenoop},2132:{n:\"BrtEndECTWFldInfoLst15\",f:parsenoop},2133:{n:\"BrtBeginECTWFldInfo15\",f:parsenoop},2134:{n:\"BrtFieldListActiveItem\",f:parsenoop},2135:{n:\"BrtPivotCacheIdVersion\",f:parsenoop},2136:{n:\"BrtSXDI15\",f:parsenoop},65535:{n:\"\",f:parsenoop}};var evert_RE=evert_key(XLSBRecordEnum,\"n\");var XLSRecordEnum={3:{n:\"BIFF2NUM\",f:parse_BIFF2NUM},4:{n:\"BIFF2STR\",f:parse_BIFF2STR},6:{n:\"Formula\",f:parse_Formula},9:{n:\"BOF\",f:parse_BOF},10:{n:\"EOF\",f:parse_EOF},12:{n:\"CalcCount\",f:parse_CalcCount},13:{n:\"CalcMode\",f:parse_CalcMode},14:{n:\"CalcPrecision\",f:parse_CalcPrecision},15:{n:\"CalcRefMode\",f:parse_CalcRefMode},16:{n:\"CalcDelta\",f:parse_CalcDelta},17:{n:\"CalcIter\",f:parse_CalcIter},18:{n:\"Protect\",f:parse_Protect},19:{n:\"Password\",f:parse_Password},20:{n:\"Header\",f:parse_Header},21:{n:\"Footer\",f:parse_Footer},23:{n:\"ExternSheet\",f:parse_ExternSheet},24:{n:\"Lbl\",f:parse_Lbl},25:{n:\"WinProtect\",f:parse_WinProtect},26:{n:\"VerticalPageBreaks\",f:parse_VerticalPageBreaks},27:{n:\"HorizontalPageBreaks\",f:parse_HorizontalPageBreaks},28:{n:\"Note\",f:parse_Note},29:{n:\"Selection\",f:parse_Selection},34:{n:\"Date1904\",f:parse_Date1904},35:{n:\"ExternName\",f:parse_ExternName},38:{n:\"LeftMargin\",f:parse_LeftMargin},39:{n:\"RightMargin\",f:parse_RightMargin},40:{n:\"TopMargin\",f:parse_TopMargin},41:{n:\"BottomMargin\",f:parse_BottomMargin},42:{n:\"PrintRowCol\",f:parse_PrintRowCol},43:{n:\"PrintGrid\",f:parse_PrintGrid},47:{n:\"FilePass\",f:parse_FilePass},49:{n:\"Font\",f:parse_Font},51:{n:\"PrintSize\",f:parse_PrintSize},60:{n:\"Continue\",f:parse_Continue},61:{n:\"Window1\",f:parse_Window1},64:{n:\"Backup\",f:parse_Backup},65:{n:\"Pane\",f:parse_Pane},66:{n:\"CodePage\",f:parse_CodePage},77:{n:\"Pls\",f:parse_Pls},80:{n:\"DCon\",f:parse_DCon},81:{n:\"DConRef\",f:parse_DConRef},82:{n:\"DConName\",f:parse_DConName},85:{n:\"DefColWidth\",f:parse_DefColWidth},89:{n:\"XCT\",f:parse_XCT},90:{n:\"CRN\",f:parse_CRN},91:{n:\"FileSharing\",f:parse_FileSharing},92:{n:\"WriteAccess\",f:parse_WriteAccess},93:{n:\"Obj\",f:parse_Obj},94:{n:\"Uncalced\",f:parse_Uncalced},95:{n:\"CalcSaveRecalc\",f:parse_CalcSaveRecalc},96:{n:\"Template\",f:parse_Template},97:{n:\"Intl\",f:parse_Intl},99:{n:\"ObjProtect\",f:parse_ObjProtect},125:{n:\"ColInfo\",f:parse_ColInfo},128:{n:\"Guts\",f:parse_Guts},129:{n:\"WsBool\",f:parse_WsBool},130:{n:\"GridSet\",f:parse_GridSet},131:{n:\"HCenter\",f:parse_HCenter},132:{n:\"VCenter\",f:parse_VCenter},133:{n:\"BoundSheet8\",f:parse_BoundSheet8},134:{n:\"WriteProtect\",f:parse_WriteProtect},140:{n:\"Country\",f:parse_Country},141:{n:\"HideObj\",f:parse_HideObj},144:{n:\"Sort\",f:parse_Sort},146:{n:\"Palette\",f:parse_Palette},151:{n:\"Sync\",f:parse_Sync},152:{n:\"LPr\",f:parse_LPr},153:{n:\"DxGCol\",f:parse_DxGCol},154:{n:\"FnGroupName\",f:parse_FnGroupName},155:{n:\"FilterMode\",f:parse_FilterMode},156:{n:\"BuiltInFnGroupCount\",f:parse_BuiltInFnGroupCount},157:{n:\"AutoFilterInfo\",f:parse_AutoFilterInfo},158:{n:\"AutoFilter\",f:parse_AutoFilter},160:{n:\"Scl\",f:parse_Scl},161:{n:\"Setup\",f:parse_Setup},174:{n:\"ScenMan\",f:parse_ScenMan},175:{n:\"SCENARIO\",f:parse_SCENARIO},176:{n:\"SxView\",f:parse_SxView},177:{n:\"Sxvd\",f:parse_Sxvd},178:{n:\"SXVI\",f:parse_SXVI},180:{n:\"SxIvd\",f:parse_SxIvd},181:{n:\"SXLI\",f:parse_SXLI},182:{n:\"SXPI\",f:parse_SXPI},184:{n:\"DocRoute\",f:parse_DocRoute},185:{n:\"RecipName\",f:parse_RecipName},\n189:{n:\"MulRk\",f:parse_MulRk},190:{n:\"MulBlank\",f:parse_MulBlank},193:{n:\"Mms\",f:parse_Mms},197:{n:\"SXDI\",f:parse_SXDI},198:{n:\"SXDB\",f:parse_SXDB},199:{n:\"SXFDB\",f:parse_SXFDB},200:{n:\"SXDBB\",f:parse_SXDBB},201:{n:\"SXNum\",f:parse_SXNum},202:{n:\"SxBool\",f:parse_SxBool},203:{n:\"SxErr\",f:parse_SxErr},204:{n:\"SXInt\",f:parse_SXInt},205:{n:\"SXString\",f:parse_SXString},206:{n:\"SXDtr\",f:parse_SXDtr},207:{n:\"SxNil\",f:parse_SxNil},208:{n:\"SXTbl\",f:parse_SXTbl},209:{n:\"SXTBRGIITM\",f:parse_SXTBRGIITM},210:{n:\"SxTbpg\",f:parse_SxTbpg},211:{n:\"ObProj\",f:parse_ObProj},213:{n:\"SXStreamID\",f:parse_SXStreamID},215:{n:\"DBCell\",f:parse_DBCell},216:{n:\"SXRng\",f:parse_SXRng},217:{n:\"SxIsxoper\",f:parse_SxIsxoper},218:{n:\"BookBool\",f:parse_BookBool},220:{n:\"DbOrParamQry\",f:parse_DbOrParamQry},221:{n:\"ScenarioProtect\",f:parse_ScenarioProtect},222:{n:\"OleObjectSize\",f:parse_OleObjectSize},224:{n:\"XF\",f:parse_XF},225:{n:\"InterfaceHdr\",f:parse_InterfaceHdr},226:{n:\"InterfaceEnd\",f:parse_InterfaceEnd},227:{n:\"SXVS\",f:parse_SXVS},229:{n:\"MergeCells\",f:parse_MergeCells},233:{n:\"BkHim\",f:parse_BkHim},235:{n:\"MsoDrawingGroup\",f:parse_MsoDrawingGroup},236:{n:\"MsoDrawing\",f:parse_MsoDrawing},237:{n:\"MsoDrawingSelection\",f:parse_MsoDrawingSelection},239:{n:\"PhoneticInfo\",f:parse_PhoneticInfo},240:{n:\"SxRule\",f:parse_SxRule},241:{n:\"SXEx\",f:parse_SXEx},242:{n:\"SxFilt\",f:parse_SxFilt},244:{n:\"SxDXF\",f:parse_SxDXF},245:{n:\"SxItm\",f:parse_SxItm},246:{n:\"SxName\",f:parse_SxName},247:{n:\"SxSelect\",f:parse_SxSelect},248:{n:\"SXPair\",f:parse_SXPair},249:{n:\"SxFmla\",f:parse_SxFmla},251:{n:\"SxFormat\",f:parse_SxFormat},252:{n:\"SST\",f:parse_SST},253:{n:\"LabelSst\",f:parse_LabelSst},255:{n:\"ExtSST\",f:parse_ExtSST},256:{n:\"SXVDEx\",f:parse_SXVDEx},259:{n:\"SXFormula\",f:parse_SXFormula},290:{n:\"SXDBEx\",f:parse_SXDBEx},311:{n:\"RRDInsDel\",f:parse_RRDInsDel},312:{n:\"RRDHead\",f:parse_RRDHead},315:{n:\"RRDChgCell\",f:parse_RRDChgCell},317:{n:\"RRTabId\",f:parse_RRTabId},318:{n:\"RRDRenSheet\",f:parse_RRDRenSheet},319:{n:\"RRSort\",f:parse_RRSort},320:{n:\"RRDMove\",f:parse_RRDMove},330:{n:\"RRFormat\",f:parse_RRFormat},331:{n:\"RRAutoFmt\",f:parse_RRAutoFmt},333:{n:\"RRInsertSh\",f:parse_RRInsertSh},334:{n:\"RRDMoveBegin\",f:parse_RRDMoveBegin},335:{n:\"RRDMoveEnd\",f:parse_RRDMoveEnd},336:{n:\"RRDInsDelBegin\",f:parse_RRDInsDelBegin},337:{n:\"RRDInsDelEnd\",f:parse_RRDInsDelEnd},338:{n:\"RRDConflict\",f:parse_RRDConflict},339:{n:\"RRDDefName\",f:parse_RRDDefName},340:{n:\"RRDRstEtxp\",f:parse_RRDRstEtxp},351:{n:\"LRng\",f:parse_LRng},352:{n:\"UsesELFs\",f:parse_UsesELFs},353:{n:\"DSF\",f:parse_DSF},401:{n:\"CUsr\",f:parse_CUsr},402:{n:\"CbUsr\",f:parse_CbUsr},403:{n:\"UsrInfo\",f:parse_UsrInfo},404:{n:\"UsrExcl\",f:parse_UsrExcl},405:{n:\"FileLock\",f:parse_FileLock},406:{n:\"RRDInfo\",f:parse_RRDInfo},407:{n:\"BCUsrs\",f:parse_BCUsrs},408:{n:\"UsrChk\",f:parse_UsrChk},425:{n:\"UserBView\",f:parse_UserBView},426:{n:\"UserSViewBegin\",f:parse_UserSViewBegin},427:{n:\"UserSViewEnd\",f:parse_UserSViewEnd},428:{n:\"RRDUserView\",f:parse_RRDUserView},429:{n:\"Qsi\",f:parse_Qsi},430:{n:\"SupBook\",f:parse_SupBook},431:{n:\"Prot4Rev\",f:parse_Prot4Rev},432:{n:\"CondFmt\",f:parse_CondFmt},433:{n:\"CF\",f:parse_CF},434:{n:\"DVal\",f:parse_DVal},437:{n:\"DConBin\",f:parse_DConBin},438:{n:\"TxO\",f:parse_TxO},439:{n:\"RefreshAll\",f:parse_RefreshAll},440:{n:\"HLink\",f:parse_HLink},441:{n:\"Lel\",f:parse_Lel},442:{n:\"CodeName\",f:parse_XLSCodeName},443:{n:\"SXFDBType\",f:parse_SXFDBType},444:{n:\"Prot4RevPass\",f:parse_Prot4RevPass},445:{n:\"ObNoMacros\",f:parse_ObNoMacros},446:{n:\"Dv\",f:parse_Dv},448:{n:\"Excel9File\",f:parse_Excel9File},449:{n:\"RecalcId\",f:parse_RecalcId,r:2},450:{n:\"EntExU2\",f:parse_EntExU2},512:{n:\"Dimensions\",f:parse_Dimensions},513:{n:\"Blank\",f:parse_Blank},515:{n:\"Number\",f:parse_Number},516:{n:\"Label\",f:parse_Label},517:{n:\"BoolErr\",f:parse_BoolErr},519:{n:\"String\",f:parse_String},520:{n:\"Row\",f:parse_Row},523:{n:\"Index\",f:parse_Index},545:{n:\"Array\",f:parse_Array},549:{n:\"DefaultRowHeight\",f:parse_DefaultRowHeight},566:{n:\"Table\",f:parse_Table},574:{n:\"Window2\",f:parse_Window2},638:{n:\"RK\",f:parse_RK},659:{n:\"Style\",f:parse_Style},1048:{n:\"BigName\",f:parse_BigName},1054:{n:\"Format\",f:parse_Format},1084:{n:\"ContinueBigName\",f:parse_ContinueBigName},1212:{n:\"ShrFmla\",f:parse_ShrFmla},2048:{n:\"HLinkTooltip\",f:parse_HLinkTooltip},2049:{n:\"WebPub\",f:parse_WebPub},2050:{n:\"QsiSXTag\",f:parse_QsiSXTag},2051:{n:\"DBQueryExt\",f:parse_DBQueryExt},2052:{n:\"ExtString\",f:parse_ExtString},2053:{n:\"TxtQry\",f:parse_TxtQry},2054:{n:\"Qsir\",f:parse_Qsir},2055:{n:\"Qsif\",f:parse_Qsif},2056:{n:\"RRDTQSIF\",f:parse_RRDTQSIF},2057:{n:\"BOF\",f:parse_BOF},2058:{n:\"OleDbConn\",f:parse_OleDbConn},2059:{n:\"WOpt\",f:parse_WOpt},2060:{n:\"SXViewEx\",f:parse_SXViewEx},2061:{n:\"SXTH\",f:parse_SXTH},2062:{n:\"SXPIEx\",f:parse_SXPIEx},2063:{n:\"SXVDTEx\",f:parse_SXVDTEx},2064:{n:\"SXViewEx9\",f:parse_SXViewEx9},2066:{n:\"ContinueFrt\",f:parse_ContinueFrt},2067:{n:\"RealTimeData\",f:parse_RealTimeData},2128:{n:\"ChartFrtInfo\",f:parse_ChartFrtInfo},2129:{n:\"FrtWrapper\",f:parse_FrtWrapper},2130:{n:\"StartBlock\",f:parse_StartBlock},2131:{n:\"EndBlock\",f:parse_EndBlock},2132:{n:\"StartObject\",f:parse_StartObject},2133:{n:\"EndObject\",f:parse_EndObject},2134:{n:\"CatLab\",f:parse_CatLab},2135:{n:\"YMult\",f:parse_YMult},2136:{n:\"SXViewLink\",f:parse_SXViewLink},2137:{n:\"PivotChartBits\",f:parse_PivotChartBits},2138:{n:\"FrtFontList\",f:parse_FrtFontList},2146:{n:\"SheetExt\",f:parse_SheetExt},2147:{n:\"BookExt\",f:parse_BookExt,r:12},2148:{n:\"SXAddl\",f:parse_SXAddl},2149:{n:\"CrErr\",f:parse_CrErr},2150:{n:\"HFPicture\",f:parse_HFPicture},2151:{n:\"FeatHdr\",f:parse_FeatHdr},2152:{n:\"Feat\",f:parse_Feat},2154:{n:\"DataLabExt\",f:parse_DataLabExt},2155:{n:\"DataLabExtContents\",f:parse_DataLabExtContents},2156:{n:\"CellWatch\",f:parse_CellWatch},2161:{n:\"FeatHdr11\",f:parse_FeatHdr11},2162:{n:\"Feature11\",f:parse_Feature11},2164:{n:\"DropDownObjIds\",f:parse_DropDownObjIds},2165:{n:\"ContinueFrt11\",f:parse_ContinueFrt11},2166:{n:\"DConn\",f:parse_DConn},2167:{n:\"List12\",f:parse_List12},2168:{n:\"Feature12\",f:parse_Feature12},2169:{n:\"CondFmt12\",f:parse_CondFmt12},2170:{n:\"CF12\",f:parse_CF12},2171:{n:\"CFEx\",f:parse_CFEx},2172:{n:\"XFCRC\",f:parse_XFCRC,r:12},2173:{n:\"XFExt\",f:parse_XFExt,r:12},2174:{n:\"AutoFilter12\",f:parse_AutoFilter12},2175:{n:\"ContinueFrt12\",f:parse_ContinueFrt12},2180:{n:\"MDTInfo\",f:parse_MDTInfo},2181:{n:\"MDXStr\",f:parse_MDXStr},2182:{n:\"MDXTuple\",f:parse_MDXTuple},2183:{n:\"MDXSet\",f:parse_MDXSet},2184:{n:\"MDXProp\",f:parse_MDXProp},2185:{n:\"MDXKPI\",f:parse_MDXKPI},2186:{n:\"MDB\",f:parse_MDB},2187:{n:\"PLV\",f:parse_PLV},2188:{n:\"Compat12\",f:parse_Compat12,r:12},2189:{n:\"DXF\",f:parse_DXF},2190:{n:\"TableStyles\",f:parse_TableStyles,r:12},2191:{n:\"TableStyle\",f:parse_TableStyle},2192:{n:\"TableStyleElement\",f:parse_TableStyleElement},2194:{n:\"StyleExt\",f:parse_StyleExt},2195:{n:\"NamePublish\",f:parse_NamePublish},2196:{n:\"NameCmt\",f:parse_NameCmt},2197:{n:\"SortData\",f:parse_SortData},2198:{n:\"Theme\",f:parse_Theme,r:12},2199:{n:\"GUIDTypeLib\",f:parse_GUIDTypeLib},2200:{n:\"FnGrp12\",f:parse_FnGrp12},2201:{n:\"NameFnGrp12\",f:parse_NameFnGrp12},2202:{n:\"MTRSettings\",f:parse_MTRSettings,r:12},2203:{n:\"CompressPictures\",f:parse_CompressPictures},2204:{n:\"HeaderFooter\",f:parse_HeaderFooter},2205:{n:\"CrtLayout12\",f:parse_CrtLayout12},2206:{n:\"CrtMlFrt\",f:parse_CrtMlFrt},2207:{n:\"CrtMlFrtContinue\",f:parse_CrtMlFrtContinue},2211:{n:\"ForceFullCalculation\",f:parse_ForceFullCalculation},2212:{n:\"ShapePropsStream\",f:parse_ShapePropsStream},2213:{n:\"TextPropsStream\",f:parse_TextPropsStream},2214:{n:\"RichTextStream\",f:parse_RichTextStream},2215:{n:\"CrtLayout12A\",f:parse_CrtLayout12A},4097:{n:\"Units\",f:parse_Units},4098:{n:\"Chart\",f:parse_Chart},4099:{n:\"Series\",f:parse_Series},4102:{n:\"DataFormat\",f:parse_DataFormat},4103:{n:\"LineFormat\",f:parse_LineFormat},4105:{n:\"MarkerFormat\",f:parse_MarkerFormat},4106:{n:\"AreaFormat\",f:parse_AreaFormat},4107:{n:\"PieFormat\",f:parse_PieFormat},4108:{n:\"AttachedLabel\",f:parse_AttachedLabel},4109:{n:\"SeriesText\",f:parse_SeriesText},4116:{n:\"ChartFormat\",f:parse_ChartFormat},4117:{n:\"Legend\",f:parse_Legend},4118:{n:\"SeriesList\",f:parse_SeriesList},4119:{n:\"Bar\",f:parse_Bar},4120:{n:\"Line\",f:parse_Line},4121:{n:\"Pie\",f:parse_Pie},4122:{n:\"Area\",f:parse_Area},4123:{n:\"Scatter\",f:parse_Scatter},4124:{n:\"CrtLine\",f:parse_CrtLine},4125:{n:\"Axis\",f:parse_Axis},4126:{n:\"Tick\",f:parse_Tick},4127:{n:\"ValueRange\",f:parse_ValueRange},4128:{n:\"CatSerRange\",f:parse_CatSerRange},4129:{n:\"AxisLine\",f:parse_AxisLine},4130:{n:\"CrtLink\",f:parse_CrtLink},4132:{n:\"DefaultText\",f:parse_DefaultText},4133:{n:\"Text\",f:parse_Text},4134:{n:\"FontX\",f:parse_FontX},4135:{n:\"ObjectLink\",f:parse_ObjectLink},4146:{n:\"Frame\",f:parse_Frame},4147:{n:\"Begin\",f:parse_Begin},4148:{n:\"End\",f:parse_End},4149:{n:\"PlotArea\",f:parse_PlotArea},4154:{n:\"Chart3d\",f:parse_Chart3d},4156:{n:\"PicF\",f:parse_PicF},4157:{n:\"DropBar\",f:parse_DropBar},4158:{n:\"Radar\",f:parse_Radar},4159:{n:\"Surf\",f:parse_Surf},4160:{n:\"RadarArea\",f:parse_RadarArea},4161:{n:\"AxisParent\",f:parse_AxisParent},4163:{n:\"LegendException\",f:parse_LegendException},4164:{n:\"ShtProps\",f:parse_ShtProps},4165:{n:\"SerToCrt\",f:parse_SerToCrt},4166:{n:\"AxesUsed\",f:parse_AxesUsed},4168:{n:\"SBaseRef\",f:parse_SBaseRef},4170:{n:\"SerParent\",f:parse_SerParent},4171:{n:\"SerAuxTrend\",f:parse_SerAuxTrend},4174:{n:\"IFmtRecord\",f:parse_IFmtRecord},4175:{n:\"Pos\",f:parse_Pos},4176:{n:\"AlRuns\",f:parse_AlRuns},4177:{n:\"BRAI\",f:parse_BRAI},4187:{n:\"SerAuxErrBar\",f:parse_SerAuxErrBar},4188:{n:\"ClrtClient\",f:parse_ClrtClient},4189:{n:\"SerFmt\",f:parse_SerFmt},4191:{n:\"Chart3DBarShape\",f:parse_Chart3DBarShape},4192:{n:\"Fbi\",f:parse_Fbi},4193:{n:\"BopPop\",f:parse_BopPop},4194:{n:\"AxcExt\",f:parse_AxcExt},4195:{n:\"Dat\",f:parse_Dat},4196:{n:\"PlotGrowth\",f:parse_PlotGrowth},4197:{n:\"SIIndex\",f:parse_SIIndex},4198:{n:\"GelFrame\",f:parse_GelFrame},4199:{n:\"BopPopCustom\",f:parse_BopPopCustom},4200:{n:\"Fbi2\",f:parse_Fbi2},22:{n:\"ExternCount\",f:parsenoop},126:{n:\"RK\",f:parsenoop},127:{n:\"ImData\",f:parsenoop},135:{n:\"Addin\",f:parsenoop},136:{n:\"Edg\",f:parsenoop},137:{n:\"Pub\",f:parsenoop},145:{n:\"Sub\",f:parsenoop},148:{n:\"LHRecord\",f:parsenoop},149:{n:\"LHNGraph\",f:parsenoop},150:{n:\"Sound\",f:parsenoop},169:{n:\"CoordList\",f:parsenoop},171:{n:\"GCW\",f:parsenoop},188:{n:\"ShrFmla\",f:parsenoop},194:{n:\"AddMenu\",f:parsenoop},195:{n:\"DelMenu\",f:parsenoop},214:{n:\"RString\",f:parsenoop},223:{n:\"UDDesc\",f:parsenoop},234:{n:\"TabIdConf\",f:parsenoop},354:{n:\"XL5Modify\",f:parsenoop},421:{n:\"FileSharing2\",f:parsenoop},536:{n:\"Name\",f:parsenoop},547:{n:\"ExternName\",f:parse_ExternName},561:{n:\"Font\",f:parsenoop},1030:{n:\"Formula\",f:parse_Formula},2157:{n:\"FeatInfo\",f:parsenoop},2163:{n:\"FeatInfo11\",f:parsenoop},2177:{n:\"SXAddl12\",f:parsenoop},2240:{n:\"AutoWebPub\",f:parsenoop},2241:{n:\"ListObj\",f:parsenoop},2242:{n:\"ListField\",f:parsenoop},2243:{n:\"ListDV\",f:parsenoop},2244:{n:\"ListCondFmt\",f:parsenoop},2245:{n:\"ListCF\",f:parsenoop},2246:{n:\"FMQry\",f:parsenoop},2247:{n:\"FMSQry\",f:parsenoop},2248:{n:\"PLV\",f:parsenoop},2249:{n:\"LnExt\",f:parsenoop},2250:{n:\"MkrExt\",f:parsenoop},2251:{n:\"CrtCoopt\",f:parsenoop},0:{}};function parse_ods(zip,opts){if(typeof module!==\"undefined\"&&typeof require!==\"undefined\"&&typeof ODS===\"undefined\")ODS=require(\"./od\"+\"s\");if(typeof ODS===\"undefined\"||!ODS.parse_ods)throw new Error(\"Unsupported ODS\");return ODS.parse_ods(zip,opts)}function fix_opts_func(defaults){return function fix_opts(opts){for(var i=0;i!=defaults.length;++i){var d=defaults[i];if(opts[d[0]]===undefined)opts[d[0]]=d[1];if(d[2]===\"n\")opts[d[0]]=Number(opts[d[0]])}}}var fix_read_opts=fix_opts_func([[\"cellNF\",false],[\"cellHTML\",true],[\"cellFormula\",true],[\"cellStyles\",false],[\"cellDates\",false],[\"sheetStubs\",false],[\"sheetRows\",0,\"n\"],[\"bookDeps\",false],[\"bookSheets\",false],[\"bookProps\",false],[\"bookFiles\",false],[\"bookVBA\",false],[\"password\",\"\"],[\"WTF\",false]]);var fix_write_opts=fix_opts_func([[\"cellDates\",false],[\"bookSST\",false],[\"bookType\",\"xlsx\"],[\"WTF\",false]]);function safe_parse_wbrels(wbrels,sheets){if(!wbrels)return 0;try{wbrels=sheets.map(function pwbr(w){return[w.name,wbrels[\"!id\"][w.id].Target]})}catch(e){return null}return!wbrels||wbrels.length===0?null:wbrels}function safe_parse_ws(zip,path,relsPath,sheet,sheetRels,sheets,opts){try{sheetRels[sheet]=parse_rels(getzipdata(zip,relsPath,true),path);sheets[sheet]=parse_ws(getzipdata(zip,path),path,opts,sheetRels[sheet])}catch(e){if(opts.WTF)throw e}}var nodirs=function nodirs(x){return x.substr(-1)!=\"/\"};function parse_zip(zip,opts){make_ssf(SSF);opts=opts||{};fix_read_opts(opts);reset_cp();if(safegetzipfile(zip,\"META-INF/manifest.xml\"))return parse_ods(zip,opts);var entries=keys(zip.files).filter(nodirs).sort();var dir=parse_ct(getzipdata(zip,\"[Content_Types].xml\"),opts);var xlsb=false;var sheets,binname;if(dir.workbooks.length===0){binname=\"xl/workbook.xml\";if(getzipdata(zip,binname,true))dir.workbooks.push(binname)}if(dir.workbooks.length===0){binname=\"xl/workbook.bin\";if(!getzipfile(zip,binname,true))throw new Error(\"Could not find workbook\");dir.workbooks.push(binname);xlsb=true}if(dir.workbooks[0].substr(-3)==\"bin\")xlsb=true;if(xlsb)set_cp(1200);if(!opts.bookSheets&&!opts.bookProps){strs=[];if(dir.sst)strs=parse_sst(getzipdata(zip,dir.sst.replace(/^\\//,\"\")),dir.sst,opts);themes={};if(opts.cellStyles&&dir.themes.length)themes=parse_theme(getzipdata(zip,dir.themes[0].replace(/^\\//,\"\"),true),dir.themes[0],opts);styles={};if(dir.style)styles=parse_sty(getzipdata(zip,dir.style.replace(/^\\//,\"\")),dir.style,opts)}var wb=parse_wb(getzipdata(zip,dir.workbooks[0].replace(/^\\//,\"\")),dir.workbooks[0],opts);var props={},propdata=\"\";if(dir.coreprops.length!==0){propdata=getzipdata(zip,dir.coreprops[0].replace(/^\\//,\"\"),true);if(propdata)props=parse_core_props(propdata);if(dir.extprops.length!==0){propdata=getzipdata(zip,dir.extprops[0].replace(/^\\//,\"\"),true);if(propdata)parse_ext_props(propdata,props)}}var custprops={};if(!opts.bookSheets||opts.bookProps){if(dir.custprops.length!==0){propdata=getzipdata(zip,dir.custprops[0].replace(/^\\//,\"\"),true);if(propdata)custprops=parse_cust_props(propdata,opts)}}var out={};if(opts.bookSheets||opts.bookProps){if(props.Worksheets&&props.SheetNames.length>0)sheets=props.SheetNames;else if(wb.Sheets)sheets=wb.Sheets.map(function pluck(x){return x.name});if(opts.bookProps){out.Props=props;out.Custprops=custprops}if(typeof sheets!==\"undefined\")out.SheetNames=sheets;if(opts.bookSheets?out.SheetNames:opts.bookProps)return out}sheets={};var deps={};if(opts.bookDeps&&dir.calcchain)deps=parse_cc(getzipdata(zip,dir.calcchain.replace(/^\\//,\"\")),dir.calcchain,opts);var i=0;var sheetRels={};var path,relsPath;if(!props.Worksheets){var wbsheets=wb.Sheets;props.Worksheets=wbsheets.length;props.SheetNames=[];for(var j=0;j!=wbsheets.length;++j){props.SheetNames[j]=wbsheets[j].name}}var wbext=xlsb?\"bin\":\"xml\";var wbrelsfile=\"xl/_rels/workbook.\"+wbext+\".rels\";var wbrels=parse_rels(getzipdata(zip,wbrelsfile,true),wbrelsfile);if(wbrels)wbrels=safe_parse_wbrels(wbrels,wb.Sheets);var nmode=getzipdata(zip,\"xl/worksheets/sheet.xml\",true)?1:0;for(i=0;i!=props.Worksheets;++i){if(wbrels)path=\"xl/\"+wbrels[i][1].replace(/[\\/]?xl\\//,\"\");else{path=\"xl/worksheets/sheet\"+(i+1-nmode)+\".\"+wbext;path=path.replace(/sheet0\\./,\"sheet.\")}relsPath=path.replace(/^(.*)(\\/)([^\\/]*)$/,\"$1/_rels/$3.rels\");safe_parse_ws(zip,path,relsPath,props.SheetNames[i],sheetRels,sheets,opts)}if(dir.comments)parse_comments(zip,dir.comments,sheets,sheetRels,opts);out={Directory:dir,Workbook:wb,Props:props,Custprops:custprops,Deps:deps,Sheets:sheets,SheetNames:props.SheetNames,Strings:strs,Styles:styles,Themes:themes,SSF:SSF.get_table()};if(opts.bookFiles){out.keys=entries;out.files=zip.files}if(opts.bookVBA){if(dir.vba.length>0)out.vbaraw=getzipdata(zip,dir.vba[0],true);else if(dir.defaults.bin===\"application/vnd.ms-office.vbaProject\")out.vbaraw=getzipdata(zip,\"xl/vbaProject.bin\",true)}return out}function add_rels(rels,rId,f,type,relobj){if(!relobj)relobj={};if(!rels[\"!id\"])rels[\"!id\"]={};relobj.Id=\"rId\"+rId;relobj.Type=type;relobj.Target=f;if(rels[\"!id\"][relobj.Id])throw new Error(\"Cannot rewrite rId \"+rId);rels[\"!id\"][relobj.Id]=relobj;rels[(\"/\"+relobj.Target).replace(\"//\",\"/\")]=relobj}function write_zip(wb,opts){if(wb&&!wb.SSF){wb.SSF=SSF.get_table()}if(wb&&wb.SSF){make_ssf(SSF);SSF.load_table(wb.SSF);opts.revssf=evert_num(wb.SSF);opts.revssf[wb.SSF[65535]]=0}opts.rels={};opts.wbrels={};opts.Strings=[];opts.Strings.Count=0;opts.Strings.Unique=0;var wbext=opts.bookType==\"xlsb\"?\"bin\":\"xml\";var ct={workbooks:[],sheets:[],calcchains:[],themes:[],styles:[],coreprops:[],extprops:[],custprops:[],strs:[],comments:[],vba:[],TODO:[],rels:[],xmlns:\"\"};fix_write_opts(opts=opts||{});var zip=new jszip;var f=\"\",rId=0;opts.cellXfs=[];get_cell_style(opts.cellXfs,{},{revssf:{General:0}});f=\"docProps/core.xml\";zip.file(f,write_core_props(wb.Props,opts));ct.coreprops.push(f);add_rels(opts.rels,2,f,RELS.CORE_PROPS);f=\"docProps/app.xml\";if(!wb.Props)wb.Props={};wb.Props.SheetNames=wb.SheetNames;wb.Props.Worksheets=wb.SheetNames.length;zip.file(f,write_ext_props(wb.Props,opts));ct.extprops.push(f);add_rels(opts.rels,3,f,RELS.EXT_PROPS);if(wb.Custprops!==wb.Props&&keys(wb.Custprops||{}).length>0){f=\"docProps/custom.xml\";zip.file(f,write_cust_props(wb.Custprops,opts));ct.custprops.push(f);add_rels(opts.rels,4,f,RELS.CUST_PROPS)}f=\"xl/workbook.\"+wbext;zip.file(f,write_wb(wb,f,opts));ct.workbooks.push(f);add_rels(opts.rels,1,f,RELS.WB);for(rId=1;rId<=wb.SheetNames.length;++rId){f=\"xl/worksheets/sheet\"+rId+\".\"+wbext;zip.file(f,write_ws(rId-1,f,opts,wb));ct.sheets.push(f);add_rels(opts.wbrels,rId,\"worksheets/sheet\"+rId+\".\"+wbext,RELS.WS)}if(opts.Strings!=null&&opts.Strings.length>0){f=\"xl/sharedStrings.\"+wbext;zip.file(f,write_sst(opts.Strings,f,opts));ct.strs.push(f);add_rels(opts.wbrels,++rId,\"sharedStrings.\"+wbext,RELS.SST)}f=\"xl/theme/theme1.xml\";zip.file(f,write_theme(opts));ct.themes.push(f);add_rels(opts.wbrels,++rId,\"theme/theme1.xml\",RELS.THEME);f=\"xl/styles.\"+wbext;zip.file(f,write_sty(wb,f,opts));ct.styles.push(f);add_rels(opts.wbrels,++rId,\"styles.\"+wbext,RELS.STY);zip.file(\"[Content_Types].xml\",write_ct(ct,opts));zip.file(\"_rels/.rels\",write_rels(opts.rels));zip.file(\"xl/_rels/workbook.\"+wbext+\".rels\",write_rels(opts.wbrels));return zip}function firstbyte(f,o){switch((o||{}).type||\"base64\"){case\"buffer\":return f[0];case\"base64\":return Base64.decode(f.substr(0,12)).charCodeAt(0);case\"binary\":return f.charCodeAt(0);case\"array\":return f[0];default:throw new Error(\"Unrecognized type \"+o.type)}}function read_zip(data,opts){var zip,d=data;var o=opts||{};if(!o.type)o.type=has_buf&&Buffer.isBuffer(data)?\"buffer\":\"base64\";switch(o.type){case\"base64\":zip=new jszip(d,{base64:true});break;case\"binary\":case\"array\":zip=new jszip(d,{base64:false});break;case\"buffer\":zip=new jszip(d);break;case\"file\":zip=new jszip(d=_fs.readFileSync(data));break;default:throw new Error(\"Unrecognized type \"+o.type)}return parse_zip(zip,o)}function readSync(data,opts){var zip,d=data,isfile=false,n;var o=opts||{};if(!o.type)o.type=has_buf&&Buffer.isBuffer(data)?\"buffer\":\"base64\";if(o.type==\"file\"){isfile=true;o.type=\"buffer\";d=_fs.readFileSync(data)}switch(n=firstbyte(d,o)){case 208:if(isfile)o.type=\"file\";return parse_xlscfb(CFB.read(data,o),o);case 9:return parse_xlscfb(s2a(o.type===\"base64\"?Base64.decode(data):data),o);case 60:return parse_xlml(d,o);case 80:if(isfile)o.type=\"file\";return read_zip(data,opts);default:throw new Error(\"Unsupported file \"+n)}}function readFileSync(data,opts){var o=opts||{};o.type=\"file\";var wb=readSync(data,o);wb.FILENAME=data;return wb}function write_zip_type(wb,opts){var o=opts||{};style_builder=new StyleBuilder(opts);var z=write_zip(wb,o);switch(o.type){case\"base64\":return z.generate({type:\"base64\"});case\"binary\":return z.generate({type:\"string\"});case\"buffer\":return z.generate({type:\"nodebuffer\"});case\"file\":return _fs.writeFileSync(o.file,z.generate({type:\"nodebuffer\"}));default:throw new Error(\"Unrecognized type \"+o.type)}}function writeSync(wb,opts){var o=opts||{};switch(o.bookType){case\"xml\":return write_xlml(wb,o);default:return write_zip_type(wb,o)}}function writeFileSync(wb,filename,opts){var o=opts||{};o.type=\"file\";o.file=filename;switch(o.file.substr(-5).toLowerCase()){case\".xlsx\":o.bookType=\"xlsx\";break;case\".xlsm\":o.bookType=\"xlsm\";break;case\".xlsb\":o.bookType=\"xlsb\";break;default:switch(o.file.substr(-4).toLowerCase()){case\".xls\":o.bookType=\"xls\";break;case\".xml\":o.bookType=\"xml\";break}}return writeSync(wb,o)}function decode_row(rowstr){return parseInt(unfix_row(rowstr),10)-1}function encode_row(row){return\"\"+(row+1)}function fix_row(cstr){return cstr.replace(/([A-Z]|^)(\\d+)$/,\"$1$$$2\")}function unfix_row(cstr){return cstr.replace(/\\$(\\d+)$/,\"$1\")}function decode_col(colstr){var c=unfix_col(colstr),d=0,i=0;for(;i!==c.length;++i)d=26*d+c.charCodeAt(i)-64;return d-1}function encode_col(col){var s=\"\";for(++col;col;col=Math.floor((col-1)/26))s=String.fromCharCode((col-1)%26+65)+s;return s}function fix_col(cstr){return cstr.replace(/^([A-Z])/,\"$$$1\")}function unfix_col(cstr){return cstr.replace(/^\\$([A-Z])/,\"$1\")}function split_cell(cstr){return cstr.replace(/(\\$?[A-Z]*)(\\$?\\d*)/,\"$1,$2\").split(\",\")}function decode_cell(cstr){var splt=split_cell(cstr);return{c:decode_col(splt[0]),r:decode_row(splt[1])}}function encode_cell(cell){return encode_col(cell.c)+encode_row(cell.r)}function fix_cell(cstr){return fix_col(fix_row(cstr))}function unfix_cell(cstr){return unfix_col(unfix_row(cstr))}function decode_range(range){var x=range.split(\":\").map(decode_cell);return{s:x[0],e:x[x.length-1]}}function encode_range(cs,ce){if(ce===undefined||typeof ce===\"number\")return encode_range(cs.s,cs.e);if(typeof cs!==\"string\")cs=encode_cell(cs);if(typeof ce!==\"string\")ce=encode_cell(ce);return cs==ce?cs:cs+\":\"+ce}function safe_decode_range(range){var o={s:{c:0,r:0},e:{c:0,r:0}};var idx=0,i=0,cc=0;var len=range.length;for(idx=0;i<len;++i){if((cc=range.charCodeAt(i)-64)<1||cc>26)break;idx=26*idx+cc}o.s.c=--idx;for(idx=0;i<len;++i){if((cc=range.charCodeAt(i)-48)<0||cc>9)break;idx=10*idx+cc}o.s.r=--idx;if(i===len||range.charCodeAt(++i)===58){o.e.c=o.s.c;o.e.r=o.s.r;return o}for(idx=0;i!=len;++i){if((cc=range.charCodeAt(i)-64)<1||cc>26)break;idx=26*idx+cc}o.e.c=--idx;for(idx=0;i!=len;++i){if((cc=range.charCodeAt(i)-48)<0||cc>9)break;idx=10*idx+cc}o.e.r=--idx;return o}function safe_format_cell(cell,v){if(cell.z!==undefined)try{return cell.w=SSF.format(cell.z,v)}catch(e){}if(!cell.XF)return v;try{return cell.w=SSF.format(cell.XF.ifmt||0,v)}catch(e){return\"\"+v}}function format_cell(cell,v){if(cell==null||cell.t==null)return\"\";if(cell.w!==undefined)return cell.w;if(v===undefined)return safe_format_cell(cell,cell.v);return safe_format_cell(cell,v)}function sheet_to_json(sheet,opts){var val,row,range,header=0,offset=1,r,hdr=[],isempty,R,C,v;var o=opts!=null?opts:{};var raw=o.raw;if(sheet==null||sheet[\"!ref\"]==null)return[];range=o.range!==undefined?o.range:sheet[\"!ref\"];if(o.header===1)header=1;else if(o.header===\"A\")header=2;else if(Array.isArray(o.header))header=3;switch(typeof range){case\"string\":r=safe_decode_range(range);break;case\"number\":r=safe_decode_range(sheet[\"!ref\"]);r.s.r=range;break;default:r=range}if(header>0)offset=0;var rr=encode_row(r.s.r);var cols=new Array(r.e.c-r.s.c+1);var out=new Array(r.e.r-r.s.r-offset+1);var outi=0;for(C=r.s.c;C<=r.e.c;++C){cols[C]=encode_col(C);val=sheet[cols[C]+rr];switch(header){case 1:hdr[C]=C;break;case 2:hdr[C]=cols[C];break;case 3:hdr[C]=o.header[C-r.s.c];break;default:if(val===undefined)continue;hdr[C]=format_cell(val)}}for(R=r.s.r+offset;R<=r.e.r;++R){rr=encode_row(R);isempty=true;if(header===1)row=[];else{row={};if(Object.defineProperty)Object.defineProperty(row,\"__rowNum__\",{value:R,enumerable:false});else row.__rowNum__=R}for(C=r.s.c;C<=r.e.c;++C){val=sheet[cols[C]+rr];if(val===undefined||val.t===undefined)continue;v=val.v;switch(val.t){case\"e\":continue;case\"s\":break;case\"b\":case\"n\":break;default:throw\"unrecognized type \"+val.t}if(v!==undefined){row[hdr[C]]=raw?v:format_cell(val,v);isempty=false}}if(isempty===false||header===1)out[outi++]=row}out.length=outi;return out}function sheet_to_row_object_array(sheet,opts){return sheet_to_json(sheet,opts!=null?opts:{})}function sheet_to_csv(sheet,opts){var out=\"\",txt=\"\",qreg=/\"/g;var o=opts==null?{}:opts;if(sheet==null||sheet[\"!ref\"]==null)return\"\";var r=safe_decode_range(sheet[\"!ref\"]);var FS=o.FS!==undefined?o.FS:\",\",fs=FS.charCodeAt(0);var RS=o.RS!==undefined?o.RS:\"\\n\",rs=RS.charCodeAt(0);var row=\"\",rr=\"\",cols=[];var i=0,cc=0,val;var R=0,C=0;for(C=r.s.c;C<=r.e.c;++C)cols[C]=encode_col(C);for(R=r.s.r;R<=r.e.r;++R){row=\"\";rr=encode_row(R);for(C=r.s.c;C<=r.e.c;++C){val=sheet[cols[C]+rr];txt=val!==undefined?\"\"+format_cell(val):\"\";for(i=0,cc=0;i!==txt.length;++i)if((cc=txt.charCodeAt(i))===fs||cc===rs||cc===34){txt='\"'+txt.replace(qreg,'\"\"')+'\"';break}row+=(C===r.s.c?\"\":FS)+txt}out+=row+RS}return out}var make_csv=sheet_to_csv;function sheet_to_formulae(sheet){var cmds,y=\"\",x,val=\"\";if(sheet==null||sheet[\"!ref\"]==null)return\"\";var r=safe_decode_range(sheet[\"!ref\"]),rr=\"\",cols=[],C;cmds=new Array((r.e.r-r.s.r+1)*(r.e.c-r.s.c+1));var i=0;for(C=r.s.c;C<=r.e.c;++C)cols[C]=encode_col(C);for(var R=r.s.r;R<=r.e.r;++R){rr=encode_row(R);for(C=r.s.c;C<=r.e.c;++C){y=cols[C]+rr;x=sheet[y];val=\"\";if(x===undefined)continue;if(x.f!=null)val=x.f;else if(x.w!==undefined)val=\"'\"+x.w;else if(x.v===undefined)continue;else val=\"\"+x.v;cmds[i++]=y+\"=\"+val}}cmds.length=i;return cmds}var utils={encode_col:encode_col,encode_row:encode_row,encode_cell:encode_cell,encode_range:encode_range,decode_col:decode_col,decode_row:decode_row,split_cell:split_cell,decode_cell:decode_cell,decode_range:decode_range,format_cell:format_cell,get_formulae:sheet_to_formulae,make_csv:sheet_to_csv,make_json:sheet_to_json,make_formulae:sheet_to_formulae,sheet_to_csv:sheet_to_csv,sheet_to_json:sheet_to_json,sheet_to_formulae:sheet_to_formulae,sheet_to_row_object_array:sheet_to_row_object_array};var XmlNode=function(){function XmlNode(tagName,attributes,children){if(!(this instanceof XmlNode)){return new XmlNode(tagName,attributes,children)}this.tagName=tagName;this._attributes=attributes||{};this._children=children||[];this._prefix=\"\";return this}XmlNode.prototype.createElement=function(){return new XmlNode(arguments)};XmlNode.prototype.children=function(){return this._children};XmlNode.prototype.append=function(node){this._children.push(node);return this};XmlNode.prototype.prefix=function(prefix){if(arguments.length==0){return this._prefix}this._prefix=prefix;return this};XmlNode.prototype.attr=function(attr,value){if(value==undefined){delete this._attributes[attr];return this}if(arguments.length==0){return this._attributes}else if(typeof attr==\"string\"&&arguments.length==1){return this._attributes.attr[attr]}if(typeof attr==\"object\"&&arguments.length==1){for(var key in attr){this._attributes[key]=attr[key]}}else if(arguments.length==2&&typeof attr==\"string\"){this._attributes[attr]=value}return this};var APOS=\"'\";QUOTE='\"';var ESCAPED_QUOTE={};ESCAPED_QUOTE[QUOTE]=\"&quot;\";ESCAPED_QUOTE[APOS]=\"&apos;\";XmlNode.prototype.escapeAttributeValue=function(att_value){return'\"'+att_value.replace(/\\\"/g,\"&quot;\")+'\"'};XmlNode.prototype.toXml=function(node){if(!node)node=this;var xml=node._prefix;xml+=\"<\"+node.tagName;if(node._attributes){for(var key in node._attributes){xml+=\" \"+key+\"=\"+this.escapeAttributeValue(\"\"+node._attributes[key])+\"\"}}if(node._children&&node._children.length>0){xml+=\">\";for(var i=0;i<node._children.length;i++){xml+=this.toXml(node._children[i])}xml+=\"</\"+node.tagName+\">\"}else{xml+=\"/>\"}return xml};return XmlNode}();var StyleBuilder=function(options){var customNumFmtId=164;var table_fmt={0:\"General\",1:\"0\",2:\"0.00\",3:\"#,##0\",4:\"#,##0.00\",9:\"0%\",10:\"0.00%\",11:\"0.00E+00\",12:\"# ?/?\",13:\"# ??/??\",14:\"m/d/yy\",15:\"d-mmm-yy\",16:\"d-mmm\",17:\"mmm-yy\",18:\"h:mm AM/PM\",19:\"h:mm:ss AM/PM\",20:\"h:mm\",21:\"h:mm:ss\",22:\"m/d/yy h:mm\",37:\"#,##0 ;(#,##0)\",38:\"#,##0 ;[Red](#,##0)\",39:\"#,##0.00;(#,##0.00)\",40:\"#,##0.00;[Red](#,##0.00)\",45:\"mm:ss\",46:\"[h]:mm:ss\",47:\"mmss.0\",48:\"##0.0E+0\",49:\"@\",56:'\"上午/下午 \"hh\"時\"mm\"分\"ss\"秒 \"'};var fmt_table={};for(var idx in table_fmt){fmt_table[table_fmt[idx]]=idx}_hashIndex={};_listIndex=[];return{initialize:function(options){this.$fonts=XmlNode(\"fonts\").attr(\"count\",0).attr(\"x14ac:knownFonts\",\"1\");this.$fills=XmlNode(\"fills\").attr(\"count\",0);this.$borders=XmlNode(\"borders\").attr(\"count\",0);this.$numFmts=XmlNode(\"numFmts\").attr(\"count\",0);this.$cellStyleXfs=XmlNode(\"cellStyleXfs\");this.$xf=XmlNode(\"xf\").attr(\"numFmtId\",0).attr(\"fontId\",0).attr(\"fillId\",0).attr(\"borderId\",0);this.$cellXfs=XmlNode(\"cellXfs\").attr(\"count\",0);this.$cellStyles=XmlNode(\"cellStyles\").append(XmlNode(\"cellStyle\").attr(\"name\",\"Normal\").attr(\"xfId\",0).attr(\"builtinId\",0));this.$dxfs=XmlNode(\"dxfs\").attr(\"count\",\"0\");this.$tableStyles=XmlNode(\"tableStyles\").attr(\"count\",\"0\").attr(\"defaultTableStyle\",\"TableStyleMedium9\").attr(\"defaultPivotStyle\",\"PivotStyleMedium4\");this.$styles=XmlNode(\"styleSheet\").attr(\"xmlns:mc\",\"http://schemas.openxmlformats.org/markup-compatibility/2006\").attr(\"xmlns:x14ac\",\"http://schemas.microsoft.com/office/spreadsheetml/2009/9/ac\").attr(\"xmlns\",\"http://schemas.openxmlformats.org/spreadsheetml/2006/main\").attr(\"mc:Ignorable\",\"x14ac\").prefix('<?xml version=\"1.0\" encoding=\"UTF-8\" standalone=\"yes\"?>').append(this.$numFmts).append(this.$fonts).append(this.$fills).append(this.$borders).append(this.$cellStyleXfs.append(this.$xf)).append(this.$cellXfs).append(this.$cellStyles).append(this.$dxfs).append(this.$tableStyles);var defaultStyle=options.defaultCellStyle||{};if(!defaultStyle.font)defaultStyle.font={name:\"Calibri\",sz:\"12\"};if(!defaultStyle.font.name)defaultStyle.font.name=\"Calibri\";if(!defaultStyle.font.sz)defaultStyle.font.sz=11;if(!defaultStyle.fill)defaultStyle.fill={patternType:\"none\",fgColor:{}};if(!defaultStyle.border)defaultStyle.border={};if(!defaultStyle.numFmt)defaultStyle.numFmt=0;this.defaultStyle=defaultStyle;var gray125Style=JSON.parse(JSON.stringify(defaultStyle));gray125Style.fill={patternType:\"gray125\",fgColor:{}};this.addStyles([defaultStyle,gray125Style]);return this},addStyle:function(attributes){var hashKey=JSON.stringify(attributes);var index=_hashIndex[hashKey];if(index==undefined){index=this._addXf(attributes);_hashIndex[hashKey]=index}else{index=_hashIndex[hashKey]}return index},addStyles:function(styles){var self=this;return styles.map(function(style){return self.addStyle(style)})},_duckTypeStyle:function(attributes){if(typeof attributes==\"object\"&&(attributes.patternFill||attributes.fgColor)){return{fill:attributes}}else if(attributes.font||attributes.numFmt||attributes.border||attributes.fill){return attributes}else{return this._getStyleCSS(attributes)}},_getStyleCSS:function(css){return css},_addXf:function(attributes){var fontId=this._addFont(attributes.font);var fillId=this._addFill(attributes.fill);var borderId=this._addBorder(attributes.border);var numFmtId=this._addNumFmt(attributes.numFmt);var $xf=XmlNode(\"xf\").attr(\"numFmtId\",numFmtId).attr(\"fontId\",fontId).attr(\"fillId\",fillId).attr(\"borderId\",borderId).attr(\"xfId\",\"0\");if(fontId>0){$xf.attr(\"applyFont\",\"1\")}if(fillId>0){$xf.attr(\"applyFill\",\"1\")}if(borderId>0){$xf.attr(\"applyBorder\",\"1\")}if(numFmtId>0){$xf.attr(\"applyNumberFormat\",\"1\")}if(attributes.alignment){var $alignment=XmlNode(\"alignment\");if(attributes.alignment.horizontal){$alignment.attr(\"horizontal\",attributes.alignment.horizontal)}if(attributes.alignment.vertical){$alignment.attr(\"vertical\",attributes.alignment.vertical)}if(attributes.alignment.indent){$alignment.attr(\"indent\",attributes.alignment.indent)}if(attributes.alignment.readingOrder){$alignment.attr(\"readingOrder\",attributes.alignment.readingOrder)}if(attributes.alignment.wrapText){$alignment.attr(\"wrapText\",attributes.alignment.wrapText)}if(attributes.alignment.textRotation!=undefined){$alignment.attr(\"textRotation\",attributes.alignment.textRotation)}$xf.append($alignment).attr(\"applyAlignment\",1);\n}this.$cellXfs.append($xf);var count=+this.$cellXfs.children().length;this.$cellXfs.attr(\"count\",count);return count-1},_addFont:function(attributes){if(!attributes){return 0}var $font=XmlNode(\"font\").append(XmlNode(\"sz\").attr(\"val\",attributes.sz||this.defaultStyle.font.sz)).append(XmlNode(\"name\").attr(\"val\",attributes.name||this.defaultStyle.font.name));if(attributes.bold)$font.append(XmlNode(\"b\"));if(attributes.underline)$font.append(XmlNode(\"u\"));if(attributes.italic)$font.append(XmlNode(\"i\"));if(attributes.strike)$font.append(XmlNode(\"strike\"));if(attributes.outline)$font.append(XmlNode(\"outline\"));if(attributes.shadow)$font.append(XmlNode(\"shadow\"));if(attributes.vertAlign){$font.append(XmlNode(\"vertAlign\").attr(\"val\",attributes.vertAlign))}if(attributes.color){if(attributes.color.theme){$font.append(XmlNode(\"color\").attr(\"theme\",attributes.color.theme));if(attributes.color.tint){$font.append(XmlNode(\"tint\").attr(\"theme\",attributes.color.tint))}}else if(attributes.color.rgb){$font.append(XmlNode(\"color\").attr(\"rgb\",attributes.color.rgb))}}this.$fonts.append($font);var count=this.$fonts.children().length;this.$fonts.attr(\"count\",count);return count-1},_addNumFmt:function(numFmt){if(!numFmt){return 0}if(typeof numFmt==\"string\"){var numFmtIdx=fmt_table[numFmt];if(numFmtIdx>=0){return numFmtIdx}}if(/^[0-9]+$/.exec(numFmt)){return numFmt}numFmt=numFmt.replace(/&/g,\"&amp;\").replace(/</g,\"&lt;\").replace(/>/g,\"&gt;\").replace(/\"/g,\"&quot;\").replace(/'/g,\"&apos;\");var $numFmt=XmlNode(\"numFmt\").attr(\"numFmtId\",++customNumFmtId).attr(\"formatCode\",numFmt);this.$numFmts.append($numFmt);var count=this.$numFmts.children().length;this.$numFmts.attr(\"count\",count);return customNumFmtId},_addFill:function(attributes){if(!attributes){return 0}var $patternFill=XmlNode(\"patternFill\").attr(\"patternType\",attributes.patternType||\"solid\");if(attributes.fgColor){var $fgColor=XmlNode(\"fgColor\");if(attributes.fgColor.rgb){if(attributes.fgColor.rgb.length==6){attributes.fgColor.rgb=\"FF\"+attributes.fgColor.rgb}$fgColor.attr(\"rgb\",attributes.fgColor.rgb);$patternFill.append($fgColor)}else if(attributes.fgColor.theme){$fgColor.attr(\"theme\",attributes.fgColor.theme);if(attributes.fgColor.tint){$fgColor.attr(\"tint\",attributes.fgColor.tint)}$patternFill.append($fgColor)}if(!attributes.bgColor){attributes.bgColor={indexed:\"64\"}}}if(attributes.bgColor){var $bgColor=XmlNode(\"bgColor\").attr(attributes.bgColor);$patternFill.append($bgColor)}var $fill=XmlNode(\"fill\").append($patternFill);this.$fills.append($fill);var count=this.$fills.children().length;this.$fills.attr(\"count\",count);return count-1},_getSubBorder:function(direction,spec){var $direction=XmlNode(direction);if(spec){if(spec.style)$direction.attr(\"style\",spec.style);if(spec.color){var $color=XmlNode(\"color\");if(spec.color.auto){$color.attr(\"auto\",spec.color.auto)}else if(spec.color.rgb){$color.attr(\"rgb\",spec.color.rgb)}else if(spec.color.theme||spec.color.tint){$color.attr(\"theme\",spec.color.theme||\"1\");$color.attr(\"tint\",spec.color.tint||\"0\")}$direction.append($color)}}return $direction},_addBorder:function(attributes){if(!attributes){return 0}var self=this;var $border=XmlNode(\"border\").attr(\"diagonalUp\",attributes.diagonalUp).attr(\"diagonalDown\",attributes.diagonalDown);var directions=[\"left\",\"right\",\"top\",\"bottom\",\"diagonal\"];directions.forEach(function(direction){$border.append(self._getSubBorder(direction,attributes[direction]))});this.$borders.append($border);var count=this.$borders.children().length;this.$borders.attr(\"count\",count);return count-1},toXml:function(){return this.$styles.toXml()}}.initialize(options||{})};XLSX.parse_xlscfb=parse_xlscfb;XLSX.parse_zip=parse_zip;XLSX.read=readSync;XLSX.readFile=readFileSync;XLSX.readFileSync=readFileSync;XLSX.write=writeSync;XLSX.writeFile=writeFileSync;XLSX.writeFileSync=writeFileSync;XLSX.utils=utils;XLSX.CFB=CFB;XLSX.SSF=SSF})(typeof exports!==\"undefined\"?exports:XLSX);var XLS=XLSX;\n"

        /***/
    },
/* 92 */
/***/ function (module, exports, __webpack_require__) {

        var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/* FileSaver.js
	 * A saveAs() FileSaver implementation.
	 * 1.1.20150716
	 *
	 * By Eli Grey, http://eligrey.com
	 * License: X11/MIT
	 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
	 */

        /*global self */
        /*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

        /*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

        var saveAs = saveAs || (function (view) {
            "use strict";
            // IE <10 is explicitly unsupported
            if (typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
                return;
            }
            var
                doc = view.document
                // only get URL when necessary in case Blob.js hasn't overridden it yet
                , get_URL = function () {
                    return view.URL || view.webkitURL || view;
                }
                , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
                , can_use_save_link = "download" in save_link
                , click = function (node) {
                    var event = new MouseEvent("click");
                    node.dispatchEvent(event);
                }
                , webkit_req_fs = view.webkitRequestFileSystem
                , req_fs = view.requestFileSystem || webkit_req_fs || view.mozRequestFileSystem
                , throw_outside = function (ex) {
                    (view.setImmediate || view.setTimeout)(function () {
                        throw ex;
                    }, 0);
                }
                , force_saveable_type = "application/octet-stream"
                , fs_min_size = 0
                // See https://code.google.com/p/chromium/issues/detail?id=375297#c7 and
                // https://github.com/eligrey/FileSaver.js/commit/485930a#commitcomment-8768047
                // for the reasoning behind the timeout and revocation flow
                , arbitrary_revoke_timeout = 500 // in ms
                , revoke = function (file) {
                    var revoker = function () {
                        if (typeof file === "string") { // file is an object URL
                            get_URL().revokeObjectURL(file);
                        } else { // file is a File
                            file.remove();
                        }
                    };
                    if (view.chrome) {
                        revoker();
                    } else {
                        setTimeout(revoker, arbitrary_revoke_timeout);
                    }
                }
                , dispatch = function (filesaver, event_types, event) {
                    event_types = [].concat(event_types);
                    var i = event_types.length;
                    while (i--) {
                        var listener = filesaver["on" + event_types[i]];
                        if (typeof listener === "function") {
                            try {
                                listener.call(filesaver, event || filesaver);
                            } catch (ex) {
                                throw_outside(ex);
                            }
                        }
                    }
                }
                , auto_bom = function (blob) {
                    // prepend BOM for UTF-8 XML and text/* types (including HTML)
                    if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                        return new Blob(["\ufeff", blob], { type: blob.type });
                    }
                    return blob;
                }
                , FileSaver = function (blob, name, no_auto_bom) {
                    if (!no_auto_bom) {
                        blob = auto_bom(blob);
                    }
                    // First try a.download, then web filesystem, then object URLs
                    var
                        filesaver = this
                        , type = blob.type
                        , blob_changed = false
                        , object_url
                        , target_view
                        , dispatch_all = function () {
                            dispatch(filesaver, "writestart progress write writeend".split(" "));
                        }
                        // on any filesys errors revert to saving with object URLs
                        , fs_error = function () {
                            // don't create more object URLs than needed
                            if (blob_changed || !object_url) {
                                object_url = get_URL().createObjectURL(blob);
                            }
                            if (target_view) {
                                target_view.location.href = object_url;
                            } else {
                                var new_tab = view.open(object_url, "_blank");
                                if (new_tab == undefined && typeof safari !== "undefined") {
                                    //Apple do not allow window.open, see http://bit.ly/1kZffRI
                                    view.location.href = object_url
                                }
                            }
                            filesaver.readyState = filesaver.DONE;
                            dispatch_all();
                            revoke(object_url);
                        }
                        , abortable = function (func) {
                            return function () {
                                if (filesaver.readyState !== filesaver.DONE) {
                                    return func.apply(this, arguments);
                                }
                            };
                        }
                        , create_if_not_found = { create: true, exclusive: false }
                        , slice
                        ;
                    filesaver.readyState = filesaver.INIT;
                    if (!name) {
                        name = "download";
                    }
                    if (can_use_save_link) {
                        object_url = get_URL().createObjectURL(blob);
                        save_link.href = object_url;
                        save_link.download = name;
                        setTimeout(function () {
                            click(save_link);
                            dispatch_all();
                            revoke(object_url);
                            filesaver.readyState = filesaver.DONE;
                        });
                        return;
                    }
                    // Object and web filesystem URLs have a problem saving in Google Chrome when
                    // viewed in a tab, so I force save with application/octet-stream
                    // http://code.google.com/p/chromium/issues/detail?id=91158
                    // Update: Google errantly closed 91158, I submitted it again:
                    // https://code.google.com/p/chromium/issues/detail?id=389642
                    if (view.chrome && type && type !== force_saveable_type) {
                        slice = blob.slice || blob.webkitSlice;
                        blob = slice.call(blob, 0, blob.size, force_saveable_type);
                        blob_changed = true;
                    }
                    // Since I can't be sure that the guessed media type will trigger a download
                    // in WebKit, I append .download to the filename.
                    // https://bugs.webkit.org/show_bug.cgi?id=65440
                    if (webkit_req_fs && name !== "download") {
                        name += ".download";
                    }
                    if (type === force_saveable_type || webkit_req_fs) {
                        target_view = view;
                    }
                    if (!req_fs) {
                        fs_error();
                        return;
                    }
                    fs_min_size += blob.size;
                    req_fs(view.TEMPORARY, fs_min_size, abortable(function (fs) {
                        fs.root.getDirectory("saved", create_if_not_found, abortable(function (dir) {
                            var save = function () {
                                dir.getFile(name, create_if_not_found, abortable(function (file) {
                                    file.createWriter(abortable(function (writer) {
                                        writer.onwriteend = function (event) {
                                            target_view.location.href = file.toURL();
                                            filesaver.readyState = filesaver.DONE;
                                            dispatch(filesaver, "writeend", event);
                                            revoke(file);
                                        };
                                        writer.onerror = function () {
                                            var error = writer.error;
                                            if (error.code !== error.ABORT_ERR) {
                                                fs_error();
                                            }
                                        };
                                        "writestart progress write abort".split(" ").forEach(function (event) {
                                            writer["on" + event] = filesaver["on" + event];
                                        });
                                        writer.write(blob);
                                        filesaver.abort = function () {
                                            writer.abort();
                                            filesaver.readyState = filesaver.DONE;
                                        };
                                        filesaver.readyState = filesaver.WRITING;
                                    }), fs_error);
                                }), fs_error);
                            };
                            dir.getFile(name, { create: false }, abortable(function (file) {
                                // delete file if it already exists
                                file.remove();
                                save();
                            }), abortable(function (ex) {
                                if (ex.code === ex.NOT_FOUND_ERR) {
                                    save();
                                } else {
                                    fs_error();
                                }
                            }));
                        }), fs_error);
                    }), fs_error);
                }
                , FS_proto = FileSaver.prototype
                , saveAs = function (blob, name, no_auto_bom) {
                    return new FileSaver(blob, name, no_auto_bom);
                }
                ;
            // IE 10+ (native saveAs)
            if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
                return function (blob, name, no_auto_bom) {
                    if (!no_auto_bom) {
                        blob = auto_bom(blob);
                    }
                    return navigator.msSaveOrOpenBlob(blob, name || "download");
                };
            }

            FS_proto.abort = function () {
                var filesaver = this;
                filesaver.readyState = filesaver.DONE;
                dispatch(filesaver, "abort");
            };
            FS_proto.readyState = FS_proto.INIT = 0;
            FS_proto.WRITING = 1;
            FS_proto.DONE = 2;

            FS_proto.error =
                FS_proto.onwritestart =
                FS_proto.onprogress =
                FS_proto.onwrite =
                FS_proto.onabort =
                FS_proto.onerror =
                FS_proto.onwriteend =
                null;

            return saveAs;
        }(
            typeof self !== "undefined" && self
            || typeof window !== "undefined" && window
            || this.content
        ));
        // `self` is undefined in Firefox for Android content script context
        // while `this` is nsIContentFrameMessageManager
        // with an attribute `content` that corresponds to the window

        if (typeof module !== "undefined" && module.exports) {
            module.exports.saveAs = saveAs;
        } else if (("function" !== "undefined" && __webpack_require__(93) !== null) && (__webpack_require__(94) != null)) {
            !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function () {
                return saveAs;
            }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
        }


        /***/
    },
/* 93 */
/***/ function (module, exports) {

        module.exports = function () { throw new Error("define cannot be used indirect"); };


        /***/
    },
/* 94 */
/***/ function (module, exports) {

	/* WEBPACK VAR INJECTION */(function (__webpack_amd_options__) {
            module.exports = __webpack_amd_options__;

            /* WEBPACK VAR INJECTION */
        }.call(exports, {}))

        /***/
    },
/* 95 */
/***/ function (module, exports, __webpack_require__) {

        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _from = __webpack_require__(70);

        var _from2 = _interopRequireDefault(_from);

        exports.default = tableToData;

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        /**
         * Calculates the cells and its rowspans and colspans of a table.
         *
         * `cells` is a 2-d array containing the HTMLTableCellElement cells.
         * Rowspans and Colspans are indicated as `null` values.
         *
         * Rowspans and Colspans are also saved in `ranges`.
         * An element contains the start and end position of a rowspan or
         * colspan like { s: { r: 1, c: 1 }, e: { r:1, c: 4} }.
         *
         * @param {HTMLTableElment} table - The table.
         * @returns { { cells: Array, ranges: Array } } - The table object.
         */
        function tableToData(table) {
            var cells = [];
            var ranges = [];

            // iterate over all rows
            (0, _from2.default)(table.querySelectorAll('tr')).forEach(function (row, rowIndex) {
                cells.push([]);

                // iterate over all cells in the row
                (0, _from2.default)(row.querySelectorAll('td, th')).filter(function (cell) {
                    return cell.style.display !== 'none';
                }).forEach(function (cell) {
                    ranges.forEach(function (range) {
                        if ( // we are in a rowspan (already saved in ranges)
                            rowIndex >= range.s.r && rowIndex <= range.e.r && cells[rowIndex].length >= range.s.c && cells[rowIndex].length <= range.e.c) {
                            // ... fill the cells with empty values
                            for (var i = range.s.c; i <= range.e.c; i++) {
                                cells[rowIndex].push(null);
                            }
                        }
                    });

                    // detect rowspan or colspan
                    var colspan = parseInt(cell.colSpan, 10) || 1;
                    var rowspan = parseInt(cell.rowSpan, 10) || 1;

                    if (rowspan > 1 || colspan > 1) {
                        ranges.push({
                            s: {
                                r: rowIndex,
                                c: cells[rowIndex].length
                            },
                            e: {
                                r: rowIndex + rowspan - 1,
                                c: cells[rowIndex].length + colspan - 1
                            }
                        });
                    }

                    cells[rowIndex].push(cell);

                    // if we are in a following colspan ...
                    if (colspan > 1) {
                        for (var i = 1; i < colspan; i++) {
                            cells[rowIndex].push(null);
                        }
                    }
                });
            });

            //fill cell for common elements at the edges
            cells.forEach(function (row, rowIndex) {
                "use strict";

                ranges.forEach(function (range) {
                    if (rowIndex >= range.s.r && rowIndex <= range.e.r && cells[rowIndex].length <= range.s.c) {
                        for (var i = range.s.c; i <= range.e.c; i++) {
                            cells[rowIndex].push(null);
                        }
                    }
                });
            });

            return { cells: cells, ranges: ranges };
        }

        /***/
    },
/* 96 */
/***/ function (module, exports, __webpack_require__) {

        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = dataToWorksheet;

        var _encodeCell = __webpack_require__(97);

        var _cellToObject = __webpack_require__(98);

        var _cellToObject2 = _interopRequireDefault(_cellToObject);

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        /**
         * Returns the XLSX-Worksheet object given the data of a
         * table calculated by `tableToData`.
         *
         * @param {object} data - The data calculated by `tableToData`.
         * @param {array} typeHandlers - The registered cell type handlers.
         *
         * @returns {object} - XLSX-Worksheet object.
         */
        function dataToWorksheet(data, typeHandlers) {
            var cells = data.cells,
                ranges = data.ranges;


            var lastColumn = 0;
            // convert cells array to an object by iterating over all rows
            var worksheet = cells.reduce(function (sheet, row, rowIndex) {
                // iterate over all row cells
                row.forEach(function (cell, columnIndex) {
                    lastColumn = Math.max(lastColumn, columnIndex);

                    // convert the row and column indices to a XLSX index
                    var ref = (0, _encodeCell.encodeCell)({
                        c: columnIndex,
                        r: rowIndex
                    });

                    // only save actual cells and convert them to XLSX-Cell objects
                    if (cell) {
                        sheet[ref] = (0, _cellToObject2.default)(cell, typeHandlers);
                    } else {
                        sheet[ref] = { t: 's', v: '' };
                    }
                });

                return sheet;
            }, {});

            // calculate last table index (bottom right)
            var lastRef = (0, _encodeCell.encodeCell)({
                c: lastColumn,
                r: cells.length - 1
            });

            // add last table index and ranges to the worksheet
            worksheet['!ref'] = 'A1:' + lastRef;
            worksheet['!merges'] = ranges;
            worksheet['!cols'] = [];

            var cols = {};
            for (var i = 0; i <= cells[0].length; i++) {
                cols['cell' + i] = false;
            }

            cells.reduce(function (sheet, row, rowIndex) {
                // iterate over all row cells
                row.forEach(function (cell, columnIndex) {

                    if (cell) {
                        var colspan = parseInt(cell.colSpan, 10) || 1;
                        if (colspan == 1 && !cols['cell' + columnIndex]) {
                            cols['cell' + columnIndex] = {
                                wpx: cell.offsetWidth
                            };
                        }
                    }
                });
            }, {});

            for (var key in cols) {
                if (cols[key]) {
                    worksheet['!cols'].push(cols[key]);
                } else {
                    worksheet['!cols'].push(null);
                }
            }
            return worksheet;
        }

        /***/
    },
/* 97 */
/***/ function (module, exports) {

        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.encodeCell = encodeCell;
        exports.encodeRange = encodeRange;
        function encodeCol(col) {
            var result = '';
            var i = col + 1;

            while (i > 0) {
                result = String.fromCharCode((i - 1) % 26 + 65) + result;
                i = Math.floor((i - 1) / 26);
            }

            return result;
        }

        function encodeRow(row) {
            return (row + 1).toString();
        }

        function encodeCell(cell) {
            return encodeCol(cell.c) + encodeRow(cell.r);
        }

        function encodeRange(range) {
            return encodeCell(range.s) + ':' + encodeCell(range.e);
        }

        /***/
    },
/* 98 */
/***/ function (module, exports) {

        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.default = cellToObject;
        /**
         * Converts a HTMLTableCellElement to an XLSX-Cell object.
         * Output varies on detected content of the cell calculated by
         * the `typeHandlers`.
         *
         * @param {HTMLTableCellElement} cell - The cell.
         * @param {array} typeHandlers - The registered cell type handlers.
         *
         * @returns {object} - The cell object.
         */
        function cellToObject(cell, typeHandlers) {
            var cellObject = null;
            var text = cell.textContent.trim() || '';

            // custom handlers
            typeHandlers.some(function (typeHandler) {
                return cellObject = typeHandler(cell, text);
            });

            // default handler
            if (!cellObject) cellObject = { t: 's', v: text };

            // styling
            if (cell.tagName === 'TH' && !cellObject.s) {
                cellObject.s = { font: { bold: true } };
            }

            return cellObject;
        }

        /***/
    },
/* 99 */
/***/ function (module, exports) {

        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });
        exports.decodeCell = decodeCell;
        exports.decodeRange = decodeRange;
        function decodeCol(col) {
            var parseCol = col.match(/[a-zA-Z]+/)[0],
                pow = 1,
                res = 0;

            for (var i = 0, len = parseCol.length; i < len; i++) {
                res += (parseCol[i].charCodeAt(0) - 64) * pow;
                pow *= 25;
            }
            return res - 1;
        }

        function decodeRow(row) {
            return row.match(/[0-9]+/)[0];
        }

        function decodeCell(cell) {
            return {
                'c': decodeCol(cell),
                'r': decodeRow(cell) - 1
            };
        }

        function decodeRange(range) {
            var arRange = range.split(new RegExp('\:'));

            return {
                s: {
                    'c': decodeCol(arRange[0]),
                    'r': decodeRow(arRange[0]) - 1
                },
                e: {
                    'c': decodeCol(arRange[1]),
                    'r': decodeRow(arRange[1]) - 1
                }
            };
        }

        /***/
    },
/* 100 */
/***/ function (module, exports, __webpack_require__) {

        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        var _typeof2 = __webpack_require__(2);

        var _typeof3 = _interopRequireDefault(_typeof2);

        var _from = __webpack_require__(70);

        var _from2 = _interopRequireDefault(_from);

        function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

        /**
         * Generates a cell object for a list cell.
         *
         * @param {HTMLTableCellElement} cell - The cell.
         *
         * @returns {object} - A cell object of the cell or `null` if the cell doesn't
         * fulfill the criteria of an input field cell.
         */
        exports.default = function (cell) {
            var list = cell.querySelector('ul, ol');

            if (list) {
                var _ret = function () {
                    var string = '';
                    var items = (0, _from2.default)(list.querySelectorAll('li'));

                    items.forEach(function (item, index) {
                        string += item.textContent;
                        string += index < items.length - 1 ? ', ' : '';
                    });

                    return {
                        v: { t: 's', v: string }
                    };
                }();

                if ((typeof _ret === 'undefined' ? 'undefined' : (0, _typeof3.default)(_ret)) === "object") return _ret.v;
            }

            return null;
        };

        /***/
    },
/* 101 */
/***/ function (module, exports) {

        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        /**
         * Generates a cell object for a number cell.
         *
         * @param {HTMLTableCellElement} cell - The cell.
         * @param {string} text - The text of the cell.
         *
         * @returns {object} - A cell object of the cell or `null` if the cell doesn't
         * fulfill the criteria of a number cell.
         */
        exports.default = function (cell, text) {
            if (text.length > 0 && !isNaN(text)) return { t: 'n', v: text };

            return null;
        };

        /***/
    },
/* 102 */
/***/ function (module, exports) {

        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        /**
         * Generates a cell object for a date cell.
         *
         * @param {HTMLTableCellElement} cell - The cell.
         * @param {string} text - The text of the cell.
         *
         * @returns {object} - A cell object of the cell or `null` if the cell doesn't
         * fulfill the criteria of a date cell.
         */
        exports.default = function (cell, text) {
            function getValue(date) {
                var offset = new Date().getTimezoneOffset() * 60000;
                return new Date(date - offset).toISOString();
            }

            var timestamp = cell.getAttribute('data-timestamp');
            if (timestamp) {
                return { t: 'd', v: getValue(new Date(parseInt(timestamp, 10))) };
            }

            var date = new Date(text);
            if (!isNaN(date)) return { t: 'd', v: getValue(date) };

            return null;
        };

        /***/
    },
/* 103 */
/***/ function (module, exports) {

        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        /**
         * Generates a cell object for an input field cell.
         *
         * @param {HTMLTableCellElement} cell - The cell.
         *
         * @returns {object} - A cell object of the cell or `null` if the cell doesn't
         * fulfill the criteria of an input field cell.
         */
        exports.default = function (cell) {
            var input = cell.querySelector('input[type="text"], textarea');
            if (input) return { t: 's', v: input.value };

            input = cell.querySelector('select');
            if (input) return { t: 's', v: input.options[input.selectedIndex].textContent };

            return null;
        };

        /***/
    },
/* 104 */
/***/ function (module, exports) {

        'use strict';

        Object.defineProperty(exports, "__esModule", {
            value: true
        });

        /**
         * Generates a cell object for a boolean cell.
         *
         * @param {HTMLTableCellElement} cell - The cell.
         *
         * @returns {object} - A cell object of the cell or `null` if the cell doesn't
         * fulfill the criteria of an input field cell.
         */
        exports.default = function (cell, text) {
            if (text === 'true' || text === 'false') {
                return { t: 'b', v: !!text };
            }

            var option = cell.querySelector('input[type="checkbox"], input[type="radio"]');
            if (option && text === '') {
                return { t: 'b', v: option.checked };
            }

            return null;
        };

        /***/
    }
/******/]);