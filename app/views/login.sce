[[i= partials/header ]]
    <!--
        THIS IS THE CONTAINER TO HOLD THE LOGIN FORM
        INPUTS:
            user
            pass
        OUTPUTS:
            login
            forgot password
            
    -->
    <div id="login_container">
        <h1>Log in</h1>
        <form name="login_form" action="" method="post">

            <!--<label for="user">zID:</label>-->
            <input type="text" name="user" placeholder="zID" />

            <!--<label for="pass">Password:</label>-->
            <input type="password" name="pass" placeholder="Password" />
            <a id="forgotPass" href="">Forgot password?</a>

            <input type="submit" value="Log in" />

        </form>
    </div>
[[i= partials/footer ]]