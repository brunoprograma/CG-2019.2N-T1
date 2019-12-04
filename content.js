import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/loaders/GLTFLoader.js';

window.addEventListener('load', init);
document.addEventListener('keydown', onDocumentKeyDown, false);

let scene;
let camera;
let renderer;
let controls;
let pokemon;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer();
    controls = new OrbitControls( camera, renderer.domElement );

    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    camera.position.set(30, 60, 100);

    addPokemon();
    animationLoop();
}

function onDocumentKeyDown(event) {
    var key = event.key;
    if (key == 'w') { // walk and stop
        pokemon.walk = !pokemon.walk;
    } else if (key == 'q') { // up and down arms
        pokemon.liftuparms = pokemon.liftuparms * -1.0;
        pokemon.lifteduparms = 0.0;
    }
};

function rotateObject(object, degreeX=0, degreeY=0, degreeZ=0) {
    object.rotateX(THREE.Math.degToRad(degreeX));
    object.rotateY(THREE.Math.degToRad(degreeY));
    object.rotateZ(THREE.Math.degToRad(degreeZ));
 }

 function dumpObject(obj, lines = [], isLast = true, prefix = '') {
    const localPrefix = isLast ? '└─' : '├─';
    lines.push(`${prefix}${prefix ? localPrefix : ''}${obj.name || '*no-name*'} [${obj.type}]`);
    const newPrefix = prefix + (isLast ? '  ' : '│ ');
    const lastNdx = obj.children.length - 1;
    obj.children.forEach((child, ndx) => {
        const isLast = ndx === lastNdx;
        dumpObject(child, lines, isLast, newPrefix);
    });
    return lines;
}

function addPokemon() {
    var loader = new GLTFLoader();

    loader.load(
        // resource URL
        "./pokemon/scene.gltf",
    
        // onLoad callback
        // Here the loaded data is assumed to be an object
        function ( obj ) {
            // Add the loaded object to the scene
            pokemon = obj.scene;
            console.log(dumpObject(pokemon).join('\n'));
            // pes
            pokemon['lfoot'] = pokemon.getObjectByName('LFoot_08');
            pokemon['rfoot'] = pokemon.getObjectByName('RFoot_014');
            // pernas
            pokemon['lthig'] = pokemon.getObjectByName('LThigh_06');
            pokemon['rthig'] = pokemon.getObjectByName('RThigh_012');
            // braco
            pokemon['larm'] = pokemon.getObjectByName('LArm_023');
            pokemon['rarm'] = pokemon.getObjectByName('RArm_032');
            // actions
            pokemon['walk'] = false;
            pokemon['legdeg'] = 0.0;
            pokemon['leginc'] = 1.0;
            pokemon['liftuparms'] = -76.0;
            pokemon['lifteduparms'] = -76.0;
            scene.add(pokemon);
            pokemon.position.set(0, -30, 0);
        },
    
        // onProgress callback
        function (xhr) {
            console.log( (xhr.loaded / xhr.total * 100) + '% loaded' );
        },
    
        // onError callback
        function (err) {
            console.error( 'An error happened: ' + err );
        }
    );
}

function moveArms() {
    if(pokemon.liftuparms != pokemon.lifteduparms) {
        if(pokemon.liftuparms == -76.0) {
            rotateObject(pokemon.larm, 0, 2, 0);
            rotateObject(pokemon.rarm, 0, 2, 0);
            pokemon.lifteduparms -= 2;
        } else {
            rotateObject(pokemon.larm, 0, -2, 0);
            rotateObject(pokemon.rarm, 0, -2, 0);
            pokemon.lifteduparms += 2;
        }
    }
}

function moveLegs() {
    if(pokemon.walk) {
        if (pokemon.legdeg == -46.0) {
            pokemon.leginc = 4.0;
        } else if (pokemon.legdeg == 46.0) {
            pokemon.leginc = -4.0;
        }
        pokemon.legdeg += pokemon.leginc;
        rotateObject(pokemon.lthig, 0, pokemon.leginc, 0);
        rotateObject(pokemon.lfoot, 0, -pokemon.leginc / 1.5, 0);
        rotateObject(pokemon.rthig, 0, -pokemon.leginc, 0);
        rotateObject(pokemon.rfoot, 0, pokemon.leginc / 1.5, 0);
    }
}

function animationLoop() {
    renderer.render(scene, camera);
    controls.update()

    scene.traverse(function(pokemon) {
        if(pokemon instanceof THREE.Object3D) {
            if(pokemon.larm) {
                moveArms();
            }
            if(pokemon.lthig) {
                moveLegs();
            }
        }
    });

    requestAnimationFrame(animationLoop);
}
