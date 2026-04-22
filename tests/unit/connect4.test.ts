import { describe, expect, it } from 'vitest'
import { checkWinner, createBoard, dropToken, isBoardFull } from '../../src/games/connect4/connect4'

describe('connect4 rules', () => {
  it('drops tokens in lowest row', () => {
    const board = createBoard()
    const row = dropToken(board, 0, 1)
    expect(row).toBe(5)
  })

  it('detects horizontal winner', () => {
    const board = createBoard()
    dropToken(board, 0, 1)
    dropToken(board, 1, 1)
    dropToken(board, 2, 1)
    dropToken(board, 3, 1)
    expect(checkWinner(board, 1)).toBe(true)
  })

  it('detects full board', () => {
    const board = createBoard()
    for (let c = 0; c < 7; c += 1) {
      for (let r = 0; r < 6; r += 1) {
        dropToken(board, c, r % 2 === 0 ? 1 : 2)
      }
    }
    expect(isBoardFull(board)).toBe(true)
  })
})
