// video对象全局变量，并且初始化
import utils from './utils';
let video1 = resources['video/a1.mp4'];
let video2 = resources['video/a2.mp4'];


let iconBarArr = [
    'image/scene0/head1.png',
    'image/scene0/head2.png'
]
let iconArr = [
    {url: 'image/scene0/1.png', x: 48 ,y: 274 ,w:218, h: 218 },
    {url: 'image/scene0/2.png', x: 266 ,y: 274 ,w:218, h: 218 },
    {url: 'image/scene0/3.png', x: 484 ,y: 274 ,w:218, h: 218 },
    {url: 'image/scene0/4.png', x: 484 ,y: 492 ,w:218, h: 218 },
    {url: 'image/scene0/5.png', x: 484 ,y: 710 ,w:218, h: 218 },
    {url: 'image/scene0/6.png', x: 266 ,y: 710 ,w:218, h: 218 },
    {url: 'image/scene0/7.png', x: 48 ,y: 710 ,w:218, h: 218 },
    {url: 'image/scene0/8.png', x: 48 ,y: 492 ,w:218, h: 218 },
];

let currentVideo;
let currentIndex = null;
const videoArr = [video1,video2];
const videoUrl = [];
videoArr.forEach((item)=>{
    videoUrl.push(item.src);
    item.style.zIndex = 1;
    item.muted = true;
    item.controls = false;
    item.playbackRate = 1;
    item.playsinline = 'playsinline';
    item.webkitPlaysinline = 'webkit-playsinline';
    item.xWebkitAirplay = true;
    item.x5VideoPlayerType = 'h5';
    item.x5VideoPlayerFullscreen = 'true';
});

function playCurrent(index) {
    
    
    currentVideo = videoArr[index];

    var timer = setInterval(()=>{

        if (currentVideo.paused) {
            currentVideo.play();
            currentVideo.muted = false;
            currentVideo.loop = true;
            currentVideo.style.width = window.innerWidth*654/designSize[0]+'px';
            currentVideo.style.height = window.innerHeight*654/designSize[1] + 'px';
            currentVideo.style.zIndex = 9;
        }else{
            clearInterval(timer);
        }
        
    },10);
}
function hideVideo() {
    var timer = setInterval(()=>{
        if (!currentVideo.paused) {
            console.log('pause');
            currentVideo.pause();
            currentVideo.muted = true;
            currentVideo.style.zIndex = 1;
            currentVideo.style.width = '1px';
            currentVideo.style.height = '1px';
        }else{
            clearInterval(timer);
        }
    },10);
}



// 别名
const Application = PIXI.Application,
Container = PIXI.Container,
loader = PIXI.loader,
Graphics = PIXI.Graphics,
BaseTexture = PIXI.BaseTexture,
Texture = PIXI.Texture,
TextureCache = PIXI.utils.TextureCache,
Sprite = PIXI.Sprite,
Text = PIXI.Text,
TextStyle = PIXI.TextStyle,
Rectangle = PIXI.Rectangle;

// Create a Pixi Application
const app = new Application(window.innerWidth, window.innerHeight, {
    // antialiasing: true,
    transparent: true,
    // resolution: 1,
    }
);

let sence1,
    sence2,
    avatarList,
    coverList,
    videoBox,
    selected,
    bigHeart,
    icon,
    download,
    timer;

const sences = [sence1, sence2];
const moveToPointXs = [];
const upToDownAnimations = [];
const fadeInAndOuts = [];
const scaleAnimations = [];
const designSize = [750,1334];

// switch sence
function setSence(j){
    for(let i=0;i<sences.length;i++){
        if(i==j){
            sences[i].visible=true;
        }else{
            sences[i].visible=false;
        }
    }
}

window.screenXCenter = function (obj) {
    return app.screen.width/2 - obj.width/2;
};

window.screenYCenter = function (obj){
    return app.screen.height/2 - obj.height;
};




function setup(){
    document.body.appendChild(app.view);

    initSences();

    setSence(0);

    app.ticker.add(function() {
        moveToPointX();
        upToDownAnimation();
        fadeInAndOut();
        scaleAnimation();
    });
}

function checkReady() {
    let flag = true;
    const keys = Object.keys(resources);
    for(let i = 0; i< keys.length-2; i++) {
        
        if(!resources[keys[i]] || !resources[keys[i]].width) {
            flag = false;
        }
    }
    if(flag) {
        if(resources[keys[0]] && resources[keys[0]].readyState != 0) {
            setup();
        } else {
            setTimeout(function() {checkReady()}, 200);
        }
    } else {
        setTimeout(function() {checkReady()}, 200);
    }
}

/**
 * @description 上下移动动画
 */
function upToDownAnimation() {
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
}

/**
 * @description 淡入淡出
 */
function fadeInAndOut() {
    // [{obj: obj1, scale1: 1, scale2: 2, times: 1, anti: true, callback: fn}]
    fadeInAndOuts.forEach(function(r){
        if(!r.obj) return;
        const speed = r.speed || 0.01;
        if (!r.revert && r.obj.scale.x <= r.scale1) {
            r.obj.scale.x += speed;
            r.obj.scale.y += speed;
            r.obj.alpha -= speed;
        } else if (!r.revert && r.obj.scale.x > r.scale1 || r.obj.alpha < 0 ) {
            if (typeof r.callback === 'function') {
                r.callback.call();
                r.callback = null;
            }
        }
    })
}
/**
 * @description 缩放
 */
function scaleAnimation() {
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
}

/**
 * @description 移动到指定水平位置动画
 */
function moveToPointX() {
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
}
/**
 * @description 平滑进入可视区域
 */
function moveToPointY() {
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
}



function scaleImage(img, scale=1) {
    const _scale = (window.innerWidth/img.width)*scale;
    img.scale.y *= _scale;
    img.scale.x *= _scale;
    return _scale;
}


function initElem(image, xFn, yFn, scale=1, onClick) {
    const btn = new Sprite(new Texture(new BaseTexture(resources[image])));
    scaleImage(btn, scale);
    if (xFn)
        btn.x = window[xFn](btn);
    if (yFn)
        btn.y = window[yFn](btn);

    if (onClick) {
        btn.buttonMode=true;
        btn.interactive=true;
        btn.on("pointerdown", onClick);
    }
    return btn;
}


function initImgObj(objUrl,designW,designH,x,y,w,h,onClick) {
    const icon = new Sprite(new Texture(new BaseTexture(resources[objUrl])));
    if (!isNaN(x)) icon.x = window.innerWidth*x/designW;
    if (!isNaN(y)) icon.y = window.innerHeight*y/designH;
    if (!isNaN(w)) icon.width = window.innerWidth*w/designW;
    if (!isNaN(h)) icon.height = window.innerHeight*h/designH;
    if (onClick) {
        icon.buttonMode=true;
        icon.interactive=true;
        icon.on("pointerdown", onClick);
    }
    return icon;
}

function setLocat(obj,designW,designH,x,y,w,h) {
    let icon = obj;
    if (!isNaN(x)) icon.x = window.innerWidth*x/designW;
    if (!isNaN(y)) icon.y = window.innerHeight*y/designH;
    if (!isNaN(w)) icon.width = window.innerWidth*w/designW;
    if (!isNaN(h)) icon.height = window.innerHeight*h/designH;
    return icon;
}


function initSences() {

    for(let i=0;i<sences.length;i++){
        sences[i] = new Container();
        sences[i].visible = false;
        app.stage.addChild(sences[i]);
    }
    avatarList = new Container();
    sences[0].addChild(avatarList);

    coverList = new Container();
    sences[0].addChild(coverList);

    videoBox = new Container();
    sences[0].addChild(videoBox);
    videoBox.visible = false;

    let operatBtn = new Container();
    sences[0].addChild(operatBtn);

    let iconBox = new Container();
    videoBox.addChild(iconBox);
    let showIcon = new Container();
    videoBox.addChild(showIcon);

    let barPos = [
        window.innerWidth*505/designSize[0],
        window.innerHeight*696/designSize[1],
        window.innerWidth*83/designSize[0],
        window.innerHeight*473/designSize[1]
    ]

    sences[0].addChild(createLog());

    addIcon(iconArr);

    coverList.children[0].visible = false;

    sences[1].addChild(createLog());


    let startBtnNor = initElem('image/scene0/start-btn-nor.png', '', '', '', ()=>{
        if ( startBtnNor['runing'] ) return;
        console.log('begin run');
        startBtnNor['runing'] = true;
        startBtnClick.visible = true;
        startBtnNor.visible = false;        
        setTimeout(()=>{
            startBtnNor.visible = true;
            startBtnClick.visible = false;
        },200);
        runLight(3,iconArr,[3,6]);
    });
    startBtnNor['runing'] = false;
    startBtnNor = setLocat(startBtnNor,750,1334,300,526,150,150);
    operatBtn.addChild(startBtnNor);

    let startBtnClick = initElem('image/scene0/start-btn-click.png', '', '', '');
    startBtnClick.visible = false;
    startBtnClick = setLocat(startBtnClick,750,1334,300,526,150,150);
    operatBtn.addChild(startBtnClick);

    selected = initElem('image/scene0/selected.png', '', '', '',()=>{
        let index;
        currentIndex % 2 == 0 ? index = 0: index = 1;
        if ( !startBtnNor['runing'] && currentIndex !== null ) {
            coverList.visible = false;
            videoBox.visible = true;
            avatarList.visible = false;
            operatBtn.visible = false;
            playCurrent(index);
        }
    });
    selected = setLocat(selected,750,1334,48-14,274-14,246,246);
    operatBtn.addChild(selected);

    

    let backMap = initElem('image/scene0/back_map.png', 'screenXCenter', '', '', ()=>{
        coverList.visible = true;
        operatBtn.visible = true;
        avatarList.visible = true;
        videoBox.visible = false;
        hideVideo();
        heart.visible = false;
    });
    backMap = setLocat(backMap,750,1334,620,860,63,83);
    videoBox.addChild(backMap);

    download = initElem('image/scene0/download.png', '', '',1, function () {
        downloadActive.visible = true;
        download.visible = false;
        setTimeout(()=>{
            downloadActive.visible = false;
            download.visible = true;
        },500);
        FbPlayableAd.onCTAClick();
    });
    download.anchor.set(0.5,0.5);
    download.position.set(window.innerWidth/2,window.innerHeight*0.88);
    download.visible = true;
    scaleAnimations.push({
        obj: download,
        scale1: 0.5,
        scale2: 0.48,
        speed: 0.002,
        times: 0
    });
    sences[0].addChild(download);

    let downloadActive = initElem('image/scene0/download_active.png', '', '',1);
    downloadActive.anchor.set(0.5,0.5);
    downloadActive.position.set(download.x,download.y);
    downloadActive.visible = false;
    sences[0].addChild(downloadActive);

    // **********************************//
    let hand = initElem('image/scene0/hand.png','','',0.08);
    hand.position.set(barPos[0]*1.3,barPos[1]*1.1)
    hand['click'] = false;
    videoBox.addChild(hand);
    upToDownAnimations.push({
        obj: hand,
        speed:0.5,
        offsetUp: 5,
        offsetDown: 5
    })

    let normalHeart = initElem('image/scene0/love_white.png','','','',()=>{
        hand.visible = false;
        hand.click = true;
        heart.visible = true;
        alertIcon('heart');
    });
    normalHeart = setLocat(normalHeart,750,1334,620,730,61,58);
    iconBox.addChild(normalHeart);

    let heart = initElem('image/scene0/love_icon.png', '', '', '',()=>{
        alertIcon('heart');
    });
    heart.visible = false;
    heart = setLocat(heart,750,1334,620,730,61,58);
    iconBox.addChild(heart);

    
    videoBox.buttonMode=true;
    videoBox.interactive=true;
    videoBox.on("pointerdown", ()=>{
        if( !avatarList.visible ) {
            !heart.visible ? heart.visible = true : '';
            alertIcon('heart');
        } else {
            return;
        }
    });

    function runLight(count,locatArr,targetVideo) {
        var delay = 100;
        var base;
        var target = targetVideo||[3,6];
        var round = count > 0 ? locatArr.length*count+target[Math.round(Math.random())]: locatArr.length ;
        currentIndex = round - locatArr.length*count - 1 < 0 ? 7: round - locatArr.length*count - 1 ;
        for(var i = 1 ; i < round ; i++ ){
            ((num)=>{
                if ( round-locatArr.length < num ) delay+=20 ;
                setTimeout(() => {
                    
                    base = num % locatArr.length;
                    
                    var x = (locatArr[base].x-14)/designSize[0]*window.innerWidth;
                    var y = (locatArr[base].y-14)/designSize[1]*window.innerHeight;
                    selected.position.set(x,y);
                    for ( var i = 0 ; i < coverList.children.length ; i++ ) {
                        i == base ? coverList.children[i].visible = false : coverList.children[i].visible = true;
                    }
                    round-1 == num ? startBtnNor['runing'] = false : '';
                }, delay*num);
                
            })(i);
        }
        return currentIndex;
    }


    function locatIcon(url, x, y, w, h ) {
        let icon = initElem(url, '', '','');
            icon.x = window.innerWidth*x/designSize[0] ;
            icon.y = window.innerHeight*y/designSize[1];
        if (!isNaN(w)) 
            icon.width = window.innerWidth*w/designSize[0];
        if (!isNaN(h)) 
            icon.height = window.innerHeight*h/designSize[1];
        return icon
    }


    function createCover(color, alpha, x,y,w,h) {
        let cover = new Graphics();
        let cx = window.innerWidth*x/designSize[0],
            cy = window.innerHeight*y/designSize[1],
            cw = window.innerWidth*w/designSize[0],
            ch = window.innerHeight*h/designSize[1];
        cover.beginFill(color, alpha);
        cover.drawRect(cx,cy,cw,ch);
        cover.endFill();
        return cover;
    }


    function addIcon(iconArr) {
        for ( var i = 0 ; i < iconArr.length; i++ ) {
            let currentIcon = locatIcon(iconArr[i].url, iconArr[i].x, iconArr[i].y, iconArr[i].w, iconArr[i].h);
            avatarList.addChild(currentIcon);

            let currentCover = createCover( 0x000000, 0.6, iconArr[i].x, iconArr[i].y, iconArr[i].w, iconArr[i].h);
            coverList.addChild(currentCover);
        }
    }

    function createLog(){
        let logo = initElem('image/scene0/logo.png', '', '', 0.18);
        logo.x = 0;
        logo.y = 0;
        return logo;
    }

    
    function alertIcon(name,callBack){
        if( showIcon.children.length > 0 ) {
            showIcon.children = [];
        }
        let url;
        if ( name == 'emoji' ) {
            url = 'image/scene0/emoji_icon.png';
        }else if( name == 'heart' ){
            url = 'image/scene0/love2.png';
        }
        let icon = initElem(url, '', '', 0.2);
        icon.anchor.x = 0.5;
        icon.anchor.y = 0.5;
        icon.x = Math.floor(Math.random() * (window.innerWidth*0.8 - window.innerWidth*0.2 + 1)) + window.innerWidth*0.2;;
        icon.y = Math.floor(Math.random() * (window.innerHeight*0.7 - window.innerHeight*0.3 + 1)) + window.innerHeight*0.3;;
        icon['name'] = name;
        showIcon.addChild(icon);
        setTimeout(()=>{
            fadeInAndOuts.push({
                obj: icon,
                speed: 0.04,
                scale1: 2.5,
                callback: ()=>{
                    fadeInAndOuts.splice(0,1);
                }
            });
        },200);
        if (callBack) callBack();
    }

}


checkReady();

