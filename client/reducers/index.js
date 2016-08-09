import { routerReducer as routing } from 'react-router-redux';
import { combineReducers } from 'redux';
import * as defaults from '../config';
import * as types from '../actionTypes';

function selectedSeries(state=defaults.DEFAULT_SERIES, action) {
  switch (action.type) {
  case types.SELECT_SERIES:
    return action.series;
  default:
    return state;
  }
}

function selectedArch(state=defaults.DEFAULT_ARCH, action) {
  switch (action.type) {
  case types.SELECT_ARCH:
    return action.arch;
  default:
    return state;
  }
}

function selectedChannel(state=defaults.DEFAULT_CHANNEL, action) {
  switch (action.type) {
  case types.SELECT_CHANNEL:
    return action.channel;
  default:
    return state;
  }
}

function selectedConfinement(state=defaults.DEFAULT_CONFINEMENT, action) {
  switch (action.type) {
  case types.SELECT_CONFINEMENT:
    return action.confinement;
  default:
    return state;
  }
}

function selectedQuery(state=defaults.DEFAULT_QUERY, action) {
  switch (action.type) {
  case types.SELECT_QUERY:
    return action.query;
  default:
    return state;
  }
}

function beFuzzy(state=defaults.DEFAULT_FUZZY, action) {
  switch (action.type) {
  case types.IS_FUZZY:
    return action.isFuzzy;
  default:
    return state;
  }
}

function snapsFromQuery(state = {
  isFetching: false,
  items: []
}, action) {
  switch (action.type) {
  case types.REQUEST_QUERY_SNAPS:
    return {
      ...state,
      isFetching: true,
    };

  case types.RECEIVE_QUERY_SNAPS:
    return {
      ...state,
      isFetching: false,
      items: action.snaps,
      lastUpdated: action.receivedAt
    };
  default:
    return state;
  }
}

function snap(state = {}, action) {
  switch (action.type) {
  case types.REQUEST_SNAP:
    return {
      ...state,
      isFetching: true
    };
  case types.RECEIVE_SNAP:
    return {
      ...state,
      isFetching: false,
      snap: action.snap,
      lastUpdated: action.receivedAt
    };
  default:
    return state;
  }
}

// FIXME snapByAlias ?
function snapById(state = {}, action) {
  switch (action.type) {
  case types.REQUEST_SNAP:
  case types.RECEIVE_SNAP:
      // FIXME snap_id is not unique across revision
    return {...state, [action.id]: snap(state[action.id], action)};
  default:
    return state;
  }
}

const rootReducer = combineReducers({
  beFuzzy,
  routing,
  selectedArch,
  selectedChannel,
  selectedConfinement,
  selectedQuery,
  selectedSeries,
  snapById,
  snapsFromQuery
});

export default rootReducer;
