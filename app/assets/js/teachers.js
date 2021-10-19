(() => {
    var form = document.getElementById("createUser");
    form.addEventListener("submit", validateForm);
    
    function validateForm(event){
        event.preventDefault();
        
        let zID = form.zID.value;
        let fName = form.fName.value;
        let lName = form.lName.value;
        let email = form.email.value;
        let pass = form.pass.value;

        let valid = true;

        if(!validate(zID, /^z\d{7}$/i)) {
            notifier.notify("Please enter a valid zID (ie, z1234567)", "error");
            valid = false;
        }
        if(!validate(fName, /^[a-zA-Z.\-_]+$/)) {
            notifier.notify("Name must be less than 50 character and contain no numbers or punctuation", "error");
            valid = false;
        }
        if(!validate(lName, /^[a-zA-Z.\-_]+$/)){
            notifier.notify("Name must be less than 50 character and contain no numbers", "error");
            valid = false;
        }
        if(!validate(email,  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)) {
            notifier.notify("Please only use a valid email (ie. user@exampledomain.com)", "error");
            valid = false;
        }
        
        if(valid) {
            submitForm(zID, fName, lName, email, pass);
        }
    }

    function submitForm(zID, fName, lName, email, pass) {
        let submit = fetch('/teachers/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                zID: zID,
                fName: fName,
                lName: lName,
                email: email,
                pass: pass
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
})();