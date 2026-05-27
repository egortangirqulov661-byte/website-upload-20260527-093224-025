(function () {
    function initMoviePlayer(options) {
        var video = document.querySelector(options.selector);
        var button = document.querySelector(options.button);
        var src = options.source;
        var hls = null;
        var prepared = false;

        function prepare() {
            if (prepared || !video || !src) {
                return;
            }
            prepared = true;
            if (video.canPlayType("application/vnd.apple.mpegurl")) {
                video.src = src;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({
                    maxBufferLength: 30,
                    enableWorker: true
                });
                hls.loadSource(src);
                hls.attachMedia(video);
            } else {
                video.src = src;
            }
        }

        function play() {
            prepare();
            if (button) {
                button.classList.add("is-hidden");
            }
            var attempt = video.play();
            if (attempt && typeof attempt.catch === "function") {
                attempt.catch(function () {
                    if (button) {
                        button.classList.remove("is-hidden");
                    }
                });
            }
        }

        if (!video) {
            return;
        }
        if (button) {
            button.addEventListener("click", play);
        }
        video.addEventListener("play", function () {
            if (button) {
                button.classList.add("is-hidden");
            }
        });
        video.addEventListener("click", function () {
            if (video.paused) {
                play();
            }
        });
        window.addEventListener("beforeunload", function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    window.initMoviePlayer = initMoviePlayer;
})();
