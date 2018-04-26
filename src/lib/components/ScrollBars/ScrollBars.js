import React, {Component} from 'react';
import PropTypes from 'prop-types';

import VerticalScrollBar from '../VerticalScrollBar';
import HorizontalScrollBar from '../HorizontalScrollBar';

import './ScrollBars.scss';

class ScrollBars extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        const {editorWidth, editorHeight, contentWidth, contentHeight} = this.props;

        return (
            <div ref="scrollBars"
                 className="react-editor-scroll-bars">

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
    editorWidth: PropTypes.number,
    editorHeight: PropTypes.number,
    scrollTop: PropTypes.number,
    scrollLeft: PropTypes.number,
    contentWidth: PropTypes.number,
    contentHeight: PropTypes.number
};

ScrollBars.defaultProps = {
    editorWidth: 500,
    editorHeight: 200,
    scrollTop: 0,
    scrollLeft: 0,
    contentWidth: 0,
    contentHeight: 0
};

export default ScrollBars;