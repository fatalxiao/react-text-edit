import React, {Component} from 'react';
import markdown from 'markdown';
import 'github-markdown-css';

import ReactEditor from 'src/ReactEditor';

import Event from 'utils/Event';
import MacDownHelpText from 'assets/files/MacDownHelp.md';

import 'assets/sass/MarkDownEditor.scss';

export default class MarkDownEditor extends Component {

    constructor(props) {

        super(props);

        this.nextStateAnimationFrameId = null;

        this.state = {

            data: MacDownHelpText,

            fullWidth: window.innerWidth,
            editorWidthPerCent: .5,
            editorHeight: window.innerHeight,

            editorScrollPerCent: 0,

            isResizing: false

        };

        this.setNextState = this::this.setNextState;
        this.changeHandle = this::this.changeHandle;
        this.markdownBodyScrollHandle = this::this.markdownBodyScrollHandle;
        this.editorScrollHandle = this::this.editorScrollHandle;
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

    markdownBodyScrollHandle() {

        const el = this.refs.markdownBody,
            scrollTop = el.scrollTop;

        this.setState({
            editorScrollPerCent: scrollTop / (el.scrollHeight - window.innerHeight)
        });

    }

    editorScrollHandle({topPerCent}) {
        const el = this.refs.markdownBody;
        el.scrollTop = (el.scrollHeight - window.innerHeight) * topPerCent;
    }

    resizeHandle() {
        this.setNextState({
            fullWidth: window.innerWidth
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
            editorWidthPerCent: (window.innerWidth - e.clientX) / window.innerWidth,
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

        const {data, editorWidthPerCent, editorHeight, isResizing, editorScrollPerCent} = this.state,
            html = {__html: markdown.parse(data, 'Maruku')},
            markdownBodyWidth = window.innerWidth * (1 - editorWidthPerCent),
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

                <div ref="markdownBody"
                     className="markdown-body"
                     style={markdownBodyStyle}
                     dangerouslySetInnerHTML={html}
                     onScroll={this.markdownBodyScrollHandle}></div>

                <ReactEditor className="mark-down-editor"
                             style={markDownEditorStyle}
                             data={data}
                             width={window.innerWidth * editorWidthPerCent}
                             height={editorHeight}
                             scrollTopPerCent={editorScrollPerCent}
                             onChange={this.changeHandle}
                             onScroll={this.editorScrollHandle}/>

                <div className="drag-edge"
                     style={dragEdgeStyle}
                     onMouseDown={this.mouseDownHandle}></div>

            </div>
        );
    }
}