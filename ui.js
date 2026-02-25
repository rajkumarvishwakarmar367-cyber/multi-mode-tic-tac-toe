/**
 * ui.js — All DOM manipulation. Zero game logic here.
 */
const UI = (() => {

  // ─── SCREEN ROUTING ───
  const SCREENS = ['mode-screen','setup-hvh-screen','setup-hva-screen'];

  function showScreen(id) {
    SCREENS.forEach(s => {
      const el = document.getElementById(s);
      if (el) el.classList[s===id?'remove':'add']('hidden');
    });
    // Game screen is separate (not position:fixed)
    const gs = document.getElementById('game-screen');
    if (id === 'game') {
      gs.classList.remove('hidden');
      SCREENS.forEach(s=>{ const el=document.getElementById(s); if(el) el.classList.add('hidden'); });
    } else {
      gs.classList.add('hidden');
    }
  }

  // ─── MODE BADGE ───
  function setModeBadge(mode, difficulty) {
    const badge = document.getElementById('mode-badge');
    if (mode === 'hvh') {
      badge.textContent = 'HvH';
      badge.classList.remove('ai-mode');
    } else {
      badge.textContent = `AI·${difficulty.toUpperCase()}`;
      badge.classList.add('ai-mode');
    }
  }

  // ─── PLAYER INFO ───
  function setPlayerNames(nameX, nameO, mode) {
    document.getElementById('name-x').textContent = nameX;
    document.getElementById('name-o').textContent = nameO;

    const cardO = document.getElementById('card-o');
    const oSym  = document.getElementById('o-symbol');
    const diffBadge = cardO.querySelector('.diff-badge');

    if (diffBadge) diffBadge.remove();

    if (mode === 'hva') {
      cardO.classList.add('ai-card');
      oSym.textContent = '🤖';
    } else {
      cardO.classList.remove('ai-card');
      oSym.textContent = 'O';
    }
  }

  function setDiffBadge(difficulty) {
    const cardO = document.getElementById('card-o');
    let badge = cardO.querySelector('.diff-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'diff-badge';
      cardO.appendChild(badge);
    }
    const icons = { easy:'🌱', medium:'⚡', hard:'💀' };
    badge.textContent = `${icons[difficulty]} ${difficulty.toUpperCase()}`;
  }

  function highlightActivePlayer(current, gameOver) {
    document.getElementById('card-x').className = 'player-card' + (!gameOver&&current==='X'?' active-x':'');
    const cardO = document.getElementById('card-o');
    const isAI  = cardO.classList.contains('ai-card');
    cardO.className = 'player-card' + (isAI?' ai-card':'') + (!gameOver&&current==='O'?' active-o':'');
  }

  // ─── SCOREBOARD ───
  function updateScoreboard(scores) {
    ['x','o','d'].forEach(k => {
      const el  = document.getElementById(`score-${k}`);
      const key = k.toUpperCase();
      const val = scores[key] !== undefined ? scores[key] : scores[k] || 0;
      if (el.textContent !== String(val)) {
        el.textContent = val;
        el.classList.remove('bump');
        void el.offsetWidth;
        el.classList.add('bump');
      }
    });
  }

  function setScoreLabels(mode) {
    const lblX = document.getElementById('score-lbl-x');
    const lblO = document.getElementById('score-lbl-o');
    lblX.textContent = mode === 'hva' ? 'Your Wins' : 'Wins';
    lblO.textContent = mode === 'hva' ? 'AI Wins'   : 'Wins';
  }

  // ─── BOARD ───
  function renderBoard(board, currentPlayer, onCellClick) {
    const boardEl = document.getElementById('board');
    boardEl.innerHTML = '';
    boardEl.classList.remove('locked');

    board.forEach((value, index) => {
      const cell = document.createElement('div');
      cell.className = 'cell' + (value ? ` ${value.toLowerCase()} taken` : '');
      cell.dataset.hover = currentPlayer;
      cell.innerHTML = `<span class="cell-value">${value || ''}</span>`;
      cell.addEventListener('click', () => onCellClick(index));
      boardEl.appendChild(cell);
    });
  }

  function lockBoard() {
    document.getElementById('board').classList.add('locked');
  }

  function unlockBoard() {
    document.getElementById('board').classList.remove('locked');
  }

  function highlightWinCells(indices) {
    const cells = document.querySelectorAll('.cell');
    indices.forEach(i => cells[i].classList.add('win'));
  }

  // ─── AI THINKING ───
  function showThinking() {
    document.getElementById('thinking-overlay').classList.remove('hidden');
    lockBoard();
  }

  function hideThinking() {
    document.getElementById('thinking-overlay').classList.add('hidden');
  }

  // ─── STATUS ───
  function setStatus(msg) {
    document.getElementById('status-bar').textContent = msg;
  }

  // ─── MODAL ───
  function showModal(type, winnerName) {
    const overlay = document.getElementById('modal');
    const inner   = document.getElementById('modal-inner');
    const emoji   = document.getElementById('modal-emoji');
    const result  = document.getElementById('modal-result');
    const name    = document.getElementById('modal-name');

    const types = {
      'win-x': { cls:'win-x', e:'🏆', r:'Winner!',       n: winnerName },
      'win-o': { cls:'win-o', e:'🤖', r:'Computer Wins!', n: winnerName },
      'draw':  { cls:'draw',  e:'🤝', r:"It's a Draw!",   n:'Well Played!' },
    };
    const cfg = types[type] || types.draw;
    inner.className = `modal ${cfg.cls}`;
    emoji.textContent  = cfg.e;
    result.textContent = cfg.r;
    name.textContent   = cfg.n;

    overlay.classList.add('show');
  }

  function hideModal() {
    document.getElementById('modal').classList.remove('show');
  }

  // ─── THEME ───
  function setTheme(t) { document.documentElement.setAttribute('data-theme', t); }
  function getTheme()  { return document.documentElement.getAttribute('data-theme'); }

  return {
    showScreen, setModeBadge,
    setPlayerNames, setDiffBadge, highlightActivePlayer,
    updateScoreboard, setScoreLabels,
    renderBoard, lockBoard, unlockBoard, highlightWinCells,
    showThinking, hideThinking,
    setStatus,
    showModal, hideModal,
    setTheme, getTheme
  };
})();
