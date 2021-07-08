export const SET_ALERT = 'SET_ALERT';
export const DISMISS_ALERT = 'DISMISS_ALERT';

export const FETCH_LIST = 'FETCH_LIST';
export const FETCH_SHIP_DATES = 'FETCH_SHIP_DATES';
export const SAVE_ENTRY = 'SAVE_ENTRY';
export const DELETE_ENTRY = 'DELETE_ENTRY';
export const FETCH_WORK_ORDER = 'FETCH_WORK_ORDER';
export const FETCH_ENTRY = 'FETCH_ENTRY';

export const NEW_ENTRY = 'NEW_ENTRY';

export const SET_ENTRY = 'SET_ENTRY';
export const SET_COMPANY = 'SET_COMPANY';
export const SET_SHIP_DATE = 'SET_SHIP_DATE';
export const SET_WORK_ORDER = 'SET_WORK_ORDER';
export const SET_QUANTITY = 'SET_QUANTITY';

export const SET_FILTER = 'SET_FILTER';

export const SELECT_SHIP_DATE = 'SELECT_SHIP_DATE';
export const SELECT_ENTRY = 'SELECT_ENTRY';

export const SET_TAB = 'SET_TAB';
export const TABS = {
    ENTRY: {tab: 1, title: 'Shipping Entry'},
    SEARCH: {tab: 2, title: 'Search'},
};

export const defaultFilter = {
    WorkOrderNo: '',
    WarehouseCode: '',
    ItemCode: '',
    SalesOrderNo: '',
};

export const CURRENT_TAB = 'com.chums.intranet.wo-manifest.current-tab';
export const CURRENT_ROWS = 'com.chums.intranet.wo-manifest.current-rows';
export const CURRENT_DATE = 'com.chums.intranet.wo-manifest.current-date';
