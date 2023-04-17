import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'

var selectedObject;
const objectHoverRaycaster = new THREE.Raycaster();
const objectSelectRaycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
var stats = new Stats();
document.body.appendChild(stats.dom)

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const canvas = renderer.domElement;
document.body.appendChild(canvas);
canvas.setAttribute("draggable", "false")

let composer = new EffectComposer(renderer);

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

const xMaterial = new THREE.LineBasicMaterial({ color: 0xf63652 });
const xPoints = [];
xPoints.push(new THREE.Vector3( -1000, 0, 0));
xPoints.push(new THREE.Vector3(  1000, 0, 0));

const xGeometry = new THREE.BufferGeometry().setFromPoints(xPoints);
const xLine = new THREE.Line(xGeometry, xMaterial);
scene.add(xLine)

const yMaterial = new THREE.LineBasicMaterial({ color: 0x2f84e3 });
const yPoints = [];
yPoints.push(new THREE.Vector3(0, -1000, 0));
yPoints.push(new THREE.Vector3(0,  1000, 0));

const yGeometry = new THREE.BufferGeometry().setFromPoints(yPoints);
const yLine = new THREE.Line(yGeometry, yMaterial);
scene.add(yLine)

const zMaterial = new THREE.LineBasicMaterial({ color: 0x70a41c });
const zPoints = [];
zPoints.push(new THREE.Vector3(0, 0, -1000));
zPoints.push(new THREE.Vector3(0, 0,  1000));

const zGeometry = new THREE.BufferGeometry().setFromPoints(zPoints);
const zLine = new THREE.Line(zGeometry, zMaterial);
scene.add(zLine)

let geometry = new THREE.BoxGeometry(1, 1, 1);
let material = new THREE.MeshPhongMaterial({ color: 0xffffff, wireframe: false })
let cube = new THREE.Mesh(geometry, material)
scene.add(cube)

camera.position.set(6, 3, 6)
camera.lookAt(cube.position)

const directionalLight = new THREE.DirectionalLight("#ffffff", 0.5);
scene.add(directionalLight);
directionalLight.position.set(.5, .5, 1)
directionalLight.rotation.z += 1;
directionalLight.castShadow = true;

const ambientLight = new THREE.AmbientLight("#f1f1f1", .1);
scene.add(ambientLight)

const xAxis = new THREE.Vector3(1, 0, 0);

function animate() {
    requestAnimationFrame(animate);

    stats.begin();

    if (isMoving) {
        // dampen the rotationSpeed over time
        rotationSpeed.x *= .75;
        rotationSpeed.y *= .75;

        camera.rotateOnAxis(xAxis, rotationSpeed.x); // rotate the camera around its local X-axis
        camera.rotateY(rotationSpeed.y);

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
    composer.render();
    stats.end();
}
animate();

canvas.addEventListener("mousedown", (event) => { 
    objectSelectRaycaster.setFromCamera(mouse, camera);
    const intersects = objectSelectRaycaster.intersectObject(scene, true)

    if(intersects.length > 0) {
        selectedObject = intersects[0].object;
        selectedObjectPass.hoveredObjects = selectedObject;
        addhoveredObjects([])
        setGuiInfo();
    } else {
        selectedObjectPass.hoveredObjects = null;
    }

    if (event.button == 0) {
        isMoving = true;
        lastMousePosition = {x: event.clientX, y: event.clientY};
        document.body.classList.add("ch");
    }
})

canvas.addEventListener("mouseup", (event) => {
    if (event.button == 0) {
        isMoving = false;
        document.body.classList.remove("ch")
    }
})

let lastMousePosition = { x: 0, y: 0 };
let rotationSpeed = { x: 0, y: 0 };

const mouse = new THREE.Vector2();
// add a mousemove event listener to the window

canvas.addEventListener("mousemove", (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    checkIntersections();
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
            camera.position.set(6, 3, 6)
            camera.lookAt(selectedObject.position)
        } else if(event.key == "p") {
            selectedObject.material.wireframe = !selectedObject.material.wireframe
        } else if(event.key == "n") {
            let bg = new THREE.BoxGeometry(1, 1, 1);
            let mt = new THREE.MeshPhongMaterial({ color: 0xffffff });
            let elem = new THREE.Mesh(bg, mt);
            scene.add(elem);
        }
    }
})
 
window.addEventListener("keyup", (event) => {
    if (movementKeysActive.hasOwnProperty(event.key.toLowerCase())) {
        movementKeysActive[event.key.toLowerCase()] = false;
        console.log(`${event.key}: ` + movementKeysActive[event.key.toLowerCase()])
    }
})

const xSizeInput = document.body.querySelector("input[x][size]");
const ySizeInput = document.body.querySelector("input[y][size]")
const zSizeInput = document.body.querySelector("input[z][size]")

xSizeInput.addEventListener("input", (e) => {
    let newX = parseFloat(e.target.value);
    newX = Math.max(Math.abs(newX), .001)
    if(!isNaN(newX)) {
        selectedObject.scale.x = newX
    }
})

ySizeInput.addEventListener("input", (e) => {
    let newY = parseFloat(e.target.value);
    if (!isNaN(newY)) {
        newY = Math.max(Math.abs(newY), .001)
        selectedObject.scale.y = newY
    }
})

zSizeInput.addEventListener("input", (e) => {
    let newZ = parseFloat(e.target.value);
    if (!isNaN(newZ)) {
        newZ = Math.max(Math.abs(newZ), .001)
        selectedObject.scale.z = newZ
    }
})

const xPosInput = document.body.querySelector("input[x][position]");
const yPosInput = document.body.querySelector("input[y][position]")
const zPosInput = document.body.querySelector("input[z][position]")

xPosInput.addEventListener("input", (e) => {
    let newX = parseFloat(e.target.value);
    if (!isNaN(newX)) {
        selectedObject.position.x = newX
    }
})

yPosInput.addEventListener("input", (e) => {
    let newY = parseFloat(e.target.value);
    if (!isNaN(newY)) {
        selectedObject.position.y = newY
    }
})

zPosInput.addEventListener("input", (e) => {
    let newZ = parseFloat(e.target.value);
    if (!isNaN(newZ)) {
        selectedObject.position.z = newZ
    } 
})

var colorPicker = document.getElementById('color-picker');
var colorPreview = document.getElementById('color-preview');
// Add an event listener to the color picker input element to update the color preview
colorPicker.addEventListener('input', (event) => {
    var color = new THREE.Color(colorPicker.value);
    selectedObject.material.color = color;
    colorPreview.style.backgroundColor = colorPicker.value;
});

const materials = {
    basic: new THREE.MeshBasicMaterial({ color: new THREE.Color("#ffffff") }),
    phong: new THREE.MeshPhongMaterial({ color: new THREE.Color("#ffffff") }),
    toon: new THREE.MeshToonMaterial({ color: new THREE.Color("#ffffff") }),
    normal: new THREE.MeshNormalMaterial(),
    lambert: new THREE.MeshLambertMaterial({ color: new THREE.Color("#ffffff" )}),
    depth: new THREE.MeshDepthMaterial()
}

const materialSelect = document.getElementById("mat-type");

materialSelect.addEventListener("change", (e) => {
    colorPicker.value = "#ffffff"
    const selectedMaterial = materials[e.target.value];
    selectedObject.material = selectedMaterial;
})

const objectInfoWindow = document.querySelector("[object-info]");
const materialInfoWindow = document.querySelector("[material-info]")

const uiContorlButtons = {
    o: objectInfoWindow,
    m: materialInfoWindow
} 

window.addEventListener("keydown", (e) => {
    if(uiContorlButtons.hasOwnProperty(e.key.toLocaleLowerCase())) {
        const elem = uiContorlButtons[e.key.toLocaleLowerCase()]
        if(elem.classList.contains("hide")) {
            elem.classList.remove("hide")
        } else {
            elem.classList.add("hide")
        }
    }
})

//const pattern = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/tri_pattern.jpg"
let hoveredObjects = [];

function checkIntersections() {
    objectHoverRaycaster.setFromCamera(mouse, camera);
    const intersects = objectHoverRaycaster.intersectObject(scene, true);
    if(intersects.length > 0) {
        const selected = intersects[0].object;
        if(selectedObject == selected) {
            return;
        }
        addhoveredObjects(selected)
        objectHoverPass.selectedObjects = hoveredObjects; 
    }
}

function addhoveredObjects(object) {
    hoveredObjects = [];
    hoveredObjects.push(object);
} 

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

let objectHoverPass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera);
objectHoverPass.edgeStrength = 2;
objectHoverPass.edgeGlow = 2;
objectHoverPass.edgeThickness = 2;
objectHoverPass.pulsePeriod = 2;
objectHoverPass.visibleEdgeColor.set("#ffffff")
objectHoverPass.hiddenEdgeColor.set("#f3f3f3")
composer.addPass(objectHoverPass);

let selectedObjectPass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera)
selectedObjectPass.edgeStrength = 1;
selectedObjectPass.edgeGlow = 3;
selectedObjectPass.edgeThickness = 2;
selectedObjectPass.pulsePeriod = 0;
selectedObjectPass.visibleEdgeColor.set("#ffffff")
selectedObjectPass.hiddenEdgeColor.set("#f3f3f3")
composer.addPass(selectedObjectPass)

let effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
composer.addPass(effectFXAA);

selectedObject = cube;

function setGuiInfo() {
    xPosInput.value = selectedObject.position.x;
    yPosInput.value = selectedObject.position.y;
    zPosInput.value = selectedObject.position.z;

    xSizeInput.value = selectedObject.scale.x;
    ySizeInput.value = selectedObject.scale.y;
    zSizeInput.value = selectedObject.scale.z;

    colorPicker.value = selectedObject.material.color;
}