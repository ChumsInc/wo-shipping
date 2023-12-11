import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";
import {manifestSorter, totalsReducer} from "./utils";
import dayjs from "dayjs";

export const selectManifestList = (state: RootState) => state.manifest.list.entries;
export const selectManifestListSort = (state: RootState) => state.manifest.list.sort;
export const selectManifestListFilter = (state: RootState) => state.manifest.list.filter;
export const selectManifestLoading = (state: RootState) => state.manifest.list.loading;
export const selectCurrentEntry = (state: RootState) => state.manifest.current.entry;
export const selectCurrentWorkTicket = (state: RootState) => state.manifest.current.workTicket;
export const selectCurrentLoading = (state: RootState) => state.manifest.current.loading;
export const selectCurrentSaving = (state: RootState) => state.manifest.current.saving;
export const selectCurrentShipDate = (state: RootState) => state.manifest.shipDate;

export const selectFilteredList = createSelector(
    [selectManifestList, selectManifestListSort, selectManifestListFilter],
    (list, sort, filter) => {
        return list
            .filter(entry => {
                return !filter.trim()
                    || (entry.ItemCode ?? '').toLowerCase().includes(filter.toLowerCase())
                    || (entry.WorkTicketNo ?? '').toLowerCase().includes(filter.toLowerCase())
                    || entry.id.toString().startsWith(filter)
                    || (entry.WarehouseCode ?? '').toLowerCase() === filter.toLowerCase()
                    || (entry.MakeFor ?? '').toLowerCase().includes(filter.toLowerCase())
            })
            .sort(manifestSorter(sort));
    }
)

export const selectManifestTotals = createSelector(
    [selectManifestList, selectCurrentShipDate],
    (list, shipDate) => {
        if (!shipDate) {
            return null;
        }
        const label = `Total: Ship ${new Date(shipDate).toLocaleDateString()}`;
        return totalsReducer(list, label);
    }
)

export const selectCurrentDayManifestTotals = createSelector(
    [selectManifestList, selectCurrentShipDate],
    (list, shipDate) => {
        const today = new Date();
        if (!shipDate || !dayjs(shipDate).isAfter(today)) {
            return null;
        }
        return totalsReducer(list.filter(row => dayjs(row.PackDate).isSame(today, 'day')), `Total: ${today.toLocaleDateString()}`);
    }
)
