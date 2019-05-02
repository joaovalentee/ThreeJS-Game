console.clear();

var backgroundColor = 0x4da6ff,
    groundColor = 0xc21c23,
    container = document.getElementById('container'),
    VIEW_ANGLE = 75, 
    ASPECT = window.innerWidth/window.innerHeight, 
    NEAR = 0.1, 
    FAR = 1000;

init();

function init(){
    //Cena();
    criarCena();
    console.log("Hello")
}

//Funcão para criar cena
function Cena(){
    cena = new THREE.Scene();
    renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(backgroundColor)
    renderer.setSize(window.innerWidth,window.innerHeight);
    var container = document.getElementById('container');
    container.appendChild(renderer.domElement);
    
}


function criarCena() {
    var cena = new THREE.Scene();
    var renderer = new THREE.WebGLRenderer();
    renderer.setClearColor(backgroundColor)
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth,window.innerHeight);
    container.appendChild(renderer.domElement);

    var camara = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    camara.position.set(0,50,50);
    cena.add(camara);

    //criarCubo();

    //Adicionar Luzes
    /*var luz = new THREE.DirectionalLight(0xffffff);
    luz.position.set(1,1,1,);
    cena.add(luz);*/
}

function criarCubo(){
    var cuboGeometria = new THREE.BoxGeometry(10,10,10),
        cuboMaterial = new THREE.MeshLambertMaterial({color: 0xff0000});
        cubo = new THREE.Mesh(cuboGeometria,cuboMaterial);
    cubo.position.set(0, 40, 40);
    cena.add(cubo);
}

