export default {
    /*
    *   Animations.push({
    *        obj:object,
    *        povitX: number,
    *        povitY: number,
    *        speed: number,
    *        offsetLeft: number,
    *        offsetRight: number,
    *        times: number,
    *   })
    */
    
    /**
     * @description         旋转动画
     * @param  obj          精灵对象
     * @param  degree1      旋转角度1
     * @param  degree2      旋转角度2
     * @param  times        动画次数
     * @param  anti         是否无穷
     * @param  speed        速度
     */
    rotateAnimation() {
        // [{obj: obj1, degree1: 1, degree2: 2, times: 1, anti: true, callback: fn}]
        rotateAnimations.forEach(function(r) {
            const speed = r.speed || 0.01;
            if (!r.revert && r.obj.rotation <= r.degree1) {
                r.obj.rotation += (r.anti ? speed : -speed);
            } else if (!r.revert && r.obj.rotation > r.degree1){
                if (!isNaN(r.degree2)) {
                    r.revert = true;
                } else {
                    if (typeof r.callback === 'function') {
                        r.callback.call();
                        r.callback = null;
                    }
                }
            } else if (r.revert && r.obj.rotation > r.degree2) {
                r.obj.rotation -= (r.anti ? speed : -speed);
            } else if (r.revert && r.obj.rotation <= r.degree2) {
                if (r.times === 0) {
                    r.revert = false;
                } else {
                    if (typeof r._times === 'undefined') {
                        r._times = 0;
                    } else if (r._times === r.times && typeof r.callback === 'function') {
                        r._times += 1;
                        r.callback.call();
                        r.callback = null;
                    } else if (r._times < r.times){
                        r._times += 1;
                        r.revert = false;
                    }
                }
            }
        });
    },
    /**
     * @description         缩放动画
     * @param  obj          精灵对象
     * @param  scale1       放大比例
     * @param  scale2       缩小比例
     * @param  times        动画次数
     * @param  anti         是否无穷
     * @param  speed        速度
     */
    scaleAnimation() {
        // [{obj: obj1, scale1: 1, scale2: 2, times: 1, anti: true, callback: fn}]
        scaleAnimations.forEach(function(r) {
            const speed = r.speed || 0.01;
            if (!r.revert && r.obj.scale.x <= r.scale1) {
                r.obj.scale.x += speed;
                r.obj.scale.y += speed;
            } else if (!r.revert && r.obj.scale.x > r.scale1) {
                if (!isNaN(r.scale2)) {
                    r.revert = true;
                } else {
                    if (typeof r.callback === 'function') {
                        r.callback.call();
                        r.callback = null;
                    }
                }
            } else if (r.revert && r.obj.scale.x > r.scale2) {
                r.obj.scale.x -= speed;
                r.obj.scale.y -= speed;
            } else if (r.revert && r.obj.scale.x <= r.scale2) {
                if (r.times === 0) {
                    r.revert = false;
                } else {
                    if (typeof r._times === 'undefined') {
                        r._times = 0;
                    } else if (r._times === r.times && typeof r.callback === 'function') {
                        r._times += 1;
                        r.callback.call();
                        r.callback = null;
                    } else if (r._times < r.times){
                        r._times += 1;
                        r.revert = false;
                    }
                }
            }
        });
    },
    
    /**
     * @description 从左向右滑入滑出动画
     * @param  obj          精灵对象
     * @param  povitX       X轴锚点
     * @param  start        开始位置
     * @param  end          结束位置
     * @param  speed        移动速度
     */
    slideAnimation() {
        slideAnimations.forEach(function(r) {
            r.povitX = r.povitX===undefined?r.obj.x:r.povitX;
            r.start = r.start===undefined?r.povitX - app.screen.width:r.start;
            r.end = r.end===undefined?r.povitX + app.screen.width:r.end;
            r._time = r._time === undefined?0:r._time;
            if(Math.abs(r.povitX - r.start) >= r.speed) {
                r.start += r.speed;
                r.obj.x = r.start;
    
                if(r.obj.x >= r.end) {
                    r.callback.call();
                    r.callback = null;
                    r.obj.x = r.povitX;
                }
            } else {
                if(r._time < r.stayTime/1000 * 60) {
                    r._time += 1;
                } else {
                    r.start += r.speed;
                    r.obj.x = r.start;
                }
            }
        });
    },
    
    /**
     * @description         自底向上冒泡动画
     * @param  obj          精灵对象
     * @param  povitY       Y轴锚点
     * @param  start        开始位置
     * @param  end          结束位置
     * @param  speed        移动速度
     */
    bubbleAnimation() {
        bubbleAnimations.forEach(function(r) {
            r.povitY = r.povitY===undefined?r.obj.y:r.povitY;
            r.start = r.start===undefined?r.povitY + 100:r.start;
            r.end = r.end===undefined?r.povitY - 100:r.end;
            r._time = r._time === undefined?0:r._time;
            r.speed = r.speed===undefined?10:r.speed;
    
            if(Math.abs(r.povitY - r.start) >= r.speed) {
                r.start -= r.speed;
                r.obj.y = r.start;
                if(r.povitY > r.start) {
                    r.obj.alpha -= 0.01;
                }
    
                if(r.obj.y <= r.end) {
                    r.obj.y = r.povitY;
                    r.obj.alpha = 1;
                    r.callback.call();
                    r.callback = null;
                }
            } else {
                if(r._time < r.stayTime/1000 * 60) {
                    r._time += 1;
                } else {
                    r.start -= r.speed;
                    r.obj.y = r.start;
                }
            }
        });
    },
    
    /**
     * @description         自上而下掉落动画，预留offsetY2，用于指明obj掉落后第一次弹起的高度
     * @param  obj          精灵对象
     * @param  povitY       Y轴锚点
     * @param  speed        移动速度
     * @param  offsetY1     掉落距离
     */
    falldownAnimation() {
        falldownAnimations.forEach(function(r) {
            if(!r.obj) return;
            r.speed = r.speed===undefined?10:r.speed;
            r.offsetY1 = r.offsetY1===undefined?r.obj.height * 2:r.offsetY1;
            r.offsetY2 = r.offsetY2===undefined?r.obj.height/2:r.offsetY2;
            r.povitY = r.povitY===undefined?r.obj.y:r.povitY;
            r.offsetY1 -= r.speed;
            r.obj.y = r.povitY - r.offsetY1;
            r.obj.visible = true;
            if(Math.abs(r.obj.y - r.povitY) < r.speed) {
                r.callback.call();
                r.callback = null;
            }
        });
    },
    
    /**
     * @description         移动到指定位置动画
     * @param  obj          精灵对象
     * @param  povitX       X轴锚点
     * @param  povitY       Y轴锚点
     * @param  speed        移动速度
     * @param  offsetLeft   向左移动距离
     * @param  offsetRight  向右移动距离
     * @param  times        左右循环次数
     */
    moveToPointAnimation() {
        moveToPointAnimations.forEach(function(r) {
            if(!r.obj || r.pointX === undefined || r.pointY === undefined) return;
            r.flagX = r.flagX || (r.obj.x<=r.pointX ? 1 : -1);
            r.flagY = r.flagY || (r.obj.y<=r.pointY ? 1 : -1);
            r.speedX = r.speedX===undefined?r.speed:r.speedX;
            r.speedY = r.speedY===undefined?(r.obj.height / r.obj.width * r.speed):r.speedY;
            if(Math.abs(r.pointX - r.obj.x) < r.speedX && Math.abs(r.pointY - r.obj.y) < r.speedY) {
                r.callback.call();
                r.callback = null;
            } else {
                if(Math.abs(r.pointX - r.obj.x) >= r.speedX) {
                    r.obj.x = r.obj.x + r.flagX * r.speedX;
                }
                if(Math.abs(r.pointY - r.obj.y) >= r.speedY) {
                    r.obj.y = r.obj.y + r.flagY * r.speedY;
                }
            }
        });
    },
    
    /**
     * @description         左右移动动画
     * @param  obj          精灵对象
     * @param  povitX       X轴锚点
     * @param  speed        移动速度
     * @param  offsetLeft   向左移动距离
     * @param  offsetRight  向右移动距离
     * @param  times        左右循环次数
     */
    leftToRightAnimation() {
        leftToRightAnimations.forEach(function (r) {
            if(!r.obj) return;
            r.povitX = r.povitX===undefined? r.obj.x : r.povitX;
            r.speed = r.speed || 1;
            r.offsetLeft = r.offsetLeft===undefined?10:r.offsetLeft;
            r.offsetRight = r.offsetRight===undefined?10:r.offsetRight;
            r.left = r.left===undefined?(r.povitX - r.offsetLeft):r.left;
            r.right = r.right===undefined?(r.povitX + r.offsetRight):r.right;
            r.direction = r.direction || (r.obj.x > r.left ? 'left' : 'right');
            r.times = r.times===undefined? 0 : r.times;
            r._times = r._times===undefined? 0 : r._times;
    
            if(r.direction === 'left') {
                if(r.obj.x > r.left) {
                    r.obj.x -= r.speed;
                } else {
                    r.direction = 'right'
                }
            } else {
                if(r.obj.x < r.right) {
                    r.obj.x += r.speed;
                } else {
                    r.direction = 'left'
                }
            }
    
            if(Math.abs(r.obj.x - r.povitX) < r.speed) r._times += 1;
            if(r.times && r._times === r.times/2) {
                if(r.callback && typeof r.callback === 'function') {
                    r.callback.call();
                    r.callback = null;
                }
            }
        });
    },
    
    /**
     * @description         上下移动动画
     * @param  obj          精灵对象
     * @param  povitY       Y轴锚点
     * @param  speed        移动速度
     * @param  offsetUp     向上移动距离
     * @param  offsetDown   向下移动距离
     * @param  times        上下循环次数
     */
    upToDownAnimation() {
        upToDownAnimations.forEach(function (r) {
            if(!r.obj) return;
            r.povitY = r.povitY===undefined? r.obj.y : r.povitY;
            r.speed = r.speed || 1;
            r.offsetUp = r.offsetUp===undefined?10:r.offsetUp;
            r.offsetDown = r.offsetDown===undefined?10:r.offsetDown;
            r.up = r.up===undefined?(r.povitY - r.offsetUp):r.up;
            r.down = r.down===undefined?(r.povitY + r.offsetDown):r.down;
            r.direction = r.direction || (r.obj.y > r.up ? 'down' : 'up');
            r.times = r.times===undefined? 0 : r.times;
            r._times = r._times===undefined? 0 : r._times;
    
            if(r.direction === 'up') {
                if(r.obj.y > r.up) {
                    r.obj.y -= r.speed;
                } else {
                    r.direction = 'down'
                }
            } else {
                if(r.obj.y < r.down) {
                    r.obj.y += r.speed;
                } else {
                    r.direction = 'up'
                }
            }
    
            if(Math.abs(r.obj.y - r.povitY) < r.speed) r._times += 1;
            if(r.times && r._times === r.times/2) {
                if(r.callback && typeof r.callback === 'function') {
                    r.callback.call();
                    r.callback = null;
                }
            }
        });
    },
    
    
    /**
     * @description     移动到指定水平位置动画
     * @param obj       精灵对象
     * @param pointX    目标位置
     * @param flagX     移动方向
     * @param speedX    速度
     */
    moveToPointX() {
        moveToPointXs.forEach(function(r,key) {
            if(!r.obj || r.pointX === undefined ) return;
            r.flagX = r.flagX || (r.obj.x < r.pointX ? 1 : -1);//相对方向
            r.speedX = r.speedX===undefined?r.speed:r.speedX;
            if(Math.abs(r.pointX - r.obj.x) >= r.speedX) {
                r.obj.x = r.obj.x + r.flagX * r.speedX;
            }else if( Math.abs(r.pointX - r.obj.x) > 1 ){
                r.obj.x = r.obj.x + r.flagX * 1;
            }else {
                r.obj.x = r.pointX;
                moveToPointXs.splice(key,1);
            }
        });
    },
    
    /**
     * @description     移动到指定Y轴位置动画
     * @param obj       精灵对象
     * @param pointY    目标位置
     * @param flagY     移动方向
     * @param speedY    速度
     */
    moveToPointY() {
        moveToPointYs.forEach(function(r,key) {
            if(!r.obj || r.pointY === undefined ) return;
            r.flagY = r.flagY || (r.obj.y < r.pointY ? 1 : -1);//相对方向
            r.speedY = r.speedY===undefined?r.speed:r.speedY;
            if(Math.abs(r.pointY - r.obj.y) >= r.speedY) {
                r.obj.y = r.obj.y + r.flagY * r.speedY;
            }else if( Math.abs(r.pointY - r.obj.y) > 1 ){
                r.obj.y = r.obj.y + r.flagY * 1;
            }else {
                r.obj.y = r.pointY;
                moveToPointYs.splice(key,1);
            }
        });
    },
    
    
    /**
     * @description 逐渐消失
     * @param  obj  精灵对象     
     * @param  scale1  缩放比例     
     * @param  callback  回调函数     
     */
    fadeInAndOut() {
        // [{obj: obj1, scale1: 1, callback: fn}]
        fadeInAndOuts.forEach(function(r,key){
            if(!r.obj) return;
            const speed = r.speed || 0.01;
            if (!r.revert && r.obj.scale.x <= r.scale1) {
                r.obj.scale.x += speed;
                r.obj.scale.y += speed;
                r.obj.alpha -= speed;
            } else if (!r.revert && r.obj.scale.x > r.scale1 || r.obj.alpha < 0 ) {
                // clear the current obj 
                fadeInAndOuts.splice(key,1);
                if (typeof r.callback === 'function') {
                    r.callback.call();
                    r.callback = null;
                }
            }
        })
    }
    
    }
    