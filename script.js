const muteButton = document.getElementById("mute-button");
const bgVideo = document.getElementById("bg-video");
const videoSource = document.getElementById("video-source");

muteButton.addEventListener("click", function() {
    let muted = bgVideo.muted;

    if (muted) {
        bgVideo.muted = false;
        muteButton.classList.remove("fa-volume-xmark");
        muteButton.classList.add("fa-volume-high");
    } else {
        bgVideo.muted = true;
        muteButton.classList.remove("fa-volume-high");
        muteButton.classList.add("fa-volume-xmark");
    }

});

class VideoType {
    constructor(ext, mediaType, videoCodec) {
        this.ext = ext;
        this.mediaType = mediaType;
        this.videoCodec = videoCodec;
        this.audioCodec = {
            'mp4': 'mp4a.40.2',
            'webm': 'opus'
        }[mediaType];
    }

}

async function getVideos() {
    
    /*
    audio codecs:
    mp4: mp4a.40.2
    webm: opus


    our codecs are
    +---------------+---------------+
    | video         | video         | 
    +---------------+---------------+
    | HDR 4K webm   | vp09.02.51.10 |
    | HDR 4K mp4    | av01.0.13M.10 |
    | HDR 1080 mp4  | av01.0.09M.10 |
    | HDR 1080 webm | vp09.02.41.10 |
    | 1080 mp4      | avc1.64002A   |
    | 1080 webm     | vp09.00.41.08 |
    +---------------+---------------+
    */

    let res = await fetch("https://api.aaix.dev/videos");
    let body = await res.json();
    if (!body.success) {
        console.error("Failed to fetch videos: ", body.data.message);
    }

    let videoAssets = body.data;


    let supportedVideos = [];
    let supportsHDR = (window.matchMedia("(dynamic-range: high)").matches);

    videoAssets.forEach(asset => {
        if (asset.asset.includes('HDR') && !supportsHDR) {
            return;
        }

  

        if (bgVideo.canPlayType(`video/${asset.mediaType}; codecs="${asset.videoEncoding}, ${asset.audioEncoding}"`) != "") {
            supportedVideos.push(asset);
        }
    });

    return supportedVideos;
    
}


window.onload = function() {

    let supportedVideos = getVideos().then(supportedVideos => {

        console.log("supported videos: ", supportedVideos);



        videoSource.src = `https://cdn.aaix.dev/web/${supportedVideos[0].asset}`;
        videoSource.type = "video/mp4";
        bgVideo.load();
        bgVideo.play();
    });
};