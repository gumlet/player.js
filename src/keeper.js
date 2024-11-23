/*
* Keeper is just a method for keeping track of all the callbacks.
*/
import core from './core'

class Keeper {
  constructor () {
    this.data = {}
  }

  has (event, id) {
    if (!Object.hasOwn(this.data, event)) {
      return false
    }

    if (core.isNone(id)) {
      return true
    }

    // Figure out if we have the event.
    const events = this.data[event]

    for (let i = 0; i < events.length; i++) {
      if (events[i].id === id) {
        return true
      }
    }

    return false
  }

  add (id, event, cb, ctx, one) {
    const d = {
      id,
      event,
      cb,
      ctx,
      one
    }

    if (this.has(event)) {
      this.data[event].push(d)
    } else {
      this.data[event] = [d]
    }
  }

  execute (event, id, data, ctx) {
    if (!this.has(event, id)) {
      return false
    }

    const keep = []
    const execute = []

    for (let i = 0; i < this.data[event].length; i++) {
      const d = this.data[event][i]

      // There are omni events, in that they do not have an id. i.e "ready".
      // Or there is an ID and we only want to execute the right id'd method.
      if (core.isNone(id) || (!core.isNone(id) && d.id === id)) {
        execute.push({
          cb: d.cb,
          ctx: d.ctx ? d.ctx : ctx,
          data
        })

        // If we only wanted to execute this once.
        if (d.one === false) {
          keep.push(d)
        }
      } else {
        keep.push(d)
      }
    }

    if (keep.length === 0) {
      delete this.data[event]
    } else {
      this.data[event] = keep
    }

    // We need to execute everything after we deal with the one stuff. otherwise
    // we have issues to order of operations.
    for (let n = 0; n < execute.length; n++) {
      const e = execute[n]
      e.cb.call(e.ctx, e.data)
    }
  }

  on (id, event, cb, ctx) {
    this.add(id, event, cb, ctx, false)
  }

  one (id, event, cb, ctx) {
    this.add(id, event, cb, ctx, true)
  }

  off (event, cb) {
    // We should probably restructure so this is a bit less of a pain.
    const listeners = []

    if (!Object.hasOwn(this.data, event)) {
      return listeners
    }

    const keep = []

    // Loop through everything.
    for (let i = 0; i < this.data[event].length; i++) {
      const data = this.data[event][i]
      // If we only keep if there was a CB and the CB is there.
      if (!core.isNone(cb) && data.cb !== cb) {
        keep.push(data)
      } else if (!core.isNone(data.id)) {
        listeners.push(data.id)
      }
    }

    if (keep.length === 0) {
      delete this.data[event]
    } else {
      this.data[event] = keep
    }

    return listeners
  }
}

export default Keeper
