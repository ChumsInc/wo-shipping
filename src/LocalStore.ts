export const CURRENT_TAB = 'com.chums.intranet.wo-manifest.current-tab';
export const CURRENT_ENTRY_ROWS = 'com.chums.intranet.wo-manifest.entry-rows';
export const CURRENT_PRINT_ROWS = 'com.chums.intranet.wo-manifest.print-rows';
export const CURRENT_DATE = 'com.chums.intranet.wo-manifest.current-date';


export default class LocalStore {
    static getItem(key:string) {
        const data = window.localStorage.getItem(key);
        try {
            return !data ? null : JSON.parse(data);
        } catch(err) {
            console.log("getItem()", key, err.message);
            return data;
        }
    }

    static setItem(key:string, data:any) {
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    static removeItem(key:string) {
        window.localStorage.removeItem(key);
    }
}
