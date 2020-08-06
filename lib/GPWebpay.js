"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GpWebpayOperation = void 0;
const fs_1 = __importDefault(require("fs"));
const GpWebpayResponse_1 = __importDefault(require("./GpWebpayResponse"));
var GpWebpayOperation;
(function (GpWebpayOperation) {
    GpWebpayOperation["CREATE_ORDER"] = "CREATE_ORDER";
})(GpWebpayOperation || (GpWebpayOperation = {}));
exports.GpWebpayOperation = GpWebpayOperation;
class GpWebpay {
    constructor(merchantNumber, gatewayUrl, privateKeyPath, privateKeyPass, publicKeyPath) {
        this.merchantNumber = merchantNumber;
        this.gatewayUrl = gatewayUrl;
        this.privateKeyPath = privateKeyPath;
        this.privateKeyPass = privateKeyPass;
        this.publicKeyPath = publicKeyPath;
    }
    getRequestUrl(request) {
        return __awaiter(this, void 0, void 0, function* () {
            request.merchantNumber = this.merchantNumber;
            request.validateProperties();
            const privateKey = yield this.getPrivateKey();
            yield request.sign(privateKey, this.privateKeyPass);
            const postData = request.getPostData();
            return this.gatewayUrl + '?' + postData;
        });
    }
    parseQueryString(str) {
        const data = {};
        const items = str.split('&');
        for (const item of items) {
            const itemData = item.split('=');
            data[itemData[0]] = decodeURIComponent(itemData[1]);
        }
        return data;
    }
    readFile(filepath) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                fs_1.default.readFile(filepath, 'utf8', (err, data) => {
                    if (err) {
                        reject(err);
                    }
                    resolve(data);
                });
            });
        });
    }
    getPrivateKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.privateKey) {
                this.privateKey = yield this.readFile(this.privateKeyPath);
            }
            return this.privateKey;
        });
    }
    getPublicKey() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.publicKey) {
                this.publicKey = yield this.readFile(this.publicKeyPath);
            }
            return this.publicKey;
        });
    }
    createResponse(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const publicKey = yield this.getPublicKey();
            return new GpWebpayResponse_1.default(this.merchantNumber, data, publicKey);
        });
    }
}
exports.default = GpWebpay;
