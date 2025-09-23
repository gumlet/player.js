/*
* Keeper is just a method for keeping track of all the callbacks.
*/
import core from './core'
import type { KeeperData, EventCallback } from './types'

class Keeper {
  private data: { [event: string]: KeeperData[] }

  constructor() {
    this.data = {}
  }

  has(event: string, id?: string): boolean {
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

  add(id: string, event: string, cb: EventCallback, ctx?: any, one: boolean = false): void {
    const d: KeeperData = {
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

  execute(event: string, id?: string, data?: any, ctx?: any): boolean {
    if (!this.has(event, id)) {
      return false
    }

    const keep: KeeperData[] = []
    const execute: Array<{cb: EventCallback, ctx: any, data: any}> = []

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

    return true
  }

  on(id: string, event: string, cb: EventCallback, ctx?: any): void {
    this.add(id, event, cb, ctx, false)
  }

  one(id: string, event: string, cb: EventCallback, ctx?: any): void {
    this.add(id, event, cb, ctx, true)
  }

  off(event: string, cb?: EventCallback): string[] {
    // We should probably restructure so this is a bit less of a pain.
    const listeners: string[] = []

    if (!Object.hasOwn(this.data, event)) {
      return listeners
    }

    const keep: KeeperData[] = []

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
