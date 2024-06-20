const AuthService = {
    subscribers: [],

    getToken() {
        return localStorage.getItem('authToken');
    },

    setToken(token) {
        localStorage.setItem('authToken', token);
        this.notifySubscribers();
    },

    setGoogleToken(token) {
        localStorage.setItem('token', token);
        this.notifySubscribers();
    },

    setGoogleProfilePhoto(photoURL) {
        localStorage.setItem('googleProfilePhoto', photoURL);
    },

    getGoogleProfilePhoto() {
        return localStorage.getItem('googleProfilePhoto');
    },

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('googleProfilePhoto');
        this.notifySubscribers();
    },

    isLoggedIn() {
        return !!localStorage.getItem('authToken');
    },

    isLoggedInWithGoogle() {
        return !!localStorage.getItem('token');
    },

    subscribe(callback) {
        this.subscribers.push(callback);
    },

    unsubscribe(callback) {
        this.subscribers = this.subscribers.filter((sub) => sub !== callback);
    },

    notifySubscribers() {
        const isLoggedIn = this.isLoggedIn() || this.isLoggedInWithGoogle();
        this.subscribers.forEach((callback) => callback(isLoggedIn));
    },

    setRole(role) {
        localStorage.setItem('role', role);
    },

    getRole() {
        return localStorage.getItem('role');
    },
};

export default AuthService;