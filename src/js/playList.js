(function ($, root) {

    var $scope = $(document.body);
    var control;
    var $playList = $("<div class='play-list'>"+
                        "<div class='play-header'>播放列表</div>" + 
                        "<ul class='list-wrapper'></ul>" +
                        "<div class='close-btn'>关闭</div>"+
                    "</div>");
    
    //渲染歌曲列表
    function renderList(songList) {
        var html = '';
        for (var i = 0; i < songList.length; i ++) {
            html += "<li><h3 >"+songList[i].song+"<span> - "+songList[i].singer+"</span></h3></li>";
        }
        $playList.find('ul').html(html);
        $scope.append($playList);
        bindEvent();
    }

    function bindEvent() {

        $playList.on('click', '.close-btn', function () {

            $playList.removeClass('show');

        }).find('li').on('click', function () {

            var index = $(this).index();
            singSong(index);
            control.index = index;
            $scope.trigger("play:change",[index,true]);
            $scope.find(".play-btn").addClass("playing");
            //收起列表
            setTimeout(function(){
                $playList.removeClass("show")
            }, 200);

        })
        
    }

    function show(controlmanager){
        control = controlmanager;
        $playList.addClass("show");
        singSong(control.index);
    }

    function singSong(index){
        $playList.find(".sing").removeClass("sing");
        $playList.find("ul li").eq(index).addClass("sing");
    }

    root.playList = {
        renderList,
        show
    }

})(window.Zepto, window.player || (window.player = {}))