import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Valid from '../../utils/Valid';

import './TextActiveLine.scss';

class TextActiveLine extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {editorDataArray, editorOptions, contentWidth, cursorPosition} = this.props,
            isEmpty = Valid.isEmptyTextData(editorDataArray),
            activeLineStyle = {
                width: contentWidth + editorOptions.horizontalPadding
                + (isEmpty ? 0 : editorOptions.scrollBarWidth + editorOptions.horizontalPadding),
                height: editorOptions.lineHeight,
                left: -editorOptions.horizontalPadding,
                top: cursorPosition.top
            };

        return (
            <div className={`react-editor-text-active-line ${isEmpty ? 'react-editor-text-active-line-empty' : ''}`}
                 style={activeLineStyle}></div>
        );

    }
};

TextActiveLine.propTypes = {
    editorOptions: PropTypes.object,
    contentWidth: PropTypes.number,
    cursorPosition: PropTypes.object
};

TextActiveLine.defaultProps = {
    contentWidth: 0
};

export default TextActiveLine;