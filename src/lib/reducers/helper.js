/* eslint-disable import/prefer-default-export */

export function getTableName(action) {
  if (action.meta && action.meta.table) {
    return action.meta.table;
  }
  throw new Error('table is not specified in action');
}
