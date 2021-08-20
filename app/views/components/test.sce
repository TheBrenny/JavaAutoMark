<div class="test" data-order="[[order]]" data-testid="[[testID]]">
    <ul>
        <li class="moveButton moveUp">
            <img draggable="false" src="/assets/img/items/arrow_up_grey.svg" alt="Move Up" />
        </li>
        <li>Task [[testID]]</li>
        <li class="moveButton moveDown">
            <img draggable="false" src="/assets/img/items/arrow_down_grey.svg" alt="Move Down" />
        </li>
    </ul>
    <div class="testCenter">
        <div class="editor">[[code]]</div>
        <div class="testDeets">
            <input class="out small" type="text" name="expectedOutput" placeholder="Expected output"
                value="[[expected]]" />
            <input class="num small mark" type="number" name="marks" placeholder="Marks" value="[[marks]]" />

            <input class="desc" type="text" name="description" placeholder="Test Case Description"
                value="[[description]]" />
        </div>
    </div>
    <!-- <input type="button" name="Delete" class="del" /> -->
    <button type="button" name="Delete" class="del">
        <img draggable="false" src="/assets/img/items/cross_grey.svg" alt="Delete" />
    </button>
</div>