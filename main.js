/**
 * main.js — Application entry point.
 * Wires all UI events → game controller calls.
 * No game logic lives here.
 */
(function () {

  // ─── INTERNAL APP STATE ───
  let selectedDifficulty = 'hard';

  // ─── BOOTSTRAP ───
  function boot() {
    UI.setTheme(Storage.loadTheme());
    UI.showScreen('mode-screen');
    _bindEvents();
  }

  // ─── BIND ALL EVENTS ───
  function _bindEvents() {

    // ── MODE SELECTION ──
    document.getElementById('btn-hvh').addEventListener('click', () => {
      UI.showScreen('setup-hvh-screen');
    });

    document.getElementById('btn-hva').addEventListener('click', () => {
      UI.showScreen('setup-hva-screen');
    });

    // ── BACK BUTTONS ──
    document.getElementById('back-from-hvh').addEventListener('click', () => {
      UI.showScreen('mode-screen');
    });

    document.getElementById('back-from-hva').addEventListener('click', () => {
      UI.showScreen('mode-screen');
    });

    // ── DIFFICULTY BUTTONS ──
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedDifficulty = btn.dataset.diff;
      });
    });

    // ── START HvH ──
    document.getElementById('btn-start-hvh').addEventListener('click', _startHvH);
    ['p1-name','p2-name'].forEach(id => {
      document.getElementById(id).addEventListener('keydown', e => {
        if (e.key === 'Enter') _startHvH();
      });
    });

    // ── START HvAI ──
    document.getElementById('btn-start-hva').addEventListener('click', _startHvAI);
    document.getElementById('p1-name-ai').addEventListener('keydown', e => {
      if (e.key === 'Enter') _startHvAI();
    });

    // ── IN-GAME HEADER ──
    document.getElementById('btn-restart').addEventListener('click', () => {
      Game.resetBoard();
    });

    document.getElementById('btn-reset-scores').addEventListener('click', () => {
      if (confirm('Reset scores for this mode?')) Game.resetScores();
    });

    document.getElementById('btn-theme').addEventListener('click', _toggleTheme);

    document.getElementById('btn-home').addEventListener('click', () => {
      UI.hideModal();
      UI.showScreen('mode-screen');
    });

    // ── MODAL BUTTONS ──
    document.getElementById('btn-next-round').addEventListener('click', () => {
      Game.resetBoard();
    });

    document.getElementById('btn-change-mode').addEventListener('click', () => {
      UI.hideModal();
      UI.showScreen('mode-screen');
    });

    document.getElementById('btn-reset-all').addEventListener('click', () => {
      Game.resetScores();
    });

    // ── KEYBOARD: numpad 1-9 → cell index 0-8 ──
    document.addEventListener('keydown', e => {
      const n = parseInt(e.key);
      if (n >= 1 && n <= 9) {
        const cells = document.querySelectorAll('.cell');
        if (cells[n-1]) cells[n-1].click();
      }
    });
  }

  // ─── START HvH ───
  function _startHvH() {
    const nameX = (document.getElementById('p1-name').value.trim())     || 'Player X';
    const nameO = (document.getElementById('p2-name').value.trim())     || 'Player O';
    UI.showScreen('game');
    Game.init({ mode:'hvh', nameX, nameO });
  }

  // ─── START HvAI ───
  function _startHvAI() {
    const nameX = (document.getElementById('p1-name-ai').value.trim()) || 'Player';
    UI.showScreen('game');
    Game.init({
      mode:       'hva',
      difficulty: selectedDifficulty,
      nameX,
      nameO:      'Computer',
    });
  }

  // ─── THEME TOGGLE ───
  function _toggleTheme() {
    const next = UI.getTheme() === 'dark' ? 'light' : 'dark';
    UI.setTheme(next);
    Storage.saveTheme(next);
  }

  // ─── RUN ───
  document.addEventListener('DOMContentLoaded', boot);

})();
