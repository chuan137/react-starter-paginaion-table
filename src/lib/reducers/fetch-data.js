import dotProp from 'dot-prop-immutable';
import { getTableName, getPage } from './helper';

export function onFetchRequest(state, action) {
  const table = getTableName(action);
  return dotProp.set(state, `${table}.isFetching`, true);
}

export function onFetchFullfil(state, action) {
  const table = getTableName(action);
  return dotProp.set(state, `${table}.isFetching`, false);
}

export function onFetchSuccess(state, action) {
  const table = getTableName(action);
  const page = getPage(action);
  const total = action.payload.total;
  const items = action.payload.data;
  const itemIds = items.map(item => item.id);

  const newItems = {};
  items.forEach((item) => {
    newItems[item.id] = item;
    return newItems;
  });

  const updateTotal = dotProp.set(
    state,
    `${table}.total`,
    total,
  );

  const updateIds = dotProp.set(
    updateTotal,
    `${table}.pages.${page}.ids`,
    itemIds,
  );

  return dotProp.set(
    updateIds,
    `${table}.pages.${page}.items`,
    items.reduce((obj, item) => {
      obj[item.id] = item;
      return obj;
    }, {}),
  );
}

export function onFetchFailure(state, action) {
  const table = getTableName(action);
  return dotProp.set(state, `${table}.error`, action.error);
}
