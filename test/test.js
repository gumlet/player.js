/* eslint-env qunit */
let frameIndex = 0
const FRAMES = [
  // 'http://localhost:8080/test/mock.html',
  'http://localhost:8080/test/html.html',
  'http://localhost:8080/test/video.html'
]

const removeEvent = (elem, type, eventHandle) => {
  if (!elem) { return }
  if (elem.removeEventListener) {
    elem.removeEventListener(type, eventHandle, false)
  } else if (elem.detachEvent) {
    elem.detachEvent('on' + type, eventHandle)
  } else {
    elem['on' + type] = null
  }
}

QUnit.module('HTML5', testCases)
QUnit.module('VideoJS', testCases)

function testCases (hooks) {
  let player
  hooks.before(async () => {
    const iframe = document.createElement('iframe')

    iframe.src = FRAMES[frameIndex]
    iframe.id = 'iframe_' + frameIndex
    iframe.width = 400
    iframe.height = 400
    frameIndex++

    document.body.appendChild(iframe)
    player = new window.playerjs.Player(iframe)
    return new Promise(resolve => {
      player.on('ready', resolve, player)
    })
  })

  QUnit.test('Play', (assert) => {
    const done1 = assert.async(3)
    let count = 0
    const done = () => {
      count++
      if (count === 2) {
        // Revert us back to the opening bell.
        player.setCurrentTime(0)
        player.pause()
        done1()
      }
    }

    player.on('play', function () {
      assert.true(true, 'video has played')
      this.off('play')
      done()
      done1()
    })

    player.on('timeupdate', function (data) {
      assert.true(typeof data.seconds === 'number')
      assert.true(typeof data.duration === 'number')

      this.off('timeupdate')
      done()
      done1()
    })

    player.play()
  })

  QUnit.test('Pause', (assert) => {
    const done = assert.async()
    player.on('pause', function () {
      assert.true(true, 'video has paused')
      this.off('pause')
      done()
    })

    // We won't fire pause unless we are actually playing first.
    player.on('play', () => {
      player.off('play')
      player.pause()
    })

    player.play()
  })

  // Make sure we are receiving context.
  QUnit.test('context', (assert) => {
    const done = assert.async()
    const onMessage = (e) => {
      const data = JSON.parse(e.data)
      assert.equal(data.context, window.playerjs.CONTEXT)
      assert.equal(data.version, window.playerjs.VERSION)
      removeEvent(window, 'message', onMessage)
      done()
    }

    window.playerjs.addEvent(window, 'message', onMessage)

    // This will force the receiver to echo.
    player.on('ready', () => {})
  })

  // Test to make sure we can attach multiple listeners to the same event.
  QUnit.test('multi-listeners', (assert) => {
    const doneTest = assert.async(3)
    // Callbacks.
    const zero = () => {
      assert.true(true, 'play 0 fired')
      doneTest(0)
    }

    const one = () => {
      assert.true(true, 'play 1 fired')
      doneTest(1)
    }

    const two = () => {
      assert.true(true, 'play 2 fired')
      doneTest(2)
      player.off('play')
      player.pause()
    }

    player.on('play', zero)
    player.on('play', one)
    player.on('play', two)

    player.play()
  })

  QUnit.test('getPaused', (assert) => {
    const done = assert.async()

    player.pause()
    player.getPaused((value) => {
      assert.true(value, 'video is paused')
      done()
    })
  })

  QUnit.test('Duration', (assert) => {
    const done = assert.async()
    player.getDuration((value) => {
      assert.equal(value, 6.4)
      done()
    })
  })

  QUnit.test('getCurrentTime', (assert) => {
    const done = assert.async()
    player.getCurrentTime((value) => {
      assert.true(typeof value === 'number', 'video has time:' + value)
      done()
    })
  })

  QUnit.test('setCurrentTime', (assert) => {
    const done = assert.async()
    player.on('timeupdate', (v) => {
      if (v.seconds >= 5) {
        player.off('timeupdate')
        player.getCurrentTime((value) => {
          assert.equal(Math.floor(value), 5)
          player.pause()
          done()
        })
      }
    })

    player.play()
    player.setCurrentTime(5)
  })

  QUnit.test('setLoop', (assert) => {
    const done = assert.async()
    player.setLoop(true)
    setTimeout(() => {
      player.getLoop((v) => {
        assert.true(v, 'Set Loop was not set')
        done()
      })
    }, 100)
  })

  QUnit.test('getVolume', (assert) => {
    const done = assert.async()
    player.getVolume((value) => {
      assert.true(typeof value === 'number', 'video has Volume')
      done()
    })
  })

  // Volumne tests
  QUnit.test('get/set volume', (assert) => {
    const done = assert.async()
    player.setVolume(87)
    player.getVolume((value) => {
      assert.equal(value, 87, 'video volume:' + value)
      done()
    })
  })

  QUnit.test('get muted', (assert) => {
    const done = assert.async()
    // Mute
    player.mute()

    setTimeout(() => {
      player.getMuted((value) => {
        assert.true(value, 'video muted:' + value)
        done()
      })
    }, 500)
  })
}

// var count = 0,
//   players = [];

// var loadPlayers = function() {
//   count++;
//   if (count === FRAMES.length){
//     var iframes = document.getElementsByTagName('iframe');

//     for (var d=0; d<iframes.length; d++){
//       var player = new playerjs.Player(iframes[d]);

//       player.on('ready', QUnit.start, player);
//     }
//   }
// };

// for (var f in FRAMES){
//   var iframe = document.createElement('iframe');

//   iframe.src = FRAMES[f];
//   iframe.id = 'iframe_'+f;
//   iframe.width = 200;
//   iframe.height = 200;

//   document.body.appendChild(iframe);

//   // we want to load the players a couple of different ways.
//   if ( f % 2 === 1){
//     loadPlayers();
//   } else {
//     iframe.onload = loadPlayers;
//   }
// }
