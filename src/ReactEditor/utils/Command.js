import Calculation from './Calculation';
import CharSize from './CharSize';

function doDeleteSelection(props) {

    const {editorDataArray, selectStartPosition, selectStopPosition} = props;

    if (Calculation.hasSelection(selectStartPosition, selectStopPosition)) {
        return {
            newDataArray: Calculation.deleteSelection(editorDataArray, selectStartPosition, selectStopPosition),
            newPosition: Calculation.sortPosition(selectStartPosition, selectStopPosition)[0]
        };
    }

    return {
        newDataArray: editorDataArray,
        newPosition: selectStopPosition
    };

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

    if (!selectStopPosition) {
        return;
    }

    if (Calculation.hasSelection(selectStartPosition, selectStopPosition)) {
        return doReplace(e, props);
    } else {
        return doInsert(e, props);
    }

}

function doBackSpace(props) {

    const {selectStartPosition, selectStopPosition} = props;

    if (Calculation.hasSelection(selectStartPosition, selectStopPosition)) {
        return doDeleteSelection(props);
    } else {
        return; //doInsert(props);
    }

}

function doCarriageReturn(e, props) {
    return;
}

export default {
    doDeleteSelection,
    doInput,
    doBackSpace,
    doCarriageReturn
};