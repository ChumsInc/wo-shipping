import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from "classnames";


const AlertDismisser = ({onDismiss}) => {
    return (
        <button type="button" className="close" aria-label="Close"
                onClick={() => onDismiss()}>
            <span aria-hidden="true">&times;</span>
        </button>
    )
};

export default class Alert extends Component {
    static propTypes = {
        id: PropTypes.number,
        type: PropTypes.string,
        title: PropTypes.string,
        message: PropTypes.string.isRequired,
        onDismiss: PropTypes.func,
    };

    state = {
        error: null,
        errorInfo: null,
    };

    constructor(props) {
        super(props);
        this.onDismiss = this.onDismiss.bind(this);
    }

    componentDidCatch(error, errorInfo) {
        this.setState({error, errorInfo});
    }


    onDismiss() {
        const {id} = this.props;
        this.props.onDismiss(id);
    }

    render() {
        if (this.state.errorInfo) {
            return (
                <div className="alert alert-danger">
                    <details style={{whiteSpace: 'pre-wrap'}}>
                        {this.state.error && this.state.error.toString()}
                        <br />
                        {this.state.errorInfo.componentStack}
                    </details>
                </div>
            )
        }

        const {title, message, type, onDismiss, id} = this.props;
        const dismissible = typeof onDismiss === 'function';
        const className = classNames('alert my-3', {
            'alert-dismissible': dismissible,
            'alert-primary': type === 'primary',
            'alert-success': type === 'success',
            'alert-info': type === 'info' || type === undefined,
            'alert-secondary': type === 'secondary',
            'alert-danger': type === 'danger' || type === 'error',
            'alert-warning': type === 'warning',
            'alert-light': type === 'light',
            'alert-dark': type === 'dark',
        });
        return (
            <div className={className}>
                <strong className="mr-1">{title || ''}</strong>
                {message}
                {dismissible && <AlertDismisser onDismiss={this.onDismiss}/>}
            </div>
        )
    }
}
