/**
 * ai.js — Intelligent computer opponent.
 *
 * Difficulty levels:
 *  easy   — random valid move
 *  medium — win > block > center > corner > random
 *  hard   — full Minimax (unbeatable)
 */
const AI = (() => {

  const WIN_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  // ─── PUBLIC ───
  function getBestMove(board, difficulty) {
    switch (difficulty) {
      case 'easy':   return _easyMove(board);
      case 'medium': return _mediumMove(board);
      case 'hard':
      default:       return _hardMove(board);
    }
  }

  // ─── EASY ───
  function _easyMove(board) {
    const empty = _empty(board);
    return empty[Math.floor(Math.random() * empty.length)];
  }

  // ─── MEDIUM ───
  function _mediumMove(board) {
    // 1. Win if possible
    const win = _findThreat(board, 'O');
    if (win !== -1) return win;

    // 2. Block human win
    const block = _findThreat(board, 'X');
    if (block !== -1) return block;

    // 3. Center
    if (!board[4]) return 4;

    // 4. Corners
    const corners = [0,2,6,8].filter(i => !board[i]);
    if (corners.length) return corners[Math.floor(Math.random()*corners.length)];

    // 5. Any remaining
    return _easyMove(board);
  }

  // ─── HARD — Minimax ───
  function _hardMove(board) {
    let best = -Infinity, bestIdx = -1;
    for (const i of _empty(board)) {
      board[i] = 'O';
      const score = _minimax(board, 0, false, -Infinity, Infinity);
      board[i] = null;
      if (score > best) { best = score; bestIdx = i; }
    }
    return bestIdx;
  }

  function _minimax(board, depth, isMax, alpha, beta) {
    const winner = _checkWinner(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    const empty = _empty(board);
    if (!empty.length) return 0;

    if (isMax) {
      let best = -Infinity;
      for (const i of empty) {
        board[i] = 'O';
        best = Math.max(best, _minimax(board, depth+1, false, alpha, beta));
        board[i] = null;
        alpha = Math.max(alpha, best);
        if (beta <= alpha) break;
      }
      return best;
    } else {
      let best = Infinity;
      for (const i of empty) {
        board[i] = 'X';
        best = Math.min(best, _minimax(board, depth+1, true, alpha, beta));
        board[i] = null;
        beta = Math.min(beta, best);
        if (beta <= alpha) break;
      }
      return best;
    }
  }

  // ─── HELPERS ───
  function _empty(board) { return board.reduce((a,v,i)=>{ if(!v) a.push(i); return a; },[]); }

  function _findThreat(board, player) {
    for (const [a,b,c] of WIN_COMBOS) {
      const line = [board[a],board[b],board[c]];
      const count = line.filter(v=>v===player).length;
      const empty = line.indexOf(null);
      if (count === 2 && empty !== -1) {
        return [a,b,c][empty];
      }
    }
    return -1;
  }

  function _checkWinner(board) {
    for (const [a,b,c] of WIN_COMBOS) {
      if (board[a] && board[a]===board[b] && board[a]===board[c]) return board[a];
    }
    return null;
  }

  return { getBestMove };
})();
