import player from './player'
import Ray from './geometry/Ray'
import Point from './geometry/Point'
import {numberOfRays, rayAngle, rayAngles} from './config.js'
import Scene from './scene'

var {primaryRays} = Scene;

function shootRaysFromPlayer(){
  for(var i = 0; i<numberOfRays; i++){
    var angle = rayAngles[i];
    var vector = new Point(Math.cos(angle), Math.sin(angle));
    var ray = new Ray(player.x, player.y, vector);
    Scene.primaryRays.push(ray);
  }
};

function updatePrimaryRays(){
  for(var ray of Scene.primaryRays){
    ray.updatePosition(player.x, player.y);
  }
};

console.log('shoot-rays.js');
shootRaysFromPlayer();

export {shootRaysFromPlayer, updatePrimaryRays}