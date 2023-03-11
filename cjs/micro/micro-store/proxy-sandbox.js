"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProxySandbox = void 0;
var tslib_1 = require("tslib");
var rxjs_1 = require("rxjs");
var docProxyMethod = ['querySelectorAll', 'getElementById'];
var ProxySandbox = /** @class */ (function () {
    function ProxySandbox(microManage, staticAssets) {
        this.microManage = microManage;
        this.staticAssets = staticAssets;
        this.loaderStyleSubject = new rxjs_1.Subject();
    }
    ProxySandbox.prototype.createShanbox = function (shadow) {
        var _document = new Proxy(document, this.propProxy(this.docProxy(shadow)));
        var _window = new Proxy(window, this.propProxy({ document: _document }));
        return { window: _window, document: _document };
    };
    ProxySandbox.prototype.linkToStyle = function (link) {
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var href, text, style;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        href = link.getAttribute('href') || '';
                        link.href = URL.createObjectURL(new Blob(['']));
                        if (!(!this.staticAssets.links.includes(href) && href)) return [3 /*break*/, 2];
                        return [4 /*yield*/, (0, rxjs_1.lastValueFrom)(this.microManage.la.fetchStatic(href))];
                    case 1:
                        text = _a.sent();
                        style = document.createElement('style');
                        style.innerText = text;
                        this.loaderStyleSubject.next(style);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    ProxySandbox.prototype.appendChild = function (node) {
        var _a;
        return tslib_1.__awaiter(this, void 0, void 0, function () {
            var name;
            return tslib_1.__generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        name = node.nodeName;
                        if (!(name === 'LINK')) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.linkToStyle(node)];
                    case 1:
                        _b.sent();
                        _b.label = 2;
                    case 2: return [2 /*return*/, name === 'STYLE' ? (_a = this.loaderStyleSubject) === null || _a === void 0 ? void 0 : _a.next(node) : document.head.append(node)];
                }
            });
        });
    };
    ProxySandbox.prototype.docProxy = function (shadow) {
        var shadowProxy = {};
        var head = (shadow === null || shadow === void 0 ? void 0 : shadow.querySelector("[data-app=\"head\"]")) || document.head;
        var body = (shadow === null || shadow === void 0 ? void 0 : shadow.querySelector("[data-app=\"body\"]")) || document.body;
        var _head = new Proxy(head, this.propProxy({ appendChild: this.appendChild.bind(this) }));
        var querySelector = this.querySelector(_head, body, shadow);
        shadow && docProxyMethod.forEach(function (key) {
            var method = shadow[key];
            shadowProxy[key] = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                return method.apply(shadow, args);
            };
        });
        return tslib_1.__assign(tslib_1.__assign({ body: body, head: _head }, shadowProxy), { querySelector: querySelector });
    };
    ProxySandbox.prototype.querySelector = function (head, body, shadow) {
        if (shadow === void 0) { shadow = document; }
        var regExp = /^(styleLoaderInsert:[^:]+::shadow|head)$/g;
        return function (selectors) {
            if (regExp.test(selectors))
                return head;
            if (selectors === 'body')
                return body;
            return shadow.querySelector(selectors);
        };
    };
    ProxySandbox.prototype.propProxy = function (proxy) {
        var _this = this;
        return {
            get: function (target, prop) { return proxy[prop] ? proxy[prop] : _this.bindMethod(target, prop); },
            set: function (target, prop, value) { return proxy[prop] = value; }
        };
    };
    ProxySandbox.prototype.bindMethod = function (target, props) {
        var attr = Reflect.get(target, props);
        return typeof attr === 'function' && !(attr === null || attr === void 0 ? void 0 : attr.prototype) ? function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return attr.apply(target, args);
        } : attr;
    };
    return ProxySandbox;
}());
exports.ProxySandbox = ProxySandbox;