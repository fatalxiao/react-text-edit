import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import CharSize from '../../utils/CharSize';
import Valid from '../../utils/Valid';

import './EditorCursor.scss';

export default class EditorCursor extends Component {

    constructor(props) {

        super(props);

        this.state = {
            left: props.editorOptions.horizontalPadding,
            top: 0
        };

        this.calculateCursorPosition = this::this.calculateCursorPosition;

    }

    calculateCursorPosition(props = this.props) {

        const {editorEl, editorDataArray, editorOptions, scrollLeft, scrollTop, mouseDownPosition} = props;

        if (!mouseDownPosition || isNaN(mouseDownPosition.left) || isNaN(mouseDownPosition.top)) {
            return;
        }

        const offsetTop = Valid.range(mouseDownPosition.top + scrollTop - 10, 0),
            lineIndex = Math.round(offsetTop / editorOptions.lineHeight),
            top = lineIndex * editorOptions.lineHeight,
            string = editorDataArray[lineIndex],
            offsetLeft = Valid.range(mouseDownPosition.left + scrollLeft - editorOptions.horizontalPadding + 3, 0);

        const {left, col} = CharSize.calculateCursorPosition(string, offsetLeft, editorEl);

        return {
            left: left + editorOptions.horizontalPadding,
            top
        };

    }

    componentWillReceiveProps(nextProps) {
        if (!(_.isEqual(nextProps.mouseDownPosition, this.props.mouseDownPosition))) {
            this.setState(this.calculateCursorPosition(nextProps));
        }
    }

    render() {

        const {className, style} = this.props;
        const {left, top} = this.state;

        return (
            <div className={`react-editor-cursor-wrapper ${className}`}
                 style={style}>

                <div className="react-editor-cursor"
                     style={{left, top}}></div>

            </div>
        );

    }
};

EditorCursor.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    editorEl: PropTypes.object,
    editorDataArray: PropTypes.array,
    editorOptions: PropTypes.object,
    scrollLeft: PropTypes.number,
    scrollTop: PropTypes.number,
    mouseDownPosition: PropTypes.object

};

EditorCursor.defaultProps = {

    className: '',
    style: null,

    editorEl: null,
    editorDataArray: [],
    editorOptions: null,
    scrollLeft: 0,
    scrollTop: 0,
    mouseDownPosition: null

};