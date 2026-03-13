/**
 * Mock service — retorna datos de prueba desde memoria.
 * Implementa la misma interfaz que apiclient.js
 */

const MOCK_BLUEPRINTS = [
  {
    author: 'JohnConnor',
    name: 'house',
    points: [
      { x: 10, y: 10 },
      { x: 100, y: 10 },
      { x: 100, y: 100 },
      { x: 10, y: 100 },
      { x: 10, y: 10 },
    ],
  },
  {
    author: 'JohnConnor',
    name: 'triangle',
    points: [
      { x: 50, y: 10 },
      { x: 100, y: 100 },
      { x: 10, y: 100 },
      { x: 50, y: 10 },
    ],
  },
  {
    author: 'SarahConnor',
    name: 'star',
    points: [
      { x: 60, y: 10 },
      { x: 75, y: 50 },
      { x: 120, y: 55 },
      { x: 85, y: 80 },
      { x: 100, y: 120 },
      { x: 60, y: 95 },
      { x: 20, y: 120 },
      { x: 35, y: 80 },
      { x: 0, y: 55 },
      { x: 45, y: 50 },
      { x: 60, y: 10 },
    ],
  },
  {
    author: 'SarahConnor',
    name: 'square',
    points: [
      { x: 20, y: 20 },
      { x: 120, y: 20 },
      { x: 120, y: 120 },
      { x: 20, y: 120 },
      { x: 20, y: 20 },
    ],
  },
]

function delay(ms = 300) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

const apimock = {
  async getAll() {
    await delay()
    return [...MOCK_BLUEPRINTS]
  },

  async getByAuthor(author) {
    await delay()
    return MOCK_BLUEPRINTS.filter((bp) => bp.author === author)
  },

  async getByAuthorAndName(author, name) {
    await delay()
    const bp = MOCK_BLUEPRINTS.find((b) => b.author === author && b.name === name)
    if (!bp) throw new Error(`Blueprint '${name}' by '${author}' not found`)
    return { ...bp }
  },

  async create(blueprint) {
    await delay()
    const newBp = { ...blueprint }
    MOCK_BLUEPRINTS.push(newBp)
    return newBp
  },
}

export default apimock
