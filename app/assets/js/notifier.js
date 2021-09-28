onReady(() => {
    // Setup the notifier
    const notifier = {};
    notifier.tray = $('#notifier-tray');
    notifier.idGen = (function* () {
        let id = 0;
        while(true) yield id++;
    })();
    notifier.notifications = {};
    notifier.notify = (msg, type) => {
        if(type === undefined) type = 'info';
        type = ['info', 'success', 'warning', 'error'].includes(type) ? type : 'info';
        let notification = scetchInsert(notifier.tray, 'afterBegin', scetch.notification, {
            type: type,
            message: msg
        });
        setTimeout(() => notification.classList.add('show'), 20);

        const deleteNotification = () => {
            notification?.classList?.remove('show');
            setTimeout(() => notification?.remove(), 220);
        };

        notification.$(".timer").addEventListener("animationend", deleteNotification);
        notification.$(".del").addEventListener("click", deleteNotification);
        notification.addEventListener("mouseover", (e) => {
            let timer = notification.$(".timer");
            timer.style.animationPlayState = "paused";
            notification.addEventListener("mouseout", () => {
                timer.style.animationPlayState = "running";
            }, {once: true});
        });

        let id = notifier.idGen.next().value;
        notification.setAttribute("notif-id", id);
        notifier.notifications[id] = notification;
        return notification;
    };
    globalThis.notifier = notifier;
});