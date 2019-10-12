import {
    ADD_BOARD,
    ADD_POST,
    GET_USER_BOARDS_POSTS,
    FOLLOW_FAIL,
    FOLLOW_SUCCESS,
    UNFOLLOW_FAIL,
    UNFOLLOW_SUCCESS,
    FETCHING_PROFILE,
    FETCH_FOLLOWINGS_SUCCESS,
    FETCH_FOLLOWINGS_FAIL,
    FETCH_FOLLOWERS_SUCCESS,
    FETCH_FOLLOWERS_FAIL,
    FETCH_PROFILE_SUCCESS,
    FETCH_PROFILE_FAIL,
    CREATE_POST_LOADING,
    ADD_POST_ERROR,
    ADD_POST_SUCCESS,
    EDIT_PROFILE_SUCCESS,
    EDIT_PROFILE_FAIL,
    CLEAR_ERROR,
    DELETE_FAIL,
    DELETE_SUCCESS,
    CURRENT_USER_CHECK,
    FAVOURITE_POST
} from '../actions/types';
import axios from 'axios';
import _ from 'lodash';

export const getBoardsandPosts = username => ({
    type: GET_USER_BOARDS_POSTS,
    username
});

export const addBoard = (board, username) => ({
    type: ADD_BOARD,
    board,
    username
});

export const addPost = (post, username) => ({
    type: ADD_POST,
    post,
    username
});

export const fetchProfileInfo = (username, currentUser) => async dispatch => {
    try {
        const isCurrentUser = username === currentUser;
        dispatch({
            type: FETCHING_PROFILE
        });
        dispatch({
            type: CURRENT_USER_CHECK,
            payload: isCurrentUser
        });
        const res = await axios.get(`/users/${username}?isCurrentUser=${isCurrentUser}`);
        const profileInfo = res.data.user;
        dispatch({
            type: FETCH_PROFILE_SUCCESS,
            payload: profileInfo
        });
    } catch (err) {
        dispatch({
            type: FETCH_PROFILE_FAIL,
            payload: {
                error: {
                    message: 'Something went wrong with fetching the profile',
                    status: 'error'
                }
            }
        });
    }
};

export const followUser = (followee, _id) => async dispatch => {
    try {
        const body = {
            followee
        };
        await axios.post('/users/follow', body);
        dispatch({
            type: FOLLOW_SUCCESS,
            payload: { _id }
        });
    } catch (err) {
        dispatch({
            type: FOLLOW_FAIL,
            payload: { error: 'Failed to follow user' }
        });
    }
};
export const unfollowUser = (followee, id) => async dispatch => {
    try {
        const body = {
            followee
        };
        await axios.post('/users/unfollow', body);
        dispatch({
            type: UNFOLLOW_SUCCESS,
            payload: id
        });
    } catch (err) {
        dispatch({
            type: UNFOLLOW_FAIL,
            payload: 'Failed to unfollow user'
        });
    }
};

export const fetchFollowing = username => async dispatch => {
    try {
        const res = await axios.get(`/users/${username}/following`);
        dispatch({
            type: FETCH_FOLLOWINGS_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: FETCH_FOLLOWINGS_FAIL,
            payload: { error: 'Something went wrong with fetching followings' }
        });
    }
};

export const fetchFollowers = username => async dispatch => {
    try {
        const res = await axios.get(`/users/${username}/following`);
        dispatch({
            type: FETCH_FOLLOWERS_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: FETCH_FOLLOWERS_FAIL,
            payload: { error: 'Something went wrong with fetching followers' }
        });
    }
};

export const createPost = (formData, username, board) => async dispatch => {
    try {
        dispatch({
            type: CREATE_POST_LOADING
        });
        const res = await axios({
            url: '/users/' + username + '/posts',
            method: 'POST',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        if (!_.isEmpty(board)) {
            await axios.put(`/boards/${board}/post`, { _id: res.data.post._id });
        }
        dispatch({
            type: ADD_POST_SUCCESS,
            payload: {
                post: res.data.post,
                error: {
                    message: 'Succesfully created a post',
                    status: 'success'
                }
            }
        });
    } catch (err) {
        dispatch({
            type: ADD_POST_ERROR,
            err: { message: 'Failed to create post', status: 'error' }
        });
    }
};

export const editProfile = (formData, username) => async dispatch => {
    try {
        const res = await axios.put(`/users/${username}`, formData);
        dispatch({
            type: EDIT_PROFILE_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: EDIT_PROFILE_FAIL,
            payload: {
                error: {
                    message: 'Something went wrong with updating the profile',
                    status: 'error'
                }
            }
        });
    }
};

export const clearError = () => ({
    type: CLEAR_ERROR
});

export const favouritePost = (username, post, isFavourited) => async dispatch => {
    try {
        const res = await axios.post(`/users/${username}/${isFavourited}`, { post });
        dispatch({
            type: FAVOURITE_POST,
            payload: res.data.user
        });
    } catch (err) {
        console.log('Something went wrong with favouriting this post');
    }
};

export const deleteItem = (item, id) => async dispatch => {
    try {
        dispatch({
            type: CLEAR_ERROR
        });
        await axios.delete(`/${item}/${id}`);
        dispatch({
            type: DELETE_SUCCESS,
            payload: {
                item,
                id,
                error: {
                    message: `Successfully deleted the ${item.slice(0, -1)}`,
                    status: 'success'
                }
            }
        });
    } catch (err) {
        dispatch({
            type: DELETE_FAIL,
            payload: {
                error: {
                    message: `Something went wrong with deleting the ${item.slice(0, -1)}`,
                    status: 'error'
                }
            }
        });
    }
};

export const isCurrentUser = bool => ({
    type: CURRENT_USER_CHECK,
    payload: bool
});
