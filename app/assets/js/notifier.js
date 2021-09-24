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
});