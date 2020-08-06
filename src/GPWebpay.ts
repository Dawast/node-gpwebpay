import GpWebpayRequest from './GpWebpayRequest';
import fs from "fs";
import GpWebpayResponse, {GpWebpayResponseData} from './GpWebpayResponse';

enum GpWebpayOperation {
  CREATE_ORDER = 'CREATE_ORDER',
}

class GpWebpay {
  merchantNumber: string;
  gatewayUrl: string;
  privateKeyPath: string;
  privateKeyPass: string;
  publicKeyPath: string;

  private publicKey?: string;
  private privateKey?: string;

  constructor(
    merchantNumber: string,
    gatewayUrl: string,
    privateKeyPath: string,
    privateKeyPass: string,
    publicKeyPath: string,
  ) {
    this.merchantNumber = merchantNumber;
    this.gatewayUrl = gatewayUrl;
    this.privateKeyPath = privateKeyPath;
    this.privateKeyPass = privateKeyPass;
    this.publicKeyPath = publicKeyPath;
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

  async getPrivateKey() {
    if (!this.privateKey) {
      this.privateKey = await this.readFile(this.privateKeyPath);
    }

    return this.privateKey;
  }

  async getPublicKey() {
    if (!this.publicKey) {
      this.publicKey = await this.readFile(this.publicKeyPath);
    }

    return this.publicKey;
  }

  async createResponse(data: GpWebpayResponseData) {
    const publicKey = await this.getPublicKey();
    return new GpWebpayResponse(this.merchantNumber, data, publicKey);
  }
}

export default GpWebpay;
export {
  GpWebpayOperation,
};
