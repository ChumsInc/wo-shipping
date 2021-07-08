import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default class Select extends PureComponent {
    static propTypes = {
        field: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.instanceOf(Date)]).isRequired,
        onChange: PropTypes.func.isRequired,
        className: PropTypes.string,
        options: PropTypes.arrayOf(PropTypes.shape({
            value: PropTypes.any,
            text: PropTypes.string,
        }))
    };

    static defaultProps = {
        options: [],
        className: 'form-control-sm'
    };

    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(ev) {
        const {field, onChange} = this.props;
        onChange({field, value: ev.target.value});
    }

    render() {
        const {field, value, onChange, className, options, children, ...rest} = this.props;
        return (
            <select className={classNames("form-control", className)}
                    value={value}
                    onChange={this.onChange} {...rest}>
                {children}
                {options.map((opt, key) => <option key={key} value={opt.value}>{opt.text || opt.value}</option>)}
            </select>
        );
    }

}


