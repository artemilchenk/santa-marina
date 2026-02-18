export const PlaySkyboxVideo = {
  schema: {
    videoSrcId: {
      type: 'string',
      default: ''
    },
    isActive: {
      type: 'boolean',
      default: false
    }
  },

  init () {
    this.videoSrcId = this.data.videoSrcId;
    this.initVideo();
  },

  tick() {
  },

  update(oldData) {
    if (this.data.videoSrcId && this.videoSrcId !== this.data.videoSrcId) {
      this.videoSrcId = this.data.videoSrcId;
      this.initVideo();
    }

    if (this.data.isActive) {
      this.playVideo();
    } else {
      this.pauseVideo();
    }
  },

  initVideo() {
    if (!this.videoSrcId) {
      return;
    }

    this.videoTag = document.querySelector(`#${this.videoSrcId}`);
    if (!this.videoTag) {
      return;
    }

    this.videoTag.setAttribute('loop', 'true');
    this.videoTag.setAttribute('autoplay', 'true');
    this.videoTag.setAttribute('muted', 'true');
  },

  playVideo() {
    if (!this.videoTag) {
      return;
    }

    this.videoTag.play();
  },

  pauseVideo() {
    if (!this.videoTag) {
      return;
    }

    this.videoTag.pause();
  }
};
