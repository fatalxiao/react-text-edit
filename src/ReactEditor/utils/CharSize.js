let testContainer,
    charCount,
    charSize = {};

function calculateCharCount(editorEl) {

    let el = editorEl.querySelector('.react-editor-test-char-count'),
        width = el.getBoundingClientRect().width;

    if (width > 0 && width < 1) {
        charCount = 50;
    } else {
        charCount = 100;
    }

}

function calculateCharWidth(char, editorEl) {

    if (char in charSize) {
        return charSize[char];
    }

    if (!testContainer) {
        testContainer = editorEl.querySelector('.react-editor-test-container');
    }

    if (!charCount) {
        calculateCharCount(editorEl);
    }
    testContainer.innerHTML = char.repeat(charCount);

    return charSize[char] = testContainer.getBoundingClientRect().width / charCount;

}

function calculateStringWidth(string, editorEl) {

    if (!string) {
        return 0;
    }

    let width = 0;
    for (let char of string) {
        width += calculateCharWidth(char, editorEl);
    }

    return width;

}

function calculateMaxLineWidth(dataArray, editorEl) {

    let max = 0;

    for (let item of dataArray) {

        if (!item || item.length <= 0) {
            continue;
        }

        let width = calculateStringWidth(item, editorEl);
        if (width > max) {
            max = width;
        }

    }

    return max;

}

export default {
    calculateCharWidth,
    calculateStringWidth,
    calculateMaxLineWidth
};