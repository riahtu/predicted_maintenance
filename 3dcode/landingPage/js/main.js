// Create the Three.js Scene
var scene = new THREE.Scene();

// Create a new Perspective Camera
var camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 25;
camera.position.y = 10;
camera.position.x = -10;

//Create a Full Screen WebGL Renderer
var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement);

//Make sure that the project is responsive based on window resizing
window.addEventListener("resize", () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;

  camera.updateProjectionMatrix();
});

// Add a light
var light = new THREE.PointLight(0xffffff, 1.4, 1000);
light.position.set(0, 15, 15);
scene.add(light);

// Defining our object
var ourObj;

// create the material
// var materialCreated = new THREE.MeshLambertMaterial({ color: 0xffcc00 });

var mtlLoader = new THREE.MTLLoader();
mtlLoader.load("bg4_obj.mtl", function(materials) {
  materials.preload();

  //load the object
  var objLoader = new THREE.OBJLoader();
  objLoader.setMaterials(materials);
  objLoader.load("bg4_obj.obj", function(object) {
    scene.add(object);
    ourObj = object;
    object.position.z -= 10;
    object.rotation.y = 290;

    this.tl = new TimelineMax();
    // this.tl.from(ourObj.scale, 2, {
    //   y: 0,
    //   x: 0,
    //   z: 0,
    //   ease: Expo.easeOut
    // });
    this.tl.from(ourObj.position, 3, {
      y: 0,
      z: -100,
      ease: Expo.easeOut
    });
  });
});

var render = function() {
  requestAnimationFrame(render);

  //Rotate the object indefinitely
  ourObj.rotation.y -= 0.01;

  renderer.render(scene, camera);
};

// Call this to render the entire Scene
render();

// THis is the original without the popping up from the ground
// // Create the Three.js Scene
// var scene = new THREE.Scene();
//
// // Create a new Perspective Camera
// var camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// );
// camera.position.z = 25;
//
// //Create a Full Screen WebGL Renderer
// var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
// renderer.setClearColor("#DDDDDD");
// renderer.setSize(window.innerWidth, window.innerHeight);
//
// document.body.appendChild(renderer.domElement);
//
// //Make sure that the project is responsive based on window resizing
// window.addEventListener("resize", () => {
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   camera.aspect = window.innerWidth / window.innerHeight;
//
//   camera.updateProjectionMatrix();
// });
//
// // Add a light
// var light = new THREE.PointLight(0xffffff, 1.4, 1000);
// light.position.set(0, 15, 15);
// scene.add(light);
//
// // Defining our object
// var ourObj;
//
// // create the material
// // var materialCreated = new THREE.MeshLambertMaterial({ color: 0xffcc00 });
//
// var mtlLoader = new THREE.MTLLoader();
// mtlLoader.load("bg4_obj.mtl", function(materials) {
//   materials.preload();
//
//   //load the object
//   var objLoader = new THREE.OBJLoader();
//   objLoader.setMaterials(materials);
//   objLoader.load("bg4_obj.obj", function(object) {
//     scene.add(object);
//     ourObj = object;
//     object.position.z -= 10;
//     object.rotation.y = 250;
//   });
// });
//
// var render = function() {
//   requestAnimationFrame(render);
//
//   //Rotate the object indefinitely
//   ourObj.rotation.z -= 0.01;
//
//   renderer.render(scene, camera);
// };
//
// // Call this to render the entire Scene
// render();
