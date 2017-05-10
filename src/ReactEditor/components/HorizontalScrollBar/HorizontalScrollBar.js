import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './HorizontalScrollBar.scss';

export default class HorizontalScrollBar extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style} = this.props;

        return (
            <div className={`react-editor-horizontal-scroll-bar-wrapper ${className}`}
                 style={style}>


            </div>
        );

    }
};

HorizontalScrollBar.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
};

HorizontalScrollBar.defaultProps = {
    className: '',
    style: null
};