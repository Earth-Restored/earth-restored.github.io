(function () {
    var tabBtns = document.querySelectorAll('.tab-btn');
    var tabPanels = document.querySelectorAll('.tab-panel');
    var gotoTabBtns = document.querySelectorAll('.goto-tab');

    function activateTab(name) {
        tabBtns.forEach(function (btn) {
            btn.classList.toggle('active', btn.dataset.tab === name);
        });
        tabPanels.forEach(function (panel) {
            panel.classList.toggle('active', panel.id === 'tab-' + name);
        });
        window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
    }

    tabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            activateTab(btn.dataset.tab);
        });
    });

    gotoTabBtns.forEach(function (btn) {
        btn.addEventListener('click', function () {
            activateTab(btn.dataset.tab);
        });
    });
})();

(function () {
    var bar = document.getElementById('page-load-bar');
    var w = 0;
    var iv = setInterval(function () {
        w += Math.random() * 15;
        if (w > 85) w = 85;
        bar.style.width = w + '%';
    }, 200);
    window.addEventListener('load', function () {
        clearInterval(iv);
        bar.style.width = '100%';
        bar.style.transition = 'width 0.2s ease, opacity 0.5s ease 0.3s';
        setTimeout(function () { bar.style.opacity = '0'; }, 300);
        setTimeout(function () { bar.style.display = 'none'; }, 900);
    });
})();

(function () {
    document.querySelectorAll('.faq-question').forEach(function (question) {
        var item = question.closest('.faq-item');

        function toggle() {
            var isOpen = item.classList.toggle('open');
            question.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        }

        question.addEventListener('click', toggle);
        question.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggle();
            }
        });
    });
})();

(function () {
    function fallbackCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.focus();
        ta.select();
        try {
            document.execCommand('copy');
        } catch (err) { }
        document.body.removeChild(ta);
    }

    document.addEventListener('click', function (e) {
        var btn = e.target.closest('.copy-btn');
        if (!btn) return;
        var code = btn.parentElement.querySelector('pre code');
        if (!code) return;
        var text = code.textContent;

        function showCopied() {
            var original = btn.textContent;
            btn.textContent = 'Copied!';
            btn.classList.add('copied');
            setTimeout(function () {
                btn.textContent = original;
                btn.classList.remove('copied');
            }, 1500);
        }

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(showCopied, function () {
                fallbackCopy(text);
                showCopied();
            });
        } else {
            fallbackCopy(text);
            showCopied();
        }
    });
})();