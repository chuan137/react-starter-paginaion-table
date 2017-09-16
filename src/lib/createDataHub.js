/* eslint-disable  no-underscore-dangle */
import { createRoutine } from 'redux-saga-routines';
import { createReducer } from 'redux-create-reducer';
import { takeEvery, put, select } from 'redux-saga/effects';
import dotProp from 'dot-prop-immutable';
import _ from 'lodash';

import api from '../api/service';


export default function (endpoint, storeKey) {
  const service = api(endpoint);

  const _fetch = createRoutine(`@@DATA/FETCH_${storeKey}`);
  const _reset = createRoutine(`@@DATA/RESET_${storeKey}`);

  function* fetchFlow(action, isPageFetchedSelector) {
    try {
      let response;
      const page = _.get(action, 'playload.page', 0);
      const fetched = yield select(isPageFetchedSelector, page);

      if (!fetched) {
        yield put(_fetch.request());
        response = yield service.fetch(page);
        yield put(_fetch.success({ response, page }));
      }
    } catch (error) {
      yield put(_fetch.failure());
    } finally {
      yield put(_fetch.fulfill());
    }
  }

  function onFetchRequest(state) {
    return dotProp.set(state, `${storeKey}.isFetching`, true);
  }

  function onFetchFullfil(state) {
    return dotProp.set(state, `${storeKey}.isFetching`, false);
  }

  function onFetchSuccess(state, action) {
    const { total, page, data } = action.payload;

    const ids = data.map(record => record.id);
    const items = data.reduce((obj, record) => {
      obj[record.id] = record; /* eslint-disable-line */
      return obj;
    }, {});

    const updateTotal = dotProp.set(state, `${storeKey}.total`, total);
    const updateIds = dotProp.set(updateTotal, `${storeKey}.pages.${page}.ids`, ids);
    return dotProp.set(updateIds, `${storeKey}.pages.${page}.byId`, items);
  }

  function onFetchFailure(state, action) {
    return dotProp.set(state, '{storeKey}.error', action.error);
  }


  const initState = {
    isFetching: false,
    pageSize: 100,
    total: 0,
    pages: {},
    error: null,
  };

  const reducer = createReducer(initState, {
    [_fetch.REQUEST]: onFetchRequest,
    [_fetch.SUCCESS]: onFetchSuccess,
    [_fetch.FAILURE]: onFetchFailure,
    [_fetch.FULFILL]: onFetchFullfil,
  });

  const selectors = {
    isPageFetched(state, page) {
      return Object.keys(_.get(state, `${storeKey}.pages.${page}`, {})).length === 0;
    },
    isFetching(state) {
      return _.get(state, `${storeKey}.isFetching`, undefined);
    },
    getTotal(state) {
      return _.get(state, `${storeKey}.total`, undefined);
    },
    getData(state, start, end) {
      const { pageSize } = state;
      const pages = _.get(state, '{storeKey}.pages');

      if (Object.keys(pages).length > 0) {
        let items = [];
        const startPage = Math.floor(start / pageSize);
        const endPage = Math.ceil(end / pageSize) - 1;
        for (let i = startPage; i <= endPage; i += 1) {
          const l = (i === startPage) ? start % pageSize : 0;
          const r = (i === endPage) ? ((end - 1) % pageSize) + 1 : pageSize;
          items = items.concat(
            _.get(state, `${storeKey}.pages.${i}.ids`, []).slice(l, r).map(id =>
              _.get(state, `${storeKey}.pages.${i}.byId.${id}`), []));
        }
        return items;
      }

      return [];
    },

  };

  const sagas = [
    takeEvery(_fetch.TRIGGER, fetchFlow, selectors.isPageFetched),
  ];

  const fetch = dispatch => dispatch(_fetch.trigger());
  const reset = dispatch => dispatch(_reset.trigger());

  return {
    fetch,
    reset,
    sagas,
    reducer,
    selectors,
  };
}
