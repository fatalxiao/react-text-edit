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
    if (start && stop && start.row !== stop.row && start.col !== stop.col) {
        return true;
    }
    return false;
}

function deleteSelection(dataArray, start, stop) {

    if (!dataArray || !start || !stop || !(start.row in dataArray) || !(stop.row in dataArray)) {
        return;
    }

    let result = dataArray.slice();
    [start, stop] = sortPosition(start, stop);

    if (start.row === stop.row) { // in one line
        result[start.row] = result[start.row].slice(0, start.col) + result[start.row].slice(stop.col);
    } else {
        result[start.row] = result[start.row].slice(0, start.col) + result[stop.row].slice(stop.col);
        result.splice(start.row + 1, stop.row - start.row);
    }

    return result;

}

function insertValue(dataArray, pos, value) {

    if (!dataArray || !pos || !(pos.row in dataArray) || !value) {
        return;
    }

    let result = dataArray.slice(),
        temp = result[pos.row].split('');

    temp.splice(pos.col, 0, value);
    result[pos.row] = temp.join('');

    return result.join('\n').split('\n');

}

export default {
    sortPosition,
    hasSelection,
    deleteSelection,
    insertValue
};