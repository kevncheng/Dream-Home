import { call, put, takeEvery, takeLatest } from '@redux-saga/core/effects';
import {
    ADD_POST,
    ADD_POST_ERROR,
    ADD_POST_SUCCESS,
    FETCH_POSTS_FAIL,
    FETCH_POSTS_SUCCESS,
    SEARCH_POSTS,
    FETCHING_POSTS
} from '../actions/types';
import { postService } from '../services/post';

function * addPost (request) {
    try {
        const response = yield call(postService.addPost, { ...request });
        yield put({ type: ADD_POST_SUCCESS, response });
    } catch (err) {
        yield put({ type: ADD_POST_ERROR, err });
    }
}

export function * addPostSaga () {
    yield takeEvery(ADD_POST, addPost);
}

function * searchPosts (request) {
    try {
        yield put({ type: FETCHING_POSTS });
        const response = yield call(postService.searchPosts, { ...request });
        yield put({ type: FETCH_POSTS_SUCCESS, payload: response });
    } catch (err) {
        yield put({ type: FETCH_POSTS_FAIL });
    }
}

export function * searchPostSaga () {
    yield takeLatest(SEARCH_POSTS, searchPosts);
}
