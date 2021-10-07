onReady(() => {

    let handles = new Array();

    function confirmDelete(button, object , id) {
        let parent = button.parentElement;
        let children = parent.$$("button");
        if(button.classList.contains('red')) {
            children.forEach(child => {
                
                confirmButton(child, object, id);

            });

            handles[id] = setTimeout(function() {
                children.forEach(child => {
                    revertButton(child);
                });
            }, 5000);
        }else if (button.classList.contains("yellow")) {
            sendDeleteRequest(object, id);
        }
    }

    $$(".delete").forEach(button => {
        let data = button.dataset.delete.split(",").map(e => e.trim());

        button.addEventListener("click", (event) => {        
            confirmDelete(button, data[0], data[1]);
        });

    });
});

function confirmButton(button, object, id) {
    if(button.classList.contains("delete")) {
        button.classList.add('yellow');
        button.classList.remove('red');
        delay = setTimeout(function() {
            // button.setAttribute('href', '/admin/' + object + '/del/' + id);
            button.innerText = "Delete this item?";           
        }, 400);
    } else {
        Promise.resolve().then(function() {
            button.classList.toggle('animate-delete');
        }).then(function () {
            delay = setTimeout(function() {
                button.style.display = 'none';
            }, 350);
        });
    }
}

function revertButton(button) {
    if(button.classList.contains("delete")) {
        delay = setTimeout(function() {
            button.setAttribute('href', '');
            button.classList.remove('yellow');
            button.classList.add('red');
            button.innerText = "Delete";           
        }, 100);
    } else {
        Promise.resolve().then(function() {
            button.style = '';
        }).then(function () {
            delay = setTimeout(function() {
                button.classList.toggle('animate-delete');
            }, 50);
        });
    }
}

function sendDeleteRequest(object, id) {
    const send = fetch('/admin/' + object + '/del', {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            id: id
        }),
    }).then(async r => {
        let json = await r.json();
        if(r.status >= 200 && r.status < 300 && json.success === true) {
            return json;
        } else {
            throw json;
        }
    }).then((response) => {
        if(typeof response === "object") { // we have a JSON object
            notifier.notify(response.message, response.type ?? response.success ? "success" : "info");
            if(response.redirect) setTimeout(() => window.location.href = response.redirect, 1000);
        }
    }).catch(e => {
        console.error(e);
        notifier.notify(`${e.name ?? "Error"}: ${e.message}`, "error");
    });
}