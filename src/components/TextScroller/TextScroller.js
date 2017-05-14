import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextInput from '../TextInput';
// import TextMarker from '../TextMarker';
import ActiveLine from '../ActiveLine';
import TextSelection from '../TextSelection';
import TextContainer from '../TextContainer';
import EditorCursor from '../EditorCursor';

import Calculation from '../../utils/Calculation';

import './TextScroller.scss';

export default class TextScroller extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {isEditorFocused, editorDataArray, editorOptions, contentWidth, scrollTop, scrollLeft} = this.props,
            {horizontalPadding, scrollBarWidth, lineHeight} = editorOptions,
            scrollerStyle = {
                width: contentWidth + horizontalPadding * 2 + scrollBarWidth,
                height: editorDataArray.length * lineHeight,
                padding: `0 ${horizontalPadding + scrollBarWidth}px 0 ${horizontalPadding}px`,
                transform: `translate3d(${-scrollLeft}px, ${-scrollTop}px, 0)`
            },
            displayIndex = Calculation.calculateTextDisplayIndex(this.props),
            {selectStartPosition, selectStopPosition, cursorPosition}
                = Calculation.calculateCursorSelectionPosition(this.props);

        return (
            <div className="react-editor-text-scroller"
                 style={scrollerStyle}>

                <TextInput {...this.props}
                           cursorPosition={cursorPosition}
                           selectStartPosition={selectStartPosition}
                           selectStopPosition={selectStopPosition}/>

                {/*<TextMarker {...this.props}*/}
                {/*cursorPosition={cursorPosition}*/}
                {/*selectStartPosition={selectStartPosition}*/}
                {/*selectStopPosition={selectStopPosition}/>*/}

                <ActiveLine {...this.props}
                            cursorPosition={cursorPosition}
                            selectStartPosition={selectStartPosition}
                            selectStopPosition={selectStopPosition}/>

                {
                    selectStartPosition && selectStopPosition ?
                        <TextSelection {...this.props}
                                       cursorPosition={cursorPosition}
                                       selectStartPosition={selectStartPosition}
                                       selectStopPosition={selectStopPosition}/>
                        :
                        null
                }

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