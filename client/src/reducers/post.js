import { FETCH_POSTS_FAIL, FETCHING_POSTS, FETCH_CURRENT_POST } from '../actions/types';

const INITIAL_STATE = {
    loading: false,
    postFound: null
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
    case FETCHING_POSTS:
        return { ...state, loading: true };
    case FETCH_CURRENT_POST:
        return { ...state, loading: false, ...payload, postFound: true };
    case FETCH_POSTS_FAIL:
        return { ...state, loading: false, err: payload, postFound: false };
    default:
        return state;
    }
};
