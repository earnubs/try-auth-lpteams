import fetch from 'isomorphic-fetch';

import {
  REQUEST_QUERY_SNAPS,
  RECEIVE_QUERY_SNAPS,
  REQUEST_SNAP,
  RECEIVE_SNAP,
  SELECT_ARCH,
  SELECT_CHANNEL,
  SELECT_CONFINEMENT,
  SELECT_SERIES,
  SELECT_SNAP_ID,
  SELECT_QUERY,
} from '../actionTypes';

export function selectSeries(series) {
  return {
    type: SELECT_SERIES,
    series
  };
}

export function selectArch(arch) {
  return {
    type: SELECT_ARCH,
    arch
  };
}

export function selectChannel(channel) {
  return {
    type: SELECT_CHANNEL,
    channel
  };
}

export function selectConfinement(confinement) {
  return {
    type: SELECT_CONFINEMENT,
    confinement
  };
}

export function selectQuery(query) {
  return {
    type: SELECT_QUERY,
    query
  };
}

export function selectSnapId(id) {
  return {
    type: SELECT_SNAP_ID,
    id
  };
}

export function requestQuerySnaps(query) {
  return {
    type: REQUEST_QUERY_SNAPS,
    query
  };
}

export function receiveQuerySnaps(query, json) {
  return {
    type: RECEIVE_QUERY_SNAPS,
    query,
    snaps: json,
    receivedAt: Date.now()
  };
}

export function requestSnap(id) {
  return {
    type: REQUEST_SNAP,
    id
  };
}

export function receiveSnap(id, json) {
  return {
    type: RECEIVE_SNAP,
    id,
    snap: json,
    receivedAt: Date.now()
  };
}

function fetchQuerySnaps(query, arch) {
  query = encodeURIComponent(query);
  arch = encodeURIComponent(arch);

  return dispatch => {
    dispatch(requestQuerySnaps(query));
    return fetch(`/api/search/16/${query}/${arch}`)
      .then(response => response.json())
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

export function fetchQuerySnapsIfNeeded(query, arch, channel, confinement) {
  return (dispatch, getState) => {
    if (shouldFetchQuerySnaps(query, getState())) {
      return dispatch(fetchQuerySnaps(query, arch, channel, confinement));
    }
  };
}

function fetchSnap(id, arch, channel, confinement) {
  return dispatch => {
    dispatch(requestSnap(id));
    return fetch(`/api/details/${id}/16/${arch}/${channel}/${confinement}`)
    .then(response => response.json())
    .then(json => dispatch(receiveSnap(id, json)));
  };
}

function shouldFetchSnap(id, state) {
  /** FIXME snap_id is not unique across revision
  const snap = state.snapById[id];

  if (!snap) {
    return true;
  }

  return false;
   **/
  return true;
}

export function fetchSnapIfNeeded(id, arch, channel, confinement) {
  return (dispatch, getState) => {
    if (shouldFetchSnap(id, getState())) {
      return dispatch(fetchSnap(id, arch, channel, confinement));
    }
  };
}
