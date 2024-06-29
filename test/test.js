let frameIndex = 0;
var FRAMES = [
  // 'http://localhost:8080/test/mock.html',
  'http://localhost:8080/test/html.html',
  'http://localhost:8080/test/video.html'
];

var isNumber= function(obj){
  return Object.prototype.toString.call(obj) === "[object Number]";
};

var removeEvent = function(elem, type, eventHandle) {
  if (!elem) { return; }
  if ( elem.removeEventListener ) {
    elem.removeEventListener( type, eventHandle, false );
  } else if ( elem.detachEvent ) {
    elem.detachEvent( "on" + type, eventHandle );
  } else {
    elem["on"+type]=null;
  }
};

QUnit.module('HTML5', testCases);
QUnit.module('VideoJS', testCases); 


function testCases(hooks){
  
  let player;
  hooks.before(async () => {
    var iframe = document.createElement('iframe');

    iframe.src = FRAMES[frameIndex];
    iframe.id = 'iframe_'+frameIndex;
    iframe.width = 200;
    iframe.height = 200;
    frameIndex++;
  
    document.body.appendChild(iframe);
    player = new playerjs.Player(iframe);
    return new Promise(resolve => {
      player.on('ready', resolve, player);
    })
  });

  QUnit.test("Play", function(assert) {
    const done1 = assert.async(3);
    var count = 0;
    var done = function(){
      count ++;
      if (count === 2){
        // Revert us back to the opening bell.
        player.setCurrentTime(0);
        player.pause();
        done1();
      }
    };

    player.on('play', function(){
      assert.true(true, "video has played");
      this.off('play');
      done();
      done1();
    });

    player.on('timeupdate', function(data){
      assert.true(typeof data.seconds == "number");
      assert.true(typeof data.duration == "number");

      this.off('timeupdate');
      done();
      done1();
    });

    player.play();
  });

  QUnit.test("Pause", function(assert) {
    const done = assert.async();
    player.on('pause', function(){
      assert.true(true, "video has paused");
      this.off('pause');
      done();
    });

    // We won't fire pause unless we are actually playing first.
    player.on('play', function(){
      player.off('play');
      player.pause();
    });

    player.play();
  });

  // Make sure we are receiving context.
  QUnit.test("context", function(assert){
    const done = assert.async();
    var onMessage = function(e){
      var data = JSON.parse(e.data);
      assert.equal(data.context,playerjs.CONTEXT);
      assert.equal(data.version,playerjs.VERSION);
      removeEvent(window, 'message', onMessage);
      done();
    };

    playerjs.addEvent(window, 'message', onMessage);

    // This will force the receiver to echo.
    player.on('ready', function(){});
  });

  // Test to make sure we can attach multiple listeners to the same event.
  QUnit.test("multi-listeners", function(assert) {
    const done_test = assert.async(3);
    // Callbacks.
    var zero = function(){
      assert.true(true, "play 0 fired")
      done_test(0);
    };

    var one = function(){
      assert.true(true, "play 1 fired")
      done_test(1);
    };

    var two = function(){
      assert.true(true, "play 2 fired")
      done_test(2);
      player.off('play');
      player.pause();
    };

    player.on('play', zero);
    player.on('play', one);
    player.on('play', two);


    player.play();
  });

  QUnit.test("getPaused", function(assert) {
    const done = assert.async();

    player.pause();
    player.getPaused(function(value){
      assert.true(value, "video is paused" );
      done()
    });

  });

  QUnit.test("Duration", function(assert) {
    const done = assert.async();
    player.getDuration(function(value){
      assert.equal(value, 6.4 );
      done();
    });
  });

  QUnit.test("getCurrentTime",  function(assert) {
    const done = assert.async();
    player.getCurrentTime(function(value){
      assert.true(typeof value == 'number', "video has time:" + value );
      done();
    });
  });


  QUnit.test("setCurrentTime", function(assert) {
    const done = assert.async();
    player.on('timeupdate', function(v){
      if (v.seconds >= 5){
        player.off('timeupdate');
        player.getCurrentTime(function(value){
          assert.equal(Math.floor(value), 5);
          player.pause();
          done();
        });
      }
    });

    player.play();
    player.setCurrentTime(5);
  });

  QUnit.test("setLoop", function(assert) {
    const done = assert.async();
    player.setLoop(true);
    setTimeout(function(){
      player.getLoop(function(v){
        assert.true(v, 'Set Loop was not set');
        done();
      });
    }, 100);
  });

  QUnit.test("getVolume", function(assert) {
    const done = assert.async();
    player.getVolume(function(value){
      assert.true(typeof value == 'number', "video has Volume" );
      done();
    });
  });

  // Volumne tests
  QUnit.test("get/set volume", function(assert) {
    const done = assert.async();
    player.setVolume(87);
    player.getVolume(function(value){
      assert.equal(value, 87, "video volume:" + value );
      done();
    });
  });


  QUnit.test("get muted", function(assert) {
    const done = assert.async();
    //Mute
    player.mute();

    setTimeout(function(){
      player.getMuted(function(value){
        assert.true(value, "video muted:" + value );
        done();
      });
    }, 500);
  });

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
