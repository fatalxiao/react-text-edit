import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Command from '../../utils/Command';
import Calculation from '../../utils/Calculation';

import './TextInput.scss';

export default class TextInput extends Component {

    constructor(props) {

        super(props);

        this.focus = this::this.focus;
        this.calculateValue = this::this.calculateValue;
        this.doChange = this::this.doChange;
        this.changeHandle = this::this.changeHandle;
        this.keyDownHandle = this::this.keyDownHandle;
        this.cutHandle = this::this.cutHandle;
        this.copyHandle = this::this.copyHandle;
        this.pasteHandle = this::this.pasteHandle;
        this.selectHandle = this::this.selectHandle;

    }

    focus(props = this.props) {

        if (!props.isEditorFocused) {
            return;
        }

        const textInput = this.refs.textInput;

        setTimeout(() => {
            textInput.focus();
            textInput.setSelectionRange(0, 0);
        }, 0);

    }

    calculateValue(props = this.props) {
        return Calculation.getSelectionValue(props);
    }

    doChange(result) {

        if (!result) {
            return;
        }

        const {newDataArray, newPosition} = result;

        this.props.onChange(newDataArray, newPosition);

        this.refs.textInput.value = '';
        this.focus();

    }

    changeHandle(e) {
        this.doChange(Command.doInput(e.target.value, this.props));
    }

    keyDownHandle(e) {
        switch (e.keyCode) {
            case 8: // back space
                e.preventDefault();
                this.doChange(Command.doDelete(this.props));
                break;
        }
    }

    cutHandle(e) {
        e.persist();
    }

    copyHandle(e) {
        e.persist();
    }

    pasteHandle(e) {
        e.persist();
        this.doChange(Command.doInput(e.target.value, this.props));
    }

    selectHandle(e) {
        console.log(e.target.selectionStart, e.target.selectionEnd);
    }

    componentDidMount() {
        this.focus();
    }

    componentWillReceiveProps(nextProps) {
        this.focus(nextProps);
    }

    componentDidUpdate(prevProps) {
        this.focus(prevProps);
    }

    render() {
        return (
            <textarea ref="textInput"
                      className="react-editor-text-input"
                      onChange={this.changeHandle}
                      onKeyDown={this.keyDownHandle}
                      onCut={this.cutHandle}
                      onCopy={this.copyHandle}
                      onPaste={this.pasteHandle}
                      onSelect={this.selectHandle}></textarea>
        );
    }
};

TextInput.propTypes = {

    editorEl: PropTypes.object,
    isEditorFocused: PropTypes.bool,
    editorDataArray: PropTypes.array,
    selectStartPosition: PropTypes.object,
    selectStopPosition: PropTypes.object,

    onChange: PropTypes.func

};

TextInput.defaultProps = {
    editorEl: null,
    editorDataArray: [],
    selectStartPosition: null,
    selectStopPosition: null
};