import axios from 'axios';

const api = axios.create({
    baseURL: 'https://api.github.com',
    headers: process.env.REACT_APP_GITHUB_TOKEN
        ? { Authorization: `Bearer ${process.env.REACT_APP_GITHUB_TOKEN}` }
        : {}
});

export default api;
