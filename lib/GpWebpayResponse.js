"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
class GpWebpayResponse {
    constructor(merchantNumber, data, publicKey) {
        this.data = data;
        this.merchantNumber = merchantNumber;
        this.publicKey = publicKey;
        if (!this.validateSignature()) {
            throw new Error('Response is not valid.');
        }
    }
    getOperation() {
        return this.data.OPERATION;
    }
    getOrderNumber() {
        return this.data.ORDERNUMBER;
    }
    getDigest() {
        return this.data.DIGEST;
    }
    getDigest1() {
        return this.data.DIGEST1;
    }
    getPrCode() {
        return this.data.PRCODE;
    }
    getSrCode() {
        return this.data.SRCODE;
    }
    getResultText() {
        return this.data.RESULTTEXT;
    }
    getSignatureBase() {
        const signKeys = [
            'OPERATION',
            'ORDERNUMBER',
            'MERORDERNUM',
            'MD',
            'PRCODE',
            'SRCODE',
            'RESULTTEXT',
            'USERPARAM1',
            'ADDINFO'
        ];
        const base = [];
        const values = Object.values(this.data);
        const keys = Object.keys(this.data);
        for (const key of signKeys) {
            const i = keys.indexOf(key);
            if (i >= 0) {
                base.push(values[i]);
            }
        }
        return base.join('|');
    }
    validateSignature() {
        const digestBase = this.getSignatureBase();
        const digest1Base = digestBase + '|' + this.merchantNumber;
        const verify = crypto_1.default.createVerify('sha1');
        verify.update(digestBase);
        const valid = verify.verify(this.publicKey, this.getDigest(), 'base64');
        if (!valid) {
            return false;
        }
        const verify1 = crypto_1.default.createVerify('sha1');
        verify1.update(digest1Base);
        const valid1 = verify1.verify(this.publicKey, this.getDigest1(), 'base64');
        return valid1;
    }
}
exports.default = GpWebpayResponse;
