import {alertsReducer, pagesReducer, sortableTablesReducer, tabsReducer} from 'chums-ducks';
import {combineReducers} from "redux";
import {default as shipDatesReducer} from './shipDates';
import {default as manifestsReducer} from './manifest';

const rootReducer = combineReducers({
    alerts: alertsReducer,
    manifests: manifestsReducer,
    pages: pagesReducer,
    shipDates: shipDatesReducer,
    sortableTables: sortableTablesReducer,
    tabs: tabsReducer,
});

export type RootState = ReturnType<typeof rootReducer>
export default rootReducer;
