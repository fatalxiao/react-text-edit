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
                isEditorFocused, editorDataArray, editorOptions, contentWidth, scrollTop, scrollLeft, gutterWidth,
                selectStartPosition, selectStopPosition, cursorPosition
            } = this.props,
            {compositionText} = this.state,
            {horizontalPadding, lineHeight, showLineNumber} = editorOptions,
            initOffsetLeft = horizontalPadding + (showLineNumber ? gutterWidth : 0),
            scrollerStyle = {
                width: contentWidth,
                height: editorDataArray.length * lineHeight,
                transform: `translate3d(${initOffsetLeft - scrollLeft}px, ${-scrollTop}px, 0)`
            };

        return (
            <div className="react-editor-text-scroller"
                 style={scrollerStyle}>

                {
                    cursorPosition ?
                        <TextInput {...this.props}
                                   compositionText={compositionText}
                                   onCompositionUpdate={this.compositionUpdateHandle}/>
                        :
                        null
                }

                {
                    cursorPosition ?
                        <TextActiveLine {...this.props}/>
                        :
                        null
                }

                {
                    selectStartPosition && selectStopPosition ?
                        <TextSelection {...this.props}/>
                        :
                        null
                }

                <TextContainer {...this.props}/>

                {
                    cursorPosition && isEditorFocused ?
                        <EditorCursor {...this.props}
                                      compositionText={compositionText}/>
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
    gutterWidth: PropTypes.number,
    selectStartPosition: PropTypes.object,
    selectStopPosition: PropTypes.object,
    cursorPosition: PropTypes.object
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
    gutterWidth: 0,
    selectStartPosition: null,
    selectStopPosition: null,
    cursorPosition: null
};