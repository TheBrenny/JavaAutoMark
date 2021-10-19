[[i= partials/meta]]

[[i= partials/header]]

<form id="editTeach" method="POST" action="/teachers/edit/[[teacher.zid]]">
    <h2>Teacher details</h2>

    <div class="wrapper" id="zid" tooltip="The teacher's ZID">
        <h3>ZID: </h3>
        <input type="text" class="detail" name="zID" value="z[[teacher.zid]]">
    </div>

    <div class="wrapper" id="first" tooltip="The teacher's first name">
        <h3>First name: </h3>
        <input type="text" class="detail" name="fName" value="[[teacher.fname]]">
    </div>

    <div class="wrapper" id="last" tooltip="The teacher's last name">
        <h3>Last name: </h3>
        <input type="text" class="detail" name="lName" value="[[teacher.lname]]">
    </div>

    <div class="wrapper" id="email" tooltip="The teacher's email">
        <h3>Email: </h3>
        <input type="text" class="detail" name="email" value="[[teacher.email]]">
    </div>

    <input type="password" placeholder="New Password" name="newPass">
    <input type="password" placeholder="Confirm Password" name="confirmPass">

    <hr>
    <input type="password" placeholder="Enter current password to confirm" name="currentPass">

    <div class="buttons">
        <button class="red">Cancel</button>
        <button type="submit" class="green">Save</button>
    </div>
</form>

<script src="/assets/js/teachers.js"></script>

[[i= partials/footer]]