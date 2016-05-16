'use strict';
const azureList = require('../azureIpRanges.js');
const awsList = require('../awsRanges.js');

const ip2long = (ip) => {
  let components;

  if (components = ip.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)) {
    let iplong = 0;
    let power  = 1;
    for (let i = 4; i >= 1; i -= 1) {
      iplong += power * parseInt(components[i]);
      power *= 256;
    }
    return iplong;
  }
  else return -1;
};

const inSubNet = (ip, subnet) => {
  let mask, base_ip, long_ip = ip2long(ip);
  if ((mask = subnet.match(/^(.*?)\/(\d{1,2})$/)) && ((base_ip = ip2long(mask[1])) >= 0)) {
    const freedom = Math.pow(2, 32 - parseInt(mask[2]));
    return (long_ip > base_ip) && (long_ip < base_ip + freedom - 1);
  } else return false;
};

module.exports = {
  isAzure(ip) {
    const addresses = azureList.AzurePublicIpAddresses.IpRange;
    for (let i = 0; i < addresses.length; i++) {
      if (inSubNet(ip, addresses[i]['-Subnet'])) {
        console.log('Azure server found');
        return true;
      }
    }
    return false;
  },

  isAWS(ip) {
    const addresses = awsList.prefixes;
    for (let i = 0; i < addresses.length; i++) {
      if (inSubNet(ip, addresses[i].ip_prefix)) {
        console.log('AWS server found');

        return true;
      }
    }
    return false;
  },

};
