import Player from "./player"
import Receiver from "./receiver"

const playerjs = {
    Player,
    Receiver
}

if (typeof define === 'function' && define.amd) {
  define(function () {
    return playerjs
  })
} else if (typeof module === 'object' && module.exports) {
  module.exports = playerjs
} else {
  window.playerjs = playerjs;
}