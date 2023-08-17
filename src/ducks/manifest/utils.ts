import {ManifestEntry, ManifestTotals} from "../../types";
import {SortProps} from "chums-components";

const initialValue: ManifestTotals = {QuantityOrdered: 0, QuantityShipped: 0};

export const totalsReducer = (list: ManifestEntry[], label: string = ''): ManifestTotals =>
    list.reduce((previousValue, {QuantityOrdered, QuantityShipped}) =>
            ({
                QuantityOrdered: previousValue.QuantityOrdered + QuantityOrdered,
                QuantityShipped: previousValue.QuantityShipped + QuantityShipped,
                label: previousValue.label
            }),
        {...initialValue, label})


export const manifestSorter = ({
                                   field,
                                   ascending
                               }: SortProps<ManifestEntry>) => (a: ManifestEntry, b: ManifestEntry) => {

    const sortMod = ascending ? 1 : -1;
    switch (field) {
        case 'WorkOrderNo':
        case 'WarehouseCode':
        case 'ItemCode':
        case 'ItemCodeDesc':
            return (
                (a[field] ?? '').toLowerCase() === (b[field] ?? '').toLowerCase()
                    ? a.id - b.id
                    : ((a[field] ?? '').toLowerCase() > (b[field] ?? '').toLowerCase() ? 1 : -1)
            ) * sortMod;
        default:
            return a.id - b.id;
    }
}
