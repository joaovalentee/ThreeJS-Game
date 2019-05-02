// Tamanho dos cubos para o jogo
var UNITWIDTH = 90,
    UNITHEIGHT = 45,
    backgroundColor = 0x246ed0,
    groundColor = 0xc21c23,
    viewAngle = 40,
    near = 1,
    far = 2000;

var camara, cena, renderer;

// Setup do jogo
init();
animate();


function init() {
  // Criar a cena
  cena = new THREE.Scene();

  // Definir render
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(backgroundColor);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  // Render para o container
  var container = document.getElementById('container');
  container.appendChild(renderer.domElement);

  // Definir a posiçao da camara
  camara = new THREE.PerspectiveCamera( 50, this.width / this.height, 1, 10000 );
  camara.position.z = 310
  camara.position.y = 0

  //point camera on scene
  camara.lookAt(new THREE.Vector3(0,0,0))

  cena.add(camara);

  // Add the walls(cubes) of the maze
  //createMazeCubes();
  criarFundo();
  paredeTraseira();

  // Add lights to the scene
  luzes();

  // Listen for if the window changes sizes and adjust
  window.addEventListener('resize', onWindowResize, false);

}

// Add lights to the scene
function luzes() {
  var luz = new THREE.DirectionalLight(0xffffff, 1.2);
  luz.position.set(1, 2, 1);
  cena.add(luz);

}

//  Criar o fundo do jogo
function criarFundo() {
    var fundoGeometria = new THREE.BoxGeometry(200, 1, 300),
        fundoMaterial = new THREE.MeshPhongMaterial({color: groundColor}),
        fundo = new THREE.Mesh(fundoGeometria, fundoMaterial);
    fundo.position.set(0,0,0);
    cena.add(fundo)
}

function paredeTraseira() {
    var fundoGeometria = new THREE.BoxGeometry(200, 200, 1),
        fundoMaterial = new THREE.MeshPhongMaterial({color: 0x101010}),
        fundo = new THREE.Mesh(fundoGeometria, fundoMaterial);
    fundo.position.set(0,0,-300/2);
    cena.add(fundo)
}

// Create the a cube and add it to the scene
function createMazeCubes() {

  // Make the shape of the cube that is UNITWIDTH wide/deep, and UNITHEIGHT tall
  var cubeGeo = new THREE.BoxGeometry(UNITWIDTH, UNITHEIGHT, UNITWIDTH);
  // Make the material of the cube and set it to blue
  var cubeMat = new THREE.MeshPhongMaterial({
    color: 0x81cfe0,
  });
  
  // Combine the geometry and material to make the cube
  var cube = new THREE.Mesh(cubeGeo, cubeMat);
  cena.add(cube);
  // Update the cube's position
  cube.position.y = UNITHEIGHT / 2;
  cube.position.x = 0;
  cube.position.z = -100;
  // rotate the cube by 30 degrees
  cube.rotation.y = degreesToRadians(30);
}

// Update the camera and renderer when the window changes size
function onWindowResize() {

  camara.aspect = window.innerWidth / window.innerHeight;
  camara.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {
  render();
  // Keep updating the renderer
  requestAnimationFrame(animate);
}

// Render the scene
function render() {
  renderer.render(cena, camara);
}

// Converts degrees to radians
function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

// Converts radians to degrees
function radiansToDegrees(radians) {
  return radians * 180 / Math.PI;
}