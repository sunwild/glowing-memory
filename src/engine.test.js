import { describe, it, expect } from 'vitest'
import { Engine } from './engine.js'

describe('Engine', () => {
  it('initializes with default gravity', () => {
    const engine = new Engine({ enableRenderer: false })
    expect(engine.gravity).toEqual({ x: 0, y: -9.8, z: 0 })
  })
})
