import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './GutterActiveLine.scss';

class GutterActiveLine extends Component {

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
    gutterWidth: 0
};

export default GutterActiveLine;