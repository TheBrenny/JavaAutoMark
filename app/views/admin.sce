[[i= partials/meta]]

[[i= partials/header]]

<div id="adminContainer">
    <div class="column"  id="teachCon">
        <div class="tile" id="viewTeach">
            <a href="/viewteacher">
                <i class="fas fa-users fa-6x"></i>
                <h1>view teach</h1>
            </a>
        </div>

        <div class="tile" id="newTeach">
            <a href="/createteacher">
                <i class="fas fa-user-plus fa-6x"></i>
                <h1>new teach</h1>
            </a>
        </div>
    </div>

    <div class="separator"></div>

    <div class="column" id="classCon">
        <div class="tile" id="viewClass">
            <a href="/">
                <i class="fas fa-chalkboard fa-6x"></i>
                <h1>view class</h1>
            </a>
        </div>

        <div class="tile" id="newClass">
            <a href="/">
                <!-- Using 3x here instead of 6x is because fa doubles the size anyway! -->
                <span class="fa-stack fa-3x">
                    <i class="fas fa-stack-2x fa-chalkboard"></i>
                    <i class="fas fa-stack-1x fa-plus"></i>
                </span>
                <h1>new class</h1>
            </a>
        </div>
    </div>
</div>

[[i= partials/footer]]