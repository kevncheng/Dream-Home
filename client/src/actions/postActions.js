/* eslint-disable camelcase */
import {
    FETCH_POSTS_SUCCESS,
    FETCH_POSTS_FAIL,
    SEARCH_POSTS,
    FETCHING_POSTS,
    FETCH_COMMENTS_SUCCESS,
    FETCH_COMMENTS_FAIL,
    FETCHING_COMMENTS,
    POST_COMMENT_SUCCESS,
    POST_COMMENT_FAIL
} from './types';
import axios from 'axios';

export const searchPosts = (search_filter, easy_filters, userId) => ({
    type: SEARCH_POSTS,
    search_filter,
    easy_filters,
    userId
});

// Fetch posts based on filter or interest
export const fetchPosts = (search_filter, easy_filters, userId, size) => async dispatch => {
    try {
        dispatch({
            type: FETCHING_POSTS
        });
        const res = await axios.get(
            `/posts?userId=${userId}&search_filter=${search_filter}&easy_filters=${easy_filters}&size=${size}`
        );
        dispatch({
            type: FETCH_POSTS_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: FETCH_POSTS_FAIL
        });
    }
};

// Fetch comments from post
export const fetchComments = post_id => async dispatch => {
    try {
        dispatch({
            type: FETCHING_COMMENTS
        });
        const res = await axios.get(`/posts/${post_id}/comment`);
        dispatch({ type: FETCH_COMMENTS_SUCCESS, payload: res.data.comments });
    } catch (err) {
        dispatch({ type: FETCH_COMMENTS_FAIL });
    }
};

// Comment on a post
export const postComment = (post_id, comment) => async dispatch => {
    try {
        const res = await axios.put(`/posts/${post_id}/comment`, { comment });
        dispatch({ type: POST_COMMENT_SUCCESS, payload: res.data.comments });
        console.log(res.data);
    } catch (err) {
        dispatch({ type: POST_COMMENT_FAIL, payload: err.message });
    }
};
