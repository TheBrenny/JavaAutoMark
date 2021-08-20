[[i= partials/meta ]]
<!--
        THIS IS THE CONTAINER TO HOLD THE LOGIN FORM
        INPUTS:
            user
            pass
        OUTPUTS:
            login
            forgot password
            
        UTILISE COMMAND BELOW FOR WATCHING SASS
        node_modules\.bin\gulp.cmd watch
    -->
<div id="login_container">
    <h1>Log in</h1>
    <form name="login_form" action="/login" method="post">

        <!--<label for="user">zID:</label>-->
        <input type="text" name="user" placeholder="zID" />

        <!--<label for="pass">Password:</label>-->
        <input type="password" name="pass" placeholder="Password" />
        <p class="error" id="wrongPassword" href=""></p>

        <input type="submit" value="Log in" />

    </form>
</div>

[[?= badLogin ]]
<script nonce="[[nonce]]">
    wrongPassword($("#wrongPassword"), "[[badLogin]]");
</script>
[[?==]]

[[i= partials/footer ]]