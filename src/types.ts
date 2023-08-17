import {SortableTableField, SorterProps} from "chums-ducks";

export interface ManifestEntry {
    id: number,
    Company: 'chums'|'bc',
    WorkOrderNo: string,
    WarehouseCode?: string,
    ItemCode?: string,
    ItemCodeDesc?: string,
    BoxNo?: number,
    QuantityShipped: number,
    QuantityOrdered: number,
    QuantityComplete?: number,
    PackDate?: string,
    ShipDate: string,
    MakeFor?: string,
    Comment?: string,
}


export interface ManifestTotals {
    label?: string,
    QuantityShipped: number,
    QuantityOrdered: number,
}

export type ManifestEntryField = keyof ManifestEntry;

export interface ManifestTableField extends  SortableTableField {
    field: ManifestEntryField,
}

export interface ManifestEntrySorterProps extends SorterProps {
    field: ManifestEntryField
}

export const entryLineKey = (line:ManifestEntry) => line.id;

export const manifestLineSorter = ({field, ascending}: ManifestEntrySorterProps) =>
    (a: ManifestEntry, b: ManifestEntry): number => {
        return (
            a[field] === b[field]
                ? (entryLineKey(a) > entryLineKey(b) ? 1 : -1)
                : ((a[field] ?? '') === (b[field] ?? '') ? 0 : ((a[field] ?? '') > (b[field] ?? '') ? 1 : -1))
        ) * (ascending ? 1 : -1);
    };


export interface ShipDateResponse {
    ShipDate: string,
}

export interface WorkOrderOperationDetail {
    Company: 'chums'|'bc';
    WorkOrder: string;
    OperationCode: string;
    OperationDescription: string;
    StdRatePiece: number;
    PlannedPieceCostDivisor: number;
    StandardAllowedMinutes: number;
    idSteps: number|null;
}
export interface WorkOrder {
    Company: 'chums'|'bc',
    WorkOrder: string,
    ItemBillNumber: string,
    ItemUM: string,
    RoutingNumber: string,
    ParentWhse: string,
    Status: string,
    WODate: string,
    WODueDate: string,
    UMConversion: number,
    QtyOrdered: number,
    QtyComplete: number,
    operationDetail: WorkOrderOperationDetail[],
}

export interface TextInputChangeProps {
    field: ManifestEntryField;
    value: string;
}

export interface LoadManifestResponse {
    list: ManifestEntry[];
    shipDates: ShipDateResponse[];
}

export interface ManifestEntryResponse {
    entry:ManifestEntry;
    workOrder: WorkOrder|null;
}
