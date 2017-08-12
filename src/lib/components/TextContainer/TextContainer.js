import React, {Component} from 'react';
import PropTypes from 'prop-types';
import hljs from 'highlight.js';

import TextLine from '../TextLine';

import './TextContainer.css';

export default class TextContainer extends Component {

    constructor(props) {

        super(props);

        this.state = {
            formatedData: hljs.highlightAuto(props.data)
        };

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.props.data) {
            this.setState({
                formatedData: hljs.highlightAuto(nextProps.data)
            });
        }
    }

    render() {

        const {editorOptions, displayIndex} = this.props,
            {formatedData} = this.state,
            {language, value} = formatedData;

        return (
            <div className="react-editor-text-container">

                {
                    value.split('\n').map((line, index) => {
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