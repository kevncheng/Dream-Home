import {
    GET_TOKEN,
    LOGIN,
    LOGIN_RESPONSE,
    LOGOUT,
    AUTHORIZING,
    SIGN_UP_FAIL,
    SIGN_UP_SUCCESS,
    CLEAR_ERROR
} from '../actions/types';
import axios from 'axios';

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

export const signUp = body => async dispatch => {
    try {
        const config = {
            'Content-Type': 'application/json'
        };
        dispatch({
            type: AUTHORIZING
        });
        await axios.post('/users/register', body, config);
        dispatch({
            type: SIGN_UP_SUCCESS,
            payload: { message: 'Registration success!', status: 'success' }
        });
    } catch (err) {
        dispatch({
            type: SIGN_UP_FAIL,
            payload: { message: 'Something went wrong with the registration, please try a new username or email.', status: 'error' }
        });
    }
};

export const clearError = () => ({
    type: CLEAR_ERROR
});
