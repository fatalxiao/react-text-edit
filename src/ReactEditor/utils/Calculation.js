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

function calculateResultText(origin, pos, string) {

    if (!origin || !pos || !(pos.row in origin) || !string) {
        return;
    }

    let result = origin.slice(),
        temp = result[pos.row].split('');

    temp.splice(pos.col, 0, string);
    result[pos.row] = temp.join('');

    return result;

}

export default {
    sortPosition,
    calculateResultText
};