onReady(() => {
    const tooltip = {
        timer: 1000,
        location: {x: 0, y: 0, time: 0},
        element: $("#tooltip"),
        target: null,
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
                .map(e => ({element: e, bounds: e.getBoundingClientRect()}))
                .find(o => o.bounds.top < tooltip.location.y && o.bounds.bottom > tooltip.location.y && o.bounds.left < tooltip.location.x && o.bounds.right > tooltip.location.x);
            if(elem !== undefined && now - tooltip.location.time > tooltip.timer) {
                elem = elem.element;
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
    tooltip.candidates.forEach(candidate => {
        candidate.addEventListener("mouseleave", () => {
            if(tooltip.target === candidate) tooltip.hide();
        }, {capture: false});
    });
    tooltip.element.message = tooltip.element.$(".message");
    globalThis.tooltip = tooltip;
    globalThis.tooltip.animator.start();

    document.addEventListener("mousemove", (event) => {
        tooltip.location.x = event.clientX;
        tooltip.location.y = event.clientY;
        tooltip.location.time = window.performance.now();
        if(tooltip.target !== null) {
            tooltip.element.style.left = `${tooltip.location.x}px`;
            tooltip.element.style.top = `${tooltip.location.y}px`;
        }
    });
});