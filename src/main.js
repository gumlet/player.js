import Player from "./player"
import Receiver from "./receiver"
import MockAdapter from "./adapters/mock"
import VideoJSAdapter from "./adapters/video"
import HTML5Adapter from "./adapters/html"

const playerjs = {
    Player,
    Receiver,
    MockAdapter,
    VideoJSAdapter,
    HTML5Adapter
}

if (typeof define === 'function' && define.amd) {
  define(function () {
    return playerjs
  })
} else {
  window.playerjs = playerjs;
}