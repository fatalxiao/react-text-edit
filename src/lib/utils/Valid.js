function range(value, min, max) {
    max !== undefined && (value = value > max ? max : value);
    min !== undefined && (value = value < min ? min : value);
    return value;
}

function isChrome() {
    return /chrome/i.test(navigator.userAgent);
}

function isMac() {
    return /macintosh|mac os x/i.test(navigator.userAgent);
}

function isWindows() {
    return /windows|win32/i.test(navigator.userAgent);
};

function isEmptyTextData(array) {
    if (!array || array.length === 0 || (array.length === 1 && array[0] === '')) {
        return true;
    }
    return false;
}

export default {
    range,
    isChrome,
    isMac,
    isWindows,
    isEmptyTextData
};