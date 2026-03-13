import { describe, it, expect } from 'vitest'
import reducer, {
  clearError,
} from '../src/features/blueprints/blueprintsSlice.js'

describe('blueprints slice', () => {
  it('should initialize correctly', () => {
    const state = reducer(undefined, { type: '@@INIT' })
    expect(state.authors).toEqual([])
    expect(state.byAuthor).toEqual({})
    expect(state.current).toBeNull()
    expect(state.status).toBe('idle')
    expect(state.error).toBeNull()
  })

  it('should clear error', () => {
    const state = reducer(
      { authors: [], byAuthor: {}, current: null, status: 'failed', error: 'boom' },
      clearError(),
    )
    expect(state.error).toBeNull()
  })

  it('should set loading on fetchAuthors.pending', () => {
    const state = reducer(undefined, { type: 'blueprints/fetchAuthors/pending' })
    expect(state.status).toBe('loading')
  })

  it('should set authors on fetchAuthors.fulfilled', () => {
    const state = reducer(undefined, {
      type: 'blueprints/fetchAuthors/fulfilled',
      payload: ['JohnConnor', 'SarahConnor'],
    })
    expect(state.authors).toEqual(['JohnConnor', 'SarahConnor'])
    expect(state.status).toBe('succeeded')
  })

  it('should store blueprints by author on fetchByAuthor.fulfilled', () => {
    const items = [{ name: 'house', author: 'JohnConnor', points: [] }]
    const state = reducer(undefined, {
      type: 'blueprints/fetchByAuthor/fulfilled',
      payload: { author: 'JohnConnor', items },
    })
    expect(state.byAuthor['JohnConnor']).toEqual(items)
  })

  it('should set current on fetchBlueprint.fulfilled', () => {
    const bp = { name: 'house', author: 'JohnConnor', points: [{ x: 1, y: 1 }] }
    const state = reducer(undefined, {
      type: 'blueprints/fetchBlueprint/fulfilled',
      payload: bp,
    })
    expect(state.current).toEqual(bp)
  })
})
