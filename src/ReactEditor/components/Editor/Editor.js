import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TextScroller from '../TextScroller';
import ScrollBars from '../ScrollBars';

import './Editor.scss';

export default class Editor extends Component {

    constructor(props) {

        super(props);

        this.defaultOptions = {
            width: 500,
            height: 500,
            lineHeight: 20,
            lineCache: 5
        };

        this.state = {

            editorEl: null,

            editorDataArray: props.data.split('\n'),
            editorOptions: {...this.defaultOptions, ...props.options},

            scrollTop: 0,
            scrollLeft: 0


        };

        this.dataChangedHandle = this::this.dataChangedHandle;
        this.wheelHandle = this::this.wheelHandle;
        this.scrollX = this::this.scrollX;
        this.scrollY = this::this.scrollY;

    }

    dataChangedHandle(editorDataArray) {

        const {onChange} = this.props;

        this.setState({
            editorDataArray
        }, () => {
            onChange && onChange(editorDataArray.join('\n'));
        });

    }

    wheelHandle(e) {

        const {editorDataArray, editorOptions} = this.state,
            maxScrollHeight = (editorDataArray.length - 1) * editorOptions.lineHeight;

        let top = this.state.scrollTop + e.deltaY;
        top = top > maxScrollHeight ? maxScrollHeight : top;
        top = top < 0 ? 0 : top;
        this.scrollY(top);

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

    componentDidMount() {
        this.setState({
            editorEl: this.refs.editor
        });
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
                            {...this.state}
                            {...this}/>

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