import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './VerticalScrollBar.scss';

export default class VerticalScrollBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style} = this.props;

        return (
            <div className={`react-editor-vertical-scroll-bar-wrapper ${className}`}
                 style={style}>


            </div>
        );

    }
};

VerticalScrollBar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
};

VerticalScrollBar.defaultProps = {
    className: '',
    style: null
};