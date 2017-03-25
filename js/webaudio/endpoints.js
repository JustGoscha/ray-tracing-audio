import {audioCtx} from './webaudio'
import {masterChannel} from './master'
import {numberOfRays, rayAngle, rayAngles, maxChildren} from '../config.js'

// 
// Create panners for each direction a sound should play from
// ... e.g. number of panners = numer of directions
// 

// listener position (in webaudio context) never changes
// even if the player is moving around only thing that changes is the orientation


function createPanner(angle){
  var panner = audioCtx.createPanner();
  var x = Math.cos(angle);
  var y = -Math.sin(angle); // convert right hand cartesion coordinate system to canvas system (invert y)
  panner.panningModel = "HRTF";
  panner.distanceModel = "linear";
  panner.refDistance = 1;
  panner.setPosition(x,0,y);
  panner.connect(masterChannel);
  return panner;
}

/**
 * The panners are the starting points of all the rays that are shot from the player.
 * The sounds are played from them, so they are the virtual speakers.
 * @type {Array}
 */
var panners = new Array(numberOfRays);
function createPanners(){
  for(var i = 0; i<panners.length; i++){
    panners[i] = createPanner(rayAngles[i]);
  }
}

createPanners();

export {panners}