import Scene from './scene'
import {
  dotProduct, 
  subtract, 
  reflectionVector, 
  normalize, 
  distanceBetween,
} from './math/vector-math'
import Ray from './geometry/Ray'
import Circle from './geometry/Circle';
import Line from './geometry/Line';

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
  // Vector from circle center to ray start
  const centerToRay = {
    x: ray.start.x - circle.center.x,
    y: ray.start.y - circle.center.y
  };

  // Quadratic equation coefficients
  // at² + bt + c = 0
  const a = dotProduct(ray.vector, ray.vector);
  const b = 2 * dotProduct(ray.vector, centerToRay);
  const c = dotProduct(centerToRay, centerToRay) - (circle.radius * circle.radius);

  // Calculate discriminant
  const discriminant = b * b - 4 * a * c;

  // No intersection if discriminant is negative
  if (discriminant < 0) {
    return null;
  }

  // Calculate intersection points
  const t1 = (-b - Math.sqrt(discriminant)) / (2 * a);
  const t2 = (-b + Math.sqrt(discriminant)) / (2 * a);

  // We only want intersections in the positive direction of the ray
  let t = t1;
  if (t < 0) {
    t = t2;
    if (t < 0) {
      return null;  // Both intersections behind the ray
    }
  }

  // Return the intersection point
  return {
    rayPosition: t,
    x: ray.start.x + t * ray.vector.x,
    y: ray.start.y + t * ray.vector.y
  };
}

function reflectRayFromLine(ray, line, intersectionPoint) {
  const reflectedVector = reflectionVector(ray.vector, normalize(line.vector))
  return new Ray(intersectionPoint, reflectedVector)
}

function reflectRayFromCircle(ray, circle, intersectionPoint) {
  const reflectedVector = reflectionVector(ray.vector, normalize(circle.center.subtract(intersectionPoint)))
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



/**
 * Creates a reducer function that finds the nearest intersection point between a ray and scene lines
 * 
 * @param {Ray} ray - The ray to check intersections for
 * @returns {Function} A reducer function that takes the current state and a line to check
 * @returns {Object} The reducer returns an object containing:
 *   - shortestDistance: Distance to nearest intersection
 *   - nearestIntersect: Nearest intersection point found
 *   - nearestIntersectGeometry: Geometry that created the nearest intersection
 */
const rayIntersectReducer = (ray) => (
  ({shortestDistance, nearestIntersect, nearestIntersectGeometry}, intersectable) => {
    if (ray.touchedGeometry === intersectable) {
      return {shortestDistance, nearestIntersect, nearestIntersectGeometry}
    } 
    let intersectPoint = null;
    if (intersectable instanceof Circle) {
      intersectPoint = rayCircleIntersection(ray, intersectable)
    } else if (intersectable instanceof Line) {
      intersectPoint = rayLineIntersection(ray, intersectable)
    } else {
      console.error('Unknown intersectable type')
      return { shortestDistance, nearestIntersect, nearestIntersectGeometry }
    }

    if (intersectPoint) {
      const distance = roughDistance(intersectPoint, ray)
      if(distance < shortestDistance){
        nearestIntersect = intersectPoint
        nearestIntersectGeometry = intersectable
        shortestDistance = distance
      } 
      Scene.hiddenIntersections.push(intersectPoint)
    }
    
    return {shortestDistance, nearestIntersect, nearestIntersectGeometry}
  }
)

function rayMapper(ray) {

  let rayMeta = [...Scene.finishedLines, ...Scene.circles].reduce(
    rayIntersectReducer(ray), 
    {
      shortestDistance: Infinity, 
      nearestIntersect: null, 
      nearestIntersectGeometry: null
    }
  )


  if (rayMeta.nearestIntersect) {
    ray.reflect(rayMeta.nearestIntersectGeometry, rayMeta.nearestIntersect)
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

function checkSceneIntersections(){
  intersectionsChecked = 0;
  Scene.intersections = []; // the nearest intersection
  Scene.hiddenIntersections = []; // all other intersections
  Scene._distances = [];

  Scene.primaryRays.map(rayMapper)
  .forEach(forEachMappedRay)
}

export {checkSceneIntersections};