import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Calculation from '../../utils/Calculation';

import './GutterActiveLine.scss';

export default class GutterActiveLine extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {editorOptions, gutterWidth, cursorPosition} = this.props,
            activeLineStyle = {
                width: gutterWidth - 1,
                height: editorOptions.lineHeight,
                left: 0,
                top: cursorPosition.top
            };

        return (
            <div className="react-editor-gutter-active-line"
                 style={activeLineStyle}></div>
        );

    }
};

GutterActiveLine.propTypes = {
    editorOptions: PropTypes.object,
    gutterWidth: PropTypes.number,
    cursorPosition: PropTypes.object
};

GutterActiveLine.defaultProps = {
    editorOptions: null,
    gutterWidth: 0,
    cursorPosition: null
};