import React, {Component} from 'react';

import ReactEditor from 'src/ReactEditor';

import MacDownHelpText from 'assets/files/MacDownHelp.txt';

import 'assets/sass/SpecifiedSizeEditor.scss';

export default class SpecifiedSizeEditor extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="example specified-size-editor-wrapper">
                <h1>Specified Size</h1>
                <ReactEditor className="specified-size-editor"
                             data={MacDownHelpText}
                             width={500}
                             heigh={200}/>
            </div>
        );
    }
}