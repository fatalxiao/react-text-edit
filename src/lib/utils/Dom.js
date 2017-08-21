function getScrollLeft() {
    return document.body.scrollLeft || document.documentElement.scrollLeft;
}

function getScrollTop() {
    return document.body.scrollTop || document.documentElement.scrollTop;
}

function getOffset(el) {

    if (!el) {
        return null;
    }

    if (el.getBoundingClientRect) {

        const result = el.getBoundingClientRect();

        return {
            top: result.top + getScrollTop(),
            left: result.left + getScrollLeft()
        };

    }

    let offset = {
        top: el.offsetTop,
        left: el.offsetLeft
    };
    while (el.offsetParent) {
        el = el.offsetParent;
        offset.top += el.offsetTop;
        offset.left += el.offsetLeft;
    }

    return offset;

}

export default {
    getScrollLeft,
    getScrollTop,
    getOffset
};