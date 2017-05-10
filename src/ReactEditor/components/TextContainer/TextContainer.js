import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextLine from '../TextLine';

import './TextContainer.scss';

export default class TextContainer extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style, editorDataArray, displayIndex} = this.props,
            finalDataArray = editorDataArray.filter((line, index) => {
                return index >= displayIndex.start && index <= displayIndex.stop;
            });

        return (
            <div className={`react-editor-text-container ${className}`}
                 style={style}>

                {
                    finalDataArray.map((line, index) => {
                        return (
                            <TextLine {...this.props}
                                      key={index}
                                      data={line}/>
                        );
                    })
                }

            </div>
        );

    }
};

TextContainer.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    editorDataArray: PropTypes.array,
    options: PropTypes.object,
    displayIndex: PropTypes.object

};

TextContainer.defaultProps = {

    className: '',
    style: null,

    editorDataArray: [],
    options: null,
    displayIndex: {
        start: 0,
        stop: 0
    }

};