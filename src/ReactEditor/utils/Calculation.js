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

function insertValue(dataArray, pos, value) {

    if (!dataArray || !pos || !(pos.row in dataArray) || !value) {
        return;
    }

    let result = dataArray.slice(),
        temp = result[pos.row].split('');

    temp.splice(pos.col, 0, value);
    result[pos.row] = temp.join('');

    return result;

}

export default {
    sortPosition,
    insertValue
};