/*
* Player.js is a javascript library for interacting with iframes via
* postMessage that use an Open Player Spec
*
*/
import core from './core'
import Keeper from './keeper'

const READIED = []

class Player {
  constructor (elem, debug = false) {
    const self = this
    this.READIED = READIED

    if (core.isString(elem)) {
      elem = document.getElementById(elem)
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
      core.addEvent(window, 'message', function (e) {
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

  send (data, callback, ctx) {
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
      this.keeper.one(id, data.method, callback, ctx)
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

    if (this.loaded === true) {
      this.elem.contentWindow.postMessage(JSON.stringify(data), this.origin)
    }

    return true
  }

  receive (e) {
    if (this.debug) {
      console.debug('Player.receive', e)
    }

    if (e.origin !== this.origin) {
      return false
    }

    let data
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
      this.ready(data)
    }

    if (this.keeper.has(data.event, data.listener)) {
      this.keeper.execute(data.event, data.listener, data.value, this)
    }
  }

  ready (data) {
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
        this.keeper.execute(obj.event, obj.listener, true, this)
      }
      this.send(obj)
    }
    this.queue = []
  }

  on (event, callback, ctx) {
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

  off (event, callback) {
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
  supports (evtOrMethod, names) {
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
}

// create function to add to the Player prototype
function createPrototypeFunction (name) {
  return function () {
    const data = {
      method: name
    }

    let args = Array.prototype.slice.call(arguments)

    // for getters add the passed parameters to the arguments for the send call
    if (/^get/.test(name)) {
      core.assert(args.length > 0, 'Get methods require a callback.')
      args.unshift(data)
    } else {
      // for setter add the first arg to the value field
      if (/^set/.test(name)) {
        core.assert(args.length !== 0, 'Set methods require a value.')
        data.value = args[0]
      }
      args = [data]
    }

    this.send.apply(this, args)
  }
}

// Loop through the methods to add them to the prototype.
for (const methodName of core.METHODS.all()) {
  if (!Object.hasOwn(Player.prototype, methodName)) {
    Player.prototype[methodName] = createPrototypeFunction(methodName)
  }
}

core.addEvent(window, 'message', function (e) {
  let data
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
