window.addEventListener('load', function () {
    function RotationPlot() {
        this.focus = null;  //大盒子
        this.arrow_t = null;  //左侧按钮
        this.arrow_b = null;  //右侧按钮
        this.focusHeight = null;  //盒子高度
        this.ul = null;  //图片盒子
        this.ol = null;  //动态生成的小圆圈
        this.num = 0;  //控制图片
        this.circle = 0;  //控制小圆圈
        this.timer;
    }

    //初始化
    RotationPlot.prototype.init = function () {
        var that = this;
        this.block();
        this.circleMove();
        this.bottomPoint();
        this.topPoint();
        this.timer = setInterval(function () {
            that.arrow_b.click();
        }, 3000);
    }

    //1.鼠标放到盒子上显示箭头
    RotationPlot.prototype.block = function () {
        var that = this;
        this.focus.onmouseenter = function () {
            that.arrow_t.style.display = 'block';
            that.arrow_b.style.display = 'block';
            clearInterval(that.timer);
            that.timer = null;  //清除定时器变量
        }
        this.focus.onmouseleave = function () {
            that.arrow_t.style.display = 'none';
            that.arrow_b.style.display = 'none';
            that.timer = setInterval(function () {
                that.arrow_b.click();
            }, 3000);
        }
    }

    // 小圆圈
    RotationPlot.prototype.circleMove = function () {
        var that = this;
        for (var i = 0; i < this.ul.children.length; i++) {
            var li = document.createElement('li');
            li.setAttribute('index', i);
            this.ol.appendChild(li);
            //  2.小圆圈的排他思想 我们可以直接在生成小圆圈的同时直接绑定点击事件
            li.addEventListener('click', function () {
                // 干掉所有人 把所有的小li 清除 current 类名
                for (var i = 0; i < that.ol.children.length; i++) {
                    that.ol.children[i].className = '';
                }
                this.className = 'current';

                //  3.点击小圆圈，移动图片 当然移动的是 ul 
                var index = this.getAttribute('index');
                that.num = index;
                that.circle = index;
                animate(that.ul, -index * that.focusHeight);
            });
        }
        this.ol.children[0].className = 'current';
        // 4. 克隆第一张图片(li)放到ul 最后面
        var first = this.ul.children[0].cloneNode(true);
        this.ul.appendChild(first);
    }

    // 5.下侧按钮
    RotationPlot.prototype.bottomPoint = function () {
        var that = this;
        // flag 节流阀
        var flag = true;
        this.arrow_b.onclick = function () {
            if (flag) {
                flag = false;  //关闭节流阀
                if (that.num == that.ul.children.length - 1) {
                    that.ul.style.top = 0;
                    that.num = 0;
                }
                that.num++;
                animate(that.ul, -that.num * that.focusHeight, function () {
                    flag = true;  //打开节流阀
                });
                // 6. 点击右侧按钮，小圆圈跟随一起变化 可以再声明一个变量控制小圆圈的播放
                that.circle++;
                if (that.circle == that.ol.children.length) {
                    that.circle = 0;
                }
                that.circleChange();
            }
        }
    }

    // 7.上侧按钮
    RotationPlot.prototype.topPoint = function () {
        var that = this;
        // flag 节流阀
        var flag = true;
        this.arrow_t.onclick = function () {
            if (flag) {
                flag = false;  //关闭节流阀
                if (that.num == 0) {
                    that.num = that.ul.children.length - 1;
                    that.ul.style.top = -that.num * that.focusHeight + 'px';
                }
                that.num--;
                animate(that.ul, -that.num * that.focusHeight, function () {
                    flag = true;  //打开节流阀
                });
                that.circle--;
                // 如果circle < 0  说明第一张图片，则小圆圈要改为第4个小圆圈（3）
                that.circle = that.circle < 0 ? that.ol.children.length - 1 : that.circle;
                that.circleChange();
            }
        }
    }

    // 8.小圆圈类名切换
    RotationPlot.prototype.circleChange = function () {
        for (var i = 0; i < this.ol.children.length; i++) {
            this.ol.children[i].className = '';
        }
        this.ol.children[this.circle].className = 'current'
    }


    var rotation = new RotationPlot();
    rotation.arrow_t = document.querySelector('.arrow-l');
    rotation.arrow_b = document.querySelector('.arrow-r');
    rotation.focus = document.querySelector('.focus');
    rotation.ul = rotation.focus.querySelector('ul');
    rotation.ol = rotation.focus.querySelector('.circle');
    rotation.focusHeight = rotation.focus.offsetHeight;

    rotation.init();
    // console.log(1);
})


