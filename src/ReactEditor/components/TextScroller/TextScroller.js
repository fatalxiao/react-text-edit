import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextInput from '../TextInput';
import TextMarker from '../TextMarker';
import TextContainer from '../TextContainer';
import EditorCursor from '../EditorCursor';

import Valid from '../../utils/Valid';
import CharSize from '../../utils/CharSize';

import './TextScroller.scss';

export default class TextScroller extends Component {

    constructor(props) {

        super(props);

        this.calDisplayIndex = this::this.calDisplayIndex;
        this.calculateCursorPosition = this::this.calculateCursorPosition;

    }

    calDisplayIndex() {

        const {editorDataArray, scrollTop, editorOptions, editorHeight} = this.props,
            len = editorDataArray.length;

        let start = Math.floor(scrollTop / editorOptions.lineHeight),
            stop = start + Math.ceil(editorHeight / editorOptions.lineHeight);

        start -= editorOptions.lineCache;
        stop += editorOptions.lineCache;

        return {
            start: Valid.range(start, 0, len),
            stop: Valid.range(stop, 0, len)
        };

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

        const {
                isEditorFocused, editorDataArray, editorOptions, contentWidth, scrollTop, scrollLeft,
                selectStartX, selectStartY, selectStopX, selectStopY
            } = this.props,
            scrollerStyle = {
                width: contentWidth + editorOptions.scrollBarWidth + editorOptions.horizontalPadding * 2,
                height: editorDataArray.length * editorOptions.lineHeight,
                transform: `translate3d(${-scrollLeft}px, ${-scrollTop}px, 0)`
            },
            displayIndex = this.calDisplayIndex(),
            selectStartPosition = this.calculateCursorPosition(selectStartX, selectStartY),
            selectStopPosition = this.calculateCursorPosition(selectStopX, selectStopY);

        return (
            <div className="react-editor-text-scroller"
                 style={scrollerStyle}>

                <TextInput {...this.props}
                           selectStartPosition={selectStartPosition}
                           selectStopPosition={selectStopPosition}/>

                <TextMarker {...this.props}
                            selectStartPosition={selectStartPosition}
                            selectStopPosition={selectStopPosition}/>

                <TextContainer {...this.props}
                               displayIndex={displayIndex}/>

                {
                    isEditorFocused ?
                        <EditorCursor {...this.props}
                                      cursorPosition={selectStopPosition}/>
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
    selectStopY: PropTypes.number,

    onChange: PropTypes.func

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