import axios from 'axios';

export const createFormData = (obj) => {
    const formData = new FormData();
    for (const key of Object.keys(obj)) {
        formData.append(key, obj[key]);
    }
    return formData;
};

export const addTokenHeaders = (token) => {
    axios.defaults.headers.common['access-token'] = token;
};

export { axios };
