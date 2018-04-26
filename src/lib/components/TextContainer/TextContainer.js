import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextLine from '../TextLine';

import './TextContainer.scss';

class TextContainer extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {editorDataArray, highlightedDataArray, editorOptions, displayIndex} = this.props,
            data = highlightedDataArray || editorDataArray;

        return (
            <div className="react-editor-text-container">
                {
                    data && data.map((line, index) => index >= displayIndex.start && index <= displayIndex.stop ?
                        <TextLine {...this.props}
                                  key={index}
                                  style={{top: editorOptions.lineHeight * index}}
                                  data={line}/>
                        :
                        null
                    )
                }
            </div>
        );

    }
};

TextContainer.propTypes = {
    editorDataArray: PropTypes.array,
    editorOptions: PropTypes.object,
    displayIndex: PropTypes.object
};

TextContainer.defaultProps = {
    editorDataArray: [],
    displayIndex: {
        start: 0,
        stop: 0
    }
};

export default TextContainer;