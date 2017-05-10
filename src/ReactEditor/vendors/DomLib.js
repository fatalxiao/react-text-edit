function getOffset(el) {

    if (!el) {
        return null;
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

function isTriggerOnEl(e, el) {

    let target = e.target;

    while (target) {
        if (target == el) {
            return true;
        }
        target = target.parentNode;
    }

    return false;

}

export default {
    getOffset,
    isTriggerOnEl
};