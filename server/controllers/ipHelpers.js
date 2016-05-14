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
    const addresses = JSON.parse(azureList).AzurePublicIpAddresses.IpRange;
    console.log(addresses);
    for (let i = 0; i < addresses.length; i++) {
      if (inSubNet(ip, addresses[i])) {
        return true;
      }
    }
    return false;
  },

  isAWS(ip) {
    const addresses = JSON.parse(awsList).prefixes;
    console.log(addresses);
    for (let i = 0; i < addresses.length; i++) {
      if (inSubNet(ip, addresses[i].ip_prefix)) {
        return true;
      }
    }
    return false;
  },

};
