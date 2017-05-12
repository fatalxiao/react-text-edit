import React, {Component} from 'react';
import PropTypes from 'prop-types';

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

    calculateCursorPosition() {

        const {editorEl, editorDataArray, editorOptions, selectStartX, selectStartY} = this.props;

        if (isNaN(selectStartX) || isNaN(selectStartY)) {
            return;
        }

        const offsetTop = Valid.range(selectStartY - 10, 0),
            row = Math.round(offsetTop / editorOptions.lineHeight),
            top = row * editorOptions.lineHeight,
            string = editorDataArray[row],
            offsetLeft = Valid.range(selectStartX - editorOptions.horizontalPadding + 3, 0);

        const {left, col} = CharSize.calculateCursorPosition(string, offsetLeft, editorEl);

        return {
            left: left + editorOptions.horizontalPadding,
            top,
            row,
            col
        };

    }

    render() {

        const {editorDataArray, editorOptions, scrollTop, scrollLeft, contentWidth} = this.props,
            scrollerStyle = {
                width: contentWidth + editorOptions.scrollBarWidth + editorOptions.horizontalPadding * 2,
                height: editorDataArray.length * editorOptions.lineHeight,
                transform: `translate3d(${-scrollLeft}px, ${-scrollTop}px, 0)`
            },
            displayIndex = this.calDisplayIndex(),
            cursorPosition = this.calculateCursorPosition();

        return (
            <div className="react-editor-text-scroller"
                 style={scrollerStyle}>

                <TextMarker {...this.props}
                            cursorPosition={cursorPosition}/>

                <TextContainer {...this.props}
                               displayIndex={displayIndex}/>

                <EditorCursor {...this.props}
                              cursorPosition={cursorPosition}/>

            </div>
        );

    }
};

TextScroller.propTypes = {

    editorDataArray: PropTypes.array,
    editorHeight: PropTypes.number,
    editorOptions: PropTypes.object,
    contentWidth: PropTypes.number,
    scrollTop: PropTypes.number,
    scrollLeft: PropTypes.number,
    selectStartX: PropTypes.number,
    selectStartY: PropTypes.number,

    onChange: PropTypes.func

};

TextScroller.defaultProps = {
    editorDataArray: [],
    editorHeight: 200,
    editorOptions: null,
    contentWidth: 0,
    scrollTop: 0,
    scrollLeft: 0,
    selectStartX: 0,
    selectStartY: 0
};