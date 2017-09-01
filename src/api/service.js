import data from './mock_data.json';

const length = data.length;

const service = {
  fetch(bsize = 20, page = 1) {
    const start = bsize * page;
    const end = start + bsize;
    if (start < 0 || start > length) {
      return Promise.reject('Range is not correct');
    }
    return Promise.resolve(data.slice(start, end));
  },
};

export default service;
