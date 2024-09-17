import core from "./core";
import Player from "./player";
import Receiver from "./receiver";
import MockAdapter from "./adapters/mock";
import VideoJSAdapter from "./adapters/video";
import HTML5Adapter from "./adapters/html";

const playerjs = {
  Player,
  Receiver,
  MockAdapter,
  VideoJSAdapter,
  HTML5Adapter,
  CONTEXT: core.CONTEXT,
  VERSION: core.VERSION,
  METHODS: core.METHODS,
  addEvent: core.addEvent,
};

// Attach to the window object explicitly
if (typeof window !== "undefined") {
  window.playerjs = playerjs;
}

export default playerjs;