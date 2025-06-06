import {canvas, ctx} from './canvas'
import player from './player'
import colors from './misc/colors'

var Scene = {
  // objects in the scene
  primaryRays: [],
  circles: [],
  finishedLines: [],
  
  _distances: [],
  intersections: [],
  hiddenIntersections: [],
  lineBeingDrawn: null,
  circleBeingDrawn: null, 
  
  player: player,
  canvas: canvas,
  ctx: ctx
}

Scene.render = function(){
  drawRays();
  drawFinishedLines();
  drawHiddenIntersections();
  drawIntersections();
  drawLineBeingDrawn();
  if (Scene.circleBeingDrawn) Scene.circleBeingDrawn.draw(this.ctx) 
  this.circles.forEach(circle => circle.draw(this.ctx))
  this.player.draw();
}

function drawLineBeingDrawn(){
  if(Scene.lineBeingDrawn) Scene.lineBeingDrawn.draw(ctx);
};

function drawFinishedLines(){
  for(var line of Scene.finishedLines){
    line.draw(ctx);
  }
};

function drawRays(){
  for(var ray of Scene.primaryRays){
    ray.draw(ctx);
  }
};

function drawIntersections(){
  ctx.fillStyle = colors.red;
  for(var point of Scene.intersections){
    ctx.fillRect(point.x-5, point.y-5, 10, 10);
  }
}; 

function drawHiddenIntersections(){
  ctx.fillStyle = colors.lightRed;
  for(var point of Scene.hiddenIntersections){
    ctx.fillRect(point.x-5, point.y-5, 10, 10);
  }
}; 


export default Scene;