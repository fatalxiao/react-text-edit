import CharSize from './CharSize';
import Valid from './Valid';

function isEmptyTextData(array) {
    if (!array || array.length === 0 || (array.length === 1 && array[0] === '')) {
        return true;
    }
    return false;
}

function calculateTextDisplayIndex({editorDataArray, scrollTop, editorOptions, editorHeight}) {

    const len = editorDataArray.length;

    let start = Math.floor(scrollTop / editorOptions.lineHeight),
        stop = start + Math.ceil(editorHeight / editorOptions.lineHeight);

    start -= editorOptions.lineCache;
    stop += editorOptions.lineCache;

    return {
        start: Valid.range(start, 0, len),
        stop: Valid.range(stop, 0, len)
    };

}

function calculateCursorPosition(x, y, {editorEl, editorDataArray, editorOptions}) {

    if (isNaN(x) || isNaN(y)) {
        return;
    }

    const len = editorDataArray.length,
        offsetTop = Valid.range(y, 0),
        row = Math.round((offsetTop / editorOptions.lineHeight) - .5);

    if (row >= len) {

        const string = editorDataArray[len - 1];

        return {
            left: CharSize.calculateStringWidth(string, editorEl),
            top: (len - 1) * editorOptions.lineHeight,
            row: len - 1,
            col: string.length
        };

    } else {

        const top = row * editorOptions.lineHeight,
            {left, col} = CharSize.calculateCursorPosition(editorDataArray[row], x, editorEl);

        return {
            left,
            top,
            row,
            col
        };

    }

}

function calculateCursorSelectionPosition(props) {

    const {
        editorEl, editorDataArray, editorOptions, contentWidth, isDoubleClick, isTripleClick,
        selectStartX, selectStartY, selectStopX, selectStopY
    } = props;

    let selectStartPosition, selectStopPosition, cursorPosition;

    if (isTripleClick) {

        cursorPosition = calculateCursorPosition(selectStopX, selectStopY, props);

        selectStartPosition = Object.assign({}, cursorPosition);
        selectStartPosition.left = 0;
        selectStartPosition.col = 0;

        selectStopPosition = Object.assign({}, cursorPosition);
        if (selectStopPosition.row === editorDataArray.length - 1) { // last line
            selectStopPosition.left = contentWidth + editorOptions.horizontalPadding + editorOptions.scrollBarWidth;
            selectStopPosition.col = editorDataArray[cursorPosition.row].length;
        } else {
            selectStopPosition.left = 0;
            selectStopPosition.col = 0;
            selectStopPosition.top += editorOptions.lineHeight;
            selectStopPosition.row += 1;
        }

    } else if (isDoubleClick) {

        cursorPosition = calculateCursorPosition(selectStopX, selectStopY, props);

        const string = editorDataArray[cursorPosition.row];

        if (string.length > 0) {

            let tempCol, tempchar, tempStartChars = [], tempStopChars = [];

            // calculate start position
            selectStartPosition = Object.assign({}, cursorPosition);
            tempCol = cursorPosition.col;
            if (tempCol > 0) {
                do {

                    tempchar = string.at(tempCol - 1);

                    if (!editorOptions.discontinuousChars.includes(tempchar)) {
                        tempStartChars.push(tempchar);
                    } else {
                        break;
                    }

                    tempCol--;

                } while (tempCol > 0);
                if (tempStartChars.length > 0) {
                    selectStartPosition.left -= CharSize.calculateStringWidth(tempStartChars.join(''), editorEl);
                    selectStartPosition.col -= tempStartChars.length;
                }
            }

            // calculate stop position
            selectStopPosition = Object.assign({}, cursorPosition);
            tempCol = cursorPosition.col;
            if (tempCol < string.length) {
                do {

                    tempchar = string.at(tempCol);

                    if (!editorOptions.discontinuousChars.includes(tempchar)) {
                        tempStopChars.push(tempchar);
                    } else {
                        break;
                    }

                    tempCol++;

                } while (tempCol < string.length);
                if (tempStopChars.length > 0) {
                    selectStopPosition.left += CharSize.calculateStringWidth(tempStopChars.join(''), editorEl);
                    selectStopPosition.col += tempStopChars.length;
                }
            }

            if (tempStartChars.length === 0 && tempStopChars.length === 0) {

                tempCol = cursorPosition.col;
                tempchar = undefined;

                if (tempCol < string.length) {

                    tempchar = string.at(tempCol);

                    if (editorOptions.discontinuousChars.includes(tempchar)) {
                        selectStopPosition.left += CharSize.calculateCharWidth(tempchar, editorEl);
                        selectStopPosition.col += 1;
                    }

                }

                if (tempchar === undefined && tempCol > 0) {

                    tempchar = string.at(tempCol - 1);

                    if (editorOptions.discontinuousChars.includes(tempchar)) {
                        selectStartPosition.left -= CharSize.calculateCharWidth(tempchar, editorEl);
                        selectStartPosition.col -= 1;
                    }

                }

            }

            cursorPosition = Object.assign({}, selectStopPosition);

        } else {
            selectStartPosition = Object.assign({}, cursorPosition);
            selectStopPosition = Object.assign({}, cursorPosition);
        }

    } else {

        selectStartPosition = calculateCursorPosition(selectStartX, selectStartY, props);
        selectStopPosition = calculateCursorPosition(selectStopX, selectStopY, props);
        cursorPosition = Object.assign({}, selectStopPosition);

    }

    return {selectStartPosition, selectStopPosition, cursorPosition};

}

function sortPosition(start, stop) {

    if (!start || !stop || isNaN(start.row) || isNaN(start.col) || isNaN(stop.row) || isNaN(stop.col)) {
        return [start, stop];
    }

    if (start.row < stop.row) {
        return [start, stop];
    } else if (start.row > stop.row) {
        return [stop, start];
    } else {
        if (start.col > stop.col) {
            return [stop, start];
        } else {
            return [start, stop];
        }
    }

}

function hasSelection(start, stop) {
    if (start && stop && (start.row !== stop.row || start.col !== stop.col)) {
        return true;
    }
    return false;
}

function getSelectionValue({editorDataArray, selectStartPosition, selectStopPosition}) {

    if (!editorDataArray || !selectStopPosition) {
        return '';
    }

    let [start, stop] = sortPosition(selectStartPosition, selectStopPosition);

    if (hasSelection(start, stop)) {

        if (start.row === stop.row) { // in one line
            return editorDataArray[start.row].slice(start.col, stop.col);
        } else {

            let result = [];

            result.push(editorDataArray[start.row].slice(start.col));
            for (let i = start.row + 1; i < stop.row; i++) {
                result.push(editorDataArray[i]);
            }
            result.push(editorDataArray[stop.row].slice(0, stop.col));

            return result.join('\n');

        }

    }
    // else {
    //     return editorDataArray[stop.row] + '\n';
    // }

    return '';

}

function deleteLine(dataArray, pos, lineHeight, editorEl) {

    if (!dataArray || !pos || !(pos.row in dataArray) || !lineHeight) {
        return;
    }

    let newDataArray = dataArray.slice(),
        newPosition = Object.assign({}, pos);

    newPosition.left = CharSize.calculateStringWidth(dataArray[pos.row - 1], editorEl);
    newPosition.top -= lineHeight;

    newDataArray[pos.row - 1] = newDataArray[pos.row - 1] + newDataArray[pos.row];
    newDataArray.splice(pos.row, 1);

    return {newDataArray, newPosition};

}

function deleteChar(dataArray, pos, editorEl) {

    if (!dataArray || !pos || !(pos.row in dataArray)) {
        return;
    }

    let newDataArray = dataArray.slice(),
        newPosition = Object.assign({}, pos);

    newDataArray[pos.row] = newDataArray[pos.row].slice(0, pos.col - 1) + newDataArray[pos.row].slice(pos.col);
    newPosition.left -= CharSize.calculateStringWidth(dataArray[pos.row].slice(pos.col - 1, pos.col), editorEl);

    return {newDataArray, newPosition};

}

function deleteSelection(dataArray, start, stop) {

    if (!dataArray || !start || !stop || !(start.row in dataArray) || !(stop.row in dataArray)) {
        return;
    }

    let newDataArray = dataArray.slice();
    [start, stop] = sortPosition(start, stop);

    newDataArray[start.row] = dataArray[start.row].slice(0, start.col) + dataArray[stop.row].slice(stop.col);

    if (start.row !== stop.row) { // not in one line
        newDataArray.splice(start.row + 1, stop.row - start.row);
    }

    return {
        newDataArray,
        newPosition: start
    };

}

function insertValue(dataArray, pos, value, lineHeight, editorEl) {

    if (!dataArray || !pos || !(pos.row in dataArray) || !value) {
        return;
    }

    let newDataArray = dataArray.slice(),
        newPosition = Object.assign({}, pos),
        temp = dataArray[pos.row].split('');

    temp.splice(pos.col, 0, value);
    newDataArray[pos.row] = temp.join('');

    const valueArray = value.split('\n');
    if (valueArray.length > 1) {
        newPosition.top += (valueArray.length - 1) * lineHeight;
        newPosition.left = CharSize.calculateStringWidth(valueArray[valueArray.length - 1], editorEl);
    } else {
        newPosition.left += CharSize.calculateStringWidth(value, editorEl);
    }

    return {
        newDataArray: newDataArray.join('\n').split('\n'),
        newPosition
    };

}

export default {
    isEmptyTextData,
    calculateTextDisplayIndex,
    calculateCursorPosition,
    calculateCursorSelectionPosition,
    sortPosition,
    hasSelection,
    getSelectionValue,
    deleteLine,
    deleteChar,
    deleteSelection,
    insertValue
};