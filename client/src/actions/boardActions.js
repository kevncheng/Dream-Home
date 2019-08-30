import { FETCH_BOARD_POSTS_SUCCESS, FETCHING_BOARD_POSTS, FETCH_BOARD_POSTS_FAIL } from './types';
import axios from 'axios';

// Fetch the board's post
export const fetchBoardPosts = id => async dispatch => {
    try {
        dispatch({
            type: FETCHING_BOARD_POSTS
        });
        const res = await axios.get(`/boards/${id}/posts`);
        dispatch({
            type: FETCH_BOARD_POSTS_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: FETCH_BOARD_POSTS_FAIL,
            error: { message: 'Unable to fetch posts', status: 'error' }
        });
    }
};
