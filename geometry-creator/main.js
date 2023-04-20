import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'; 
import { TransformControls } from 'three/addons/controls/TransformControls.js';

var isCopyingMaterialColor;
var isCopyingMaterial;
var selectedObject;
const objectSelectRaycaster = new THREE.Raycaster();
const scene = new THREE.Scene();
var stats = new Stats();
document.body.appendChild(stats.dom)

const renderer = new THREE.WebGL1Renderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2500);
scene.add(camera);



const canvas = renderer.domElement;
document.body.appendChild(canvas);
canvas.setAttribute("draggable", "false")

//const transformControl = new TransformControls(camera, canvas)
//scene.add(transformControl)

let composer = new EffectComposer(renderer); //FF4514
//const pattern = "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/tri_pattern.jpg"

const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

let selectedObjectPass = new OutlinePass(new THREE.Vector2(window.innerWidth, window.innerHeight), scene, camera)
selectedObjectPass.edgeStrength = 3;
selectedObjectPass.edgeGlow = 1;
selectedObjectPass.edgeThickness = 1;
selectedObjectPass.pulsePeriod = 0;
selectedObjectPass.visibleEdgeColor.set("#ffffff")
selectedObjectPass.hiddenEdgeColor.set("#ff4515")
composer.addPass(selectedObjectPass)
 
let effectFXAA = new ShaderPass(FXAAShader);
effectFXAA.uniforms['resolution'].value.set(1 / window.innerWidth, 1 / window.innerHeight);
composer.addPass(effectFXAA);

var cameraSpeed = 0.05;

var isMoving = false;
var movementKeysActive = {
    w: false,
    s: false,
    a: false,
    d: false,
    q: false,
    e: false
}

function createLine(color, from, to) {
    const material = new THREE.LineBasicMaterial({ color });
    const geometry = new THREE.BufferGeometry().setFromPoints([from, to]); 
    const line = new THREE.Line(geometry, material);
    return line;
}

const xLine = createLine(0xf63652, new THREE.Vector3(-10000, 0, 0), new THREE.Vector3(10000, 0, 0));
const yLine = createLine(0x2f84e3, new THREE.Vector3(0, -10000, 0), new THREE.Vector3(0, 10000, 0));
const zLine = createLine(0x70a41c, new THREE.Vector3(0, 0, -10000), new THREE.Vector3(0, 0, 10000));

const staticElements = [xLine, yLine, zLine]

scene.add(xLine, yLine, zLine);

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
            movement.z -= cameraSpeed;
        }
        if (movementKeysActive['s']) {
            movement.z += cameraSpeed;
        }
        if (movementKeysActive['a']) {
            movement.x -= cameraSpeed;
        }
        if (movementKeysActive['d']) {
            movement.x += cameraSpeed;
        }
        if (movementKeysActive['q']) {
            movement.y -= cameraSpeed;
        }
        if (movementKeysActive['e']) {
            movement.y += cameraSpeed;
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
    if (event.button == 2) {
        isMoving = true;
        lastMousePosition = {x: event.clientX, y: event.clientY};
        document.body.classList.add("ch");
    } else if(event.button == 0) { 
        objectSelectRaycaster.setFromCamera(mouse, camera); 
        const intersects = objectSelectRaycaster.intersectObjects(scene.children, true);
        if (isCopyingMaterialColor) {
            if(intersects.length > 0) {
                const oldColor = intersects[0].object.material.color;
                selectedObject.material.color = oldColor;
            }
            isCopyingMaterialColor = false;
            isCopyingMaterial = false;
        } else if(isCopyingMaterial) {
            if(intersects.length > 0) {
                selectedObject.material.color = intersects[0].object.material.clone(); 
            }
            isCopyingMaterialColor = false;
            isCopyingMaterial = false; 
        }
         else {
            if (intersects.length > 0) {
                intersects.forEach((intersect, i) => {
                    const obj = intersect.object;
                    if (!staticElements.includes(obj)) {
                        selectObject(obj)
                        setGuiInfo();
                        return;
                    }
                });
            }
        }
    }
})

canvas.addEventListener("mouseup", (event) => {
    if (event.button == 2) {
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

canvas.addEventListener("contextmenu", (e) => {
    e.preventDefault();
})

window.addEventListener("keydown", (event) => {
    if(event.key.toLowerCase() == "shift") {
        cameraSpeed = .1;
    }

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
            const element = document.querySelector("div#objectCreateMenu");  

            element.style.left = event.clientX + "px";
            element.style.top = event.clientY + "px";

            if(element.classList.contains("hide")) {
                element.classList.remove("hide")
            } else {
                element.classList.add("hide")
            }
        } else if(event.key == "x") { 
            scene.remove(selectedObject)
        }
    }
})
 
window.addEventListener("keyup", (event) => {
    if(event.key.toLowerCase() == "shift") {
        cameraSpeed = .05;
    }
    if (movementKeysActive.hasOwnProperty(event.key.toLowerCase())) {
        movementKeysActive[event.key.toLowerCase()] = false;
        console.log(`${event.key}: ` + movementKeysActive[event.key.toLowerCase()])
    }
})

function addSizeChangeListener(inputElem, axis) {
    inputElem.addEventListener("input", (e) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) {
            selectedObject.scale[axis] = value;
        }
    });
}

const xSizeInput = document.body.querySelector("input[x][size]");
const ySizeInput = document.body.querySelector("input[y][size]");
const zSizeInput = document.body.querySelector("input[z][size]");

addSizeChangeListener(xSizeInput, "x");
addSizeChangeListener(ySizeInput, "y");
addSizeChangeListener(zSizeInput, "z");

function addPositionChangeListener(inputElem, axis) {
    inputElem.addEventListener("input", (e) => {
        let newPos = parseFloat(e.target.value);
        if (!isNaN(newPos)) {
            selectedObject.position[axis] = newPos;
        }
    });
}

const xPosInput = document.body.querySelector("input[x][position]");
const yPosInput = document.body.querySelector("input[y][position]");
const zPosInput = document.body.querySelector("input[z][position]");

addPositionChangeListener(xPosInput, 'x');
addPositionChangeListener(yPosInput, 'y');
addPositionChangeListener(zPosInput, 'z');

function addRotationChangeListener(inputElem, axis) {
    inputElem.addEventListener("input", (e) => {
        let newRot = parseFloat(e.target.value);
        if(!isNaN(newRot)) {
            selectedObject.rotation[axis] = Math.radians(newRot); 
        }
    })
}

const xRotInput = document.body.querySelector("input[x][rotation]");
const yRotInput = document.body.querySelector("input[y][rotation]");
const zRotInput = document.body.querySelector("input[z][rotation]");

addRotationChangeListener(xRotInput, 'x'); 
addRotationChangeListener(yRotInput, 'y'); 
addRotationChangeListener(zRotInput, 'z'); 

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



function setGuiInfo() {
    xPosInput.value = selectedObject.position.x;
    yPosInput.value = selectedObject.position.y;
    zPosInput.value = selectedObject.position.z;

    xSizeInput.value = selectedObject.scale.x;
    ySizeInput.value = selectedObject.scale.y;
    zSizeInput.value = selectedObject.scale.z;

    xRotInput.value = Math.degrees(selectedObject.rotation.x)
    yRotInput.value = Math.degrees(selectedObject.rotation.y)
    zRotInput.value = Math.degrees(selectedObject.rotation.z)

    colorPicker.value = "#" + selectedObject.material.color.getHexString();
}

const createObjectOptions = document.querySelectorAll('#createObjectOption');

createObjectOptions.forEach((option) => {
    option.addEventListener('click', () => {
        document.querySelector("div#objectCreateMenu").classList.add("hide")
        const shapeName = option.getAttribute('shape');

        let newShape;
        switch (shapeName) {
            case 'cube':
                newShape = new THREE.BoxGeometry(1, 1, 1);
                break;
            case 'ico-sphere':
                newShape = new THREE.IcosahedronGeometry(1, 2);
                break;
            default:
                console.log('Invalid shape name');
                return;
        }

        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(newShape, material);
        mesh.position.set(0, 0, 0);
        scene.add(mesh);
    });
});



function selectObject(object) {
    selectedObjectPass.selectedObjects = [];
    selectedObjectPass.selectedObjects = [object];
    selectedObject = object;
    //transformControl.attach(object)
}

const copyMatColButton = document.querySelector("button#color-copy") 
copyMatColButton.addEventListener("click", (e) => {
    isCopyingMaterial = false;
    isCopyingMaterialColor = true;
})

const copyMatButton = document.querySelector("button#material-copy")
copyMatButton.addEventListener("click", (e) => {
    isCopyingMaterialColor = false;
    isCopyingMaterial = true;
})

const opacitySlider = document.querySelector("input[opacity]");
opacitySlider.addEventListener("input", (e) => {
    selectedObject.material.transparent = true;
    const newOpacity = e.target.value / 100; 
    selectedObject.material.opacity = newOpacity;
    console.log(selectedObject.material.opacity)
})

// radians to degrees
Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
}

// degrees to radians.
Math.degrees = function (radians) {
    return radians * 180 / Math.PI;
}