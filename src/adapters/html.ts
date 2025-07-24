import core from '../core'
import Receiver from '../receiver'

class HTML5Adapter {
  public receiver!: Receiver

  constructor(video: HTMLVideoElement) {
    this.init(video)
  }

  init(video: HTMLVideoElement): void {
    core.assert(video, 'HTML5Adapter requires a video element')

    // Set up the actual receiver
    const receiver = this.receiver = new Receiver()

    /* EVENTS */
    video.addEventListener('playing', function () {
      receiver.emit('play')
    })

    video.addEventListener('pause', function () {
      receiver.emit('pause')
    })

    video.addEventListener('ended', function () {
      receiver.emit('ended')
    })

    video.addEventListener('timeupdate', function () {
      receiver.emit('timeupdate', {
        seconds: video.currentTime,
        duration: video.duration
      })
    })

    video.addEventListener('progress', function () {
      receiver.emit('buffered', {
        percent: video.buffered.length
      })
    })

    /* Methods */
    receiver.on('play', function () {
      video.play()
    })

    receiver.on('pause', function () {
      video.pause()
    })

    receiver.on('getPaused', function (callback: (paused: boolean) => void) {
      callback(video.paused)
    })

    receiver.on('getCurrentTime', function (callback: (time: number) => void) {
      callback(video.currentTime)
    })

    receiver.on('setCurrentTime', function (value: number) {
      video.currentTime = value
    })

    receiver.on('getDuration', function (callback: (duration: number) => void) {
      callback(video.duration)
    })

    receiver.on('getVolume', function (callback: (volume: number) => void) {
      const volume = video.volume * 100
      callback(volume)
    })

    receiver.on('setVolume', function (value: number) {
      video.volume = value / 100
    })

    receiver.on('mute', function () {
      video.muted = true
    })

    receiver.on('unmute', function () {
      video.muted = false
    })

    receiver.on('getMuted', function (callback: (muted: boolean) => void) {
      callback(video.muted)
    })

    receiver.on('getLoop', function (callback: (loop: boolean) => void) {
      callback(video.loop)
    })

    receiver.on('setLoop', function (value: boolean) {
      video.loop = value
    })

    receiver.on('setPlaybackRate', function (value: number) {
      video.playbackRate = value
    })

    receiver.on('getPlaybackRate', function (callback: (rate: number) => void) {
      callback(video.playbackRate)
    })
  }

  ready(): void {
    this.receiver.ready()
  }
}

export default HTML5Adapter
