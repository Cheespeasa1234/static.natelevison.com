import $ from 'jquery';
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';

const scene: THREE.Scene = new THREE.Scene();
const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new PointerLockControls(camera, renderer.domElement);
controls.lock();

renderer.domElement.addEventListener('click', () => {
    if (controls.isLocked) {
        searchLoop: for (let i = 0; i < cubes.length; i++) {
            raycaster.setFromCamera(screenCenter, camera);
            const intersects = raycaster.intersectObject(cubes[i]);
            if (intersects.length > 0) {
                scene.remove(cubes[i]);
                cubes.splice(i, 1);
                break searchLoop;
            }
        }
    } else {
        controls.lock();
    }
});

let keyMap = new Map();
document.addEventListener('keydown', (ev) => {
    console.log(`key down: ${ev.code}`);
    keyMap.set(ev.code, true);
}, false);

document.addEventListener('keyup', (ev) => {
    console.log(`key up: ${ev.code}`);
    keyMap.set(ev.code, false);
}, false);

let cubes: THREE.Mesh[] = [];
const greenMat = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const blueMat = new THREE.MeshBasicMaterial({ color: 0x0033ff });

for (let x: number = 0; x < 10; x++) {
    for (let y: number = 0; y < 10; y++) {
        const geometry: THREE.BoxGeometry = new THREE.BoxGeometry(1, 1, 1);
        const cube: THREE.Mesh = new THREE.Mesh(geometry, greenMat);
        cube.position.setX(x * 3);
        cube.position.setY(y * 3);
        cube.rotation.x += 0.01 * x * 5;
        cube.rotation.y += 0.01 * x * 5;
        scene.add(cube);
        cubes.push(cube);
    }
}

function handleControls() {
    const moveSpeed = 0.5;
    const lookSpeed = 0.025;
    if (keyMap.get('KeyW')) {
        controls.moveForward(moveSpeed);
    }
    if (keyMap.get('KeyS')) {
        controls.moveForward(-moveSpeed);
    }
    if (keyMap.get('KeyD')) {
        controls.moveRight(moveSpeed);
    }
    if (keyMap.get('KeyA')) {
        controls.moveRight(-moveSpeed);
    }
    if (keyMap.get('Space')) {
        camera.position.setY(camera.position.y + moveSpeed);
    }
    if (keyMap.get('ShiftLeft')) {
        camera.position.setY(camera.position.y - moveSpeed);
    }

    if (keyMap.get('ArrowRight')) {
        camera.rotateY(lookSpeed);
    }
    if (keyMap.get('ArrowLeft')) {
        camera.rotateY(-lookSpeed);
    }
    if (keyMap.get('ArrowUp')) {
        camera.rotateX(-lookSpeed);
    }
    if (keyMap.get('ArrowDown')) {
        camera.rotateX(lookSpeed);
    }
}

function displayPos() {
    $("#menu_posx").html(`posx: ${camera.position.x}`);
    $("#menu_posy").html(`posy: ${camera.position.y}`);
    $("#menu_posz").html(`posz: ${camera.position.z}`);
    $("#menu_camx").html(`camx: ${camera.rotation.x}`);
    $("#menu_camy").html(`camy: ${camera.rotation.y}`);
    $("#menu_camz").html(`camz: ${camera.rotation.z}`);
}

const raycaster = new THREE.Raycaster();
const screenCenter = new THREE.Vector2(0, 0);
function animate() {
    requestAnimationFrame(animate);


    cubes.forEach(cube => {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        
        raycaster.setFromCamera(screenCenter, camera);
        const intersects = raycaster.intersectObject(cube);
        if (intersects.length > 0) {
            cube.material = blueMat;
        } else {
            cube.material = greenMat;
        }
    });

    handleControls();

    renderer.render(scene, camera);
}

animate();