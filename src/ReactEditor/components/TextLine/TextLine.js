import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './TextLine.scss';

export default class TextLine extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style, data, options} = this.props,
            lineStyle = {
                height: options.lineHeight,
                lineHeight: `${options.lineHeight}px`
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
    options: PropTypes.object

};

TextLine.defaultProps = {

    className: '',
    style: null,

    data: '',
    options: null

};