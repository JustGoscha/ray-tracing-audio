import Point from './Point'
import {ctx} from '../canvas'
import colors from '../misc/colors'

function Line(x,y,x1,y1, color = "#444"){
  this.x = x;
  this.y = y;
  this.x1 = x1;
  this.y1 = y1;

  this.vector = new Point(x1 - x, y1 - y);

  this.color = color;
  this.width = 2;
}

Line.prototype.draw = function() {
  // draw on canvas
  // line from
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  // to
  ctx.lineTo(this.x1,this.y1);
  // color
  ctx.strokeStyle = this.color;
  ctx.lineWidth = this.width;
  // draw it
  ctx.stroke();
  ctx.closePath();
};

Line.prototype.setPoint2 = function(x,y){
  this.x1 = x;
  this.y1 = y;
  this.vector.set(x - this.x, y-this.y);
}

Line.prototype.setPoint1 = function(x,y){
  this.x = x;
  this.y = y;
  this.vector.set(this.x - x1, this.y - y1);
}

export default Line;
