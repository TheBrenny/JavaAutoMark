[[i= partials/meta]]

[[i= partials/header]]

<div id="viewUser">
    <h2>Teacher details</h2>

    <div class="container" id="zid">
        <h3>ZID: </h3>
        <h3 class="detail">z[[teacher.zid]]</h3>
    </div>

    <div class="container" id="first">
        <h3>First name: </h3>
        <h3 class="detail">[[teacher.fname]]</h3>
    </div>

    <div class="container" id="last">
        <h3>Last name: </h3>
        <h3 class="detail">[[teacher.lname]]</h3>
    </div>

    <div class="container" id="email">
        <h3>Email: </h3>
        <h3 class="detail">[[teacher.email]]</h3>
    </div>

    [[?= teacher.zid == user.zid ]]
    <form method="POST" action="/user/resetPass">
        <input type="password" placeholder="Current Password" name="currentPass">
        <input type="password" placeholder="New Password" name="newPass">
        <input type="password" placeholder="Confirm Password" name="confirmPass">
        <input type="submit" value="Change Password">
    </form>
    [[?==]]
</div>

[[i= partials/footer]]