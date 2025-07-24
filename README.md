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

Player.js provides comprehensive event handling to monitor playback state and user interactions. All events can be listened to using the `on()` method.

### Core Events

#### `ready`
Fired when the media is ready to receive commands. Always wait for this event before calling player methods.

```js
player.on('ready', async () => {
  console.log('Player is ready!');
  // Safe to call player methods now
  await player.play();
});
```

**Note:** As outlined in the PlayerJs Spec, you may run into inconsistencies if you have multiple players on the page with the same `src`. To avoid this, append a UUID or timestamp to the iframe's src.

#### `play`
Fired when playback starts.

```js
player.on('play', () => {
  console.log('Video started playing');
});
```

#### `pause`
Fired when playback is paused.

```js
player.on('pause', () => {
  console.log('Video paused');
});
```

#### `ended`
Fired when playback reaches the end of the media.

```js
player.on('ended', async () => {
  console.log('Video finished');
  // Reset to beginning if needed
  await player.setCurrentTime(0);
});
```

### Progress Events

#### `timeupdate`
Fired regularly during playback with current time information.

```js
player.on('timeupdate', (data) => {
  const { seconds, duration } = data;
  const progress = (seconds / duration) * 100;
  
  console.log(`Progress: ${progress.toFixed(1)}%`);
  console.log(`Current time: ${formatTime(seconds)} / ${formatTime(duration)}`);
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
```

#### `progress`
Fired when the media is buffering/loading additional content.

```js
player.on('progress', (data) => {
  const { percent } = data;
  console.log(`Buffered: ${(percent * 100).toFixed(1)}%`);
});
```

#### `seeked`
Fired when the user seeks to a different time position.

```js
player.on('seeked', (data) => {
  const { seconds, duration } = data;
  console.log(`Seeked to ${seconds}s of ${duration}s`);
});
```

### Audio/Video Control Events

#### `volumeChange`
Fired when the volume level changes, including mute/unmute actions.

```js
player.on('volumeChange', async () => {
  const volume = await player.getVolume();
  const isMuted = await player.getMuted();
  
  console.log(`Volume: ${volume}%, Muted: ${isMuted}`);
});
```

#### `playbackRateChange`
Fired when playback speed is changed.

```js
player.on('playbackRateChange', async () => {
  const rate = await player.getPlaybackRate();
  console.log(`Playback rate: ${rate}x`);
});
```

### Display Events

#### `fullscreenChange`
Fired when fullscreen mode is toggled.

```js
player.on('fullscreenChange', (data) => {
  const { isFullScreen } = data;
  console.log(`Fullscreen: ${isFullScreen}`);
});
```

#### `pipChange`
Fired when Picture-in-Picture mode is toggled.

```js
player.on('pipChange', (data) => {
  const { isPIP } = data;
  console.log(`Picture-in-Picture: ${isPIP}`);
});
```

### Quality Events

#### `qualityChange`
Fired when video quality/resolution is changed.

```js
player.on('qualityChange', (data) => {
  const { quality } = data;
  console.log(`Quality changed to: ${quality}`);
});
```

#### `audioChange`
Fired when the audio track is changed.

```js
player.on('audioChange', (data) => {
  console.log('Audio track changed:', data);
});
```

### Error Handling

#### `error`
Fired when an error occurs during playback.

```js
player.on('error', (error) => {
  console.error('Playback error:', error);
  // Handle error appropriately for your application
});
```

### Complete Example

Here's a comprehensive example showing how to listen to multiple events:

```js
const player = new playerjs.Player('video-iframe');

player.on('ready', async () => {
  console.log('Player is ready!');
  
  // Get initial player state
  const duration = await player.getDuration();
  const volume = await player.getVolume();
  const isPaused = await player.getPaused();
  
  console.log(`Duration: ${duration}s, Volume: ${volume}%, Paused: ${isPaused}`);
});

// Listen to playback events
player.on('play', () => console.log('Started playing'));
player.on('pause', () => console.log('Paused'));
player.on('ended', () => console.log('Playback finished'));

// Listen to progress events
player.on('timeupdate', (data) => {
  const { seconds, duration } = data;
  console.log(`${seconds.toFixed(1)}s / ${duration.toFixed(1)}s`);
});

// Listen to user interaction events
player.on('volumeChange', async () => {
  const volume = await player.getVolume();
  const muted = await player.getMuted();
  console.log(`Volume: ${volume}%, Muted: ${muted}`);
});

player.on('seeked', (data) => {
  console.log(`Seeked to: ${data.seconds}s`);
});

// Listen to display events
player.on('fullscreenChange', (data) => {
  console.log(`Fullscreen: ${data.isFullScreen}`);
});

player.on('pipChange', (data) => {
  console.log(`Picture-in-Picture: ${data.isPIP}`);
});

// Handle errors
player.on('error', (error) => {
  console.error('Player error:', error);
});
```

## Related Documentation

- [Receiver Implementation Guide](./RECEIVER.md) - For implementing the Player.js spec in your video player
- [Legacy Callback API](./CALLBACK_API.md) - Documentation for backward-compatible callback-based methods
