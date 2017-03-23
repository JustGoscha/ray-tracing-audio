const near = function(p1,p2,dist){
  if((Math.abs(p1.x-p2.x)<=dist) && (Math.abs(p1.y-p2.y)<=dist)) return true;
  else return false;
};

const dotProduct = function(a, b){
  return a.x * b.x + a.y * b.y;
}

const PI2 = Math.PI * 2
function vectorToAngle(p) {
  if (p.angle) return p.angle
  const asin = Math.asin(p.y)
  if (p.x < 0) {
    return Math.PI - asin
  } else {
    return asin < 0 ? PI2 + asin : asin
  }
}

function normalize(v) {
  const x = Math.sqrt(v.x*v.x + v.y*v.y)
  return {
    x: v.x/x,
    y: v.y/x
  }
}

function reflectionVector(v1, v2) {
  const angle1 = vectorToAngle(v1)
  const angle2 = vectorToAngle(v2) % Math.PI

  const reflectedAngle = (angle2 + (angle2 - angle1) + PI2) % PI2
  // const reflectedAngle = angle1 < angle2 ? 
  //   ((PI2 + angle2 - angle1)*2) % PI2 : 
  //   ((PI2 + angle1 - angle2)*2) % PI2
  return {
    x: Math.cos(reflectedAngle),
    y: Math.sin(reflectedAngle),
    angle: reflectedAngle
  }
}

function randomVectorGen(num) {
  num = num!==undefined ? num : Math.PI * 2 * Math.random()
  return {
    x: Math.cos(num),
    y: Math.sin(num),
    angle: num
  }
}

const subtract = function(a,b){
  return {x: a.x - b.x, y: a.y - b.y};
}

export {near, subtract, dotProduct, vectorToAngle, reflectionVector, normalize};