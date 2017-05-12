import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Calculation from '../../utils/Calculation';
import CharSize from '../../utils/CharSize';

import './TextInput.scss';

export default class TextInput extends Component {

    constructor(props) {

        super(props);

        this.init = this::this.init;
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

    changeHandle(e) {

        const {editorEl, editorDataArray, cursorPosition, onChange} = this.props,
            newData = Calculation.calculateResultText(editorDataArray, cursorPosition, e.target.value),
            offset = {
                left: CharSize.calculateStringWidth(e.target.value, editorEl)
            };

        onChange(newData, offset);

        e.target.value = '';
        this.init();

    }

    keyDownHandle() {

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
    cursorPosition: PropTypes.object,

    onChange: PropTypes.func

};

TextInput.defaultProps = {
    editorEl: null,
    editorDataArray: [],
    cursorPosition: null
};