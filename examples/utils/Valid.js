function range(value, min, max) {
    max !== undefined && (value = value > max ? max : value);
    min !== undefined && (value = value < min ? min : value);
    return value;
}

export default {
    range
};