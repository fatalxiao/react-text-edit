import React, {Component} from 'react';
import PropTypes from 'prop-types';

import LineNumber from '../LineNumber';
import GutterActiveLine from '../GutterActiveLine';

import './EditorGutter.scss';

export default class EditorGutter extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {editorHeight, contentHeight, editorOptions, gutterWidth, scrollTop, scrollLeft} = this.props,
            {lineHeight} = editorOptions,
            style = {
                width: gutterWidth,
                height: editorHeight + contentHeight - lineHeight,
                transform: `translate3d(0, ${-scrollTop}px, 0)`
            };

        return (
            <div className="react-editor-gutter"
                 style={style}>

                <GutterActiveLine {...this.props}/>

                <LineNumber {...this.props}/>

            </div>
        );

    }
};

EditorGutter.propTypes = {
    editorHeight: PropTypes.number,
    contentHeight: PropTypes.number,
    editorOptions: PropTypes.object,
    scrollLeft: PropTypes.number,
    scrollTop: PropTypes.number,
    gutterWidth: PropTypes.number
};

EditorGutter.defaultProps = {
    editorHeight: 0,
    contentHeight: 0,
    editorOptions: null,
    scrollLeft: 0,
    scrollTop: 0,
    gutterWidth: 0
};