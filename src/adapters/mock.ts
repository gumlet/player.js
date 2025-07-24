import Receiver from '../receiver'

interface MockVideo {
  duration: number
  currentTime: number
  interval: NodeJS.Timeout | null
  timeupdate: (data: { seconds: number; duration: number }) => void
  volume: number
  mute: boolean
  playing: boolean
  loop: boolean
  playbackRate: number
  play: () => void
  pause: () => void
}

class MockAdapter {
  public receiver!: Receiver

  constructor() {
    this.init()
  }

  init(): void {
    // Our mock video
    const video: MockVideo = {
      duration: 20,
      currentTime: 0,
      interval: null,
      timeupdate: function () {},
      volume: 100,
      mute: false,
      playing: false,
      loop: false,
      playbackRate: 1,
      play: function () {
        video.interval = setInterval(function () {
          video.currentTime += 0.25
          video.timeupdate({
            seconds: video.currentTime,
            duration: video.duration
          })
        }, 250)
        video.playing = true
      },
      pause: function () {
        if (video.interval) {
          clearInterval(video.interval)
        }
        video.playing = false
      }
    }

    // Set up the actual receiver
    const receiver = this.receiver = new Receiver()

    receiver.on('play', function (this: Receiver) {
      const self = this
      video.play()
      this.emit('play')
      video.timeupdate = function (data: { seconds: number; duration: number }) {
        self.emit('timeupdate', data)
      }
    })

    receiver.on('pause', function (this: Receiver) {
      video.pause()
      this.emit('pause')
    })

    receiver.on('getPaused', function (callback: (isPaused: boolean) => void) {
      const isPaused = !video.playing
      callback(isPaused)
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
      callback(video.volume)
    })

    receiver.on('setVolume', function (value: number) {
      video.volume = value
    })

    receiver.on('mute', function () {
      video.mute = true
    })

    receiver.on('unmute', function () {
      video.mute = false
    })

    receiver.on('getMuted', function (callback: (muted: boolean) => void) {
      callback(video.mute)
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

export default MockAdapter
