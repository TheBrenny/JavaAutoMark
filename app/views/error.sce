[[i= partials/meta ]]
[[i= partials/header ]]
<div id="error">
    <h1>[[error.code]] - [[error.name]]</h1>
    <p>[[error.message]]</p>
    [[?= error.stack ]]
    <div class="preWrap">
        <pre>[[error.stack]]</pre>
    </div>
    [[?==]]
</div>
[[i= partials/footer]]