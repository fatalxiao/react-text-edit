import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Valid from '../../utils/Valid';

import './HorizontalScrollBar.scss';

export default class HorizontalScrollBar extends Component {

    constructor(props) {

        super(props);

        this.calculateScrollBarWidth = this::this.calculateScrollBarWidth;
        this.calculateScrollLeft = this::this.calculateScrollLeft;

    }

    calculateScrollBarWidth() {

        const {editorOptions, contentWidth} = this.props;

        return Valid.range(
            // width of horizontal scroll bar wrapper should minus width of vertical scroll bar wrapper
            (editorOptions.width - editorOptions.scrollBarWidth)
            * (editorOptions.width - editorOptions.scrollBarWidth - editorOptions.horizontalPadding * 2)
            / contentWidth,
            editorOptions.scrollBarMinLength
        );

    }

    calculateScrollLeft(scrollWidth) {

        const {editorOptions, scrollLeft, contentWidth} = this.props;

        return (editorOptions.width - scrollWidth - editorOptions.scrollBarWidth) * scrollLeft
            / (contentWidth -
            (editorOptions.width - editorOptions.scrollBarWidth - editorOptions.horizontalPadding * 2));

    }

    render() {

        const {className, style} = this.props,
            scrollWidth = this.calculateScrollBarWidth(),
            scrollBarStyle = {
                width: scrollWidth,
                transform: `translate3d(${this.calculateScrollLeft(scrollWidth)}px, 0, 0)`
            };

        return (
            <div className={`react-editor-horizontal-scroll-bar-wrapper ${className}`}
                 style={style}>
                <div className="react-editor-horizontal-scroll-bar"
                     style={scrollBarStyle}></div>
            </div>
        );

    }
};

HorizontalScrollBar.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    editorOptions: PropTypes.object,
    scrollLeft: PropTypes.number,
    contentWidth: PropTypes.number

};

HorizontalScrollBar.defaultProps = {

    className: '',
    style: null,

    editorOptions: null,
    scrollLeft: 0,
    contentWidth: 0

};