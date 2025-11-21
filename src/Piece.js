import * as THREE from 'three';

export class Piece {
    constructor(type, color) {
        this.type = type;
        this.color = color;
        this.shape = this.getShape(type);
        this.x = 3; // Start near center
        this.y = 18; // Start inside board limits
        this.mesh = new THREE.Group();
        this.blocks = [];

        this.buildMesh();
    }

    getShape(type) {
        switch (type) {
            case 'I': return [[0, 0], [1, 0], [2, 0], [3, 0]];
            case 'O': return [[0, 0], [1, 0], [0, 1], [1, 1]];
            case 'T': return [[1, 0], [0, 1], [1, 1], [2, 1]];
            case 'S': return [[1, 0], [2, 0], [0, 1], [1, 1]];
            case 'Z': return [[0, 0], [1, 0], [1, 1], [2, 1]];
            case 'J': return [[0, 0], [0, 1], [1, 1], [2, 1]];
            case 'L': return [[2, 0], [0, 1], [1, 1], [2, 1]];
            default: return [];
        }
    }

    buildMesh() {
        // Clear existing
        while (this.mesh.children.length > 0) {
            this.mesh.remove(this.mesh.children[0]);
        }
        this.blocks = [];

        const geometry = new THREE.BoxGeometry(0.9, 0.9, 0.9);
        const material = new THREE.MeshStandardMaterial({
            color: this.color,
            emissive: this.color,
            emissiveIntensity: 0.5,
            roughness: 0.1,
            metalness: 0.8
        });

        this.shape.forEach(([bx, by]) => {
            const block = new THREE.Mesh(geometry, material);
            block.position.set(bx, by, 0);
            block.castShadow = true;
            block.receiveShadow = true;
            this.mesh.add(block);
            this.blocks.push(block);
        });

        this.updatePosition();
    }

    updatePosition() {
        this.mesh.position.set(this.x, this.y, 0);
    }

    rotate() {
        // Simple rotation logic (90 degrees clockwise)
        // x' = y, y' = -x
        // We need to rotate around a pivot. For simplicity, let's rotate the local shape coordinates.
        // This is a naive implementation; complex wall kicks are omitted for MVP.

        const newShape = this.shape.map(([bx, by]) => {
            // Center of rotation depends on piece, but let's try rotating around (1,1) or similar?
            // Actually, standard tetris rotates around a specific block.
            // Let's just swap x/y with sign change relative to a "center"
            // Or simpler: just rotate the array of coords.

            // Rotate 90 deg clockwise: (x, y) -> (y, -x)
            // But we need to keep them positive/aligned.
            // Let's find center of mass? No, standard is specific pivots.
            // Let's just do (y, -x) and then normalize to keep top-left at 0,0?
            // No, that shifts the piece.

            // Let's use a relative rotation.
            // Assume pivot is roughly the second block for most pieces.

            // For MVP: just transform (x,y) -> (-y, x) (Counter Clockwise) or (y, -x) (Clockwise)
            // Let's do Clockwise: newX = y, newY = -x.
            // Wait, this rotates around 0,0 of the local group.
            return [by, -bx];
        });

        // We need to shift the shape back so it doesn't fly away.
        // Find min x and min y
        // actually, let's just try this and see.
        // The 'O' piece shouldn't rotate.
        if (this.type === 'O') return;

        // Apply rotation
        const oldShape = this.shape;
        this.shape = newShape;

        // Rebuild mesh
        this.buildMesh();

        return oldShape; // Return old shape in case we need to revert (collision)
    }

    revert(oldShape) {
        this.shape = oldShape;
        this.buildMesh();
    }
}
