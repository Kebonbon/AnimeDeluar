// Get the stored video src from localStorage
let videoSrc = localStorage.getItem('videoSrc');

// Set the video source if it exists
if (videoSrc) {
    document.getElementById('video-source').setAttribute('src', videoSrc);
}
