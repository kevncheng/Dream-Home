/* eslint-disable camelcase */
import { FETCH_POSTS_SUCCESS, FETCH_POSTS_FAIL, SEARCH_POSTS, FETCHING_POSTS } from '../actions/types';
import { postService } from '../services/post';

export const searchPosts = (search_filter, easy_filters, userId) => ({
    type: SEARCH_POSTS,
    search_filter,
    easy_filters,
    userId
});

// Fetch posts based on filter or interest
export const fetchPosts = (search_filter, easy_filters, userId) => async dispatch => {
    try {
        dispatch({
            type: FETCHING_POSTS
        });
        const res = await postService.searchPosts({ search_filter, easy_filters, userId });
        dispatch({
            type: FETCH_POSTS_SUCCESS,
            payload: res
        });
    } catch (err) {
        dispatch({
            type: FETCH_POSTS_FAIL
        });
    }
};
