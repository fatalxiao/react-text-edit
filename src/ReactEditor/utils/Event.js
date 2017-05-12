function addEvent(el, type, cb) {
    if (typeof window.addEventListener === 'function') {
        el.addEventListener(type, cb, false);
    } else if (typeof document.attachEvent === 'function') {
        el.attachEvent(`on${type}`, cb);
    } else {
        el[`on${type}`] = cb;
    }
}

function removeEvent(el, type, cb) {
    if (typeof window.removeEventListener === 'function') {
        el.removeEventListener(type, cb, false);
    } else if (typeof document.detachEvent === 'function') {
        el.detachEvent(`on${type}`, cb);
    } else {
        el[`on${type}`] = null;
    }
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

function preventEvent(e) {
    e.stopPropagation();
    e.preventDefault();
}

export default {
    addEvent,
    removeEvent,
    isTriggerOnEl,
    preventEvent
};