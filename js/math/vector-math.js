var near = function(p1,p2,dist){
  if((Math.abs(p1.x-p2.x)<=dist) && (Math.abs(p1.y-p2.y)<=dist)) return true;
  else return false;
};

var dotProduct = function(a, b){
  return a.x * b.x + a.y * b.y;
};

var subtract = function(a,b){
  return {x: a.x - b.x, y: a.y - b.y};
}

export {near, subtract, dotProduct};