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

function addPokemon() {
    var loader = new GLTFLoader();

    loader.load(
        // resource URL
        // modelo extraído de https://github.com/SerafimC/CG-2019.2N-T1 by SerafimC
        "./totodile/scene.gltf",
    
        // onLoad callback
        // Here the loaded data is assumed to be an object
        function ( obj ) {
            // Add the loaded object to the scene
            pokemon = obj.scene;
            // cabeça
            pokemon['head'] = pokemon.getObjectByName('Head_027');
            // mandibula
            pokemon['jaw'] = pokemon.getObjectByName('Jaw_029');
            // pescoco
            pokemon['neck'] = pokemon.getObjectByName('Neck_026');
            // coluna
            pokemon['spine'] = pokemon.getObjectByName('Spine_021');
            // quadris
            pokemon['hips'] = pokemon.getObjectByName('Hips_04');
            // pes
            pokemon['lfoot'] = pokemon.getObjectByName('LFoot_08');
            pokemon['rfoot'] = pokemon.getObjectByName('RFoot_014');
            // pernas
            pokemon['lthig'] = pokemon.getObjectByName('LThigh_06');
            pokemon['rthig'] = pokemon.getObjectByName('RThigh_012');
            // cauda
            pokemon['tail'] = pokemon.getObjectByName('Tail1_018');
            // braco
            pokemon['larm'] = pokemon.getObjectByName('LArm_023');
            pokemon['rarm'] = pokemon.getObjectByName('RArm_032');
            // antebraco
            pokemon['lforearm'] = pokemon.getObjectByName('LForeArm_024');
            pokemon['rforearm'] = pokemon.getObjectByName('LForeArm_024');
            // mao
            pokemon['lhand'] = pokemon.getObjectByName('LHand_00');
            pokemon['rhand'] = pokemon.getObjectByName('RHand_034');
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
