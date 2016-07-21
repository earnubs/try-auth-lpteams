import fetch from 'isomorphic-fetch';

import {
  INVALIDATE_QUERY,
  REQUEST_SNAPS,
  RECEIVE_SNAPS,
  SELECT_ARCH,
  SELECT_CHANNEL,
  SELECT_SERIES,
  SELECT_QUERY,
} from '../actionTypes';

export function selectSeries(series) {
  return {
    type: SELECT_SERIES,
    series
  }
};

export function selectArch(arch) {
  return {
    type: SELECT_ARCH,
    arch
  }
};

export function selectChannel(channel) {
  return {
    type: SELECT_CHANNEL,
    channel
  }
};

export function selectQuery(query) {
  return {
    type: SELECT_QUERY,
    query
  }
};

export function invalidateQuery(query) {
  return {
    type: INVALIDATE_QUERY,
    query
  }
};

export function requestSnaps(query) {
  return {
    type: REQUEST_SNAPS,
    query
  }
};

export function receiveSnaps(query, json) {
  return {
    type: RECEIVE_SNAPS,
    query,
    snaps: json,
    receivedAt: Date.now()
  }
};

function fetchSnaps(query, arch) {
  return dispatch => {
    dispatch(requestSnaps(query))
    return fetch(`/api/search/16/stable/${query}/${arch}`)
      .then(response => response.json())
      .then(json => dispatch(receiveSnaps(query, json)))
  }
};

function shouldFetchSnaps(query, state) {
  const snaps = state.snapsFromQuery;

  if (query.length === 0) {
    return false;
  }

  if (snaps.isFetching) {
    return false
  }

  return true;
};

export function fetchSnapsIfNeeded(query, arch) {
  return (dispatch, getState) => {
    if (shouldFetchSnaps(query, getState())) {
      return dispatch(fetchSnaps(query, arch))
    }
  }
};

