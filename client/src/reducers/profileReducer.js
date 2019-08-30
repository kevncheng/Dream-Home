import {
    GET_USER_BOARDS_POSTS_SUCCESS,
    GET_USER_BOARDS_POSTS_ERROR,
    FETCH_PROFILE_SUCCESS,
    FETCH_PROFILE_FAIL,
    EDIT_PROFILE_SUCCESS,
    EDIT_PROFILE_FAIL,
    FETCHING_PROFILE,
    CREATE_POST_LOADING,
    CLEAR_ERROR
} from '../actions/types';

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
        return {
            ...state,
            profileInfo: response.user
        };
    case GET_USER_BOARDS_POSTS_ERROR:
        return { ...state, error: action.err };
    case CLEAR_ERROR:
        return { ...state, error: {} };
    default:
        return state;
    }
};
