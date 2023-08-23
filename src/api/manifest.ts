import {LoadManifestResponse, ManifestEntryResponse, ShipDateResponse, WorkOrder} from "../types";
import {fetchJSON} from "chums-components";
import dayjs from "dayjs";
import {WOManifestEntry} from "chums-types/src/work-order";
import {WOManifestEntryItem} from "chums-types";
import {HistorySearch} from "../ducks/history";

export async function fetchShipDates(): Promise<ShipDateResponse[]> {
    try {
        const url = '/api/operations/production/wo/shipping/chums';
        const res = await fetchJSON<{ dates: ShipDateResponse[] }>(url, {cache: 'no-cache'});
        return res.dates ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchShipDates()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchShipDates()", err);
        return Promise.reject(new Error('Error in fetchShipDates()'));
    }
}

export async function fetchManifestEntries(arg: string): Promise<LoadManifestResponse> {
    try {
        const url = '/api/operations/production/wo/shipping/chums/:ShipDate'
            .replace(':ShipDate', encodeURIComponent(dayjs(arg).format('YYYY-MM-DD')));
        const res = await fetchJSON<LoadManifestResponse>(url, {cache: "no-cache"});
        return {
            list: res.list ?? [],
            shipDates: res.shipDates ?? [],
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchManifestEntries()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchManifestEntries()", err);
        return Promise.reject(new Error('Error in fetchManifestEntries()'));
    }
}

export async function fetchManifestEntrySearch(arg: HistorySearch): Promise<WOManifestEntryItem[]> {
    try {
        const params = new URLSearchParams();
        Object.keys(arg).forEach(value => {
            const key = value as keyof HistorySearch;
            if (arg[key]) {
                switch (key) {
                    case 'shipDate':
                    case 'fromDate':
                    case 'toDate':
                        params.set(key, dayjs(arg[key]).format('YYYY-MM-DD'));
                        break;
                    default:
                        params.set(key, arg[key]);
                }

            }
        })
        const url = `/api/operations/production/wo/shipping/chums/search?${params.toString()}`;
        const res = await fetchJSON<WOManifestEntryItem[]>(url, {cache: "no-cache"});
        return res ?? [];
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchManifestEntries()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchManifestEntries()", err);
        return Promise.reject(new Error('Error in fetchManifestEntries()'));
    }
}

export async function postManifestEntry(arg: WOManifestEntry): Promise<LoadManifestResponse> {
    try {
        const {id, Company, WorkOrderNo, ItemCode, WarehouseCode, QuantityShipped, ShipDate, Comment} = arg;
        const url = '/api/operations/production/wo/shipping/:id'
            .replace(':id', encodeURIComponent(id));
        const body = {
            id,
            Company,
            WorkOrderNo,
            ItemCode,
            WarehouseCode,
            QuantityShipped,
            ShipDate: dayjs(arg.ShipDate).format('YYYY-MM-DD'),
            Comment,
        };
        await fetchJSON(url, {method: 'post', body: JSON.stringify(body)});
        return await fetchManifestEntries(arg.ShipDate);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("postManifestEntry()", err.message);
            return Promise.reject(err);
        }
        console.debug("postManifestEntry()", err);
        return Promise.reject(new Error('Error in postManifestEntry()'));
    }
}

export async function deleteManifestEntry(arg: WOManifestEntry): Promise<LoadManifestResponse> {
    try {
        const url = '/api/operations/production/wo/shipping/:id'
            .replace(':id', encodeURIComponent(arg.id));
        await fetchJSON(url, {method: 'delete'});
        return await fetchManifestEntries(arg.ShipDate);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("deleteManifestEntry()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteManifestEntry()", err);
        return Promise.reject(new Error('Error in deleteManifestEntry()'));
    }
}

export async function fetchManifestEntry(arg: number): Promise<ManifestEntryResponse | null> {
    try {
        const url = '/api/operations/production/wo/shipping/:id'
            .replace(':id', encodeURIComponent(arg));
        const res = await fetchJSON<{
            entry: WOManifestEntryItem
        }>(url, {cache: 'no-cache'});
        if (!res.entry) {
            return null;
        }
        const workOrder = await fetchWorkOrder(res.entry.WorkOrderNo);
        return {
            entry: res.entry,
            workOrder,
        }
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchManifestEntry()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchManifestEntry()", err);
        return Promise.reject(new Error('Error in fetchManifestEntry()'));
    }
}

export async function fetchWorkOrder(arg?: string | null): Promise<WorkOrder | null> {
    try {
        if (!arg) {
            return null;
        }
        const url = '/api/operations/production/wo/chums/:WorkOrderNo'
            .replace(':WorkOrderNo', encodeURIComponent(arg.padStart(7, '0')));
        const res = await fetchJSON<{ workorder: WorkOrder }>(url, {cache: 'no-cache'})
        return res.workorder ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchWorkOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchWorkOrder()", err);
        return Promise.reject(new Error('Error in fetchWorkOrder()'));
    }
}
