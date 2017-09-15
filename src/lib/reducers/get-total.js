/* eslint-disable import/prefer-default-export */
import dotProp from 'dot-prop-immutable';
import { getTableName } from './helper';

export function onGetTotalSuccess(state, action) {
  const table = getTableName(action);
  return dotProp(state, `${table}.total`, action.payload);
}
