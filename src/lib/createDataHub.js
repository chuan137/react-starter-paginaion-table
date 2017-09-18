/* eslint-disable  no-underscore-dangle */
import { createRoutine } from 'redux-saga-routines';
import { createReducer } from 'redux-create-reducer';
import { createSelector } from 'reselect';
import { takeEvery, put, select } from 'redux-saga/effects';
import dotProp from 'dot-prop-immutable';
import _ from 'lodash';

import api from '../api/service';


export default function (endpoint, storeKey) {
  const service = api(endpoint);

  const fetchAll = createRoutine(`@@DATA/${storeKey.toUpperCase()}_FETCH_ALL`);
  const clearAll = createRoutine(`@@DATA/${storeKey.toUpperCase()}_CLEAR_ALL`);
  const setFilter = createRoutine(`@@DATA/${storeKey.toUpperCase()}_SET_FILTER`);


  // const storeKeyUpperCase = storeKey.toUpperCase();
  // const _fetch = createRoutine(`@@DATA/FETCH_${storeKeyUpperCase}`);
  // const _reset = createRoutine(`@@DATA/RESET_${storeKeyUpperCase}`);

  // const CLEAR_DATA = `@@DATA/CLEAR_DATA_${storeKeyUpperCase}`;

  // const SET_FILTER = `@@DATA/SET_FILTER_${storeKeyUpperCase}`;
  // const SET_FILTER_TRIGGER = `@@DATA/SET_FILTER_${storeKeyUpperCase}_TRIGGER`;
  // // const setFilter = filter => ({
  //   type: SET_FILTER_TRIGGER,
  //   payload: filter,
  // });

  function* fetchFlow(isPageFetchedSelector, filterSelector, action) {
    try {
      let response;
      const page = _.get(action, 'payload.page', 0);
      const filter = yield select(filterSelector);
      const fetched = yield select(isPageFetchedSelector, page);

      if (!fetched) {
        yield put(_fetch.request());
        response = yield service.fetch(page, filter);
        yield put(_fetch.success({ ...response, page }));
      }
    } catch (error) {
      yield put(_fetch.failure());
    } finally {
      yield put(_fetch.fulfill());
    }
  }

  function* setFilterFlow(action) {
    yield put({ type: CLEAR_DATA });
    yield put({ type: SET_FILTER, payload: action.payload });
    yield put(_fetch.trigger());
  }

  function onFetchRequest(state) {
    return dotProp.set(state, 'isFetching', true);
  }

  function onFetchFulfill(state) {
    return dotProp.set(state, 'isFetching', false);
  }

  function onFetchFailure(state, action) {
    return dotProp.set(state, 'error', action.error);
  }

  function onFetchSuccess(state, action) {
    const { total, page, data } = action.payload;

    const ids = data.map(record => record.id);
    const items = data.reduce((obj, record) => {
      obj[record.id] = record; /* eslint-disable-line */
      return obj;
    }, {});

    const updateTotal = dotProp.set(state, 'total', total);
    const updateIds = dotProp.set(updateTotal, `data.${page}.ids`, ids);
    return dotProp.set(updateIds, `data.${page}.byId`, items);
  }

  function onSetFilter(state, action) {
    return dotProp.set(state, 'filter', action.payload);
  }

  function onClearData(state) {
    return dotProp.set(state, 'data', {});
  }


  const initState = {
    isFetching: false,
    filter: '',
    pageSize: 100,
    total: 0,
    data: {},
    error: null,
  };
  const reducer = {
    [storeKey]: createReducer(initState, {
      [_fetch.REQUEST]: onFetchRequest,
      [_fetch.SUCCESS]: onFetchSuccess,
      [_fetch.FAILURE]: onFetchFailure,
      [_fetch.FULFILL]: onFetchFulfill,
      [SET_FILTER]: onSetFilter,
      [CLEAR_DATA]: onClearData,
    }),
  };

  const selectors = {
    isPageFetched(state, page) {
      return Object.keys(_.get(state, `${storeKey}.data.${page}`, {})).length > 0;
    },
    isFetching(state) {
      return _.get(state, `${storeKey}.isFetching`, undefined);
    },
    getTotal(state) {
      return _.get(state, `${storeKey}.total`, undefined);
    },
    getPageSize(state) {
      return _.get(state, `${storeKey}.pageSize`);
    },
    getAllPages(state) {
      return _.get(state, `${storeKey}.data`);
    },
    getFilter(state) {
      return _.get(state, `${storeKey}.filter`);
    },
  };

  selectors.getData = createSelector([
    selectors.getAllPages,
    selectors.getPageSize,
    (state, props) => props,
  ], (pages, pageSize, props) => {
    let data = [];

    if (Object.keys(pages).length > 0) {
      const start = props.page * props.pageSize;
      const end = start + props.pageSize;
      const startPage = Math.floor(start / pageSize);
      const endPage = Math.ceil(end / pageSize) - 1;

      for (let i = startPage; i <= endPage; i += 1) {
        const l = (i === startPage) ? start % pageSize : 0;
        const r = (i === endPage) ? ((end - 1) % pageSize) + 1 : pageSize;
        // console.log(l, r);
        data = data.concat(
          _.get(pages[i], 'ids', []).slice(l, r).map(id =>
            _.get(pages[i], `byId.${id}`, [])));
      }
    }

    return data;
  });

  const sagas = [
    takeEvery(_fetch.TRIGGER, fetchFlow, selectors.isPageFetched, selectors.getFilter),
    takeEvery(SET_FILTER_TRIGGER, setFilterFlow),
  ];

  const fetch = _fetch.trigger;
  const reset = _reset.trigger;

  return {
    fetch,
    reset,
    setFilter: filter => setFilter.trigger(filter),
    sagas,
    reducer,
    selectors,
  };
}
