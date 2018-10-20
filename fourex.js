var camera, scene, renderer;
var material, geometry1, geometry2, geometry3, geometry4, mesh1, mesh2, mesh3, mesh4, shipMesh;

var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

init();
animate();

function init() {

  let fov = 60
  let pixMult = 2
  let screenWidth = window.innerWidth / pixMult
  let screenHeight = window.innerHeight / pixMult
  let shadowRes = 2048

  let sunColor = 0xfff3ea
  let skyColor = 0x180918
  let fogColor = 0x99eeee //new THREE.Color(0x99eeee)


  camera = new THREE.PerspectiveCamera(fov, screenWidth / screenHeight, 0.01, 1000);
  camera.position.z = 3;

  scene = new THREE.Scene();


  // Meshes

  material = new THREE.MeshPhongMaterial({
    color: 0xeeeeee,
    flatShading: true,
    vertexColors: THREE.VertexColors
  });

  geometry1 = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  geometry2 = new THREE.BoxGeometry( 0.1, 2, 2 );
  geometry3 = new THREE.BoxGeometry( 2, 0.1, 2 );
  geometry4 = new THREE.ConeGeometry( 0.5, 1.5, 3 );

  mesh1 = new THREE.Mesh( geometry1, material );
  mesh1.castShadow = true;
  mesh1.receiveShadow = true;
  scene.add( mesh1 );

  mesh2 = new THREE.Mesh( geometry2, material );
  mesh2.position.set(-1,0,0)
  mesh2.castShadow = true;
  mesh2.receiveShadow = true;
  scene.add( mesh2 );

  mesh3 = new THREE.Mesh( geometry3, material );
  mesh3.position.set(0,-1,0)
  mesh3.castShadow = true;
  mesh3.receiveShadow = true;
  scene.add( mesh3 );

  mesh4 = new THREE.Mesh( geometry2, material );
  mesh4.position.set(1,0,0)
  mesh4.castShadow = true;
  mesh4.receiveShadow = true;
  scene.add( mesh4 );

  geometry4.rotateX( -1.6 );
  shipMesh = new THREE.Mesh( geometry4, material );
  shipMesh.position.set(0,-0.72,0)
  shipMesh.castShadow = true;
  shipMesh.receiveShadow = true;
  scene.add( shipMesh );




  // Lights

  let ambientLight = new THREE.AmbientLight(skyColor)
  scene.add(ambientLight);

  let dirLight = new THREE.DirectionalLight(sunColor, 2);
  dirLight.position.set(1, 2, 0.5);
  dirLight.shadow.mapSize.width = shadowRes;
  dirLight.shadow.mapSize.height = shadowRes;
  dirLight.castShadow = true;
  scene.add(dirLight);




  // Fog

  scene.fog = new THREE.Fog(fogColor, 2, 9);
  //scene.fog = new THREE.FogExp2(skyColor, 0.2);
  //scene.background = fogColor;




  // Renderer

  renderer = new THREE.WebGLRenderer( { antialias: false } );
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize( screenWidth, screenHeight, false );
  //renderer.setClearColor(skyColor);
  renderer.shadowMap.enabled = true;
  renderer.shadowCameraNear = camera.near;
  renderer.shadowCameraFar = camera.far;
  renderer.shadowMap.type = THREE.BasicShadowMap; //THREE.PCFSoftShadowMap

  document.body.appendChild( renderer.domElement );

}


function update() {
  
  let delta = clock.getDelta(); // uptime in sec

  mesh1.rotation.x += 0.5 * delta;
  mesh1.rotation.y += 0.9 * delta;

  let moveDistance = 2 * delta; // 2 pixels per sec
  let rotateAngle = Math.PI / 2 * delta; // pi/2 radians (90 degrees) per second

  let rotation_matrix = new THREE.Matrix4().identity();

  // Local Transformations

  // Power Forward/Back
  if ( keyboard.pressed("W") )
    shipMesh.translateZ( -moveDistance );
  if ( keyboard.pressed("S") )
    shipMesh.translateZ(  moveDistance );

  // Slide Left/Right
  if ( keyboard.pressed("Z") )
    shipMesh.translateX( -moveDistance );
  if ( keyboard.pressed("C") )
    shipMesh.translateX(  moveDistance );	

  // Slide Up/Down
  if ( keyboard.pressed("T") )
    shipMesh.translateY(  moveDistance );	
  if ( keyboard.pressed("G") )
    shipMesh.translateY( -moveDistance );

  // Pitch
  if ( keyboard.pressed("F") )
    shipMesh.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
  if ( keyboard.pressed("R") )
    shipMesh.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);

  // Roll
  if ( keyboard.pressed("Q") )
    shipMesh.rotateOnAxis( new THREE.Vector3(0,0,1), rotateAngle);
  if ( keyboard.pressed("E") )
    shipMesh.rotateOnAxis( new THREE.Vector3(0,0,1), -rotateAngle);

  // Yaw
  if ( keyboard.pressed("A") )
    shipMesh.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
  if ( keyboard.pressed("D") )
    shipMesh.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);

  // reset
  if ( keyboard.pressed("space") ) {
    shipMesh.position.set(0,-0.72,0);
    shipMesh.rotation.set(0,0,0);
  }

}

function render() {
    renderer.render(scene, camera);
}

function animate() {
  requestAnimationFrame(animate);
  render();
  update();
}

animate();
