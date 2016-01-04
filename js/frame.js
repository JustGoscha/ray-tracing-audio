import {clearCanvas} from './canvas'
import player from './player'
import fps from './util/fps'
import {checkRayLineIntersections} from './intersections'
import Scene from './scene'
import {updatePlay} from './webaudio/test-sound'

/**
 * Main loop that executes each frame
 * 
 * @return void
 */
function drawFrame(){
  checkRayLineIntersections();
  clearCanvas();
  Scene.render();
  updatePlay();
  fps.drawFPS();
}

export default drawFrame;