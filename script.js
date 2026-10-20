// Array of 5 default/sample fish images
const FISH_IMAGES = [
  'images/dragon1.jpg',
  'images/dragon2.jpg',
  'images/dragon3.jpg',
  'images/dragon4.jpg',
  'images/dragon5.jpg'
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

    // Speed configurations
    this.normalSpeed = 1.5;
    this.speed = this.normalSpeed;
    this.isModified = false;
    this.timeoutId = null;

    this.setRandomDirection();

    // Create DOM element
    this.element = document.createElement('img');
    this.element.src = this.imageSrc;
    this.element.classList.add('fish');
    this.tankElement.appendChild(this.element);

    this.updatePosition();

    // Add click event listener for tapping behavior (non-cumulative speed change)
    this.element.addEventListener('click', (event) => {
      event.stopPropagation(); // Prevents click from registering on the tank background
      this.handleTap();
    });

    // Start independent periodic check for direction changes (every 2 to 8 seconds)[cite: 3]
    this.scheduleDirectionCheck();
  }

  // Set a random angle/velocity vector for straight-line movement
  setRandomDirection() {
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;

    this.updateFacingDirection();
  }

  // Helper to maintain vector direction when speed changes
  rescaleVelocity() {
    const currentAngle = Math.atan2(this.vy, this.vx);
    this.vx = Math.cos(currentAngle) * this.speed;
    this.vy = Math.sin(currentAngle) * this.speed;
  }

  updateFacingDirection() {
    if (this.vx < 0) {
      this.element.style.transform = 'scaleX(-1)';
    } else {
      this.element.style.transform = 'scaleX(1)';
    }
  }

  // Handle click / tap behavior
  handleTap() {
    // If not already modified, apply modified speed (e.g., half speed or double speed)
    if (!this.isModified) {
      this.isModified = true;
      this.speed = 0.5; // Changes to half speed on click
    }

    // Rescale velocity vector to match the new speed while keeping current direction
    this.rescaleVelocity();

    // If already timed, clear existing timeout so it's not cumulative in duration (resets timer)
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Return to normal speed after 3 seconds
    this.timeoutId = setTimeout(() => {
      this.speed = this.normalSpeed;
      this.isModified = false;
      this.timeoutId = null;
      this.rescaleVelocity();
    }, 3000);
  }

  // Every 2-8 seconds, independently check if direction should change[cite: 3]
  scheduleDirectionCheck() {
    const randomDelay = Math.random() * 6000 + 2000; // Between 2000ms and 8000ms
    setTimeout(() => {
      if (Math.random() < 0.7) {
        this.setRandomDirection();
      }
      this.scheduleDirectionCheck();
    }, randomDelay);
  }

  // Update position every frame
  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Boundary constraints: Keep fish fully inside the tank[cite: 3]
    if (this.x <= 0) {
      this.x = 0;
      this.vx *= -1;
      this.updateFacingDirection();
    } else if (this.x >= TANK_WIDTH - FISH_WIDTH) {
      this.x = TANK_WIDTH - FISH_WIDTH;
      this.vx *= -1;
      this.updateFacingDirection();
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
