/**
 * storage.js
 * All localStorage operations. Scores are stored per-mode so
 * HvH and HvAI have independent scoreboards.
 */
const Storage = (() => {
  const THEME_KEY = 'nexus_theme';

  function _scoreKey(mode) {
    return `nexus_scores_${mode}`; // e.g. nexus_scores_hvh | nexus_scores_hva
  }

  function saveScores(mode, scores) {
    try { localStorage.setItem(_scoreKey(mode), JSON.stringify(scores)); } catch (_) {}
  }

  function loadScores(mode) {
    try {
      const raw = localStorage.getItem(_scoreKey(mode));
      return raw ? JSON.parse(raw) : { X: 0, O: 0, D: 0 };
    } catch (_) { return { X: 0, O: 0, D: 0 }; }
  }

  function clearScores(mode) {
    try { localStorage.removeItem(_scoreKey(mode)); } catch (_) {}
  }

  function saveTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
  }

  function loadTheme() {
    try { return localStorage.getItem(THEME_KEY) || 'dark'; } catch (_) { return 'dark'; }
  }

  return { saveScores, loadScores, clearScores, saveTheme, loadTheme };
})();
