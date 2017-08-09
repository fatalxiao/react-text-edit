import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Calculation from '../../utils/Calculation';
import Valid from '../../utils/Valid';
import Event from '../../utils/Event';

import './VerticalScrollBar.css';

export default class VerticalScrollBar extends Component {

    constructor(props) {

        super(props);

        this.initial();

        this.isWrapperMouseDown = false;
        this.isScrollBarMouseDown = false;
        this.mouseDownPosition = null;

        this.state = {
            activated: false
        };

        this.initial = this::this.initial;
        this.calculateScrollBarHeight = this::this.calculateScrollBarHeight;
        this.calculateTop = this::this.calculateTop;
        this.calculateScrollTop = this::this.calculateScrollTop;
        this.mouseDownHandle = this::this.mouseDownHandle;
        this.mouseMoveHandle = this::this.mouseMoveHandle;
        this.mouseUpHandle = this::this.mouseUpHandle;

    }

    initial() {
        this.wrapperHeight = this.props.editorHeight;
        this.scrollBarHeight = this.calculateScrollBarHeight();
        this.scrollBarTop = this.calculateTop();
    }

    calculateScrollBarHeight() {
        const {editorOptions, contentHeight} = this.props;
        return Valid.range(this.wrapperHeight ** 2 / contentHeight, editorOptions.scrollBarMinLength);
    }

    calculateTop(scrollBarHeight = this.scrollBarHeight) {
        const {scrollTop} = this.props;
        return (this.wrapperHeight - scrollBarHeight) * scrollTop / Calculation.fullScrollTop(this.props);
    }

    calculateScrollTop(top = this.scrollBarTop, scrollBarHeight = this.scrollBarHeight) {
        return Calculation.fullScrollTop(this.props) * top / (this.wrapperHeight - scrollBarHeight);
    }

    mouseDownHandle(e, isWrapper) {

        e.stopPropagation();
        isWrapper ? this.isWrapperMouseDown = true : this.isScrollBarMouseDown = true;

        this.mouseDownPosition = {
            left: e.clientX,
            top: e.clientY,
            scrollBarTop: this.scrollBarTop
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

        this.setState({
            activated: false
        });

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

        this.initial();

        const {activated} = this.state,
            scrollBarStyle = {
                height: this.scrollBarHeight,
                transform: `translate3d(0, ${this.scrollBarTop}px, 0)`
            };

        return (
            <div className={`react-editor-vertical-scroll-bar-wrapper ${activated ? 'activated' : ''}`}
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

    editorDataArray: PropTypes.array,
    editorHeight: PropTypes.number,
    editorOptions: PropTypes.object,
    scrollTop: PropTypes.number,
    contentHeight: PropTypes.number,

    scrollY: PropTypes.func

};

VerticalScrollBar.defaultProps = {
    editorDataArray: [],
    editorHeight: 200,
    editorOptions: null,
    scrollTop: 0
};