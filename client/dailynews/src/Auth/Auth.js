class Auth{
    static authenticateUser(token, email){
        localStorage.setItem("token", token);
        localStorage.setItem("email", email);
    }

    static isUserAuthenticated(){
        return localStorage.getItem('token') !== null;
    }

    static deauthenticate(){
        localStorage.removeItem("token");
        localStorage.removeItem("email");
    }

    static getToken(){
        return localStorage.getItem("token");
    }

    static getEmail(){
        return localStorage.getItem("email");
    }

    static logout() {
        this.deauthenticate();
    }
}

export default Auth;
