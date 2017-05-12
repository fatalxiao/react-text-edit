import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Calculation from '../../utils/Calculation';

import './TextSelection.scss';

export default class TextSelection extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {editorOptions, contentWidth, selectStartPosition, selectStopPosition} = this.props,
            fullWidth = contentWidth + editorOptions.horizontalPadding + editorOptions.scrollBarWidth,
            isInOneLine = selectStartPosition.row === selectStopPosition.row,
            [start, stop] = Calculation.sortPosition(selectStartPosition, selectStopPosition),
            selectionLines = isInOneLine ? undefined : new Array(stop.row - start.row + 1).fill('');

        return (
            <div className="react-editor-text-selection">

                {
                    isInOneLine ?
                        <div className="react-editor-text-selection-line"
                             style={{
                                 left: start.left,
                                 top: start.top,
                                 width: stop.left - start.left,
                                 height: editorOptions.lineHeight
                             }}></div>
                        :
                        (
                            selectionLines.map((item, index) => {
                                if (index === 0) {
                                    return (
                                        <div key={index}
                                             className="react-editor-text-selection-line"
                                             style={{
                                                 left: start.left,
                                                 top: start.top,
                                                 width: fullWidth - start.left + editorOptions.horizontalPadding,
                                                 height: editorOptions.lineHeight
                                             }}></div>
                                    );
                                } else if (index === selectionLines.length - 1) {
                                    return (
                                        <div key={index}
                                             className="react-editor-text-selection-line"
                                             style={{
                                                 left: editorOptions.horizontalPadding,
                                                 top: stop.top,
                                                 width: stop.left - editorOptions.horizontalPadding,
                                                 height: editorOptions.lineHeight
                                             }}></div>
                                    );
                                } else {
                                    return (
                                        <div key={index}
                                             className="react-editor-text-selection-line"
                                             style={{
                                                 left: editorOptions.horizontalPadding,
                                                 top: start.top + index * editorOptions.lineHeight,
                                                 width: fullWidth,
                                                 height: editorOptions.lineHeight
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