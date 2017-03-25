import player from './player'
import Ray from './geometry/Ray'
import Point from './geometry/Point'
import {numberOfRays, rayAngle, rayAngles} from './config.js'
import Scene from './scene'

var {primaryRays} = Scene

function shootRaysFromPlayer(){
  Scene.primaryRays = rayAngles.map(angle => {
    const vector = new Point(Math.cos(angle), Math.sin(angle))
    return new Ray(player.position, vector)
  })
}

function updatePrimaryRays(){
  Scene.primaryRays.forEach(ray => 
    ray.updatePosition(player.position)
  )
}

console.log('shoot-rays.js')
shootRaysFromPlayer()

export {shootRaysFromPlayer, updatePrimaryRays}