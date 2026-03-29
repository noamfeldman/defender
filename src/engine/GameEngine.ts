import type { ControlState } from '../hooks/useControls';
import type { Player, Enemy, Bullet, Particle } from '../types';
import { audio } from '../utils/AudioEngine';

export class GameEngine {
  public worldWidth = 4000;
  public worldHeight = 600;
  
  public player: Player;
  public enemies: Enemy[] = [];
  public bullets: Bullet[] = [];
  public particles: Particle[] = [];
  
  public score = 0;
  public lives = 3;
  public smartBombs = 3;
  public level = 1;
  
  public isGameOver = false;
  
  private cameraX = 0;
  private lastFireTime = 0;
  private levelTransitionTimer = 0;

  constructor() {
    this.player = this.createPlayer();
    this.spawnWave(1);
  }

  private createPlayer(): Player {
    return {
      id: 'player',
      x: 0,
      y: this.worldHeight / 2,
      vx: 0,
      vy: 0,
      radius: 15,
      active: true,
      facingLeft: false,
      thrusting: false,
      invulnerableTimer: 2.0,
    };
  }

  private spawnWave(level: number) {
    const numLanders = 5 + level * 2;
    for (let i = 0; i < numLanders; i++) {
      this.enemies.push({
        id: `lander-${Date.now()}-${i}`,
        type: 'LANDER',
        x: Math.random() * this.worldWidth,
        y: Math.random() * (this.worldHeight / 2),
        vx: (Math.random() - 0.5) * 100,
        vy: (Math.random() - 0.5) * 50,
        radius: 12,
        active: true,
        fireTimer: Math.random() * 3,
      });
    }
  }

  public update(dt: number, controls: ControlState) {
    if (this.isGameOver) return;

    if (this.levelTransitionTimer > 0) {
        this.levelTransitionTimer -= dt;
        if (this.levelTransitionTimer <= 0) {
            this.level++;
            this.spawnWave(this.level);
        }
    } else if (this.enemies.length === 0) {
        this.levelTransitionTimer = 3.0; // 3 seconds pause between waves
    }

    this.updatePlayer(dt, controls);
    this.updateEnemies(dt);
    this.updateBullets(dt);
    this.updateParticles(dt);
    this.checkCollisions();

    // Camera follow player smoothly
    const targetDeadzone = this.player.facingLeft ? 500 : 300; 
    let targetCameraX = this.player.x - targetDeadzone;
    
    let diff = targetCameraX - this.cameraX;
    if (diff > this.worldWidth / 2) diff -= this.worldWidth;
    if (diff < -this.worldWidth / 2) diff += this.worldWidth;
    
    this.cameraX += diff * 5 * dt;

    if (this.cameraX < 0) this.cameraX += this.worldWidth;
    if (this.cameraX >= this.worldWidth) this.cameraX -= this.worldWidth;
  }

  private updatePlayer(dt: number, controls: ControlState) {
    if (!this.player.active) return;

    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer -= dt;
    }

    // Keyboard & Virtual Joystick integration
    const accel = 800;
    const maxSpeedX = 400;
    const maxSpeedY = 250;

    if (controls.left) {
      this.player.vx -= accel * dt;
      this.player.facingLeft = true;
      this.player.thrusting = true;
    } else if (controls.right) {
      this.player.vx += accel * dt;
      this.player.facingLeft = false;
      this.player.thrusting = true;
    } else if (controls.joystickActive && controls.joystickX !== 0) {
      this.player.vx += controls.joystickX * accel * dt;
      this.player.facingLeft = controls.joystickX < 0;
      this.player.thrusting = true;
    } else if (controls.thrust) {
       this.player.vx += (this.player.facingLeft ? -accel : accel) * dt;
       this.player.thrusting = true;
    } else {
      this.player.thrusting = false;
      this.player.vx *= 0.95; // friction
    }

    if (controls.up || (controls.joystickActive && controls.joystickY < 0)) {
      this.player.vy -= accel * dt;
    } else if (controls.down || (controls.joystickActive && controls.joystickY > 0)) {
      this.player.vy += accel * dt;
    } else {
      this.player.vy *= 0.95;
    }

    // Sound effect
    if (this.player.thrusting && Math.random() < 0.1) {
      audio.playThrust();
    }

    // Limits
    if (this.player.vx > maxSpeedX) this.player.vx = maxSpeedX;
    if (this.player.vx < -maxSpeedX) this.player.vx = -maxSpeedX;
    if (this.player.vy > maxSpeedY) this.player.vy = maxSpeedY;
    if (this.player.vy < -maxSpeedY) this.player.vy = -maxSpeedY;

    // Position update
    this.player.x += this.player.vx * dt;
    this.player.y += this.player.vy * dt;

    // Edge wrapping X
    if (this.player.x < 0) this.player.x += this.worldWidth;
    if (this.player.x >= this.worldWidth) this.player.x -= this.worldWidth;

    // Bounds Y
    if (this.player.y < 30) this.player.y = 30;
    
    // Terrain collision
    const terrainY = this.getTerrainY(this.player.x);
    if (this.player.y > terrainY - this.player.radius) {
        if (this.player.invulnerableTimer <= 0) {
            this.die(); // Crash into mountains!
        } else {
            this.player.y = terrainY - this.player.radius; // bump up if invulnerable
            if (this.player.vy > 0) this.player.vy = 0;
        }
    }

    // Actions
    if (controls.fire && Date.now() - this.lastFireTime > 150) {
      this.fireLaser();
      this.lastFireTime = Date.now();
    }

    if (controls.smartBomb && this.smartBombs > 0) {
      this.useSmartBomb();
      controls.smartBomb = false; // Prevent multi-triggering easily without edge detection
    }

    if (controls.hyperspace) {
      this.hyperspace();
      controls.hyperspace = false;
    }
  }

  private fireLaser() {
    audio.playLaser();
    this.bullets.push({
      id: `bullet-${Date.now()}`,
      x: this.player.x + (this.player.facingLeft ? -20 : 20),
      y: this.player.y,
      vx: this.player.facingLeft ? -1200 : 1200,
      vy: 0,
      radius: 2,
      active: true,
      lifeTimer: 1.5,
      isPlayerBullet: true,
    });
  }

  private useSmartBomb() {
    this.smartBombs--;
    audio.playSmartBomb();
    
    // Create explosion at center of screen basically
    for(let i=0; i<50; i++) {
        this.createParticle(this.cameraX + 400, this.worldHeight/2, '#ffffff', 800, 2);
    }

    // Kill visible enemies
    this.enemies.forEach(e => {
        const dist = this.getWrappedDistance(this.player.x, this.player.y, e.x, e.y);
        if (dist < 500) {
            e.active = false;
            this.createExplosion(e.x, e.y, '#ff0000');
            this.score += 500;
        }
    });
  }

  private hyperspace() {
    this.player.x = Math.random() * this.worldWidth;
    this.player.y = 50 + Math.random() * (this.worldHeight - 150);
    this.player.vx = 0;
    this.player.vy = 0;
    
    audio.playExplosion();
    // 10% chance to die
    if (Math.random() < 0.1) {
        this.die();
    }
  }

  private updateEnemies(dt: number) {
    this.enemies.forEach(e => {
      e.x += e.vx * dt;
      e.y += e.vy * dt;

      if (e.x < 0) e.x += this.worldWidth;
      if (e.x >= this.worldWidth) e.x -= this.worldWidth;

      if (e.y < 30) e.y = 30;
      
      const terrainY = this.getTerrainY(e.x);
      if (e.y > terrainY - e.radius) {
          e.y = terrainY - e.radius;
          if (e.vy > 0) e.vy *= -0.5; // bounce slightly off terrain
      }

      // Basic wandering AI
      if (Math.random() < 0.05) {
        e.vx += (Math.random() - 0.5) * 50;
        e.vy += (Math.random() - 0.5) * 50;
      }

      // Max speeds
      if (e.vx > 150) e.vx = 150;
      if (e.vx < -150) e.vx = -150;

      e.fireTimer -= dt;
      if (e.fireTimer <= 0) {
        // Fire at player if close
        const dist = this.getWrappedDistance(e.x, e.y, this.player.x, this.player.y);
        if (dist < 600) {
            const angle = Math.atan2(this.player.y - e.y, this.getWrappedDx(e.x, this.player.x));
            this.bullets.push({
               id: `ebullet-${Math.random()}`,
               x: e.x, y: e.y,
               vx: Math.cos(angle) * 300,
               vy: Math.sin(angle) * 300,
               radius: 3,
               active: true,
               lifeTimer: 2.0,
               isPlayerBullet: false,
            });
            audio.playLaser(); // maybe a different sound for enemy
        }
        e.fireTimer = 2 + Math.random() * 3;
      }
    });

    this.enemies = this.enemies.filter(e => e.active);
  }

  private updateBullets(dt: number) {
    this.bullets.forEach(b => {
      b.x += b.vx * dt;
      b.y += b.vy * dt;
      b.lifeTimer -= dt;
      if (b.lifeTimer <= 0) b.active = false;

      if (b.x < 0) b.x += this.worldWidth;
      if (b.x >= this.worldWidth) b.x -= this.worldWidth;
    });
    this.bullets = this.bullets.filter(b => b.active);
  }

  private updateParticles(dt: number) {
    this.particles.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.lifeTimer -= dt;

      if (p.x < 0) p.x += this.worldWidth;
      if (p.x >= this.worldWidth) p.x -= this.worldWidth;
      if (p.lifeTimer <= 0) p.active = false;
    });
    this.particles = this.particles.filter(p => p.active);
  }

  private checkCollisions() {
    // Player bullets vs Enemies
    this.bullets.filter(b => b.isPlayerBullet).forEach(b => {
      this.enemies.forEach(e => {
        if (this.getWrappedDistance(b.x, b.y, e.x, e.y) < e.radius + b.radius) {
          e.active = false;
          b.active = false;
          this.createExplosion(e.x, e.y, '#00ffcc');
          this.score += 150;
          audio.playExplosion();
        }
      });
    });

    // Enemy bullets vs Player
    if (this.player.invulnerableTimer <= 0 && this.player.active) {
        this.bullets.filter(b => !b.isPlayerBullet).forEach(b => {
            if (this.getWrappedDistance(b.x, b.y, this.player.x, this.player.y) < this.player.radius + b.radius) {
                b.active = false;
                this.die();
            }
        });

        // Player vs Enemies
        this.enemies.forEach(e => {
            if (this.getWrappedDistance(this.player.x, this.player.y, e.x, e.y) < this.player.radius + e.radius) {
                this.die();
            }
        });
    }
  }

  private die() {
      this.player.active = false;
      this.createExplosion(this.player.x, this.player.y, '#ffffff');
      audio.playExplosion();
      this.lives--;

      if (this.lives > 0) {
          setTimeout(() => {
              this.player = this.createPlayer();
              this.player.x = this.cameraX + 400; // spawn in center of current view
          }, 2000);
      } else {
          setTimeout(() => {
            this.isGameOver = true;
          }, 2000);
      }
  }

  private createExplosion(x: number, y: number, color: string) {
    for (let i = 0; i < 20; i++) {
        this.createParticle(x, y, color, 150, 0.5 + Math.random());
    }
  }

  private createParticle(x: number, y: number, color: string, speedMax: number, life: number) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * speedMax;
      this.particles.push({
          id: `p-${Math.random()}`,
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: 1.5,
          active: true,
          color,
          lifeTimer: life,
          maxLife: life
      });
  }

  // Helper limits distance check for wraparound
  private getWrappedDistance(x1: number, y1: number, x2: number, y2: number) {
      const dx = this.getWrappedDx(x1, x2);
      const dy = y1 - y2;
      return Math.sqrt(dx*dx + dy*dy);
  }

  private getWrappedDx(x1: number, x2: number) {
      let dx = x1 - x2;
      if (Math.abs(dx) > this.worldWidth / 2) {
          if (dx > 0) dx -= this.worldWidth;
          else dx += this.worldWidth;
      }
      return dx;
  }

  public getTerrainY(x: number): number {
      const mountainBaseY = this.worldHeight - 50;
      const val = Math.sin(x * 0.005) * 50 + Math.sin(x * 0.01) * 20;
      return mountainBaseY - Math.abs(val);
  }

  // --- RENDERING ---
  public draw(ctx: CanvasRenderingContext2D, width: number, height: number) {
      ctx.fillStyle = '#050510';
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      // Camera transform conceptually. For wrapping, we just draw everything relative to cameraX
      // If an object is x, we draw at x - cameraX.
      // If x - cameraX < 0, it might be offscreen. But because of wrapping, we must also check (x - cameraX) + worldWidth
      
      this.drawStars(ctx, width, height);
      this.drawMountains(ctx, width, height);
      
      const drawWrapped = (obj: any, drawFn: (x: number, y: number) => void) => {
          let drawX = obj.x - this.cameraX;
          // Wrap screen drawing
          if (drawX < -this.worldWidth / 2) drawX += this.worldWidth;
          if (drawX > this.worldWidth / 2) drawX -= this.worldWidth;
          
          if (drawX > -200 && drawX < width + 200) {
              drawFn(drawX, obj.y);
          }
      };

      // Draw enemies
      this.enemies.forEach(e => {
          drawWrapped(e, (x, y) => {
              const LANDER_SPRITE = [
                "   GGGG   ",
                "  GGGGGG  ",
                " GGGGGGGG ",
                " GGGGGGGG ",
                " GG GG GG ",
                " G  GG  G ",
                "G   GG   G",
                "G   GG   G"
              ];
              const pSize = 3;
              const offX = -5 * pSize;
              const offY = -4 * pSize;

              ctx.fillStyle = '#00ff00';
              for (let r = 0; r < LANDER_SPRITE.length; r++) {
                  for (let c = 0; c < LANDER_SPRITE[r].length; c++) {
                      if (LANDER_SPRITE[r][c] === 'G') {
                          ctx.fillRect(x + offX + c * pSize, y + offY + r * pSize, pSize, pSize);
                      }
                  }
              }
          });
      });

      // Draw Bullets
      this.bullets.forEach(b => {
          drawWrapped(b, (x, y) => {
              ctx.fillStyle = b.isPlayerBullet ? '#00ffcc' : '#ff0055';
              ctx.fillRect(x - b.radius, y - b.radius, b.radius*2, b.radius*2);
              if (b.isPlayerBullet) { // laser line
                 ctx.strokeStyle = '#00ffcc';
                 ctx.beginPath();
                 ctx.moveTo(x - (b.vx>0?20:-20), y);
                 ctx.lineTo(x, y);
                 ctx.stroke();
              }
          });
      });

      // Draw Particles
      this.particles.forEach(p => {
          drawWrapped(p, (x, y) => {
              ctx.fillStyle = p.color;
              ctx.globalAlpha = p.lifeTimer / p.maxLife;
              ctx.fillRect(x, y, 2, 2);
              ctx.globalAlpha = 1.0;
          });
      });

      // Draw Player
      if (this.player.active && (this.player.invulnerableTimer <= 0 || Math.floor(Date.now() / 100) % 2 === 0)) {
          drawWrapped(this.player, (x, y) => {
              const SHIP_SPRITE = [
                "        G            ",
                "       GGG           ",
                "  B   GGGGG    W     ",
                "  B GGGGGGGGGWWWWWWW ",
                "    GGPPPPGGG        ",
                "      PPPP           "
              ];
              const SPRITE_COLORS: Record<string, string> = {
                'G': '#dddddd',
                'W': '#ffffff',
                'B': '#0000aa',
                'P': '#ff00ff',
              };

              ctx.save();
              ctx.translate(x, y);
              if (this.player.facingLeft) {
                  ctx.scale(-1, 1);
              }
              
              const pSize = 3;
              const offX = -10 * pSize; // shifted center to account for new width
              const offY = -3 * pSize;

              for (let r = 0; r < SHIP_SPRITE.length; r++) {
                  for (let c = 0; c < SHIP_SPRITE[r].length; c++) {
                      const char = SHIP_SPRITE[r][c];
                      if (SPRITE_COLORS[char]) {
                          ctx.fillStyle = SPRITE_COLORS[char];
                          ctx.fillRect(offX + c * pSize, offY + r * pSize, pSize, pSize);
                      }
                  }
              }

              if (this.player.thrusting) {
                  ctx.fillStyle = Math.random() > 0.5 ? '#ff0000' : '#ffff00';
                  ctx.fillRect(offX - 4 * pSize + Math.random() * pSize, offY + 3 * pSize, 4 * pSize, pSize);
                  ctx.fillStyle = Math.random() > 0.5 ? '#00ff00' : '#ffaa00';
                  ctx.fillRect(offX - 8 * pSize + Math.random() * pSize, offY + 3 * pSize, 4 * pSize, pSize);
              }

              ctx.restore();
          });
      }

      if (this.levelTransitionTimer > 0) {
          ctx.fillStyle = '#ff0055';
          ctx.font = 'bold 36px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`WAVE ${this.level} COMPLETED`, width / 2, height / 2 - 20);
          ctx.fillStyle = '#00ffcc';
          ctx.fillText(`PREPARE FOR WAVE ${this.level + 1}`, width / 2, height / 2 + 30);
          ctx.textAlign = 'left';
      }

      this.drawScanner(ctx, width);
  }

  private drawStars(ctx: CanvasRenderingContext2D, width: number, height: number) {
      // Very simple deterministic stars based on cameraX
      ctx.fillStyle = '#ffffff';
      for (let i = 0; i < 50; i++) {
         let sx = (i * 1234.5 - this.cameraX * 0.1) % width;
         if (sx < 0) sx += width;
         let sy = (i * 987.6) % height;
         ctx.fillRect(sx, sy, 1, 1);
      }
  }

  private drawMountains(ctx: CanvasRenderingContext2D, width: number, _height: number) {
      ctx.strokeStyle = '#ff00aa';
      ctx.lineWidth = 1;
      ctx.beginPath();
      
      for (let x = 0; x <= width; x += 10) {
          let mathX = (x + this.cameraX);
          let y = this.getTerrainY(mathX);
          ctx.lineTo(x, y);
      }
      ctx.stroke();
  }

  private drawScanner(ctx: CanvasRenderingContext2D, w: number) {
      const sw = 300;
      const sh = 40;
      const sx = w / 2 - sw / 2;
      const sy = 10;
      
      ctx.strokeStyle = '#00ffcc';
      ctx.strokeRect(sx, sy, sw, sh);

      // scanner scale = sw / worldWidth
      const scale_x = sw / this.worldWidth;
      
      // Draw camera viewport box
      let camSx = sx + this.cameraX * scale_x;
      let camSw = w * scale_x;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.strokeRect(camSx, sy, camSw, sh);
      // Ensure wrap box drawing
      if (this.cameraX + w > this.worldWidth) {
          ctx.strokeRect(sx, sy, (this.cameraX + w - this.worldWidth) * scale_x, sh);
      }

      const drawBlip = (x: number, color: string) => {
          ctx.fillStyle = color;
          ctx.fillRect(sx + x * scale_x, sy + sh/2, 2, 2);
      };

      this.enemies.forEach(e => drawBlip(e.x, '#ff0055'));
      if (this.player.active) drawBlip(this.player.x, '#00ffcc');
  }
}
