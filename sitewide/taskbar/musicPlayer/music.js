let player;
let image = document.getElementById("musicPlayPause");
let slider = document.getElementById("volumeSlider");
let default_plist = "PLZVAe2HWDfayTn076m6xs4CKfGcaCF7KS";
let seekPerformed = false;

var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


// Set local storage defaults

if (localStorage.getItem("playlist") === null || localStorage.getItem("playlist") == "undefined"){
    localStorage.setItem("playlist", default_plist) 
}

if (localStorage.getItem("volume") === null) {
    localStorage.setItem("volume", 8);
} else {
    var vol = localStorage.getItem("volume")
    var difference = slider.value - vol
    if (difference >= 0) {
        slider.stepDown(difference)
    } else {
        slider.stepUp(-difference)
    }
}

if (localStorage.getItem("paused") === null) {
  localStorage.setItem("paused", false);
}

if (localStorage.getItem("videoIndex") === null || localStorage.getItem("videoIndex") < 0) {
    localStorage.setItem("videoIndex", "21");
    localStorage.setItem("videoSeek", 0);
}


slider.oninput = function() {
    localStorage.setItem("volume", this.value);
    player.setVolume(this.value);
}

function nextSong() {
    image.src = "musicPlayer/pause.png"
    player.nextVideo();
}

function previousSong() {
    image.src = "musicPlayer/pause.png"
    player.previousVideo()
}

function playPause() {
    if (player.getPlayerState() == 1) {
        image.src = "musicPlayer/play.png"
        player.pauseVideo();
        localStorage.setItem("paused", true);
    } else {
        image.src = "musicPlayer/pause.png"
        player.playVideo();
        localStorage.setItem("paused", false);
    }
}

function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: 1,
        width: 1,
        videoId: "NivE6ZETBqk",
        playerVars: {
            autoplay: 1,
            controls: 0,
            listType: 'playlist',
            list: localStorage.getItem("playlist")
        },
        events: {
            onReady: onPlayerReady
        }
    })
}

function onPlayerReady(event) {
    player.addEventListener('onStateChange', 'onPlayerStateChange');
    event.target.setLoop(true);
    event.target.setVolume(0);
    openPlayer();
    //Seek once fully loaded, and only once
    player.addEventListener('onStateChange', function(e) {
      if (e.data == YT.PlayerState.PLAYING && !seekPerformed) {
            event.target.setVolume(0);
          player.seekTo(parseFloat(localStorage.getItem("videoSeek")), true);
          seekPerformed = true;
          event.target.setVolume(localStorage.getItem("volume"));
      }
    });
  if (localStorage.getItem("paused") == "true"){
   player.pauseVideo();
   image.src = "musicPlayer/play.png"
  } else {
    player.playVideo();
    image.src = "musicPlayer/pause.png"
  }
  event.target.setVolume(localStorage.getItem("volume"));
}


function openPlayer() {
    player.setLoop(true);
    var taskbar = document.getElementById("platforms");
    taskbar.style.display = "inline-block";
    //player.playVideo();
    //player.nextVideo();
    player.playVideoAt(localStorage.getItem("videoIndex"))
}

function onPlayerStateChange(event) {
    if (player.getPlayerState() == 1) {
        document.getElementById("currentSong").innerText = player.getVideoData().title;
    }
}

function logVideoData() {
    localStorage.setItem("videoIndex", player.getPlaylistIndex())
    localStorage.setItem("videoSeek", player.getCurrentTime())
}

function changePlaylist(elem, pid){
    buttons = document.getElementsByClassName("playlistButton")

    for (let i = 0; i < buttons.length; i++) {
         if (buttons[i].innerText.startsWith("> ")){
            buttons[i].innerText = buttons[i].innerText.slice(2)
         }
      }
    
      elem.innerText = "> " + elem.innerText

    localStorage.setItem("playlist", pid)
    localStorage.setItem("videoIndex", 0)

    // Suuper janky but fuck youtube because loadPlaylist doesnt work
    if (player) {
        player.destroy();
    }

    player = new YT.Player('player', {
        height: 1,
        width: 1,
        videoId: "NivE6ZETBqk",
        playerVars: {
            autoplay: 1,
            controls: 0,
            listType: 'playlist',
            list: localStorage.getItem("playlist")
        },
        events: {
            onReady: onPlayerReady
        }
    })
}