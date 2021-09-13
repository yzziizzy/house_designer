window.addEventListener('load', function() {



var container;
var camera, scene, raycaster, renderer;
var walls;

var INTERSECTED;
var theta = 0;

var pointer = new THREE.Vector2();
var radius = 60;

init();
render();

function init() {

	container = document.createElement('div');
	document.body.appendChild(container);

	camera = new THREE.PerspectiveCamera(
		70, 
		window.innerWidth / window.innerHeight, 
		1, 
		10000
	);
	camera.position.set(-5, 20, 35);
	

	scene = new THREE.Scene();
	scene.background = new THREE.Color(0xf0f0f0);

	var light = new THREE.DirectionalLight(0xffffff, 1);
	light.position.set(1, 1, 1).normalize();
	scene.add(light);
	
	var amb = new THREE.AmbientLight(0x404040); // soft white light
	scene.add(amb);

	walls = new THREE.Group();
	var v = function(x,y) { return new THREE.Vector2(x, y); };
	
	for(var w of blueprint.walls) {
	
		var th = w.thickness || .2;
		var dir = v(w.p1[0], w.p1[1]).sub(v(w.p2[0], w.p2[1])).normalize();
		var orth = v(dir.y, -dir.x);
		
		var off = orth.multiplyScalar(th);
		
		var shape = new THREE.Shape([
			v(w.p1[0], w.p1[1]).add(orth),
			v(w.p1[0], w.p1[1]).sub(orth),
			v(w.p2[0], w.p2[1]).sub(orth),
			v(w.p2[0], w.p2[1]).add(orth),
		]);
		
		var geometry = new THREE.ExtrudeGeometry(shape, {
			steps: 1,
			depth: 10,
			bevelEnabled: false,
		});
		
	
	
		var object = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff }));
		
		object.rotation.x = -Math.PI / 2;
//		object.rotation.y = Math.PI;
		
		walls.add(object);
	}

	
	scene.add(walls);

	raycaster = new THREE.Raycaster();

	renderer = new THREE.WebGLRenderer({
		antialias: true,
	});
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	
	container.appendChild(renderer.domElement);

	var controls = new OrbitControls( camera, renderer.domElement );
	controls.screenSpacePanning = true;
	controls.minDistance = 5;
	controls.maxDistance = 400;
	controls.target.set( 0, 2, 0 );
	controls.update();

	const helper = new THREE.GridHelper( 300, 10 );
//	helper.rotation.x = Math.PI / 2;
	scene.add( helper );

	document.addEventListener( 'mousemove', function(e) {
		pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
		pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	});
	
	window.addEventListener( 'resize', function(e) {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
	
		renderer.setSize(window.innerWidth, window.innerHeight);
	});
}



function render() {
	requestAnimationFrame(render);

/*
	theta += 0.1;

	camera.position.x = radius * Math.sin(THREE.MathUtils.degToRad(theta));
	camera.position.y = radius * Math.sin(THREE.MathUtils.degToRad(theta));
	camera.position.z = radius * Math.cos(THREE.MathUtils.degToRad(theta));
	camera.lookAt(scene.position);

	camera.updateMatrixWorld();
*/
	// find intersections

	raycaster.setFromCamera(pointer, camera);

	const intersects = raycaster.intersectObjects(walls.children);

	if(intersects.length > 0) {
		if(INTERSECTED != intersects[0].object) {

			if(INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

			INTERSECTED = intersects[0].object;
			INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			INTERSECTED.material.emissive.setHex(0xff0000);
		}

	} else {

		if(INTERSECTED) INTERSECTED.material.emissive.setHex(INTERSECTED.currentHex);

		INTERSECTED = null;
	}

	renderer.render(scene, camera);
}

});
