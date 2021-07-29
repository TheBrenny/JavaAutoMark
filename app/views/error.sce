<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>scetch - the newest templating engine!</title>
</head>
<body>
<h1>[[error.code]] - [[error.name]]</h1>
<p>[[error.message]]</p>
[[?= error.stack ]]
<code>[[error.stack]]</code>
[[?==]]
</body>
</html>