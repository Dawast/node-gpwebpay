import crypto from 'crypto';
import fs from 'fs';
import { GpWebpayOperation } from './GPWebpay'

enum GpWebpayRequestCurrency {
  CZK = '203',
}

enum GpWebpayRequestPaymentMethod {
  APPLE_PAY = 'APAY',
  GOOGLE_PAY = 'GPAY',
  CART = 'CRD',
  MASTERPASS = 'MPS',
  MASTERCARD_MOBILE = 'MCM',
}

class GpWebpayRequest {
  merchantNumber?: string;
  operation: GpWebpayOperation;
  orderNumber: number;
  amount: number;
  currency: GpWebpayRequestCurrency;
  depositFlag: number = 1;
  merOrderNum?: number;
  url: string; // redirectUrl
  description?: string;
  md?: string;
  paymentMethod?: GpWebpayRequestPaymentMethod;
  disabledPaymentMethod?: GpWebpayRequestPaymentMethod;
  paymentMethods?: [GpWebpayRequestPaymentMethod];
  email?: string;
  referenceNumber?: string;
  addInfo?: string;
  lang?: string;
  digest?: string;
  fastpayid?: number;
  userparam1?: string;

  constructor(
    operation: GpWebpayOperation,
    orderNumber: number,
    amount: number,
    currency: GpWebpayRequestCurrency,
    url: string,
  ) {
    this.operation = operation;
    this.orderNumber = orderNumber;
    this.amount = amount;
    this.currency = currency;
    this.url = url;
  }

  validateProperties() {
    if (!this.merchantNumber) {
      throw new Error('merchantNumber is required.')
    }
    if (this.merchantNumber.length > 10) {
      throw new Error('merchantNumber can have a maximum of 10 characters.')
    }
    if (this.operation.length > 20) {
      throw new Error('operation can have a maximum of 20 characters.')
    }
    if (this.orderNumber.toString().length > 15) {
      throw new Error('orderNumber can have a maximum of 15 characters.')
    }
    if (this.amount.toString().length > 15) {
      throw new Error('amount can have a maximum of 15 characters.')
    }
    if (this.currency.toString().length !== 3) {
      throw new Error('currency must be in ISO 4217 format.')
    }
    if (this.url.length > 300) {
      throw new Error('url can have a maximum of 300 characters.')
    }
    if (this.description && this.description.length > 255) {
      throw new Error('url can have a maximum of 255 characters.')
    }
    if (this.fastpayid && this.fastpayid.toString().length > 15) {
      throw new Error('fastpayid can have a maximum of 15 characters.')
    }
    if (this.md && this.md.length > 255) {
      throw new Error('md can have a maximum of 255 characters.')
    }
    if (this.userparam1 && this.userparam1.length > 255) {
      throw new Error('userparam1 can have a maximum of 255 characters.')
    }
    if (this.email && this.email.length > 255) {
      throw new Error('email can have a maximum of 255 characters.')
    }
    if (this.referenceNumber && this.referenceNumber.length > 20) {
      throw new Error('referenceNumber can have a maximum of 20 characters.')
    }
    if (this.addInfo && this.addInfo.length > 24000) {
      throw new Error('addInfo can have a maximum of 24000 characters.')
    }
    if (this.lang && this.lang.length > 2) {
      throw new Error('lang can have a maximum of 2 characters.')
    }
  }

  getPostData() {
    const keyMap: Record<string, string> = {
      'merchantNumber': 'MERCHANTNUMBER',
      'operation': 'OPERATION',
      'orderNumber': 'ORDERNUMBER',
      'amount': 'AMOUNT',
      'currency': 'CURRENCY',
      'depositFlag': 'DEPOSITFLAG',
      'merOrderNum': 'MERORDERNUM',
      'url': 'URL',
      'description': 'DESCRIPTION',
      'md': 'MD',
      'userparam1': 'USERPARAM1',
      'fastpayid': 'FASTPAYID',
      'paymentMethod': 'PAYMETHOD',
      'disabledPaymentMethod': 'DISABLEPAYMETHOD',
      'paymentMethods': 'PAYMETHODS',
      'email': 'EMAIL',
      'referenceNumber': 'REFERENCENUMBER',
      'addInfo': 'ADDINFO',
      'digest': 'DIGEST',
    };
    const data = [];
    for (const key of Object.keys(keyMap)) {
      // @ts-ignore
      const value = this[key];
      if (value) {
        data.push(keyMap[key] + '=' + encodeURIComponent(value));
      }
    }

    return data.join('&');
  }

  getSignatureBase() {
    const signKeys = [
      'merchantNumber', 'operation', 'orderNumber', 'amount', 'currency',
      'depositFlag', 'merOrderNum', 'url', 'description', 'md',
      'userparam1', 'fastpayid',
      'paymentMethod', 'disabledPaymentMethod', 'paymentMethods',
      'email', 'referenceNumber', 'addInfo',
    ];
    const base = [];
    const values = Object.values(this);
    const keys = Object.keys(this);
    for (const key of signKeys) {
      const i = keys.indexOf(key);
      if (i >= 0) {
        base.push(values[i]);
      }
    }

    return base.join('|');
  }

  sign(privateKey: string, privateKeyPass: string) {
    const base = this.getSignatureBase();
    const sign = crypto.createSign('sha1');
    sign.update(base);
    this.digest = sign.sign({ key: privateKey, passphrase: privateKeyPass }, 'base64');
  }
}

export default GpWebpayRequest;
export {
  GpWebpayRequestCurrency,
};

