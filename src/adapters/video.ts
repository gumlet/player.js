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
    const receiver = new Receiver()
    this.receiver = receiver

    /* EVENTS */
    player.on('pause', () => {
      receiver.emit('pause')
    })

    player.on('play', () => {
      receiver.emit('play')
    })

    player.on('timeupdate', () => {
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

    player.on('ended', () => {
      receiver.emit('ended')
    })

    player.on('error', () => {
      receiver.emit('error')
    })

    /* METHODS */
    receiver.on('play', () => {
      player.play()
    })

    receiver.on('pause', () => {
      player.pause()
    })

    receiver.on('getPaused', (callback: (paused: boolean) => void) => {
      callback(player.paused())
    })

    receiver.on('getCurrentTime', (callback: (time: number) => void) => {
      callback(player.currentTime())
    })

    receiver.on('setCurrentTime', (value: number) => {
      player.currentTime(value)
    })

    receiver.on('getDuration', (callback: (duration: number) => void) => {
      callback(player.duration())
    })

    receiver.on('getVolume', (callback: (volume: number) => void) => {
      const volume = player.volume() * 100
      callback(volume)
    })

    receiver.on('setVolume', (value: number) => {
      player.volume(value / 100)
    })

    receiver.on('mute', () => {
      player.volume(0)
    })

    receiver.on('unmute', () => {
      player.volume(1)
    })

    receiver.on('getMuted', (callback: (muted: boolean) => void) => {
      const isMuted = player.volume() === 0
      callback(isMuted)
    })

    receiver.on('getLoop', (callback: (loop: boolean) => void) => {
      callback(player.loop())
    })

    receiver.on('setLoop', (value: boolean) => {
      player.loop(value)
    })

    receiver.on('setPlaybackRate', (value: number) => {
      player.playbackRate(value)
    })

    receiver.on('getPlaybackRate', (callback: (rate: number) => void) => {
      callback(player.playbackRate())
    })
  }

  ready(): void {
    this.receiver.ready()
  }
}

export default VideoJSAdapter
