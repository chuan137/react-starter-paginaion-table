import data from './mock_data.json';

const pageSize = 100;

const length = data.length;

const service = {
  fetch(page) {
    if (page < 0 || page >= Math.ceil(length / pageSize)) {
      return Promise.reject('Range is not correct');
    }

    const start = page * pageSize;
    const end = start + pageSize;

    return Promise.resolve({
      total: length,
      data: data.slice(start, end),
    });
  },
};

export { pageSize };
export default service;
