// Project Title
// Your Name
// Date

// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let marisaIdleAnimation, marisaLeftAnimation;

function preload(){
  //marisa = loadImage("assets/marisa-frames/idle-frames/tile000.png");
  marisaIdleAnimation = loadAni("assets/marisa-frames/idle-frames/tile000.png", 8);
  marisaLeftAnimation = loadAni("assets/marisa-frames/left-frames/tile009.png", "assets/marisa-frames/left-frames/tile010.png", "assets/marisa-frames/left-frames/tile011.png", "assets/marisa-frames/left-frames/tile012.png", "assets/marisa-frames/left-frames/tile013.png", "assets/marisa-frames/left-frames/tile014.png", "assets/marisa-frames/left-frames/tile015.png");
  marisaRightAnimation = loadAni( /***"assets/marisa-frames/right-frames/tile016.png",***/  "assets/marisa-frames/right-frames/tile017.png",  "assets/marisa-frames/right-frames/tile018.png",  "assets/marisa-frames/right-frames/tile019.png",  "assets/marisa-frames/right-frames/tile020.png",  "assets/marisa-frames/right-frames/tile021.png",  "assets/marisa-frames/right-frames/tile022.png",  "assets/marisa-frames/right-frames/tile023.png")
}

let state = "START";
let bullets = [];

class Enemy{
  constructor(x, y, radius, health){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.health = health;
    this.color = "black";

  } 
  createBullets(){
    for(let i = 0; i < 50; i++){
      this.bullet = new EnemyBullet(this.x, this.y, 10, 65 + i*5, 5, 0.015);
      bullets.push(this.bullet);
    }
  }
  display(){
    fill(this.color);
    stroke(this.color);
    ellipse(this.x, this.y, this.radius*2);
    this.bullet.display();  
  }
}

class EnemyBullet{ 
  constructor(x, y, radius, angle, scalar, speedOfAngle ){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.angle = angle;
    this.scalar = scalar;
    this.speedOfAngle = speedOfAngle;
  }
  display(){
    angleMode(RADIANS);
    this.x = this.x + sin(this.angle) * this.scalar;
    this.y = this.y + cos(this.angle) * this.scalar;

    noStroke();
    fill("blue");
    circle(this.x, this.y, this.radius);

    this.angle += this.speedOfAngle; //bullets move in circular direction 
    this.scalar += this.speedOfAngle; //increases speed of bullet and moves the bullets outward
  }

  isOffscreen(){

  }
}

class Character{
  // player character, takes in inital x, y, and radius for circle;
  constructor(x, y, radius, sprite){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.health = 3;
    this.radius = radius; 
    this.state = "VULNERABLE";
    this.stateTimer = new Timer(2000, true);

    this.sprite.addAni(marisaIdleAnimation);

    marisaIdleAnimation.scale = 2;
    marisaIdleAnimation.frameDelay=5;
  }
  update(){
    
    if (kb.pressing("up") && this.y - this.radius > 0){ // go up
        this.y = this.y - 10;
    }
    if (kb.pressing("down")&& this.y + this.radius < windowHeight) { //go down
        this.y = this.y + 10;
    }
    if (kb.pressing("left") && this.x - this.radius > 0) {// go left
        this.x = this.x - 10;
      }
    if(kb.holding("left")){
      this.sprite.addAni(marisaLeftAnimation);
      marisaLeftAnimation.scale = 2;
    }
    else{
      this.sprite.addAni(marisaIdleAnimation);
    }
    if (kb.pressing("right") && this.x + this.radius < windowWidth) { // go right
        this.x = this.x + 10;
      }
    if(kb.holding("right")){
      this.sprite.addAni(marisaRightAnimation);
      marisaRightAnimation.scale = 2;
    }
    if(this.health === 0){
      this.state = "DEAD";
    }
  }


  display(){
    if(this.state === "VULNERABLE"){
      fill("#ff00b7");
    } 
    else if (this.state === "IMMUNE"){
      fill("#d1c24d");
    }
    else if (this.state === "DEAD"){
      fill("#e61902");
    }
    
    
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    
    //image(marisa, this.x - marisa.width/1.05, this.y - marisa.height*1.15, marisa.width*2, marisa.height*2);
    //ellipse(this.x, this.y, this.radius*2);
    textSize(32);
    text(this.health, 20, 50);
    text(int(this.stateTimer.getRemainingTime()), 100, 50);
  }
  isHit(theBullet){
    let radiiSum = this.radius +  theBullet.radius;
    let distanceBetween = dist(this.x, this.y , theBullet.x, theBullet.y);

    if (this.stateTimer.expired() && this.state === "IMMUNE"){
      this.state = "VULNERABLE";
    }
    if(distanceBetween < radiiSum && this.state === "VULNERABLE"){
      this.health --;
      this.state = "IMMUNE";
      this.stateTimer.reset();

    }
  }
}

let marisa;
let reimu; 
let player;
let enemy;

function setup() {
  createCanvas(windowWidth, windowHeight);
  marisa = new Sprite();
  player = new Character(width/2, height/1.5, 10, marisa);
  enemy = new Enemy(width/2, 100, 50, 500);
  enemy.createBullets();
}

function draw() {
  gameScreen();
  enemy.display();
  player.display();
  player.update();
  
  
  for(let i = 0; i < bullets.length; i++){
    bullets[i].display();
    player.isHit(bullets[i]);
  }
}

function gameScreen(){
  if (state === "START"){
    background(150);
  }
}

