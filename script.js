const FISH_IMAGES = [
  'https://svgsilh.com/svg/2027299.svg',
  'https://svgsilh.com/svg/303960.svg',
  'https://svgsilh.com/svg/1294833.svg',
  'https://svgsilh.com/svg/308906.svg',
  'https://svgsilh.com/svg/310866.svg'
];

const TANK_WIDTH = 800;
const TANK_HEIGHT = 600;
const FISH_WIDTH = 80;
const FISH_HEIGHT = 60;

class Fish {
  constructor(tankElement) {
    this.tankElement = tankElement;

    // Pick 1 random image from the 5 options
    const imageIndex = Math.floor(Math.random() * FISH_IMAGES.length);
    this.imageSrc = FISH_IMAGES[imageIndex];

    // Randomize initial location inside the tank
    this.x = Math.floor(Math.random() * (TANK_WIDTH - FISH_WIDTH));
    this.y = Math.floor(Math.random() * (TANK_HEIGHT - FISH_HEIGHT));

    // Base speed and velocity components for straight-line movement
    this.speed = 1.5;
    this.setRandomDirection();

    // Create DOM element
    this.element = document.createElement('img');
    this.element.src = this.imageSrc;
    this.element.classList.add('fish');
    this.tankElement.appendChild(this.element);

    this.updatePosition();

    // Start independent periodic check for direction changes (every 2 to 8 seconds)[cite: 3]
    this.scheduleDirectionCheck();
  }

  // Set a random angle/velocity vector for straight-line movement
  setRandomDirection() {
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;

    // Optional: Flip image horizontally if moving left/right
    if (this.vx < 0) {
      this.element.style.transform = 'scaleX(-1)';
    } else {
      this.element.style.transform = 'scaleX(1)';
    }
  }

  // Every 2-8 seconds, independently check if direction should change[cite: 3]
  scheduleDirectionCheck() {
    const randomDelay = Math.random() * 6000 + 2000; // Between 2000ms and 8000ms
    setTimeout(() => {
      // 70% chance to change direction on check, or adjust as desired
      if (Math.random() < 0.7) {
        this.setRandomDirection();
      }
      this.scheduleDirectionCheck(); // Repeat cycle
    }, randomDelay);
  }

  // Update position every frame
  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Boundary constraints: Keep fish fully inside the tank[cite: 3]
    if (this.x <= 0) {
      this.x = 0;
      this.vx *= -1; // Reverse direction if hitting edge
      this.element.style.transform = this.vx < 0 ? 'scaleX(-1)' : 'scaleX(1)';
    } else if (this.x >= TANK_WIDTH - FISH_WIDTH) {
      this.x = TANK_WIDTH - FISH_WIDTH;
      this.vx *= -1;
      this.element.style.transform = this.vx < 0 ? 'scaleX(-1)' : 'scaleX(1)';
    }

    if (this.y <= 0) {
      this.y = 0;
      this.vy *= -1;
    } else if (this.y >= TANK_HEIGHT - FISH_HEIGHT) {
      this.y = TANK_HEIGHT - FISH_HEIGHT;
      this.vy *= -1;
    }

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}

const fishList = [];

window.addEventListener('DOMContentLoaded', () => {
  const tankElement = document.getElementById('tank');

  // Generate at least 7 fish[cite: 2]
  for (let i = 0; i < 7; i++) {
    const fish = new Fish(tankElement);
    fishList.push(fish);
  }

  // Animation loop
  function animate() {
    fishList.forEach(fish => fish.update());
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
