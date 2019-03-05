var root = window.player;
var audio = root.audioManager;  //音频管理模块，play pause prev next
var $scope = $(document.body);
var dataList; //请求的数据
var len; //请求数据的长度
var control; //歌曲index计算模块
var timer;
var curDeg = $('.img-box').attr('data-deg');

getData('../mock/data.json');

//信息图片渲染到页面上、图片旋转、点击按钮、切歌、进度条拖拽与运动、列表切歌

function getData(url) {
    $.ajax({
        type: 'GET',
        url: url,
        success: function (data) {
            dataList = data;
            root.playList.renderList(dataList);
            control = new root.controlIndex(dataList.length);   //传入长度以计算切歌对应的index
            root.render(dataList[0]); //渲染图片和歌曲信息到页面
            audio.getAudio(dataList[0].audio);  //加载mp3资源
            bindClick();    //点击按钮、切歌
            bindTouch();
            $scope.trigger('play:change', 0);
        },
        error: function () {
            console.log(url);
        }
    })
}

function bindClick() {

    $scope.on('play:change', function (e, index) {
        audio.getAudio(dataList[index].audio);
        if (audio.status === 'play') {
            audio.play();
            root.pro.start();
            rotated(0);
        } else {
            root.pro.update(0)
        }
        $scope.find('.cur-time').html('00:00'); //切换歌曲后歌曲进度恢复为00:00
        root.render(dataList[index]);
        root.pro.renderAllTime(dataList[index].duration)
        $('.img-box').attr('data-deg', 0)
                     .css({
                        'transform': 'rotateZ(0deg)',
                        'transition': 'none'
                     })
    })

    $('.prev').on('click', function () {
        var i = control.prev();
        $scope.trigger('play:change', i);
    })

    $('.next').on('click', function () {
        var i = control.next();
        $scope.trigger('play:change', i);        
    })

    $('.play').on('click', function () {
        if (audio.status === 'pause') {
            audio.play();
            root.pro.start();
            rotated(curDeg);
        } else {
            audio.pause();
            root.pro.stop();
            clearInterval(timer);
        }
        $(this).toggleClass('playing');
    })

    $scope.on("click", ".list", function () {
        root.playList.show(control);
    })

    $scope.on("click", ".like", function () {
        $(this).toggleClass('liking');
    })
}

function bindTouch() {
    var $slider = $scope.find('.slider');
    var offset = $scope.find('.pro-bottom').offset();
    var left = offset.left;
    var width = offset.width;

    $slider.on('touchstart', function () {
        root.pro.stop();
    }).on('touchmove', function (e) {
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if (per > 0 && per <= 1) {
            root.pro.update(per);
        }
    }).on('touchend', function (e) {
        var x = e.changedTouches[0].clientX;
        var per = (x - left) / width;
        if (per > 0 && per <= 1) {
            var curTime = per * dataList[control.index].duration;
            audio.playTo(curTime);
            $scope.find('.play').addClass('playing');
            root.pro.start(per);
            rotated(curDeg)
        }
    })
}

function rotated(deg) {
    clearInterval(timer);
    deg = +deg
    timer = setInterval(function () {
        deg += 1;
        curDeg = deg;
        $('.img-box').attr('data-deg', deg)
                     .css({
                        'transform': 'rotateZ(' + deg + 'deg)',
                        'transition': 'all 0.1s linear'
                     })
    }, 20)
}