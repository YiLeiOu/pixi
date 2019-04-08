// import the animation module from animate.js
import animate from './animate';
let video1 = resources['video/a1.mp4'];
let video2 = resources['video/a2.mp4'];



let currentVideo;
const videoArr = [video1,video2];

const videoUrl = [];
videoArr.forEach((item)=>{
    videoUrl.push(item.src);
    item.style.zIndex = 1;
    item.muted = true;
    item.controls = false;
    item.playbackRate = 1;
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
    sence2;

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
        // add animation
        // scaleAnimation();
    });
}

function checkReady(videoCount) {
    let flag = true;
    const keys = Object.keys(resources);
    for(let i = 0; i< keys.length-videoCount|0; i++) {
        
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

// init sence
function initSences() {

    for(let i=0;i<sences.length;i++){
        sences[i] = new Container();
        sences[i].visible = false;
        app.stage.addChild(sences[i]);
    }

}


checkReady(videoArr.length);

