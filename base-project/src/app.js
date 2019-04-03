window.resources = {};
const imgUrl = [
  './image/scene0/logo.png',
  './image/scene0/download_active.png',
  './image/scene0/love2.png',
  './image/scene0/love_icon.png',
  './image/scene0/hand.png',
  './image/scene0/back_map.png',
  './image/scene0/selected.png',
  './image/scene0/love_white.png',
  './image/scene0/start-btn-nor.png',
  './image/scene0/start-btn-click.png',
  './image/scene0/download.png',
  './image/scene0/1.png',
  './image/scene0/2.png',
  './image/scene0/3.png',
  './image/scene0/4.png',
  './image/scene0/5.png',
  './image/scene0/6.png',
  './image/scene0/7.png',
  './image/scene0/8.png',
  './video/a1.mp4',
  './video/a2.mp4'
]
const replaceUrl = new RegExp(/(\..\/)|(\.\/)/,'g');

useMedia(imgUrl,resources);

function useMedia(arr,target={}){
  let findImg = /\.(png|jpg|gif)$/i;
  let findVideo = /\.mp4$/i;
  arr.forEach(item => {
    let name = item.replace(replaceUrl,'');
    if( findImg.test(name) ){
      target[name] = new Image();
    }else if( findVideo.test(name) ){
      target[name] = document.createElement('VIDEO');
      document.body.appendChild(target[name]);
    } 
    target[name].src = require(`${item}`);
  });
}