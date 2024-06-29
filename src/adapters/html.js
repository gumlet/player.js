import core from "../core";
import Receiver from "../receiver";

class HTML5Adapter {
  constructor(video) {
    this.init(video);
  }

  init(video){

    core.assert(video, 'HTML5Adapter requires a video element');
  
    // Set up the actual receiver
    var receiver = this.receiver = new Receiver();
  
    /* EVENTS */
    video.addEventListener('playing', function(){
      receiver.emit('play');
    });
  
    video.addEventListener('pause', function(){
      receiver.emit('pause');
    });
  
    video.addEventListener('ended', function(){
      receiver.emit('ended');
    });
  
    video.addEventListener('timeupdate', function(){
      receiver.emit('timeupdate', {
        seconds: video.currentTime,
        duration: video.duration
      });
    });
  
    video.addEventListener('progress', function(){
      receiver.emit('buffered', {
        percent: video.buffered.length
      });
    });
  
    /* Methods */
    receiver.on('play', function(){
      video.play();
    });
  
    receiver.on('pause', function(){
      video.pause();
    });
  
    receiver.on('getPaused', function(callback){
      callback(video.paused);
    });
  
    receiver.on('getCurrentTime', function(callback){
      callback(video.currentTime);
    });
  
    receiver.on('setCurrentTime', function(value){
      video.currentTime = value;
    });
  
    receiver.on('getDuration', function(callback){
      callback(video.duration);
    });
  
    receiver.on('getVolume', function(callback){
      callback(video.volume * 100);
    });
  
    receiver.on('setVolume', function(value){
      video.volume = value/100;
    });
  
    receiver.on('mute', function(){
      video.muted = true;
    });
  
    receiver.on('unmute', function(){
      video.muted = false;
    });
  
    receiver.on('getMuted', function(callback){
      callback(video.muted);
    });
  
    receiver.on('getLoop', function(callback){
      callback(video.loop);
    });
  
    receiver.on('setLoop', function(value){
      video.loop = value;
    });
  
    receiver.on('setPlaybackRate', function(value){
      video.playbackRate = value;
    });
  
    receiver.on('getPlaybackRate', function(callback){
      callback(video.playbackRate);
    });
  }

  ready(){
    this.receiver.ready();
  }
}

export default HTML5Adapter;
