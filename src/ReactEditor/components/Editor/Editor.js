import React, {Component} from 'react';
import PropTypes from 'prop-types';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
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

        this._nextStateAnimationFrameId = null;
        this.isMouseDown = false;
        this.defaultOptions = {
            isFullScreen: false,
            lineHeight: 20,
            lineCache: 5,
            horizontalPadding: 6,
            scrollBarWidth: 12,
            scrollBarMinLength: 60,
            forbiddenScrollRebound: false
        };

        let editorDataArray = props.data.split('\n'),
            editorOptions = {...this.defaultOptions, ...props.options};

        let editorWidth = props.width,
            editorHeight = props.height;
        if (editorOptions.isFullScreen) {
            editorWidth = window.innerWidth;
            editorHeight = window.innerHeight;
        }

        this.state = {

            editorInital: false,

            editorEl: null,

            isEditorFocused: true,

            editorDataArray,
            editorOptions,

            editorWidth,
            editorHeight,

            contentWidth: 0,
            contentHeight: this.calculateContentHeight(editorDataArray, editorOptions.lineHeight),

            scrollTop: 0,
            scrollLeft: 0,

            selectStartX: editorOptions.horizontalPadding,
            selectStartY: 0,
            selectStopX: undefined,
            selectStopY: undefined

        };

        this._setNextState = this::this._setNextState;
        this.calculateContentWidth = this::this.calculateContentWidth;
        this.calculateContentHeight = this::this.calculateContentHeight;
        this.scrollX = this::this.scrollX;
        this.scrollY = this::this.scrollY;
        this.onChange = this::this.onChange;
        this.wheelHandle = this::this.wheelHandle;
        this.resizeHandle = this::this.resizeHandle;
        this.mouseDownHandle = this::this.mouseDownHandle;
        this.mouseMoveHandle = this::this.mouseMoveHandle;
        this.mouseUpHandle = this::this.mouseUpHandle;

    }

    _setNextState(state) {
        if (this._nextStateAnimationFrameId) {
            cancelAnimationFrame(this._nextStateAnimationFrameId);
        }
        this._nextStateAnimationFrameId = requestAnimationFrame(() => {
            this._nextStateAnimationFrameId = null;
            this.setState(state);
        });
    }

    calculateContentWidth(editorDataArray = this.state.editorDataArray) {
        return Math.ceil(CharSize.calculateMaxLineWidth(editorDataArray, this.refs.editor));
    }

    calculateContentHeight(editorDataArray = this.state.editorDataArray,
                           lineHeight = this.state.editorOptions.lineHeight) {
        return editorDataArray.length * lineHeight;
    }

    scrollX(scrollLeft) {
        this.setState({
            scrollLeft
        });
    }

    scrollY(scrollTop) {
        this.setState({
            scrollTop
        });
    }

    onChange(editorDataArray) {

        const {onChange} = this.props;

        this.setState({
            editorDataArray,
            contentWidth: this.calculateContentWidth(editorDataArray),
            contentHeight: this.calculateContentHeight(editorDataArray)
        }, () => {
            onChange && onChange(editorDataArray.join('\n'));
        });

    }

    wheelHandle(e) {

        const {editorDataArray, editorWidth, editorOptions, scrollTop, scrollLeft, contentWidth} = this.state,
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

        // this._setNextState({
        this.setState({
            scrollTop: top,
            scrollLeft: left
        });

    }

    resizeHandle() {
        this._setNextState({
            editorWidth: window.innerWidth,
            editorHeight: window.innerHeight
        });
    }

    mouseDownHandle(e) {

        if (!Event.isTriggerOnEl(e, this.refs.editor)) {
            this.setState({
                isEditorFocused: false
            });
            return;
        }

        this.isMouseDown = true;

        const {scrollLeft, scrollTop} = this.state,
            editorOffset = DomLib.getOffset(this.refs.editor);

        this.setState({
            isEditorFocused: true,
            selectStartX: e.clientX - editorOffset.left + scrollLeft,
            selectStartY: e.clientY - editorOffset.top + scrollTop,
            selectStopX: undefined,
            selectStopY: undefined
        });

    }

    mouseMoveHandle(e) {

        if (!this.isMouseDown) {
            return;
        }

        const {scrollLeft, scrollTop} = this.state,
            editorOffset = DomLib.getOffset(this.refs.editor);

        this.setState({
            isEditorFocused: true,
            selectStopX: e.clientX - editorOffset.left + scrollLeft,
            selectStopY: e.clientY - editorOffset.top + scrollTop
        });

    }

    mouseUpHandle() {
        this.isMouseDown = false;
    }

    editorFocusHandle() {
        this.setState({
            isEditorFocused: false
        });
    }

    editorBlurHandle() {
        this.setState({
            isEditorFocused: false
        });
    }

    componentDidMount() {

        this.setState({
            editorEl: this.refs.editor
        });

        Event.addEvent(document, 'dragstart', Event.preventEvent);
        Event.addEvent(document, 'mousedown', this.mouseDownHandle);
        Event.addEvent(document, 'mousemove', this.mouseMoveHandle);
        Event.addEvent(document, 'mouseup', this.mouseUpHandle);
        this.state.editorOptions.isFullScreen && Event.addEvent(window, 'resize', this.resizeHandle);

        setTimeout(() => {
            this._setNextState({
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

        if (!(_.isEqual(nextProps.options, this.props.options))) {
            state.editorOptions = {...this.defaultOptions, ...nextProps.options};
        }

        const editorOptions = state.editorOptions || this.state.editorOptions;

        if (!editorOptions.isFullScreen && nextProps.width !== this.state.editorWidth) {
            state.editorWidth = nextProps.width;
        }

        if (!editorOptions.isFullScreen && nextProps.height !== this.state.editorHeight) {
            state.editorHeight = nextProps.height;
        }

        if (state.editorDataArray) {
            state.contentWidth = this.calculateContentWidth(state.editorDataArray);
            console.log(state.contentWidth);
        }

        if (state.editorDataArray || state.editorOptions) {
            state.contentHeight = this.calculateContentHeight(state.editorDataArray, editorOptions.lineHeight);
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
        this.state.editorOptions.isFullScreen && Event.removeEvent(window, 'resize', this.resizeHandle);
    }

    render() {

        const {className, style} = this.props;
        const {editorInital, editorWidth, editorHeight, editorOptions} = this.state;

        const editorSize = {
            width: editorWidth,
            height: editorHeight
        };

        return (
            <div ref="editor"
                 className={`react-editor ${editorOptions.isFullScreen ? 'react-editor-full-screen' : ''} ${className}`}
                 style={{...editorSize, ...style}}
                 onWheel={this.wheelHandle}>

                <TextScroller {...this.props}
                              {...this.state}
                              {...this}/>

                <ScrollBars {...this.props}
                            {...this.state}
                            {...this}/>

                <CSSTransitionGroup transitionName="react-editor-loading"
                                    transitionEnterTimeout={0}
                                    transitionLeaveTimeout={250}>
                    {
                        editorInital ?
                            null
                            :
                            <EditorLoading/>
                    }
                </CSSTransitionGroup>

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

    width: PropTypes.number,
    height: PropTypes.number,

    options: PropTypes.shape({
        isFullScreen: PropTypes.bool,
        width: PropTypes.number,
        height: PropTypes.number,
        lineHeight: PropTypes.number,
        lineCache: PropTypes.number,
        horizontalPadding: PropTypes.number,
        scrollBarWidth: PropTypes.number,
        scrollBarMinLength: PropTypes.number,
        forbiddenScrollRebound: PropTypes.bool
    }),

    onChange: PropTypes.func

};

Editor.defaultProps = {

    className: '',
    style: null,

    data: '',

    width: 500,
    height: 200,

    options: null

};