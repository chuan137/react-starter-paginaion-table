import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';
import tableReducer from './lib/reducers';
import sagas from './lib/sagas';

const reducers = {
  table: tableReducer,
};

function* rootSaga() {
  yield all([...sagas]);
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

