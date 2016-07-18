import { combineReducers } from 'redux'
import {
  INVALIDATE_QUERY,
  REQUEST_SNAPS,
  RECEIVE_SNAPS,
  SELECT_ARCH,
  SELECT_CHANNEL,
  SELECT_SERIES,
  SELECT_QUERY
} from '../actionTypes';

const DEFAULT_SERIES = '16';
const DEFAULT_ARCH = 'all';
const DEFAULT_CHANNEL = 'stable';

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

function selectedQuery(state='', action) {
  switch (action.type) {
    case SELECT_QUERY:
      return action.query
    default:
      return state
  }
}

function snaps(state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) {
  switch (action.type) {
    case INVALIDATE_QUERY: // refresh
      return { ...state, didInvalidate: true }; // TIL object spread syntax

    case REQUEST_SNAPS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      };

    case RECEIVE_SNAPS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: action.snaps,
        lastUpdated: action.receivedAt
      };

    default:
      return state;
  }
}

function snapsByQuery(state = {}, action) {
  switch (action.type) {
    case INVALIDATE_QUERY:
    case RECEIVE_SNAPS:
    case REQUEST_SNAPS:
      return {...state, [action.query]: snaps(state[action.query], action)
    }
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  snapsByQuery,
  selectedQuery
})

export default rootReducer
