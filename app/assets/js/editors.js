ace.config.set("basePath", "https://cdnjs.cloudflare.com/ajax/libs/ace/1.4.12/");
globalThis.allEditors = [];

function getAllUninitialisedEditors() {
    return $$(".editor:not(.initialised)");
}

function createEditor(selector, type) {
    if (!(selector instanceof HTMLElement)) selector = document.querySelector(selector);
    selector.style.border = "1px solid #7e7f83ff";

    const width = selector.clientWidth;
    const minHeight = selector.clientHeight;
    const value = selector.innerText;
    selector.innerText = "";
    let editor = ace.edit(selector);
    editor.setOptions({
        value,
        fontSize: 12,
        mode: "ace/mode/java",
        theme: "ace/theme/eclipse",
        showFoldWidgets: false,
        minLines: 3,
        maxLines: Infinity,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });

    // editor.addAction({
    //     id: 'save',
    //     label: 'Save',
    //     keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
    //     run: function () {
    //         // TODO: SAVE
    //         console.log("save");
    //     }
    // });
    
    selector.classList.toggle("initialised");
    allEditors.push(editor);
    return editor;
}

function makeEditors() {
    let editors = getAllUninitialisedEditors();
    editors.forEach(function (editor) {
        createEditor(editor);
    });
}