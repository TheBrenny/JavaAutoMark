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

function load(fn) {
    window.addEventListener('load', fn);
}

function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

function wrongPassword(element, message) {
    element.innerHTML = message || "Something went wrong!";
    element.style.animation = ".5s shake";
}