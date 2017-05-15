import React, {Component} from 'react';
import PropTypes from 'prop-types';
import 'string.prototype.at';

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
             * for detecting double-click or triple-click
             * @type {number}
             */
            continuousClickInterval: 250,

            /**
             * discontinued selection when double-click if meet these chars
             * @type {array of string}
             */
            discontinuousChars: [
                ' ', '"', '\'', '{', '}', '[', ']', ',', '.', '|', '\\',
                '#', '!', '@', '%', '^', '&', '*', '(', ')', '+', '=',
                '/', '?', '<', '>', ';', ':', '~', '`', '-'
            ]

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

    /**
     * specified editor className
     */
    className: PropTypes.string,

    /**
     * specified editor style
     */
    style: PropTypes.object,

    /**
     * editor text data
     */
    data: PropTypes.string,

    /**
     * whether display full screen or not
     */
    isFullScreen: PropTypes.bool,

    /**
     * specified editor width
     */
    width: PropTypes.number,

    /**
     * specified editor height
     */
    height: PropTypes.number,

    /**
     * editor extra options (see "defaultOptions" for detail)
     */
    options: PropTypes.shape({
        lineHeight: PropTypes.number,
        lineCache: PropTypes.number,
        horizontalPadding: PropTypes.number,
        scrollBarWidth: PropTypes.number,
        scrollBarMinLength: PropTypes.number,
        continuousClickInterval: PropTypes.number,
        discontinuousChars: PropTypes.array
    }),

    /**
     * text data change callback
     */
    onChange: PropTypes.func

};

ReactEditor.defaultProps = {

    className: '',
    style: null,

    data: '',

    isFullScreen: false,
    width: 500,
    height: 200,

    options: null

};