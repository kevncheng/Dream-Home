import {
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    LOGIN_RESPONSE,
    LOGIN_ERROR,
    GET_TOKEN_SUCCESS,
    EDIT_PROFILE_SUCCESS,
    LOGING_IN,
    AUTHORIZING,
    SIGN_UP_FAIL,
    SIGN_UP_SUCCESS,
    FOLLOW_SUCCESS,
    FOLLOW_FAIL,
    UNFOLLOW_SUCCESS,
    UNFOLLOW_FAIL,
    FETCH_FOLLOWINGS_SUCCESS,
    FETCH_FOLLOWINGS_FAIL,
    FETCH_FOLLOWERS_SUCCESS,
    FETCH_FOLLOWERS_FAIL,
    DELETE_SUCCESS,
    DELETE_FAIL,
    ADD_BOARD_SUCCESS,
    ADD_BOARD_ERROR,
    ADD_POST_SUCCESS,
    ADD_POST_ERROR, CLEAR_ERROR
} from '../actions/types';
import _ from 'lodash';

const initialState = {
    authenticated: false,
    loading: false,
    error: { message: '', status: null }
};

export default (state = initialState, action) => {
    const response = action.response;

    switch (action.type) {
    case LOGING_IN:
    case AUTHORIZING:
        return { ...state, loading: true };
    case LOGIN_SUCCESS:
        return {
            authenticated: true,
            user: response.user,
            token: response.token,
            loading: false
        };
    case LOGIN_ERROR:
        return { ...state, authenticated: false, error: action.error, loading: false };
    case LOGIN_RESPONSE:
        delete state.error;
        return { ...state, loading: false };
    case LOGOUT_SUCCESS:
        return initialState;
    case GET_TOKEN_SUCCESS:
        return {
            ...state,
            authenticated: true,
            user: action.user,
            token: action.token,
            loading: false
        };
    case EDIT_PROFILE_SUCCESS:
        return {
            ...state,
            user: {
                ...state.user,
                profile: action.payload.user.profile,
                name: action.payload.user.name
            },
            loading: false
        };
    case SIGN_UP_FAIL:
        return { ...state, loading: false, error: action.payload };
    case SIGN_UP_SUCCESS:
        return { ...state, loading: false, error: action.payload };
    case FOLLOW_SUCCESS:
        const containsId = _.filter(
            state.profileInfo.followers,
            follower => follower.id === action.payload.id
        );
        return {
            ...state,
            followers: _.isEmpty(containsId)
                ? state.profileInfo.followers
                : [...state.profileInfo.followers, action.payload],
            loading: false,
            error: ''
        };
    case UNFOLLOW_SUCCESS:
        return {
            ...state,
            followers: state.profileInfo.followers.filter(
                follower => follower._id !== action.payload
            ),
            loading: false,
            error: action.payload
        };
    case FOLLOW_FAIL:
    case UNFOLLOW_FAIL:
        return { ...state, error: action.payload.error };
    case FETCH_FOLLOWINGS_SUCCESS:
        return { ...state, following: action.payload };
    case FETCH_FOLLOWINGS_FAIL:
    case FETCH_FOLLOWERS_FAIL:
        return { ...state, error: action.payload.error };
    case FETCH_FOLLOWERS_SUCCESS:
        return { ...state, followers: action.payload };
    case ADD_BOARD_SUCCESS:
        state.user.boards.push(response.board);
        localStorage.setItem('user', JSON.stringify(state.user));
        return { ...state };
    case ADD_BOARD_ERROR:
        return { ...state, error: action.err };
    case ADD_POST_SUCCESS:
        state.user.posts.push(response.post);
        localStorage.setItem('user', JSON.stringify(state.user));
        return {
            ...state,
            loading: false,
            error: response.error
        };
    case ADD_POST_ERROR:
        return { ...state, error: action.err, loading: false };
    case DELETE_SUCCESS:
        let boards = state.user.boards;
        if (action.payload.item === 'posts') {
            boards = state.user.boards.map(board => {
                board.posts = board.posts.filter(post => post._id !== action.payload.id);
                return board;
            });
        }
        const user = {
            ...state.user,
            boards,
            [action.payload.item]: state.user[action.payload.item].filter(item => item._id !== action.payload.id)
        };
        localStorage.setItem('user', JSON.stringify(user));
        return {
            ...state,
            user,
            loading: false,
            error: action.payload.error
        };
    case DELETE_FAIL:
        return { ...state, error: action.payload.error };
    case CLEAR_ERROR:
        return { ...state, error: {} };
    default:
        return state;
    }
};
