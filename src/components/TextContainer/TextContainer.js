import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextLine from '../TextLine';

import './TextContainer.scss';

export default class TextContainer extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {editorDataArray, editorOptions, displayIndex} = this.props;

        return (
            <div className="react-editor-text-container">

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
    editorDataArray: PropTypes.array,
    editorOptions: PropTypes.object,
    displayIndex: PropTypes.object
};

TextContainer.defaultProps = {
    editorDataArray: [],
    editorOptions: null,
    displayIndex: {
        start: 0,
        stop: 0
    }
};