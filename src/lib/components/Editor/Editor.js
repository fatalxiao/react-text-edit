import React, {Component} from 'react';
import {findDOMNode} from 'react-dom';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import isEmpty from 'lodash/isEmpty';

import TextScroller from '../TextScroller';
import ScrollBars from '../ScrollBars';
import EditorGutter from '../EditorGutter';

import Valid from '../../utils/Valid';
import CharSize from '../../utils/CharSize';
import Event from '../../utils/Event';
import Dom from '../../utils/Dom';
import Calculation from '../../utils/Calculation';

import './Editor.scss';

class Editor extends Component {

    constructor(props) {

        super(props);

        /**
         * for resize event
         * @type {null}
         */
        this.nextStateAnimationFrameId = null;

        /**
         * select start horizontal offset
         * @type {number}
         */
        this.selectStartX = undefined;

        /**
         * select start vertical offset
         * @type {number}
         */
        this.selectStartY = undefined;

        /**
         * select stop horizontal offset
         * @type {number}
         */
        this.selectStopX = 0;

        /**
         * select stop vertical offset
         * @type {number}
         */
        this.selectStopY = 0;

        /**
         * mouse down flag
         * @type {boolean}
         */
        this.isMouseDown = false;

        /**
         * for double click or triple click calculation
         * @type {null}
         */
        this.lastMouseDownTimeStamp = null;

        /**
         * history record
         * @type {Array}
         */
        this.editorHistories = [];

        /**
         * point to current history in editor histories
         * @type {number}
         */
        this.historyPointer = -1;

        /**
         * editor timeout id
         * @type {null}
         */
        this.errorTimeout = null;

        let editorDataArray = props.data ? props.data.split(/\r\n|\n|\r/) : [''];

        let editorWidth = props.width,
            editorHeight = props.height;
        if (props.isFullScreen) {
            editorWidth = window.innerWidth;
            editorHeight = window.innerHeight;
        }

        let highlightedDataArray, language;
        ({highlightedDataArray, language} = Calculation.getHightlightedData(editorDataArray));

        this.state = {

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
             * highlighted data array
             * @type {array of string}
             */
            highlightedDataArray: highlightedDataArray,

            /**
             * code language of data
             * @type {string}
             */
            language: language,

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
             * whether is double click
             * @type {bool}
             */
            isDoubleClick: false,

            /**
             * whether is triple click
             * @type {bool}
             */
            isTripleClick: false,

            /**
             * left gutter width
             * @type {number}
             */
            gutterWidth: 0,

            /**
             * select start position
             *
             * structure:
             *  {
             *      left {number}
             *      top {number}
             *      row {number}
             *      col {number}
             *  }
             *
             * @type {object}
             */
            selectStartPosition: null,

            /**
             * select stop position
             *
             * structure: same as selectStartPosition
             *
             * @type {object}
             */
            selectStopPosition: {
                left: 0,
                top: 0,
                row: 0,
                col: 0
            },

            /**
             * cursor position
             *
             * structure: same as selectStartPosition
             *
             * @type {object}
             */
            cursorPosition: {
                left: 0,
                top: 0,
                row: 0,
                col: 0
            },

            /**
             * text display index range
             *
             * structure:
             *  {
             *      start {number}
             *      stop {number}
             *  }
             *
             * @type {object}
             */
            displayIndex: Calculation.textDisplayIndex({
                editorDataArray,
                scrollTop: 0,
                editorOptions: props.editorOptions,
                editorHeight
            }),

            /**
             * editor input composition text
             * @type {string}
             */
            compositionText: ''

        };

        this.calculateContentWidth = ::this.calculateContentWidth;
        this.calculateContentHeight = ::this.calculateContentHeight;
        this.calculateGutterWidth = ::this.calculateGutterWidth;
        this.scrollX = ::this.scrollX;
        this.scrollY = ::this.scrollY;
        this.showError = ::this.showError;
        this.onCompositionUpdate = ::this.onCompositionUpdate;
        this.onChange = ::this.onChange;
        this.lostFocusHandle = ::this.lostFocusHandle;
        this.wheelHandle = ::this.wheelHandle;
        this.resizeHandle = ::this.resizeHandle;
        this.editorMouseDownHandle = ::this.editorMouseDownHandle;
        this.mouseDownHandle = ::this.mouseDownHandle;
        this.mouseMoveHandle = ::this.mouseMoveHandle;
        this.mouseUpHandle = ::this.mouseUpHandle;
        this.goHistory = ::this.goHistory;
        this.updateHistory = ::this.updateHistory;

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

    calculateGutterWidth(editorDataArray = this.state.editorDataArray,
                         horizontalPadding = this.props.editorOptions.horizontalPadding) {
        return CharSize.calculateStringWidth('' + editorDataArray.length, this.refs.editor) + horizontalPadding * 2 + 2;
    }

    /**
     * set text content scroll horizontal offset
     * @param scrollLeft
     */
    scrollX(scrollLeft) {

        const {editorOptions, onScroll} = this.props;
        const {scrollTop} = this.state;

        this.setState({
            scrollLeft
        }, () => {
            onScroll && onScroll({
                left: scrollLeft,
                top: scrollTop,
                leftPerCent: Calculation.scrollLeftPerCent(scrollLeft, {...this.props, ...this.state}),
                topPerCent: Calculation.scrollTopPerCent(scrollTop, {...this.props, ...this.state}),
                line: Math.ceil(scrollTop / editorOptions.lineHeight)
            });
        });

    }

    /**
     * set text content scroll vertical offset
     * @param scrollLeft
     */
    scrollY(scrollTop) {

        const {editorOptions, onScroll} = this.props,
            {scrollLeft} = this.state;

        const state = {
            scrollTop,
            displayIndex: Calculation.textDisplayIndex({...this.props, ...this.state, scrollTop})
        };

        this.setState(state, () => {
            onScroll && onScroll({
                left: scrollLeft,
                top: scrollTop,
                leftPerCent: Calculation.scrollLeftPerCent(scrollLeft, {...this.props, ...this.state}),
                topPerCent: Calculation.scrollTopPerCent(scrollTop, {...this.props, ...this.state}),
                line: Math.ceil(scrollTop / editorOptions.lineHeight)
            });
        });

    }

    showError() {

        if (this.errorTimeout) {
            clearTimeout(this.errorTimeout);
        }

        const {editorEl} = this.state;

        Dom.addClass(editorEl, 'error');
        this.errorTimeout = setTimeout(() => {
            Dom.removeClass(editorEl, 'error');
        }, 150);

    }

    /**
     * update composition text
     * @param compositionText
     */
    onCompositionUpdate(text, isCompositionEnd) {

        if (isCompositionEnd) {
            this.setState({
                compositionText: text
            });
            return;
        }

        const {editorEl, editorDataArray, selectStopPosition, compositionText} = this.state;

        let newDataArray = editorDataArray.slice(),
            newPosition = Object.assign({}, selectStopPosition),
            line = newDataArray[newPosition.row],
            oldLen = compositionText.length,
            newLen = text.length;

        newDataArray[newPosition.row] = line.slice(0, newPosition.col - oldLen) + text + line.slice(newPosition.col);
        newPosition.col += newLen - oldLen;
        newPosition.left += CharSize.calculateStringWidth(text, editorEl)
            - CharSize.calculateStringWidth(compositionText, editorEl);

        this.setState({
            compositionText: text
        }, () => {
            this.onChange(newDataArray, null, newPosition, newPosition);
        });

    }

    /**
     * handle text change event, reset new text data and cursor position
     * @param editorDataArray
     * @param cursorPosition
     */
    onChange(editorDataArray, newStartPosition, newStopPosition, newCursorPosition) {

        const {editorOptions} = this.props;
        if (editorOptions.showOverflowError && editorOptions.maxLines
            && !isNaN(editorOptions.maxLines) && editorOptions.maxLines > 0
            && editorDataArray.length > editorOptions.maxLines) {
            this.showError();
        }

        const state = {
            editorDataArray,
            contentWidth: this.calculateContentWidth(editorDataArray),
            contentHeight: this.calculateContentHeight(editorDataArray),
            gutterWidth: this.calculateGutterWidth(editorDataArray),
            isDoubleClick: false,
            isTripleClick: false,
            selectStartPosition: newStartPosition,
            selectStopPosition: newStopPosition,
            cursorPosition: newCursorPosition,
            ...Calculation.getHightlightedData(editorDataArray)
        };

        const {scrollLeft, scrollTop} = Calculation.scrollOnChange({...this.props, ...this.state, ...state});
        if (scrollLeft !== this.state.scrollLeft) {
            state.scrollLeft = scrollLeft;
        }
        if (scrollTop !== this.state.scrollTop) {
            state.scrollTop = scrollTop;
        }
        state.displayIndex = Calculation.textDisplayIndex({...this.props, ...this.state, ...state});

        this.setState(state, () => {

            this.props.onChange && this.props.onChange(editorDataArray.join('\n'));

            this.updateHistory();

        });

    }

    /**
     * when text area blur
     */
    lostFocusHandle() {
        this.setState({
            isEditorFocused: false
        });
    }

    /**
     * handle wheel event, reset text content offset
     * @param e
     */
    wheelHandle(e) {

        e.preventDefault();

        const {editorOptions, onScroll} = this.props,
            {scrollTop, scrollLeft} = this.state,
            maxScrollLeft = Calculation.fullScrollLeft({...this.props, ...this.state}),
            maxScrollTop = Calculation.fullScrollTop({...this.props, ...this.state});

        let top = scrollTop + e.deltaY,
            left = scrollLeft + e.deltaX;

        if (top < 0 || top > maxScrollTop) {
            top = Valid.range(top, 0, maxScrollTop);
        }

        if (left < 0 || left > maxScrollLeft) {
            left = Valid.range(left, 0, maxScrollLeft);
        }

        const state = {
            scrollTop: top,
            scrollLeft: left,
            displayIndex: Calculation.textDisplayIndex({...this.props, ...this.state, scrollTop: top})
        };

        this.setState(state, () => {
            onScroll && onScroll({
                left,
                top,
                leftPerCent: Calculation.scrollLeftPerCent(left, {...this.props, ...this.state}),
                topPerCent: Calculation.scrollTopPerCent(top, {...this.props, ...this.state}),
                line: Math.ceil(top / editorOptions.lineHeight)
            });
        });

    }

    /**
     * handle editor resize, reset editor size
     */
    resizeHandle() {
        this.setState({
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
            editorOffset = Dom.getOffset(this.refs.editor);

        if (e.shiftKey) {
            this.selectStartX === undefined && (this.selectStartX = this.selectStopX);
            this.selectStartY === undefined && (this.selectStartY = this.selectStopY);
        } else {
            this.selectStartX = undefined;
            this.selectStartY = undefined;
        }

        this.selectStopX = e.clientX - editorOffset.left + scrollLeft;
        this.selectStopY = e.clientY - editorOffset.top + scrollTop;

        let state = {
            isEditorFocused: true
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

        const {
            selectStartPosition,
            selectStopPosition,
            cursorPosition
        } = Calculation.cursorSelectionPosition(
            this.selectStartX, this.selectStartY, this.selectStopX, this.selectStopY,
            {...this.props, ...this.state, ...state}
        );

        state.selectStartPosition = selectStartPosition;
        state.selectStopPosition = selectStopPosition;
        state.cursorPosition = cursorPosition;

        this.lastMouseDownTimeStamp = e.timeStamp;
        this.setState(state);

    }

    /**
     * handle global mouse down event, reset focus false if trigger target is not this editor
     * @param e
     */
    mouseDownHandle(e) {

        if (!Event.isTriggerOnEl(e, findDOMNode(this.refs.editor))) {

            this.setState({
                isEditorFocused: false,
                isDoubleClick: false,
                isTripleClick: false
            });

            return;

        }

        if (Event.isTriggerOnEl(e, findDOMNode(this.refs.editorText))) {

            // trigger after textarea blur event
            setTimeout(() => {
                this.editorMouseDownHandle(e);
            }, 0);

        }

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
            editorOffset = Dom.getOffset(this.refs.editor);

        this.selectStopX = e.clientX - editorOffset.left + scrollLeft;
        this.selectStopY = e.clientY - editorOffset.top + scrollTop;

        let state = {
            isEditorFocused: true
        };

        if (!this.selectStartX) {
            this.selectStartX = this.selectStopX;
        }

        if (!this.selectStartY) {
            this.selectStartY = this.selectStopY;
        }

        const {
            selectStartPosition,
            selectStopPosition,
            cursorPosition
        } = Calculation.cursorSelectionPosition(
            this.selectStartX, this.selectStartY, this.selectStopX, this.selectStopY,
            {...this.props, ...this.state, ...state}
        );

        state.selectStartPosition = selectStartPosition;
        state.selectStopPosition = selectStopPosition;
        state.cursorPosition = cursorPosition;

        this.setState(state);

    }

    /**
     * handle global mouse up event, reset editor mouse down flag false
     */
    mouseUpHandle() {
        this.isMouseDown = false;
    }

    /**
     * destroy part of history and update
     */
    updateHistory() {

        this.editorHistories.splice(
            this.historyPointer + 1,
            this.editorHistories.length - 1 - this.historyPointer,
            cloneDeep(this.state)
        );

        this.historyPointer++;

    }

    /**
     * go to one of history
     * @param offset
     */
    goHistory(offset) {
        this.historyPointer = Valid.range(this.historyPointer + offset, 0, this.editorHistories.length - 1);
        this.setState(this.editorHistories[this.historyPointer], () => {
            this.props.onChange && this.props.onChange(this.state.editorDataArray.join('\n'));
        });
    }

    componentDidMount() {

        // add global events
        Event.addEvent(document, 'dragstart', Event.preventEvent);
        Event.addEvent(document, 'mousedown', this.mouseDownHandle);
        Event.addEvent(document, 'mousemove', this.mouseMoveHandle);
        Event.addEvent(document, 'mouseup', this.mouseUpHandle);
        this.props.isFullScreen && Event.addEvent(window, 'resize', this.resizeHandle);

        // set editorEl in state for children components
        this.setState({
            editorEl: this.refs.editor,
            contentWidth: this.calculateContentWidth(),
            gutterWidth: this.calculateGutterWidth()
        }, () => {
            this.editorHistories.push(cloneDeep(this.state));
            this.historyPointer = 0;
        });

    }

    componentWillReceiveProps(nextProps) {

        let state = {};

        // update data array
        if (nextProps.data !== this.state.editorDataArray.join('\n')) {
            state.editorDataArray = nextProps.data.split(/\r\n|\n|\r/);
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
                Calculation.fullScrollLeft({...nextProps, ...this.state}) * nextProps.scrollLeftPerCent;
        }

        // update text content scroll top
        if (nextProps.scrollTop !== this.props.scrollTop) {
            state.scrollTop = nextProps.scrollTop;
        }
        if (nextProps.scrollTopPerCent !== this.props.scrollTopPerCent) {
            state.scrollTop =
                Calculation.fullScrollTop({...nextProps, ...this.state}) * nextProps.scrollTopPerCent;
        }

        state.displayIndex = Calculation.textDisplayIndex({...this.props, ...this.state, ...state});

        // update text content width and height
        if (state.editorDataArray) {

            state.contentWidth = this.calculateContentWidth(state.editorDataArray);
            state.contentHeight = this.calculateContentHeight(
                state.editorDataArray, nextProps.editorOptions.lineHeight
            );
            state.gutterWidth = this.calculateGutterWidth(
                state.editorDataArray, nextProps.editorOptions.horizontalPadding
            );

            const hightlightedData = Calculation.getHightlightedData(state.editorDataArray);
            state.highlightedDataArray = hightlightedData.highlightedDataArray;
            state.language = hightlightedData.language;

        }

        if (!isEmpty(state)) {
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

        const {className, style, isFullScreen, theme, editorOptions} = this.props,
            {editorDataArray, editorWidth, editorHeight, language} = this.state,
            {showLineNumber, maxLines} = editorOptions,

            editorClassName = (isFullScreen ? ' react-editor-full-screen' : '') + (language ? ' ' + language : '')
                + (editorDataArray.length > maxLines ? ' line-overflow' : '')
                + (theme ? ` theme-${theme}` : '') + (className ? ' ' + className : ''),

            editorSize = {
                width: editorWidth,
                height: editorHeight
            };

        return (
            <div ref="editor"
                 className={'hljs react-editor' + editorClassName}
                 style={{...editorSize, ...style}}
                 onWheel={this.wheelHandle}>

                <TextScroller ref="editorText"
                              {...this.props}
                              {...this.state}
                              {...this}/>

                {
                    showLineNumber ?
                        <EditorGutter {...this.props}
                                      {...this.state}
                                      {...this}/>
                        :
                        null
                }

                <ScrollBars {...this.props}
                            {...this.state}
                            {...this}/>

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

    isFullScreen: false,
    width: 500,
    height: 200,

    scrollLeft: 0,
    scrollTop: 0,

    scrollLeftPerCent: 0,
    scrollTopPerCent: 0

};

export default Editor;