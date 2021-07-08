/**
 * Created by steve on 9/15/2016.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";


export default class ThSortable extends Component {
    static propTypes = {
        field: PropTypes.string.isRequired,
        currentSort: PropTypes.shape({
            field: PropTypes.string,
            asc: PropTypes.bool,
        }).isRequired,
        noSort: PropTypes.bool,
        className: PropTypes.string,
        onClick: PropTypes.func.isRequired,
    };

    static defaultProps = {
        field: '',
        currentSort: {
            field: '',
            asc: true,
        },
        noSort: false,
        className: '',
    };

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        this.props.onClick(this.props.field);
    }
    render() {
        const {currentSort, field, noSort, children, className} = this.props;
        const isRight = /\bright\b/.test(className);
        return noSort
            ? (<th className={classNames(className, 'no-sort')}>{children}</th>)
            : (
                <th className={classNames(className, {sorted: currentSort.field === field, 'sorted-desc': currentSort.asc === false, 'sorted-asc': currentSort.asc === false})}
                    onClick={this.onClick}>
                    {children}
                </th>
            )
    }
}


/*
Additional SCSS styling:
.table {
    &.table-sortable {
        th {
            cursor: pointer;
            &.no-sort {
                cursor: not-allowed;
            }
        }
    }
}
 */
