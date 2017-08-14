import hljs from 'highlight.js';

onmessage = function (event) {

    const result = hljs.highlightAuto(event.data.join('\n'));

    postMessage({
        highlightedDataArray: result.value.split('\n'),
        language: result.language
    });

};