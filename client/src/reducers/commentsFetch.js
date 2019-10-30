import { FETCH_COMMENTS_SUCCESS, FETCH_COMMENTS_FAIL, FETCHING_COMMENTS } from '../actions/types';

const INITIAL_STATE = {
    comments: [],
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
    case FETCHING_COMMENTS:
        return { ...state, loading: true, comments: [] };
    case FETCH_COMMENTS_SUCCESS:
        return { ...state, loading: false, comments: payload };
    case FETCH_COMMENTS_FAIL:
        return { ...state, loading: false };
    default:
        return state;
    }
};
