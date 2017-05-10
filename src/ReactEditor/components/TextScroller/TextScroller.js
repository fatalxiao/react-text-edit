import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextLayer from '../TextLayer';

import './TextScroller.scss';

export default class TextScroller extends Component {

    constructor(props) {

        super(props);

        this.calDisplayIndex = this::this.calDisplayIndex;

    }

    calDisplayIndex() {

        const {editorDataArray, scrollTop, editorOptions} = this.props,
            len = editorDataArray.length;

        let start = Math.floor(scrollTop / editorOptions.lineHeight),
            stop = start + Math.ceil(editorOptions.height / editorOptions.lineHeight);

        start -= editorOptions.lineCache;
        stop += editorOptions.lineCache;

        start = start < 0 ? 0 : start;
        stop = stop > len ? len : stop;

        return {
            start,
            stop
        };

    }

    render() {

        const {className, style} = this.props,
            displayIndex = this.calDisplayIndex();

        return (
            <div className={`react-editor-text-scroller ${className}`}
                 style={style}>

                <TextLayer {...this.props}
                           displayIndex={displayIndex}/>

            </div>
        );

    }
};

TextScroller.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    editorDataArray: PropTypes.array,
    editorOptions: PropTypes.object,
    scrollTop: PropTypes.number,

    onChange: PropTypes.func

};

TextScroller.defaultProps = {

    className: '',
    style: null,

    editorDataArray: [],
    editorOptions: null,
    scrollTop: 0

};