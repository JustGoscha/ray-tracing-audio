import {canvas, ctx} from './canvas'
import player from './player'
import colors from './misc/colors'

var Scene = {
  // objects in the scene
  primaryRays: [],
  finishedLines: [],
  intersections: [],
  lineBeingDrawn: null, 
  
  player: player,
  canvas: canvas,
  ctx: ctx
}

Scene.render = function(){
  drawPrimaryRays();
  drawFinishedLines();
  drawIntersections();
  drawLineBeingDrawn();
  player.draw();
}

function drawLineBeingDrawn(){
  if(Scene.lineBeingDrawn) Scene.lineBeingDrawn.draw(ctx);
};

function drawFinishedLines(){
  for(var line of Scene.finishedLines){
    line.draw(ctx);
  }
};

function drawPrimaryRays(){
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


export default Scene;