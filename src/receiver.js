/*globals playerjs:true*/
/*
* Does all the wiring up for the backend.
*
* var receiver = new playerjs.Receiver();
* receiver.on('play', function(){ video.play() });
* receiver.on('getDuration', function(callback){ callback(video.duration) });
* receiver.emit('timeupdate', {});
*/

import core from './core';

class Receiver {
  constructor(events, methods) {
    let self = this;

    // Deal with the ready crap.
    this.isReady = false;

    // Bind the window message.
    this.origin =(new URL(document.referrer)).origin;

    //Create a holder for all the methods.
    this.methods = {};

    // holds all the information about what's supported
    this.supported = {
      events: events ? events : core.EVENTS.all(),
      methods: methods ? methods : core.METHODS.all()
    };

    // Deals with the adding and removing of event listeners.
    this.eventListeners = {};

    // We can't send any messages.
    this.reject = !(window.self !== window.top && core.POST_MESSAGE);

    // We aren't in an iframe, don't listen.
    if (!this.reject) {
      core.addEvent(window, 'message', function (e) {
        self.receive(e);
      });
    }
  }

  receive(e) {
    // Only want to listen to events that came from our origin.
    if (e.origin !== this.origin) {
      return false;
    }

    // Browsers that support postMessage also support JSON.
    var data = {};
    if (typeof e.data === "object") {
      data = e.data;
    } else {
      try {
        data = window.JSON.parse(e.data);
      } catch (err) {
        console.error('JSON Parse Error', err);
      }
    }

    console.debug('Receiver.receive', e, data);

    // Nothing for us to do.
    if (!data.method) {
      return false;
    }

    // make sure the context is correct.
    if (data.context !== playerjs.CONTEXT) {
      return false;
    }

    // Make sure we have a valid method.
    if (!playerjs.METHODS.all().includes(data.method)) {
      this.emit('error', {
        code: 2,
        msg: 'Invalid Method "' + data.method + '"'
      });
      return false;
    }

    // See if we added a listener
    var listener = !playerjs.isNone(data.listener) ? data.listener : null;

    // Add Event Listener.
    if (data.method === 'addEventListener') {
      if (this.eventListeners.hasOwnProperty(data.value)) {
        //If the listener is the same, i.e. null only add it once.
        if (playerjs.indexOf(this.eventListeners[data.value], listener) === -1) {
          this.eventListeners[data.value].push(listener);
        }
      } else {
        this.eventListeners[data.value] = [listener];
      }

      if (data.value === 'ready' && this.isReady) {
        this.ready();
      }
    }
    // Remove the event listener.
    else if (data.method === 'removeEventListener') {
      if (this.eventListeners.hasOwnProperty(data.value)) {
        var index = playerjs.indexOf(this.eventListeners[data.value], listener);

        // if we find the element, remove it.
        if (index > -1) {
          this.eventListeners[data.value].splice(index, 1);
        }

        if (this.eventListeners[data.value].length === 0) {
          delete this.eventListeners[data.value];
        }
      }
    }
    // Go get it.
    else {
      this.get(data.method, data.value, listener);
    }
  }

  get(method, value, listener) {
    var self = this;

    // Now lets do it.
    if (!this.methods.hasOwnProperty(method)) {
      this.emit('error', {
        code: 3,
        msg: 'Method Not Supported"' + method + '"'
      });
      return false;
    }

    var func = this.methods[method];

    if (method.substr(0, 3) === 'get') {
      var callback = function (val) {
        self.send(method, val, listener);
      };
      func.call(this, callback);
    } else {
      func.call(this, value);
    }
  }

  on(event, callback) {
    this.methods[event] = callback;
  }

  send(event, value, listener) {

    playerjs.log('Receiver.send', event, value, listener);

    if (this.reject) {
      // We are not in a frame, or we don't support POST_MESSAGE
      playerjs.log('Receiver.send.reject', event, value, listener);
      return false;
    }

    var data = {
      context: playerjs.CONTEXT,
      version: playerjs.VERSION,
      event: event
    };

    if (!playerjs.isNone(value)) {
      data.value = value;
    }

    if (!playerjs.isNone(listener)) {
      data.listener = listener;
    }

    var msg = JSON.stringify(data);
    window.parent.postMessage(msg, this.origin === "" ? '*' : this.origin);
  }

  emit(event, value) {

    if (!this.eventListeners.hasOwnProperty(event)) {
      return false;
    }

    playerjs.log('Instance.emit', event, value, this.eventListeners[event]);

    for (var i = 0; i < this.eventListeners[event].length; i++) {
      var listener = this.eventListeners[event][i];
      this.send(event, value, listener);
    }

    return true;
  }

  ready() {
    playerjs.log('Receiver.ready');
    this.isReady = true;

    var data = {
      src: window.location.toString(),
      events: this.supported.events,
      methods: this.supported.methods
    };

    if (!this.emit('ready', data)) {
      this.send('ready', data);
    }

  }
}

export default Receiver;
