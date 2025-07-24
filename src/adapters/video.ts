import core from '../core'
import Receiver from '../receiver'

// VideoJS player interface - adjust based on actual VideoJS types if available
interface VideoJSPlayer {
  on(event: string, callback: () => void): void
  play(): void
  pause(): void
  paused(): boolean
  currentTime(time?: number): number
  duration(): number
  volume(vol?: number): number
  loop(loop?: boolean): boolean
  playbackRate(rate?: number): number
}

class VideoJSAdapter {
  public receiver!: Receiver

  constructor(player: VideoJSPlayer) {
    this.init(player)
  }

  init(player: VideoJSPlayer): void {
    core.assert(player, 'VideoJSReceiver requires a player object')

    // Set up the actual receiver
    const receiver = this.receiver = new Receiver()

    /* EVENTS */
    player.on('pause', function () {
      receiver.emit('pause')
    })

    player.on('play', function () {
      receiver.emit('play')
    })

    player.on('timeupdate', function () {
      const seconds = player.currentTime()
      const duration = player.duration()

      if (!seconds || !duration) {
        return false
      }

      const value = {
        seconds,
        duration
      }
      receiver.emit('timeupdate', value)
    })

    player.on('ended', function () {
      receiver.emit('ended')
    })

    player.on('error', function () {
      receiver.emit('error')
    })

    /* METHODS */
    receiver.on('play', function () {
      player.play()
    })

    receiver.on('pause', function () {
      player.pause()
    })

    receiver.on('getPaused', function (callback: (paused: boolean) => void) {
      callback(player.paused())
    })

    receiver.on('getCurrentTime', function (callback: (time: number) => void) {
      callback(player.currentTime())
    })

    receiver.on('setCurrentTime', function (value: number) {
      player.currentTime(value)
    })

    receiver.on('getDuration', function (callback: (duration: number) => void) {
      callback(player.duration())
    })

    receiver.on('getVolume', function (callback: (volume: number) => void) {
      const volume = player.volume() * 100
      callback(volume)
    })

    receiver.on('setVolume', function (value: number) {
      player.volume(value / 100)
    })

    receiver.on('mute', function () {
      player.volume(0)
    })

    receiver.on('unmute', function () {
      player.volume(1)
    })

    receiver.on('getMuted', function (callback: (muted: boolean) => void) {
      const isMuted = player.volume() === 0
      callback(isMuted)
    })

    receiver.on('getLoop', function (callback: (loop: boolean) => void) {
      callback(player.loop())
    })

    receiver.on('setLoop', function (value: boolean) {
      player.loop(value)
    })

    receiver.on('setPlaybackRate', function (value: number) {
      player.playbackRate(value)
    })

    receiver.on('getPlaybackRate', function (callback: (rate: number) => void) {
      callback(player.playbackRate())
    })
  }

  ready(): void {
    this.receiver.ready()
  }
}

export default VideoJSAdapter
