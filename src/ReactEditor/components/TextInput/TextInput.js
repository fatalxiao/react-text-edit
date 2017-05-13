import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import Calculation from '../../utils/Calculation';
import CharSize from '../../utils/CharSize';

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

    doChange(e, type) {

        const {editorEl, editorDataArray, selectStartPosition, selectStopPosition, onChange} = this.props;

        // calculate new cursor position
        let newPostion = selectStopPosition;
        if (selectStartPosition && selectStopPosition) { // if there is a selection
            newPostion = Calculation.sortPosition(selectStartPosition, selectStopPosition)[0];
        }

        // calculate new data
        let newData;

        newData = Calculation.calculateResultText(editorDataArray, newPostion, e.target.value);
        newPostion.left += CharSize.calculateStringWidth(e.target.value, editorEl);

        onChange(newData, newPostion);

        e.target.value = '';
        this.init();

    }

    changeHandle(e) {
        this.doChange(e);
    }

    keyDownHandle(e) {
        // switch (e.keyCode) {
        //     case 8:
        //         this.doChange(e, Calculation.ChangeType.BACK_SPACE);
        //         break;
        //     case 13:
        //         this.doChange(e, Calculation.ChangeType.CARRIAGE_RETURN);
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