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

function distanceBetween(p1, p2){
  var a,b,dist = 0;
  a = p1.x-p2.x;
  b = p1.y-p2.y;
  dist = Math.sqrt(a*a+b*b);
  return dist;
}

/**
 * The  angle between two vectors if they would start
 * at the same point, from v1 counter-clockwise to v2
 * @param  {Point} v1 [description]
 * @param  {Point} v2 [description]
 * @return {number}    angle in radians
 */
function angleBetween(v1, v2) {
  return ((vectorToAngle(v2) - vectorToAngle(v1)) + PI2)%PI2
}

/**
 * Reflects a vector off another vector
 * @param  {Point} v1 [description]
 * @param  {Point} v2 [description]
 * @return {Point}    reflected vector
 */
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

/**
 * Reflects a vector off a circle
 * @param  {Point} v1 Vector to reflect
 * @param  {Circle} circle Circle to reflect off of
 * @param  {Point} intersectionPoint Point where the vector hits the circle
 * @return {Point} reflected vector
 */
function reflectOffCircle(v1, circle, intersectionPoint) {
  // Calculate the normal vector (from center to intersection point)
  const normal = {
    x: intersectionPoint.x - circle.center.x,
    y: intersectionPoint.y - circle.center.y
  }
  // Normalize the normal vector
  const normalLength = Math.sqrt(normal.x * normal.x + normal.y * normal.y)
  normal.x /= normalLength
  normal.y /= normalLength
  
  // Use the reflection formula: R = V - 2(V·N)N
  const dot = 2 * (v1.x * normal.x + v1.y * normal.y)
  return {
    x: v1.x - dot * normal.x,
    y: v1.y - dot * normal.y
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

export {
  near,
  subtract,
  dotProduct,
  vectorToAngle,
  reflectionVector,
  reflectOffCircle,
  normalize,
  distanceBetween,
  angleBetween,
}

