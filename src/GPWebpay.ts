import GpWebpayRequest from './GpWebpayRequest';
import fs from "fs";
import GpWebpayResponse, {GpWebpayResponseData} from './GpWebpayResponse';

enum GpWebpayOperation {
  CREATE_ORDER = 'CREATE_ORDER',
}

class GpWebpay {
  merchantNumber: string;
  gatewayUrl: string;
  privateKeyPass: string;

  private publicKey: string;
  private privateKey: string;

  constructor(
    merchantNumber: string,
    gatewayUrl: string,
    privateKey: string,
    privateKeyPass: string,
    publicKey: string,
  ) {
    this.merchantNumber = merchantNumber;
    this.gatewayUrl = gatewayUrl;
    this.privateKey = privateKey;
    this.privateKeyPass = privateKeyPass;
    this.publicKey = publicKey;
  }

  async getRequestUrl(request: GpWebpayRequest) {
    request.merchantNumber = this.merchantNumber;
    request.validateProperties();
    const privateKey = await this.getPrivateKey();
    await request.sign(privateKey, this.privateKeyPass);

    const postData = request.getPostData();

    return this.gatewayUrl + '?' + postData;
  }

  parseQueryString(str: string) {
    const data: any = {};
    const items = str.split('&');
    for (const item of items) {
      const itemData = item.split('=');
      data[itemData[0]] = decodeURIComponent(itemData[1]);
    }

    return data;
  }

  async readFile(filepath: string) {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(filepath, 'utf8', (err, data: string) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    })
  }

  getPrivateKey() {
    return this.privateKey;
  }

  getPublicKey() {
    return this.publicKey;
  }

  async createResponse(data: GpWebpayResponseData) {
    const publicKey = this.getPublicKey();
    return new GpWebpayResponse(this.merchantNumber, data, publicKey);
  }
}

export default GpWebpay;
export {
  GpWebpayOperation,
};
