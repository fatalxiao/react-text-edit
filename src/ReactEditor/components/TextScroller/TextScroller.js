import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextContainer from '../TextContainer';
import EditorCursor from '../EditorCursor';

import Valid from '../../utils/Valid';

import './TextScroller.scss';

export default class TextScroller extends Component {

    constructor(props) {

        super(props);

        this.state = {
            mouseDownPosition: null
        };

        this.calDisplayIndex = this::this.calDisplayIndex;
        this.mouseDownHandle = this::this.mouseDownHandle;

    }

    calDisplayIndex() {

        const {editorDataArray, scrollTop, editorOptions, editorHeight} = this.props,
            len = editorDataArray.length;

        let start = Math.floor(scrollTop / editorOptions.lineHeight),
            stop = start + Math.ceil(editorHeight / editorOptions.lineHeight);

        start -= editorOptions.lineCache;
        stop += editorOptions.lineCache;

        return {
            start: Valid.range(start, 0, len),
            stop: Valid.range(stop, 0, len)
        };

    }

    mouseDownHandle(e) {
        this.setState({
            mouseDownPosition: {
                left: e.clientX,
                top: e.clientY
            }
        });
    }

    render() {

        const {className, style, editorDataArray, editorOptions, scrollTop, scrollLeft, contentWidth} = this.props,
            scrollerStyle = {
                width: contentWidth + editorOptions.scrollBarWidth + editorOptions.horizontalPadding * 2,
                height: editorDataArray.length * editorOptions.lineHeight,
                transform: `translate3d(${-scrollLeft}px, ${-scrollTop}px, 0)`
            },
            displayIndex = this.calDisplayIndex();

        return (
            <div className={`react-editor-text-scroller ${className}`}
                 style={{...style, ...scrollerStyle}}
                 onMouseDown={this.mouseDownHandle}>

                <TextContainer {...this.props}
                               displayIndex={displayIndex}/>

                <EditorCursor {...this.props}
                              {...this.state}/>

            </div>
        );

    }
};

TextScroller.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    editorDataArray: PropTypes.array,
    editorHeight: PropTypes.number,
    editorOptions: PropTypes.object,
    scrollTop: PropTypes.number,
    scrollLeft: PropTypes.number,
    contentWidth: PropTypes.number,

    onChange: PropTypes.func

};

TextScroller.defaultProps = {

    className: '',
    style: null,

    editorDataArray: [],
    editorHeight: 200,
    editorOptions: null,
    scrollTop: 0,
    scrollLeft: 0,
    contentWidth: 0

};