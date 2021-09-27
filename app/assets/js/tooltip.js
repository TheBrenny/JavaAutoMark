onReady(() => {
    const tooltip = {
        location: {x: 0, y: 0, time: 0},
        element: $("#tooltip"),
        target: null,
        show(message, element) {
            tooltip.target = element;
            element.addEventListener("mouseleave", () => {
                tooltip.hide();
            }, {once: true, capture: false});

            tooltip.element.$(".message").innerText = message;
            tooltip.element.classList.add("show");
        },
        hide() {
            tooltip.target = null;

            tooltip.element.classList.remove("show");
            tooltip.element.$(".message").innerText = "";
        },
        update() {
            requestAnimationFrame(tooltip.update);
            if(tooltip.target !== null) return;

            let now = Date.now();
            let elem = document.elementFromPoint(tooltip.location.x, tooltip.location.y);
            if(now - tooltip.location.time > 1000) {
                let msg = null;
                do {
                    msg = elem.getAttribute("tooltip");
                } while(msg === null && (elem = elem.parentElement));
                if(msg !== null) {
                    tooltip.show(msg, elem);
                }
            }
        }
    };
    globalThis.tooltip = tooltip;
    requestAnimationFrame(tooltip.update);

    document.addEventListener("mousemove", (event) => {
        tooltip.location.x = event.clientX;
        tooltip.location.y = event.clientY;
        tooltip.location.time = Date.now();
        tooltip.element.style.left = `${tooltip.location.x}px`;
        tooltip.element.style.top = `${tooltip.location.y}px`;
    });
});