import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Command from '../../utils/Command';
import Calculation from '../../utils/Calculation';

import './TextInput.scss';

export default class TextInput extends Component {

    constructor(props) {

        super(props);

        this.state = {
            value: this.calculateValue(props)
        };

        this.focus = this::this.focus;
        this.calculateValue = this::this.calculateValue;
        this.doChange = this::this.doChange;
        this.changeHandle = this::this.changeHandle;
        this.keyDownHandle = this::this.keyDownHandle;

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

        this.setState({
            value: ''
        }, () => {
            this.props.onChange(newDataArray, newPosition);
            this.focus();
        });

    }

    changeHandle(e) {
        // if (e.target.value === '') {
        //     this.doChange(Command.doCut(this.props)); // cut
        // } else {
        this.doChange(Command.doInput(e.target.value, this.props));
        // }
    }

    keyDownHandle(e) {
        switch (e.keyCode) {
            case 8: // back space
                e.preventDefault();
                this.doChange(Command.doDelete(this.props));
                break;
        }
    }

    componentDidMount() {
        this.focus();
    }

    componentWillReceiveProps(nextProps) {

        if (!_.isEqual(nextProps.selectStartPosition, this.props.selectStartPosition)
            || !_.isEqual(nextProps.selectStopPosition, this.props.selectStopPosition)) {
            this.setState({
                value: this.calculateValue(nextProps)
            }, () => {
                this.focus(nextProps);
            });
        }

        this.focus(nextProps);

    }

    componentDidUpdate(prevProps) {
        this.focus(prevProps);
    }

    render() {

        const {value} = this.state;

        return (
            <textarea ref="textInput"
                      className="react-editor-text-input"
                      value={value}
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