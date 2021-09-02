function $() {
    return document.querySelector(...arguments);
}

function $$() {
    return document.querySelectorAll(...arguments);
}

Object.defineProperty(HTMLElement.prototype, "$", {
    value: function () {
        return this.querySelector(...arguments);
    }
});

Object.defineProperty(HTMLElement.prototype, "$$", {
    value: function () {
        return this.querySelectorAll(...arguments);
    }
});

Object.defineProperty(HTMLElement.prototype, "$up", {
    value: function () {
        if (this.parentElement) {
            if (this.parentElement.matches(...arguments)) return this.parentElement;
            return this.parentElement.$up(...arguments);
        } else {
            return undefined;
        }
    }
});

Object.defineProperty(HTMLElement.prototype, "$$up", {
    value: function (list) {
        if (list === undefined || list === null) list = [];

        if (this.parentElement) {
            if (this.parentElement.matches(...arguments)) list.push(this.parentElement);
            return this.parentElement.$$up(...arguments);
        } else {
            return Reflect.construct(Array, list, NodeList);
        }
    }
});

/**
 * Adds an event listener for the window.load event.
 * 
 * Window.load occurs when the whole page is loaded (including style sheets, images, iframes, etc.).
 */
function onLoad(fn) {
    window.addEventListener('load', fn);
}

/**
 * Adds an event listener for the document.DOMContentLoaded event.
 * 
 * Document.DOMContentLoaded occurs when the page has been loaded and parsed (EXCLUDING the parsing of style sheets, images, iframes, etc.).
 */
function onReady(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}