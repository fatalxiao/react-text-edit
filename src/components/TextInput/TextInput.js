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

        this.isCompositionStart = false;

        this.focus = this::this.focus;
        this.calculateValue = this::this.calculateValue;
        this.doChange = this::this.doChange;
        this.changeHandle = this::this.changeHandle;
        this.keyDownHandle = this::this.keyDownHandle;
        this.compositionHandle = this::this.compositionHandle;

    }

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

    calculateValue(props = this.props) {
        return Calculation.getSelectionValue(props);
    }

    doChange(result) {

        if (!result) {
            return;
        }

        const {newDataArray, newPosition} = result;

        this.refs.textInput.value = this.calculateValue();
        this.props.onChange(newDataArray, newPosition);
        this.focus();

    }

    changeHandle(e) {

        if (this.isCompositionStart) {
            return;
        }

        if (e.target.value === '') {
            this.doChange(Command.doCut(this.props)); // cut
        } else {
            this.doChange(Command.doInput(e.target.value, this.props));
        }

    }

    keyDownHandle(e) {
        switch (e.keyCode) {
            case 8: // back space
                e.preventDefault();
                this.doChange(Command.doDelete(this.props));
                break;
        }
    }

    compositionHandle(e) {
        if (e.type === 'compositionend') {
            this.isCompositionStart = false;
            Valid.isChrome() && this.changeHandle(e);
        } else {
            this.isCompositionStart = true;
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
        return (
            <textarea ref="textInput"
                      className="react-editor-text-input"
                      onChange={this.changeHandle}
                      onKeyDown={this.keyDownHandle}
                      onCompositionStart={this.compositionHandle}
                      onCompositionUpdate={this.compositionHandle}
                      onCompositionEnd={this.compositionHandle}></textarea>
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