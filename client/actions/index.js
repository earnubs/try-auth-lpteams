import fetch from 'isomorphic-fetch';
import * as types from '../actionTypes';
import {API_DETAIL, API_SEARCH} from '../config';

export function selectSeries(series) {
  return {
    type: types.SELECT_SERIES,
    series
  };
}

export function selectArch(arch) {
  return {
    type: types.SELECT_ARCH,
    arch
  };
}

export function selectChannel(channel) {
  return {
    type: types.SELECT_CHANNEL,
    channel
  };
}

export function selectConfinement(confinement) {
  return {
    type: types.SELECT_CONFINEMENT,
    confinement
  };
}

export function selectQuery(query) {
  return {
    type: types.SELECT_QUERY,
    query
  };
}

export function isFuzzy(isFuzzy) {
  return {
    type: types.IS_FUZZY,
    isFuzzy
  };
}

export function requestQuerySnaps(query) {
  return {
    type: types.REQUEST_QUERY_SNAPS,
    query
  };
}

export function receiveQuerySnaps(query, json) {
  return {
    type: types.RECEIVE_QUERY_SNAPS,
    query,
    snaps: json,
    receivedAt: Date.now()
  };
}

export function requestSnap(id) {
  return {
    type: types.REQUEST_SNAP,
    id
  };
}

export function receiveSnap(id, json) {
  return {
    type: types.RECEIVE_SNAP,
    id,
    snap: json,
    receivedAt: Date.now()
  };
}

function fetchQuerySnaps(series, arch, query, isFuzzy) {
  series = encodeURIComponent(series);
  query = encodeURIComponent(query);
  arch = encodeURIComponent(arch);

  let url = `${API_SEARCH}/${series}/${arch}/${query}`;

  if (isFuzzy) {
    url += '?fuzzy=true';
  }

  return dispatch => {
    dispatch(requestQuerySnaps(query));
    return fetch(url)
      .then(response => {
        return response.json();
      })
      .then(json => dispatch(receiveQuerySnaps(query, json)));
  };
}

function shouldFetchQuerySnaps(query, state) {
  const snaps = state.snapsFromQuery;

  if (query.length === 0) {
    return false;
  }

  if (snaps.isFetching) {
    return false;
  }

  return true;
}

export function fetchQuerySnapsIfNeeded(series, arch, query, isFuzzy) {
  return (dispatch, getState) => {
    if (shouldFetchQuerySnaps(query, getState())) {
      return dispatch(fetchQuerySnaps(series, arch, query, isFuzzy));
    }
  };
}

function fetchSnap(id, series, arch, channel, confinement) {
  const url = `${API_DETAIL}/${id}/${series}/${arch}/${channel}/${confinement}`;

  return dispatch => {
    dispatch(requestSnap(id));
    return fetch(url)
    .then(response => response.json())
    .then(json => dispatch(receiveSnap(id, json)));
  };
}

function shouldFetchSnap(/** id, state **/) {
  /** FIXME snap_id is not unique across revision
  const snap = state.snapById[id];

  if (!snap) {
    return true;
  }

  return false;
   **/
  return true;
}

export function fetchSnapIfNeeded(id, series, arch, channel, confinement) {
  return (dispatch, getState) => {
    if (shouldFetchSnap(id, getState())) {
      return dispatch(fetchSnap(id, series, arch, channel, confinement));
    }
  };
}
