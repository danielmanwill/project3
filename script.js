// List of your dragon image paths
const DRAGON_IMAGES = [
  'images/dragon1.jpg',
  'images/dragon2.jpg',
  'images/dragon3.jpg',
  'images/dragon4.jpg',
  'images/dragon5.jpg'
];

const TANK_WIDTH = 800;
const TANK_HEIGHT = 600;
const DRAGON_WIDTH = 80;
const DRAGON_HEIGHT = 60;

class Dragon {
  constructor(tankElement) {
    this.tankElement = tankElement;

    // Pick a random dragon image
    const randomImage = DRAGON_IMAGES[Math.floor(Math.random() * DRAGON_IMAGES.length)];

    // Random starting position inside tank bounds
    this.x = Math.random() * (TANK_WIDTH - DRAGON_WIDTH);
    this.y = Math.random() * (TANK_HEIGHT - DRAGON_HEIGHT);

    // Simple speed and direction variables
    this.normalSpeed = 1.2;
    this.currentSpeed = this.normalSpeed;
    
    // Pick random horizontal and vertical movement directions (-1 or 1)
    this.dx = Math.random() < 0.5 ? 1 : -1;
    this.dy = Math.random() < 0.5 ? 1 : -1;

    // Create the image element
    this.element = document.createElement('img');
    this.element.src = randomImage;
    this.element.className = 'fish'; // Keeps your CSS styling
    this.tankElement.appendChild(this.element);

    // Click handler to slow down for 3 seconds
    this.element.addEventListener('click', (e) => {
      e.stopPropagation();
      this.currentSpeed = 0.4; // Slow speed
      
      // Reset speed after 3 seconds
      setTimeout(() => {
        this.currentSpeed = this.normalSpeed;
      }, 3000);
    });

    // Randomly change direction every few seconds
    setInterval(() => {
      if (Math.random() < 0.5) {
        this.dx *= -1; // Flip horizontal direction
      }
      if (Math.random() < 0.5) {
        this.dy *= -1; // Flip vertical direction
      }
    }, 4000);

    this.updatePosition();
  }

  update() {
    // Move position
    this.x += this.dx * this.currentSpeed;
    this.y += this.dy * this.currentSpeed;

    // Bounce off left/right walls
    if (this.x <= 0) {
      this.x = 0;
      this.dx = 1;
    } else if (this.x >= TANK_WIDTH - DRAGON_WIDTH) {
      this.x = TANK_WIDTH - DRAGON_WIDTH;
      this.dx = -1;
    }

    // Bounce off top/bottom walls
    if (this.y <= 0) {
      this.y = 0;
      this.dy = 1;
    } else if (this.y >= TANK_HEIGHT - DRAGON_HEIGHT) {
      this.y = TANK_HEIGHT - DRAGON_HEIGHT;
      this.dy = -1;
    }

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }
}

// Initialize tank and dragons when page loads
window.addEventListener('DOMContentLoaded', () => {
  const tank = document.getElementById('tank');
  const dragons = [];

  // Spawn 7 dragons
  for (let i = 0; i < 7; i++) {
    dragons.push(new Dragon(tank));
  }

  // Animation loop
  function loop() {
    dragons.forEach(dragon => dragon.update());
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
