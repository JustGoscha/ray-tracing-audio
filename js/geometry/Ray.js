import Point from './Point'
import {canvas, ctx} from '../canvas'
import colors from '../misc/colors'

function Ray(x,y,vector){
  this.x = x;
  this.y = y;
  this.x1 = this.x + vector.x * canvas.width; 
  this.y1 = this.y + vector.y * canvas.height;
  this.vector = vector;
}

Ray.prototype.draw = function() {
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  // to
  ctx.lineTo(this.x1,this.y1);
  // color
  ctx.strokeStyle = colors.ray;
  ctx.lineWidth = 2;
  // draw it
  ctx.stroke();
  ctx.closePath();
};

Ray.prototype.updatePosition = function(x,y){
  this.x = x;
  this.y = y;
  this.x1 = x + this.vector.x * canvas.width; 
  this.y1 = y + this.vector.y * canvas.height;
};

export default Ray;