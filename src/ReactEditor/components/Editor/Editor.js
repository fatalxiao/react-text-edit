import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TextScroller from '../TextScroller/index';

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

            editorDataArray: props.data.split('\n'),
            editorOptions: {...this.defaultOptions, ...props.options},

            scrollTop: 0,
            scrollLeft: 0


        };

        this.dataChangedHandle = this::this.dataChangedHandle;

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

    dataChangedHandle(editorDataArray) {

        const {onChange} = this.props;

        this.setState({
            editorDataArray
        }, () => {
            onChange && onChange(editorDataArray.join('\n'));
        });

    }

    render() {

        const {className, style} = this.props;
        const {editorOptions} = this.state;

        const editorSize = {
            width: editorOptions.width,
            height: editorOptions.height
        };

        return (
            <div className={`react-editor ${className}`}
                 style={{...editorSize, ...style}}>

                <TextScroller {...this.props}
                              {...this.state}
                              onChange={this.dataChangedHandle}/>

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