import dotProp from 'dot-prop-immutable';
import { getTableName } from './helper';

export function onFetchRequest(state, action) {
  const table = getTableName(action);
  return dotProp.set(state, `${table}.isLoadingData`, true);
}

export function onFetchFullfil(state, action) {
  const table = getTableName(action);
  return dotProp.set(state, `${table}.isLoadingData`, false);
}

export function onFetchSuccess(state, action) {
  const table = getTableName(action);
  const items = action.payload;
  const itemId = items.map(item => item.id);

  const newItems = {};
  items.forEach((item) => {
    newItems[item.id] = item;
    return newItems;
  });

  const updateById = dotProp.set(
    state,
    `${table}.data.byId`,
    data => Object.assign({}, data, newItems),
  );

  return dotProp.set(
    updateById,
    `${table}.data.allIds`,
    (allIds) => {
      if (!Array.isArray(allIds)) { return itemId; }
      return allIds.concat(itemId);
    },
  );
}

export function onFetchFailure(state, action) {
  const table = getTableName(action);
  return dotProp.set(state, `${table}.error`, action.error);
}
