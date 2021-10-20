onReady(() => {
    $$('.testSwitch').forEach(button => {
        button.addEventListener('click', (e) => {
            testSwitch(button);
        });
    });

    $('.copy')?.addEventListener('click', (e) => {
        let r = new Range();
        r.selectNodeContents($('.content'));
        window.getSelection().addRange(r);

        navigator.clipboard.writeText($('.content').innerText);
        notifier.notify("Student report has been copied to clipboard.", "info");
    });

    $$(".test").forEach(t => t.addEventListener("transitionend", (e) => {
        let el = e.target;
        if(el.classList.contains("max")) {
            el.style.maxHeight = el.clientHeight + "px";
        }
    }));
});
function testSwitch(button) {
    let on = button.parentElement.parentElement.classList.toggle("max");
    button.src = on ? "/assets/img/items/arrow_up_white.svg" : "/assets/img/items/arrow_down_white.svg";
    button.parentElement.parentElement.style.maxHeight = null;
}