function Point(x,y){
  this.x = x;
  this.y = y;
}

Point.prototype.set = function(x,y){
  this.x = x;
  this.y = y;
}

Point.prototype.scale = function(a) {
  this.x = this.x * a
  this.y = this.y * a
}

Point.prototype.add = function(p) {
  this.x += p.x
  this.y += p.y
}

export default Point;