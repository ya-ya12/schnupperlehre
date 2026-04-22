export const ROWS = 6
export const COLS = 7
export type Cell = 0 | 1 | 2
export type Board = Cell[][]

export function createBoard(): Board {
  return Array.from({ length: ROWS }, () => Array.from({ length: COLS }, () => 0))
}

export function dropToken(board: Board, col: number, player: Cell): number {
  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (board[row][col] === 0) {
      board[row][col] = player
      return row
    }
  }
  return -1
}

export function checkWinner(board: Board, player: Cell): boolean {
  const dirs = [
    [1, 0],
    [0, 1],
    [1, 1],
    [1, -1],
  ]
  for (let r = 0; r < ROWS; r += 1) {
    for (let c = 0; c < COLS; c += 1) {
      if (board[r][c] !== player) continue
      for (const [dr, dc] of dirs) {
        let count = 1
        for (let k = 1; k < 4; k += 1) {
          const nr = r + dr * k
          const nc = c + dc * k
          if (nr < 0 || nr >= ROWS || nc < 0 || nc >= COLS || board[nr][nc] !== player) break
          count += 1
        }
        if (count === 4) return true
      }
    }
  }
  return false
}

export function isBoardFull(board: Board): boolean {
  return board[0].every((cell) => cell !== 0)
}
