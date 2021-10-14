function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

Object.defineProperty(HTMLElement.prototype, "$", {
    value: function (selector) {
        return this.querySelector(selector);
    }
});

Object.defineProperty(HTMLElement.prototype, "$$", {
    value: function (selector) {
        return this.querySelectorAll(selector);
    }
});

Object.defineProperty(HTMLElement.prototype, "$up", {
    value: function () {
        if(this.parentElement) {
            if(this.parentElement.matches(...arguments)) return this.parentElement;
            return this.parentElement.$up(...arguments);
        } else {
            return undefined;
        }
    }
});

Object.defineProperty(HTMLElement.prototype, "$$up", {
    value: function (list) {
        if(list === undefined || list === null) list = [];

        if(this.parentElement) {
            if(this.parentElement.matches(...arguments)) list.push(this.parentElement);
            return this.parentElement.$$up(...arguments);
        } else {
            return Reflect.construct(Array, list, NodeList);
        }
    }
});

const realAddEventListener = HTMLElement.prototype.addEventListener;
Object.defineProperty(HTMLElement.prototype, "addEventListener", {
    value: function (type, fn, useCapture, wantsUntrusted) {
        if(Array.isArray(type)) {
            type.forEach(t => this.addEventListener(t, fn, useCapture, wantsUntrusted));
        } else {
            realAddEventListener.call(this, type, fn, useCapture, wantsUntrusted);
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
 * Document.DOMContentLoaded occurs when the page has been loaded (EXCLUDING the parsing of style sheets, images, iframes, etc.).
 */
function onReady(fn) {
    if(document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// Creates a listener
onReady(() => {
    // Change buttons with HREF to buttons with onclick
    $$("button, .btn").forEach(btn => {
        if(btn.hasAttribute("href")) {
            btn.addEventListener("click", e => window.location.href = btn.getAttribute("href"));
        }
    });
});