class Ball extends Circle{
	constructor(x, y, radius){
		super(x, y, radius);
		this.vel = new Vector();
		this.speed = 300;
	}

	move(time){
		this.pos.x += this.vel.x * this.speed * time;
		this.pos.y += this.vel.y * this.speed * time;
	}
}