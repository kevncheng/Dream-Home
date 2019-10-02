import {
    GET_USER_BOARDS_POSTS_SUCCESS,
    GET_USER_BOARDS_POSTS_ERROR,
    ADD_BOARD_SUCCESS,
    ADD_BOARD_ERROR,
    ADD_POST_SUCCESS,
    ADD_POST_ERROR,
    FOLLOW_SUCCESS,
    FOLLOW_FAIL,
    UNFOLLOW_SUCCESS,
    UNFOLLOW_FAIL,
    FETCH_FOLLOWINGS_SUCCESS,
    FETCH_FOLLOWINGS_FAIL,
    FETCH_FOLLOWERS_SUCCESS,
    FETCH_FOLLOWERS_FAIL,
    FETCH_PROFILE_SUCCESS,
    FETCH_PROFILE_FAIL,
    EDIT_PROFILE_SUCCESS,
    EDIT_PROFILE_FAIL,
    FETCHING_PROFILE,
    CREATE_POST_LOADING,
    CLEAR_ERROR,
    DELETE_FAIL,
    DELETE_SUCCESS
} from '../actions/types';
import _ from 'lodash';

const INITIAL_STATE = {
    loading: false,
    error: {}
};

export default (state = INITIAL_STATE, action) => {
    const response = action.response;
    switch (action.type) {
    case FETCHING_PROFILE:
    case CREATE_POST_LOADING:
        return { ...state, loading: true, error: {} };
    case FETCH_PROFILE_SUCCESS:
        return { ...state, profileInfo: action.payload, loading: false };
    case FETCH_PROFILE_FAIL:
    case EDIT_PROFILE_FAIL:
        return { ...state, error: action.payload.error };
    case EDIT_PROFILE_SUCCESS:
        return {
            ...state,
            profileInfo: {
                ...state.profileInfo,
                name: action.payload.user.name,
                profile: action.payload.user.profile
            }
        };
    case GET_USER_BOARDS_POSTS_SUCCESS:
        return response.user;
    case GET_USER_BOARDS_POSTS_ERROR:
        return { ...state, error: action.err };
    case ADD_BOARD_SUCCESS:
        return {
            ...state,
            profileInfo: {
                ...state.profileInfo,
                boards: [...state.profileInfo.boards, response.board]
            }
        };
    case ADD_BOARD_ERROR:
        return { ...state, error: action.err };
    case ADD_POST_SUCCESS:
        return {
            ...state,
            profileInfo: {
                ...state.profileInfo,
                posts: [...state.profileInfo.posts, action.payload.post]
            },
            loading: false,
            error: action.payload.error
        };
    case ADD_POST_ERROR:
        return { ...state, error: action.err, loading: false };
    case FOLLOW_SUCCESS:
        const containsId = _.filter(
            state.profileInfo.followers,
            follower => follower.id === action.payload.id
        );
        return {
            ...state,
            profileInfo: {
                ...state.profileInfo,
                followers: _.isEmpty(containsId)
                    ? state.profileInfo.followers
                    : [...state.profileInfo.followers, action.payload]
            },
            loading: false,
            error: ''
        };
    case UNFOLLOW_SUCCESS:
        return {
            ...state,
            profileInfo: {
                ...state.profileInfo,
                followers: _.filter(
                    state.profileInfo.followers,
                    follower => follower._id !== action.payload
                )
            },
            loading: false,
            error: action.payload
        };
    case FOLLOW_FAIL:
    case UNFOLLOW_FAIL:
        return { ...state, error: action.payload.error };
    case FETCH_FOLLOWINGS_SUCCESS:
        return { ...state, followingUsers: action.payload };
    case FETCH_FOLLOWINGS_FAIL:
    case FETCH_FOLLOWERS_FAIL:
        return { ...state, error: action.payload.error };
    case FETCH_FOLLOWERS_SUCCESS:
        return { ...state, followerUsers: action.payload };
    case DELETE_SUCCESS:
        return {
            ...state,
            profileInfo: {
                ...state.profileInfo,
                [action.payload.item]: _.filter(
                    state.profileInfo[action.payload.item],
                    item => item._id !== action.payload.id
                )
            },
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
