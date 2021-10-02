[[i= partials/meta ]]

<div id="login_container">
    <h1>Log in</h1>
    <form name="login_form" action="/login" method="post">

        <!--<label for="user">zID:</label>-->
        <input type="text" name="user" placeholder="zID" />

        <!--<label for="pass">Password:</label>-->
        <input type="password" name="pass" placeholder="Password" />
        <p class="error" id="wrongPassword"></p>

        <input type="submit" value="Log in" />

    </form>
</div>

[[?= badLogin ]]
<script nonce="[[nonce]]">
    function wrongPassword(element, message) {
        element.innerHTML = message || "Something went wrong!";
        element.style.animation = ".5s shake";
    }
    onLoad(() => wrongPassword($("#wrongPassword"), "[[badLogin]]"));
</script>
[[?==]]

[[i= partials/footer ]]