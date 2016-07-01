'use strict';
const request = require('superagent');

const UBUNTU_STORE_SEARCH_ROOT_URL = 'https://search.apps.ubuntu.com';
const SEARCH_URL = `${UBUNTU_STORE_SEARCH_ROOT_URL}/api/v1/search`;
const DEFAULT_SERIES = '16';
const DEFAULT_CHANNEL = 'stable';

/**
 * @param {String} name Package name to search for
 * @param {String} series Ubuntu series
 * @param {String} arch Architecture
 * @param {Array} fields List of fields to return in response
 * @param {Number} size Length of response
 */
let search = function(name, series, arch, channel, fields, size) {

  channel = channel || DEFAULT_CHANNEL;
  series = series || DEFAULT_SERIES;

  let headers = {
    'X-Ubuntu-Architecture': arch,
    'X-Ubuntu-Release': series,
    'X-Ubuntu-Device-Channel': channel
  }

  let query = {
    q: `'package_name: "${name}"'`
  };

  if (fields) {
    query['fields'] = fields
  }

  if (size) {
    query['size'] = size
  }

  request.get(SEARCH_URL)
  .set(headers)
  .query(query)
  .type('json')
  .end((err, res) => {
    if (err) {
      // FIXME handle errors
    }

    let result = {};

    if (res.body_embedded) {
      result = res.body._embedded['clickindex:package']
    }

    return result;
  });
};

module.exports = {
  search: search
}
