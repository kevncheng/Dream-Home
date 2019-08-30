import { axios, createFormData } from './utils';

export const postService = {
    addPost: ({ post, username }) => {
        const formData = createFormData(post);
        return axios({
            url: `/users/${username}/posts`,
            method: 'POST',
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' }
        }).then(res => {
            return res.data;
        }).catch(err => {
            throw err;
        });
    },
    // eslint-disable-next-line camelcase
    searchPosts: ({ search_filter, easy_filters, userId }) => {
        return axios.get(
            // eslint-disable-next-line camelcase
            `/posts?userId=${userId}&search_filter=${search_filter}&easy_filters=${easy_filters}`).then(res => {
            return res.data;
        }).catch(err => {
            throw err;
        });
    }
};
