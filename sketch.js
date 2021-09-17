const Engine = Matter.Engine;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;

var engine, world;
var canvas,baseimage,playerimage;
var palyer, playerBase, playerArcher;
var playerArrows = [];
var numberOfArrows = 10;
var board1, board2;
var shooted;
var score=0
var isGameOver = false
function preload() {
  backgroundImg = loadImage("./assets/background.png");
  baseimage = loadImage("./assets/base.png");
  playerimage = loadImage("./assets/player.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  engine = Engine.create();
  world = engine.world;
  angleMode(DEGREES);

  var options = {
    isStatic: true
  };

  playerBase = Bodies.rectangle(200, 350, 180, 150, options);
  World.add(world, playerBase);

  player = Bodies.rectangle(250, playerBase.position.y - 160, 50, 180, options);
  World.add(world,player)

  playerArcher = new PlayerArcher(
    340,
    playerBase.position.y - 112,
    120,
    120
  );

  board1 = new Board(width - 300, 330, 50, 200);
  board2 = new Board(width - 550, height - 300, 50, 200);
}

function draw() {
  background(backgroundImg );
  image(baseimage,playerBase.position.x,playerBase.position.y,180,150)
  image(playerimage,player.position.x,player.position.y,50,180)

  Engine.update(engine);

  playerArcher.display();

  board1.display();
  board2.display();

  for (var i = 0; i < playerArrows.length; i++) {
    if (playerArrows[i] !== undefined) {
      playerArrows[i].display();
      collisionWithBoard1(i)
      collisionWithBoard2(i)
    }
    }
/*
      //with distance formula
      d1 = dist(playerArrows[i].body.position.x,playerArrows[i].body.position.y, board1.body.position.x,board1.body.position.y)
      if(d1<=100)
      {
        console.log("collision");
      }

      var board1Collision = Matter.SAT.collides(
        board1.body,
        playerArrows[i].body
      );

      var board2Collision = Matter.SAT.collides(
        board2.body,
        playerArrows[i].body
      );

      if (board1Collision.collided || board2Collision.collided) {
        console.log("yes");
      }
   */

      //[optional code to add trajectory of arrow]
      
      // var posX = playerArrows[i].body.position.x;
      // var posY = playerArrows[i].body.position.y;

      // if (posX > width || posY > height) {
      //   if (!playerArrows[i].isRemoved) {
      //     playerArrows[i].remove(i);
      //   } else {
      //     playerArrows[i].trajectory = [];
      //   }
      // }
   

  // Title
  fill("#FFFF");
  textAlign("center");
  textSize(40);
  text("EPIC ARCHERY", width / 2, 100);

  // Arrow Count
  fill("#FFFF");
  textAlign("center");
  textSize(30);
  text("Remaining Arrows : " + numberOfArrows, 200, 100);
  var t = (10-numberOfArrows)*5
  text("Score:" + score +"/"+ t ,200,150)

  if (numberOfArrows == 0) {
    console.log("arrow bucket is empty")
  }
  if(shooted === 1&&shooted!==2){
    text("You shooted Board 1!",width - width/6,75)
  }
  if(shooted === 2&&shooted!==1){
    text("You shooted Board 2!",width - width/6,150)
  }

  if(shooted ===3){
    text("You shooted Both-Boards!",width - width/6,100)
  }
  if(numberOfArrows ===0){
    
    isGameOver = true;

  }

  if(isGameOver === true){
    gameOver()
  }
}

function keyPressed() {
  if (keyCode === 32&&isGameOver === false) {
    if (numberOfArrows > 0) {
      var posX = playerArcher.body.position.x;
      var posY = playerArcher.body.position.y;
      var angle = playerArcher.body.angle;

      var arrow = new PlayerArrow(posX, posY, 100, 20, angle);

      arrow.trajectory = [];
      Matter.Body.setAngle(arrow.body, angle);
      playerArrows.push(arrow);
      numberOfArrows -= 1;
    }
  }
}

function keyReleased() {
  if (keyCode === 32&&isGameOver ===false) {
    if (playerArrows.length) {
      var angle = playerArcher.body.angle;
      playerArrows[playerArrows.length - 1].shoot(angle);
    }
  }
}


function collisionWithBoard1(index){
  if (playerArrows[index]!==undefined&&board1!==undefined){
    var collision1 = Matter.SAT.collides(playerArrows[index].body, board1.body);
    if (collision1.collided){
      
      Matter.World.remove(world, playerArrows[index].body);
      delete playerArrows[index]
      
      if(shooted===2){
        shooted =3
      }else if(shooted!==5125&&shooted!==3){
        shooted = 1
      }

      score = score+5
      
    }

  }
    
}

function collisionWithBoard2(index){
  if (playerArrows[index]!==undefined&&board2!==undefined){
    var collision2 = Matter.SAT.collides(playerArrows[index].body, board2.body);
    if (collision2.collided){
      Matter.World.remove(world, playerArrows[index].body);
      delete playerArrows[index]
      
      if(shooted===1){
        shooted = 3
      }else if(shooted!==5125&&shooted!==3){
        shooted=2
      }

      score = score+5
    }

  }
    
}

function gameOver(){
  swal(
    {
      title: `Game Over`,
      text: "You have no more arrows left",
      imageUrl:"https://assets.editor.p5js.org/60a34a42ddc9fb0024c1ce63/45d81f8c-4bd4-495a-ba3b-98e3bd1b7cf8.png",
      imageSize:"250x250",
      confirmButtonText: "Play Again"
    },
    function(isConfirm){
      if(isConfirm){
        location.reload()
      }

    }
  );
}