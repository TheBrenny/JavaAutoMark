(() => {
    var form = document.getElementById("createCourse");
    form.onsubmit = validateForm;
    form.onsubmit = validateCourseID;
    form.onsubmit = validateCourseYear;
    
    function validateForm(){
        let  courseID = form['id'].value;
        let courseName = form['name'].value;
        let courseYear = form['year'].value;

        if (courseID == ""){
            alert("Please enter a Course Code");
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
        return true;
    }

    function validateCourseID(){
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

        condition1 = courseYear.match(/^[0-9]+$/) != null;
        condition2 = courseYear.length == 4;

        if(!(condition1 && condition2)){
            alert("Please enter a valid year");
            return false;
        }
        return true;
    }
})();