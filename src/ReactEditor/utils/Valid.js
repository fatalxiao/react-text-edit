function range(value, min, max) {
    min !== undefined && (value = value > max ? max : value);
    max !== undefined && (value = value < min ? min : value);
    return value;
}

export default {
    range
};