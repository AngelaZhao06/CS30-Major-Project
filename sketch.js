// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let bullets = [];
let state = "START";

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
  constructor(x, y, radius){
    this.x = x;
    this.y = y;
    this.health = 3;
    this.radius = radius; 
    this.state = "VULNERABLE";
    this.stateTimer = new Timer(2000, true);
  }
  update(){
    if (keyIsDown(UP_ARROW)) { // go up
      if (this.y - this.radius > 0){
        this.y = this.y - 5;
      }
    }
    if (keyIsDown(DOWN_ARROW)) { //go down
      if (this.y + this.radius < windowHeight){
        this.y = this.y + 5;
      }
    }
    if (keyIsDown(LEFT_ARROW)) {// go left
      if (this.x - this.radius > 0){
        this.x = this.x - 5;
      }
    } 
    if (keyIsDown(RIGHT_ARROW)) { // go right
      if (this.x + this.radius < windowWidth){
        this.x = this.x + 5;
      }
    }
    if(this.health === 0){
      this.state = "DEAD";
    }
  }

  display(){
    if(this.state === "VULNERABLE"){
      fill("#000000");
    } 
    else if (this.state === "IMMUNE"){
      fill("#d1c24d");
    }
    else if (this.state === "DEAD"){
      fill("#e61902");
    }
    
    ellipse(this.x, this.y, this.radius*2);
    textSize(32);
    text(this.health, 20, 50);
  }
  isHit(theBullet){
    let radiiSum = this.radius +  theBullet.radius;
    let distanceBetween = dist(this.x, this.y , theBullet.x, theBullet.y);
    if(distanceBetween < radiiSum && this.state === "VULNERABLE"){

      this.health --;
      this.state = "IMMUNE";

      if (this.stateTimer.expired()){
        this.state = "VULNERABLE";
      }
    }
  }
  immune(){
    // change the isHit to a boolean so you can create a timer
  }
}

let player;
let enemy;

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Character(width/2, height/1.5, 15);
  enemy = new Enemy(width/2, 100, 50, 500);
  enemy.createBullets();
}

function draw() {
  gameScreen();
  player.display();
  player.update();
  enemy.display();
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



