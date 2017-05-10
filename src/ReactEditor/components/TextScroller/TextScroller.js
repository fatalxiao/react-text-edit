import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextContainer from '../TextContainer';

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
        start = start > len ? len : start;

        stop = stop < 0 ? 0 : stop;
        stop = stop > len ? len : stop;

        return {
            start,
            stop
        };

    }

    render() {

        const {className, style, editorDataArray, editorOptions, scrollTop, scrollLeft} = this.props,
            scrollerStyle = {
                height: editorDataArray.length * editorOptions.lineHeight,
                transform: `translate3d(${-scrollLeft}px, ${-scrollTop}px, 0)`
            },
            displayIndex = this.calDisplayIndex();

        return (
            <div className={`react-editor-text-scroller ${className}`}
                 style={{...style, ...scrollerStyle}}>

                <TextContainer {...this.props}
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
    scrollLeft: PropTypes.number,

    onChange: PropTypes.func

};

TextScroller.defaultProps = {

    className: '',
    style: null,

    editorDataArray: [],
    editorOptions: null,
    scrollTop: 0,
    scrollLeft: 0

};