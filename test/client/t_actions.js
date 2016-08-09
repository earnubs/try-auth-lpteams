import expect, { createSpy, spyOn, isSpy } from 'expect';
import nock from 'nock';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import * as actions from '../../client/actions';
import * as types from '../../client/actionTypes';



const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);

describe('Action creators suite', () => {

  describe('Simple action creators', () => {
    it('selectSeries action creator returns correct action', () => {
      expect(actions.selectSeries(16)).toEqual({
        type: types.SELECT_SERIES,
        series: 16
      });
    });

    it('selectArch action creator returns correct action', () => {
      expect(actions.selectArch('amd64')).toEqual({
        type: types.SELECT_ARCH,
        arch: 'amd64'
      });
    });

    it('selectChannel action creator returns correct action', () => {
      const channel = 'edge';

      expect(actions.selectChannel(channel)).toEqual({
        type: types.SELECT_CHANNEL,
        channel
      });
    });

    it('selectConfinement action creator returns correct action', () => {
      const confinement = 'strict';

      expect(actions.selectConfinement(confinement)).toEqual({
        type: types.SELECT_CONFINEMENT,
        confinement
      });
    });

    it('selectQuery action creator returns correct action', () => {
      const query = 'foo';

      expect(actions.selectQuery(query)).toEqual({
        type: types.SELECT_QUERY,
        query
      });
    });

    it('requestQuerySnaps action creator returns correct action', () => {
      const query = 'bar';

      expect(actions.requestQuerySnaps(query)).toEqual({
        type: types.REQUEST_QUERY_SNAPS,
        query
      });
    });

    it('requestSnap action creator returns correct action', () => {
      const id = 'baz';
      expect(actions.requestSnap(id)).toEqual({
        type: types.REQUEST_SNAP,
        id
      });
    });
  });

  describe('Date dependent action creators', () => {

    beforeEach(() => {
      expect.spyOn(Date, 'now').andReturn(1);
    });

    afterEach(() => {
    });

    it('receiveQuerySnaps action creator returns correct action', () => {
      const { query, snaps } = {query: 'foo', snaps: {}};

      expect(actions.receiveQuerySnaps(query, snaps)).toEqual({
        type: types.RECEIVE_QUERY_SNAPS,
        query,
        snaps,
        receivedAt: 1
      });
    });

    it('receiveSnap action creator returns correct action', () => {
      expect(actions.receiveSnap('foo', {})).toEqual({
        type: types.RECEIVE_SNAP,
        id: 'foo',
        snap: {},
        receivedAt: 1
      });
    });
  });

  describe('Thunk returning action creators', () => {

    it('fetchQuerySnapsIfNeeded success, empty results', () => {

      const [query, arch] = ['foo', 'amd64'];

      nock('http://localhost:3000/')
        .get(`/api/search/16/${query}/${arch}`)
        .reply(200, []);


      const expectedActions = [
        { type: types.REQUEST_QUERY_SNAPS, query},
        { type: types.RECEIVE_QUERY_SNAPS, query, snaps: [], receivedAt: 1 }
      ];
      const store = mockStore({
        snapsFromQuery: {
          isFetching: false,
          items: [],
          lastUpdated: 1
        }
      });

      return store.dispatch(actions.fetchQuerySnapsIfNeeded(query, arch))
        .then(() => { // return of async actions
          expect(store.getActions()).toEqual(expectedActions);
        });

    });

  });
});
