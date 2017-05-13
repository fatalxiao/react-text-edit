import Calculation from './Calculation';

function doDeleteLine(props) {
    const {editorEl, editorDataArray, editorOptions, selectStopPosition} = props;
    return Calculation.deleteLine(editorDataArray, selectStopPosition, editorOptions.lineHeight, editorEl);
}

function doDeleteChar(props) {
    const {editorEl, editorDataArray, selectStopPosition} = props;
    return Calculation.deleteChar(editorDataArray, selectStopPosition, editorEl);
}

function doDeletePosition(props) {

    const {editorDataArray, selectStopPosition} = props;

    if (selectStopPosition.row === 0 && selectStopPosition.col === 0) {
        return {
            newDataArray: editorDataArray,
            newPosition: selectStopPosition
        };
    }

    if (selectStopPosition.col === 0) {
        return doDeleteLine(props);
    } else {
        return doDeleteChar(props);
    }

}

function doDeleteSelection(props) {
    const {editorDataArray, selectStartPosition, selectStopPosition} = props;
    return Calculation.deleteSelection(editorDataArray, selectStartPosition, selectStopPosition);
}

function doDelete(props) {

    const {selectStartPosition, selectStopPosition} = props;

    if (Calculation.hasSelection(selectStartPosition, selectStopPosition)) {
        return doDeleteSelection(props);
    } else {
        return doDeletePosition(props);
    }

}

function doInsert(value, props) {
    const {editorEl, editorDataArray, editorOptions, selectStopPosition} = props;
    return Calculation.insertValue(editorDataArray, selectStopPosition, value, editorOptions.lineHeight, editorEl);
}

function doReplace(value, props) {
    let {newDataArray, newPosition} = doDeleteSelection(props);
    return doInsert(value, {...props, editorDataArray: newDataArray, selectStopPosition: newPosition});
}

function doInput(e, props) {

    const {selectStartPosition, selectStopPosition} = props;

    if (Calculation.hasSelection(selectStartPosition, selectStopPosition)) {
        return doReplace(e, props);
    } else {
        return doInsert(e, props);
    }

}

export default {
    doDeleteLine,
    doDeleteChar,
    doDeletePosition,
    doDeleteSelection,
    doDelete,
    doInsert,
    doReplace,
    doInput
};