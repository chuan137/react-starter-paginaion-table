import { createRoutine } from 'redux-saga-routines';

const fetch = createRoutine('@@DATA/FETCH');
const reset = createRoutine('@@DATA/RESET');
const getTotal = createRoutine('@@DATA/GET_Total');

export { getTotal, fetch, reset };
