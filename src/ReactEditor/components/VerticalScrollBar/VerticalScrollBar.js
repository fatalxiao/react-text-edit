import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Valid from '../../utils/Valid';

import './VerticalScrollBar.scss';

export default class VerticalScrollBar extends Component {

    constructor(props) {

        super(props);

        this.calculateScrollBarHeight = this::this.calculateScrollBarHeight;
        this.calculateScrollTop = this::this.calculateScrollTop;

    }

    calculateScrollBarHeight() {

        const {editorDataArray, editorOptions} = this.props;

        return Valid.range(
            editorOptions.height ** 2 / (editorDataArray.length * editorOptions.lineHeight),
            editorOptions.scrollBarMinLength
        );

    }

    calculateScrollTop(scrollHeight) {

        const {editorDataArray, editorOptions, scrollTop} = this.props;

        return (editorOptions.height - scrollHeight) * scrollTop
            / ((editorDataArray.length - 1) * editorOptions.lineHeight);

    }

    render() {

        const {className, style} = this.props,
            scrollHeight = this.calculateScrollBarHeight(),
            scrollBarStyle = {
                height: scrollHeight,
                transform: `translate3d(0, ${this.calculateScrollTop(scrollHeight)}px, 0)`
            };

        return (
            <div className={`react-editor-vertical-scroll-bar-wrapper ${className}`}
                 style={style}>
                <div className="react-editor-vertical-scroll-bar"
                     style={scrollBarStyle}>
                    <div className="react-editor-vertical-scroll-bar-inner"></div>
                </div>
            </div>
        );

    }

};

VerticalScrollBar.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    editorDataArray: PropTypes.array,
    editorOptions: PropTypes.object,
    scrollTop: PropTypes.number

};

VerticalScrollBar.defaultProps = {

    className: '',
    style: null,

    editorDataArray: [],
    editorOptions: null,
    scrollTop: 0

};