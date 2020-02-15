var elemVideo;
var elemPlaylistItems;
var elemProgress;
var elemStart;
var elemLoader;

var btnPlay;
var btnPrev;
var btnNext;
var btnFullscreen;
var btnReset;

var currentVideo;

reset = (evt) => {
    evt.preventDefault()
    if (currentVideo) {
        currentVideo.classList.remove('playing')
    }

    elemVideo.pause();
    elemVideo.innerHTML = ""
    elemVideo.load();

    elemStart.textContent = "0:00"
}

selectVideo = (evt) => {
    const el = evt.target.tagName.toLowerCase() == 'tr'
        ? evt.target
        : evt.target.parentNode

    // handle 'playing'
    if (currentVideo) {
        currentVideo.classList.remove('playing')
    }
    currentVideo = el
    currentVideo.classList.add('playing')

    // update src
    elemVideo.innerHTML = '<source src="https://siasky.net/' + el.dataset.skylink + '" type="video/mp4">'
    elemVideo.load();
    btnPlay.click()

    // set spinner until we've reloaded
    elemLoader.classList.add('spinner')
}

onCanPlayVideo = () => {
    elemLoader.classList.remove('spinner')
}

onTimeUpdateVideo = () => {
    var minutes = Math.floor(elemVideo.currentTime / 60),
        seconds = Math.floor(elemVideo.currentTime - minutes * 60),
        x = minutes < 10 ? "0" + minutes : minutes,
        y = seconds < 10 ? "0" + seconds : seconds;
    elemStart.textContent = x + " : " + y;
}

onClickVideo = (evt) => {
    evt.preventDefault();
    if (elemVideo.paused || elemVideo.ended) {
        elemVideo.play();
        return;
    }
    elemVideo.pause();
}

onClickPlay = (evt) => {
    evt.preventDefault();
    if (elemVideo.paused || elemVideo.ended) {
        btnPlay.childNodes[0].setAttribute("class", "fas fa-pause");
        elemVideo.play();
        return
    }
    elemVideo.pause();
    btnPlay.childNodes[0].setAttribute("class", "fas fa-play");
}

onClickPrev = (evt) => {
    evt.preventDefault();
    let prev = -1;
    for (let i = elemPlaylistItems.childNodes.length - 1; i > 0; i--) {
        if (currentVideo == elemPlaylistItems.childNodes[i]) {
            prev = i - 1;
        }
    }
    if (prev != -1) {
        elemPlaylistItems.childNodes[prev].click()
    }
}

onClickNext = (evt) => {
    evt.preventDefault();
    let next = -1;
    for (let i = 0; i < elemPlaylistItems.childNodes.length - 1; i++) {
        if (currentVideo == elemPlaylistItems.childNodes[i]) {
            next = i + 1;
        }
    }
    if (next != -1) {
        elemPlaylistItems.childNodes[next].click()
    }
}

onClickFullscreen = (evt) => {
    evt.preventDefault();
    const functions = [
        'requestFullscreen',
        'webkitRequestFullscreen',
        'mozRequestFullScreen',
        'msRequestFullscreen',
    ]
    for (const f of functions) {
        if (elemVideo[f]) {
            elemVideo[f]()
            break;
        }
    }
}

window.addEventListener('DOMContentLoaded', () => {
    elemVideo = document.getElementById('video')
    elemPlaylistItems = document.getElementById('playlist-items')
    for (const el of elemPlaylistItems.childNodes) {
        el.onclick = selectVideo
    }

    elemPlaylistTitle = document.getElementById('title');
    elemProgress = document.getElementById('progress');
    elemStart = document.getElementById('start');
    elemLoader = document.getElementById('loader');

    btnPlay = document.getElementById("btn-play")
    btnPrev = document.getElementById("btn-prev")
    btnNext = document.getElementById("btn-next")
    btnFullscreen = document.getElementById("btn-full")
    btnReset = document.getElementById("btn-reset")

    elemVideo.oncanplay = onCanPlayVideo
    elemVideo.ontimeupdate = onTimeUpdateVideo
    elemVideo.onclick = onClickVideo
    elemVideo.onended = reset

    btnPlay.onclick = onClickPlay
    btnPrev.onclick = onClickPrev
    btnNext.onclick = onClickNext
    btnFullscreen.onclick = onClickFullscreen
    btnReset.onclick = reset


});