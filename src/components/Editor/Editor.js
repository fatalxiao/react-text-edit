import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import EditorLoading from '../EditorLoading';
import TextScroller from '../TextScroller';
import ScrollBars from '../ScrollBars';

import Valid from '../../utils/Valid';
import CharSize from '../../utils/CharSize';
import Event from '../../utils/Event';
import DomLib from '../../utils/DomLib';

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
            isEditorFocused: true,

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
            selectStopX: props.editorOptions.horizontalPadding,

            /**
             * select stop vertical offset
             * @type {number}
             */
            selectStopY: 0

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
        this.setState({
            scrollLeft
        });
    }

    /**
     * set text content scroll vertical offset
     * @param scrollLeft
     */
    scrollY(scrollTop) {
        this.setState({
            scrollTop
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
            selectStopY: cursorPosition.top
        }, () => {
            this.props.onChange && this.props.onChange(editorDataArray.join('\n'));
        });

    }

    /**
     * handle wheel event, reset text content offset
     * @param e
     */
    wheelHandle(e) {

        const {editorOptions} = this.props,
            {editorDataArray, editorWidth, scrollTop, scrollLeft, contentWidth} = this.state,
            maxScrollLeft = contentWidth
                - (editorWidth - editorOptions.horizontalPadding * 2 - editorOptions.scrollBarWidth),
            maxScrollTop = (editorDataArray.length - 1) * editorOptions.lineHeight;

        let top = scrollTop + e.deltaY,
            left = scrollLeft + e.deltaX;

        if (top < 0 || top > maxScrollTop) {
            top = Valid.range(top, 0, maxScrollTop);
            editorOptions.forbiddenScrollRebound && e.preventDefault();
        }

        if (left < 0 || left > maxScrollLeft) {
            left = Valid.range(left, 0, maxScrollLeft);
            editorOptions.forbiddenScrollRebound && e.preventDefault();
        }

        // this.setNextState({
        this.setState({
            scrollTop: top,
            scrollLeft: left
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

        e.stopPropagation();

        this.isMouseDown = true;

        const {scrollLeft, scrollTop} = this.state,
            editorOffset = DomLib.getOffset(this.refs.editor);

        this.setState({
            isEditorFocused: true,
            selectStartX: undefined,
            selectStartY: undefined,
            selectStopX: e.clientX - editorOffset.left + scrollLeft,
            selectStopY: e.clientY - editorOffset.top + scrollTop
        });

    }

    /**
     * handle global mouse down event, reset focus false if trigger target is not this editor
     * @param e
     */
    mouseDownHandle(e) {

        if (!Event.isTriggerOnEl(e, this.refs.editor)) {
            this.setState({
                isEditorFocused: false
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

        if (nextProps.data !== this.state.editorDataArray.join('\n')) {
            state.editorDataArray = nextProps.data.split('\n');
        }

        if (!nextProps.isFullScreen && nextProps.width !== this.state.editorWidth) {
            state.editorWidth = nextProps.width;
        }

        if (!nextProps.isFullScreen && nextProps.height !== this.state.editorHeight) {
            state.editorHeight = nextProps.height;
        }

        if (state.editorDataArray) {
            state.contentWidth = this.calculateContentWidth(state.editorDataArray);
            console.log(state.contentWidth);
        }

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

                <TextScroller {...this.props}
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

    editorOptions: PropTypes.object,

    onChange: PropTypes.func

};

Editor.defaultProps = {

    className: '',
    style: null,

    data: '',

    isFullScreen: false,
    width: 500,
    height: 200,

    editorOptions: null

};