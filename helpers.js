
// time 0-1
// function easeOutQuart(t) { return 1-(--t)*t*t*t }

function planetBuilder (a,b,x,y,z,c) {
	
  let geo, mat, body;
  
	geo = new THREE.IcosahedronGeometry(a,b,x,y,z);

	//for (let i = 0, l = geometry.faces.length; i < l; i++) {
	//	geometry.faces[i].color.setHSL( Math.random() * 2 + 0.2, 0.1, 0.5 )
	//}
	
	mat = new THREE.MeshPhongMaterial({
		color: c || baseColor,
    flatShading: true
		//vertexColors: THREE.VertexColors
	});

	body = new THREE.Mesh(geo, mat);
  body.position.set(x,y,z)
	body.castShadow = true;
	body.receiveShadow = true;
	scene.add(body);
	
}


function euro (a,b,x,y,z,c) {
	
	let geo, mat, body;
	
	geo = new THREE.IcosahedronGeometry(a,b,x,y,z);

	texture1 = new THREE.TextureLoader().load( "textures/europa.jpg" );

	texture1.magFilter = THREE.NearestFilter;
	
	mat = new THREE.MeshPhongMaterial({
		color: c || baseColor,
		flatShading: true,
		map: texture1
	});

	body = new THREE.Mesh(geo, mat);
	body.position.set(x,y,z)
	body.castShadow = true;
	body.receiveShadow = true;
	scene.add(body);
	
}
