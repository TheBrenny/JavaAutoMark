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

function wrongPassword(element) {
    element.innerHTML = "Incorrect username or password";
    element.style.animation = ".5s shake";
}