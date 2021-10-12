onReady(() => {
    $$('.testSwitch').forEach(button => {
        button.addEventListener('click', (e) => function() {
            testSwitch(button);
        })
    });

});
function testSwitch(button) {
    if(button.classList.contains('min')) {
        button.classList.remove('min');
        button.classList.add('max');
    } else {
        button.classList.remove('max');
        button.classList.add('min');
    }
}