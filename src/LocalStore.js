export default class LocalStore {
    static getItem(key) {
        const data = window.localStorage.getItem(key);
        try {
            return JSON.parse(data);
        } catch(err) {
            console.log("getItem()", key, err.message);
            return data;
        }
    }

    static setItem(key, data) {
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    static removeItem(key) {
        window.localStorage.removeItem(key);
    }

}
