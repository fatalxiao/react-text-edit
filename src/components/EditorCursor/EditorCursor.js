import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './EditorCursor.scss';

export default class EditorCursor extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {editorOptions, cursorPosition} = this.props;
        let left, top;

        if (cursorPosition) {
            ({left, top} = cursorPosition);
        } else {
            left = editorOptions.horizontalPadding;
            top = 0;
        }

        return (
            <div className="react-editor-cursor-wrapper">

                <div className="react-editor-cursor"
                     style={{transform: `translate3d(${left}px, ${top}px, 0)`}}></div>

            </div>
        );

    }
};

EditorCursor.propTypes = {
    editorEl: PropTypes.object,
    editorDataArray: PropTypes.array,
    editorOptions: PropTypes.object,
    scrollLeft: PropTypes.number,
    scrollTop: PropTypes.number,
    mouseDownPosition: PropTypes.object,
    cursorPosition: PropTypes.object
};

EditorCursor.defaultProps = {
    editorEl: null,
    editorDataArray: [],
    editorOptions: null,
    scrollLeft: 0,
    scrollTop: 0,
    mouseDownPosition: null,
    cursorPosition: null
};