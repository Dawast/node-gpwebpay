import GpWebpayRequest from './GpWebpayRequest';
import GpWebpayResponse, { GpWebpayResponseData } from './GpWebpayResponse';
declare enum GpWebpayOperation {
    CREATE_ORDER = "CREATE_ORDER"
}
declare class GpWebpay {
    merchantNumber: string;
    gatewayUrl: string;
    privateKeyPath: string;
    privateKeyPass: string;
    publicKeyPath: string;
    private publicKey?;
    private privateKey?;
    constructor(merchantNumber: string, gatewayUrl: string, privateKeyPath: string, privateKeyPass: string, publicKeyPath: string);
    getRequestUrl(request: GpWebpayRequest): Promise<string>;
    parseQueryString(str: string): any;
    readFile(filepath: string): Promise<string>;
    getPrivateKey(): Promise<string>;
    getPublicKey(): Promise<string>;
    createResponse(data: GpWebpayResponseData): Promise<GpWebpayResponse>;
}
export default GpWebpay;
export { GpWebpayOperation, };
