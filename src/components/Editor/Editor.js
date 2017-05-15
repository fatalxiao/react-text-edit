import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import _ from 'lodash';

import EditorLoading from '../EditorLoading';
import TextScroller from '../TextScroller';
import ScrollBars from '../ScrollBars';

import Valid from '../../utils/Valid';
import CharSize from '../../utils/CharSize';
import Event from '../../utils/Event';
import DomLib from '../../utils/DomLib';
import Calculation from '../../utils/Calculation';

import './Editor.scss';

export default class Editor extends Component {

    constructor(props) {

        super(props);

        /**
         * for resize event
         * @type {null}
         */
        this.nextStateAnimationFrameId = null;

        /**
         * mouse down flag
         * @type {boolean}
         */
        this.isMouseDown = false;

        this.lastMouseDownTimeStamp = null;

        let editorDataArray = props.data.split('\n');

        let editorWidth = props.width,
            editorHeight = props.height;
        if (props.isFullScreen) {
            editorWidth = window.innerWidth;
            editorHeight = window.innerHeight;
        }

        this.state = {

            /**
             * editor inital flag
             * @type {boolean}
             */
            editorInital: false,

            /**
             * editor element
             * @type {object}
             */
            editorEl: null,

            /**
             * whether this editor is focused
             * @type {boolean}
             */
            isEditorFocused: false,

            /**
             * editor data
             * @type {array}
             */
            editorDataArray,

            /**
             * editor width from invoker (or '100%' if isFullScreen is true)
             * @type {number}
             */
            editorWidth,

            /**
             * editor height from invoker (or '100%' if isFullScreen is true)
             * @type {number}
             */
            editorHeight,

            /**
             * editor text content width
             * @type {number}
             */
            contentWidth: 0,

            /**
             * editor text content height
             * @type {number}
             */
            contentHeight: this.calculateContentHeight(editorDataArray, props.editorOptions.lineHeight),

            /**
             * editor text content scroll horizontal offset
             * @type {number}
             */
            scrollLeft: 0,

            /**
             * editor text content scroll vertical offset
             * @type {number}
             */
            scrollTop: 0,

            /**
             * select start horizontal offset
             * @type {number}
             */
            selectStartX: undefined,

            /**
             * select start vertical offset
             * @type {number}
             */
            selectStartY: undefined,

            /**
             * select stop horizontal offset
             * @type {number}
             */
            selectStopX: 0,

            /**
             * select stop vertical offset
             * @type {number}
             */
            selectStopY: 0,

            isDoubleClick: false,

            isTripleClick: false

        };

        this.setNextState = this::this.setNextState;
        this.calculateContentWidth = this::this.calculateContentWidth;
        this.calculateContentHeight = this::this.calculateContentHeight;
        this.scrollX = this::this.scrollX;
        this.scrollY = this::this.scrollY;
        this.onChange = this::this.onChange;
        this.wheelHandle = this::this.wheelHandle;
        this.resizeHandle = this::this.resizeHandle;
        this.editorMouseDownHandle = this::this.editorMouseDownHandle;
        this.mouseDownHandle = this::this.mouseDownHandle;
        this.mouseMoveHandle = this::this.mouseMoveHandle;
        this.mouseUpHandle = this::this.mouseUpHandle;

    }

    /**
     * resize event for optimization
     * @param state
     */
    setNextState(state) {
        if (this.nextStateAnimationFrameId) {
            cancelAnimationFrame(this.nextStateAnimationFrameId);
        }
        this.nextStateAnimationFrameId = requestAnimationFrame(() => {
            this.nextStateAnimationFrameId = null;
            this.setState(state);
        });
    }

    /**
     * calculate max line width as text content width,
     * @param editorDataArray
     * @returns {number}
     */
    calculateContentWidth(editorDataArray = this.state.editorDataArray) {
        return Math.ceil(CharSize.calculateMaxLineWidth(editorDataArray, this.refs.editor));
    }

    /**
     * calculate lines height as text content height
     * @param editorDataArray
     * @param lineHeight
     * @returns {number}
     */
    calculateContentHeight(editorDataArray = this.state.editorDataArray,
                           lineHeight = this.props.editorOptions.lineHeight) {
        return editorDataArray.length * lineHeight;
    }

    /**
     * set text content scroll horizontal offset
     * @param scrollLeft
     */
    scrollX(scrollLeft) {

        const {onScroll} = this.props;
        const {scrollTop} = this.state;

        this.setState({
            scrollLeft
        }, () => {
            onScroll && onScroll({
                left: scrollLeft,
                top: scrollTop,
                leftPerCent: Calculation.calculateScrollLeftPerCent(scrollLeft, {...this.props, ...this.state}),
                topPerCent: Calculation.calculateScrollTopPerCent(scrollTop, {...this.props, ...this.state})
            });
        });

    }

    /**
     * set text content scroll vertical offset
     * @param scrollLeft
     */
    scrollY(scrollTop) {

        const {onScroll} = this.props;
        const {scrollLeft} = this.state;

        this.setState({
            scrollTop
        }, () => {
            onScroll && onScroll({
                left: scrollLeft,
                top: scrollTop,
                leftPerCent: Calculation.calculateScrollLeftPerCent(scrollLeft, {...this.props, ...this.state}),
                topPerCent: Calculation.calculateScrollTopPerCent(scrollTop, {...this.props, ...this.state})
            });
        });

    }

    /**
     * handle text change event, reset new text data and cursor position
     * @param editorDataArray
     * @param cursorPosition
     */
    onChange(editorDataArray, cursorPosition) {
        this.setState({
            editorDataArray,
            contentWidth: this.calculateContentWidth(editorDataArray),
            contentHeight: this.calculateContentHeight(editorDataArray),
            selectStartX: undefined,
            selectStartY: undefined,
            selectStopX: cursorPosition.left,
            selectStopY: cursorPosition.top,
            isDoubleClick: false,
            isTripleClick: false
        }, () => {
            this.props.onChange && this.props.onChange(editorDataArray.join('\n'));
        });
    }

    /**
     * handle wheel event, reset text content offset
     * @param e
     */
    wheelHandle(e) {

        const {editorOptions, onScroll} = this.props,
            {editorDataArray, editorWidth, scrollTop, scrollLeft, contentWidth} = this.state,
            maxScrollLeft = contentWidth
                - (editorWidth - editorOptions.horizontalPadding * 2 - editorOptions.scrollBarWidth),
            maxScrollTop = (editorDataArray.length - 1) * editorOptions.lineHeight;

        let top = scrollTop + e.deltaY,
            left = scrollLeft + e.deltaX;

        if (top < 0 || top > maxScrollTop) {
            top = Valid.range(top, 0, maxScrollTop);
        }

        if (left < 0 || left > maxScrollLeft) {
            left = Valid.range(left, 0, maxScrollLeft);
        }

        this.setState({
            scrollTop: top,
            scrollLeft: left
        }, () => {
            onScroll && onScroll({
                left,
                top,
                leftPerCent: Calculation.calculateScrollLeftPerCent(left, {...this.props, ...this.state}),
                topPerCent: Calculation.calculateScrollTopPerCent(top, {...this.props, ...this.state})
            });
        });

    }

    /**
     * handle editor resize, reset editor size
     */
    resizeHandle() {
        this.setNextState({
            editorWidth: window.innerWidth,
            editorHeight: window.innerHeight
        });
    }

    /**
     * handle editor mouse down event, reset focus flag and text selection
     * @param e
     */
    editorMouseDownHandle(e) {

        this.isMouseDown = true;

        const {editorOptions} = this.props,
            {scrollLeft, scrollTop, isDoubleClick, isTripleClick} = this.state,
            editorOffset = DomLib.getOffset(this.refs.editor);

        let state = {
            isEditorFocused: true,
            selectStartX: undefined,
            selectStartY: undefined,
            selectStopX: e.clientX - editorOffset.left + scrollLeft,
            selectStopY: e.clientY - editorOffset.top + scrollTop
        };

        if (!isTripleClick && isDoubleClick && this.lastMouseDownTimeStamp
            && e.timeStamp - this.lastMouseDownTimeStamp < editorOptions.continuousClickInterval) { // triple-click
            state.isDoubleClick = false;
            state.isTripleClick = true;
        } else if (!isTripleClick && !isDoubleClick && this.lastMouseDownTimeStamp
            && e.timeStamp - this.lastMouseDownTimeStamp < editorOptions.continuousClickInterval) { // double-click
            state.isDoubleClick = true;
            state.isTripleClick = false;
        } else {
            state.isDoubleClick = false;
            state.isTripleClick = false;
        }

        this.lastMouseDownTimeStamp = e.timeStamp;
        this.setState(state);

    }

    /**
     * handle global mouse down event, reset focus false if trigger target is not this editor
     * @param e
     */
    mouseDownHandle(e) {

        if (!Event.isTriggerOnEl(e, findDOMNode(this.refs.editorText))) {
            this.setState({
                isEditorFocused: false,
                isDoubleClick: false,
                isTripleClick: false
            });
            return;
        }

        this.editorMouseDownHandle(e);

    }

    /**
     * handle global mouse move event, reset text selection
     * @param e
     */
    mouseMoveHandle(e) {

        if (!this.isMouseDown) {
            return;
        }

        const {scrollLeft, scrollTop} = this.state,
            editorOffset = DomLib.getOffset(this.refs.editor);

        let state = {
            isEditorFocused: true,
            selectStopX: e.clientX - editorOffset.left + scrollLeft,
            selectStopY: e.clientY - editorOffset.top + scrollTop
        };

        if (!this.state.selectStartX) {
            state.selectStartX = this.state.selectStopX;
        }

        if (!this.state.selectStartY) {
            state.selectStartY = this.state.selectStopY;
        }

        this.setState(state);

    }

    /**
     * handle global mouse up event, reset editor mouse down flag false
     */
    mouseUpHandle() {
        this.isMouseDown = false;
    }

    componentDidMount() {

        // set editorEl in state for children components
        this.setState({
            editorEl: this.refs.editor
        });

        // add global events
        Event.addEvent(document, 'dragstart', Event.preventEvent);
        Event.addEvent(document, 'mousedown', this.mouseDownHandle);
        Event.addEvent(document, 'mousemove', this.mouseMoveHandle);
        Event.addEvent(document, 'mouseup', this.mouseUpHandle);
        this.props.isFullScreen && Event.addEvent(window, 'resize', this.resizeHandle);

        // asyn calculate content width and start editor
        setTimeout(() => {
            this.setNextState({
                contentWidth: this.calculateContentWidth(),
                editorInital: true
            });
        }, 0);

    }

    componentWillReceiveProps(nextProps) {

        let state = {};

        // update data array
        if (nextProps.data !== this.state.editorDataArray.join('\n')) {
            state.editorDataArray = nextProps.data.split('\n');
        }

        // update width
        if (!nextProps.isFullScreen && nextProps.width !== this.state.editorWidth) {
            state.editorWidth = nextProps.width;
        }

        // update height
        if (!nextProps.isFullScreen && nextProps.height !== this.state.editorHeight) {
            state.editorHeight = nextProps.height;
        }

        // update text content scroll left
        if (nextProps.scrollLeft !== this.props.scrollLeft) {
            state.scrollLeft = nextProps.scrollLeft;
        }
        if (nextProps.scrollLeftPerCent !== this.props.scrollLeftPerCent) {
            state.scrollLeft =
                Calculation.calculateFullScrollLeft({...nextProps, ...this.state}) * nextProps.scrollLeftPerCent;
        }

        // update text content scroll top
        if (nextProps.scrollTop !== this.props.scrollTop) {
            state.scrollTop = nextProps.scrollTop;
        }
        if (nextProps.scrollTopPerCent !== this.props.scrollTopPerCent) {
            state.scrollTop =
                Calculation.calculateFullScrollTop({...nextProps, ...this.state}) * nextProps.scrollTopPerCent;
        }

        // update text content width
        if (state.editorDataArray) {
            state.contentWidth = this.calculateContentWidth(state.editorDataArray);
        }

        // update text content height
        if (state.editorDataArray || nextProps.editorOptions) {
            state.contentHeight = this.calculateContentHeight(
                state.editorDataArray, nextProps.editorOptions.lineHeight
            );
        }

        if (!(_.isEmpty(state))) {
            this.setState(state);
        }

    }

    componentWillUnmount() {
        Event.removeEvent(document, 'dragstart', Event.preventEvent);
        Event.removeEvent(document, 'mousedown', this.mouseDownHandle);
        Event.removeEvent(document, 'mousemove', this.mouseMoveHandle);
        Event.removeEvent(document, 'mouseup', this.mouseUpHandle);
        this.props.isFullScreen && Event.removeEvent(window, 'resize', this.resizeHandle);
    }

    render() {

        const {className, style, isFullScreen} = this.props;
        const {editorWidth, editorHeight} = this.state;

        const editorSize = {
            width: editorWidth,
            height: editorHeight
        };

        return (
            <div ref="editor"
                 className={`react-editor ${isFullScreen ? 'react-editor-full-screen' : ''} ${className}`}
                 style={{...editorSize, ...style}}
                 onWheel={this.wheelHandle}>

                <TextScroller ref="editorText"
                              {...this.props}
                              {...this.state}
                              {...this}/>

                <ScrollBars {...this.props}
                            {...this.state}
                            {...this}/>

                <EditorLoading {...this.state}/>

                <div className="react-editor-test-char-count"></div>

                <div className="react-editor-test-container"></div>

            </div>
        );

    }
};

Editor.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    data: PropTypes.string,

    isFullScreen: PropTypes.bool,
    width: PropTypes.number,
    height: PropTypes.number,

    scrollLeft: PropTypes.number,
    scrollTop: PropTypes.number,

    scrollLeftPerCent: PropTypes.number,
    scrollTopPerCent: PropTypes.number,

    editorOptions: PropTypes.object,

    onChange: PropTypes.func,
    onScroll: PropTypes.func

};

Editor.defaultProps = {

    className: '',
    style: null,

    data: '',

    isFullScreen: false,
    width: 500,
    height: 200,

    scrollLeft: 0,
    scrollTop: 0,

    scrollLeftPerCent: 0,
    scrollTopPerCent: 0,

    editorOptions: null

};