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

function calculateCursorPosition(string, left, editorEl) {

    let widthCount = 0, leftValue, rightValue,
        index = 0, leftIndex, rightIndex;

    for (let char of string) {

        widthCount += calculateCharWidth(char, editorEl);

        if (widthCount < left) {
            leftValue = widthCount;
            leftIndex = index;
        }

        if (widthCount > left) {
            rightValue = widthCount;
            rightIndex = index;
            break;
        }

        index++;

    }

    if (leftValue && rightValue) {
        if (rightValue - left < leftValue - left) { // right position is colser
            return {
                left: rightValue,
                col: rightIndex
            };
        } else { // left position
            return {
                left: leftValue,
                col: leftIndex
            };
        }
    } else if (leftValue && !rightValue) {
        return {
            left: leftValue,
            col: leftIndex
        };
    }

    return {
        left: 0,
        col: 0
    };

}

export default {
    calculateCharWidth,
    calculateStringWidth,
    calculateMaxLineWidth,
    calculateCursorPosition
};