// Core type definitions for Player.js

export interface PlayerEvents {
  READY: 'ready'
  PLAY: 'play'
  PAUSE: 'pause'
  ENDED: 'ended'
  TIMEUPDATE: 'timeupdate'
  PROGRESS: 'progress'
  SEEKED: 'seeked'
  ERROR: 'error'
  FULLSCREEN_CHANGE: 'fullscreenChange'
  PIP_CHANGE: 'pipChange'
  PLAYBACK_RATE_CHANGE: 'playbackRateChange'
  AUDIO_CHANGE: 'audioChange'
  QUALITY_CHANGE: 'qualityChange'
  VOLUME_CHANGE: 'volumeChange'
  all(): string[]
}

export interface PlayerMethods {
  PLAY: 'play'
  PAUSE: 'pause'
  GETPAUSED: 'getPaused'
  MUTE: 'mute'
  UNMUTE: 'unmute'
  GETMUTED: 'getMuted'
  SETVOLUME: 'setVolume'
  GETVOLUME: 'getVolume'
  GETDURATION: 'getDuration'
  SETCURRENTTIME: 'setCurrentTime'
  GETCURRENTTIME: 'getCurrentTime'
  SETLOOP: 'setLoop'
  GETLOOP: 'getLoop'
  SETPLAYBACKRATE: 'setPlaybackRate'
  GETPLAYBACKRATE: 'getPlaybackRate'
  REMOVEEVENTLISTENER: 'removeEventListener'
  ADDEVENTLISTENER: 'addEventListener'
  all(): string[]
}

export interface Core {
  EVENTS: PlayerEvents
  POST_MESSAGE: boolean
  METHODS: PlayerMethods
  DEBUG: boolean
  VERSION: string
  CONTEXT: string
  isString(obj: any): obj is string
  has(obj: object, key: string): boolean
  addEvent(elem: any, type: string, eventHandle: (e: any) => void): void
  isNone(obj: any): obj is null | undefined
  assert(test: any, msg?: string): asserts test
  generateUUID(): string
  isArray(obj: any): obj is any[]
}

export interface PlayerData {
  method?: string
  value?: any
  context?: string
  version?: string
  listener?: string
  event?: string
}

export interface KeeperData {
  id: string
  event: string
  cb: Function
  ctx?: any
  one: boolean
}

export interface ReadyData {
  event: string
  value: {
    src: string
    events?: string[]
    methods?: string[]
  }
}

export type EventCallback = (data?: any) => void
export type MethodCallback = (value?: any) => void

export interface SupportedFeatures {
  events: string[]
  methods: string[]
}
