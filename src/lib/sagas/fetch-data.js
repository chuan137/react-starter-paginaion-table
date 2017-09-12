import { takeEvery, put } from 'redux-saga/effects';
import { fetch, getTotal } from '../routines';
import api from '../../api/service';

function* fetchDataFlow(action) {
  const table = action.payload.table ? action.payload.table : null;
  // const params = action.payload.params ? action.payload.params : {};
  try {
    yield put(Object.assign({}, fetch.request(), { meta: { table } }));
    const totalItems = yield api.getTotal();
    yield put(Object.assign({}, getTotal.success(totalItems), { meta: { table } }));
    const response = yield api.fetch();
    yield put(Object.assign({}, fetch.success(response), { meta: { table } }));
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
