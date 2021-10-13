onReady(() => {
    const tooltip = {
        timer: 1000,
        location: {x: 0, y: 0, time: 0},
        element: $("#tooltip"),
        target: null,
        mouseTarget: null,
        candidates: [],
        findNewCandidates() {
            return (tooltip.candidates = Array.from($$("*[tooltip]")));
        },
        show(message, element) {
            tooltip.target = element;
            tooltip.element.style.left = `${tooltip.location.x}px`;
            tooltip.element.style.top = `${tooltip.location.y}px`;
            tooltip.element.message.innerHTML = message.replace(/\\n/g, "<br>");
            // tooltip.element.message.innerText = message.replace(/\\n/g, "\n");
            tooltip.element.classList.add("show");
        },
        hide() {
            tooltip.target = null;
            tooltip.element.classList.remove("show");
            tooltip.element.message.innerText = "";
            tooltip.element.message.innerHTML = "";
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
    tooltip.element.arrow = tooltip.element.$(".arrow");
    tooltip.findNewCandidates();
    globalThis.tooltip = tooltip;
    globalThis.tooltip.animator.start();

    document.addEventListener("mousemove", (event) => {
        let mX = event.clientX;
        let mY = event.clientY;
        tooltip.location.x = mX;
        tooltip.location.y = mY;
        tooltip.mouseTarget = event.target;
        tooltip.location.time = window.performance.now();

        if(tooltip.target !== null) {
            let boxWidth = tooltip.element.offsetWidth;
            let boxHeight = tooltip.element.offsetHeight;

            tooltip.location.x = Math.min(Math.max(tooltip.location.x, boxWidth / 2), window.innerWidth - boxWidth / 2);
            tooltip.location.y = Math.min(Math.max(tooltip.location.y, boxHeight / 2), window.innerHeight - boxHeight / 2);

            tooltip.element.style.left = `${tooltip.location.x}px`;
            tooltip.element.style.top = `${tooltip.location.y}px`;
            tooltip.element.arrow.style.left = `${(0.5 + (mX - tooltip.location.x) / boxWidth) * 100}%`;
            if(event.target !== tooltip.target) tooltip.hide();
        }
    });
});