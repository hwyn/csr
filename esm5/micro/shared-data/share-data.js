import { __decorate } from "tslib";
import { Injectable } from '@hwy-fm/di';
var SharedData = /** @class */ (function () {
    function SharedData() {
        this.data = new Map();
    }
    SharedData.prototype.set = function (key, value) {
        this.data.set(key, value);
    };
    SharedData.prototype.get = function (key) {
        return this.data.get(key);
    };
    SharedData.prototype.delete = function (key) {
        this.data.delete(key);
    };
    SharedData = __decorate([
        Injectable()
    ], SharedData);
    return SharedData;
}());
export { SharedData };
