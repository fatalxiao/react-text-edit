import React, {Component} from 'react';
import markdown from 'markdown';

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
            editorHeight: window.innerHeight

        };

        this.setNextState = this::this.setNextState;
        this.changeHandle = this::this.changeHandle;
        this.resizeHandle = this::this.resizeHandle;

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

    componentDidMount() {
        Event.addEvent(window, 'resize', this.resizeHandle);
    }

    componentWillUnmount() {
        Event.removeEvent(window, 'resize', this.resizeHandle);
    }

    render() {

        const {data, editorWidth, editorHeight} = this.state,
            html = {__html: markdown.parse(data)};

        return (
            <div className="mark-down-editor-wrapper">

                <div className="mark-down-html"
                     dangerouslySetInnerHTML={html}></div>

                <ReactEditor className="mark-down-editor"
                             data={data}
                             width={editorWidth}
                             height={editorHeight}
                             onChange={this.changeHandle}/>

            </div>
        );
    }
}