Player.js
=========

[![](https://data.jsdelivr.com/v1/package/npm/@gumlet/player.js/badge)](https://www.jsdelivr.com/package/npm/@gumlet/player.js)
[![](https://img.shields.io/npm/v/@gumlet/player.js.svg
)](https://www.npmjs.com/package/@gumlet/player.js)


A JavaScript library for interacting with iframes that support Player.js
spec.

```js
const player = new playerjs.Player('iframe');

player.on('ready', async () => {
  player.on('play', () => {
    console.log('play');
  });

  // Promise-based API
  const duration = await player.getDuration();
  console.log(duration);

  if (player.supports('method', 'mute')) {
    await player.mute();
  }

  await player.play();
});
```

Install
-------

Player.js is hosted on JSDelivr's CDN. :

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@gumlet/player.js@2.0/dist/player.min.js"></script>
```

install via npm :

```sh
npm install @gumlet/player.js
```

TypeScript Support
------------------

Player.js v2.0.16+ includes full TypeScript support with type definitions included. The library is written in TypeScript and provides comprehensive type safety:

```typescript
import playerjs from '@gumlet/player.js';

const player = new playerjs.Player('iframe');

player.on('ready', async () => {
  // Promise-based API (recommended)
  try {
    const duration = await player.getDuration();
    console.log(`Duration: ${duration} seconds`);
    
    if (player.supports('method', 'mute')) {
      await player.mute();
    }
    
    await player.play();
  } catch (error) {
    console.error('Player error:', error);
  }
  
  // Callback-based API (backward compatibility)
  player.getDuration((duration: number) => {
    console.log(`Duration: ${duration} seconds`);
  });
});
```

### Promise-Based API

All player methods now return promises, making it easier to work with async/await patterns:

```typescript
// Get multiple values concurrently
const [duration, currentTime, volume] = await Promise.all([
  player.getDuration(),
  player.getCurrentTime(),
  player.getVolume()
]);

// Chain operations
await player.setCurrentTime(10);
await player.setVolume(75);
await player.play();
```

### Type Definitions

The library exports the following main types:

- `Player` - Main player class for controlling embedded players
- `Receiver` - For implementing player.js support in your own iframe
- `MockAdapter`, `HTML5Adapter`, `VideoJSAdapter` - Adapter classes for different player types

All methods and events are fully typed, providing excellent IDE support and compile-time error checking.

Ready
-----

Because of the dance that we need to do between both iframes, you should
always wait till the `ready` events to fire before interacting with the
player object. However, the player will internally queue messages until
ready is called. :

```js
const player = new playerjs.Player('iframe');

player.on(playerjs.Events.PLAY, () => console.log('play'));

player.on('ready', () => player.setCurrentTime(20));
```

Timing
------

The timing between when the iframe is added and when the ready event is
fired is important. Sadly we cannot fire the ready event till the iframe
is loaded, but there is no concrete way of telling when postmessage is
available to us.

The best way is to do one of the following.

### Create the iframe via JavaScript

```js
const iframe = document.createElement('iframe');
iframe.src = 'https://example.com/iframe';
document.body.appendChild(iframe);

const player = new playerjs.Player(iframe);
```

In this case, Player.js will listen to the onload event of the iframe
and only try to communicate when ready.

### Wait for the document to be ready.

```html
<iframe src="//example.com/iframe"></iframe>

<script>
  $(document).on('ready', () => {
    $('iframes').each(() => {
      const player = new playerjs.Player(this);
      player.on('ready', () => player.play());
    });
  });
</script>
```

At this point we can reasonably assume that the iframe's been loaded and
the ready. Player.js will take care of listening for ready events that
were fired before the player is set up.

API Styles
----------

Player.js supports both modern promise-based and traditional callback-based APIs:

### Promise-Based API (Recommended)

All methods return promises, enabling clean async/await patterns:

```js
// Modern async/await style
player.on('ready', async () => {
  try {
    const duration = await player.getDuration();
    const currentTime = await player.getCurrentTime();
    
    await player.setVolume(50);
    await player.play();
  } catch (error) {
    console.error('Player error:', error);
  }
});

// Promise chains
player.getDuration()
  .then(duration => console.log(`Duration: ${duration}`))
  .then(() => player.play())
  .catch(error => console.error(error));
```

### Callback-Based API (Backward Compatibility)

Traditional callback style is still supported:

```js
player.on('ready', () => {
  player.getDuration(duration => {
    console.log(`Duration: ${duration}`);
    player.play();
  });
});
```

Methods
-------

`play`: Promise<void>
Play the media:

```js
// Promise-based
await player.play();

// Callback-based (legacy)
player.play();
```

`pause`: Promise<void>
Pause the media:

```js
// Promise-based
await player.pause();

// Callback-based (legacy)
player.pause();
```

`getPaused`: Promise<boolean> | void
Determine if the media is paused:

```js
// Promise-based
const isPaused = await player.getPaused();
console.log('paused:', isPaused);

// Callback-based
player.getPaused(function(value){
  console.log('paused:', value);
});
```

`mute`: Promise<void>
Mute the media:

```js
// Promise-based
await player.mute();

// Callback-based (legacy)
player.mute();
```

`unmute`: Promise<void>
Unmute the media:

```js
// Promise-based
await player.unmute();

// Callback-based (legacy)
player.unmute();
```

`getMuted`: boolean
Determine if the media is muted:

```js
player.getMuted(value => console.log('muted:', value));
```

`setVolume`: void
Set the volume. Value needs to be between 0-100:

```
player.setVolume(50);
```

`getVolume`: number
Get the volume. Value will be between 0-100:

```js
player.getVolume(value => console.log('getVolume:', value));
```

`getDuration`: number
Get the duration of the media is seconds:

```js
player.getDuration(value => console.log('getDuration:', value));
```

`setCurrentTime`: number
Perform a seek to a particular time in seconds:

```js
player.setCurrentTime(50);
```

`getCurrentTime`: number
Get the current time in seconds of the video:

```js
player.getCurrentTime(value => console.log('getCurrentTime:', value));
```

`setPlaybackRate`: number
Set the playback rate which are available in the player. Doesn't returns an error if the passed playback rate is not available. 

```js
player.setPlaybackRate(0.5);
```

`getPlaybackRate`: number
Get the current playback rate of the player:

```js
player.getPlaybackRate(value => console.log('getPlaybackRate:', value));
```

`off`: void
Remove an event listener. If the listener is specified it should remove
only that listener, otherwise remove all listeners:

```js
player.off('play');

player.off('play', playCallback);
```

`on`: void
Add an event listener:

```js
player.on('play', () => console.log('play'));
```

`supports`: \['method', 'event'\], methodOrEventName
Determines if the player supports a given event or method.

```js
player.supports('method', 'getDuration');
player.supports('event', 'ended');
```

Events
------

Events that can be listened to.

`ready`
fired when the media is ready to receive commands. This is fired
regardless of listening to the event. Note: As outlined in the PlayerJs
Spec, you may run into inconsistencies if you have multiple players on
the page with the same `src`. To get around this, simply append a UUID
or a timestamp to the iframe's src to guarantee that all players on the
page have a unique `src`.

`progress`
fires when the media is loading additional media for playback:

```js
{
  percent: 0.8,
}
```

`timeupdate`
fires during playback:

```js
{
  seconds: 10,
  duration: 40
}
```

`play`
fires when the video starts to play.

`pause`
fires when the video is paused.

`ended`
fires when the video is finished.

`fullscreenChange`
fires when the video fullscreen is changed:

```js
{
  isFullScreen: true // or false
}
```

`pipChange`
fires when the video is put to or brought back from picture-in-picture.

```js
{
  isPIP: true // or false
}
```

`playbackRateChange`
fires when the video playback rate is changed by user.

`audioChange`
fires when the audio track of video is changed.

`qualityChange`
fires when the video quality is changed.

`volumeChange`
fires when the volume level of the player is changed. It also gets fired when the player is muted or unmuted, along with muted and unmuted events respectively.

```js
{
  quality: '720p'
}
```

`seeked`
fires when the video has been seeked by the user. Gives seeked to time in seconds and total duration of video.

```js
{
  seconds: 10
  duration: 50
}
```

`error`
fires when an error occurs.

Receiver
--------

If you are looking to implement the Player.js spec, we include a
Receiver that will allow you to easily listen to events and takes care
of the house keeping.

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

Methods
-------

`on`
Requests an event from the video. The above player methods should be
implemented. If the event expects a return value a callback will be
passed into the function call:

```js
receiver.on('getDuration', callback => callback(video.duration));
```

Otherwise you can safely ignore any inputs:

```js
receiver.on('play', callback => video.play());
```

`emit`
Sends events to the parent as long as someone is listing. The above
player events should be implemented. If a value is expected, it should
be passed in as the second argument:

    receiver.emit('timeupdate', { seconds:20, duration: 40 });

`ready`
Once everything is in place and you are ready to start responding to
events, call this method. It performs some house keeping, along with
emitting `ready`:

```js
receiver.ready();
```
Adapters
--------

In order to make it super easy to add Player.js to any embed, we have
written adapters for common video libraries. We currently have adapters
for [Video.js](http://www.videojs.com/),
[JWPlayer](https://www.jwplayer.com/) and [HTML5
Video](http://dev.w3.org/html5/spec-author-view/video.html). An Adapter
wraps the Receiver and wires up all the events so your iframe is
Player.js compatible.

### VideoJSAdapter

An adapter for [Video.js](http://www.videojs.com/). :

```js
videojs("video", {}, () => {
  const adapter = new playerjs.VideoJSAdapter(this);
  // ... Do other things to initialize your video.

  // Start accepting events
  adapter.ready();
});
```
### HTML5Adapter

An adapter for [HTML5
Video](http://dev.w3.org/html5/spec-author-view/video.html). :

```js
const video = document.getElementById('video');
video.load();

const adapter = playerjs.HTML5Adapter(video);

// Start accepting events
adapter.ready();
```
