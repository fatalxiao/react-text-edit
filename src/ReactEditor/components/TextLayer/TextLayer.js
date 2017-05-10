import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextLine from '../TextLine';

import './TextLayer.scss';

export default class TextLayer extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style, editorDataArray, displayIndex} = this.props,
            finalDataArray = editorDataArray.filter((line, index) => {
                return index >= displayIndex.start && index <= displayIndex.stop;
            });

        return (
            <div className={`react-editor-text-layer ${className}`}
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

TextLayer.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    editorDataArray: PropTypes.array,
    options: PropTypes.object,
    displayIndex: PropTypes.object

};

TextLayer.defaultProps = {

    className: '',
    style: null,

    editorDataArray: [],
    options: null,
    displayIndex: {
        start: 0,
        stop: 0
    }

};