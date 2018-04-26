import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Calculation from '../../utils/Calculation';

import './TextSelection.scss';

export default class TextSelection extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {
                editorWidth, editorOptions, contentWidth, selectStartPosition, selectStopPosition, gutterWidth
            } = this.props,
            {horizontalPadding, scrollBarWidth, lineHeight, showLineNumber} = editorOptions,
            fullWidth = Math.max(
                contentWidth + horizontalPadding + scrollBarWidth,
                editorWidth - horizontalPadding - (showLineNumber ? gutterWidth : 0)
            ),
            isInOneLine = selectStartPosition.row === selectStopPosition.row,
            [start, stop] = Calculation.sortPosition(selectStartPosition, selectStopPosition),
            selectionLines = isInOneLine ? undefined : new Array(stop.row - start.row + 1).fill('');

        return (
            <div className="react-editor-text-selection">

                {
                    isInOneLine ?
                        <div className="react-editor-text-selection-line"
                             style={{
                                 width: stop.left - start.left,
                                 height: lineHeight,
                                 transform: `translate3d(${start.left}px, ${start.top}px, 0)`
                             }}></div>
                        :
                        (
                            selectionLines.map((item, index) => {
                                if (index === 0) {
                                    return (
                                        <div key={index}
                                             className="react-editor-text-selection-line"
                                             style={{
                                                 width: fullWidth - start.left,
                                                 height: lineHeight,
                                                 transform: `translate3d(${start.left}px, ${start.top}px, 0)`
                                             }}></div>
                                    );
                                } else if (index === selectionLines.length - 1) {
                                    return (
                                        <div key={index}
                                             className="react-editor-text-selection-line"
                                             style={{
                                                 width: stop.left,
                                                 height: lineHeight,
                                                 transform: `translate3d(0, ${stop.top}px, 0)`
                                             }}></div>
                                    );
                                } else {
                                    return (
                                        <div key={index}
                                             className="react-editor-text-selection-line"
                                             style={{
                                                 width: fullWidth,
                                                 height: lineHeight,
                                                 transform: `translate3d(0, ${start.top + index * lineHeight}px, 0)`
                                             }}></div>
                                    );
                                }
                            })
                        )
                }

            </div>
        );

    }
};

TextSelection.propTypes = {
    editorOptions: PropTypes.object,
    contentWidth: PropTypes.number,
    selectStartPosition: PropTypes.object,
    selectStopPosition: PropTypes.object
};

TextSelection.defaultProps = {
    editorOptions: null,
    contentWidth: 0,
    selectStartPosition: null,
    selectStopPosition: null
};