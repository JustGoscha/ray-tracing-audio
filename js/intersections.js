import Scene from './scene'
import {dotProduct, subtract} from './math/vector-math'

/**
 * [rayLineIntersection description]
 * @param  {[type]} ray  [description]
 * @param  {[type]} line [description]
 * @return {Point}      returns point or null
 */
function rayLineIntersection(ray, line){
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
};

function checkRayLineIntersections(){
  Scene.intersections = [];
  for(var ray of Scene.primaryRays){
    for(var line of Scene.finishedLines){
      var intersectPoint = rayLineIntersection(ray, line);
      if(intersectPoint){
        Scene.intersections.push(intersectPoint);
      }
    }
  }
};

export {checkRayLineIntersections};