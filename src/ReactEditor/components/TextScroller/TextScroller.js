import React, {Component} from 'react';
import PropTypes from 'prop-types';

import TextLayer from '../TextLayer';

import './TextScroller.scss';

export default class TextScroller extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style, dataArray} = this.props;

        return (
            <div className={`react-editor-text-scroller ${className}`}
                 style={style}>

                <TextLayer {...this.props}
                           dataArray={dataArray}/>

            </div>
        );

    }
};

TextScroller.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    dataArray: PropTypes.array,
    options: PropTypes.object,

    onChange: PropTypes.func

};

TextScroller.defaultProps = {

    className: '',
    style: null,

    dataArray: [],
    options: null

};