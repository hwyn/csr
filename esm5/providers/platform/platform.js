import { __assign, __awaiter, __generator, __rest, __spreadArray } from "tslib";
import { Injector, INJECTOR_SCOPE } from '@fm/di';
import { APP_CONTEXT, AppContextService, HISTORY, HTTP_INTERCEPTORS, HttpHandler, HttpInterceptingHandler, JsonConfigService } from '@fm/core';
import { IMPORT_MICRO } from '../../token';
import { AppContextService as ClientAppContextService } from '../app-context';
import { JsonConfigService as ClientJsonConfigService, JsonIntercept } from '../json-config';
var Platform = /** @class */ (function () {
    function Platform(platformInjector, _a) {
        var isMicro = _a.isMicro, resource = _a.resource;
        this.platformInjector = platformInjector;
        this.resource = resource;
        this.isMicro = isMicro;
    }
    Platform.prototype.bootstrapRender = function (additionalProviders, render) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, providers, _render, injector;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.parseParams(additionalProviders, render), providers = _a[0], _render = _a[1];
                        return [4 /*yield*/, this.importMicro(providers)];
                    case 1:
                        _b.sent();
                        injector = this.beforeBootstrapRender({ useMicroManage: function () { return injector.get(IMPORT_MICRO); } }, providers);
                        return [4 /*yield*/, _render(injector)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    Platform.prototype.bootstrapMicroRender = function (additionalProviders, render, options) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, providers, _render, __options, microManage, head, body, _options, microConfig, injector, unRender;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this.parseParams(additionalProviders, render, options), providers = _a[0], _render = _a[1], __options = _a[2];
                        microManage = __options.microManage, head = __options.head, body = __options.body, _options = __rest(__options, ["microManage", "head", "body"]);
                        microConfig = { container: body, styleContainer: head, useMicroManage: function () { return microManage; } };
                        injector = this.beforeBootstrapRender(microConfig, providers);
                        return [4 /*yield*/, _render(injector, _options)];
                    case 1:
                        unRender = _b.sent();
                        return [2 /*return*/, function (_container) {
                                unRender(_container);
                                injector.destroy();
                                _this.platformInjector.destroy();
                            }];
                }
            });
        });
    };
    Platform.prototype.beforeBootstrapRender = function (context, providers) {
        if (context === void 0) { context = {}; }
        if (providers === void 0) { providers = []; }
        var container = document.getElementById('app');
        var styleContainer = document.head;
        var appContext = __assign({ container: container, styleContainer: styleContainer, renderSSR: true, resource: this.resource, isMicro: this.isMicro }, context);
        var additionalProviders = [
            { provide: HTTP_INTERCEPTORS, multi: true, useExisting: JsonIntercept },
            { provide: INJECTOR_SCOPE, useValue: 'root' },
            { provide: APP_CONTEXT, useValue: appContext },
            { provide: HttpHandler, useExisting: HttpInterceptingHandler },
            { provide: JsonConfigService, useExisting: ClientJsonConfigService },
            { provide: AppContextService, useExisting: ClientAppContextService },
            this.regeditHistory() || [],
            providers
        ];
        return Injector.create(additionalProviders, this.platformInjector);
    };
    Platform.prototype.importMicro = function (providers) {
        return __awaiter(this, void 0, void 0, function () {
            var importMicro, MicroManage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        importMicro = this.platformInjector.get(IMPORT_MICRO);
                        if (!importMicro) return [3 /*break*/, 2];
                        return [4 /*yield*/, importMicro];
                    case 1:
                        MicroManage = (_a.sent()).MicroManage;
                        providers.push({ provide: IMPORT_MICRO, useExisting: MicroManage });
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    Platform.prototype.regeditHistory = function () {
        var _this = this;
        if (this.platformInjector.get(HISTORY)) {
            var factory = function (injector) {
                var historyKey = HISTORY.toString();
                var _a = injector.get(AppContextService).microManage, _b = _a === void 0 ? {} : _a, _c = _b.sharedData, sharedData = _c === void 0 ? void (0) : _c;
                var sharedHistory = (sharedData === null || sharedData === void 0 ? void 0 : sharedData.get(historyKey)) || _this.platformInjector.get(HISTORY);
                sharedData === null || sharedData === void 0 ? void 0 : sharedData.set(historyKey, sharedHistory);
                return sharedHistory;
            };
            return [{ provide: HISTORY, useFactory: factory, deps: [Injector] }];
        }
    };
    Platform.prototype.parseParams = function (providers, render, options) {
        return typeof providers === 'function' ? [[], providers, options] : [__spreadArray([], providers, true), render, options];
    };
    return Platform;
}());
export { Platform };
