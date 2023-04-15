import * as THREE from 'https://unpkg.com/three/build/three.module.js'
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000)
scene.add(camera)

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)
cube.position.set(0, 2, 0)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
scene.add(directionalLight);
directionalLight.position.set(.5, .5, 1)
directionalLight.rotation.z += 1;
directionalLight.castShadow = true;

camera.position.set(0, 2, 6)


function animate() {
    requestAnimationFrame(animate);

    renderer.render(scene, camera);
}
animate(performance.now())

window.addEventListener('keydown', function (event) {
    console.log(event.key)
    if (event.key == "ArrowRight") {

    } else if(event.key == "f") {

    }
});

let isDragging = false;
let previousMousePosition = {
    x: 0,
    y: 0
};

window.addEventListener("mousemove", (event) => {
    if (isDragging) {
        const { x, y } = event;

        const deltaMove = {
            x: x - previousMousePosition.x,
            y: y - previousMousePosition.y
        };

        const deltaRotationQuaternion = new THREE.Quaternion()
            .setFromEuler(
                new THREE.Euler(
                    toRadians(deltaMove.y * 1 / 3),
                    toRadians(deltaMove.x * 1 / 3),
                    0,
                    "XYZ"
                )
            );

        cube.quaternion.multiplyQuaternions(
            deltaRotationQuaternion,
            cube.quaternion
        );

        previousMousePosition = {
            x,
            y
        };
    }
});

var row = 0;
var column = 0;

window.addEventListener("keydown", (e) => {
    if(e.key == "ArrowUp") {
        column += 1;
    } else if(e.key == "ArrowLeft") {
        row -= 1;
    } else if(e.key == "ArrowDown") {
        column -= 1;
    } else if(e.key == "ArrowRight") {
        column += 1;
    } else {
        return;
    }
})

function updateText() {
    
}