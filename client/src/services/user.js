import { axios, addTokenHeaders } from './utils';

export const userService = {
    login: (user) => {
        return axios.post('/users/login', user).then(res => {
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            addTokenHeaders(res.data.token);
            return res.data;
        }).catch(err => {
            throw err;
        });
    },
    getUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },
    logout: () => {
        localStorage.clear();
    },
    getToken: () => {
        const token = localStorage.getItem('token');

        if (token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace('-', '+').replace('_', '/');
            const expireTime = JSON.parse(atob(base64));
            const timeStamp = Math.floor(Date.now() / 1000);

            if (expireTime.exp - timeStamp > 0) {
                addTokenHeaders(token);
                return token;
            }
        }

        return null;
    },
    getBoardsandPosts: ({ username }) => {
        return axios.get(`/users/${username}`).then(res => {
            return res.data;
        }).catch(err => {
            throw err;
        });
    },
    getFollowers: ({ user }) => {
        axios.get(`/users/${user}/following`).then(res => {
            return res.data;
        }).catch(err => {
            throw err;
        });
    },
    getFollowing: ({ user }) => {
        axios.get(`/users/${user}/followers`).then(res => {
            return res.data;
        }).catch(err => {
            throw err;
        });
    }
};
