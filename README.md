# React-Text-Edit

[![NPM Version][npm-image]][npm-url]
[![License][license-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/react-text-edit.svg
[npm-url]: https://npmjs.org/package/react-text-edit
[license-image]: https://img.shields.io/npm/l/react-text-edit.svg

A text editor components written with React.

## Installation

**NPM**

```bash
$ npm install react-text-edit --save
```

## Usage

```jsx
import React, {Component} from 'react';
import ReactTextEdit from 'react-text-edit';

export default class MyComponent extends Component {

    constructor(props) {
    
        super(props);
        
        this.state = {
            data: ''
        };
        
        this.onChange = this::this.onChange;
        
    }
    
    onChange() {
    	// ...
    }

    // ...

    render() {
        return (
            <ReactTextEdit data={this.state.data}
                           onChange={this.onChange}/>
        );
    }

}
```

## Examples

Examples can be found in the
[examples folder](https://github.com/fatalxiao/react-text-edit/tree/master/examples).

**Run Demo**

```bash
$ npm run demo
```

## License

This project is licensed under the terms of the
[MIT license](https://github.com/alcedo-ui/alcedo-ui/blob/dev/LICENSE)