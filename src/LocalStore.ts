export const CURRENT_TAB = 'com.chums.intranet.wo-manifest.current-tab';
export const CURRENT_ENTRY_ROWS = 'com.chums.intranet.wo-manifest.entry-rows';
export const CURRENT_PRINT_ROWS = 'com.chums.intranet.wo-manifest.print-rows';
export const CURRENT_DATE = 'com.chums.intranet.wo-manifest.current-date';


export default class LocalStore {
    static getItem<T = any>(key:string, defaultValue: T|null):T|null {
        const data = window.localStorage.getItem(key);
        try {
            return !data ? null : JSON.parse(data) as T;
        } catch(err:unknown) {
            if (err instanceof Error) {
                console.log("getItem()", key, err.message);
            }
            return null;
        }
    }

    static setItem<T = any>(key:string, data:T) {
        window.localStorage.setItem(key, JSON.stringify(data));
    }

    static removeItem(key:string) {
        window.localStorage.removeItem(key);
    }
}
