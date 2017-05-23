import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Command from '../../utils/Command';
import Calculation from '../../utils/Calculation';
import Valid from '../../utils/Valid';

import './TextInput.scss';

export default class TextInput extends Component {

    constructor(props) {

        super(props);

        this.state = {
            isComposition: false,
            compositionText: ''
        };

        this.focus = this::this.focus;
        this.doChange = this::this.doChange;
        this.changeHandle = this::this.changeHandle;
        this.directionKeyHandle = this::this.directionKeyHandle;
        this.keyDownHandle = this::this.keyDownHandle;
        this.selectHandle = this::this.selectHandle;
        this.compositionHandle = this::this.compositionHandle;

    }

    /**
     * focus the textarea async
     * @param props
     */
    focus(props = this.props) {

        if (!props.isEditorFocused) {
            return;
        }

        const textInput = this.refs.textInput;

        setTimeout(() => {
            textInput.focus();
            textInput.setSelectionRange(0, textInput.value.length - 1);
        }, 0);

    }

    /**
     * update editor text data and pop
     * @param result
     */
    doChange(result) {

        if (!result) {
            return;
        }

        const {newDataArray, newPosition} = result;

        this.props.onChange(newDataArray, null, newPosition, newPosition);
        this.focus();

    }

    /**
     * textarea change event handle
     * @param e
     */
    changeHandle(e) {

        const value = e.target.value;

        if (this.state.isComposition) {

            const {onCompositionUpdate} = this.props;

            this.setState({
                compositionText: value
            }, () => {
                onCompositionUpdate(value);
            });

            return;

        }

        if (value === ' ') {
            this.doChange(Command.doCut(this.props)); // cut
        } else {
            this.doChange(Command.doInput(value, this.props)); // input or paste
        }

    }

    /**
     * direction key (up, down, left, right) click handle
     * @param colOffset
     * @param rowOffset
     */
    directionKeyHandle(colOffset, rowOffset) {

        const {editorDataArray, cursorPosition} = this.props,
            row = cursorPosition.row + rowOffset,
            col = cursorPosition.col + colOffset;

        const result = Calculation.rowColToLeftTop(row, col, this.props);

        if (!result) {
            return;
        }

        this.doChange({
            newDataArray: editorDataArray,
            newPosition: {
                ...result,
                col,
                row
            }
        });

    }

    /**
     * textarea keydown event handle
     * @param e
     */
    keyDownHandle(e) {

        if (this.state.isComposition) {
            return;
        }

        switch (e.keyCode) {
            case 8: // back space
                e.preventDefault();
                this.doChange(Command.doDelete(this.props));
                break;
            case 37: // left
                this.directionKeyHandle(-1, 0);
                break;
            case 38: // up
                this.directionKeyHandle(0, -1);
                break;
            case 39: // right
                this.directionKeyHandle(1, 0);
                break;
            case 40: // down
                this.directionKeyHandle(0, 1);
                break;
        }

    }

    selectHandle(e) {

        const {editorDataArray, cursorPosition, onChange} = this.props,
            textarea = e.target;

        // select all
        if (textarea.selectionStart === 0 && textarea.selectionEnd === textarea.value.length) {

            const {newStartPosition, newStopPosition} = Command.doSelectAll(this.props);

            onChange(editorDataArray, newStartPosition, newStopPosition, cursorPosition);
            this.focus();

        }

    }

    /**
     * textarea composition event handle
     * @param e
     */
    compositionHandle(e) {

        e.persist();

        switch (e.type) {
            case 'compositionstart': {

                this.setState({
                    isComposition: true
                });

                break;

            }
            case 'compositionend': {

                const {onCompositionUpdate} = this.props;

                this.setState({
                    isComposition: false,
                    compositionText: ''
                }, () => {

                    // chrome cannot trigger change event when composition end
                    // so trigger change event manually here
                    Valid.isChrome() && this.changeHandle(e);

                    onCompositionUpdate('');

                });

                break;

            }
        }

    }

    componentDidMount() {

        // initial text input value
        this.refs.textInput.value = Calculation.getSelectionValue(this.props);

        // focus at the begin
        this.focus();

    }

    componentWillReceiveProps(nextProps) {
        this.refs.textInput.value = Calculation.getSelectionValue(nextProps);
        this.focus(nextProps);
    }

    componentDidUpdate(prevProps) {
        this.focus(prevProps);
    }

    render() {

        const {editorOptions, cursorPosition} = this.props,
            {isComposition, compositionText} = this.state,
            style = {
                height: editorOptions.lineHeight,
                lineHeight: `${editorOptions.lineHeight * 1.1}px`,
                transform: `translate3d(${cursorPosition.left}px, ${cursorPosition.top}px, 0)`
            };

        return (
            <div className="react-editor-text-input-wrapper">

                {
                    isComposition ?
                        <div ref="textDisplay"
                             className="react-editor-text-display"
                             style={style}>
                            {compositionText}
                        </div>
                        :
                        null
                }

                <textarea ref="textInput"
                          className="react-editor-text-input"
                          onChange={this.changeHandle}
                          onKeyDown={this.keyDownHandle}
                          onCompositionStart={this.compositionHandle}
                          onCompositionUpdate={this.compositionHandle}
                          onCompositionEnd={this.compositionHandle}
                          onSelect={this.selectHandle}></textarea>

            </div>
        );

    }
};

TextInput.propTypes = {

    editorEl: PropTypes.object,
    editorOptions: PropTypes.object,
    isEditorFocused: PropTypes.bool,
    editorDataArray: PropTypes.array,
    cursorPosition: PropTypes.object,
    selectStartPosition: PropTypes.object,
    selectStopPosition: PropTypes.object,

    onChange: PropTypes.func,
    onCompositionUpdate: PropTypes.func

};

TextInput.defaultProps = {
    editorEl: null,
    editorOptions: null,
    editorDataArray: [],
    cursorPosition: null,
    selectStartPosition: null,
    selectStopPosition: null
};