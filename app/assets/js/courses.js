(() => {
    var form = document.getElementById("createCourse");
    // form.onsubmit can only reference one function - you're looking for form.addEventListener("submit", fn)
    form.onsubmit = validateForm;
    form.onsubmit = validateCourseID;
    form.onsubmit = validateCourseYear;
    
    function validateForm(){
        let  courseID = form['id'].value;
        let courseName = form['name'].value;
        let courseYear = form['year'].value;

        if (courseID == ""){
            alert("Please enter a Course Code"); // can you change `alert(msg)`s to `notifier.notify(msg, "error")`, 
            return false;
        }
        if (courseName == ""){
            alert("Please enter a Course Name");
            return false;
        }
        if(courseYear == ""){
            alert("Please enter a Course Year");
            return false;
        }

        // You could probably also set a condition to be true at the start, and if any of the ifs are true, set the condition to false.
        // That way, we can notify the user of multiple errors at once, but still return false (which would be smth like `return isBad`)

        return true;
    }

    function validateCourseID(){
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
            alert("Please enter a valid course code, eg. ZEIT2306");
            return false;
        }
        return true;
    }

    function validateCourseYear(){
        let courseYear = form['year'].value;

        // Again, a more appropriate regex would be: /^\d{4}$/
        condition1 = courseYear.match(/^[0-9]+$/) != null;
        condition2 = courseYear.length == 4;

        if(!(condition1 && condition2)){
            alert("Please enter a valid year");
            return false;
        }
        return true;
    }
})();