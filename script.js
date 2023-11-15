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

function getSupportedVideoType() {
    
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


    // here use an array bc order matters
    let videoCodecs = [
        new VideoType('4K.HDR.webm', 'webm', 'vp09.02.51.10'),
        new VideoType('4K.HDR.mp4', 'av01.0.13M.10'),
        new VideoType('1080p.HDR.mp4', 'av01.0.09M.10'),
        new VideoType('1080p.HDR.webm', 'webm', 'vp09.02.41.10'),
        new VideoType('1080p.mp4', 'avc1.64002A'),
        new VideoType('1080p.webm', 'webm', 'vp09.00.41.08')
    ];

    let supportedVideos = [];
    let supportsHDR = (window.matchMedia("(dynamic-range: high)").matches);

    videoCodecs.forEach(codec => {
        if (codec.ext.includes('HDR') && !supportsHDR) {
            return;
        }
        // if bg video can play codec

  

        if (bgVideo.canPlayType(`video/${codec.mediaType}; codecs="${codec.videoCodec}, ${codec.audioCodec}"`) != "") {
            supportedVideos.push(codec);
        }
    });

    return supportedVideos;
    
}


window.onload = function() {

    let supportedVideos = getSupportedVideoType();

    console.log("supported videos: ", supportedVideos);



    videoSource.src = `https://cdn.aaix.dev/web/ICANTSTOPME.${supportedVideos[0].ext}`;
    videoSource.type = "video/mp4";
    bgVideo.load();
    bgVideo.play();
};