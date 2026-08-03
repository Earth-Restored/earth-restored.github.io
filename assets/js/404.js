(function () {
    var hole = document.getElementById('nf-hole');
    var lantern = document.getElementById('lantern-cursor');
    if (!hole) return;

    var TOUCH_FALLBACK_RADIUS = 18;
    var CURSOR_URL = "url('assets/404/grab.png') 9 6, grab";
    var STIFFNESS = 0.028;
    var DAMPING = 0.13;
    var DRIVE = 0.9;
    var MAX_ANGLE = 35;
    var MAX_VEL = 30;
    var TOUCH_DRIVE_SCALE = 0.45;
    var TOUCH_MAX_ANGLE_SCALE = 0.55;

    var pointerX = 0;
    var pointerY = 0;
    var lanternX = 0;
    var lanternY = 0;
    var prevLanternX = 0;
    var angle = 0;
    var angleVel = 0;
    var swingLen = 40;
    var halfWidth = 32;
    var active = false;
    var isTouch = false;
    var rafId = null;

    function anchorY(e) {
        if (e.pointerType === 'touch') {
            var h = e.height && e.height > 1 ? e.height : TOUCH_FALLBACK_RADIUS * 2;
            return e.clientY + h / 2;
        }
        return e.clientY;
    }

    function reset() {
        hole.style.setProperty('--mx', '-9999px');
        hole.style.setProperty('--my', '-9999px');
        hole.style.cursor = '';
        active = false;
        isTouch = false;
        angle = 0;
        angleVel = 0;
        if (lantern) lantern.style.display = 'none';
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    function applyLightPosition() {
        var rect = hole.getBoundingClientRect();
        var rad = angle * Math.PI / 180;
        var lightX = lanternX - Math.sin(rad) * swingLen;
        var lightY = lanternY + swingLen * Math.cos(rad);
        hole.style.setProperty('--mx', (lightX - rect.left) + 'px');
        hole.style.setProperty('--my', (lightY - rect.top) + 'px');
    }

    function tick() {
        if (!active) {
            rafId = null;
            return;
        }
        prevLanternX = lanternX;
        lanternX += (pointerX - lanternX) * 0.26;
        lanternY += (pointerY - lanternY) * 0.26;
        var lanternVelX = lanternX - prevLanternX;
        if (lanternVelX > MAX_VEL) lanternVelX = MAX_VEL;
        else if (lanternVelX < -MAX_VEL) lanternVelX = -MAX_VEL;

        var drive = isTouch ? DRIVE * TOUCH_DRIVE_SCALE : DRIVE;
        var maxAngle = isTouch ? MAX_ANGLE * TOUCH_MAX_ANGLE_SCALE : MAX_ANGLE;

        var angleAccel = -STIFFNESS * angle - DAMPING * angleVel - drive * lanternVelX;
        angleVel += angleAccel;
        angle += angleVel;
        if (angle > maxAngle) {
            angle = maxAngle;
            angleVel *= -0.4;
        } else if (angle < -maxAngle) {
            angle = -maxAngle;
            angleVel *= -0.4;
        }

        if (lantern) {
            lantern.style.left = (lanternX - halfWidth) + 'px';
            lantern.style.top = lanternY + 'px';
            lantern.style.setProperty('--tilt', angle.toFixed(2) + 'deg');
        }
        applyLightPosition();
        rafId = requestAnimationFrame(tick);
    }

    function updatePosition(e) {
        pointerX = e.clientX;
        pointerY = anchorY(e);

        if (!active) {
            active = true;
            isTouch = e.pointerType === 'touch';
            lanternX = pointerX;
            lanternY = pointerY;
            prevLanternX = pointerX;
            angle = 0;
            angleVel = 0;
            swingLen = lantern ? (lantern.offsetHeight || 64) * 0.66 : 42;
            halfWidth = lantern ? (lantern.offsetWidth || 64) / 2 : 32;
            if (lantern) {
                lantern.style.left = (lanternX - halfWidth) + 'px';
                lantern.style.top = lanternY + 'px';
                lantern.style.setProperty('--tilt', '0deg');
            }
            applyLightPosition();
            if (!rafId) rafId = requestAnimationFrame(tick);
        }
    }

    hole.addEventListener('pointerdown', function (e) {
        if (lantern) lantern.style.display = 'block';
        hole.style.cursor = CURSOR_URL;
        updatePosition(e);
    });

    hole.addEventListener('pointerenter', function (e) {
        if (lantern) lantern.style.display = 'block';
        hole.style.cursor = CURSOR_URL;
        updatePosition(e);
    });

    hole.addEventListener('pointermove', function (e) {
        pointerX = e.clientX;
        pointerY = anchorY(e);
        if (e.pointerType === 'touch' && e.cancelable) e.preventDefault();
    });

    hole.addEventListener('pointerleave', reset);
    hole.addEventListener('pointerup', function (e) {
        if (e.pointerType === 'touch') {
            reset();
        } else {
            hole.style.cursor = CURSOR_URL;
        }
    });
    hole.addEventListener('pointercancel', reset);
})();
