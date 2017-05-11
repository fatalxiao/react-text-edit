import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Valid from '../../utils/Valid';
import Event from '../../utils/Event';

import './VerticalScrollBar.scss';

export default class VerticalScrollBar extends Component {

    constructor(props) {

        super(props);

        this.wrapperHeight = props.editorOptions.height;
        this.scrollBarHeight = props.editorOptions.scrollBarMinLength;
        this.scrollBarTop = 0;

        this.isWrapperMouseDown = false;
        this.isScrollBarMouseDown = false;
        this.mouseDownPosition = null;

        this.calculateScrollBarHeight = this::this.calculateScrollBarHeight;
        this.calculateTop = this::this.calculateTop;
        this.calculateScrollTop = this::this.calculateScrollTop;
        this.mouseDownHandle = this::this.mouseDownHandle;
        this.mouseMoveHandle = this::this.mouseMoveHandle;
        this.mouseUpHandle = this::this.mouseUpHandle;

    }

    calculateScrollBarHeight() {

        const {editorDataArray, editorOptions} = this.props;

        return Valid.range(
            this.wrapperHeight ** 2 / (editorDataArray.length * editorOptions.lineHeight),
            editorOptions.scrollBarMinLength
        );

    }

    calculateTop(scrollBarHeight = this.scrollBarHeight) {

        const {editorDataArray, editorOptions, scrollTop} = this.props;

        return (this.wrapperHeight - scrollBarHeight) * scrollTop
            / ((editorDataArray.length - 1) * editorOptions.lineHeight);

    }

    calculateScrollTop(top = this.scrollBarTop, scrollBarHeight = this.scrollBarHeight) {

        const {editorDataArray, editorOptions} = this.props;

        return ((editorDataArray.length - 1) * editorOptions.lineHeight) * top
            / (this.wrapperHeight - scrollBarHeight);

    }

    mouseDownHandle(e, isWrapper) {

        e.stopPropagation();
        isWrapper ? this.isWrapperMouseDown = true : this.isScrollBarMouseDown = true;

        this.mouseDownPosition = {
            left: e.clientX,
            top: e.clientY,
            scrollBarTop: this.scrollBarTop
        };

    }

    mouseMoveHandle(e) {

        e.stopPropagation();

        if (!this.isScrollBarMouseDown) {
            return;
        }

        const top = Valid.range(this.mouseDownPosition.scrollBarTop + e.clientY - this.mouseDownPosition.top,
            0, this.wrapperHeight - this.scrollBarHeight);

        this.props.scrollY(this.calculateScrollTop(top));

    }

    mouseUpHandle(e) {

        e.stopPropagation();

        // move scroll bar when wrapper mouse up
        if (this.isWrapperMouseDown
            && this.mouseDownPosition.left === e.clientX && this.mouseDownPosition.top === e.clientY) {

            this.scrollBarTop = Valid.range(e.clientY - this.scrollBarHeight / 2,
                0, this.wrapperHeight - this.scrollBarHeight);

            this.props.scrollY(this.calculateScrollTop());

        }

        this.isWrapperMouseDown = false;
        this.isScrollBarMouseDown = false;
        this.mouseDownPosition = null;

    }

    componentDidMount() {
        Event.addEvent(document, 'mousemove', this.mouseMoveHandle);
        Event.addEvent(document, 'mouseup', this.mouseUpHandle);
    }

    componentWillUnmount() {
        Event.removeEvent(document, 'mousemove', this.mouseMoveHandle);
        Event.removeEvent(document, 'mouseup', this.mouseUpHandle);
    }

    render() {

        const {className, style} = this.props;

        this.scrollBarHeight = this.calculateScrollBarHeight();
        this.scrollBarTop = this.calculateTop();

        const scrollBarStyle = {
            height: this.scrollBarHeight,
            transform: `translate3d(0, ${this.scrollBarTop}px, 0)`
        };

        return (
            <div className={`react-editor-vertical-scroll-bar-wrapper ${className}`}
                 style={style}
                 onMouseDown={(e) => {
                     this.mouseDownHandle(e, true);
                 }}>
                <div className="react-editor-vertical-scroll-bar"
                     style={scrollBarStyle}
                     onMouseDown={(e) => {
                         this.mouseDownHandle(e, false);
                     }}>
                    <div className="react-editor-vertical-scroll-bar-inner"></div>
                </div>
            </div>
        );

    }

};

VerticalScrollBar.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    editorDataArray: PropTypes.array,
    editorOptions: PropTypes.object,
    scrollTop: PropTypes.number,

    scrollY: PropTypes.func

};

VerticalScrollBar.defaultProps = {

    className: '',
    style: null,

    editorDataArray: [],
    editorOptions: null,
    scrollTop: 0

};