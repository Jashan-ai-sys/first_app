import * as THREE from 'three';

export class Grid {
    constructor(width, height, scene) {
        this.width = width;
        this.height = height;
        this.scene = scene;
        this.grid = Array(height).fill().map(() => Array(width).fill(null));
    }

    isValid(x, y) {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    isOccupied(x, y) {
        return this.grid[y][x] !== null;
    }

    addPiece(piece) {
        piece.shape.forEach(([bx, by]) => {
            const worldX = piece.x + bx;
            const worldY = piece.y + by;

            if (this.isValid(worldX, worldY)) {
                // Create a standalone block to leave on the grid
                const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
                const material = new THREE.MeshStandardMaterial({
                    color: piece.color,
                    emissive: piece.color,
                    emissiveIntensity: 0.5,
                    roughness: 0.1,
                    metalness: 0.8
                });
                const block = new THREE.Mesh(geometry, material);
                block.position.set(worldX, worldY, 0);
                block.castShadow = true;
                block.receiveShadow = true;

                this.scene.add(block);
                this.grid[worldY][worldX] = block;
            }
        });
    }

    checkLines() {
        let linesCleared = 0;

        for (let y = 0; y < this.height; y++) {
            if (this.grid[y].every(cell => cell !== null)) {
                // Line full
                linesCleared++;

                // Remove blocks from scene
                this.grid[y].forEach(block => {
                    this.scene.remove(block);
                    // Optional: Add explosion effect here
                });

                // Shift rows down
                for (let ky = y; ky < this.height - 1; ky++) {
                    this.grid[ky] = this.grid[ky + 1];
                    // Update block positions
                    this.grid[ky].forEach(block => {
                        if (block) block.position.y -= 1;
                    });
                }

                // Add new empty row at top
                this.grid[this.height - 1] = Array(this.width).fill(null);

                // Decrement y to check the same row index again (since rows shifted down)
                y--;
            }
        }

        return linesCleared;
    }

    reset() {
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x]) {
                    this.scene.remove(this.grid[y][x]);
                    this.grid[y][x] = null;
                }
            }
        }
    }
}
