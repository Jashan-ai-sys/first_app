import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

export class Renderer {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.width = window.innerWidth;
        this.height = window.innerHeight;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x050510);
        this.scene.fog = new THREE.FogExp2(0x050510, 0.02);

        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000);
        this.camera.position.set(5, 10, 20);
        this.camera.lookAt(5, 10, 0);

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.toneMapping = THREE.ReinhardToneMapping;
        this.container.appendChild(this.renderer.domElement);

        this.setupLights();
        this.setupGridHelper(); // Visual guide
        this.setupPostProcessing();

        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    setupPostProcessing() {
        this.composer = new EffectComposer(this.renderer);

        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, // strength
            0.4, // radius
            0.85 // threshold
        );
        this.composer.addPass(bloomPass);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0x404040, 2); // Soft white light
        this.scene.add(ambientLight);

        const dirLight = new THREE.DirectionalLight(0xffffff, 1);
        dirLight.position.set(10, 20, 10);
        dirLight.castShadow = true;
        this.scene.add(dirLight);

        // Neon glow lights
        const pointLight1 = new THREE.PointLight(0x00f3ff, 2, 50);
        pointLight1.position.set(0, 10, 10);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0xff00ff, 2, 50);
        pointLight2.position.set(10, 10, 10);
        this.scene.add(pointLight2);
    }

    setupGridHelper() {
        // Create a visual frame for the play area (10x20)
        // Board is 10 units wide, 20 units high.
        // Centered at x=4.5, y=9.5 (0-9, 0-19)

        const frameGeometry = new THREE.BoxGeometry(12, 22, 1);
        const edges = new THREE.EdgesGeometry(frameGeometry);
        const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0x00f3ff }));
        line.position.set(4.5, 9.5, -0.5);
        this.scene.add(line);

        // Floor
        const gridHelper = new THREE.GridHelper(40, 40, 0x333333, 0x111111);
        gridHelper.position.set(4.5, -1, 0);
        this.scene.add(gridHelper);
    }
    onWindowResize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.camera.aspect = this.width / this.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
        this.composer.setSize(this.width, this.height);
    }

    render() {
        // this.renderer.render(this.scene, this.camera);
        this.composer.render();
    }

    add(object) {
        this.scene.add(object);
    }

    remove(object) {
        this.scene.remove(object);
    }
}
