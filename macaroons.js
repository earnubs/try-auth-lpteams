var Macaroons = function(options) {
  this.requestParams = {'openid.ns.macaroon': 'http://ns.login.ubuntu.com/2016/openid-macaroon'};
  if (options && options.caveat_id) {
    this.requestParams['openid.macaroon.caveat_id'] = options.caveat_id;
  }
};

Macaroons.prototype.fillResult = function(params, result) {
  if (params['openid.macaroon.discharge']) {
    result['discharge'] = params['openid.macaroon.discharge'];
  }
};

module.exports = Macaroons;
