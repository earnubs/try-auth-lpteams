'use strict';
const request = require('superagent');
const qs = require('qs');
//const Schema = require('normalizr').Schema;
//const normalize = require('normalizr').normalize;
//const arrayOf = require('normalizr').arrayOf;

const UBUNTU_STORE_SEARCH_ROOT_URL = 'https://search.apps.ubuntu.com';
const SEARCH_URL = `${UBUNTU_STORE_SEARCH_ROOT_URL}/api/v1/snaps/search`;
const PACKAGE_URL = `${UBUNTU_STORE_SEARCH_ROOT_URL}/api/v1/snaps/details/`;
const DEFAULT_SERIES = 16;
const DEFAULT_CHANNEL = 'stable';
const DEFAULT_CONFINEMENT = 'strict';

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

  // 'q' is fuzzy, 'name' is less so
  const query = (options.fuzzy) ? { q: name } : { name: name };

  let auth = options.auth;
  let arch = options.arch;
  let series = options.series;
  let fields = options.fields || ['revision, version, summary, name, publisher, last_updated'];
  let size = options.size || 1000;

  let headers = {
    'X-Ubuntu-Architecture': arch,
    'X-Ubuntu-Release': series
  };

  if (fields) {
    query['fields'] = fields;
  }

  if (size) {
    query['size'] = size;
  }

  // only works on fuzzt search, see q
  if (auth) {
    console.log('has auth!');
    query['private'] = true;
    headers['Authorization'] = auth;
  }

  request.get(SEARCH_URL)
    .set(headers)
    .query(qs.stringify(query))
    .type('json')
    .end((err, res) => {
      if (err) {
        // FIXME handle errors
        console.log('cpi search error!');
        return;
      }

      let result = [];

      if (res.body && res.body._embedded) {
        result = res.body._embedded['clickindex:package'];
      } else {
        result = {};
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
  let auth = options.auth;
  let arch = options.arch;
  let series = options.series || DEFAULT_SERIES;
  let channel = options.channel || DEFAULT_CHANNEL;
  let confinement = options.confinement || DEFAULT_CONFINEMENT;
  let query = {};
  let headers = {
    'X-Ubuntu-Architecture': arch,
    'X-Ubuntu-Release': series,
  };

  if (channel) {
    query['channel'] = channel;
  }

  if (confinement) {
    query['confinement'] = confinement;
  }

  if (auth) {
    headers['Authorization'] = auth;
  }

  return request.get(`${PACKAGE_URL}/${id}`)
    .set(headers)
    .query(qs.stringify(query))
    .type('json')
    .end((err, res) => {
      if (err) {
        console.log('cpi get snap error');
        console.log(res.body);
        // If an architecture (optional) is passed as header, and there
        // is no snap matching that name for the given architecture, the
        // endpoint will respond with 404.
        if (err.status === 404) {
          callback({});
        }
        return;
      }

      callback(res.body);

    });
};

module.exports = {
  search: search,
  snap: snap
};
