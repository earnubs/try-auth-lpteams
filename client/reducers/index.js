import { routerReducer as routing } from 'react-router-redux'
import { combineReducers } from 'redux';
import {
  RECEIVE_QUERY_SNAPS,
  RECEIVE_SNAP,
  REQUEST_QUERY_SNAPS,
  REQUEST_SNAP,
  SELECT_ARCH,
  SELECT_CHANNEL,
  SELECT_CONFINEMENT,
  SELECT_QUERY,
  SELECT_SERIES
} from '../actionTypes';

const DEFAULT_SERIES = '16';
const DEFAULT_ARCH = 'independent';
const DEFAULT_CHANNEL = 'stable';
const DEFAULT_CONFINEMENT = 'strict';

// each reducer handles it's own bit of state
function selectedSeries(state = DEFAULT_SERIES, action) {
  switch (action.type) {
    case SELECT_SERIES:
      return action.series
    default:
      return state
  }
}

function selectedArch(state=DEFAULT_ARCH, action) {
  switch (action.type) {
    case SELECT_ARCH:
      return action.arch
    default:
      return state
  }
}

function selectedChannel(state=DEFAULT_CHANNEL, action) {
  switch (action.type) {
    case SELECT_CHANNEL:
      return action.channel
    default:
      return state
  }
}

function selectedConfinement(state=DEFAULT_CONFINEMENT, action) {
  switch (action.type) {
    case SELECT_CONFINEMENT:
      return action.confinement
    default:
      return state
  }
}

function selectedQuery(state='', action) {
  switch (action.type) {
    case SELECT_QUERY:
      return action.query
    default:
      return state
  }
}

function selectedSnapId(state, action) {
  switch (action.type) {
    case SELECT_SNAP_ID:
      return action.id
    default:
      return state
  }
}

function snapsFromQuery(state = {
  isFetching: false,
  items: []
}, action) {
  switch (action.type) {
    case REQUEST_QUERY_SNAPS:
      return {
        ...state,
        isFetching: true,
      };

    case RECEIVE_QUERY_SNAPS:
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
    case REQUEST_SNAP:
      return {
        ...state,
        isFetching: true
      }
    case RECEIVE_SNAP:
      return {
        ...state,
        isFetching: false,
        snap: action.snap,
        lastUpdated: action.receivedAt
      }
    default:
      return state;
  }
};

function snapById(state = {}, action) {
  switch (action.type) {
    case REQUEST_SNAP:
    case RECEIVE_SNAP:
      // FIXME snap_id is not unique across revision
      return {...state, [action.id]: snap(state[action.id], action)}
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  snapsFromQuery,
  snapById,
  selectedConfinement,
  selectedChannel,
  selectedQuery,
  selectedArch,
  routing
})

export default rootReducer
