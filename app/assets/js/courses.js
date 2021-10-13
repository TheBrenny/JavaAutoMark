(() => {
   
    var form = document.getElementById("createCourse");
    form.addEventListener("submit", validateForm);
    form.addEventListener("submit", validateCourseID);
    form.addEventListener("submit", validateCourseYear);
    
    function validateForm(event){
        event.preventDefault();
        let  courseID = form['id'].value;
        let courseName = form['name'].value;
        let courseYear = form['year'].value;

        if (courseID == ""){
            notifier.notify("Please enter a Course Code", "error"); 
        }
        else if (courseName == ""){
            notifier.notify("Please enter a Course Name", "error");
        }
        else if(courseYear == ""){
            notifier.notify("Please enter a Course Year", "error");
        } else {
            form.submit();
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
})();