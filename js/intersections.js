import Scene from './scene'
import {dotProduct, subtract, reflectionVector, normalize} from './math/vector-math'
import Ray from './geometry/Ray'

/**
 * [rayLineIntersection description]
 * @param  {[type]} ray  [description]
 * @param  {[type]} line [description]
 * @return {Point}      returns point or null
 */
var intersectionsChecked=0;
setInterval(function(){
  console.log("Intersections checked: " + intersectionsChecked );
}, 3000);

function rayLineIntersection(ray, line){
  intersectionsChecked++;
  var e = ray.vector;
  var f = line.vector;
  var p = {x: -e.y, y: e.x};
  var q = {x: -f.y, y: f.x};
  var h = (dotProduct(subtract(ray, line), p))/dotProduct(f,p);
  var i = (dotProduct(subtract (line, ray), q))/dotProduct(e,q);
  if(i>0 && h>0 && h<1){
    return {
      rayPosition: i,
      x: ray.x + i*ray.vector.x, 
      y: ray.y + i*ray.vector.y
    };
  } else {
    return null;
  }
}

function reflectRay(ray, line, intersectionPoint) {
  const reflectedVector = reflectionVector(ray.vector, normalize(line.vector))
  return new Ray(intersectionPoint.x, intersectionPoint.y, reflectedVector)
}

function aabbIntersect(box, ray){
  var s,t = 0;
  s = (ray.x - box.x)/ray.vector.x;
  if(s<0) return false;
  t = s*ray.vector.y + ray.y;
  if (t>box.y2 || t<box.y) return false;
  // the same procedure for each side
  s = (ray.x - box.x2)/ray.vector.x;
  if(s<0) return false;
  t = s*ray.vector.y + ray.y;
  if (t>box.y2 || t<box.y) return false;

  s = (ray.y - box.y)/ray.vector.y;
  if(s<0) return false;
  t = s*ray.vector.x + ray.x;
  if (t>box.x2 || t<box.x) return false;

  s = (ray.y - box.y2)/ray.vector.y;
  if(s<0) return false;
  t = s*ray.vector.x + ray.x;
  if (t>box.x2 || t<box.x) return false;
}

function roughDistance(p1,p2){
  var a,b,dist = 0;
  a = p1.x-p2.x;
  b = p1.y-p2.y;
  dist = a*a+b*b;
  return dist;
}

function distanceBetween(p1, p2){
  var a,b,dist = 0;
  a = p1.x-p2.x;
  b = p1.y-p2.y;
  dist = Math.sqrt(a*a+b*b);
  return dist;
}

function checkRayLineIntersections(){
  intersectionsChecked = 0;
  Scene.intersections = []; // the nearest intersection
  Scene.hiddenIntersections = []; // all other intersections
  Scene._distances = [];

  var nearestIntersect;
  var nearestIntersectLine;
  var shortestDistance = Infinity;
  var distance = 0;

  for(var ray of Scene.primaryRays){
    shortestDistance = Infinity;
    nearestIntersect = null;
    nearestIntersectLine=null;

    for(var line of Scene.finishedLines){
      var intersectPoint = rayLineIntersection(ray, line);
      
      if(intersectPoint){
        distance = roughDistance(intersectPoint, ray);
        if(distance < shortestDistance){
          nearestIntersect = intersectPoint;
          nearestIntersectLine = line;
          shortestDistance = distance;
        } 
        Scene.hiddenIntersections.push(intersectPoint);
      }
    }

    if(nearestIntersect){
      Scene.intersections.push(nearestIntersect)
      ray.reflect(nearestIntersectLine, nearestIntersect)
      Scene._distances.push(distanceBetween(nearestIntersect, ray));
    } else {
      ray.child = undefined
      Scene._distances.push(10000);
    }
  }
};

export {checkRayLineIntersections};