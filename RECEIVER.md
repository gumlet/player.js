# Player.js Receiver

If you are looking to implement the Player.js spec, we include a Receiver that will allow you to easily listen to events and takes care of the house keeping.

## Basic Usage

```js
const receiver = new playerjs.Receiver();

receiver.on('play', () => {
  video.play();
  receiver.emit('play');
});

receiver.on('pause', () => {
  video.pause();
  receiver.emit('pause');
});

receiver.on('getDuration', callback => callback(video.duration));

receiver.on('getVolume', callback => callback(video.volume*100));

receiver.on('setVolume', value => video.volume = (value/100));

receiver.on('mute', () => video.mute = true)

receiver.on('unmute', () => video.mute = false);

receiver.on('getMuted', callback => callback(video.mute));

receiver.on('getLoop', callback => callback(video.loop));

receiver.on('setLoop', value => video.loop = value);

video.addEventListener('ended', () => receiver.emit('ended'));

video.addEventListener('timeupdate', () => {
  receiver.emit('timeupdate', {
    seconds: video.currentTime,
    duration: video.duration
  });
});

receiver.ready();
```

## Methods

### `on(event: string, callback: Function): void`
Requests an event from the video. The above player methods should be implemented. If the event expects a return value a callback will be passed into the function call:

```js
receiver.on('getDuration', callback => callback(video.duration));
```

Otherwise you can safely ignore any inputs:

```js
receiver.on('play', callback => video.play());
```

### `emit(event: string, data?: any): void`
Sends events to the parent as long as someone is listening. The above player events should be implemented. If a value is expected, it should be passed in as the second argument:

```js
receiver.emit('timeupdate', { seconds: 20, duration: 40 });
```

### `ready(): void`
Once everything is in place and you are ready to start responding to events, call this method. It performs some house keeping, along with emitting `ready`:

```js
receiver.ready();
```

## Adapters

In order to make it super easy to add Player.js to any embed, we have written adapters for common video libraries. We currently have adapters for [Video.js](http://www.videojs.com/), [JWPlayer](https://www.jwplayer.com/) and [HTML5 Video](http://dev.w3.org/html5/spec-author-view/video.html). An Adapter wraps the Receiver and wires up all the events so your iframe is Player.js compatible.

### VideoJSAdapter

An adapter for [Video.js](http://www.videojs.com/):

```js
videojs("video", {}, () => {
  const adapter = new playerjs.VideoJSAdapter(this);
  // ... Do other things to initialize your video.

  // Start accepting events
  adapter.ready();
});
```

### HTML5Adapter

An adapter for [HTML5 Video](http://dev.w3.org/html5/spec-author-view/video.html):

```js
const video = document.getElementById('video');
video.load();

const adapter = playerjs.HTML5Adapter(video);

// Start accepting events
adapter.ready();
```

## Implementation Notes

When implementing the Player.js spec:

1. Make sure to call `receiver.ready()` once your player is fully initialized
2. Implement all required methods (play, pause, getDuration, etc.)
3. Emit appropriate events during playback (timeupdate, ended, etc.)
4. Handle both getter methods (with callbacks) and setter methods appropriately
5. Use adapters when possible to reduce implementation complexity
