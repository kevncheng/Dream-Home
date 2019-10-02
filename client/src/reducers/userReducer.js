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
    DELETE_FAIL,
    SIGN_IN_SUCCESS,
    SIGN_IN_FAIL
} from '../actions/types';

const initialState = {
    authenticated: false,
    loading: false,
    error: { message: '', status: '' },
    token: localStorage.getItem('token')
};

export default (state = initialState, action) => {
    const { type, response } = action;
    switch (type) {
    case CREATE_POST_LOADING:
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
    case SIGN_IN_FAIL:
        localStorage.removeItem('token');
        return {
            ...state,
            token: null,
            authenticated: false,
            loading: false,
            error: {
                message: 'The credentials you have provided is incorrect',
                status: 'error'
            }
        };
    case LOGOUT_SUCCESS:
        localStorage.removeItem('token');
        return { ...state, token: null, authenticated: false, loading: false };
    case SIGN_UP_FAIL:
        return {
            ...state,
            loading: false,
            error: {
                message:
                        'Something went wrong with the registration, please try a new username or email.',
                status: 'error'
            }
        };
    case SIGN_UP_SUCCESS:
    case SIGN_IN_SUCCESS:
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
        return {
            ...state,
            loading: false,
            authenticated: true,
            user: action.payload.user,
            token: action.payload.token
        };
    case SAVE_INTERESTS_SUCCESS:
        state.user.interests = action.user.interests;
        localStorage.setItem('user', JSON.stringify(state.user));
        return { ...state };
    case GET_TOKEN_SUCCESS:
        return { ...state, authenticated: true, user: action.user, token: action.token };
    case EDIT_PROFILE_SUCCESS:
        const updateUser = { ...state.user, ...action.payload.user };
        localStorage.setItem('user', JSON.stringify(updateUser));
        return { ...state, user: { ...state.user, ...action.payload.user } };
    case EDIT_PROFILE_FAIL:
        return { ...state, error: action.payload.error };
    case SAVE_INTERESTS_ERROR:
        return { ...state, error: action.error };
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
        return { ...state, error: { message: '', status: '' } };
    default:
        return state;
    }
};
