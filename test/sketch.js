// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


let state; // STARTSCREEN, DEATHSCREEN, VICTORYSCREEN;
let startButton; 
let easy, normal, hard;

function preload(){

}

function setup() {
  createCanvas(windowWidth, windowHeight);
  state = "STARTSCREEN";
  

}

function draw() {
  gameScreen();
}

function gameScreen(){
  if (state === "STARTSCREEN"){
    background("purple");

    startButton = new Button(windowWidth/2, windowHeight/2.5, 400, 90, "Start");
    startButton.display();
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

  clickedOn(){
  }

}