let pointY1, pointY2;
let targetY1, targetY2;
let baseY1, baseY2;
let noiseOffset1 = 0;
let noiseOffset2 = 1000; // Use a different noise offset for the second wave
let trail1 = [];
let trail2 = [];
let ripples = [];
const pointSize = 30;
const trailLength = 300; // Length of the trail
const noiseSpeed = 0.02;
let easing1 = 0.05;
let easing2 = 0.05;
let resetSpeed1 = 0.01; // Speed at which the first point returns to baseY1
let resetSpeed2 = 0.01; // Speed at which the second point returns to baseY2

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight * 0.6);
  canvas.parent('animation-canvas');
  pointY1 = height / 2;
  pointY2 = height / 2;
  baseY1 = pointY1;
  baseY2 = pointY2;
  targetY1 = pointY1;
  targetY2 = pointY2;
  noFill();
}

function draw() {
  background(255); // White background color

  // Update point positions with Perlin noise for smooth movement
  noiseOffset1 += noiseSpeed;
  noiseOffset2 += noiseSpeed;
  let noiseValue1 = noise(noiseOffset1);
  let noiseValue2 = noise(noiseOffset2);
  pointY1 = lerp(pointY1, targetY1, easing1) + map(noiseValue1, 0, 1, -1, 1); // Normal jitter
  pointY2 = lerp(pointY2, targetY2, easing2) + map(noiseValue2, 0, 1, -5, 5); // Slightly larger jitter for lower wave

  // Gradually return to baseY if no target change
  if (abs(targetY1 - baseY1) > 1) {
    targetY1 = lerp(targetY1, baseY1, resetSpeed1);
  }
  if (abs(targetY2 - baseY2) > 1) {
    targetY2 = lerp(targetY2, baseY2, resetSpeed2);
  }

  // Update the trails
  trail1.push({ x: width * 2 / 3, y: pointY1 });
  trail2.push({ x: width * 2 / 3, y: pointY2 });
  if (trail1.length > trailLength) {
    trail1.shift();
  }
  if (trail2.length > trailLength) {
    trail2.shift();
  }

  // Draw the trails
  strokeWeight(4);
  for (let i = 0; i < trail1.length - 1; i++) {
    let pos1 = trail1[i];
    let pos2 = trail1[i + 1];
    let col = lerpColor(color(255, 200, 200), color(255, 100, 100), map(pos1.y, 0, height, 0, 1)); // Soft red colors
    stroke(col);
    line(pos1.x, pos1.y, pos2.x, pos2.y);
    trail1[i].x -= 2; // Move the trail to the left
  }
  for (let i = 0; i < trail2.length - 1; i++) {
    let pos1 = trail2[i];
    let pos2 = trail2[i + 1];
    let col = lerpColor(color(200, 200, 255), color(100, 100, 255), map(pos1.y, 0, height, 0, 1)); // Soft blue colors
    stroke(col);
    line(pos1.x, pos1.y, pos2.x, pos2.y);
    trail2[i].x -= 2; // Move the trail to the left
  }

  // Draw moving points
  pointY1 = constrain(pointY1, 0, height);
  pointY2 = constrain(pointY2, 0, height);
  let pointColor1 = lerpColor(color(255, 200, 200), color(255, 100, 100), map(pointY1, 0, height, 0, 1)); // Soft red colors
  let pointColor2 = lerpColor(color(200, 200, 255), color(100, 100, 255), map(pointY2, 0, height, 0, 1)); // Soft blue colors
  fill(pointColor1);
  noStroke();
  ellipse(width * 2 / 3, pointY1, pointSize, pointSize);
  fill(pointColor2);
  noStroke();
  ellipse(width * 2 / 3, pointY2, pointSize, pointSize);

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
  resizeCanvas(windowWidth, windowHeight * 0.6);
}

function movePoint(amount, color, speed1, speed2) {
  targetY1 += amount * 0.5; // Upper wave moves less
  targetY2 += amount; // Lower wave moves more
  easing1 = speed1;
  easing2 = speed2;
  ripples.push({ x: width * 2 / 3, y: pointY1, radius: 0, speed: 5, color: color });
  ripples.push({ x: width * 2 / 3, y: pointY2, radius: 0, speed: 5, color: color });
}
