import _ from 'lodash';
import Calculation from './Calculation';
import CharSize from './CharSize';

function doDeletePositionLine(direction, props) {
    const {editorEl, editorDataArray, editorOptions, selectStopPosition} = props;
    return Calculation.deletePositionLine(direction, editorDataArray, selectStopPosition, editorOptions.lineHeight, editorEl);
}

function doDeletePositionChar(direction, props) {
    const {editorEl, editorDataArray, selectStopPosition} = props;
    return Calculation.deletePositionChar(direction, editorDataArray, selectStopPosition, editorEl);
}

function doDeletePosition(direction, props) {

    const {editorDataArray, selectStopPosition} = props,
        {row, col} = selectStopPosition,
        lastLineIndex = editorDataArray.length - 1,
        lastLineLength = editorDataArray[lastLineIndex].length;

    if ((direction === 'left' && row === 0 && col === 0)
        || (direction === 'right' && row === lastLineIndex && col === lastLineLength)) {
        return;
    }

    if ((direction === 'left' && col === 0) || (direction === 'right' && col === editorDataArray[row].length)) {
        return doDeletePositionLine(direction, props);
    } else {
        return doDeletePositionChar(direction, props);
    }

}

function doDeleteSelection(props) {
    const {editorDataArray, selectStartPosition, selectStopPosition} = props;
    return Calculation.deleteSelection(editorDataArray, selectStartPosition, selectStopPosition);
}

function doDelete(direction, props) {

    const {selectStartPosition, selectStopPosition} = props;

    if (Calculation.hasSelection(selectStartPosition, selectStopPosition)) {
        return doDeleteSelection(props);
    } else {
        return doDeletePosition(direction, props);
    }

}

function doDeleteLine(props) {
    const {editorEl, editorDataArray, selectStopPosition, editorOptions} = props;
    return Calculation.deleteLine(editorDataArray, selectStopPosition, editorOptions.lineHeight, editorEl);
}

function doCut(props) {

    const {editorOptions, selectStartPosition, selectStopPosition} = props;

    if (!selectStartPosition || _.isEqual(selectStartPosition, selectStopPosition)) {
        return doDeleteSelection({
            ...props,
            selectStartPosition: {
                left: 0,
                top: selectStopPosition.top,
                row: selectStopPosition.row,
                col: 0
            },
            selectStopPosition: {
                left: 0,
                top: selectStopPosition.top + editorOptions.lineHeight,
                row: selectStopPosition.row + 1,
                col: 0
            }
        });
    } else if (Calculation.hasSelection(selectStartPosition, selectStopPosition)) {
        return doDeleteSelection(props);
    }

    return;

}

function doInsert(value, props) {
    const {editorEl, editorDataArray, editorOptions, selectStopPosition} = props;
    return Calculation.insertValue(editorDataArray, selectStopPosition, value, editorOptions.lineHeight, editorEl);
}

function doReplace(value, props) {
    let {newDataArray, newStopPosition} = doDeleteSelection(props);
    return doInsert(value, {...props, editorDataArray: newDataArray, selectStopPosition: newStopPosition});
}

function doInput(value, props) {

    const {selectStartPosition, selectStopPosition} = props;

    if (Calculation.hasSelection(selectStartPosition, selectStopPosition)) {
        return doReplace(value, props);
    } else {
        return doInsert(value, props);
    }

}

function doSelectAll(props) {

    const {editorEl, editorDataArray, editorOptions} = props,
        {lineHeight} = editorOptions,
        newStopPosition = {
            left: 0,
            top: 0,
            row: 0,
            col: 0
        },
        len = editorDataArray.length,
        lastLine = editorDataArray[len - 1],
        newStartPosition = {
            left: CharSize.calculateStringWidth(lastLine, editorEl),
            top: (len - 1) * lineHeight,
            row: len - 1,
            col: lastLine.length
        };

    return {newStartPosition, newStopPosition};

}

function doDuplicateSelection(props) {
    const {editorEl, editorDataArray, selectStartPosition, selectStopPosition, editorOptions} = props;
    return Calculation.duplicateSelection(
        editorDataArray, selectStartPosition, selectStopPosition, editorOptions.lineHeight, editorEl);
}

function doDuplicateLine(props) {
    const {editorDataArray, selectStopPosition, editorOptions} = props;
    return Calculation.duplicateLine(editorDataArray, selectStopPosition, editorOptions.lineHeight);
}

function doDuplicate(props) {

    const {selectStartPosition, selectStopPosition} = props;

    if (Calculation.hasSelection(selectStartPosition, selectStopPosition)) {
        return doDuplicateSelection(props);
    } else {
        return doDuplicateLine(props);
    }

}

export default {
    doDeletePositionLine,
    doDeletePositionChar,
    doDeletePosition,
    doDeleteSelection,
    doDelete,
    doDeleteLine,
    doCut,
    doInsert,
    doReplace,
    doInput,
    doSelectAll,
    doDuplicateSelection,
    doDuplicateLine,
    doDuplicate
};