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
    const receiver = new Receiver()
    this.receiver = receiver

    /* EVENTS */
    video.addEventListener('playing', () => {
      receiver.emit('play')
    })

    video.addEventListener('pause', () => {
      receiver.emit('pause')
    })

    video.addEventListener('ended', () => {
      receiver.emit('ended')
    })

    video.addEventListener('timeupdate', () => {
      receiver.emit('timeupdate', {
        seconds: video.currentTime,
        duration: video.duration
      })
    })

    video.addEventListener('progress', () => {
      receiver.emit('buffered', {
        percent: video.buffered.length
      })
    })

    /* Methods */
    receiver.on('play', () => {
      video.play()
    })

    receiver.on('pause', () => {
      video.pause()
    })

    receiver.on('getPaused', (callback: (paused: boolean) => void) => {
      callback(video.paused)
    })

    receiver.on('getCurrentTime', (callback: (time: number) => void) => {
      callback(video.currentTime)
    })

    receiver.on('setCurrentTime', (value: number) => {
      video.currentTime = value
    })

    receiver.on('getDuration', (callback: (duration: number) => void) => {
      callback(video.duration)
    })

    receiver.on('getVolume', (callback: (volume: number) => void) => {
      const volume = video.volume * 100
      callback(volume)
    })

    receiver.on('setVolume', (value: number) => {
      video.volume = value / 100
    })

    receiver.on('mute', () => {
      video.muted = true
    })

    receiver.on('unmute', () => {
      video.muted = false
    })

    receiver.on('getMuted', (callback: (muted: boolean) => void) => {
      callback(video.muted)
    })

    receiver.on('getLoop', (callback: (loop: boolean) => void) => {
      callback(video.loop)
    })

    receiver.on('setLoop', (value: boolean) => {
      video.loop = value
    })

    receiver.on('setPlaybackRate', (value: number) => {
      video.playbackRate = value
    })

    receiver.on('getPlaybackRate', (callback: (rate: number) => void) => {
      callback(video.playbackRate)
    })
  }

  ready(): void {
    this.receiver.ready()
  }
}

export default HTML5Adapter
