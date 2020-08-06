/// <reference types="node" />
import crypto from 'crypto';
import GpWebpayOperation from './GPWebpay';
interface GpWebpayResponseData {
    OPERATION: GpWebpayOperation;
    ORDERNUMBER: string;
    MERORDERNUM?: string;
    MD?: string;
    PRCODE: string;
    SRCODE: string;
    RESULTTEXT?: string;
    USERPARAM1?: string;
    ADDINFO?: string;
    TOKEN?: string;
    EXPIRY?: string;
    ACSRES?: string;
    ACCODE?: string;
    PANPATTERN?: string;
    DAYTOCAPTURE?: string;
    TOKENREGSTATUS?: string;
    ACRC?: string;
    RRN?: string;
    PAR?: string;
    TRACEID?: string;
    DIGEST: string;
    DIGEST1: string;
}
declare class GpWebpayResponse {
    private data;
    merchantNumber: string;
    publicKey: string | object | Buffer | crypto.KeyObject;
    constructor(merchantNumber: string, data: GpWebpayResponseData, publicKey: string | object | Buffer | crypto.KeyObject);
    getOperation(): GpWebpayOperation;
    getOrderNumber(): string;
    getDigest(): string;
    getDigest1(): string;
    getPrCode(): string;
    getSrCode(): string;
    getResultText(): string | undefined;
    getSignatureBase(): string;
    validateSignature(): boolean;
}
export default GpWebpayResponse;
export { GpWebpayResponseData, };
