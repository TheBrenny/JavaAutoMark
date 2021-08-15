var require = {
    paths: {
        'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.26.1/min/vs'
    }
};

function createEditor(selector, type) {
    if (!(selector instanceof HTMLElement)) selector = document.querySelector(selector);
    return monaco.editor.create(selector, {
        value: `System.out.println("Enter valid code here");`,
        language: 'java'
    });
}