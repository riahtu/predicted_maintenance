$(document).ready(function() {
  console.log("ready!");

  var ourObj;

  let activeDimmer = "active";
  $("#dimmer").addClass(activeDimmer);

  // Scene Setup
  var scene = new THREE.Scene();

  // Camera Setup
  var camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.01,
    700
  );
  camera.position.z = 5;
  camera.position.y = 0.5;
  camera.position.x = 0;

  // Renderer Setup
  var renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setClearColor("#000000", 0);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  //The render Function
  var render = function() {
    ourObj.children[2].rotation.y -= 0.0009;
    renderer.render(scene, camera);
    $("#dimmer").removeClass(activeDimmer);
  };

  function remove(id) {
    scene.remove(scene.getObjectByName(id));
  }

  TweenLite.ticker.addEventListener("tick", render);

  /////////////////////
  // Light Setup
  var light = new THREE.PointLight(0xd4e0f7, 3.9, 2000);
  light.position.set(400, 750, 5);
  scene.add(light);
  ////////////////////

  ////////*******REMOVE IF NOT LIKED********///////////
  /////////////////////
  // Light Setup 2
  var light = new THREE.PointLight(0xffffff, 1, 1000);
  light.position.set(0, 0, 25);
  scene.add(light);
  ////////////////////

  ////////////////////////////////////
  // Model Loader
  var loader = new THREE.GLTFLoader();
  loader.load(
    "factoryFixed.gltf",
    function(gltf) {
      scene.add(gltf.scene);
      ourObj = gltf.scene;
      ourObj.children[2].position.x = 0.6;
      ourObj.children[2].position.y = 0.3;
      ourObj.children[2].position.z = 1.01;

      ourObj.children[2].rotation.y = 4.70089;
      ourObj.children[2].rotation.z = -0.17;

      var object = ourObj.children[2].children[1];

      object.name = "Object 1";
      var object = ourObj.children[2].children[2];
      object.name = "Object 2";

      var object = ourObj.children[2].children[3];
      object.name = "Object 3";

      this.tl = new TimelineMax();
      this.tl.from(ourObj.children[2].position, 5, {
        x: 75,
        y: 25,
        z: 400,
        ease: Expo.easeInOut
      });
    },
    undefined,
    function(error) {
      console.log(error);
    }
  );
  // console.log("the log at top: ", ourObj);

  var controls = new THREE.TrackballControls(camera);

  controls.rotateSpeed = 3.6;
  controls.zoomSpeed = 0.8;
  controls.panSpeed = 1;

  controls.noZoom = false;
  controls.noPan = false;

  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.12;

  controls.enabled = true;
  TweenLite.ticker.addEventListener("tick", controls.update);

  ////////////////////////////////////////

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  ////////////////////////////////////////
});
