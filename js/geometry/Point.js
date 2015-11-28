function Point(x,y){
  this.x = x;
  this.y = y;
}

Point.prototype.set = function(x,y){
  this.x = x;
  this.y = y;
}

export default Point;