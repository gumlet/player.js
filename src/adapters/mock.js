import Receiver from '../receiver'

class MockAdapter {
  constructor () {
    this.init()
  }

  init () {
    // Our mock video
    const video = {
      duration: 20,
      currentTime: 0,
      interval: null,
      timeupdate: function () {},
      volume: 100,
      mute: false,
      playing: false,
      loop: false,
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
        clearInterval(video.interval)
        video.playing = false
      }
    }

    // Set up the actual receiver
    const receiver = this.receiver = new Receiver()

    receiver.on('play', function () {
      const self = this
      video.play()
      this.emit('play')
      video.timeupdate = function (data) {
        self.emit('timeupdate', data)
      }
    })

    receiver.on('pause', function () {
      video.pause()
      this.emit('pause')
    })

    receiver.on('getPaused', function (callback) {
      const isPaused = !video.playing
      callback(isPaused)
    })

    receiver.on('getCurrentTime', function (callback) {
      callback(video.currentTime)
    })

    receiver.on('setCurrentTime', function (value) {
      video.currentTime = value
    })

    receiver.on('getDuration', function (callback) {
      callback(video.duration)
    })

    receiver.on('getVolume', function (callback) {
      callback(video.volume)
    })

    receiver.on('setVolume', function (value) {
      video.volume = value
    })

    receiver.on('mute', function () {
      video.mute = true
    })

    receiver.on('unmute', function () {
      video.mute = false
    })

    receiver.on('getMuted', function (callback) {
      callback(video.mute)
    })

    receiver.on('getLoop', function (callback) {
      callback(video.loop)
    })

    receiver.on('setLoop', function (value) {
      video.loop = value
    })

    receiver.on('setPlaybackRate', function (value) {
      video.playbackRate = value
    })

    receiver.on('getPlaybackRate', function (callback) {
      callback(video.playbackRate)
    })
  }

  ready () {
    this.receiver.ready()
  }
}

export default MockAdapter
