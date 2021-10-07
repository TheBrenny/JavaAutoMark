onReady(() => {
    const tooltip = {
        timer: 1000,
        location: {x: 0, y: 0, time: 0},
        element: $("#tooltip"),
        target: null,
        mouseTarget: null,
        candidates: Array.from($$("*[tooltip]")),
        show(message, element) {
            tooltip.target = element;
            tooltip.element.style.left = `${tooltip.location.x}px`;
            tooltip.element.style.top = `${tooltip.location.y}px`;
            tooltip.element.message.innerText = message.replace(/\\n/g, "\n");
            tooltip.element.classList.add("show");
        },
        hide() {
            tooltip.target = null;
            tooltip.element.classList.remove("show");
            tooltip.element.message.innerText = "";
        },
        update(now) {
            if(tooltip.target !== null) return;

            now = now ?? window.performance.now();
            let elem = tooltip.candidates
                .find(e => e === tooltip.mouseTarget);
            if(elem !== undefined && now - tooltip.location.time > tooltip.timer) {
                let msg = elem.getAttribute("tooltip");
                if(msg !== null) tooltip.show(msg, elem);
            }
        },
        animator: {
            interval: 1000 / 5, // 5FPS
            running: false,
            lastRun: 0,
            start() {
                if(!tooltip.animator.running) {
                    tooltip.animator.running = true;
                    requestAnimationFrame(tooltip.animator.run);
                }
            },
            run() {
                if(!tooltip.animator.running) return;
                let now = window.performance.now();
                if(now - tooltip.animator.lastRun > tooltip.animator.interval) {
                    tooltip.update(now);
                }
                requestAnimationFrame(tooltip.animator.run);
            },
            stop() {
                tooltip.animator.running = false;
            },
        }
    };
    tooltip.element.message = tooltip.element.$(".message");
    globalThis.tooltip = tooltip;
    globalThis.tooltip.animator.start();

    document.addEventListener("mousemove", (event) => {
        tooltip.location.x = event.clientX;
        tooltip.location.y = event.clientY;
        tooltip.mouseTarget = event.target;
        tooltip.location.time = window.performance.now();
        if(tooltip.target !== null) {
            tooltip.element.style.left = `${tooltip.location.x}px`;
            tooltip.element.style.top = `${tooltip.location.y}px`;

            if(event.target !== tooltip.target) tooltip.hide();
        }
    });
});