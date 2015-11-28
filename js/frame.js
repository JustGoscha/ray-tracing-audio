import {clearCanvas} from './canvas'
import player from './player'
import fps from './util/fps'
import {checkRayLineIntersections} from './intersections'
import Scene from './scene'

/**
 * Main loop that executes each frame
 * 
 * @return void
 */
function drawFrame(){
  checkRayLineIntersections();
  clearCanvas();
  Scene.render();
  fps.drawFPS();
}

export default drawFrame;