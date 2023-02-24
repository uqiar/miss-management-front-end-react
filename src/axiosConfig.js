import axios from 'axios';
const set401Interceptor = () => {
    // Add a 401 response interceptor
    axios.interceptors.response.use(function (response) {
        return response;
    }, function (error) {
        if (401 === error.response.status) {
            console.log('401 interceptor');
            window.location = '/account/unauthorized'
        } else {
            return Promise.reject(error);
        }
    });
}

const setAxiosAuthorizationHeader = (access_token) => {
    if (access_token)
        axios.defaults.headers.common['x-access-token'] = access_token;
}

export {
    set401Interceptor,
    setAxiosAuthorizationHeader
}