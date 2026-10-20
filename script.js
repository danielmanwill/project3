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

    // Pick 1 random image from the 5 dragon options
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

    // Add click event listener for tapping behavior
    this.element.addEventListener('click', (event) => {
      event.stopPropagation();
      this.handleTap();
    });

    this.scheduleDirectionCheck();
  }

  setRandomDirection() {
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * this.speed;
    this.vy = Math.sin(angle) * this.speed;
    this.updateFacingDirection();
  }

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

  handleTap() {
    if (!this.isModified) {
      this.isModified = true;
      this.speed = 0.5; // Slow down to half speed on click
    }

    this.rescaleVelocity();

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Return to normal speed after 3 seconds, resetting timer if clicked again
    this.timeoutId = setTimeout(() => {
      this.speed = this.normalSpeed;
      this.isModified = false;
      this.timeoutId = null;
      this.rescaleVelocity();
    }, 3000);
  }

  scheduleDirectionCheck() {
    const randomDelay = Math.random() * 6000 + 2000;
    setTimeout(() => {
      if (Math.random() < 0.7) {
        this.setRandomDirection();
      }
      this.scheduleDirectionCheck();
    }, randomDelay);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

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

  // Generate 7 dragons
  for (let i = 0; i < 7; i++) {
    const fish = new Fish(tankElement);
    fishList.push(fish);
  }

  function animate() {
    fishList.forEach(fish => fish.update());
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});
