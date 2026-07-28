import HTML5Adapter from './adapters/html'
import type MockAdapter from './adapters/mock'
import VideoJSAdapter from './adapters/video'
import core from './core'
import Player from './player'
import Receiver from './receiver'
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
  EventCallback, GetMethodPromise, MethodCallback, PlayerData, PlayerEvents,
  PlayerMethods, ReadyData, SetMethodPromise,
  SupportedFeatures
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

export { addEvent, CONTEXT, HTML5Adapter, METHODS, Player, Receiver, VERSION, VideoJSAdapter }

