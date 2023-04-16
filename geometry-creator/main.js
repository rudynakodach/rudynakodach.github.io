import * as THREE from 'https://unpkg.com/three/build/three.module.js'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
scene.add(camera);

var isMoving = false;
var movementKeysActive = {
    w: false,
    s: false,
    a: false,
    d: false,
    q: false,
    e: false
}

const xMaterial = new THREE.LineBasicMaterial({ color: 0x0000ff });
const xPoints = [];
xPoints.push(new THREE.Vector3(- 1000, 0, 0));
xPoints.push(new THREE.Vector3(  1000, 0, 0));

const xGeometry = new THREE.BufferGeometry().setFromPoints(xPoints);
const xLine = new THREE.Line(xGeometry, xMaterial);
scene.add(xLine)

const yMaterial = new THREE.LineBasicMaterial({ color: 0x00ff00 });
const yPoints = [];
yPoints.push(new THREE.Vector3(0, -1000, 0));
yPoints.push(new THREE.Vector3(0,  1000, 0));

const yGeometry = new THREE.BufferGeometry().setFromPoints(yPoints);
const yLine = new THREE.Line(yGeometry, yMaterial);
scene.add(yLine)

const zMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const zPoints = [];
zPoints.push(new THREE.Vector3(0, 0, -1000));
zPoints.push(new THREE.Vector3(0, 0,  1000));

const zGeometry = new THREE.BufferGeometry().setFromPoints(zPoints);
const zLine = new THREE.Line(zGeometry, zMaterial);
scene.add(zLine)

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);
directionalLight.position.set(.5, .5, 1)
directionalLight.rotation.z += 1;
directionalLight.castShadow = true;

camera.position.set(0, 4, 6)

function animate() {
    requestAnimationFrame(animate);
    if (isMoving) {
        // dampen the rotationSpeed over time
        rotationSpeed.x *= .75;
        rotationSpeed.y *= .75;

        // apply the rotationSpeed to the camera's rotation 
        camera.quaternion.add(rotationSpeed.x, rotationSpeed.y)

        // calculate relative movement based on camera direction
        let movement = new THREE.Vector3();
        if (movementKeysActive['w']) {
            movement.z -= 0.05;
        }
        if (movementKeysActive['s']) {
            movement.z += 0.05;
        }
        if (movementKeysActive['a']) {
            movement.x -= 0.05;
        }
        if (movementKeysActive['d']) {
            movement.x += 0.05;
        }
        if (movementKeysActive['q']) {
            movement.y -= 0.05;
        }
        if (movementKeysActive['e']) {
            movement.y += 0.05;
        }

        // transform movement to camera space and apply to camera position
        movement.applyQuaternion(camera.quaternion);
        camera.position.add(movement);
    }
    renderer.render(scene, camera);
}
animate();

window.addEventListener("mousedown", (event) => {
    if(event.button == 0) {
        isMoving = true;
        lastMousePosition = {x: event.clientX, y: event.clientY}
    }
})

window.addEventListener("mouseup", (event) => {
    if (event.button == 0) {
        isMoving = false;
    }
})

let lastMousePosition = { x: 0, y: 0 };
let rotationSpeed = { x: 0, y: 0 };

// add a mousemove event listener to the window
window.addEventListener("mousemove", (event) => {
    // check if isMoving is true
    if (isMoving) {
        // calculate the change in mouse position since the last frame
        const delta = {
            x: event.clientX - lastMousePosition.x,
            y: event.clientY - lastMousePosition.y
        };

        // update the lastMousePosition to the current mouse position
        lastMousePosition = { x: event.clientX, y: event.clientY };

        // calculate the rotation amount based on the delta
        const rotation = {
            x: delta.y * 0.0005,
            y: delta.x * 0.0005
        };

        // update the rotationSpeed based on the rotation amount
        rotationSpeed.x -= rotation.x;
        rotationSpeed.y -= rotation.y;
    }
});


window.addEventListener("keydown", (event) => {
    if(movementKeysActive.hasOwnProperty(event.key.toLowerCase())) {
        movementKeysActive[event.key.toLowerCase()] = true;
        console.log(`${event.key}: ` + movementKeysActive[event.key.toLowerCase()])
    } else {
        if(event.key == "r") {
            camera.position.set(0, 4, 6)
            camera.lookAt(cube.position)
        }
    }
})

window.addEventListener("keyup", (event) => {
    if (movementKeysActive.hasOwnProperty(event.key.toLowerCase())) {
        movementKeysActive[event.key.toLowerCase()] = false;
        console.log(`${event.key}: ` + movementKeysActive[event.key.toLowerCase()])
    }
})
