function range(value, min, max) {
    max !== undefined && (value = value > max ? max : value);
    min !== undefined && (value = value < min ? min : value);
    return value;
}

function isChrome() {
    return window.navigator.userAgent.includes('Chrome');
}

export default {
    range,
    isChrome
};