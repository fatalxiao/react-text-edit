import React, {Component} from 'react';
import PropTypes from 'prop-types';

export default class Template extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style} = this.props;

        return (
            <div className={`Template ${className}`}
                 style={style}>
            </div>
        );

    }
};

Template.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
};

Template.defaultProps = {
    className: '',
    style: null
};