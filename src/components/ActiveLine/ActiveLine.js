import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Calculation from '../../utils/Calculation';

import './ActiveLine.scss';

export default class ActiveLine extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {editorDataArray, editorOptions, contentWidth, cursorPosition} = this.props,
            isEmpty = Calculation.isEmptyTextData(editorDataArray),
            activeLineStyle = {
                width: contentWidth + editorOptions.horizontalPadding
                + (isEmpty ? 0 : editorOptions.scrollBarWidth + editorOptions.horizontalPadding),
                height: editorOptions.lineHeight,
                top: cursorPosition.top
            };

        return (
            <div className={`react-editor-active-line ${isEmpty ? 'react-editor-active-line-empty' : ''}`}
                 style={activeLineStyle}></div>
        );

    }
};

ActiveLine.propTypes = {
    editorOptions: PropTypes.object,
    contentWidth: PropTypes.number,
    cursorPosition: PropTypes.object
};

ActiveLine.defaultProps = {
    editorOptions: null,
    contentWidth: 0,
    cursorPosition: null
};