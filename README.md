Player.js
=========

[![](https://data.jsdelivr.com/v1/package/npm/@gumlet/player.js/badge)](https://www.jsdelivr.com/package/npm/@gumlet/player.js)
[![](https://img.shields.io/npm/v/@gumlet/player.js.svg
)](https://www.npmjs.com/package/@gumlet/player.js)


A JavaScript library for interacting with iframes that support Player.js spec.

```js
const player = new playerjs.Player('iframe');

player.on('ready', async () => {
  player.on('play', () => {
    console.log('play');
  });

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

Player.js is hosted on JSDelivr's CDN:

```html
<script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@gumlet/player.js@3.0/dist/player.min.js"></script>
```

Install via npm:

```sh
npm install @gumlet/player.js
```

TypeScript Support
------------------

Player.js v3.0.0+ includes full TypeScript support with type definitions included. The library is written in TypeScript and provides comprehensive type safety:

```typescript
import playerjs from '@gumlet/player.js';

const player = new playerjs.Player('iframe');

player.on('ready', async () => {
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
});
```

### Promise-Based API

All player methods return promises, making it easier to work with async/await patterns:

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

Ready
-----

Because of the dance that we need to do between both iframes, you should always wait till the `ready` event fires before interacting with the player object. However, the player will internally queue messages until ready is called:

```js
const player = new playerjs.Player('iframe');

player.on('ready', async () => {
  await player.setCurrentTime(20);
});
```

Timing
------

The timing between when the iframe is added and when the ready event is fired is important. Sadly we cannot fire the ready event till the iframe is loaded, but there is no concrete way of telling when postmessage is available to us.

The best way is to do one of the following:

### Create the iframe via JavaScript

```js
const iframe = document.createElement('iframe');
iframe.src = 'https://example.com/iframe';
document.body.appendChild(iframe);

const player = new playerjs.Player(iframe);
```

In this case, Player.js will listen to the onload event of the iframe and only try to communicate when ready.

### Wait for the document to be ready

```html
<iframe src="//example.com/iframe"></iframe>

<script>
  $(document).on('ready', () => {
    $('iframes').each(async () => {
      const player = new playerjs.Player(this);
      player.on('ready', async () => {
        await player.play();
      });
    });
  });
</script>
```

At this point we can reasonably assume that the iframe's been loaded and the ready. Player.js will take care of listening for ready events that were fired before the player is set up.

Methods
-------

All methods return promises for modern async/await patterns:

### `play(): Promise<void>`
Play the media:

```js
await player.play();
```

### `pause(): Promise<void>`
Pause the media:

```js
await player.pause();
```

### `getPaused(): Promise<boolean>`
Determine if the media is paused:

```js
const isPaused = await player.getPaused();
console.log('paused:', isPaused);
```

### `mute(): Promise<void>`
Mute the media:

```js
await player.mute();
```

### `unmute(): Promise<void>`
Unmute the media:

```js
await player.unmute();
```

### `getMuted(): Promise<boolean>`
Determine if the media is muted:

```js
const isMuted = await player.getMuted();
console.log('muted:', isMuted);
```

### `setVolume(volume: number): Promise<void>`
Set the volume. Value needs to be between 0-100:

```js
await player.setVolume(50);
```

### `getVolume(): Promise<number>`
Get the volume. Value will be between 0-100:

```js
const volume = await player.getVolume();
console.log('volume:', volume);
```

### `getDuration(): Promise<number>`
Get the duration of the media in seconds:

```js
const duration = await player.getDuration();
console.log('duration:', duration);
```

### `setCurrentTime(time: number): Promise<void>`
Perform a seek to a particular time in seconds:

```js
await player.setCurrentTime(50);
```

### `getCurrentTime(): Promise<number>`
Get the current time in seconds of the video:

```js
const currentTime = await player.getCurrentTime();
console.log('currentTime:', currentTime);
```

### `setPlaybackRate(rate: number): Promise<void>`
Set the playback rate which are available in the player. Doesn't return an error if the passed playback rate is not available:

```js
await player.setPlaybackRate(0.5);
```

### `getPlaybackRate(): Promise<number>`
Get the current playback rate of the player:

```js
const rate = await player.getPlaybackRate();
console.log('playbackRate:', rate);
```

### `setLoop(loop: boolean): Promise<void>`
Set whether the media should loop:

```js
await player.setLoop(true);
```

### `getLoop(): Promise<boolean>`
Get whether the media is set to loop:

```js
const isLooping = await player.getLoop();
console.log('looping:', isLooping);
```

### `off(event: string, callback?: Function): void`
Remove an event listener. If the listener is specified it should remove only that listener, otherwise remove all listeners:

```js
player.off('play');
player.off('play', playCallback);
```

### `on(event: string, callback: Function): void`
Add an event listener:

```js
player.on('play', () => console.log('play'));
```

### `supports(type: 'method' | 'event', name: string | string[]): boolean`
Determines if the player supports a given event or method:

```js
player.supports('method', 'getDuration');
player.supports('event', 'ended');
player.supports('method', ['play', 'pause']);
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

## Related Documentation

- [Receiver Implementation Guide](./RECEIVER.md) - For implementing the Player.js spec in your video player
- [Legacy Callback API](./CALLBACK_API.md) - Documentation for backward-compatible callback-based methods
