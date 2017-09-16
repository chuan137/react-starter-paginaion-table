import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import createDataHub from './lib/createDataHub';

import tableReducer from './lib/reducers';
import sagas from './lib/sagas';

const userHub = createDataHub('users', 'users');

const reducers = {
  table: tableReducer,
  ...userHub.reducer,
};

function* rootSaga() {
  yield all([...sagas, ...userHub.sagas]);
}

export default function (history) {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    combineReducers({ ...reducers, router: routerReducer }),
    composeWithDevTools(
      applyMiddleware(
        sagaMiddleware,
        routerMiddleware(history)),
    ),
  );

  sagaMiddleware.run(rootSaga);

  return store;
}

export { userHub };
