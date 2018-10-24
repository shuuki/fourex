
var camera, scene, renderer;
var material, materialMetal, materialGlass,
  geometry1, geometry2, geometry3, geometry4, geometry5, shipGeometry, shipGeometryWindow,
  mesh1, mesh2, mesh3, mesh4, mesh6, mesh7, shipMesh, shipMeshWindow, thrustModel;

var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

// instantiate a loader
var loader = new THREE.OBJLoader();



init();
animate();




function init() {

  let fov = 60
  let pixMult = 2
  let shadowRes = 2048


  // Palette 
  
  let sunColor = 0xffefda
  let skyColor = 0x181809
  let fogColor = 0x99eeee //new THREE.Color(0x99eeee)//

  let baseColor = 0xeddace
  let shipColor = 0x696366
  let nightColor = 0x187882
  let flashColor = 0xb9b022

  let screenWidth = window.innerWidth / pixMult
  let screenHeight = window.innerHeight / pixMult

  camera = new THREE.PerspectiveCamera(fov, screenWidth / screenHeight, 0.01, 150000);
  camera.position.z = 3;




  // Scene

  scene = new THREE.Scene();




  // Materials

  material = new THREE.MeshPhongMaterial({
    color: baseColor,
    flatShading: true,
    vertexColors: THREE.VertexColors
  });
  
  material2 = new THREE.MeshPhongMaterial({
    color: flashColor,
    flatShading: true,
    vertexColors: THREE.VertexColors,
    emissive: nightColor
  });
  
  materialMetal = new THREE.MeshPhongMaterial({
    color: shipColor,
    flatShading: true
  });

  materialGlass = new THREE.MeshPhongMaterial({
    color: shipColor,
    flatShading: false,
    wireframe: true,
    emissive: shipColor
  });




  // Geometries

  geometry1 = new THREE.IcosahedronGeometry(0.2);
  geometry2 = new THREE.BoxGeometry(0.1, 3, 1);
  geometry3 = new THREE.BoxGeometry(2, 0.1, 2);
  geometry4 = new THREE.ConeGeometry(12, 4, 20);
  geometry5 = new THREE.SphereGeometry(12, 40, 20);
  shipGeometry = new THREE.ConeGeometry(0.5, 1.5, 5);
  shipGeometryWindow = new THREE.ConeGeometry(0.125, 0.375, 5);
  thrustGeometry = new THREE.ConeGeometry(0.05, 0.1, 5);




  // Meshes

  mesh1 = new THREE.Mesh(geometry1, material2);
  mesh1.castShadow = true;
  mesh1.receiveShadow = true;
  scene.add(mesh1);

  mesh2 = new THREE.Mesh(geometry2, material);
  mesh2.position.set(-1,0,0)
  mesh2.castShadow = true;
  mesh2.receiveShadow = true;
  scene.add(mesh2);

  mesh3 = new THREE.Mesh(geometry3, material);
  mesh3.position.set(0,-1,0)
  mesh3.castShadow = true;
  mesh3.receiveShadow = true;
  //scene.add(mesh3);

  mesh4 = new THREE.Mesh(geometry2, material);
  mesh4.position.set(1,0,0)
  mesh4.castShadow = true;
  mesh4.receiveShadow = true;
  scene.add(mesh4);

  mesh6 = new THREE.Mesh(geometry4, material);
  mesh6.position.set(0,-3,0)
  mesh6.rotation.set(0,0,Math.PI)
  mesh6.castShadow = true;
  mesh6.receiveShadow = true;
  //scene.add(mesh6);
  
  mesh7 = new THREE.Mesh(geometry5, materialGlass);
  mesh7.position.set(0,-3.7,0)
  mesh7.castShadow = true;
  mesh7.receiveShadow = true;
  scene.add(mesh7);

  // Ship Models

  shipGeometry.rotateX(-Math.PI/2.5);
  shipGeometry.rotateZ(Math.PI);
  shipMesh = new THREE.Mesh(shipGeometry, materialMetal);
  shipMesh.position.set(0,-0.71,1)
  shipMesh.castShadow = true;
  shipMesh.receiveShadow = true;
  scene.add(shipMesh);

  shipGeometryWindow.rotateX(-Math.PI/2.5);
  shipGeometryWindow.rotateZ(Math.PI);
  shipMeshWindow = new THREE.Mesh(shipGeometryWindow, materialGlass);
  shipMeshWindow.position.set(0,0,0)
  //shipMeshWindow.castShadow = true;
  shipMeshWindow.receiveShadow = true;
  shipMesh.add(shipMeshWindow);

  thrustModel = new THREE.Group();




  // Planets
  
  planetBuilder(14298.4,3, 0,0,67103,0xc3b39c); // jupiter
  planetBuilder(366.0,3, 0,0,24933,0xf9e972); // io
  planetBuilder(3122,3, 0,-3122.9,0,0x825032); // europa
  planetBuilder(526.2,3, 0,0,-39938,0x887765); // ganymede
  planetBuilder(482.0,3, 0,0,-121168,0x605340); // callisto
  



  // load a resource
  loader.load(
  	// resource URL
  	'models/1918.obj',
  	// called when resource is loaded
  	function (object) {
  		scene.add(object);
  	},
  	// called when loading is in progresses
  	function (xhr) {
  		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
  	},
  	// called when loading has errors
  	function (errore) {
  		console.log( 'An error happened' );
  	}
  );






  // Lights

  let ambientLight = new THREE.AmbientLight(skyColor)
  scene.add(ambientLight);

  let sunLight = new THREE.DirectionalLight(sunColor, 2);
  sunLight.position.set(2.5, 6, 1);
  sunLight.shadow.mapSize.width = shadowRes;
  sunLight.shadow.mapSize.height = shadowRes;
  sunLight.castShadow = true;
  scene.add(sunLight);




  // Fog

  //scene.fog = new THREE.Fog(fogColor, 2, 9);
  //scene.fog = new THREE.FogExp2(fogColor, 0.1);
  //scene.background = skyColor;




  // Renderer

  renderer = new THREE.WebGLRenderer({ antialias: false });
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(screenWidth, screenHeight, false);
  renderer.setClearColor(skyColor);
  renderer.shadowMap.enabled = true;
  renderer.shadowCameraNear = camera.near;
  renderer.shadowCameraFar = camera.far;
  renderer.shadowMap.type = THREE.BasicShadowMap; // THREE.PCFSoftShadowMap //
  document.body.appendChild(renderer.domElement);

}




function update() {

  let delta = clock.getDelta(); // uptime in sec

  mesh1.rotation.x += 0.5 * delta;
  mesh1.rotation.y += 0.9 * delta;


  let thrustMove = 2 * delta; // 2 pixels per sec
  let thrustRot = Math.PI / 3 * delta; // pi/3 radians (90 degrees) per second
  let thrustBig = 25 * delta; // for the big engine


  // Local Transformations

  // Power Forward/Back
  if (keyboard.pressed("W")) {
    thrustModel.translateZ(-thrustMove);
  }
  if (keyboard.pressed("S")) {
    thrustModel.translateZ(thrustMove);
  }

  // Big Engine
  if (keyboard.pressed("2")) {
    thrustModel.translateZ(-thrustBig);
  }

  // Slide Left/Right
  if (keyboard.pressed("A")) {
    thrustModel.translateX(-thrustMove);
  }
  if (keyboard.pressed("D")) {
    thrustModel.translateX(thrustMove);
  }

  // Slide Up/Down
  if (keyboard.pressed("R")) {
    thrustModel.translateY(thrustMove);
  }
  if (keyboard.pressed("F")) {
    thrustModel.translateY(-thrustMove);
  }

  // Pitch
  if (keyboard.pressed("up")) {
    thrustModel.rotateOnAxis(new THREE.Vector3(1,0,0), -thrustRot)
  }
  if (keyboard.pressed("down")) {
    thrustModel.rotateOnAxis(new THREE.Vector3(1,0,0), thrustRot)
  }

  // Roll
  if (keyboard.pressed("Q")) {
    thrustModel.rotateOnAxis(new THREE.Vector3(0,0,1), thrustRot)
  }
  if (keyboard.pressed("E")) {
    thrustModel.rotateOnAxis(new THREE.Vector3(0,0,1), -thrustRot)
  }

  // Yaw
  if (keyboard.pressed("left")) {
    thrustModel.rotateOnAxis(new THREE.Vector3(0,1,0), thrustRot)
  }
  if (keyboard.pressed("right")) {
    thrustModel.rotateOnAxis(new THREE.Vector3(0,1,0), -thrustRot)
  }

  // Reset Ship
  if (keyboard.pressed("space")) {
    thrustModel.position.set(0,-0.71,1);
    thrustModel.rotation.set(0,0,0);
  }




  // Inertia Calculations

  // Translation

  let tempMomentum = shipMesh.position.lerp(thrustModel.position, 0.005)
  let tempInertia = thrustModel.position.lerp(shipMesh.position, 0.005)

  // Rotation

  let tempA = new THREE.Quaternion().setFromEuler(thrustModel.rotation)
  let tempB = new THREE.Quaternion().setFromEuler(shipMesh.rotation)
  let tempRotShip = tempB.slerp(tempA, 0.01)
  let tempRotThrust = tempA.slerp(tempB, 0.0005)

  // Updates

  shipMesh.position.set(tempMomentum.x, tempMomentum.y, tempMomentum.z)
  shipMesh.rotation.setFromQuaternion(tempRotShip)

  thrustModel.position.set(tempInertia.x, tempInertia.y, tempInertia.z)  
  thrustModel.rotation.setFromQuaternion(tempRotThrust)

  // old direct controllers
  //shipMesh.position.set(thrustModel.position.x, thrustModel.position.y, thrustModel.position.z)
  //shipMesh.rotation.set(thrustModel.rotation.x, thrustModel.rotation.y, thrustModel.rotation.z)


  let ranger = shipMesh.position.distanceTo(mesh1.position)
  let speeder = shipMesh.position.distanceTo(thrustModel.position)
  document.getElementById("rangeometer").innerHTML = "Range " + ranger.toFixed(2) + " U" 
  document.getElementById("speedometer").innerHTML = "Speed " + speeder.toFixed(2) + " U/S"

  //shipMesh.position.distanceTo(mesh1.position)


  // Chase Cam
  let relativeCameraOffset = new THREE.Vector3(0,0,0.1); // set inside the cone for now

  let cameraOffset = relativeCameraOffset.applyMatrix4(shipMesh.matrixWorld);
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
