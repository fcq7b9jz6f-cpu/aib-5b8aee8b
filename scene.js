
import * as THREE from 'three';

let scene, camera, renderer, spotlight, oliveBranch;
const mouse = new THREE.Vector2();
const spotlightTargetPos = new THREE.Vector3();

function createOliveBranch() {
    const group = new THREE.Group();
    const material = new THREE.MeshStandardMaterial({
        color: 0xe8c547,
        metalness: 0.4,
        roughness: 0.6,
    });

    // Main stem
    const stemGeom = new THREE.CylinderGeometry(0.03, 0.05, 4, 8);
    const stem = new THREE.Mesh(stemGeom, material);
    stem.rotation.z = Math.PI / 8;
    group.add(stem);

    // Branches and leaves
    for (let i = 0; i < 10; i++) {
        const branchGroup = new THREE.Group();
        
        const branchGeom = new THREE.CylinderGeometry(0.01, 0.02, 0.8, 5);
        const branch = new THREE.Mesh(branchGeom, material);
        
        const leafGeom = new THREE.SphereGeometry(0.1, 8, 6);
        leafGeom.scale(1, 0.5, 1); // Flatten to a leaf shape
        const leaf = new THREE.Mesh(leafGeom, material);
        leaf.position.y = 0.4;
        
        branch.add(leaf);

        branch.rotation.z = (Math.random() - 0.5) * Math.PI / 2;
        branch.position.y = (i - 5) * 0.35;
        branch.position.x = (i % 2 === 0 ? 1 : -1) * 0.1;

        branchGroup.add(branch);
        group.add(branchGroup);
    }

    return group;
}

function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const canvas = document.getElementById('webgl-canvas');
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Lights
    const ambientLight = new THREE.AmbientLight(0xf0ebe3, 0.2);
    scene.add(ambientLight);

    spotlight = new THREE.SpotLight(0xe8c547, 150, 20, Math.PI * 0.15, 0.8, 1);
    spotlight.position.set(0, 0, 8);
    spotlight.target.position.set(0, 0, 0);
    scene.add(spotlight);
    scene.add(spotlight.target);

    // Object
    oliveBranch = createOliveBranch();
    scene.add(oliveBranch);

    // Event Listeners
    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('mousemove', onMouseMove, false);

    // Start animation loop
    animate();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
}

function onMouseMove(event) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Update target position for lerping
    const vector = new THREE.Vector3(mouse.x, mouse.y, 0.5);
    vector.unproject(camera);
    const dir = vector.sub(camera.position).normalize();
    const distance = -camera.position.z / dir.z;
    spotlightTargetPos.copy(camera.position).add(dir.multiplyScalar(distance));
}

function animate() {
    requestAnimationFrame(animate);

    // Slowly rotate the object
    if (oliveBranch) {
        oliveBranch.rotation.y += 0.002;
        oliveBranch.rotation.x += 0.0005;
    }

    // Lerp spotlight position
    spotlight.position.lerp(spotlightTargetPos, 0.08);

    renderer.render(scene, camera);
}

export { init as initScene };
