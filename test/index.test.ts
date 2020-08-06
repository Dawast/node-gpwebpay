import GpWebpayRequest, {GpWebpayRequestCurrency} from '../src/GpWebpayRequest';
import GpWebpayClient, { GpWebpayOperation } from '../src/GPWebpay';

const config = {
  gatewayUrl: 'https://test.3dsecure.gpwebpay.com/pgw/order.do',
  publicKey: 'test/publicKey.pem',
  privateKeyPath: 'test/privateKey.pem',
  privateKeyPass: 'TestKey2000+',
  merchantNumber: '123456789',
};

const client = new GpWebpayClient(config.merchantNumber, config.gatewayUrl, config.privateKeyPath, config.privateKeyPass, config.publicKey);

test('get new payment redirect url', async (done) => {
  const request = new GpWebpayRequest(config.merchantNumber, GpWebpayOperation.CREATE_ORDER, 3008, 1000, GpWebpayRequestCurrency.CZK, 'https://www.dswd.cz/');

  const redirectUrl = await client.getRequestUrl(request);

  expect(redirectUrl).toBe('https://test.3dsecure.gpwebpay.com/pgw/order.do?DEPOSITFLAG=1&MERCHANTNUMBER=123456789&OPERATION=CREATE_ORDER&ORDERNUMBER=3008&AMOUNT=1000&CURRENCY=203&URL=https%3A%2F%2Fwww.dswd.cz%2F&DIGEST=E1yHrbZuvvJGiTfv%2FekL1Cm%2FOrbLYchAqensuObGo2gyPDx8EXqT5%2BOS9HXZfd2vW%2F5vTeA7Rg6beDGBl9nQw3NnxpnrF4nV8tBEYgC7eZX%2Fs%2Bh05AlvCIpKJbjFtVa83wln2Fg9eOfSlIbqN8WAqjzRXLIDy8b%2BKgYqAcFAidYZNsOT7ufuz9zsdYuAYRBlBmp%2FlBUJ%2FNagYlJjWRpKNNwrXvIyW0yKlW6TtJR%2FDNkGod62jOASafVk69CUGgNI%2F81hF8fGEg8DFZW%2FdHFodSRzE4zc9EdYSMlV%2FLOihulqld7U5uJTktqKe8QABISCYZ6PDCOPAC9%2BtZ1drNY2IQ%3D%3D');
  done();
})

test('create response - OK', async (done) => {
  const data = client.parseQueryString('OPERATION=CREATE_ORDER&ORDERNUMBER=3010&RESULTTEXT=OK&PRCODE=0&SRCODE=0&DIGEST=P%2F8XSc9CeQQbftK54QE3Zq%2FCBy7mwc2UkZOKXoZYTJfx1Va8w77f22320otzHYsnFE%2F1MWYfVnG0bi9XfoJZtNYWIty0wUQTvuoKsKF4xucGmCCa4xSM98myOJwOFVK5qeTUfGPUq8emwxhPg1FMuV3JiIo%2F1i3I1DjLtAUeswBFn5LXm8ppZrz7EB%2BwG94ZIIvU4m%2B%2F%2BUX8%2FzQpdMeGAD%2FdOMmJ5bBtrHOyhaAdtaR%2Fq%2BnKkKl0rp1F7gkospSWKBWLZKLdaSvqCY11eBup3FgNGBJnGL7%2BhhwU43vhnkA1jFBdsMITQ%2F%2B0oDKzc2kxDUvFK9QKB5XG4GZyGY4fJA%3D%3D&DIGEST1=On52y4aobLKQ%2BU%2BieALjBZbbFc8W%2F3KmRMAp4FIIPlRD5dQRGMc0O0noXpj7NTp3dV1uUkYQKMSPI%2FFhoVir%2BYHCUG3K6EJl%2BXUsoIbykZsAUQZCs3G61iqSGsozSHS8b64HEnDSI0eleLGoheKSd1LgrTxeHUpfsg%2FOHTqoHEd5wA%2Bj7h%2BpZwR63ExL6Zswj1SeLKIPAeCRJTthLuzBQWLgSgG2fkTNkFFu%2Bka0le1AJxm9%2FAxSRXKM7cU2y5%2Bt1wcreE2J9Zx7E8BdFr8%2BFeKkFVkdoaSItYUUDY4nNfIQsUWkQZ1GDVsV21Sj%2F7dIDbmzHPTsJIMeWZR38JKaKQ%3D%3D');

  const response = await client.createResponse(data);

  expect(response.getDigest()).toBe(data.DIGEST);
  expect(response.getDigest1()).toBe(data.DIGEST1);
  expect(response.getOperation()).toBe(data.OPERATION);
  expect(response.getOrderNumber()).toBe(data.ORDERNUMBER);
  expect(response.getPrCode()).toBe(data.PRCODE);
  expect(response.getSrCode()).toBe(data.SRCODE);
  expect(response.getResultText()).toBe(data.RESULTTEXT);
  done();
});

test('create error response - duplicate order number', async (done) => {
  const data = client.parseQueryString('OPERATION=CREATE_ORDER&ORDERNUMBER=3010&PRCODE=14&SRCODE=0&RESULTTEXT=Duplicate%20order%20number&DIGEST=LjcpbTa0XLF2VoO16twP7yh8w%2FPYjVhtetzeLX8ry7DyBHgBXrnHMS1CzQ3n6nXAdNcvyfsCuMfWXQ8R2xFEprMTYkBD%2BXdKl%2FWeWTq6cJ1XU4BTI9l9%2BiTImpJOwmMOisDw%2BWh2RsODhCvy3M9yDoWJcfjZXj%2Fcm4Rws7EfpTRse091olDSMmC%2BY8ro72mBqRTNUONfu0H6AsRtzoC8Ni4rXI5%2FNnGfVOT%2BnV65oVY89DjnFdrm%2Biyt2tNroDGC8EyGyP%2FxfnPgclUjJzmqb1cnEei6KtHFLte2qb9T8rtwYoOEHwT3CAOuhRMz48sOOp%2FG7eQQRVQUpUm8wqGwRQ%3D%3D&DIGEST1=PVts9KomoWDFTLVUlTHcbQGHpU2rAD3k3f%2BiZaHr8IeBiAIq8740OL6dQ%2B7a4nPwyRcQSSm%2FJtvlpR40pNolF2pjcTUhPNs6F6I%2BgqFyX1Q2eHUI%2FH30aMr50VUMX86NhuQkhlwxM%2Fx7unOins0ZViTFWzTB5Au7kYiUrVr6YxMaJGLsZciF8db66FfH9YH94aKpwxY74cHHceXtXYk1Jf1yMQTvb51tFw0ufcOjNsfm9aUy1GMEuRV7Q3CvRStvgjmUdadlR7mOwtOziYLketUr84w4u913LPwadWLBdkeQ8MkEgLQy8xX%2FNV80oTYJEvnTDYp0BqA%2BEvzMJsnbyw%3D%3D');

  const response = await client.createResponse(data);

  expect(response.getDigest()).toBe(data.DIGEST);
  expect(response.getDigest1()).toBe(data.DIGEST1);
  expect(response.getOperation()).toBe(data.OPERATION);
  expect(response.getOrderNumber()).toBe(data.ORDERNUMBER);
  expect(response.getPrCode()).toBe(data.PRCODE);
  expect(response.getSrCode()).toBe(data.SRCODE);
  expect(response.getResultText()).toBe(data.RESULTTEXT);
  done();
});
