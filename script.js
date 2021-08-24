"use strict";

function getRandomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
//localStorage.clear();

let camera, scene, renderer, light, ambient;
let floor;
let stats;
let play = 0;

let clock = new THREE.Clock();
let time;

let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let moveDown = 0;
let moveUp = 0;
let moveLeft = 0;
let moveRight = 0;
let obj1;
let obj2;
let difficulty = 'easy';
let colorBlock = 'wood';

let floorWidth = 150;
let floorHeight = 150;
let clearBlock = 0;

let blockSize = floorWidth/4;
let leftFloor = -floorWidth/2+blockSize/2;
let topFloor = floorHeight/2-blockSize/2;

let textureNumbers = [];

function loadTexture(numberTexture) {
  for(let i = 0; i < 16; i++) {
    let num = i+1;
    textureNumbers[i] = new THREE.TextureLoader().load( "assets" + numberTexture + "/text" + num + ".jpg" );
  }
}



let currentTexture;

let left = 0;
let right = 0;
let up = 0;
let down = 0;

let mas0 = [
  [ 1, 2, 3, 4],
  [ 5, 6, 7, 8],
  [ 9,10,11,12],
  [13,14,16,15]
]
let masGood = [
  [ 1, 2, 3, 4],
  [ 5, 6, 7, 8],
  [ 9,10,11,12],
  [13,14,15,16]
]

function swap(a1, b1, a2, b2) {
  mas0[a1][b1] = [mas0[a2][b2], mas0[a2][b2] = mas0[a1][b1]][0];
}
let tempRnd;
function randomMap() {

  for (let a = 0; a < 10000; a++) {
    tempRnd = getRandomInRange(1, 4);
    for (let i in mas0) {
      for (let j in mas0[i]) {

        if (tempRnd == 1) {
          if (mas0[i][j] == 16) {
            if (j > 0) swap(i,j,i,j-1);
          }
        }
        if (tempRnd == 2) {
          if (mas0[i][j] == 16) {
            if (j < 3) swap(i,j,i,parseInt(j)+1);
          }
        }
        if (tempRnd == 3) {
          if (mas0[i][j] == 16) {
            if (i > 0) swap(i,j,i-1,j);
          }
        }
        if (tempRnd == 4) {
          if (mas0[i][j] == 16) {
            if (i < 3) swap(i,j,parseInt(i)+1,j);
          }
        }
      }
    }
  }
}
randomMap();

let str = '';
let mas = [];
mas = mas0;

$('.start-btn').click(function() {
  $('.info1').css({'display':'block'});
  play = 1;
  $('.start-field').fadeOut(0);
  init();
  animate();
})

$('.reset-btn').click(function() {
  $('.info1').css({'display':'block'});
  mas0 = [
    [ 1, 2, 3, 4],
    [ 5, 6, 7, 8],
    [ 9,10,11,12],
    [13,14,16,15]
  ]
  mas = mas0;
  randomMap();
  play = 1;
  $('.end-field').fadeOut(1000);
  init();
  animate();
  clock.start();
})

$('.diff-form label').click(function() {
  difficulty = $(this).text() 
})
$('.diff-form2 label').click(function() {
  colorBlock = $(this).text()
})

function init() {


  if (colorBlock == 'wood') loadTexture(1);
  else loadTexture(2);


  let cameraZ;
  if (screen.width < 700) cameraZ = 250;
  else cameraZ = 220;
  camera = new THREE.PerspectiveCamera( 60, window.innerWidth / window.innerHeight, 1, 2000 );
  camera.position.set(-1,-100,cameraZ);
  camera.lookAt(0,0,0);
  scene = new THREE.Scene();

  scene.background = new THREE.Color( 0xf0f0f0 );
  scene.fog = new THREE.Fog( 0xcce0ff, 50, 700 );
  
  if  (difficulty == 'easy'){
    /*light = new THREE.PointLight( 0xffffff, 2, 190 );
    light.position.set( 0, 0, 150 );*/


    var light = new THREE.DirectionalLight( 0xdfebff, 0.7 );
    light.position.set( 0, 0, 100 );
    light.position.multiplyScalar( 1.3 );
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    var d = 300;
    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;
    light.shadow.camera.far = 1000;
    scene.add( light );




    clearBlock = 0;
  }

  else if (difficulty == 'hard') {
    var light = new THREE.DirectionalLight( 0xdfebff, 0.7 );
    light.position.set( 0, 0, 100 );
    light.position.multiplyScalar( 1.3 );
    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;
    var d = 300;
    light.shadow.camera.left = - d;
    light.shadow.camera.right = d;
    light.shadow.camera.top = d;
    light.shadow.camera.bottom = - d;
    light.shadow.camera.far = 1000;
    scene.add( light );


    clearBlock = 1;
  }

  
  scene.add( light );
  ambient = new THREE.AmbientLight( 0xffffff, 0.2 );
  scene.add( ambient );
  

  /*let controls = new THREE.OrbitControls( camera );
  controls.update();*/
  
  
  
  let floorGeometry = new THREE.BoxGeometry(floorWidth*7,floorHeight*7,5);

  let floorTexture = new THREE.TextureLoader().load( "assets1/floor21.jpg" );
  floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping;
        floorTexture.repeat.set( 25, 25 );
  floorTexture.anisotropy = 16;
  floorTexture.repeat.set( 20, 20 );

  let floorMaterial = new THREE.MeshPhongMaterial( { map: floorTexture } );
  floor = new THREE.Mesh( floorGeometry, floorMaterial );
  floor.position.z = -2.5;
  floor.receiveShadow = true;
  scene.add( floor )
  
  
  let drawBlock = (i,j,x,y,p,material) => {
    let geometry = new THREE.BoxGeometry( blockSize-0.2,blockSize-0.2,blockSize );
    let block = new THREE.Mesh( geometry, material );
    block.position.set(x,y,blockSize/2);
    block.p = p;
    block.i = i;
    block.j = j;
    mas[i][j] = block;
    scene.add( block );
  }


  let drawMap = () =>{
    for(let i in mas) {
      for(let j in mas[i]) {

        if (mas[i][j] != 16) {
          currentTexture = textureNumbers[mas[i][j]-1];
          let materialBlock = new THREE.MeshPhongMaterial( { map:currentTexture } );
          drawBlock(i,j,leftFloor + blockSize*j, topFloor - blockSize*i, mas[i][j], materialBlock);
          if (clearBlock == 1) {
            mas[i][j].material.map.repeat.x = 0;
          }
          else mas[i][j].material.map.repeat.x = 1;

          //console.log(mas[i][j].p);
        }
        if (mas[i][j] == 16) {
          currentTexture = textureNumbers[mas[i][j]-1];
          let materialBlock = new THREE.MeshPhongMaterial( { color: 0xff0000, transparent: true, opacity: 0 } );
          drawBlock(i,j,leftFloor + blockSize*j, topFloor - blockSize*i, mas[i][j], materialBlock);

          //console.log(scene);
        }

      }
    }
  }
  drawMap();
  
  
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( window.innerWidth, window.innerHeight );
  //renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.gammaInput = true;
  document.querySelector('.field').appendChild( renderer.domElement );
  document.addEventListener( 'mousedown', onDocumentMouseDown, false );
  window.addEventListener( 'resize', onWindowResize, false );
  
  /*stats = new Stats();
  document.querySelector('.field').appendChild( stats.dom );*/
  
  //////////////////////////////////////////////////////////
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}


function showClearBlock(obj) {
  if (clearBlock == 1 && obj.p != 16) {
    obj.material.map.repeat.x = 1;
    setTimeout(function() {
      obj.material.map.repeat.x = 0;
    },400)
  }
}

function onDocumentMouseDown( event ) {
  mouse.x = ( event.clientX / renderer.domElement.clientWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / renderer.domElement.clientHeight ) * 2 + 1;
  
  raycaster.setFromCamera( mouse, camera );
  let intersects = raycaster.intersectObjects( [].concat(...mas) );
  
  if (play == 1 && intersects.length > 0 && moveDown == 0 && moveUp == 0 && moveLeft == 0 && moveRight == 0) {
    
    let posInMasY = intersects[0].object.i;
    let posInMasX = intersects[0].object.j;

    if (posInMasY < 3 && mas[parseInt(posInMasY)+1][posInMasX].p == 16) {
      showClearBlock(intersects[0].object)
      let posY = intersects[0].object.position.y;
      let posYempty = mas[parseInt(posInMasY)+1][posInMasX].position.y;
      
      obj1 = intersects[0];
      obj2 = posYempty;
      moveDown = 1;

      mas[parseInt(posInMasY)+1][posInMasX].position.y = posY;
      
      let tempI1 = mas[parseInt(posInMasY)][posInMasX].i;
      let tempI2 = mas[parseInt(posInMasY)+1][posInMasX].i
      mas[parseInt(posInMasY)][posInMasX].i = tempI2;
      mas[parseInt(posInMasY)+1][posInMasX].i = tempI1;
      
     [mas[parseInt(posInMasY)][posInMasX], mas[parseInt(posInMasY)+1][posInMasX]] 
      = [mas[parseInt(posInMasY)+1][posInMasX], mas[parseInt(posInMasY)][posInMasX]];
    }
    
    
    
    
    else if (posInMasY > 0 && mas[parseInt(posInMasY)-1][posInMasX].p == 16) {
      showClearBlock(intersects[0].object)
      let posY = intersects[0].object.position.y;
      let posYempty = mas[parseInt(posInMasY)-1][posInMasX].position.y;
      
      obj1 = intersects[0];
      obj2 = posYempty;
      moveUp = 1;
      
      mas[parseInt(posInMasY)-1][posInMasX].position.y = posY;
      
      let tempI1 = mas[parseInt(posInMasY)][posInMasX].i;
      let tempI2 = mas[parseInt(posInMasY)-1][posInMasX].i
      mas[parseInt(posInMasY)][posInMasX].i = tempI2;
      mas[parseInt(posInMasY)-1][posInMasX].i = tempI1;
      
      [mas[parseInt(posInMasY)][posInMasX], mas[parseInt(posInMasY)-1][posInMasX]] 
       = [mas[parseInt(posInMasY)-1][posInMasX], mas[parseInt(posInMasY)][posInMasX]];
      
    }
    else if (posInMasX < 3 && mas[posInMasY][parseInt(posInMasX)+1].p == 16) {
      showClearBlock(intersects[0].object)
      let posX = intersects[0].object.position.x;
      let posXempty = mas[posInMasY][parseInt(posInMasX)+1].position.x;
      
      obj1 = intersects[0];
      obj2 = posXempty;
      moveRight = 1;
      
      mas[posInMasY][parseInt(posInMasX)+1].position.x = posX;
      
      let tempI1 = mas[parseInt(posInMasY)][posInMasX].j;
      let tempI2 = mas[posInMasY][parseInt(posInMasX)+1].j;
      mas[parseInt(posInMasY)][posInMasX].j = tempI2;
      mas[posInMasY][parseInt(posInMasX)+1].j = tempI1;
      
     [mas[parseInt(posInMasY)][posInMasX], mas[posInMasY][parseInt(posInMasX)+1]] 
      = [mas[posInMasY][parseInt(posInMasX)+1], mas[parseInt(posInMasY)][posInMasX]];
    }
    
    else if (posInMasX > 0 && mas[posInMasY][parseInt(posInMasX)-1].p == 16) {
      showClearBlock(intersects[0].object)
      let posX = intersects[0].object.position.x;
      let posXempty = mas[posInMasY][parseInt(posInMasX)-1].position.x;
      
      obj1 = intersects[0];
      obj2 = posXempty;
      moveLeft = 1;
      
      mas[posInMasY][parseInt(posInMasX)-1].position.x = posX;
      
      let tempI1 = mas[parseInt(posInMasY)][posInMasX].j;
      let tempI2 = mas[posInMasY][parseInt(posInMasX)-1].j;
      mas[parseInt(posInMasY)][posInMasX].j = tempI2;
      mas[posInMasY][parseInt(posInMasX)-1].j = tempI1;
      
     [mas[parseInt(posInMasY)][posInMasX], mas[posInMasY][parseInt(posInMasX)-1]] 
      = [mas[posInMasY][parseInt(posInMasX)-1], mas[parseInt(posInMasY)][posInMasX]];
    }
   win();
  }
}

function moveFunc() {
  if (obj1 && obj2) {
    var dy = obj1.object.position.y - obj2;
    var dx = obj1.object.position.x - obj2;
  }
  
  if (moveDown == 1 && obj1.object.position.y > obj2) {
    obj1.object.position.y -= Math.min( 2, dy );
    if (obj1.object.rotation.x < 1.57) {
      obj1.object.rotation.x += 0.065;  
    }
    
  }
  else if (moveDown == 1 && obj1.object.position.y == obj2) {
    moveDown = 0;
    obj1.object.rotation.x = 0;
  }
  
  if (moveUp == 1 && obj1.object.position.y < obj2) {
    obj1.object.position.y += Math.min( 2, -dy );
    if (obj1.object.rotation.x > -1.57) {
      obj1.object.rotation.x -= 0.065;  
    }
  }
  else if (moveUp == 1 && obj1.object.position.y == obj2) {
    moveUp = 0;
    obj1.object.rotation.x = 0;
  }
  
  if (moveRight == 1 && obj1.object.position.x < obj2) {
    obj1.object.position.x += Math.min( 2, -dx );
    if (obj1.object.rotation.y < 1.57) {
      obj1.object.rotation.y += 0.065;  
    }
  }
  else if (moveRight == 1 && obj1.object.position.x == obj2) {
    moveRight = 0;
    obj1.object.rotation.y = 0;
  }
  
  if (moveLeft == 1 && obj1.object.position.x > obj2) {
    obj1.object.position.x -= Math.min( 2, dx );
    if (obj1.object.rotation.y > -1.57) {
      obj1.object.rotation.y -= 0.065;  
    }
  }
  else if (moveLeft == 1 && obj1.object.position.x == obj2) {
    moveLeft = 0;
    obj1.object.rotation.y = 0;
  }
}

function win() {

  

  str = '';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      str += mas[i][j].p
    }
  }
  if ([].concat(...masGood).join('') === str) {

    $('.info1').css({'display':'none'});
    
    if (difficulty == 'easy' && localStorage["easy"] > time || difficulty == 'easy' && !localStorage["easy"]) {
      localStorage["easy"] = time;
    }
    else if (difficulty == 'hard' && localStorage["hard"] > time || difficulty == 'hard' && !localStorage["hard"]){
      localStorage["hard"] = time;
    }
    
    if (localStorage["easy"]) $('.easy-time .num').text(localStorage["easy"]);
    else $('.easy-time .num').text('-');
    
    
    if (localStorage["hard"]) $('.hard-time .num').text(localStorage["hard"]);
    else $('.hard-time .num').text('-');
    
    
    clock.stop();
    $('.win-time .num').text(time);
    $('.name-diff').text("(" + difficulty + ") ");
    setTimeout(function() {
      play = 0;
      $('.end-field').fadeIn(500);
      $('.end-field').css({'display':'flex'});
      document.querySelector('.field').removeChild( renderer.domElement );
    }, 300)
    
  }
  
  
}

function animate() {
  if (play == 1) {
    requestAnimationFrame( animate );
    renderer.render( scene, camera );
    /*stats.update();*/

    time = Math.floor(clock.getElapsedTime());
    $('.info1').text(time);
    moveFunc();
  }
}













