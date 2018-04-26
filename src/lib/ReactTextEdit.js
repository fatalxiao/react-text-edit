import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Editor from './components/Editor';
import EditorLoading from './components/EditorLoading';

import Util from './utils/Util';

import './assets/fonts/font.css';

class ReactTextEdit extends Component {

    static Theme = {
        DEFAULT: 'default',
        DARCULA: 'darcula'
    };

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
            ],

            /**
             * whether show line number
             * @type {boolean}
             */
            showLineNumber: false,

            /**
             * whether use tab or spaces for indent
             * @type {boolean}
             */
            useTabIndent: false,

            /**
             * the number of space if use space for indent
             * @type {number}
             */
            tabIndentSize: 4,

            /**
             * the number of scroll bottom blank space height
             * @type {number}
             */
            scrollBottomBlankHeight: 0,

            // maxColumns: 0,
            maxLines: 0,
            showOverflowError: true

        };

        this.state = {

            /**
             * editor inital flag
             * @type {boolean}
             */
            editorInital: false

        };

    }

    componentDidMount() {

        // font loaded
        document.fonts.load('1em Consolas').then(() => {
            this.setState({
                editorInital: true
            });
        });

        require(`./assets/sass/theme/${this.props.theme}.scss`);

    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.theme !== this.props.theme) {
            require(`./assets/sass/theme/${nextProps.theme}.scss`);
        }
    }

    render() {
        return this.state.editorInital ?
            <Editor {...this.props}
                    editorOptions={Object.assign(this.defaultOptions, this.props.options)}/>
            :
            <EditorLoading/>;
    }

};

ReactTextEdit.propTypes = {

    /**
     * specified editor className
     */
    className: PropTypes.string,

    /**
     * specified editor style
     */
    style: PropTypes.object,

    theme: PropTypes.oneOf(Util.enumerateValue(ReactTextEdit.Theme)),

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

    scrollLeft: PropTypes.number,
    scrollTop: PropTypes.number,

    scrollLeftPerCent: PropTypes.number,
    scrollTopPerCent: PropTypes.number,

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
        discontinuousChars: PropTypes.array,
        showLineNumber: PropTypes.bool,
        useTabIndent: PropTypes.bool,
        tabIndentSize: PropTypes.number,
        scrollBottomBlankHeight: PropTypes.number,
        // maxColumns: PropTypes.number,
        maxLines: PropTypes.number
    }),

    /**
     * text data change callback
     */
    onChange: PropTypes.func,

    /**
     * scroll change callback
     */
    onScroll: PropTypes.func

};

ReactTextEdit.defaultProps = {

    theme: ReactTextEdit.Theme.DEFAULT,

    data: '',

    isFullScreen: false,
    width: 500,
    height: 200,

    scrollLeft: 0,
    scrollTop: 0,

    scrollLeftPerCent: 0,
    scrollTopPerCent: 0

};

export default ReactTextEdit;