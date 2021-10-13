onReady(() => {
    $$('.testSwitch').forEach(button => {
        button.addEventListener('click', (e) => {
            testSwitch(button);
        })
    });

});
function testSwitch(button) {
    button.parentElement.parentElement.classList.toggle("max");
}