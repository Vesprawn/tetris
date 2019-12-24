const canvas = document.getElementById('tetris')
const ctx = canvas.getContext('2d')
const playBtn = document.getElementById('play-btn')
const audioBtn = document.getElementById('audio-btn')
let gamePlaying = false
const colors = [
  null,
  '#AA01FF',
  '#FFFF02',
  '#FFA500',
  '#0000FF',
  '#00FF01',
  '#FF0000',
  '#02FFFF'
]
let music = document.getElementById('music')
let audio = true

playBtn.addEventListener('click', () => {
  if (gamePlaying === false) {
    music.play()
    gamePlaying = true
    update()
    playBtn.innerHTML = 'PAUSE'
  } else {
    gamePlaying = false
    music.pause()
    playBtn.innerHTML = 'PLAY'
  }
})

audioBtn.addEventListener('click', () => {
  audio = (!audio)

  if (audio) {
    music.volume = 0.5
  } else {
    music.volume = 0
  }
})

ctx.scale(20, 20)

const matrix = [
  [0, 0, 0],
  [1, 1, 1],
  [0, 1, 0]
]

function collide (arena, player) {
  let m = player.matrix
  let o = player.pos

  for (let y = 0; y < m.length; y += 1) {
    for (let x = 0; x < m[y].length; x += 1) {
      if (m[y][x] !== 0 &&
        (arena[y + o.y] &&
        arena[y + o.y][x + o.x]) !== 0) {
        return true
      }
    }
  }

  return false
}

function draw () {
  ctx.fillStyle = '#000'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  drawMatrix(arena, { x: 0, y: 0 })
  drawMatrix(player.matrix, player.pos)
}

let dropCounter = 0
let dropInterval = 1000
let lastTime = 0

function update (time = 0) {
  if (gamePlaying === true) {
    let deltaTime = time - lastTime
    lastTime = time
    dropCounter += deltaTime

    if (dropCounter > dropInterval) {
      playerDrop()
    }
    draw()
    window.requestAnimationFrame(update)
  }
}

function merge (arena, player) {
  player.matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        arena[y + player.pos.y][x + player.pos.x] = value
      }
    })
  })
}

function playerDrop () {
  player.pos.y += 1

  if (collide(arena, player)) {
    player.pos.y -= 1
    merge(arena, player)
    playerReset()
    arenaSweep()
    updateScore()
  }

  dropCounter = 0
}

function createMatrix (w, h) {
  let matrix = []

  while (h--) {
    matrix.push(new Array(w).fill(0))
  }

  return matrix
}

function createPiece (type) {
  switch (type) {
    case 't':
      return [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ]
    case 'o':
      return [
        [2, 2],
        [2, 2]
      ]
    case 'l':
      return [
        [0, 3, 0],
        [0, 3, 0],
        [0, 3, 3]
      ]
    case 'j':
      return [
        [0, 4, 0],
        [0, 4, 0],
        [4, 4, 0]
      ]
    case 's':
      return [
        [0, 5, 5],
        [5, 5, 0],
        [0, 0, 0]
      ]
    case 'z':
      return [
        [6, 6, 0],
        [0, 6, 6],
        [0, 0, 0]
      ]
    case 'i':
      return [
        [0, 7, 0, 0],
        [0, 7, 0, 0],
        [0, 7, 0, 0],
        [0, 7, 0, 0]
      ]
    default:
      return [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ]
  }
}

function playerRotate (dir) {
  let pos = player.pos.x
  let offset = 1
  rotate(player.matrix, dir)

  while (collide(arena, player)) {
    player.pos.x += offset
    offset = -(offset + (offset > 0 ? 1 : -1))

    if (offset > player.matrix[0].length) {
      rotate(player.matrix, -dir)
      player.pos.x = pos
    }
  }
}

function rotate (matrix, dir) {
  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < y; x += 1) {
      [
        matrix[x][y],
        matrix[y][x]
      ] = [
        matrix[y][x],
        matrix[x][y]
      ]
    }
  }

  if (dir > 0) {
    matrix.forEach((row) => {
      row.reverse()
    })
  } else {
    matrix.reverse()
  }
}

function playerReset () {
  const pieces = 'toiljzs'
  player.matrix = createPiece(pieces[pieces.length * Math.random() | 0])
  player.pos.y = 0
  player.pos.x = (arena[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0)

  if (collide(arena, player)) {
    arena.forEach((row) => {
      row.fill(0)
    })
    player.score = 0
    updateScore()
  }
}

function updateScore () {
  document.getElementById('score-numbers').innerText = `${player.score}`
}

function playerMove (dir) {
  player.pos.x += dir

  if (collide(arena, player)) {
    player.pos.x -= dir
  }
}

function arenaSweep () {
  let rowCount = 1
  outer: for (let y = arena.length -1; y > 0; y -= 1) {
    for (let x = 0; x < arena[y].length; x += 1) {
      if (arena[y][x] === 0) {
        continue outer
      }
    }

    let row = arena.splice(y, 1)[0].fill(0)
    arena.unshift(row)
    y += 1
    player.score += rowCount * 10
    rowCount *= 2
  }
}

function drawMatrix (matrix, offset) {
  matrix.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value !== 0) {
        ctx.fillStyle = colors[value]
        ctx.fillRect(x + offset.x, y + offset.y, 1, 1)
      }
    })
  })
}

const arena = createMatrix(12, 20)
console.table(arena)

const player = {
  pos: { x: 5, y: 5 },
  matrix: createPiece('t'),
  score: 0
}

document.addEventListener('keydown', (event) => {
  console.log(event)

  switch (event.keyCode) {
    case 65:
      playerMove(-1)
      break
    case 68:
      playerMove(1)
      break
    case 83:
      playerDrop()
      break
    case 32:
      playerRotate(-1)
      break
    default:
      console.log('unrecognised code')
      break

  }
})


