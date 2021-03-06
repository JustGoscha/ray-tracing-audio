import Scene from './scene'
import {
  dotProduct, 
  subtract, 
  reflectionVector, 
  normalize, 
  distanceBetween,
} from './math/vector-math'
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

function rayCircleIntersection(ray, circle) {
  // Schnittpunkt mit einem Kreis ist nur der 
  // Schnittpunkt mit einer einer Linie der 
  // Länge r die im Zentrum des Kreises startet
  // 
  // Also hat man eine Menge an Linien
  // und sucht nach einer Lösung für die Gleichung
  // 
  // unbekannt ist hierbei die Richtung der Linie
  // 
  // um rauszufinden ob der Kreis überhaupt 
  // geschnitten wird, muss man die orthogonale
  // vom Mittelpunkt zur Linie herausfinden.
  // Ist diese kleiner als der Radius, gibt es zwei
  // Schnittpunkte
  // 
  const centerToRayVector = new Point(
    ray.start.x - circle.center.x, 
    ray.start.y - circle.center.y
  )

  const checkAngle = angleBetween(centerToRayVector, ray.vector)

  if (checkAngle < Math.PI || checkAngle > 1.5 * Math.PI) {
    // no chance...
    return null
  }

  const angle = Math.abs(Math.PI - checkAngle)
  const distance = distanceBetween(circle.center, ray.start)
  // if (checkAngle < Math.PI) {
  //   angle = Math.PI - checkAngle
  // } else {
  //   angle = checkAngle - Math.PI
  // }
}

function reflectRay(ray, line, intersectionPoint) {
  const reflectedVector = reflectionVector(ray.vector, normalize(line.vector))
  return new Ray(intersectionPoint, reflectedVector)
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



const rayIntersectReducer = (ray) => (
  ({shortestDistance, nearestIntersect, nearestIntersectLine}, line) => {
    if (ray.touchedLine !== line) {
      const intersectPoint = rayLineIntersection(ray, line)
      if (intersectPoint) {
        const distance = roughDistance(intersectPoint, ray)
        if(distance < shortestDistance){
          nearestIntersect = intersectPoint
          nearestIntersectLine = line
          shortestDistance = distance
        } 
        Scene.hiddenIntersections.push(intersectPoint)
      }
    }
    return {shortestDistance, nearestIntersect, nearestIntersectLine}
  }
)

function rayMapper(ray) {
  let rayMeta = Scene.finishedLines.reduce(
    rayIntersectReducer(ray), 
    {shortestDistance: Infinity, nearestIntersect: null, nearestIntersectLine: null}
  )
  if (rayMeta.nearestIntersect) {
    ray.reflect(rayMeta.nearestIntersectLine, rayMeta.nearestIntersect)
    if (ray.child && ray.maxChildren > 0) {
      // some dangerous recursive shit...
      forEachMappedRay(rayMapper(ray.child))
    }
  }
  return { ray, 
    shortestDistance: rayMeta.shortestDistance,
    nearestIntersect: rayMeta.nearestIntersect,
    nearestIntersectLine: rayMeta.nearestIntersectLine
  }
}

const forEachMappedRay =({ray, shortestDistance, nearestIntersect, nearestIntersectLine}) => {
  if (nearestIntersect) {
    Scene.intersections.push(nearestIntersect)
    Scene._distances.push(distanceBetween(nearestIntersect, ray));
  } else {
    Scene._distances.push(10000)
    ray.child = undefined
  }
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

  Scene.primaryRays.map(rayMapper)
  .forEach(forEachMappedRay)

  // for(var ray of Scene.primaryRays){
  //   shortestDistance = Infinity;
  //   nearestIntersect = null;
  //   nearestIntersectLine=null;

  //   for(var line of Scene.finishedLines){
  //     var intersectPoint = rayLineIntersection(ray, line);
      
  //     if(intersectPoint){
  //       distance = roughDistance(intersectPoint, ray);
  //       if(distance < shortestDistance){
  //         nearestIntersect = intersectPoint;
  //         nearestIntersectLine = line;
  //         shortestDistance = distance;
  //       } 
  //       Scene.hiddenIntersections.push(intersectPoint);
  //     }
  //   }

  //   if(nearestIntersect){
  //     Scene.intersections.push(nearestIntersect)
  //     ray.reflect(nearestIntersectLine, nearestIntersect)
  //     Scene._distances.push(distanceBetween(nearestIntersect, ray));
  //   } else {
  //     ray.child = undefined
  //     Scene._distances.push(10000);
  //   }
  // }
};

export {checkRayLineIntersections};