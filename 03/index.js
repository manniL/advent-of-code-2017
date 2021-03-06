const R = require('ramda')
const {readFileAndSplitByLines} = require('../utils/fs.js')
const path = require('path')

const partTwo = input => {
  const ids = R.pluck('id', input)
  const inches = R.reduce(getInchesWithDupesForFabric, {current: new Map(), dupes: new Map()}, input)

  const seenIds = new Set()
  const addToSeen = a => a.forEach(v => seenIds.add(v))
  inches.dupes.forEach(addToSeen)
  return R.pipe(
    R.difference(ids),
    R.head
  )(Array.from(seenIds))
}

const getInchesWithDupesForFabric = (({current, dupes}, {id, position, size}) => {
  // "Zero based"
  const rangeX = R.range(position.x + 1, position.x + size.x + 1)
  const rangeY = R.range(position.y + 1, position.y + size.y + 1)
  const pairs = R.map(R.join('_'), R.xprod(rangeY, rangeX))
  pairs.forEach(pair => {
    if (dupes.has(pair)) {
      dupes.set(pair, dupes.get(pair).concat(id))
      return
    }
    if (!current.has(pair)) {
      // Not in current at all
      current.set(pair, [id])
      return
    }
    // In current but not in dupes
    dupes.set(pair, [id, ...current.get(pair)])
  })
  return {current, dupes}
})

const getInchesForFabric = (({current, dupes}, {id, position, size}) => {
  // "Zero based"
  const rangeX = R.range(position.x + 1, position.x + size.x + 1)
  const rangeY = R.range(position.y + 1, position.y + size.y + 1)
  const pairs = R.map(R.join('_'), R.xprod(rangeY, rangeX))
  pairs.forEach(pair => {
    if (dupes.has(pair)) {
      dupes.set(pair, dupes.get(pair).concat(id))
      return
    }
    if (!current.has(pair)) {
      // Not in current at all
      current.set(pair, [id])
      return
    }
    // In current but not in dupes
    dupes.set(pair, [id])
  })
  return {current, dupes}
})

const input = readFileAndSplitByLines(path.join(__dirname, './input.txt'))
const formatInput = R.map(str => {
  [, id, positionY, positionX, sizeY, sizeX] = R.match(/^#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/)(str)
  return {
    id,
    position: {
      x: Number(positionX),
      y: Number(positionY)
    },
    size: {
      x: Number(sizeX),
      y: Number(sizeY)
    }
  }
})

const formattedInput = formatInput(input)

const partOne = R.pipe(
  R.reduce(getInchesForFabric, {current: new Map(), dupes: new Map()}),
  R.prop('dupes'),
  dupes => dupes.size
)

console.log('Part 1:', partOne(formattedInput))
console.log('Part 2:', partTwo(formattedInput))
