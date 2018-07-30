
$(function () {
        // 这个标记是打印机用的
        var flag = true;
        // fullpage.js全屏滚动
        $('#dowebok').fullpage({
            //切换页面滚动速度
            scrollingSpeed: 300,
            //左右滑块的位置
            slidesNavigation: true,
            //左右滑块是否循环滑动
            loopHorizontal: true,
            sectionsColor: ['#2b7e93', '#018f7e', '#475c85', '#78a355','#3e4145'],
            verticalCentered: true,
            afterLoad: (anchorLink, index) => {
                //第二屏
                if (index == 2) {

                }
                //第四屏-----------------------------------
                if (index == 4) {
                    function init() {
                        var speed = 330,
                            easing = mina.backout;

                        [].slice.call(document.querySelectorAll('#grid > a')).forEach(function (el) {
                            var s = Snap(el.querySelector('svg')), path = s.select('path'),
                                pathConfig = {
                                    from: path.attr('d'),
                                    to: el.getAttribute('data-path-hover')
                                };

                            el.addEventListener('mouseenter', function () {
                                path.animate({ 'path': pathConfig.to }, speed, easing);
                            });

                            el.addEventListener('mouseleave', function () {
                                path.animate({ 'path': pathConfig.from }, speed, easing);
                            });
                        });
                    }
                    init();
                }
                // 第五屏---------------------------------
                if (index == 5) {
                    //打字机,只有第一次进来有效,不然有bug
                    if (flag == true) {
                        flag = false;
                        $('.type-it').typeIt({
                            whatToType: ['别和我谈TM的爱情!我现在只想搞钱!!', '不好意思打错了....', '梦想与未来,用我的指尖敲下!!!'],
                            typeSpeed: 200,
                            lifeLike: true,
                            showCursor: true,
                            breakLines: false
                        }, function () {
                            console.log('你好呀!--来自一只前端攻城狮的问候.')
                        });

                    }
                }
            },
        });

        // 贴纸
        Sticker.init('.sticker');

        // 鼠标移入头像
        // $('.section1 img').mouseenter(function () {
        //     $('.section1 .popUp').show();
        // })

        // 页面中英文切换
        // $("#change").click(function () {
        //     translate();
        // })

    });
    //以下是禁止用户行为--------------------------------------------------
    window.onkeydown = window.onkeyup = window.onkeypress = function (event) {
        // 判断是否按下F12，F12键码为123
        if (event.keyCode == 123) {
            event.preventDefault(); // 阻止默认事件行为
            window.event.returnValue = false;
            alert('彩蛋还在开发中哈~');
        }
    }
    // 为右键添加自定义事件，可以禁用
    window.oncontextmenu = function () {
        event.preventDefault(); // 阻止默认事件行为
        return false;
    }