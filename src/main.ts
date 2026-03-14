import core from './core'
import Player from './player'
import Receiver from './receiver'
import MockAdapter from './adapters/mock'
import VideoJSAdapter from './adapters/video'
import HTML5Adapter from './adapters/html'
import type { PlayerMethods } from './types'

interface PlayerJS {
  Player: typeof Player
  Receiver: typeof Receiver
  MockAdapter: typeof MockAdapter
  VideoJSAdapter: typeof VideoJSAdapter
  HTML5Adapter: typeof HTML5Adapter
  CONTEXT: string
  VERSION: string
  METHODS: PlayerMethods
  addEvent: typeof core.addEvent
}

export type {
  PlayerEvents,
  PlayerMethods,
  PlayerData,
  ReadyData,
  EventCallback,
  MethodCallback,
  GetMethodPromise,
  SetMethodPromise,
  SupportedFeatures,
} from './types'

const CONTEXT = core.CONTEXT
const VERSION = core.VERSION
const METHODS = core.METHODS
const addEvent = core.addEvent

// Attach to the window object explicitly
declare global {
  interface Window {
    playerjs: PlayerJS
  }
}

export { Player, Receiver, VideoJSAdapter, HTML5Adapter, CONTEXT, VERSION, METHODS, addEvent }

