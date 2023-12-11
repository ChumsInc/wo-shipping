import React from "react";
import numeral from "numeral";
import formatDate from "date-fns/format";
import {SortableTableField} from "chums-components";
import {WOManifestEntryItem} from "chums-types";
import Tooltip from '@mui/material/Tooltip';
import {PMManifestEntryItem} from "chums-types/src/production";

interface CommentIconProps {
    comment?: string
}

const CommentIcon = ({comment}:CommentIconProps) => {
    if (!comment) {
        return null;
    }
    return (
        <Tooltip title={comment}>
            <span className={!!comment ? 'bi-chat-square-text-fill text-danger' : ''}/>
        </Tooltip>
    )
}

export const tableFields: SortableTableField<PMManifestEntryItem>[] = [
    {field: 'id', title: 'ID', sortable: true},
    {field: 'WorkTicketNo', title: 'Work Ticket', sortable: true, render: (row) => row.WorkTicketNo?.replace(/^0+/, '') ?? ''},
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
        className: 'center',
        render: (row) => !row.PackDate ? null : formatDate(new Date(row.PackDate), 'MM/dd'),
    },
    {
        field: 'ShipDate', title: 'Ship', sortable: true, className: 'center',
        render: (row) => formatDate(new Date(row.ShipDate), 'MM/dd')
    },
    {field: 'MakeFor', title: 'For', sortable: true},
    {field: 'BinLocation', title: 'Bin Location', sortable: true},
    {field: 'Comment', title: '🔔', sortable: true, render: ({Comment}) => <CommentIcon comment={Comment}/>}
];

export const commentFields: SortableTableField<WOManifestEntryItem>[] = [
    {field: 'id', title: 'ID', render: () => ''},
    {field: 'WorkOrderNo', title: 'Work Order', render: () => ''},
    {field: 'Comment', title: 'Comment', colSpan: 10, className: 'text-danger'},
]
