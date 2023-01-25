// Project Title
// Your Name
// Date

// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let state; // STARTSCREEN, DEATHSCREEN, VICTORYSCREEN;
let startButton; 
let restart;
let easyMode, normalMode, hardMode;
let player;
let enemy1, enemy2, boss;
let heart;
let score = 0;
let isFiring = false;
let stageMultiplier = 80; //adjusts the healthbar of the enemy
let bg;
let startingY = -1850;

let leftAnimation, rightAnimation, verticalAnimation;
let marisaIdleAnimation, marisaLeftAnimation, marisaRightAnimation;
let reimuIdleAnimation, reimuLeftAnimation, reimuRightAnimation;

let bullets = [];
let bossAttackArray = []
let emptyArray = [];
let playerBullets = [];

let clownPiece;

function preload(){
  marisaIdleAnimation = loadAni("assets/marisa-frames/idle-frames/tile000.png", 8);
  marisaLeftAnimation = loadAni( "assets/marisa-frames/left-frames/tile011.png", "assets/marisa-frames/left-frames/tile012.png", "assets/marisa-frames/left-frames/tile013.png", "assets/marisa-frames/left-frames/tile014.png", "assets/marisa-frames/left-frames/tile015.png");
  marisaRightAnimation = loadAni("assets/marisa-frames/right-frames/tile019.png",  "assets/marisa-frames/right-frames/tile020.png",  "assets/marisa-frames/right-frames/tile021.png",  "assets/marisa-frames/right-frames/tile022.png",  "assets/marisa-frames/right-frames/tile023.png")

  heart = loadImage("assets/heart.png");
  bg = loadImage("assets/background.png");

  clownPiece = loadImage("assets/clownpiece.gif");
  bullet_sound = loadSound("assets/bullet_sound.mp3");
}

class Enemy{
  constructor(x, y, radius, health){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.health = health;
    this.color = 184, 141, 55;

  } 
  createBullets(x, y, radius, angle, scalar, vel, spin){
    for(let i = 0; i < 50; i++){
      this.bullet = new EnemyBullet(x, y, radius, 65 + i* int(angle), scalar, vel, spin);
      bullets.push(this.bullet);
    }
  }
  display(){
    fill(this.color);
    stroke(this.color);
    ellipse(this.x, this.y, this.radius*2);

    for(let i = 0; i < bullets.length; i++){
      bullets[i].display();
      player.isHit(bullets[i]);
    }

    for(let i = bullets.length-1; i >=0; i--){
        if(bullets[i].isOffscreen()){
          bullets.splice(i, 1);
          score+= 1;
        }
    }

    fill("gray")
    stroke("black");

    rect(windowWidth * 1/15, windowHeight * 1/15, windowWidth*((this.health)/stageMultiplier), 20, 30);
  }
}

class EnemyBullet{ 
  constructor(x, y, radius, angle, scalar, speedOfAngle, spin){
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.angle = angle;
    this.scalar = scalar;
    this.speedOfAngle = speedOfAngle;
    this.spin = spin;
  }
  display(){
    angleMode(RADIANS);
    this.x = this.x + sin(this.angle) * this.scalar;
    this.y = this.y + cos(this.angle) * this.scalar;

    noStroke();
    fill("blue");
    circle(this.x, this.y, this.radius);

    if(this.spin){
      this.angle += this.speedOfAngle; //bullets move in circular direction 
      this.scalar += this.speedOfAngle; //increases speed of bullet and moves the bullets outward 
    }
    
  }

  isOffscreen(){
    return this.y < 0 || this.y > windowHeight || this.x > windowWidth * 2.98/4 || this.x < 0;
  }
}

class Player{
  // player character, takes in inital x, y, and radius for circle;
  constructor(x, y, character_selected){
    this.x = x;
    this.y = y;
    this.dx = 10;
    this.dy = 10
    this.sprite = new Sprite();
    this.health = 5;
    this.radius = 15; 
    this.state = "VULNERABLE";
    this.stateTimer = new Timer(2000, true);
    this.bulletTimer = new Timer(300, true);
    this.character = character_selected;
    
    this.sprite.visible = false;

    if(this.character === 0){
      this.sprite.addAni(marisaIdleAnimation);
      
    }else{
      rightAnimation = reimuLeftAnimation
      verticalAnimation = reimuIdleAnimation;
    }
  }

  update(){

    if(state === 1 ){
      this.sprite.visible = true;
    }
    
    if (kb.pressing("up") && this.y - this.radius > 0){ // go up
        this.y = this.y - this.dy;
    }
    if (kb.pressing("down")&& this.y + this.radius < windowHeight) { //go down
        this.y = this.y + this.dy;
    }
    if (kb.pressing("left") && this.x - this.radius > 0) {// go left
        this.x = this.x - this.dx;
        if(this.character === 0){
          this.sprite.addAni(marisaLeftAnimation);
        }
      }
    else{
      this.sprite.addAni(marisaIdleAnimation);
    }
    if (kb.pressing("right") && this.x + this.radius < windowWidth * 3/4) { // go right
        this.x = this.x + this.dx;
        if(this.character === 0){
          this.sprite.addAni(marisaRightAnimation);
        }
    }
    if(kb.pressing("space") && this.bulletTimer.expired()){
      let newBullet = new PlayerBullet(this.x, this.y - 30);
      playerBullets.push(newBullet);
      this.dy = 1;
      this.dx = 1;
      if(!bullet_sound.isPlaying()){
        bullet_sound.play();
      }
      this.bulletTimer.reset();
    } else {
      this.dy = 10;
      this.dx = 10;
    }

    if(this.health === 0){
      this.state = "DEAD";
      state = "GAME_OVER";
    }
  }

  display(chosenEnemy){

    let enemy = chosenEnemy;
    if(state === 1){
      this.sprite.visible = true;
    }
    if(this.state === "VULNERABLE"){
      fill("#ff00b7");
    } 
    else if (this.state === "IMMUNE"){
      fill("#d1c24d");
    }
    else if (this.state === "DEAD"){
      fill("#e61902");
      this.sprite.visible = false;
    }
    
    
    
    this.sprite.x = this.x;
    this.sprite.y = this.y;
    
    noStroke();
    ellipse(this.x, this.y, this.radius*2);

    for (let i = playerBullets.length-1; i >= 0; i--) {
      if (playerBullets[i].isDead()) {
        playerBullets.splice(i, 1);
      }
    }

    for (let i = playerBullets.length-1; i >= 0; i--) {
      if (playerBullets[i].hasHit(chosenEnemy) ) {
        playerBullets.splice(i, 1);
      }

    for(let newBullet of playerBullets){
      newBullet.fire();
      newBullet.display();
    }


    }
    //textSize(32);
    // text(this.health, 20, 50);
    //fill("yellow");
    //text(int(this.stateTimer.getRemainingTime()), windowWidth * 4.5/5, windowHeight * 2.4/15);

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

class PlayerBullet {
  constructor(startingX, startingY){
    this.x = startingX;
    this.y = startingY;
    this.dy = -5;
    this.radius = 10;
    this.transparency = 100;
  }
  display(){
    stroke("purple");
    fill("yellow");
    this.transparency

    circle(this.x, this.y, this.radius);
  }
  fire(){
    this.y += this.dy;
  }
  isDead(){ // checks if the bullet has gone off screen 
    return this.y < 0;
  }
  hasHit(enemy){ // checks if the bullet has hit the enemy
    let radiiSum = this.radius +  enemy.radius;
    let distanceBetween = dist(this.x, this.y , enemy.x, enemy.y);

    if(distanceBetween < radiiSum){
      enemy.health --;
      this.x = -100;
      this.y = -100;
    }
  }
}

class Button {
  constructor(x, y, width, height, labelText) {
    this.x = x;
    this.y = y;
    this.w = width;
    this.h = height;
    this.label = labelText;
  }
  
  display() {
    stroke(0);
    if (this.over()) {
      fill(204, 0, 128);
    } else {
      fill(255);
    }
    rect(this.x - this.w/2, this.y, this.w, this.h, 5);
    
    fill(0);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(18);
    text(this.label, this.x, this.y + this.h/2);
  }
  
  over() {
    if (mouseX > this.x - this.w/2 && mouseX < this.x + this.w/2 && mouseY > this.y && mouseY < this.y + this.h) {
      return true;
    } else {
      return false;
    }
  }

}

class BossAttack { // was originally going to use this but found it too hard to beat 
  constructor() {
    // initialize coordinates
    this.posX = 0;
    this.posY = random(-50, 0);
    this.initialangle = random(0, 2 * PI);
    this.size = random(2, 5);

    // are uniformly spread out in area
    this.radius = sqrt(random(pow(width / 2, 2)));
    }
    update(time) {
      // x position follows a circle
      let w = 0.6; // angular speed
      let angle = w * time + this.initialangle;
      this.posX = width / 2 + this.radius * sin(angle);

      // different size bullets fall at slightly different y speeds
      this.posY += pow(this.size, 0.5);

      // delete bullet if past end of screen
      if (this.posY > windowHeight) {
        let index = bossAttackArray.indexOf(this);
        bossAttackArray.splice(index, 1);
      }
    }
    
    display() {
      noStroke();
      fill("white");
      ellipse(this.posX, this.posY, this.size);
  }
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  state = 0;
  score = 0;
  stageMultiplier = 80;
  player = new Player(windowWidth * 2/5, height/1.5, 0);

  enemy1 = new Enemy(windowWidth * 2/5, windowHeight  * 1/5, 50, 50);
  enemy1.createBullets(enemy1.x, enemy1.y, 10, 5, 5, 0.01, false);

  enemy2 = new Enemy(windowWidth * 2/5, windowHeight  * 1/5, 30, 100);
  enemy2.createBullets(enemy2.x, enemy2.y, 10, 5, 5, 0.009, true);

  boss = new Enemy(windowWidth * 2/5, windowHeight  * 1/5, 30, 200);
  boss.createBullets(boss.x, boss.y, 10, 5, 5, 0.01, false);
  boss.createBullets(boss.x, boss.y, 10, 5, 3, 0.005, true);
  

}

function draw() {
  gameScreen();
}

function gameScreen(){


  if(state === "GAME_OVER"){
    background("red");
    restart = new Button(windowWidth/2, windowHeight/2.5, 400, 90, "Try Again");
    restart.display();
    if(state === "GAME_OVER" && restart.over() && mouseIsPressed){
      refresh();
    }
  }
    
  if (state === 0){
    background("purple");

    startButton = new Button(windowWidth/2, windowHeight/2.5, 400, 90, "Start");
    startButton.display();
    if(state === 0 && startButton.over() && mouseIsPressed){
      state = 1;
    }
  }

  else if(state === 1){
    background("green");
    scrollingBG();
    scoreBoard();
    
    bullets = emptyArray;

    player.update();
    player.display(enemy1);
    
    if( bullets.length < 70 ){
      enemy1.createBullets(enemy1.x, enemy1.y, 10, random(50), 5, 0.01, false);
    }
    
    enemy1.display();
    //image(clownPiece, enemy1.x, enemy1.y);

    if(enemy1.health <= 0){
      state = 2;
    }
  }
  else if(state === 2){

    bullets = emptyArray;

    background("purple");
    scrollingBG();
    stageMultiplier = 160;

    scoreBoard();     
    player.update();
    player.display(enemy2);

    if( bullets.length < 30 ){
      enemy2.createBullets(enemy2.x, enemy2.y, 10, 5, 5, 0.009, true);
    }
    
    enemy2.display();

    if(enemy2.health <= 0){
      state = 3;
    }
  }
  else if(state === 3){
    bullets = emptyArray;

    background("orange");
    scrollingBG();

    stageMultiplier = 300;

    scoreBoard();   
    player.update();
    player.display(boss);

    if(bullets.length < 90 ){
      boss.createBullets(boss.x, boss.y, 10, random(50), 5, 0.01, false);
    }

    if(random(100) > 99 && bullets.length < 120){
      boss.createBullets(boss.x, boss.y, 10, random(20), 2, 0.009, true);
    }
    
    boss.display();

    if(boss.health <=0){
      state = 4;
    }

  //   let t = frameCount / 60; // update time

  //   // create a random number of snowflakes each frame
  //   for (let i = 0; i < random(5); i++) {
  //   bossAttackArray.push(new BossAttack()); // append snowflake object
  // }

  // // loop through snowflakes with a for..of loop
  // for (let flake of bossAttackArray) {
  //   flake.update(t); // update snowflake position
  //   flake.display(); // draw snowflake
  // }
  }
  else if( state === 4){
    background("white");
    fill("pink");
    textSize(50);
    text("You Win", windowWidth/2, windowHeight/2);
  }

  }


function scoreBoard(){
  textAlign(LEFT);
  fill(110, 109, 107);
  rect(windowWidth * 3/4, 0, windowWidth/4, windowHeight);
  fill("red");
  textSize(32);
  text("Stage: " + state + "/3", windowWidth * 3.8/5, windowHeight * 1/15);
  text("Points: " + score, windowWidth * 3.8/5,  windowHeight * 2/15);

  //display the player's hearts left
  for(let i = 0; i < player.health; i ++){
    image(heart,  windowWidth * 3.02/4 + (i*50), windowHeight * 2.4/15);
  }
}

function refresh(){
  createCanvas(windowWidth, windowHeight);
  bullets = emptyArray;
  player.health = 6;
  state = 0;
  score = 0;
  stageMultiplier = 80;
  player = new Player(windowWidth * 2/5, height/1.5, 0);

  enemy1 = new Enemy(windowWidth * 2/5, windowHeight  * 1/5, 50, 50);
  enemy1.createBullets(enemy1.x, enemy1.y, 10, 5, 5, 0.01, false);

  enemy2 = new Enemy(windowWidth * 2/5, windowHeight  * 1/5, 100, 50);
  enemy2.createBullets(enemy2.x, enemy2.y, 10, 5, 5, 0.015, true);

  boss = new Enemy(windowWidth * 2/5, windowHeight  * 1/5, 30, 200);
  boss.createBullets(boss.x, boss.y, 10, 5, 5, 0.01, false);
  boss.createBullets(boss.x, boss.y, 10, 5, 3, 0.005, true);
  
}

function scrollingBG(){
  image(bg, 0, startingY, windowWidth * 3/4, bg.height );
  startingY++;
  if(startingY++ > 0){
    startingY = -1800;
  }

}