// Shooting Star Animation with Canvas
// Don't try to modify this code, it's a work of art!


const canvas = document.getElementById('shootingStarCanvas');
const ctx = canvas.getContext('2d');

// Set canvas to full window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// Helper functions
function random(min, max) {
  return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
  return Math.floor(random(min, max));
}

// Particle class for star trails
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.size = random(1, 3);
    this.color = color;
    this.velocity = {
      x: random(-0.5, 0.5),
      y: random(-0.5, 0.5)
    };
    this.alpha = 1;
    this.decay = random(0.01, 0.03);
    this.gravity = 0.01;
  }

  update() {
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.velocity.y += this.gravity;
    this.alpha -= this.decay;
    this.size *= 0.99;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Shooting Star class
class ShootingStar {
  constructor() {
    this.reset();
    this.particles = [];
    this.trailLength = randomInt(5, 15);
    this.color = this.getRandomColor();
  }

  getRandomColor() {
    const colors = [
      '255, 255, 255', // white
      '200, 220, 255', // cool white
      '255, 220, 180', // warm white
      '180, 220, 255'  // blue-white
    ];
    return colors[randomInt(0, colors.length)];
  }

  reset() {
    // Start from right side of screen with random y position
    this.x = canvas.width + random(0, 100);
    this.y = random(-100, canvas.height * 0.5);
    
    // Random trajectory angle (more horizontal than vertical)
    this.angle = random(Math.PI / 6, Math.PI / 3);
    
    // Physical properties
    this.speed = random(8, 15);
    this.acceleration = random(0.05, 0.2);
    this.len = random(50, 150);
    this.alpha = 1;
    this.fade = random(0.005, 0.015);
    this.size = random(1, 3);
    
    // Random delay before appearing
    this.delay = random(0, 3000);
    this.time = 0;
    this.active = false;
  }

  update() {
    if (!this.active) {
      this.time += 16; // ~60fps frame time
      if (this.time >= this.delay) {
        this.active = true;
      }
      return;
    }

    // Update position with acceleration
    this.speed += this.acceleration;
    this.x -= Math.cos(this.angle) * this.speed;
    this.y += Math.sin(this.angle) * this.speed;
    
    // Fade out
    this.alpha -= this.fade;
    
    // Add particles to trail
    if (Math.random() < 0.3) {
      this.particles.push(
        new Particle(
          this.x + random(-5, 5),
          this.y + random(-5, 5),
          `rgba(${this.color}, ${this.alpha})`
        )
      );
    }
    
    // Update particles
    this.particles.forEach((p, i) => {
      p.update();
      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
      }
    });
    
    // Reset if out of screen or fully faded
    if (this.alpha <= 0 || this.x < -100 || this.y > canvas.height + 100) {
      this.reset();
      this.particles = [];
    }
  }

  draw(ctx) {
    if (!this.active) return;
    
    // Draw particles first (behind the star)
    this.particles.forEach(p => p.draw(ctx));
    
    // Draw main star body
    ctx.save();
    
    // Glow effect
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, this.size * 5
    );
    gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
    gradient.addColorStop(1, `rgba(${this.color}, 0)`);
    
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 5, 0, Math.PI * 2);
    ctx.fill();
    
    // Main star line
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(
      this.x + Math.cos(this.angle) * this.len,
      this.y - Math.sin(this.angle) * this.len
    );
    
    // Line gradient
    const lineGradient = ctx.createLinearGradient(
      this.x, this.y,
      this.x + Math.cos(this.angle) * this.len,
      this.y - Math.sin(this.angle) * this.len
    );
    lineGradient.addColorStop(0, `rgba(${this.color}, ${this.alpha})`);
    lineGradient.addColorStop(1, `rgba(${this.color}, 0)`);
    
    ctx.strokeStyle = lineGradient;
    ctx.lineWidth = this.size;
    ctx.shadowColor = `rgba(${this.color}, ${this.alpha * 0.7})`;
    ctx.shadowBlur = 15;
    ctx.stroke();
    
    ctx.restore();
  }
}

// Create stars with varying properties
const stars = Array.from({ length: 5 }, () => new ShootingStar());

// Background stars
const bgStars = Array.from({ length: 100 }, () => ({
  x: random(0, canvas.width),
  y: random(0, canvas.height),
  size: random(0.5, 1.5),
  alpha: random(0.3, 0.9),
  twinkleSpeed: random(0.01, 0.05),
  baseAlpha: random(0.3, 0.9)
}));

function drawBackground() {
  ctx.fillStyle = '#0a0a20';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Draw static stars
  bgStars.forEach(star => {
    // Twinkle effect
    star.alpha = star.baseAlpha + Math.sin(Date.now() * star.twinkleSpeed) * 0.2;
    
    ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  });
}

// Animation loop
function animate() {
  drawBackground();
  
  stars.forEach(star => {
    star.update();
    star.draw(ctx);
  });
  
  requestAnimationFrame(animate);
}

// Start animation
animate();