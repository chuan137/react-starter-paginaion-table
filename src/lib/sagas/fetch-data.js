import { takeEvery, put, select } from 'redux-saga/effects';
import { fetch } from '../routines';
import api from '../../api/service';
import { isPageFetched } from '../selectors';

const service = api();

function* fetchDataFlow(action) {
  // const params = action.payload.params ? action.payload.params : {};
  let table;
  let page;
  try {
    table = action.payload.table ? action.payload.table : null;
    page = action.payload.page ? action.payload.page : 0;

    if (!table) { throw new Error('Table name missing'); }

    const isFetched = yield select(isPageFetched, table, page);

    if (!isFetched) {
      yield put(Object.assign({}, fetch.request(), { meta: { table } }));
      const response = yield service.fetch(page);
      yield put(Object.assign({}, fetch.success(response), { meta: { table, page } }));
    }
  } catch (error) {
    yield put(Object.assign({}, fetch.failure(error), { meta: { table } }));
  } finally {
    yield put(Object.assign({}, fetch.fulfill(), { meta: { table } }));
  }
}

const fetchSagas = [
  takeEvery(fetch.TRIGGER, fetchDataFlow),
];

export default fetchSagas;
