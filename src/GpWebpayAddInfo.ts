interface CardholderDetails {
  name: string,
  loginId?: string,
  loginType?: string,
  loginTime?: number,
  userAccountId?: string,
  userAccountCreatedDate?: number,
  userAccountAge?: string,
  userAccountLastChangeDate?: number,
  userAccountLastChangeAge?: string,
  userAccountPasswordChangeDate?: number,
  userAccountPasswordChangeAge?: string,
  socialNetworkId?: string,
  email: string,
  phoneCountry?: number,
  phone?: number,
  mobilePhoneCountry?: number,
  mobilePhone?: number,
  workPhoneCountry?: number,
  workPhone?: number,
  clientIpAddress?: string,
}

interface BillingDetails {
  name: string,
  address1: string,
  address2?: string,
  address3?: string,
  city: string,
  postalCode: string,
  country: number, // ISO 3166-1 
  countrySubdivision?: number, // ISO 3166-2
  phone?: string,
  email?: string,
}

interface ShippingDetails {
  name: string,
  address1: string,
  address2?: string,
  address3?: string,
  city: string,
  postalCode: string,
  country: number, // ISO 3166-1 
  countrySubdivision?: number, // ISO 3166-2 
  phone?: string,
  email?: string,
  method?: string,
}

class GpWebpayAddInfo {
  cardholderDetails?: CardholderDetails;
  billingDetails?: BillingDetails;
  shippingDetails?: ShippingDetails;

  constructor() {}

  setCardholderDetails(data: CardholderDetails) {
    this.cardholderDetails = data;
  }

  setBillingDetails(data: BillingDetails) {
    this.billingDetails = data;
  }

  setShippingDetails(data: ShippingDetails) {
    this.shippingDetails = data;
  }

  getXml() {
    const { billingDetails, shippingDetails, cardholderDetails } = this;
    let xml = '<?xml version="1.0" encoding="utf-8"?>';
    xml += '<additionalInfoRequest xmlns="http://gpe.cz/gpwebpay/additionalInfo/request" version="4.0">'
    if (cardholderDetails) {
      xml += '<cardholderInfo>'

      xml += '<cardholderDetails>'
      for (const [key, value] of Object.entries(cardholderDetails)) {
        xml += `<${key}>${value}</${key}>`
      }
      xml += '</cardholderDetails>';
      xml += `<addressMatch>${((billingDetails && !shippingDetails) || (!billingDetails && shippingDetails)) ? 'Y' : 'N'}</addressMatch>`;

      if (billingDetails) {
        xml += '<billingDetails>'
        for (const [key, value] of Object.entries(billingDetails)) {
          xml += `<${key}>${value}</${key}>`
        }
        xml += '</billingDetails>'
      }

      if (shippingDetails) {
        xml += '<shippingDetails>'
        for (const [key, value] of Object.entries(shippingDetails)) {
          xml += `<${key}>${value}</${key}>`
        }
        xml += '</shippingDetails>'
      }

      xml += '</cardholderInfo>'
    }
    xml += '</additionalInfoRequest>'

    return xml;
  }
}

export default GpWebpayAddInfo;
