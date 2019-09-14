import {
    LOGIN_SUCCESS,
    LOGOUT_SUCCESS,
    LOGIN_RESPONSE,
    LOGIN_ERROR,
    AUTHORIZING,
    SIGN_UP_FAIL,
    SIGN_UP_SUCCESS,
    GET_TOKEN_SUCCESS,
    EDIT_PROFILE_SUCCESS,
    SAVE_INTERESTS_SUCCESS,
    SAVE_INTERESTS_ERROR,
    CLEAR_ERROR,
    CREATE_POST_LOADING,
    EDIT_PROFILE_FAIL,
    DELETE_SUCCESS,
    DELETE_FAIL
} from '../actions/types';

const initialState = {
    authenticated: false,
    loading: false,
    error: { message: '', status: null }
};

export default (state = initialState, action) => {
    const { type, response } = action;
    switch (type) {
    case AUTHORIZING:
        return { ...state, loading: true };
    case LOGIN_SUCCESS:
        return {
            authenticated: true,
            user: response.user,
            token: response.token,
            loading: false,
            error: { message: 'Authentication Success', status: 'success' }
        };
    case LOGIN_ERROR:
        return {
            ...state,
            authenticated: false,
            loading: false,
            error: {
                message: 'Authentication Failed: email or password is incorrect',
                status: 'error'
            }
        };
    case LOGIN_RESPONSE:
        return { ...state, error: initialState.error };
    case LOGOUT_SUCCESS:
        return initialState;
    case SIGN_UP_FAIL:
        return { ...state, loading: false, error: action.payload };
    case SIGN_UP_SUCCESS:
        return {
            ...state,
            loading: false,
            user: action.payload.user,
            token: action.payload.token,
            error: { message: 'Registration Success!', status: 'success' }
        };
    case SAVE_INTERESTS_SUCCESS:
        state.user.interests = action.user.interests;
        localStorage.setItem('user', JSON.stringify(state.user));
        return { ...state };
    case GET_TOKEN_SUCCESS:
        return { ...state, authenticated: true, user: action.user, token: action.token };
    case EDIT_PROFILE_SUCCESS:
        return { ...state, user: { ...state.user, ...action.payload.user } };
    case EDIT_PROFILE_FAIL:
        return { ...state, error: action.payload.error };
    case SAVE_INTERESTS_ERROR:
        return { ...state, error: action.error };
    case CREATE_POST_LOADING:
        return { ...state, loading: true, error: {} };
    case DELETE_SUCCESS:
        if (action.payload.item === 'posts') {
            state.user.boards = state.user.boards.map(board => {
                board.posts = board.posts.filter(post => post._id !== action.payload.id);
                return board;
            });
        }
        state.user[action.payload.item] = state.user[action.payload.item].filter(
            item => item._id !== action.payload.id
        );
        return {
            ...state,
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
