const core = {
  EVENTS: {
    READY: 'ready',
    PLAY: 'play',
    PAUSE: 'pause',
    ENDED: 'ended',
    TIMEUPDATE: 'timeupdate',
    PROGRESS: 'progress',
    SEEKED: 'seeked',
    ERROR: 'error',
    FULLSCREEN_CHANGE: 'fullscreenChange',
    PIP_CHANGE: 'pipChange',
    PLAYBACK_RATE_CHANGE: 'playbackRateChange',
    AUDIO_CHANGE: 'audioChange',
    QUALITY_CHANGE: 'qualityChange',
    VOLUME_CHANGE: 'volumeChange'
  },

  POST_MESSAGE : !!window.postMessage,

  METHODS: {
    PLAY: 'play',
    PAUSE: 'pause',
    GETPAUSED: 'getPaused',
    MUTE: 'mute',
    UNMUTE: 'unmute',
    GETMUTED: 'getMuted',
    SETVOLUME: 'setVolume',
    GETVOLUME: 'getVolume',
    GETDURATION: 'getDuration',
    SETCURRENTTIME: 'setCurrentTime',
    GETCURRENTTIME:'getCurrentTime',
    SETLOOP: 'setLoop',
    GETLOOP: 'getLoop',
    SETPLAYBACKRATE: 'setPlaybackRate',
    GETPLAYBACKRATE: 'getPlaybackRate',
    REMOVEEVENTLISTENER: 'removeEventListener',
    ADDEVENTLISTENER: 'addEventListener'
  }
};

core.METHODS.all = function(){
  var all = [];
  for (var key in playerjs.METHODS) {
    if (playerjs.has(playerjs.METHODS, key) && playerjs.isString(playerjs.METHODS[key])) {
      all.push(playerjs.METHODS[key]);
    }
  }
  return all;
};

core.EVENTS.all = function(){
  var all = [];
  for (var key in playerjs.EVENTS) {
    if (playerjs.has(playerjs.EVENTS, key) && playerjs.isString(playerjs.EVENTS[key])) {
      all.push(playerjs.EVENTS[key]);
    }
  }
  return all;
};

core.addEvent = function(elem, type, eventHandle) {
  if (!elem) { return; }
  if ( elem.addEventListener ) {
    elem.addEventListener( type, eventHandle, false );
  } else if ( elem.attachEvent ) {
    elem.attachEvent( "on" + type, eventHandle );
  } else {
    elem["on"+type]=eventHandle;
  }
};

core.log = function(){
  playerjs.log.history = playerjs.log.history || [];   // store logs to an array for reference
  playerjs.log.history.push(arguments);
  if(window.console && playerjs.DEBUG){
    window.console.log( Array.prototype.slice.call(arguments) );
  }
};

export default core;