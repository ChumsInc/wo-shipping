import {ManifestTotals} from "../../types";
import {SortProps} from "chums-components";
import {WOManifestEntryItem} from "chums-types";
import dayjs from "dayjs";
import {PMManifestEntryItem} from "chums-types/src/production";
import Decimal from "decimal.js";

const initialValue: ManifestTotals = {QuantityOrdered: 0, QuantityShipped: 0};

export const totalsReducer = (list: PMManifestEntryItem[], label: string = ''): ManifestTotals =>
    list.reduce((previousValue, {QuantityOrdered, QuantityShipped}) =>
            ({
                QuantityOrdered: new Decimal(previousValue.QuantityOrdered).add(QuantityOrdered ?? 0).toNumber(),
                QuantityShipped: new Decimal(previousValue.QuantityShipped).add(QuantityShipped ?? 0).toNumber(),
                label: previousValue.label
            }),
        {...initialValue, label})


export const manifestSorter = ({
                                   field,
                                   ascending
                               }: SortProps<PMManifestEntryItem>) => (a: PMManifestEntryItem, b: PMManifestEntryItem) => {

    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'WorkTicketNo':
        case 'WarehouseCode':
        case 'ItemCode':
        case 'ItemCodeDesc':
        case 'BinLocation':
        case 'MakeFor':
        case 'Comment':
            return (
                (a[field] ?? '').toLowerCase() === (b[field] ?? '').toLowerCase()
                    ? a.id - b.id
                    : ((a[field] ?? '').toLowerCase() > (b[field] ?? '').toLowerCase() ? 1 : -1)
            ) * sortMod;
        case 'PackDate':
        case 'ShipDate':
            return (dayjs(a[field]).valueOf() - dayjs(b[field]).valueOf()) * sortMod;
        case 'QuantityShipped':
        case 'QuantityOrdered':
            return (
                (a[field] ?? 0) === (b[field] ?? 0)
                    ? a.id - b.id
                    : ((a[field] ?? 0) > (b[field] ?? 0) ? 1 : -1)
            ) * sortMod;
        default:
            return (a.id - b.id) * sortMod;
    }
}
