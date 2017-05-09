import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextScroller from '../TextScroller/index';

import './Editor.scss';

export default class Editor extends Component {

    constructor(props) {

        super(props);

        this.state = {
            data: props.data
        };

        this.dataChangedHandle = this::this.dataChangedHandle;

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data !== this.state.data) {
            this.setState({
                data: nextProps.data
            });
        }
    }

    dataChangedHandle(data) {

        const {onChange} = this.props;

        this.setState({
            data
        }, () => {
            onChange && onChange();
        });

    }

    render() {

        const {className, style, data, width, height, options} = this.props;

        const editorSize = {
            width,
            height
        };

        return (
            <div className={`react-editor ${className}`}
                 style={{...editorSize, ...style}}>

                <TextScroller data={data}
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
    options: PropTypes.object,

    onChange: PropTypes.func

};

Editor.defaultProps = {

    className: '',
    style: null,

    value: '',
    width: 500,
    height: 500,
    options: null

};