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

const playerjs: PlayerJS = {
  Player,
  Receiver,
  MockAdapter,
  VideoJSAdapter,
  HTML5Adapter,
  CONTEXT: core.CONTEXT,
  VERSION: core.VERSION,
  METHODS: core.METHODS,
  addEvent: core.addEvent
}

// Attach to the window object explicitly
declare global {
  interface Window {
    playerjs: PlayerJS
  }
}

if (typeof window !== 'undefined') {
  window.playerjs = playerjs
}

export default playerjs
