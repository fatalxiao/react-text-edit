import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './EditorCursor.scss';

export default class EditorCursor extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style, editorOptions, position} = this.props;
        let left, top;

        if (position) {
            ({left, top} = position);
        } else {
            left = editorOptions.horizontalPadding;
            top = 0;
        }

        return (
            <div className={`react-editor-cursor-wrapper ${className}`}
                 style={style}>

                <div className="react-editor-cursor"
                     style={{transform: `translate3d(${left}px, ${top}px, 0)`}}></div>

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
    mouseDownPosition: PropTypes.object,
    position: PropTypes.object

};

EditorCursor.defaultProps = {

    className: '',
    style: null,

    editorEl: null,
    editorDataArray: [],
    editorOptions: null,
    scrollLeft: 0,
    scrollTop: 0,
    mouseDownPosition: null,
    position: null

};