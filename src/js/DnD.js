let currentDrag;

document.addEventListener('dragstart', (e) => {
    const zone = getCurrentZone(e.target);

    if (zone) {
        currentDrag = { startZone: zone, node: e.target };
    }

});

document.addEventListener('dragover', (e) => {

    if (getCurrentZone(e.target)) {
        e.preventDefault();
    }
});

document.addEventListener('drop', (e) => {

    if (currentDrag) {
        const zone = getCurrentZone(e.target);
        const event = new Event('friendDrop', { bubbles: true, cancelable: false });

        e.preventDefault();

        if (zone && currentDrag.startZone !== zone) {

            if (e.target.classList.contains('friend')) {
                zone.insertBefore(currentDrag.node, e.target.nextElementSibling);
                e.target.classList.add('insert-after');
            } else {
                zone.appendChild(currentDrag.node);
            }

            currentDrag.node.classList.add('dropped-friend');

            e.target.dispatchEvent(event);
        }

        currentDrag = null;
    }
});

function getCurrentZone(from) {
    do {
        if (from.classList.contains('list')) {
            return from;
        }
    } while (from = from.parentElement);

    return null;
}