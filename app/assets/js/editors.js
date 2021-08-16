var require = {
    paths: {
        'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs'
    }
};

function createEditor(selector, type) {
    if (!(selector instanceof HTMLElement)) selector = document.querySelector(selector);
    selector.style.border = "1px solid #7e7f83ff";

    const width = selector.clientWidth;
    const minHeight = selector.clientHeight;
    const value = selector.innerText;
    selector.innerText = "";
    let editor = monaco.editor.create(selector, {
        value,
        language: 'java',
        minimap: {
            enabled: false
        },
        fontSize: 12,
        folding: false,
        glyphMargin: false,
        lineNumbersMinChars: 2,
        lineDecorationsWidth: 5,
        overviewRulerLanes: 0,
        scrollBeyondLastLine: false
    });

    editor.addAction({
        id: 'save',
        label: 'Save',
        keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
        run: function () {
            // TODO: SAVE
            console.log("save");
        }
    });

    let ignoreEvent = false;
    const updateHeight = () => {
        const contentHeight = Math.min(1000, Math.max(minHeight, editor.getContentHeight()));
        selector.style.width = `${selector.clientWidth}px`;
        selector.style.height = `${contentHeight}px`;
        try {
            ignoreEvent = true;
            editor.layout({
                width,
                height: contentHeight
            });
        } finally {
            ignoreEvent = false;
        }
    };
    editor.onDidContentSizeChange(updateHeight);
    updateHeight();

    return editor;
}

function makeEditors() {
    let editors = $$(".editor:not(.initialised)");
    editors.forEach(function (editor) {
        createEditor(editor);
        editor.classList.toggle("initialised");
    });
}