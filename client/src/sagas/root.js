import { all, fork } from 'redux-saga/effects';
import * as userSagas from './user';
import * as postSagas from './post';
import * as boardSagas from './board';

// import watchers from other files
export default function * rootSaga () {
    yield all([
        ...Object.values(userSagas),
        ...Object.values(postSagas),
        ...Object.values(boardSagas)
    ].map(fork));
}
