class Vector {
  constructor(x=0, y=0) {
    this.x = x;
    this.y = y;
  }

  distTo(vect) {
    return Math.sqrt(Math.pow((this.x-vect.x), 2) + Math.pow((this.y-vect.y), 2));
  }

  normalize() {
    const total = Math.abs(this.x) + Math.abs(this.y);
    this.x = this.x/total;
    this.y = this.y/total;
  }

  flip() {
    [this.x, this.y] = [this.y, -this.x];
  }
}

class Rect {
  constructor(width=0, height=0, pos=new Vector){
  this.pos = pos;
  this.width = width;
  this.height = height;
  }

  get left() {
    return this.pos.x - this.width/2;
  }

  set left(val) {
    this.pos.x = val+this.width/2
  }

  get right() {
    return this.pos.x + this.width/2;
  }

  set right(val) {
    this.pos.x = val - this.width/2
  }

  get top() {
    return this.pos.y - this.height/2;
  }

  set top(val) {
    this.pos.y = val + this.height/2;
  }

  get bottom() {
    return this.pos.y + this.height/2;
  }

  set bottom(val) {
    this.pos.y = val - this.height/2;
  }

  get corners() {
    return [
      new Vector(this.left, this.top),
      new Vector(this.right, this.top),
      new Vector(this.right, this.bottom),
      new Vector(this.left, this.bottom)
    ];
  }
}

class Circle {
  constructor(x, y, radius){
    this.pos = new Vector(x, y);
    this.radius = radius;
  }

  collidesRect(rect){
    const closestX = Math.max(rect.left, Math.min(this.pos.x, rect.right));
    const closestY = Math.max(rect.top, Math.min(this.pos.y, rect.bottom));

    const distanceX = this.pos.x - closestX;
    const distanceY = this.pos.y - closestY;

    var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
    return distanceSquared < (this.radius * this.radius); 
  }
  collidesCircle(circle){
    const distance = this.pos.distTo(circle.pos);
    return distance <= this.radius + circle.radius;
  }
}
