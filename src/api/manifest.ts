import formatDate from "date-fns/format";
import {LoadManifestResponse, ManifestEntry, ManifestEntryResponse, ShipDateResponse, WorkOrder} from "../types";
import {fetchJSON} from "chums-components";
import {parseISO} from "date-fns";
import dayjs from "dayjs";
import Manifest from "../ducks/manifest";
import ManifestEntryList from "../ducks/manifest/ManifestEntryList";

export async function fetchShipDates():Promise<ShipDateResponse[]> {
    try {
        const url = '/api/operations/production/wo/shipping/chums';
        const res = await fetchJSON<{dates:ShipDateResponse[]}>(url, {cache: 'no-cache'});
        return res.dates ?? [];
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchShipDates()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchShipDates()", err);
        return Promise.reject(new Error('Error in fetchShipDates()'));
    }
}

export async function fetchManifestEntries(arg:string):Promise<LoadManifestResponse> {
    try {
        const url = '/api/operations/production/wo/shipping/chums/:ShipDate'
            .replace(':ShipDate', encodeURIComponent(dayjs(arg).format('YYYY-MM-DD')));
        const res = await fetchJSON<LoadManifestResponse>(url, {cache: "no-cache"});
        return {
            list: res.list ?? [],
            shipDates: res.shipDates ?? [],
        }
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchManifestEntries()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchManifestEntries()", err);
        return Promise.reject(new Error('Error in fetchManifestEntries()'));
    }
}

export async function postManifestEntry(arg:ManifestEntry):Promise<LoadManifestResponse> {
    try {
        const {id, Company, WorkOrderNo, QuantityShipped, ShipDate, Comment} = arg;
        const url = '/api/operations/production/wo/shipping/:id'
            .replace(':id', encodeURIComponent(id));
        const body = {
            id,
            Company,
            WorkOrderNo,
            QuantityShipped,
            ShipDate: dayjs(arg.ShipDate).format('YYYY-MM-DD'),
            Comment,
        };
        await fetchJSON(url, {method: 'post', body: JSON.stringify(body)});
        return await fetchManifestEntries(arg.ShipDate);
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("postManifestEntry()", err.message);
            return Promise.reject(err);
        }
        console.debug("postManifestEntry()", err);
        return Promise.reject(new Error('Error in postManifestEntry()'));
    }
}

export async function deleteManifestEntry(arg:ManifestEntry):Promise<LoadManifestResponse> {
    try {
        const url = '/api/operations/production/wo/shipping/:id'
            .replace(':id', encodeURIComponent(arg.id));
        await fetchJSON(url, {method: 'delete'});
        return await fetchManifestEntries(arg.ShipDate);

    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("deleteManifestEntry()", err.message);
            return Promise.reject(err);
        }
        console.debug("deleteManifestEntry()", err);
        return Promise.reject(new Error('Error in deleteManifestEntry()'));
    }
}

export async function fetchManifestEntry(arg:number):Promise<ManifestEntryResponse|null> {
    try {
        const url = '/api/operations/production/wo/shipping/:id'
            .replace(':id', encodeURIComponent(arg));
        const res = await fetchJSON<{
            entry: ManifestEntry
        }>(url, {cache: 'no-cache'});
        if (!res.entry) {
            return null;
        }
        const workOrder = await fetchWorkOrder(res.entry.WorkOrderNo);
        return {
            entry: res.entry,
            workOrder,
        }
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchManifestEntry()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchManifestEntry()", err);
        return Promise.reject(new Error('Error in fetchManifestEntry()'));
    }
}

export async function fetchWorkOrder(arg?:string|null):Promise<WorkOrder|null> {
    try {
        if (!arg) {
            return null;
        }
        const url = '/api/operations/production/wo/chums/:WorkOrderNo'
            .replace(':WorkOrderNo', encodeURIComponent(arg.padStart(7, '0')));
        const res = await fetchJSON<{workorder: WorkOrder}>(url, {cache: 'no-cache'})
        return res.workorder ?? null;
    } catch(err:unknown) {
        if (err instanceof Error) {
            console.debug("fetchWorkOrder()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchWorkOrder()", err);
        return Promise.reject(new Error('Error in fetchWorkOrder()'));
    }
}
