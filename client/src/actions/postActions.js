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
    POST_COMMENT_FAIL,
    FETCH_CURRENT_POST,
    DELETE_COMMENT_FAIL,
    DELETE_COMMENT_SUCCESS,
    REPLY_SUCCESS,
    DELETE_REPLY_SUCCESS
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
            // payload: err.message
        });
    }
};

// Fetch a single post
export const fetchCurrentPost = post_id => async dispatch => {
    try {
        dispatch({
            type: FETCHING_POSTS
        });
        const res = await axios.get(`/posts/${post_id}`);
        dispatch({
            type: FETCH_CURRENT_POST,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: FETCH_POSTS_FAIL
            // payload: err.response.data
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
    } catch (err) {
        dispatch({ type: POST_COMMENT_FAIL, payload: err.message });
    }
};

// Delete a comment
export const deleteComment = (comment_id, reply = false) => async dispatch => {
    try {
        await axios.delete(`/posts/comment/${comment_id}`);
        if (reply) {
            dispatch({
                type: DELETE_REPLY_SUCCESS,
                payload: comment_id
            });
        } else {
            dispatch({
                type: DELETE_COMMENT_SUCCESS,
                payload: comment_id
            });
        }
    } catch (err) {
        dispatch({
            type: DELETE_COMMENT_FAIL
        });
    }
};

// Reply to comment
export const replyComment = (parent_id, comment, user) => async dispatch => {
    const { _id, profile, name, username } = user;
    try {
        const res = await axios.put(`/posts/${parent_id}/reply`, { comment });
        res.data.user = { _id, profile, name, username };
        dispatch({ type: REPLY_SUCCESS, payload: res.data });
    } catch (err) {
        dispatch({ type: POST_COMMENT_FAIL, payload: err.message });
    }
};
