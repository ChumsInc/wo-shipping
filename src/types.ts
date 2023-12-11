import {WOManifestEntryItem} from "chums-types";
import {WOManifestEntry} from "chums-types/src/work-order";
import {PMManifestEntry, PMManifestEntryItem} from "chums-types/src/production";
import Decimal from "decimal.js";


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

export interface WorkTicket {
    Company: 'chums' | 'bc',
    WorkTicketKey: string;
    WorkTicketNo: string,
    ParentItemCode: string,
    ParentUnitOfMeasure: string,
    TemplateNo: string,
    ParentWarehouseCode: string,
    WorkTicketStatus: string,
    WorkTicketDate: string,
    ProductionDueDate: string,
    ParentUnitOfMeasureConvFactor: number|string|Decimal,
    QuantityOrdered: number|string|Decimal,
    QuantityCompleted: number|string|Decimal,
    operationDetail: WorkOrderOperationDetail[],
}

export interface LoadManifestResponse {
    list: PMManifestEntryItem[];
    shipDates: ShipDateResponse[];
}

export interface ManifestEntryResponse {
    entry: PMManifestEntryItem;
    workTicket: WorkTicket | null;
}
