import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// redux
import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import root from './reducers/root';
import rootSaga from './sagas/root';
import thunk from 'redux-thunk';

const sagaMiddleware = createSagaMiddleware();
const store = createStore(root, applyMiddleware(sagaMiddleware, thunk));
sagaMiddleware.run(rootSaga);

const Application = () => (
    <Provider store={store}>
        <App />
    </Provider>
);
ReactDOM.render(<Application />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
