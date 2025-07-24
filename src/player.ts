/*
* Player.js is a javascript library for interacting with iframes via
* postMessage that use an Open Player Spec
*
*/
import core from './core'
import Keeper from './keeper'
import { PlayerData, ReadyData, EventCallback, MethodCallback, GetMethodPromise, SetMethodPromise } from './types'

const READIED: string[] = []

class Player {
  public READIED: string[]
  public elem: HTMLIFrameElement
  public debug: boolean
  public origin: string
  public keeper: Keeper
  public isReady: boolean
  public queue: PlayerData[]
  public events: string[]
  public methods: string[]
  public loaded?: boolean

  constructor(elem: string | HTMLIFrameElement, debug: boolean = false) {
    const self = this
    this.READIED = READIED

    if (core.isString(elem)) {
      const element = document.getElementById(elem) as HTMLIFrameElement
      if (!element) {
        throw new Error(`Element with id "${elem}" not found`)
      }
      elem = element
    }

    this.elem = elem

    this.debug = debug

    // make sure we have an iframe
    core.assert(elem.nodeName === 'IFRAME',
      'playerjs.Player constructor requires an Iframe, got "' + elem.nodeName + '"')
    core.assert(elem.src,
      'playerjs.Player constructor requires a Iframe with a \'src\' attribute.')

    // Figure out the origin of where we are sending messages.
    this.origin = (new URL(elem.src)).origin

    // Event handling.
    this.keeper = new Keeper()

    // Queuing before ready.
    this.isReady = false
    this.queue = []

    // Assume that everything is supported, unless we know otherwise.
    this.events = core.EVENTS.all()
    this.methods = core.METHODS.all()

    if (core.POST_MESSAGE) {
      // Set up the reciever.
      core.addEvent(window, 'message', function (e: MessageEvent) {
        self.receive(e)
      })
    } else {
      console.error('Post Message is not Available.')
    }

    // See if we caught the src event first, otherwise assume we haven't loaded
    if (READIED.includes(elem.src)) {
      self.loaded = true
    } else {
      // Try the onload event, just lets us give another test.
      this.elem.onload = function () {
        self.loaded = true
      }
    }
  }

  send(data: PlayerData, callback?: MethodCallback, ctx?: any): boolean {
    // Add the context and version to the data.
    data.context = core.CONTEXT
    data.version = core.VERSION

    // We are expecting a response.
    if (callback) {
      // Create a UUID
      const id = core.generateUUID()

      // Set the listener.
      data.listener = id

      // Only hang on to this listener once.
      this.keeper.one(id, data.method || '', callback, ctx)
    }

    if (!this.isReady && data.value !== 'ready') {
      if (this.debug) {
        console.debug('Player.queue', data)
      }
      this.queue.push(data)
      return false
    }

    if (this.debug) {
      console.debug('Player.send', data, this.origin)
    }

    if (this.loaded === true && this.elem.contentWindow) {
      this.elem.contentWindow.postMessage(JSON.stringify(data), this.origin)
    }

    return true
  }

  receive(e: MessageEvent): boolean {
    if (this.debug) {
      console.debug('Player.receive', e)
    }

    if (e.origin !== this.origin) {
      return false
    }

    let data: any
    try {
      data = JSON.parse(e.data)
    } catch (err) {
      // Not a valid response.
      return false
    }

    // abort if this message wasn't a player.js message
    if (data.context !== core.CONTEXT) {
      return false
    }

    // We need to determine if we are ready.
    if (data.event === 'ready' && data.value && data.value.src === this.elem.src) {
      this.ready(data as ReadyData)
    }

    if (this.keeper.has(data.event, data.listener)) {
      this.keeper.execute(data.event, data.listener, data.value, this)
    }

    return true
  }

  ready(data: ReadyData): boolean {
    if (this.isReady === true) {
      return false
    }

    // If we got a list of supported methods, we should set them.
    if (data.value.events) {
      this.events = data.value.events
    }
    if (data.value.methods) {
      this.methods = data.value.methods
    }

    // set ready.
    this.isReady = true
    this.loaded = true

    // Clear the queue
    for (let i = 0; i < this.queue.length; i++) {
      const obj = this.queue[i]

      if (this.debug) {
        console.debug('Player.dequeue', obj)
      }

      if (data.event === 'ready') {
        this.keeper.execute(obj.event || '', obj.listener, true, this)
      }
      this.send(obj)
    }
    this.queue = []

    return true
  }

  on(event: string, callback: EventCallback, ctx?: any): boolean {
    const id = core.generateUUID()

    if (event === 'ready') {
      // We only want to call ready once.
      this.keeper.one(id, event, callback, ctx)
    } else {
      this.keeper.on(id, event, callback, ctx)
    }

    this.send({
      method: 'addEventListener',
      value: event,
      listener: id
    })

    return true
  }

  off(event: string, callback?: EventCallback): boolean {
    const listeners = this.keeper.off(event, callback)
    if (this.debug) {
      console.debug('Player.off', listeners)
    }

    if (listeners.length > 0) {
      for (const i in listeners) {
        this.send({
          method: 'removeEventListener',
          value: event,
          listener: listeners[i]
        })
      }
      return true
    }

    return false
  }

  // Based on what ready passed back, we can determine if the events/method are
  // supported by the player.
  supports(evtOrMethod: 'event' | 'method', names: string | string[]): boolean {
    core.assert(['method', 'event'].includes(evtOrMethod),
      'evtOrMethod needs to be either "event" or "method" got ' + evtOrMethod)

    // Make everything an array.
    names = core.isArray(names) ? names : [names]

    const all = evtOrMethod === 'event' ? this.events : this.methods

    for (let i = 0; i < names.length; i++) {
      if (!all.includes(names[i])) {
        return false
      }
    }

    return true
  }

  // Dynamic method generation will be added via the prototype modification below
  // Method overloads for both promise and callback styles
  
  // Play/Pause methods (no return value needed)
  play?(): Promise<void>
  pause?(): Promise<void>
  mute?(): Promise<void>
  unmute?(): Promise<void>
  
  // Getter methods with overloads
  getPaused?(): GetMethodPromise<boolean>
  getPaused?(callback: MethodCallback): void
  
  getMuted?(): GetMethodPromise<boolean>
  getMuted?(callback: MethodCallback): void
  
  getVolume?(): GetMethodPromise<number>
  getVolume?(callback: MethodCallback): void
  
  getDuration?(): GetMethodPromise<number>
  getDuration?(callback: MethodCallback): void
  
  getCurrentTime?(): GetMethodPromise<number>
  getCurrentTime?(callback: MethodCallback): void
  
  getLoop?(): GetMethodPromise<boolean>
  getLoop?(callback: MethodCallback): void
  
  getPlaybackRate?(): GetMethodPromise<number>
  getPlaybackRate?(callback: MethodCallback): void
  
  // Setter methods
  setVolume?(volume: number): SetMethodPromise
  setCurrentTime?(time: number): SetMethodPromise
  setLoop?(loop: boolean): SetMethodPromise
  setPlaybackRate?(rate: number): SetMethodPromise
}

// create function to add to the Player prototype
function createPrototypeFunction(name: string) {
  return function (this: Player, ...args: any[]): any {
    const data: PlayerData = {
      method: name
    }

    // for getters, check if callback is provided or return a promise
    if (/^get/.test(name)) {
      // If a callback is provided, use callback style
      if (args.length > 0 && typeof args[0] === 'function') {
        const callback = args[0]
        this.send(data, callback, args[1])
        return
      } else {
        // Return a promise
        return new Promise((resolve, reject) => {
          this.send(data, (value: any) => {
            resolve(value)
          })
        })
      }
    } else {
      // for setters and action methods, return a promise
      if (/^set/.test(name)) {
        core.assert(args.length !== 0, 'Set methods require a value.')
        data.value = args[0]
      }
      
      // For action methods (play, pause, mute, unmute) and setters, return promise
      return new Promise<void>((resolve, reject) => {
        // For action methods, we don't need to wait for a response
        if (['play', 'pause', 'mute', 'unmute'].includes(name)) {
          this.send(data)
          resolve()
        } else {
          // For setters, we might want to wait for confirmation
          this.send(data, () => {
            resolve()
          })
        }
      })
    }
  }
}

// Loop through the methods to add them to the prototype.
for (const methodName of core.METHODS.all()) {
  if (!Object.prototype.hasOwnProperty.call(Player.prototype, methodName)) {
    (Player.prototype as any)[methodName] = createPrototypeFunction(methodName)
  }
}

core.addEvent(window, 'message', function (e: MessageEvent) {
  let data: any
  try {
    data = JSON.parse(e.data)
  } catch (err) {
    return false
  }

  // abort if this message wasn't a player.js message
  if (data.context !== core.CONTEXT) {
    return false
  }

  // We need to determine if we are ready.
  if (data.event === 'ready' && data.value && data.value.src) {
    READIED.push(data.value.src)
  }
})

export default Player
