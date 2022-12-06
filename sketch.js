// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

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
      this.bullet = new EnemyBullet(this.x, this.y, 20, 65 + i*5, 5, 0.05);
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
  //takes in initial x, y, and color of bullets.
  constructor(x, y, radius, angle, scalar, speedOfAngle ){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.angle = angle;
    this.scalar = scalar;
    this.speedOfAngle = speedOfAngle;
  }
  display(){
    this.x = this.x + cos(this.angle) * this.scalar;
    this.y = this.y + sin(this.angle) * this.scalar;

    fill("blue");
    circle(this.x, this.y, this.radius);

    // this.angle += this.speedOfAngle;
    this.scalar += this.speedOfAngle;
  }

  isOffscreen(){

  }
}

class Character{
  // player character, takes in inital x, y, and radius for circle;
  constructor(x, y, radius){
    this.x = x;
    this.y = y;
    this.radius = radius; 
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
  }

  display(){
    fill(0);
    ellipse(this.x, this.y, this.radius*2);
  }
  isHit(){

  }
}

let player;
let playerr = 15;
let enemy;

function setup() {
  createCanvas(windowWidth, windowHeight);
  player = new Character(width/2, height/1.5, playerr);
  enemy = new Enemy(width/2, 100, 50, 500);
  enemy.createBullets();
}

function draw() {
  background(220);
  player.display();
  player.update();
  enemy.display();
  for(let i = 0; i < bullets.length; i++){
    bullets[i].display();
  }
}

