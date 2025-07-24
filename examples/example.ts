import playerjs from '../src/main'

// Example usage with TypeScript types
const iframe = document.createElement('iframe')
iframe.src = 'https://example.com/player'
document.body.appendChild(iframe)

const player = new playerjs.Player(iframe, true) // debug mode

player.on('ready', async () => {
  console.log('Player is ready!')
  
  try {
    // Promise-based API (new style)
    const duration = await player.getDuration!()
    console.log(`Duration: ${duration} seconds`)
    
    const currentTime = await player.getCurrentTime!()
    console.log(`Current time: ${currentTime} seconds`)
    
    // Check if methods are supported with proper typing
    if (player.supports('method', 'mute')) {
      await player.mute!()
    }
    
    if (player.supports('method', ['play', 'pause'])) {
      await player.play!()
    }
    
    // Set volume using promise
    await player.setVolume!(50)
    const volume = await player.getVolume!()
    console.log(`Volume set to: ${volume}`)
    
  } catch (error) {
    console.error('Error with player operations:', error)
  }
  
  // Callback-based API (backward compatibility)
  player.getDuration!((duration: number) => {
    console.log(`Duration (callback): ${duration} seconds`)
  })
  
  player.getCurrentTime!((time: number) => {
    console.log(`Current time (callback): ${time} seconds`)
  })
})

player.on('play', () => {
  console.log('Playing!')
})

player.on('pause', () => {
  console.log('Paused!')
})

player.on('timeupdate', (data: any) => {
  console.log(`Time update: ${data.seconds}/${data.duration}`)
})

// Example with Receiver (for iframe implementers)
const receiver = new playerjs.Receiver()

receiver.on('play', function() {
  // Play your video
  console.log('Received play command')
  this.emit('play')
})

receiver.on('getDuration', function(callback: (duration: number) => void) {
  // Return your video duration
  callback(120) // 2 minutes
})

receiver.ready()

// Advanced example showing async/await patterns
async function advancedPlayerControl() {
  try {
    // Wait for player to be ready
    await new Promise<void>((resolve) => {
      player.on('ready', () => resolve())
    })
    
    // Get initial state
    const [duration, isPaused, volume] = await Promise.all([
      player.getDuration!(),
      player.getPaused!(),
      player.getVolume!()
    ])
    
    console.log(`Player state - Duration: ${duration}s, Paused: ${isPaused}, Volume: ${volume}`)
    
    // Perform operations
    if (isPaused) {
      await player.play!()
    }
    
    await player.setCurrentTime!(10) // Seek to 10 seconds
    await player.setVolume!(75) // Set volume to 75%
    
    console.log('Player setup complete!')
    
  } catch (error) {
    console.error('Failed to setup player:', error)
  }
}

// Call the advanced example
advancedPlayerControl()
