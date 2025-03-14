import drawFrame from './frame'
import {updatePlayerMovement} from './interaction'

var recursiveAnim;

function startAnimationLoop(){
  var animFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      null ;

  recursiveAnim = function() {
    updatePlayerMovement();
    drawFrame();
    animFrame( recursiveAnim );
  };
  animFrame(recursiveAnim);
  console.log("Starting animation.")
}

function stopAnimationLoop(){
  recursiveAnim = function(){
    console.log("Stopping animation!");
  }
}

export {startAnimationLoop, stopAnimationLoop};