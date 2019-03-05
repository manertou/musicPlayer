(function ($, root) {

    //getAudio play pause
    function AudioManager() {
        this.audio = new Audio();   //创建音频对象
        this.status = 'pause';      //设置audio默认状态
    }

    AudioManager.prototype = {
        play: function () {
            this.audio.play();
            this.status = 'play';
        },
        pause: function () {
            this.audio.pause();
            this.status = 'pause';
        },
        getAudio: function (src) {
            this.audio.src = src;
            this.audio.load();
        },
        playTo: function (curTime) {
            this.audio.currentTime = curTime;
            this.play();
        }
    }

    root.audioManager = new AudioManager();

})(window.Zepto, window.player || (window.player = {}))