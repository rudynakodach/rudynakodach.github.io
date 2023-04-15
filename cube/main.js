import * as THREE from 'https://unpkg.com/three/build/three.module.js'
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 1000)
scene.add(camera)

let isPlaying = false;

camera.position.z = 3;
camera.position.y = 2;

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);


// create materials and textures for each face
const materials = [
    new THREE.MeshBasicMaterial({ color: 0xff0000 }), // red
    new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // green
    new THREE.MeshBasicMaterial({ color: 0x0000ff }), // blue
    new THREE.MeshBasicMaterial({ color: 0xffff00 }), // yellow
    new THREE.MeshBasicMaterial({ color: 0xff00ff }), // magenta
    new THREE.MeshBasicMaterial({ color: 0x00ffff }) // cyan
];

// create a separate texture for each face
const texts = [
    'Front', 'Back', 'Top', 'Bottom', 'Left', 'Right'
].map((text) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'Bold 40px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    const texture = new THREE.CanvasTexture(canvas);
    texture.needsUpdate = true;
    return texture;
});

// create a cube with each face having its own material and texture
const geometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterials = materials.map((material, i) => {
    const cubeMaterial = material.clone();
    cubeMaterial.map = texts[i];
    return cubeMaterial;
});
const cube = new THREE.Mesh(
    geometry,
    cubeMaterials
);
geometry.groups.forEach((group, i) => {
    group.materialIndex = i;
});

camera.position.z = 5;
camera.position.y = 2.25;
camera.rotation.x -= .45

function animate() {
    requestAnimationFrame(animate);

    if(isPlaying) {
        cube.rotation.x += 0.025;
        cube.rotation.z += 0.0125;
    }

    renderer.render(scene, camera);
}
animate()

const ambient = new Audio("ambient.mp3")
let isIntro = true;

window.addEventListener('keydown', function(e) {
    document.body.appendChild(renderer.domElement)
    if (!isPlaying) {
        isIntro = false;
        ambient.pause();

        const audio = new Audio("freebird.mp3")
        audio.play()

        audio.addEventListener('ended', (e) => {
            audio.currentTime = 0;
            audio.play()
        })

        scene.add(cube);
    }
    isPlaying = true;
})

window.addEventListener("mousemove", function(e) {
    if(isIntro) {
        ambient.play();
        ambient.addEventListener("ended", (e) => {
            if(!isIntroPlaying && !isIntro) {
                ambient.currentTime = 0;
                ambient.play();
            }
        })
    }
}) 