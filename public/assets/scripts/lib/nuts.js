const GRAVITY = 0.5
const INITIAL_SPEED = 5

function createNuts () {
  const nodes = []
  const positions = []
  const velocities = []

  function update (node, velocity, position) {
    const newVelocity = {
      x: velocity.x, y: velocity.y + GRAVITY
    }
    const newPosition = {
      x: position.x + velocity.x, y: position.y + velocity.y
    }

    node.style.transform = `translate3d(${newPosition.x}px, ${newPosition.y}px, 0)`

    return { velocity: newVelocity, position: newPosition }
  }

  function resize (count) {
    for (let i = 0; i < count; i++) {
      const node = nodes.shift()
      positions.shift()
      velocities.shift()

      if (node) {
        document.body.removeChild(node)
      }
    }
  }

  return {
    spawn (x, y, count = 10) {
      if (x === 0 || y === 0) {
        return
      }

      for (let i = 0; i < count; i++) {
        const nut = document.createElement('div')
        nut.style.width = '5px'
        nut.style.height = '5px'
        nut.style.position = 'fixed'
        nut.style.top = '0'
        nut.style.left = '0'

        nut.style.background = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`

        const spanX = Math.random() * 20 - 10
        const spanY = Math.random() * 20 - 10

        nut.style.transform = `translate3d(${x + spanX}px, ${y + spanY}px, 0)`

        if (nodes.length > 20) {
          resize(10)
        }

        nodes.push(nut)
        velocities.push({
          x: (Math.random() * 2 - 1) * INITIAL_SPEED,
          y: (Math.random() * 2 - 1) * INITIAL_SPEED
        })
        positions.push({
          x: x + spanX,
          y: y + spanY
        })

        document.body.appendChild(nut)
      }
    },
    animate () {
      const frame = () => {
        for (let i = 0; i < nodes.length; i++) {
          const { velocity, position } = update(nodes[i], velocities[i], positions[i])
          velocities[i] = velocity
          positions[i] = position
        }
        window.requestAnimationFrame(frame)
      }
      window.requestAnimationFrame(frame)
    }
  }
}

const nuts = createNuts()