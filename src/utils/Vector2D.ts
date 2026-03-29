export class Vector2D {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(v: Vector2D | {x: number, y: number}): Vector2D {
    return new Vector2D(this.x + v.x, this.y + v.y);
  }

  sub(v: Vector2D | {x: number, y: number}): Vector2D {
    return new Vector2D(this.x - v.x, this.y - v.y);
  }

  mult(n: number): Vector2D {
    return new Vector2D(this.x * n, this.y * n);
  }

  div(n: number): Vector2D {
    return new Vector2D(this.x / n, this.y / n);
  }

  mag(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize(): Vector2D {
    const m = this.mag();
    if (m !== 0) {
      return this.div(m);
    }
    return new Vector2D(0, 0);
  }

  limit(max: number): Vector2D {
    if (this.mag() > max) {
      return this.normalize().mult(max);
    }
    return new Vector2D(this.x, this.y);
  }

  distance(v: Vector2D | {x: number, y: number}): number {
    const dx = this.x - v.x;
    const dy = this.y - v.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  static distanceSquare(x1: number, y1: number, x2: number, y2: number): number {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return dx * dx + dy * dy;
  }

  heading(): number {
    return Math.atan2(this.y, this.x);
  }
}
