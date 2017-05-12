import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Calculation from '../../utils/Calculation';

import './TextInput.scss';

export default class TextInput extends Component {

    constructor(props) {

        super(props);

        this.changeHandle = this::this.changeHandle;
        this.keyDownHandle = this::this.keyDownHandle;

    }

    changeHandle() {

        const {editorDataArray, cursorPosition, onChange} = this.props,
            textInput = this.refs.textInput;

        onChange(Calculation.calculateResultText(editorDataArray, cursorPosition, textInput.value));

        textInput.value = '';
        textInput.setSelectionRange(0, 0);

    }

    keyDownHandle() {

    }

    componentWillReceiveProps(nextProps) {
        this.refs.textInput.focus();
        this.refs.textInput.setSelectionRange(0, 0);
    }

    render() {

        const {cursorPosition} = this.props,
            {left, top} = cursorPosition;

        return (
            <textarea ref="textInput"
                      className="react-editor-text-input"
                      style={{transform: `translate3d(${left}px, ${top}px, 0)`}}
                      onChange={this.changeHandle}
                      onKeyDown={this.keyDownHandle}></textarea>
        );

    }
};

TextInput.propTypes = {

    editorDataArray: PropTypes.array,
    cursorPosition: PropTypes.object,

    onChange: PropTypes.func

};

TextInput.defaultProps = {
    editorDataArray: [],
    cursorPosition: null
};