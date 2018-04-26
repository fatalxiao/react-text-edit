import React, {Component} from 'react';
import PropTypes from 'prop-types';

import './EditorCursor.scss';

class EditorCursor extends Component {

    constructor(props) {

        super(props);

        this.delayAnimation = null;

        this.calculateCursorPosition = ::this.calculateCursorPosition;
        this.delayAnimate = ::this.delayAnimate;

    }

    calculateCursorPosition() {

        const {cursorPosition} = this.props;
        let left, top;

        if (cursorPosition) {
            ({left, top} = cursorPosition);
        } else {
            left = 0;
            top = 0;
        }

        return {left, top};

    }

    delayAnimate() {

        if (this.delayAnimation) {
            clearTimeout(this.delayAnimation);
            this.refs.cursor.style.animation = 'none';
        }

        this.delayAnimation = setTimeout(() => {
            this.refs.cursor.style.animation = 'blink 1s ease-in-out infinite';
        }, 250);

    }

    componentDidMount() {
        this.delayAnimate();
    }

    componentDidUpdate() {
        this.delayAnimate();
    }

    componentWillUnmount() {
        this.delayAnimation && clearTimeout(this.delayAnimation);
    }

    render() {

        const {left, top} = this.calculateCursorPosition(),
            cursorStyle = {
                transform: `translate3d(${left}px, ${top}px, 0)`
            };

        return (
            <div className="react-editor-cursor-wrapper">

                <div ref="cursor"
                     className="react-editor-cursor"
                     style={cursorStyle}></div>

            </div>
        );

    }
};

EditorCursor.propTypes = {
    cursorPosition: PropTypes.object
};

export default EditorCursor;