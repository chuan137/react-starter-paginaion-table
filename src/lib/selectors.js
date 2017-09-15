/* eslint-disable import/prefer-default-export */
import { pageSize } from '../api/service';

export const getTableData = (state, tableName, start, end) => {
  let items = [];

  const startPage = Math.floor(start / pageSize);
  const endPage = Math.ceil(end / pageSize) - 1;
  // console.log(start, end, startPage, endPage);

  if (state.table &&
    state.table[tableName] &&
    state.table[tableName].pages
  ) {
    for (let i = startPage; i <= endPage; i += 1) {
      const l = (i === startPage) ? start % pageSize : 0;
      const r = (i === endPage) ? ((end - 1) % pageSize) + 1 : pageSize;
      // console.log(l, r);
      try {
        items = items.concat(
          state.table[tableName].pages[i].ids.slice(l, r).map(id =>
            state.table[tableName].pages[i].items[id],
          ));
      } catch (error) { }
    }

    return items;
  }
  return [];
};

export const getTableTotal = (state, tableName) => {
  if (state.table &&
    state.table[tableName] &&
    state.table[tableName].total
  ) {
    return state.table[tableName].total;
  }
  return 0;
};

export const getTableIsFetching = (state, tableName) => {
  if (state.table &&
    state.table[tableName] &&
    state.table[tableName].isFetching
  ) {
    return state.table.isFetching;
  }
  return false;
};

export const isPageFetched = (state, tableName, page) => {
  if (
    state.table &&
    state.table[tableName] &&
    state.table[tableName].pages &&
    state.table[tableName].pages[page]
  ) {
    return true;
  }

  return false;
};
