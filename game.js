/**
 * game.js — Centralised game controller.
 *
 * Manages:
 *  - Internal board state
 *  - Turn alternation (HvH and HvAI)
 *  - Win / draw detection
 *  - AI move dispatch (with thinking delay)
 *  - Score tracking per-mode
 */
const Game = (() => {

  const WIN_COMBOS = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];

  // ─── CENTRALISED STATE ───
  let state = {
    board:      Array(9).fill(null),
    current:    'X',
    gameOver:   false,
    mode:       'hvh',        // 'hvh' | 'hva'
    difficulty: 'hard',       // 'easy' | 'medium' | 'hard'
    scores:     { X:0, O:0, D:0 },
    players:    { X:'Player X', O:'Player O' },
    aiThinkMin: 500,   // ms minimum thinking delay
    aiThinkMax: 1200,  // ms maximum thinking delay
  };

  // ─── INIT ───
  function init(config) {
    state.mode       = config.mode       || 'hvh';
    state.difficulty = config.difficulty || 'hard';
    state.players.X  = config.nameX      || 'Player X';
    state.players.O  = config.nameO      || (state.mode === 'hva' ? 'Computer' : 'Player O');

    state.scores = Storage.loadScores(state.mode);

    UI.setModeBadge(state.mode, state.difficulty);
    UI.setPlayerNames(state.players.X, state.players.O, state.mode);
    UI.setScoreLabels(state.mode);
    UI.updateScoreboard(state.scores);

    if (state.mode === 'hva') {
      UI.setDiffBadge(state.difficulty);
    }

    resetBoard();
  }

  // ─── RESET BOARD ───
  function resetBoard() {
    state.board   = Array(9).fill(null);
    state.current = 'X';
    state.gameOver = false;

    UI.hideModal();
    UI.hideThinking();
    UI.renderBoard(state.board, state.current, handleCellClick);
    UI.highlightActivePlayer(state.current, false);
    UI.setStatus(`${state.players[state.current]}'s turn`);
  }

  // ─── CELL CLICK (Human move) ───
  function handleCellClick(index) {
    if (state.board[index] || state.gameOver) return;
    // In AI mode, reject if it's the AI's turn
    if (state.mode === 'hva' && state.current === 'O') return;

    _placeMove(index, state.current);
  }

  // ─── PLACE MOVE ───
  function _placeMove(index, player) {
    state.board[index] = player;
    UI.renderBoard(state.board, state.current, handleCellClick);

    // Play sound
    if (player === 'X') Sound.playClick();
    else                Sound.playAIMove();

    // Check outcome
    const winCombo = _checkWin();
    if (winCombo) { _handleWin(winCombo, player); return; }
    if (state.board.every(v=>v)) { _handleDraw(); return; }

    // Switch turn
    state.current = player === 'X' ? 'O' : 'X';
    UI.highlightActivePlayer(state.current, false);

    // AI turn?
    if (state.mode === 'hva' && state.current === 'O') {
      _triggerAI();
    } else {
      UI.setStatus(`${state.players[state.current]}'s turn`);
    }
  }

  // ─── AI TURN ───
  function _triggerAI() {
    UI.showThinking();
    UI.setStatus('Computer is thinking...');

    const delay = state.aiThinkMin + Math.random() * (state.aiThinkMax - state.aiThinkMin);
    setTimeout(() => {
      if (state.gameOver) return; // safety guard
      UI.hideThinking();
      const move = AI.getBestMove([...state.board], state.difficulty);
      if (move !== -1 && move !== undefined) {
        _placeMove(move, 'O');
      }
    }, delay);
  }

  // ─── WIN ───
  function _handleWin(combo, player) {
    state.gameOver = true;
    state.scores[player]++;
    Storage.saveScores(state.mode, state.scores);

    UI.updateScoreboard(state.scores);
    UI.highlightWinCells(combo);
    UI.highlightActivePlayer(state.current, true);
    UI.hideThinking();

    const isHuman = state.mode === 'hvh' || player === 'X';
    const type    = player === 'X' ? 'win-x' : 'win-o';

    if (isHuman && player === 'X') {
      Sound.playWin();
      Particles.launchConfetti();
    } else if (player === 'O' && state.mode === 'hva') {
      Sound.playLose();
    } else {
      Sound.playWin();
      Particles.launchConfetti();
    }

    setTimeout(() => UI.showModal(type, state.players[player]), 750);
  }

  // ─── DRAW ───
  function _handleDraw() {
    state.gameOver = true;
    state.scores.D++;
    Storage.saveScores(state.mode, state.scores);

    UI.updateScoreboard(state.scores);
    UI.highlightActivePlayer(state.current, true);
    UI.hideThinking();
    Sound.playDraw();

    setTimeout(() => UI.showModal('draw', null), 500);
  }

  // ─── CHECK WIN ───
  function _checkWin() {
    for (const combo of WIN_COMBOS) {
      const [a,b,c] = combo;
      if (state.board[a] && state.board[a]===state.board[b] && state.board[a]===state.board[c]) {
        return combo;
      }
    }
    return null;
  }

  // ─── RESET SCORES ───
  function resetScores() {
    state.scores = { X:0, O:0, D:0 };
    Storage.clearScores(state.mode);
    UI.updateScoreboard(state.scores);
    resetBoard();
  }

  // ─── EXPOSE ───
  function getState() { return state; }

  return { init, resetBoard, resetScores, getState };
})();
