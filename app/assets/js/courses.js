(() => {
   
    var form = document.getElementById("createCourse");
    form.addEventListener("submit", validateForm);
    // form.addEventListener("submit", validateCourseID);
    // form.addEventListener("submit", validateCourseYear);
    
    function validateForm(event){
        let  courseID = form['id'].value;
        let courseName = form['name'].value;
        let courseYear = form['year'].value;

        event.preventDefault();

        let valid = true;

        if (courseID == ""){
            notifier.notify("Please enter a Course Code", "error"); 
            valid = false;
        }
        else if (courseName == ""){
            notifier.notify("Please enter a Course Name", "error");
            valid = false;
        }
        else if(courseYear == ""){
            notifier.notify("Please enter a Course Year", "error");
            valid = false;
        } else if(valid) {
            submitForm(courseID, courseName, courseYear);
        }
    }

    function validateCourseID(event){
        event.preventDefault();
        // A quick and easy regex to do all of this in one go is:
        // /^z[a-z]{3}\d{4}$/i -- https://regexr.com/6752a
        // Click on the tests tab to see it in action
        // Click on the Text tab and then the Explain sub-tab (lower on the screen) to see how and why
        let  courseID = form['id'].value;
        let courseNumbers = courseID.substring(courseID.length-4, courseID.length);
        let courseLetters = courseID.substring(0, 4);

        let condition1 = courseID.indexOf("Z") == 0 || courseID.indexOf("z") == 0;
        let condition2 = courseNumbers.match(/^[0-9]+$/) != null;
        let condition3 = courseLetters.match(/^[a-z]+$/i) != null;
        let condition4 = courseID.length == 8;

        if(!(condition1 && condition2 && condition3 && condition4)){
            notifier.notify("Please enter a valid course code, eg. ZEIT2306", "error");
        } else {
            form.submit();
        }
    }

    function validateCourseYear(event){
        event.preventDefault();
        let courseYear = form['year'].value;
        let isGood = true;

        // Again, a more appropriate regex would be: /^\d{4}$/
        condition1 = courseYear.match(/^[0-9]+$/) != null;
        condition2 = courseYear.length == 4;

        if(!(condition1 && condition2)){
            notifier.notify("Please enter a valid year", "error");
        } else {
            form.submit();
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