import {
    FETCH_COMMENTS_SUCCESS,
    FETCH_COMMENTS_FAIL,
    FETCHING_COMMENTS,
    DELETE_COMMENT_SUCCESS,
    DELETE_COMMENT_FAIL,
    DELETE_REPLY_SUCCESS,
    REPLY_SUCCESS
} from '../actions/types';
import _ from 'lodash';
import update from 'immutability-helper';

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
        return { ...state, comments: _.filter(state.comments, comment => comment._id !== payload) };
    case DELETE_COMMENT_FAIL:
        return { ...state, error: 'Something went wrong' };
    case DELETE_REPLY_SUCCESS:
        return { ...state,
            commments: _.filter(state.comments, comment => {
                return comment.childComments.some(child => {
                    return child._id !== payload;
                });
            }) };
    case REPLY_SUCCESS:
        const index = _.findIndex(state.comments, { _id: payload.parentComment });
        const newChild = update(state.comments[index].childComments, { $push: [payload] });
        return {
            ...state,
            comments: state.comments.map((comment, i) => {
                return i === index
                    ? { ...state.comments[index], childComments: newChild }
                    : comment;
            })
        };

    // case DELETE_REPLY_SUCCESS:
    //     return { ...state,
    //         comments: _.filter(state.comments, comment => {
    //             return comment.childComments.some(child => {
    //                 return child._id !== payload;
    //             });
    //         })
    //     };
    default:
        return state;
    }
};
