var elemVideoInput;
var elemTitleInput;
var elemContainer;
var elemOverlay;
var btnGenerate;
var btnReset;

onChangeInputVideo = (evt) => {
    for (const file of evt.target.files) {
        uploadVideo(file)
        addUploadingEntryToPlaylist(file.name)

    }
}

onChangeInputTitle = (evt) => {
    evt.preventDefault()
    elemPlaylistTitle.innerHTML = evt.target.value
}

uploadPlaylist = (evt) => {
    evt.preventDefault()
    elemOverlay.style.display = 'block'
    // reset UI
    btnReset.click()

    // build html
    const html = playerHTML.replace('REPLACEME', elemContainer.innerHTML)

    // upload to skynet
    var blob = new Blob([html], { type: 'text/html' });
    var formData = new FormData();
    formData.append('file', blob);
    const uuid = generateUUID()
    fetch(`https://siasky.net/skynet/skyfile/${uuid}?filename=playlist.html`, {
        method: 'POST',
        body: formData
    })
        .then((response) => response.json())
        .then((result) => {
            alert("Your playlist is at https://siasky.net/" + result.skylink);
            elemOverlay.style.display = 'none'
        })
        .catch((error) => {
            console.error('Error:', error);
            elemOverlay.style.display = 'none'
        })
}

uploadVideo = (file) => {
    var formData = new FormData();
    formData.append('file', file);
    const uuid = generateUUID()
    fetch(`https://siasky.net/skynet/skyfile/${uuid}?filename=${file.name}`, {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(response => {

            addVideoEntryToPlaylist(file.name, response.skylink)
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

generateUUID = () => {
    let uuid = ''
    const cs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 16; i++) {
        uuid += cs.charAt(Math.floor(Math.random() * cs.length));
    }
    return uuid;
}

addUploadingEntryToPlaylist = (name) => {
    const seq = document.getElementById('playlist-items').childNodes.length
    const entry = htmlToElement(`
    <tr data-id="${name}">
    <td class="video-seq">${seq + 1}</td>
    <td class="video-name">${name}</td>
    <td class="video-uploading">
        <div class="spinner"><div></div><div></div><div></div><div></div></div>
    </td>
    </tr>
    `)
    document.getElementById('playlist-items').appendChild(entry)
}

addVideoEntryToPlaylist = (name, skylink) => {
    for (const entry of document.querySelectorAll('[data-id]')) {
        if (entry.dataset.id === name) {
            for (const ch of entry.childNodes) {
                if (ch.className == "video-uploading") {
                    ch.innerHTML = ""
                }
            }
            entry.closest('tr').onclick = selectVideo
            entry.dataset.skylink = skylink
            entry.className = "video"
            break;
        }
    }
}

htmlToElement = (html) => {
    var template = document.createElement('template');
    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
}

window.addEventListener('DOMContentLoaded', () => {
    elemVideoInput = document.getElementById('input-video')
    elemTitleInput = document.getElementById('input-title')
    elemContainer = document.getElementById('container')
    elemPlaylistTitle = document.getElementById('title');
    elemOverlay = document.getElementById('overlay');

    elemVideoInput.onchange = onChangeInputVideo
    elemTitleInput.onkeyup = onChangeInputTitle

    btnGenerate = document.getElementById("btn-generate")
    btnReset = document.getElementById("btn-reset")
    btnGenerate.onclick = uploadPlaylist

    document.getElementById('created').innerHTML += `<a href=${window.location.href}>Skynet</a>`
});

const playerHTML = `
<html lang="en">
<head>
    <title>Skynet Playlist Builder</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style type="text/css">    
*{box-sizing:border-box}body,html{margin:0;padding:0;background-color:#fff}body{height:100%;max-width:1200px;margin:0 auto;padding:20px;background-color:#eee}.sprite{background:url(https://siasky.net/rACTr_fQsX5uKWfjLNKQOW6PhcFm0G3zJIFACesDOB4PJA) no-repeat}.icon{display:inline-block;width:24px;height:24px;background:url(https://siasky.net/rACTr_fQsX5uKWfjLNKQOW6PhcFm0G3zJIFACesDOB4PJA) no-repeat;zoom:.9;-moz-transform:scale(.9);-moz-transform-origin:0 0}.step-backward{background-position:-40px -560px}.step-forward{background-position:-80px -560px}.play{background-position:-1040px -520px}.pause{background-position:-1000px -520px}.fullscreen{background-position:-80px -240}.line{display:block;margin-top:10px}#overlay{display:none;position:absolute;top:0;left:0;background:#000;width:100%;height:100%;z-index:9999;opacity:.85}#overlay .spinner{top:50%;left:50%;width:100px;height:100px}#overlay .spinner div{width:84px;height:84px}td#timer{padding-left:20px}#container{margin-top:20px}#created{display:block;clear:both;padding-top:10px;text-align:right;color:#a9a9a9}#created a{color:#a9a9a9;padding-left:5px}#player{width:70%;height:70%;display:flex;float:left;position:relative;min-height:300px;justify-content:center;background-color:#333}#title{color:#fff;padding:0 20px}#video{background:#000;width:100%}#progressBar{height:5px;width:70%;display:flex;background:#fff;border-radius:30px;overflow:hidden}#progressBar>#progress{height:100%;width:0%;background:#00a8ff}#controls{position:absolute;bottom:0;width:100%;height:10%;max-height:40px;line-height:40px;bottom:0;color:#fff;opacity:7;background:#000;padding:0 10px}#playlist{width:30%;height:70%;float:right;min-height:300px;background:#000;border-left:1px solid #fff;overflow:hidden}#playlist table{display:block;padding:0;margin:0;border:none;overflow:scroll}#playlist table tbody{display:block;width:100%}#playlist table tr{display:block;padding:10px;height:60px;line-height:40px;color:#fff;font-size:14px}tr.video{cursor:pointer}#playlist table td{display:inline-block;height:40px;line-height:40px;font-size:14px}td.video-seq{width:10%;padding:0 10px}td.video-uploading .spinner{position:relative;top:0;width:10%}td.video-uploading .spinner div{width:27px;height:27px}td.video-name{width:50%;overflow:hidden;padding-left:10px}.playing::after{position:relative;top:3px;content:'';display:inline-block;line-height:60px;margin-left:10px;width:12px;height:12px;-moz-border-radius:7.5px;-webkit-border-radius:7.5px;border-radius:7.5px;background-color:#fff}.btn{cursor:pointer;width:20px}.spinner{display:inline-block;position:absolute;top:40%;width:64px;height:64px;z-index:100000}.spinner div{box-sizing:border-box;display:block;position:absolute;width:51px;height:51px;margin:6px;border:6px solid #fff;border-radius:50%;animation:spinner 1.2s cubic-bezier(.5,0,.5,1) infinite;border-color:#fff transparent transparent transparent}.spinner div:nth-child(1){animation-delay:-.45s}.spinner div:nth-child(2){animation-delay:-.3s}.spinner div:nth-child(3){animation-delay:-.15s}@keyframes spinner{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}
    </style>
</head>

<body>
    <script>
var elemVideo,elemPlaylistItems,elemProgress,elemStart,elemLoader,btnPlay,btnPrev,btnNext,btnFullscreen,btnReset,currentVideo;reset=(e=>{e.preventDefault(),currentVideo&&currentVideo.classList.remove("playing"),elemVideo.pause(),elemVideo.innerHTML="",elemVideo.load(),elemStart.textContent="0:00"}),selectVideo=(e=>{const t="tr"==e.target.tagName.toLowerCase()?e.target:e.target.parentNode;currentVideo&&currentVideo.classList.remove("playing"),(currentVideo=t).classList.add("playing"),elemVideo.innerHTML='<source src="https://siasky.net/'+t.dataset.skylink+'" type="video/mp4">',elemVideo.load(),btnPlay.click(),elemLoader.classList.add("spinner")}),onCanPlayVideo=(()=>{elemLoader.classList.remove("spinner")}),onTimeUpdateVideo=(()=>{var e=Math.floor(elemVideo.currentTime/60),t=Math.floor(elemVideo.currentTime-60*e),l=e<10?"0"+e:e,n=t<10?"0"+t:t;elemStart.textContent=l+" : "+n}),onClickVideo=(e=>{e.preventDefault(),elemVideo.paused||elemVideo.ended?elemVideo.play():elemVideo.pause()}),onClickPlay=(e=>{if(e.preventDefault(),elemVideo.paused||elemVideo.ended)return btnPlay.childNodes[0].setAttribute("class","icon pause"),void elemVideo.play();elemVideo.pause(),btnPlay.childNodes[0].setAttribute("class","icon play")}),onClickPrev=(e=>{e.preventDefault();let t=-1;for(let e=elemPlaylistItems.childNodes.length-1;e>0;e--)currentVideo==elemPlaylistItems.childNodes[e]&&(t=e-1);-1!=t&&elemPlaylistItems.childNodes[t].click()}),onClickNext=(e=>{e.preventDefault();let t=-1;for(let e=0;e<elemPlaylistItems.childNodes.length-1;e++)currentVideo==elemPlaylistItems.childNodes[e]&&(t=e+1);-1!=t&&elemPlaylistItems.childNodes[t].click()}),onClickFullscreen=(e=>{e.preventDefault();const t=["requestFullscreen","webkitRequestFullscreen","mozRequestFullScreen","msRequestFullscreen"];for(const e of t)if(elemVideo[e]){elemVideo[e]();break}}),window.addEventListener("DOMContentLoaded",()=>{elemVideo=document.getElementById("video"),elemPlaylistItems=document.getElementById("playlist-items");for(const e of elemPlaylistItems.childNodes)e.onclick=selectVideo;elemPlaylistTitle=document.getElementById("title"),elemProgress=document.getElementById("progress"),elemStart=document.getElementById("start"),elemLoader=document.getElementById("loader"),btnPlay=document.getElementById("btn-play"),btnPrev=document.getElementById("btn-prev"),btnNext=document.getElementById("btn-next"),btnFullscreen=document.getElementById("btn-full"),btnReset=document.getElementById("btn-reset"),elemVideo.oncanplay=onCanPlayVideo,elemVideo.ontimeupdate=onTimeUpdateVideo,elemVideo.onclick=onClickVideo,elemVideo.onended=reset,btnPlay.onclick=onClickPlay,btnPrev.onclick=onClickPrev,btnNext.onclick=onClickNext,btnFullscreen.onclick=onClickFullscreen,btnReset.onclick=reset});
    </script>
    <div id="container">REPLACEME</div>
    </div>
</body>

</html>
`