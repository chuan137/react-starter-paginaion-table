import { routinesWatcherSaga } from 'redux-saga-routines';
import fetchDataSagas from './fetch-data';

const sagas = [
  ...fetchDataSagas,
  routinesWatcherSaga,
];

export default sagas;
