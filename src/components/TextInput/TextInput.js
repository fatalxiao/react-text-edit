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
        this.calculateValue = this::this.calculateValue;
        this.doChange = this::this.doChange;
        this.changeHandle = this::this.changeHandle;
        this.keyDownHandle = this::this.keyDownHandle;
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
            textInput.setSelectionRange(0, textInput.value.length);
        }, 0);

    }

    /**
     * get the value of textarea should display
     * @param props
     * @returns {*}
     */
    calculateValue(props = this.props) {
        return Calculation.getSelectionValue(props);
    }

    /**
     * update editor text data and pop
     * @param result
     */
    doChange(result) {

        if (!result) {
            return;
        }

        const {editorOptions} = this.props,
            {newDataArray, newPosition} = result;

        newPosition.left += editorOptions.horizontalPadding;

        this.refs.textInput.value = this.calculateValue();
        this.props.onChange(newDataArray, newPosition);
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

        if (value === '') {
            this.doChange(Command.doCut(this.props)); // cut
        } else {
            this.doChange(Command.doInput(value, this.props)); // input or paste
        }

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
        this.refs.textInput.value = this.calculateValue();
        this.focus();
    }

    componentWillReceiveProps(nextProps) {

        if (!_.isEqual(nextProps.selectStartPosition, this.props.selectStartPosition)
            || !_.isEqual(nextProps.selectStopPosition, this.props.selectStopPosition)) {
            this.refs.textInput.value = this.calculateValue(nextProps);
            this.focus(nextProps);
        }

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
                          onCompositionEnd={this.compositionHandle}></textarea>

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