import { ManifestThunkAction } from "./index";
import { ManifestEntry } from "../../types";
export declare const selectEntryAction: (entry: ManifestEntry) => ManifestThunkAction;
export declare const entryChangedAction: (change: object) => {
    type: string;
    payload: {
        change: object;
    };
};
export declare const fetchManifestEntriesAction: () => ManifestThunkAction;
export declare const fetchEntryAction: (id: number) => ManifestThunkAction;
export declare const saveEntryAction: (entry: ManifestEntry) => ManifestThunkAction;
export declare const deleteEntryAction: ({ id }: ManifestEntry) => ManifestThunkAction;
export declare const fetchWorkOrderAction: (WorkOrderNo: string) => ManifestThunkAction;
