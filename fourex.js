var camera, scene, renderer;
var material, material2, material3, geometry1, geometry2, geometry3, geometry4, geometry5, mesh1, mesh2, mesh3, mesh4, shipMesh, mesh5;

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
  let fogColor = 0x99eeee //new THREE.Color(0x99eeee)//
  let baseColor = 0xeeeeee
  let shipColor = 0x666666


  camera = new THREE.PerspectiveCamera(fov, screenWidth / screenHeight, 0.01, 1000);
  camera.position.z = 3;

  scene = new THREE.Scene();


  // Meshes

  material = new THREE.MeshPhongMaterial({
    color: baseColor,
    flatShading: true,
    vertexColors: THREE.VertexColors
  });
  
  material2 = new THREE.MeshPhongMaterial({
    color: shipColor,
    flatShading: true,
    vertexColors: THREE.VertexColors
  });

  material3 = new THREE.MeshPhongMaterial({
    color: shipColor,
    flatShading: false,
    wireframe: true,
    emissive: shipColor,
  });


  geometry1 = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  geometry2 = new THREE.BoxGeometry( 0.1, 2, 2 );
  geometry3 = new THREE.BoxGeometry( 2, 0.1, 2 );
  geometry4 = new THREE.ConeGeometry( 0.5, 1.5, 5 );
  geometry5 = new THREE.ConeGeometry( 0.125, 0.375, 5 );

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

  geometry4.rotateX( -Math.PI/2.5 );
  geometry4.rotateZ( Math.PI );
  shipMesh = new THREE.Mesh( geometry4, material2 );
  shipMesh.position.set(0,-0.72,1)
  shipMesh.castShadow = true;
  shipMesh.receiveShadow = true;
  scene.add( shipMesh );


  geometry5.rotateX( -Math.PI/2.5 );
  geometry5.rotateZ( Math.PI );
  mesh5 = new THREE.Mesh( geometry5, material3 );
  mesh5.position.set(0,0,0)
  //mesh5.castShadow = true;
  mesh5.receiveShadow = true;
  shipMesh.add( mesh5 );


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

  let maxMove = 2 * delta; // 2 pixels per sec
  let maxRot = Math.PI / 3 * delta; // pi/3 radians (90 degrees) per second

  let rotation_matrix = new THREE.Matrix4().identity();




  // Local Transformations

  // Power Forward/Back
  if ( keyboard.pressed("W") )
    shipMesh.translateZ( -maxMove );
  if ( keyboard.pressed("S") )
    shipMesh.translateZ(  maxMove );

  // Slide Left/Right
  if ( keyboard.pressed("A") )
    shipMesh.translateX( -maxMove );
  if ( keyboard.pressed("D") )
    shipMesh.translateX(  maxMove );	

  // Slide Up/Down
  if ( keyboard.pressed("R") )
    shipMesh.translateY(  maxMove );	
  if ( keyboard.pressed("F") )
    shipMesh.translateY( -maxMove );

  // Pitch
  if ( keyboard.pressed("down") )
    shipMesh.rotateOnAxis( new THREE.Vector3(1,0,0), maxRot);
  if ( keyboard.pressed("up") )
    shipMesh.rotateOnAxis( new THREE.Vector3(1,0,0), -maxRot);

  // Roll
  if ( keyboard.pressed("Q") )
    shipMesh.rotateOnAxis( new THREE.Vector3(0,0,1), maxRot);
  if ( keyboard.pressed("E") )
    shipMesh.rotateOnAxis( new THREE.Vector3(0,0,1), -maxRot);

  // Yaw
  if ( keyboard.pressed("left") )
    shipMesh.rotateOnAxis( new THREE.Vector3(0,1,0), maxRot);
  if ( keyboard.pressed("right") )
    shipMesh.rotateOnAxis( new THREE.Vector3(0,1,0), -maxRot);

  // Reset Ship
  if ( keyboard.pressed("space") ) {
    shipMesh.position.set(0,-0.72,1);
    shipMesh.rotation.set(0,0,0);
  }




  // Chase Cam
  var relativeCameraOffset = new THREE.Vector3(0,0,0.1); // set inside the cone for now

  var cameraOffset = relativeCameraOffset.applyMatrix4( shipMesh.matrixWorld );
  camera.position.set(cameraOffset.x, cameraOffset.y, cameraOffset.z)

  camera.rotation.set(shipMesh.rotation.x,shipMesh.rotation.y, shipMesh.rotation.z)

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
