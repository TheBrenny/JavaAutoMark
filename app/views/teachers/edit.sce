[[i= partials/meta]]

[[i= partials/header]]

<div id="editTeach">
    <h2>Teacher details</h2>

    <div class="wrapper" id="zid" tooltip="The teacher's ZID">
        <h3>ZID: </h3>
        <input type="text" class="detail" value="z[[teacher.zid]]">
    </div>

    <div class="wrapper" id="first" tooltip="The teacher's first name">
        <h3>First name: </h3>
        <input type="text" class="detail" value="[[teacher.fname]]">
    </div>

    <div class="wrapper" id="last" tooltip="The teacher's last name">
        <h3>Last name: </h3>
        <input type="text" class="detail" value="[[teacher.lname]]">
    </div>

    <div class="wrapper" id="email" tooltip="The teacher's email">
        <h3>Email: </h3>
        <input type="text" class="detail" value="[[teacher.email]]">
    </div>

    <div class="buttons">
        <button class="red">Cancel</button>
        <button class="green">Save</button>
    </div>
</div>

[[i= partials/footer]]