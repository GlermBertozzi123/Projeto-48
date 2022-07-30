var bg,bgImg;
var player, shooterImg, shooter_shooting;
var life = 3
var gameState = "play"
var pontuation = 0
var bullets = 40

function preload(){
  zombieImg = loadAnimation("assets/zombieWalk/0.png","assets/zombieWalk/16.png")
  shooterImg = loadAnimation("assets/shotgun/0.png","assets/shotgun/19.png")
  
  bgImg = loadImage("assets/bg.png")
  heart1Img = loadImage("assets/heart_1.png")
  heart2Img = loadImage("assets/heart_2.png")
  heart3Img = loadImage("assets/heart_3.png")
  bulletImg = loadImage("assets/bullet1.png")
  starImg = loadImage("assets/star.webp")
  deadImg = loadImage("assets/bloodsplat.png")


  winSound = loadSound("assets/win.mp3")
  loseSound = loadSound('assets/lose.mp3')
  explosionSound = loadSound("assets/explosion.wav")
  dyingSound = loadSound("assets/zombie_dying.mp3")
  coinSound = loadSound("assets/coin.mp3")
}

function setup() {

  
  createCanvas(windowWidth,windowHeight);
//criando o sprite do jogador
player = createSprite(displayWidth-1400, displayHeight-300, 50, 50);
 player.addAnimation("shooter",shooterImg)
   player.scale = 0.3
   player.setCollider("rectangle",0,0,300,300)
   player.debug = false

  zombies = new Group()
  bulletGroup = new Group()
  stars = new Group()

  heart1 = createSprite(displayWidth - 150,40,20,20)
  heart1.addImage("heart1",heart1Img)
  heart1.scale = 0.4
  heart1.visible = false

  heart2 = createSprite(displayWidth - 100,40,20,20)
  heart2.addImage("heart2",heart2Img)
  heart2.scale = 0.4
  heart2.visible = false

  heart3 = createSprite(displayWidth - 150,40,20,20)
  heart3.addImage("heart3",heart3Img)
  heart3.scale = 0.4

  buttonGround = createSprite(200,height - 10,800,20)
  buttonGround.visible = false

  topGround = createSprite(200,200,800,20)
  topGround.visible = false
}

function draw() {
  background(0); 
  image(bgImg,0,0,width,height)

  if (gameState == "play") {
    //movendo o jogador para cima e para baixo e tornando o jogo compatível com dispositivos móveis usan
  if(keyDown("UP_ARROW")||touches.length>0){
    player.y = player.y-30
  }

  if(keyDown("DOWN_ARROW")||touches.length>0){
    player.y = player.y+30
  }

  if (life == 3) {
    heart3.visible = true
    heart2.visible = false
    heart1.visible = false
  }

  if (life == 2) {
    heart3.visible = false
    heart2.visible = true
    heart1.visible = false
  }

  if (life == 1) {
    heart3.visible = false
    heart2.visible = false
    heart1.visible = true
  }

  if (life == 0) {
    heart1.visible = false
    loseSound.play()
    gameState = "end"
  }

  if (bullets == 0) {
    loseSound.play()
    gameState = "bullets"
  }

  if (pontuation == 100 || pontuation == 101 || pontuation == 102) {
    winSound.play()
    gameState = "win"
  }

  if (player.y < topGround.y) {
    player.y = topGround.y + 20
  }

  if (player.y > buttonGround.y) {
    player.y = buttonGround.y - 20
  }
    
    //atire quando apertar a barra de espaço
  if(keyWentDown("space")){
    bullet = createSprite(player.x + 60,player.y + 15,20,10)
    bullet.addImage("bullet",bulletImg)
    bullet.scale = 0.09
    bullet.velocityX = 60
    bullets -= 1
    bulletGroup.add(bullet)
    explosionSound.play()
  }

  zombies.overlap(bulletGroup,(zombie,bullet)=>{
    zombie.velocityX = 0
    zombie.changeAnimation("dead")
    zombie.setCollider("rectangle",1300,1300,0,0)
    bullet.destroy()
    dyingSound.play()
    pontuation += Math.round(random(2,3))
    setTimeout(() => {
      zombie.destroy()
    },1000)
  })
  
  if (bulletGroup.isTouching(zombies)) {
    for (var i = 0; i < bulletGroup.length; i++) {
      if (bulletGroup[i].isTouching(zombies)) {
        bulletGroup[i].destroyEach()
      }
    }
  }

  if (stars.isTouching(player)) {
    for (var i = 0; i < stars.length; i++) {
        if (stars[i].isTouching(player)) {
            stars[i].destroy()
            bullets += 2
            coinSound.play()
            coinSound.setVolume(0.4)
          }
        }
      }

if (zombies.isTouching(player)) {
  for (var i = 0; i < zombies.length; i++) {
      if (zombies[i].isTouching(player)) {
          zombies[i].destroy()
          life -= 1
          dyingSound.play()
        }
      }
    }
    starSpawner()
    zombieSpawner()
  }

  drawSprites();

  if (gameState == "end") {
    textSize(100)
    text("FIM DO JOGO",width / 2 - 300,height / 2)
    zombies.destroyEach()
    player.destroy()
  }  

  else if (gameState == "win") {
    textSize(60)
    text("PARABÉNS, VOCÊ GANHOU!!",width / 2 - 300,height / 2)
    zombies.destroyEach()
    player.destroy()
  }

  else if (gameState == "bullets") {
    textSize(100)
    text("ACABOU A MUNIÇÃO...",width / 2 - 300,height / 2)
    zombies.destroyEach()
    player.destroy()
    bulletGroup.destroyEach()
  }

  textSize(20)
  fill("white")
  text("Vidas:" + life,displayWidth / 3 - 300,displayHeight / 2 - 450)
  text("Munição:" + bullets,displayWidth / 3 - 300,displayHeight / 2 - 420)
  text("Pontuação:" + pontuation,displayWidth / 3 - 300,displayHeight / 2 - 390)
}

function zombieSpawner(){
  if (frameCount % 50 == 0) {
    zombie = createSprite(width,random(500,height - 80))
    zombie.addAnimation("zombie",zombieImg)
    zombie.addImage("dead",deadImg)
    zombie.velocityX = -(6 + 3 * pontuation / 100)
    zombie.lifetime = 800
    zombies.add(zombie)
  }
}

function starSpawner(){
  if (frameCount % 500 == 0) {
    star = createSprite(width,random(500,height - 80))
    star.addImage("star",starImg)
    star.velocityX = -(20 + 6 * pontuation / 100)
    star.lifetime = 500
    star.scale = 0.05
    stars.add(star)
  }
}