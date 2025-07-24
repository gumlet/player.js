# Legacy Callback API

This document describes the legacy callback-based API that is maintained for backward compatibility. For new projects, we recommend using the [promise-based API](./README.md) instead.

## Overview

All methods support both promise-based and callback-based usage patterns. When called without a callback, methods return promises. When called with a callback, they execute the callback with the result.

## Method Examples

### Play/Pause Methods

```js
// Callback-based
player.play(function() {
  console.log('Play completed');
});

player.pause(function() {
  console.log('Pause completed');
});
```

### Getter Methods with Callbacks

```js
// Get paused state
player.getPaused(function(isPaused) {
  console.log('Paused:', isPaused);
});

// Get muted state
player.getMuted(function(isMuted) {
  console.log('Muted:', isMuted);
});

// Get volume (0-100)
player.getVolume(function(volume) {
  console.log('Volume:', volume);
});

// Get duration in seconds
player.getDuration(function(duration) {
  console.log('Duration:', duration);
});

// Get current time in seconds
player.getCurrentTime(function(currentTime) {
  console.log('Current time:', currentTime);
});

// Get playback rate
player.getPlaybackRate(function(rate) {
  console.log('Playback rate:', rate);
});

// Get loop state
player.getLoop(function(isLooping) {
  console.log('Looping:', isLooping);
});
```

### Setter Methods with Callbacks

```js
// Set volume with callback
player.setVolume(50, function() {
  console.log('Volume set to 50');
});

// Set current time with callback
player.setCurrentTime(30, function() {
  console.log('Seeked to 30 seconds');
});

// Set playback rate with callback
player.setPlaybackRate(1.5, function() {
  console.log('Playback rate set to 1.5x');
});

// Set loop with callback
player.setLoop(true, function() {
  console.log('Loop enabled');
});

// Mute with callback
player.mute(function() {
  console.log('Player muted');
});

// Unmute with callback
player.unmute(function() {
  console.log('Player unmuted');
});
```

## Error Handling

With callbacks, errors are typically passed as the first argument following Node.js conventions:

```js
player.getDuration(function(error, duration) {
  if (error) {
    console.error('Failed to get duration:', error);
    return;
  }
  console.log('Duration:', duration);
});
```

## Migration to Promises

To migrate from callback-based to promise-based API:

```js
// Old callback style
player.getDuration(function(duration) {
  player.getCurrentTime(function(currentTime) {
    console.log(`${currentTime} / ${duration}`);
  });
});

// New promise style
const duration = await player.getDuration();
const currentTime = await player.getCurrentTime();
console.log(`${currentTime} / ${duration}`);
```

## Compatibility Notes

- All callback-based methods remain fully supported
- Methods can be called with or without callbacks
- When no callback is provided, a promise is returned
- Event listeners (`on`, `off`) are not affected by this compatibility layer
- The `supports` method signature remains unchanged
