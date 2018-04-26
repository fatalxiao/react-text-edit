import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Valid from '../../utils/Valid';
import Event from '../../utils/Event';

import './HorizontalScrollBar.scss';

export default class HorizontalScrollBar extends Component {

    constructor(props) {

        super(props);

        this.initial();
        this.isMac = Valid.isMac();

        this.isWrapperMouseDown = false;
        this.isScrollBarMouseDown = false;
        this.mouseDownPosition = null;
        this.hiddenTimeout = null;

        this.state = {
            activated: false,
            hidden: this.isMac ? true : false
        };

        this.initial = this::this.initial;
        this.calculateWrapperWidth = this::this.calculateWrapperWidth;
        this.calculateScrollBarWidth = this::this.calculateScrollBarWidth;
        this.calculateLeft = this::this.calculateLeft;
        this.calculateScrollLeft = this::this.calculateScrollLeft;
        this.mouseDownHandle = this::this.mouseDownHandle;
        this.mouseMoveHandle = this::this.mouseMoveHandle;
        this.mouseUpHandle = this::this.mouseUpHandle;
        this.mouseEnterHandle = this::this.mouseEnterHandle;

    }

    initial() {
        this.wrapperWidth = this.calculateWrapperWidth();
        this.scrollBarWidth = this.calculateScrollBarWidth();
        this.scrollBarLeft = this.calculateLeft();
    }

    calculateWrapperWidth() {
        const {editorWidth, editorOptions, gutterWidth} = this.props,
            {scrollBarWidth, horizontalPadding, showLineNumber} = editorOptions;
        return editorWidth - scrollBarWidth - horizontalPadding * 2 - (showLineNumber ? gutterWidth : 0);
    }

    calculateScrollBarWidth() {
        const {editorOptions, contentWidth} = this.props,
            {scrollBarMinLength} = editorOptions;
        return Valid.range(this.wrapperWidth ** 2 / contentWidth, scrollBarMinLength);
    }

    calculateLeft(scrollBarWidth = this.scrollBarWidth) {
        const {scrollLeft, contentWidth} = this.props;
        return (this.wrapperWidth - scrollBarWidth) * scrollLeft / (contentWidth - this.wrapperWidth);
    }

    calculateScrollLeft(left = this.scrollBarLeft, scrollBarWidth = this.scrollBarWidth) {
        const {contentWidth} = this.props;
        return (contentWidth - this.wrapperWidth) * left / (this.wrapperWidth - scrollBarWidth);
    }

    mouseDownHandle(e, isWrapper) {

        e.stopPropagation();
        isWrapper ? this.isWrapperMouseDown = true : this.isScrollBarMouseDown = true;

        this.mouseDownPosition = {
            left: e.clientX,
            top: e.clientY,
            scrollBarLeft: this.scrollBarLeft
        };

        this.setState({
            activated: true
        });

    }

    mouseMoveHandle(e) {

        e.stopPropagation();

        if (!this.isScrollBarMouseDown) {
            return;
        }

        const left = Valid.range(this.mouseDownPosition.scrollBarLeft + e.clientX - this.mouseDownPosition.left,
            0, this.wrapperWidth - this.scrollBarWidth);

        this.props.scrollX(this.calculateScrollLeft(left));

    }

    mouseUpHandle(e) {

        e.stopPropagation();

        const {editorOptions, scrollX, gutterWidth} = this.props,
            {horizontalPadding, showLineNumber} = editorOptions;

        // move scroll bar when wrapper mouse up
        if (this.isWrapperMouseDown
            && this.mouseDownPosition.left === e.clientX && this.mouseDownPosition.top === e.clientY) {

            this.scrollBarLeft = Valid.range(
                e.clientX - this.scrollBarWidth / 2 - horizontalPadding - (showLineNumber ? gutterWidth : 0),
                0, this.wrapperWidth - this.scrollBarWidth
            );

            scrollX(this.calculateScrollLeft());

        }

        this.isWrapperMouseDown = false;
        this.isScrollBarMouseDown = false;
        this.mouseDownPosition = null;

        this.setState({
            activated: false
        });

        this.isMac && (this.hiddenTimeout = setTimeout(() => {
            this.hiddenTimeout = null;
            this.setState({
                hidden: true
            });
        }, 2000));

    }

    mouseEnterHandle() {
        this.hiddenTimeout && clearTimeout(this.hiddenTimeout);
        this.hiddenTimeout = null;
    }

    componentDidMount() {
        Event.addEvent(document, 'mousemove', this.mouseMoveHandle);
        Event.addEvent(document, 'mouseup', this.mouseUpHandle);
    }

    componentWillReceiveProps(nextProps) {

        if (this.isMac && nextProps.scrollLeft !== this.props.scrollLeft) {

            this.hiddenTimeout && clearTimeout(this.hiddenTimeout);

            this.setState({
                hidden: false
            }, () => {
                this.hiddenTimeout = setTimeout(() => {
                    this.hiddenTimeout = null;
                    this.setState({
                        hidden: true
                    });
                }, 2000);
            });

        }

    }

    componentWillUnmount() {

        Event.removeEvent(document, 'mousemove', this.mouseMoveHandle);
        Event.removeEvent(document, 'mouseup', this.mouseUpHandle);

        this.hiddenTimeout && clearTimeout(this.hiddenTimeout);

    }

    render() {

        this.initial();

        const {editorOptions, gutterWidth} = this.props,
            {activated, hidden} = this.state,
            {horizontalPadding, scrollBarWidth, showLineNumber} = editorOptions,
            wrapperStyle = {
                height: scrollBarWidth,
                left: horizontalPadding + (showLineNumber ? gutterWidth : 0)
            },
            scrollBarStyle = {
                width: this.scrollBarWidth,
                transform: `translate3d(${this.scrollBarLeft}px, 0, 0)`
            };

        return (
            <div className={`react-editor-horizontal-scroll-bar-wrapper
            ${activated ? 'activated' : ''} ${hidden ? 'hidden' : ''}`}
                 style={wrapperStyle}
                 onMouseDown={(e) => {
                     this.mouseDownHandle(e, true);
                 }}
                 onMouseEnter={this.mouseEnterHandle}>

                <div className="react-editor-horizontal-scroll-bar"
                     style={scrollBarStyle}
                     onMouseDown={(e) => {
                         this.mouseDownHandle(e, false);
                     }}
                     onMouseEnter={this.mouseEnterHandle}>
                    <div className="react-editor-horizontal-scroll-bar-inner"></div>
                </div>

            </div>
        );

    }
};

HorizontalScrollBar.propTypes = {

    editorWidth: PropTypes.number,
    editorOptions: PropTypes.object,
    scrollLeft: PropTypes.number,
    contentWidth: PropTypes.number,

    scrollX: PropTypes.func

};

HorizontalScrollBar.defaultProps = {
    editorWidth: 500,
    editorOptions: null,
    scrollLeft: 0,
    contentWidth: 0
};