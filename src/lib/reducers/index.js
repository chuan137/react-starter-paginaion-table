import { createReducer } from 'redux-create-reducer';
import { getTotal, fetch, reset } from '../routines';
import { onFetchRequest, onFetchSuccess, onFetchFailure, onFetchFullfil } from './fetch-data';
import { onGetTotalSuccess } from './get-total';
import { onReset } from './reset';

const initState = {};

export default createReducer(initState, {
  [getTotal.SUCCESS]: onGetTotalSuccess,
  [fetch.REQUEST]: onFetchRequest,
  [fetch.SUCCESS]: onFetchSuccess,
  [fetch.FAILURE]: onFetchFailure,
  [fetch.FULFILL]: onFetchFullfil,
  [reset.TRIGGER]: onReset,
});
