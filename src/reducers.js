import { combineReducers } from 'redux';
import {
    CURRENT_DATE,
    CURRENT_TAB,
    defaultFilter,
    DISMISS_ALERT,
    FETCH_ENTRY, FETCH_LIST, FETCH_SHIP_DATES,
    FETCH_WORK_ORDER,
    NEW_ENTRY, SAVE_ENTRY, SET_ALERT,
    SET_COMPANY,
    SET_ENTRY, SET_FILTER, SET_QUANTITY,
    SET_SHIP_DATE, SET_TAB,
    SET_WORK_ORDER, TABS
} from "./constants";
import LocalStore from "./LocalStore";

const defaultEntries = {busy: false, list: []};

const alerts = (state = [], action) => {
    const {type, alert, id}  = action;
    switch (type) {
    case SET_ALERT:
        return [...state, {...alert, id: new Date().valueOf()}];
    case DISMISS_ALERT:
        return [...state.filter(alert => alert.id !== id)];
    default:
        return state;
    }
};


const Company = (state = 'chums', action) => {
    const {type, value, payload} = action;
    switch (type) {
    case SET_COMPANY:
        return value;
    default:
        return state;
    }
};

const shipDates = (state = [], action) => {
    const {type, payload} = action;
    switch (type) {
    case FETCH_SHIP_DATES:
    case FETCH_LIST:
        return payload.dates || [];
    default:
        return state;
    }
};

const loadingShipDates = (state = false, action) => {
    const {type, payload} = action;
    switch (type) {
    case FETCH_SHIP_DATES:
        return payload.busy || false;
    default:
        return state;
    }
};

const ShipDate = (state = LocalStore.getItem(CURRENT_DATE) || null, action) => {
    const {type, value, payload} = action;
    switch (type) {
    case SET_SHIP_DATE:
        LocalStore.setItem(CURRENT_DATE, value);
        return value;
    case FETCH_SHIP_DATES:
        return (payload.list || []).length === 1 ? payload.list[0] : state;
    default:
        return state;
    }
};

const QuantityShipped = (state = '', action) => {
    const {type, value, payload} = action;
    switch (type) {
    case SET_QUANTITY:
        return Number(value);
    case FETCH_ENTRY:
        return payload.QuantityShipped || 0;
    default:
        return state;
    }
};

const entry = (state = {}, action) => {
    const {type, value, payload} = action;
    switch (type) {
    case SET_COMPANY:
    case NEW_ENTRY:
    case FETCH_ENTRY:
    case SET_ENTRY:
        return {...payload};
    case SET_SHIP_DATE:
        return {...state, ShipDate: value};
    case SET_QUANTITY:
        return {...state, QuantityShipped: value};
    case SET_WORK_ORDER:
        return {...state, WorkOrderNo: value.toUpperCase()};
    case FETCH_WORK_ORDER:
        if (payload.WorkOrder) {
            return {...state, WorkOrderNo: payload.WorkOrder};
        }
        return state;
    default:
        return state;
    }
};

const entries = (state = {...defaultEntries}, action) => {
    const {type, payload} = action;
    switch (type) {
    case FETCH_LIST:
        return {...defaultEntries, ...state, ...payload};
    default:
        return state;
    }
};

const workOrder = (state = {}, action) => {
    const {type, payload} = action;
    switch (type) {
    case FETCH_WORK_ORDER:
        return {...payload};
    case NEW_ENTRY:
        return {};
    default:
        return state;
    }
};

const tab = (state = LocalStore.getItem(CURRENT_TAB) || TABS.ENTRY.tab, action) => {
    const {type, tab} = action;
    switch (type) {
    case SET_TAB:
        LocalStore.setItem(CURRENT_TAB, tab);
        return tab;
    default:
        return state;
    }
};

const filter = (state = {...defaultFilter}, action) => {
    const {type, filter} = action;
    switch (type) {
    case SET_FILTER:
        return {...state, ...filter};
    default:
        return state;
    }
};



export default combineReducers({
    alerts,
    Company,
    shipDates,
    loadingShipDates,
    ShipDate,
    QuantityShipped,
    entry,
    entries,
    workOrder,
    tab,
    filter,
})
