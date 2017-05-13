import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Editor from './components/Editor';

export default class ReactEditor extends Component {

    constructor(props) {

        super(props);

        /**
         * default editor options
         * @type {object}
         */
        this.defaultOptions = {

            /**
             * whether display full screen or not
             * @type {boolean}
             */
            isFullScreen: false,

            /**
             * height of one text line
             * @type {number}
             */
            lineHeight: 20,

            /**
             * before and after text render cache
             * @type {number}
             */
            lineCache: 5,

            /**
             * horizontal Padding of editor (both left and right)
             * @type {number}
             */
            horizontalPadding: 6,

            /**
             * width of scroll bars
             * @type {number}
             */
            scrollBarWidth: 12,

            /**
             * minimum length of scroll bars
             * @type {number}
             */
            scrollBarMinLength: 60,

            /**
             * whether forbidden scroll rebound or not
             * @type {boolean}
             */
            forbiddenScrollRebound: false

        };

    }

    render() {
        return (
            <Editor {...this.props}
                    editorOptions={Object.assign(this.defaultOptions, this.props.options)}/>
        );
    }
};

ReactEditor.propTypes = {

    className: PropTypes.string,
    style: PropTypes.object,

    data: PropTypes.string,

    width: PropTypes.number,
    height: PropTypes.number,

    options: PropTypes.shape({
        isFullScreen: PropTypes.bool,
        width: PropTypes.number,
        height: PropTypes.number,
        lineHeight: PropTypes.number,
        lineCache: PropTypes.number,
        horizontalPadding: PropTypes.number,
        scrollBarWidth: PropTypes.number,
        scrollBarMinLength: PropTypes.number,
        forbiddenScrollRebound: PropTypes.bool
    }),

    onChange: PropTypes.func

};

ReactEditor.defaultProps = {

    className: '',
    style: null,

    data: '',

    width: 500,
    height: 200,

    options: null

};