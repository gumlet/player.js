/*
* Does all the wiring up for the backend.
*
* var receiver = new playerjs.Receiver();
* receiver.on('play', function(){ video.play() });
* receiver.on('getDuration', function(callback){ callback(video.duration) });
* receiver.emit('timeupdate', {});
*/

import core from './core'
import type { SupportedFeatures } from './types'

class Receiver {
  public isReady: boolean
  public origin: string
  public methods: { [method: string]: Function }
  public supported: SupportedFeatures
  public eventListeners: { [event: string]: (string | null)[] }
  public reject: boolean

  constructor(events?: string[], methods?: string[]) {

    // Deal with the ready crap.
    this.isReady = false

    // Bind the window message.
    if (document.referrer) {
      this.origin = (new URL(document.referrer)).origin
    } else {
      this.origin = '*'
    }

    // Create a holder for all the methods.
    this.methods = {}

    // holds all the information about what's supported
    this.supported = {
      events: events || core.EVENTS.all(),
      methods: methods || core.METHODS.all()
    }

    // Deals with the adding and removing of event listeners.
    this.eventListeners = {}

    // We can't send any messages.
    this.reject = !(window.self !== window.top && core.POST_MESSAGE)

    // We aren't in an iframe, don't listen.
    if (!this.reject) {
      core.addEvent(window, 'message', (e: MessageEvent) => {
        this.receive(e)
      })
    }
  }

  receive(e: MessageEvent): boolean {
    // Only want to listen to events that came from our origin.
    if (e.origin !== this.origin) {
      return false
    }

    // Browsers that support postMessage also support JSON.
    let data: any = {}
    if (typeof e.data === 'object') {
      data = e.data
    } else {
      try {
        data = window.JSON.parse(e.data)
      } catch (err) {
        console.error('JSON Parse Error', err)
      }
    }

    console.debug('Receiver.receive', e, data)

    // Nothing for us to do.
    if (!data.method) {
      return false
    }

    // make sure the context is correct.
    if (data.context !== core.CONTEXT) {
      return false
    }

    // Make sure we have a valid method.
    if (!core.METHODS.all().includes(data.method)) {
      this.emit('error', {
        code: 2,
        msg: 'Invalid Method "' + data.method + '"'
      })
      return false
    }

    // See if we added a listener
    const listener = !core.isNone(data.listener) ? data.listener : null

    // Add Event Listener.
    if (data.method === 'addEventListener') {
      if (Object.hasOwn(this.eventListeners, data.value)) {
        // If the listener is the same, i.e. null only add it once.
        if (!this.eventListeners[data.value].includes(listener)) {
          this.eventListeners[data.value].push(listener)
        }
      } else {
        this.eventListeners[data.value] = [listener]
      }

      if (data.value === 'ready' && this.isReady) {
        this.ready()
      }
    } else if (data.method === 'removeEventListener') { // Remove the event listener.
      if (Object.hasOwn(this.eventListeners, data.value)) {
        const index = this.eventListeners[data.value].indexOf(listener)

        // if we find the element, remove it.
        if (index > -1) {
          this.eventListeners[data.value].splice(index, 1)
        }

        if (this.eventListeners[data.value].length === 0) {
          delete this.eventListeners[data.value]
        }
      }
    } else { // Go get it.
      this.get(data.method, data.value, listener)
    }

    return true
  }

  get(method: string, value: any, listener: string | null): boolean {

    // Now lets do it.
    if (!Object.hasOwn(this.methods, method)) {
      this.emit('error', {
        code: 3,
        msg: 'Method Not Supported "' + method + '"'
      })
      return false
    }

    const func = this.methods[method]

    if (method.substr(0, 3) === 'get') {
      const callback = (val: any) => {
        this.send(method, val, listener)
      }
      func.call(this, callback)
    } else {
      func.call(this, value)
    }

    return true
  }

  on(event: string, callback: Function): void {
    this.methods[event] = callback
  }

  send(event: string, value?: any, listener?: string | null): boolean {
    console.debug('Receiver.send', event, value, listener)

    if (this.reject) {
      // We are not in a frame, or we don't support POST_MESSAGE
      console.error('Receiver.send.reject', event, value, listener)
      return false
    }

    const data: any = {
      context: core.CONTEXT,
      version: core.VERSION,
      event
    }

    if (!core.isNone(value)) {
      data.value = value
    }

    if (!core.isNone(listener)) {
      data.listener = listener
    }

    const msg = JSON.stringify(data)
    window.parent.postMessage(msg, this.origin === '' ? '*' : this.origin)

    return true
  }

  emit(event: string, value?: any): boolean {
    if (!Object.hasOwn(this.eventListeners, event)) {
      return false
    }

    console.debug('Instance.emit', event, value, this.eventListeners[event])

    for (let i = 0; i < this.eventListeners[event].length; i++) {
      const listener = this.eventListeners[event][i]
      this.send(event, value, listener)
    }

    return true
  }

  ready(): void {
    console.debug('Receiver.ready')
    this.isReady = true

    const data = {
      src: window.location.toString(),
      events: this.supported.events,
      methods: this.supported.methods
    }

    if (!this.emit('ready', data)) {
      this.send('ready', data)
    }
  }
}

export default Receiver
