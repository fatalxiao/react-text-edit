import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TextScroller from '../TextScroller';
import ScrollBars from '../ScrollBars';

import Valid from '../../utils/Valid';
import CharSize from '../../utils/CharSize';

import './Editor.scss';

export default class Editor extends Component {

    constructor(props) {

        super(props);

        this.defaultOptions = {
            width: 500,
            height: 500,
            lineHeight: 20,
            lineCache: 5,
            horizontalPadding: 6,
            scrollBarWidth: 12,
            scrollBarMinLength: 100,
            forbiddenScrollRebound: false
        };

        this.state = {

            editorDataArray: props.data.split('\n'),
            editorOptions: {...this.defaultOptions, ...props.options},

            contentWidth: 0,

            scrollTop: 0,
            scrollLeft: 0

        };

        this.calculateContentWidth = this::this.calculateContentWidth;
        this.dataChangedHandle = this::this.dataChangedHandle;
        this.wheelHandle = this::this.wheelHandle;

    }

    calculateContentWidth() {
        const contentWidth = CharSize.calculateMaxLineWidth(this.state.editorDataArray, this.refs.editor);
        // console.log(contentWidth);
        this.setState({
            contentWidth
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

        const {editorDataArray, editorOptions, scrollTop, scrollLeft, contentWidth} = this.state,
            maxScrollHeight = (editorDataArray.length - 1) * editorOptions.lineHeight;

        let top = scrollTop + e.deltaY,
            left = scrollLeft + e.deltaX;

        if (top < 0 || top > maxScrollHeight) {
            top = Valid.range(top, 0, maxScrollHeight);
            editorOptions.forbiddenScrollRebound && e.preventDefault();
        }

        if (left < 0 || left > contentWidth - editorOptions.width) {
            left = Valid.range(left, 0, contentWidth - editorOptions.width);
            editorOptions.forbiddenScrollRebound && e.preventDefault();
        }

        this.setState({
            scrollTop: top,
            scrollLeft: left
        });

    }

    componentDidMount() {
        // setTimeout(() => {
        this.calculateContentWidth();
        // });
    }

    componentWillReceiveProps(nextProps) {

        let state = {};

        if (nextProps.data !== this.state.data) {
            state.editorDataArray = nextProps.data.split('\n');
        }

        if (!(_.isEqual(nextProps.options, this.props.options))) {
            state.editorOptions = {...this.defaultOptions, ...nextProps.options};
        }

        this.setState(state);

    }

    render() {

        const {className, style} = this.props;
        const {editorOptions} = this.state;

        const editorSize = {
            width: editorOptions.width,
            height: editorOptions.height
        };

        return (
            <div ref="editor"
                 className={`react-editor ${className}`}
                 style={{...editorSize, ...style}}
                 onWheel={this.wheelHandle}>

                <TextScroller {...this.props}
                              {...this.state}
                              onChange={this.dataChangedHandle}/>

                <ScrollBars {...this.props}
                            {...this.state}/>

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
    options: PropTypes.shape({
        width: PropTypes.number,
        height: PropTypes.number,
        lineHeight: PropTypes.number
    }),

    onChange: PropTypes.func

};

Editor.defaultProps = {

    className: '',
    style: null,

    data: '',
    options: null

};