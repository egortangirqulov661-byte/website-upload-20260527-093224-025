import { H as Hls } from './hls-vendor-bbsaiqh1.js';

(function () {
    var video = document.getElementById('video-player');
    var startButton = document.querySelector('[data-player-start]');
    var note = document.querySelector('[data-player-note]');
    var hls = null;
    var initialized = false;

    function setNote(message) {
        if (note) {
            note.textContent = message;
        }
    }

    function initializePlayer() {
        if (!video || initialized) {
            return Promise.resolve();
        }

        var source = video.dataset.src;
        initialized = true;

        if (!source) {
            setNote('当前影片暂未配置播放源。');
            return Promise.resolve();
        }

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = source;
            setNote('已使用浏览器原生 HLS 播放。');
            return Promise.resolve();
        }

        if (Hls && Hls.isSupported()) {
            hls = new Hls({
                enableWorker: true,
                lowLatencyMode: true,
                backBufferLength: 90
            });
            hls.loadSource(source);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, function () {
                setNote('播放源加载完成。');
            });
            hls.on(Hls.Events.ERROR, function (event, data) {
                if (!data || !data.fatal) {
                    return;
                }
                if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
                    setNote('网络错误，正在重试播放源。');
                    hls.startLoad();
                } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
                    setNote('媒体错误，正在尝试恢复。');
                    hls.recoverMediaError();
                } else {
                    setNote('播放失败，请刷新页面重试。');
                    hls.destroy();
                }
            });
            return Promise.resolve();
        }

        setNote('当前浏览器不支持 HLS 播放。');
        return Promise.resolve();
    }

    function playVideo() {
        initializePlayer().then(function () {
            if (!video) {
                return;
            }
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {
                    setNote('浏览器阻止了自动播放，请再次点击播放按钮。');
                });
            }
        });
    }

    if (startButton) {
        startButton.addEventListener('click', function () {
            startButton.classList.add('is-hidden');
            playVideo();
        });
    }

    if (video) {
        video.addEventListener('play', function () {
            if (startButton) {
                startButton.classList.add('is-hidden');
            }
        });
        video.addEventListener('pause', function () {
            if (startButton && video.currentTime === 0) {
                startButton.classList.remove('is-hidden');
            }
        });
        video.addEventListener('error', function () {
            setNote('视频加载异常，请检查播放源或网络。');
        });
        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }
})();
