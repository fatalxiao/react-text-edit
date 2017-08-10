import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './TextLine.css';

export default class TextLine extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {style, data, editorOptions} = this.props,
            lineStyle = {
                height: editorOptions.lineHeight,
                lineHeight: `${Math.round(editorOptions.lineHeight * 1.1)}px`
            };

        return (
            <div className="react-editor-text-line"
                 style={{...style, ...lineStyle}}
                 dangerouslySetInnerHTML={{__html: data}}>
            </div>
        );

    }
};

TextLine.propTypes = {
    style: PropTypes.object,
    data: PropTypes.string,
    editorOptions: PropTypes.object
};

TextLine.defaultProps = {
    style: null,
    data: '',
    editorOptions: null
};