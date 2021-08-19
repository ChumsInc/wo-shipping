import {ManifestEntry, ManifestTotals} from "../../types";

const initialValue: ManifestTotals = {QuantityOrdered: 0, QuantityShipped: 0};

export const totalsReducer = (list: ManifestEntry[], label: string = ''): ManifestTotals =>
    list.reduce((previousValue, {QuantityOrdered, QuantityShipped}) =>
            ({
                QuantityOrdered: previousValue.QuantityOrdered + QuantityOrdered,
                QuantityShipped: previousValue.QuantityShipped + QuantityShipped,
                label: previousValue.label
            }),
        {...initialValue, label})

