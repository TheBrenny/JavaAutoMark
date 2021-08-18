<div class="test" data-order="[[order]]" data-testid="[[testID]]">
    <ul>
        <li class="moveUp"></li>
        <li class="testID">Test [[testID]]</li>
        <li class="moveDown"></li>
    </ul>
    <div class="testCenter">
        <div class="editor">[[code]]</div>
        <div class="testDeets">
            <input class="out small" type="text" name="expectedOutput" placeholder="Expected output" value="[[expected]]" />
            <input class="num small mark" type="number" name="marks" placeholder="Marks" value="[[marks]]" />
    
            <input class="desc" type="text" name="description" placeholder="Test Case Description" value="[[description]]" />
        </div>
    </div>
    <input type="button" name="Delete" class="del" />
</div>