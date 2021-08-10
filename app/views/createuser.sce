[[i= partials/meta]]

[[i= partials/header]]

<form id="createUser" method="POST" action="/create">
    <h3>ADD A NEW TEACHER</h3>

    <!--
        IGNORE THESE LABELS
            <label>zID:</label>
            <label>First name:</label>
            <label>Last name:</label>
            <label>Password:</label>

    -->

    <input type="text" name="zID" placeholder="zID" />
    <div id="groupNames">
        <div class="name first">
            <input type="text" name="fName" placeholder="First name" />
        </div>
        <div class="name">
            <input type="text" name="lName" placeholder="Last name" />
        </div>
    </div>
    
    <input type="text" name="pass" placeholder="Password" />
    <label for="pass">Ensure you provide this password to the teacher</label>

    <input type="submit" name="submit" value="Add teacher" />
    

</form>

[[i= partials/footer]]