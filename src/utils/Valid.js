function range(value, min, max) {
    max !== undefined && (value = value > max ? max : value);
    min !== undefined && (value = value < min ? min : value);
    return value;
}

function isChrome() {
    return window.navigator.userAgent.includes('Chrome');
}

function isEmptyTextData(array) {
    if (!array || array.length === 0 || (array.length === 1 && array[0] === '')) {
        return true;
    }
    return false;
}

export default {
    range,
    isChrome,
    isEmptyTextData
};