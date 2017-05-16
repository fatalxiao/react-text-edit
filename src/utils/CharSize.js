let testContainer,
    charCount = 100,
    charSize = {};

function calculateCharWidth(char, editorEl) {

    if (!char || !editorEl) {
        return 0;
    }

    if (char in charSize) {
        return charSize[char];
    }

    if (!testContainer) {
        testContainer = editorEl.querySelector('.react-editor-test-container');
    }

    testContainer.innerHTML = char.repeat(charCount);

    return charSize[char] = testContainer.getBoundingClientRect().width / charCount;

}

function calculateStringWidth(string, editorEl) {

    if (!string || !editorEl) {
        return 0;
    }

    let width = 0;
    for (let char of string) {
        width += calculateCharWidth(char, editorEl);
    }

    return width;

}

function calculateMaxLineWidth(dataArray, editorEl) {

    if (!dataArray || dataArray.length === 0 || !editorEl) {
        return 0;
    }

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

    const DEFAULT_VALUE = {
        left: 0,
        col: 0
    };

    if (!string || left === undefined || !editorEl) {
        return DEFAULT_VALUE;
    }

    let widthCount = 0, leftValue, rightValue,
        index = 1, leftIndex, rightIndex;

    for (let char of string) {

        widthCount += calculateCharWidth(char, editorEl);

        if (widthCount <= left) {
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
        if (rightValue - left < left - leftValue) { // right position is colser
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

    return DEFAULT_VALUE;

}

export default {
    calculateCharWidth,
    calculateStringWidth,
    calculateMaxLineWidth,
    calculateCursorPosition
};