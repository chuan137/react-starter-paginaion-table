/* eslint-disable */
import dotProp from 'dot-prop-immutable';
import { getTableName } from './helper';

export function onReset(state, action) {
  const table = getTableName(action);
  return dotProp.set(state, `{table}`, {});
}
