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

        const {className, style, editorDataArray, editorOptions, contentWidth} = this.props;

        return (
            <div ref="scrollBars"
                 className={`react-editor-scroll-bars ${className}`}
                 style={style}>

                {
                    editorDataArray.length * editorOptions.lineHeight > editorOptions.height ?
                        <VerticalScrollBar {...this.props}/>
                        :
                        null
                }

                {
                    contentWidth > editorOptions.width ?
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

    editorDataArray: PropTypes.array,
    editorOptions: PropTypes.object,
    scrollTop: PropTypes.number,
    scrollLeft: PropTypes.number,
    contentWidth: PropTypes.number

};

ScrollBars.defaultProps = {

    className: '',
    style: null,

    editorDataArray: [],
    editorOptions: null,
    scrollTop: 0,
    scrollLeft: 0,
    contentWidth: 0

};