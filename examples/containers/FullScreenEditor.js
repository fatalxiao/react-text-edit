import React, {Component} from 'react';

import ReactTextEdit from 'src';

import README from '../../README.md';

class FullScreenEditor extends Component {

    constructor(props) {

        super(props);

        this.state = {
            data: README
        };

        this.changeHandle = ::this.changeHandle;

    }

    changeHandle(data) {
        this.setState({
            data
        });
    }

    render() {
        return (
            <ReactTextEdit className="full-screen-editor"
                           data={this.state.data}
                           isFullScreen={true}
                           theme={ReactTextEdit.Theme.DARCULA}
                           options={{
                               // maxColumns: 70,
                               showLineNumber: true
                           }}
                           onChange={this.changeHandle}/>
        );
    }
}

export default FullScreenEditor;