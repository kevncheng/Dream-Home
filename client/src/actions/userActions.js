import {
    GET_TOKEN,
    LOGIN,
    LOGIN_RESPONSE,
    LOGOUT,
    AUTHORIZING,
    SIGN_UP_FAIL,
    SIGN_UP_SUCCESS,
    CLEAR_ERROR,
    SIGN_IN_FAIL,
    SIGN_IN_SUCCESS,
    USER_LOADED
} from '../actions/types';
import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';

export const login = user => ({
    type: LOGIN,
    user
});

export const loginResponse = () => ({
    type: LOGIN_RESPONSE
});

export const logout = () => ({
    type: LOGOUT
});

export const getToken = () => ({
    type: GET_TOKEN
});

export const signIn = body => async dispatch => {
    const config = {
        'Content-Type': 'application/json'
    };
    try {
        dispatch({
            type: AUTHORIZING
        });

        const res = await axios.post('/users/login', body, config);
        dispatch({
            type: SIGN_IN_SUCCESS,
            payload: res.data
        });
        dispatch(loadUser());
    } catch (err) {
        dispatch({
            type: SIGN_IN_FAIL
        });
    }
};

export const signUp = body => async dispatch => {
    try {
        const config = {
            'Content-Type': 'application/json'
        };
        dispatch({
            type: AUTHORIZING
        });
        const res = await axios.post('/users/register', body, config);
        dispatch({
            type: SIGN_UP_SUCCESS,
            payload: res.data
        });
    } catch (err) {
        dispatch({
            type: SIGN_UP_FAIL
        });
    }
};

export const clearError = () => ({
    type: CLEAR_ERROR
});

// Load User
export const loadUser = () => async dispatch => {
    if (localStorage.token) {
        setAuthToken(localStorage.token);
    }

    try {
        const res = await axios.get('/users/');

        dispatch({
            type: USER_LOADED,
            payload: res.data
        });
    } catch (err) {
        console.log(err);
    }
};
