class Block extends Rect {
	constructor(left, top, width, height, color){
		super(width, height);
		this.left = left;
		this.top = top;
		this.color = (color !== undefined) ? this.colors()[color] : this.colors()[Math.floor(Math.random() * this.colors().length ) + 1];
	}

	colors(){ 

		return [
	      '#FF3B55', '#9B1D0C', '#1B34A0', '#791A8E',
	      '#DAAE00', '#AEAEAE', '#4C25A2', '#DF8BFF',
	      '#D68800', '#FF7A8E', '#4BB0FF', '#FFA872',
	      '#2FAA00', '#4AAFFF', '#AB812C', '#81B900',
	      '#631F9B', '#AEAEAE', '#2CDE2F', '#4F3E20',
	      '#C0B610', '#747474', '#005353', '#631F9B',
	      '#437554', '#314300', '#9B1D0C', '#30D39F',
	      '#A11451', '#4BB0FF', '#4A4A4A', '#035000'];
	}
}