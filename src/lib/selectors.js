/* eslint-disable import/prefer-default-export */

export const getTableData = (state, tableName) => {
  if (state.table &&
      state.table[tableName] &&
      state.table[tableName].data &&
      state.table[tableName].data.byId) {
    const dataById = state.table[tableName].data.byId;
    return Object.keys(dataById).map(key => dataById[key]);
  }
  return [];
};
