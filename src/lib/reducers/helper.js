/* eslint-disable import/prefer-default-export */

export function getTableName(action) {
  if (action.meta && action.meta.table) {
    return action.meta.table;
  }
  throw new Error('table is not specified in action');
}

export function getPage(action) {
  if (action.meta && action.meta.page !== undefined) {
    return action.meta.page;
  }
  throw new Error('Page is not specified in action');
}
