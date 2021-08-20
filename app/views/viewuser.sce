[[i= partials/meta]]

[[i= partials/header]]

<div id="viewUser">
    <h2>Teacher details</h2>
    
    <div class="container" id="zid">
        <h3>ZID: </h3>
        <h3 class="detail">z[[user.id]]</h3>
    </div>

    <div class="container" id="first">
        <h3>First name: </h3>
        <h3 class="detail">[[user.fname]]</h3>
    </div>

    <div class="container" id="last">
        <h3>Last name: </h3>
        <h3 class="detail">[[user.lname]]</h3>
    </div>

    <div class="container" id="email">
        <h3>Email: </h3>
        <h3 class="detail">[[user.email]]</h3>
    </div>
</div>

[[i= partials/footer]]