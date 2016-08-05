var LaunchpadTeams = function(options) {
  this.requestParams = {'openid.ns.lp': 'http://ns.launchpad.net/2007/openid-teams'};
  if (options.teams && options.teams.length) {
    this.requestParams['openid.lp.query_membership'] = options.teams.join(',');
  }
};

LaunchpadTeams.prototype.fillResult = function(params, result) {
  if (params['openid.lp.is_member'] && params['openid.lp.is_member'].length) {
    result['teams'] = params['openid.lp.is_member'].split(',');
  }
};

module.exports = LaunchpadTeams;
