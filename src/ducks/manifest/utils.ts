import {ManifestEntry, ManifestTotals} from "../../types";

const initialValue: ManifestTotals = {QuantityOrdered: 0, QuantityShipped: 0};

export const totalsReducer = (list:ManifestEntry[]):ManifestTotals => list.reduce((previousValue, currentValue) => ({
    QuantityOrdered: previousValue.QuantityOrdered + (currentValue?.QuantityOrdered || 0),
    QuantityShipped: previousValue.QuantityShipped + currentValue.QuantityShipped,
}), initialValue)

