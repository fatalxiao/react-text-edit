import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Command from '../../utils/Command';

import './TextInput.scss';

export default class TextInput extends Component {

    constructor(props) {

        super(props);

        this.init = this::this.init;
        this.doChange = this::this.doChange;
        this.changeHandle = this::this.changeHandle;
        this.keyDownHandle = this::this.keyDownHandle;

    }

    init(props = this.props) {

        if (!props.isEditorFocused) {
            return;
        }

        const textInput = this.refs.textInput;

        setTimeout(() => {
            textInput.focus();
            textInput.setSelectionRange(0, 0);
        }, 0);

    }

    doChange(e, result) {

        if (!result) {
            return;
        }

        const {newDataArray, newPosition} = result;
        this.props.onChange(newDataArray, newPosition);

        e.target.value = '';
        this.init();

    }

    changeHandle(e) {
        this.doChange(e, Command.doInput(e.target.value, this.props));
    }

    keyDownHandle(e) {
        // switch (e.keyCode) {
        //     case 8:
        //         this.doChange(e, Command.doBackSpace(this.props));
        //         break;
        //     case 13:
        //         this.doChange(e, Command.doCarriageReturn(this.props));
        //         break;
        // }
    }

    componentDidMount() {
        this.init();
    }

    componentWillReceiveProps(nextProps) {
        this.init(nextProps);
    }

    componentDidUpdate(prevProps) {
        this.init(prevProps);
    }

    render() {
        return (
            <textarea ref="textInput"
                      className="react-editor-text-input"
                      onChange={this.changeHandle}
                      onKeyDown={this.keyDownHandle}></textarea>
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