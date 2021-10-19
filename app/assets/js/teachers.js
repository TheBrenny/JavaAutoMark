const { validate } = require("./validation");

(() => {
    var form = document.getElementById("createUser");
    form.addEventListener("submit", validateForm);
    
    function validateForm(event){
        event.preventDefault();
        
        let zID = form.zID.value;
        let fName = form.fname.value;
        let lName = form.lName.value;
        let email = form.email.value;
        let pass = form.pass.value;

        if(!validate(zID, /^z[a-z]{3}\d{4}$/i)) {
            notifier.notify("Please enter a valid zID (ie, z1234567)", "error");
            valid = false;
        }
        if(!validate(fName, {min: 1, max: 100})) {
            notifier.notify("Name must be less than 50 character and contain no numbers", "error");
            valid = false;
        }
        if(!validate(lName, )){
            notifier.notify("Name must be less than 50 character and contain no numbers", "error");
            valid = false;
        }
        if(!validate(email, {min: 1900, max: 2200})) {
            notifier.notify("Please only use a valid email (ie. user@exampledomain.com)", "error");
            valid = false;
        }
        if(!validate(pass, )){
            notifier.notify("Passwords must have at least 1 lowercase, 1 uppercase, and 1 number", "error");
            valid = false;
        }

        if(valid) {
            submitForm(courseID, courseName, courseYear);
        }
    }
})();