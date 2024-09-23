import {LoadManifestResponse, ManifestEntryResponse, ShipDateResponse, WorkTicket} from "../types";
import {fetchJSON} from "chums-components";
import dayjs from "dayjs";
import {HistorySearch} from "../ducks/history";
import {PMManifestEntry, PMManifestEntryItem} from "chums-types/src/production";

export async function fetchShipDates(): Promise<ShipDateResponse[]> {
    try {
        const url = '/api/operations/production/work-ticket/manifest/dates.json';
        const res = await fetchJSON<{ dates: ShipDateResponse[] }>(url, {cache: 'no-cache'});
        return res?.dates ?? [];
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
        const url = '/api/operations/production/work-ticket/manifest/:ShipDate/list.json'
            .replace(':ShipDate', encodeURIComponent(dayjs(arg).format('YYYY-MM-DD')));
        const res = await fetchJSON<LoadManifestResponse>(url, {cache: "no-cache"});
        return {
            list: res?.list ?? [],
            shipDates: res?.shipDates ?? [],
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

export async function fetchManifestEntrySearch(arg: HistorySearch): Promise<PMManifestEntryItem[]> {
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
        const url = `/api/operations/production/work-ticket/manifest/search.json?${params.toString()}`;
        const res = await fetchJSON<PMManifestEntryItem[]>(url, {cache: "no-cache"});
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

export async function postManifestEntry(arg: PMManifestEntry): Promise<LoadManifestResponse> {
    try {
        const {id, Company, WorkTicketNo, ItemCode, WarehouseCode, QuantityShipped, ShipDate, Comment} = arg;

        const url = (arg.id
            ? '/api/operations/production/work-ticket/manifest/:id.json'
            : '/api/operations/production/work-ticket/manifest.json')
            .replace(':id', encodeURIComponent(id));
        const body = {
            id,
            Company,
            WorkTicketNo,
            ItemCode,
            WarehouseCode,
            QuantityShipped,
            ShipDate: dayjs(ShipDate).format('YYYY-MM-DD'),
            Comment,
        };
        await fetchJSON(url, {method: arg.id ? 'PUT' : 'POST', body: JSON.stringify(body)});
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

export async function deleteManifestEntry(arg: PMManifestEntry): Promise<LoadManifestResponse> {
    try {
        const url = '/api/operations/production/work-ticket/manifest/:id.json'
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
        const url = '/api/operations/production/work-ticket/manifest/:id.json'
            .replace(':id', encodeURIComponent(arg));
        const res = await fetchJSON<{entry: PMManifestEntryItem}>(url, {cache: 'no-cache'});
        if (!res?.entry) {
            return null;
        }
        const workTicket = await fetchWorkTicket(res.entry.WorkTicketNo);
        return {
            entry: res.entry,
            workTicket,
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

export async function fetchWorkTicket(arg?: string | null): Promise<WorkTicket | null> {
    try {
        if (!arg) {
            return null;
        }
        const url = '/api/operations/production/work-ticket/:workTicketNo.json'
            .replace(':workTicketNo', encodeURIComponent(arg.padStart(12, '0')));
        const res = await fetchJSON<{ workTicket: WorkTicket }>(url, {cache: 'no-cache'})
        return res?.workTicket ?? null;
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.debug("fetchWorkTicket()", err.message);
            return Promise.reject(err);
        }
        console.debug("fetchWorkTicket()", err);
        return Promise.reject(new Error('Error in fetchWorkTicket()'));
    }
}
