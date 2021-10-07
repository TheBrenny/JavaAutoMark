(() => {
    console.log("We are in the file");
    var form = document.getElementById("createCourse");
    form.onsubmit = validateForm;

    function validateForm(){
        let  courseID = form['id'].value;
        let courseName = form['name'].value;
        let courseYear = form['year'].value;
        let courseCodeValid = courseID.indexOf("Z") == 0 || courseID.indexOf("z") == 0;
        
        if (courseID == ""){
            alert("Please enter a Course Code");
            return false;
        }
        if(!courseCodeValid){
            alert("Please Enter a valid Course Code");
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
})();