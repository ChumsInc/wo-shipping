import React from "react";
import {useSelector} from "react-redux";
import {defaultSort, listSelector} from "./index";
import {totalsReducer} from "./utils";
import numeral from "numeral";

const ManifestTotalTFoot:React.FC = () => {
    const list = useSelector(listSelector(defaultSort));
    const total = totalsReducer(list);
    return (
        <tfoot>
        <tr>
            <th colSpan={5}>Total</th>
            <td className="right">{numeral(total.QuantityShipped).format('0,0')}</td>
            <td className="right">{numeral(total.QuantityOrdered).format('0,0')}</td>
            <th colSpan={3}> </th>
        </tr>
        </tfoot>
    )
}

export default ManifestTotalTFoot;
