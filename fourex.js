var camera, scene, renderer;
var material, geometry, geometry2, geometry3, geometry4, mesh, mesh2, mesh3, mesh4;

init();
animate();

function init() {

  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
  camera.position.z = 1;

  scene = new THREE.Scene();

  //let fogColor = new THREE.Color(0x99eeee);
  //scene.fog = new THREE.Fog(fogColor, 0.1, 2);
  //scene.fog = new THREE.FogExp2(fogColor, 0.00025);
  //scene.background = fogColor;




  material = new THREE.MeshPhongMaterial({
    color: 0xeeeeee,
    shading: THREE.FlatShading,
    vertexColors: THREE.VertexColors
  });

  geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
  geometry2 = new THREE.BoxGeometry( 0.1, 2, 2 );
  geometry3 = new THREE.BoxGeometry( 2, 0.1, 2 );
  geometry4 = new THREE.BoxGeometry( 0.1, 2, 2 );

  mesh = new THREE.Mesh( geometry, material );
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  scene.add( mesh );

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

  mesh4 = new THREE.Mesh( geometry4, material );
  mesh4.position.set(1,0,0)
  mesh4.castShadow = true;
  mesh4.receiveShadow = true;
  scene.add( mesh4 );




  let sunColor = 0xfff3ea;
  let skyColor = 0x180918

  let ambientLight = new THREE.AmbientLight(skyColor)
  scene.add(ambientLight);

  let dirLight = new THREE.DirectionalLight(sunColor, 2);
  dirLight.position.set(1, 0.4, 0.5);
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.castShadow = true;
  scene.add(dirLight);




  let pixMult = 3
  let screenWidth = window.innerWidth / pixMult
  let screenHeight = window.innerHeight / pixMult

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

  function animate() {

  requestAnimationFrame( animate );

  mesh.rotation.x += 0.008;
  mesh.rotation.y += 0.016;

  renderer.render( scene, camera );

}

animate();
