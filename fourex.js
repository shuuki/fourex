var camera, scene, renderer;
var material, geometry1, geometry2, geometry3, geometry4, mesh1, mesh2, mesh3, mesh4, mesh5;

var keyboard = new THREEx.KeyboardState();
var clock = new THREE.Clock();

init();
animate();

function init() {

  let fov = 60
  let pixMult = 2
  let screenWidth = window.innerWidth / pixMult
  let screenHeight = window.innerHeight / pixMult

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
  geometry4 = new THREE.ConeGeometry( 1, 3, 6 );

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

  geometry4.rotateX( -0.5 );
  geometry4.rotateZ( 0.5 );
  mesh5 = new THREE.Mesh( geometry4, material );
  mesh5.position.set(0,-1,0)
  mesh5.castShadow = true;
  mesh5.receiveShadow = true;
  scene.add( mesh5 );




  // Lights

  let ambientLight = new THREE.AmbientLight(skyColor)
  scene.add(ambientLight);

  let dirLight = new THREE.DirectionalLight(sunColor, 2);
  dirLight.position.set(1, 2, 0.5);
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
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
  mesh1.rotation.x += 0.008;
  mesh1.rotation.y += 0.016;


  var delta = clock.getDelta(); // seconds.
	var moveDistance = 200 * delta; // 200 pixels per second
	var rotateAngle = Math.PI / 2 * delta;   // pi/2 radians (90 degrees) per second
	
	// local transformations

	// move forwards/backwards/left/right
	if ( keyboard.pressed("W") )
		mesh5.translateZ( -moveDistance );
	if ( keyboard.pressed("S") )
		mesh5.translateZ(  moveDistance );
	if ( keyboard.pressed("Q") )
		mesh5.translateX( -moveDistance );
	if ( keyboard.pressed("E") )
		mesh5.translateX(  moveDistance );	

	// rotate left/right/up/down
	var rotation_matrix = new THREE.Matrix4().identity();
	if ( keyboard.pressed("A") )
		mesh5.rotateOnAxis( new THREE.Vector3(0,1,0), rotateAngle);
	if ( keyboard.pressed("D") )
		mesh5.rotateOnAxis( new THREE.Vector3(0,1,0), -rotateAngle);
	if ( keyboard.pressed("R") )
		mesh5.rotateOnAxis( new THREE.Vector3(1,0,0), rotateAngle);
	if ( keyboard.pressed("F") )
		mesh5.rotateOnAxis( new THREE.Vector3(1,0,0), -rotateAngle);
	
	if ( keyboard.pressed("Z") )
	{
		mesh5.position.set(0,25.1,0);
		mesh5.rotation.set(0,0,0);
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
