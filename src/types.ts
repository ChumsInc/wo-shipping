import {WOManifestEntryItem} from "chums-types";
import {WOManifestEntry} from "chums-types/src/work-order";


export interface ManifestTotals {
    label?: string,
    QuantityShipped: number,
    QuantityOrdered: number,
}

export const entryLineKey = (entry: WOManifestEntry) => entry.id;


export interface ShipDateResponse {
    ShipDate: string,
}

export interface WorkOrderOperationDetail {
    Company: 'chums' | 'bc';
    WorkOrder: string;
    OperationCode: string;
    OperationDescription: string;
    StdRatePiece: number;
    PlannedPieceCostDivisor: number;
    StandardAllowedMinutes: number;
    idSteps: number | null;
}

export interface WorkOrder {
    Company: 'chums' | 'bc',
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

export interface LoadManifestResponse {
    list: WOManifestEntryItem[];
    shipDates: ShipDateResponse[];
}

export interface ManifestEntryResponse {
    entry: WOManifestEntryItem;
    workOrder: WorkOrder | null;
}
