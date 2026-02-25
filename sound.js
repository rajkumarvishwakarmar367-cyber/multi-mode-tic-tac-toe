/**
 * sound.js — Synthesised sound effects via Web Audio API.
 */
const Sound = (() => {
  let ctx = null;

  function _ctx() {
    if (!ctx) {
      const C = window.AudioContext || window.webkitAudioContext;
      if (C) ctx = new C();
    }
    return ctx;
  }

  function _tone(freq, type, duration, gain = 0.18) {
    try {
      const c = _ctx(); if (!c) return;
      const osc = c.createOscillator();
      const g   = c.createGain();
      osc.connect(g); g.connect(c.destination);
      osc.type = type;
      osc.frequency.setValueAtTime(freq, c.currentTime);
      g.gain.setValueAtTime(gain, c.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
      osc.start(); osc.stop(c.currentTime + duration);
    } catch (_) {}
  }

  function playClick()  { _tone(440, 'sine', 0.08, 0.15); }
  function playAIMove() { _tone(330, 'sine', 0.10, 0.10); }
  function playWin()    { [523,659,784,1047].forEach((f,i)=>setTimeout(()=>_tone(f,'sine',0.3,0.2),i*100)); }
  function playLose()   { [300,260,220].forEach((f,i)=>setTimeout(()=>_tone(f,'sawtooth',0.25,0.12),i*120)); }
  function playDraw()   { _tone(220, 'sine', 0.4, 0.1); }

  return { playClick, playAIMove, playWin, playLose, playDraw };
})();
