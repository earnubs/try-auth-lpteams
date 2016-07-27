'use strict';
const request = require('superagent');
const qs = require('qs');
//const Schema = require('normalizr').Schema;
//const normalize = require('normalizr').normalize;
//const arrayOf = require('normalizr').arrayOf;

const UBUNTU_STORE_SEARCH_ROOT_URL = 'https://search.apps.ubuntu.com';
const SEARCH_URL = `${UBUNTU_STORE_SEARCH_ROOT_URL}/api/v1/snaps/search`;
const PACKAGE_URL = `${UBUNTU_STORE_SEARCH_ROOT_URL}/api/v1/package`;

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
const search = function(name, callback, options) {

  let query = {
    name: name
  };

  let arch = options.arch;
  let series = options.series;
  let channel = options.channel;
  let confinement = options.confinement;
  let fields = options.fields || ['revision, version, summary, name, publisher, last_updated'];
  let size = options.size || 1000;

  let headers = {
    'X-Ubuntu-Confinement': confinement,
    'X-Ubuntu-Architecture': arch,
    'X-Ubuntu-Release': series,
    'X-Ubuntu-Device-Channel': channel
  };

  if (fields) {
    query['fields'] = fields
  }

  if (size) {
    query['size'] = size
  }

  const req = request.get(SEARCH_URL)
    .set(headers)
    .query(qs.stringify(query))
    .type('json')
    .end((err, res) => {
      if (err) {
        // FIXME handle errors
        console.log('cpi search error!')
      }

      let result = [];

      if (res.body._embedded) {
        result = res.body._embedded['clickindex:package']
      }

      //let norm = normalize(result, arrayOf(snap));
      //callback(norm);
      callback(result);
    });
};

/**
 * @param {String} id snap_id to get
 */
const snap = function(id, callback, options) {
  let arch = options.arch;
  let series = options.series || DEFAULT_SERIES;
  let channel = options.channel || DEFAULT_CHANNEL;
  let headers = {
    'X-UBUNTU-Architecture': arch,
    'X-Ubuntu-Release': series,
    'X-Ubuntu-Device-Channel': channel
  };

  return request.get(`${PACKAGE_URL}/${id}`)
    .set(headers)
    .type('json')
    .end((err, res) => {
      if (err) {
        console.log('cpi get package error!')
        if (err.status === 404) {
          callback({});
        }
      }

      callback(res.body);
    })
};

module.exports = {
  search: search,
  snap: snap
}
