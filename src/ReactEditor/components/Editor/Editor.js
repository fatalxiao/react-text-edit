import React, {Component} from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import TextScroller from '../TextScroller/index';

import './Editor.scss';

export default class Editor extends Component {

    constructor(props) {

        super(props);

        this.defaultOptions = {
            lineHeight: 20
        };

        this.state = {
            dataArray: props.data.split('\n'),
            options: {...this.defaultOptions, ...props.options}
        };

        this.dataChangedHandle = this::this.dataChangedHandle;

    }

    componentWillReceiveProps(nextProps) {

        let state = {};

        if (nextProps.data !== this.state.data) {
            state.dataArray = nextProps.data.split('\n');
        }

        if (!(_.isEqual(nextProps.options, this.state.options))) {
            state.options = {...this.defaultOptions, ...nextProps.options};
        }

        this.setState(state);

    }

    dataChangedHandle(dataArray) {

        const {onChange} = this.props;

        this.setState({
            dataArray
        }, () => {
            onChange && onChange(dataArray.join('\n'));
        });

    }

    render() {

        const {className, style, width, height} = this.props;

        const editorSize = {
            width,
            height
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
    width: PropTypes.number,
    height: PropTypes.number,
    options: PropTypes.shape({
        lineHeight: PropTypes.number
    }),

    onChange: PropTypes.func

};

Editor.defaultProps = {

    className: '',
    style: null,

    data: '',
    width: 500,
    height: 500,
    options: null

};