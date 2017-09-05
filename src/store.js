import { createStore, combineReducers, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { routerReducer, routerMiddleware } from 'react-router-redux';


const reducers = [];

export default function (history) {
  return createStore(
    combineReducers({ ...reducers, router: routerReducer }),
    composeWithDevTools(
      applyMiddleware(routerMiddleware(history)),
    ),
  );
}

