class Arena {
  constructor(canvas){
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.matrix;
  }

  clearCanvas(){
    this.ctx.fillStyle = '#222';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  createLevel(levelMatrix){
    const height = levelMatrix.length;
    const width = levelMatrix[0].length;
    const size = Math.round(canvas.width/width);
    const matrix = [];

    for(let y = 0; y < height; y++){
      matrix[y] = [];
      for(let x = 0; x < width; x++){
        if (levelMatrix[y][x] > 0) {
          matrix[y][x] =  new Block(x * size + 1, y * size/2 + 1, size - 2, size/2 - 2, levelMatrix[y][x]-1);
        }
        else {
          matrix[y][x] = 0;
        }
      }
    }
    return matrix;
  }

  draw(){
    this.clearCanvas();
    this.drawMatrix(this.matrix);
  }

  drawMatrix(matrix){
    matrix.forEach((row) => {
      row.forEach((block) => {
        if (block === 0) return;
        this.drawRect(block, block.color);
      })
    })
  }

  drawCircle(circle, color){
    this.ctx.fillStyle = color || '#fff';
    this.ctx.beginPath();
    this.ctx.arc(circle.pos.x, circle.pos.y, circle.radius, 0, Math.PI * 2, false);
    this.ctx.fill();
  }

  drawRect(rect, color) {
    this.ctx.fillStyle = color || '#fff';
    this.ctx.fillRect(rect.pos.x-rect.width/2, rect.pos.y-rect.height/2, rect.width, rect.height);
  }

  drawHealth(health) {
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '32px Ariel';
    this.ctx.fillText('health:'+health, 10, this.canvas.height- 10);
  }

  reset(level) {
    this.matrix = this.createLevel(level);
  }
}