import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TextScroller from '../TextScroller';
import ScrollBars from '../ScrollBars';

import Valid from '../../utils/Valid';
import CharSize from '../../utils/CharSize';
import Event from '../../utils/Event';

import './Editor.scss';

export default class Editor extends Component {

    constructor(props) {

        super(props);

        this._nextStateAnimationFrameId = null;

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

            editorEl: null,

            editorDataArray,
            editorOptions,

            editorWidth,
            editorHeight,

            contentWidth: 0,
            contentHeight: this.calculateContentHeight(editorDataArray, editorOptions.lineHeight),

            scrollTop: 0,
            scrollLeft: 0,

            selectStartX: undefined,
            selectStartY: undefined

        };

        this._setNextState = this::this._setNextState;
        this.calculateContentWidth = this::this.calculateContentWidth;
        this.calculateContentHeight = this::this.calculateContentHeight;
        this.scrollX = this::this.scrollX;
        this.scrollY = this::this.scrollY;
        this.dataChangedHandle = this::this.dataChangedHandle;
        this.wheelHandle = this::this.wheelHandle;
        this.resizeHandle = this::this.resizeHandle;
        this.mouseDownHandle = this::this.mouseDownHandle;

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

    dataChangedHandle(editorDataArray) {

        const {onChange} = this.props;

        this.setState({
            editorDataArray,
            contentWidth: CharSize.calculateMaxLineWidth(editorDataArray)
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
        this.setState({
            selectStartX: e.clientX + this.state.scrollLeft,
            selectStartY: e.clientY + this.state.scrollTop
        });
    }

    componentDidMount() {

        this.setState({
            editorEl: this.refs.editor
        });

        Event.addEvent(document, 'dragstart', Event.preventEvent);

        this.state.editorOptions.isFullScreen && Event.addEvent(window, 'resize', this.resizeHandle);

        setTimeout(() => {
            this.setState({
                contentWidth: this.calculateContentWidth()
            });
        }, 0);

    }

    componentWillReceiveProps(nextProps) {

        let state = {};

        if (nextProps.data !== this.state.data) {
            state.editorDataArray = nextProps.data.split('\n');
        }

        if (nextProps.width !== this.state.editorWidth) {
            state.editorWidth = nextProps.width;
        }

        if (nextProps.height !== this.state.editorHeight) {
            state.editorHeight = nextProps.height;
        }

        if (!(_.isEqual(nextProps.options, this.props.options))) {
            state.editorOptions = {...this.defaultOptions, ...nextProps.options};
        }

        if (!(_.isEmpty(state))) {
            state.contentHeight = this.calculateContentHeight(state.editorDataArray, state.editorOptions.lineHeight);
            this.setState(state);
        }

    }

    componentWillUnmount() {
        Event.removeEvent(document, 'dragstart', Event.preventEvent);
        this.state.editorOptions.isFullScreen && Event.removeEvent(window, 'resize', this.resizeHandle);
    }

    render() {

        const {className, style} = this.props;
        const {editorWidth, editorHeight, editorOptions} = this.state;

        const editorSize = {
            width: editorWidth,
            height: editorHeight
        };

        return (
            <div ref="editor"
                 className={`react-editor ${editorOptions.isFullScreen ? 'react-editor-full-screen' : ''} ${className}`}
                 style={{...editorSize, ...style}}
                 onWheel={this.wheelHandle}
                 onMouseDown={this.mouseDownHandle}>

                <TextScroller {...this.props}
                              {...this.state}
                              onChange={this.dataChangedHandle}/>

                <ScrollBars {...this.props}
                            {...this.state}
                            {...this}/>

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