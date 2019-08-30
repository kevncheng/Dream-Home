import { FETCH_POSTS_SUCCESS, FETCH_POSTS_FAIL, FETCHING_POSTS } from '../actions/types';

const INITIAL_STATE = {
    posts: [],
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
    case FETCHING_POSTS:
        return { ...state, loading: true };
    case FETCH_POSTS_SUCCESS:
        return { ...state, loading: false, posts: payload };
    case FETCH_POSTS_FAIL:
        return { ...state, loading: false };
    default:
        return state;
    }
};
