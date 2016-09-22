class BreakOut{
  constructor(canvas){
    this.state = 'pause';

    const arena = new Arena(canvas);
    this.arena = arena;
    const ball = new Ball(canvas.width/2, canvas.height/2, 5);
    const balls = [ball];
    const paddle = new Paddle(canvas.width/2, canvas.height - 50);

    //timing variables//
    let lastTime;
    let timeDiff = 0;
    const step = 1/240;

    let currLevel = 0;
    let levels;

    const draw = () => {
      arena.draw()
      balls.forEach((ball) => arena.drawCircle(ball, '#645CFF'));
      arena.drawRect(paddle);
      arena.drawHealth(paddle.lives);
    }

    const startGame = (dt) => {
      this.loadLevels('levels/levels.txt')
        .then((lvls) => {
          levels = lvls;
          resetGame(levels[0]);
          lastTime = dt;
          requestAnimationFrame(gameLoop);
        });
    }

    const resetGame = (level) => {
      resetBall();
      paddle.lives = 3;

      arena.reset(level);
      this.state = 'pause';
    }

    const resetBall = () => {
      ball.vel = new Vector();
      ballToPaddle();
      this.state = 'pause';
      canvas.addEventListener('click', startBall);
      canvas.addEventListener('mousemove', ballToPaddle);
    }

    const ballToPaddle = () => {
      ball.pos.x = paddle.pos.x;
      ball.pos.y = paddle.top - ball.radius;
    }

    const startBall = () => {
      ball.vel.y = -0.8;
      this.state = 'play';
      canvas.removeEventListener('mousemove', ballToPaddle);
      canvas.removeEventListener('click', startBall);
    }

    const gameLoop = (dt) => {
      timeDiff += dt-lastTime;
      lastTime = dt;

      while(timeDiff > step*1000){
        update(step);
        timeDiff -= step*1000;
      }

      draw();
      requestAnimationFrame(gameLoop);
    }

    const update = (time) => {
      balls.forEach((ball) => {
        ball.move(time);
        // check if ball collides with bottom //
        if (ball.pos.y + ball.radius > canvas.height){
          if (paddle.lives <= 0){
            return resetGame(levels[0]);
          }
          resetBall();
          paddle.lives --;
          console.log(paddle.lives);
        }

        // check if ball collides with top or sides //
        if (ball.pos.x - ball.radius < 0 ||
            ball.pos.x + ball.radius > canvas.width){
          ball.move(-time);
          ball.vel.x = -ball.vel.x;
        }
        if (ball.pos.y - ball.radius < 0){
          ball.move(-time);
          ball.vel.y = -ball.vel.y;
        }

        // check if ball collides paddle //
        if (ball.collidesRect(paddle)){
          // ball.move(-time);
          // set x velocity relative to where it hit on paddle //
          let relX = Math.abs(ball.pos.distTo({x: paddle.pos.x, y: paddle.top})/(paddle.width/2));
          ball.vel.y = -Math.abs(ball.vel.y);
          ball.vel.x = (ball.pos.x < paddle.pos.x)? -0.8*relX: 0.8*relX;
          ball.vel.normalize();
        }

        // check if ball collides with a block //
        // if no blocks to collide you win //
        let done = true;
        arena.matrix.forEach((row, y) => {
          row.forEach((block, x) => {
            if (block === 0) return;

            done = false;
            this.collide(block, ball, () => {
              if(block.health > 0){
                return block.health -= 1;
              }
              arena.matrix[y][x] = 0;
            });
          });
        });

        if(done){
          currLevel ++;
          paddle.lives ++;
          resetGame(levels[currLevel]);
        }
      });
    }

    // setup paddle movement //
    canvas.addEventListener('mousemove', (e) => paddle.move(canvas.width * (e.offsetX / e.target.getBoundingClientRect().width)));
    
    // start gameloop //
    requestAnimationFrame(startGame);
  }

  collide(block, ball, callback){
    // check if ball is close to block //
    if(ball.pos.distTo(block) > block.width){
      return;
    }

    const topBottom = new Rect(block.width, 
                               block.height + (2 * ball.radius), 
                               block.pos);
    const leftRight = new Rect(block.width + (2 * ball.radius),
                               block.height,
                               block.pos);
    const corners = block.corners;

    function pointInRect(point, rect){
      return point.y < rect.bottom &&
             point.y > rect.top &&
             point.x > rect.left && 
             point.x < rect.right;
    } 

    // check if ball collides block top or bottom //
    if(pointInRect(ball.pos, topBottom)){
      callback();
      return ball.vel.y = -ball.vel.y;
    }

    // check if ball collides block left or right //
    if(pointInRect(ball.pos, leftRight)){
      callback();
      return ball.vel.x = -ball.vel.x;
    }

    // check if ball collides with block corners //
    for(let i = 3; i >= 0; i--){
      if(corners[1].distTo(ball.pos) < ball.radius){
        callback();
        return ball.vel.flip();
      }
    }
  }

  createMatrix(width, height){
    const matrix = [];
    const size = canvas.width/width;
    for(let y = 0; y < height; y++){
      matrix[y] = [];
      for(let x = 0; x < width; x++){
        matrix[y][x] = 1;
      }
    }
    return matrix;
  }

  loadLevels(url){
    return fetch(url)
      .then((response) => response.text())
      .then((text) => {
        let newArray = [];
        let oldArray = text.split('\n');
        let nextIndex = oldArray.indexOf("");
        while (nextIndex > -1 ) {
          newArray.push(oldArray.slice(0, nextIndex));
          oldArray = oldArray.slice(nextIndex+1);
          nextIndex = oldArray.indexOf("");
        }
        return newArray;
      });
  }

}