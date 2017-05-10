import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextLine from '../TextLine';

import './TextContainer.scss';

export default class TextContainer extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style, editorDataArray, editorOptions, displayIndex} = this.props;

        return (
            <div className={`react-editor-text-container ${className}`}
                 style={style}>

                {
                    editorDataArray.map((line, index) => {
                        return index >= displayIndex.start && index <= displayIndex.stop ?
                            (
                                <TextLine {...this.props}
                                          key={index}
                                          data={line}
                                          style={{top: editorOptions.lineHeight * index}}/>
                            )
                            :
                            null;
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
    editorOptions: PropTypes.object,
    displayIndex: PropTypes.object

};

TextContainer.defaultProps = {

    className: '',
    style: null,

    editorDataArray: [],
    editorOptions: null,
    displayIndex: {
        start: 0,
        stop: 0
    }

};