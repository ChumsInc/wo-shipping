declare const rootReducer: import("redux").Reducer<import("redux").CombinedState<{
    alerts: import("chums-ducks").AlertListState;
    manifests: import("redux").CombinedState<{
        list: import("../types").ManifestEntry[];
        selected: import("../types").ManifestEntry;
        workOrder: import("../types").WorkOrder | null;
        saving: boolean;
        loadingSelected: boolean;
        loading: boolean;
        loaded: boolean;
        workOrderLoading: boolean;
    }>;
    pages: import("chums-ducks").PageState;
    shipDates: import("redux").CombinedState<{
        list: string[];
        selected: string;
        loading: boolean;
        loaded: boolean;
    }>;
    sortableTables: import("chums-ducks").SortableTablesState;
    tabs: import("chums-ducks").TabsState;
}>, import("./manifest").ManifestAction | import("./shipDates").ShipDateAction | import("chums-ducks").AlertAction | import("chums-ducks").PageAction | import("chums-ducks").SortableTablesAction | import("chums-ducks").TabAction>;
export declare type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
