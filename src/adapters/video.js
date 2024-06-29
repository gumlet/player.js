import core from "../core";
import Receiver from "../receiver"

class VideoJSAdapter {
  constructor(player) {
    this.init(player);
  }

  init(player){

    core.assert(player, 'VideoJSReceiver requires a player object');
  
    // Set up the actual receiver
    var receiver = this.receiver = new Receiver();
  
    /* EVENTS */
    player.on("pause", function(){
      receiver.emit('pause');
    });
  
    player.on("play", function(){
      receiver.emit('play');
    });
  
    player.on("timeupdate", function(e){
      var seconds = player.currentTime(),
        duration = player.duration();
  
      if (!seconds || !duration){
        return false;
      }
  
      var value = {
        seconds: seconds,
        duration: duration
      };
      receiver.emit('timeupdate', value);
    });
  
    player.on("ended", function(){
      receiver.emit('ended');
    });
  
    player.on("error", function(){
      receiver.emit('error');
    });
  
  
    /* METHODS */
    receiver.on('play', function(){
      player.play();
    });
  
    receiver.on('pause', function(){
      player.pause();
    });
  
    receiver.on('getPaused', function(callback){
      callback(player.paused());
    });
  
    receiver.on('getCurrentTime', function(callback){
      callback(player.currentTime());
    });
  
    receiver.on('setCurrentTime', function(value){
      player.currentTime(value);
    });
  
    receiver.on('getDuration', function(callback){
      callback(player.duration());
    });
  
    receiver.on('getVolume', function(callback){
      callback(player.volume() * 100);
    });
  
    receiver.on('setVolume', function(value){
      player.volume(value/100);
    });
  
    receiver.on('mute', function(){
      player.volume(0);
    });
  
    receiver.on('unmute', function(){
      player.volume(1);
    });
  
    receiver.on('getMuted', function(callback){
      callback(player.volume() === 0);
    });
  
    receiver.on('getLoop', function(callback){
      callback(player.loop());
    });
  
    receiver.on('setLoop', function(value){
      player.loop(value);
    });
  
    receiver.on('setPlaybackRate', function(value){
      player.playbackRate(value);
    });
  
    receiver.on('getPlaybackRate', function(callback){
      callback(player.playbackRate());
    });
  }

  ready(){
    this.receiver.ready();
  }
}

export default VideoJSAdapter;