const tokenStorage = (function () {

    function getToken() {
        let userInfo = JSON.parse(localStorage.getItem('__set'));
        if(userInfo&&userInfo.accessToken){
            return userInfo.accessToken
        }
        else
        return false
    }


    function getUserInfo() {
        try {
            let userInfo = JSON.parse(localStorage.getItem('__set'));
            return userInfo.user;
            
        } catch (error) {
            return null;
        }
    
    }

    return {
        getToken,
        getUserInfo,
    }
    
})();

export default tokenStorage;