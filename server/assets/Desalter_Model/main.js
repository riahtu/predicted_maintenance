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
    // console.log("the log at of the shere1: ", ourObj.children[2].children[1]);
    ourObj.rotation.y -= 0.0009;

    renderer.render(scene, camera);
    $("#dimmer").removeClass(activeDimmer);
  };

  TweenLite.ticker.addEventListener("tick", render);

  /////////////////////
  // Light Setup
  var light = new THREE.PointLight(0xd4e0f7, 3.9, 4000);
  light.position.set(300, 750, 5);
  scene.add(light);
  ////////////////////

  /////////////////////
  // Light Setup 2
  var light = new THREE.PointLight(0xffffff, 2, 1000);
  light.position.set(0, 0, 25);
  scene.add(light);
  ////////////////////

  ////////////////////////////////////
  // Model Loader
  var loader = new THREE.GLTFLoader();
  loader.load(
    "Desalter.gltf",
    function(gltf) {
      scene.add(gltf.scene);
      ourObj = gltf.scene;
      ourObj.position.x = 1.3;
      ourObj.position.y = -1.4;
      ourObj.position.z = 0.2;

      ourObj.rotation.y = 8.10089;
      ourObj.rotation.z = -0.005;

      // console.log("Another thing to log and see if it works: ", ourObj);

      this.tl = new TimelineMax();
      this.tl.from(ourObj.position, 3, {
        x: 75,
        y: 25,
        z: -400,
        ease: Expo.easeInOut
      });
    },
    undefined,
    function(error) {
      console.log(error);
    }
  );

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

  var timeline = new TimelineLite({
    onStart: function() {
      TweenLite.ticker.removeEventListener("tick", controls.update);
      controls.enabled = false;
    },
    onComplete: function() {
      TweenLite.ticker.addEventListener("tick", controls.update);
      controls.position0.copy(camera.position);
      controls.reset();
      controls.enabled = true;
    }
  });
  easing = "Expo.easeInOut";

  ////////////////////////////////////////

  window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  ////////////////////////////////////////

  // This is using the TweenMax for animation
  // creating a new timeline
  // we delay by .3 or else animation is shaky
  this.tl = new TimelineMax().delay(0.3);
  // we reference our mesh in here
  // we will initially scale for a duration of 1
  // in object will put x(for x-axis) and  set ease of
  this.tl.to(this.mesh.scale, 1, { x: 2, ease: Expo.easeOut });
  this.tl.to(this.mesh.scale, 0.5, { x: 0.5, ease: Expo.easeOut });
  this.tl.to(this.mesh.position, 0.5, { x: 2, ease: Expo.easeOut });
  this.tl.to(
    this.mesh.rotation,
    1,
    {
      x: Math.PI * 0.5,
      ease: Expo.easeOut
    },
    //this makes the rotation occur before it normally would
    "=-1.5"
  );
});
