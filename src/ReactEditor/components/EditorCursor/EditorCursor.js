import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './EditorCursor.scss';

export default class EditorCursor extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style} = this.props;

        return (
            <div className={`react-editor-cursor-wrapper ${className}`}
                 style={style}>

                <div ref="cursor"
                     className="react-editor-cursor"></div>

            </div>
        );

    }
};

EditorCursor.propTypes = {
    className: PropTypes.string,
    style: PropTypes.object
};

EditorCursor.defaultProps = {
    className: '',
    style: null
};