import React, {Component} from 'react';
import PropTypes from 'prop-types';

import VerticalScrollBar from '../VerticalScrollBar';
import HorizontalScrollBar from '../HorizontalScrollBar';

import './ScrollBars.scss';

export default class ScrollBars extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {className, style, editorWidth, editorHeight, contentWidth, contentHeight} = this.props;

        return (
            <div ref="scrollBars"
                 className={`react-editor-scroll-bars ${className}`}
                 style={style}>

                {
                    contentHeight > editorHeight ?
                        <VerticalScrollBar {...this.props}/>
                        :
                        null
                }

                {
                    contentWidth > editorWidth ?
                        <HorizontalScrollBar {...this.props}/>
                        :
                        null
                }

            </div>
        );

    }
};

ScrollBars.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    editorWidth: PropTypes.number,
    editorHeight: PropTypes.number,
    scrollTop: PropTypes.number,
    scrollLeft: PropTypes.number,
    contentWidth: PropTypes.number,
    contentHeight: PropTypes.number

};

ScrollBars.defaultProps = {

    className: '',
    style: null,

    editorWidth: 500,
    editorHeight: 200,
    scrollTop: 0,
    scrollLeft: 0,
    contentWidth: 0,
    contentHeight: 0

};