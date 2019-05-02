/**
 * Copyright (c) 2019 
 * Bruno Novo & João Valente
 */
 
console.clear();

(function (window, document, THREE){
  // "constants"... 
  var WIDTH = window.innerWidth,
      HEIGHT = window.innerHeight,
      VIEW_ANGLE = 45,
      ASPECT = WIDTH / HEIGHT,
      NEAR = 0.1,
      FAR = 10000,
      FIELD_WIDTH = 1200,
      FIELD_LENGTH = 3000,
      BALL_RADIUS = 20,
      PADDLE_WIDTH = 200,
      PADDLE_HEIGHT = 30,
      
      //get the scoreboard element.
      scoreBoard = document.getElementById('scoreBoard'),
      ScoreBoard = document.getElementById('ScoreBoard'),

      //declare members.
      container, renderer, camera, mainLight,
      scene, ball, paddle1, paddle2, field, running,
      score = {
        player1: 0,
        player2: 0
      };
      
  
  function startBallMovement() {
    var direction = Math.random() > 0.5 ? -1 : 1;
    ball.$velocity = {
      x: 0,
      z: direction * 20
    };
    ball.$stopped = false;
  }
  
  function processCpuPaddle() {
    var ballPos = ball.position,
        cpuPos = paddle2.position;
    
    if(cpuPos.x - 100 > ballPos.x) {
      cpuPos.x -= Math.min(cpuPos.x - ballPos.x, 6);
    }else if(cpuPos.x - 100 < ballPos.x) {
      cpuPos.x += Math.min(ballPos.x - cpuPos.x, 6);
    }
  }
  
  function processBallMovement() {
    if(!ball.$velocity) {
      startBallMovement();
    }
    
    if(ball.$stopped) {
      return;
    }
    
    updateBallPosition();
    
    if(isSideCollision()) {
      ball.$velocity.x *= -1; 
    }
    
    if(isPaddle1Collision()) {
      hitBallBack(paddle1);
    }
    
    if(isPaddle2Collision()) {
      hitBallBack(paddle2);
    }
    // APOS GOLOS
    if(isPastPaddle1()) {
      scoreBy('player2');
      ball.position.z = 10000;
    }
    
    if(isPastPaddle2()) {
      scoreBy('player1');
      ball.position.z = 10000;
    }
  }
  
  //Quando é golo
  function isPastPaddle1() {
    return ball.position.z > paddle1.position.z + 100;
  }
  
  function isPastPaddle2() {
    return ball.position.z < paddle2.position.z - 100;
  }
  
  function updateBallPosition() {
    var ballPos = ball.position;
    
    //update the ball's position.
    ballPos.x += ball.$velocity.x;
    ballPos.z += ball.$velocity.z;
    
    // add an arc to the ball's flight. Comment this out for boring, flat pong.
   //ballPos.y = -((ballPos.z - 1) * (ballPos.z - 1) / 5000) + 435;
  }
  
  function isSideCollision() {
    var ballX = ball.position.x,
        halfFieldWidth = FIELD_WIDTH / 2;
    return ballX - BALL_RADIUS < -halfFieldWidth || ballX + BALL_RADIUS > halfFieldWidth;
  }
  
  function hitBallBack(paddle) {
    ball.$velocity.x = (ball.position.x - paddle.position.x) / 5; 
    ball.$velocity.z *= -1;
  }
  
  function isPaddle2Collision() {
    return ball.position.z - BALL_RADIUS <= paddle2.position.z && 
        isBallAlignedWithPaddle(paddle2);
  }
  
  function isPaddle1Collision() {
    return ball.position.z + BALL_RADIUS >= paddle1.position.z && 
        isBallAlignedWithPaddle(paddle1);
  }
  
  function isBallAlignedWithPaddle(paddle) {
    var halfPaddleWidth = PADDLE_WIDTH / 2,
        paddleX = paddle.position.x,
        ballX = ball.position.x;
    return ballX > paddleX - halfPaddleWidth && 
        ballX < paddleX + halfPaddleWidth;
  }
  
  function scoreBy(playerName) {
      addPoint(playerName);
      updateScoreBoard();
      stopBall();
      setTimeout(reset, 2000);
  }
  
  function updateScoreBoard() {
      scoreBoard.innerHTML = 'Player 1-' + score.player1 ;
      ScoreBoard.innerHTML =  score.player2+ '-Player 2' ;
  }
  
  function stopBall(){ 
    ball.$stopped = true;
  }
  
  function addPoint(playerName){
    score[playerName]++;
    console.log(score);
  }
  
  function startRender(){
    running = true;
    render();  
  }
  
  function stopRender() {
    running = false;
  }
  
  function render() {
    if(running) {
      requestAnimationFrame(render);
      
      processBallMovement();
      processCpuPaddle();
      
      renderer.render(scene, camera);
    }
  }
  
  function reset() {
    ball.position.set(0,0,0);
    ball.$velocity = null;
  }
  
  function init() {
    
    container = document.getElementById('container');
    
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(WIDTH, HEIGHT);
    renderer.setClearColor(0x9999BB, 1);
    container.appendChild(renderer.domElement);
    
    camera = new THREE.PerspectiveCamera(VIEW_ANGLE, ASPECT, NEAR, FAR);
    camera.position.set(0, 500, 2700);
    
    scene = new THREE.Scene();
    scene.add(camera);
    
    var fieldGeometry = new THREE.CubeGeometry(FIELD_WIDTH, 5, FIELD_LENGTH, 1, 1, 1),
        fieldMaterial = new THREE.MeshLambertMaterial({ color: 0xb3d9ff });
    field = new THREE.Mesh(fieldGeometry, fieldMaterial);
    field.position.set(0, -50, 0);
    
    var paredeGeometry = new THREE.CubeGeometry(FIELD_WIDTH, 90, 90),
        paredeMaterial = new THREE.MeshLambertMaterial({ color: 0x070eef });
    parede = new THREE.Mesh(paredeGeometry, paredeMaterial);
    parede.position.set(0,0,-FIELD_LENGTH/2 -45)
    scene.add(parede)

    paredeDireita = new THREE.Mesh(new THREE.CubeGeometry(90, 90, FIELD_LENGTH), paredeMaterial);
    paredeDireita.position.set(FIELD_WIDTH/2 +45,0,0)
    scene.add(paredeDireita)

    paredeEsquerda = new THREE.Mesh(new THREE.CubeGeometry(90, 90, FIELD_LENGTH), paredeMaterial);
    paredeEsquerda.position.set(-FIELD_WIDTH/2 -45,0,0)
    scene.add(paredeEsquerda)
i=0;
    scene.add(field);
    paddle1 = addPaddle(i);
    paddle1.position.z = FIELD_LENGTH / 2;
    i++;
    paddle2 = addPaddle(i);
    paddle2.position.z = -FIELD_LENGTH / 2;
    
    var ballGeometry = new THREE.SphereGeometry(BALL_RADIUS, 16, 16),
        ballMaterial = new THREE.MeshLambertMaterial({ color: 0xCC0000 });
    ball = new THREE.Mesh(ballGeometry, ballMaterial);
    scene.add(ball);
    
    camera.lookAt(ball.position);
    
    mainLight = new THREE.HemisphereLight(0xFFFFFF, 0x003300);
    scene.add(mainLight);
    
    camera.lookAt(ball.position);
      
    updateScoreBoard();
    startRender();
    
    renderer.domElement.addEventListener('mousemove', containerMouseMove);
    renderer.domElement.style.cursor = 'none';
    //window.addEventListener('resize', onWindowResize , false);
  }
  
  function addPaddle(i) {
    if ( i == 0)
    {
      var paddleGeometry = new THREE.CubeGeometry(PADDLE_WIDTH, PADDLE_HEIGHT, 10, 1, 1, 1),
        paddleMaterial = new THREE.MeshLambertMaterial({ color: 0xff9900 }),
        paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
    }else{
      var paddleGeometry = new THREE.CubeGeometry(PADDLE_WIDTH, PADDLE_HEIGHT, 10, 1, 1, 1),
      paddleMaterial = new THREE.MeshLambertMaterial({ color: 0xf2ff00}),
      paddle = new THREE.Mesh(paddleGeometry, paddleMaterial);
  }
    scene.add(paddle);
    i++;
    return paddle;
    
  }
  
  function containerMouseMove(e) {
    var mouseX = e.clientX;
    camera.position.x = paddle1.position.x = -((WIDTH - mouseX) / WIDTH * FIELD_WIDTH) + (FIELD_WIDTH / 2);
  }

  function onWindowResize(){
    camera.aspect=window.innerWidth /window.innerHeight;
    camera.updateProjectionMatrix();
    render.setSize(window.innerWidth,window.innerHeight);
}
  
  init();
})(window, window.document, window.THREE);

