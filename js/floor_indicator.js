var floorIndicator = {
    minHeight: $('section').offset().top - 180,//父元素到页面顶部的距离----提前180px出现，可修改
    fixedHeight: $('section').offset().top - 80,//根据CSS中fixed后的top距离进行相减
    numChildren: $('section>div').length,//子元素个数
    arrHeight: [],//存储子元素的高度
    linHeight: null,//临时记录对比高度
    monitor: false,//是否已经启用位置监听
    customizeOn: null,//是否启用自定义颜色
    slideBg: 'rgba(0, 0, 0, 0.4)',//默认背景色
    slideBgA: '#e4393c',//默认激活色背景色
    heightNow: null,//实时监听页面滚动定时器
    beforeHeight: null,//之前已滚动距离
    nowHeight: null,//现在已滚动距离
    start: function () {//载入开始

        //存储所有子分类的高度
        for (var i = 0; i < this.numChildren; i++) {
            this.arrHeight.push(parseInt($($('section>div')[i]).css('height')));
        }
        this.customizeColor();
        //清除多余定时器
        setInterval(function () {
            if (this.nowHeight === this.beforeHeight) {
                clearInterval(this.heightNow);
                this.monitor = false;
            }
        }, 3000);
        this.jump();
        this.scroll();
    },
    customizeColor: function () {//判断是否启用其定义颜色
        if ($('section>div[data-color]').length > 0) {
            this.customizeOn = true;
            if ($('section').children('div').eq(0).attr('data-color')) {
                $('.slide').children('li').eq(0).addClass('active').css('background', $('section').children('div').eq(0).attr('data-color'));
            }
            this.hoverChange();
        }
        else {
            this.customizeOn = false;
        }
    },
    hoverChange: function () {//自定义鼠标放上改变颜色事件
        $('.slide').on('mouseenter', 'li:not(.active)', function (event) {
            var it = event.currentTarget,//当前点击对象，因为this已经被占用
                i = $('section .slide li').index(it);
            if ($('section').children('div').eq(i).attr('data-color')) {
                $('.slide').children('li').eq(i).css('background', $('section').children('div').eq(i).attr('data-color'));
            }
            else {
                $('.slide').children('li').eq(i).css('background', this.slideBgA);
            }
        }.bind(this));
        $('.slide').on('mouseleave', 'li:not(.active)', function (event) {
            var it = event.currentTarget;//当前点击对象，因为this已经被占用
            $(it).css('background', this.slideBg);
        }.bind(this));
    },
    jump: function () {//点击侧边栏跳转事件
        $('.slide').on('click', 'li a', function (event) {
            event.preventDefault();
            var it = event.currentTarget,//当前点击对象，因为this已经被占用
                i = $('section .slide li').index($(it).parent()[0]);
            //滚动动画效果
            $('body,html').animate({
                scrollTop: $('section').children('div').eq(i).offset().top
            }, 200);
            //元素状态切换
            if ($('.slide').children('li').eq(i)[0] !== $('.slide .active')[0]) {//排除多余操作
                if (this.customizeOn === true) {//是否启动了用户自定义颜色
                    $('.slide .active').removeClass('active').css('background', this.slideBg);
                    if ($('section').children('div').eq(i).attr('data-color')) {
                        $('.slide').children('li').eq(i).addClass('active').css('background', $('section').children('div').eq(i).attr('data-color'));
                    }
                    else {
                        $('.slide').children('li').eq(i).addClass('active').css('background', this.slideBgA);
                    }
                }
                else {
                    $('.slide .active').removeClass('active');
                    $('.slide').children('li').eq(i).addClass('active');
                }
            }
        }.bind(this));
    },
    scroll: function () {//滚动事件
        $('html').on('mousewheel', function () {
            if (this.monitor === false) {//避免重复启动定时器
                this.beforeHeight = $(window).scrollTop();
                this.monitor = true;
                this.heightNow = setInterval(function () {//保证实时性，因为直接在wheel中判断会有问题
                    this.nowHeight = $(window).scrollTop();
                    if (this.beforeHeight !== this.nowHeight) {
                        this.beforeHeight = this.nowHeight;
                        if (this.nowHeight >= this.minHeight) {//是否显示指示器
                            $('.slide').addClass('show');
                            if (this.nowHeight >= this.fixedHeight) {//是否开始移动指示器
                                $('.slide').addClass('fixed');
                                if (this.nowHeight >= $('section').offset().top) {//指示器开始变化判断
                                    this.linHeight = $('section').offset().top;
                                    for (var i = 0; i < this.numChildren; i++) {
                                        this.linHeight += this.arrHeight[i];
                                        if (this.nowHeight < this.linHeight) {
                                            if ($('.slide').children('li').eq(i)[0] !== $('.slide .active')[0]) {
                                                if (this.customizeOn === true) {//是否启动了用户自定义颜色
                                                    $('.slide .active').removeClass('active').css('background', this.slideBg);
                                                    if ($('section').children('div').eq(i).attr('data-color')) {
                                                        $('.slide').children('li').eq(i).addClass('active').css('background', $('section').children('div').eq(i).attr('data-color'));
                                                    }
                                                    else {
                                                        $('.slide').children('li').eq(i).addClass('active').css('background', this.slideBgA);
                                                    }
                                                }
                                                else {
                                                    $('.slide .active').removeClass('active');
                                                    $('.slide').children('li').eq(i).addClass('active');
                                                }
                                            }
                                            break;
                                        }
                                        else {//最后一个
                                            if (i === (this.numChildren - 1)) {
                                                $('.slide').removeClass('show');
                                            }
                                        }
                                    }
                                }
                            }
                            else {
                                $('.slide').removeClass('fixed');
                            }
                        }
                        else {
                            $('.slide').removeClass('show');
                        }
                    }
                }.bind(this), 10);
            }
        }.bind(this));
    }
};