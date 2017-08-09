import CharSize from './CharSize';
import Valid from './Valid';

function horizontalDisplayWidth(props) {
    const {editorWidth, editorOptions, gutterWidth} = props,
        {scrollBarWidth, horizontalPadding, showLineNumber} = editorOptions;
    return editorWidth - scrollBarWidth - horizontalPadding * 2 - (showLineNumber ? gutterWidth : 0);
}

function fullScrollLeft(props) {
    return props.contentWidth - horizontalDisplayWidth(props);
}

function scrollLeftPerCent(scrollLeft, props) {
    const {contentWidth} = props,
        displayWidth = horizontalDisplayWidth(props),
        fullWidth = fullScrollLeft(props);
    return contentWidth > displayWidth ? scrollLeft / fullWidth : 1;
}

function maxScrollTop(props) {
    const {editorDataArray, editorOptions} = props;
    return (editorDataArray.length - 1) * editorOptions.lineHeight;
}

function fullScrollTop(props) {

    const {editorDataArray, editorHeight, editorOptions} = props,
        {scrollBarWidth, scrollBottomBlankHeight} = editorOptions,
        max = maxScrollTop(props);

    if (scrollBottomBlankHeight < 0) {
        return max;
    }

    return Valid.range(
        editorDataArray.length * editorOptions.lineHeight - editorHeight + scrollBarWidth + scrollBottomBlankHeight,
        undefined, max
    );

}

function scrollTopPerCent(scrollTop, props) {
    const {contentHeight, editorOptions} = props,
        fullHeight = fullScrollTop(props);
    return contentHeight > editorOptions.lineHeight ? scrollTop / fullHeight : 1;
}

function textDisplayIndex({editorDataArray, scrollTop, editorOptions, editorHeight}) {

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

function cursorPosition(x, y, {editorEl, editorDataArray, editorOptions}) {

    if (isNaN(x) || isNaN(y)) {
        return;
    }

    const len = editorDataArray.length,
        offsetTop = Valid.range(y, 0),
        row = Math.round((offsetTop / editorOptions.lineHeight) - .5);

    if (row >= len) { // mouse down blow text content

        const string = editorDataArray[len - 1];

        return {
            left: CharSize.calculateStringWidth(string, editorEl),
            top: (len - 1) * editorOptions.lineHeight,
            row: len - 1,
            col: string.length
        };

    } else { // mouse down in text content

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

function cursorSelectionPosition(selectStartX, selectStartY, selectStopX, selectStopY, props) {

    const {
            editorEl, editorDataArray, editorOptions, contentWidth, isDoubleClick, isTripleClick, gutterWidth
        } = props,
        {horizontalPadding, scrollBarWidth, lineHeight, discontinuousChars, showLineNumber} = editorOptions,
        finalGutterWidth = showLineNumber ? gutterWidth : 0,
        finalSelectStartX = selectStartX ? selectStartX - horizontalPadding - finalGutterWidth : selectStartX,
        finalSelectStopX = selectStopX ? selectStopX - horizontalPadding - finalGutterWidth : selectStopX;

    let selectStartPosition, selectStopPosition, position;

    if (isTripleClick) {

        position = cursorPosition(finalSelectStopX, selectStopY, props);

        selectStopPosition = Object.assign({}, position);
        selectStopPosition.left = 0;
        selectStopPosition.col = 0;

        selectStartPosition = Object.assign({}, position);
        if (selectStartPosition.row === editorDataArray.length - 1) { // last line
            selectStartPosition.left = contentWidth + horizontalPadding + scrollBarWidth;
            selectStartPosition.col = editorDataArray[position.row].length;
        } else {
            selectStartPosition.left = 0;
            selectStartPosition.col = 0;
            selectStartPosition.top += lineHeight;
            selectStartPosition.row += 1;
        }

    } else if (isDoubleClick) {

        position = cursorPosition(finalSelectStopX, selectStopY, props);

        const string = editorDataArray[position.row];

        if (string.length > 0) {

            let tempCol, tempchar, tempStartChars = [], tempStopChars = [];

            // calculate start position
            selectStartPosition = Object.assign({}, position);
            tempCol = position.col;
            if (tempCol > 0) {
                do {

                    tempchar = string.charAt(tempCol - 1);

                    if (!discontinuousChars.includes(tempchar)) {
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
            selectStopPosition = Object.assign({}, position);
            tempCol = position.col;
            if (tempCol < string.length) {
                do {

                    tempchar = string.charAt(tempCol);

                    if (!discontinuousChars.includes(tempchar)) {
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

                tempCol = position.col;
                tempchar = undefined;

                if (tempCol < string.length) {

                    tempchar = string.charAt(tempCol);

                    if (discontinuousChars.includes(tempchar)) {
                        selectStopPosition.left += CharSize.calculateCharWidth(tempchar, editorEl);
                        selectStopPosition.col += 1;
                    }

                }

                if (tempchar === undefined && tempCol > 0) {

                    tempchar = string.charAt(tempCol - 1);

                    if (discontinuousChars.includes(tempchar)) {
                        selectStartPosition.left -= CharSize.calculateCharWidth(tempchar, editorEl);
                        selectStartPosition.col -= 1;
                    }

                }

            }

            position = Object.assign({}, selectStopPosition);

        } else {
            selectStartPosition = Object.assign({}, position);
            selectStopPosition = Object.assign({}, position);
        }

    } else {

        selectStartPosition = cursorPosition(finalSelectStartX, selectStartY, props);
        selectStopPosition = cursorPosition(finalSelectStopX, selectStopY, props);
        position = Object.assign({}, selectStopPosition);

    }

    return {selectStartPosition, selectStopPosition, cursorPosition: position};

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

    } else {
        return editorDataArray[stop.row] + '\n';
    }

    return '';

}

function deletePositionLine(direction, dataArray, pos, lineHeight, editorEl) {

    if (!dataArray || !pos || !(pos.row in dataArray) || !lineHeight) {
        return;
    }

    let newDataArray = dataArray.slice(),
        newPosition = Object.assign({}, pos),
        lastLine = dataArray[pos.row - 1];

    if (direction === 'left') {

        newPosition.left = CharSize.calculateStringWidth(lastLine, editorEl);
        newPosition.top -= lineHeight;
        newPosition.row -= 1;
        newPosition.col = lastLine.length;

        newDataArray[pos.row - 1] = newDataArray[pos.row - 1] + newDataArray[pos.row];
        newDataArray.splice(pos.row, 1);

    } else if (direction === 'right') {

        newDataArray[pos.row] = newDataArray[pos.row] + newDataArray[pos.row + 1];
        newDataArray.splice(pos.row + 1, 1);

    } else {
        return;
    }

    return {
        newDataArray,
        newStartPosition: null,
        newStopPosition: newPosition,
        newCursorPosition: newPosition
    };

}

function deletePositionChar(direction, dataArray, pos, editorEl) {

    if (!dataArray || !pos || !(pos.row in dataArray)) {
        return;
    }

    let newDataArray = dataArray.slice(),
        newPosition = Object.assign({}, pos);

    if (direction === 'left') {

        newDataArray[pos.row] = dataArray[pos.row].slice(0, pos.col - 1) + dataArray[pos.row].slice(pos.col);
        newPosition.left -= CharSize.calculateStringWidth(dataArray[pos.row].charAt(pos.col - 1), editorEl);
        newPosition.col -= 1;

    } else if (direction === 'right') {

        newDataArray[pos.row] = dataArray[pos.row].slice(0, pos.col) + dataArray[pos.row].slice(pos.col + 1);

    } else {
        return;
    }

    return {
        newDataArray,
        newStartPosition: null,
        newStopPosition: newPosition,
        newCursorPosition: newPosition
    };

}

function deleteLine(dataArray, pos, lineHeight, editorEl) {

    if (dataArray.length < 1 || (dataArray.length == 1 && dataArray[0] === '') || !editorEl) {
        return;
    }

    const lastLen = dataArray.length - 1,
        {row, col} = pos;

    let newDataArray = dataArray.slice(),
        newPosition = Object.assign({}, pos);

    if (row === 0 && lastLen === 0) {

        return {
            newDataArray: [''],
            newStartPosition: null,
            newStopPosition: {
                left: 0,
                top: 0,
                row: 0,
                col: 0
            },
            newCursorPosition: {
                left: 0,
                top: 0,
                row: 0,
                col: 0
            }
        };

    }

    newDataArray.splice(row, 1);

    if (row === lastLen) {
        newPosition.top -= lineHeight;
        newPosition.row--;
    }

    const newLine = newDataArray[newPosition.row];
    if (newLine.length < col) {
        newPosition.col = newLine.length;
    }
    newPosition.left = CharSize.calculateStringWidth(newLine.slice(0, newPosition.col), editorEl);

    return {
        newDataArray,
        newStartPosition: null,
        newStopPosition: newPosition,
        newCursorPosition: newPosition
    };

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
        newStartPosition: null,
        newStopPosition: start,
        newCursorPosition: start
    };

}

function insertValue(dataArray, pos, value, lineHeight, editorEl) {

    if (!dataArray || !pos || !(pos.row in dataArray) || !value) {
        return;
    }

    let newDataArray = dataArray.slice(),
        newPosition = Object.assign({}, pos);

    newDataArray[pos.row] = dataArray[pos.row].slice(0, pos.col) + value + dataArray[pos.row].slice(pos.col);

    const valueArray = value.split('\n'),
        len = valueArray.length,
        lastLine = valueArray[valueArray.length - 1];

    if (len > 1) {
        newPosition.top += (valueArray.length - 1) * lineHeight;
        newPosition.left = CharSize.calculateStringWidth(lastLine, editorEl);
        newPosition.col = lastLine.length;
    } else {
        newPosition.left += CharSize.calculateStringWidth(value, editorEl);
        newPosition.col += value.length;
    }
    newPosition.row += len - 1;

    return {
        newDataArray: newDataArray.join('\n').split('\n'),
        newStartPosition: null,
        newStopPosition: newPosition,
        newCursorPosition: newPosition
    };

}

function directionChange(rowOffset, colOffset, props) {

    if (isNaN(rowOffset) || isNaN(colOffset)) {
        return;
    }

    const {editorEl, editorDataArray, editorOptions, cursorPosition} = props,
        {lineHeight} = editorOptions,
        lastLineIndex = editorDataArray.length - 1,
        lastLine = editorDataArray[lastLineIndex],
        lastLineLength = lastLine.length;

    let {left, top, row, col} = cursorPosition;

    if ((row === 0 && col === 0 && (rowOffset < 0 || colOffset < 0))
        || (row === lastLineIndex && col === lastLineLength && (rowOffset > 0 || colOffset > 0))) {
        return;
    }

    if (rowOffset !== 0) {

        row += rowOffset;

        if (row < 0) {

            row = 0;
            left = 0;
            col = 0;

        } else if (row > lastLineIndex) {

            row = lastLineIndex;

            const line = editorDataArray[row];

            left = CharSize.calculateStringWidth(line, editorEl);
            col = line.length;

        } else {
            top = Valid.range(top + lineHeight * rowOffset, 0, lastLineIndex * lineHeight);
            left = CharSize.calculateStringWidth(editorDataArray[row].slice(0, col), editorEl);
        }

    }

    if (colOffset !== 0) {

        col += colOffset;
        const currentLine = editorDataArray[row],
            currentLineLength = currentLine.length;

        if (col < 0) {

            let offset = col, line;
            while (offset < 0) {

                if (row === 0) {
                    return {
                        left: 0,
                        top: 0,
                        row: 0,
                        col: 0
                    };
                }

                row--;
                top -= lineHeight;
                offset++;
                line = editorDataArray[row];

                if (-offset > line.length) {
                    offset += line.length;
                } else {
                    return {
                        left: CharSize.calculateStringWidth(line.slice(0, col), editorEl),
                        top,
                        row,
                        col: offset + line.length
                    };
                }

            }

        } else if (col > currentLineLength) {

            let offset = col - currentLineLength, line;
            while (offset > 0) {

                if (row === lastLineIndex) {
                    return {
                        left: CharSize.calculateStringWidth(lastLine, editorEl),
                        top: lastLineIndex * lineHeight,
                        row: lastLineIndex,
                        col: lastLineLength
                    };
                }

                row++;
                top += lineHeight;
                offset--;
                line = editorDataArray[row];

                if (offset > line.length) {
                    offset -= line.length;
                } else {
                    return {
                        left: CharSize.calculateStringWidth(line.slice(0, col), editorEl),
                        top,
                        row,
                        col: offset
                    };
                }

            }

        } else {
            left = CharSize.calculateStringWidth(currentLine.slice(0, col), editorEl);
        }

    }

    return {left, top, row, col};

}

function scrollOnChange(props) {

    const {
            editorEl, editorDataArray, editorWidth, editorHeight, contentWidth,
            scrollLeft, scrollTop, cursorPosition, editorOptions
        } = props,
        {left, top, row, col} = cursorPosition,
        {lineHeight} = editorOptions;

    let newScrollLeft = scrollLeft,
        newScrollTop = scrollTop;

    // top
    if (top - newScrollTop < lineHeight) {
        newScrollTop = Valid.range(top - lineHeight, 0, fullScrollTop(props));
    }

    // bottom
    if (editorHeight - (top - newScrollTop + lineHeight) < lineHeight) {
        newScrollTop = lineHeight * 2 - editorHeight + top;
    }

    // left
    if (left < newScrollLeft) {
        const line = editorDataArray[row],
            start = Valid.range(col - 4, 0),
            string = line.slice(start, col),
            width = CharSize.calculateStringWidth(string, editorEl);
        newScrollLeft = left - width;
    }

    // right
    const fullWidth = horizontalDisplayWidth(props);
    if (left > fullWidth + newScrollLeft) {
        const line = editorDataArray[row],
            stop = Valid.range(col + 4, 0, line.length),
            string = line.slice(col, stop),
            width = CharSize.calculateStringWidth(string, editorEl);
        newScrollLeft = left + width - fullWidth;
    }
    if (scrollLeft + fullWidth > contentWidth) {
        newScrollLeft = contentWidth - fullWidth > 0 ? contentWidth - fullWidth : 0;
    }

    return {
        scrollLeft: newScrollLeft,
        scrollTop: newScrollTop
    };

}

function duplicateSelection(dataArray, start, stop, lineHeight, editorEl) {

    let newDataArray = dataArray.slice(),
        newStartPosition = Object.assign({}, stop),
        newPosition = Object.assign({}, stop);

    [start, stop] = sortPosition(start, stop);

    if (start.row === stop.row) { // in one line

        const line = dataArray[start.row],
            selection = line.slice(start.col, stop.col);

        newDataArray[start.row] = line.slice(0, stop.col) + selection + line.slice(stop.col);
        newPosition.left += CharSize.calculateStringWidth(selection, editorEl);
        newPosition.col += selection.length;

    } else {

        newDataArray[stop.row] = dataArray[stop.row].slice(0, stop.col) + dataArray[start.row].slice(start.col);
        const rowOffset = stop.row - start.row;
        for (let i = 1; i <= rowOffset; i++) {
            newDataArray.splice(stop.row + i, 0, dataArray[start.row + i]);
        }

        newPosition.top += rowOffset * lineHeight;
        newPosition.row += rowOffset;

    }

    return {
        newDataArray,
        newStartPosition,
        newStopPosition: newPosition,
        newCursorPosition: newPosition
    };

}

function duplicateLine(dataArray, pos, lineHeight) {

    const {row} = pos,
        line = dataArray[row];

    let newDataArray = dataArray.slice(),
        newPosition = Object.assign({}, pos);

    newDataArray.splice(row, 0, line);
    newPosition.top += lineHeight;
    newPosition.row++;

    return {
        newDataArray,
        newStartPosition: null,
        newStopPosition: newPosition,
        newCursorPosition: newPosition
    };

}

export default {
    horizontalDisplayWidth,
    fullScrollLeft,
    scrollLeftPerCent,
    maxScrollTop,
    fullScrollTop,
    scrollTopPerCent,
    textDisplayIndex,
    cursorPosition,
    cursorSelectionPosition,
    sortPosition,
    hasSelection,
    getSelectionValue,
    deletePositionLine,
    deletePositionChar,
    deleteLine,
    deleteSelection,
    insertValue,
    directionChange,
    scrollOnChange,
    duplicateSelection,
    duplicateLine
};