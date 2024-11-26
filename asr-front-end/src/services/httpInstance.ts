import axios from 'axios';

const httpInstance = axios.create({
  baseURL: 'http://localhost:3000',
});


httpInstance.interceptors.request.use(
    async (config) => {
        const newConfig = { ...config };
        return newConfig;
    }
);

httpInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default httpInstance;
