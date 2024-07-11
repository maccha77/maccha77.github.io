let pointY;
let targetY;
let baseY;
let noiseOffset = 0;
let trail = [];
let ripples = [];
const pointSize = 30;
const trailLength = 300; // Length of the trail
const noiseSpeed = 0.02;
let easing = 0.05;
let resetSpeed = 0.01; // Speed at which the point returns to baseY

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight * 0.8);
  canvas.parent('animation-canvas');
  pointY = height / 2;
  baseY = pointY;
  targetY = pointY;
  noFill();
}

function draw() {
  background(240); // Light background color

  // Update point position with Perlin noise for smooth movement
  noiseOffset += noiseSpeed;
  let noiseValue = noise(noiseOffset);
  pointY = lerp(pointY, targetY, easing) + map(noiseValue, 0, 1, -1, 1);

  // Gradually return to baseY if no target change
  if (abs(targetY - baseY) > 1) {
    targetY = lerp(targetY, baseY, resetSpeed);
  }

  // Update the trail
  trail.push({ x: width * 2 / 3, y: pointY });
  if (trail.length > trailLength) {
    trail.shift();
  }

  // Draw the trail
  strokeWeight(4);
  for (let i = 0; i < trail.length - 1; i++) {
    let pos1 = trail[i];
    let pos2 = trail[i + 1];
    let col = lerpColor(color(255, 0, 0), color(0, 0, 255), map(pos1.y, 0, height, 0, 1)); // Reverse the color mapping
    stroke(col);
    line(pos1.x, pos1.y, pos2.x, pos2.y);
    trail[i].x -= 2; // Move the trail to the left
  }

  // Draw moving point
  pointY = constrain(pointY, 0, height);
  let pointColor = lerpColor(color(255, 0, 0), color(0, 0, 255), map(pointY, 0, height, 0, 1)); // Reverse the color mapping
  fill(pointColor);
  noStroke();
  ellipse(width * 2 / 3, pointY, pointSize, pointSize);

  // Draw ripples
  for (let i = ripples.length - 1; i >= 0; i--) {
    let ripple = ripples[i];
    ripple.radius += ripple.speed;
    if (ripple.radius > width) {
      ripples.splice(i, 1);
    } else {
      stroke(ripple.color);
      noFill();
      ellipse(ripple.x, ripple.y, ripple.radius * 2);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight * 0.8);
}

function movePoint(amount, color, speed) {
  targetY += amount;
  easing = speed;
  ripples.push({ x: width * 2 / 3, y: pointY, radius: 0, speed: 5, color: color });
}
