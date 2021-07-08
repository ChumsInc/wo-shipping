/**
 * Created by steve on 1/11/2017.
 */

import React, {Component, createRef} from 'react';
import PropTypes from 'prop-types';

export default class ModalConfirm extends Component {
    static propTypes = {
        title: PropTypes.string,
        message: PropTypes.string,
        confirmButtonText: PropTypes.string,
        cancelButtonText: PropTypes.string,
        onCancel: PropTypes.func.isRequired,
        onConfirm: PropTypes.func.isRequired,
    };

    static defaultProps = {
        title: 'Oh Snap!',
        message: 'Something happened!',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    };

    cancelRef = null;

    constructor() {
        super();
        this.cancelRef = createRef();
        this.onCancel = this.onCancel.bind(this);
        this.onKeydown = this.onKeydown.bind(this);
        this.onClickOutside = this.onClickOutside.bind(this);
    }

    componentDidMount() {
        this.cancelRef.current.focus();
        document.addEventListener('keydown', this.onKeydown)
    }

    onKeydown(ev) {
        if (ev.code === 'Escape') {
            this.onCancel();
        }
    }

    onClickOutside(ev) {
        if (ev.target.className === 'modal fade show') {
            this.onCancel();
        }
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onKeydown);
    }


    handleClickOutside(ev) {
        ev.preventDefault();
        this.props.onCancel();
    }

    onCancel() {
        this.props.onCancel();
    }


    render() {
        const {cancelButtonText, confirmButtonText, title, message} = this.props;
        return (
            <div className="modal fade show" role="dialog" aria-hidden={true}
                 onClick={this.onClickOutside}
                 style={{display: 'block', backgroundColor: 'rgba(0,0,0,0.5)'}}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">{title}</h5>
                            <button type="button" className="close" aria-label="Close" onClick={this.onCancel}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">{message}</div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-sm btn-outline-secondary" ref={this.cancelRef}
                                    onClick={this.onCancel}>
                                {cancelButtonText}
                            </button>
                            <button type="button" className="btn btn-sm btn-outline-danger"
                                    onClick={() => this.props.onConfirm()}>
                                {confirmButtonText}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}



