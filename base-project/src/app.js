window.resources = {};
// all media url ,include image and video and another resource
const mediaUrl = []
const replaceUrl = new RegExp(/(\..\/)|(\.\/)/,'g');

useMedia(mediaUrl,resources);

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