onReady(() => {
    let filters = {
        // "filterID": {
        //     controllers: [],
        //     targets: []
        // }
    };

    let allTargets = Array.from($$("*[filterTarget]"));
    Array.from($$("*[filter]")).forEach(filter => {
        let attr = filter.getAttribute("filter");
        filters[attr] = filters[attr] ?? {controllers: new Set(), targets: new Set()};
        filters[attr].controllers.add(filter);

        allTargets.filter(t => t.getAttribute("filterTarget") === attr).forEach(t => filters[attr].targets.add(t));

        filter.addEventListener("change", (event) => {
            let f = filters[event.target.getAttribute("filter")];
            filterItems(f.targets, f.controllers);
        });
    });
});

function filterItems(targets, controllers) {
    targets.forEach(target => {
        target.classList.toggle("hidden", ![...controllers].every(c => target.innerText.includes(c.value)));
    });
}