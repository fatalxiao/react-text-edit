import React, {Component} from 'react';
import markdown from 'markdown';
import 'github-markdown-css';

import ReactEditor from 'src/ReactEditor';

import Event from 'utils/Event';
import MacDownHelpText from 'assets/files/MacDownHelp.txt';

import 'assets/sass/MarkDownEditor.scss';

export default class MarkDownEditor extends Component {

    constructor(props) {

        super(props);

        this.nextStateAnimationFrameId = null;

        this.state = {

            data: MacDownHelpText,

            editorWidth: window.innerWidth / 2,
            editorHeight: window.innerHeight,

            isResizing: false

        };

        this.setNextState = this::this.setNextState;
        this.changeHandle = this::this.changeHandle;
        this.resizeHandle = this::this.resizeHandle;
        this.mouseDownHandle = this::this.mouseDownHandle;
        this.mouseMoveHandle = this::this.mouseMoveHandle;
        this.mouseUpHandle = this::this.mouseUpHandle;

    }

    setNextState(state) {
        if (this.nextStateAnimationFrameId) {
            cancelAnimationFrame(this.nextStateAnimationFrameId);
        }
        this.nextStateAnimationFrameId = requestAnimationFrame(() => {
            this.nextStateAnimationFrameId = null;
            this.setState(state);
        });
    }

    changeHandle(data) {
        this.setState({
            data
        });
    }

    resizeHandle() {
        this.setNextState({
            editorWidth: window.innerWidth / 2,
            editorHeight: window.innerHeight
        });
    }

    mouseDownHandle() {
        this.setState({
            isResizing: true
        });
    }

    mouseMoveHandle(e) {

        if (!this.state.isResizing) {
            return;
        }

        this.setNextState({
            editorWidth: window.innerWidth - e.clientX,
            editorHeight: window.innerHeight
        });

    }

    mouseUpHandle() {
        this.setState({
            isResizing: false
        });
    }

    componentDidMount() {
        Event.addEvent(window, 'resize', this.resizeHandle);
        Event.addEvent(document, 'mousemove', this.mouseMoveHandle);
        Event.addEvent(document, 'mouseup', this.mouseUpHandle);
    }

    componentWillUnmount() {
        Event.removeEvent(window, 'resize', this.resizeHandle);
        Event.removeEvent(document, 'mousemove', this.mouseMoveHandle);
        Event.removeEvent(document, 'mouseup', this.mouseUpHandle);
    }

    render() {

        const {data, editorWidth, editorHeight, isResizing} = this.state,
            html = {__html: markdown.parse(data)},
            markdownBodyWidth = window.innerWidth - editorWidth,
            markdownBodyStyle = {
                width: markdownBodyWidth
            },
            markDownEditorStyle = {
                left: markdownBodyWidth
            },
            dragEdgeStyle = {
                left: markdownBodyWidth - 1
            };

        return (
            <div className={`mark-down-editor-wrapper ${isResizing ? 'resizing' : ''}`}>

                <div className="markdown-body"
                     style={markdownBodyStyle}
                     dangerouslySetInnerHTML={html}></div>

                <ReactEditor className="mark-down-editor"
                             style={markDownEditorStyle}
                             data={data}
                             width={editorWidth}
                             height={editorHeight}
                             onChange={this.changeHandle}/>

                <div className="drag-edge"
                     style={dragEdgeStyle}
                     onMouseDown={this.mouseDownHandle}></div>

            </div>
        );
    }
}