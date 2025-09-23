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
      timeupdate: () => {},
      volume: 100,
      mute: false,
      playing: false,
      loop: false,
      playbackRate: 1,
      play: () => {
        video.interval = setInterval(() => {
          video.currentTime += 0.25
          video.timeupdate({
            seconds: video.currentTime,
            duration: video.duration
          })
        }, 250)
        video.playing = true
      },
      pause: () => {
        if (video.interval) {
          clearInterval(video.interval)
        }
        video.playing = false
      }
    }

    // Set up the actual receiver
    const receiver = new Receiver()
    this.receiver = receiver

    receiver.on('play', function (this: Receiver) {
      video.play()
      this.emit('play')
      video.timeupdate = (data: { seconds: number; duration: number }) => {
        this.emit('timeupdate', data)
      }
    })

    receiver.on('pause', function (this: Receiver) {
      video.pause()
      this.emit('pause')
    })

    receiver.on('getPaused', (callback: (isPaused: boolean) => void) => {
      const isPaused = !video.playing
      callback(isPaused)
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
      callback(video.volume)
    })

    receiver.on('setVolume', (value: number) => {
      video.volume = value
    })

    receiver.on('mute', () => {
      video.mute = true
    })

    receiver.on('unmute', () => {
      video.mute = false
    })

    receiver.on('getMuted', (callback: (muted: boolean) => void) => {
      callback(video.mute)
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

export default MockAdapter
