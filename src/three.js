import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import Stats from 'three/examples/jsm/libs/stats.module.js';

export function startBasicScene() {
    // SCENE
    const scene = new THREE.Scene();

    // CAMERA
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set( 0, 400, 700 );
    // INIT CAMERA
    camera.position.z = 45;
    camera.position.x = 3;
    camera.position.y = 20;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, premultipliedAlpha: false });
    renderer.setSize(500, 100);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = false

    // CONTROLS
 

    // RESIZE HAMDLER


    // INIT HEMISPHERE LIGHT
    scene.add(new THREE.AmbientLight(0xfffff, 0.5));

    // SCENE

    // FLOOR

    // POINT LIGHT

    // TEXT

    const loader = new FontLoader();
    loader.load('https://unpkg.com/three@0.77.0/examples/fonts/optimer_bold.typeface.json', function (font) {
        const geometry = new TextGeometry('VB', {
            font: font,
            size: 15,
            height: 5,
            curveSegments: 10,
            bevelEnabled: false,
            bevelOffset: 0,
            bevelSegments: 1,
            bevelSize: 0.3,
            bevelThickness: 1
        });
        const materials = [
            new THREE.MeshPhongMaterial({ color: 0xffffff }), // front
            new THREE.MeshPhongMaterial({ color: 0xffffff }) // side
        ];
        const textMesh1 = new THREE.Mesh(geometry, materials);
        textMesh1.castShadow = true
        textMesh1.position.y += 10
        textMesh1.position.x -= 6
        textMesh1.rotation.y = 0.25
        scene.add(textMesh1)
    });
    //end load function

    // ANIMATE

    document.querySelector('.logo').appendChild(renderer.domElement);
    animate();

}

export function startBasicScene1() {
    THREE.Cache.enabled = true;

    let container, stats

    let camera, cameraTarget, scene, renderer, dirLight, pointLight;

    let group, textMesh1, textGeo, materials;


    let text = 'vb',

        bevelEnabled = true,

        font = undefined,

        fontName = 'helvetiker', // helvetiker, optimer, gentilis, droid sans, droid serif
        fontWeight = 'bold'; // normal bold

        let size
        let height
        let hover
        if(document.documentElement.clientWidth > 600) {
            size = 70
            height = 20
            hover = 40            
        } else {
            size = 25   
            height = 3
            hover = 70
        }
        const curveSegments = 4,

        bevelThickness = 2,
        bevelSize = 1.5;

    // https://unpkg.com/three@0.77.0/examples/fonts/optimer_bold.typeface.json



    let targetRotation = 0;
    let targetRotationOnPointerDown = 0;

    let pointerX = 0;
    let pointerXOnPointerDown = 0;

    let windowHalfX = window.innerWidth / 2;


    init();
    animate();


    function init() {

        container = document.createElement( 'div' );
        container.setAttribute('id', 'model3dtext')
        document.querySelector('.logo').appendChild( container );

        // CAMERA

        
        if(document.documentElement.clientWidth > 600) {
            camera = new THREE.PerspectiveCamera( 10, window.innerWidth / window.innerHeight, 1, 1500 );
        } else {
            camera = new THREE.PerspectiveCamera( 8, window.innerWidth / window.innerHeight, 1, 1500 );
        }    
        camera.position.set( 0, 150, 800 );

        cameraTarget = new THREE.Vector3( 0, 150, 0 );

        // SCENE

        scene = new THREE.Scene();

        // LIGHTS

        dirLight = new THREE.DirectionalLight( 0xEEEEEE, 0.25 );
        dirLight.position.set( 0, 0, 1 ).normalize();
        scene.add( dirLight );
        const dirLight1 = new THREE.DirectionalLight( 0xEEEEEE, 0.25 );
        dirLight1.position.set( 0, 1, 0 ).normalize();
        scene.add( dirLight1 );
        pointLight = new THREE.PointLight( 0xEEEEEE, 1 );
        pointLight.position.set( 0, 100, 90 );
        scene.add( pointLight );

        const pointLight1 = new THREE.PointLight( 0xEEEEEE, 1 );
        pointLight1.position.set( 0, -100, -90 );
        scene.add( pointLight1 );

        const pointLight2 = new THREE.PointLight( 0xEEEEEE, 1 );
        pointLight2.position.set( 0, 50, 70 );
        scene.add( pointLight2 );
        // Get text from hash



        materials = [
            new THREE.MeshPhongMaterial( { color: 0xEEEEEE } ), // front
            new THREE.MeshPhongMaterial( { color: 0xEEEEEE } ) // side
        ];

        group = new THREE.Group();
        group.position.y = 100;

        scene.add( group );

        loadFont();



        // RENDERER

        renderer = new THREE.WebGLRenderer( { alpha: true } );
        renderer.setClearAlpha( 0x000000, 0 );
        renderer.setPixelRatio( window.devicePixelRatio );
        if(document.documentElement.clientWidth > 600) {
            renderer.setSize(500, 100)
        } else {
            renderer.setSize( 120, 100 );
        }        
        container.appendChild( renderer.domElement );

        // STATS

        stats = new Stats();
        //container.appendChild( stats.dom );

        // EVENTS

        container.style.touchAction = 'none';
        container.addEventListener( 'pointerdown', onPointerDown );





        //

        //* window.addEventListener( 'resize', onWindowResize );

    }


    //




    function loadFont() {

        const loader = new FontLoader();
        loader.load( 'https://unpkg.com/three@0.77.0/examples/fonts/' + fontName + '_' + fontWeight + '.typeface.json', function ( response ) {

            font = response;

            refreshText();

        } );

    }

    function createText() {

        textGeo = new TextGeometry( 'VB', {

            font: font,

            size: size,
            height: height,
            curveSegments: curveSegments,

            bevelThickness: bevelThickness,
            bevelSize: bevelSize,
            bevelEnabled: bevelEnabled

        } );

        textGeo.computeBoundingBox();

        const centerOffset = -0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );

        textMesh1 = new THREE.Mesh( textGeo, materials );

        textMesh1.position.x = centerOffset;
        textMesh1.position.y = hover;
        textMesh1.position.z = 0;

        textMesh1.rotation.x = 0;
        textMesh1.rotation.y = Math.PI * 2;

        group.add( textMesh1 );

    }

    function refreshText() {



        if ( ! text ) return;

        createText();

    }

    function onPointerDown( event ) {

        if ( event.isPrimary === false ) return;

        pointerXOnPointerDown = event.clientX - windowHalfX;
        targetRotationOnPointerDown = targetRotation;

        document.addEventListener( 'pointermove', onPointerMove );
        document.addEventListener( 'pointerup', onPointerUp );

    }

    function onPointerMove( event ) {

        if ( event.isPrimary === false ) return;

        pointerX = event.clientX - windowHalfX;

        targetRotation = targetRotationOnPointerDown + ( pointerX - pointerXOnPointerDown ) * 0.02;

    }

    function onPointerUp() {

        if ( event.isPrimary === false ) return;

        document.removeEventListener( 'pointermove', onPointerMove );
        document.removeEventListener( 'pointerup', onPointerUp );

    }

    //

    function animate() {

        requestAnimationFrame( animate );
        const time = - performance.now() * 0.0005;

        camera.position.x = 800 * Math.cos( time );
        camera.position.z = 800 * Math.sin( time );
        camera.lookAt( scene.position );
        render();
        stats.update();

    }

    function render() {

        group.rotation.y += ( targetRotation - group.rotation.y ) * 0.05;

        camera.lookAt( cameraTarget );

        renderer.clear();
        renderer.render( scene, camera );

    }
}