// List of colorful star/cosmic icon images 
const STAR_IMAGES = [
  'images/stars1.jpg',
  'images/stars2.jpg',
  'images/stars3.jpg',
  'images/stars4.jpg',
  'images/stars5.jpg'
];

const SKY_WIDTH = 800;
const SKY_HEIGHT = 600;
const STAR_WIDTH = 60;
const STAR_HEIGHT = 60;

class ShootingStar {
  constructor(containerElement) {
    this.containerElement = containerElement;

    // Pick a random icon/image
    const randomImage = STAR_IMAGES[Math.floor(Math.random() * STAR_IMAGES.length)];

    // Random starting position inside the container bounds
    this.x = Math.random() * (SKY_WIDTH - STAR_WIDTH);
    this.y = Math.random() * (SKY_HEIGHT - STAR_HEIGHT);

    // Movement variables
    this.normalSpeed = 1.8;
    this.currentSpeed = this.normalSpeed;
    
    // Direction multipliers (-1 or 1)
    this.dx = Math.random() < 0.5 ? 1 : -1;
    this.dy = Math.random() < 0.5 ? 1 : -1;

    // Create DOM element
    this.element = document.createElement('img');
    this.element.src = randomImage;
    this.element.className = 'star-entity';
    this.containerElement.appendChild(this.element);

    // Click handler to capture/slow down the star for 3 seconds
    this.element.addEventListener('click', (e) => {
      e.stopPropagation();
      this.currentSpeed = 0.5; // Slow down
      
      // Add a temporary glow effect on click
      this.element.style.filter = 'drop-shadow(0 0 15px #ff7675)';

      setTimeout(() => {
        this.currentSpeed = this.normalSpeed;
        this.element.style.filter = '';
      }, 3000);
    });

    // Randomly shift trajectory every few seconds
    setInterval(() => {
      if (Math.random() < 0.5) this.dx *= -1;
      if (Math.random() < 0.5) this.dy *= -1;
    }, 3500);

    this.updatePosition();
  }

  update() {
    // Move position
    this.x += this.dx * this.currentSpeed;
    this.y += this.dy * this.currentSpeed;

    // Bounce off walls
    if (this.x <= 0) {
      this.x = 0;
      this.dx = 1;
    } else if (this.x >= SKY_WIDTH - STAR_WIDTH) {
      this.x = SKY_WIDTH - STAR_WIDTH;
      this.dx = -1;
    }

    if (this.y <= 0) {
      this.y = 0;
      this.dy = 1;
    } else if (this.y >= SKY_HEIGHT - STAR_HEIGHT) {
      this.y = SKY_HEIGHT - STAR_HEIGHT;
      this.dy = -1;
    }

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }
}

// Initialize the observatory on load
window.addEventListener('DOMContentLoaded', () => {
  const sky = document.getElementById('sky');
  const stars = [];

  // Spawn 7 celestial entities
  for (let i = 0; i < 7; i++) {
    stars.push(new ShootingStar(sky));
  }

  // Animation loop
  function loop() {
    stars.forEach(star => star.update());
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
