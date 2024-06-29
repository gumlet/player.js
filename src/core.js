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
  },

  DEBUG : false,
  VERSION :'0.0.11',
  CONTEXT : 'player.js',

  isString : function (obj) {
    return Object.prototype.toString.call(obj) === '[object String]';
  },

  has: function(obj, key){
    return Object.prototype.hasOwnProperty.call(obj, key);
  }
};

core.METHODS.all = function(){
  var all = [];
  for (var key in playerjs.METHODS) {
    if (core.has(playerjs.METHODS, key) && core.isString(playerjs.METHODS[key])) {
      all.push(playerjs.METHODS[key]);
    }
  }
  return all;
};

core.EVENTS.all = function(){
  var all = [];
  for (var key in playerjs.EVENTS) {
    if (core.has(playerjs.EVENTS, key) && core.isString(playerjs.EVENTS[key])) {
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

core.isNone = function(obj){
  return (obj === null || obj === undefined);
};

core.assert = function(test, msg) {
  if (!test) {
    throw msg || "Player.js Assert Failed";
  }
}

core.generateUUID() = function() {
  if(crypto && crypto.randomUUID) {
    return crypto.randomUUID();
  } else {
    const url = URL.createObjectURL(new Blob())
    return url.substring(url.lastIndexOf('/') + 1)
  }
}

core.isArray = function(obj){
  return Object.prototype.toString.call(obj) === "[object Array]";
};

export default core;