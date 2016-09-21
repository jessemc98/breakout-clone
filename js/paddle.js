class Paddle extends Rect {
	constructor(x, y){
		super(60, 6);
		this.pos = {x, y}
		this.lives = 3;
	}
	move(x){
		this.pos.x = x;
	}
}