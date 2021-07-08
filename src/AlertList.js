import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Alert from "./Alert";
import {connect} from 'react-redux';
import {dismissAlert} from "./actions";

class AlertList extends Component {
    static propTypes = {
        alerts: PropTypes.arrayOf(PropTypes.shape({
            id: PropTypes.number.isRequired,
            type: PropTypes.string,
            title: PropTypes.string,
            message: PropTypes.string.isRequired,
        })).isRequired,
        onDismiss: PropTypes.func.isRequired,
    };

    static propDefaults = {
        alerts: []
    };

    constructor(props) {
        super(props);
    }

    render() {
        const {alerts, onDismiss} = this.props;
        return (
            <div>
                {alerts.map((alert, key) => <Alert key={key} {...alert} onDismiss={onDismiss}/>)}
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const {alerts} = state;
    return {alerts};
};

const mapDispatchToProps = {
    onDismiss: dismissAlert,
};

export default connect(mapStateToProps, mapDispatchToProps)(AlertList);
