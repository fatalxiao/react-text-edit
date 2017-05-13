import Calculation from './Calculation';
import CharSize from './CharSize';

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

    const {editorEl, editorDataArray, selectStopPosition} = props;

    let newPosition = Object.assign({}, selectStopPosition);

    let newDataArray = Calculation.insertValue(editorDataArray, newPosition, value);
    newPosition.left += CharSize.calculateStringWidth(value, editorEl);

    return {newDataArray, newPosition};

}

function doReplace(value, props) {
    return;
}

function doInput(e, props) {

    const {selectStartPosition, selectStopPosition} = props;

    if (Calculation.hasSelection(selectStartPosition, selectStopPosition)) {
        return doReplace(e, props);
    } else {
        return doInsert(e, props);
    }

}

function doCarriageReturn(e, props) {
    return;
}

export default {
    doDeleteLine,
    doDeleteChar,
    doDeletePosition,
    doDeleteSelection,
    doDelete,
    doInsert,
    doReplace,
    doInput,
    doCarriageReturn
};