import { call, put, takeEvery } from '@redux-saga/core/effects';
import { ADD_BOARD, ADD_BOARD_ERROR, ADD_BOARD_SUCCESS } from '../actions/types';
import { boardService } from '../services/board';

function * addBoard (request) {
    try {
        const response = yield call(boardService.addBoard, { ...request });
        yield put({ type: ADD_BOARD_SUCCESS, response });
    } catch (err) {
        yield put({ type: ADD_BOARD_ERROR, err });
    }
}

export function * addBoardSaga () {
    yield takeEvery(ADD_BOARD, addBoard);
}
