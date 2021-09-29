onReady(() => {
    const tooltip = {
        timer: 1000,
        location: {x: 0, y: 0, time: 0},
        element: $("#tooltip"),
        target: null,
        show(message, element) {
            tooltip.target = element;
            element.addEventListener("mouseleave", () => {
                tooltip.hide();
            }, {once: true, capture: false});

            tooltip.element.$(".message").innerHTML = message.replace(/\\n/g, "<br>");
            tooltip.element.classList.add("show");
        },
        hide() {
            tooltip.target = null;

            tooltip.element.classList.remove("show");
            tooltip.element.$(".message").innerText = "";
        },
        update() {
            if(tooltip.target !== null) return;

            let now = Date.now();
            let elem = document.elementFromPoint(tooltip.location.x, tooltip.location.y);
            if(now - tooltip.location.time > tooltip.timer) {
                let msg = null;
                do {
                    try {
                        msg = elem.getAttribute("tooltip");
                    } catch(e) {}
                } while(msg === null && (elem = (elem?.parentElement)) !== null);
                if(msg !== null) {
                    tooltip.show(msg, elem);
                }
            }
        },
        animator: {
            interval: 1000 / 5, // 5FPS
            timer: 0,
            start() {
                if(tooltip.animator.timer === 0) {
                    tooltip.animator.timer = setInterval(() => requestAnimationFrame(tooltip.update), tooltip.animator.interval);
                }
                return tooltip.animator;
            },
            stop() {
                if(tooltip.animator.timer !== 0) {
                    clearInterval(tooltip.animator.timer);
                    tooltip.animator.timer = 0;
                }
                return tooltip.animator;
            },
        }
    };
    globalThis.tooltip = tooltip;
    globalThis.tooltip.animator.start();

    document.addEventListener("mousemove", (event) => {
        tooltip.location.x = event.clientX;
        tooltip.location.y = event.clientY;
        tooltip.location.time = Date.now();
        tooltip.element.style.left = `${tooltip.location.x}px`;
        tooltip.element.style.top = `${tooltip.location.y}px`;
    });
});