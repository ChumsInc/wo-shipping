import React from "react";
import numeral from "numeral";
import {ManifestTotals} from "../../types";

export interface ManifestTotalTFootProps {
    totals: (ManifestTotals | null)[],
}

const ManifestTotalTFoot: React.FC<ManifestTotalTFootProps> = ({totals}) => {
    return (
        <tfoot>
        {totals.filter(total => !!total)
            .map((total, index) => (
                <tr key={index}>
                    <th colSpan={5}>{total?.label || 'Total'}</th>
                    <td className="right">{numeral(total?.QuantityShipped).format('0,0')}</td>
                    <td className="right">{numeral(total?.QuantityOrdered).format('0,0')}</td>
                    <th colSpan={6}></th>
                </tr>
            ))}
        </tfoot>
    )
}

export default ManifestTotalTFoot;
