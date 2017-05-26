import _ from 'lodash';
import Calculation from './Calculation';
import CharSize from './CharSize';

function doDeleteLine(direction, props) {
    const {editorEl, editorDataArray, editorOptions, selectStopPosition} = props;
    return Calculation.deleteLine(direction, editorDataArray, selectStopPosition, editorOptions.lineHeight, editorEl);
}

function doDeleteChar(direction, props) {
    const {editorEl, editorDataArray, selectStopPosition} = props;
    return Calculation.deleteChar(direction, editorDataArray, selectStopPosition, editorEl);
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
        return doDeleteLine(direction, props);
    } else {
        return doDeleteChar(direction, props);
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
    let {newDataArray, newPosition} = doDeleteSelection(props);
    return doInsert(value, {...props, editorDataArray: newDataArray, selectStopPosition: newPosition});
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

export default {
    doDeleteLine,
    doDeleteChar,
    doDeletePosition,
    doDeleteSelection,
    doDelete,
    doCut,
    doInsert,
    doReplace,
    doInput,
    doSelectAll
};