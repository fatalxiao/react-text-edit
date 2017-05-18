import React, {Component} from 'react';
import PropTypes from 'prop-types';

import LineNumber from '../LineNumber';

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
                transform: `translate3d(${-scrollLeft}px, ${-scrollTop}px, 0)`
            };

        return (
            <div className="react-editor-gutter"
                 style={style}>

                <LineNumber {...this.props}/>

            </div>
        );

    }
};

EditorGutter.propTypes = {
    gutterWidth: PropTypes.number
};

EditorGutter.defaultProps = {
    gutterWidth: 50
};