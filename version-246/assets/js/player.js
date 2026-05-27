(function () {
    var shell = document.querySelector('[data-player]');
    if (!shell) {
        return;
    }

    var video = shell.querySelector('video');
    var button = shell.querySelector('[data-play-button]');
    var status = shell.querySelector('[data-player-status]');
    var source = shell.getAttribute('data-source');
    var started = false;
    var hls = null;

    function setStatus(message) {
        if (status) {
            status.textContent = message;
        }
    }

    function playVideo() {
        var promise = video.play();
        if (promise && typeof promise.catch === 'function') {
            promise.catch(function () {
                setStatus('请再次点击播放');
            });
        }
    }

    function bindSource() {
        if (started) {
            playVideo();
            return;
        }

        started = true;
        if (button) {
            button.classList.add('hidden');
        }
        setStatus('正在加载');

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            video.addEventListener('loadedmetadata', playVideo, { once: true });
            return;
        }

        if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(window.Hls.Events.MANIFEST_PARSED, function () {
                setStatus('高清线路');
                playVideo();
            });
            hls.on(window.Hls.Events.ERROR, function (event, data) {
                if (data && data.fatal && hls) {
                    if (data.type === window.Hls.ErrorTypes.NETWORK_ERROR) {
                        hls.startLoad();
                    } else if (data.type === window.Hls.ErrorTypes.MEDIA_ERROR) {
                        hls.recoverMediaError();
                    } else {
                        setStatus('当前线路加载失败');
                    }
                }
            });
            return;
        }

        video.src = source;
        video.addEventListener('loadedmetadata', playVideo, { once: true });
    }

    if (button) {
        button.addEventListener('click', bindSource);
    }

    video.addEventListener('play', function () {
        if (button) {
            button.classList.add('hidden');
        }
        setStatus('播放中');
    });

    video.addEventListener('pause', function () {
        if (!video.ended) {
            setStatus('已暂停');
        }
    });
})();
