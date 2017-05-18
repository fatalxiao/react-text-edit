import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextInput from '../TextInput';
import TextActiveLine from '../TextActiveLine';
import TextSelection from '../TextSelection';
import TextContainer from '../TextContainer';
import EditorCursor from '../EditorCursor';

import Calculation from '../../utils/Calculation';

import './TextScroller.scss';

export default class TextScroller extends Component {

    constructor(props) {

        super(props);

        this.state = {
            compositionText: ''
        };

        this.compositionUpdateHandle = this::this.compositionUpdateHandle;

    }

    compositionUpdateHandle(compositionText) {
        this.setState({
            compositionText
        });
    }

    render() {

        const {
                isEditorFocused, editorDataArray, editorOptions, contentWidth, scrollTop, scrollLeft, gutterWidth
            } = this.props,
            {compositionText} = this.state,
            {horizontalPadding, lineHeight, showLineNumber} = editorOptions,
            initOffsetLeft = horizontalPadding + (showLineNumber ? gutterWidth : 0),
            scrollerStyle = {
                width: contentWidth,
                height: editorDataArray.length * lineHeight,
                transform: `translate3d(${initOffsetLeft - scrollLeft}px, ${-scrollTop}px, 0)`
            },
            displayIndex = Calculation.textDisplayIndex(this.props),
            {selectStartPosition, selectStopPosition, cursorPosition} = Calculation.cursorSelectionPosition(this.props);

        return (
            <div className="react-editor-text-scroller"
                 style={scrollerStyle}>

                <TextInput {...this.props}
                           cursorPosition={cursorPosition}
                           selectStartPosition={selectStartPosition}
                           selectStopPosition={selectStopPosition}
                           onCompositionUpdate={this.compositionUpdateHandle}/>

                <TextActiveLine {...this.props}
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
                                      compositionText={compositionText}
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
    selectStopY: PropTypes.number,
    gutterWidth: PropTypes.number
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
    selectStopY: undefined,
    gutterWidth: 0
};