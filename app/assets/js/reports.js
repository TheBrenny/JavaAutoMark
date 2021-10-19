onReady(() => {
    $$('.testSwitch').forEach(button => {
        button.addEventListener('click', (e) => {
            testSwitch(button);
        })
    });

    $('.copy').addEventListener('click', (e) => {
        let r = new Range();
        r.selectNodeContents($('.content'));
        window.getSelection().addRange(r);

        navigator.clipboard.writeText($('.content').innerText);
        notifier.notify("Student report has been copied to clipboard.", "info");
    });
});
function testSwitch(button) {
    button.parentElement.parentElement.classList.toggle("max");
}