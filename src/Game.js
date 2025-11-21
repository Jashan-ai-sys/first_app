import { Renderer } from './Renderer.js';
import { Piece } from './Piece.js';
import { Grid } from './Grid.js';

const PIECE_TYPES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
const COLORS = [0x00f3ff, 0xff00ff, 0x00ff9d, 0xffe600, 0xff3333, 0x3333ff, 0xff8800];

export class Game {
    constructor() {
        this.renderer = new Renderer('game-container');
        this.grid = new Grid(10, 20, this.renderer);

        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.gameOver = false;
        this.isPlaying = false;

        this.dropInterval = 1000;
        this.lastDropTime = 0;

        this.currentPiece = null;
        this.nextPieceType = this.randomPieceType();

        this.ui = {
            score: document.getElementById('score'),
            level: document.getElementById('level'),
            lines: document.getElementById('lines'),
            startScreen: document.getElementById('start-screen'),
            gameOverScreen: document.getElementById('game-over-screen'),
            finalScore: document.getElementById('final-score-val'),
            startBtn: document.getElementById('start-btn'),
            restartBtn: document.getElementById('restart-btn')
        };

        this.setupControls();
        this.setupEventListeners();

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    randomPieceType() {
        return PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
    }

    getColor(type) {
        const index = PIECE_TYPES.indexOf(type);
        return COLORS[index % COLORS.length];
    }

    spawnPiece() {
        const type = this.nextPieceType;
        this.currentPiece = new Piece(type, this.getColor(type));
        this.renderer.add(this.currentPiece.mesh);

        this.nextPieceType = this.randomPieceType();
        // Update Next Piece UI
        const nextPreview = document.getElementById('next-piece-preview');
        if (nextPreview) nextPreview.innerText = this.nextPieceType;

        // Check for immediate collision (Game Over)
        if (this.checkCollision(0, 0)) {
            this.endGame();
        }
    }

    setupEventListeners() {
        console.log('Setting up event listeners');

        const startGame = (e) => {
            if (e) e.stopPropagation(); // Prevent bubbling issues
            console.log('Starting game...');
            this.start();
        };

        if (this.ui.startBtn) {
            console.log('Start button found');
            this.ui.startBtn.addEventListener('click', startGame);
            this.ui.startBtn.addEventListener('touchstart', startGame, { passive: false });
        } else {
            console.error('Start button NOT found');
        }

        if (this.ui.restartBtn) {
            this.ui.restartBtn.addEventListener('click', startGame);
            this.ui.restartBtn.addEventListener('touchstart', startGame, { passive: false });
        }

        // Add Enter key to start
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Enter' && !this.isPlaying) {
                startGame();
            }
        });
    }

    setupControls() {
        document.addEventListener('keydown', (event) => {
            if (!this.isPlaying || this.gameOver) return;

            switch (event.code) {
                case 'ArrowLeft':
                    this.move(-1, 0);
                    break;
                case 'ArrowRight':
                    this.move(1, 0);
                    break;
                case 'ArrowDown':
                    this.move(0, -1);
                    break;
                case 'ArrowUp':
                    this.rotate();
                    break;
                case 'Space':
                    this.hardDrop();
                    break;
            }
        });
    }

    start() {
        console.log('Game start triggered');
        this.grid.reset();
        if (this.currentPiece) {
            this.renderer.remove(this.currentPiece.mesh);
        }

        this.score = 0;
        this.level = 1;
        this.lines = 0;
        this.updateUI();

        this.gameOver = false;
        this.isPlaying = true;

        if (this.ui.startScreen) this.ui.startScreen.classList.add('hidden');
        if (this.ui.gameOverScreen) this.ui.gameOverScreen.classList.add('hidden');

        this.spawnPiece();
    }

    endGame() {
        this.gameOver = true;
        this.isPlaying = false;
        if (this.ui.finalScore) this.ui.finalScore.innerText = this.score;
        if (this.ui.gameOverScreen) this.ui.gameOverScreen.classList.remove('hidden');
    }

    move(dx, dy) {
        if (!this.currentPiece) return;

        if (!this.checkCollision(dx, dy)) {
            this.currentPiece.x += dx;
            this.currentPiece.y += dy;
            this.currentPiece.updatePosition();
            return true;
        } else if (dy < 0) {
            // Hit bottom or another piece while moving down
            this.lockPiece();
            return false;
        }
        return false;
    }

    rotate() {
        if (!this.currentPiece) return;

        const oldShape = this.currentPiece.rotate();

        let collision = false;
        this.currentPiece.shape.forEach(([bx, by]) => {
            const wx = this.currentPiece.x + bx;
            const wy = this.currentPiece.y + by;
            if (!this.grid.isValid(wx, wy) || this.grid.isOccupied(wx, wy)) {
                collision = true;
            }
        });

        if (collision) {
            this.currentPiece.revert(oldShape);
        }
    }

    hardDrop() {
        while (this.move(0, -1));
    }

    checkCollision(dx, dy) {
        let collision = false;
        this.currentPiece.shape.forEach(([bx, by]) => {
            const nextX = this.currentPiece.x + bx + dx;
            const nextY = this.currentPiece.y + by + dy;

            if (!this.grid.isValid(nextX, nextY) || this.grid.isOccupied(nextX, nextY)) {
                collision = true;
            }
        });
        return collision;
    }

    lockPiece() {
        this.grid.addPiece(this.currentPiece);
        this.renderer.remove(this.currentPiece.mesh);
        this.currentPiece = null;

        const cleared = this.grid.checkLines();
        if (cleared > 0) {
            this.updateScore(cleared);
        }

        this.spawnPiece();
    }

    updateScore(linesCleared) {
        const points = [0, 100, 300, 500, 800];
        this.score += points[linesCleared] * this.level;
        this.lines += linesCleared;
        this.level = Math.floor(this.lines / 10) + 1;

        this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);

        this.updateUI();
    }

    updateUI() {
        if (this.ui.score) this.ui.score.innerText = this.score;
        if (this.ui.level) this.ui.level.innerText = this.level;
        if (this.ui.lines) this.ui.lines.innerText = this.lines;
    }

    animate(time) {
        requestAnimationFrame(this.animate);

        if (this.isPlaying && !this.gameOver) {
            const deltaTime = time - this.lastDropTime;
            if (deltaTime > this.dropInterval) {
                this.move(0, -1);
                this.lastDropTime = time;
            }
        }

        this.renderer.render();
    }
}
