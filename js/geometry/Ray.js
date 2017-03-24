import Point from './Point'
import {canvas} from '../canvas'
import {reflectionVector, normalize} from '../math/vector-math'
import colors from '../misc/colors'
import * as config from '../config'

function Ray(x,y,vector, maxChildren = config.maxChildren, touchedLine){
  this.reset(x,y, vector)
  this.maxChildren = maxChildren;
  this.touchedLine = touchedLine
}

Ray.prototype.reset = function(x,y,vector,length = 1000, touchedLine) {
  this.x = x;
  this.y = y;
  this.x1 = this.x + vector.x * length; 
  this.y1 = this.y + vector.y * length;
  this.vector = vector;
  this.touchedLine = touchedLine
}

Ray.prototype.reflect = function(line, intersectionPoint) {
  const reflectedVector = reflectionVector(this.vector, normalize(line.vector))
  this.reset(this.x, this.y, this.vector, intersectionPoint.rayPosition)
  
  if (this.maxChildren > 0) {
    if(this.child) {
      const {x,y} = intersectionPoint
      this.child.reset(x, y, reflectedVector, undefined, line)
    } else {
      this.child = new Ray(intersectionPoint.x, intersectionPoint.y, reflectedVector, this.maxChildren-1, line)
    }
  }
}

Ray.prototype.draw = function(ctx, color = colors.ray) {
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  // to
  ctx.lineTo(this.x1,this.y1);
  // color
  ctx.strokeStyle = `rgba(${200 - 30*this.maxChildren},20,30,${0.15*this.maxChildren})`
  ctx.lineWidth = 1;
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