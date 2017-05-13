import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextInput from '../TextInput';
import TextMarker from '../TextMarker';
import TextContainer from '../TextContainer';
import EditorCursor from '../EditorCursor';

import Valid from '../../utils/Valid';
import CharSize from '../../utils/CharSize';
import Calculation from '../../utils/Calculation';

import './TextScroller.scss';

export default class TextScroller extends Component {

    constructor(props) {

        super(props);

        this.calculateCursorPosition = this::this.calculateCursorPosition;

    }

    calculateCursorPosition(x, y) {

        const {editorEl, editorDataArray, editorOptions} = this.props;

        if (isNaN(x) || isNaN(y)) {
            return;
        }

        const offsetTop = Valid.range(y - 10, 0),
            row = Math.round(offsetTop / editorOptions.lineHeight),
            top = row * editorOptions.lineHeight,
            offsetLeft = Valid.range(x - editorOptions.horizontalPadding + 3, 0),
            {left, col} = CharSize.calculateCursorPosition(editorDataArray[row], offsetLeft, editorEl);

        return {
            left: left + editorOptions.horizontalPadding,
            top,
            row,
            col
        };

    }

    render() {

        const {isEditorFocused, editorDataArray, editorOptions, contentWidth, scrollTop, scrollLeft} = this.props,
            scrollerStyle = {
                width: contentWidth + editorOptions.scrollBarWidth + editorOptions.horizontalPadding * 2,
                height: editorDataArray.length * editorOptions.lineHeight,
                transform: `translate3d(${-scrollLeft}px, ${-scrollTop}px, 0)`
            },
            displayIndex = Calculation.calculateTextDisplayIndex(this.props),
            {selectStartPosition, selectStopPosition, cursorPosition} = Calculation.calculateCursorSelectionPosition(this.props);

        return (
            <div className="react-editor-text-scroller"
                 style={scrollerStyle}>

                <TextInput {...this.props}
                           cursorPosition={cursorPosition}
                           selectStartPosition={selectStartPosition}
                           selectStopPosition={selectStopPosition}/>

                <TextMarker {...this.props}
                            cursorPosition={cursorPosition}
                            selectStartPosition={selectStartPosition}
                            selectStopPosition={selectStopPosition}/>

                <TextContainer {...this.props}
                               displayIndex={displayIndex}/>

                {
                    isEditorFocused ?
                        <EditorCursor {...this.props}
                                      cursorPosition={cursorPosition}/>
                        :
                        null
                }

            </div>
        );

    }
};

TextScroller.propTypes = {
    isEditorFocused: PropTypes.bool,
    editorDataArray: PropTypes.array,
    editorHeight: PropTypes.number,
    editorOptions: PropTypes.object,
    contentWidth: PropTypes.number,
    scrollTop: PropTypes.number,
    scrollLeft: PropTypes.number,
    selectStartX: PropTypes.number,
    selectStartY: PropTypes.number,
    selectStopX: PropTypes.number,
    selectStopY: PropTypes.number
};

TextScroller.defaultProps = {
    editorDataArray: [],
    editorHeight: 200,
    editorOptions: null,
    contentWidth: 0,
    scrollTop: 0,
    scrollLeft: 0,
    selectStartX: undefined,
    selectStartY: undefined,
    selectStopX: undefined,
    selectStopY: undefined
};