import { axios } from './utils';

export const boardService = {
    addBoard: ({ board, username }) => {
        return axios.post(`/users/${username}/board`, board).then(res => {
            return res.data;
        }).catch(err => {
            throw err;
        });
    },
    addPost: ({ board, post }) => {
        return axios.put(`/boards/${board}/post`, {
            _id: `${post}`
        })
            .then(res => res.data)
            .catch(err => {
                throw err;
            });
    }
};
