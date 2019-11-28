import { FETCH_COMMENTS_SUCCESS, FETCH_COMMENTS_FAIL, FETCHING_COMMENTS, DELETE_COMMENT_SUCCESS, DELETE_COMMENT_FAIL } from '../actions/types';
import _ from 'lodash';
const INITIAL_STATE = {
    comments: [],
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    const { type, payload } = action;
    switch (type) {
    case FETCHING_COMMENTS:
        return { ...state, loading: true };
    case FETCH_COMMENTS_SUCCESS:
        return { ...state, loading: false, comments: payload };
    case FETCH_COMMENTS_FAIL:
        return { ...state, loading: false };
    case DELETE_COMMENT_SUCCESS:
        return { ...state, comments: _.filter(state.comments, comment => comment._id !== payload)};
    case DELETE_COMMENT_FAIL:
        return { ...state, error: 'Something went wrong'};
    default:
        return state;
    }
};
