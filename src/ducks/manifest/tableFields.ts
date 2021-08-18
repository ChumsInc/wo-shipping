import {ManifestTableField} from "../../types";
import numeral from "numeral";
import formatDate from "date-fns/format";

export const tableFields: ManifestTableField[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'WorkOrderNo', title: 'Work Order', sortable: true},
    {field: 'WarehouseCode', title: 'Whse', sortable: true},
    {field: 'ItemCode', title: 'Item', sortable: true},
    {field: 'ItemCodeDesc', title: 'Description', sortable: true},
    {
        field: 'QuantityShipped',
        title: 'Qty Shipped',
        sortable: true,
        className: 'right',
        render: (row) => numeral(row.QuantityShipped).format('0,0')
    },
    {
        field: 'QuantityOrdered',
        title: 'Qty Ordered',
        sortable: true,
        className: 'right',
        render: (row) => numeral(row.QuantityOrdered).format('0,0')
    },
    {
        field: 'PackDate',
        title: 'Packed',
        sortable: true,
        render: (row) => formatDate(new Date(row.PackDate), 'MM/dd/yy')
    },
    {field: 'ShipDate', title: 'Ship', sortable: true, render: (row) => formatDate(new Date(row.ShipDate), 'MM/dd/yy')},
    {field: 'MakeFor', title: 'For', sortable: true},
];

export const commentFields: ManifestTableField[] = [
    {field: 'id', title: 'ID', render: () => ''},
    {field: 'WorkOrderNo', title: 'Work Order', render: () => ''},
    {field: 'Comment', title: 'Comment', colSpan: 8},
]
