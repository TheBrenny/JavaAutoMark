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
    // Setup the notifier
    const notifier = {};
    notifier.tray = $('#notifier-tray');
    notifier.idGen = (function* () {
        let id = 0;
        while(true) yield id++;
    })();
    notifier.notifications = {};
    notifier.notify = (msg, isBad) => {
        isBad = !!isBad; // forces to a bool value
        let notification = scetchInsert(notifier.tray, 'afterBegin', scetch.notification, {
            isBad: isBad ? "bad" : "",
            message: msg
        });
        setTimeout(() => notification.classList.add('show'), 20);

        const deleteNotification = () => {
            notification?.classList?.remove('show');
            setTimeout(() => notification?.remove(), 220);
        };

        notification.$(".timer").addEventListener("transitionend", deleteNotification);
        notification.$(".del").addEventListener("click", deleteNotification);

        let id = notifier.idGen.next().value;
        notification.setAttribute("notif-id", id);
        notifier.notifications[id] = notification;
        return notification;
    };
    globalThis.notifier = notifier;

    // Change buttons with HREF to buttons with onclick
    $$("button, .btn").forEach(btn => {
        if(btn.hasAttribute("href")) {
            btn.addEventListener("click", e => window.location.href = btn.getAttribute("href"));
        }
    });
});