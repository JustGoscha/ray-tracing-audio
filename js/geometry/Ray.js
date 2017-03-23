import Point from './Point'
import {canvas} from '../canvas'
import {reflectionVector, normalize} from '../math/vector-math'
import colors from '../misc/colors'

function Ray(x,y,vector, maxChildren = 3){
  this.reset(x,y, vector)
  this.maxChildren = maxChildren;
}

Ray.prototype.reset = function(x,y,vector) {
  this.x = x;
  this.y = y;
  this.x1 = this.x + vector.x * 1000; 
  this.y1 = this.y + vector.y * 1000;
  this.vector = vector;
}

Ray.prototype.reflect = function(line, intersectionPoint) {
  const reflectedVector = reflectionVector(this.vector, normalize(line.vector))
  
  if (this.maxChildren > 0) {
    if(this.child) {
      const {x,y} = intersectionPoint
      this.child.reset(x, y, reflectedVector)
    } else {
      this.child = new Ray(intersectionPoint.x, intersectionPoint.y, reflectedVector, this.maxChildren-1)
    }
  }
}

Ray.prototype.draw = function(ctx, color = colors.ray) {
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  // to
  ctx.lineTo(this.x1,this.y1);
  // color
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  // draw it
  ctx.stroke();
  ctx.closePath();
  if (this.child) {
    this.child.draw(ctx, color)
  }
};

Ray.prototype.updatePosition = function(x,y){
  this.reset(x,y,this.vector)
};

export default Ray;