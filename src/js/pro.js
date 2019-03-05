//进度条模块
(function ($, root) {

    var $scope = $(document.body),
        curDuration,
        frameId,
        startTime,
        lastPer = 0;

    //渲染每一首歌的总时间
    function renderAllTime(time) {
        lastPer = 0; //每次切歌都从零开始播放
        curDuration = time;
        time = formatTime(time);
        $scope.find('.all-time').html(time)
    }

    //时间格式转换
    function formatTime(t){
        t = Math.round(t);
        var m = Math.floor(t / 60);
        var s = t - m * 60;
        if (m < 10) {
            m = '0' + m;
        } 
        if (s < 10) {
            s = '0' + s;
        }
        return m + ':' + s;
    }

    //开始时间
    function start(p) {
        lastPer = p ? p : lastPer;
        cancelAnimationFrame(frameId);
        startTime = new Date().getTime();
        function frame() {
            var curTime = new Date().getTime();
            var percent = lastPer + (curTime - startTime) / (curDuration * 1000);
            if (percent <= 1) {
                update(percent);
                frameId =  requestAnimationFrame(frame);
            } else {
                cancelAnimationFrame(frameId);
            }
        }
        frame();
    }

    //停止计时
    function stop() {
        clearInterval(timer);
        cancelAnimationFrame(frameId);
        var stopTime = new Date().getTime();
        lastPer = lastPer + (stopTime - startTime) / (curDuration * 1000);  //记录每次停止的进度
    }

    //更新进度条左侧时间、进度条运动
    function update(per) {
        // console.log(per)
        var curTime = curDuration * per;
        curTime = formatTime(curTime);
        $scope.find('.cur-time').html(curTime);
        var perX = (per - 1) * 100 + '%';
        $scope.find('.pro-top').css({
            'transform': 'translateX(' + perX + ')' 
        })
    }

    root.pro = {
        renderAllTime,
        start,
        stop,
        update
    }

})(window.Zepto, window.player || (window.player = {}))