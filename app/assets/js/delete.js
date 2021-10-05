onReady(() => {

    //Set up confirmation
    // let parent;

    // let object;
    // let id;

    let handles = new Array();

    function confirmDelete(button, object , id) {
        let parent = button.parentElement;
        let parentContent = parent.innerHTML;

        parent.style.transition = "all 0.5s ease";
        
        // parent.innerHTML = '<button class="yellow">Delete this item?</button>';
        handles[id] = setTimeout(function() {
            parent.innerHTML = '<button href="/admin/' + object + '/del/' + id + '" class="yellow">Delete this item?</button>';
            parent.classList.remove("pre-animate-delete");
        }, 500);

        handles[id] = setTimeout(function() {
            parent.classList.add("pre-animate-delete");
            setTimeout(function() {
                parent.innerHTML = parentContent;
                parent.classList.remove("pre-animate-delete");
                runListener();
            }, 500)
        }, 3000);
    }


    function runListener() {
        $$(".delete").forEach(button => {
            button.addEventListener("click", (event) => {
                data = button.dataset.delete.split(",").map(e => e.trim());
                // object = data[0];
                // id = data[1];
                
                confirmDelete(button, data[0], data[1]);
            });
        });
    }

    runListener();
});
// function confirmDelete(button, object , id) {
//     let parent = button.parentElement;
//     let parentContent = parent.innerHTML;

//     parent.style.transition = "all 0.5s ease";
//     parent.classList.add("pre-animate-delete");
//     // parent.innerHTML = '<button class="yellow">Delete this item?</button>';
//     handles[id] = setTimeout(function() {
//         parent.innerHTML = '<button href="/admin/' + object + '/del/' + id + '" class="yellow">Delete this item?</button>';
//         parent.classList.remove("pre-animate-delete");
//     }, 500);

//     handles[id] = setTimeout(function() {
//         parent.classList.add("pre-animate-delete");
//         setTimeout(function() {
//             parent.innerHTML = parentContent;
//             parent.classList.remove("pre-animate-delete");
//             runListener();
//         }, 500)
//     }, 3000);
// }