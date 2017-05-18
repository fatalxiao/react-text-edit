import React, {Component} from 'react';
import PropTypes from 'prop-types';

import CharSize from '../../utils/CharSize';
import Calculation from '../../utils/Calculation';

import './LineNumber.scss';

export default class LineNumber extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {editorEl, editorDataArray, editorOptions} = this.props,
            {lineHeight, horizontalPadding} = editorOptions,
            len = editorDataArray.length,
            width = CharSize.calculateStringWidth('' + len, editorEl),
            {start, stop} = Calculation.textDisplayIndex(this.props);

        let numbers = [], style;
        for (let i = start; i < stop; i++) {

            style = {
                width,
                lineHeight: `${lineHeight}px`,
                left: horizontalPadding,
                top: lineHeight * i
            };

            numbers.push(
                <div key={i}
                     className="react-editor-line-number-item"
                     style={style}>
                    {i + 1}
                </div>
            );
        }

        return (
            <div className="react-editor-line-number">

                {numbers}

            </div>
        );

    }
};

LineNumber.propTypes = {
    editorEl: PropTypes.object,
    editorDataArray: PropTypes.array,
    editorOptions: PropTypes.object
};

LineNumber.defaultProps = {
    editorEl: null,
    editorDataArray: [],
    editorOptions: null
};