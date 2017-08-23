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

function addClass(el, className) {

    if (!el || !className) {
        return;
    }

    const elClassName = el.className;

    if (!elClassName) {
        el.className = className;
        return;
    }

    const elClass = elClassName.split(/\s+/),
        index = elClass.findIndex(item => item === className);

    if (index !== -1) { // already has this className
        return;
    }

    elClass.push(className);
    el.className = elClass.join(' ');

}

function removeClass(el, className) {

    if (!el || !className) {
        return;
    }

    const elClassName = el.className;

    if (!elClassName) {
        return;
    }

    const elClass = elClassName.split(/\s+/),
        index = elClass.findIndex(item => item === className);

    if (index === -1) { // no this className
        return;
    }

    elClass.splice(index, 1);
    el.className = elClass.join(' ');

}

export default {
    getScrollLeft,
    getScrollTop,
    getOffset,
    addClass,
    removeClass
};