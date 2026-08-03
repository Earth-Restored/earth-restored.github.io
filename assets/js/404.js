(function () {
    var hole = document.getElementById('nf-hole');
    var lantern = document.getElementById('lantern-cursor');
    if (!hole) return;

    var TOUCH_LIFT = 72;

    function reset() {
        hole.style.setProperty('--mx', '-9999px');
        hole.style.setProperty('--my', '-9999px');
        if (lantern) lantern.style.display = 'none';
    }

    function updatePosition(e) {
        var rect = hole.getBoundingClientRect();
        var lift = e.pointerType === 'touch' ? TOUCH_LIFT : 0;
        var x = e.clientX - rect.left;
        var y = (e.clientY - lift) - rect.top;
        hole.style.setProperty('--mx', x + 'px');
        hole.style.setProperty('--my', y + 'px');
        if (lantern) {
            lantern.style.left = e.clientX + 'px';
            lantern.style.top = (e.clientY - lift) + 'px';
        }
    }

    hole.addEventListener('pointerdown', function (e) {
        updatePosition(e);
        if (lantern) lantern.style.display = 'block';
    });

    hole.addEventListener('pointerenter', function (e) {
        updatePosition(e);
        if (lantern) lantern.style.display = 'block';
    });

    hole.addEventListener('pointermove', function (e) {
        updatePosition(e);
        if (e.pointerType === 'touch' && e.cancelable) e.preventDefault();
    });

    hole.addEventListener('pointerleave', reset);
    hole.addEventListener('pointerup', function (e) {
        if (e.pointerType === 'touch') reset();
    });
    hole.addEventListener('pointercancel', reset);
})();