function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

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