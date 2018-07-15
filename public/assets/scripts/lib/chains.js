const CHAIN_MASS = 10
const CHAIN_RADIUS = 20

function chain (x, y, count = 20, ks = 1, kd = 0.02, l0 = CHAIN_RADIUS ) {
  const nodes = []
  const positions = []
  const velocities = []

  const dir = Math.random() > 0.5 ? 1 : -1

  for (let i = 0; i < count; i++) {
    const node = document.createElement('div')
    node.style.width = CHAIN_RADIUS + 'px'
    node.style.height = CHAIN_RADIUS + 'px'
    node.style.position = 'fixed'
    node.style.borderRadius = '50%'
    node.style.top = '0'
    node.style.left = '0'
    node.style.background = `
      linear-gradient(
        45deg, rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}) 0%,
        rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}) 50%,
        rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}) 51%,
        rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255}) 100%)`

    nodes.push(node)
    positions.push({ x: x + dir * CHAIN_RADIUS * i, y: y + CHAIN_RADIUS * 0.5 * i })
    if (i === 0) {
      velocities.push({
        x: (Math.random() * 2 - 1) * 40,
        y: -250
      })
    }

    velocities.push({ x: 0, y: -100 })

    document.body.appendChild(node)
  }

  function distance (i, j) {
    const dx = positions[i].x - positions[j].x
    const dy = positions[i].y - positions[j].y

    return Math.sqrt(dx * dx + dy * dy)
  }

  function normalize ({ x, y }) {
    const length = Math.sqrt(x * x + y * y)

    if (length === 0) {
      return { x: 0, y: 0 }
    }

    return {
      x: x / length,
      y: y / length
    }
  }

  function calculateSpring (pi ,vi, i, j) {
    const pj = positions[j]
    const vj = velocities[j]

    const n = normalize({ x: pj.x - pi.x, y: pj.y - pi.y })
    const l = distance(i, j)

    const dl = l - l0

    const fs = { x: n.x * ks * dl, y: n.y * ks * dl }

    vi.x += fs.x
    vi.y += fs.y

    vj.x -= fs.x
    vj.y -= fs.y
  }

  function calculateDamping (vi) {
    vi.x -= vi.x * kd
    vi.y -= vi.y * kd
  }

  return {
    update () {
      for (let i = 0; i < nodes.length; i++) {
        const vi = velocities[i]
        const pi = positions[i]
        
        const j = i + 1

        if (j < nodes.length) {
          calculateSpring(pi, vi, i, j)
          calculateDamping(vi, velocities[j])
        }

        vi.y += CHAIN_MASS * GRAVITY

        pi.x += vi.x / CHAIN_MASS
        pi.y += vi.y / CHAIN_MASS

        nodes[i].style.transform = `translate3d(${pi.x}px,${pi.y}px,0)`
      }
    },
    destroy () {
      nodes.forEach(node => { document.body.removeChild(node) })
    }
  }
}

function createChainController () {
  const chains = []

  function resize (count) {
    for (let i = 0; i < count; i++) {
      const chain = chains.shift()
      chain.destroy()
    }
  }
  return {
    spawn (x, y) {
      if (x === 0 || y === 0) {
        return
      }

      if (chains.length > 10) {
        resize(10)
      }
      chains.push(chain(x, y))
    },
    animate () {
      const frame = () => {
        for (let i = 0; i < chains.length; i++) {
          chains[i].update()
        }
        
        window.requestAnimationFrame(frame)
      }

      window.requestAnimationFrame(frame)
    }
  }
}

const chains = createChainController()