(() => {
    var form = document.getElementById("createCourse");
    form.addEventListener("submit", validateForm);

    function validateForm(event) {
        event.preventDefault();

        let courseID = form.id.value;
        let courseName = form.name.value;
        let courseYear = form.year.value;

        let valid = true;

        if(!validate(courseID, /^z[a-z]{3}\d{4}$/i)) {
            notifier.notify("Please enter a valid course code (ie, ZABC1234)", "error");
            valid = false;
        }
        if(!validate(courseName, {min: 1, max: 100})) {
            notifier.notify("Please enter a valid course name (1 <= length <= 100)", "error");
            valid = false;
        }
        if(!validate(parseInt(courseYear), {min: 1900, max: 2200})) {
            notifier.notify("Please enter a legitimate course year (1900 <= year <= 2200)", "error");
            valid = false;
        }

        if(valid) {
            submitForm(courseID, courseName, courseYear);
        }
    }


    function submitForm(id, name, year) {
        let submit = fetch('/admin/courses/create', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id: id,
                name: name,
                year: year
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