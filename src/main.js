import './style.css';
import { Game } from './Game.js';

document.addEventListener('DOMContentLoaded', () => {
  try {
    const game = new Game();
    window.game = game;
    console.log('Game initialized successfully');
  } catch (error) {
    console.error('Failed to initialize game:', error);
    alert('Game failed to start: ' + error.message);
  }
});
