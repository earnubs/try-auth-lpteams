'use strict';
const request = require('superagent');
const co = require('co');
//const Schema = require('normalizr').Schema;
//const normalize = require('normalizr').normalize;
//const arrayOf = require('normalizr').arrayOf;

const UBUNTU_STORE_SEARCH_ROOT_URL = 'https://search.apps.ubuntu.com';
const SEARCH_URL = `${UBUNTU_STORE_SEARCH_ROOT_URL}/api/v1/snaps/search`;
const DEFAULT_SERIES = '16';
const DEFAULT_CHANNEL = 'stable';
const DEFAULT_ARCH = 'all';

//const snap = new Schema('snaps', {
//  idAttribute: 'snap_id'
//});

/**
 * @param {String} name Package name to search for
 * @param {String} series Ubuntu series
 * @param {String} arch Architecture
 * @param {Array} fields List of fields to return in response
 * @param {Number} size Length of response
 */
let search = function(name, callback, options) {

  let query = {
    q: name
  };

  let arch = options.arch;
  let series = options.series || DEFAULT_SERIES;
  let channel = options.channel || DEFAULT_CHANNEL;
  let fields = options.fields;
  let size = options.size || 1000;

  let headers = {
    'X-Ubuntu-Release': series,
    'X-Ubuntu-Device-Channel': channel
  };

  if (arch) {
    headers['X-UBUNTU-Architecture'] = arch;
  }

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

      if (res.body._embedded) {
        result = res.body._embedded['clickindex:package']
      }

      //let norm = normalize(result, arrayOf(snap));
      //callback(norm);
      callback(result);
    });
};

module.exports = {
  search: search
}
