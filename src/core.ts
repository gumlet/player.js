import { PlayerEvents, PlayerMethods, Core } from './types'

const core: Core = {
  EVENTS: {
    READY: 'ready',
    PLAY: 'play',
    PAUSE: 'pause',
    ENDED: 'ended',
    TIMEUPDATE: 'timeupdate',
    PROGRESS: 'progress',
    SEEKED: 'seeked',
    ERROR: 'error',
    FULLSCREEN_CHANGE: 'fullscreenChange',
    PIP_CHANGE: 'pipChange',
    PLAYBACK_RATE_CHANGE: 'playbackRateChange',
    AUDIO_CHANGE: 'audioChange',
    QUALITY_CHANGE: 'qualityChange',
    VOLUME_CHANGE: 'volumeChange',
    all(): string[] {
      const all: string[] = []
      for (const key in core.EVENTS) {
        if (core.has(core.EVENTS, key) && core.isString((core.EVENTS as any)[key])) {
          all.push((core.EVENTS as any)[key])
        }
      }
      return all
    }
  } as PlayerEvents,

  POST_MESSAGE: !!window.postMessage,

  METHODS: {
    PLAY: 'play',
    PAUSE: 'pause',
    GETPAUSED: 'getPaused',
    MUTE: 'mute',
    UNMUTE: 'unmute',
    GETMUTED: 'getMuted',
    SETVOLUME: 'setVolume',
    GETVOLUME: 'getVolume',
    GETDURATION: 'getDuration',
    SETCURRENTTIME: 'setCurrentTime',
    GETCURRENTTIME: 'getCurrentTime',
    SETLOOP: 'setLoop',
    GETLOOP: 'getLoop',
    SETPLAYBACKRATE: 'setPlaybackRate',
    GETPLAYBACKRATE: 'getPlaybackRate',
    REMOVEEVENTLISTENER: 'removeEventListener',
    ADDEVENTLISTENER: 'addEventListener',
    all(): string[] {
      const all: string[] = []
      for (const key in core.METHODS) {
        if (core.has(core.METHODS, key) && core.isString((core.METHODS as any)[key])) {
          all.push((core.METHODS as any)[key])
        }
      }
      return all
    }
  } as PlayerMethods,

  DEBUG: false,
  VERSION: '2.0',
  CONTEXT: 'player.js',

  isString(obj: any): obj is string {
    return Object.prototype.toString.call(obj) === '[object String]'
  },

  has(obj: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key)
  },

  addEvent(elem: any, type: string, eventHandle: (e: any) => void): void {
    if (!elem) { return }
    if (elem.addEventListener) {
      elem.addEventListener(type, eventHandle, false)
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + type, eventHandle)
    } else {
      elem['on' + type] = eventHandle
    }
  },

  isNone(obj: any): obj is null | undefined {
    return (obj === null || obj === undefined)
  },

  assert(test: any, msg?: string): asserts test {
    if (!test) {
      throw msg || 'Player.js Assert Failed'
    }
  },

  generateUUID(): string {
    if (crypto && crypto.randomUUID) {
      return crypto.randomUUID()
    } else {
      const url = URL.createObjectURL(new Blob())
      return url.substring(url.lastIndexOf('/') + 1)
    }
  },

  isArray(obj: any): obj is any[] {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }
}

export default core
