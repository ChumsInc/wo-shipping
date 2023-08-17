import {ManifestEntrySorterProps, manifestLineSorter} from "../../types";
import {RootState} from "../../app/configureStore";
import {createSelector} from "@reduxjs/toolkit";

export const selectManifestList = (state: RootState) => state.manifest.list.entries;
export const selectManifestListSort = (state:RootState) => state.manifest.list.sort;
export const selectManifestListFilter = (state:RootState) => state.manifest.list.filter;
export const selectManifestLoading = (state: RootState) => state.manifest.list.loading;
export const selectCurrentEntry = (state: RootState) => state.manifest.current.entry;
export const selectCurrentWorkOrder = (state:RootState) => state.manifest.current.workOrder;
export const selectCurrentLoading = (state:RootState) => state.manifest.current.loading;
export const selectCurrentSaving = (state:RootState) => state.manifest.current.saving;

export const selectFilteredList = createSelector(
    [selectManifestList, selectManifestListSort, selectManifestListFilter],
    (list, sort, filter) => {
        return list
            .filter(entry => {
                return !filter.trim()
                    || entry.ItemCode?.toLowerCase().includes(filter.toLowerCase())
                    || entry.WorkOrderNo.toLowerCase().includes(filter.toLowerCase())
                    || entry.id.toString().startsWith(filter)
                    || entry.WarehouseCode?.toLowerCase() === filter.toLowerCase()
        })
    }
)
