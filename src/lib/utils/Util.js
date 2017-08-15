function enumerateValue(enumerate) {
    return Object.keys(enumerate).map(key => enumerate[key]);
}

export default {
    enumerateValue
};