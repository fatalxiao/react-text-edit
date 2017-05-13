import Calculation from './Calculation';
import CharSize from './CharSize';

function doDelete(e, props) {

    const {editorDataArray, selectStartPosition, selectStopPosition} = props;

    if (selectStartPosition && selectStopPosition) { // if there is a selection

        let newPosition = Calculation.sortPosition(start, stop)[0];


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

function doReplace(e, props) {
    return;
}

function doInput(e, props) {

    const {selectStartPosition, selectStopPosition} = props;

    if (!selectStopPosition) {
        return;
    }

    if (selectStartPosition && selectStopPosition) {
        return doReplace(e, props);
    } else {
        return doInsert(e, props);
    }

}

function doBackSpace(e, props) {
    return;
}

function doCarriageReturn(e, props) {
    return;
}

export default {
    doInput,
    doBackSpace,
    doCarriageReturn
};