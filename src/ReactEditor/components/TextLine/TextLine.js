import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './TextLine.scss';

export default class TextLine extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style, data, editorOptions} = this.props,
            lineStyle = {
                height: editorOptions.lineHeight,
                lineHeight: `${editorOptions.lineHeight}px`
            };

        return (
            <div className={`react-editor-text-line ${className}`}
                 style={{...style, ...lineStyle}}>
                {data}
            </div>
        );

    }
};

TextLine.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    data: PropTypes.string,
    editorOptions: PropTypes.object

};

TextLine.defaultProps = {

    className: '',
    style: null,

    data: '',
    editorOptions: null

};