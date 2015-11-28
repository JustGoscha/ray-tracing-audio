import drawFrame from './frame'

var recursiveAnim;

function startAnimationLoop(){
  var animFrame = window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame    ||
      window.oRequestAnimationFrame      ||
      window.msRequestAnimationFrame     ||
      null ;

  recursiveAnim = function() {
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