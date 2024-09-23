import {BasicAlert} from 'chums-components';
import {createAction, createReducer, SerializedError} from "@reduxjs/toolkit";
import {isRejected} from "@reduxjs/toolkit";
import {RootState} from "../../app/configureStore";

export interface ExtendedAlert extends BasicAlert {
    count: number;
    error?: SerializedError | null;
}

export interface AlertList {
    [key: string | number]: ExtendedAlert,
}

export interface AlertsState {
    list: AlertList,
    counter: number;
}

export const initialAlertsState: AlertsState = {
    list: {},
    counter: 0,
}

export const setAlert = createAction<BasicAlert>('alerts/setAlert');
export const dismissAlert = createAction<number | string>('alerts/dismissAlert');

export const selectAlerts = (state: RootState) => state.alerts.list;

const alertsReducer = createReducer(initialAlertsState, (builder) => {
    builder
        .addCase(setAlert, (state, action) => {
            const {context} = action.payload;
            if (context) {
                if (!state.list[context]) {
                    state.list[context] = {...action.payload, count: 1};
                    state.counter += 1;
                } else {
                    state.list[context].count += 1;
                }
            } else {
                state.list[state.counter] = {...action.payload, count: 1};
                state.counter += 1;
            }
        })
        .addCase(dismissAlert, (state, action) => {
            delete state.list[action.payload];
        })
        .addMatcher(isRejected, (state, action) => {
            const context = action.type.replace('/rejected', '');
            if (state.list[context]) {
                state.list[context].count += 1;
            } else {
                if (action)
                    state.list[context] = {
                        context,
                        message: action.error?.message,
                        error: action.error,
                        count: 1,
                        color: 'danger'
                    }
            }
        })
});

export default alertsReducer
