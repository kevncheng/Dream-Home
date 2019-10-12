/* eslint-disable camelcase */
import { FETCH_POSTS_SUCCESS, FETCH_POSTS_FAIL, SEARCH_POSTS, FETCHING_POSTS } from './types';
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
