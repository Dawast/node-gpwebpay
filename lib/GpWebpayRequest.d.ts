import { GpWebpayOperation } from './GPWebpay';
declare enum GpWebpayRequestCurrency {
    CZK = "203"
}
declare enum GpWebpayRequestPaymentMethod {
    APPLE_PAY = "APAY",
    GOOGLE_PAY = "GPAY",
    CART = "CRD",
    MASTERPASS = "MPS",
    MASTERCARD_MOBILE = "MCM"
}
declare class GpWebpayRequest {
    merchantNumber: string;
    operation: GpWebpayOperation;
    orderNumber: number;
    amount: number;
    currency: GpWebpayRequestCurrency;
    depositFlag: number;
    merOrderNum?: number;
    url: string;
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
    constructor(merchantNumber: string, operation: GpWebpayOperation, orderNumber: number, amount: number, currency: GpWebpayRequestCurrency, url: string);
    validateProperties(): void;
    getPostData(): string;
    getSignatureBase(): string;
    sign(privateKey: string, privateKeyPass: string): void;
}
export default GpWebpayRequest;
export { GpWebpayRequestCurrency, };
